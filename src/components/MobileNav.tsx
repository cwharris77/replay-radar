"use client";

import { Menu, X } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle button */}
      <button
        className="md:hidden p-4 fixed top-0 left-0 z-50"
        onClick={() => setOpen(true)}
      >
        <Menu className="text-white" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 p-6 z-50 
        transform transition-transform duration-300 
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Close */}
        <button className="mb-4 md:hidden" onClick={() => setOpen(false)}>
          <X className="text-white" />
        </button>

        <h2 className="text-xl font-semibold mb-6 text-white">Menu</h2>

        <div className="flex flex-col gap-2">
          <Link href="/" className="text-gray-300" onClick={() => setOpen(false)}>
            Home
          </Link>

          <Link href="/trends" className="text-gray-300" onClick={() => setOpen(false)}>
            Trends
          </Link>

          <Link href="/dashboard" className="text-gray-300" onClick={() => setOpen(false)}>
            Dashboard
          </Link>

          <hr className="my-4 border-gray-700" />

          {/* Auth */}
          <button
            className="text-gray-300 text-left"
            onClick={() => {
              signIn("spotify");
              setOpen(false);
            }}
          >
            Login
          </button>

          <button
            className="text-gray-300 text-left"
            onClick={() => {
              signOut({ callbackUrl: "/" });
              setOpen(false);
            }}
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
