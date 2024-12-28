import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

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

// List of public routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/login', '/register', '/forgot-password', '/select-templates/checkout/*']

export async function middleware(request: NextRequest) {
  // Get the user agent string
  const userAgent = request.headers.get('user-agent') || ''
  
  // Get the current path
  const { pathname } = request.nextUrl
  
  // Check if it's a mobile device
  const mobileRegex = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  const isMobile = mobileRegex.test(userAgent)

  // Check if the current route should be excluded from redirection
  const isExcludedRoute = EXCLUDED_ROUTES.some(route => pathname.startsWith(route))
  const isMobileRoute = MOBILE_ROUTES.some(route => pathname.startsWith(route))

  // Get the authentication token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  // Always redirect authenticated users from the landing page to dashboard
  if (token && pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }
  
  // Handle other public routes for authenticated users
  if (token && PUBLIC_ROUTES.includes(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }
  
  // Handle mobile redirects
  if (isMobile && !isMobileRoute && !isExcludedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/mobile-page'
    url.search = request.nextUrl.search
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