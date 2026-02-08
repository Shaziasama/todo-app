import { withAuth, type NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// This is the actual middleware function that gets executed for matched routes
async function middleware(req: NextRequestWithAuth) {
  const pathname = req.nextUrl.pathname;
  const token = req.nextauth.token;

  // Custom redirect: If authenticated, prevent access to login/signup pages
  if (token && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // NextAuth's 'authorized' callback (configured below) will handle
  // redirecting unauthenticated users from protected routes to '/login'.
  return NextResponse.next();
}

// Wrap your middleware function with `withAuth` and provide configuration
export default withAuth(middleware, {
  // The 'callbacks' object is where you define authorization logic
  callbacks: {
    authorized: ({ token, req }) => {
      const pathname = req.nextUrl.pathname;
      // Allow all requests to /login and /signup (even unauthenticated ones)
      if (pathname === "/login" || pathname === "/signup") {
        return true;
      }
      // For any other path, authorization is required (token must exist)
      return !!token;
    },
  },
  pages: {
    signIn: "/login",
  },
});

// Define the matcher globally for the middleware. This is for Next.js, not NextAuth.
// It tells Next.js which routes this middleware applies to.
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)", // Match all except static files, API
  ],
};
