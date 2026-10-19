# System Architecture — Popcorn Vision

**Status:** Living Documentation (Derived from Codebase Audit v2.12.5)  
**Last Updated:** October 2026  
**Repository:** [popcorn-vision](file:///f:/Projects/popcorn-vision)

---

## 1. System Architecture Overview

Popcorn Vision is built on a split-tier architecture designed for **zero server compute cost**, **sub-millisecond client rendering**, and **real-time reactive synchronization**.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Client Tier (Browser)                         │
│                                                                         │
│   Next.js 16 (App Router) + React 19 + Tailwind v4                      │
│   ├── Client State: Zustand + nuqs (URL search params)                  │
│   ├── L1 Memory Cache: Map<string, CacheEntry>                          │
│   ├── L2 Persistent Cache: IndexedDB ("popcorn_vision_db")              │
│   └── Offline & Gestures: Native Web Push Service Worker ("public/sw.js")│
└──────────────────┬─────────────────────────────┬────────────────────────┘
                   │                             │
    HTTP / SWR     │                             │ Real-Time WebSocket Sync
    Proxy Calls    │                             │ & Auth Sessions
                   ▼                             ▼
┌───────────────────────────────┐  ┌───────────────────────────────────────┐
│     Edge Proxy Tier           │  │     Convex Cloud Backend Tier         │
│                               │  │                                       │
│   Cloudflare Worker           │  │   Convex Database & Reactive Queries  │
│   (povi-tmdb-proxy)           │  │   ├── Better Auth Component           │
│   - Conceals TMDB API Key     │  │   ├── Schema (21 tables)              │
│   - Global Edge HTTP Cache    │  │   ├── Realtime Chat & Social Feeds    │
│   - Zero Serverless Compute   │  │   └── Web Push Dispatch (web-push)    │
└──────────────┬────────────────┘  └──────────────────┬────────────────────┘
               │                                      │
               ▼                                      ▼
┌───────────────────────────────┐  ┌───────────────────────────────────────┐
│     External API Services     │  │       Third-Party Integrations        │
│                               │  │                                       │
│   The Movie Database (TMDB)   │  │   - Resend API (Transactional Email)  │
│   - Catalog, Cast, Crew       │  │   - Google OAuth (Social Login)       │
│   - Posters, Backdrops, Logos │  │   - open.er-api.com (Currency Rates)  │
│   - Video Trailers            │  │   - Google Analytics (GA4)            │
└───────────────────────────────┘  └───────────────────────────────────────┘
```

---

## 2. Directory Responsibilities

| Directory | Core Purpose & Contents |
| :--- | :--- |
| [app/](file:///f:/Projects/popcorn-vision/app) | Next.js 16 App Router pages, nested layouts, `globals.css`, route handlers, and manifest |
| [app/(main)/](file:///f:/Projects/popcorn-vision/app/(main)) | Public and authenticated browsing pages (Discovery, Movie, TV, Search, Lists, Diary, Profile) |
| [app/(chat)/](file:///f:/Projects/popcorn-vision/app/(chat)) | Standalone dedicated full-screen messaging workspace |
| [app/api/auth/](file:///f:/Projects/popcorn-vision/app/api/auth) | Next.js Better Auth route handler bridging HTTP auth requests to Convex |
| [components/](file:///f:/Projects/popcorn-vision/components) | UI components organized by domain (`chat/`, `custom-lists/`, `media-detail/`, `navbar/`, `profile/`, `ui/`) |
| [components/ui/](file:///f:/Projects/popcorn-vision/components/ui) | 58 reusable UI primitives based on `@base-ui/react` and shadcn/ui |
| [convex/](file:///f:/Projects/popcorn-vision/convex) | Convex backend modules, schemas, mutations, queries, actions, auth configuration, and push services |
| [lib/](file:///f:/Projects/popcorn-vision/lib) | TMDB client actions, two-tier cache engine, Better Auth client/server wrappers, formatters, and utilities |
| [hooks/](file:///f:/Projects/popcorn-vision/hooks) | Reusable React hooks for keyboard shortcuts, modal deep-linking, push notifications, and gestures |
| [data/](file:///f:/Projects/popcorn-vision/data) | Static dataset files for countries (ISO-3166), languages, genres, TV networks, and changelog history |
| [config/](file:///f:/Projects/popcorn-vision/config) | Application metadata and navigation constants ([config/site.ts](file:///f:/Projects/popcorn-vision/config/site.ts)) |
| [cloudflare/](file:///f:/Projects/popcorn-vision/cloudflare) | Cloudflare Worker deployment documentation for TMDB reverse proxy |
| [public/](file:///f:/Projects/popcorn-vision/public) | Static assets, logos, favicon icons, and vanilla service worker ([public/sw.js](file:///f:/Projects/popcorn-vision/public/sw.js)) |

---

## 3. Data Flow & Storage Boundaries

### 3.1 External Media Catalog Data (TMDB)
- **Zero Convex Storage Usage:** TMDB media records, search queries, person filmographies, and trailer links are **never saved** directly into Convex database tables. This preserves Convex free-tier storage quotas.
- **Two-Tier Client Caching ([lib/tmdb-cache.ts](file:///f:/Projects/popcorn-vision/lib/tmdb-cache.ts)):**
  1. **L1 (In-Memory Map):** 0ms instant retrieval within active session.
  2. **L2 (IndexedDB `popcorn_vision_db`):** Persistent local cache surviving tab closes and app restarts with Stale-While-Revalidate (SWR).
  - Cache TTLs: Short (2 hours for trending/search), Medium (24 hours for media details), Long (7 days for genres/providers/companies).
- **Edge Security:** The TMDB API Key is injected by the Cloudflare Worker proxy (`NEXT_PUBLIC_API_URL`), preventing key exposure in browser DevTools.

### 3.2 User Data & Social Interactions (Convex)
Convex serves as the single source of truth for:
- User profiles and privacy toggles (`users` table)
- Watchlists, Favorites, and Ratings (`watchlist`, `favorites`, `ratings`, `mediaStats` tables)
- Detailed watch diary records (`diary` table)
- TV season and episode progress (`continueWatching` table)
- Custom themed collaborative lists (`customLists`, `customListItems`, `customListCollaborators`, `customListItemVotes`, `customListLikes`, `customListComments`)
- Real-time chat conversations and media card attachments (`chats`, `chatMemberships`, `messages`, `chatTyping`, `chatReports`)
- Social graph, friends, blocks, and activities (`friendships`, `blocks`, `activities`, `activityLikes`, `activityComments`, `comments`)
- Web Push subscriptions (`pushSubscriptions` table)

### 3.3 Ephemeral UI & Local Storage
- **URL Search Parameters (`nuqs`):** Deep-linked modal states (`?quick-view=...`, `?person=...`, `?auth=...`, `?changelog=...`).
- **Zustand Stores:** Modals and input toggles ([lib/auth-modal-store.ts](file:///f:/Projects/popcorn-vision/lib/auth-modal-store.ts), [hooks/use-search-overlay-store.ts](file:///f:/Projects/popcorn-vision/hooks/use-search-overlay-store.ts)).
- **LocalStorage:** Guest watch history ([lib/guest-watch.ts](file:///f:/Projects/popcorn-vision/lib/guest-watch.ts)), guest watchlist ([lib/guest-watchlist.ts](file:///f:/Projects/popcorn-vision/lib/guest-watchlist.ts)), active chat ID, and disclaimer acceptance.

---

## 4. Key Architectural Invariants & Constraints

1. **Zero Service Worker Libraries:** Modern Next.js Turbopack development strictly prohibits third-party service worker compilers (e.g. `@serwist/next`, `workbox`, `next-pwa`). Web Push notifications are handled exclusively through a vanilla [public/sw.js](file:///f:/Projects/popcorn-vision/public/sw.js).
2. **Strict TypeScript (Zero `any`):** No `any` type is allowed across client and backend modules. All external payloads are explicitly modeled with interfaces or runtime narrowing.
3. **Compound Indexes over In-Memory Filtering:** Convex queries must utilize compound indexes (`by_user_media`, `by_user_watched`) rather than `.filter()` to prevent reading full table partitions into server memory.
4. **DataLoader / In-Memory Batching:** Convex queries eliminate N+1 reads by collecting foreign keys into a `Set`, batch-fetching via `Promise.all(ids.map(ctx.db.get))`, and caching in an in-memory `Map`.
5. **Idempotent Writes & Net Deltas:** Mutations verify if fields changed before executing `ctx.db.patch()` to prevent spurious reactive invalidations across connected clients.
