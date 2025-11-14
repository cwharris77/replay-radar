import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getDailySummariesCollection } from "./models/DailySummary";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the base URL for the application.
 * Prioritizes VERCEL_URL (auto-provided by Vercel), then NEXTAUTH_URL, then falls back to localhost.
 * This ensures preview deployments work correctly without manual configuration.
 */
export function getBaseUrl(request?: Request | { headers: Headers }): string {
  // For server-side, use VERCEL_URL if available (Vercel automatically sets this)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Try to get from request headers (for runtime detection)
  if (request) {
    const host = request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    if (host) {
      return `${protocol}://${host}`;
    }
  }

  // Fall back to NEXTAUTH_URL or localhost
  return (
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000"
  );
}

export function toUserLocalDay(date: Date, timeZone: string): string {
  const local = new Date(date.toLocaleString("en-US", { timeZone }));

  return local.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

export async function getDailySummary(userId: string, date: Date, tz: string) {
  const summaries = await getDailySummariesCollection();

  const dayKey = toUserLocalDay(date, tz);

  return (
    (await summaries.findOne({ userId, day: dayKey })) ?? {
      totalMs: 0,
      trackCount: 0,
    }
  );
}
