"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "@/convex/_generated/api";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import { cn } from "@/lib/utils";

interface ChatItemSummary {
  unreadCount?: number;
}

interface NavLinkItem {
  label: string;
  href: string;
  isActive: boolean;
  badge?: number;
  requireAuth?: boolean;
}

export function NavbarLinks() {
  const pathname = usePathname();
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const openAuth = useAuthModalStore((state) => state.open);

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

  const links: NavLinkItem[] = [
    { label: "Home", href: "/", isActive: pathname === "/" },
    { label: "Feed", href: "/feed", isActive: pathname.startsWith("/feed") },
    { label: "Lists", href: "/lists", isActive: pathname.startsWith("/lists") },
    {
      label: "Chats",
      href: "/chat",
      isActive: pathname.startsWith("/chat"),
      badge: isLoggedIn && totalUnreadChats > 0 ? totalUnreadChats : undefined,
      requireAuth: true,
    },
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className="hidden items-center gap-1.5 text-sm lg:flex"
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.requireAuth && !isLoggedIn ? "#" : link.href}
          onClick={(e) => {
            if (link.requireAuth && !isLoggedIn) {
              e.preventDefault();
              openAuth();
            }
          }}
          className={cn(
            "relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-medium transition-all duration-200",
            link.isActive
              ? "bg-white/10 font-semibold text-white shadow-xs"
              : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200",
          )}
        >
          <span>{link.label}</span>
          {link.badge !== undefined && link.badge > 0 && (
            <span className="bg-primary flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-black text-white shadow-sm">
              {link.badge > 99 ? "99+" : link.badge}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}
