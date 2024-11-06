import { NextRequest, NextResponse } from "next/server";
import { userAgent } from "next/server";

export const config = {
  matcher: ['/dashboard', '/create-preference', '/select-templates/:path*', '/']
}

export default function middleware(request: NextRequest) {
  const ua = userAgent(request);

  if (ua?.device?.type === 'mobile') {
    // Redirect mobile users to the /mobile-page
    return NextResponse.redirect(new URL('/mobile-page', request.url));
  }

  const token = request.cookies.get('next-auth.session-token')

  if (!token) {
    const url = new URL('/api/auth/signin', request.url);
    // Preserve the original URL as callbackUrl
    url.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}