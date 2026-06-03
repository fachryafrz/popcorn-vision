import { mutation, query, MutationCtx, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

// Helper: Authenticate current user
async function getAuthedUser(ctx: QueryCtx | MutationCtx) {
  const user = await authComponent.getAuthUser(ctx);
  if (!user) throw new Error("Unauthorized");
  return user._id;
}

// Helper: Verify if two users are friends (status: "friends") and neither has blocked the other
async function verifyFriendshipAndBlocks(ctx: QueryCtx | MutationCtx, userA: string, userB: string) {
  if (userA === userB) return false;

  // 1. Check blocks
  const block1 = await ctx.db
    .query("blocks")
    .withIndex("by_both", (q) => q.eq("blockerId", userA).eq("blockedId", userB))
    .first();
  const block2 = await ctx.db
    .query("blocks")
    .withIndex("by_both", (q) => q.eq("blockerId", userB).eq("blockedId", userA))
    .first();

  if (block1 || block2) return false;

  // 2. Check friendships
  const u1 = userA < userB ? userA : userB;
  const u2 = userA < userB ? userB : userA;

  const friendship = await ctx.db
    .query("friendships")
    .withIndex("by_users", (q) => q.eq("userId1", u1).eq("userId2", u2))
    .first();

  return friendship !== null && friendship.status === "friends";
}

// Helper: Check target user's messaging privacy settings
async function allowsDirectMessageFrom(
  ctx: QueryCtx | MutationCtx,
  senderId: string,
  receiverId: string
) {
  const receiverProfile = await ctx.db
    .query("users")
    .withIndex("by_userId", (q) => q.eq("userId", receiverId))
    .first();

  if (!receiverProfile || receiverProfile.status === "deleted" || receiverProfile.status === "closed") {
    return false;
  }

  const privacy = receiverProfile.messagePrivacy || "friends";

  if (privacy === "friends") {
    return await verifyFriendshipAndBlocks(ctx, senderId, receiverId);
  }

  return false;
}

// ----------------------------------------------------
// MUTATIONS
// ----------------------------------------------------

// Create or retrieve a DM private chat session with a friend
export const createOrGetPrivateChat = mutation({
  args: { friendUserId: v.string() },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthedUser(ctx);
    const friendUserId = args.friendUserId;

    // 1. Enforce friends safety
    const isFriend = await verifyFriendshipAndBlocks(ctx, currentUserId, friendUserId);
    if (!isFriend) {
      throw new Error("You can only start chats with approved friends who have not blocked you");
    }

    // 2. Enforce messaging privacy settings
    const isAllowed = await allowsDirectMessageFrom(ctx, currentUserId, friendUserId);
    if (!isAllowed) {
      throw new Error("This user has restricted their direct messaging privacy settings");
    }

    // 3. Look up existing private chat between these two users
    const myMemberships = await ctx.db
      .query("chatMemberships")
      .withIndex("by_user", (q) => q.eq("userId", currentUserId))
      .collect();

    for (const mem of myMemberships) {
      const chat = await ctx.db.get(mem.chatId);
      if (chat && chat.type === "private") {
        const otherMem = await ctx.db
          .query("chatMemberships")
          .withIndex("by_chat_user", (q) => q.eq("chatId", chat._id).eq("userId", friendUserId))
          .first();

        if (otherMem) {
          return chat._id;
        }
      }
    }

    // 4. Create new private chat
    const chatId = await ctx.db.insert("chats", {
      type: "private",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create memberships
    await ctx.db.insert("chatMemberships", {
      chatId,
      userId: currentUserId,
      joinedAt: Date.now(),
      lastReadAt: Date.now(),
    });

    await ctx.db.insert("chatMemberships", {
      chatId,
      userId: friendUserId,
      joinedAt: Date.now(),
      lastReadAt: Date.now(),
    });

    return chatId;
  },
});

// Create a new group chat
export const createGroupChat = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    invitedUserIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthedUser(ctx);

    const cleanGroupName = args.name.trim();
    if (!cleanGroupName) throw new Error("Group name cannot be empty");

    // Enforce friendship status for all invited members
    for (const inviteeId of args.invitedUserIds) {
      const isFriend = await verifyFriendshipAndBlocks(ctx, currentUserId, inviteeId);
      if (!isFriend) {
        throw new Error("You can only invite approved friends to group chats");
      }
    }

    // Create group chat session
    const chatId = await ctx.db.insert("chats", {
      type: "group",
      name: cleanGroupName,
      description: args.description?.trim(),
      image: args.image,
      adminIds: [currentUserId],
      createdById: currentUserId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create membership for creator
    await ctx.db.insert("chatMemberships", {
      chatId,
      userId: currentUserId,
      joinedAt: Date.now(),
      lastReadAt: Date.now(),
    });

    // Create memberships for all invited friends
    for (const inviteeId of args.invitedUserIds) {
      await ctx.db.insert("chatMemberships", {
        chatId,
        userId: inviteeId,
        joinedAt: Date.now(),
        lastReadAt: Date.now(),
      });
    }

    return chatId;
  },
});

// Update group details
export const updateGroupChatDetails = mutation({
  args: {
    chatId: v.id("chats"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthedUser(ctx);
    const chat = await ctx.db.get(args.chatId);

    if (!chat || chat.type !== "group") throw new Error("Group chat not found");

    // Verify membership
    const membership = await ctx.db
      .query("chatMemberships")
      .withIndex("by_chat_user", (q) => q.eq("chatId", args.chatId).eq("userId", currentUserId))
      .first();

    if (!membership) throw new Error("Not a member of this group");

    // Enforce that only admins can update details
    const isAdmin = chat.adminIds?.includes(currentUserId);
    if (!isAdmin) throw new Error("Only group admins can modify group details");

    const patchData: { name?: string; description?: string; image?: string } = {};
    if (args.name !== undefined) {
      const cleanName = args.name.trim();
      if (!cleanName) throw new Error("Group name cannot be empty");
      patchData.name = cleanName;
    }
    if (args.description !== undefined) {
      patchData.description = args.description.trim();
    }
    if (args.image !== undefined) {
      patchData.image = args.image;
    }

    await ctx.db.patch(args.chatId, patchData);
    return args.chatId;
  },
});

// Invite friends to existing group chat
export const inviteToGroupChat = mutation({
  args: {
    chatId: v.id("chats"),
    userIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthedUser(ctx);
    const chat = await ctx.db.get(args.chatId);

    if (!chat || chat.type !== "group") throw new Error("Group chat not found");

    // Verify current user is in the group
    const myMem = await ctx.db
      .query("chatMemberships")
      .withIndex("by_chat_user", (q) => q.eq("chatId", args.chatId).eq("userId", currentUserId))
      .first();

    if (!myMem) throw new Error("You must be a member to invite others");

    for (const userId of args.userIds) {
      // 1. Verify friendship
      const isFriend = await verifyFriendshipAndBlocks(ctx, currentUserId, userId);
      if (!isFriend) throw new Error("You can only invite approved friends");

      // 2. Check if already a member
      const existing = await ctx.db
        .query("chatMemberships")
        .withIndex("by_chat_user", (q) => q.eq("chatId", args.chatId).eq("userId", userId))
        .first();

      if (!existing) {
        await ctx.db.insert("chatMemberships", {
          chatId: args.chatId,
          userId,
          joinedAt: Date.now(),
          lastReadAt: Date.now(),
        });
      }
    }

    return args.chatId;
  },
});

// Leave group chat session
export const leaveGroupChat = mutation({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthedUser(ctx);
    const chat = await ctx.db.get(args.chatId);

    if (!chat || chat.type !== "group") throw new Error("Group chat not found");

    const membership = await ctx.db
      .query("chatMemberships")
      .withIndex("by_chat_user", (q) => q.eq("chatId", args.chatId).eq("userId", currentUserId))
      .first();

    if (!membership) throw new Error("You are not a member of this group");

    // Remove membership
    await ctx.db.delete(membership._id);

    // Fetch remaining memberships
    const remainingMems = await ctx.db
      .query("chatMemberships")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .collect();

    if (remainingMems.length === 0) {
      // Clean up orphaned group chat and messages
      const msgs = await ctx.db
        .query("messages")
        .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
        .collect();

      for (const msg of msgs) {
        await ctx.db.delete(msg._id);
      }

      await ctx.db.delete(args.chatId);
      return { success: true, deleted: true };
    }

    // Re-verify admin listings
    const currentAdmins = chat.adminIds || [];
    if (currentAdmins.includes(currentUserId)) {
      const remainingAdmins = currentAdmins.filter((id) => id !== currentUserId);

      if (remainingAdmins.length === 0 && remainingMems.length > 0) {
        // Designate first remaining member as admin
        const nextAdminId = remainingMems[0].userId;
        await ctx.db.patch(args.chatId, {
          adminIds: [nextAdminId],
        });
      } else {
        await ctx.db.patch(args.chatId, {
          adminIds: remainingAdmins,
        });
      }
    }

    return { success: true, deleted: false };
  },
});

// Send message to private or group chat
export const sendMessage = mutation({
  args: {
    chatId: v.id("chats"),
    content: v.string(),
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
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthedUser(ctx);
    const chat = await ctx.db.get(args.chatId);

    if (!chat) throw new Error("Conversation session not found");

    // Verify sender membership in chat
    const myMem = await ctx.db
      .query("chatMemberships")
      .withIndex("by_chat_user", (q) => q.eq("chatId", args.chatId).eq("userId", currentUserId))
      .first();

    if (!myMem) throw new Error("You must be a member to send messages");

    // Direct message checks
    if (chat.type === "private") {
      const otherMem = await ctx.db
        .query("chatMemberships")
        .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
        .collect();

      const friendMembership = otherMem.find((m) => m.userId !== currentUserId);
      if (friendMembership) {
        // 1. Verify blocks & friendship
        const isFriend = await verifyFriendshipAndBlocks(
          ctx,
          currentUserId,
          friendMembership.userId
        );
        if (!isFriend) {
          throw new Error("You can only message active friends who have not blocked you");
        }

        // 2. Verify messaging settings
        const isDMAllowed = await allowsDirectMessageFrom(
          ctx,
          currentUserId,
          friendMembership.userId
        );
        if (!isDMAllowed) {
          throw new Error("This user's messaging privacy settings do not allow direct messages");
        }
      }
    }

    // Insert message record
    const messageId = await ctx.db.insert("messages", {
      chatId: args.chatId,
      senderId: currentUserId,
      content: args.content,
      createdAt: Date.now(),
      attachmentUrl: args.attachmentUrl,
      attachmentType: args.attachmentType,
      sharedMediaId: args.sharedMediaId,
      sharedMediaType: args.sharedMediaType,
      sharedMediaTitle: args.sharedMediaTitle,
      sharedMediaPoster: args.sharedMediaPoster,
      sharedMediaRating: args.sharedMediaRating,
      sharedMediaYear: args.sharedMediaYear,
      sharedListId: args.sharedListId,
      sharedListName: args.sharedListName,
    });

    // Update last activity timestamp on chat root
    await ctx.db.patch(args.chatId, {
      updatedAt: Date.now(),
    });

    // Update sender's read receipt instantly
    await ctx.db.patch(myMem._id, {
      lastReadAt: Date.now(),
    });

    // Create notifications for all other members in the conversation session
    const otherMembers = await ctx.db
      .query("chatMemberships")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .collect();

    for (const mem of otherMembers) {
      if (mem.userId !== currentUserId) {
        await ctx.db.insert("notifications", {
          userId: mem.userId,
          senderId: currentUserId,
          type: "chat_message",
          read: false,
          createdAt: Date.now(),
          mediaId: args.chatId,
          mediaType: "chat",
        });
      }
    }

    return messageId;
  },
});

// Update read receipts
export const setReadReceipt = mutation({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthedUser(ctx);

    const membership = await ctx.db
      .query("chatMemberships")
      .withIndex("by_chat_user", (q) => q.eq("chatId", args.chatId).eq("userId", currentUserId))
      .first();

    if (!membership) throw new Error("Membership not found");

    await ctx.db.patch(membership._id, {
      lastReadAt: Date.now(),
    });

    // Mark chat_message notifications for this chat as read
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_unread", (q) => q.eq("userId", currentUserId).eq("read", false))
      .collect();

    for (const notif of notifications) {
      if (notif.type === "chat_message" && notif.mediaId === args.chatId) {
        await ctx.db.patch(notif._id, { read: true });
      }
    }
  },
});

// Toggle chat muting status
export const toggleMuteChat = mutation({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthedUser(ctx);

    const membership = await ctx.db
      .query("chatMemberships")
      .withIndex("by_chat_user", (q) => q.eq("chatId", args.chatId).eq("userId", currentUserId))
      .first();

    if (!membership) throw new Error("Membership not found");

    const newMuteStatus = !membership.isMuted;
    await ctx.db.patch(membership._id, {
      isMuted: newMuteStatus,
    });

    return newMuteStatus;
  },
});

// Manage typing state
export const setTypingStatus = mutation({
  args: {
    chatId: v.id("chats"),
    isTyping: v.boolean(),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthedUser(ctx);

    const membership = await ctx.db
      .query("chatMemberships")
      .withIndex("by_chat_user", (q) => q.eq("chatId", args.chatId).eq("userId", currentUserId))
      .first();

    if (!membership) throw new Error("Membership not found");

    await ctx.db.patch(membership._id, {
      typingUntil: args.isTyping ? Date.now() + 3500 : undefined,
    });
  },
});

// Submit a chat safety report on a user
export const reportUser = mutation({
  args: {
    reportedUserId: v.string(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthedUser(ctx);

    if (currentUserId === args.reportedUserId) {
      throw new Error("You cannot report yourself");
    }

    const reportId = await ctx.db.insert("chatReports", {
      reporterId: currentUserId,
      reportedUserId: args.reportedUserId,
      reason: args.reason.trim(),
      createdAt: Date.now(),
    });

    return reportId;
  },
});

// ----------------------------------------------------
// READ QUERIES
// ----------------------------------------------------

// Fetch conversations of current user with latest details
export const getChatsList = query({
  args: {},
  handler: async (ctx) => {
    let currentUserId: string | null = null;
    try {
      currentUserId = await getAuthedUser(ctx);
    } catch {
      return [];
    }

    // 1. Fetch all memberships for this user
    const memberships = await ctx.db
      .query("chatMemberships")
      .withIndex("by_user", (q) => q.eq("userId", currentUserId!))
      .collect();

    const results = [];
    for (const mem of memberships) {
      const chat = await ctx.db.get(mem.chatId);
      if (!chat) continue;

      // Fetch last message sent in this chat
      const messages = await ctx.db
        .query("messages")
        .withIndex("by_chat_created", (q) => q.eq("chatId", chat._id))
        .order("desc")
        .first();

      // Count unread messages (messages created after user's lastReadAt)
      let unreadCount = 0;
      if (mem.lastReadAt) {
        const newerMessages = await ctx.db
          .query("messages")
          .withIndex("by_chat_created", (q) => q.eq("chatId", chat._id).gt("createdAt", mem.lastReadAt!))
          .collect();
        unreadCount = newerMessages.length;
      } else {
        const allMsgs = await ctx.db
          .query("messages")
          .withIndex("by_chat", (q) => q.eq("chatId", chat._id))
          .collect();
        unreadCount = allMsgs.length;
      }

      // Handle Private (Direct Message) detail retrieval
      if (chat.type === "private") {
        const otherMembers = await ctx.db
          .query("chatMemberships")
          .withIndex("by_chat", (q) => q.eq("chatId", chat._id))
          .collect();

        const partnerMem = otherMembers.find((m) => m.userId !== currentUserId);
        if (!partnerMem) continue;

        const partnerProfile = await ctx.db
          .query("users")
          .withIndex("by_userId", (q) => q.eq("userId", partnerMem.userId))
          .first();

        if (partnerProfile) {
          const isTyping = partnerMem.typingUntil ? partnerMem.typingUntil > Date.now() : false;
          results.push({
            chatId: chat._id,
            type: "private" as const,
            updatedAt: chat.updatedAt,
            isMuted: !!mem.isMuted,
            unreadCount,
            isTyping,
            typingName: isTyping ? partnerProfile.name : undefined,
            lastMessage: messages
              ? {
                  senderId: messages.senderId,
                  content: messages.content,
                  createdAt: messages.createdAt,
                }
              : null,
            friend: {
              userId: partnerProfile.userId,
              name: partnerProfile.name,
              username: partnerProfile.username,
              image: partnerProfile.image,
            },
          });
        }
      } else if (chat.type === "group") {
        // Handle Group Details
        const otherMembers = await ctx.db
          .query("chatMemberships")
          .withIndex("by_chat", (q) => q.eq("chatId", chat._id))
          .collect();

        const typingMember = otherMembers.find(
          (m) => m.userId !== currentUserId && m.typingUntil && m.typingUntil > Date.now()
        );

        let typingName: string | undefined = undefined;
        if (typingMember) {
          const u = await ctx.db
            .query("users")
            .withIndex("by_userId", (q) => q.eq("userId", typingMember.userId))
            .first();
          typingName = u?.name;
        }

        results.push({
          chatId: chat._id,
          type: "group" as const,
          name: chat.name || "Unnamed Group",
          image: chat.image,
          description: chat.description,
          adminIds: chat.adminIds || [],
          createdById: chat.createdById || "",
          updatedAt: chat.updatedAt,
          isMuted: !!mem.isMuted,
          unreadCount,
          isTyping: !!typingMember,
          typingName,
          lastMessage: messages
              ? {
                  senderId: messages.senderId,
                  content: messages.content,
                  createdAt: messages.createdAt,
                }
              : null,
        });
      }
    }

    // Sort by most recently active
    return results.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

// Fetch all historical messages for a chat session
export const getChatMessages = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthedUser(ctx);

    // Verify user is in the chat
    const membership = await ctx.db
      .query("chatMemberships")
      .withIndex("by_chat_user", (q) => q.eq("chatId", args.chatId).eq("userId", currentUserId))
      .first();

    if (!membership) throw new Error("Access denied: Not a member of this chat");

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat_created", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();

    // Map sender info for displaying name and avatar with messages
    const mapped = [];
    for (const msg of messages) {
      const sender = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", msg.senderId))
        .first();

      mapped.push({
        _id: msg._id,
        chatId: msg.chatId,
        senderId: msg.senderId,
        senderName: sender?.name || "Unknown",
        senderUsername: sender?.username || "unknown",
        senderImage: sender?.image,
        content: msg.content,
        createdAt: msg.createdAt,
        editedAt: msg.editedAt,
        attachmentUrl: msg.attachmentUrl,
        attachmentType: msg.attachmentType,
        sharedMediaId: msg.sharedMediaId,
        sharedMediaType: msg.sharedMediaType,
        sharedMediaTitle: msg.sharedMediaTitle,
        sharedMediaPoster: msg.sharedMediaPoster,
        sharedMediaRating: msg.sharedMediaRating,
        sharedMediaYear: msg.sharedMediaYear,
        sharedListId: msg.sharedListId,
        sharedListName: msg.sharedListName,
      });
    }

    return mapped;
  },
});

// Retrieve details about members in group or DM
export const getChatMembers = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthedUser(ctx);

    const membership = await ctx.db
      .query("chatMemberships")
      .withIndex("by_chat_user", (q) => q.eq("chatId", args.chatId).eq("userId", currentUserId))
      .first();

    if (!membership) throw new Error("Access denied");

    const memberships = await ctx.db
      .query("chatMemberships")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .collect();

    const members = [];
    for (const mem of memberships) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", mem.userId))
        .first();

      if (user) {
        members.push({
          userId: user.userId,
          name: user.name,
          username: user.username,
          image: user.image,
          joinedAt: mem.joinedAt,
          lastReadAt: mem.lastReadAt,
        });
      }
    }

    return members;
  },
});

// Query currently active typing users in a chat session
export const getTypingUsers = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    let currentUserId: string | null = null;
    try {
      currentUserId = await getAuthedUser(ctx);
    } catch {
      return [];
    }

    const typingMemberships = await ctx.db
      .query("chatMemberships")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .collect();

    const typingUsers = [];
    for (const mem of typingMemberships) {
      if (mem.userId !== currentUserId && mem.typingUntil && mem.typingUntil > Date.now()) {
        const u = await ctx.db
          .query("users")
          .withIndex("by_userId", (q) => q.eq("userId", mem.userId))
          .first();
        if (u) {
          typingUsers.push(u.name);
        }
      }
    }

    return typingUsers;
  },
});

// Edit an existing message
export const editMessage = mutation({
  args: {
    messageId: v.id("messages"),
    newContent: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthedUser(ctx);

    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("Message not found");

    if (message.senderId !== currentUserId) {
      throw new Error("You can only edit your own messages");
    }

    // Verify membership in the chat to prevent editing in rooms the user was removed from
    const membership = await ctx.db
      .query("chatMemberships")
      .withIndex("by_chat_user", (q) => q.eq("chatId", message.chatId).eq("userId", currentUserId))
      .first();

    if (!membership) throw new Error("You are not a member of this chat");

    await ctx.db.patch(args.messageId, {
      content: args.newContent,
      editedAt: Date.now(),
    });
  },
});

// Delete an existing message
export const deleteMessage = mutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthedUser(ctx);

    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("Message not found");

    if (message.senderId !== currentUserId) {
      throw new Error("You can only delete your own messages");
    }

    // Verify membership in the chat to prevent deleting in rooms the user was removed from
    const membership = await ctx.db
      .query("chatMemberships")
      .withIndex("by_chat_user", (q) => q.eq("chatId", message.chatId).eq("userId", currentUserId))
      .first();

    if (!membership) throw new Error("You are not a member of this chat");

    await ctx.db.delete(args.messageId);
  },
});

// Delete the entire chat session (including memberships and messages)
export const deleteChat = mutation({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthedUser(ctx);
    const chat = await ctx.db.get(args.chatId);

    if (!chat) throw new Error("Chat not found");

    // Verify membership in the chat
    const membership = await ctx.db
      .query("chatMemberships")
      .withIndex("by_chat_user", (q) => q.eq("chatId", args.chatId).eq("userId", currentUserId))
      .first();

    if (!membership) throw new Error("Access denied: Not a member of this chat");

    // If it's a group, only admins can delete the entire group chat, otherwise they just leave it.
    if (chat.type === "group") {
      const isAdmin = chat.adminIds?.includes(currentUserId);
      if (!isAdmin) {
        throw new Error("Only group admins can delete the group chat session");
      }
    }

    // Delete all messages
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .collect();

    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }

    // Delete all memberships
    const memberships = await ctx.db
      .query("chatMemberships")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .collect();

    for (const mem of memberships) {
      await ctx.db.delete(mem._id);
    }

    // Delete the chat itself
    await ctx.db.delete(args.chatId);

    return { success: true };
  },
});

