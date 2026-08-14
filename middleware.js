import { NextResponse } from "next/server";

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const response = pathname === "/dashboard"
    ? (request.cookies.get("auth")?.value === "true"
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/login", request.url)))
    : NextResponse.next();

  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: ["/dashboard"],
};
