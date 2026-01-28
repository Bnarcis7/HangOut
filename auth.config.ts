import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isOnRoom = nextUrl.pathname.startsWith('/room')
      const isOnAuth = nextUrl.pathname.startsWith('/auth')

      // Protect dashboard and room routes
      if ((isOnDashboard || isOnRoom) && !isLoggedIn) {
        return false
      }

      // Redirect logged-in users away from auth pages
      if (isOnAuth && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }

      return true
    },
  },
  providers: [], // Providers added in auth.ts
} satisfies NextAuthConfig
