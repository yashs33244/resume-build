"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Don't render the header on the signin page
  if (
    pathname === "/signin" ||
    pathname === "/select-templates" ||
    pathname === "/select-templates/editor"
  ) {
    return null;
  }

  return <Footer />;
}
