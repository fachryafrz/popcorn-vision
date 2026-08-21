<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->

# Popcorn Vision - AI Agent Guidelines

## 🌟 Project Overview
Popcorn Vision is a modern, responsive web application for movie and TV show discovery, streaming tracking, watchlists, ratings, and social features.

### Tech Stack
- **Framework:** Next.js 16 (App Router) & React 19
- **Package Manager:** `pnpm` (always use `pnpm` as `pnpm-lock.yaml` is present)
- **Backend & Database:** [Convex](https://convex.dev) (`convex/`)
- **Authentication:** [Better Auth](https://better-auth.com) with Convex integration (`@convex-dev/better-auth`)
- **Styling:** Tailwind CSS v4, `tw-animate-css`
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/), Base UI (`@base-ui/react`), Lucide React icons
- **Carousels / Sliders:** Embla Carousel (`embla-carousel-react`), Swiper
- **State Management & URL State:** Zustand, `nuqs`
- **Third-party APIs:** TMDB API (The Movie Database)

---

## ✨ Key Features & System Modules

1. **Movie & TV Show Discovery (TMDB Integration)**
   - **Rich Media Feeds:** Explore trending, popular, top-rated, and upcoming movies & TV series.
   - **Detailed Media Pages:** In-depth synopses, cast and crew credits, official trailers/videos, genre tags, recommendations, and streaming provider availability.
   - **People & Company Pages:** Actor, director, crew, and production company profile pages with filmographies.
   - **Advanced Search & Discovery:** Multi-parameter search filtered by genres, release years, sort criteria, and keywords.

2. **Watchlist, Favorites & Personal Ratings**
   - **Personal Collections:** One-click addition to personal Watchlist and Favorites.
   - **10-Star Rating System:** Rate media from 1 to 10 with community average and individual score tracking.
   - **Continue Watching Tracker:** Monitor in-progress TV series with season and episode-level status tracking.

3. **Viewing Diary & Review Logging**
   - **Comprehensive Diary Entries:** Log watched entries with custom watch dates, rewatch indicator, personal written reviews, runtime tracking, and cast/crew tags.
   - **Multi-Level Media Logs:** Support for logging movies, full TV series, specific seasons, or standalone episodes.

4. **Custom & Collaborative Media Lists**
   - **Curated Lists:** Create public, private, or collaborative lists for custom themes and collections.
   - **List Interactions:** Upvote items within lists, invite collaborators, leave comments, like lists, and save favorites.
   - **Direct Sharing:** Share lists seamlessly into chat conversations and activity feeds.

5. **Social Feed & Community Activities**
   - **Real-Time Activity Feed:** View friend updates for ratings, reviews, watchlist additions, and season completions.
   - **Social Engagements:** Like and comment on activities and media reviews with threaded replies and mentions.
   - **Friendship System:** Send, accept, or decline friend requests with full user blocking and privacy protection.

6. **Real-Time Direct & Group Messaging (Chat System)**
   - **Conversations:** 1-on-1 direct messaging and multi-member group chats.
   - **Rich Media Attachments:** Share movies, TV shows, and custom lists directly inside chat messages.
   - **Live Indicators & Moderation:** Real-time typing indicators, read receipts, chat muting, and message reporting.

7. **Notification Center & Web Push API**
   - **In-App Notifications:** Real-time alerts for friend requests, accepted friendships, mentions, comment replies, and chat messages.
   - **Web Push Notifications:** Automated browser push notifications via Web Push API.

8. **User Profiles, Privacy & Theme Customization**
   - **Custom User Profiles:** Profile personalization with avatars, custom bios, country flags, and customizable theme settings.
   - **Granular Privacy Controls:** Configurable visibility toggles for watchlist, favorites, ratings, diary, insights, and direct messages.

---

## 🛠️ Core Libraries, Utilities & Helpers (`lib/`)

- **TMDB Server Actions (`lib/tmdb-actions.ts`):** Centralized Next.js Server Actions for all external TMDB API calls:
  - Discovery & Feeds: `getHeroItems()`, `getTrending(type)`, `getStreamingOriginals(providerKey)`, `getByCategory(genreName)`, `discoverMedia(filters)`.
  - Details: `getMediaDetails(mediaType, id)`, `getCollectionDetails(id)`, `getSeasonDetails(tvId, seasonNumber)`.
  - Search & Metadata: `searchMedia(query, type, page)`, `searchPersonByName(name)`, `searchCompanyByName(name)`, `searchKeywordByName(name)`.
  - Person & Company: `getPersonDetails(id)`, `getPersonCredits(id)`, `getCompanyDetails(id)`, `getCompanyMovies(id)`, `getCompanyTVShows(id)`.
  - Batching & Imports: `matchImportItemsAction(items)` (for Letterboxd/IMDb CSV imports), `batchFetchMediaMetadata(items)`.
  - Providers & Genres: `getTMDBGenres()`, `getTMDBProviders(watchRegion)`.
- **TMDB Types & Enums (`lib/tmdb.ts`):** Types (`TMDBMedia`, `TMDBRawItem`), genre map constants (`ALL_GENRES`, `GENRE_MAP`), streaming providers dictionary (`PROVIDERS`), and data cleaning helper `cleanMediaData(items, defaultType)`.
- **Authentication (`lib/auth-client.ts`, `lib/auth-server.ts`):** Better Auth client (`createAuthClient`, sign in/up, session hooks) and server session retriever.
- **State Stores (`lib/auth-modal-store.ts`):** Zustand modal store managing open/close state and active tab for authentication dialog (`useAuthModalStore`).
- **Formatters & Presentation Helpers:**
  - `lib/formatDate.js`: Multi-format date helper for release dates, log timestamps, and relative times.
  - `lib/formatRuntime.js`: Converts duration minutes into human-readable `"Xh Ym"` format.
  - `lib/formatRating.js`: Formats rating numbers and score decimals.
  - `lib/streamingProviderList.js`: Curated metadata and icon mapping for streaming platforms.
  - `lib/releaseStatus.js`: Release status resolver for movies and TV series.
- **Constants & Utilities (`lib/constants.ts`, `lib/utils.ts`):** URL query parameter keys (`QUERY_PARAMS.QUICK_VIEW`, `QUERY_PARAMS.PERSON`, `QUERY_PARAMS.AUTH`), asset paths, and `cn()` Tailwind class merge utility.

---

## 🪝 Custom React Hooks (`hooks/`)

- **`use-push-notifications.ts`:** Full Web Push notification lifecycle hook (permission state, service worker registration, push subscription token creation, and Convex backend synchronization).
- **`use-query-modal-state.ts`:** Syncs modal open/close states with URL search params (e.g. `?quick-view=...`, `?person=...`, `?auth=...`) for shareable modal deep-links.
- **`use-debounce.ts`:** Value and callback debounce hook used for responsive search inputs and real-time filters.
- **`use-search-overlay-store.ts`:** Zustand store controlling keyboard shortcuts (`Cmd+K` / `Ctrl+K`) and global search overlay open/close state.
- **`use-mobile.ts`:** Detects mobile vs desktop viewport breakpoints.
- **`use-is-mac.ts`:** Detects macOS environment for accurate keyboard shortcut display (`⌘` vs `Ctrl`).

---

## 🗄️ Convex Backend Modules (`convex/`)

- **`convex/watchlist.ts` & `convex/favorites.ts`:** User watchlist and favorites collections (add, remove, query by user, toggle status).
- **`convex/ratings.ts`:** 10-star rating system (rate media, get user rating, calculate community average scores).
- **`convex/diary.ts`:** Detailed watch diary logs (movie, tv, season, episode, custom watch dates, rewatch counters, reviews).
- **`convex/continueWatching.ts`:** Episode and season progress tracking for ongoing TV shows.
- **`convex/customLists.ts`:** Curated & collaborative media lists (create, edit, delete, add/remove items, upvote items, collaborator permissions, likes, favorites, and list comments).
- **`convex/chats.ts`:** Real-time messaging infrastructure (direct 1-on-1 chats, group chats, message sending, movie/TV/list card attachments, read receipts, and live typing indicators).
- **`convex/social.ts`:** Social graph (friend requests, friendships, accept/reject, blocking system, and relation lookups).
- **`convex/activities.ts`:** Friend activity feed, activity post creation, likes, and comment threads.
- **`convex/comments.ts`:** Media review discussion threads and comment like toggles.
- **`convex/users.ts`:** User profile mutation, unique username validation, custom avatar handling, and privacy settings enforcement.
- **`convex/push.ts` & `convex/pushActions.ts`:** Subscription management and background push notification delivery.

---

## 🧩 Key UI Components & Systems (`components/`)

- **Modals & Overlays:**
  - `components/quick-view-modal.tsx` & `components/person-quick-view-modal.tsx`: Instant preview dialogs for media items and actors.
  - `components/log-watch-modal.tsx`: Interactive diary logging modal with rating, date, review, and season/episode picker.
  - `components/auth-modal.tsx`: Unified login / registration / password reset modal.
  - `components/search-overlay.tsx`: Global search modal (`Cmd+K`).
  - `components/import-wizard.tsx`: Multi-step Letterboxd and IMDb CSV data import wizard with automated TMDB matching.
  - `components/avatar-crop-modal.tsx`: Profile picture cropping before upload.
- **Feeds & Media Display:**
  - `components/hero.tsx`: Featured dynamic backdrop hero banner with trailer modal triggers.
  - `components/card.tsx`: Universal media card with hover actions (watchlist, favorite, quick-view, rating).
  - `components/carousel.tsx`: Embla-powered smooth carousel for horizontal media lists.
  - `components/activity-feed.tsx` & `components/activity-card.tsx`: Social activity stream with live interactions.
  - `components/continue-watching-card.tsx`: Quick-resume playback card with episode progress indicators.
  - `components/comments-section.tsx`: Nested threaded comment section for media pages.
- **Chat System (`components/chat/`):**
  - Full-featured chat workspace with conversation lists, chat window, message composer, shared media card attachments, and member management.

---

## 🏢 Business Rules

1. **User Isolation & Privacy Enforcement:** Every user interaction and private query must authenticate through Better Auth (`authComponent.safeGetAuthUser(ctx)`). User profile visibility (`public`, `friends`, `private`) governs access to watchlists, favorites, diary logs, and social activities.
2. **TMDB Integration & Persistence:** Media discovery, search results, synopses, backdrops, and cast information originate from TMDB Server Actions (`lib/tmdb-actions.ts`). All personal collections, ratings, diary logs, continue watching progress, and chat messages are persisted in Convex.
3. **Rating Integrity & Community Scoring:** Ratings are based on a 1-to-10 scale. User ratings simultaneously update individual records and contribute to aggregate community scores indexed by `mediaId` and `mediaType`.
4. **Collaborative Lists & Permissions:** List creators control access permissions (`public`, `private`, `isCollaborative`). Collaborators can add or remove items, while community members can upvote items, leave comments, and favorite lists.
5. **Friendship System & Blocking:** Bi-directional friendship status (`pending`, `friends`) governs private chat permissions and activity feed sharing. Blocking a user immediately prevents messaging and removes them from mutual feeds.
6. **Continue Watching Progress:** Logging or watching TV episodes updates the active watch position (`season`, `episode`, `updatedAt`) for instant resumption.

---

## 🔒 Source of Truth

1. **Convex Database (`convex/schema.ts`):** The definitive single source of truth for user interaction data (watchlists, favorites, ratings, watch diary logs, continue watching states, custom lists, chat messages, friendships, and push subscriptions).
2. **TMDB API (The Movie Database):** The foundational external source of truth for media catalogs, titles, synopses, episode guides, posters, backdrop images, cast/crew credits, and streaming providers.
3. **Client State (`nuqs` & `Zustand`):** Strictly ephemeral UI state for modal dialogs (`?quick-view=...`, `?person=...`, `?auth=...`), search overlay shortcuts (`Cmd+K`), and transient input filters.

---

## ⚠️ Things to Avoid

1. **NEVER use the `any` type:** Always define explicit TypeScript types, interfaces, or use runtime narrowing.
2. **NEVER call TMDB directly from client components:** Always utilize Next.js Server Actions in `lib/tmdb-actions.ts` to protect API credentials and leverage server-side caching.
3. **NEVER bypass privacy settings in social queries:** Ensure activity feeds, watchlists, and profile details respect user privacy flags (`hideWatchlist`, `hideFavorites`, `hideRatings`, `hideDiary`).
4. **NEVER hardcode image CDN URLs:** Always reference TMDB image base paths or environment variables (`NEXT_PUBLIC_API_IMAGE_*`).
5. **NEVER mutate user collections without updating user references:** Ensure entries in `watchlist`, `favorites`, `ratings`, and `diary` are strictly bound to valid `userId`s and `mediaId`s.

---

## 📂 Naming & File Placement Conventions

- **App Router Pages:** `app/(main)/<feature>/page.tsx` and `app/(chat)/chat/page.tsx`
- **UI Components:** `components/<component-name>.tsx` or `components/<feature>/` (kebab-case file names, e.g. `activity-card.tsx`, `log-watch-modal.tsx`).
- **UI Primitives:** `components/ui/`
- **Custom React Hooks:** `hooks/use-<hook-name>.ts`.
- **Utility & Helper Functions:** `lib/<utility-name>.ts` and Server Actions `lib/tmdb-actions.ts`.
- **Convex Backend Services:** `convex/<domain>.ts` (e.g. `watchlist.ts`, `diary.ts`, `chats.ts`, `social.ts`).

---

## 🌐 Environment & External Services

- **Convex Deployment:**
  - `NEXT_PUBLIC_CONVEX_URL`: Public Convex deployment URL.
  - `NEXT_PUBLIC_CONVEX_SITE_URL`: Convex HTTP actions site URL.
- **Authentication (Better Auth & OAuth):**
  - `SITE_URL`: Application base URL.
  - `BETTER_AUTH_SECRET`: Secret key for Better Auth tokens and session validation.
  - `GOOGLE_CLIENT_ID`: Google OAuth Client ID for social login.
  - `GOOGLE_CLIENT_SECRET`: Google OAuth Client Secret.
  - `RESEND_API_KEY`: Resend API key for authentication emails and verification links.
- **TMDB API (The Movie Database):**
  - `API_URL`: TMDB API base URL (`https://api.themoviedb.org/3`).
  - `API_KEY` / `TMDB_API_KEY`: TMDB v3 API Key for server actions.
  - `NEXT_PUBLIC_API_IMAGE_ORIGINAL`, `NEXT_PUBLIC_API_IMAGE_780`, `NEXT_PUBLIC_API_IMAGE_500`, `NEXT_PUBLIC_API_IMAGE_342`, `NEXT_PUBLIC_API_IMAGE_300`: TMDB image CDN path configurations.
- **Web Push Notifications (Web Push API):**
  - `NEXT_PUBLIC_VAPID_PUBLIC_KEY`: Client-side VAPID public key for browser push subscription.
  - `VAPID_PUBLIC_KEY`: Server-side VAPID public key.
  - `VAPID_PRIVATE_KEY`: Server-side VAPID private key.
  - `VAPID_SUBJECT`: Contact email or subject URI for VAPID payload.
- **Analytics:**
  - `GA_MEASUREMENT_ID`: Google Analytics measurement ID.

---

## 📋 Core Engineering Rules & Standards

### 1. Strict TypeScript (Zero `any`)
- **NEVER use the `any` type** under any circumstance.
- Create explicit interfaces, type aliases, and generic utilities for all data models, API responses, component props, and Convex schemas.
- Use `unknown` with proper type guards / narrowing if input types are genuinely unpredictable.

### 2. DRY (Don't Repeat Yourself)
- Keep all code, components, utilities, and types reusable and modular.
- Avoid duplicate business logic, API calls, and styling definitions.
- Centralize shared types in dedicated type files or close to their domain models.

### 3. Implementation Planning
- **Always create an implementation plan** before executing complex, multi-file, or architectural modifications.
- Detail the affected components, logic changes, and verification steps.

### 4. Scalability & Directory Conventions
- Maintain a clean and scalable modular structure:
  - `app/`: Next.js App Router pages, layouts, and route handlers.
  - `components/`: Modular, reusable UI and feature-specific components.
  - `convex/`: Convex database schema, queries, mutations, and backend actions.
  - `hooks/`: Reusable custom React hooks.
  - `lib/`: Helper functions, API clients, and shared utilities.
  - `config/`: Application configuration, navigation constants, site metadata.
- Use consistent, descriptive, kebab-case or PascalCase file naming in line with project standards.

---

## ⚡ Next.js 16 & React 19 Conventions
- **Server Components by Default:** Fetch data and render on the server whenever possible. Use `'use client'` only for interactive components, client-side event handlers, or browser APIs.
- **Async Route Parameters:** In Next.js 16, `params` and `searchParams` in page/layout/route handlers are asynchronous (`Promise<Params>`). Always `await` them.
- **Performance & Loading:**
  - Implement granular skeleton loading states per section (e.g., Hero Skeleton, Card Carousel Skeleton) rather than blocking global loaders.
  - Optimize images using `next/image` with appropriate dimensions and aspect ratios.
- **SEO & Metadata:** Include semantic HTML structure (`h1`, `h2`, `main`, `nav`, `section`) and dynamic `generateMetadata` for movie, TV show, and profile pages.

---

## 🗄️ Convex Backend Guidelines
- Always refer to `convex/_generated/ai/guidelines.md` when writing Convex code.
- Define explicit table schemas and validators with `v` from `convex/values` in `convex/schema.ts`.
- Ensure all queries, mutations, and actions are strictly typed with `query`, `mutation`, and `action` wrappers from `./_generated/server`.
- Enforce authentication checks and authorization helpers in Convex functions where required.

---

## 🛠️ Development & CLI Commands
Always use `pnpm` for package operations:

```bash
# Start Next.js development server
pnpm dev

# Start Convex backend sync
pnpm convex
# or: pnpm dlx convex dev

# Build for production
pnpm build

# Run linter
pnpm lint
```
