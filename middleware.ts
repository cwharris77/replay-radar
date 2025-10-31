import { requireSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/api/auth"];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const session = await requireSession();

  if (session instanceof NextResponse) return session; // block unauthorized
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"], // applies middleware to all API routes
};
