"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DiaryItem, UserDoc } from "./types";
import {
  batchFetchMediaMetadata,
  StatsMetadata,
  searchPersonByName,
} from "@/lib/tmdb-actions";
import PersonQuickViewModal from "@/components/person-quick-view-modal";
import { ChartConfig } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, PieChart as ChartPie } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuickViewPersonState } from "@/hooks/use-query-modal-state";

// Modular Insights Sub-components
import { Period, COLORS } from "./insights/types";
import StatCards from "./insights/stat-cards";
import RatingDistributionChart from "./insights/rating-distribution-chart";
import GenreChart from "./insights/genre-chart";
import ActivityChart from "./insights/activity-chart";
import TopPeople from "./insights/top-people";

interface InsightsTabProps {
  diary: DiaryItem[] | undefined;
  user: UserDoc | null;
}

export function InsightsTab({ diary, user }: InsightsTabProps) {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>("all");
  const [metadata, setMetadata] = useState<Record<string, StatsMetadata>>({});
  const [loading, setLoading] = useState(false);
  const [searchingPerson, setSearchingPerson] = useState<string | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useQuickViewPersonState();

  const handlePersonClick = async (name: string) => {
    if (searchingPerson) return;
    setSearchingPerson(name);
    try {
      const id = await searchPersonByName(name);
      if (id) {
        setSelectedPersonId(id);
      } else {
        router.push(`/search?q=${encodeURIComponent(name)}`);
      }
    } catch (error) {
      console.error("Failed to navigate to person page:", error);
      router.push(`/search?q=${encodeURIComponent(name)}`);
    } finally {
      setSearchingPerson(null);
    }
  };

  // Fetch metadata for legacy/missing items, load the rest from database
  useEffect(() => {
    if (!diary || diary.length === 0) return;

    const dbMetadata: Record<string, StatsMetadata> = {};
    const missingMetadataItems: {
      mediaId: string;
      mediaType: "movie" | "tv";
      season?: number;
      episode?: number;
    }[] = [];

    diary.forEach((item) => {
      const key =
        item.season !== undefined && item.episode !== undefined
          ? `${item.mediaType}-${item.mediaId}-S${item.season}E${item.episode}`
          : `${item.mediaType}-${item.mediaId}`;
      if (
        item.runtime !== undefined &&
        item.genres &&
        item.cast &&
        item.directors &&
        item.watchProviders
      ) {
        dbMetadata[key] = {
          mediaId: item.mediaId,
          mediaType: item.mediaType as "movie" | "tv",
          runtime: item.runtime,
          genres: item.genres,
          cast: item.cast,
          directors: item.directors,
          watchProviders: item.watchProviders,
        };
      } else {
        missingMetadataItems.push({
          mediaId: item.mediaId,
          mediaType: item.mediaType as "movie" | "tv",
          season: item.season,
          episode: item.episode,
        });
      }
    });

    if (missingMetadataItems.length === 0) {
      Promise.resolve().then(() => {
        setMetadata(dbMetadata);
        setLoading(false);
      });
      return;
    }

    async function loadMetadata() {
      setLoading(true);
      try {
        const results = await batchFetchMediaMetadata(
          missingMetadataItems,
          user?.country || "US",
        );
        setMetadata({
          ...dbMetadata,
          ...results,
        });
      } catch (error) {
        console.error("Failed to load TMDB statistics metadata", error);
        setMetadata(dbMetadata);
      } finally {
        setLoading(false);
      }
    }

    loadMetadata();
  }, [diary, user?.country]);

  // Capture current time safely on mount to keep rendering pure
  const [now] = useState(() => Date.now());

  // Dynamically extract unique years present in diary entries
  const availableYears = useMemo(() => {
    if (!diary) return [];
    const years = new Set<number>();
    diary.forEach((item) => {
      if (item.watchedDate) {
        const year = new Date(item.watchedDate).getFullYear();
        years.add(year);
      }
    });
    return Array.from(years).sort((a, b) => b - a); // descending order
  }, [diary]);

  // Filter diary items based on selected period
  const filteredDiary = useMemo(() => {
    if (!diary) return [];
    const oneDay = 24 * 60 * 60 * 1000;

    return diary.filter((item) => {
      if (typeof period === "number") {
        const itemYear = new Date(item.watchedDate).getFullYear();
        return itemYear === period;
      }
      const diffDays = (now - item.watchedDate) / oneDay;
      if (period === "week") return diffDays <= 7;
      if (period === "month") return diffDays <= 30;
      return true; // all
    });
  }, [diary, period, now]);

  // Compute stats
  const stats = useMemo(() => {
    let moviesCount = 0;
    let tvCount = 0;
    let totalMinutes = 0;
    let ratedCount = 0;
    let sumRating = 0;

    const uniqueTvSeries = new Set<string>();
    const tvEntriesByShow: Record<string, DiaryItem[]> = {};

    const genreCounts: Record<string, number> = {};
    const actorMediaIds: Record<string, Set<string>> = {};
    const directorMediaIds: Record<string, Set<string>> = {};
    const providerCounts: Record<string, number> = {};
    const ratingsDistribution = Array.from({ length: 10 }, (_, i) => ({
      rating: i + 1,
      count: 0,
    }));

    filteredDiary.forEach((item) => {
      const key =
        item.season !== undefined && item.episode !== undefined
          ? `${item.mediaType}-${item.mediaId}-S${item.season}E${item.episode}`
          : `${item.mediaType}-${item.mediaId}`;
      const meta = metadata[key];

      if (item.mediaType === "movie") {
        moviesCount++;
      } else {
        tvCount++;
        uniqueTvSeries.add(item.mediaId);
        if (!tvEntriesByShow[item.mediaId]) {
          tvEntriesByShow[item.mediaId] = [];
        }
        tvEntriesByShow[item.mediaId].push(item);
      }

      if (item.rating) {
        ratedCount++;
        sumRating += item.rating;
        ratingsDistribution[item.rating - 1].count++;
      }

      if (meta) {
        totalMinutes += meta.runtime || 0;
        meta.genres.forEach((g) => {
          genreCounts[g] = (genreCounts[g] || 0) + 1;
        });
        meta.cast.forEach((a) => {
          if (!actorMediaIds[a]) {
            actorMediaIds[a] = new Set<string>();
          }
          actorMediaIds[a].add(item.mediaId);
        });
        meta.directors.forEach((d) => {
          if (!directorMediaIds[d]) {
            directorMediaIds[d] = new Set<string>();
          }
          directorMediaIds[d].add(item.mediaId);
        });
        meta.watchProviders.forEach((p) => {
          providerCounts[p] = (providerCounts[p] || 0) + 1;
        });
      }
    });

    let tvSeasonsCount = 0;
    let tvEpisodesCount = 0;

    Object.entries(tvEntriesByShow).forEach(([, entries]) => {
      const fullyWatchedSeasons = new Set<number>();
      let wholeSeasonsCount = 0;
      let wholeEpisodesCount = 0;
      const individualEpisodes = new Set<string>();

      entries.forEach((item) => {
        const type = item.diaryType ?? (item.season !== undefined && item.episode !== undefined
          ? "episode"
          : item.season !== undefined
            ? "season"
            : "tv");

        if (type === "episode") {
          const s = item.season ?? 1;
          const e = item.episode ?? 1;
          individualEpisodes.add(`S${s}-E${e}`);
        } else if (type === "season") {
          // Specific Season log
          const s = item.season ?? 1;
          fullyWatchedSeasons.add(s);
          wholeSeasonsCount += 1;
          wholeEpisodesCount += item.numberOfEpisodes !== undefined ? item.numberOfEpisodes : 1;
        } else {
          // Entire Show log
          const numSeasons = item.numberOfSeasons !== undefined ? item.numberOfSeasons : 1;
          for (let s = 1; s <= numSeasons; s++) {
            fullyWatchedSeasons.add(s);
          }
          wholeSeasonsCount += numSeasons;
          wholeEpisodesCount += item.numberOfEpisodes !== undefined ? item.numberOfEpisodes : 1;
        }
      });

      const partiallyWatchedSeasons = new Set<number>();
      let uncoveredEpisodesCount = 0;

      individualEpisodes.forEach((epKey) => {
        const parts = epKey.substring(1).split("-E");
        const s = parseInt(parts[0], 10);
        if (fullyWatchedSeasons.has(s)) {
          // Episode is already covered by a fully watched season or show log
          return;
        }
        uncoveredEpisodesCount += 1;
        partiallyWatchedSeasons.add(s);
      });

      tvSeasonsCount += wholeSeasonsCount + partiallyWatchedSeasons.size;
      tvEpisodesCount += wholeEpisodesCount + uncoveredEpisodesCount;
    });

    const averageRating =
      ratedCount > 0
        ? (sumRating / ratedCount).toFixed(sumRating / ratedCount < 10 ? 1 : 0)
        : "0.0";
    const hoursWatched = Math.round(totalMinutes / 60);

    // Sort mappings to get top items
    const topGenres = Object.entries(genreCounts)
      .map(([name, count]) => ({ name, value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const topActors = Object.entries(actorMediaIds)
      .map(([name, mediaIds]) => ({ name, count: mediaIds.size }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topDirectors = Object.entries(directorMediaIds)
      .map(([name, mediaIds]) => ({ name, count: mediaIds.size }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topProviders = Object.entries(providerCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      moviesCount,
      tvCount,
      tvSeriesCount: uniqueTvSeries.size,
      tvSeasonsCount,
      tvEpisodesCount,
      hoursWatched,
      averageRating,
      topGenres,
      topActors,
      topDirectors,
      topProviders,
      ratingsDistribution,
    };
  }, [filteredDiary, metadata]);

  // Configs for Shadcn Charts
  const ratingChartConfig = {
    count: {
      label: "Watches",
      color: "#3b82f6",
    },
  } satisfies ChartConfig;

  const trendsChartConfig = {
    count: {
      label: "Watches",
      color: "#10b981",
    },
  } satisfies ChartConfig;

  const genreChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    stats.topGenres.forEach((g, idx) => {
      config[g.name] = {
        label: g.name,
        color: COLORS[idx % COLORS.length],
      };
    });
    return config;
  }, [stats.topGenres]);

  // Compute viewing trends data
  const trendsData = useMemo(() => {
    const counts: Record<string, number> = {};

    filteredDiary.forEach((item) => {
      const date = new Date(item.watchedDate);
      let key = "";

      if (period === "week" || period === "month") {
        // Format as short date: "MMM dd"
        key = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      } else {
        // Format as month: "MMM yyyy"
        key = date.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        });
      }

      counts[key] = (counts[key] || 0) + 1;
    });

    // Convert map to array and sort chronologically
    return Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .reverse(); // Reverse if needed to maintain order, but since we parsed from sorted watchedDate (descending)
  }, [filteredDiary, period]);

  if (!diary || diary.length === 0) {
    return (
      <div className="flex min-h-[30vh] flex-col items-center justify-center text-center">
        <ChartPie className="mb-4 h-12 w-12 text-zinc-800" />
        <p className="text-sm text-zinc-500">
          No watch history available. Log titles to your diary to view
          statistics and insights.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in space-y-10 text-white duration-300">
      {/* Period Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Viewing Stats</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Analyze your watching patterns and preferences
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-1">
            {(["week", "month", "all"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "cursor-pointer rounded-xl px-4 py-1.5 text-xs font-bold uppercase transition-all duration-200",
                  period === p
                    ? "bg-white text-black shadow-md"
                    : "text-zinc-400 hover:text-zinc-200",
                )}
              >
                {p === "all"
                  ? "All Time"
                  : p === "week"
                    ? "This Week"
                    : "This Month"}
              </button>
            ))}
          </div>

          {availableYears.length > 0 && (
            <Select
              value={typeof period === "number" ? String(period) : "all"}
              onValueChange={(val) => {
                if (val && val !== "all") {
                  setPeriod(Number(val));
                } else {
                  setPeriod("all");
                }
              }}
            >
              <SelectTrigger className="text-zinc-450 h-9 cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-xs font-bold uppercase transition-all duration-200 hover:bg-zinc-900 hover:text-zinc-200">
                <SelectValue>
                  {typeof period === "number" ? period : "All Year"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border border-zinc-800 bg-zinc-950 text-white">
                <SelectGroup>
                  <SelectItem value="all" className="text-zinc-400">
                    All Year
                  </SelectItem>
                  {availableYears.map((yr) => (
                    <SelectItem
                      key={yr}
                      value={String(yr)}
                      className="text-white focus:bg-zinc-900 focus:text-white"
                    >
                      {yr}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <span className="ml-3 text-sm text-zinc-400">
            Summarizing your stats...
          </span>
        </div>
      ) : (
        <>
          {/* Key Metric Cards */}
          <StatCards stats={stats} />

          {/* Visualizations Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RatingDistributionChart
              data={stats.ratingsDistribution}
              config={ratingChartConfig}
            />

            <GenreChart
              topGenres={stats.topGenres}
              config={genreChartConfig}
            />

            <ActivityChart
              data={trendsData}
              config={trendsChartConfig}
            />
          </div>

          {/* Top Creators & Providers Grid */}
          <TopPeople
            topActors={stats.topActors}
            topDirectors={stats.topDirectors}
            topProviders={stats.topProviders}
            onPersonClick={handlePersonClick}
          />
        </>
      )}
      <PersonQuickViewModal
        isOpen={selectedPersonId !== null}
        onClose={() => setSelectedPersonId(null)}
        personId={selectedPersonId}
      />
    </div>
  );
}
