export interface UserDoc {
  _id: string;
  userId: string;
  username: string;
  name: string;
  email: string;
  bio?: string;
  image?: string;
  theme?: string;
  country?: string;
  profilePrivacy?: string;
  allowFriendRequests?: boolean;
  hideWatchlist?: boolean;
  hideFavorites?: boolean;
  hideRatings?: boolean;
  hideDiary?: boolean;
  hideInsights?: boolean;
}

export interface DiaryItem {
  _id: string;
  mediaId: string;
  mediaType: string;
  title: string;
  posterPath: string;
  releaseYear: string;
  watchedDate: number;
  rewatch: boolean;
  rating?: number;
  review?: string;
  season?: number;
  episode?: number;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  addedAt?: number;
  _creationTime?: number;
  runtime?: number;
  genres?: string[];
  cast?: string[];
  directors?: string[];
  watchProviders?: string[];
}

export interface ProfileFriend {
  userId: string;
  username: string;
  name: string;
  image?: string;
}

export interface SocialProfile {
  user: UserDoc | { name: string; username: string; image?: string; bio?: string };
  friendCount: number;
  friends?: ProfileFriend[];
  friendshipStatus: string;
  isBlocked?: boolean;
  blockedByMe?: boolean;
  isDeactivated?: boolean;
}
