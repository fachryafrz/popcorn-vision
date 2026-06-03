/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as activities from "../activities.js";
import type * as auth from "../auth.js";
import type * as chats from "../chats.js";
import type * as comments from "../comments.js";
import type * as continueWatching from "../continueWatching.js";
import type * as diary from "../diary.js";
import type * as favorites from "../favorites.js";
import type * as http from "../http.js";
import type * as ratings from "../ratings.js";
import type * as sharedWatchlists from "../sharedWatchlists.js";
import type * as social from "../social.js";
import type * as users from "../users.js";
import type * as watchlist from "../watchlist.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  activities: typeof activities;
  auth: typeof auth;
  chats: typeof chats;
  comments: typeof comments;
  continueWatching: typeof continueWatching;
  diary: typeof diary;
  favorites: typeof favorites;
  http: typeof http;
  ratings: typeof ratings;
  sharedWatchlists: typeof sharedWatchlists;
  social: typeof social;
  users: typeof users;
  watchlist: typeof watchlist;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  betterAuth: import("@convex-dev/better-auth/_generated/component.js").ComponentApi<"betterAuth">;
};
