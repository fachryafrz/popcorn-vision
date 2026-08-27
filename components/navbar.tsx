"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import AuthModal from "./auth-modal";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import { NavbarSearch } from "./navbar/navbar-search";
import { NavbarNotifications } from "./navbar/navbar-notifications";
import { NavbarUserMenu } from "./navbar/navbar-user-menu";
import { NavbarLinks } from "./navbar/navbar-links";
import { SearchOverlay } from "./search-overlay";

export default function Navbar() {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const user = session.data?.user;
  const router = useRouter();
  const pathname = usePathname();
  const isSearchPage = pathname === "/search";

  // Get current user profile (including role)
  const userProfile = useQuery(
    api.users.getCurrentUser,
    isLoggedIn ? {} : "skip",
  );

  const {
    isOpen: isAuthOpen,
    open: openAuth,
    close: closeAuth,
  } = useAuthModalStore();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.refresh();
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
            "flex w-full items-center justify-between transition-all duration-500",
            scrolled
              ? "bg-background/80 border-border/80 mx-auto max-w-5xl rounded-full border p-2 shadow-xl shadow-black/60 backdrop-blur-md"
              : "mx-auto max-w-7xl border border-transparent px-4 py-4 sm:px-12 md:px-16",
          )}
        >
          {/* Left: Logo & Desktop Links */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link
              href="/"
              prefetch={false}
              className="ml-1 flex max-w-fit cursor-pointer items-center gap-2"
            >
              <img
                src="/logo/popcorn.png"
                alt={siteConfig.name}
                className={cn(
                  "object-contain transition-all duration-500",
                  scrolled ? "h-8 w-8" : "h-10 w-10",
                )}
              />
              <span className="bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-lg font-black tracking-wider text-transparent uppercase transition-all duration-500">
                POVI
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <Suspense fallback={null}>
              <NavbarLinks scrolled={scrolled} />
            </Suspense>
          </div>

          {/* Center: Search Bar (Desktop) */}
          {!isSearchPage && (
            <div className="hidden flex-1 justify-center px-4 lg:flex">
              <Suspense fallback={null}>
                <NavbarSearch scrolled={scrolled} />
              </Suspense>
            </div>
          )}

          {/* Right: User Controls (Desktop) */}
          <div className="hidden items-center gap-2 lg:flex">
            <NavbarNotifications isLoggedIn={isLoggedIn} variant="desktop" />

            {isLoggedIn ? (
              <NavbarUserMenu
                user={user ?? null}
                role={userProfile?.role}
                onSignOut={handleSignOut}
              />
            ) : (
              <Button
                onClick={openAuth}
                className="cursor-pointer rounded-full bg-white px-6 py-2 text-sm font-bold text-black shadow-lg hover:bg-zinc-200"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Controls (Notification Bell only) */}
          <div className="flex items-center gap-2 lg:hidden">
            <NavbarNotifications isLoggedIn={isLoggedIn} variant="mobile" />
          </div>
        </div>
      </header>

      {/* Global AuthModal & SearchOverlay */}
      <Suspense>
        <AuthModal isOpen={isAuthOpen} onClose={closeAuth} />
      </Suspense>
      <SearchOverlay />
    </>
  );
}

