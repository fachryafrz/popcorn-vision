"use client";

import { useState, useEffect } from "react";
import { TMDBMedia } from "@/lib/tmdb";
import { getTrending, getStreamingOriginals, getByCategory } from "@/lib/tmdb-actions";
import { authClient } from "@/lib/auth-client";
import Hero from "./hero";
import Section from "./section";
import AuthModal from "./auth-modal";
import QuickViewModal from "./quick-view-modal";
import { User, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

interface HomeClientProps {
  initialHero: TMDBMedia[];
  initialTrending: TMDBMedia[];
  initialStreaming: TMDBMedia[];
  initialGenre: TMDBMedia[];
}

export default function HomeClient({
  initialHero,
  initialTrending,
  initialStreaming,
  initialGenre,
}: HomeClientProps) {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const user = session.data?.user;

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<TMDBMedia | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleQuickView = (media: TMDBMedia) => {
    setSelectedMedia(media);
    setIsQuickViewOpen(true);
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans select-none overflow-x-hidden">
      
      {/* Floating Header Navbar */}
      <header className={cn("fixed inset-x-0 z-40 transition-all duration-500", scrolled ? "top-4 px-4 sm:px-10 md:px-16" : "top-0")}>
        <div className={cn("w-full flex items-center justify-between transition-all duration-500", scrolled ? "max-w-5xl mx-auto px-6 py-2 bg-zinc-950/80 backdrop-blur-md border border-zinc-800/80 rounded-full shadow-xl shadow-black/60" : "max-w-7xl mx-auto px-6 sm:px-12 md:px-16 py-4 border border-transparent")}>
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <img
              src="/logo/popcorn.png"
              alt={siteConfig.name}
              className={cn("object-contain transition-all duration-500", scrolled ? "h-8 w-8" : "h-10 w-10")}
            />
            <span className={cn("uppercase font-black tracking-wider bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent transition-all duration-500", scrolled ? "text-lg" : "text-xl")}>
              {siteConfig.name}
            </span>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-300">
            <a href="#" className="text-white hover:text-white transition-all">
              Home
            </a>
            <a href="#trending" className="hover:text-white transition-all">
              Trending
            </a>
            <a href="#originals" className="hover:text-white transition-all">
              Originals
            </a>
            <a href="#category" className="hover:text-white transition-all">
              Browse
            </a>
          </nav>

          {/* User Controls (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                {/* User avatar/name */}
                <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 text-sm">
                  <User className="h-4 w-4 text-blue-400" />
                  <span className="font-semibold text-zinc-200 truncate max-w-[120px]">
                    {user?.name}
                  </span>
                </div>

                {/* Log Out Button */}
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  className="rounded-full h-9 w-9 p-0 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setIsAuthOpen(true)}
                className="rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-sm px-6 py-2 shadow-lg"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className={cn("md:hidden absolute top-full inset-x-0 bg-zinc-950/95 border-b border-zinc-800 p-6 flex flex-col gap-6 backdrop-blur-xl animate-in slide-in-from-top-4 duration-300", scrolled ? "rounded-3xl border border-zinc-800 mt-2 shadow-2xl" : "")}>
            <nav className="flex flex-col gap-4 text-base font-semibold text-zinc-300">
              <a
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white"
              >
                Home
              </a>
              <a
                href="#trending"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white"
              >
                Trending Now
              </a>
              <a
                href="#originals"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white"
              >
                Originals
              </a>
              <a
                href="#category"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white"
              >
                Browse Category
              </a>
            </nav>

            <hr className="border-zinc-800" />

            {/* Mobile User Controls */}
            <div className="flex items-center justify-between">
              {isLoggedIn ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-sm">
                    <User className="h-4 w-4 text-blue-400" />
                    <span className="font-semibold text-zinc-200">{user?.name}</span>
                  </div>
                  <Button
                    onClick={handleSignOut}
                    className="rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAuthOpen(true);
                  }}
                  className="w-full rounded-2xl bg-white text-black font-bold py-3"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main page content */}
      <main className="flex-1 flex flex-col">
        {/* Fullscreen Hero Carousel */}
        <Hero
          items={initialHero}
          onQuickView={handleQuickView}
          onAuthRequired={() => setIsAuthOpen(true)}
        />

        {/* Categories Section Carousels */}
        <div className="relative z-20 flex flex-col gap-6 bg-zinc-950 pb-20">
          
          {/* Top backdrop glow */}
          <div className="absolute top-0 inset-x-0 -translate-y-48 h-96 bg-gradient-to-b from-transparent to-zinc-950 pointer-events-none -z-10" />

          {/* Trending Now */}
          <div id="trending">
            <Section
              titleType="text"
              defaultFetch={async () => initialTrending}
              onTrendingChange={async (type) => getTrending(type)}
              onQuickView={handleQuickView}
              onAuthRequired={() => setIsAuthOpen(true)}
            />
          </div>

          {/* Streaming Services Originals */}
          <div id="originals">
            <Section
              titleType="dropdown-streaming"
              defaultFetch={async () => initialStreaming}
              onStreamingChange={async (key) => getStreamingOriginals(key)}
              onQuickView={handleQuickView}
              onAuthRequired={() => setIsAuthOpen(true)}
            />
          </div>

          {/* Browse by Category */}
          <div id="category">
            <Section
              titleType="dropdown-genre"
              defaultFetch={async () => initialGenre}
              onGenreChange={async (name) => getByCategory(name)}
              onQuickView={handleQuickView}
              onAuthRequired={() => setIsAuthOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-900 py-12 px-6 sm:px-16 md:px-20 text-center text-sm text-zinc-500 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <img
            src="/logo/popcorn.png"
            alt={siteConfig.name}
            className="h-7 w-7 object-contain"
          />
          <span className="font-semibold text-zinc-400">{siteConfig.name}</span>
        </div>
        <p className="max-w-xs">
          Explore movies and TV shows, track your favorite titles, and watch trailers.
        </p>
        <p className="text-xs text-zinc-600 mt-2">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </footer>

      {/* Pop-up Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        media={selectedMedia}
      />
    </div>
  );
}
