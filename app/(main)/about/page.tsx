import type { Metadata } from "next";
import Link from "next/link";
import {
  Film,
  Compass,
  Bookmark,
  Star,
  Users,
  ShieldCheck,
  KeyRound,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  Lock,
  Tv,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: `About ${siteConfig.name} | Movie & TV Show Discovery Platform`,
  description: `Learn about ${siteConfig.name} (${siteConfig.shortName ?? "POVI"}) — your open platform for movie & TV show discovery, watchlist tracking, viewing diaries, ratings, and social lists.`,
};

export default function AboutPage() {
  const features = [
    {
      icon: Compass,
      title: "Discover Without Barriers",
      description:
        "Explore trending movies, top-rated TV series, upcoming theatrical releases, and streaming originals with comprehensive cast, crew, and trailer details powered by the TMDb API — accessible to all visitors without mandatory sign-in.",
    },
    {
      icon: Bookmark,
      title: "Watchlists & Episode Tracker",
      description:
        "Curate your must-watch titles and monitor in-progress TV series with season and episode-level tracking. Pick up your favorite shows exactly where you left off.",
    },
    {
      icon: Star,
      title: "Viewing Diary & 10-Star Ratings",
      description:
        "Score films from 1 to 10, write personal reviews, log exact watch dates with rewatch counters, and look back on your personal cinematic journey.",
    },
    {
      icon: Users,
      title: "Curated & Collaborative Lists",
      description:
        "Build public, private, or collaborative collections for themed movie marathons, upvote community recommendations, and share lists directly with friends.",
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300 pt-24 pb-20 md:pt-32 md:pb-28">
      {/* Background radial accent glow */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.12),rgba(255,255,255,0))]" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
        {/* 1. Hero Section */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-md">
            <Film className="h-4 w-4" />
            <span>About {siteConfig.name} ({siteConfig.shortName ?? "POVI"})</span>
          </div>

          <h1 className="bg-linear-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-transparent">
            Discover, Track & Share the Cinema You Love
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-zinc-400">
            <strong>{siteConfig.name}</strong> (commonly known as <strong>{siteConfig.shortName ?? "POVI"}</strong>) is an open entertainment platform designed for film lovers and binge-watchers. Track what you watch, maintain personal watchlists, log reviews, and share recommendations.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "bg-primary hover:bg-primary/90 text-white font-bold rounded-full px-7 py-3 text-sm shadow-xl shadow-primary/20 transition-all",
              )}
            >
              <span>Open {siteConfig.name}</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Link>

            <Link
              href="/privacy"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-full px-6 py-3 text-sm backdrop-blur-md",
              )}
            >
              <ShieldCheck className="h-4 w-4 mr-1.5 text-primary" />
              <span>Privacy Policy</span>
            </Link>
          </div>
        </section>

        {/* 2. Application Purpose & Identity */}
        <section className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-10 shadow-2xl backdrop-blur-md space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
              <Tv className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Platform Purpose
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                What is {siteConfig.name}?
              </h2>
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-zinc-300">
            <p>
              {siteConfig.name} is a comprehensive media companion built to eliminate the friction of deciding what to watch next and remembering what you have already seen.
            </p>
            <p className="text-zinc-400 text-sm">
              Whether you are an occasional moviegoer or an avid cinephile tracking every seasonal release, {siteConfig.name} provides clean, ad-free tools to explore global titles, monitor streaming availability across services (such as Netflix, Prime Video, and Disney+), and keep a rich, personalized watch diary.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="rounded-2xl border border-zinc-800/60 bg-zinc-950/60 p-4 space-y-1">
              <h3 className="text-sm font-bold text-white">100% Free & Open</h3>
              <p className="text-xs text-zinc-400">
                Browse our entire movie and TV database freely as a guest without any forced registration.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800/60 bg-zinc-950/60 p-4 space-y-1">
              <h3 className="text-sm font-bold text-white">Third-Party Video Embeds</h3>
              <p className="text-xs text-zinc-400">
                Video playback and trailers are provided via embedded third-party players. We do not host or store video files on our own servers.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800/60 bg-zinc-950/60 p-4 space-y-1">
              <h3 className="text-sm font-bold text-white">Powered by TMDb</h3>
              <p className="text-xs text-zinc-400">
                Media metadata, artwork, trailers, and cast information are provided via The Movie Database API.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Google Sign-In & Data Usage Transparency */}
        <section className="rounded-3xl border border-primary/30 bg-primary/5 p-6 sm:p-10 shadow-2xl backdrop-blur-md space-y-6">
          <div className="flex items-center gap-3 border-b border-primary/20 pb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
              <KeyRound className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Google OAuth Transparency
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                How We Use Google User Data
              </h2>
            </div>
          </div>

          <div className="space-y-4 text-sm leading-relaxed text-zinc-300">
            <p>
              To make your experience effortless, {siteConfig.name} allows users to <strong>&quot;Sign in with Google&quot;</strong>. Here is our explicit commitment to your privacy:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 space-y-1.5">
                <strong className="text-white block font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  What We Access:
                </strong>
                <p className="text-zinc-400 leading-relaxed">
                  Only standard basic profile scopes (<code>openid</code>, <code>email</code>, <code>profile</code>): your Name, Email Address, Avatar URL, and Google Account ID for secure session identification.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 space-y-1.5">
                <strong className="text-white block font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Why We Need It:
                </strong>
                <p className="text-zinc-400 leading-relaxed">
                  Strictly to authenticate your identity, create your user profile, and securely synchronize your personal watchlists, TV episode progress, and ratings across all your devices.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 space-y-1.5">
                <strong className="text-white block font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4 text-emerald-400" />
                  No Sensitive Scopes:
                </strong>
                <p className="text-zinc-400 leading-relaxed">
                  We <strong>never</strong> request or access sensitive Google account features such as Google Drive, Gmail, Google Calendar, Google Contacts, or Google Photos.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 space-y-1.5">
                <strong className="text-white block font-semibold flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Zero Selling / Zero AI Training:
                </strong>
                <p className="text-zinc-400 leading-relaxed">
                  We <strong>never sell or rent</strong> your personal data or Google user data to advertisers, data brokers, or third-party AI models.
                </p>
              </div>
            </div>

            {/* Google API Services User Data Policy Compliance Statement */}
            <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-xs text-yellow-200/90 leading-relaxed">
              <strong className="block text-yellow-300 font-semibold mb-1">
                Google API Services User Data Policy Compliance:
              </strong>
              {siteConfig.name}&apos;s use and transfer of information received from Google APIs to any other app will adhere to the{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-white underline underline-offset-2 hover:text-primary inline-flex items-center gap-1"
              >
                Google API Services User Data Policy
                <ExternalLink className="h-3 w-3 inline" />
              </a>
              , including the Limited Use requirements.
            </div>
          </div>
        </section>

        {/* 4. Core Features Grid */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Built for Movie & TV Enthusiasts
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl mx-auto">
              Everything you need to track what you watch and discover what to stream next.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-zinc-800/80 bg-zinc-900/30 p-6 sm:p-8 space-y-3 transition-colors hover:border-zinc-700/80"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-800/70 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Legal & Project Links */}
        <section className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8 text-center space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-zinc-500">
            <Link href="/privacy" className="hover:text-primary transition-colors underline underline-offset-4">
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:text-primary transition-colors underline underline-offset-4">
              Terms of Service
            </Link>
            <span>&bull;</span>
            <Link href="/changelog" className="hover:text-primary transition-colors underline underline-offset-4">
              Changelog
            </Link>
            <span>&bull;</span>
            <a
              href="https://github.com/fachryafrz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              GitHub
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
