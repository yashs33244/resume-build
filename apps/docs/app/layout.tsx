import { ReactNode } from "react";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@repo/ui/lib/utils";
import type { Metadata } from "next";
import "@repo/ui/globals.css";
import { Providers } from "./providers";
import ConditionalHeader from "../components/ConditionalHeader";
import ConditionalFooter from "../components/ConditionalFooter";

// import { Toaster } from 'sonner';
// import NextTopLoader from 'nextjs-toploader';

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default async function RootLxayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased ",
          fontSans.variable,
        )}
      >
        <Providers>
          <ConditionalHeader />
          {/* <NextTopLoader color="#2E78C7" height={2} /> */}
          {/* this is done as to keep footer in the bottom of the page */}
          <div>{children}</div>
          <ConditionalFooter />
          {/* <Toaster richColors /> */}
        </Providers>
      </body>
    </html>
  );
}
