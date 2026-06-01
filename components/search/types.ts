import { TMDBMedia } from "@/lib/tmdb";

export interface SearchUserResult {
  _id: string;
  userId: string;
  username: string;
  name: string;
  bio?: string;
  image?: string;
  theme?: string;
  profilePrivacy: string;
  friendCount: number;
  friendshipStatus: string;
}

export type SearchType = "all" | "movie" | "tv" | "users";
