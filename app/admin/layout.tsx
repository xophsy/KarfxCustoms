import type { Metadata } from "next";

// Wraps the login page too, so no login check here; the signed-in shell lives in (app)/layout.tsx.
export const metadata: Metadata = {
  title: "Shop admin",
  robots: { index: false, follow: false },
};

// The admin keeps its own type (printed sheets are sized around it); font-body re-applies the swapped variable.
const adminFonts = { "--font-display": "var(--font-bodoni)", "--font-body": "var(--font-jost)" } as React.CSSProperties;

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-body" style={adminFonts}>
      {children}
    </div>
  );
}
