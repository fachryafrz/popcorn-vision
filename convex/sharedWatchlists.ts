import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

// Create a collaborative watchlist
export const createWatchlist = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    // Create watchlist
    const watchlistId = await ctx.db.insert("sharedWatchlists", {
      name: args.name,
      description: args.description,
      createdById: userId,
      createdAt: Date.now(),
    });

    // Add creator as member
    await ctx.db.insert("sharedWatchlistMembers", {
      watchlistId,
      userId,
      joinedAt: Date.now(),
    });

    // Log Activity
    await ctx.db.insert("sharedWatchlistActivities", {
      watchlistId,
      userId,
      type: "create",
      createdAt: Date.now(),
    });

    return watchlistId;
  },
});

// Fetch all shared watchlists current user is part of
export const getWatchlists = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];
    const userId = user._id;

    // Get all memberships for user
    const memberships = await ctx.db
      .query("sharedWatchlistMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const results = [];
    for (const membership of memberships) {
      const watchlist = await ctx.db.get(membership.watchlistId);
      if (!watchlist) continue;

      // Get creator details
      const creator = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", watchlist.createdById))
        .first();

      // Get members count
      const allMembers = await ctx.db
        .query("sharedWatchlistMembers")
        .withIndex("by_watchlist", (q) => q.eq("watchlistId", watchlist._id))
        .collect();

      results.push({
        ...watchlist,
        creator: creator
          ? {
              userId: creator.userId,
              username: creator.username,
              name: creator.name,
              image: creator.image,
            }
          : null,
        memberCount: allMembers.length,
      });
    }

    return results.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Fetch detailed view of a shared watchlist
export const getWatchlistDetail = query({
  args: { watchlistId: v.id("sharedWatchlists") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");
    const userId = user._id;

    // Check membership
    const membership = await ctx.db
      .query("sharedWatchlistMembers")
      .withIndex("by_watchlist_user", (q) =>
        q.eq("watchlistId", args.watchlistId).eq("userId", userId)
      )
      .first();
    if (!membership) throw new Error("Not a member of this watchlist");

    const watchlist = await ctx.db.get(args.watchlistId);
    if (!watchlist) throw new Error("Watchlist not found");

    // Fetch members
    const membersList = await ctx.db
      .query("sharedWatchlistMembers")
      .withIndex("by_watchlist", (q) => q.eq("watchlistId", args.watchlistId))
      .collect();

    const members = [];
    for (const mem of membersList) {
      const u = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", mem.userId))
        .first();
      if (u) {
        members.push({
          userId: u.userId,
          username: u.username,
          name: u.name,
          image: u.image,
          joinedAt: mem.joinedAt,
        });
      }
    }

    // Fetch items
    const itemsList = await ctx.db
      .query("sharedWatchlistItems")
      .withIndex("by_watchlist", (q) => q.eq("watchlistId", args.watchlistId))
      .collect();

    const items = [];
    for (const item of itemsList) {
      // Get addedBy user details
      const addedByUser = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", item.addedById))
        .first();

      // Get watchedBy user details
      let watchedByUser = null;
      if (item.watched && item.watchedById) {
        const wb = await ctx.db
          .query("users")
          .withIndex("by_userId", (q) => q.eq("userId", item.watchedById!))
          .first();
        if (wb) {
          watchedByUser = {
            userId: wb.userId,
            username: wb.username,
            name: wb.name,
            image: wb.image,
          };
        }
      }

      // Votes
      const votes = await ctx.db
        .query("sharedWatchlistItemVotes")
        .withIndex("by_item", (q) =>
          q
            .eq("watchlistId", args.watchlistId)
            .eq("mediaId", item.mediaId)
            .eq("mediaType", item.mediaType)
        )
        .collect();

      const userVoted = votes.some((v) => v.userId === userId);

      items.push({
        ...item,
        addedBy: addedByUser
          ? {
              userId: addedByUser.userId,
              username: addedByUser.username,
              name: addedByUser.name,
            }
          : null,
        watchedBy: watchedByUser,
        votesCount: votes.length,
        userVoted,
      });
    }

    // Sort items by addedAt desc
    items.sort((a, b) => b.addedAt - a.addedAt);

    // Fetch activities (limit to 50 for feed)
    const activitiesList = await ctx.db
      .query("sharedWatchlistActivities")
      .withIndex("by_watchlist", (q) => q.eq("watchlistId", args.watchlistId))
      .order("desc")
      .take(50);

    const activities = [];
    for (const act of activitiesList) {
      const u = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", act.userId))
        .first();
      activities.push({
        ...act,
        user: u
          ? {
              userId: u.userId,
              username: u.username,
              name: u.name,
              image: u.image,
            }
          : null,
      });
    }

    return {
      watchlist,
      members,
      items,
      activities,
    };
  },
});

// Add a title to the watchlist
export const addTitle = mutation({
  args: {
    watchlistId: v.id("sharedWatchlists"),
    mediaId: v.string(),
    mediaType: v.string(),
    title: v.string(),
    posterPath: v.string(),
    releaseYear: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    // Check membership
    const membership = await ctx.db
      .query("sharedWatchlistMembers")
      .withIndex("by_watchlist_user", (q) =>
        q.eq("watchlistId", args.watchlistId).eq("userId", userId)
      )
      .first();
    if (!membership) throw new Error("Unauthorized");

    // Check if item exists in watchlist
    const existing = await ctx.db
      .query("sharedWatchlistItems")
      .withIndex("by_watchlist_media", (q) =>
        q
          .eq("watchlistId", args.watchlistId)
          .eq("mediaId", args.mediaId)
          .eq("mediaType", args.mediaType)
      )
      .first();

    if (existing) return existing._id;

    // Insert title
    const itemId = await ctx.db.insert("sharedWatchlistItems", {
      watchlistId: args.watchlistId,
      mediaId: args.mediaId,
      mediaType: args.mediaType,
      title: args.title,
      posterPath: args.posterPath,
      releaseYear: args.releaseYear,
      addedById: userId,
      addedAt: Date.now(),
      watched: false,
    });

    // Log Activity
    await ctx.db.insert("sharedWatchlistActivities", {
      watchlistId: args.watchlistId,
      userId,
      type: "add_title",
      mediaId: args.mediaId,
      mediaType: args.mediaType,
      title: args.title,
      createdAt: Date.now(),
    });

    return itemId;
  },
});

// Remove a title from the watchlist
export const removeTitle = mutation({
  args: {
    watchlistId: v.id("sharedWatchlists"),
    mediaId: v.string(),
    mediaType: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    // Check membership
    const membership = await ctx.db
      .query("sharedWatchlistMembers")
      .withIndex("by_watchlist_user", (q) =>
        q.eq("watchlistId", args.watchlistId).eq("userId", userId)
      )
      .first();
    if (!membership) throw new Error("Unauthorized");

    const item = await ctx.db
      .query("sharedWatchlistItems")
      .withIndex("by_watchlist_media", (q) =>
        q
          .eq("watchlistId", args.watchlistId)
          .eq("mediaId", args.mediaId)
          .eq("mediaType", args.mediaType)
      )
      .first();

    if (!item) return false;

    await ctx.db.delete(item._id);

    // Delete votes for this item
    const votes = await ctx.db
      .query("sharedWatchlistItemVotes")
      .withIndex("by_item", (q) =>
        q
          .eq("watchlistId", args.watchlistId)
          .eq("mediaId", args.mediaId)
          .eq("mediaType", args.mediaType)
      )
      .collect();
    for (const v of votes) {
      await ctx.db.delete(v._id);
    }

    // Log Activity
    await ctx.db.insert("sharedWatchlistActivities", {
      watchlistId: args.watchlistId,
      userId,
      type: "remove_title",
      mediaId: args.mediaId,
      mediaType: args.mediaType,
      title: item.title,
      createdAt: Date.now(),
    });

    return true;
  },
});

// Toggle watched status of an item
export const toggleWatched = mutation({
  args: {
    watchlistId: v.id("sharedWatchlists"),
    mediaId: v.string(),
    mediaType: v.string(),
    watched: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    // Check membership
    const membership = await ctx.db
      .query("sharedWatchlistMembers")
      .withIndex("by_watchlist_user", (q) =>
        q.eq("watchlistId", args.watchlistId).eq("userId", userId)
      )
      .first();
    if (!membership) throw new Error("Unauthorized");

    const item = await ctx.db
      .query("sharedWatchlistItems")
      .withIndex("by_watchlist_media", (q) =>
        q
          .eq("watchlistId", args.watchlistId)
          .eq("mediaId", args.mediaId)
          .eq("mediaType", args.mediaType)
      )
      .first();

    if (!item) throw new Error("Item not found");

    await ctx.db.patch(item._id, {
      watched: args.watched,
      watchedAt: args.watched ? Date.now() : undefined,
      watchedById: args.watched ? userId : undefined,
    });

    // Log Activity
    await ctx.db.insert("sharedWatchlistActivities", {
      watchlistId: args.watchlistId,
      userId,
      type: args.watched ? "watched_title" : "unwatched_title",
      mediaId: args.mediaId,
      mediaType: args.mediaType,
      title: item.title,
      createdAt: Date.now(),
    });

    return true;
  },
});

// Toggle vote on an item
export const toggleVote = mutation({
  args: {
    watchlistId: v.id("sharedWatchlists"),
    mediaId: v.string(),
    mediaType: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    // Check membership
    const membership = await ctx.db
      .query("sharedWatchlistMembers")
      .withIndex("by_watchlist_user", (q) =>
        q.eq("watchlistId", args.watchlistId).eq("userId", userId)
      )
      .first();
    if (!membership) throw new Error("Unauthorized");

    const item = await ctx.db
      .query("sharedWatchlistItems")
      .withIndex("by_watchlist_media", (q) =>
        q
          .eq("watchlistId", args.watchlistId)
          .eq("mediaId", args.mediaId)
          .eq("mediaType", args.mediaType)
      )
      .first();
    if (!item) throw new Error("Item not found");

    const existingVote = await ctx.db
      .query("sharedWatchlistItemVotes")
      .withIndex("by_item_user", (q) =>
        q
          .eq("watchlistId", args.watchlistId)
          .eq("mediaId", args.mediaId)
          .eq("mediaType", args.mediaType)
          .eq("userId", userId)
      )
      .first();

    if (existingVote) {
      await ctx.db.delete(existingVote._id);
      return false; // Voted status is now false
    } else {
      await ctx.db.insert("sharedWatchlistItemVotes", {
        watchlistId: args.watchlistId,
        mediaId: args.mediaId,
        mediaType: args.mediaType,
        userId,
        vote: 1,
        updatedAt: Date.now(),
      });

      // Log Activity
      await ctx.db.insert("sharedWatchlistActivities", {
        watchlistId: args.watchlistId,
        userId,
        type: "vote_title",
        mediaId: args.mediaId,
        mediaType: args.mediaType,
        title: item.title,
        createdAt: Date.now(),
      });

      return true; // Voted status is now true
    }
  },
});

// Invite a user to a shared watchlist
export const inviteMember = mutation({
  args: {
    watchlistId: v.id("sharedWatchlists"),
    userId: v.string(), // ID of user to invite
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const currentUserId = user._id;

    // Check membership of current user
    const membership = await ctx.db
      .query("sharedWatchlistMembers")
      .withIndex("by_watchlist_user", (q) =>
        q.eq("watchlistId", args.watchlistId).eq("userId", currentUserId)
      )
      .first();
    if (!membership) throw new Error("Unauthorized");

    // Check if target user is already member
    const existing = await ctx.db
      .query("sharedWatchlistMembers")
      .withIndex("by_watchlist_user", (q) =>
        q.eq("watchlistId", args.watchlistId).eq("userId", args.userId)
      )
      .first();
    if (existing) throw new Error("User is already a member");

    // Check if invitation is already pending
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    const existingInvite = notifications.find(
      (n) =>
        n.type === "watchlist_invite" &&
        n.mediaId === String(args.watchlistId)
    );
    if (existingInvite) throw new Error("Invitation already pending");

    // Insert Notification
    await ctx.db.insert("notifications", {
      userId: args.userId,
      senderId: currentUserId,
      type: "watchlist_invite",
      read: false,
      createdAt: Date.now(),
      mediaId: String(args.watchlistId),
      mediaType: "watchlist",
    });

    return true;
  },
});

// Accept a collaborative watchlist invitation
export const acceptWatchlistInvite = mutation({
  args: {
    watchlistId: v.id("sharedWatchlists"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const currentUserId = user._id;

    // Check if already a member
    const existing = await ctx.db
      .query("sharedWatchlistMembers")
      .withIndex("by_watchlist_user", (q) =>
        q.eq("watchlistId", args.watchlistId).eq("userId", currentUserId)
      )
      .first();
    if (existing) return;

    // Insert membership
    await ctx.db.insert("sharedWatchlistMembers", {
      watchlistId: args.watchlistId,
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
        n.type === "watchlist_invite" &&
        n.mediaId === String(args.watchlistId)
    );
    if (inviteNotif) {
      await ctx.db.delete(inviteNotif._id);
    }

    // Log Activity
    const currentUserProfile = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", currentUserId))
      .first();

    await ctx.db.insert("sharedWatchlistActivities", {
      watchlistId: args.watchlistId,
      userId: currentUserId,
      type: "join",
      details: currentUserProfile ? currentUserProfile.name : undefined,
      createdAt: Date.now(),
    });

    return true;
  },
});

// Decline a collaborative watchlist invitation
export const declineWatchlistInvite = mutation({
  args: {
    watchlistId: v.id("sharedWatchlists"),
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
        n.type === "watchlist_invite" &&
        n.mediaId === String(args.watchlistId)
    );
    if (inviteNotif) {
      await ctx.db.delete(inviteNotif._id);
    }

    return true;
  },
});

// Leave/Remove member from shared watchlist
export const removeMember = mutation({
  args: {
    watchlistId: v.id("sharedWatchlists"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const currentUserId = user._id;

    const watchlist = await ctx.db.get(args.watchlistId);
    if (!watchlist) throw new Error("Watchlist not found");

    // Must be creator to remove someone else, OR removing oneself
    const isCreator = watchlist.createdById === currentUserId;
    const isSelf = args.userId === currentUserId;

    if (!isCreator && !isSelf) {
      throw new Error("Unauthorized to remove members");
    }

    const membership = await ctx.db
      .query("sharedWatchlistMembers")
      .withIndex("by_watchlist_user", (q) =>
        q.eq("watchlistId", args.watchlistId).eq("userId", args.userId)
      )
      .first();

    if (!membership) throw new Error("Membership not found");

    // Cannot remove creator if creator leaves (creator can delete the watchlist entirely or pass ownership, but we keep it simple)
    if (watchlist.createdById === args.userId && isSelf) {
      // If creator leaves, we delete the watchlist entirely
      const allMembers = await ctx.db
        .query("sharedWatchlistMembers")
        .withIndex("by_watchlist", (q) => q.eq("watchlistId", args.watchlistId))
        .collect();
      for (const m of allMembers) {
        await ctx.db.delete(m._id);
      }

      const allItems = await ctx.db
        .query("sharedWatchlistItems")
        .withIndex("by_watchlist", (q) => q.eq("watchlistId", args.watchlistId))
        .collect();
      for (const item of allItems) {
        await ctx.db.delete(item._id);
      }

      const allVotes = await ctx.db
        .query("sharedWatchlistItemVotes")
        .withIndex("by_watchlist", (q) => q.eq("watchlistId", args.watchlistId))
        .collect();
      for (const v of allVotes) {
        await ctx.db.delete(v._id);
      }

      const allActs = await ctx.db
        .query("sharedWatchlistActivities")
        .withIndex("by_watchlist", (q) => q.eq("watchlistId", args.watchlistId))
        .collect();
      for (const a of allActs) {
        await ctx.db.delete(a._id);
      }

      await ctx.db.delete(watchlist._id);
      return { deleted: true };
    }

    await ctx.db.delete(membership._id);

    // Clean up votes of the removed user
    const userVotes = await ctx.db
      .query("sharedWatchlistItemVotes")
      .withIndex("by_watchlist_user", (q) =>
        q.eq("watchlistId", args.watchlistId).eq("userId", args.userId)
      )
      .collect();
    for (const v of userVotes) {
      await ctx.db.delete(v._id);
    }

    // Log Activity
    const targetUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    await ctx.db.insert("sharedWatchlistActivities", {
      watchlistId: args.watchlistId,
      userId: currentUserId,
      type: "leave",
      details: targetUser ? targetUser.name : undefined,
      createdAt: Date.now(),
    });

    return { deleted: false };
  },
});

// Query to get all watchlists for a user and check if a specific media is in each of them
export const getWatchlistsWithMediaStatus = query({
  args: {
    mediaId: v.string(),
    mediaType: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];
    const userId = user._id;

    // Get all memberships for user
    const memberships = await ctx.db
      .query("sharedWatchlistMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const results = [];
    for (const membership of memberships) {
      const watchlist = await ctx.db.get(membership.watchlistId);
      if (!watchlist) continue;

      // Check if media is in this watchlist
      const existing = await ctx.db
        .query("sharedWatchlistItems")
        .withIndex("by_watchlist_media", (q) =>
          q
            .eq("watchlistId", watchlist._id)
            .eq("mediaId", args.mediaId)
            .eq("mediaType", args.mediaType)
        )
        .first();

      // Get members count
      const allMembers = await ctx.db
        .query("sharedWatchlistMembers")
        .withIndex("by_watchlist", (q) => q.eq("watchlistId", watchlist._id))
        .collect();

      results.push({
        _id: watchlist._id,
        name: watchlist.name,
        memberCount: allMembers.length,
        hasMedia: !!existing,
      });
    }

    return results;
  },
});
