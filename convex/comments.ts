import { mutation, query, QueryCtx, MutationCtx, action, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { authComponent } from "./auth";
import { Id } from "./_generated/dataModel";
import { ensureActiveUser } from "./users";

// Helper to get current authenticated user profile
async function getAuthedUserProfile(ctx: QueryCtx | MutationCtx) {
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

interface EnrichedComment {
  _id: Id<"comments">;
  mediaId: string;
  mediaType: string;
  userId: string;
  content: string;
  parentId?: Id<"comments">;
  createdAt: number;
  updatedAt?: number;
  author: {
    name: string;
    username: string;
    image?: string;
    role?: string;
  };
  likeCount: number;
  replyCount: number;
  isLiked: boolean;
  replies: EnrichedComment[];
}

// ----------------------------------------------------
// READ QUERIES
// ----------------------------------------------------

export const getComments = query({
  args: {
    mediaId: v.string(),
    mediaType: v.string(),
    sorting: v.string(), // "best" | "top" | "latest"
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthedUserProfile(ctx);

    // Fetch all comments for this media
    const rawComments = await ctx.db
      .query("comments")
      .withIndex("by_media", (q) => q.eq("mediaId", args.mediaId).eq("mediaType", args.mediaType))
      .collect();

    // Resolve user profiles for comment authors in a batch-like way
    // (since Convex optimizes repeated database gets for identical IDs)
    const commentsWithMeta: EnrichedComment[] = [];
    for (const comment of rawComments) {
      const author = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", comment.userId))
        .first();

      const likes = await ctx.db
        .query("commentLikes")
        .withIndex("by_comment", (q) => q.eq("commentId", comment._id))
        .collect();

      const likeCount = likes.length;
      const isLiked = currentUser
        ? likes.some((l) => l.userId === currentUser.userId)
        : false;

      // Count direct replies (children)
      const directReplies = rawComments.filter((c) => c.parentId === comment._id);
      const replyCount = directReplies.length;

      const isDeleted = !author || author.status === "deleted";
      commentsWithMeta.push({
        ...comment,
        author: !isDeleted && author ? {
          name: author.name,
          username: author.username,
          image: author.image,
          role: author.role,
        } : {
          name: "[deleted]",
          username: "[deleted]",
          image: undefined,
          role: undefined,
        },
        likeCount,
        replyCount,
        isLiked,
        replies: [],
      });
    }

    // 2. Build Threaded Tree Hierarchy
    // We construct a map of commentId -> comment node
    const commentMap = new Map<Id<"comments">, EnrichedComment>();
    for (const node of commentsWithMeta) {
      commentMap.set(node._id, node);
    }

    const rootComments: EnrichedComment[] = [];
    for (const node of commentsWithMeta) {
      if (node.parentId) {
        const parent = commentMap.get(node.parentId);
        if (parent) {
          parent.replies.push(node);
        } else {
          // If parent not found (e.g. deleted), treat as root comment
          rootComments.push(node);
        }
      } else {
        rootComments.push(node);
      }
    }

    // 3. Define sorting function
    // Best: Sort by score = (likeCount * 3) + (replyCount * 2) descending, then createdAt descending
    // Top: Sort by likeCount descending, then createdAt descending
    // Latest: Sort by createdAt descending
    const sortNodes = (nodes: EnrichedComment[]) => {
      nodes.sort((a, b) => {
        if (args.sorting === "best") {
          const scoreA = (a.likeCount * 3) + (a.replyCount * 2);
          const scoreB = (b.likeCount * 3) + (b.replyCount * 2);
          if (scoreA !== scoreB) return scoreB - scoreA;
        } else if (args.sorting === "top") {
          if (a.likeCount !== b.likeCount) return b.likeCount - a.likeCount;
        }
        return b.createdAt - a.createdAt; // default or tie-breaker
      });

      // Sort children recursively
      for (const node of nodes) {
        if (node.replies.length > 0) {
          sortNodes(node.replies);
        }
      }
    };

    sortNodes(rootComments);
    return rootComments;
  },
});

// ----------------------------------------------------
// WRITE MUTATIONS
// ----------------------------------------------------

export const addComment = mutation({
  args: {
    mediaId: v.string(),
    mediaType: v.string(),
    content: v.string(),
    parentId: v.optional(v.id("comments")),
    mediaTitle: v.optional(v.string()),
    mediaPosterPath: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUser = await ensureActiveUser(ctx);

    const trimmedContent = args.content.trim();
    if (trimmedContent.length === 0) {
      throw new Error("Comment content cannot be empty");
    }

    const commentId = await ctx.db.insert("comments", {
      mediaId: args.mediaId,
      mediaType: args.mediaType,
      userId: currentUser.userId,
      content: trimmedContent,
      parentId: args.parentId,
      createdAt: Date.now(),
      mediaTitle: args.mediaTitle,
      mediaPosterPath: args.mediaPosterPath,
    });

    const commenterName = currentUser.name || currentUser.username || "Someone";

    // 1. Process Reply Notification
    if (args.parentId) {
      const parentComment = await ctx.db.get(args.parentId);
      if (parentComment && parentComment.userId !== currentUser.userId) {
        await ctx.db.insert("notifications", {
          userId: parentComment.userId,
          senderId: currentUser.userId,
          type: "comment_reply",
          read: false,
          createdAt: Date.now(),
          commentId,
          mediaId: args.mediaId,
          mediaType: args.mediaType,
        });

        // Schedule web push notification for comment reply
        await ctx.scheduler.runAfter(0, internal.pushActions.sendPushNotification, {
          recipientUserId: parentComment.userId,
          title: commenterName,
          body: "replied to your comment.",
          url: `/${args.mediaType}/${args.mediaId}`,
          icon: currentUser.image || "/favicon/android-chrome-192x192.png",
        });
      }
    }

    // 2. Process Mentions
    // Matches any @username pattern (alphanumeric & underscores, 3-15 chars)
    const mentionRegex = /@([a-zA-Z0-9_]{3,15})/g;
    let match;
    const mentionedUsernames = new Set<string>();

    while ((match = mentionRegex.exec(trimmedContent)) !== null) {
      mentionedUsernames.add(match[1].toLowerCase());
    }

    for (const username of mentionedUsernames) {
      const targetUser = await ctx.db
        .query("users")
        .withIndex("by_username", (q) => q.eq("username", username))
        .first();
      
      // Don't notify self
      if (targetUser && targetUser.userId !== currentUser.userId) {
        await ctx.db.insert("notifications", {
          userId: targetUser.userId,
          senderId: currentUser.userId,
          type: "comment_mention",
          read: false,
          createdAt: Date.now(),
          commentId,
          mediaId: args.mediaId,
          mediaType: args.mediaType,
        });

        // Schedule web push notification for mention
        await ctx.scheduler.runAfter(0, internal.pushActions.sendPushNotification, {
          recipientUserId: targetUser.userId,
          title: commenterName,
          body: "mentioned you in a comment.",
          url: `/${args.mediaType}/${args.mediaId}`,
          icon: currentUser.image || "/favicon/android-chrome-192x192.png",
        });
      }
    }

    return commentId;
  },
});

export const editComment = mutation({
  args: {
    commentId: v.id("comments"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await ensureActiveUser(ctx);

    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.userId !== currentUser.userId) {
      throw new Error("Unauthorized to edit this comment");
    }

    const trimmedContent = args.content.trim();
    if (trimmedContent.length === 0) {
      throw new Error("Comment content cannot be empty");
    }

    await ctx.db.patch(args.commentId, {
      content: trimmedContent,
      updatedAt: Date.now(),
    });
  },
});

// Helper function to recursively delete comment and its nested children
async function deleteCommentAndReplies(ctx: MutationCtx, commentId: Id<"comments">) {
  // Find all children
  const children = await ctx.db
    .query("comments")
    .withIndex("by_parent", (q) => q.eq("parentId", commentId))
    .collect();

  for (const child of children) {
    await deleteCommentAndReplies(ctx, child._id);
  }

  // Delete all likes associated with this comment
  const likes = await ctx.db
    .query("commentLikes")
    .withIndex("by_comment", (q) => q.eq("commentId", commentId))
    .collect();

  for (const like of likes) {
    await ctx.db.delete(like._id);
  }

  // Delete notifications pointing to this comment
  // (we query using direct database filters or clean-up loops)
  const notifications = await ctx.db.query("notifications").collect();
  const relevantNotifs = notifications.filter((n) => n.commentId === commentId);
  for (const n of relevantNotifs) {
    await ctx.db.delete(n._id);
  }

  // Delete the comment itself
  await ctx.db.delete(commentId);
}

export const deleteComment = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const currentUser = await ensureActiveUser(ctx);

    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.userId !== currentUser.userId) {
      throw new Error("Unauthorized to delete this comment");
    }

    await deleteCommentAndReplies(ctx, args.commentId);
  },
});

export const toggleLikeComment = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const currentUser = await ensureActiveUser(ctx);

    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    const existingLike = await ctx.db
      .query("commentLikes")
      .withIndex("by_user_comment", (q) => q.eq("userId", currentUser.userId).eq("commentId", args.commentId))
      .first();

    if (existingLike) {
      await ctx.db.delete(existingLike._id);
      return { liked: false };
    } else {
      await ctx.db.insert("commentLikes", {
        commentId: args.commentId,
        userId: currentUser.userId,
        createdAt: Date.now(),
      });
      return { liked: true };
    }
  },
});

// Internal helper to find media info (title and posterPath) from existing DB records
async function findMediaInfo(ctx: QueryCtx, userId: string, mediaId: string, mediaType: string) {
  // Try diary
  const d = await ctx.db
    .query("diary")
    .withIndex("by_user_media", (q) => q.eq("userId", userId).eq("mediaId", mediaId).eq("mediaType", mediaType))
    .first();
  if (d) return { title: d.title, posterPath: d.posterPath };

  // Try ratings
  const r = await ctx.db
    .query("ratings")
    .withIndex("by_media", (q) => q.eq("mediaId", mediaId).eq("mediaType", mediaType))
    .first();
  if (r) return { title: r.title, posterPath: r.posterPath };

  // Try favorites
  const f = await ctx.db
    .query("favorites")
    .withIndex("by_user_media", (q) => q.eq("userId", userId).eq("mediaId", mediaId).eq("mediaType", mediaType))
    .first();
  if (f) return { title: f.title, posterPath: f.posterPath };

  // Try watchlist
  const w = await ctx.db
    .query("watchlist")
    .withIndex("by_user_media", (q) => q.eq("userId", userId).eq("mediaId", mediaId).eq("mediaType", mediaType))
    .first();
  if (w) return { title: w.title, posterPath: w.posterPath };

  return { title: "Movie / Show", posterPath: "" };
}

export const getUserComments = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const commentsList = await ctx.db
      .query("comments")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const commentsWithMeta = [];
    for (const comment of commentsList) {
      let mediaTitle = comment.mediaTitle;
      let mediaPosterPath = comment.mediaPosterPath;

      if (!mediaTitle || !mediaPosterPath) {
        const mediaInfo = await findMediaInfo(ctx, comment.userId, comment.mediaId, comment.mediaType);
        if (!mediaTitle) mediaTitle = mediaInfo.title;
        if (!mediaPosterPath) mediaPosterPath = mediaInfo.posterPath;
      }
      
      const likes = await ctx.db
        .query("commentLikes")
        .withIndex("by_comment", (q) => q.eq("commentId", comment._id))
        .collect();

      commentsWithMeta.push({
        ...comment,
        mediaTitle,
        mediaPosterPath,
        likeCount: likes.length,
      });
    }

    // Sort by newest first
    commentsWithMeta.sort((a, b) => b.createdAt - a.createdAt);
    return commentsWithMeta;
  },
});
