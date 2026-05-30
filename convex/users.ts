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
