"use client";
import { ReactNode, Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import { Loader } from "lucide-react";
import { LandingLoader } from "../components/LandingLoader";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    }>
      <SessionProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <RecoilRoot>{children}</RecoilRoot>
        </ThemeProvider>
      </SessionProvider>
    </Suspense>
  );
};
