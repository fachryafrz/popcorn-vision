import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Terms & Conditions | ${siteConfig.name}`,
  description: `Terms and Conditions for using the ${siteConfig.name} (${siteConfig.shortName ?? "POVI"}) platform. Learn about user rights, community guidelines, and acceptable use.`,
};

export default function TermsPage() {
  const lastUpdated = "November 7, 2026";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 pt-24 pb-20 md:pt-32 md:pb-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Navigation & Document Switcher */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/80 pb-5">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to {siteConfig.name}</span>
          </Link>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/privacy"
              className="font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-zinc-600">&bull;</span>
            <span className="font-semibold text-white border-b-2 border-primary pb-0.5">
              Terms of Service
            </span>
          </div>
        </div>

        {/* Header */}
        <header className="mb-10 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Terms & Conditions
          </h1>
          <p className="text-xs text-zinc-500">
            Effective Date: {lastUpdated} &bull; Application: {siteConfig.name} ({siteConfig.shortName ?? "POVI"})
          </p>
        </header>

        {/* Content - Clean Top-to-Down Prose */}
        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-zinc-400">
          <section className="space-y-3">
            <p>
              Welcome to <strong>{siteConfig.name}</strong> (commonly known as <strong>{siteConfig.shortName ?? "POVI"}</strong>, accessible at{" "}
              <a href="https://popcorn.fachryafrz.com" className="text-primary underline hover:text-primary/80">
                https://popcorn.fachryafrz.com
              </a>
              ). By accessing or using our platform, you agree to comply with and be bound by these Terms and Conditions.
            </p>
            <p>
              If you do not agree with any part of these terms, please do not use our services.
            </p>
          </section>

          {/* 1. Media & Streaming Disclaimer */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-2 border-t border-zinc-900">
              1. Platform Nature & Media Disclaimer
            </h2>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-xs sm:text-sm text-zinc-300 space-y-2">
              <strong className="block text-white font-semibold">
                Important Disclaimer:
              </strong>
              <p className="leading-relaxed text-zinc-400">
                {siteConfig.name} provides media discovery, tracking, and viewing logs. <strong>We do not host, store, or upload media files to our own servers.</strong> Video playback and trailers are delivered through embedded third-party player sources.
              </p>
              <p className="leading-relaxed text-zinc-400">
                Any media accessed through embedded third-party players is hosted and provided by external services outside our control.
              </p>
            </div>
          </section>

          {/* 2. User Accounts & Registration */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-2 border-t border-zinc-900">
              2. User Accounts & Registration
            </h2>
            <p>
              You may browse media details and community content without an account. To create custom lists, log reviews, rate titles, or maintain watchlists, you may register using Google Sign-In or email credentials.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
              <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
              <li>You are responsible for all activities that occur under your account.</li>
              <li>You agree to provide accurate information and refrain from impersonating other individuals or entities.</li>
            </ul>
          </section>

          {/* 3. Acceptable Use & Community Guidelines */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-2 border-t border-zinc-900">
              3. Acceptable Use & Community Conduct
            </h2>
            <p>To ensure a safe, enjoyable environment for film fans, you agree not to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
              <li>Post reviews, comments, or lists containing hate speech, harassment, defamation, or explicit threats.</li>
              <li>Use automated bots, scrapers, or scripts to harvest data or artificially manipulate rating scores.</li>
              <li>Attempt to reverse-engineer, exploit, or disrupt server infrastructure.</li>
              <li>Post unauthorized spam, advertising, or promotional solicitations.</li>
            </ul>
          </section>

          {/* 4. Intellectual Property & TMDb Attribution */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-2 border-t border-zinc-900">
              4. Copyright & TMDb Attribution
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
              <li>
                <strong>The Movie Database (TMDb):</strong> Media titles, synopses, crew credits, release dates, and genres are powered by the TMDb API. This product uses the TMDb API but is not officially endorsed or certified by TMDb.
              </li>
              <li>
                <strong>Artwork & Posters:</strong> Movie posters, backdrops, and promotional images belong to their respective film studios, producers, and distributors.
              </li>
              <li>
                <strong>User Content:</strong> You retain ownership of reviews and list titles you create, granting {siteConfig.name} a non-exclusive license to display this content on the platform.
              </li>
            </ul>
          </section>

          {/* 5. Account Termination */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-2 border-t border-zinc-900">
              5. Account Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate accounts that repeatedly violate these Terms and Conditions or engage in harmful activities.
            </p>
            <p>
              You may terminate your account at any time directly through your Profile Settings.
            </p>
          </section>

          {/* 6. Modifications to Terms */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-2 border-t border-zinc-900">
              6. Modifications to Terms
            </h2>
            <p>
              We may revise these Terms and Conditions periodically to reflect feature updates, legal requirements, or platform enhancements. Material changes will be highlighted via our Changelog. Continued use of the platform constitutes acceptance of updated terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
