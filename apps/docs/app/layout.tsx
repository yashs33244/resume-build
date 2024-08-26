import { ReactNode } from "react";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@repo/ui/lib/utils";
import type { Metadata } from "next";
import "@repo/ui/globals.css";
import Header from "../components/Header";
import Image from "next/image";
import logo from "./logo.svg";
import { Providers } from "./providers";

import Footer from "../components/Footer";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers>
          {/* <Header /> */}
          {/* <NextTopLoader color="#2E78C7" height={2} /> */}
          {/* this is done as to keep footer in the bottom of the page */}
          <div style={{height: '100vh', overflowY: 'hidden'}} className="min-h-[calc(100vh-64px)]">           
            {children}
          </div>
          {/* <Footer /> */}
          {/* <Toaster richColors /> */}
        </Providers>
      </body>
    </html>
  );
}
