import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(), // Better Auth user ID
    username: v.string(), // Unique username
    name: v.string(),
    email: v.string(),
  })
    .index("by_username", ["username"])
    .index("by_userId", ["userId"]),

  watchlist: defineTable({
    userId: v.string(), // Better Auth user ID
    mediaId: v.string(), // TMDB media ID
    mediaType: v.string(), // "movie" or "tv"
    title: v.string(),
    posterPath: v.string(),
    rating: v.number(),
    releaseYear: v.string(),
    addedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_media", ["userId", "mediaId", "mediaType"]),
  
  favorites: defineTable({
    userId: v.string(), // Better Auth user ID
    mediaId: v.string(), // TMDB media ID
    mediaType: v.string(), // "movie" or "tv"
    title: v.string(),
    posterPath: v.string(),
    rating: v.number(),
    releaseYear: v.string(),
    addedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_media", ["userId", "mediaId", "mediaType"]),

  ratings: defineTable({
    userId: v.string(), // Better Auth user ID
    mediaId: v.string(), // TMDB media ID
    mediaType: v.string(), // "movie" or "tv"
    title: v.string(),
    posterPath: v.string(),
    rating: v.number(), // user score from 1-10
    releaseYear: v.string(),
    addedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_media", ["userId", "mediaId", "mediaType"]),
});
