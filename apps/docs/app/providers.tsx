"use client";
import { ReactNode, Suspense, useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import { SessionProvider, useSession } from "next-auth/react";
import { RecoilRoot } from "recoil";
import { Loader } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

function AuthWrapper({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (session && pathname === "/") {
      setIsNavigating(true);
      router.push("/dashboard");
    } else {
      setIsNavigating(false);
    }
  }, [session, pathname, router]);

  // Show loading state while checking authentication
  if (status === "loading" || isNavigating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <SessionProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <RecoilRoot>
            <AuthWrapper>{children}</AuthWrapper>
          </RecoilRoot>
        </ThemeProvider>
      </SessionProvider>
    </Suspense>
  );
};
