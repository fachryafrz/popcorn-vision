---
trigger: always_on
---

# Changelog Management Rules

1. **Mandatory Dual Changelog Synchronization**:
   Whenever a version bump or release occurs, synchronize both changelog files:
   - [`data/changelog.ts`](file:///f:/Projects/popcorn-vision/data/changelog.ts): Powers the in-app *What's New Dialog* and the [`/changelog`](file:///f:/Projects/popcorn-vision/app/(main)/changelog/page.tsx) page. Set `isLatest: true` on the new version and remove it from previous versions.
   - [`CHANGELOG.md`](file:///f:/Projects/popcorn-vision/CHANGELOG.md): Markdown release notes adhering to *Keep a Changelog* standards.

2. **User-Friendly & Benefit-Oriented Language**:
   - Focus on user benefits and visible experience enhancements (e.g., use *"Instant Page Revisits"* instead of *"Implemented in-memory Map cache"*).
   - Categorize entries cleanly using accurate types: `"feat"`, `"fix"`, `"perf"`, `"refactor"`, or `"ui"`.
