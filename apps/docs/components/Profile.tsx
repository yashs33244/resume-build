import { useSession } from "next-auth/react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuItem } from "@repo/ui/components/ui/dropdown-menu";
import { Button } from "@repo/ui/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@repo/ui/components/ui/avatar";
import Link from "next/link";

export function Profile() {
  const { data: session, status } = useSession();

  if (status !== "authenticated") {
    return <Link href="/api/auth/signin">Sign in</Link>;
  }

  const user = session.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profilePhoto || "/placeholder-user.jpg"} alt={user.name || "User"} />
            <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center gap-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profilePhoto || "/placeholder-user.jpg"} alt={user.name || "User"} />
            <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5 leading-none">
            <div className="font-semibold">{user.name || "User"}</div>
            <div className="text-sm text-muted-foreground">{user.email || "user@example.com"}</div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <div className="h-4 w-4" />
            <span>View Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <div className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/api/auth/signout" className="flex items-center gap-2" prefetch={false}>
            <div className="h-4 w-4" />
            <span>Log Out</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}