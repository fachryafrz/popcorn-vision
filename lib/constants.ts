export const TMDB_SESSION_ID = "tmdb.session_id";
export const TMDB_AUTH_TOKEN = "tmdb.auth_token";
export const POPCORN = "/logo/popcorn.png";
export const POPCORN_APPLE = "/favicon/apple-touch-icon.png";
export const SAD_POPCORN = "/logo/sad_popcorn.png";
export const SAD_POPCORN_ENGINEER = "/logo/sad_popcorn_engineer.png";
export const USER_LOCATION = "user-location";
export const AND_SEPARATION = "AND";
export const OR_SEPARATION = "OR";
export const DISCLAIMER_READ = "disclaimer-read";

export const QUERY_PARAMS = {
  QUICK_VIEW: "quick-view",
  PERSON: "person",
  AUTH: "auth",
} as const;

export const STORAGE_KEYS = {
  PUSH_ENDPOINT: "push-subscription-endpoint",
  LEGACY_PUSH_ENDPOINT: "push_subscription_endpoint",
  DISMISSED_PUSH_PROMPT: "dismissed-push-prompt",
  LEGACY_DISMISSED_PUSH_PROMPT: "dismissed_push_prompt",
  DISCLAIMER_ACCEPTED: "popcorn-vision-disclaimer-accepted",
  ACTIVE_CHAT_ID: "active-chat-id",
  LEGACY_ACTIVE_CHAT_ID: "active_chat_id",
  TRENDING_TAB: "trending-tab",
  LEGACY_TRENDING_TAB: "trending_tab",
  STREAMING_PROV: "streaming-prov",
  LEGACY_STREAMING_PROV: "streaming_prov",
  GENRE_NAME: "genre-name",
  LEGACY_GENRE_NAME: "genre_name",
  HERO_ACTIVE_INDEX: "hero-active-index",
  LEGACY_HERO_ACTIVE_INDEX: "hero_active_index",
} as const;
