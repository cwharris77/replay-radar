"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Disc,
  LayoutDashboard,
  Mic2,
  Music,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const sidebarLinks = [
  { href: "/trends", label: "Overview", icon: LayoutDashboard },
  { href: "/trends/artists", label: "Artists", icon: Mic2 },
  { href: "/trends/tracks", label: "Tracks", icon: Music },
  { href: "/trends/genres", label: "Genres", icon: Disc },
];

export default function TrendsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 1279px)");

  // Default to collapsed on mobile, expanded on desktop
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Sync collapsed state with mobile status
  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  const sidebarWidth = isCollapsed ? "w-20" : "w-64";

  return (
    <div className='flex min-h-screen'>
      {/* Mobile Backdrop for Expanded Sidebar */}
      {!isCollapsed && (
        <div
          className='fixed inset-0 bg-black/50 z-30 xl:hidden'
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          sidebarWidth,
          "bg-sidebar border-r border-sidebar-border fixed top-navbar-sm md:top-navbar-md lg:top-navbar-lg bottom-0 z-45 transition-all duration-300 flex flex-col justify-center items-center translate-x-0"
        )}
      >
        <div className='p-6 pt-8 flex-1 w-full'>
          <h2
            className={cn(
              "text-xl font-semibold text-sidebar-foreground mb-6 transition-all duration-300 h-7 overflow-hidden whitespace-nowrap",
              isCollapsed ? "opacity-0 w-0" : "opacity-100 delay-100"
            )}
          >
            Trends
          </h2>

          <nav className='flex flex-col gap-2'>
            {sidebarLinks.map((link) => {
              const active = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center rounded-lg text-sm transition-all duration-200 group relative",
                    isCollapsed ? "justify-center p-3" : "px-3 py-2 gap-3",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-accent-foreground hover:bg-sidebar-accent"
                  )}
                  onClick={() => {
                    // Only auto-collapse on mobile
                    if (window.innerWidth < 1280) {
                      setIsCollapsed(true);
                    }
                  }}
                  title={isCollapsed ? link.label : undefined}
                >
                  <Icon
                    className={cn(
                      "flex-shrink-0 transition-all duration-200",
                      isCollapsed ? "w-6 h-6" : "w-5 h-5"
                    )}
                  />
                  <span
                    className={cn(
                      "whitespace-nowrap transition-all duration-300 overflow-hidden",
                      isCollapsed
                        ? "w-0 opacity-0"
                        : "w-auto opacity-100 delay-100"
                    )}
                  >
                    {link.label}
                  </span>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className='absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-md border border-border transition-opacity'>
                      {link.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Toggle Button */}
        <div className='flex p-4 border-t border-sidebar-border justify-end w-full'>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className='p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-accent-foreground transition-colors'
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isMobile ? (
              isCollapsed ? (
                <div className='w-10 h-10 rounded-full flex items-center justify-center outline outline-primary'>
                  <ChevronRight className='w-5 h-5' />
                </div>
              ) : (
                <div className='w-10 h-10 rounded-full flex items-center justify-center outline outline-primary'>
                  <ChevronLeft className='w-5 h-5' />
                </div>
              )
            ) : null}
          </button>
        </div>
      </aside>

      {/* Page Content */}
      <main
        className={cn(
          "flex-1 p-6 transition-all duration-300",
          isCollapsed ? "ml-20" : "ml-20 xl:ml-64"
        )}
      >
        {children}
      </main>
    </div>
  );
}
