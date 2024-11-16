"use client";

import ProfileWrapper from "./ProfileWrapper";
import Image from "next/image";
import { ModeToggle } from "@repo/ui/components/Toggle";
import Link from "next/link";
import { signOut } from "next-auth/react";
import "./Header.scss";
import { FaCircleUser } from "react-icons/fa6";
import logo from "./logo.svg";
import premium from "./premium.svg";
import { useUserStatus } from "../hooks/useUserStatus";
import { useProfileSession } from "../hooks/useProfileSession";

export default function Header() {
  const { user } = useProfileSession();
  const sessionUser = user;
  const { isPaid, refetchUser } = useUserStatus();
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
        {sessionUser ? (
          <>
            <Link href="/dashboard">
              <Image alt="logo" src={logo} width={130} />
            </Link>
            {isPaid && <Image alt="premium" src={premium} width={100} />}
          </>
        ) : (
          <Link href="/">
            <Image alt="logo" src={logo} width={130} />
          </Link>
        )}
      </div>
      {sessionUser ? (
        <div className="login-cta">
          <FaCircleUser />
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
