import type { Metadata } from "next";
import { FileText, UserCheck, AlertCircle, Info, Scale } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Terms & Conditions | ${siteConfig.name}`,
  description: `Terms and Conditions for using the ${siteConfig.name} platform. Learn about your rights, obligations, and the rules that apply on our site.`,
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 py-16 text-zinc-300 md:py-24">
      <div className="mx-auto max-w-4xl px-6 md:px-8">
        {/* Header Section */}
        <div className="mb-12 border-b border-zinc-900 pb-8 text-center md:text-left">
          <div className="text-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 md:mx-0">
            <Scale className="h-6 w-6" />
          </div>
          <h1 className="bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
            Terms & Conditions
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Last Updated: June 4, 2026
          </p>
        </div>

        {/* Content Section */}
        <div className="space-y-10 leading-relaxed">
          <section className="space-y-4">
            <p className="text-base text-zinc-400">
              Welcome to <strong>{siteConfig.name}</strong>. The following Terms
              and Conditions govern your use of our website and services. By
              accessing or using our platform, you agree to be legally bound by
              this document.
            </p>
          </section>

          {/* Card: Account Registration */}
          <section className="space-y-4 rounded-3xl border border-zinc-900 bg-zinc-900/10 p-6 md:p-8">
            <div className="flex items-center gap-3 text-white">
              <UserCheck className="text-primary h-5 w-5" />
              <h2 className="text-lg font-bold tracking-tight">
                1. Registration & User Accounts
              </h2>
            </div>
            <p className="text-sm">
              To enjoy all features of {siteConfig.name}, you must sign in or
              create an account through the authentication methods provided.
            </p>
            <ul className="list-disc space-y-2 pl-5 text-xs text-zinc-400">
              <li>
                You are responsible for maintaining the confidentiality of your
                account credentials.
              </li>
              <li>
                You must provide accurate information when creating your profile
                username.
              </li>
              <li>
                An account must only be used by its rightful owner and cannot be
                transferred to others.
              </li>
            </ul>
          </section>

          {/* Card: User Behavior */}
          <section className="space-y-4 rounded-3xl border border-zinc-900 bg-zinc-900/10 p-6 md:p-8">
            <div className="flex items-center gap-3 text-white">
              <AlertCircle className="text-primary h-5 w-5" />
              <h2 className="text-lg font-bold tracking-tight">
                2. Content & Conduct Policy
              </h2>
            </div>
            <p className="text-sm">
              As part of the {siteConfig.name} community, you agree not to:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-xs text-zinc-400">
              <li>
                Submit movie reviews containing hate speech, discrimination,
                harassment, pornography, or other illegal content.
              </li>
              <li>Engage in spam, scam, or manipulate ratings artificially.</li>
              <li>
                Violate other users&apos; privacy by sharing their personal info
                without written consent.
              </li>
              <li>
                Use bots or automated scripts to scrape data from our site
                without official permission.
              </li>
            </ul>
          </section>

          {/* Card: Disclaimer & Copyright */}
          <section className="space-y-4 rounded-3xl border border-zinc-900 bg-zinc-900/10 p-6 md:p-8">
            <div className="flex items-center gap-3 text-white">
              <Info className="text-primary h-5 w-5" />
              <h2 className="text-lg font-bold tracking-tight">
                3. Disclaimer & Video Content
              </h2>
            </div>
            <p className="text-sm">
              Please understand the scope of our services:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-xs text-zinc-400">
              <li>
                {siteConfig.name} is strictly a movie logging, reviewing, and
                tracking service. We{" "}
                <strong>do not provide video streaming</strong> or direct
                downloads for copyrighted movies.
              </li>
              <li>
                All movie information is compiled via a third-party API (TMDb).
                We do not guarantee 100% accuracy of this external data and are
                not responsible for any changes made by TMDb.
              </li>
              <li>
                Logos, images, and movie posters presented on the site are
                promotional materials belonging to their respective original
                copyright holders.
              </li>
            </ul>
          </section>

          {/* Card: Termination & Changes */}
          <section className="space-y-4 rounded-3xl border border-zinc-900 bg-zinc-900/10 p-6 md:p-8">
            <div className="flex items-center gap-3 text-white">
              <FileText className="text-primary h-5 w-5" />
              <h2 className="text-lg font-bold tracking-tight">
                4. Termination & Policy Updates
              </h2>
            </div>
            <p className="text-sm">
              We reserve the right to suspend or permanently delete your account
              if repetitive violations of these Terms and Conditions are found.
              We may also update this document at any time. Changes will take
              effect immediately upon publication.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
