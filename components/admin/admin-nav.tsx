"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Server } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/admin/users",
      label: "Users & Access",
      icon: Users,
      active: pathname.startsWith("/admin/users"),
    },
    {
      href: "/admin/servers",
      label: "Streaming Servers",
      icon: Server,
      active: pathname.startsWith("/admin/servers"),
    },
  ];

  return (
    <nav className="flex flex-wrap items-center gap-2 border-b border-zinc-800/80 pb-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all",
              item.active
                ? "bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700/50"
                : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200",
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4",
                item.active ? "text-primary" : "text-zinc-400",
              )}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
