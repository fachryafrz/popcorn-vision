# Changelog Management Rules

1. **Mandatory Changelog Updates:**
   Whenever new features, performance enhancements, bug fixes, or architectural changes are introduced, you must update both changelog files:
   - [`data/changelog.ts`](file:///f:/Projects/popcorn-vision/data/changelog.ts): Powers the in-app *What's New Dialog* and the [`/changelog`](file:///f:/Projects/popcorn-vision/app/(main)/changelog/page.tsx) timeline page.
   - [`CHANGELOG.md`](file:///f:/Projects/popcorn-vision/CHANGELOG.md): Project release history adhering to the *Keep a Changelog* standard.

2. **User-Friendly & Benefit-Oriented Language:**
   - Avoid overly technical jargon, internal implementation details, or backend acronyms in descriptions displayed to end-users in `data/changelog.ts`.
   - Focus on **user benefits and visible experience enhancements** (e.g. use *"Instant Page Revisits"* instead of *"Implemented in-memory Map cache with TTL"*).

3. **Milestone Format in `data/changelog.ts`:**
   - Always assign `isLatest: true` to the newly added milestone.
   - Remove `isLatest: true` from the previous milestone.
   - Categorize each change item using accurate types: `"feat"`, `"fix"`, `"perf"`, `"refactor"`, or `"ui"`.
