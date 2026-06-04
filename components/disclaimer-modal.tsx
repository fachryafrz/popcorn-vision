"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ShieldAlert, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { siteConfig } from "@/config/site";

export default function DisclaimerModal() {
  const [isMounted, setIsMounted] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      const accepted = localStorage.getItem(
        "popcorn-vision-disclaimer-accepted",
      );
      setHasAccepted(!!accepted);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("popcorn-vision-disclaimer-accepted", "true");
    setHasAccepted(true);
  };

  const isOpen = isMounted && !hasAccepted;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        className="max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-white shadow-2xl shadow-black/95 backdrop-blur-xl [&>button]:hidden"
      >
        <div className="mb-6 text-center">
          <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-md">
            <Image
              src="/logo/popcorn.png"
              alt="Logo"
              fill
              className="object-contain p-2"
            />
          </div>
          <DialogTitle className="bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
            User Disclaimer
          </DialogTitle>
          <div className="mt-1 flex items-center justify-center gap-1.5 text-xs font-semibold tracking-widest text-yellow-500 uppercase">
            <ShieldAlert className="h-3.5 w-3.5" />
            Important Notice
          </div>
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-zinc-300">
          <p>
            Welcome to <strong>{siteConfig.name}</strong>. Before you explore
            further, please take a moment to read our disclaimer:
          </p>

          <div className="space-y-3 rounded-2xl border border-zinc-900 bg-zinc-900/30 p-4">
            <div className="flex gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-zinc-400" />
              <div className="space-y-2 text-xs">
                <p>
                  <strong>Movie Tracking & Information:</strong>{" "}
                  {siteConfig.name} is a social platform designed for movie/show
                  tracking, logs (diary), and reviews. We{" "}
                  <strong>do not host or stream</strong> any copyrighted media
                  or illegal video content.
                </p>
                <p>
                  <strong>Data Source & TMDB:</strong> All movie metadata,
                  posters, descriptions, and cast lists are powered by the{" "}
                  <strong>TMDb API</strong>. This platform is not officially
                  endorsed or certified by TMDb.
                </p>
                <p>
                  <strong>Copyright:</strong> Promotional materials (such as
                  posters, images, and trailers) displayed on the site are
                  copyrighted by their respective owners or production studios.
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-zinc-400">
            By clicking the button below, you acknowledge and agree that this
            platform is solely for informational, tracking, and community
            purposes.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <Button
            onClick={handleAccept}
            className="to-primary hover:to-primary hover:from-primary from-primary w-full cursor-pointer rounded-2xl bg-linear-to-r py-6 text-sm font-bold text-white shadow-lg transition-all duration-200 active:scale-[0.98]"
          >
            I Agree & Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
