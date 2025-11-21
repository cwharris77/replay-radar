"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarLinks = [
  { href: "/trends", label: "Overview" },
  { href: "/trends/artists", label: "Artists" },
  { href: "/trends/tracks", label: "Tracks" },
  { href: "/trends/genres", label: "Genres" },
];

export default function TrendsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 border-r border-gray-800 p-4">
        <h2 className="text-xl font-semibold text-white mb-4">Trends</h2>

        <nav className="flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm transition",
                  active
                    ? "bg-green-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Page Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
