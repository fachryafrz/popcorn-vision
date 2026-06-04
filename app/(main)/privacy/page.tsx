import type { Metadata } from "next";
import { Shield, Lock, Eye, FileText, Globe } from "lucide-react";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description: `Privacy Policy for ${siteConfig.name}. Learn how we protect your personal data, what we collect, and how we use it.`,
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 py-16 text-zinc-300 md:py-24">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 -z-10 h-[550px] w-[550px] rounded-full bg-zinc-900/40 blur-3xl" />

      <div className="mx-auto max-w-4xl px-6 md:px-8">
        {/* Header Section */}
        <div className="mb-12 border-b border-zinc-900 pb-8 text-center md:text-left">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-primary md:mx-0">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Last Updated: June 4, 2026
          </p>
        </div>

        {/* Content Section */}
        <div className="space-y-10 leading-relaxed">
          <section className="space-y-4">
            <p className="text-base text-zinc-400">
              At <strong>{siteConfig.name}</strong>, we deeply respect and commit to protecting your personal data. This Privacy Policy page explains the types of information we collect, how we manage it, and your rights regarding that data.
            </p>
          </section>

          {/* Card: Information We Collect */}
          <section className="space-y-4 rounded-3xl border border-zinc-900 bg-zinc-900/10 p-6 md:p-8">
            <div className="flex items-center gap-3 text-white">
              <Eye className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold tracking-tight">1. Information We Collect</h2>
            </div>
            <p className="text-sm">
              We collect information to provide a more personalized movie tracking experience and enhance social interactions on our platform:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-zinc-400">
              <li>
                <strong className="text-zinc-300">Account Information:</strong> When you sign up through our authentication provider, we receive basic information such as your name, email address, profile picture, and the username you create.
              </li>
              <li>
                <strong className="text-zinc-300">Activity Data:</strong> We store lists of movies or TV shows you mark as favorites, your watch logs (diary), your watchlists, as well as the ratings and reviews you submit.
              </li>
              <li>
                <strong className="text-zinc-300">Device & Analytical Info:</strong> We collect non-personal data such as browser type, operating system, IP address, and your interactions on our website through analytics services like Google Analytics for performance optimization.
              </li>
            </ul>
          </section>

          {/* Card: How We Use Information */}
          <section className="space-y-4 rounded-3xl border border-zinc-900 bg-zinc-900/10 p-6 md:p-8">
            <div className="flex items-center gap-3 text-white">
              <Lock className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold tracking-tight">2. How We Use Your Information</h2>
            </div>
            <p className="text-sm">
              The information we collect is used to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-zinc-400">
              <li>Provide, maintain, and improve the social and tracking features on {siteConfig.name}.</li>
              <li>Personalize user experience, including displaying your statistical watch insights (Insights).</li>
              <li>Secure your account and prevent abuse or suspicious activity on the platform.</li>
              <li>Analyze usage trends to design new features and interface improvements.</li>
            </ul>
          </section>

          {/* Card: Sharing Information */}
          <section className="space-y-4 rounded-3xl border border-zinc-900 bg-zinc-900/10 p-6 md:p-8">
            <div className="flex items-center gap-3 text-white">
              <Globe className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold tracking-tight">3. Sharing Information with Third Parties</h2>
            </div>
            <p className="text-sm">
              We <strong>never sell or rent</strong> your personal information to any third parties. We only share your data in the following scenarios:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-zinc-400">
              <li>
                <strong className="text-zinc-300">Authentication & Database Services:</strong> Your data is securely processed by the Convex distributed database and the Better Auth authentication system.
              </li>
              <li>
                <strong className="text-zinc-300">Third-Party API Providers (TMDb):</strong> We use the TMDb API to fetch movie metadata. However, no personal information is transmitted to TMDb.
              </li>
              <li>
                <strong className="text-zinc-300">Legal Compliance:</strong> We may disclose your information if required by law or a court order from authorized agencies.
              </li>
            </ul>
          </section>

          {/* Card: User Rights */}
          <section className="space-y-4 rounded-3xl border border-zinc-900 bg-zinc-900/10 p-6 md:p-8">
            <div className="flex items-center gap-3 text-white">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold tracking-tight">4. Security & Your Rights</h2>
            </div>
            <p className="text-sm">
              Data security is our top priority. We use modern encryption to protect data exchange on this platform. In addition, you have full control over your privacy:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-zinc-400">
              <li>
                You can adjust your profile privacy settings (Public, Friends Only, or Private) and hide your watchlist/diary from other users in your <strong>Privacy Settings</strong>.
              </li>
              <li>
                You have the right to download a copy of your log data or request permanent deletion of your account at any time.
              </li>
            </ul>
          </section>

          {/* Contact Us */}
          <section className="border-t border-zinc-900 pt-8 text-center md:text-left">
            <h2 className="text-base font-bold text-white">Contact Us</h2>
            <p className="mt-1 text-xs text-zinc-500">
              If you have any questions regarding this Privacy Policy, feel free to contact us at <Link href="https://fachryafrz.com">fachryafrz.com</Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
