import { edgeAuthConfig } from '@/lib/auth/edge-config'
import NextAuth from 'next-auth'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(edgeAuthConfig)

export default auth(function middleware(
  req: NextRequest & { auth: { user?: unknown } | null },
) {
  const isLoggedIn  = !!req.auth?.user
  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')

  if (isDashboard && !isLoggedIn) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/dashboard/:path*'],
}
