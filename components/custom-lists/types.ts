import { Id } from "@/convex/_generated/dataModel";

export interface ListCreator {
  userId: string;
  username: string;
  name: string;
  image?: string;
}

export interface CustomList {
  _id: Id<"customLists">;
  name: string;
  description?: string;
  createdById: string;
  createdAt: number;
  privacy: string;
  isCollaborative: boolean;
  isWatchlist?: boolean;
}

export interface CustomListItem {
  _id: Id<"customListItems">;
  listId: Id<"customLists">;
  mediaId: string;
  mediaType: string;
  title: string;
  posterPath: string;
  releaseYear: string;
  addedById: string;
  addedAt: number;
  addedByUser: {
    userId: string;
    username: string;
    name: string;
  } | null;
  watched?: boolean;
  watchedAt?: number;
  watchedById?: string;
  watchedByUser?: {
    userId: string;
    username: string;
    name: string;
  } | null;
  voteCount: number;
  userVote: number;
}

export interface CustomListComment {
  _id: Id<"customListComments">;
  listId: Id<"customLists">;
  userId: string;
  content: string;
  createdAt: number;
  author: {
    userId: string;
    name: string;
    username: string;
    image?: string;
  };
}

export interface ListDetailData {
  list: CustomList;
  creator: ListCreator | null;
  items: CustomListItem[];
  likeCount: number;
  isLiked: boolean;
  isFavorited: boolean;
  collaborators: ListCreator[];
  comments: CustomListComment[];
}
