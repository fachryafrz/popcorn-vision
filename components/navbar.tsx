"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import {
  LogOut,
  Menu,
  Search,
  X,
  ChevronDown,
  Settings,
  Bell,
  Trash2,
  Loader2,
  MessageSquare,
  Activity,
  Users,
  Popcorn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import AuthModal from "./auth-modal";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export default function Navbar() {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const user = session.data?.user;
  const router = useRouter();

  // Notifications query & mutations
  const notifications = useQuery(
    api.social.getNotifications,
    isLoggedIn ? {} : "skip",
  );
  const acceptFriendRequest = useMutation(api.social.acceptFriendRequest);
  const rejectFriendRequest = useMutation(api.social.rejectFriendRequest);
  const acceptWatchlistInvite = useMutation(api.sharedWatchlists.acceptWatchlistInvite);
  const declineWatchlistInvite = useMutation(api.sharedWatchlists.declineWatchlistInvite);
  const markRead = useMutation(api.social.markNotificationRead);
  const clearAll = useMutation(api.social.clearAllNotifications);

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  // Track current time in state so formatTime is pure during render
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (ts: number) => {
    const diff = now - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const {
    isOpen: isAuthOpen,
    open: openAuth,
    close: closeAuth,
  } = useAuthModalStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.reload();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchValue.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
    else router.push("/search");
  };

  const handleSearchClear = () => {
    setSearchValue("");
    searchInputRef.current?.focus();
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 z-40 transition-all duration-500",
          scrolled ? "top-4 px-4 sm:px-10 md:px-16" : "top-0",
        )}
      >
        <div
          className={cn(
            "grid w-full grid-cols-2 transition-all duration-500 lg:grid-cols-3",
            scrolled
              ? "bg-background/80 border-border/80 mx-auto max-w-5xl rounded-full border px-6 py-2 shadow-xl shadow-black/60 backdrop-blur-md lg:pr-2"
              : "mx-auto max-w-7xl border border-transparent px-6 py-4 sm:px-12 md:px-16",
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            prefetch={false}
            className="flex max-w-fit cursor-pointer items-center gap-2"
          >
            <img
              src="/logo/popcorn.png"
              alt={siteConfig.name}
              className={cn(
                "object-contain transition-all duration-500",
                scrolled ? "h-8 w-8" : "h-10 w-10",
              )}
            />
            <span
              className={cn(
                "bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text font-black tracking-wider text-transparent uppercase transition-all duration-500",
                scrolled ? "text-lg" : "text-xl",
              )}
            >
              POVI
            </span>
          </Link>

          {/* Search Bar (Desktop Center) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden items-center justify-self-center lg:flex"
          >
            <div
              className={cn(
                "relative flex h-9 items-center overflow-hidden rounded-full border border-zinc-800/65 bg-zinc-900/60 transition-all duration-300",
                scrolled ? "w-48 lg:w-64" : "w-56 lg:w-72",
                isSearchFocused
                  ? "border-zinc-700/80 bg-zinc-900/90 ring-1 ring-zinc-800"
                  : "bg-zinc-900/40",
              )}
            >
              <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
              <input
                ref={searchInputRef}
                id="navbar-search"
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search movies, shows…"
                className="w-full bg-transparent pr-7 pl-8 text-xs text-white outline-none placeholder:text-zinc-500"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={handleSearchClear}
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-zinc-500 transition-colors hover:text-white"
                  aria-label="Clear"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* User Controls (Desktop) */}
          <div className="hidden items-center gap-4 justify-self-end lg:flex">
            <Link
              href="/feed"
              prefetch={false}
              className="relative cursor-pointer rounded-full border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 transition-all hover:border-zinc-700 hover:text-white focus:outline-none"
              title="Activity Feed"
            >
              <Activity className="h-4 w-4" />
            </Link>
            {isLoggedIn && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger className="relative cursor-pointer rounded-full border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 transition-all hover:border-zinc-700 hover:text-white focus:outline-none">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="ring-background absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[8px] font-black text-white ring-2">
                        {unreadCount}
                      </span>
                    )}
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="animate-in fade-in-50 zoom-in-95 z-50 w-80 rounded-2xl border border-zinc-800 bg-zinc-950 p-1 text-white shadow-2xl shadow-black/60 duration-200"
                  >
                    <div className="flex items-center justify-between px-3.5 py-2">
                      <span className="text-[10px] font-black tracking-wider text-zinc-400 uppercase">
                        Notifications
                      </span>
                      {notifications && notifications.length > 0 && (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (confirm("Clear all notifications?")) {
                              await clearAll();
                            }
                          }}
                          className="flex cursor-pointer items-center gap-1 text-[10px] font-bold text-zinc-500 transition-colors hover:text-red-400"
                        >
                          <Trash2 className="h-3 w-3" />
                          Clear All
                        </button>
                      )}
                    </div>

                    <DropdownMenuSeparator className="my-1 bg-zinc-800" />

                    <div className="max-h-80 overflow-y-auto py-1">
                      {!notifications ? (
                        <div className="flex items-center justify-center py-6 text-xs text-zinc-500">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-500" />
                          Loading...
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-zinc-500">
                          <Bell className="text-zinc-850 h-8 w-8" />
                          <span className="text-xs font-semibold">
                            All caught up!
                          </span>
                        </div>
                      ) : (
                        notifications.map((notif) => {
                          return (
                            <div
                              key={notif._id}
                              onClick={async () => {
                                if (!notif.read) {
                                  await markRead({ notifId: notif._id });
                                }
                                if (notif.type === "chat_message") {
                                  if (notif.mediaId) {
                                    localStorage.setItem(
                                      "active_chat_id",
                                      notif.mediaId,
                                    );
                                  }
                                  router.push(`/chat`);
                                } else if (
                                  notif.type === "comment_reply" ||
                                  notif.type === "comment_mention"
                                ) {
                                  if (notif.mediaType && notif.mediaId) {
                                    router.push(
                                      `/${notif.mediaType}/${notif.mediaId}`,
                                    );
                                  }
                                } else if (notif.sender) {
                                  router.push(`/@/${notif.sender.username}`);
                                }
                              }}
                              className={cn(
                                "group relative flex cursor-pointer items-start gap-3 rounded-xl border border-transparent p-3 transition-all hover:border-zinc-800/40 hover:bg-zinc-900",
                                !notif.read
                                  ? "bg-blue-600/5 hover:bg-blue-600/10"
                                  : "",
                              )}
                            >
                              <Avatar className="h-8 w-8 border border-zinc-800">
                                {notif.sender?.image && (
                                  <AvatarImage
                                    src={notif.sender.image}
                                    alt={notif.sender.name}
                                    className="object-cover"
                                  />
                                )}
                                <AvatarFallback className="bg-zinc-800 text-xs font-bold text-zinc-300">
                                  {notif.sender?.name
                                    ?.charAt(0)
                                    .toUpperCase() || "?"}
                                </AvatarFallback>
                              </Avatar>

                              <div className="min-w-0 flex-1">
                                <p className="text-xs leading-normal text-zinc-200">
                                  <span className="font-bold text-white">
                                    {notif.sender?.name}
                                  </span>{" "}
                                  {notif.type === "friend_request" &&
                                    "sent you a friend request."}
                                  {notif.type === "friend_accepted" &&
                                    "accepted your friend request."}
                                  {notif.type === "comment_reply" &&
                                    "replied to your comment."}
                                  {notif.type === "comment_mention" &&
                                    "mentioned you in a comment."}
                                  {notif.type === "chat_message" &&
                                    "sent you a message."}
                                  {notif.type === "watchlist_invite" &&
                                    "invited you to join a shared watchlist."}
                                </p>
                                <span className="mt-1 block text-[10px] font-semibold text-zinc-500">
                                  {formatTime(notif.createdAt)}
                                </span>

                                {/* Friend Request Actions */}
                                {notif.type === "friend_request" &&
                                  notif.sender && (
                                    <div
                                      className="mt-2 flex items-center gap-2"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Button
                                        size="xs"
                                        onClick={async (e) => {
                                          e.stopPropagation();
                                          if (notif.sender)
                                            await acceptFriendRequest({
                                              targetUserId: notif.sender.userId,
                                            });
                                        }}
                                        className="h-7 cursor-pointer rounded-lg bg-blue-600 px-3 text-[10px] font-bold text-white hover:bg-blue-500"
                                      >
                                        Accept
                                      </Button>
                                      <Button
                                        size="xs"
                                        variant="outline"
                                        onClick={async (e) => {
                                          e.stopPropagation();
                                          if (notif.sender)
                                            await rejectFriendRequest({
                                              targetUserId: notif.sender.userId,
                                            });
                                        }}
                                        className="h-7 cursor-pointer rounded-lg border-zinc-800 px-3 text-[10px] font-bold text-zinc-400 hover:bg-zinc-900 hover:text-white"
                                      >
                                        Decline
                                      </Button>
                                    </div>
                                  )}

                                {/* Watchlist Invite Actions */}
                                {notif.type === "watchlist_invite" &&
                                  notif.mediaId && (
                                    <div
                                      className="mt-2 flex items-center gap-2"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Button
                                        size="xs"
                                        onClick={async (e) => {
                                          e.stopPropagation();
                                          await acceptWatchlistInvite({
                                            watchlistId: notif.mediaId as Id<"sharedWatchlists">,
                                          });
                                          toast.success("Watchlist invitation accepted!");
                                          router.push(`/shared-watchlists/${notif.mediaId}`);
                                        }}
                                        className="h-7 cursor-pointer rounded-lg bg-blue-600 px-3 text-[10px] font-bold text-white hover:bg-blue-500"
                                      >
                                        Accept
                                      </Button>
                                      <Button
                                        size="xs"
                                        variant="outline"
                                        onClick={async (e) => {
                                          e.stopPropagation();
                                          await declineWatchlistInvite({
                                            watchlistId: notif.mediaId as Id<"sharedWatchlists">,
                                          });
                                          toast.success("Watchlist invitation declined.");
                                        }}
                                        className="h-7 cursor-pointer rounded-lg border-zinc-800 px-3 text-[10px] font-bold text-zinc-400 hover:bg-zinc-900 hover:text-white"
                                      >
                                        Decline
                                      </Button>
                                    </div>
                                  )}
                              </div>

                              {/* Mark read button/dot */}
                              {!notif.read && (
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    await markRead({ notifId: notif._id });
                                  }}
                                  className="absolute top-3 right-3 cursor-pointer text-blue-500 hover:text-blue-400"
                                  title="Mark as read"
                                >
                                  <span className="block h-1.5 w-1.5 rounded-full bg-blue-500" />
                                </button>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 py-1.5 pr-3 pl-1.5 text-sm transition-all hover:border-zinc-700 hover:bg-zinc-800 focus:outline-none">
                  <Avatar className="h-7 w-7">
                    {user?.image && (
                      <AvatarImage
                        src={user.image}
                        alt={user.username || "User"}
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback className="bg-blue-600 text-xs font-bold text-white">
                      {user?.username?.charAt(0).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-[110px] truncate font-semibold text-zinc-200">
                    {user?.username}
                  </span>
                  <ChevronDown className="ml-0.5 h-3.5 w-3.5 text-zinc-400" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-52 rounded-2xl border border-zinc-800 bg-zinc-950 p-1 shadow-2xl shadow-black/60"
                >
                  {/* User header — plain div, not GroupLabel (avoids Group context requirement) */}
                  <Button
                    onClick={() => router.push(`/@/${user?.username}`)}
                    variant={"ghost"}
                    className="mb-1 h-fit w-full flex-col items-start rounded-xl px-3 py-2"
                  >
                    <p className="truncate text-sm font-bold text-white">
                      {user?.name}
                    </p>
                    <p className="truncate text-xs text-zinc-500">
                      @{user?.username}
                    </p>
                  </Button>

                  <DropdownMenuSeparator className="my-1 bg-zinc-800" />

                  <DropdownMenuItem
                    onClick={() => router.push("/chat")}
                    className="cursor-pointer rounded-xl px-3 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white"
                  >
                    <MessageSquare className="mr-2 h-4 w-4 text-zinc-400" />
                    Chats
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/shared-watchlists")}
                    className="cursor-pointer rounded-xl px-3 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white"
                  >
                    <Users className="mr-2 h-4 w-4 text-zinc-400" />
                    Shared Watchlists
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/settings")}
                    className="cursor-pointer rounded-xl px-3 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white"
                  >
                    <Settings className="mr-2 h-4 w-4 text-zinc-400" />
                    Settings
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1 bg-zinc-800" />

                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer rounded-xl px-3 py-2 text-red-400 hover:bg-red-950/60 hover:text-red-300 focus:bg-red-950/60 focus:text-red-300"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={openAuth}
                className="rounded-full bg-white px-6 py-2 text-sm font-bold text-black shadow-lg hover:bg-zinc-200"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Controls (Bell + Hamburger Drawer) */}
          <div className="flex items-center gap-3 justify-self-end lg:hidden">
            {isLoggedIn && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger className="hover:border-zinc-705 relative cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 transition-all hover:text-white focus:outline-none">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="ring-background absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-blue-600 text-[8px] font-black text-white ring-2">
                        {unreadCount}
                      </span>
                    )}
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="animate-in fade-in-50 zoom-in-95 z-50 w-76 rounded-2xl border border-zinc-800 bg-zinc-950 p-1 text-white shadow-2xl duration-200"
                  >
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-[10px] font-black tracking-wider text-zinc-400 uppercase">
                        Notifications
                      </span>
                      {notifications && notifications.length > 0 && (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (confirm("Clear all notifications?")) {
                              await clearAll();
                            }
                          }}
                          className="flex cursor-pointer items-center gap-1 text-[10px] font-bold text-zinc-500 transition-colors hover:text-red-400"
                        >
                          <Trash2 className="h-3 w-3" />
                          Clear All
                        </button>
                      )}
                    </div>

                    <DropdownMenuSeparator className="my-1 bg-zinc-800" />

                    <div className="max-h-80 overflow-y-auto py-1">
                      {!notifications ? (
                        <div className="flex items-center justify-center py-6 text-xs text-zinc-500">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-500" />
                          Loading...
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-zinc-500">
                          <Bell className="h-8 w-8 text-zinc-800" />
                          <span className="text-xs font-semibold">
                            All caught up!
                          </span>
                        </div>
                      ) : (
                        notifications.map((notif) => {
                          return (
                            <div
                              key={notif._id}
                              onClick={async () => {
                                if (!notif.read) {
                                  await markRead({ notifId: notif._id });
                                }
                                if (notif.type === "chat_message") {
                                  if (notif.mediaId) {
                                    localStorage.setItem(
                                      "active_chat_id",
                                      notif.mediaId,
                                    );
                                  }
                                  router.push(`/chat`);
                                } else if (
                                  notif.type === "comment_reply" ||
                                  notif.type === "comment_mention"
                                ) {
                                  if (notif.mediaType && notif.mediaId) {
                                    router.push(
                                      `/${notif.mediaType}/${notif.mediaId}`,
                                    );
                                  }
                                } else if (notif.sender) {
                                  router.push(`/@/${notif.sender.username}`);
                                }
                              }}
                              className={cn(
                                "group relative flex cursor-pointer items-start gap-2.5 rounded-xl border border-transparent p-2.5 transition-all hover:border-zinc-800/40 hover:bg-zinc-900",
                                !notif.read
                                  ? "bg-blue-600/5 hover:bg-blue-600/10"
                                  : "",
                              )}
                            >
                              <Avatar className="h-7 w-7 border border-zinc-800">
                                {notif.sender?.image && (
                                  <AvatarImage
                                    src={notif.sender.image}
                                    alt={notif.sender.name}
                                    className="object-cover"
                                  />
                                )}
                                <AvatarFallback className="bg-zinc-800 text-[10px] font-bold text-zinc-300">
                                  {notif.sender?.name
                                    ?.charAt(0)
                                    .toUpperCase() || "?"}
                                </AvatarFallback>
                              </Avatar>

                              <div className="min-w-0 flex-1">
                                <p className="text-xs leading-normal text-zinc-200">
                                  <span className="font-bold text-white">
                                    {notif.sender?.name}
                                  </span>{" "}
                                  {notif.type === "friend_request" &&
                                    "sent you a friend request."}
                                  {notif.type === "friend_accepted" &&
                                    "accepted your friend request."}
                                  {notif.type === "comment_reply" &&
                                    "replied to your comment."}
                                  {notif.type === "comment_mention" &&
                                    "mentioned you in a comment."}
                                  {notif.type === "chat_message" &&
                                    "sent you a message."}
                                  {notif.type === "watchlist_invite" &&
                                    "invited you to join a shared watchlist."}
                                </p>
                                <span className="mt-1 block text-[10px] font-semibold text-zinc-500">
                                  {formatTime(notif.createdAt)}
                                </span>

                                {/* Friend Request Actions */}
                                {notif.type === "friend_request" &&
                                  notif.sender && (
                                    <div
                                      className="mt-2 flex items-center gap-2"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Button
                                        size="xs"
                                        onClick={async (e) => {
                                          e.stopPropagation();
                                          if (notif.sender)
                                            await acceptFriendRequest({
                                              targetUserId: notif.sender.userId,
                                            });
                                        }}
                                        className="h-7 cursor-pointer rounded-lg bg-blue-600 px-3 text-[10px] font-bold text-white hover:bg-blue-500"
                                      >
                                        Accept
                                      </Button>
                                      <Button
                                        size="xs"
                                        variant="outline"
                                        onClick={async (e) => {
                                          e.stopPropagation();
                                          if (notif.sender)
                                            await rejectFriendRequest({
                                              targetUserId: notif.sender.userId,
                                            });
                                        }}
                                        className="h-7 cursor-pointer rounded-lg border-zinc-800 px-3 text-[10px] font-bold text-zinc-400 hover:bg-zinc-900 hover:text-white"
                                      >
                                        Decline
                                      </Button>
                                    </div>
                                  )}

                                {/* Watchlist Invite Actions */}
                                {notif.type === "watchlist_invite" &&
                                  notif.mediaId && (
                                    <div
                                      className="mt-2 flex items-center gap-2"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Button
                                        size="xs"
                                        onClick={async (e) => {
                                          e.stopPropagation();
                                          await acceptWatchlistInvite({
                                            watchlistId: notif.mediaId as Id<"sharedWatchlists">,
                                          });
                                          toast.success("Watchlist invitation accepted!");
                                          router.push(`/shared-watchlists/${notif.mediaId}`);
                                        }}
                                        className="h-7 cursor-pointer rounded-lg bg-blue-600 px-3 text-[10px] font-bold text-white hover:bg-blue-500"
                                      >
                                        Accept
                                      </Button>
                                      <Button
                                        size="xs"
                                        variant="outline"
                                        onClick={async (e) => {
                                          e.stopPropagation();
                                          await declineWatchlistInvite({
                                            watchlistId: notif.mediaId as Id<"sharedWatchlists">,
                                          });
                                          toast.success("Watchlist invitation declined.");
                                        }}
                                        className="h-7 cursor-pointer rounded-lg border-zinc-800 px-3 text-[10px] font-bold text-zinc-400 hover:bg-zinc-900 hover:text-white"
                                      >
                                        Decline
                                      </Button>
                                    </div>
                                  )}
                              </div>

                              {/* Mark read dot */}
                              {!notif.read && (
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    await markRead({ notifId: notif._id });
                                  }}
                                  className="absolute top-2.5 right-2.5 cursor-pointer text-blue-500 hover:text-blue-400"
                                  title="Mark as read"
                                >
                                  <span className="block h-1.5 w-1.5 rounded-full bg-blue-500" />
                                </button>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* Mobile Menu Button & Drawer via Shadcn Sheet */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger className="border-zinc-805 cursor-pointer rounded-xl border bg-zinc-900/60 p-2 text-zinc-300 hover:text-white">
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent
                side="right"
                className="flex w-3/4 max-w-xs flex-col gap-6 rounded-l-3xl border-l border-zinc-800 bg-zinc-950/95 p-6 text-white backdrop-blur-xl"
              >
                <SheetTitle className="sr-only">
                  Mobile Navigation Menu
                </SheetTitle>
                <SheetDescription className="sr-only">
                  {siteConfig.name} mobile directory links
                </SheetDescription>

                {/* Mobile Search */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const q = searchValue.trim();
                    setMobileMenuOpen(false);
                    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
                    else router.push("/search");
                  }}
                  className="relative mt-6"
                >
                  <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search movies, shows…"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-2.5 pr-4 pl-9 text-sm text-white transition-all outline-none placeholder:text-zinc-500 focus:border-zinc-500"
                  />
                </form>

                <nav className="mt-4 flex flex-col gap-4 text-base font-semibold text-zinc-300">
                  <Link
                    href="/"
                    prefetch={false}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 hover:text-white"
                  >
                    <Popcorn className="h-4 w-4" />
                    Home
                  </Link>
                  <Link
                    href="/feed"
                    prefetch={false}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 hover:text-white"
                  >
                    <Activity className="h-4 w-4" />
                    Feed
                  </Link>
                  <Link
                    href="/search"
                    prefetch={false}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 hover:text-white"
                  >
                    <Search className="h-4 w-4" />
                    Search
                  </Link>
                  {isLoggedIn && (
                    <>
                      <Link
                        href="/shared-watchlists"
                        prefetch={false}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 hover:text-white"
                      >
                        <Users className="h-4 w-4" />
                        Shared Watchlists
                      </Link>
                      <Link
                        href="/chat"
                        prefetch={false}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 hover:text-white"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Chat
                      </Link>
                    </>
                  )}
                </nav>

                <hr className="border-zinc-800" />

                <div className="mt-auto flex flex-col gap-4">
                  {isLoggedIn ? (
                    <div className="flex w-full flex-col gap-4">
                      <Button
                        variant={"ghost"}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          router.push(`/@/${user?.username}`);
                        }}
                        className="flex h-fit items-center gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-3"
                      >
                        <Avatar className="h-9 w-9 border border-zinc-700/50">
                          {user?.image && (
                            <AvatarImage
                              src={user.image}
                              alt={user.username || "User"}
                              className="object-cover"
                            />
                          )}
                          <AvatarFallback className="bg-blue-600 text-xs font-bold text-white">
                            {user?.username?.charAt(0).toUpperCase() ?? "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1 text-left">
                          <p className="truncate text-sm font-bold text-white">
                            {user?.name}
                          </p>
                          <p className="truncate text-xs text-zinc-500">
                            @{user?.username}
                          </p>
                        </div>
                      </Button>

                      <div className="flex flex-col gap-2">
                        <Link
                          href="/settings"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-zinc-300 transition-all hover:bg-zinc-900 hover:text-white"
                        >
                          <Settings className="h-4 w-4 text-zinc-400" />
                          Settings
                        </Link>
                      </div>

                      <Button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleSignOut();
                        }}
                        className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-red-900/40 bg-red-950/40 py-5 font-semibold text-red-400 hover:border-red-900/60 hover:bg-red-950/60"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuth();
                      }}
                      className="w-full cursor-pointer rounded-2xl bg-white py-3 font-bold text-black hover:bg-zinc-200"
                    >
                      Sign In
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Global AuthModal */}
      <AuthModal isOpen={isAuthOpen} onClose={closeAuth} />
    </>
  );
}
