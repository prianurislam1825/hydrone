/**
 * Edge-compatible auth config — NO Credentials provider.
 * Used only in middleware (Edge Runtime).
 * Credentials provider uses Node.js APIs so it can't run on Edge.
 */
import type { NextAuthConfig } from 'next-auth'

export const edgeAuthConfig: NextAuthConfig = {
  providers: [],   // intentionally empty for Edge
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET ?? 'hydrone-local-secret',
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user
    },
  },
}
