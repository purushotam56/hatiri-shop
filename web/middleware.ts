import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { hostname, pathname } = request.nextUrl
  const parts = hostname.split('.')
  
  // Handle subdomains like mh001.hitari.localhost
  if (
    parts.length >= 3 &&
    parts[0] !== 'www' &&
    (parts[1] === 'hitari' || parts[1] === 'hatari' || parts[1] === 'hatiri')
  ) {
    const storeCode = parts[0].toUpperCase()
    
    if (pathname === '/' || pathname === '') {
      const url = request.nextUrl.clone()
      url.pathname = `/store/${storeCode}`
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)',
  ],
}
