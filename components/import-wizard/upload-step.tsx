"use client";

import React from "react";
import { Upload, FileSpreadsheet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface UploadStepProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SOURCES_GUIDE = [
  {
    title: "IMDb Lists",
    text: "Supports exported list files containing 'Const' IMDb IDs.",
    color: "border-yellow-600/20 bg-yellow-950/5 text-yellow-400",
  },
  {
    title: "Letterboxd",
    text: "Supports watchlist.csv and ratings.csv files (automatic 5-star scaling).",
    color: "border-orange-600/20 bg-orange-950/5 text-orange-400",
  },
  {
    title: "TMDB",
    text: "Supports CSV lists containing TMDB ID fields.",
    color: "border-blue-600/20 bg-blue-950/5 text-blue-400",
  },
];

export default function UploadStep({ onUpload }: UploadStepProps) {
  return (
    <div className="space-y-6">
      <div className="group relative overflow-hidden rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/20 p-8 text-center shadow-lg backdrop-blur-md transition-all duration-300 hover:border-zinc-700/80 hover:bg-zinc-950/30 md:p-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 shadow-inner transition-transform duration-300 group-hover:scale-105">
            <Upload className="text-primary h-7 w-7" />
          </div>
          <div>
            <h3 className="mb-1 text-base font-bold text-zinc-200">
              Upload CSV Export File
            </h3>
            <p className="mx-auto mb-6 max-w-sm text-xs text-zinc-500">
              Supports CSV list exports generated directly from IMDb
              watchlist/ratings, Letterboxd movies, or TMDB items.
            </p>
          </div>

          {/* Upload Input Button */}
          <Label className="relative cursor-pointer">
            <Input
              type="file"
              accept=".csv"
              onChange={onUpload}
              className="hidden"
            />
            <div className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-bold text-black shadow-md transition-all duration-100 hover:scale-[1.02] hover:bg-zinc-200 active:scale-95">
              <FileSpreadsheet className="h-4 w-4" />
              Choose CSV File
            </div>
          </Label>
        </div>
      </div>

      {/* Sources Guide Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {SOURCES_GUIDE.map((guide, i) => (
          <div
            key={i}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-4 text-center backdrop-blur-xs",
              guide.color,
            )}
          >
            <h4 className="text-xs font-bold tracking-wide uppercase">
              {guide.title}
            </h4>
            <p className="max-w-xs text-[10px] text-zinc-500">
              {guide.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
