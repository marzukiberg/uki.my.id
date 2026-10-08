import crypto from "crypto";

// SECURITY: signed session cookie to prevent forgery (CRITICAL-1 fix).
// Cookie value format: "true.<hmac-sha256-hex>" where HMAC key = AUTH_SECRET_KEY.

function getKey() {
  const key = process.env.AUTH_SECRET_KEY;
  if (!key) throw new Error("AUTH_SECRET_KEY is not configured");
  return key;
}

export function signAuthCookie() {
  const payload = "true";
  const sig = crypto
    .createHmac("sha256", getKey())
    .update(payload)
    .digest("hex");
  return `${payload}.${sig}`;
}

export function verifyAuthCookie(value) {
  if (typeof value !== "string") return false;
  const parts = value.split(".");
  if (parts.length !== 2 || parts[0] !== "true") return false;
  const expected = crypto
    .createHmac("sha256", getKey())
    .update("true")
    .digest("hex");
  // timing-safe compare
  const a = Buffer.from(parts[1], "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
