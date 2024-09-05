"use client";
import ProfileWrapper from "./ProfileWrapper";
import Image from "next/image";
import { ModeToggle } from "@repo/ui/components/Toggle";
import Link from "next/link";
import { useSession } from "next-auth/react";
import './Header.scss';
import logo from "./logo.svg";

export default function Header() {
  const { data: session, status: sessionStatus } = useSession();
  // if (session?.user) {
  //   return (
  //     <header className="flex items-center justify-between px-4 py-3 bg-background-dark shadow-sm">
  //       <Link href="/" className="flex items-center gap-2" prefetch={false}>
  //         <BookIcon className="w-6 h-6 text-primary-foreground-dark" />
  //         <span className="text-xl font-bold text-primary-foreground-dark">
  //           Resume-maker
  //         </span>
  //       </Link>
  //       <div className="flex items-center gap-4">
  //         <ProfileWrapper />
  //         <ModeToggle />
  //       </div>
  //     </header>
  //   );
  // }
  return (
    <div className="header-container">
      <div className="logo-container">
        <Image alt="logo" src={logo} width={100} />
      </div>
      <div className="login-cta">Login</div>
    </div>
    // <header className="flex items-center justify-between px-4 py-3 bg-background-dark shadow-sm">
    //   <Link href="#" className="flex items-center gap-2" prefetch={false}>
    //     <BookIcon className="w-6 h-6 text-primary-foreground-dark" />
    //     <span className="text-xl font-bold text-primary-foreground-dark">
    //       Resume-maker
    //     </span>
    //   </Link>
    //   <div className="flex items-center gap-4">
    //     <button className="px-6 py-2 bg-purple-700 text-white rounded">
    //       <Link href="/api/auth/signin">Sign in</Link>
    //     </button>
    //   </div>
    // </header>
  );
}
