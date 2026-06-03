import { Id } from "@/convex/_generated/dataModel";

export interface Friend {
  userId: string;
  username: string;
  name: string;
  image?: string;
}

export interface ChatMessage {
  _id: Id<"messages">;
  _creationTime: number;
  chatId: Id<"chats">;
  senderId: string;
  senderName: string;
  senderImage?: string;
  content: string;
  attachmentUrl?: string;
  attachmentType?: string;
  sharedMediaId?: string;
  sharedMediaType?: string;
  sharedMediaTitle?: string;
  sharedMediaPoster?: string;
  sharedMediaRating?: number;
  sharedMediaYear?: string;
  createdAt: number;
  editedAt?: number;
}

export interface ChatItem {
  chatId: Id<"chats">;
  type: "private" | "group";
  name?: string;
  description?: string;
  image?: string;
  adminIds?: string[];
  friend?: {
    userId: string;
    username: string;
    name: string;
    image?: string;
  };
  unreadCount: number;
  lastMessage?: {
    content: string;
    createdAt: number;
  };
  isTyping?: boolean;
  typingName?: string;
  isMuted?: boolean;
}

export interface ChatMember {
  userId: string;
  username: string;
  name: string;
  image?: string;
  lastReadAt?: number;
}
