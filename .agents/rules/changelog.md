# User-Facing Changelog & Release Notes Guidelines

All changelogs and release notes presented to end users (such as the in-app `/changelog` page, *What's New* dialogs, in-app update modals, and release feeds) must strictly use **clear, accessible, and user-friendly English**. Avoid overly technical jargon and internal implementation details.

---

## 🎯 Core Principles

1. **User-Centric & Benefit-Driven**
   - Describe what users can now do or what experience has improved, rather than how the underlying code was implemented.
   - Examples:
     - ❌ *Too technical:* "Implemented nuqs query parameters for modal state deep linking."
     - ✅ *User-friendly:* "You can now open and share dialogs directly via links with seamless back-button support."
     - ❌ *Too technical:* "Refactored entry log store with optimistic updates and normalized caching."
     - ✅ *User-friendly:* "Faster browsing with instant visual updates even on slower networks."

2. **Strict Anti-Jargon Guardrail**
   - **NEVER** mention internal developer terms or implementation details in user-facing release notes:
     - Library & framework names: `Zustand`, `Turbopack`, `Convex mutations`, `AST`, `TanStack Query`, `Redux`, `nuqs`, `Zod`, hook names, etc.
     - Architecture & database internals: `OCC conflict`, `in-memory Map`, `compound index bounds`, `schema migration scripts`, etc.
   - Replace technical notes with practical user outcomes:
     - ❌ *Too technical:* "Optimized memoization and refactored media details query hooks."
     - ✅ *User-friendly:* "Instant page revisits and smoother browsing when exploring titles."
     - ❌ *Too technical:* "Resolved race condition during backfill migration on initial launch."
     - ✅ *User-friendly:* "Fixed an issue where personal watchlists occasionally took longer to load on app startup."

3. **Scannable & Clear Categories**
   - **Features:** Brand-new capabilities, tools, or tracking options.
   - **Improvements & UI:** Smoother navigation, cleaner visual layout, and more intuitive controls.
   - **Fixes:** Resolved bugs, glitches, or inconsistencies for a more stable experience.
   - **Performance:** Snappier load times, reduced battery usage, or smoother animations.

4. **Tone & Style**
   - Keep sentences concise, punchy, and positive.
   - Use clear action verbs (e.g., "Added", "Improved", "Resolved", "Enhanced").

---

## 🛡️ Mandatory Dual Changelog Synchronization
Whenever a version bump or release occurs, synchronize both changelog files:
1. `CHANGELOG.md`: Markdown release notes adhering to *Keep a Changelog* standards.
2. In-app changelog data file (e.g. `data/changelog.ts`): Powers in-app *What's New* dialogs and `/changelog` pages. Set `isLatest: true` on the new version and remove it from previous versions.
