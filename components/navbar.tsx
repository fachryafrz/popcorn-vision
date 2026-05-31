"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { LogOut, Menu, Search, X, ChevronDown, Settings } from "lucide-react";
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
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export default function Navbar() {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const user = session.data?.user;
  const router = useRouter();

  const { isOpen: isAuthOpen, open: openAuth, close: closeAuth } = useAuthModalStore();
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
      <header className={cn("fixed inset-x-0 z-40 transition-all duration-500", scrolled ? "top-4 px-4 sm:px-10 md:px-16" : "top-0")}>
        <div className={cn("w-full flex items-center justify-between transition-all duration-500", scrolled ? "max-w-5xl mx-auto px-6 md:pr-2 py-2 bg-background/80 backdrop-blur-md border border-border/80 rounded-full shadow-xl shadow-black/60" : "max-w-7xl mx-auto px-6 sm:px-12 md:px-16 py-4 border border-transparent")}>
          {/* Logo */}
          <Link href="/" prefetch={false} className="flex items-center gap-2 cursor-pointer">
            <img
              src="/logo/popcorn.png"
              alt={siteConfig.name}
              className={cn("object-contain transition-all duration-500", scrolled ? "h-8 w-8" : "h-10 w-10")}
            />
            <span className={cn("uppercase font-black tracking-wider bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent transition-all duration-500", scrolled ? "text-lg" : "text-xl")}>
              POVI
            </span>
          </Link>

          {/* Search Bar (Desktop Center) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center"
          >
            <div
              className={cn(
                "relative flex items-center h-9 rounded-full bg-zinc-900/60 border border-zinc-800/65 transition-all duration-300 overflow-hidden",
                scrolled ? "w-48 lg:w-64" : "w-56 lg:w-72",
                isSearchFocused ? "bg-zinc-900/90 border-zinc-700/80 ring-1 ring-zinc-800" : "bg-zinc-900/40"
              )}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
              <input
                ref={searchInputRef}
                id="navbar-search"
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search movies, shows…"
                className="w-full bg-transparent text-xs text-white placeholder:text-zinc-500 outline-none pl-8 pr-7"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={handleSearchClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  aria-label="Clear"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* User Controls (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full pl-1.5 pr-3 py-1.5 text-sm hover:bg-zinc-800 hover:border-zinc-700 transition-all cursor-pointer focus:outline-none"
                >
                  <Avatar className="h-7 w-7">
                    {user?.image && (
                      <AvatarImage src={user.image} alt={user.username || "User"} className="object-cover" />
                    )}
                    <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
                      {user?.username?.charAt(0).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-zinc-200 truncate max-w-[110px]">
                    {user?.username}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-zinc-400 ml-0.5" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-52 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/60 p-1"
                >
                  {/* User header — plain div, not GroupLabel (avoids Group context requirement) */}
                  <Button onClick={() => router.push(`/@/${user?.username}`)} variant={'ghost'} className="px-3 py-2 mb-1 w-full flex-col h-fit rounded-xl items-start">
                    <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                    <p className="text-xs text-zinc-500 truncate">@{user?.username}</p>
                  </Button>

                  <DropdownMenuSeparator className="bg-zinc-800 my-1" />

                  <DropdownMenuItem
                    onClick={() => router.push("/settings")}
                    className="rounded-xl cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800 text-zinc-300 hover:text-white focus:text-white px-3 py-2"
                  >
                    <Settings className="h-4 w-4 mr-2 text-zinc-400" />
                    Settings
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-zinc-800 my-1" />

                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="rounded-xl cursor-pointer hover:bg-red-950/60 focus:bg-red-950/60 text-red-400 hover:text-red-300 focus:text-red-300 px-3 py-2"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={openAuth}
                className="rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-sm px-6 py-2 shadow-lg"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button & Drawer via Shadcn Sheet */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger className="md:hidden p-2 rounded-xl bg-zinc-900/60 border border-zinc-805 text-zinc-300 hover:text-white cursor-pointer">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-3/4 max-w-xs bg-zinc-950/95 border-l border-zinc-800 p-6 flex flex-col gap-6 backdrop-blur-xl text-white rounded-l-3xl"
            >
              <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">{siteConfig.name} mobile directory links</SheetDescription>
              
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search movies, shows…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-500 outline-none focus:border-zinc-500 transition-all"
                />
              </form>

              <nav className="flex flex-col gap-4 text-base font-semibold text-zinc-300 mt-4">
                <Link
                  href="/"
                  prefetch={false}
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-white"
                >
                  Home
                </Link>
                <Link
                  href="/search"
                  prefetch={false}
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-white flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Search
                </Link>
              </nav>

              <hr className="border-zinc-800" />

              <div className="flex flex-col gap-4 mt-auto">
                {isLoggedIn ? (
                  <div className="flex flex-col gap-4 w-full">
                    <Button 
                    variant={'ghost'} 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      router.push(`/@/${user?.username}`)
                    }} 
                    className="flex h-fit items-center gap-3 p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80"
                    >
                      <Avatar className="h-9 w-9 border border-zinc-700/50">
                        {user?.image && (
                          <AvatarImage src={user.image} alt={user.username || "User"} className="object-cover" />
                        )}
                        <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
                          {user?.username?.charAt(0).toUpperCase() ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                        <p className="text-xs text-zinc-500 truncate">@{user?.username}</p>
                      </div>
                    </Button>
                    
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/settings"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900 transition-all text-left"
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
                      className="w-full rounded-2xl bg-red-950/40 hover:bg-red-950/60 border border-red-900/40 hover:border-red-900/60 text-red-400 font-semibold py-5 flex items-center justify-center gap-2 mt-2 cursor-pointer"
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
                    className="w-full rounded-2xl bg-white text-black font-bold py-3 hover:bg-zinc-200 cursor-pointer"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Global AuthModal */}
      <AuthModal isOpen={isAuthOpen} onClose={closeAuth} />
    </>
  );
}
