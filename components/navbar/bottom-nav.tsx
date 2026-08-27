"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Popcorn,
  Activity,
  Search,
  MessageSquare,
  User,
  List,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface ChatItemSummary {
  unreadCount?: number;
}

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const openAuth = useAuthModalStore((state) => state.open);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  // Fetch current user details for profile link, role & avatar
  const userProfile = useQuery(
    api.users.getCurrentUser,
    isLoggedIn ? {} : "skip",
  );

  const username = userProfile?.username || session.data?.user?.username;
  const userImage = userProfile?.image || session.data?.user?.image;
  const userName = userProfile?.name || session.data?.user?.name || "User";
  const userRole = userProfile?.role;

  // Query chats to calculate total unread chat messages
  const rawChatsList = useQuery(
    api.chats.getChatsList,
    isLoggedIn ? {} : "skip",
  );

  const totalUnreadChats = useMemo(() => {
    if (!rawChatsList) return 0;
    const chats = rawChatsList as unknown as ChatItemSummary[];
    return chats.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  }, [rawChatsList]);

  // Tab definitions: Home -> Feed -> Search (Center) -> Chats -> Profile
  const isHomeActive = pathname === "/";
  const isFeedActive = pathname.startsWith("/feed");
  const isSearchActive = pathname.startsWith("/search");
  const isChatActive = pathname.startsWith("/chat");
  const isProfileActive =
    isProfileDrawerOpen ||
    (!!username &&
      (pathname === `/@${username}` ||
        pathname === `/user/${username}` ||
        pathname.startsWith("/settings") ||
        pathname.startsWith("/lists")));

  const handleNavigate = (path: string) => {
    setIsProfileDrawerOpen(false);
    router.push(path);
  };

  const handleSignOut = async () => {
    setIsProfileDrawerOpen(false);
    await authClient.signOut();
    router.refresh();
  };

  return (
    <>
      <nav
        aria-label="Mobile Navigation"
        className="fixed inset-x-0 bottom-0 z-40 block border-t border-zinc-800/80 bg-zinc-950/85 px-3 pt-2 pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)] text-white shadow-2xl shadow-black/90 backdrop-blur-xl transition-all duration-300 lg:hidden"
      >
        <div className="mx-auto flex max-w-lg items-center justify-around">
          {/* 1. Home */}
          <Link
            href="/"
            prefetch={false}
            className={cn(
              "group relative flex flex-1 flex-col items-center justify-center gap-1 py-1 text-xs font-medium transition-all duration-200",
              isHomeActive
                ? "text-primary font-bold"
                : "text-zinc-400 hover:text-zinc-200",
            )}
          >
            <div className="relative flex items-center justify-center">
              <Popcorn
                className={cn(
                  "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                  isHomeActive && "text-primary scale-105",
                )}
              />
            </div>
            <span className="text-[11px] leading-tight tracking-tight">
              Home
            </span>
          </Link>

          {/* 2. Feed */}
          <Link
            href="/feed"
            prefetch={false}
            className={cn(
              "group relative flex flex-1 flex-col items-center justify-center gap-1 py-1 text-xs font-medium transition-all duration-200",
              isFeedActive
                ? "text-primary font-bold"
                : "text-zinc-400 hover:text-zinc-200",
            )}
          >
            <div className="relative flex items-center justify-center">
              <Activity
                className={cn(
                  "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                  isFeedActive && "text-primary scale-105",
                )}
              />
            </div>
            <span className="text-[11px] leading-tight tracking-tight">
              Feed
            </span>
          </Link>

          {/* 3. Search (Center) */}
          <Link
            href="/search"
            prefetch={false}
            className={cn(
              "group relative flex flex-1 flex-col items-center justify-center gap-1 py-1 text-xs font-medium transition-all duration-200",
              isSearchActive
                ? "text-primary font-bold"
                : "text-zinc-400 hover:text-zinc-200",
            )}
          >
            <div className="relative flex items-center justify-center">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
                  isSearchActive
                    ? "bg-primary text-white shadow-lg shadow-red-500/25"
                    : "border border-zinc-800 bg-zinc-900 text-zinc-300 group-hover:border-zinc-700 group-hover:text-white",
                )}
              >
                <Search className="h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-110" />
              </div>
            </div>
            <span
              className={cn(
                "text-[11px] leading-tight tracking-tight",
                isSearchActive ? "text-primary font-bold" : "text-zinc-400",
              )}
            >
              Search
            </span>
          </Link>

          {/* 4. Chats */}
          <Link
            href={isLoggedIn ? "/chat" : "#"}
            prefetch={false}
            onClick={(e) => {
              if (!isLoggedIn) {
                e.preventDefault();
                openAuth();
              }
            }}
            className={cn(
              "group relative flex flex-1 flex-col items-center justify-center gap-1 py-1 text-xs font-medium transition-all duration-200",
              isChatActive
                ? "text-primary font-bold"
                : "text-zinc-400 hover:text-zinc-200",
            )}
          >
            <div className="relative flex items-center justify-center">
              <MessageSquare
                className={cn(
                  "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                  isChatActive && "text-primary scale-105",
                )}
              />
              {totalUnreadChats > 0 && (
                <span className="bg-primary absolute -top-1 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-black text-white shadow-md">
                  {totalUnreadChats > 99 ? "99+" : totalUnreadChats}
                </span>
              )}
            </div>
            <span className="text-[11px] leading-tight tracking-tight">
              Chats
            </span>
          </Link>

          {/* 5. Profile / Sign In (Triggers Vaul Drawer when logged in) */}
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => setIsProfileDrawerOpen(true)}
              className={cn(
                "group relative flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 py-1 text-xs font-medium transition-all duration-200",
                isProfileActive
                  ? "text-primary font-bold"
                  : "text-zinc-400 hover:text-zinc-200",
              )}
            >
              <div className="relative flex items-center justify-center">
                <Avatar
                  className={cn(
                    "h-5.5 w-5.5 border transition-transform duration-200 group-hover:scale-110",
                    isProfileActive
                      ? "border-primary ring-primary/40 ring-2"
                      : "border-zinc-700",
                  )}
                >
                  {userImage && (
                    <AvatarImage
                      src={userImage}
                      alt={userName}
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback className="bg-zinc-800 text-[9px] font-bold text-white">
                    {username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className="max-w-[56px] truncate text-[11px] leading-tight tracking-tight">
                Profile
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={openAuth}
              className="group relative flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 py-1 text-xs font-medium text-zinc-400 transition-all duration-200 hover:text-zinc-200"
            >
              <div className="relative flex items-center justify-center">
                <User className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
              </div>
              <span className="text-[11px] leading-tight tracking-tight">
                Sign In
              </span>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Profile Vaul Drawer (Swipe-down to dismiss) */}
      {isLoggedIn && (
        <Drawer
          open={isProfileDrawerOpen}
          onOpenChange={setIsProfileDrawerOpen}
        >
          <DrawerContent className="mx-auto max-w-lg pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)]">
            <div className="flex flex-col gap-4 px-6 pt-2 pb-2">
              <DrawerTitle className="sr-only">Account & Menu</DrawerTitle>
              <DrawerDescription className="sr-only">
                Quick access to your profile, custom lists, settings, and account
                controls.
              </DrawerDescription>

              {/* Profile Overview Card */}
              <div
                onClick={() => handleNavigate(`/@${username}`)}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-3.5 transition-all hover:bg-zinc-900 active:scale-98"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="h-11 w-11 shrink-0 border border-zinc-700/60">
                    {userImage && (
                      <AvatarImage
                        src={userImage}
                        alt={userName}
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback className="bg-primary text-sm font-bold text-white">
                      {username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">
                      {userName}
                    </p>
                    <p className="truncate text-xs text-zinc-400">
                      @{username}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-zinc-400">
                  <span>View Profile</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>

              {/* Navigation Menu Options */}
              <div className="flex flex-col gap-2 pt-1">
                {/* My Lists */}
                <button
                  type="button"
                  onClick={() => handleNavigate("/lists")}
                  className="flex w-full cursor-pointer items-center gap-3.5 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 px-4 py-3 text-left text-sm font-semibold text-zinc-200 transition-all hover:bg-zinc-900 hover:text-white active:scale-98"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-800/80 text-zinc-300">
                    <List className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">My Lists</p>
                    <p className="text-xs text-zinc-400">
                      Custom & collaborative lists
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-500" />
                </button>

                {/* Settings */}
                <button
                  type="button"
                  onClick={() => handleNavigate("/settings")}
                  className="flex w-full cursor-pointer items-center gap-3.5 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 px-4 py-3 text-left text-sm font-semibold text-zinc-200 transition-all hover:bg-zinc-900 hover:text-white active:scale-98"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-800/80 text-zinc-300">
                    <Settings className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">Settings</p>
                    <p className="text-xs text-zinc-400">
                      Account, privacy & preferences
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-500" />
                </button>

                {/* Admin Panel (if admin/owner) */}
                {(userRole === "owner" || userRole === "admin") && (
                  <button
                    type="button"
                    onClick={() => handleNavigate("/admin/users")}
                    className="flex w-full cursor-pointer items-center gap-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-left text-sm font-semibold text-amber-300 transition-all hover:bg-amber-500/20 active:scale-98"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                      <ShieldCheck className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-amber-300">
                        Admin Panel
                      </p>
                      <p className="text-xs text-amber-400/80">
                        Manage users and moderation
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-amber-400/80" />
                  </button>
                )}
              </div>

              {/* Sign Out Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-red-900/40 bg-red-950/40 py-3 text-sm font-bold text-red-400 transition-all hover:border-red-900/60 hover:bg-red-950/60 active:scale-98"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
