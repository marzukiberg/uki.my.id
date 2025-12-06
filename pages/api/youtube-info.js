import { spawn } from "child_process";
import path from "path";

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

function checkRateLimit(ip, type = "info") {
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

  // Check rate limit for info requests
  const rateLimitResult = checkRateLimit(clientIP, "info");
  if (!rateLimitResult.allowed) {
    console.log(
      `Rate limit exceeded for IP: ${clientIP}, type: info (YouTube)`
    );
    return res.status(429).json({
      success: false,
      message: rateLimitResult.message,
      retryAfter: rateLimitResult.waitTimeSeconds,
      details: `Please wait ${rateLimitResult.waitTimeSeconds} seconds before trying again.`,
    });
  }

  const { url } = req.body;

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
    console.log("Getting YouTube video info for:", url);

    // Track if response has been sent to prevent multiple sends
    let responseSent = false;

    const sendResponse = (statusCode, data) => {
      if (!responseSent) {
        responseSent = true;
        res.status(statusCode).json(data);
      }
    };

    // Use yt-dlp to get video information in JSON format
    const ytDlpPath = path.join(
      process.cwd(),
      "scripts",
      "venv",
      "bin",
      "yt-dlp"
    );
    const ytDlpProcess = spawn(
      ytDlpPath,
      [
        "--no-warnings",
        "--no-check-certificate",
        "--print-json",
        "--skip-download",
        url,
      ],
      {
        cwd: process.cwd(),
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
        if (code === 0 && stdout) {
          try {
            const videoInfo = JSON.parse(stdout.trim());

            // Extract and format available formats from video info
            const formats = (videoInfo.formats || []).map((format) => ({
              format_id: format.format_id,
              ext: format.ext,
              resolution:
                format.resolution || `${format.width}x${format.height}`,
              filesize: format.filesize || format.filesize_approx || null,
              format_note: format.format_note,
              vcodec: format.vcodec,
              acodec: format.acodec,
              height: format.height,
              width: format.width,
              tbr: format.tbr,
            }));

            sendResponse(200, {
              success: true,
              title: videoInfo.title,
              duration: videoInfo.duration,
              thumbnail: videoInfo.thumbnail,
              uploader: videoInfo.uploader,
              view_count: videoInfo.view_count,
              upload_date: videoInfo.upload_date,
              formats: formats,
            });
            resolve();
          } catch (parseError) {
            console.error("Error parsing video info JSON:", parseError);
            sendResponse(500, {
              success: false,
              message: "Failed to parse video information",
              error: parseError.message,
            });
            resolve();
          }
        } else {
          console.error("yt-dlp error:", stderr);
          sendResponse(500, {
            success: false,
            message: "Failed to get video info",
            error: stderr || "Unknown error",
          });
          resolve();
        }
      });

      ytDlpProcess.on("error", (error) => {
        console.error("Error executing yt-dlp:", error);
        sendResponse(500, {
          success: false,
          message: "Failed to execute yt-dlp",
          error: error.message,
        });
        resolve();
      });
    });
  } catch (error) {
    console.error("Internal server error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}
