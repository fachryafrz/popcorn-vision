export interface ConvexProfile {
  name: string;
  username: string;
  bio?: string;
  country?: string;
  image?: string;
  profilePrivacy?: string;
  allowFriendRequests?: boolean;
  hideWatchlist?: boolean;
  hideFavorites?: boolean;
  hideRatings?: boolean;
  messagePrivacy?: string;
  readReceiptsEnabled?: boolean;
}

export interface User {
  name?: string;
  username?: string | null;
  email?: string;
  image?: string | null;
}

export interface BlockedUser {
  userId: string;
  name: string;
  username: string;
  image?: string;
}
