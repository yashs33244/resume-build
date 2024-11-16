"use client";

import { signIn } from "next-auth/react";
import { Button } from "@repo/ui/components/ui/button";
import { useProfileSession } from "../hooks/useProfileSession";

export const AppbarAuth = ({ isInMenu = false }: { isInMenu?: boolean }) => {
  const { user } = useProfileSession();
  //const router = useRouter();

  return (
    !user && (
      <Button
        size={"sm"}
        variant={isInMenu ? "navLink" : "outline"}
        id="navbar-default"
        onClick={() => {
          signIn();
        }}
      >
        Login
      </Button>
    )
  );
};
