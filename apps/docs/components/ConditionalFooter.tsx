"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Don't render the header on the signin page
  if (pathname === "/signin") {
    return null;
  }

  return <Footer />;
}
