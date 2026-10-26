"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import ConditionalFooter from "@/components/ConditionalFooter";

// The admin has its own layout, so the public navbar and footer stay off /admin.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  if (usePathname().startsWith("/admin")) return <>{children}</>;
  return (
    <>
      <Navbar />
      {/* pb-20 keeps page bottoms clear of the mobile Call / Quote bar */}
      <main id="main-content" className="min-h-screen pb-20 pt-20 md:pb-0">
        {children}
      </main>
      <ConditionalFooter />
    </>
  );
}
