# Testing & Verification Guide — Popcorn Vision

**Status:** Living Documentation (Derived from Codebase Audit v2.12.5)  
**Last Updated:** October 2026  
**Repository:** [popcorn-vision](file:///f:/Projects/popcorn-vision)

---

## 1. Current Testing Status

### 1.1 Verified Findings
- **Automated Tests:** **0% coverage**. There are currently no automated unit, integration, or end-to-end test files in the repository (no Jest, Vitest, Cypress, or Playwright setup).
- **Static Quality Verification:** Robust static analysis and type safety are active via ESLint 9 and TypeScript 5 compiler checks.

### 1.2 Available Quality Commands

| Script / Command | Purpose | Current Audit Result |
| :--- | :--- | :--- |
| `pnpm.cmd lint` | Runs ESLint 9 with Next.js core-web-vitals & TypeScript configs | Passed (0 errors, 12 warnings for unused variables/exhaustive-deps) |
| `pnpm.cmd exec tsc --noEmit` | Strict TypeScript compiler check without emitting output | Passed (0 type errors) |
| `pnpm.cmd build` | Next.js production bundle compilation | Available for release readiness validation |
| `pnpm.cmd convex` | Convex backend dev sync and TypeScript schema codegen | Watches `convex/` changes and synchronizes types |

---

## 2. Critical Paths Lacking Automated Test Coverage

The following critical system flows should be prioritized when establishing automated testing:

1. **Two-Tier Client Cache Engine ([lib/tmdb-cache.ts](file:///f:/Projects/popcorn-vision/lib/tmdb-cache.ts)):**
   - Memory cache (L1) hit/miss scenarios.
   - IndexedDB (L2) persistence, version upgrade handler, and fallback to memory when IndexedDB fails.
   - Stale-While-Revalidate (SWR) cache TTL expiration logic.
   - Concurrent request deduplication (`inFlightRequests`).

2. **TMDB Data Cleansing & Mapping ([lib/tmdb.ts](file:///f:/Projects/popcorn-vision/lib/tmdb.ts), [lib/tmdb-actions.ts](file:///f:/Projects/popcorn-vision/lib/tmdb-actions.ts)):**
   - Handling missing poster paths, empty backdrops, null genres, and raw TMDB API variance.
   - Discovery filter query construction.

3. **CSV Import Parser & Batch Matcher ([components/import-wizard.tsx](file:///f:/Projects/popcorn-vision/components/import-wizard.tsx)):**
   - Parsing Letterboxd `watched.csv` and `ratings.csv`.
   - Matching title, release year, and IMDb ID against TMDB search.

4. **Convex Backend Mutations & Permissions:**
   - Watchlist, Favorites, and Rating calculation formulas ([convex/ratings.ts](file:///f:/Projects/popcorn-vision/convex/ratings.ts)).
   - Collaborative Custom List authorization rules (collaborators vs. viewers).
   - Bi-directional friendship transitions and block enforcement ([convex/social.ts](file:///f:/Projects/popcorn-vision/convex/social.ts)).

5. **Modal Deep-Linking Synchronization ([hooks/use-query-modal-state.ts](file:///f:/Projects/popcorn-vision/hooks/use-query-modal-state.ts)):**
   - URL search parameter updates for `?quick-view=...`, `?person=...`, and `?auth=...`.
   - History push vs replace state behavior.

---

## 3. Recommended Testing Strategy & Roadmap

### Phase 1: Unit & Integration Testing (Vitest + React Testing Library)
- **Install:** `pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom`
- **Focus:**
  - Pure utility functions: [lib/formatDate.js](file:///f:/Projects/popcorn-vision/lib/formatDate.js), [lib/formatRuntime.js](file:///f:/Projects/popcorn-vision/lib/formatRuntime.js), [lib/formatRating.js](file:///f:/Projects/popcorn-vision/lib/formatRating.js), [lib/sortFilms.js](file:///f:/Projects/popcorn-vision/lib/sortFilms.js).
  - Cache engine: [lib/tmdb-cache.ts](file:///f:/Projects/popcorn-vision/lib/tmdb-cache.ts) (mocking `indexedDB` via `fake-indexeddb`).
  - Convex backend tests using `convex-test`.

### Phase 2: End-to-End Testing (Playwright)
- **Install:** `pnpm add -D @playwright/test`
- **Focus:**
  - Critical user journey: Search title ➔ Open Quick View modal ➔ View trailer ➔ Close modal.
  - Guest mode: Add to watchlist without login ➔ Verify card persists on page reload.
  - Chat workflow: Direct messaging between two mock accounts.

---

## 4. Manual Verification Checklist for AI Agents

Before submitting changes, AI agents must perform the following manual and static verifications:
1. Run `pnpm.cmd exec tsc --noEmit` and confirm **0 errors**.
2. Run `pnpm.cmd lint` and verify no new warnings or errors are introduced.
3. Test affected routes locally using `pnpm.cmd dev`.
4. If modifying Convex functions, verify changes in `convex/schema.ts` and ensure index bounds adhere to the zero N+1 DataLoader pattern.
