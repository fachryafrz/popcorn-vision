"use client";

import { siteConfig } from "@/config/site";
import moment from "moment";
import Link from "next/link";

export default function Footer() {
  const createdDate = "2023-02-17";

  return (
    <footer className="flex flex-col items-center gap-4 border-t border-zinc-900 bg-zinc-950 px-6 py-12 text-center text-sm text-zinc-500 sm:px-16 md:px-20">
      <div className="flex items-center gap-2">
        <img
          src="/logo/popcorn.png"
          alt={siteConfig.name}
          className="h-7 w-7 object-contain"
        />
        <span className="font-semibold text-zinc-400">{siteConfig.name}</span>
      </div>
      <p className="max-w-xs">
        Explore movies and TV shows, track your favorite titles, and watch
        trailers.
      </p>
      <div className="mt-2 flex items-center gap-3 text-xs font-semibold text-zinc-600">
        <Link href="/privacy" className="hover:text-zinc-400 transition-colors">
          Privacy Policy
        </Link>
        <span className="h-1 w-1 rounded-full bg-zinc-800" />
        <Link href="/terms" className="hover:text-zinc-400 transition-colors">
          Terms & Conditions
        </Link>
      </div>
      <p className="mt-2 text-xs text-zinc-600">
        &copy; {moment(createdDate).format("MMM YYYY")} -{" "}
        {moment().format("MMM YYYY")} {siteConfig.name}. All rights reserved.
      </p>
    </footer>
  );
}
