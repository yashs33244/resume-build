"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

interface ProfileSession {
  status: "loading" | "authenticated" | "unauthenticated";
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  isOpen: boolean;
  sessionData: any;
  setIsOpen: (isOpen: boolean) => void;
  handleSignIn: () => void;
  handleSignOut: () => void;
}

export function useProfileSession(): ProfileSession {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const sessionData  = session;

  const handleSignIn = () => {
    signIn();
  };

  const handleSignOut = () => {
    signOut();
  };

  return {
    status,
    user: session?.user ?? null,
    isOpen,
    sessionData,
    setIsOpen,
    handleSignIn,
    handleSignOut,
  };
}