"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { STORAGE_KEYS } from "@/lib/constants";

export default function DisclaimerModal() {
  const [isMounted, setIsMounted] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      const accepted = localStorage.getItem(
        STORAGE_KEYS.DISCLAIMER_ACCEPTED,
      );
      setHasAccepted(!!accepted);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEYS.DISCLAIMER_ACCEPTED, "true");
    setHasAccepted(true);
  };

  if (!isMounted || hasAccepted) {
    return null;
  }

  return (
    <aside
      aria-label="Platform Disclaimer"
      className="fixed bottom-20 left-4 right-4 z-50 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="rounded-2xl border border-zinc-800/90 bg-zinc-950/95 p-4.5 text-white shadow-2xl shadow-black/80 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
              <Image
                src="/logo/v2/popcorn_cropped_transparent.png"
                alt={siteConfig.name}
                fill
                className="object-contain p-1"
              />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                Welcome to Popcorn Vision (POVI)
              </h2>
              <p className="text-[11px] text-zinc-400">
                Discovery & Tracking Platform Notice
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAccept}
            className="text-zinc-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-zinc-800/60"
            aria-label="Dismiss notice"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 space-y-2 text-xs leading-relaxed text-zinc-300">
          <p>
            Popcorn Vision (POVI) is a community movie and TV show tracking platform
            for building watchlists, logging diaries, and reviews. We{" "}
            <strong className="text-zinc-100">do not host or store video files</strong> on our servers;
            playback is provided via third-party embedded players. All media metadata is provided via the TMDb API.
          </p>
          <p className="text-[11px] text-zinc-400">
            Learn more in our{" "}
            <Link
              href="/privacy"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
              href="/terms"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Terms of Service
            </Link>
            .
          </p>
        </div>

        <div className="mt-3.5 flex items-center justify-end gap-2">
          <Button
            size="sm"
            onClick={handleAccept}
            className="bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-semibold px-4 py-1.5 shadow-md"
          >
            I Understand & Continue
          </Button>
        </div>
      </div>
    </aside>
  );
}
