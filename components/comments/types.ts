import { Id } from "@/convex/_generated/dataModel";

export type SortOption = "best" | "top" | "latest";

export interface CommentAuthor {
  name: string;
  username: string;
  image?: string;
  role?: string;
}

export interface CommentType {
  _id: Id<"comments">;
  mediaId: string;
  mediaType: string;
  userId: string;
  content: string;
  parentId?: Id<"comments">;
  createdAt: number;
  updatedAt?: number;
  author: CommentAuthor;
  likeCount: number;
  replyCount: number;
  isLiked: boolean;
  replies: CommentType[];
}
