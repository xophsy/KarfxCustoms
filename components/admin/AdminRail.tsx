"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logOut } from "@/app/admin/login/actions";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/customers", label: "Customers" },
];

function LogOutButton({ name }: { name: string }) {
  return (
    <form action={logOut} className="text-right md:text-left">
      <p className="hidden text-sm text-white/75 md:block">{name}</p>
      <button type="submit" className="text-xs font-semibold uppercase tracking-[0.15em] text-white/45 transition-colors hover:text-gold-500 md:mt-1">
        Log out
      </button>
    </form>
  );
}

export default function AdminRail({ name, isOwner }: { name: string; isOwner: boolean }) {
  const pathname = usePathname();
  const links = isOwner ? [...LINKS, { href: "/admin/team", label: "Team" }] : LINKS;

  return (
    <aside className="sticky top-0 z-20 flex flex-col gap-3 border-b border-white/10 bg-black px-4 pt-4 md:h-screen md:gap-8 md:border-b-0 md:border-r md:px-5 md:pb-6 md:pt-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-baseline gap-3 md:block">
          <p className="font-display text-2xl font-semibold leading-none text-gold-500 md:text-[28px]">KAR FX</p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50 md:mt-2">Shop admin</p>
        </div>
        <div className="md:hidden">
          <LogOutButton name={name} />
        </div>
      </div>

      <nav aria-label="Admin" className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-3 md:mx-0 md:flex-col md:overflow-visible md:px-0 md:pb-0">
        {links.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "shrink-0 rounded px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-gold-500/15 text-white" : "text-white/55 hover:bg-white/5 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden border-t border-white/10 pt-4 md:block">
        <LogOutButton name={name} />
      </div>
    </aside>
  );
}
