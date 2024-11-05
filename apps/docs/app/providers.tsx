"use client";
import { ReactNode, Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import { LandingLoader } from "../components/LandingLoader";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={<LandingLoader />}>
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
