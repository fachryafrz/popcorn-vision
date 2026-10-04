import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { v } from "convex/values";
import { authComponent } from "./auth";
import { TIMELINE_UNIVERSES, getTimelineUniverse } from "../config/timelines";

// Helper to get current authenticated user profile
async function getAuthedUser(ctx: QueryCtx | MutationCtx) {
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

// Helper to find a timeline document by slug or Convex ID
async function findTimeline(
  ctx: QueryCtx | MutationCtx,
  slugOrId: string,
): Promise<Doc<"timelines"> | null> {
  const bySlug = await ctx.db
    .query("timelines")
    .withIndex("by_slug", (q) => q.eq("slug", slugOrId))
    .first();
  if (bySlug) return bySlug;

  try {
    const doc = await ctx.db.get(slugOrId as Id<"timelines">);
    if (doc && "slug" in doc) {
      return doc;
    }
  } catch {
    // Not a valid Convex ID format
  }
  return null;
}

const timelineNodeValidator = v.object({
  id: v.string(),
  type: v.optional(v.string()),
  position: v.object({ x: v.number(), y: v.number() }),
  data: v.object({
    id: v.string(),
    tmdbId: v.number(),
    mediaType: v.string(),
    title: v.string(),
    releaseYear: v.string(),
    chronologicalYear: v.optional(v.string()),
    posterPath: v.string(),
    rating: v.optional(v.number()),
    isAnchor: v.optional(v.boolean()),
    isUnreleased: v.optional(v.boolean()),
    branchName: v.optional(v.string()),
    universeId: v.optional(v.string()),
    isDoomsdayCanon: v.optional(v.boolean()),
    phase: v.optional(v.string()),
    canonType: v.string(),
    description: v.optional(v.string()),
  }),
});

const timelineEdgeValidator = v.object({
  id: v.string(),
  source: v.string(),
  target: v.string(),
  sourceHandle: v.optional(v.string()),
  targetHandle: v.optional(v.string()),
  label: v.optional(v.string()),
  description: v.optional(v.string()),
  animated: v.optional(v.boolean()),
  strokeColor: v.optional(v.string()),
  isDashed: v.optional(v.boolean()),
  branchVariant: v.optional(v.string()),
});

// Seed or ensure official timelines exist in database
export const seedOfficialTimelines = mutation({
  args: {
    forceUpdate: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const results: string[] = [];

    for (const template of TIMELINE_UNIVERSES) {
      const existing = await ctx.db
        .query("timelines")
        .withIndex("by_slug", (q) => q.eq("slug", template.id))
        .first();

      if (!existing) {
        const previewPosters = template.nodes.slice(0, 4).map((n) => n.data.posterPath);
        await ctx.db.insert("timelines", {
          slug: template.id,
          name: template.name,
          shortName: template.shortName,
          description: template.description,
          accentColor: template.accentColor,
          isOfficial: true,
          privacy: "public",
          category: template.id === "star-wars" ? "scifi" : "film_tv",
          upvotesCount: template.id === "mcu" ? 6 : 4,
          previewPosters,
          defaultFilterId: template.defaultFilterId,
          filters: template.filters,
          nodes: template.nodes,
          edges: template.edges,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        results.push(`Created official timeline: ${template.name}`);
      } else if (args.forceUpdate) {
        const previewPosters = template.nodes.slice(0, 4).map((n) => n.data.posterPath);
        await ctx.db.patch(existing._id, {
          name: template.name,
          shortName: template.shortName,
          description: template.description,
          accentColor: template.accentColor,
          category: template.id === "star-wars" ? "scifi" : "film_tv",
          previewPosters,
          filters: template.filters,
          defaultFilterId: template.defaultFilterId,
          nodes: template.nodes,
          edges: template.edges,
          updatedAt: Date.now(),
        });
        results.push(`Updated official timeline: ${template.name}`);
      }
    }

    return results;
  },
});

// Query a single timeline by slug or ID
export const getTimeline = query({
  args: {
    slugOrId: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthedUser(ctx);

    const timeline = await findTimeline(ctx, args.slugOrId);

    if (!timeline) {
      // Fallback for built-in timelines if DB has not yet been seeded
      const builtIn = getTimelineUniverse(args.slugOrId);
      if (builtIn) {
        return {
          ...builtIn,
          isOfficial: true,
          privacy: "public" as const,
          category: builtIn.category ?? "film_tv",
          upvotesCount: builtIn.id === "mcu" ? 6 : builtIn.id === "star-wars" ? 4 : 2,
          isUpvoted: false,
          previewPosters: builtIn.nodes.slice(0, 4).map((n) => n.data.posterPath),
        };
      }
      return null;
    }

    // Privacy check
    if (timeline.privacy === "private") {
      if (!currentUser || currentUser.userId !== timeline.creatorId) {
        return null;
      }
    }

    const previewPosters =
      timeline.previewPosters && timeline.previewPosters.length > 0
        ? timeline.previewPosters
        : timeline.nodes.slice(0, 4).map((n) => n.data.posterPath);

    const isUpvoted = currentUser
      ? (timeline.upvotedUserIds?.includes(currentUser.userId) ?? false)
      : false;

    return {
      _id: timeline._id,
      id: timeline.slug,
      slug: timeline.slug,
      name: timeline.name,
      shortName: timeline.shortName,
      description: timeline.description,
      accentColor: timeline.accentColor,
      category: timeline.category,
      isOfficial: timeline.isOfficial,
      creatorId: timeline.creatorId,
      creatorName: timeline.creatorName,
      creatorUsername: timeline.creatorUsername,
      privacy: timeline.privacy as "public" | "private",
      upvotesCount: timeline.upvotesCount ?? (timeline.upvotedUserIds?.length ?? 1),
      isUpvoted,
      previewPosters,
      defaultFilterId: timeline.defaultFilterId,
      filters: timeline.filters,
      nodes: timeline.nodes,
      edges: timeline.edges,
      createdAt: timeline.createdAt,
      updatedAt: timeline.updatedAt,
    };
  },
});

// List all accessible timelines (Official + Public community + User's private)
export const listTimelines = query({
  args: {
    category: v.optional(v.string()),
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthedUser(ctx);

    // Official timelines
    const officialTimelines = await ctx.db
      .query("timelines")
      .withIndex("by_official", (q) => q.eq("isOfficial", true))
      .collect();

    // Public community timelines
    const publicTimelines = await ctx.db
      .query("timelines")
      .withIndex("by_privacy", (q) => q.eq("privacy", "public"))
      .collect();

    // User's own private timelines
    let userPrivateTimelines: typeof publicTimelines = [];
    if (currentUser) {
      userPrivateTimelines = await ctx.db
        .query("timelines")
        .withIndex("by_creator", (q) => q.eq("creatorId", currentUser.userId))
        .filter((q) => q.eq(q.field("privacy"), "private"))
        .collect();
    }

    // Combine and deduplicate
    const combinedMap = new Map<string, (typeof officialTimelines)[0]>();

    for (const t of officialTimelines) {
      combinedMap.set(t.slug, t);
    }
    for (const t of publicTimelines) {
      if (!t.isOfficial) {
        combinedMap.set(t.slug, t);
      }
    }
    for (const t of userPrivateTimelines) {
      combinedMap.set(t.slug, t);
    }

    // If official timelines are not yet in the DB, add fallback definitions
    for (const builtIn of TIMELINE_UNIVERSES) {
      if (!combinedMap.has(builtIn.id)) {
        combinedMap.set(builtIn.id, {
          _id: builtIn.id as never,
          _creationTime: 0,
          slug: builtIn.id,
          name: builtIn.name,
          shortName: builtIn.shortName,
          description: builtIn.description,
          accentColor: builtIn.accentColor,
          category: builtIn.category ?? "film_tv",
          upvotesCount: builtIn.id === "mcu" ? 6 : builtIn.id === "star-wars" ? 4 : 2,
          previewPosters: builtIn.nodes.slice(0, 4).map((n) => n.data.posterPath),
          isOfficial: true,
          privacy: "public",
          defaultFilterId: builtIn.defaultFilterId,
          filters: builtIn.filters,
          nodes: builtIn.nodes,
          edges: builtIn.edges,
          createdAt: 0,
          updatedAt: 0,
        });
      }
    }

    let items = Array.from(combinedMap.values());

    // Category filtering
    if (args.category && args.category !== "all") {
      items = items.filter((t) => t.category === args.category);
    }

    // Search query filtering
    if (args.searchQuery && args.searchQuery.trim()) {
      const q = args.searchQuery.toLowerCase().trim();
      items = items.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.shortName.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.slug.toLowerCase().includes(q),
      );
    }

    return items.map((t) => {
      const previewPosters =
        t.previewPosters && t.previewPosters.length > 0
          ? t.previewPosters
          : t.nodes.slice(0, 4).map((n) => n.data.posterPath);

      const hasBranching =
        t.edges.some((e) => e.branchVariant && e.branchVariant !== "sacred") ||
        t.nodes.some((n) => n.data.canonType !== "sacred");

      const upvotesCount =
        t.upvotesCount ?? (t.upvotedUserIds?.length ?? (t.slug === "mcu" ? 6 : t.slug === "star-wars" ? 4 : 1));

      const isUpvoted = currentUser
        ? (t.upvotedUserIds?.includes(currentUser.userId) ?? false)
        : false;

      return {
        _id: t._id,
        id: t.slug,
        slug: t.slug,
        name: t.name,
        shortName: t.shortName,
        description: t.description,
        accentColor: t.accentColor,
        category: t.category ?? "film_tv",
        isOfficial: t.isOfficial,
        creatorId: t.creatorId,
        creatorName: t.creatorName,
        creatorUsername: t.creatorUsername,
        privacy: t.privacy as "public" | "private",
        upvotesCount,
        isUpvoted,
        previewPosters,
        nodeCount: t.nodes.length,
        hasBranching,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      };
    });
  },
});

// Toggle upvote on a timeline
export const upvoteTimeline = mutation({
  args: {
    slugOrId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthedUser(ctx);
    if (!user) {
      throw new Error("You must be logged in to upvote a timeline");
    }

    const timeline = await findTimeline(ctx, args.slugOrId);

    if (!timeline) {
      throw new Error("Timeline not found");
    }

    const currentUpvoted = timeline.upvotedUserIds ?? [];
    const isAlreadyUpvoted = currentUpvoted.includes(user.userId);
    let updatedUpvoted: string[];
    let newCount: number;

    if (isAlreadyUpvoted) {
      updatedUpvoted = currentUpvoted.filter((id) => id !== user.userId);
      newCount = Math.max(0, (timeline.upvotesCount ?? 1) - 1);
    } else {
      updatedUpvoted = [...currentUpvoted, user.userId];
      newCount = (timeline.upvotesCount ?? 0) + 1;
    }

    await ctx.db.patch(timeline._id, {
      upvotedUserIds: updatedUpvoted,
      upvotesCount: newCount,
      updatedAt: Date.now(),
    });

    return { isUpvoted: !isAlreadyUpvoted, upvotesCount: newCount };
  },
});

// Create a new custom timeline
export const createTimeline = mutation({
  args: {
    name: v.string(),
    shortName: v.string(),
    slug: v.string(),
    description: v.string(),
    accentColor: v.string(),
    privacy: v.string(), // "public" | "private"
  },
  handler: async (ctx, args) => {
    const user = await getAuthedUser(ctx);
    if (!user) {
      throw new Error("You must be logged in to create a timeline");
    }

    // Clean slug
    const cleanSlug = args.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!cleanSlug) {
      throw new Error("Please provide a valid slug");
    }

    // Check slug uniqueness
    const existing = await ctx.db
      .query("timelines")
      .withIndex("by_slug", (q) => q.eq("slug", cleanSlug))
      .first();

    if (existing) {
      throw new Error("A timeline with this URL identifier already exists. Please choose another slug.");
    }

    const newId = await ctx.db.insert("timelines", {
      slug: cleanSlug,
      name: args.name.trim(),
      shortName: args.shortName.trim(),
      description: args.description.trim(),
      accentColor: args.accentColor.trim() || "#E50914",
      isOfficial: false,
      creatorId: user.userId,
      creatorName: user.name,
      creatorUsername: user.username,
      privacy: args.privacy === "private" ? "private" : "public",
      defaultFilterId: "all",
      filters: [
        {
          id: "all",
          label: "All Items",
          description: "Full timeline order",
        },
      ],
      nodes: [],
      edges: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { id: cleanSlug, _id: newId };
  },
});

// Save / update canvas nodes and edges
export const saveTimelineCanvas = mutation({
  args: {
    slugOrId: v.string(),
    nodes: v.array(timelineNodeValidator),
    edges: v.array(timelineEdgeValidator),
  },
  handler: async (ctx, args) => {
    const user = await getAuthedUser(ctx);
    if (!user) {
      throw new Error("You must be logged in to edit a timeline");
    }

    // Find timeline
    const timeline = await findTimeline(ctx, args.slugOrId);

    if (!timeline) {
      throw new Error("Timeline not found");
    }

    // Check permission (owner or admin)
    const isOwner = timeline.creatorId === user.userId;
    const isAdmin = user.role === "owner" || user.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new Error("You do not have permission to edit this timeline");
    }

    await ctx.db.patch(timeline._id, {
      nodes: args.nodes,
      edges: args.edges,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Update timeline metadata
export const updateTimeline = mutation({
  args: {
    slugOrId: v.string(),
    name: v.string(),
    shortName: v.string(),
    description: v.string(),
    accentColor: v.string(),
    privacy: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthedUser(ctx);
    if (!user) {
      throw new Error("You must be logged in to edit a timeline");
    }

    const timeline = await findTimeline(ctx, args.slugOrId);

    if (!timeline) {
      throw new Error("Timeline not found");
    }

    const isOwner = timeline.creatorId === user.userId;
    const isAdmin = user.role === "owner" || user.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new Error("You do not have permission to edit this timeline");
    }

    await ctx.db.patch(timeline._id, {
      name: args.name.trim(),
      shortName: args.shortName.trim(),
      description: args.description.trim(),
      accentColor: args.accentColor.trim(),
      privacy: args.privacy === "private" ? "private" : "public",
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Delete a custom timeline
export const deleteTimeline = mutation({
  args: {
    slugOrId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthedUser(ctx);
    if (!user) {
      throw new Error("You must be logged in to delete a timeline");
    }

    const timeline = await findTimeline(ctx, args.slugOrId);

    if (!timeline) {
      throw new Error("Timeline not found");
    }

    if (timeline.isOfficial) {
      throw new Error("Official timelines cannot be deleted");
    }

    const isOwner = timeline.creatorId === user.userId;
    const isAdmin = user.role === "owner" || user.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new Error("You do not have permission to delete this timeline");
    }

    await ctx.db.delete(timeline._id);

    return { success: true };
  },
});
