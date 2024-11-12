import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of mobile-specific routes that should not redirect to avoid infinite loops
const MOBILE_ROUTES = ['/mobile-page']

// List of routes that should not be redirected (like API routes, static files)
const EXCLUDED_ROUTES = [
  '/_next',
  '/api',
  '/favicon',
  '/images',
  '/static',
  '/manifest.json',
  '/site.webmanifest'
]

export function middleware(request: NextRequest) {
  // Get the user agent string
  const userAgent = request.headers.get('user-agent') || ''

  // Common mobile device patterns
  const mobileRegex = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

  // Check if it's a mobile device
  const isMobile = mobileRegex.test(userAgent)

  // Get the current path
  const { pathname } = request.nextUrl

  // Check if the current route should be excluded from redirection
  const isExcludedRoute = EXCLUDED_ROUTES.some(route => pathname.startsWith(route))
  const isMobileRoute = MOBILE_ROUTES.some(route => pathname.startsWith(route))

  // Only redirect if:
  // 1. It's a mobile device
  // 2. Not already on a mobile route
  // 3. Not an excluded route
  if (isMobile && !isMobileRoute && !isExcludedRoute) {
    // Create a new URL object based on the request URL
    const url = request.nextUrl.clone()
    
    // Set the new pathname
    url.pathname = '/mobile-page'

    // Preserve any query parameters
    url.search = request.nextUrl.search

    // Return the response with the new URL
    return NextResponse.redirect(url)
  }

  // For non-mobile devices or excluded routes, continue normally
  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /static (static files)
     * 4. /favicon.ico, /site.webmanifest, etc. (static files)
     */
    '/((?!api|_next|static|favicon.ico|site.webmanifest).*)',
  ],
}