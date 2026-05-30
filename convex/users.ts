import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

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
      // Update existing profile
      await ctx.db.patch(existingProfile._id, {
        username: cleanedUsername,
        name: args.name,
        email: args.email,
      });
      return existingProfile._id;
    } else {
      // Create new profile mapping
      return await ctx.db.insert("users", {
        userId,
        username: cleanedUsername,
        name: args.name,
        email: args.email,
      });
    }
  },
});

// Retrieve profile by username
export const getUserByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const cleanedUsername = args.username.trim().toLowerCase();
    return await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", cleanedUsername))
      .first();
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
      });
    }
  },
});

// Delete account data
export const deleteCurrentUserAccountData = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    const userId = user._id;

    // Remove users profile
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
      await ctx.db.delete(profile._id);
    }

    // Delete ratings, watchlist, favorites
    const ratings = await ctx.db
      .query("ratings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const r of ratings) {
      await ctx.db.delete(r._id);
    }

    const watchlists = await ctx.db
      .query("watchlist")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const w of watchlists) {
      await ctx.db.delete(w._id);
    }

    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const f of favorites) {
      await ctx.db.delete(f._id);
    }
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


