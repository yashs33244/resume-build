import { NextRequest, NextResponse } from "next/server";
import { userAgent } from "next/server";

export const config = {
  matcher: ['/dashboard', '/create-preference', '/select-templates/:path*', '/']
}

export default function middleware(request: NextRequest) {
  const ua = userAgent(request);
  const isPublicPath = request.nextUrl.pathname === '/';
  
  // Check for mobile device first
  if (ua?.device?.type === 'mobile') {
    // Don't redirect if already on mobile page to prevent loops
    if (!request.nextUrl.pathname.startsWith('/mobile-page')) {
      return NextResponse.redirect(new URL('/mobile-page', request.url));
    }
  }

  // Allow public access to landing page
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check authentication for protected routes
  const token = request.cookies.get('next-auth.session-token');
  
  if (!token) {
    const url = new URL('/signin', request.url);
    url.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}