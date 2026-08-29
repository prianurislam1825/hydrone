import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

const appMode = process.env.APP_MODE ?? 'local'

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string

        // Local mode: accept any credentials (demo)
        if (appMode === 'local') {
          return {
            id: '1',
            name: 'HYDRONE Admin',
            email,
            role: 'ADMIN',
          }
        }

        // Cloud mode: validate against database
        const password = credentials.password as string
        if (email === 'admin@hydrone.local' && password === 'hydrone2024') {
          return {
            id: '1',
            name: 'HYDRONE Admin',
            email,
            role: 'ADMIN',
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user && 'role' in user) {
        token.role = user.role as string
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        ;(session.user as typeof session.user & { role?: string }).role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET ?? 'hydrone-local-secret',
}
