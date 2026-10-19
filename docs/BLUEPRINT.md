# System Blueprint — Popcorn Vision

**Status:** Living Documentation (Derived from Codebase Audit v2.12.5)  
**Last Updated:** October 2026  
**Repository:** [popcorn-vision](file:///f:/Projects/popcorn-vision)

---

## 1. Route Map & Page Organization

The application uses Next.js 16 App Router with route groups `(main)` and `(chat)` to separate standard layout navigation from full-viewport messaging.

| Route | Page File | Route Group / Layout | Purpose |
| :--- | :--- | :--- | :--- |
| `/` | [app/(main)/page.tsx](file:///f:/Projects/popcorn-vision/app/(main)/page.tsx) | `(main)` ([app/(main)/layout.tsx](file:///f:/Projects/popcorn-vision/app/(main)/layout.tsx)) | Landing page with Hero carousel, trending shelves, continue watching, categories |
| `/movie/[id]` | [app/(main)/movie/[id]/page.tsx](file:///f:/Projects/popcorn-vision/app/(main)/movie/[id]/page.tsx) | `(main)` | Detailed movie page (cast, trailers, streaming providers, reviews, ratings) |
| `/tv/[id]` | [app/(main)/tv/[id]/page.tsx](file:///f:/Projects/popcorn-vision/app/(main)/tv/[id]/page.tsx) | `(main)` | Detailed TV series page (seasons accordion, episodes, cast, trailers) |
| `/person/[id]` | [app/(main)/person/[id]/page.tsx](file:///f:/Projects/popcorn-vision/app/(main)/person/[id]/page.tsx) | `(main)` | Actor / director / crew profile and filmography |
| `/company/[id]` | [app/(main)/company/[id]/page.tsx](file:///f:/Projects/popcorn-vision/app/(main)/company/[id]/page.tsx) | `(main)` | Production company profile and production catalog |
| `/search` | [app/(main)/search/page.tsx](file:///f:/Projects/popcorn-vision/app/(main)/search/page.tsx) | `(main)` | Multi-filter media discovery search engine |
| `/feed` | [app/(main)/feed/page.tsx](file:///f:/Projects/popcorn-vision/app/(main)/feed/page.tsx) | `(main)` | Friend social activity stream with like/comment interactions |
| `/lists` | [app/(main)/lists/page.tsx](file:///f:/Projects/popcorn-vision/app/(main)/lists/page.tsx) | `(main)` | Custom lists discovery, creation, and user list management |
| `/lists/[id]` | [app/(main)/lists/[id]/page.tsx](file:///f:/Projects/popcorn-vision/app/(main)/lists/[id]/page.tsx) | `(main)` | Custom list detail, collaborator actions, item upvoting, comments |
| `/user/[username]` | [app/(main)/user/[username]/page.tsx](file:///f:/Projects/popcorn-vision/app/(main)/user/[username]/page.tsx) | `(main)` | User profile (watchlist, favorites, ratings, diary logs, insights tabs) |
| `/@:username` | Rewrite to `/user/:username` | `(main)` | URL rewrite shortcut for user profiles ([next.config.ts](file:///f:/Projects/popcorn-vision/next.config.ts#L8-L13)) |
| `/settings` | [app/(main)/settings/page.tsx](file:///f:/Projects/popcorn-vision/app/(main)/settings/page.tsx) | `(main)` | User profile settings, privacy toggles, theme switcher, security |
| `/changelog` | [app/(main)/changelog/page.tsx](file:///f:/Projects/popcorn-vision/app/(main)/changelog/page.tsx) | `(main)` | In-app version release notes timeline powered by [data/changelog.ts](file:///f:/Projects/popcorn-vision/data/changelog.ts) |
| `/privacy` | [app/(main)/privacy/page.tsx](file:///f:/Projects/popcorn-vision/app/(main)/privacy/page.tsx) | `(main)` | Privacy Policy legal page |
| `/terms` | [app/(main)/terms/page.tsx](file:///f:/Projects/popcorn-vision/app/(main)/terms/page.tsx) | `(main)` | Terms of Service legal page |
| `/reset-password`| [app/(main)/reset-password/page.tsx](file:///f:/Projects/popcorn-vision/app/(main)/reset-password/page.tsx) | `(main)` | Password recovery verification form |
| `/admin/users` | [app/(main)/admin/users/page.tsx](file:///f:/Projects/popcorn-vision/app/(main)/admin/users/page.tsx) | `(main)` | Admin portal for user moderation and role assignment |
| `/chat` | [app/(chat)/chat/page.tsx](file:///f:/Projects/popcorn-vision/app/(chat)/chat/page.tsx) | `(chat)` ([app/(chat)/layout.tsx](file:///f:/Projects/popcorn-vision/app/(chat)/layout.tsx)) | Fullscreen real-time direct & group messaging workspace |
| `/api/auth/[...all]` | [app/api/auth/[...all]/route.ts](file:///f:/Projects/popcorn-vision/app/api/auth/[...all]/route.ts) | API Route | Better Auth authentication endpoints |

---

## 2. Core User Flows & State Transitions

### 2.1 Media Discovery & Interaction Flow
```
User navigates to "/" or "/search"
  ├─> Fetch TMDB media via lib/tmdb-actions.ts (L1 Memory / L2 IndexedDB SWR Cache)
  ├─> Click item card -> Open Quick View Modal via URL ?quick-view=[mediaType]-[id]
  │     └─> Click "Full Details" -> Navigate to /movie/[id] or /tv/[id]
  ├─> Click "Add to Watchlist" or "Add to Favorites"
  │     ├─> If Authenticated: Convex mutation (watchlist.toggle or favorites.toggle)
  │     └─> If Guest: Persist to localStorage via lib/guest-watchlist.ts
  └─> Click "Log Watch": Open LogWatchModal -> Record rating, watch date, review -> convex/diary.ts:logEntry
```

### 2.2 Custom Lists & Collaboration Flow
```
User navigates to /lists
  ├─> Click "Create List" -> Modal form (Name, Description, Privacy, Collaborative toggle)
  ├─> Navigate to /lists/[id]
  │     ├─> Search & add TMDB items via components/custom-lists/add-list-item-search.tsx
  │     ├─> Collaborators add items or vote on entries (customListItemVotes)
  │     ├─> Community members upvote, comment, like, or favorite the list
  │     └─> Share list into /chat or copy link
```

### 2.3 Real-Time Chat & Media Sharing Flow
```
User opens /chat
  ├─> Query convex/chats.ts:listChats for authenticated user
  ├─> Select active conversation (stored in localStorage "active-chat-id")
  ├─> Type message:
  │     ├─> Typing events dispatched to convex/chats.ts:setTyping
  │     ├─> Optional: Attach movie/TV/list card via media picker modal
  │     └─> Send message -> convex/chats.ts:sendMessage
  └─> Push Notification dispatched to offline recipients via convex/pushActions.ts & public/sw.js
```

### 2.4 Letterboxd / IMDb CSV Import Flow
```
User opens Settings -> Data Import -> Launch Wizard
  ├─> Upload CSV file (Letterboxd watched.csv/ratings.csv or IMDb export)
  ├─> Parse CSV client-side
  ├─> Batch resolve TMDB IDs via matchImportItemsAction in lib/tmdb-actions.ts
  ├─> User previews and adjusts unmatched items
  └─> Commit batch to Convex (diary, watchlist, ratings, or favorites)
```

---

## 3. Modal Deep-Linking System

Popcorn Vision synchronizes major overlays with URL query parameters using `nuqs` and [hooks/use-query-modal-state.ts](file:///f:/Projects/popcorn-vision/hooks/use-query-modal-state.ts), enabling deep-link sharing and native browser back-button navigation:

| Query Parameter | Target Modal | Handler Component |
| :--- | :--- | :--- |
| `?quick-view={mediaType}-{id}` | Media Quick View Modal | [components/quick-view-modal.tsx](file:///f:/Projects/popcorn-vision/components/quick-view-modal.tsx) |
| `?person={personId}` | Person Quick View Modal | [components/person-quick-view-modal.tsx](file:///f:/Projects/popcorn-vision/components/person-quick-view-modal.tsx) |
| `?auth=login\|register\|reset` | Unified Auth Dialog | [components/auth-modal.tsx](file:///f:/Projects/popcorn-vision/components/auth-modal.tsx) |
| `?changelog=true` | In-App What's New Dialog | [components/changelog/whats-new-modal.tsx](file:///f:/Projects/popcorn-vision/components/changelog/whats-new-modal.tsx) |

---

## 4. Key Global Providers Architecture

The root layout mounts [components/providers.tsx](file:///f:/Projects/popcorn-vision/components/providers.tsx), wrapping the application in a unified reactive tree:

```
<ConvexProvider>
  <ConvexBetterAuthProvider>
    <ConvexQueryCacheProvider>
      <PersonalizationProvider>     <!-- Theme & UI customization -->
        <UserLibraryProvider>       <!-- Active user watch status / collections cache -->
          <ConfirmProvider>         <!-- Base UI async confirm dialogs -->
            <TooltipProvider>       <!-- Global tooltip system -->
              <NuqsAdapter>          <!-- URL search params state sync -->
                {children}
                <NotificationProvider />
                <OfflineIndicator />
                <GlobalKeyboardShortcuts />
              </NuqsAdapter>
            </TooltipProvider>
          </ConfirmProvider>
        </UserLibraryProvider>
      </PersonalizationProvider>
    </ConvexQueryCacheProvider>
  </ConvexBetterAuthProvider>
</ConvexProvider>
```
