import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";
import { logActivity } from "./activities";

// Add to Watchlist
export const addToWatchlist = mutation({
  args: {
    mediaId: v.string(),
    mediaType: v.string(), // "movie" or "tv"
    title: v.string(),
    posterPath: v.string(),
    rating: v.number(),
    releaseYear: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Get authenticated user
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id; // Better Auth user ID

    // 2. Check if already exists
    const existing = await ctx.db
      .query("watchlist")
      .withIndex("by_user_media", (q) =>
        q.eq("userId", userId).eq("mediaId", args.mediaId).eq("mediaType", args.mediaType)
      )
      .first();

    if (existing) {
      return existing._id;
    }

    // Log Activity
    await logActivity(ctx, {
      userId,
      type: "watchlist",
      mediaId: args.mediaId,
      mediaType: args.mediaType,
      title: args.title,
      posterPath: args.posterPath,
    });

    // 3. Insert new item
    return await ctx.db.insert("watchlist", {
      userId,
      mediaId: args.mediaId,
      mediaType: args.mediaType,
      title: args.title,
      posterPath: args.posterPath,
      rating: args.rating,
      releaseYear: args.releaseYear,
      addedAt: Date.now(),
    });
  },
});

// Remove from Watchlist
export const removeFromWatchlist = mutation({
  args: {
    mediaId: v.string(),
    mediaType: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    const existing = await ctx.db
      .query("watchlist")
      .withIndex("by_user_media", (q) =>
        q.eq("userId", userId).eq("mediaId", args.mediaId).eq("mediaType", args.mediaType)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return true;
    }
    return false;
  },
});

// Get Watchlist for current user
export const getWatchlist = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("watchlist")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

// Get Watchlist for a specific public userId
export const getPublicWatchlist = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("watchlist")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Check if a specific media is in the watchlist
export const checkWatchlistItem = query({
  args: {
    mediaId: v.string(),
    mediaType: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return false;

    const existing = await ctx.db
      .query("watchlist")
      .withIndex("by_user_media", (q) =>
        q.eq("userId", user._id).eq("mediaId", args.mediaId).eq("mediaType", args.mediaType)
      )
      .first();

    return !!existing;
  },
});

// Clear watchlist for current user
export const deleteAllWatchlist = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    const items = await ctx.db
      .query("watchlist")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const item of items) {
      await ctx.db.delete(item._id);
    }

    // Clean up watchlist activities
    const activities = await ctx.db
      .query("activities")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const watchlistActivities = activities.filter((a) => a.type === "watchlist");
    for (const act of watchlistActivities) {
      await ctx.db.delete(act._id);

      // Clean up likes and comments associated with the watchlist activities
      const likes = await ctx.db
        .query("activityLikes")
        .withIndex("by_activity", (q) => q.eq("activityId", act._id))
        .collect();
      for (const l of likes) {
        await ctx.db.delete(l._id);
      }

      const comments = await ctx.db
        .query("activityComments")
        .withIndex("by_activity", (q) => q.eq("activityId", act._id))
        .collect();
      for (const c of comments) {
        await ctx.db.delete(c._id);
      }
    }

    return true;
  },
});

