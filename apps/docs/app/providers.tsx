"use client";
import { ReactNode, Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { SessionProvider, useSession } from "next-auth/react";
import { RecoilRoot } from "recoil";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

// Auth check component that handles redirection
function AuthWrapper({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Redirect to dashboard if authenticated and on landing page
  if (session && window.location.pathname === "/") {
    router.push("/dashboard");
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
