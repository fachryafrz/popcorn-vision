"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DiaryItem, UserDoc } from "./types";
import {
  batchFetchMediaMetadata,
  StatsMetadata,
  searchPersonByName,
} from "@/lib/tmdb-actions";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Film,
  Tv,
  Clock,
  Star,
  Loader2,
  Sparkles,
  TrendingUp,
  User,
  Video,
  Tv2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

interface InsightsTabProps {
  diary: DiaryItem[] | undefined;
  user: UserDoc | null;
}

type Period = "week" | "month" | "all" | number;

export function InsightsTab({ diary, user }: InsightsTabProps) {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>("all");
  const [metadata, setMetadata] = useState<Record<string, StatsMetadata>>({});
  const [loading, setLoading] = useState(false);
  const [searchingPerson, setSearchingPerson] = useState<string | null>(null);

  const handlePersonClick = async (name: string) => {
    if (searchingPerson) return;
    setSearchingPerson(name);
    try {
      const id = await searchPersonByName(name);
      if (id) {
        router.push(`/person/${id}`);
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

    Object.entries(tvEntriesByShow).forEach(([mediaId, entries]) => {
      let maxWholeSeasons = 0;
      let sumWholeEpisodes = 0;
      let sumWholeSeasons = 0;
      let hasWholeShowEntry = false;

      const indSeasons = new Set<number>();
      const indEpisodes = new Set<string>();

      entries.forEach((item) => {
        if (item.season !== undefined && item.episode !== undefined) {
          indSeasons.add(item.season);
          indEpisodes.add(`S${item.season}-E${item.episode}`);
        } else {
          hasWholeShowEntry = true;
          const numSeasons = item.numberOfSeasons !== undefined ? item.numberOfSeasons : 1;
          const numEpisodes = item.numberOfEpisodes !== undefined ? item.numberOfEpisodes : 1;
          
          sumWholeSeasons += numSeasons;
          sumWholeEpisodes += numEpisodes;
          if (numSeasons > maxWholeSeasons) {
            maxWholeSeasons = numSeasons;
          }
        }
      });

      if (hasWholeShowEntry) {
        let uncovSeasonsCount = 0;
        indSeasons.forEach((s) => {
          if (s > maxWholeSeasons) {
            uncovSeasonsCount++;
          }
        });

        let uncovEpisodesCount = 0;
        indEpisodes.forEach((epKey) => {
          const s = parseInt(epKey.substring(1).split("-")[0], 10);
          if (s > maxWholeSeasons) {
            uncovEpisodesCount++;
          }
        });

        tvSeasonsCount += sumWholeSeasons + uncovSeasonsCount;
        tvEpisodesCount += sumWholeEpisodes + uncovEpisodesCount;
      } else {
        tvSeasonsCount += indSeasons.size;
        tvEpisodesCount += indEpisodes.size;
      }
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
        <Sparkles className="mb-4 h-12 w-12 text-zinc-800" />
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
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="group relative overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 p-6 transition-all hover:border-zinc-800 hover:bg-zinc-900/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-zinc-500 uppercase">
                  Movies
                </span>
                <Film className="text-primary h-5 w-5" />
              </div>
              <h3 className="mt-4 text-3xl font-extrabold tracking-tight">
                {stats.moviesCount}
              </h3>
              <p className="mt-1 text-xs text-zinc-500">watched</p>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 p-6 transition-all hover:border-zinc-800 hover:bg-zinc-900/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-zinc-500 uppercase">
                  TV Series
                </span>
                <Tv className="h-5 w-5 text-emerald-500" />
              </div>
              <h3 className="mt-4 text-3xl font-extrabold tracking-tight">
                {stats.tvSeriesCount}
              </h3>
              <p className="mt-1 text-xs text-zinc-500">
                {stats.tvSeasonsCount} {stats.tvSeasonsCount === 1 ? "season" : "seasons"} · {stats.tvEpisodesCount} {stats.tvEpisodesCount === 1 ? "episode" : "episodes"}
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 p-6 transition-all hover:border-zinc-800 hover:bg-zinc-900/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-zinc-500 uppercase">
                  Time
                </span>
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <h3 className="mt-4 text-3xl font-extrabold tracking-tight">
                {stats.hoursWatched}{" "}
                <span className="text-lg font-bold text-zinc-500">hrs</span>
              </h3>
              <p className="mt-1 text-xs text-zinc-500">total watch time</p>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 p-6 transition-all hover:border-zinc-800 hover:bg-zinc-900/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-zinc-500 uppercase">
                  Avg Rating
                </span>
                <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              </div>
              <h3 className="mt-4 text-3xl font-extrabold tracking-tight">
                {stats.averageRating}{" "}
                <span className="text-lg font-bold text-zinc-500">/10</span>
              </h3>
              <p className="mt-1 text-xs text-zinc-500">across rated items</p>
            </div>
          </div>

          {/* Visualizations Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Rating Distribution */}
            <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6">
              <h4 className="mb-6 flex items-center gap-2 text-sm font-bold tracking-wider text-zinc-400 uppercase">
                <Star className="h-4 w-4 text-yellow-500" /> Rating Distribution
              </h4>
              <div className="h-[250px] w-full">
                <ChartContainer
                  config={ratingChartConfig}
                  className="h-full w-full"
                >
                  <BarChart
                    data={stats.ratingsDistribution}
                    margin={{ left: -20, right: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="rating" fontSize={11} tickLine={false} />
                    <YAxis
                      fontSize={11}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          labelFormatter={(label) => `Rating: ${label}/10`}
                        />
                      }
                    />
                    <Bar
                      dataKey="count"
                      fill="var(--color-count)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>

            {/* Genre Breakdown */}
            <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6">
              <h4 className="mb-6 flex items-center gap-2 text-sm font-bold tracking-wider text-zinc-400 uppercase">
                <Film className="text-primary h-4 w-4" /> Genre Breakdown
              </h4>
              <div className="flex flex-col items-center justify-between gap-4 sm:h-[250px] sm:flex-row">
                {stats.topGenres.length > 0 ? (
                  <>
                    <div className="flex h-full w-full items-center justify-center sm:w-1/2">
                      <ChartContainer
                        config={genreChartConfig}
                        className="aspect-square h-full max-h-[200px] w-full"
                      >
                        <PieChart>
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Pie
                            data={stats.topGenres}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {stats.topGenres.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ChartContainer>
                    </div>
                    <div className="flex w-full flex-1 flex-col gap-2.5">
                      {stats.topGenres.map((genre, index) => (
                        <div
                          key={genre.name}
                          className="flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2.5 w-2.5 rounded-full"
                              style={{
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            />
                            <span className="font-semibold text-zinc-300">
                              {genre.name}
                            </span>
                          </div>
                          <span className="font-bold text-zinc-500">
                            {genre.value} items
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-1 items-center justify-center text-xs text-zinc-600 italic">
                    Not enough data
                  </div>
                )}
              </div>
            </div>

            {/* Viewing Trends */}
            <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 lg:col-span-2">
              <h4 className="mb-6 flex items-center gap-2 text-sm font-bold tracking-wider text-zinc-400 uppercase">
                <TrendingUp className="h-4 w-4 text-emerald-500" /> Viewing
                Trends
              </h4>
              <div className="h-[250px] w-full">
                {trendsData.length > 0 ? (
                  <ChartContainer
                    config={trendsChartConfig}
                    className="h-full w-full"
                  >
                    <AreaChart
                      data={trendsData}
                      margin={{ left: -20, right: 10 }}
                    >
                      <defs>
                        <linearGradient
                          id="trendGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="var(--color-count)"
                            stopOpacity={0.2}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-count)"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" fontSize={11} tickLine={false} />
                      <YAxis
                        fontSize={11}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="var(--color-count)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#trendGradient)"
                      />
                    </AreaChart>
                  </ChartContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-zinc-600 italic">
                    Not enough data
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Creators & Providers Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Top Actors */}
            <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6">
              <h4 className="mb-4 flex items-center gap-2 text-xs font-bold tracking-wider text-zinc-500 uppercase">
                <User className="text-primary h-4 w-4" /> Top Actors
              </h4>
              <div className="space-y-3">
                {stats.topActors.length > 0 ? (
                  stats.topActors.map((actor, idx) => (
                    <div
                      key={actor.name}
                      onClick={() => handlePersonClick(actor.name)}
                      className={cn(
                        "group flex cursor-pointer items-center justify-between rounded-lg text-xs transition-all duration-200",
                      )}
                    >
                      <span className="flex items-center gap-1.5 font-semibold text-zinc-300">
                        <span>{idx + 1}.</span>
                        <span className="group-hover:underline">
                          {actor.name}
                        </span>
                      </span>
                      <span className="font-bold text-zinc-500">
                        {actor.count} films
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-650 text-xs italic">
                    No actor metadata available.
                  </p>
                )}
              </div>
            </div>

            {/* Top Directors */}
            <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6">
              <h4 className="mb-4 flex items-center gap-2 text-xs font-bold tracking-wider text-zinc-500 uppercase">
                <Video className="h-4 w-4 text-emerald-400" /> Top Directors
              </h4>
              <div className="space-y-3">
                {stats.topDirectors.length > 0 ? (
                  stats.topDirectors.map((director, idx) => (
                    <div
                      key={director.name}
                      onClick={() => handlePersonClick(director.name)}
                      className={cn(
                        "group flex cursor-pointer items-center justify-between rounded-lg text-xs transition-all duration-200",
                      )}
                    >
                      <span className="flex items-center gap-1.5 font-semibold text-zinc-300">
                        <span>{idx + 1}.</span>
                        <span className="group-hover:underline">
                          {director.name}
                        </span>
                      </span>
                      <span className="font-bold text-zinc-500">
                        {director.count} titles
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-650 text-xs italic">
                    No director metadata available.
                  </p>
                )}
              </div>
            </div>

            {/* Top Streaming Services */}
            <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6">
              <h4 className="mb-4 flex items-center gap-2 text-xs font-bold tracking-wider text-zinc-500 uppercase">
                <Tv2 className="h-4 w-4 text-amber-400" /> Top Streaming
                Providers
              </h4>
              <div className="space-y-3">
                {stats.topProviders.length > 0 ? (
                  stats.topProviders.map((provider, idx) => (
                    <div
                      key={provider.name}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-zinc-300">
                        {idx + 1}. {provider.name}
                      </span>
                      <span className="font-bold text-zinc-500">
                        {provider.count} watches
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-650 text-xs italic">
                    No streaming provider details found.
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
