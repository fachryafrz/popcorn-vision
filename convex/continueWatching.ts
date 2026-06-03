import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

// Upsert Watch Progress
export const upsertProgress = mutation({
  args: {
    mediaId: v.string(),
    mediaType: v.string(), // "movie" or "tv"
    title: v.string(),
    posterPath: v.string(),
    season: v.optional(v.number()),
    episode: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    // Check if already exists
    const existing = await ctx.db
      .query("continueWatching")
      .withIndex("by_user_media", (q) =>
        q.eq("userId", userId).eq("mediaId", args.mediaId).eq("mediaType", args.mediaType)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        season: args.season,
        episode: args.episode,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    // Insert new item
    return await ctx.db.insert("continueWatching", {
      userId,
      mediaId: args.mediaId,
      mediaType: args.mediaType,
      title: args.title,
      posterPath: args.posterPath,
      season: args.season,
      episode: args.episode,
      updatedAt: Date.now(),
    });
  },
});

// Remove Watch Progress
export const removeProgress = mutation({
  args: {
    mediaId: v.string(),
    mediaType: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    const existing = await ctx.db
      .query("continueWatching")
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

// Get Continue Watching for current user
export const getProgress = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];

    const items = await ctx.db
      .query("continueWatching")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return items.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

// Get Watch Progress for a specific media item
export const getProgressForMedia = query({
  args: {
    mediaId: v.string(),
    mediaType: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return null;

    return await ctx.db
      .query("continueWatching")
      .withIndex("by_user_media", (q) =>
        q.eq("userId", user._id).eq("mediaId", args.mediaId).eq("mediaType", args.mediaType)
      )
      .first();
  },
});
