import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";
import { Id } from "./_generated/dataModel";

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

      commentsWithMeta.push({
        ...comment,
        author: author ? {
          name: author.name,
          username: author.username,
          image: author.image,
        } : {
          name: "[deleted]",
          username: "[deleted]",
          image: undefined,
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
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthedUserProfile(ctx);
    if (!currentUser) {
      throw new Error("Must be logged in to post a comment");
    }

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
    });

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
    const currentUser = await getAuthedUserProfile(ctx);
    if (!currentUser) {
      throw new Error("Must be logged in to edit a comment");
    }

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
    const currentUser = await getAuthedUserProfile(ctx);
    if (!currentUser) {
      throw new Error("Must be logged in to delete a comment");
    }

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
    const currentUser = await getAuthedUserProfile(ctx);
    if (!currentUser) {
      throw new Error("Must be logged in to like a comment");
    }

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
