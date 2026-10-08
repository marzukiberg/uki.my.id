import { NextResponse } from "next/server";

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

async function verifyAuthCookieEdge(value, secret) {
  if (typeof value !== "string") return false;
  const parts = value.split(".");
  if (parts.length !== 2 || parts[0] !== "true") return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode("true"));
  const expected = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  // constant-time-ish compare
  if (parts[1].length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= parts[1].charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  let response;
  if (pathname === "/dashboard") {
    const secret = process.env.AUTH_SECRET_KEY || "";
    const cookieVal = request.cookies.get("auth")?.value;
    const ok = secret && (await verifyAuthCookieEdge(cookieVal, secret));
    response = ok
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/login", request.url));
  } else {
    response = NextResponse.next();
  }

  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: ["/dashboard"],
};
