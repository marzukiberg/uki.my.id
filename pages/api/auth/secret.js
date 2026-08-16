import { serialize } from "cookie";

// In-memory rate limiting: track attempts per IP
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers["x-real-ip"] || "127.0.0.1";
}

function isRateLimited(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (record.count >= MAX_ATTEMPTS) {
    return true;
  }

  record.count++;
  return false;
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const clientIp = getClientIp(req);

    // Check rate limit
    if (isRateLimited(clientIp)) {
      res.setHeader("Retry-After", "900");
      return res.status(429).json({
        authenticated: false,
        message: "Too many attempts. Please try again in 15 minutes.",
      });
    }

    const { secret } = req.body;

    // Replace with your actual secret key from environment variables
    const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY;

    if (!AUTH_SECRET_KEY) {
      console.error("AUTH_SECRET_KEY is not configured");
      return res.status(500).json({
        authenticated: false,
        message: "Server authentication is not configured.",
      });
    }

    if (secret === AUTH_SECRET_KEY) {
      // Reset rate limit on successful auth
      rateLimitMap.delete(clientIp);

      // Set a cookie or token for authentication
      res.setHeader(
        "Set-Cookie",
        serialize("auth", "true", {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 60 * 60 * 24 * 7, // 1 week
          sameSite: "strict",
        })
      );
      res.status(200).json({ authenticated: true });
    } else {
      res
        .status(401)
        .json({ authenticated: false, message: "Invalid secret key" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
