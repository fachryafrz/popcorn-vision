"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  matchImportItemsAction,
  ImportItem,
  MatchedImportItem,
} from "@/lib/tmdb-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Upload,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Loader2,
  FileSpreadsheet,
  Check,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
type PlatformSource = "imdb" | "letterboxd" | "tmdb" | "unknown";
type ImportStep = "upload" | "resolving" | "preview" | "importing" | "summary";

interface LocalDuplicatesState {
  watchlist: Set<string>;
  favorites: Set<string>;
  ratings: Set<string>;
  diary: Set<string>;
}

// Safe top-level function to avoid impure render warnings
const getNowTimestamp = (): number => {
  return Date.now();
};

export default function ImportWizard() {
  const [step, setStep] = useState<ImportStep>("upload");
  const [platform, setPlatform] = useState<PlatformSource>("unknown");
  const [targetTable, setTargetTable] = useState<
    "watchlist" | "favorites" | "ratings" | "diary"
  >("watchlist");

  const [resolvedItems, setResolvedItems] = useState<MatchedImportItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(
    new Set(),
  );

  // Progress tracking states
  const [resolveProgress, setResolveProgress] = useState(0);
  const [importProgress, setImportProgress] = useState(0);

  // Final summary stats
  const [summaryStats, setSummaryStats] = useState({
    watchlist: 0,
    favorites: 0,
    ratings: 0,
    diary: 0,
    duplicates: 0,
    skipped: 0,
  });

  // Convex existing lists (for local duplicate pre-checking)
  const currentUser = useQuery(api.users.getCurrentUser);
  const existingWatchlist = useQuery(api.watchlist.getWatchlist) || [];
  const existingFavorites = useQuery(api.favorites.getFavorites) || [];
  const existingRatings =
    useQuery(
      api.ratings.getUserRatings,
      currentUser ? { userId: currentUser.userId } : "skip",
    ) || [];
  const existingDiary = useQuery(api.diary.getUserDiary, {}) || [];

  // Convex mutations
  const addToWatchlist = useMutation(api.watchlist.addToWatchlist);
  const addToFavorites = useMutation(api.favorites.addToFavorites);
  const rateMedia = useMutation(api.ratings.rateMedia);
  const logWatch = useMutation(api.diary.logWatch);

  // --- Step 1: Parsing CSV File ---
  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      toast.error("Invalid file format. Please upload a .csv export file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text) {
        toast.error("Failed to read file content.");
        return;
      }

      try {
        const rows = parseCSV(text);
        if (rows.length < 2) {
          toast.error("The uploaded file contains no data rows.");
          return;
        }

        const headers = rows[0].map((h) => h.toLowerCase());
        const detected = detectPlatform(headers);

        if (detected === "unknown") {
          toast.error(
            "Could not automatically identify the CSV export source. Please make sure you are uploading a valid IMDb, Letterboxd, or TMDB export.",
          );
          return;
        }

        setPlatform(detected);

        // Parse Rows
        const parsedRows = mapCSVToImportItems(rows, detected, headers);
        if (parsedRows.length === 0) {
          toast.error(
            "Failed to parse any valid movies or TV series from this file.",
          );
          return;
        }

        toast.success(
          `Successfully parsed ${parsedRows.length} items from ${detected.toUpperCase()}!`,
        );

        // Proceed to Resolution
        resolveImportItems(parsedRows);
      } catch (err) {
        console.error(err);
        toast.error(
          "Failed to parse CSV file. Please make sure the format is valid.",
        );
      }
    };
    reader.readAsText(file);
  };

  // Detect Platform Source by headers
  const detectPlatform = (headers: string[]): PlatformSource => {
    if (headers.includes("const") && headers.includes("title type"))
      return "imdb";
    if (headers.includes("letterboxd uri") || headers.includes("uri"))
      return "letterboxd";
    if (
      headers.includes("tmdb id") ||
      headers.includes("tmdb_id") ||
      headers.includes("media_type")
    )
      return "tmdb";
    return "unknown";
  };

  // Mapping CSV grid into import structure
  const mapCSVToImportItems = (
    rows: string[][],
    source: PlatformSource,
    headers: string[],
  ): ImportItem[] => {
    const dataRows = rows.slice(1);
    const items: ImportItem[] = [];

    // Helper index lookups
    const idxOf = (colName: string) => headers.indexOf(colName.toLowerCase());

    const titleIdx = idxOf("title") !== -1 ? idxOf("title") : idxOf("name");
    const yearIdx =
      idxOf("year") !== -1 ? idxOf("year") : idxOf("release year");
    const typeIdx =
      idxOf("title type") !== -1 ? idxOf("title type") : idxOf("media type");
    const imdbIdx = idxOf("const") !== -1 ? idxOf("const") : idxOf("imdb id");

    // Ratings columns
    const ratingIdx =
      idxOf("your rating") !== -1 ? idxOf("your rating") : idxOf("rating");

    // Diary / watched date columns
    const watchedDateIdx =
      idxOf("watched date") !== -1 ? idxOf("watched date") : idxOf("date");
    const rewatchIdx = idxOf("rewatch");

    // Automatically infer import target based on columns
    let inferredTable: "watchlist" | "favorites" | "ratings" | "diary" =
      "watchlist";
    if (
      watchedDateIdx !== -1 &&
      (rewatchIdx !== -1 ||
        headers.includes("rewatch") ||
        headers.includes("tags"))
    ) {
      inferredTable = "diary";
    } else if (ratingIdx !== -1) {
      inferredTable = "ratings";
    }

    setTargetTable(inferredTable);

    for (const row of dataRows) {
      if (row.length < headers.length) continue;

      const rawTitle = row[titleIdx]?.trim();
      if (!rawTitle) continue;

      // Extract Year
      let year = yearIdx !== -1 ? row[yearIdx]?.trim() : "";
      if (year && year.length > 4) {
        // Handle dates like "2024-11-20"
        year = year.substring(0, 4);
      }

      // Extract type (movie vs tv)
      let type: "movie" | "tv" = "movie";
      if (typeIdx !== -1) {
        const rawType = row[typeIdx].toLowerCase();
        if (
          rawType.includes("tv") ||
          rawType.includes("series") ||
          rawType.includes("episode")
        ) {
          type = "tv";
        }
      }

      // Extract rating score (1-10)
      let rating: number | undefined = undefined;
      if (ratingIdx !== -1 && row[ratingIdx]) {
        const rawRating = row[ratingIdx].trim();
        if (source === "letterboxd") {
          rating = parseLetterboxdRating(rawRating);
        } else {
          const parsed = parseFloat(rawRating);
          if (!isNaN(parsed)) {
            // Scale TMDB/IMDb 1-10 to integers
            rating = Math.min(10, Math.max(1, Math.round(parsed)));
          }
        }
      }

      const imdbId = imdbIdx !== -1 ? row[imdbIdx]?.trim() : "";

      // Diary fields extraction
      let rewatch = false;
      if (rewatchIdx !== -1 && row[rewatchIdx]) {
        rewatch = row[rewatchIdx].toLowerCase() === "yes";
      }

      let watchedDate: number | undefined = undefined;
      if (
        inferredTable === "diary" &&
        watchedDateIdx !== -1 &&
        row[watchedDateIdx]
      ) {
        const rawDate = row[watchedDateIdx].trim();
        const parsedDate = new Date(rawDate).getTime();
        if (!isNaN(parsedDate)) {
          watchedDate = parsedDate;
        }
      }

      const tagsIdx = idxOf("tags");
      let review = "";
      if (tagsIdx !== -1 && row[tagsIdx]) {
        review = `Tags: ${row[tagsIdx]}`;
      }

      items.push({
        title: rawTitle,
        year: year || undefined,
        rating,
        imdbId: imdbId || undefined,
        type,
        sourceTable: inferredTable,
        watchedDate,
        rewatch,
        review: review || undefined,
      });
    }

    return items;
  };

  // Convert Letterboxd rating format (float/stars) to 1-10 scale
  const parseLetterboxdRating = (val: string): number => {
    const num = parseFloat(val);
    if (!isNaN(num)) {
      // Letterboxd scales are out of 5 stars. Multiply by 2.
      return Math.min(10, Math.max(1, Math.round(num * 2)));
    }
    // Count literal star characters
    let score = 0;
    for (const char of val) {
      if (char === "★") score += 2;
      if (char === "½") score += 1;
    }
    return score || 6; // fallback default
  };

  // Custom robust CSV grid parser
  const parseCSV = (text: string): string[][] => {
    const result: string[][] = [];
    let row: string[] = [];
    let col = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (inQuotes) {
        if (char === '"') {
          if (nextChar === '"') {
            col += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          col += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ",") {
          row.push(col.trim());
          col = "";
        } else if (char === "\r" || char === "\n") {
          row.push(col.trim());
          col = "";
          if (row.some((c) => c !== "")) {
            result.push(row);
          }
          row = [];
          if (char === "\r" && nextChar === "\n") {
            i++;
          }
        } else {
          col += char;
        }
      }
    }

    if (col !== "" || row.length > 0) {
      row.push(col.trim());
      if (row.some((c) => c !== "")) {
        result.push(row);
      }
    }

    return result;
  };

  // --- Step 2: Batch Resolution with TMDB Server Action ---
  const resolveImportItems = async (items: ImportItem[]) => {
    setStep("resolving");
    setResolveProgress(0);

    const chunkSize = 15; // Small batch size to avoid performance bottlenecks
    const resolved: MatchedImportItem[] = [];

    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize);
      try {
        const results = await matchImportItemsAction(chunk);
        resolved.push(...results);
      } catch (err) {
        console.error("Batch matching error: ", err);
      }
      const progress = Math.min(
        100,
        Math.round(((i + chunk.length) / items.length) * 100),
      );
      setResolveProgress(progress);
    }

    setResolvedItems(resolved);

    // Build duplicates mappings to crosscheck local caches
    const duplicates = getDuplicatePairs();

    // Auto-select valid ready items that are NOT local duplicates
    const initialSelected = new Set<string>();
    resolved.forEach((item, index) => {
      if (item.matched) {
        const isDuplicate = checkItemIsDuplicate(item, duplicates);
        if (!isDuplicate) {
          initialSelected.add(String(index));
        }
      }
    });

    setSelectedItemIds(initialSelected);
    setStep("preview");
  };

  // Build key indices for existing user records
  const getDuplicatePairs = (): LocalDuplicatesState => {
    return {
      watchlist: new Set(
        existingWatchlist.map((w) => `${w.mediaType}-${w.mediaId}`),
      ),
      favorites: new Set(
        existingFavorites.map((f) => `${f.mediaType}-${f.mediaId}`),
      ),
      ratings: new Set(
        existingRatings.map((r) => `${r.mediaType}-${r.mediaId}`),
      ),
      diary: new Set(
        existingDiary.map((d) => {
          const dateStr = d.watchedDate
            ? new Date(d.watchedDate).toISOString().split("T")[0]
            : "";
          return `${d.mediaType}-${d.mediaId}-${dateStr}`;
        }),
      ),
    };
  };

  const checkItemIsDuplicate = (
    item: MatchedImportItem,
    state: LocalDuplicatesState,
  ): boolean => {
    const key = `${item.mediaType}-${item.mediaId}`;
    if (item.sourceTable === "watchlist") return state.watchlist.has(key);
    if (item.sourceTable === "favorites") return state.favorites.has(key);
    if (item.sourceTable === "ratings") return state.ratings.has(key);
    if (item.sourceTable === "diary") {
      const dateStr = item.watchedDate
        ? new Date(item.watchedDate).toISOString().split("T")[0]
        : "";
      return state.diary.has(`${item.mediaType}-${item.mediaId}-${dateStr}`);
    }
    return false;
  };

  // Toggle selection
  const handleToggleSelection = (idx: string) => {
    const updated = new Set(selectedItemIds);
    if (updated.has(idx)) updated.delete(idx);
    else updated.add(idx);
    setSelectedItemIds(updated);
  };

  const handleToggleAll = () => {
    const updated = new Set<string>();
    const duplicates = getDuplicatePairs();

    if (selectedItemIds.size === 0) {
      resolvedItems.forEach((item, index) => {
        if (item.matched && !checkItemIsDuplicate(item, duplicates)) {
          updated.add(String(index));
        }
      });
    }
    setSelectedItemIds(updated);
  };

  const handleTargetTableChange = (
    newTable: "watchlist" | "favorites" | "ratings" | "diary",
  ) => {
    setTargetTable(newTable);

    // Update all matched resolved items so they point to the new destination table
    const updatedItems = resolvedItems.map((item) => ({
      ...item,
      sourceTable: newTable,
    }));
    setResolvedItems(updatedItems);

    // Auto-select valid ready items that are NOT local duplicates in the new table
    const duplicates = getDuplicatePairs();
    const initialSelected = new Set<string>();
    updatedItems.forEach((item, index) => {
      if (item.matched) {
        const isDuplicate = checkItemIsDuplicate(item, duplicates);
        if (!isDuplicate) {
          initialSelected.add(String(index));
        }
      }
    });
    setSelectedItemIds(initialSelected);
  };

  // --- Step 3: Convex Commits ---
  const handleConfirmImport = async () => {
    if (selectedItemIds.size === 0) {
      toast.error("No items selected to import.");
      return;
    }

    setStep("importing");
    setImportProgress(0);

    const importIndices = Array.from(selectedItemIds).map(Number);
    const totalToImport = importIndices.length;

    let wCount = 0;
    let fCount = 0;
    let rCount = 0;
    let dCount = 0;
    let dupCount = resolvedItems.length - totalToImport;

    const duplicates = getDuplicatePairs();

    for (let i = 0; i < importIndices.length; i++) {
      const itemIdx = importIndices[i];
      const item = resolvedItems[itemIdx];

      try {
        if (checkItemIsDuplicate(item, duplicates)) {
          dupCount++;
          continue;
        }

        const args = {
          mediaId: item.mediaId,
          mediaType: item.mediaType,
          title: item.title,
          posterPath: item.posterPath,
          rating: item.rating || 5, // fallback rating
          releaseYear: item.releaseYear,
        };

        if (item.sourceTable === "watchlist") {
          await addToWatchlist(args);
          wCount++;
        } else if (item.sourceTable === "favorites") {
          await addToFavorites(args);
          fCount++;
        } else if (item.sourceTable === "ratings") {
          await rateMedia(args);
          rCount++;
        } else if (item.sourceTable === "diary") {
          await logWatch({
            ...args,
            watchedDate: item.watchedDate || getNowTimestamp(),
            rewatch: item.rewatch || false,
            review: item.review || "",
          });
          dCount++;
        }
      } catch (err) {
        console.error("Mutation commit error: ", err);
      }

      const progress = Math.min(
        100,
        Math.round(((i + 1) / totalToImport) * 100),
      );
      setImportProgress(progress);
    }

    // Capture stats for completion
    setSummaryStats({
      watchlist: wCount,
      favorites: fCount,
      ratings: rCount,
      diary: dCount,
      duplicates: dupCount,
      skipped: resolvedItems.filter((i) => !i.matched).length,
    });

    setStep("summary");
    toast.success("Import successfully completed!");
  };

  const handleReset = () => {
    setStep("upload");
    setResolvedItems([]);
    setSelectedItemIds(new Set());
    setPlatform("unknown");
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Wizard Header */}
      <div>
        <h2 className="mb-1 text-xl font-bold tracking-tight text-white">
          Import Watchlist, Favorites & Ratings
        </h2>
        <p className="text-xs text-zinc-500">
          Migrate your personal lists and rating reviews from external platforms
          seamlessly.
        </p>
      </div>

      {/* STEP 1: Upload View */}
      {step === "upload" && (
        <div className="space-y-6">
          <div className="group relative overflow-hidden rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/20 p-8 text-center shadow-lg backdrop-blur-md transition-all duration-300 hover:border-zinc-700/80 hover:bg-zinc-950/30 md:p-12">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 shadow-inner transition-transform duration-300 group-hover:scale-105">
                <Upload className="h-7 w-7 text-blue-500" />
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
                  onChange={handleCSVUpload}
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
            {[
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
            ].map((guide, i) => (
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
      )}

      {/* STEP 2: Resolution loading view */}
      {step === "resolving" && (
        <div className="flex flex-col items-center justify-center gap-5 rounded-3xl border border-zinc-900 bg-zinc-950/20 py-20 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <div>
            <h3 className="mb-1 text-base font-bold text-zinc-200">
              Resolving Items on TMDB
            </h3>
            <p className="text-xs text-zinc-500">
              Matching your titles and external IDs against TMDB catalog…
            </p>
          </div>
          <div className="h-2.5 w-full max-w-xs overflow-hidden rounded-full border border-zinc-800 bg-zinc-900">
            <div
              style={{ width: `${resolveProgress}%` }}
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
            />
          </div>
          <span className="text-xs font-bold text-zinc-400">
            {resolveProgress}% completed
          </span>
        </div>
      )}

      {/* STEP 3: Preview list view */}
      {step === "preview" && (
        <div className="space-y-6">
          {/* Top Panel Actions info */}
          <div className="border-zinc-850 flex flex-col flex-wrap items-start justify-between gap-4 rounded-2xl border bg-zinc-900/10 p-4 md:flex-row md:items-center">
            <div className="space-y-3">
              <p className="text-xs text-zinc-400">
                Source Platform:{" "}
                <span className="font-bold text-white uppercase">
                  {platform}
                </span>
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-medium text-zinc-400">
                  Target Category:
                </span>
                <div className="border-zinc-850 flex items-center gap-1 rounded-xl border bg-zinc-950/60 p-1">
                  {(
                    [
                      { id: "watchlist", label: "Watchlist" },
                      { id: "favorites", label: "Favorites" },
                      { id: "ratings", label: "Ratings" },
                      { id: "diary", label: "Diary" },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTargetTableChange(tab.id)}
                      className={cn(
                        "cursor-pointer rounded-lg px-3 py-1.5 text-[10px] font-black tracking-wider uppercase transition-all",
                        targetTable === tab.id
                          ? "scale-[1.02] bg-blue-600 text-white shadow-md"
                          : "hover:text-zinc-350 text-zinc-500",
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="h-9 cursor-pointer rounded-xl border-zinc-800 text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmImport}
                disabled={selectedItemIds.size === 0}
                className="h-9 cursor-pointer rounded-xl bg-white text-xs font-bold text-black hover:bg-zinc-200"
              >
                Confirm Import ({selectedItemIds.size} items)
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Matches & Duplicates Table */}
          <div className="overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950/10 shadow-lg">
            <div className="flex items-center justify-between border-b border-zinc-900/80 bg-zinc-900/10 p-4">
              <span className="text-xs font-bold text-zinc-300">
                Preview Import Items
              </span>
              <button
                onClick={handleToggleAll}
                className="cursor-pointer text-[10px] font-bold text-blue-400 hover:text-blue-300 hover:underline"
              >
                {selectedItemIds.size > 0
                  ? "Deselect All"
                  : "Select All Available"}
              </button>
            </div>

            <div className="max-h-[450px] divide-y divide-zinc-900/50 overflow-y-auto">
              {resolvedItems.map((item, idx) => {
                const isSelected = selectedItemIds.has(String(idx));
                const duplicates = getDuplicatePairs();
                const isDuplicate = checkItemIsDuplicate(item, duplicates);

                return (
                  <div
                    key={idx}
                    className={cn(
                      "flex items-center justify-between gap-4 p-4 transition-all",
                      !item.matched ? "bg-zinc-950/40 opacity-60" : "",
                      isDuplicate ? "bg-red-950/5 opacity-80" : "",
                    )}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      {/* Thumbnail poster fallback */}
                      <div className="flex h-12 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-800/80 bg-zinc-900">
                        {item.matched && item.posterPath ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${item.posterPath}`}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Database className="h-4.5 w-4.5 text-zinc-700" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs leading-tight font-bold text-white">
                          {item.title}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2 text-[10px] font-semibold text-zinc-500 uppercase">
                          <span>{item.mediaType}</span>
                          {item.releaseYear && (
                            <>
                              <span>•</span>
                              <span>{item.releaseYear}</span>
                            </>
                          )}
                          {item.rating && (
                            <>
                              <span>•</span>
                              <span className="text-yellow-500">
                                ★ {item.rating}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Checkbox Status indicators */}
                    <div className="flex shrink-0 items-center gap-3">
                      {isDuplicate ? (
                        <span className="flex items-center gap-1 rounded-lg border border-red-900/30 bg-red-950/20 px-2 py-1 text-[9px] font-bold text-red-400/90 uppercase select-none">
                          <AlertTriangle className="h-3 w-3" />
                          Duplicate
                        </span>
                      ) : !item.matched ? (
                        <span className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1 text-[9px] font-bold text-zinc-500 uppercase select-none">
                          Unmatched
                        </span>
                      ) : (
                        <button
                          onClick={() => handleToggleSelection(String(idx))}
                          className={cn(
                            "flex h-5 w-5 cursor-pointer items-center justify-center rounded-lg border transition-all",
                            isSelected
                              ? "border-blue-500 bg-blue-600 text-white"
                              : "border-zinc-800 text-transparent hover:border-zinc-700",
                          )}
                        >
                          <Check className="h-3.5 w-3.5 stroke-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Importing Execution view */}
      {step === "importing" && (
        <div className="flex flex-col items-center justify-center gap-5 rounded-3xl border border-zinc-900 bg-zinc-950/20 py-20 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <div>
            <h3 className="mb-1 text-base font-bold text-zinc-200">
              Adding Entries
            </h3>
            <p className="text-xs text-zinc-500">
              Saving your data securely...
            </p>
          </div>
          <div className="h-2.5 w-full max-w-xs overflow-hidden rounded-full border border-zinc-800 bg-zinc-900">
            <div
              style={{ width: `${importProgress}%` }}
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
            />
          </div>
          <span className="text-xs font-bold text-zinc-400">
            {importProgress}% completed
          </span>
        </div>
      )}

      {/* STEP 5: Final Summary view */}
      {step === "summary" && (
        <div className="space-y-6">
          <div className="space-y-6 rounded-3xl border border-zinc-900 bg-zinc-950/20 p-6 text-center shadow-xl md:p-8">
            <div className="flex flex-col items-center justify-center gap-3">
              <CheckCircle className="h-12 w-12 text-emerald-500" />
              <div>
                <h3 className="mb-1 text-lg font-black text-zinc-200">
                  Import Summary List
                </h3>
                <p className="text-xs text-zinc-500">
                  Your data has been successfully processed and synced with
                  Popcorn Vision database.
                </p>
              </div>
            </div>

            {/* Results Grid counts */}
            <div className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                {
                  label: "Watchlist",
                  value: summaryStats.watchlist,
                  color: "text-blue-400",
                },
                {
                  label: "Favorites",
                  value: summaryStats.favorites,
                  color: "text-purple-400",
                },
                {
                  label: "Ratings",
                  value: summaryStats.ratings,
                  color: "text-yellow-400",
                },
                {
                  label: "Diary",
                  value: summaryStats.diary,
                  color: "text-emerald-400",
                },
                {
                  label: "Duplicates",
                  value: summaryStats.duplicates,
                  color: "text-zinc-500",
                },
                {
                  label: "Unmatched",
                  value: summaryStats.skipped,
                  color: "text-red-400/70",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex min-h-20 flex-col justify-between rounded-2xl border border-zinc-900 bg-zinc-900/40 p-3 sm:min-h-24 sm:p-4"
                >
                  <span className="block text-[10px] leading-tight font-black tracking-wide text-zinc-500 uppercase">
                    {stat.label}
                  </span>
                  <span
                    className={cn("mt-2 block text-2xl font-black", stat.color)}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mx-auto flex w-full max-w-xs flex-col items-center justify-center gap-3 pt-6 sm:max-w-md sm:flex-row">
              <Button
                onClick={handleReset}
                variant="outline"
                className="h-11 w-full cursor-pointer rounded-xl border-zinc-800 text-xs font-semibold sm:w-1/2"
              >
                Import Another File
              </Button>
              <Button
                onClick={() => window.location.reload()}
                className="h-11 w-full cursor-pointer rounded-xl bg-white text-xs font-bold text-black shadow-md hover:bg-zinc-200 sm:w-1/2"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
