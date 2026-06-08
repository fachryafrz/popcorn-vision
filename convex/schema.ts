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
    hideDiary: v.optional(v.boolean()),
    hideInsights: v.optional(v.boolean()),
    status: v.optional(v.string()), // "active" | "deleted" | "closed"
    messagePrivacy: v.optional(v.string()), // "friends" | "disabled"
    readReceiptsEnabled: v.optional(v.boolean()), // true = visible, false = hidden
  })
    .index("by_username", ["username"])
    .index("by_userId", ["userId"]),

  watchlist: defineTable({
    userId: v.string(), // Better Auth user ID
    mediaId: v.string(), // TMDB media ID
    mediaType: v.string(), // "movie" or "tv"
    title: v.string(),
    posterPath: v.string(),
    rating: v.optional(v.number()),
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
    rating: v.optional(v.number()),
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
    messageId: v.optional(v.id("messages")),
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
    season: v.optional(v.number()),
    episode: v.optional(v.number()),
    numberOfSeasons: v.optional(v.number()),
    numberOfEpisodes: v.optional(v.number()),
    addedAt: v.number(),
    runtime: v.optional(v.number()),
    genres: v.optional(v.array(v.string())),
    cast: v.optional(v.array(v.string())),
    directors: v.optional(v.array(v.string())),
    watchProviders: v.optional(v.array(v.string())),
  })
    .index("by_user", ["userId"])
    .index("by_user_media", ["userId", "mediaId", "mediaType"])
    .index("by_user_watched", ["userId", "watchedDate"]),

  chats: defineTable({
    type: v.string(), // "private" | "group"
    name: v.optional(v.string()), // group chat name
    image: v.optional(v.string()), // group avatar
    description: v.optional(v.string()), // group description
    adminIds: v.optional(v.array(v.string())), // userIds of admins
    createdById: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_updatedAt", ["updatedAt"]),

  chatMemberships: defineTable({
    chatId: v.id("chats"),
    userId: v.string(),
    joinedAt: v.number(),
    lastReadAt: v.optional(v.number()),
    typingUntil: v.optional(v.number()),
    isMuted: v.optional(v.boolean()),
    deletedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_chat", ["chatId"])
    .index("by_chat_user", ["chatId", "userId"]),

  messages: defineTable({
    chatId: v.id("chats"),
    senderId: v.string(),
    content: v.string(),
    createdAt: v.number(),
    editedAt: v.optional(v.number()),
    attachmentUrl: v.optional(v.string()),
    attachmentType: v.optional(v.string()), // "image" | "gif" | "media" | "list"
    sharedMediaId: v.optional(v.string()),
    sharedMediaType: v.optional(v.string()),
    sharedMediaTitle: v.optional(v.string()),
    sharedMediaPoster: v.optional(v.string()),
    sharedMediaRating: v.optional(v.number()),
    sharedMediaYear: v.optional(v.string()),
    sharedListId: v.optional(v.string()),
    sharedListName: v.optional(v.string()),
  })
    .index("by_chat", ["chatId"])
    .index("by_chat_created", ["chatId", "createdAt"]),

  chatReports: defineTable({
    reporterId: v.string(),
    reportedUserId: v.string(),
    reason: v.string(),
    createdAt: v.number(),
  }).index("by_reported", ["reportedUserId"]),

  continueWatching: defineTable({
    userId: v.string(),
    mediaId: v.string(),
    mediaType: v.string(),
    title: v.string(),
    posterPath: v.string(),
    season: v.optional(v.number()),
    episode: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_media", ["userId", "mediaId", "mediaType"])
    .index("by_user_updated", ["userId", "updatedAt"]),

  activities: defineTable({
    userId: v.string(),
    type: v.string(), // "rate" | "watchlist" | "favorite" | "review" | "completed_season"
    mediaId: v.string(),
    mediaType: v.string(),
    title: v.string(),
    posterPath: v.string(),
    rating: v.optional(v.number()),
    review: v.optional(v.string()),
    season: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_createdAt", ["createdAt"])
    .index("by_type_createdAt", ["type", "createdAt"]),

  activityLikes: defineTable({
    activityId: v.id("activities"),
    userId: v.string(),
    createdAt: v.number(),
  })
    .index("by_activity", ["activityId"])
    .index("by_user_activity", ["userId", "activityId"]),

  activityComments: defineTable({
    activityId: v.id("activities"),
    userId: v.string(),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_activity", ["activityId"])
    .index("by_user", ["userId"]),

  customLists: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    createdById: v.string(),
    createdAt: v.number(),
    privacy: v.string(), // "public" | "private"
    isCollaborative: v.boolean(),
    isWatchlist: v.optional(v.boolean()),
  })
    .index("by_creator", ["createdById"])
    .index("by_privacy", ["privacy"]),

  customListItems: defineTable({
    listId: v.id("customLists"),
    mediaId: v.string(),
    mediaType: v.string(),
    title: v.string(),
    posterPath: v.string(),
    releaseYear: v.string(),
    addedById: v.string(),
    addedAt: v.number(),
    watched: v.optional(v.boolean()),
    watchedAt: v.optional(v.number()),
    watchedById: v.optional(v.string()),
  })
    .index("by_list", ["listId"])
    .index("by_list_media", ["listId", "mediaId", "mediaType"]),

  customListCollaborators: defineTable({
    listId: v.id("customLists"),
    userId: v.string(),
    joinedAt: v.number(),
  })
    .index("by_list", ["listId"])
    .index("by_user", ["userId"])
    .index("by_list_user", ["listId", "userId"]),

  customListLikes: defineTable({
    listId: v.id("customLists"),
    userId: v.string(),
    createdAt: v.number(),
  })
    .index("by_list", ["listId"])
    .index("by_user_list", ["userId", "listId"]),

  customListComments: defineTable({
    listId: v.id("customLists"),
    userId: v.string(),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_list", ["listId"])
    .index("by_user", ["userId"]),

  customListFavorites: defineTable({
    listId: v.id("customLists"),
    userId: v.string(),
    savedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_list_user", ["listId", "userId"]),

  customListItemVotes: defineTable({
    listId: v.id("customLists"),
    mediaId: v.string(),
    mediaType: v.string(),
    userId: v.string(),
    vote: v.number(), // 1 for upvote
    updatedAt: v.number(),
  })
    .index("by_list", ["listId"])
    .index("by_list_user", ["listId", "userId"])
    .index("by_item", ["listId", "mediaId", "mediaType"])
    .index("by_item_user", ["listId", "mediaId", "mediaType", "userId"]),

  exchangeRates: defineTable({
    base: v.string(), // "USD"
    rates: v.record(v.string(), v.number()), // e.g. { IDR: 16200, JPY: 155, ... }
    updatedAt: v.number(), // timestamp of last update
  }).index("by_base", ["base"]),
});
