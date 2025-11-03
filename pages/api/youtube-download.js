import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { promisify } from "util";

const unlinkAsync = promisify(fs.unlink);

// Improved rate limiting with sliding window (same as TikTok)
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

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
    responseLimit: false,
  },
};

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

  // Check rate limit (YouTube downloads are more resource intensive, so use download limit)
  const rateLimitResult = checkRateLimit(clientIP, "download");
  if (!rateLimitResult.allowed) {
    console.log(
      `Rate limit exceeded for IP: ${clientIP}, type: download (YouTube)`
    );
    return res.status(429).json({
      success: false,
      message: rateLimitResult.message,
      retryAfter: rateLimitResult.waitTimeSeconds,
      details: `Please wait ${rateLimitResult.waitTimeSeconds} seconds before trying again.`,
    });
  }

  const { url, format = "best" } = req.body;

  if (!url) {
    return res.status(400).json({ message: "YouTube URL is required" });
  }

  // Basic URL validation
  try {
    const urlObj = new URL(url);
    if (
      !urlObj.hostname.includes("youtube.com") &&
      !urlObj.hostname.includes("youtu.be")
    ) {
      return res.status(400).json({ message: "Invalid YouTube URL" });
    }
  } catch (error) {
    return res.status(400).json({ message: "Invalid URL format" });
  }

  try {
    console.log("Downloading YouTube video:", url, "format:", format);

    // Create temporary directory
    const tempDir = path.join(process.cwd(), "public", "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const videoId =
      url.split("v=")[1]?.split("&")[0] || url.split("/").pop() || "video";

    // Determine if audio or video format
    const isAudioFormat =
      format.includes("audio") || format.includes("bestaudio");

    // Determine format selector
    let formatSelector;
    if (isAudioFormat) {
      formatSelector = "bestaudio/best";
    } else if (format.includes("+")) {
      formatSelector = format;
    } else {
      formatSelector = `${format}+bestaudio/best`;
    }

    // Build output template - for audio, let yt-dlp handle the extension
    const outputTemplate = `${timestamp}_${videoId}`;
    const outputPath = isAudioFormat
      ? path.join(tempDir, `${outputTemplate}.%(ext)s`)
      : path.join(tempDir, `${outputTemplate}.mp4`);

    // Download with yt-dlp
    const ytDlpPath = path.join(
      process.cwd(),
      "scripts",
      "venv",
      "bin",
      "yt-dlp"
    );
    const ytDlpArgs = [
      "--no-warnings",
      "--no-check-certificate",
      "--format",
      formatSelector,
      "--output",
      outputPath,
      url,
    ];

    // Add format-specific flags
    if (isAudioFormat) {
      ytDlpArgs.splice(
        4,
        0,
        "--extract-audio",
        "--audio-format",
        "mp3",
        "--audio-quality",
        "192K"
      );
    } else {
      ytDlpArgs.splice(4, 0, "--merge-output-format", "mp4");
    }

    console.log("yt-dlp command:", ytDlpArgs.join(" "));

    // Execute yt-dlp
    await new Promise((resolve, reject) => {
      const ytDlpProcess = spawn(ytDlpPath, ytDlpArgs, {
        cwd: process.cwd(),
      });

      let stderr = "";

      ytDlpProcess.stderr.on("data", (data) => {
        stderr += data.toString();
        console.log("yt-dlp:", data.toString());
      });

      ytDlpProcess.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          console.error("yt-dlp error:", stderr);
          reject(new Error(stderr || "Failed to download video"));
        }
      });

      ytDlpProcess.on("error", (error) => {
        reject(error);
      });
    });

    // Check if file exists and get the actual filename
    const files = fs.readdirSync(tempDir);
    const downloadedFile = files.find((file) =>
      file.startsWith(`${timestamp}_${videoId}`)
    );

    if (!downloadedFile) {
      throw new Error("Downloaded file not found");
    }

    const filePath = path.join(tempDir, downloadedFile);
    const stats = fs.statSync(filePath);
    const fileExt = path.extname(downloadedFile).slice(1);

    // Set headers
    const filename = `ukaydev_youtube_${videoId}.${fileExt}`;
    res.setHeader(
      "Content-Type",
      fileExt === "mp3" ? "audio/mpeg" : "video/mp4"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", stats.size);
    res.setHeader("Cache-Control", "no-cache");

    // Stream file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Cleanup after streaming
    fileStream.on("end", async () => {
      try {
        await unlinkAsync(filePath);
        console.log("Cleaned up temp file:", filePath);
      } catch (err) {
        console.error("Error cleaning up:", err);
      }
    });

    fileStream.on("error", (error) => {
      console.error("Stream error:", error);
      if (!res.headersSent) {
        res.status(500).json({ message: "Failed to stream video" });
      }
    });
  } catch (error) {
    console.error("Download error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Failed to download video",
        error: error.message,
      });
    }
  }
}
