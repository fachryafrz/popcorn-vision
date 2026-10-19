# Product Requirements Document (PRD) — Popcorn Vision

**Status:** Living Documentation (Derived from Codebase Audit v2.12.5)  
**Repository:** [popcorn-vision](file:///f:/Projects/popcorn-vision)

---

## 1. Product Purpose & Target Audience

### 1.1 Purpose

Popcorn Vision is a modern, responsive web application for movie and TV show discovery, personal media tracking, viewing diaries, ratings, and social interactions. It allows entertainment enthusiasts to explore global catalogs, track viewing progress down to seasons and episodes, share recommendations, and communicate in real time with friends.

### 1.2 Target User Personas

1. **Casual Streamer / Guest:** Wants to quickly discover trending movies and TV series, view trailers, check streaming provider availability (e.g., Netflix, HBO, Disney+, Prime), and track continue-watching or watchlist items locally without mandatory account creation.
2. **Dedicated Cinephile / Logger:** Requires granular watch diary logging with custom watch dates, rewatch counters, 1-to-10 ratings, custom reviews, runtime tracking, and easy migration of watch history from Letterboxd or IMDb CSV exports.
3. **List Curator & Collaborator:** Creates public or private themed lists, invites friends to collaborate, and participates in community voting and comments.
4. **Social Viewer:** Follows friends' watch activity, shares titles directly via 1-on-1 or group chats, and receives real-time notifications for interactions.

---

## 2. Implemented Feature Modules (Verified Facts)

### 2.1 Media Discovery & Catalog Integration (TMDB)

- **Feeds & Curated Shelves:** Trending (Day/Week), Popular, Top Rated, and Upcoming movies/series with dynamic hero backdrop and trailer modals.
- **Provider-Filtered Feeds:** Streaming original spotlights categorized by major platforms ([lib/streamingProviderList.js](file:///f:/Projects/popcorn-vision/lib/streamingProviderList.js)).
- **Media Details:** Full synopsis, director/cast credits, high-resolution logos/posters, official YouTube trailers/videos, budget/revenue (converted to user currency), content ratings, and recommendations ([components/media-detail-client.tsx](file:///f:/Projects/popcorn-vision/components/media-detail-client.tsx)).
- **Person & Production Company Profiles:** Filmographies, biographies, credits, and company catalogs ([components/person-detail-client.tsx](file:///f:/Projects/popcorn-vision/components/person-detail-client.tsx), [components/company-detail-client.tsx](file:///f:/Projects/popcorn-vision/components/company-detail-client.tsx)).
- **Advanced Multi-Filter Search:** Filter by genres, release year range, runtime, watch region/provider, cast, crew, keywords, and minimum/maximum user ratings ([components/search-client.tsx](file:///f:/Projects/popcorn-vision/components/search-client.tsx)).
- **Global Search Overlay:** Keyboard-accessible modal triggered via `Cmd+K` / `Ctrl+K` ([components/search-overlay.tsx](file:///f:/Projects/popcorn-vision/components/search-overlay.tsx)).

### 2.2 Collections, Ratings & Continue Watching

- **Watchlist & Favorites:** One-click toggle per media item. Synchronized with Convex for authenticated users and cached in `localStorage` for guests ([convex/watchlist.ts](file:///f:/Projects/popcorn-vision/convex/watchlist.ts), [convex/favorites.ts](file:///f:/Projects/popcorn-vision/convex/favorites.ts), [lib/guest-watchlist.ts](file:///f:/Projects/popcorn-vision/lib/guest-watchlist.ts)).
- **10-Star Rating System:** Granular rating input (1 to 10 scale). Calculates community average scores and stores individual user scores ([convex/ratings.ts](file:///f:/Projects/popcorn-vision/convex/ratings.ts)).
- **Continue Watching Tracker:** Tracks TV progress per season and episode with resume shortcuts ([convex/continueWatching.ts](file:///f:/Projects/popcorn-vision/convex/continueWatching.ts), [lib/guest-watch.ts](file:///f:/Projects/popcorn-vision/lib/guest-watch.ts)).

### 2.3 Viewing Diary & Review Logging

- **Detailed Diary Entries:** Log watched date, rewatch toggle, written review text, runtime, genres, cast, directors, and streaming provider used ([convex/diary.ts](file:///f:/Projects/popcorn-vision/convex/diary.ts)).
- **Granular Log Scope:** Supports logging a movie, an entire TV show, an individual season, or a single standalone episode ([components/log-watch-modal.tsx](file:///f:/Projects/popcorn-vision/components/log-watch-modal.tsx)).
- **Profile Insights:** Visual analytics and viewing statistics computed over logged diary history ([components/profile/insights-tab.tsx](file:///f:/Projects/popcorn-vision/components/profile/insights-tab.tsx)).

### 2.4 Curated & Collaborative Custom Lists

- **List Administration:** Create public or private lists, customize titles and descriptions, invite collaborators, and toggle collaborative editing ([convex/customLists.ts](file:///f:/Projects/popcorn-vision/convex/customLists.ts)).
- **List Community Interactions:** Upvote items within a list, leave comments, favorite/save lists, and like lists ([convex/schema.ts](file:///f:/Projects/popcorn-vision/convex/schema.ts#L268-L344)).

### 2.5 Social Activity Feed & Friendship Graph

- **Activity Streams:** Real-time stream of friend activities including ratings, reviews, watchlist additions, and season completions ([convex/activities.ts](file:///f:/Projects/popcorn-vision/convex/activities.ts)).
- **Social Graph & Privacy:** Bi-directional friendship system (`pending_1_to_2`, `pending_2_to_1`, `friends`), user blocking, and profile privacy levels (`public`, `friends`, `private`) ([convex/social.ts](file:///f:/Projects/popcorn-vision/convex/social.ts)).
- **Interactive Discussions:** Threaded comment replies on media items and social feed posts ([convex/comments.ts](file:///f:/Projects/popcorn-vision/convex/comments.ts)).

### 2.6 Real-Time Messaging / Chat System

- **Conversation Types:** 1-on-1 direct messages between friends and multi-member group chats ([convex/chats.ts](file:///f:/Projects/popcorn-vision/convex/chats.ts), [app/(chat)/chat/page.tsx](<file:///f:/Projects/popcorn-vision/app/(chat)/chat/page.tsx>)).
- **Rich Media Cards:** Direct attachment and embedding of movie, TV show, or custom list cards inside messages.
- **Real-Time Indicators:** Live typing indicators (`chatTyping` table), read receipts (`lastReadAt`), chat muting, and message reporting ([convex/schema.ts](file:///f:/Projects/popcorn-vision/convex/schema.ts#L166-L216)).

### 2.7 Data Import & Migration Wizard

- **CSV Importers:** Multi-step wizard supporting Letterboxd and IMDb exported CSVs ([components/import-wizard.tsx](file:///f:/Projects/popcorn-vision/components/import-wizard.tsx)).
- **Automated Title Resolution:** Batch-matches CSV entries to TMDB IDs and prepares them for bulk database import.

### 2.8 Push Notifications & Preferences

- **Web Push API Integration:** Native zero-dependency service worker ([public/sw.js](file:///f:/Projects/popcorn-vision/public/sw.js)) handling background push notifications for messages, friend requests, and comment replies.
- **In-App Notification Center:** Unread badge and notification drawer ([convex/schema.ts](file:///f:/Projects/popcorn-vision/convex/schema.ts#L97-L115)).

### 2.9 User Personalization & Theming

- **Profile Customization:** Unique usernames, custom bios, country flags, and avatar image cropping ([components/avatar-crop-modal.tsx](file:///f:/Projects/popcorn-vision/components/avatar-crop-modal.tsx)).
- **Preset Themes:** 8 curated visual themes: Dark, Netflix, HBO, Disney, Prime, Letterboxd, Cinema, and Sakura ([app/globals.css](file:///f:/Projects/popcorn-vision/app/globals.css#L119-L165)).

---

## 3. Verified Requirements vs. Inferred Requirements

| Feature Area               | Verified Requirements (Codebase Evidence)                                                                                                                                              | Inferred Requirements (Extrapolated)                                                                               |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------- |
| **Authentication**         | Better Auth with email/password and Google OAuth; Resend for password reset emails ([convex/auth.ts](file:///f:/Projects/popcorn-vision/convex/auth.ts)).                              | Passwordless magic-link sign-in is not yet implemented.                                                            |
| **Guest Mode**             | Watchlist and continue-watching persisted in `localStorage` without login ([lib/guest-watchlist.ts](file:///f:/Projects/popcorn-vision/lib/guest-watchlist.ts)).                       | Automatic migration of guest `localStorage` data into Convex account upon registration/login is currently missing. |
| **Currency Conversion**    | Uses `open.er-api.com` to fetch exchange rates for budget/revenue formatting ([convex/exchangeRates.ts](file:///f:/Projects/popcorn-vision/convex/exchangeRates.ts)).                  | Intended to update weekly on demand; no scheduled backend cron is registered in `convex/crons.ts`.                 |
| **Search Engine Indexing** | Explicitly disabled across all routes with `X-Robots-Tag: noindex, nofollow, noarchive` and `robots.ts` ([next.config.ts](file:///f:/Projects/popcorn-vision/next.config.ts#L15-L25)). | The application is currently operating as a private/beta platform not intended for public search indexing.         |
| **Timelines Module**       | Routes and empty folders exist for `/timelines/star-wars` ([app/(main)/timelines/star-wars](<file:///f:/Projects/popcorn-vision/app/(main)/timelines/star-wars>)).                     | Franchise chronological timeline feature was initiated but abandoned or postponed.                                 |

---

## 4. Unanswered Product Questions & Open Areas

1. **Guest Data Merge on Auth:** When an anonymous guest user logs in or creates an account, should their existing `localStorage` watchlist and continue-watching history automatically prompt to merge into Convex?
2. **Franchise Timelines Feature:** Are the empty `app/(main)/timelines/star-wars`, `components/timeline/`, and `config/timelines/` directories planned for upcoming releases, or should they be cleaned up?
3. **Notification Retention:** Notifications are currently stored indefinitely in the `notifications` table without expiration or automatic pruning. Should a retention policy (e.g., 60 days) be defined?
4. **Cloudflare Worker Repository Sync:** The worker script described in `cloudflare/README.md` (`cloudflare/worker.js`) is missing from the Git repository. Should the production worker script be committed for version control?
