import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(), // Better Auth user ID
    username: v.string(), // Unique username
    name: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    country: v.optional(v.string()),
    image: v.optional(v.string()),
    imageStorageId: v.optional(v.string()),
    theme: v.optional(v.string()),
    profilePrivacy: v.optional(v.string()), // "public" | "friends" | "private"
    allowFriendRequests: v.optional(v.boolean()),
    hideWatchlist: v.optional(v.boolean()),
    hideFavorites: v.optional(v.boolean()),
    hideRatings: v.optional(v.boolean()),
    status: v.optional(v.string()), // "active" | "deleted" | "closed"
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
    .index("by_user_media", ["userId", "mediaId", "mediaType"])
    .index("by_media", ["mediaId", "mediaType"]),

  friendships: defineTable({
    userId1: v.string(), // Lower string value alphabetically (for easy querying)
    userId2: v.string(), // Higher string value alphabetically
    status: v.string(), // "pending_1_to_2" | "pending_2_to_1" | "friends"
    createdAt: v.number(),
  })
    .index("by_users", ["userId1", "userId2"])
    .index("by_user1", ["userId1"])
    .index("by_user2", ["userId2"]),

  blocks: defineTable({
    blockerId: v.string(),
    blockedId: v.string(),
    createdAt: v.number(),
  })
    .index("by_blocker", ["blockerId"])
    .index("by_blocked", ["blockedId"])
    .index("by_both", ["blockerId", "blockedId"]),

  notifications: defineTable({
    userId: v.string(), // Recipient
    senderId: v.string(), // Sender of the action
    type: v.string(), // "friend_request" | "friend_accepted" | "comment_mention" | "comment_reply"
    read: v.boolean(),
    createdAt: v.number(),
    commentId: v.optional(v.id("comments")),
    mediaId: v.optional(v.string()),
    mediaType: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_unread", ["userId", "read"]),

  comments: defineTable({
    mediaId: v.string(),
    mediaType: v.string(),
    userId: v.string(),
    content: v.string(),
    parentId: v.optional(v.id("comments")),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_media", ["mediaId", "mediaType"])
    .index("by_parent", ["parentId"])
    .index("by_user", ["userId"]),

  commentLikes: defineTable({
    commentId: v.id("comments"),
    userId: v.string(),
    createdAt: v.number(),
  })
    .index("by_comment", ["commentId"])
    .index("by_user_comment", ["userId", "commentId"]),

  diary: defineTable({
    userId: v.string(),
    mediaId: v.string(),
    mediaType: v.string(),
    title: v.string(),
    posterPath: v.string(),
    rating: v.optional(v.number()),
    releaseYear: v.string(),
    watchedDate: v.number(),
    rewatch: v.boolean(),
    review: v.optional(v.string()),
    addedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_media", ["userId", "mediaId", "mediaType"])
    .index("by_user_watched", ["userId", "watchedDate"]),
});
