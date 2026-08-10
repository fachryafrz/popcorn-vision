import { internalMutation, internalQuery, mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

// Helper: Authenticate user
async function getAuthedUser(ctx: QueryCtx | MutationCtx) {
  const user = await authComponent.getAuthUser(ctx);
  if (!user) throw new Error("Unauthorized");
  return user._id;
}

// Save or update push subscription for current user
export const savePushSubscription = mutation({
  args: {
    subscription: v.object({
      endpoint: v.string(),
      keys: v.object({
        p256dh: v.string(),
        auth: v.string(),
      }),
    }),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthedUser(ctx);

    // Check if endpoint already registered
    const existing = await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_endpoint", (q) => q.eq("subscription.endpoint", args.subscription.endpoint))
      .first();

    if (existing) {
      // Update ownership / details if needed
      await ctx.db.patch(existing._id, {
        userId,
        subscription: args.subscription,
        userAgent: args.userAgent,
      });
      return existing._id;
    }

    // Insert new subscription
    return await ctx.db.insert("pushSubscriptions", {
      userId,
      subscription: args.subscription,
      userAgent: args.userAgent,
      createdAt: Date.now(),
    });
  },
});

// Remove a specific push subscription or all push subscriptions for user
export const deletePushSubscription = mutation({
  args: {
    endpoint: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthedUser(ctx);

    if (args.endpoint) {
      const existing = await ctx.db
        .query("pushSubscriptions")
        .withIndex("by_endpoint", (q) => q.eq("subscription.endpoint", args.endpoint!))
        .first();

      if (existing && existing.userId === userId) {
        await ctx.db.delete(existing._id);
      }
    } else {
      // Delete all subscriptions for current user
      const subscriptions = await ctx.db
        .query("pushSubscriptions")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();

      for (const sub of subscriptions) {
        await ctx.db.delete(sub._id);
      }
    }

    return true;
  },
});

// Check if current user has active push subscriptions
export const getUserSubscriptions = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) return [];

    const subscriptions = await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return subscriptions;
  },
});

// Internal query to fetch subscriptions for a target recipient
export const getSubscriptionsByUserIdInternal = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// Internal mutation to cleanup expired / invalid subscriptions
export const removeSubscriptionByIdInternal = internalMutation({
  args: { id: v.id("pushSubscriptions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
