"use client";

import ProfileWrapper from "./ProfileWrapper";
import Image from "next/image";
import { ModeToggle } from "@repo/ui/components/Toggle";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import "./Header.scss";
import logo from "./logo.svg";

export default function Header() {
  const { data: session, status: sessionStatus } = useSession();

  const handleSignOut = async (e: any) => {
    e.preventDefault();
    await signOut({
      callbackUrl: "/?redirectType=signout",
      redirect: true,
    });
  };

  return (
    <div className="header-container">
      <div className="logo-container">
        <Link href="/">
          <Image alt="logo" src={logo} width={130} />
        </Link>
      </div>
      {session?.user ? (
        <div className="login-cta">
          <a href="/" onClick={handleSignOut}>
            Logout
          </a>
        </div>
      ) : (
        <div className="action-container">
          <div className="login-cta">
            <Link href="/api/auth/signin">Login</Link>
          </div>
          <div className="create-cta">
            <Link href={"/api/auth/signin"}>Create Resume</Link>
          </div>
        </div>
      )}
    </div>
  );
}
