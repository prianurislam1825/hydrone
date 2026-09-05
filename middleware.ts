import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * Edge-compatible middleware — cookie-based session check.
 *
 * next-auth v5 beta sets these cookie names:
 *   HTTP (localhost):  authjs.session-token
 *   HTTPS (prod):      __Secure-authjs.session-token
 *
 * Also supports next-auth v4 legacy names for compatibility.
 */
const SESSION_COOKIE_NAMES = [
  // next-auth v5 / authjs
  'authjs.session-token',
  '__Secure-authjs.session-token',
  // next-auth v4 legacy
  'next-auth.session-token',
  '__Secure-next-auth.session-token',
  // JWT variants
  'authjs.session-token.0',
  'authjs.session-token.1',
]

function hasSession(req: NextRequest): boolean {
  return SESSION_COOKIE_NAMES.some(name => {
    const val = req.cookies.get(name)?.value
    return typeof val === 'string' && val.length > 10
  })
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only protect /dashboard routes
  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next()
  }

  // Allow if session cookie present
  if (hasSession(req)) {
    return NextResponse.next()
  }

  // No session → redirect to login with callbackUrl
  const loginUrl = new URL('/login', req.url)
  loginUrl.searchParams.set('callbackUrl', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
