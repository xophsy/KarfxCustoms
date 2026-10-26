import type { Metadata } from "next";

// Wraps the login page too, so no login check here; the signed-in shell lives in (app)/layout.tsx.
export const metadata: Metadata = {
  title: "Shop admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
