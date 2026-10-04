import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Clean up expired TMDB cache entries daily at 03:00 UTC
crons.daily(
  "cleanup expired tmdb cache",
  { hourUTC: 3, minuteUTC: 0 },
  internal.tmdbCache.cleanupExpired,
  { limit: 100 }
);

export default crons;
