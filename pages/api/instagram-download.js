import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";

// Rate limiting configuration
const rateLimitStore = new Map();
const RATE_LIMITS = {
  info: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 15,
    message: "Too many info requests",
  },
  download: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 8,
    message: "Too many download requests",
  },
};

// Cleanup interval
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    const maxWindow = Math.max(
      ...Object.values(RATE_LIMITS).map((limit) => limit.windowMs)
    );
    if (now - data.lastRequest > maxWindow * 2) {
      rateLimitStore.delete(key);
    }
  }
}, 30 * 1000);

function checkRateLimit(ip, type = "download") {
  const now = Date.now();
  const limit = RATE_LIMITS[type];
  const key = `${ip}:${type}`;

  let userData = rateLimitStore.get(key);
  if (!userData) {
    userData = {
      requests: [],
      lastRequest: now,
    };
    rateLimitStore.set(key, userData);
  }

  userData.requests = userData.requests.filter(
    (timestamp) => now - timestamp < limit.windowMs
  );

  if (userData.requests.length >= limit.maxRequests) {
    const oldestRequest = Math.min(...userData.requests);
    const resetTime = oldestRequest + limit.windowMs;
    const waitTimeSeconds = Math.ceil((resetTime - now) / 1000);

    return {
      allowed: false,
      resetTime,
      waitTimeSeconds,
      message: limit.message,
    };
  }

  userData.requests.push(now);
  userData.lastRequest = now;

  return { allowed: true };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const clientIP =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    "unknown";

  const requestType = req.body.getInfo ? "info" : "download";
  const rateLimitResult = checkRateLimit(clientIP, requestType);

  if (!rateLimitResult.allowed) {
    return res.status(429).json({
      success: false,
      message: rateLimitResult.message,
      retryAfter: rateLimitResult.waitTimeSeconds,
      details: `Please wait ${rateLimitResult.waitTimeSeconds} seconds before trying again.`,
    });
  }

  const { url, quality = "best", getInfo = false } = req.body;

  if (!url) {
    return res.status(400).json({ message: "Instagram URL is required" });
  }

  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes("instagram.com")) {
      return res.status(400).json({ message: "Invalid Instagram URL" });
    }
  } catch (error) {
    return res.status(400).json({ message: "Invalid URL format" });
  }

  // Check if this is a reel URL
  const isReel = url.includes("/reel/");

  if (getInfo) {
    return getMediaInfo(url, res);
  }

  // For reels, always download with best quality (no quality selection needed)
  if (isReel) {
    return downloadMedia(url, "best", res);
  }

  // For regular posts, validate quality parameter
  if (!["best", "worst"].includes(quality)) {
    return res
      .status(400)
      .json({ message: 'Invalid quality parameter. Use "best" or "worst"' });
  }

  return downloadMedia(url, quality, res);
}

/**
 * Get media information using instaloader
 */
async function getMediaInfo(url, res) {
  try {
    console.log("Getting media info for:", url);
    const cleanUrl = url.split("?")[0];
    console.log("Using clean URL:", cleanUrl);

    // Extract shortcode from URL (supports both /p/ and /reel/)
    const shortcodeMatch = cleanUrl.match(/\/(?:p|reel)\/([^\/]+)/);
    if (!shortcodeMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Instagram post URL format",
      });
    }

    const shortcode = shortcodeMatch[1];
    console.log("Extracted shortcode:", shortcode);

    const result = await getInstaloaderInfo(shortcode);

    if (result.success) {
      console.log("Successfully retrieved media info");
      return res.status(200).json(result.data);
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to access Instagram content. The post may be private, deleted, or Instagram is temporarily blocking requests.",
      error: result.error,
      suggestion:
        "Please ensure:\n1. The post is public\n2. The URL is correct\n3. Try again in a few minutes if rate-limited",
    });
  } catch (error) {
    console.error("Error in getMediaInfo:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

/**
 * Download media using instaloader
 */
async function downloadMedia(url, quality, res) {
  try {
    console.log("Downloading media:", url, "quality:", quality);
    const cleanUrl = url.split("?")[0];

    // Extract shortcode from URL (supports both /p/ and /reel/)
    const shortcodeMatch = cleanUrl.match(/\/(?:p|reel)\/([^\/]+)/);
    if (!shortcodeMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Instagram post URL format",
      });
    }

    const shortcode = shortcodeMatch[1];
    console.log("Extracted shortcode:", shortcode);

    const result = await downloadWithInstaloader(shortcode, res);

    if (!result.success && !res.headersSent) {
      return res.status(500).json({
        success: false,
        message:
          "Unable to download from Instagram. The content may be restricted.",
        error: result.error,
        suggestion: "Please try again later or use Instagram's official app.",
      });
    }
  } catch (error) {
    console.error("Error in downloadMedia:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

/**
 * Get Instagram post info using instaloader
 */
async function getInstaloaderInfo(shortcode) {
  return new Promise((resolve) => {
    const tempDir = `/tmp/instaloader_${shortcode}_${Date.now()}`;

    const args = [
      "-m",
      "instaloader",
      "--no-video-thumbnails",
      "--no-metadata-json",
      "--no-captions",
      "--no-compress-json",
      "--dirname-pattern",
      tempDir,
      "--filename-pattern",
      "{shortcode}",
      "--",
      `-${shortcode}`, // Download post by shortcode
    ];

    console.log("Running instaloader with args:", args.join(" "));

    const instaloaderProcess = spawn("python3", args, {
      cwd: path.join(process.cwd(), "scripts"),
      env: {
        ...process.env,
        PATH: `${path.join(process.cwd(), "scripts", "venv", "bin")}:${
          process.env.PATH
        }`,
        VIRTUAL_ENV: path.join(process.cwd(), "scripts", "venv"),
        PYTHONPATH: path.join(process.cwd(), "scripts", "venv", "lib"),
      },
    });

    let stdout = "";
    let stderr = "";

    instaloaderProcess.stdout.on("data", (data) => {
      stdout += data.toString();
      console.log("instaloader stdout:", data.toString());
    });

    instaloaderProcess.stderr.on("data", (data) => {
      stderr += data.toString();
      console.log("instaloader stderr:", data.toString());
    });

    const timeout = setTimeout(() => {
      instaloaderProcess.kill("SIGTERM");
      resolve({ success: false, error: "Request timeout" });
    }, 30000); // 30 second timeout

    instaloaderProcess.on("close", async (code) => {
      clearTimeout(timeout);

      try {
        // Check if files were downloaded
        if (existsSync(tempDir)) {
          const files = await fs.readdir(tempDir);
          console.log("Downloaded files:", files);

          // Find all media files
          const mediaFiles = files.filter(
            (f) =>
              f.endsWith(".jpg") || f.endsWith(".mp4") || f.endsWith(".png")
          );

          if (mediaFiles.length > 0) {
            // Sort files to ensure correct order
            mediaFiles.sort();

            const hasVideo = mediaFiles.some((f) => f.endsWith(".mp4"));
            const hasPhoto = mediaFiles.some(
              (f) => f.endsWith(".jpg") || f.endsWith(".png")
            );

            // Calculate total size
            let totalSize = 0;
            for (const file of mediaFiles) {
              const filePath = path.join(tempDir, file);
              const stats = await fs.stat(filePath);
              totalSize += stats.size;
            }

            // Cleanup temp dir after getting info
            await fs.rm(tempDir, { recursive: true, force: true });

            resolve({
              success: true,
              data: {
                success: true,
                shortcode,
                isPhoto: hasPhoto && !hasVideo, // Only photos, no videos
                isVideo: hasVideo, // Has at least one video
                isCarousel: mediaFiles.length > 1, // Multiple files = carousel
                mediaCount: mediaFiles.length,
                fileSize: totalSize,
                files: mediaFiles,
              },
            });
          } else {
            // Cleanup temp dir
            await fs.rm(tempDir, { recursive: true, force: true });
            resolve({
              success: false,
              error: "No media file found in download",
            });
          }
        } else {
          resolve({
            success: false,
            error: stderr || "Download failed - no output directory",
          });
        }
      } catch (error) {
        console.error("Error processing instaloader output:", error);
        resolve({ success: false, error: error.message });
      }
    });

    instaloaderProcess.on("error", (error) => {
      clearTimeout(timeout);
      console.error("instaloader process error:", error);
      resolve({ success: false, error: error.message });
    });
  });
}

/**
 * Download Instagram post using instaloader and stream to response
 */
async function downloadWithInstaloader(shortcode, res) {
  return new Promise(async (resolve) => {
    const tempDir = `/tmp/instaloader_${shortcode}_${Date.now()}`;

    const args = [
      "-m",
      "instaloader",
      "--no-video-thumbnails",
      "--no-metadata-json",
      "--no-captions",
      "--no-compress-json",
      "--dirname-pattern",
      tempDir,
      "--filename-pattern",
      "{shortcode}",
      "--",
      `-${shortcode}`,
    ];

    console.log("Downloading with instaloader, args:", args.join(" "));

    const instaloaderProcess = spawn("python3", args, {
      cwd: path.join(process.cwd(), "scripts"),
      env: {
        ...process.env,
        PATH: `${path.join(process.cwd(), "scripts", "venv", "bin")}:${
          process.env.PATH
        }`,
        VIRTUAL_ENV: path.join(process.cwd(), "scripts", "venv"),
        PYTHONPATH: path.join(process.cwd(), "scripts", "venv", "lib"),
      },
    });

    let stderr = "";

    instaloaderProcess.stdout.on("data", (data) => {
      console.log("instaloader stdout:", data.toString());
    });

    instaloaderProcess.stderr.on("data", (data) => {
      stderr += data.toString();
      console.log("instaloader stderr:", data.toString());
    });

    const timeout = setTimeout(() => {
      instaloaderProcess.kill("SIGTERM");
      resolve({ success: false, error: "Request timeout" });
    }, 30000);

    instaloaderProcess.on("close", async (code) => {
      clearTimeout(timeout);

      try {
        if (existsSync(tempDir)) {
          const files = await fs.readdir(tempDir);
          console.log("Downloaded files:", files);

          // Find all media files
          const mediaFiles = files.filter(
            (f) =>
              f.endsWith(".jpg") || f.endsWith(".mp4") || f.endsWith(".png")
          );

          if (mediaFiles.length > 0) {
            // Sort files to ensure correct order
            mediaFiles.sort();

            const hasVideo = mediaFiles.some((f) => f.endsWith(".mp4"));

            // If multiple files (carousel), return JSON with all file paths
            if (mediaFiles.length > 1) {
              // Read all files as base64 or prepare URLs
              const mediaData = [];

              for (const file of mediaFiles) {
                const filePath = path.join(tempDir, file);
                const isVideo = file.endsWith(".mp4");
                const fileBuffer = await fs.readFile(filePath);
                const base64 = fileBuffer.toString("base64");
                const mimeType = isVideo ? "video/mp4" : "image/jpeg";

                mediaData.push({
                  filename: file,
                  type: isVideo ? "video" : "photo",
                  mimeType: mimeType,
                  data: `data:${mimeType};base64,${base64}`,
                  size: fileBuffer.length,
                });
              }

              // Cleanup temp directory
              await fs.rm(tempDir, { recursive: true, force: true });

              // Return JSON with all media
              res.status(200).json({
                success: true,
                isCarousel: true,
                mediaCount: mediaFiles.length,
                media: mediaData,
                shortcode,
              });

              resolve({ success: true });
            } else {
              // Single file - send as before
              const mediaFile = mediaFiles[0];
              const isVideo = mediaFile.endsWith(".mp4");
              const filePath = path.join(tempDir, mediaFile);

              // Set response headers
              const contentType = isVideo ? "video/mp4" : "image/jpeg";
              const extension = isVideo ? "mp4" : "jpg";

              res.setHeader("Content-Type", contentType);
              res.setHeader(
                "Content-Disposition",
                `attachment; filename="instagram_${shortcode}.${extension}"`
              );

              // Stream file to response
              const fileStream = await fs.readFile(filePath);
              res.send(fileStream);

              // Cleanup temp directory
              await fs.rm(tempDir, { recursive: true, force: true });

              resolve({ success: true });
            }
          } else {
            await fs.rm(tempDir, { recursive: true, force: true });
            resolve({ success: false, error: "No media file found" });
          }
        } else {
          resolve({
            success: false,
            error: stderr || "Download failed - no output",
          });
        }
      } catch (error) {
        console.error("Error streaming file:", error);
        // Try to cleanup
        if (existsSync(tempDir)) {
          await fs.rm(tempDir, { recursive: true, force: true });
        }
        resolve({ success: false, error: error.message });
      }
    });

    instaloaderProcess.on("error", (error) => {
      clearTimeout(timeout);
      console.error("instaloader process error:", error);
      resolve({ success: false, error: error.message });
    });
  });
}
