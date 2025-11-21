"use client";

import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const sidebarLinks = [
  { href: "/trends", label: "Overview" },
  { href: "/trends/artists", label: "Artists" },
  { href: "/trends/tracks", label: "Tracks" },
  { href: "/trends/genres", label: "Genres" },
];

const SIDEBAR_WIDTH = "w-64"; // simplify for mobile animation

export default function TrendsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden p-4 fixed top-0 left-0 z-50"
        onClick={() => setOpen(true)}
      >
        <Menu className="text-white" />
      </button>

      {/* Backdrop (mobile only) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          SIDEBAR_WIDTH,
          "bg-gray-900 border-r border-gray-800 p-6 pt-8 fixed top-0 h-screen z-50 transition-transform duration-300",
          // Desktop: always visible
          "md:translate-x-0",
          // Mobile: slide-in / slide-out
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button (mobile) */}
        <button
          className="md:hidden mb-4"
          onClick={() => setOpen(false)}
        >
          <X className="text-white" />
        </button>

        <h2 className="text-xl font-semibold text-white mb-6">Trends</h2>

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
                onClick={() => setOpen(false)} // close drawer on link click
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Page Content */}
      <main className={cn("flex-1 p-6", "md:ml-64")}>{children}</main>
    </div>
  );
}
