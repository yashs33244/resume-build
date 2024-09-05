"use client";
import ProfileWrapper from "./ProfileWrapper";
import { ModeToggle } from "@repo/ui/components/Toggle";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session, status: sessionStatus } = useSession();
  if (session?.user) {
    return (
      <header className="flex items-center justify-between px-4 py-3 bg-background-dark shadow-sm">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <BookIcon className="w-6 h-6 text-primary-foreground-dark" />
          <span className="text-xl font-bold text-primary-foreground-dark">
            Resume-maker
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <ProfileWrapper />
          <ModeToggle />
        </div>
      </header>
    );
  }
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background-dark shadow-sm">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <BookIcon className="w-6 h-6 text-primary-foreground-dark" />
        <span className="text-xl font-bold text-primary-foreground-dark">
          Resume-maker
        </span>
      </Link>
      <div className="flex items-center gap-4">
        <button className="px-6 py-2 bg-purple-700 text-white rounded">
          <Link href="/api/auth/signin">Sign in</Link>
        </button>
      </div>
      {/* <ModeToggle /> */}
    </header>
  );
}

function BookIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}
