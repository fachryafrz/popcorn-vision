import { internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const get = internalQuery({
  args: {
    key: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tmdbCache")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
  },
});

export const set = internalMutation({
  args: {
    key: v.string(),
    data: v.string(),
    ttlMs: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("tmdbCache")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    const now = Date.now();
    const expiresAt = now + args.ttlMs;

    if (existing) {
      await ctx.db.patch(existing._id, {
        data: args.data,
        cachedAt: now,
        expiresAt,
      });
    } else {
      await ctx.db.insert("tmdbCache", {
        key: args.key,
        data: args.data,
        cachedAt: now,
        expiresAt,
      });
    }
  },
});

export const cleanupExpired = internalMutation({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    const now = Date.now();
    const expired = await ctx.db
      .query("tmdbCache")
      .withIndex("by_expiresAt", (q) => q.lt("expiresAt", now))
      .take(limit);

    for (const doc of expired) {
      await ctx.db.delete(doc._id);
    }
    return expired.length;
  },
});
