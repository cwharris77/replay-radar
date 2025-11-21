import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const adminRoutes = ["/api/admin/", "/admin/"];

function isAdminRoute(pathname: string) {
  return adminRoutes.some((route) => pathname.startsWith(route));
}

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Redirect authenticated users away from login page
    if (pathname === "/login" && token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (isAdminRoute(pathname) && token?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token?.accessToken && !!token?.refreshToken;
      },
    },
  }
);

export const config = {
  matcher: [
    "/api/((?!auth).*)",
    "/admin/:path*",
    "/trends/:path*",
    "/dashboard/:path*",
    "/artists/:path*",
    "/tracks/:path*",
    "/genres/:path*",
    "/login", // Add login to check for authenticated users
  ],
};
