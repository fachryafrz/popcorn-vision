import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

// Helper to get helper data for user social status
async function getSocialStatus(ctx: QueryCtx | MutationCtx, currentUserId: string | null, targetUserId: string) {
  if (!currentUserId || currentUserId === targetUserId) {
    return {
      friendshipStatus: "none",
      isBlocked: false,
    };
  }

  // 1. Check Blocks
  const blocked = await ctx.db
    .query("blocks")
    .withIndex("by_both", (q) => q.eq("blockerId", currentUserId).eq("blockedId", targetUserId))
    .first();
  
  const blockedBy = await ctx.db
    .query("blocks")
    .withIndex("by_both", (q) => q.eq("blockerId", targetUserId).eq("blockedId", currentUserId))
    .first();

  if (blocked || blockedBy) {
    return {
      friendshipStatus: "none",
      isBlocked: true,
      blockedByMe: !!blocked,
    };
  }

  // 2. Friendship Status
  const u1 = currentUserId < targetUserId ? currentUserId : targetUserId;
  const u2 = currentUserId < targetUserId ? targetUserId : currentUserId;
  
  const friendship = await ctx.db
    .query("friendships")
    .withIndex("by_users", (q) => q.eq("userId1", u1).eq("userId2", u2))
    .first();

  let friendshipStatus = "none";
  if (friendship) {
    if (friendship.status === "friends") {
      friendshipStatus = "friends";
    } else if (friendship.status === "pending_1_to_2") {
      friendshipStatus = currentUserId === u1 ? "request_sent" : "request_received";
    } else if (friendship.status === "pending_2_to_1") {
      friendshipStatus = currentUserId === u2 ? "request_sent" : "request_received";
    }
  }

  return {
    friendshipStatus,
    isBlocked: false,
    blockedByMe: false,
  };
}

// ----------------------------------------------------
// READ QUERIES
// ----------------------------------------------------

// Search users by display name or username
export const searchUsers = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const q = args.query.trim().toLowerCase();
    if (!q) return [];

    let currentUserId: string | null = null;
    try {
      const user = await authComponent.getAuthUser(ctx);
      if (user) currentUserId = user._id;
    } catch {}

    // Fetch all profiles (capped for search)
    const allUsers = await ctx.db.query("users").collect();
    
    const matchedUsers = allUsers.filter(u => 
      u.status !== "deleted" &&
      u.status !== "closed" &&
      (u.name.toLowerCase().includes(q) || 
       u.username.toLowerCase().includes(q))
    ).slice(0, 20);

    const results = [];
    for (const targetUser of matchedUsers) {
      // Skip current user if preferred, or keep
      if (currentUserId && targetUser.userId === currentUserId) continue;

      // Get Social counts
      const f1 = await ctx.db
        .query("friendships")
        .withIndex("by_user1", (q) => q.eq("userId1", targetUser.userId))
        .collect();
      const f2 = await ctx.db
        .query("friendships")
        .withIndex("by_user2", (q) => q.eq("userId2", targetUser.userId))
        .collect();
      const activeFriends = [...f1, ...f2].filter((f) => f.status === "friends");

      // Check relationships with current user
      const relationship = await getSocialStatus(ctx, currentUserId, targetUser.userId);

      // If blocked, omit from search entirely
      if (relationship.isBlocked) continue;

      results.push({
        _id: targetUser._id,
        userId: targetUser.userId,
        username: targetUser.username,
        name: targetUser.name,
        bio: targetUser.bio,
        image: targetUser.image,
        theme: targetUser.theme,
        profilePrivacy: targetUser.profilePrivacy || "public",
        friendCount: activeFriends.length,
        friendshipStatus: relationship.friendshipStatus,
      });
    }

    return results;
  },
});

// Fetch detailed social profile context of a user
export const getUserSocialProfile = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const targetUser = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username.trim().toLowerCase()))
      .first();
    
    if (!targetUser) return null;

    let currentUserId: string | null = null;
    try {
      const user = await authComponent.getAuthUser(ctx);
      if (user) currentUserId = user._id;
    } catch {}

    const isOwner = currentUserId && targetUser.userId === currentUserId;
    if (targetUser.status === "deleted") return null;
    if (targetUser.status === "closed" && !isOwner) {
      return {
        user: {
          name: targetUser.name,
          username: targetUser.username,
          image: targetUser.image,
        },
        isDeactivated: true,
      };
    }

    const relationship = await getSocialStatus(ctx, currentUserId, targetUser.userId);

    // If blocked, hide profile contents
    if (relationship.isBlocked) {
      return {
        user: {
          name: targetUser.name,
          username: targetUser.username,
          image: targetUser.image,
          bio: "This profile is unavailable.",
        },
        isBlocked: true,
        blockedByMe: relationship.blockedByMe,
      };
    }

    // Counts
    const f1 = await ctx.db
      .query("friendships")
      .withIndex("by_user1", (q) => q.eq("userId1", targetUser.userId))
      .collect();
    const f2 = await ctx.db
      .query("friendships")
      .withIndex("by_user2", (q) => q.eq("userId2", targetUser.userId))
      .collect();
    const activeFriends = [...f1, ...f2].filter((f) => f.status === "friends");

    // Friends list details (lookup profiles)
    const friendsProfiles = [];
    for (const friendship of activeFriends) {
      const friendId = friendship.userId1 === targetUser.userId ? friendship.userId2 : friendship.userId1;
      const fProfile = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", friendId))
        .first();
      if (fProfile) {
        friendsProfiles.push({
          userId: fProfile.userId,
          username: fProfile.username,
          name: fProfile.name,
          image: fProfile.image,
        });
      }
    }

    return {
      user: targetUser,
      friendCount: activeFriends.length,
      friends: friendsProfiles,
      friendshipStatus: relationship.friendshipStatus,
      isBlocked: false,
    };
  },
});

// ----------------------------------------------------
// WRITE MUTATIONS: FRIENDSHIPS
// ----------------------------------------------------

export const sendFriendRequest = mutation({
  args: { targetUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");
    const currentUserId = user._id;

    if (currentUserId === args.targetUserId) throw new Error("Cannot add yourself");

    // Check privacy of target user
    const target = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.targetUserId))
      .first();
    if (!target) throw new Error("Target user not found");
    if (target.allowFriendRequests === false) {
      throw new Error("This user is not accepting friend requests");
    }

    // Check blocks
    const blocked = await ctx.db
      .query("blocks")
      .withIndex("by_both", (q) => q.eq("blockerId", currentUserId).eq("blockedId", args.targetUserId))
      .first();
    const blockedBy = await ctx.db
      .query("blocks")
      .withIndex("by_both", (q) => q.eq("blockerId", args.targetUserId).eq("blockedId", currentUserId))
      .first();
    if (blocked || blockedBy) throw new Error("Action not allowed");

    const u1 = currentUserId < args.targetUserId ? currentUserId : args.targetUserId;
    const u2 = currentUserId < args.targetUserId ? args.targetUserId : currentUserId;
    const status = currentUserId === u1 ? "pending_1_to_2" : "pending_2_to_1";

    const existing = await ctx.db
      .query("friendships")
      .withIndex("by_users", (q) => q.eq("userId1", u1).eq("userId2", u2))
      .first();

    if (existing) {
      if (existing.status === "friends") throw new Error("Already friends");
      throw new Error("Friend request already pending");
    }

    await ctx.db.insert("friendships", {
      userId1: u1,
      userId2: u2,
      status,
      createdAt: Date.now(),
    });

    // Create Notification
    await ctx.db.insert("notifications", {
      userId: args.targetUserId,
      senderId: currentUserId,
      type: "friend_request",
      read: false,
      createdAt: Date.now(),
    });
  },
});

export const acceptFriendRequest = mutation({
  args: { targetUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");
    const currentUserId = user._id;

    const u1 = currentUserId < args.targetUserId ? currentUserId : args.targetUserId;
    const u2 = currentUserId < args.targetUserId ? args.targetUserId : currentUserId;

    const friendship = await ctx.db
      .query("friendships")
      .withIndex("by_users", (q) => q.eq("userId1", u1).eq("userId2", u2))
      .first();

    if (!friendship) throw new Error("No friend request found");
    if (friendship.status === "friends") return;

    // Check if the current user is the recipient of the pending request
    const expectedPending = currentUserId === u1 ? "pending_2_to_1" : "pending_1_to_2";
    if (friendship.status !== expectedPending) {
      throw new Error("You cannot accept your own request");
    }

    await ctx.db.patch(friendship._id, {
      status: "friends",
    });

    // Remove pending friend request notification
    const notification = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", currentUserId))
      .collect();
    const targetNotif = notification.find((n) => n.senderId === args.targetUserId && n.type === "friend_request");
    if (targetNotif) {
      await ctx.db.delete(targetNotif._id);
    }

    // Create Friend Accepted Notification
    await ctx.db.insert("notifications", {
      userId: args.targetUserId,
      senderId: currentUserId,
      type: "friend_accepted",
      read: false,
      createdAt: Date.now(),
    });
  },
});

export const rejectFriendRequest = mutation({
  args: { targetUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");
    const currentUserId = user._id;

    const u1 = currentUserId < args.targetUserId ? currentUserId : args.targetUserId;
    const u2 = currentUserId < args.targetUserId ? args.targetUserId : currentUserId;

    const friendship = await ctx.db
      .query("friendships")
      .withIndex("by_users", (q) => q.eq("userId1", u1).eq("userId2", u2))
      .first();

    if (!friendship) throw new Error("No friend request found");
    if (friendship.status === "friends") throw new Error("Cannot reject active friendship");

    await ctx.db.delete(friendship._id);

    // Delete notification
    const notification = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", currentUserId))
      .collect();
    const targetNotif = notification.find((n) => n.senderId === args.targetUserId && n.type === "friend_request");
    if (targetNotif) {
      await ctx.db.delete(targetNotif._id);
    }
  },
});

export const cancelFriendRequest = mutation({
  args: { targetUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");
    const currentUserId = user._id;

    const u1 = currentUserId < args.targetUserId ? currentUserId : args.targetUserId;
    const u2 = currentUserId < args.targetUserId ? args.targetUserId : currentUserId;

    const friendship = await ctx.db
      .query("friendships")
      .withIndex("by_users", (q) => q.eq("userId1", u1).eq("userId2", u2))
      .first();

    if (!friendship) throw new Error("No pending request");
    
    const expectedPending = currentUserId === u1 ? "pending_1_to_2" : "pending_2_to_1";
    if (friendship.status !== expectedPending) {
      throw new Error("Cannot cancel request sent by target");
    }

    await ctx.db.delete(friendship._id);

    // Delete target user's notification
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.targetUserId))
      .collect();
    const targetNotif = notifications.find((n) => n.senderId === currentUserId && n.type === "friend_request");
    if (targetNotif) {
      await ctx.db.delete(targetNotif._id);
    }
  },
});

export const removeFriend = mutation({
  args: { targetUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");
    const currentUserId = user._id;

    const u1 = currentUserId < args.targetUserId ? currentUserId : args.targetUserId;
    const u2 = currentUserId < args.targetUserId ? args.targetUserId : currentUserId;

    const friendship = await ctx.db
      .query("friendships")
      .withIndex("by_users", (q) => q.eq("userId1", u1).eq("userId2", u2))
      .first();

    if (!friendship || friendship.status !== "friends") {
      throw new Error("Not friends");
    }

    await ctx.db.delete(friendship._id);
  },
});


// ----------------------------------------------------
// WRITE MUTATIONS: BLOCKS
// ----------------------------------------------------

export const blockUser = mutation({
  args: { targetUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");
    const currentUserId = user._id;

    if (currentUserId === args.targetUserId) throw new Error("Cannot block yourself");

    const existing = await ctx.db
      .query("blocks")
      .withIndex("by_both", (q) => q.eq("blockerId", currentUserId).eq("blockedId", args.targetUserId))
      .first();

    if (existing) return;

    await ctx.db.insert("blocks", {
      blockerId: currentUserId,
      blockedId: args.targetUserId,
      createdAt: Date.now(),
    });

    // Clean up active friendships
    const u1 = currentUserId < args.targetUserId ? currentUserId : args.targetUserId;
    const u2 = currentUserId < args.targetUserId ? args.targetUserId : currentUserId;
    
    const friendship = await ctx.db
      .query("friendships")
      .withIndex("by_users", (q) => q.eq("userId1", u1).eq("userId2", u2))
      .first();
    if (friendship) await ctx.db.delete(friendship._id);
  },
});

export const unblockUser = mutation({
  args: { targetUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");
    const currentUserId = user._id;

    const block = await ctx.db
      .query("blocks")
      .withIndex("by_both", (q) => q.eq("blockerId", currentUserId).eq("blockedId", args.targetUserId))
      .first();

    if (block) {
      await ctx.db.delete(block._id);
    }
  },
});

export const getBlockedUsers = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) return [];
    const currentUserId = user._id;

    const blocksList = await ctx.db
      .query("blocks")
      .withIndex("by_blocker", (q) => q.eq("blockerId", currentUserId))
      .collect();

    const profiles = [];
    for (const b of blocksList) {
      const p = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", b.blockedId))
        .first();
      if (p) {
        profiles.push({
          userId: p.userId,
          name: p.name,
          username: p.username,
          image: p.image,
        });
      }
    }
    return profiles;
  },
});

// ----------------------------------------------------
// WRITE MUTATIONS: PRIVACY
// ----------------------------------------------------

export const updatePrivacySettings = mutation({
  args: {
    profilePrivacy: v.string(),
    allowFriendRequests: v.boolean(),
    hideWatchlist: v.boolean(),
    hideFavorites: v.boolean(),
    hideRatings: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");
    const currentUserId = user._id;

    const profile = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", currentUserId))
      .first();

    if (!profile) throw new Error("Profile not found");

    await ctx.db.patch(profile._id, {
      profilePrivacy: args.profilePrivacy,
      allowFriendRequests: args.allowFriendRequests,
      hideWatchlist: args.hideWatchlist,
      hideFavorites: args.hideFavorites,
      hideRatings: args.hideRatings,
    });
  },
});

// ----------------------------------------------------
// WRITE MUTATIONS: NOTIFICATIONS
// ----------------------------------------------------

export const getNotifications = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) return [];
    const currentUserId = user._id;

    const list = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", currentUserId))
      .collect();

    // Sort by newest
    list.sort((a, b) => b.createdAt - a.createdAt);

    const enriched = [];
    for (const notif of list) {
      const sender = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", notif.senderId))
        .first();
      
      enriched.push({
        _id: notif._id,
        type: notif.type,
        read: notif.read,
        createdAt: notif.createdAt,
        commentId: notif.commentId,
        mediaId: notif.mediaId,
        mediaType: notif.mediaType,
        sender: sender ? {
          userId: sender.userId,
          name: sender.name,
          username: sender.username,
          image: sender.image,
        } : null,
      });
    }

    return enriched;
  },
});

export const markNotificationRead = mutation({
  args: { notifId: v.id("notifications") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    await ctx.db.patch(args.notifId, { read: true });
  },
});

export const clearAllNotifications = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");
    const currentUserId = user._id;

    const list = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", currentUserId))
      .collect();

    for (const n of list) {
      await ctx.db.delete(n._id);
    }
  },
});
