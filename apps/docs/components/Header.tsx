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
import { useRouter, usePathname } from "next/navigation";
import { useProfileSession } from "../hooks/useProfileSession";
import { useEffect } from "react";

export default function Header() {
  const { user } = useProfileSession();
  const sessionUser = user;
  const { isPaid, refetchUser } = useUserStatus();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async (e: any) => {
    e.preventDefault();
    await signOut({
      callbackUrl: "/?redirectType=signout",
      redirect: true,
    });
  };  

  useEffect(() => {
    if(pathname === '/select-templates/checkout') {
      return;
    }

    if (!user) {
      router.push("/");
    } else {
      router.push("/dashboard");
    }
  }, [user?.email]);

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
          <div
            className="create-cta"
            onClick={() => router.push("/api/auth/signin")}
          >
            <Link href={"/api/auth/signin"}>Create Resume</Link>
          </div>
        </div>
      )}
    </div>
  );
}
