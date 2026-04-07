// src/middleware.ts
// Runs before EVERY request to your app — on the server, before any page loads.
// Python equivalent: a Django middleware class with process_request()

import { withAuth } from 'next-auth/middleware'
// withAuth is a NextAuth helper that wraps your middleware with session checking.
// It automatically reads the session cookie and makes the token available.

export default withAuth({
  // callbacks.authorized runs on every request.
  // token = the decoded JWT token from the cookie, or null if not logged in.
  //middleware runs the mathmatical magic-if its a valid token only then token is not null.else it is null.
  //middleware doesnt hit db to check that user's token everytime.Thats the veauty of it.
  // Return true = let the request through.
  // Return false = redirect to /login.
  callbacks: {
    authorized({ token }) {
      // if token exists, user is logged in → allow access
      // if token is null, user is not logged in → block access
      return !!token
      // !! converts any value to boolean
      // !!null = false (block)
      // !!{ id: 'abc' } = true (allow)
      // Python equivalent: return token is not None
    }
  }
})

// matcher = which routes this middleware applies to.
// Without this, middleware would run on EVERY request including
// images, CSS files, API routes — which we don't want.
// We only want to protect platform pages.
export const config = {
  matcher: [
    '/feed',
    '/problems',
    '/problems/:path*',
    // :path* means /problems/anything/nested/deep — all sub-routes
    '/messaging/:path*',
    '/notifications',
    '/connections',
    '/profile/:path*',
    '/posts/:path*',
    '/competitions/:path*',
    '/funding/:path*',
    '/help-inbox',
    '/abracadabra'
  ]
}