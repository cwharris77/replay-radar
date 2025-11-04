import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/api/spotify", "/api/trends", "/api/cron"];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/spotify/:path*", "/api/trends/:path*", "/api/cron/:path*"],
};
