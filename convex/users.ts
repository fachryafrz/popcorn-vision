import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

export async function getAuthedUser(ctx: QueryCtx | MutationCtx) {
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

export async function ensureActiveUser(ctx: QueryCtx | MutationCtx) {
  const user = await getAuthedUser(ctx);
  if (!user) {
    throw new Error("Unauthorized: Please sign in");
  }

  if (user.status === "banned") {
    throw new Error("Your account has been banned due to violations of our community guidelines.");
  }

  if (user.status === "suspended") {
    throw new Error("Your account is currently suspended and restricted from performing interactive actions.");
  }

  if (user.status === "closed" || user.status === "deleted") {
    throw new Error("Your account is deactivated.");
  }

  return user;
}

// Check if username is already taken (unique check)
export const checkUsernameUnique = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const cleanedUsername = args.username.trim().toLowerCase();
    if (cleanedUsername.length < 3) return false;

    const existing = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", cleanedUsername))
      .first();

    return !existing;
  },
});

// Create or update user profile mapping
export const createOrUpdateProfile = mutation({
  args: {
    username: v.string(),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    const cleanedUsername = args.username.trim().toLowerCase();

    // 1. Verify username format
    if (!/^[a-zA-Z0-9_]{3,15}$/.test(cleanedUsername)) {
      throw new Error("Username must be between 3 and 15 alphanumeric characters or underscores");
    }

    // 2. Check if username is taken by ANOTHER user
    const existingUsername = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", cleanedUsername))
      .first();

    if (existingUsername && existingUsername.userId !== userId) {
      throw new Error("Username is already taken");
    }

    // 3. Find if profile already exists for this userId
    const existingProfile = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      const newStatus = existingProfile.status || "active";
      // Update existing profile
      await ctx.db.patch(existingProfile._id, {
        username: cleanedUsername,
        name: args.name,
        email: args.email,
        status: newStatus,
      });
      return existingProfile._id;
    } else {
      // Create new profile mapping
      return await ctx.db.insert("users", {
        userId,
        username: cleanedUsername,
        name: args.name,
        email: args.email,
        status: "active",
        role: "user",
      });
    }
  },
});

// Retrieve profile by username
export const getUserByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const cleanedUsername = args.username.trim().toLowerCase();
    const profile = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", cleanedUsername))
      .first();
    if (!profile || profile.status === "deleted" || profile.status === "closed") return null;
    return profile;
  },
});

// Retrieve current logged in user's profile
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
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
  },
});

// Update current user's profile
export const updateCurrentUserProfile = mutation({
  args: {
    name: v.string(),
    username: v.string(),
    bio: v.optional(v.string()),
    country: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    const cleanedUsername = args.username.trim().toLowerCase();

    // 1. Verify username format
    if (!/^[a-zA-Z0-9_]{3,15}$/.test(cleanedUsername)) {
      throw new Error("Username must be between 3 and 15 alphanumeric characters or underscores");
    }

    // 2. Character limit on name
    if (args.name.trim().length === 0 || args.name.length > 50) {
      throw new Error("Display name must be between 1 and 50 characters");
    }

    // 3. Check if username is taken by ANOTHER user
    const existingUsername = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", cleanedUsername))
      .first();

    if (existingUsername && existingUsername.userId !== userId) {
      throw new Error("Username is already taken");
    }

    // 4. Update/insert profile
    const existingProfile = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, {
        username: cleanedUsername,
        name: args.name.trim(),
        bio: args.bio,
        country: args.country,
        status: existingProfile.status || "active",
      });
      return existingProfile._id;
    } else {
      return await ctx.db.insert("users", {
        userId,
        username: cleanedUsername,
        name: args.name.trim(),
        email: user.email || "",
        bio: args.bio,
        country: args.country,
        status: "active",
        role: "user",
      });
    }
  },
});

// Delete account data (Soft Delete)
export const deleteCurrentUserAccountData = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    // Soft delete users profile
    const profile = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (profile) {
      if (profile.imageStorageId) {
        try {
          await ctx.storage.delete(profile.imageStorageId);
        } catch (err) {
          console.error("Failed to delete storage file during account deletion:", err);
        }
      }
      // Soft delete: change status, rename username to free it up, and clear details
      await ctx.db.patch(profile._id, {
        status: "deleted",
        name: "[deleted]",
        username: `deleted_${profile._id}`,
        email: "",
        bio: undefined,
        image: undefined,
        imageStorageId: undefined,
      });
    }

    // Preserve ratings, watchlist, favorites, and diary logs in database (avoid deleting data)

    // Delete friendships
    const friendships1 = await ctx.db
      .query("friendships")
      .withIndex("by_user1", (q) => q.eq("userId1", userId))
      .collect();
    for (const f of friendships1) {
      await ctx.db.delete(f._id);
    }

    const friendships2 = await ctx.db
      .query("friendships")
      .withIndex("by_user2", (q) => q.eq("userId2", userId))
      .collect();
    for (const f of friendships2) {
      await ctx.db.delete(f._id);
    }

    // Delete blocks
    const blocks1 = await ctx.db
      .query("blocks")
      .withIndex("by_blocker", (q) => q.eq("blockerId", userId))
      .collect();
    for (const b of blocks1) {
      await ctx.db.delete(b._id);
    }

    const blocks2 = await ctx.db
      .query("blocks")
      .withIndex("by_blocked", (q) => q.eq("blockedId", userId))
      .collect();
    for (const b of blocks2) {
      await ctx.db.delete(b._id);
    }

    // Delete notifications received
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const n of notifications) {
      await ctx.db.delete(n._id);
    }

    // Delete notifications sent
    const sentNotifications = await ctx.db.query("notifications").collect();
    const relevantSentNotifs = sentNotifications.filter((n) => n.senderId === userId);
    for (const n of relevantSentNotifs) {
      await ctx.db.delete(n._id);
    }
  },
});

// Close account (Deactivation)
export const closeCurrentUserAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    const profile = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!profile) throw new Error("Profile not found");

    await ctx.db.patch(profile._id, {
      status: "closed",
    });
  },
});

// Reopen account (Reactivation)
export const reopenCurrentUserAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    const profile = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (profile && profile.status === "closed") {
      await ctx.db.patch(profile._id, {
        status: "active",
      });
      return { reopened: true };
    }
    return { reopened: false };
  },
});

// Generate a file upload URL in Convex
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");
    return await ctx.storage.generateUploadUrl();
  },
});

// Save storage ID of uploaded image and return its public URL
export const updateProfileImage = mutation({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    // Get the profile
    const profile = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!profile) throw new Error("Profile not found");

    // 1. Delete the OLD image from Convex Storage if it exists
    if (profile.imageStorageId) {
      try {
        await ctx.storage.delete(profile.imageStorageId);
      } catch (err) {
        console.error("Failed to delete old storage file:", err);
      }
    }

    // 2. Get the new public URL for the storage ID
    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) throw new Error("Failed to retrieve uploaded image URL");

    // 3. Update profile with new imageUrl and imageStorageId
    await ctx.db.patch(profile._id, {
      image: imageUrl,
      imageStorageId: args.storageId,
    });

    return imageUrl;
  },
});

// Remove profile image
export const removeProfileImage = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    const profile = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (profile) {
      // 1. Delete image from Convex Storage if it exists
      if (profile.imageStorageId) {
        try {
          await ctx.storage.delete(profile.imageStorageId);
        } catch (err) {
          console.error("Failed to delete storage file during removal:", err);
        }
      }

      // 2. Update profile fields to undefined
      await ctx.db.patch(profile._id, {
        image: undefined,
        imageStorageId: undefined,
      });
    }
  },
});

// Update user theme settings (theme)
export const updateUserThemeSettings = mutation({
  args: {
    theme: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");
    const userId = user._id;

    const profile = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!profile) throw new Error("Profile not found");

    await ctx.db.patch(profile._id, {
      theme: args.theme,
    });

    return profile._id;
  },
});

// Migration helper to backfill missing/undefined roles to "user"
export const migrateUserRoles = mutation({
  args: {},
  handler: async (ctx) => {
    const allUsers = await ctx.db.query("users").collect();
    let updatedCount = 0;

    for (const user of allUsers) {
      if (!user.role) {
        await ctx.db.patch(user._id, {
          role: "user",
        });
        updatedCount++;
      }
    }

    return {
      message: `Migration completed successfully`,
      updatedUsersCount: updatedCount,
      totalUsersCount: allUsers.length,
    };
  },
});

// ----------------------------------------------------
// ADMIN / OWNER MANAGEMENT
// ----------------------------------------------------

export const getAdminUsersList = query({
  args: {
    search: v.optional(v.string()),
    roleFilter: v.optional(v.string()),
    statusFilter: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const caller = await getAuthedUser(ctx);
    if (!caller || (caller.role !== "owner" && caller.role !== "admin")) {
      throw new Error("Unauthorized: Admin or Owner access required");
    }

    let users = await ctx.db.query("users").collect();

    if (args.search) {
      const q = args.search.toLowerCase().trim();
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }

    if (args.roleFilter && args.roleFilter !== "all") {
      users = users.filter((u) => (u.role || "user") === args.roleFilter);
    }

    if (args.statusFilter && args.statusFilter !== "all") {
      users = users.filter((u) => (u.status || "active") === args.statusFilter);
    }

    return users.map((u) => ({
      _id: u._id,
      userId: u.userId,
      name: u.name,
      username: u.username,
      email: u.email,
      image: u.image,
      role: u.role || "user",
      status: u.status || "active",
      country: u.country,
      bio: u.bio,
    }));
  },
});

export const updateUserRole = mutation({
  args: {
    targetUserId: v.id("users"),
    newRole: v.string(), // "user" | "admin" | "owner"
  },
  handler: async (ctx, args) => {
    const caller = await getAuthedUser(ctx);
    if (!caller || caller.role !== "owner") {
      throw new Error("Unauthorized: Only the Owner can change user roles");
    }

    const targetUser = await ctx.db.get(args.targetUserId);
    if (!targetUser) throw new Error("User not found");

    if (targetUser.role === "owner" && targetUser._id !== caller._id) {
      throw new Error("Cannot modify role of another Owner");
    }

    if (!["user", "admin", "owner"].includes(args.newRole)) {
      throw new Error("Invalid role specified");
    }

    await ctx.db.patch(args.targetUserId, {
      role: args.newRole,
    });

    return { success: true, message: `Role updated to ${args.newRole}` };
  },
});

export const updateUserStatus = mutation({
  args: {
    targetUserId: v.id("users"),
    newStatus: v.string(), // "active" | "suspended" | "banned"
  },
  handler: async (ctx, args) => {
    const caller = await getAuthedUser(ctx);
    if (!caller || (caller.role !== "owner" && caller.role !== "admin")) {
      throw new Error("Unauthorized: Admin or Owner access required");
    }

    const targetUser = await ctx.db.get(args.targetUserId);
    if (!targetUser) throw new Error("User not found");

    if (targetUser.role === "owner" && targetUser._id !== caller._id) {
      throw new Error("Cannot modify status of an Owner");
    }

    if (!["active", "suspended", "banned"].includes(args.newStatus)) {
      throw new Error("Invalid status specified");
    }

    await ctx.db.patch(args.targetUserId, {
      status: args.newStatus,
    });

    return { success: true, message: `Status updated to ${args.newStatus}` };
  },
});




