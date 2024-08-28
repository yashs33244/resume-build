"use client";

import { usePathname } from "next/navigation";
import Header from "./Header"; // Adjust the import path as necessary

export default function ConditionalHeader() {
  const pathname = usePathname();

  // Don't render the header on the signin page
  if (pathname === "/signin") {
    return null;
  }

  return <Header />;
}
