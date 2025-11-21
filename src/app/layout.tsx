import { TopNav } from "@/components";
import MobileNav from "@/components/MobileNav";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Replay Radar",
  description: "Spotify wrapped anytime",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        // suppressHydrationWarning={true} // extensions modify the body tag after server renders but before hydration
      >
        <Providers>
          <>
            {/* Desktop nav */}
            <div className="hidden md:block">
              <TopNav />
            </div>

            {/* Mobile nav */}
            <MobileNav />
          </>
          {children}
        </Providers>
      </body>
    </html>
  );
}
