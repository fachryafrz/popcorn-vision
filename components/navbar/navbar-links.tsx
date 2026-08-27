"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

interface ChatItemSummary {
  unreadCount?: number;
}

interface NavbarLinksProps {
  scrolled?: boolean;
}

export function NavbarLinks({ scrolled = false }: NavbarLinksProps) {
  const pathname = usePathname();
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;

  // Query chats to calculate total unread messages count
  const rawChatsList = useQuery(
    api.chats.getChatsList,
    isLoggedIn ? {} : "skip",
  );

  const totalUnreadChats = useMemo(() => {
    if (!rawChatsList) return 0;
    const chats = rawChatsList as unknown as ChatItemSummary[];
    return chats.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  }, [rawChatsList]);

  const links = [
    { label: "Home", href: "/", isActive: pathname === "/" },
    { label: "Feed", href: "/feed", isActive: pathname.startsWith("/feed") },
    { label: "Lists", href: "/lists", isActive: pathname.startsWith("/lists") },
    ...(isLoggedIn
      ? [
          {
            label: "Chats",
            href: "/chat",
            isActive: pathname.startsWith("/chat"),
            badge: totalUnreadChats > 0 ? totalUnreadChats : undefined,
          },
        ]
      : []),
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className={cn(
        "hidden items-center transition-all duration-300 lg:flex",
        scrolled ? "gap-5 text-xs" : "gap-6 text-sm",
      )}
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          prefetch={false}
          className={cn(
            "relative flex items-center gap-1.5 py-1 font-medium transition-colors duration-200",
            link.isActive
              ? "text-white font-semibold"
              : "text-zinc-400 hover:text-zinc-200",
          )}
        >
          <span>{link.label}</span>
          {link.badge !== undefined && link.badge > 0 && (
            <span className="bg-primary flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-black text-white shadow-sm">
              {link.badge > 99 ? "99+" : link.badge}
            </span>
          )}
          {link.isActive && (
            <span className="bg-primary absolute -bottom-0.5 inset-x-0 h-0.5 rounded-full shadow-[0_0_8px_rgba(229,9,20,0.8)]" />
          )}
        </Link>
      ))}
    </nav>
  );
}
