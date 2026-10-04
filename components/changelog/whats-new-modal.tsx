"use client";

import React from "react";
import Link from "next/link";
import moment from "moment";
import { History, ArrowRight, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useChangelogModalState } from "@/hooks/use-query-modal-state";
import { getLatestMilestone } from "@/data/changelog";
import { ChangelogBadge } from "./changelog-badge";

export default function WhatsNewModal() {
  const [isOpen, setIsOpen] = useChangelogModalState();
  const latest = getLatestMilestone();
  const formattedDate = moment(latest.releaseDate).format("MMMM D, YYYY");

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent
        className="max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 text-white shadow-2xl shadow-black/95 backdrop-blur-xl"
        showCloseButton={true}
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <History className="h-4 w-4" />
          <span>What&apos;s New in Popcorn Vision</span>
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              v{latest.version} Release Notes
            </DialogTitle>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formattedDate}</span>
            </div>
          </div>
          <DialogDescription className="text-sm text-zinc-300 font-medium">
            {latest.title}
          </DialogDescription>
        </div>

        <p className="text-sm leading-relaxed text-zinc-400">
          {latest.summary}
        </p>

        {/* Changes Snippet */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Included Updates
          </h4>
          <ul className="divide-y divide-zinc-900 text-sm">
            {latest.changes.slice(0, 3).map((change, idx) => (
              <li key={idx} className="flex flex-col gap-1 py-2 first:pt-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <ChangelogBadge type={change.type} className="shrink-0" />
                  <span className="text-xs font-semibold text-zinc-200">
                    {change.title}
                  </span>
                </div>
                {change.description && (
                  <span className="text-xs text-zinc-400 leading-relaxed pl-1">
                    {change.description}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-2 flex flex-col sm:flex-row gap-2.5 pt-2 border-t border-zinc-900">
          <Button
            onClick={handleClose}
            className="flex-1 cursor-pointer rounded-2xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 py-5 text-sm font-semibold"
          >
            Got it
          </Button>
          <Button
            render={
              <Link
                href="/changelog"
                onClick={handleClose}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary/90 text-white py-5 text-sm font-semibold"
              />
            }
          >
            <span>All Milestones</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
