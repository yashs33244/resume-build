import { NextRequest, NextResponse } from "next/server";

export const config = {
    matcher: ['/dashboard', '/create-preference', '/select-templates/:path*']
  }
  
  export default function middleware(request: NextRequest) {
    const token = request.cookies.get('next-auth.session-token')
    
    if (!token) {
      const url = new URL('/api/auth/signin', request.url);
      // Preserve the original URL as callbackUrl
      url.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(url);
    }
    
    return NextResponse.next();
  }