# Changelog

All notable changes to Popcorn Vision are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.12.0] - 2026-10-04

### Added
- Global database-backed shared cache table (`tmdbCache`) in Convex for cross-user and cross-device media discovery.
- Resource-specific TTL cache policies (7-day detail cache, 24-hour discovery & trending cache, 3-day reviews cache).
- Stale-While-Revalidate and cache stampede protection on high-concurrency requests.

---

## [2.11.1] - 2026-10-04

### Added
- Instant page revisit caching across movies, TV series, actors, and production companies with zero loading delays.
- Direct high-resolution image streaming from global media CDNs for faster visual rendering.

### Changed
- Streamlined media discovery and search pipeline for snappier transitions and zero-overhead background sync.
- Eliminated page loading flickers during repeated navigation between feed and media details.

---

## [2.10.0] - 2026-10-04

### Added
- Dedicated in-app `/changelog` milestone timeline page.
- Interactive What's New modal dialog synchronized via `?changelog=true` URL state.
- Release notes entry points on footer version badge, user dropdown menu, and mobile drawer.

### Changed
- Refined typography and card design following Anti Slop accessibility guidelines.

---

## [2.9.0] - 2026-09-27

### Added
- Serwist Progressive Web App service worker with offline fallback caching.
- Web Push notification backend with Convex VAPID synchronization.
- Next.js TopLoader route transition progress bar.

### Fixed
- WebView launch flicker and mobile restart issues.

---

## [2.8.0] - 2026-09-17

### Added
- Convex query caching via `convex-helpers` for instant client responses.

### Changed
- Decomposed monolithic client pages into focused sub-components.
- Removed blocking dynamic SSR queries across media routes.

---

## [2.7.0] - 2026-09-15

### Added
- Live countdown timers for upcoming movie releases and TV series episodes.
- Global `ScrollToTop` listener on client route transitions.
- Harmonized release status badges across media cards.

---

## [2.5.0] - 2026-09-11

### Added
- Guest Mode allowing local storage tracking for Watchlist and Continue Watching without login.
- Global keyboard navigation shortcuts including `Cmd/Ctrl+K` Spotlight search and `?` shortcuts dialog.
- Native application feel and offline status indicator.

---

## [2.4.5] - 2026-08-28

### Added
- Overhauled mobile bottom navigation bar and desktop header UX.
- Markdown formatting support for user written reviews.
- Reusable ExpandableText component preventing mobile overview text truncation.

---

## [2.4.0] - 2026-08-22

### Added
- Integrated TMDB community reviews and media gallery video players.
- Optimistic UI updates for messaging actions (send, edit, delete, mute).
- Instant Spotlight search overlay triggered via keyboard shortcuts.

---

## [2.3.0] - 2026-08-08

### Added
- Quick View and Auth modals bound to URL query state with nuqs.
- Web Push notification subscriber and delivery system.

### Changed
- Migrated media feeds to client-side fetching with granular skeleton loaders.

---

## [2.2.0] - 2026-07-25

### Added
- Dedicated production company profile pages (`/company/[id]`) with production catalogs.
- Admin User Management console and role assignment features.
- User role badges for platform owners and administrators.

---

## [2.1.0] - 2026-06-08

### Added
- Person quick view modal for instant actor and crew exploration.
- Diary selection mode allowing bulk watch log deletions.
- Dynamic currency exchange integration on box office statistics.

---

## [2.0.0] - 2026-06-01

### Added
- Complete platform rebuild on Next.js 16 App Router, React 19, and Convex Realtime Database.
- Better Auth authentication system supporting Google OAuth and verified sessions.
- Real-time 1-on-1 direct messaging and group chats with movie, TV, and list card attachments.
- Custom and collaborative media lists with upvoting and threaded discussions.
- Social activity feed, friend requests, user blocking, 10-star rating system, and watch diary.

---

## [1.9.0] - 2025-12-16

### Changed
- Migrated URL query parameter state handling to `nuqs` for reliable modal deep-linking.
- Restructured backend API routes using Next.js catch-all segment patterns.
- Added dynamic backdrop blur transitions on navbar scroll.

---

## [1.8.0] - 2025-08-03

### Added
- Dual release date tracking comparing international premieres with country-specific dates.

### Changed
- Improved URL routing when opening popup media and person modals.
- Enhanced tooltip responsiveness on mobile touch interactions.

---

## [1.7.5] - 2025-05-06

### Added
- AddToCalendar action allowing users to schedule calendar reminders for upcoming premieres.

### Changed
- Migrated repository package management from npm to pnpm.
- Unified mobile and desktop share button logic and button sizing.

---

## [1.7.0] - 2025-04-07

### Added
- User disclaimer modal dialog and privacy policy updates.
- Secure cookie token management for authenticated TMDB actions.
- Film type tab switcher on user profile collection views.

---

## [1.6.5] - 2025-02-25

### Added
- Built-in streaming media player with server selection and watch history.
- Image carousel modal for actor and crew photo exploration.
- Multiple director support in film detail summaries.

---

## [1.6.2] - 2025-01-30

### Added
- Dynamic search input text updates when cycling through autocomplete results with keyboard arrows.

### Changed
- Integrated SWR for continuously updated user profile collections.
- Replaced custom plural utilities with standard pluralize library.

---

## [1.6.0] - 2025-01-28

### Added
- Search bar autocomplete dropdown fetching live movie and TV matches.
- Full keyboard arrow navigation for dropdown suggestions.

### Changed
- Optimized search input debounce timing.

---

## [1.5.0] - 2025-01-13

### Added
- Skeleton loading states for person details and media preview dialogs.
- Mobile Web Share API support for native sharing.

### Changed
- Replaced heavy scroll reveal animations with performant CSS transitions.

---

## [1.4.8] - 2024-11-08

### Added
- Toggleable filter sidebar menu for desktop search views.

### Changed
- Streamlined filter reset button behavior to cleanly reset input states.
- Optimized image resolution scaling for mobile and desktop viewports.

---

## [1.4.5] - 2024-07-01

### Added
- Granular release status distinguishing theatrical, digital, and physical release windows.
- Country-specific release date localization.

### Changed
- Parallelized Promise data fetching across home feed sections.

---

## [1.4.2] - 2024-04-13

### Changed
- Replaced Redux Toolkit with lightweight Zustand store architecture.
- Resolved redirect issues when closing person and media modal dialogs.
- Added MIT open-source license documentation.

---

## [1.4.0] - 2024-03-24

### Added
- TMDB user authentication and session management via secure API routes.
- 10-star rating system with community score aggregation.
- Personal Watchlist and Favorites collection toggles.

---

## [1.3.0] - 2024-02-26

### Changed
- Full migration to Next.js 14 App Router with React Server Components and Suspense boundaries.
- Refined dark theme palette tokens and reorganized modular folder structure.

---

## [1.2.0] - 2024-01-13

### Added
- Interactive hover preview card displaying synopsis, rating, and trailer playback.
- Dynamic release year countdown calculations.
- Keyboard navigation support for TV series episodes.

---

## [1.1.8] - 2024-01-09

### Added
- Multi-search query matching movies, TV shows, and cast members simultaneously.
- JSON-LD aggregate review microdata schemas.
- Grid recommendation section with infinite auto loading.

---

## [1.1.5] - 2023-12-28

### Added
- Multi-parameter search filtered by TV broadcast networks, status, and production companies.
- Cast and crew filmography preview modals.
- Infinite scroll pagination on catalog explore pages.
- Dynamic multi-page XML sitemap indexing.

---

## [1.1.4] - 2023-12-20

### Added
- Live countdown calculation for upcoming movie releases.

### Changed
- Redesigned homepage, search page, and film detail layouts with polished dark aesthetics.
- Integrated react-select for search filter dropdowns with keyboard support.

---

## [1.1.2] - 2023-12-11

### Added
- Search input bar embedded into top navigation bar with auto-routing.
- Initial Progressive Web App manifest install prompt support.

### Changed
- Converted media detail data fetching to full server-side rendering.

---

## [1.1.0] - 2023-10-19

### Added
- Regional watch providers showing streaming, rental, and purchase platforms by country.
- Recommendations carousel suggesting similar titles based on TMDB metadata.
- Schema.org microdata for movie directors, actors, and production studios.

---

## [1.0.8] - 2023-09-02

### Added
- TV series collection explorer with multi-season switcher and episode overviews.
- Active state indicators for selected TV series seasons.

---

## [1.0.5] - 2023-08-25

### Added
- Schema.org JSON-LD microdata for rich search engine result snippets.
- Screen reader support and semantic HTML markup across cards and navigation.
- Skeleton loading placeholders across sliders, cards, and detail sections.

---

## [1.0.2] - 2023-08-09

### Added
- Rating badge overlay directly on media card posters.
- Watch provider platforms section.

### Changed
- Updated film details layout with responsive mobile viewport adjustments.

---

## [1.0.0] - 2023-07-01

### Added
- Initial launch of Popcorn Vision powered by TMDb API.
- Trending, popular, top-rated, and upcoming movie & TV discovery feeds.
- Media detail pages with synopses, cast lists, and official YouTube trailers.
- Responsive cinema dark theme layout built with Next.js and Tailwind CSS.

---

## [0.1.0] - 2023-02-17

### Added
- Project conception and technical architecture design for movie discovery.
- Core data schemas and domain modeling for media catalogs and rating systems.

