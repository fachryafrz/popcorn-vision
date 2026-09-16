"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "@/convex/_generated/api";
import {
  matchImportItemsAction,
  batchFetchMediaMetadata,
  ImportItem,
  MatchedImportItem,
  StatsMetadata,
} from "@/lib/tmdb-actions";
import { toast } from "sonner";
import {
  PlatformSource,
  ImportStep,
  TargetTable,
  SummaryStats,
} from "./import-wizard/types";
import UploadStep from "./import-wizard/upload-step";
import ResolvingStep from "./import-wizard/resolving-step";
import PreviewStep from "./import-wizard/preview-step";
import ImportingStep from "./import-wizard/importing-step";
import SummaryStep from "./import-wizard/summary-step";

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
  const [targetTable, setTargetTable] = useState<TargetTable>("watchlist");

  const [resolvedItems, setResolvedItems] = useState<MatchedImportItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(
    new Set(),
  );

  // Progress tracking states
  const [resolveProgress, setResolveProgress] = useState(0);
  const [importProgress, setImportProgress] = useState(0);

  // Final summary stats
  const [summaryStats, setSummaryStats] = useState<SummaryStats>({
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
            "Could not automatically identify the CSV export source. Please make sure you are uploading a valid IMDb, Letterboxd, TMDB, or Popcorn Vision export.",
          );
          return;
        }

        setPlatform(detected);

        // Parse Rows
        const parsedRows = mapCSVToImportItems(
          rows,
          detected,
          headers,
          file.name,
        );
        if (parsedRows.length === 0) {
          toast.error(
            "Failed to parse any valid movies or TV series from this file.",
          );
          return;
        }

        toast.success(
          `Successfully parsed ${parsedRows.length} items from ${detected === "popcorn" ? "Popcorn Vision" : detected.toUpperCase()}!`,
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
      (headers.includes("media_type") && !headers.includes("addedat"))
    )
      return "tmdb";
    if (headers.includes("mediatype") && headers.includes("addedat"))
      return "popcorn";
    return "unknown";
  };

  // Mapping CSV grid into import structure
  const mapCSVToImportItems = (
    rows: string[][],
    source: PlatformSource,
    headers: string[],
    filename?: string,
  ): ImportItem[] => {
    const dataRows = rows.slice(1);
    const items: ImportItem[] = [];

    // Helper index lookups
    const idxOf = (colName: string) => headers.indexOf(colName.toLowerCase());

    const titleIdx = idxOf("title") !== -1 ? idxOf("title") : idxOf("name");
    const yearIdx =
      idxOf("year") !== -1
        ? idxOf("year")
        : idxOf("release year") !== -1
          ? idxOf("release year")
          : idxOf("releaseyear");
    const typeIdx =
      idxOf("title type") !== -1
        ? idxOf("title type")
        : idxOf("media type") !== -1
          ? idxOf("media type")
          : idxOf("mediatype");
    const imdbIdx = idxOf("const") !== -1 ? idxOf("const") : idxOf("imdb id");

    // Ratings columns
    const ratingIdx =
      idxOf("your rating") !== -1 ? idxOf("your rating") : idxOf("rating");

    // Diary / watched date columns
    const watchedDateIdx =
      idxOf("watched date") !== -1
        ? idxOf("watched date")
        : idxOf("watcheddate") !== -1
          ? idxOf("watcheddate")
          : idxOf("date");
    const rewatchIdx = idxOf("rewatch");
    const seasonIdx = idxOf("season");
    const episodeIdx = idxOf("episode");
    const numberOfSeasonsIdx =
      idxOf("numberofseasons") !== -1
        ? idxOf("numberofseasons")
        : idxOf("number of seasons");
    const numberOfEpisodesIdx =
      idxOf("numberofepisodes") !== -1
        ? idxOf("numberofepisodes")
        : idxOf("number of episodes");
    const diaryTypeIdx =
      idxOf("diarytype") !== -1
        ? idxOf("diarytype")
        : idxOf("diary type") !== -1
          ? idxOf("diary type")
          : idxOf("diary_type");

    // Automatically infer import target based on columns and filename
    let inferredTable: TargetTable = "watchlist";

    if (filename) {
      const lowerFile = filename.toLowerCase();
      if (lowerFile.includes("watchlist")) {
        inferredTable = "watchlist";
      } else if (lowerFile.includes("favorite")) {
        inferredTable = "favorites";
      } else if (lowerFile.includes("rating")) {
        inferredTable = "ratings";
      } else if (lowerFile.includes("diary")) {
        inferredTable = "diary";
      } else if (
        watchedDateIdx !== -1 &&
        (rewatchIdx !== -1 ||
          headers.includes("rewatch") ||
          headers.includes("tags"))
      ) {
        inferredTable = "diary";
      } else if (ratingIdx !== -1) {
        inferredTable = "ratings";
      }
    } else {
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
        const val = row[rewatchIdx].toLowerCase();
        rewatch = val === "yes" || val === "true";
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

      let review = "";
      const reviewIdx = idxOf("review");
      if (reviewIdx !== -1 && row[reviewIdx]) {
        review = row[reviewIdx];
      } else {
        const tagsIdx = idxOf("tags");
        if (tagsIdx !== -1 && row[tagsIdx]) {
          review = `Tags: ${row[tagsIdx]}`;
        }
      }

      let season: number | undefined = undefined;
      if (seasonIdx !== -1 && row[seasonIdx]) {
        const s = parseInt(row[seasonIdx], 10);
        if (!isNaN(s)) season = s;
      }

      let episode: number | undefined = undefined;
      if (episodeIdx !== -1 && row[episodeIdx]) {
        const e = parseInt(row[episodeIdx], 10);
        if (!isNaN(e)) episode = e;
      }

      let numberOfSeasons: number | undefined = undefined;
      if (numberOfSeasonsIdx !== -1 && row[numberOfSeasonsIdx]) {
        const ns = parseInt(row[numberOfSeasonsIdx], 10);
        if (!isNaN(ns)) numberOfSeasons = ns;
      }

      let numberOfEpisodes: number | undefined = undefined;
      if (numberOfEpisodesIdx !== -1 && row[numberOfEpisodesIdx]) {
        const ne = parseInt(row[numberOfEpisodesIdx], 10);
        if (!isNaN(ne)) numberOfEpisodes = ne;
      }

      let diaryType: string | undefined = undefined;
      if (diaryTypeIdx !== -1 && row[diaryTypeIdx]) {
        const dt = row[diaryTypeIdx].trim().toLowerCase();
        if (["movie", "tv", "season", "episode"].includes(dt)) {
          diaryType = dt;
        }
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
        season,
        episode,
        numberOfSeasons,
        numberOfEpisodes,
        diaryType,
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

  const handleTargetTableChange = (newTable: TargetTable) => {
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

    // Fetch stats metadata in batch for diary entries
    const diaryImportItems = importIndices
      .map((idx) => resolvedItems[idx])
      .filter(
        (item) =>
          item.sourceTable === "diary" &&
          !checkItemIsDuplicate(item, duplicates),
      );

    let statsMetadataMap: Record<string, StatsMetadata> = {};
    if (diaryImportItems.length > 0) {
      try {
        const uniqueItems = diaryImportItems.map((item) => ({
          mediaId: item.mediaId,
          mediaType: item.mediaType as "movie" | "tv",
          season: item.season,
          episode: item.episode,
        }));
        statsMetadataMap = await batchFetchMediaMetadata(
          uniqueItems,
          currentUser?.country || "US",
        );
      } catch (err) {
        console.error(
          "Failed to batch fetch metadata for imported diary entries:",
          err,
        );
      }
    }

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
          releaseYear: item.releaseYear,
          rating: item.rating!,
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
          const key =
            item.season !== undefined && item.episode !== undefined
              ? `${item.mediaType}-${item.mediaId}-S${item.season}E${item.episode}`
              : item.season !== undefined
                ? `${item.mediaType}-${item.mediaId}-S${item.season}`
                : `${item.mediaType}-${item.mediaId}`;
          const meta = statsMetadataMap[key];
          const metadataArgs = meta
            ? {
                runtime: meta.runtime,
                genres: meta.genres,
                cast: meta.cast,
                directors: meta.directors,
                watchProviders: meta.watchProviders,
                numberOfSeasons: meta.numberOfSeasons,
                numberOfEpisodes: meta.numberOfEpisodes,
              }
            : {};

          await logWatch({
            ...args,
            watchedDate: item.watchedDate || getNowTimestamp(),
            rewatch: item.rewatch || false,
            review: item.review || "",
            season: item.season,
            episode: item.episode,
            numberOfSeasons:
              item.numberOfSeasons ?? metadataArgs.numberOfSeasons,
            numberOfEpisodes:
              item.numberOfEpisodes ?? metadataArgs.numberOfEpisodes,
            diaryType: item.diaryType,
            ...metadataArgs,
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
          Import Diary, Watchlist, Favorites & Ratings
        </h2>
        <p className="text-xs text-zinc-500">
          Migrate your personal lists and rating reviews from external platforms
          seamlessly.
        </p>
      </div>

      {/* STEP 1: Upload View */}
      {step === "upload" && <UploadStep onUpload={handleCSVUpload} />}

      {/* STEP 2: Resolution loading view */}
      {step === "resolving" && (
        <ResolvingStep resolveProgress={resolveProgress} />
      )}

      {/* STEP 3: Preview list view */}
      {step === "preview" && (
        <PreviewStep
          platform={platform}
          targetTable={targetTable}
          onTargetTableChange={handleTargetTableChange}
          selectedItemIds={selectedItemIds}
          onToggleSelection={handleToggleSelection}
          onToggleAll={handleToggleAll}
          onCancel={handleReset}
          onConfirm={handleConfirmImport}
          resolvedItems={resolvedItems}
          duplicates={getDuplicatePairs()}
          checkItemIsDuplicate={checkItemIsDuplicate}
        />
      )}

      {/* STEP 4: Importing Execution view */}
      {step === "importing" && (
        <ImportingStep importProgress={importProgress} />
      )}

      {/* STEP 5: Final Summary view */}
      {step === "summary" && (
        <SummaryStep summaryStats={summaryStats} onReset={handleReset} />
      )}
    </div>
  );
}
