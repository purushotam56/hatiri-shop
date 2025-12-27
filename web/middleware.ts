import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const { hostname, pathname } = url;

  // Check if hostname is an IP address (with or without port) - if so, don't redirect
  if (/^\d+\.\d+\.\d+\.\d+/.test(hostname)) {
    return NextResponse.next();
  }

  const parts = hostname.split(".");

  // Handle subdomains like vw001.hatiri.localhost
  if (
    parts.length >= 3 &&
    parts[0] !== "www" &&
    (parts[1] === "hitari" || parts[1] === "hatari" || parts[1] === "hatiri")
  ) {
    const storeCode = parts[0].toUpperCase();

    if (pathname === "/" || pathname === "") {
      // Redirect to main domain with store path
      const redirectUrl = request.nextUrl.clone();

      redirectUrl.hostname = parts.slice(1).join("."); // Remove subdomain to get base domain
      redirectUrl.pathname = `/store/${storeCode}`;

      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)"],
};
