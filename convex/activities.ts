import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

// ----------------------------------------------------
// INTERNAL HELPERS
// ----------------------------------------------------

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

// Internal helper to log an activity
export async function logActivity(
  ctx: MutationCtx,
  args: {
    userId: string;
    type: "rate" | "watchlist" | "favorite" | "review" | "completed_season";
    mediaId: string;
    mediaType: string;
    title: string;
    posterPath: string;
    rating?: number;
    review?: string;
    season?: number;
  }
) {
  // To keep the feed clean, remove existing activities of the same type for this user + media
  // (e.g. if they re-add to watchlist or re-rate, we delete the old activity so the new one floats to top)
  if (args.type === "watchlist" || args.type === "favorite" || args.type === "rate" || args.type === "completed_season") {
    const existing = await ctx.db
      .query("activities")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    const duplicate = existing.find(
      (a) =>
        a.type === args.type &&
        a.mediaId === args.mediaId &&
        a.mediaType === args.mediaType &&
        (args.type !== "completed_season" || a.season === args.season)
    );

    if (duplicate) {
      await ctx.db.delete(duplicate._id);
      
      // Clean up likes and comments associated with the deleted duplicate activity
      const likes = await ctx.db
        .query("activityLikes")
        .withIndex("by_activity", (q) => q.eq("activityId", duplicate._id))
        .collect();
      for (const l of likes) {
        await ctx.db.delete(l._id);
      }

      const comments = await ctx.db
        .query("activityComments")
        .withIndex("by_activity", (q) => q.eq("activityId", duplicate._id))
        .collect();
      for (const c of comments) {
        await ctx.db.delete(c._id);
      }
    }
  }

  return await ctx.db.insert("activities", {
    userId: args.userId,
    type: args.type,
    mediaId: args.mediaId,
    mediaType: args.mediaType,
    title: args.title,
    posterPath: args.posterPath,
    rating: args.rating,
    review: args.review,
    season: args.season,
    createdAt: Date.now(),
  });
}

// Helper to get friends list
async function getFriendsIds(ctx: QueryCtx | MutationCtx, userId: string): Promise<string[]> {
  const f1 = await ctx.db
    .query("friendships")
    .withIndex("by_user1", (q) => q.eq("userId1", userId))
    .collect();
  const f2 = await ctx.db
    .query("friendships")
    .withIndex("by_user2", (q) => q.eq("userId2", userId))
    .collect();
  
  const activeFriendships = [...f1, ...f2].filter((f) => f.status === "friends");
  
  const ids = activeFriendships.map((f) => 
    f.userId1 === userId ? f.userId2 : f.userId1
  );

  return ids;
}

// ----------------------------------------------------
// READ QUERIES
// ----------------------------------------------------

export const getFeed = query({
  args: {
    paginationOpts: v.any(),
    filter: v.optional(v.string()), // "all" | "watchlist" | "rate" | "favorite" | "review" | "completed_season"
    scope: v.optional(v.string()), // "global" | "friends"
  },
  handler: async (ctx, args) => {
    const user = await getAuthedUser(ctx);
    const filter = args.filter || "all";
    const scope = args.scope || "global";

    let allowedUserIds: string[] | null = null;

    if (scope === "friends") {
      if (!user) return { page: [], isDone: true, continueCursor: "" };
      const friends = await getFriendsIds(ctx, user.userId);
      allowedUserIds = [user.userId, ...friends];
    }

    // Fetch paginated results directly without reassigning baseQuery variable
    const results = await ctx.db
      .query("activities")
      .order("desc")
      .paginate(args.paginationOpts);

    // Filter page items in memory (since we might have filter type or scope limits)
    let filteredPage = results.page;

    if (filter !== "all") {
      filteredPage = filteredPage.filter((a) => a.type === filter);
    }

    if (allowedUserIds !== null) {
      filteredPage = filteredPage.filter((a) => allowedUserIds!.includes(a.userId));
    }

    // Enrich the items with User profile, likes count, comment count, and user's own like status
    const enrichedPage = [];
    for (const activity of filteredPage) {
      const activityUser = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", activity.userId))
        .first();

      if (!activityUser) continue;

      const likes = await ctx.db
        .query("activityLikes")
        .withIndex("by_activity", (q) => q.eq("activityId", activity._id))
        .collect();

      const comments = await ctx.db
        .query("activityComments")
        .withIndex("by_activity", (q) => q.eq("activityId", activity._id))
        .collect();

      const isLikedByMe = user
        ? likes.some((l) => l.userId === user.userId)
        : false;

      enrichedPage.push({
        ...activity,
        user: {
          name: activityUser.name,
          username: activityUser.username,
          image: activityUser.image,
        },
        likesCount: likes.length,
        commentsCount: comments.length,
        isLikedByMe,
      });
    }

    return {
      ...results,
      page: enrichedPage,
    };
  },
});

export const getActivityDetails = query({
  args: { activityId: v.id("activities") },
  handler: async (ctx, args) => {
    const user = await getAuthedUser(ctx);
    
    const activity = await ctx.db.get(args.activityId);
    if (!activity) return null;

    const activityUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", activity.userId))
      .first();

    const likes = await ctx.db
      .query("activityLikes")
      .withIndex("by_activity", (q) => q.eq("activityId", activity._id))
      .collect();

    const comments = await ctx.db
      .query("activityComments")
      .withIndex("by_activity", (q) => q.eq("activityId", activity._id))
      .collect();

    // Enrich comments with user profiles
    const enrichedComments = [];
    for (const c of comments) {
      const commentUser = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", c.userId))
        .first();
      
      if (commentUser) {
        enrichedComments.push({
          ...c,
          user: {
            name: commentUser.name,
            username: commentUser.username,
            image: commentUser.image,
          },
        });
      }
    }

    // Sort comments oldest first
    enrichedComments.sort((a, b) => a.createdAt - b.createdAt);

    const isLikedByMe = user
      ? likes.some((l) => l.userId === user.userId)
      : false;

    return {
      ...activity,
      user: activityUser ? {
        name: activityUser.name,
        username: activityUser.username,
        image: activityUser.image,
      } : null,
      likes,
      comments: enrichedComments,
      isLikedByMe,
    };
  },
});

// ----------------------------------------------------
// WRITE MUTATIONS
// ----------------------------------------------------

export const likeActivity = mutation({
  args: { activityId: v.id("activities") },
  handler: async (ctx, args) => {
    const user = await getAuthedUser(ctx);
    if (!user) throw new Error("Must be logged in to like activities");

    const existingLike = await ctx.db
      .query("activityLikes")
      .withIndex("by_user_activity", (q) =>
        q.eq("userId", user.userId).eq("activityId", args.activityId)
      )
      .first();

    if (existingLike) {
      await ctx.db.delete(existingLike._id);
      return { liked: false };
    } else {
      await ctx.db.insert("activityLikes", {
        activityId: args.activityId,
        userId: user.userId,
        createdAt: Date.now(),
      });
      return { liked: true };
    }
  },
});

export const addComment = mutation({
  args: {
    activityId: v.id("activities"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthedUser(ctx);
    if (!user) throw new Error("Must be logged in to comment on activities");

    const content = args.content.trim();
    if (!content) throw new Error("Comment content cannot be empty");

    const commentId = await ctx.db.insert("activityComments", {
      activityId: args.activityId,
      userId: user.userId,
      content,
      createdAt: Date.now(),
    });

    return commentId;
  },
});

export const deleteComment = mutation({
  args: { commentId: v.id("activityComments") },
  handler: async (ctx, args) => {
    const user = await getAuthedUser(ctx);
    if (!user) throw new Error("Must be logged in to delete comments");

    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error("Comment not found");

    // Only comment author or activity author can delete comments
    const activity = await ctx.db.get(comment.activityId);
    if (comment.userId !== user.userId && activity?.userId !== user.userId) {
      throw new Error("Unauthorized to delete this comment");
    }

    await ctx.db.delete(args.commentId);
    return true;
  },
});

export const logSeasonCompletion = mutation({
  args: {
    mediaId: v.string(),
    mediaType: v.string(),
    title: v.string(),
    posterPath: v.string(),
    season: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthedUser(ctx);
    if (!user) throw new Error("Must be logged in to log activities");

    return await logActivity(ctx, {
      userId: user.userId,
      type: "completed_season",
      mediaId: args.mediaId,
      mediaType: args.mediaType,
      title: args.title,
      posterPath: args.posterPath,
      season: args.season,
    });
  },
});
