import { NextRequest, NextResponse } from "next/server";
import { userAgent } from "next/server";

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/create-preference/:path*',
    '/select-templates/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|mobile-page).*)',
  ]
}

export default function middleware(request: NextRequest) {
  const ua = userAgent(request);
  
  // Handle mobile redirect
  if (ua?.device?.type === 'mobile') {
    return NextResponse.redirect(new URL('/mobile-page', request.url));
  }

  // Skip auth check for public routes
  const publicPaths = ['/signin', '/', '/mobile-page'];
  const path = request.nextUrl.pathname;
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  // Check for auth token
  const token = request.cookies.get('next-auth.session-token');
  
  if (!token) {
    const signinUrl = new URL('/api/auth/signin', request.url);
    signinUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signinUrl);
  }

  return NextResponse.next();
}