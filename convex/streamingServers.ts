import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthedUser } from "./users";
import { defaultStreamingServers } from "../lib/streamingProviderList";

export const getActiveServers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("streamingServers")
      .withIndex("by_order", (q) => q.eq("isActive", true))
      .collect();
  },
});

export const getAdminServers = query({
  args: {},
  handler: async (ctx) => {
    const caller = await getAuthedUser(ctx);
    if (!caller || (caller.role !== "owner" && caller.role !== "admin")) {
      throw new Error("Unauthorized: Admin or Owner access required");
    }

    return await ctx.db
      .query("streamingServers")
      .withIndex("by_all_order")
      .collect();
  },
});

export const createServer = mutation({
  args: {
    title: v.string(),
    movieUrl: v.string(),
    tvUrl: v.string(),
    recommended: v.optional(v.boolean()),
    fast: v.optional(v.boolean()),
    ads: v.optional(v.boolean()),
    isActive: v.boolean(),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const caller = await getAuthedUser(ctx);
    if (!caller || (caller.role !== "owner" && caller.role !== "admin")) {
      throw new Error("Unauthorized: Admin or Owner access required");
    }

    let serverOrder = args.order;
    if (serverOrder === undefined) {
      const allServers = await ctx.db.query("streamingServers").collect();
      const maxOrder = allServers.reduce((max, s) => Math.max(max, s.order ?? 0), 0);
      serverOrder = maxOrder + 1;
    }

    return await ctx.db.insert("streamingServers", {
      title: args.title.trim(),
      movieUrl: args.movieUrl.trim(),
      tvUrl: args.tvUrl.trim(),
      order: serverOrder,
      recommended: args.recommended ?? false,
      fast: args.fast ?? false,
      ads: args.ads ?? true,
      isActive: args.isActive,
      updatedAt: Date.now(),
    });
  },
});

export const updateServer = mutation({
  args: {
    id: v.id("streamingServers"),
    title: v.string(),
    movieUrl: v.string(),
    tvUrl: v.string(),
    recommended: v.optional(v.boolean()),
    fast: v.optional(v.boolean()),
    ads: v.optional(v.boolean()),
    isActive: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const caller = await getAuthedUser(ctx);
    if (!caller || (caller.role !== "owner" && caller.role !== "admin")) {
      throw new Error("Unauthorized: Admin or Owner access required");
    }

    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Streaming server not found");
    }

    await ctx.db.patch(args.id, {
      title: args.title.trim(),
      movieUrl: args.movieUrl.trim(),
      tvUrl: args.tvUrl.trim(),
      order: args.order,
      recommended: args.recommended ?? false,
      fast: args.fast ?? false,
      ads: args.ads ?? true,
      isActive: args.isActive,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

export const toggleServerActive = mutation({
  args: {
    id: v.id("streamingServers"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const caller = await getAuthedUser(ctx);
    if (!caller || (caller.role !== "owner" && caller.role !== "admin")) {
      throw new Error("Unauthorized: Admin or Owner access required");
    }

    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Streaming server not found");
    }

    if (existing.isActive !== args.isActive) {
      await ctx.db.patch(args.id, {
        isActive: args.isActive,
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

export const deleteServer = mutation({
  args: {
    id: v.id("streamingServers"),
  },
  handler: async (ctx, args) => {
    const caller = await getAuthedUser(ctx);
    if (!caller || (caller.role !== "owner" && caller.role !== "admin")) {
      throw new Error("Unauthorized: Admin or Owner access required");
    }

    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Streaming server not found");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

export const reorderServers = mutation({
  args: {
    orderedIds: v.array(v.id("streamingServers")),
  },
  handler: async (ctx, args) => {
    const caller = await getAuthedUser(ctx);
    if (!caller || (caller.role !== "owner" && caller.role !== "admin")) {
      throw new Error("Unauthorized: Admin or Owner access required");
    }

    for (let index = 0; index < args.orderedIds.length; index++) {
      const id = args.orderedIds[index];
      const server = await ctx.db.get(id);
      if (server && server.order !== index + 1) {
        await ctx.db.patch(id, {
          order: index + 1,
          updatedAt: Date.now(),
        });
      }
    }

    return { success: true };
  },
});

export const seedDefaultServers = internalMutation({
  args: {
    force: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("streamingServers").take(1);

    if (existing.length > 0) {
      if (!args.force) {
        return {
          seededCount: 0,
          message: "Database already contains servers. Pass force: true to overwrite.",
        };
      }
      const allCurrent = await ctx.db.query("streamingServers").collect();
      for (const s of allCurrent) {
        await ctx.db.delete(s._id);
      }
    }

    const defaultList = defaultStreamingServers;

    const now = Date.now();
    for (let index = 0; index < defaultList.length; index++) {
      const item = defaultList[index];
      await ctx.db.insert("streamingServers", {
        title: item.title,
        movieUrl: item.movieUrl,
        tvUrl: item.tvUrl,
        order: item.order ?? index + 1,
        recommended: item.recommended ?? false,
        fast: item.fast ?? false,
        ads: item.ads ?? true,
        isActive: item.isActive ?? true,
        updatedAt: now,
      });
    }

    return { seededCount: defaultList.length, message: "Default servers seeded successfully" };
  },
});
