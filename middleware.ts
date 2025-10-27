import { requireSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function middleware() {
  const session = await requireSession();

  if (session instanceof NextResponse) return session; // block unauthorized
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"], // applies middleware to all API routes
};
