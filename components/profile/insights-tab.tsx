"use client";

import { useState, useEffect, useMemo } from "react";
import { DiaryItem, UserDoc } from "./types";
import { batchFetchMediaMetadata, StatsMetadata } from "@/lib/tmdb-actions";
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
  const [period, setPeriod] = useState<Period>("all");
  const [metadata, setMetadata] = useState<Record<string, StatsMetadata>>({});
  const [loading, setLoading] = useState(false);

  // Fetch metadata for all diary items
  useEffect(() => {
    if (!diary || diary.length === 0) return;
    const items = diary.map((item) => ({
      mediaId: item.mediaId,
      mediaType: item.mediaType as "movie" | "tv",
    }));

    async function loadMetadata() {
      setLoading(true);
      try {
        const results = await batchFetchMediaMetadata(items, user?.country || "US");
        setMetadata(results);
      } catch (error) {
        console.error("Failed to load TMDB statistics metadata", error);
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

    const genreCounts: Record<string, number> = {};
    const actorCounts: Record<string, number> = {};
    const directorCounts: Record<string, number> = {};
    const providerCounts: Record<string, number> = {};
    const ratingsDistribution = Array.from({ length: 10 }, (_, i) => ({
      rating: i + 1,
      count: 0,
    }));

    filteredDiary.forEach((item) => {
      const key = `${item.mediaType}-${item.mediaId}`;
      const meta = metadata[key];

      if (item.mediaType === "movie") {
        moviesCount++;
      } else {
        tvCount++;
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
          actorCounts[a] = (actorCounts[a] || 0) + 1;
        });
        meta.directors.forEach((d) => {
          directorCounts[d] = (directorCounts[d] || 0) + 1;
        });
        meta.watchProviders.forEach((p) => {
          providerCounts[p] = (providerCounts[p] || 0) + 1;
        });
      }
    });

    const averageRating = ratedCount > 0 ? (sumRating / ratedCount).toFixed(1) : "0.0";
    const hoursWatched = Math.round(totalMinutes / 60);

    // Sort mappings to get top items
    const topGenres = Object.entries(genreCounts)
      .map(([name, count]) => ({ name, value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const topActors = Object.entries(actorCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topDirectors = Object.entries(directorCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topProviders = Object.entries(providerCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      moviesCount,
      tvCount,
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
        key = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      } else {
        // Format as month: "MMM yyyy"
        key = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
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
          No watch history available. Log titles to your diary to view statistics and insights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 text-white animate-in fade-in duration-300">
      {/* Period Selector Tabs */}
      <div className="flex justify-between items-center flex-wrap gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Viewing Stats</h2>
          <p className="text-xs text-zinc-500 mt-1">Analyze your watching patterns and preferences</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-zinc-900/60 p-1 rounded-2xl border border-zinc-800 gap-1">
            {(["week", "month", "all"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "cursor-pointer px-4 py-1.5 rounded-xl text-xs font-bold uppercase transition-all duration-200",
                  period === p
                    ? "bg-white text-black shadow-md"
                    : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                {p === "all" ? "All Time" : p === "week" ? "This Week" : "This Month"}
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
              <SelectTrigger className="cursor-pointer bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 text-zinc-450 hover:text-zinc-200 rounded-2xl px-4 py-2 text-xs font-bold uppercase transition-all duration-200 h-9">
                <SelectValue>{typeof period === "number" ? period : "All Year"}</SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border border-zinc-800 bg-zinc-950 text-white">
                <SelectGroup>
                  <SelectItem value="all" className="text-zinc-400">All Year</SelectItem>
                  {availableYears.map((yr) => (
                    <SelectItem key={yr} value={String(yr)} className="text-white focus:bg-zinc-900 focus:text-white">
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
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-3 text-sm text-zinc-400">Compiling your stats dashboard...</span>
        </div>
      ) : (
        <>
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="group relative overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 p-6 transition-all hover:-translate-y-1 hover:border-zinc-800 hover:bg-zinc-900/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Movies</span>
                <Film className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="mt-4 text-3xl font-extrabold tracking-tight">{stats.moviesCount}</h3>
              <p className="mt-1 text-xs text-zinc-500">watched</p>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 p-6 transition-all hover:-translate-y-1 hover:border-zinc-800 hover:bg-zinc-900/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">TV Series</span>
                <Tv className="h-5 w-5 text-emerald-500" />
              </div>
              <h3 className="mt-4 text-3xl font-extrabold tracking-tight">{stats.tvCount}</h3>
              <p className="mt-1 text-xs text-zinc-500">watched</p>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 p-6 transition-all hover:-translate-y-1 hover:border-zinc-800 hover:bg-zinc-900/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Time</span>
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <h3 className="mt-4 text-3xl font-extrabold tracking-tight">
                {stats.hoursWatched} <span className="text-lg font-bold text-zinc-500">hrs</span>
              </h3>
              <p className="mt-1 text-xs text-zinc-500">total watch time</p>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 p-6 transition-all hover:-translate-y-1 hover:border-zinc-800 hover:bg-zinc-900/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Avg Rating</span>
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              </div>
              <h3 className="mt-4 text-3xl font-extrabold tracking-tight">
                {stats.averageRating} <span className="text-lg font-bold text-zinc-500">/10</span>
              </h3>
              <p className="mt-1 text-xs text-zinc-500">across rated items</p>
            </div>
          </div>

          {/* Visualizations Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Rating Distribution */}
            <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6">
              <h4 className="text-sm font-bold tracking-wider uppercase text-zinc-400 mb-6 flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" /> Rating Distribution
              </h4>
              <div className="h-[250px] w-full">
                <ChartContainer config={ratingChartConfig} className="h-full w-full">
                  <BarChart data={stats.ratingsDistribution} margin={{ left: -20, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="rating" fontSize={11} tickLine={false} />
                    <YAxis fontSize={11} tickLine={false} allowDecimals={false} />
                    <ChartTooltip content={<ChartTooltipContent labelFormatter={(label) => `Rating: ${label}/10`} />} />
                    <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>

            {/* Genre Breakdown */}
            <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6">
              <h4 className="text-sm font-bold tracking-wider uppercase text-zinc-400 mb-6 flex items-center gap-2">
                <Film className="h-4 w-4 text-blue-500" /> Genre Breakdown
              </h4>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 h-[250px]">
                {stats.topGenres.length > 0 ? (
                  <>
                    <div className="h-full w-full sm:w-1/2 flex justify-center items-center">
                      <ChartContainer config={genreChartConfig} className="h-full w-full max-h-[200px] aspect-square">
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
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ChartContainer>
                    </div>
                    <div className="flex-1 w-full flex flex-col gap-2.5">
                      {stats.topGenres.map((genre, index) => (
                        <div key={genre.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-semibold text-zinc-300">{genre.name}</span>
                          </div>
                          <span className="font-bold text-zinc-500">{genre.value} items</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-zinc-600 text-xs italic">
                    Not enough data
                  </div>
                )}
              </div>
            </div>

            {/* Viewing Trends */}
            <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 lg:col-span-2">
              <h4 className="text-sm font-bold tracking-wider uppercase text-zinc-400 mb-6 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-500" /> Viewing Trends
              </h4>
              <div className="h-[250px] w-full">
                {trendsData.length > 0 ? (
                  <ChartContainer config={trendsChartConfig} className="h-full w-full">
                    <AreaChart data={trendsData} margin={{ left: -20, right: 10 }}>
                      <defs>
                        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" fontSize={11} tickLine={false} />
                      <YAxis fontSize={11} tickLine={false} allowDecimals={false} />
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
                  <div className="h-full flex items-center justify-center text-zinc-600 text-xs italic">
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
              <h4 className="text-xs font-bold tracking-wider uppercase text-zinc-500 mb-4 flex items-center gap-2">
                <User className="h-4 w-4 text-blue-400" /> Top Actors
              </h4>
              <div className="space-y-3">
                {stats.topActors.length > 0 ? (
                  stats.topActors.map((actor, idx) => (
                    <div key={actor.name} className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-300">
                        {idx + 1}. {actor.name}
                      </span>
                      <span className="font-bold text-zinc-500">{actor.count} films</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-650 italic">No actor metadata available.</p>
                )}
              </div>
            </div>

            {/* Top Directors */}
            <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6">
              <h4 className="text-xs font-bold tracking-wider uppercase text-zinc-500 mb-4 flex items-center gap-2">
                <Video className="h-4 w-4 text-emerald-400" /> Top Directors
              </h4>
              <div className="space-y-3">
                {stats.topDirectors.length > 0 ? (
                  stats.topDirectors.map((director, idx) => (
                    <div key={director.name} className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-300">
                        {idx + 1}. {director.name}
                      </span>
                      <span className="font-bold text-zinc-500">{director.count} titles</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-650 italic">No director metadata available.</p>
                )}
              </div>
            </div>

            {/* Top Streaming Services */}
            <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6">
              <h4 className="text-xs font-bold tracking-wider uppercase text-zinc-500 mb-4 flex items-center gap-2">
                <Tv2 className="h-4 w-4 text-amber-400" /> Top Streaming Providers
              </h4>
              <div className="space-y-3">
                {stats.topProviders.length > 0 ? (
                  stats.topProviders.map((provider, idx) => (
                    <div key={provider.name} className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-300">
                        {idx + 1}. {provider.name}
                      </span>
                      <span className="font-bold text-zinc-500">{provider.count} watches</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-650 italic">No streaming provider details found.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
