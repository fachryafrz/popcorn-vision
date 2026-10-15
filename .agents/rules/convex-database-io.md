# Convex Database I/O & Query Efficiency Rules

## 1. Anti-Pattern: In-Memory Filtering vs. Compound Index
- **NEVER** use `.filter(q => ...)` or JavaScript in-memory filtering (`docs.filter(...)`) over unconstrained index scans for large datasets. Convex reads all documents matching the index into server memory before applying filters.
- **ALWAYS** use compound indexes (e.g. `by_user_media`, `by_user_date`) with range bounds `.gte("date", start).lte("date", end)` so the database engine only scans relevant documents.

## 2. Document Read Limits & Pagination
- Avoid unbounded `.collect()` on user feeds, activity streams, or tables that grow over time.
- Use `.paginate(args.paginationOpts)` for infinite scroll feeds and `.take(limit)` for compact widgets (e.g. recent 5 items).

## 3. Eliminate N+1 Queries
- **STRICTLY PROHIBITED:** Running `ctx.db.query(...)` inside loops or `Promise.all(ids.map(...))` when records can be fetched in a single bounded query.
- Aggregate data in memory using `Map` or `reduce` from a single-batch query.

## 4. Denormalization & Precomputed Rollup Aggregates
- For values frequently accessed on dashboards (such as average ratings, watchlist counts, favorite counts), store precomputed totals directly on the parent document or rollup table.
- Incrementally update aggregates during mutations (`create`, `update`, `delete`) to provide O(1) reads instead of O(N) reads over full historical records.

## 5. Granular Reactivity & Idempotent Writes
- Split monolithic queries into focused, small queries so reactive invalidations do not trigger cascading re-fetches of unrelated data across clients.
- Verify values before calling `ctx.db.patch()`: avoid patching if fields are unchanged to prevent wasted write I/O and spurious reactive invalidation broadcasts.

## 6. Batch Entity Enrichment (In-Memory DataLoader Pattern)
- **STRICTLY PROHIBITED:** Calling `ctx.db.get()` per-item in loops or `Promise.all(items.map(async item => ctx.db.get(...)))` without ID deduplication.
  - *Anti-pattern:* 50 items triggering $50 \times 4 = 200$ redundant reads for repeating users, lists, or movie relations.
- **ALWAYS use the Batch Enrichment pattern:**
  1. Collect all unique foreign IDs into a `Set<Id>`.
  2. Batch fetch unique entities in parallel: `await Promise.all([...uniqueIds].map(id => ctx.db.get(id)))`.
  3. Construct an in-memory `Map<Id, Doc>`.
  4. Synchronously enrich items from the Map (saves up to 95% read I/O).

## 7. Single-Pass Aggregation vs. Per-Entity Loops
- When calculating multi-entity summaries (e.g., stats across multiple custom lists or social activities):
  - **DO NOT** query records in a loop per list/user.
  - **FETCH** the target records in **1 single query**, then calculate aggregations in memory using a `Map<entityId, total>`.

## 8. Symmetrical / Bidirectional Relation Queries (Resolving `OR` Constraints)
- Convex does not support `OR` conditions inside `.withIndex()`.
- Run parallel index-targeted queries with `Promise.all` and merge/sort in memory.

## 9. Multi-Filter Index Branching
- When a query supports optional filters:
  - Do NOT fetch all records and filter in JavaScript.
  - Branch indexes from the most specific compound condition to the most generic.

## 10. Bulk Mutations with Consolidated Net Deltas
- When performing bulk operations affecting numerical totals, compute net adjustments in memory using `Map<Id, number>` first, then apply `ctx.db.patch()` **only once** per affected entity where `delta !== 0`.

## 11. Canonical Auth Resolver
- Always authenticate through the standard auth helper (e.g. `authComponent.safeGetAuthUser(ctx)`) consistently across all backend queries and mutations.
