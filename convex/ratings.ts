import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";
import { logActivity } from "./activities";

// Add or edit rating for media
export const rateMedia = mutation({
  args: {
    mediaId: v.string(),
    mediaType: v.string(), // "movie" or "tv"
    title: v.string(),
    posterPath: v.string(),
    rating: v.number(), // score from 1-10
    releaseYear: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    if (args.rating < 1 || args.rating > 10) {
      throw new Error("Rating must be between 1 and 10");
    }

    // Log Activity
    await logActivity(ctx, {
      userId,
      type: "rate",
      mediaId: args.mediaId,
      mediaType: args.mediaType,
      title: args.title,
      posterPath: args.posterPath,
      rating: args.rating,
    });

    const existing = await ctx.db
      .query("ratings")
      .withIndex("by_user_media", (q) =>
        q.eq("userId", userId).eq("mediaId", args.mediaId).eq("mediaType", args.mediaType)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        rating: args.rating,
        addedAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("ratings", {
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

// Delete user rating
export const deleteRating = mutation({
  args: {
    mediaId: v.string(),
    mediaType: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    const existing = await ctx.db
      .query("ratings")
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

// Get user rating for specific item
export const getUserRating = query({
  args: {
    mediaId: v.string(),
    mediaType: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return null;

    const existing = await ctx.db
      .query("ratings")
      .withIndex("by_user_media", (q) =>
        q.eq("userId", user._id).eq("mediaId", args.mediaId).eq("mediaType", args.mediaType)
      )
      .first();

    return existing ? existing.rating : null;
  },
});

// Get all ratings of a specific user by their userId
export const getUserRatings = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ratings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get community rating stats
export const getCommunityRatingStats = query({
  args: {
    mediaId: v.string(),
    mediaType: v.string(),
  },
  handler: async (ctx, args) => {
    const ratings = await ctx.db
      .query("ratings")
      .withIndex("by_media", (q) => q.eq("mediaId", args.mediaId).eq("mediaType", args.mediaType))
      .collect();

    if (ratings.length === 0) {
      return {
        averageRating: 0,
        totalRatings: 0,
      };
    }

    const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    const average = Number((sum / ratings.length).toFixed(1));

    return {
      averageRating: average,
      totalRatings: ratings.length,
    };
  },
});
