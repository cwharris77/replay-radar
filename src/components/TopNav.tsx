"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "public/replay_radar_logo.svg";
import { useEffect, useState } from "react";
import ProfileButton from "./ProfileButton";

const navLinks = [
  { label: "Dashboard", href: "/" },
  { label: "Artists", href: "/artists" },
  { label: "Tracks", href: "/tracks" },
  { label: "Trends", href: "/trends" },
  { label: "About", href: "/about" },
];

const TopNav = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const isDev = process.env.NODE_ENV === "development";
    const secureFlag = isDev ? "" : " Secure;";
    document.cookie = `user_timezone=${tz}; path=/;${secureFlag} SameSite=Lax`;
  }, []);

  return (
    <>
      <nav className='fixed top-0 w-full bg-background border-b border-border z-50 shadow-sm h-navbar-sm md:h-navbar-md lg:h-navbar-lg'>
        <div className='grid grid-cols-3 items-center max-w-[1400px] mx-auto h-full'>
          {/* Hamburger Menu - Mobile & Tablet */}
          <div className='lg:hidden flex items-center justify-start pl-4'>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className='p-2 hover:bg-secondary rounded-lg transition-colors'
              aria-label='Open menu'
            >
              <Menu className='w-6 h-6 text-foreground' />
            </button>
          </div>

          {/* Navigation Links - Desktop Only (lg+) */}
          <div className='hidden lg:flex items-center gap-8 justify-start pl-6'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-2 text-[15px] font-medium transition-colors ${
                  pathname === link.href
                    ? "text-foreground font-semibold after:absolute after:bottom-[-12px] after:left-0 after:right-0 after:h-[2px] after:bg-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Logo Section - Center */}
          <div className='flex items-center justify-center'>
            <Link
              href='/'
              className='flex items-center hover:opacity-80 transition-opacity'
            >
              <Image
                src={logo.src}
                alt='Replay Radar Logo'
                width={40}
                height={40}
                priority
              />
            </Link>
          </div>

          {/* User Actions - Right */}
          <ProfileButton />
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='fixed inset-0 bg-black/50 z-50 lg:hidden'
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className='fixed top-0 left-0 h-full w-64 bg-background border-r border-border z-50 lg:hidden shadow-xl'
            >
              <div className='flex flex-col h-full'>
                {/* Header */}
                <div className='flex items-center justify-between p-4 border-b border-border'>
                  <h2 className='text-lg font-semibold text-foreground'>
                    Menu
                  </h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className='p-2 hover:bg-secondary rounded-lg transition-colors'
                    aria-label='Close menu'
                  >
                    <X className='w-5 h-5 text-foreground' />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className='flex flex-col p-4 gap-2'>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-lg text-[15px] font-medium transition-colors ${
                        pathname === link.href
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopNav;
