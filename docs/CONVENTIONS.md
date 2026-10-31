# Coding Standards & Conventions — Popcorn Vision

**Status:** Living Documentation (Derived from Codebase Audit v2.12.5)  
**Last Updated:** October 2026  
**Repository:** [popcorn-vision](../)

---

## 1. Naming & File Placement Conventions

### 1.1 File & Directory Naming
- **Pages & Layouts:** Next.js App Router conventions: `page.tsx`, `layout.tsx`, `route.ts`.
- **Components:** Kebab-case file names (e.g., `activity-card.tsx`, `log-watch-modal.tsx`, `media-detail-client.tsx`).
- **Feature Component Folders:** Kebab-case directories (e.g., `components/custom-lists/`, `components/media-detail/`, `components/import-wizard/`).
- **Hooks:** Prefixed with `use-` in kebab-case (e.g., `hooks/use-debounce.ts`, `hooks/use-query-modal-state.ts`).
- **Convex Modules:** CamelCase file names reflecting table domains (e.g., `convex/customLists.ts`, `convex/continueWatching.ts`, `convex/pushActions.ts`).
- **Utilities & Helpers:** CamelCase or kebab-case (e.g., `lib/tmdb-actions.ts`, `lib/formatDate.js`).

### 1.2 Code Identifiers
- **React Components:** PascalCase (e.g., `MediaDetailClient`, `CustomListCard`).
- **Hooks & Helper Functions:** CamelCase starting with lowercase (e.g., `useDebounce`, `formatRuntime`).
- **Convex Functions:** CamelCase (e.g., `toggleWatchlist`, `getMediaStats`, `listComments`).
- **Convex Database Tables:** CamelCase (e.g., `customListItems`, `continueWatching`, `chatMemberships`).
- **Convex Database Indexes:** Prefixed with `by_` followed by snake_case indexed fields (e.g., `by_user`, `by_user_media`, `by_chat_created`).

---

## 2. Component Architecture & Best Practices

1. **Server vs. Client Components:**
   - Pages and static wrappers default to Server Components for initial metadata generation and faster first contentful paint.
   - Interactive components with event handlers, modals, or React state explicitly declare `'use client'` at line 1.
2. **Component Decomposition:**
   - Large or multifaceted components must be split into dedicated sub-components (e.g., `media-detail/` split into `seasons-accordion.tsx`, `cast-section.tsx`, `recommendations-section.tsx`).
3. **No Redundant Re-invention:**
   - Always inspect [components/ui/](../components/ui) before introducing custom dialogs, dropdowns, buttons, or input primitives.

---

## 3. TypeScript Standards & Data Integrity

1. **Zero `any`:**
   - **NEVER use `any` under any circumstances.**
   - Model all external API responses (TMDB endpoints, Resend responses, exchange rate payloads) with explicit interfaces.
   - Use `unknown` with runtime type narrowing guards when handling unpredictable external inputs.
2. **No Hardcoded Fallback Anti-Pattern (`||`):**
   - **NEVER** use `val || "default"` to mask missing or unhandled states.
   - Explicitly validate data presence at the source.
   - Use optional chaining (`?.`) and nullish coalescing (`??`) only when `null` or `undefined` is a valid domain value.
3. **Async Next.js 16 Parameters:**
   - In Next.js 16, route parameters (`params` and `searchParams`) are asynchronous Promises. Always declare and `await` them:
     ```typescript
     interface PageProps {
       params: Promise<{ id: string }>;
       searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
     }
     export default async function Page({ params, searchParams }: PageProps) {
       const { id } = await params;
       const query = await searchParams;
     }
     ```

---

## 4. Convex Backend Patterns

1. **Canonical Auth Resolution:**
   - Always extract and verify the authenticated user via `authComponent.safeGetAuthUser(ctx)`. Never rely on client-supplied user IDs for permissions.
2. **Compound Index Bounds vs. In-Memory Filter:**
   - Use `.withIndex("by_user_media", q => q.eq("userId", userId).eq("mediaId", mediaId))` instead of querying by user and filtering in memory.
3. **In-Memory DataLoader for N+1 Queries:**
   - Batch lookups by collecting foreign IDs into a `Set`, fetching with `Promise.all(ids.map(ctx.db.get))`, and enriching through a `Map`.
4. **Idempotent Updates:**
   - Check existing field values before executing `ctx.db.patch()`. Skip write operations when values are identical to reduce write IO and unneeded reactive broadcasts.

---

## 5. Git & Release Management Conventions

1. **Branch Model:**
   - `master`: Production branch (stable, deployed to Vercel production).
   - `develop`: Integration branch for all active feature and bugfix work.
   - Short-lived branches: `feature/<feature-name>`, `fix/<bug-name>`, `hotfix/<issue-name>`.
2. **Merge Strategies:**
   - `feature/*` / `fix/*` ➔ `develop`: **Squash and Merge** (`gh pr merge --squash --delete-branch`).
   - `develop` ➔ `master`: **Merge Commit (`--no-ff`)** (`gh pr merge --merge`).
3. **Semantic Versioning (SemVer):**
   - Strictly follow `MAJOR.MINOR.PATCH` (e.g. `2.12.5`).
   - Version bumps occur in `develop` prior to production release merge.
4. **Conventional Commits:**
   - Use standard prefixes: `feat:`, `fix:`, `perf:`, `refactor:`, `docs:`, `chore:`.
   - When asked for commit messages, provide **only the message itself inside a single codeblock**.
