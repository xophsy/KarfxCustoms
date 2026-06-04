"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

// Hides the global footer on the portfolio page (immersive gallery view);
// renders it normally on every other route.
export default function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname === "/portfolio") return null;
  return <Footer />;
}
