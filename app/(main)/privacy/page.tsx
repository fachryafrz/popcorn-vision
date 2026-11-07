import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description: `Privacy Policy for ${siteConfig.name} (${siteConfig.shortName ?? "POVI"}). Learn how we protect your personal data, what Google user data we collect, how we use it, and your rights to manage or delete your data.`,
};

export default function PrivacyPage() {
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
            <span className="font-semibold text-white border-b-2 border-primary pb-0.5">
              Privacy Policy
            </span>
            <span className="text-zinc-600">&bull;</span>
            <Link
              href="/terms"
              className="font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>

        {/* Header */}
        <header className="mb-10 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="text-xs text-zinc-500">
            Effective Date: {lastUpdated} &bull; Application: {siteConfig.name} ({siteConfig.shortName ?? "POVI"})
          </p>
        </header>

        {/* Content - Clean Top-to-Down Prose */}
        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-zinc-400">
          <section className="space-y-3">
            <p>
              At <strong>{siteConfig.name}</strong> (commonly referred to as <strong>{siteConfig.shortName ?? "POVI"}</strong>, accessible at{" "}
              <a href="https://popcorn.fachryafrz.com" className="text-primary underline hover:text-primary/80">
                https://popcorn.fachryafrz.com
              </a>
              ), we respect your privacy and are committed to complete transparency regarding our data collection, security, and usage practices.
            </p>
            <p>
              This Privacy Policy explains what information we collect when you use our website, why we collect it, how it is stored and protected, and your rights to manage or delete your information.
            </p>
          </section>

          {/* 1. Google OAuth & User Data */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-2 border-t border-zinc-900">
              1. Google OAuth & User Data Disclosure
            </h2>
            <p>
              {siteConfig.name} provides an optional <strong>&quot;Sign in with Google&quot;</strong> feature to authenticate users and synchronize personal data across devices.
            </p>

            <div className="space-y-2 pl-4 border-l-2 border-zinc-800 text-zinc-300">
              <p>
                <strong>Google Scopes Requested:</strong> We only request access to basic, non-sensitive identity scopes: <code>openid</code>, <code>email</code>, and <code>profile</code>.
              </p>
              <p>
                <strong>Data Accessed:</strong> Your Full Name, Email Address, Avatar Image URL, and Google Account ID.
              </p>
              <p>
                <strong>Purpose of Data:</strong> Strictly to authenticate your account, create your public user profile, and associate your personal watchlists, continuing watch status, ratings, and watch diary entries with your identity.
              </p>
              <p>
                <strong>No Sensitive Scopes:</strong> We do <strong>not</strong> request or access sensitive Google account permissions such as Google Drive, Gmail, Google Calendar, Google Contacts, or Google Photos.
              </p>
              <p>
                <strong>No Data Selling or AI Training:</strong> We <strong>never sell, rent, monetize, or trade</strong> your Google user data or personal information to third parties, data brokers, advertisers, or third-party AI training models.
              </p>
            </div>

            {/* Google Limited Use Compliance Callout */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-xs sm:text-sm text-zinc-300 space-y-1.5">
              <strong className="block text-white font-semibold">
                Google API Services User Data Policy Compliance:
              </strong>
              <p className="leading-relaxed text-zinc-400">
                {siteConfig.name}&apos;s use and transfer of information received from Google APIs to any other app will adhere to the{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-primary/80 inline-flex items-center gap-1 font-medium"
                >
                  Google API Services User Data Policy
                  <ExternalLink className="h-3 w-3 inline" />
                </a>
                , including the Limited Use requirements.
              </p>
            </div>
          </section>

          {/* 2. Information We Collect */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-2 border-t border-zinc-900">
              2. Information We Collect
            </h2>
            <p>
              You can browse movies, TV shows, cast details, and community lists freely as a guest without creating an account or logging in. When you choose to interact with account features, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
              <li>
                <strong>Profile Information:</strong> Name, username, email address, profile picture, optional bio, and display settings.
              </li>
              <li>
                <strong>User Content & Activity:</strong> Watchlists, favorites, movie/show ratings (1 to 10 scale), viewing diary logs (watch dates, rewatch counts, personal reviews), and custom curated lists.
              </li>
              <li>
                <strong>Social Interactions:</strong> Friend connections, activity feed comments, and list upvotes.
              </li>
              <li>
                <strong>Technical Information:</strong> Standard server logs, browser type, device information, and IP address for session security and rate-limiting.
              </li>
            </ul>
          </section>

          {/* 3. How We Use Information */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-2 border-t border-zinc-900">
              3. How We Use Information
            </h2>
            <p>We use the information we collect solely for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
              <li>To provide, operate, maintain, and improve platform functionality.</li>
              <li>To synchronize your personal movie and TV tracking data across all your browsers and devices.</li>
              <li>To compute aggregate community rating scores and popular lists without exposing personal data.</li>
              <li>To detect, prevent, and address technical bugs, bot abuse, and security vulnerabilities.</li>
            </ul>
          </section>

          {/* 4. Data Storage, Security & Retention */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-2 border-t border-zinc-900">
              4. Data Storage, Security & Retention
            </h2>
            <p>
              All user data is stored in secure cloud database infrastructure (Convex) using industry-standard TLS/HTTPS encryption in transit and AES-256 encryption at rest.
            </p>
            <p>
              Your account data is retained for as long as your account remains active. If you choose to delete your account, all associated personal records, diary logs, ratings, and lists are permanently purged within 30 days.
            </p>
          </section>

          {/* 5. Your Rights & Data Deletion */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-2 border-t border-zinc-900">
              5. Your Rights & Data Deletion
            </h2>
            <p>You have full ownership and control over your personal data:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
              <li>
                <strong>Access & Update:</strong> You can edit your username, avatar, bio, and privacy settings at any time in your profile Settings.
              </li>
              <li>
                <strong>Privacy Controls:</strong> You can make your watchlists, favorites, ratings, or diary logs private so other users cannot view them.
              </li>
              <li>
                <strong>Account Deletion:</strong> You can permanently delete your account and all associated data directly from your Profile Settings.
              </li>
              <li>
                <strong>Revoke Google Access:</strong> You can revoke {siteConfig.name}&apos;s access to your Google account at any time via the{" "}
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-primary/80 inline-flex items-center gap-1 font-medium"
                >
                  Google Account Permissions Dashboard
                  <ExternalLink className="h-3 w-3 inline" />
                </a>
                .
              </li>
            </ul>
          </section>

          {/* 6. Third-Party Services */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-2 border-t border-zinc-900">
              6. Third-Party Services
            </h2>
            <p>
              {siteConfig.name} integrates with external services to deliver media discovery:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
              <li>
                <strong>The Movie Database (TMDb):</strong> Provides titles, synopses, cast lists, and poster artwork. This product uses the TMDb API but is not officially endorsed or certified by TMDb.
              </li>
            </ul>
          </section>

          {/* 7. Cookies & Local Storage */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-2 border-t border-zinc-900">
              7. Cookies & Local Storage
            </h2>
            <p>
              We use minimal cookies and browser storage strictly for necessary operational functionality:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
              <li>
                <strong>Authentication Session Cookies:</strong> Encrypted HTTP-only cookies to keep you signed in securely.
              </li>
              <li>
                <strong>Local Storage:</strong> Remembers your UI theme preference (Dark, Cinema, Netflix, etc.) and disclaimer dismissals.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
