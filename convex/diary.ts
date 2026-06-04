import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";
import { logActivity } from "./activities";

// Helper to get current authenticated user profile
async function getAuthedUser(ctx: QueryCtx | MutationCtx) {
  try {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) return null;
    return await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
  } catch {
    return null;
  }
}

// ----------------------------------------------------
// WRITE MUTATIONS
// ----------------------------------------------------

// Log a watch entry in the user's diary
export const logWatch = mutation({
  args: {
    mediaId: v.string(),
    mediaType: v.string(), // "movie" or "tv"
    title: v.string(),
    posterPath: v.string(),
    releaseYear: v.string(),
    watchedDate: v.number(), // watch date timestamp
    rewatch: v.boolean(),
    review: v.optional(v.string()), // optional diary notes
    rating: v.optional(v.number()), // optional rating (1-10)
    season: v.optional(v.number()),
    episode: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthedUser(ctx);
    if (!currentUser) {
      throw new Error("Must be logged in to log a watch entry");
    }

    if (args.rating !== undefined && (args.rating < 1 || args.rating > 10)) {
      throw new Error("Rating must be between 1 and 10");
    }

    // Log Activity
    if (args.review) {
      await logActivity(ctx, {
        userId: currentUser.userId,
        type: "review",
        mediaId: args.mediaId,
        mediaType: args.mediaType,
        title: args.title,
        posterPath: args.posterPath,
        rating: args.rating,
        review: args.review,
      });
    } else if (args.rating !== undefined) {
      await logActivity(ctx, {
        userId: currentUser.userId,
        type: "rate",
        mediaId: args.mediaId,
        mediaType: args.mediaType,
        title: args.title,
        posterPath: args.posterPath,
        rating: args.rating,
      });
    }

    // 1. Insert diary log
    const diaryId = await ctx.db.insert("diary", {
      userId: currentUser.userId,
      mediaId: args.mediaId,
      mediaType: args.mediaType,
      title: args.title,
      posterPath: args.posterPath,
      releaseYear: args.releaseYear,
      watchedDate: args.watchedDate,
      rewatch: args.rewatch,
      review: args.review,
      rating: args.rating,
      season: args.season,
      episode: args.episode,
      addedAt: Date.now(),
    });

    // 2. Sync to ratings table if rating is provided
    if (args.rating !== undefined) {
      const existingRating = await ctx.db
        .query("ratings")
        .withIndex("by_user_media", (q) =>
          q.eq("userId", currentUser.userId).eq("mediaId", args.mediaId).eq("mediaType", args.mediaType)
        )
        .first();

      if (existingRating) {
        await ctx.db.patch(existingRating._id, {
          rating: args.rating,
          addedAt: Date.now(),
        });
      } else {
        await ctx.db.insert("ratings", {
          userId: currentUser.userId,
          mediaId: args.mediaId,
          mediaType: args.mediaType,
          title: args.title,
          posterPath: args.posterPath,
          rating: args.rating,
          releaseYear: args.releaseYear,
          addedAt: Date.now(),
        });
      }
    }

    return diaryId;
  },
});

// Edit an existing diary log
export const editDiaryEntry = mutation({
  args: {
    diaryId: v.id("diary"),
    watchedDate: v.number(),
    rewatch: v.boolean(),
    review: v.optional(v.string()),
    rating: v.optional(v.number()),
    season: v.optional(v.number()),
    episode: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthedUser(ctx);
    if (!currentUser) {
      throw new Error("Must be logged in to edit diary entries");
    }

    const entry = await ctx.db.get(args.diaryId);
    if (!entry) {
      throw new Error("Diary entry not found");
    }

    if (entry.userId !== currentUser.userId) {
      throw new Error("Unauthorized to edit this diary entry");
    }

    if (args.rating !== undefined && (args.rating < 1 || args.rating > 10)) {
      throw new Error("Rating must be between 1 and 10");
    }

    // 1. Update diary log
    await ctx.db.patch(args.diaryId, {
      watchedDate: args.watchedDate,
      rewatch: args.rewatch,
      review: args.review,
      rating: args.rating,
      season: args.season,
      episode: args.episode,
    });

    // 2. Sync to ratings table if rating is provided
    if (args.rating !== undefined) {
      const existingRating = await ctx.db
        .query("ratings")
        .withIndex("by_user_media", (q) =>
          q.eq("userId", currentUser.userId).eq("mediaId", entry.mediaId).eq("mediaType", entry.mediaType)
        )
        .first();

      if (existingRating) {
        await ctx.db.patch(existingRating._id, {
          rating: args.rating,
          addedAt: Date.now(),
        });
      } else {
        await ctx.db.insert("ratings", {
          userId: currentUser.userId,
          mediaId: entry.mediaId,
          mediaType: entry.mediaType,
          title: entry.title,
          posterPath: entry.posterPath,
          rating: args.rating,
          releaseYear: entry.releaseYear,
          addedAt: Date.now(),
        });
      }
    }

    return true;
  },
});

// Delete a diary log
export const deleteDiaryEntry = mutation({
  args: {
    diaryId: v.id("diary"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthedUser(ctx);
    if (!currentUser) {
      throw new Error("Must be logged in to delete diary entries");
    }

    const entry = await ctx.db.get(args.diaryId);
    if (!entry) {
      throw new Error("Diary entry not found");
    }

    if (entry.userId !== currentUser.userId) {
      throw new Error("Unauthorized to delete this diary entry");
    }

    await ctx.db.delete(args.diaryId);
    return true;
  },
});

// ----------------------------------------------------
// READ QUERIES
// ----------------------------------------------------

// Retrieve user watch diary
export const getUserDiary = query({
  args: {
    userId: v.optional(v.string()), // if omitted, fetch current authed user
  },
  handler: async (ctx, args) => {
    let targetUserId = args.userId;

    if (!targetUserId) {
      const currentUser = await getAuthedUser(ctx);
      if (!currentUser) return [];
      targetUserId = currentUser.userId;
    }

    const diaryEntries = await ctx.db
      .query("diary")
      .withIndex("by_user", (q) => q.eq("userId", targetUserId!))
      .collect();

    // Sort by watchedDate descending (newest watches first)
    return diaryEntries.sort((a, b) => b.watchedDate - a.watchedDate);
  },
});

// Fetch watch details for a specific media item (count and history list)
export const getMediaWatchHistory = query({
  args: {
    mediaId: v.string(),
    mediaType: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthedUser(ctx);
    if (!currentUser) {
      return {
        watchCount: 0,
        history: [],
      };
    }

    const entries = await ctx.db
      .query("diary")
      .withIndex("by_user_media", (q) =>
        q.eq("userId", currentUser.userId).eq("mediaId", args.mediaId).eq("mediaType", args.mediaType)
      )
      .collect();

    // Sort history by date descending
    const sortedHistory = entries.sort((a, b) => b.watchedDate - a.watchedDate);

    return {
      watchCount: entries.length,
      history: sortedHistory.map((e) => ({
        _id: e._id,
        watchedDate: e.watchedDate,
        rewatch: e.rewatch,
        rating: e.rating,
        review: e.review,
      })),
    };
  },
});
