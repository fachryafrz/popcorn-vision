"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  Search,
  Popcorn,
  Activity,
  MessageSquare,
  List,
  ShieldCheck,
  Settings,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface NavbarMobileDrawerProps {
  isLoggedIn: boolean;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string | null;
  } | null;
  role?: string;
  isSearchPage: boolean;
  onOpenAuth: () => void;
  onSignOut: () => Promise<void> | void;
}

export function NavbarMobileDrawer({
  isLoggedIn,
  user,
  role,
  isSearchPage,
  onOpenAuth,
  onSignOut,
}: NavbarMobileDrawerProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchValue, setMobileSearchValue] = useState("");

  const handleMobileSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = mobileSearchValue.trim();
    setMobileMenuOpen(false);
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/search");
    }
  };

  const handleNavigate = (path: string) => {
    setMobileMenuOpen(false);
    router.push(path);
  };

  return (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger className="cursor-pointer rounded-full border border-zinc-800 bg-zinc-900/60 p-2 text-zinc-300 hover:text-white">
        <Menu className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-3/4 max-w-xs flex-col gap-6 rounded-l-3xl border-l border-zinc-800 bg-zinc-950/95 p-6 text-white backdrop-blur-xl"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Mobile navigation links and profile controls
        </SheetDescription>

        {!isSearchPage && (
          <form onSubmit={handleMobileSearchSubmit} className="relative mt-6">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={mobileSearchValue}
              onChange={(e) => setMobileSearchValue(e.target.value)}
              placeholder="Search movies, shows…"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-2.5 pr-4 pl-9 text-sm text-white transition-all outline-none placeholder:text-zinc-500 focus:border-zinc-500"
            />
          </form>
        )}

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
                href="/chat"
                prefetch={false}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 hover:text-white"
              >
                <MessageSquare className="h-4 w-4" />
                Chats
              </Link>

              <Link
                href="/lists"
                prefetch={false}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 hover:text-white"
              >
                <List className="h-4 w-4" />
                My Lists
              </Link>
            </>
          )}
        </nav>

        <hr className="border-zinc-800" />

        <div className="mt-auto flex flex-col gap-4">
          {isLoggedIn && user ? (
            <div className="flex w-full flex-col gap-4">
              <div className="flex flex-col">
                {(role === "owner" || role === "admin") && (
                  <Link
                    href="/admin/users"
                    prefetch={false}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-amber-400 hover:bg-zinc-900 hover:text-amber-300"
                  >
                    <ShieldCheck className="h-4 w-4 text-amber-400" />
                    Admin Panel
                  </Link>
                )}

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
                variant={"ghost"}
                onClick={() => handleNavigate(`/@${user.username}`)}
                className="flex h-fit items-center gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-3 text-left"
              >
                <Avatar className="h-9 w-9 shrink-0 border border-zinc-700/50">
                  {user.image && (
                    <AvatarImage
                      src={user.image}
                      alt={user.username || "User"}
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback className="bg-primary text-xs font-bold text-white">
                    {user.username?.charAt(0).toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    @{user.username}
                  </p>
                </div>
              </Button>

              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignOut();
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
                onOpenAuth();
              }}
              className="w-full cursor-pointer rounded-2xl bg-white py-3 font-bold text-black hover:bg-zinc-200"
            >
              Sign In
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
