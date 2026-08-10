import { action, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { anyApi } from "convex/server";
import { v } from "convex/values";

// Bypass local circular dependency reference using anyApi type annotation
const internalBackfill = (internal as unknown) as typeof anyApi;

export const getCommentsToBackfill = internalQuery({
  args: {},
  handler: async (ctx) => {
    const list = await ctx.db.query("comments").collect();
    return list.filter((c) => !c.mediaTitle || !c.mediaPosterPath);
  },
});

export const patchCommentMetadata = internalMutation({
  args: {
    commentId: v.id("comments"),
    mediaTitle: v.string(),
    mediaPosterPath: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.commentId, {
      mediaTitle: args.mediaTitle,
      mediaPosterPath: args.mediaPosterPath,
    });
  },
});

export const backfillCommentMetadata = action({
  args: {},
  handler: async (ctx) => {
    const tmdbApiKey = process.env.TMDB_API_KEY;
    if (!tmdbApiKey) {
      throw new Error("TMDB_API_KEY environment variable is not set in Convex dashboard");
    }

    const commentsList = await ctx.runQuery(internalBackfill.backfill.getCommentsToBackfill);
    let updatedCount = 0;

    for (const comment of commentsList) {
      try {
        const url = `https://api.themoviedb.org/3/${comment.mediaType}/${comment.mediaId}?api_key=${tmdbApiKey}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          const title = data.title || data.name || "Movie / Show";
          const posterPath = data.poster_path || "";
          
          await ctx.runMutation(internalBackfill.backfill.patchCommentMetadata, {
            commentId: comment._id,
            mediaTitle: title,
            mediaPosterPath: posterPath,
          });
          updatedCount++;
        }
        // Small delay to respect API rate limits
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (e) {
        console.error(`Failed to backfill comment ${comment._id}:`, e);
      }
    }

    return {
      message: "Comments metadata backfilled successfully using TMDB API",
      updatedCommentsCount: updatedCount,
      totalCommentsCount: commentsList.length,
    };
  },
});
