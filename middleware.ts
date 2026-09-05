import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * Edge-compatible middleware — does NOT import next-auth.
 *
 * Strategy: check for the next-auth session cookie directly.
 * If the cookie exists → user has a session → allow through.
 * If missing → redirect to /login.
 *
 * next-auth v5 (beta) sets a cookie named:
 *   authjs.session-token        (production / HTTPS)
 *   __Secure-authjs.session-token (also on HTTPS)
 *   authjs.session-token        (HTTP / localhost dev)
 */
const SESSION_COOKIE_NAMES = [
  'authjs.session-token',
  '__Secure-authjs.session-token',
  'next-auth.session-token',
  '__Secure-next-auth.session-token',
]

function hasSession(req: NextRequest): boolean {
  return SESSION_COOKIE_NAMES.some(name => {
    const val = req.cookies.get(name)?.value
    return !!val && val.length > 0
  })
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isDashboard  = pathname.startsWith('/dashboard')

  if (isDashboard && !hasSession(req)) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
