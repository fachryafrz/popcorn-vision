"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface ImportingStepProps {
  importProgress: number;
}

export default function ImportingStep({
  importProgress,
}: ImportingStepProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-3xl border border-zinc-900 bg-zinc-950/20 py-20 text-center">
      <Loader2 className="text-primary h-10 w-10 animate-spin" />
      <div>
        <h3 className="mb-1 text-base font-bold text-zinc-200">
          Adding Entries
        </h3>
        <p className="text-xs text-zinc-500">Saving your data...</p>
      </div>
      <div className="h-2.5 w-full max-w-xs overflow-hidden rounded-full border border-zinc-800 bg-zinc-900">
        <div
          style={{ width: `${importProgress}%` }}
          className="bg-primary h-full rounded-full transition-all duration-300"
        />
      </div>
      <span className="text-xs font-bold text-zinc-400">
        {importProgress}% completed
      </span>
    </div>
  );
}
