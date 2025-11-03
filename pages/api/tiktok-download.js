import { spawn } from "child_process";
import path from "path";
import got from "got";

// TikWM API rate limiting - 1 request per second
let lastTikwmRequest = 0;
const TIKWM_RATE_LIMIT = 1000; // 1 second between requests

// Helper function to call TikWM API with rate limiting and retry
async function callTikwmAPI(url, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Enforce rate limit
      const now = Date.now();
      const timeSinceLastRequest = now - lastTikwmRequest;
      if (timeSinceLastRequest < TIKWM_RATE_LIMIT) {
        const delay = TIKWM_RATE_LIMIT - timeSinceLastRequest;
        console.log(`Rate limit: waiting ${delay}ms before request`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      lastTikwmRequest = Date.now();

      console.log(
        `Calling TikWM API (attempt ${attempt + 1}/${maxRetries}):`,
        url
      );

      const apiResponse = await got
        .post("https://www.tikwm.com/api/", {
          json: {
            url: url,
            hd: 1,
          },
          headers: {
            "Content-Type": "application/json",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
          timeout: {
            request: 10000, // 10 second timeout
          },
        })
        .json();

      if (apiResponse.code === 0 && apiResponse.data) {
        return apiResponse;
      } else if (apiResponse.msg && apiResponse.msg.includes("Api Limit")) {
        // Rate limit hit, wait longer and retry
        console.log("Rate limit hit, waiting 2 seconds before retry...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        continue;
      } else {
        throw new Error(apiResponse.msg || "API request failed");
      }
    } catch (error) {
      console.error(`TikWM API error (attempt ${attempt + 1}):`, error.message);

      // If it's the last attempt, throw the error
      if (attempt === maxRetries - 1) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      const backoffDelay = Math.min(1000 * Math.pow(2, attempt), 5000);
      console.log(`Retrying in ${backoffDelay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
    }
  }

  throw new Error("Max retries exceeded");
}

// Improved rate limiting with sliding window
const rateLimitStore = new Map();

// Rate limit configurations
const RATE_LIMITS = {
  info: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 15, // 15 info requests per minute
    message: "Too many info requests",
  },
  download: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 8, // 8 downloads per minute
    message: "Too many download requests",
  },
};

// Periodic cleanup to prevent memory leaks (more frequent cleanup)
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    // Remove entries older than the longest window
    const maxWindow = Math.max(
      ...Object.values(RATE_LIMITS).map((limit) => limit.windowMs)
    );
    if (now - data.lastRequest > maxWindow * 2) {
      rateLimitStore.delete(key);
    }
  }
}, 30 * 1000); // Clean up every 30 seconds

function checkRateLimit(ip, type = "download") {
  const now = Date.now();
  const limit = RATE_LIMITS[type];
  const key = `${ip}:${type}`;

  // Get or create user data
  let userData = rateLimitStore.get(key);
  if (!userData) {
    userData = {
      requests: [],
      lastRequest: now,
    };
    rateLimitStore.set(key, userData);
  }

  // Clean up old requests outside the window
  userData.requests = userData.requests.filter(
    (timestamp) => now - timestamp < limit.windowMs
  );

  // Check if limit exceeded
  if (userData.requests.length >= limit.maxRequests) {
    // Calculate when the oldest request will expire
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

  // Add current request
  userData.requests.push(now);
  userData.lastRequest = now;

  return { allowed: true };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Get client IP for rate limiting
  const clientIP =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    "unknown";

  // Determine request type for rate limiting
  const requestType = req.body.getInfo ? "info" : "download";

  // Check rate limit
  const rateLimitResult = checkRateLimit(clientIP, requestType);
  if (!rateLimitResult.allowed) {
    console.log(
      `Rate limit exceeded for IP: ${clientIP}, type: ${requestType}`
    );
    return res.status(429).json({
      success: false,
      message: rateLimitResult.message,
      retryAfter: rateLimitResult.waitTimeSeconds,
      details: `Please wait ${rateLimitResult.waitTimeSeconds} seconds before trying again.`,
    });
  }

  const { url, quality = "best", getInfo = false } = req.body;

  if (!url) {
    return res.status(400).json({ message: "TikTok URL is required" });
  }

  // Basic URL validation
  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes("tiktok.com")) {
      return res.status(400).json({ message: "Invalid TikTok URL" });
    }
  } catch (error) {
    return res.status(400).json({ message: "Invalid URL format" });
  }

  // If getInfo is true, return video information instead of downloading
  if (getInfo) {
    return getVideoInfo(url, res);
  }

  // Validate quality parameter for download
  if (!["best", "worst"].includes(quality)) {
    return res
      .status(400)
      .json({ message: 'Invalid quality parameter. Use "best" or "worst"' });
  }

  // Otherwise, proceed with download
  return downloadVideo(url, quality, res);
}

async function getVideoInfo(url, res) {
  try {
    console.log("Getting media info for:", url);

    // Check if it's a photo URL - use tikwm for photos
    const isPhoto = url.includes("/photo/");

    if (isPhoto) {
      // Use tikwm.com API for photos
      try {
        const apiResponse = await callTikwmAPI(url);
        const { data } = apiResponse;

        if (data.images && data.images.length > 0) {
          // Photo post
          res.status(200).json({
            success: true,
            isPhoto: true,
            imageCount: data.images.length,
            imageUrls: data.images, // Return all image URLs
            bestSize: null, // Not applicable for photos
            worstSize: null, // Not applicable for photos
          });
          return;
        }
      } catch (error) {
        console.error("Error getting photo info:", error);

        let errorMessage = "Failed to get photo info";
        if (error.message.includes("Api Limit")) {
          errorMessage = "Server is busy. Please try again in a few seconds.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Request timed out. Please try again.";
        }

        res.status(500).json({
          success: false,
          message: errorMessage,
          error: error.message,
        });
        return;
      }
    }

    // For videos, use yt-dlp directly
    console.log("Getting video info with yt-dlp for:", url);

    const ytDlpProcess = spawn(
      "yt-dlp",
      [
        "--no-warnings",
        "--dump-json",
        "--user-agent",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "--add-header",
        "Referer: https://www.tiktok.com/",
        url,
      ],
      {
        cwd: path.join(process.cwd(), "scripts"),
        env: {
          ...process.env,
          PATH: `${path.join(process.cwd(), "scripts", "venv", "bin")}:${
            process.env.PATH
          }`,
          VIRTUAL_ENV: path.join(process.cwd(), "scripts", "venv"),
        },
      }
    );

    let stdout = "";
    let stderr = "";

    ytDlpProcess.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    ytDlpProcess.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    return new Promise((resolve) => {
      ytDlpProcess.on("close", (code) => {
        if (code === 0) {
          try {
            const mediaInfo = JSON.parse(stdout);

            // Extract format information
            const formats = mediaInfo.formats || [];

            // Find best and worst formats by filesize
            const videoFormats = formats.filter(
              (fmt) =>
                fmt.vcodec &&
                fmt.vcodec !== "none" &&
                (fmt.filesize || fmt.filesize_approx)
            );

            let bestSize = null;
            let worstSize = null;

            if (videoFormats.length > 0) {
              const sortedFormats = videoFormats.sort(
                (a, b) =>
                  (b.filesize || b.filesize_approx || 0) -
                  (a.filesize || a.filesize_approx || 0)
              );

              bestSize =
                sortedFormats[0].filesize || sortedFormats[0].filesize_approx;
              worstSize =
                sortedFormats[sortedFormats.length - 1].filesize ||
                sortedFormats[sortedFormats.length - 1].filesize_approx;
            }

            res.status(200).json({
              success: true,
              isPhoto: false,
              bestSize,
              worstSize,
            });
            resolve();
          } catch (parseError) {
            console.error("Error parsing yt-dlp JSON output:", parseError);
            res.status(500).json({
              success: false,
              message: "Failed to parse video info",
              error: parseError.message,
            });
            resolve();
          }
        } else {
          console.error("yt-dlp failed:", stderr);
          res.status(500).json({
            success: false,
            message: "Failed to get video info",
            error: stderr || "Unknown error",
          });
          resolve();
        }
      });

      ytDlpProcess.on("error", (error) => {
        console.error("Failed to execute yt-dlp:", error);
        res.status(500).json({
          success: false,
          message: "Failed to execute yt-dlp",
          error: error.message,
        });
        resolve();
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function downloadVideo(url, quality, res) {
  try {
    console.log("Downloading media:", url, "quality:", quality);

    // Extract media ID from URL
    const mediaId = url.split("/").pop().split("?")[0] || "media";

    // Check if it's a photo URL - use tikwm for photos
    const isPhoto = url.includes("/photo/");

    if (isPhoto) {
      // Use tikwm.com API for photos
      const apiResponse = await callTikwmAPI(url);
      const { data } = apiResponse;

      if (data.images && data.images.length > 0) {
        // For photos, get the first image
        const imageUrl = data.images[0];
        console.log("Streaming photo from:", imageUrl);

        const filename = `ukaydev_${mediaId}.jpg`;
        res.setHeader("Content-Type", "image/jpeg");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${filename}"`
        );
        res.setHeader("Cache-Control", "no-cache");

        const imageStream = got.stream(imageUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            Referer: "https://www.tiktok.com/",
          },
        });

        imageStream.pipe(res);

        return new Promise((resolve) => {
          imageStream.on("end", () => {
            console.log("Photo streamed successfully");
            resolve();
          });
          imageStream.on("error", (error) => {
            console.error("Error streaming photo:", error);
            if (!res.headersSent) {
              res.status(500).json({
                success: false,
                message: "Failed to stream photo",
                error: error.message,
              });
            }
            resolve();
          });
        });
      } else {
        throw new Error("No images found in response");
      }
    }

    // For videos, use yt-dlp directly
    const baseFilename = `ukaydev_${mediaId}`;
    const filename =
      quality === "best" ? `${baseFilename}_hd.mp4` : `${baseFilename}.mp4`;
    const contentType = "video/mp4";

    console.log(`Streaming video with yt-dlp (${quality}) for:`, url);

    // Execute yt-dlp directly to stream media
    const ytDlpProcess = spawn(
      "yt-dlp",
      [
        "--no-warnings",
        "--no-progress",
        "--format",
        quality,
        "--output",
        "-",
        "--user-agent",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "--add-header",
        "Referer: https://www.tiktok.com/",
        "--add-header",
        "Sec-Fetch-Dest: video",
        "--add-header",
        "Sec-Fetch-Mode: no-cors",
        "--add-header",
        "Sec-Fetch-Site: cross-site",
        url,
      ],
      {
        cwd: path.join(process.cwd(), "scripts"),
        env: {
          ...process.env,
          PATH: `${path.join(process.cwd(), "scripts", "venv", "bin")}:${
            process.env.PATH
          }`,
          VIRTUAL_ENV: path.join(process.cwd(), "scripts", "venv"),
        },
      }
    );

    // Set headers for media streaming
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Cache-Control", "no-cache");

    let hasError = false;
    let errorMessage = "";

    // Handle stderr for error logging
    ytDlpProcess.stderr.on("data", (data) => {
      const error = data.toString();
      console.error("yt-dlp stderr:", error);

      if (
        !hasError &&
        !error.includes("Destination: -") &&
        !error.includes("Downloading")
      ) {
        hasError = true;
        errorMessage = error;
      }
    });

    // Pipe stdout (media data) directly to response
    ytDlpProcess.stdout.pipe(res);

    return new Promise((resolve) => {
      ytDlpProcess.on("close", (code) => {
        if (code === 0 && !hasError) {
          console.log(`Video streamed successfully (${quality})`);
          resolve();
        } else {
          if (!res.headersSent) {
            res.status(500).json({
              success: false,
              message: "Failed to stream video",
              error: errorMessage || "Unknown error",
            });
          }
          resolve();
        }
      });

      ytDlpProcess.on("error", (error) => {
        console.error("Failed to start yt-dlp process:", error);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: "Failed to execute yt-dlp",
            error: error.message,
          });
        }
        resolve();
      });
    });
  } catch (error) {
    console.error("API error:", error);
    if (!res.headersSent) {
      let errorMessage = "Internal server error";
      if (error.message.includes("Api Limit")) {
        errorMessage = "Server is busy. Please try again in a few seconds.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "Request timed out. Please try again.";
      }

      res.status(500).json({
        success: false,
        message: errorMessage,
        error: error.message,
      });
    }
  }
}
