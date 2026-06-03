import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

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

// Interface for enriched public user details
interface UserDetail {
  userId: string;
  username: string;
  name: string;
  image?: string;
}

// Create a custom list
export const createList = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    privacy: v.string(), // "public" | "private"
    isCollaborative: v.boolean(),
    isWatchlist: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    const listId = await ctx.db.insert("customLists", {
      name: args.name,
      description: args.description,
      createdById: userId,
      createdAt: Date.now(),
      privacy: args.privacy,
      isCollaborative: args.isCollaborative,
      isWatchlist: args.isWatchlist || false,
    });

    // Add creator as a collaborator if collaborative
    if (args.isCollaborative) {
      await ctx.db.insert("customListCollaborators", {
        listId,
        userId,
        joinedAt: Date.now(),
      });
    }

    return listId;
  },
});

// Update a custom list metadata
export const updateList = mutation({
  args: {
    listId: v.id("customLists"),
    name: v.string(),
    description: v.optional(v.string()),
    privacy: v.string(),
    isCollaborative: v.boolean(),
    isWatchlist: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    const list = await ctx.db.get(args.listId);
    if (!list) throw new Error("List not found");
    if (list.createdById !== userId) throw new Error("Unauthorized to update this list");

    await ctx.db.patch(args.listId, {
      name: args.name,
      description: args.description,
      privacy: args.privacy,
      isCollaborative: args.isCollaborative,
      isWatchlist: args.isWatchlist !== undefined ? args.isWatchlist : list.isWatchlist,
    });

    // Sync collaborators
    if (args.isCollaborative) {
      const existing = await ctx.db
        .query("customListCollaborators")
        .withIndex("by_list_user", (q) => q.eq("listId", args.listId).eq("userId", userId))
        .first();
      if (!existing) {
        await ctx.db.insert("customListCollaborators", {
          listId: args.listId,
          userId,
          joinedAt: Date.now(),
        });
      }
    }

    return args.listId;
  },
});

// Delete a custom list
export const deleteList = mutation({
  args: {
    listId: v.id("customLists"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    const list = await ctx.db.get(args.listId);
    if (!list) throw new Error("List not found");
    if (list.createdById !== userId) throw new Error("Unauthorized");

    // Clean up items
    const items = await ctx.db
      .query("customListItems")
      .withIndex("by_list", (q) => q.eq("listId", args.listId))
      .collect();
    for (const item of items) {
      await ctx.db.delete(item._id);
    }

    // Clean up collaborators
    const collaborators = await ctx.db
      .query("customListCollaborators")
      .withIndex("by_list", (q) => q.eq("listId", args.listId))
      .collect();
    for (const collab of collaborators) {
      await ctx.db.delete(collab._id);
    }

    // Clean up likes
    const likes = await ctx.db
      .query("customListLikes")
      .withIndex("by_list", (q) => q.eq("listId", args.listId))
      .collect();
    for (const like of likes) {
      await ctx.db.delete(like._id);
    }

    // Clean up comments
    const comments = await ctx.db
      .query("customListComments")
      .withIndex("by_list", (q) => q.eq("listId", args.listId))
      .collect();
    for (const comm of comments) {
      await ctx.db.delete(comm._id);
    }

    // Clean up favorites
    const favorites = await ctx.db
      .query("customListFavorites")
      .withIndex("by_list_user", (q) => q.eq("listId", args.listId))
      .collect();
    for (const fav of favorites) {
      await ctx.db.delete(fav._id);
    }

    await ctx.db.delete(args.listId);
    return true;
  },
});

// Add item to list
export const addItem = mutation({
  args: {
    listId: v.id("customLists"),
    mediaId: v.string(),
    mediaType: v.string(),
    title: v.string(),
    posterPath: v.string(),
    releaseYear: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    const list = await ctx.db.get(args.listId);
    if (!list) throw new Error("List not found");

    const isOwner = list.createdById === userId;
    let isCollab = false;

    if (list.isCollaborative) {
      const membership = await ctx.db
        .query("customListCollaborators")
        .withIndex("by_list_user", (q) => q.eq("listId", args.listId).eq("userId", userId))
        .first();
      isCollab = !!membership;
    }

    if (!isOwner && !isCollab) {
      throw new Error("Unauthorized to add items to this list");
    }

    // Check duplicate
    const existing = await ctx.db
      .query("customListItems")
      .withIndex("by_list_media", (q) =>
        q.eq("listId", args.listId).eq("mediaId", args.mediaId).eq("mediaType", args.mediaType)
      )
      .first();

    if (existing) return existing._id;

    const itemId = await ctx.db.insert("customListItems", {
      listId: args.listId,
      mediaId: args.mediaId,
      mediaType: args.mediaType,
      title: args.title,
      posterPath: args.posterPath,
      releaseYear: args.releaseYear,
      addedById: userId,
      addedAt: Date.now(),
    });

    return itemId;
  },
});

// Remove item from list
export const removeItem = mutation({
  args: {
    listId: v.id("customLists"),
    mediaId: v.string(),
    mediaType: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    const list = await ctx.db.get(args.listId);
    if (!list) throw new Error("List not found");

    const isOwner = list.createdById === userId;
    let isCollab = false;

    if (list.isCollaborative) {
      const membership = await ctx.db
        .query("customListCollaborators")
        .withIndex("by_list_user", (q) => q.eq("listId", args.listId).eq("userId", userId))
        .first();
      isCollab = !!membership;
    }

    if (!isOwner && !isCollab) {
      throw new Error("Unauthorized to remove items from this list");
    }

    const item = await ctx.db
      .query("customListItems")
      .withIndex("by_list_media", (q) =>
        q.eq("listId", args.listId).eq("mediaId", args.mediaId).eq("mediaType", args.mediaType)
      )
      .first();

    if (!item) return false;

    await ctx.db.delete(item._id);
    return true;
  },
});

// Invite collaborator to collaborative list
export const inviteCollaborator = mutation({
  args: {
    listId: v.id("customLists"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const currentUserId = user._id;

    const list = await ctx.db.get(args.listId);
    if (!list) throw new Error("List not found");
    if (!list.isCollaborative) throw new Error("List is not collaborative");
    if (list.createdById !== currentUserId) throw new Error("Only the owner can manage collaborators");

    const existing = await ctx.db
      .query("customListCollaborators")
      .withIndex("by_list_user", (q) => q.eq("listId", args.listId).eq("userId", args.userId))
      .first();
    if (existing) throw new Error("User is already a collaborator");

    // Check if invitation is already pending
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    const existingInvite = notifications.find(
      (n) =>
        n.type === "list_invite" &&
        n.mediaId === String(args.listId)
    );
    if (existingInvite) throw new Error("Invitation already pending");

    // Insert Notification
    await ctx.db.insert("notifications", {
      userId: args.userId,
      senderId: currentUserId,
      type: "list_invite",
      read: false,
      createdAt: Date.now(),
      mediaId: String(args.listId),
      mediaType: "list",
    });

    return true;
  },
});

// Accept a collaborative list invitation
export const acceptListInvite = mutation({
  args: {
    listId: v.id("customLists"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const currentUserId = user._id;

    const list = await ctx.db.get(args.listId);
    if (!list) throw new Error("List not found");

    // Check if already a collaborator
    const existing = await ctx.db
      .query("customListCollaborators")
      .withIndex("by_list_user", (q) => q.eq("listId", args.listId).eq("userId", currentUserId))
      .first();
    if (existing) return;

    // Add as collaborator
    await ctx.db.insert("customListCollaborators", {
      listId: args.listId,
      userId: currentUserId,
      joinedAt: Date.now(),
    });

    // Delete notification
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", currentUserId))
      .collect();
    const inviteNotif = notifications.find(
      (n) =>
        n.type === "list_invite" &&
        n.mediaId === String(args.listId)
    );
    if (inviteNotif) {
      await ctx.db.delete(inviteNotif._id);
    }

    return true;
  },
});

// Decline a collaborative list invitation
export const declineListInvite = mutation({
  args: {
    listId: v.id("customLists"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const currentUserId = user._id;

    // Delete notification
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", currentUserId))
      .collect();
    const inviteNotif = notifications.find(
      (n) =>
        n.type === "list_invite" &&
        n.mediaId === String(args.listId)
    );
    if (inviteNotif) {
      await ctx.db.delete(inviteNotif._id);
    }

    return true;
  },
});


// Remove collaborator (or leave)
export const removeCollaborator = mutation({
  args: {
    listId: v.id("customLists"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const currentUserId = user._id;

    const list = await ctx.db.get(args.listId);
    if (!list) throw new Error("List not found");

    const isOwner = list.createdById === currentUserId;
    const isSelf = args.userId === currentUserId;

    if (!isOwner && !isSelf) {
      throw new Error("Unauthorized to remove collaborator");
    }

    const collab = await ctx.db
      .query("customListCollaborators")
      .withIndex("by_list_user", (q) => q.eq("listId", args.listId).eq("userId", args.userId))
      .first();

    if (collab) {
      await ctx.db.delete(collab._id);
    }

    return true;
  },
});

// Toggle Like
export const toggleLikeList = mutation({
  args: {
    listId: v.id("customLists"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    const existing = await ctx.db
      .query("customListLikes")
      .withIndex("by_user_list", (q) => q.eq("userId", userId).eq("listId", args.listId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false;
    } else {
      await ctx.db.insert("customListLikes", {
        listId: args.listId,
        userId,
        createdAt: Date.now(),
      });
      return true;
    }
  },
});

// Toggle Favorite/Save list
export const toggleFavoriteList = mutation({
  args: {
    listId: v.id("customLists"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    const existing = await ctx.db
      .query("customListFavorites")
      .withIndex("by_list_user", (q) => q.eq("listId", args.listId).eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false;
    } else {
      await ctx.db.insert("customListFavorites", {
        listId: args.listId,
        userId,
        savedAt: Date.now(),
      });
      return true;
    }
  },
});

// Add comment to list
export const addListComment = mutation({
  args: {
    listId: v.id("customLists"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    const trimmed = args.content.trim();
    if (!trimmed) throw new Error("Comment content cannot be empty");

    return await ctx.db.insert("customListComments", {
      listId: args.listId,
      userId,
      content: trimmed,
      createdAt: Date.now(),
    });
  },
});

// Delete comment from list
export const deleteListComment = mutation({
  args: {
    commentId: v.id("customListComments"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error("Comment not found");

    const list = await ctx.db.get(comment.listId);
    const isListOwner = list ? list.createdById === userId : false;
    const isCommentAuthor = comment.userId === userId;

    if (!isListOwner && !isCommentAuthor) {
      throw new Error("Unauthorized to delete this comment");
    }

    await ctx.db.delete(args.commentId);
    return true;
  },
});

// Fetch user lists
export const getUserLists = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];
    const userId = user._id;

    // Get lists owned by user
    const owned = await ctx.db
      .query("customLists")
      .withIndex("by_creator", (q) => q.eq("createdById", userId))
      .collect();

    // Get lists user is collaborator in
    const collabMemberships = await ctx.db
      .query("customListCollaborators")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const collabLists = [];
    for (const membership of collabMemberships) {
      if (membership.userId === userId) {
        const list = await ctx.db.get(membership.listId);
        if (list && list.createdById !== userId) {
          collabLists.push(list);
        }
      }
    }

    const combined = [...owned, ...collabLists];

    const results = [];
    for (const list of combined) {
      const creator = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", list.createdById))
        .first();

      const items = await ctx.db
        .query("customListItems")
        .withIndex("by_list", (q) => q.eq("listId", list._id))
        .collect();

      const likes = await ctx.db
        .query("customListLikes")
        .withIndex("by_list", (q) => q.eq("listId", list._id))
        .collect();

      results.push({
        ...list,
        itemCount: items.length,
        likeCount: likes.length,
        creator: creator
          ? {
              userId: creator.userId,
              username: creator.username,
              name: creator.name,
              image: creator.image,
            }
          : null,
      });
    }

    return results.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Fetch user's favorited lists
export const getFavoritedLists = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];
    const userId = user._id;

    const favorites = await ctx.db
      .query("customListFavorites")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const results = [];
    for (const fav of favorites) {
      const list = await ctx.db.get(fav.listId);
      if (!list) continue;

      const creator = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", list.createdById))
        .first();

      const items = await ctx.db
        .query("customListItems")
        .withIndex("by_list", (q) => q.eq("listId", list._id))
        .collect();

      const likes = await ctx.db
        .query("customListLikes")
        .withIndex("by_list", (q) => q.eq("listId", list._id))
        .collect();

      results.push({
        ...list,
        itemCount: items.length,
        likeCount: likes.length,
        creator: creator
          ? {
              userId: creator.userId,
              username: creator.username,
              name: creator.name,
              image: creator.image,
            }
          : null,
      });
    }

    return results.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Fetch public lists
export const getPublicLists = query({
  args: {},
  handler: async (ctx) => {
    const lists = await ctx.db
      .query("customLists")
      .withIndex("by_privacy", (q) => q.eq("privacy", "public"))
      .collect();

    const results = [];
    for (const list of lists) {
      const creator = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", list.createdById))
        .first();

      const items = await ctx.db
        .query("customListItems")
        .withIndex("by_list", (q) => q.eq("listId", list._id))
        .collect();

      const likes = await ctx.db
        .query("customListLikes")
        .withIndex("by_list", (q) => q.eq("listId", list._id))
        .collect();

      results.push({
        ...list,
        itemCount: items.length,
        likeCount: likes.length,
        creator: creator
          ? {
              userId: creator.userId,
              username: creator.username,
              name: creator.name,
              image: creator.image,
            }
          : null,
      });
    }

    // Sort by likeCount descending, then createdAt descending
    return results.sort((a, b) => {
      if (b.likeCount !== a.likeCount) {
        return b.likeCount - a.likeCount;
      }
      return b.createdAt - a.createdAt;
    });
  },
});

// Fetch detailed view of a list
export const getListDetail = query({
  args: { listId: v.id("customLists") },
  handler: async (ctx, args) => {
    const list = await ctx.db.get(args.listId);
    if (!list) throw new Error("List not found");

    const user = await getAuthedUserProfile(ctx);
    const userId = user?.userId;

    // Check privacy
    if (list.privacy === "private") {
      let isAllowed = false;
      if (userId) {
        const isOwner = list.createdById === userId;
        let isCollab = false;
        if (list.isCollaborative) {
          const membership = await ctx.db
            .query("customListCollaborators")
            .withIndex("by_list_user", (q) => q.eq("listId", args.listId).eq("userId", userId))
            .first();
          isCollab = !!membership;
        }
        if (isOwner || isCollab) {
          isAllowed = true;
        }
      }
      if (!isAllowed) {
        return { unauthorized: true };
      }
    }

    // Creator details
    const creatorUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", list.createdById))
      .first();

    const creator = creatorUser
      ? {
          userId: creatorUser.userId,
          username: creatorUser.username,
          name: creatorUser.name,
          image: creatorUser.image,
        }
      : null;

    // Fetch items
    const itemsList = await ctx.db
      .query("customListItems")
      .withIndex("by_list", (q) => q.eq("listId", args.listId))
      .collect();

    const items = [];
    for (const item of itemsList) {
      const addedBy = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", item.addedById))
        .first();

      let watchedByUser = null;
      if (item.watched && item.watchedById) {
        const watchedByProfile = await ctx.db
          .query("users")
          .withIndex("by_userId", (q) => q.eq("userId", item.watchedById!))
          .first();
        if (watchedByProfile) {
          watchedByUser = {
            userId: watchedByProfile.userId,
            username: watchedByProfile.username,
            name: watchedByProfile.name,
          };
        }
      }

      const votes = await ctx.db
        .query("customListItemVotes")
        .withIndex("by_item", (q) =>
          q.eq("listId", args.listId).eq("mediaId", item.mediaId).eq("mediaType", item.mediaType)
        )
        .collect();

      const voteCount = votes.filter((v) => v.vote === 1).length;
      const userVote = userId ? votes.find((v) => v.userId === userId)?.vote || 0 : 0;

      items.push({
        ...item,
        addedByUser: addedBy
          ? {
              userId: addedBy.userId,
              username: addedBy.username,
              name: addedBy.name,
            }
          : null,
        watchedByUser,
        voteCount,
        userVote,
      });
    }
    // Sort items by voteCount desc, then addedAt desc if watchlist, otherwise addedAt desc
    if (list.isWatchlist) {
      items.sort((a, b) => {
        if (b.voteCount !== a.voteCount) {
          return b.voteCount - a.voteCount;
        }
        return b.addedAt - a.addedAt;
      });
    } else {
      items.sort((a, b) => b.addedAt - a.addedAt);
    }

    // Likes count & status
    const likes = await ctx.db
      .query("customListLikes")
      .withIndex("by_list", (q) => q.eq("listId", args.listId))
      .collect();
    const isLiked = userId ? likes.some((l) => l.userId === userId) : false;

    // Favorites status
    let isFavorited = false;
    if (userId) {
      const fav = await ctx.db
        .query("customListFavorites")
        .withIndex("by_list_user", (q) => q.eq("listId", args.listId).eq("userId", userId))
        .first();
      isFavorited = !!fav;
    }

    // Fetch collaborators if collaborative
    const collaborators: UserDetail[] = [];
    if (list.isCollaborative) {
      const collabsList = await ctx.db
        .query("customListCollaborators")
        .withIndex("by_list", (q) => q.eq("listId", args.listId))
        .collect();

      for (const col of collabsList) {
        const u = await ctx.db
          .query("users")
          .withIndex("by_userId", (q) => q.eq("userId", col.userId))
          .first();
        if (u) {
          collaborators.push({
            userId: u.userId,
            username: u.username,
            name: u.name,
            image: u.image,
          });
        }
      }
    }

    // Fetch comments
    const commentsList = await ctx.db
      .query("customListComments")
      .withIndex("by_list", (q) => q.eq("listId", args.listId))
      .collect();

    const comments = [];
    for (const comm of commentsList) {
      const u = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", comm.userId))
        .first();
      comments.push({
        ...comm,
        author: u
          ? {
              userId: u.userId,
              name: u.name,
              username: u.username,
              image: u.image,
            }
          : {
              userId: comm.userId,
              name: "[deleted]",
              username: "[deleted]",
              image: undefined,
            },
      });
    }
    // Sort comments by createdAt descending
    comments.sort((a, b) => b.createdAt - a.createdAt);

    return {
      list,
      creator,
      items,
      likeCount: likes.length,
      isLiked,
      isFavorited,
      collaborators,
      comments,
    };
  },
});

// Query to get all lists user is creator/collab of and check if a specific media is in each of them
export const getListsWithMediaStatus = query({
  args: {
    mediaId: v.string(),
    mediaType: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];
    const userId = user._id;

    // Get lists owned by user
    const owned = await ctx.db
      .query("customLists")
      .withIndex("by_creator", (q) => q.eq("createdById", userId))
      .collect();

    // Get lists user is collaborator in
    const collabMemberships = await ctx.db
      .query("customListCollaborators")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const collabLists = [];
    for (const membership of collabMemberships) {
      if (membership.userId === userId) {
        const list = await ctx.db.get(membership.listId);
        if (list && list.createdById !== userId) {
          collabLists.push(list);
        }
      }
    }

    const combined = [...owned, ...collabLists];

    const results = [];
    for (const list of combined) {
      // Check if media is in this list
      const existing = await ctx.db
        .query("customListItems")
        .withIndex("by_list_media", (q) =>
          q.eq("listId", list._id).eq("mediaId", args.mediaId).eq("mediaType", args.mediaType)
        )
        .first();

      results.push({
        _id: list._id,
        name: list.name,
        isCollaborative: list.isCollaborative,
        hasMedia: !!existing,
      });
    }

    return results;
  },
});

// Toggle watched state of an item in a list
export const toggleItemWatched = mutation({
  args: {
    listId: v.id("customLists"),
    mediaId: v.string(),
    mediaType: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    // Verify list and authorization (creator or collaborator)
    const list = await ctx.db.get(args.listId);
    if (!list) throw new Error("List not found");

    const isOwner = list.createdById === userId;
    let isCollab = false;
    if (list.isCollaborative) {
      const membership = await ctx.db
        .query("customListCollaborators")
        .withIndex("by_list_user", (q) => q.eq("listId", args.listId).eq("userId", userId))
        .first();
      isCollab = !!membership;
    }
    if (!isOwner && !isCollab) {
      throw new Error("Unauthorized to mark items watched");
    }

    const item = await ctx.db
      .query("customListItems")
      .withIndex("by_list_media", (q) =>
        q.eq("listId", args.listId).eq("mediaId", args.mediaId).eq("mediaType", args.mediaType)
      )
      .first();

    if (!item) throw new Error("Item not found in this list");

    const currentWatched = !!item.watched;
    await ctx.db.patch(item._id, {
      watched: !currentWatched,
      watchedAt: !currentWatched ? Date.now() : undefined,
      watchedById: !currentWatched ? userId : undefined,
    });

    return !currentWatched;
  },
});

// Toggle upvote/vote on an item in a list
export const toggleItemVote = mutation({
  args: {
    listId: v.id("customLists"),
    mediaId: v.string(),
    mediaType: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    // Verify list and authorization
    const list = await ctx.db.get(args.listId);
    if (!list) throw new Error("List not found");

    const isOwner = list.createdById === userId;
    let isCollab = false;
    if (list.isCollaborative) {
      const membership = await ctx.db
        .query("customListCollaborators")
        .withIndex("by_list_user", (q) => q.eq("listId", args.listId).eq("userId", userId))
        .first();
      isCollab = !!membership;
    }
    if (!isOwner && !isCollab) {
      throw new Error("Unauthorized to vote on items");
    }

    const existingVote = await ctx.db
      .query("customListItemVotes")
      .withIndex("by_item_user", (q) =>
        q.eq("listId", args.listId)
         .eq("mediaId", args.mediaId)
         .eq("mediaType", args.mediaType)
         .eq("userId", userId)
      )
      .first();

    if (existingVote) {
      await ctx.db.delete(existingVote._id);
      return 0; // Voted none
    } else {
      await ctx.db.insert("customListItemVotes", {
        listId: args.listId,
        mediaId: args.mediaId,
        mediaType: args.mediaType,
        userId: userId,
        vote: 1,
        updatedAt: Date.now(),
      });
      return 1; // Voted up
    }
  },
});

