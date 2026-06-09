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

// Helper to check if all episodes of a season are completed and update activity feed
async function updateSeasonCompletionStatus(
  ctx: MutationCtx,
  userId: string,
  mediaId: string,
  title: string,
  posterPath: string,
  season: number,
  numberOfEpisodes?: number
) {
  // Query all diary entries for this user, show, and season
  const entries = await ctx.db
    .query("diary")
    .withIndex("by_user_media", (q) =>
      q.eq("userId", userId).eq("mediaId", mediaId).eq("mediaType", "tv")
    )
    .collect();

  const seasonEntries = entries.filter(
    (e) => e.season === season && e.episode !== undefined
  );
  const uniqueEpisodes = new Set(seasonEntries.map((e) => e.episode));

  let totalEpisodes = numberOfEpisodes;
  if (!totalEpisodes) {
    const entryWithEpisodes = seasonEntries.find((e) => e.numberOfEpisodes !== undefined);
    if (entryWithEpisodes) {
      totalEpisodes = entryWithEpisodes.numberOfEpisodes;
    }
  }

  // Find if there is an existing completed_season activity
  const activities = await ctx.db
    .query("activities")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();
  
  const existingActivity = activities.find(
    (a) =>
      a.type === "completed_season" &&
      a.mediaId === mediaId &&
      a.mediaType === "tv" &&
      a.season === season
  );

  if (totalEpisodes && uniqueEpisodes.size >= totalEpisodes) {
    if (!existingActivity) {
      await logActivity(ctx, {
        userId,
        type: "completed_season",
        mediaId,
        mediaType: "tv",
        title,
        posterPath,
        season,
      });
    }
  } else {
    if (existingActivity) {
      await ctx.db.delete(existingActivity._id);

      // Clean up likes and comments associated with the deleted activity
      const likes = await ctx.db
        .query("activityLikes")
        .withIndex("by_activity", (q) => q.eq("activityId", existingActivity._id))
        .collect();
      for (const l of likes) {
        await ctx.db.delete(l._id);
      }

      const comments = await ctx.db
        .query("activityComments")
        .withIndex("by_activity", (q) => q.eq("activityId", existingActivity._id))
        .collect();
      for (const c of comments) {
        await ctx.db.delete(c._id);
      }
    }
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
    runtime: v.optional(v.number()),
    genres: v.optional(v.array(v.string())),
    cast: v.optional(v.array(v.string())),
    directors: v.optional(v.array(v.string())),
    watchProviders: v.optional(v.array(v.string())),
    numberOfSeasons: v.optional(v.number()),
    numberOfEpisodes: v.optional(v.number()),
    diaryType: v.optional(v.string()),
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

    const diaryType = args.diaryType ?? (args.mediaType === "movie"
      ? "movie"
      : args.season !== undefined && args.episode !== undefined
        ? "episode"
        : args.season !== undefined
          ? "season"
          : "tv");

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
      numberOfSeasons: args.numberOfSeasons,
      numberOfEpisodes: args.numberOfEpisodes,
      diaryType,
      addedAt: Date.now(),
      runtime: args.runtime,
      genres: args.genres,
      cast: args.cast,
      directors: args.directors,
      watchProviders: args.watchProviders,
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

    if (args.mediaType === "tv" && args.season !== undefined && args.episode !== undefined) {
      await updateSeasonCompletionStatus(
        ctx,
        currentUser.userId,
        args.mediaId,
        args.title,
        args.posterPath,
        args.season,
        args.numberOfEpisodes
      );
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
    numberOfSeasons: v.optional(v.number()),
    numberOfEpisodes: v.optional(v.number()),
    diaryType: v.optional(v.string()),
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

    const newSeason = args.season !== undefined ? args.season : entry.season;
    const newEpisode = args.episode !== undefined ? args.episode : entry.episode;
    const diaryType = args.diaryType ?? (entry.mediaType === "movie"
      ? "movie"
      : newSeason !== undefined && newEpisode !== undefined
        ? "episode"
        : newSeason !== undefined
          ? "season"
          : "tv");

    const oldMediaType = entry.mediaType;
    const oldSeason = entry.season;
    const oldEpisode = entry.episode;
    const oldNumEpisodes = entry.numberOfEpisodes;

    // 1. Update diary log
    await ctx.db.patch(args.diaryId, {
      watchedDate: args.watchedDate,
      rewatch: args.rewatch,
      review: args.review,
      rating: args.rating,
      season: args.season,
      episode: args.episode,
      numberOfSeasons: args.numberOfSeasons,
      numberOfEpisodes: args.numberOfEpisodes,
      diaryType,
    });

    if (oldMediaType === "tv" && oldSeason !== undefined && oldEpisode !== undefined) {
      await updateSeasonCompletionStatus(
        ctx,
        currentUser.userId,
        entry.mediaId,
        entry.title,
        entry.posterPath,
        oldSeason,
        oldNumEpisodes
      );
    }

    const updatedEntry = await ctx.db.get(args.diaryId);
    if (
      updatedEntry &&
      updatedEntry.mediaType === "tv" &&
      updatedEntry.season !== undefined &&
      updatedEntry.episode !== undefined &&
      (updatedEntry.season !== oldSeason || updatedEntry.episode !== oldEpisode)
    ) {
      await updateSeasonCompletionStatus(
        ctx,
        currentUser.userId,
        updatedEntry.mediaId,
        updatedEntry.title,
        updatedEntry.posterPath,
        updatedEntry.season,
        updatedEntry.numberOfEpisodes
      );
    }

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

    if (entry.mediaType === "tv" && entry.season !== undefined && entry.episode !== undefined) {
      await updateSeasonCompletionStatus(
        ctx,
        currentUser.userId,
        entry.mediaId,
        entry.title,
        entry.posterPath,
        entry.season,
        entry.numberOfEpisodes
      );
    }

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
        season: e.season,
        episode: e.episode,
      })),
    };
  },
});

// Delete all watch logs in diary for the current user
export const deleteAllDiary = mutation({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getAuthedUser(ctx);
    if (!currentUser) {
      throw new Error("Must be logged in to delete diary entries");
    }

    const entries = await ctx.db
      .query("diary")
      .withIndex("by_user", (q) => q.eq("userId", currentUser.userId))
      .collect();

    for (const entry of entries) {
      await ctx.db.delete(entry._id);
    }

    // Clean up review activities
    const activities = await ctx.db
      .query("activities")
      .withIndex("by_user", (q) => q.eq("userId", currentUser.userId))
      .collect();

    const activitiesToDelete = activities.filter(
      (a) => a.type === "review" || a.type === "completed_season"
    );
    for (const act of activitiesToDelete) {
      await ctx.db.delete(act._id);
      
      // Clean up likes and comments associated with the review activities
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

