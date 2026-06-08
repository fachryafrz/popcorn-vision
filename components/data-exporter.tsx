"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Download,
  Film,
  Heart,
  Star,
  Calendar,
  Loader2,
  FileSpreadsheet,
} from "lucide-react";

// Explicit Types
interface ExportWatchlistItem {
  _id: string;
  userId: string;
  mediaId: string;
  mediaType: string;
  title: string;
  posterPath: string;
  rating: number;
  releaseYear: string;
  addedAt: number;
}

interface ExportFavoriteItem {
  _id: string;
  userId: string;
  mediaId: string;
  mediaType: string;
  title: string;
  posterPath: string;
  rating: number;
  releaseYear: string;
  addedAt: number;
}

interface ExportRatingItem {
  _id: string;
  userId: string;
  mediaId: string;
  mediaType: string;
  title: string;
  posterPath: string;
  rating: number;
  releaseYear: string;
  addedAt: number;
}

interface ExportDiaryItem {
  _id: string;
  userId: string;
  mediaId: string;
  mediaType: string;
  title: string;
  posterPath: string;
  rating?: number;
  releaseYear: string;
  watchedDate: number;
  rewatch: boolean;
  review?: string;
  season?: number;
  episode?: number;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  addedAt: number;
  diaryType?: string;
}

export default function DataExporter() {
  const [exportingAll, setExportingAll] = useState(false);

  // Queries
  const currentUser = useQuery(api.users.getCurrentUser);
  const existingWatchlist = useQuery(api.watchlist.getWatchlist) as
    | ExportWatchlistItem[]
    | undefined;
  const existingFavorites = useQuery(api.favorites.getFavorites) as
    | ExportFavoriteItem[]
    | undefined;
  const existingRatings = useQuery(
    api.ratings.getUserRatings,
    currentUser ? { userId: currentUser.userId } : "skip",
  ) as ExportRatingItem[] | undefined;
  const existingDiary = useQuery(api.diary.getUserDiary, {}) as
    | ExportDiaryItem[]
    | undefined;

  const isLoading =
    existingWatchlist === undefined ||
    existingFavorites === undefined ||
    (currentUser !== undefined && existingRatings === undefined) ||
    existingDiary === undefined;

  // Helper to escape CSV fields safely
  const escapeCSVField = (
    field: string | number | boolean | undefined | null,
  ): string => {
    if (field === undefined || field === null) return "";
    const str = String(field);
    if (
      str.includes(",") ||
      str.includes('"') ||
      str.includes("\n") ||
      str.includes("\r")
    ) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // Helper to trigger browser CSV download
  const downloadCSV = (
    filename: string,
    headers: string[],
    rows: string[][],
  ) => {
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportWatchlist = () => {
    if (!existingWatchlist || existingWatchlist.length === 0) {
      toast.error("No items in your watchlist to export.");
      return;
    }

    const headers = ["Title", "MediaType", "ReleaseYear", "Rating", "AddedAt"];
    const rows = existingWatchlist.map((item) => [
      escapeCSVField(item.title),
      escapeCSVField(item.mediaType),
      escapeCSVField(item.releaseYear),
      escapeCSVField(item.rating),
      escapeCSVField(new Date(item.addedAt).toISOString()),
    ]);

    downloadCSV("popcorn-vision-watchlist.csv", headers, rows);
    toast.success("Watchlist exported successfully!");
  };

  const handleExportFavorites = () => {
    if (!existingFavorites || existingFavorites.length === 0) {
      toast.error("No favorites to export.");
      return;
    }

    const headers = ["Title", "MediaType", "ReleaseYear", "Rating", "AddedAt"];
    const rows = existingFavorites.map((item) => [
      escapeCSVField(item.title),
      escapeCSVField(item.mediaType),
      escapeCSVField(item.releaseYear),
      escapeCSVField(item.rating),
      escapeCSVField(new Date(item.addedAt).toISOString()),
    ]);

    downloadCSV("popcorn-vision-favorites.csv", headers, rows);
    toast.success("Favorites exported successfully!");
  };

  const handleExportRatings = () => {
    if (!existingRatings || existingRatings.length === 0) {
      toast.error("No ratings to export.");
      return;
    }

    const headers = ["Title", "MediaType", "ReleaseYear", "Rating", "AddedAt"];
    const rows = existingRatings.map((item) => [
      escapeCSVField(item.title),
      escapeCSVField(item.mediaType),
      escapeCSVField(item.releaseYear),
      escapeCSVField(item.rating),
      escapeCSVField(new Date(item.addedAt).toISOString()),
    ]);

    downloadCSV("popcorn-vision-ratings.csv", headers, rows);
    toast.success("Ratings exported successfully!");
  };

  const handleExportDiary = () => {
    if (!existingDiary || existingDiary.length === 0) {
      toast.error("No diary entries to export.");
      return;
    }

    const headers = [
      "Title",
      "MediaType",
      "ReleaseYear",
      "WatchedDate",
      "Rewatch",
      "Review",
      "Rating",
      "Season",
      "Episode",
      "NumberOfSeasons",
      "NumberOfEpisodes",
      "DiaryType",
      "AddedAt",
    ];
    const rows = existingDiary.map((item) => [
      escapeCSVField(item.title),
      escapeCSVField(item.mediaType),
      escapeCSVField(item.releaseYear),
      escapeCSVField(new Date(item.watchedDate).toISOString().split("T")[0]),
      escapeCSVField(item.rewatch ? "Yes" : "No"),
      escapeCSVField(item.review || ""),
      escapeCSVField(item.rating || ""),
      escapeCSVField(item.season !== undefined ? item.season : ""),
      escapeCSVField(item.episode !== undefined ? item.episode : ""),
      escapeCSVField(item.numberOfSeasons !== undefined ? item.numberOfSeasons : ""),
      escapeCSVField(item.numberOfEpisodes !== undefined ? item.numberOfEpisodes : ""),
      escapeCSVField(item.diaryType || ""),
      escapeCSVField(new Date(item.addedAt).toISOString()),
    ]);

    downloadCSV("popcorn-vision-diary.csv", headers, rows);
    toast.success("Film Diary exported successfully!");
  };

  const handleExportAll = async () => {
    setExportingAll(true);
    toast.info("Preparing data for export...");

    try {
      let filesExported = 0;

      if (existingWatchlist && existingWatchlist.length > 0) {
        handleExportWatchlist();
        filesExported++;
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      if (existingFavorites && existingFavorites.length > 0) {
        handleExportFavorites();
        filesExported++;
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      if (existingRatings && existingRatings.length > 0) {
        handleExportRatings();
        filesExported++;
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      if (existingDiary && existingDiary.length > 0) {
        handleExportDiary();
        filesExported++;
      }

      if (filesExported === 0) {
        toast.error("You have no personal data entries to export.");
      } else {
        toast.success(`Successfully exported ${filesExported} datasets!`);
      }
    } catch {
      toast.error("Failed to export all datasets.");
    } finally {
      setExportingAll(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <p className="text-xs text-zinc-500">
          Loading your profile data records...
        </p>
      </div>
    );
  }

  const wCount = existingWatchlist?.length || 0;
  const fCount = existingFavorites?.length || 0;
  const rCount = existingRatings?.length || 0;
  const dCount = existingDiary?.length || 0;
  const hasAnyData = wCount > 0 || fCount > 0 || rCount > 0 || dCount > 0;

  return (
    <div className="space-y-6 pt-10">
      {/* Exporter Header */}
      <div>
        <h2 className="mb-1 text-xl font-bold tracking-tight text-white">
          Export Personal Data
        </h2>
        <p className="text-xs text-zinc-500">
          Download local backups of your watch lists, ratings, and diary entries
          anytime.
        </p>
      </div>

      {/* Grid of exportable modules */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Diary card */}
        <div className="group relative flex flex-col justify-between gap-4 overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950/20 p-6 shadow-md backdrop-blur-md transition-all duration-300 hover:border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-900/30 bg-emerald-950/30 shadow-inner">
              <Calendar className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-200">Film Diary</h3>
              <p className="text-[10px] text-zinc-500">
                {dCount} chronologically logged watches
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleExportDiary}
            disabled={dCount === 0}
            className="w-full cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 py-4 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Download CSV
          </Button>
        </div>

        {/* Watchlist card */}
        <div className="group relative flex flex-col justify-between gap-4 overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950/20 p-6 shadow-md backdrop-blur-md transition-all duration-300 hover:border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-900/30 bg-blue-950/30 shadow-inner">
              <Film className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-200">Watchlist</h3>
              <p className="text-[10px] text-zinc-500">
                {wCount} movies & TV series listed
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleExportWatchlist}
            disabled={wCount === 0}
            className="w-full cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 py-4 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Download CSV
          </Button>
        </div>

        {/* Favorites card */}
        <div className="group relative flex flex-col justify-between gap-4 overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950/20 p-6 shadow-md backdrop-blur-md transition-all duration-300 hover:border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-900/30 bg-purple-950/30 shadow-inner">
              <Heart className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-200">Favorites</h3>
              <p className="text-[10px] text-zinc-500">
                {fCount} titles added as favorites
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleExportFavorites}
            disabled={fCount === 0}
            className="w-full cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 py-4 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Download CSV
          </Button>
        </div>

        {/* Ratings card */}
        <div className="group relative flex flex-col justify-between gap-4 overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950/20 p-6 shadow-md backdrop-blur-md transition-all duration-300 hover:border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-900/30 bg-yellow-950/30 shadow-inner">
              <Star className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-200">Ratings</h3>
              <p className="text-[10px] text-zinc-500">
                {rCount} custom star reviews logged
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleExportRatings}
            disabled={rCount === 0}
            className="w-full cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 py-4 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Download CSV
          </Button>
        </div>
      </div>

      {/* Export All action panel */}
      {hasAnyData && (
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleExportAll}
            disabled={exportingAll}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-white px-6 py-5 text-xs font-bold text-black shadow-md transition-all duration-200 hover:scale-[1.01] hover:bg-zinc-200 active:scale-98"
          >
            {exportingAll ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-800" />
            ) : (
              <FileSpreadsheet className="h-4 w-4" />
            )}
            Download All Datasets
          </Button>
        </div>
      )}
    </div>
  );
}
