"use client";

import { siteConfig } from "@/config/site";
import moment from "moment";

export default function Footer() {
  const createdDate = '2023-02-17'

  return (
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
        &copy; {moment(createdDate).format('MMM YYYY')} - {moment().format('MMM YYYY')} {siteConfig.name}. All rights reserved.
      </p>
    </footer>
  );
}
