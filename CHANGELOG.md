# Changelog

All notable changes to Popcorn Vision are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.12.1] - 2026-10-04

### Changed
- **Changelog Timeline Layout**: Refined changelog milestone card layout on smaller viewports to prevent badge cramping and text overflow.
- **Turbopack Dev Runner**: Enabled Turbopack (`next dev --turbopack`) as the default local development server runner for faster hot module reloading and build speeds.

---

## [2.12.0] - 2026-10-04

### Added
- **Global Cloud Cache (`tmdbCache`)**: Database-backed shared cache in Convex for cross-user and cross-device media discovery.
- **Adaptive TTL Caching**: Resource-specific cache lifetimes (7-day detail cache, 24-hour discovery & trending cache, 3-day reviews cache).
- **Stale-While-Revalidate**: Instant stale response delivery with background cache revalidation and stampede protection.

---

## [2.11.1] - 2026-10-04

### Added
- **Instant Page Revisit Cache**: Instant revisits across movies, TV series, actors, and production companies with zero loading delays.
- **High-Resolution CDN Streaming**: Direct high-resolution image streaming from global media CDNs for faster visual rendering.

### Changed
- **Optimized Background Sync**: Streamlined media discovery and search pipeline for snappier transitions and zero-overhead background sync.
- **Flicker-Free Navigation**: Eliminated page loading flickers during repeated navigation between feed and media details.

---

## [2.10.0] - 2026-10-04

### Added
- **In-App Release Notes Hub (`/changelog`)**: Dedicated chronological milestone timeline page with category filtering.
- **Interactive What's New Dialog**: Interactive modal dialog synchronized via `?changelog=true` URL query state.
- **Release Notes Navigation Links**: Entry points on footer version badge, user dropdown menu, and mobile drawer.

### Changed
- **Accessible Card Typography**: Refined typography and card design following Anti Slop accessibility guidelines.

---

## [2.9.0] - 2026-09-27

### Added
- **Serwist PWA Service Worker**: Progressive Web App service worker with offline fallback caching and asset precaching.
- **Web Push API Backend**: Browser push notification subscription backend with Convex VAPID synchronization.
- **TopLoader Progress Bar**: Next.js TopLoader route transition progress bar for smooth navigation feedback.

### Fixed
- **Mobile Viewport Stability**: Resolved WebView launch flicker and mobile restart issues.

---

## [2.8.0] - 2026-09-17

### Added
- **Convex Query Cache**: Client-side query caching via `convex-helpers` for instant client responses without redundant network requests.

### Changed
- **Component Modularization**: Decomposed monolithic client pages into focused, reusable sub-components.
- **Non-Blocking Page Loads**: Removed blocking dynamic SSR queries across media routes to accelerate initial page loads.

---

## [2.7.0] - 2026-09-15

### Added
- **Live Countdown Timers**: Live countdown timers for upcoming cinema releases and scheduled TV series episodes.
- **Global ScrollToTop Listener**: Automatic scroll restoration to top on client route transitions.
- **Harmonized Release Badges**: Unified release status badge styling across all media cards.

---

## [2.5.0] - 2026-09-11

### Added
- **Guest Mode Exploration**: Local storage tracking for Watchlist and Continue Watching without requiring immediate login.
- **Global Keyboard Shortcuts**: Instant keyboard navigation including `Cmd/Ctrl+K` Spotlight search and `?` shortcuts dialog.
- **Offline Status Indicator**: Floating banner alert and native application feel when offline.

---

## [2.4.5] - 2026-08-28

### Added
- **Mobile Bottom Navigation Bar**: Modernized mobile bottom bar navigation and desktop header UX.
- **Markdown Review Formatting**: Markdown styling support for user-written media reviews.
- **Expandable Overview Cards**: Reusable ExpandableText component preventing mobile overview text truncation.

---

## [2.4.0] - 2026-08-22

### Added
- **TMDB Community Reviews**: Integrated TMDB community reviews and media gallery video players.
- **Optimistic Chat Messaging**: Optimistic client updates for messaging actions (send, edit, delete, mute).
- **Spotlight Search Overlay**: Instant Spotlight search modal triggered via keyboard shortcuts.

---

## [2.3.0] - 2026-08-08

### Added
- **Deep-Linked URL Modals (`nuqs`)**: Quick View and Auth modals bound to URL query state with `nuqs`.
- **Web Push Notifications**: Web Push notification subscriber and delivery system.

### Changed
- **Granular Skeleton Loaders**: Migrated media feeds to client-side fetching with granular skeleton loaders.

---

## [2.2.0] - 2026-07-25

### Added
- **Production Company Profiles**: Dedicated production company profile pages (`/company/[id]`) with production catalogs.
- **Admin User Management**: Admin management console and role assignment features.
- **Role & Permission Badges**: User role badges for platform owners and administrators.

---

## [2.1.0] - 2026-06-08

### Added
- **Person Quick View Dialog**: Quick view modal for instant actor and crew exploration.
- **Bulk Diary Deletion**: Diary selection mode allowing multi-item watch log deletions.
- **Dynamic Currency Conversion**: Real-time currency exchange integration on box office statistics.

---

## [2.0.0] - 2026-06-01

### Added
- **Complete Platform Rebuild**: Rebuilt on Next.js 16 App Router, React 19, and Convex Realtime Database.
- **Better Auth Integration**: Authentication system supporting Google OAuth and verified sessions.
- **Real-Time Messaging**: 1-on-1 direct messaging and group chats with movie, TV, and list card attachments.
- **Collaborative Media Lists**: Custom and collaborative lists with community upvoting and discussions.
- **Social Activity Feed**: Activity stream, friend requests, user blocking, 10-star rating system, and watch diary.

---

## [1.9.0] - 2025-12-16

### Changed
- **URL Query State Sync**: Migrated URL query parameter state handling to `nuqs` for reliable modal deep-linking.
- **Catch-All API Routes**: Restructured backend API routes using Next.js catch-all segment patterns.
- **Backdrop Blur Transitions**: Added dynamic backdrop blur transitions on navbar scroll.

---

## [1.8.0] - 2025-08-03

### Added
- **Dual Release Tracking**: Dual release date tracking comparing international premieres with country-specific dates.

### Changed
- **Modal Deep-Link Routing**: Improved URL routing when opening popup media and person modals.
- **Mobile Tooltip Touch Support**: Enhanced tooltip responsiveness on mobile viewport touch interactions.

---

## [1.7.5] - 2025-05-06

### Added
- **Add to Calendar Action**: Allows users to schedule calendar reminders for upcoming premieres.

### Changed
- **Pnpm Package Manager**: Migrated repository package management from npm to pnpm.
- **Unified Share Controls**: Unified mobile and desktop share button logic and button sizing.

---

## [1.7.0] - 2025-04-07

### Added
- **User Disclaimer Modal**: User disclaimer modal dialog and privacy policy updates.
- **Secure Session Management**: Secure cookie token management for authenticated TMDB actions.
- **Collection Tab Switcher**: Film type tab switcher on user profile collection views.

---

## [1.6.5] - 2025-02-25

### Added
- **Media Streaming Player**: Integrated film streaming player with server selection and watch history.
- **Crew Photo Carousel**: Image carousel modal for actor and crew photo exploration.
- **Multi-Director Support**: Enhanced film director component to support multiple directors.

---

## [1.6.2] - 2025-01-30

### Added
- **Dynamic Autocomplete Input**: Updated search input text dynamically when cycling through autocomplete results.

### Changed
- **SWR Profile Synchronization**: Integrated SWR for continuously updated user profile collections.
- **Pluralize Library Integration**: Replaced custom plural utilities with standard pluralize library.

---

## [1.6.0] - 2025-01-28

### Added
- **Live Search Autocomplete**: Search bar autocomplete dropdown fetching live movie and TV matches.
- **Keyboard Arrow Navigation**: Full keyboard arrow navigation for dropdown suggestions.

### Changed
- **Debounced Search Querying**: Optimized search input debounce timing to eliminate redundant API calls.

---

## [1.5.0] - 2025-01-13

### Added
- **Skeleton Preview Placeholders**: Skeleton loading states for person details and media preview dialogs.
- **Native Web Share API**: Mobile Web Share API support for native device sharing.

### Changed
- **CSS Transition Optimization**: Replaced heavy scroll reveal animations with performant CSS transitions.

---

## [1.4.8] - 2024-11-08

### Added
- **Desktop Filter Sidebar**: Toggleable filter sidebar menu for desktop search views.

### Changed
- **Clean Filter Reset**: Streamlined filter reset button behavior to cleanly reset input states.
- **Adaptive Image Resolution**: Optimized image resolution scaling for mobile and desktop viewports.

---

## [1.4.5] - 2024-07-01

### Added
- **Release Window Classification**: Granular release status distinguishing theatrical, digital, and physical release windows.
- **Localized Release Dates**: Country-specific release date localization based on user country headers.

### Changed
- **Parallel Data Fetching**: Parallelized Promise data fetching across home feed sections.

---

## [1.4.2] - 2024-04-13

### Changed
- **Zustand Store Migration**: Replaced Redux Toolkit with lightweight Zustand store architecture.
- **Modal Dialog Redirect Fix**: Resolved redirect issues when closing person and media modal dialogs.
- **MIT License Documentation**: Added MIT open-source license documentation.

---

## [1.4.0] - 2024-03-24

### Added
- **TMDB User Authentication**: TMDB user authentication and session management via secure API routes.
- **10-Star Rating System**: 10-star rating system with community score aggregation.
- **Watchlist & Favorites Toggles**: Personal Watchlist and Favorites collection toggles.

---

## [1.3.0] - 2024-02-26

### Changed
- **Next.js 14 App Router**: Full migration to Next.js 14 App Router with React Server Components and Suspense boundaries.
- **Refined Theme Tokens**: Refined dark theme palette tokens and reorganized modular folder structure.

---

## [1.2.0] - 2024-01-13

### Added
- **Interactive Hover Previews**: Interactive hover preview card displaying synopsis, rating, and trailer playback.
- **Release Countdown Calculations**: Dynamic release year countdown calculations for upcoming cinema releases.
- **Episode Keyboard Navigation**: Keyboard navigation support for TV series episodes.

---

## [1.1.8] - 2024-01-09

### Added
- **Unified Multi-Search**: Multi-search query matching movies, TV shows, and cast members simultaneously.
- **JSON-LD Review Microdata**: JSON-LD aggregate review microdata schemas for search engine snippets.
- **Grid Auto-Recommendations**: Grid recommendation section with infinite auto loading.

---

## [1.1.5] - 2023-12-28

### Added
- **Network & Studio Filters**: Multi-parameter search filtered by TV broadcast networks, status, and production companies.
- **Cast & Crew Filmographies**: Cast and crew filmography preview modals with role-based credits.
- **Infinite Feed Scrolling**: Infinite scroll pagination on catalog explore pages.
- **Dynamic XML Sitemaps**: Multi-page XML sitemap indexing for search discovery.

---

## [1.1.4] - 2023-12-20

### Added
- **Release Countdown Timers**: Live countdown calculation for upcoming movie releases.

### Changed
- **Dark Aesthetic Layout Redesign**: Redesigned homepage, search page, and film detail layouts with polished dark aesthetics.
- **Select Dropdown Accessibility**: Integrated react-select for search filter dropdowns with keyboard support.

---

## [1.1.2] - 2023-12-11

### Added
- **Navigation Search Input**: Search input bar embedded into top navigation bar with auto-routing.
- **PWA Manifest Install**: Initial Progressive Web App manifest install prompt support.

### Changed
- **Server-Side Data Rendering**: Converted media detail data fetching to full server-side rendering.

---

## [1.1.0] - 2023-10-19

### Added
- **Regional Watch Providers**: Regional watch providers showing streaming, rental, and purchase platforms by country.
- **Title Recommendations**: Recommendations carousel suggesting similar titles based on TMDB metadata.
- **Structured Studio Data**: Schema.org microdata for movie directors, actors, and production studios.

---

## [1.0.8] - 2023-09-02

### Added
- **TV Series Collection Explorer**: TV series collection explorer with multi-season switcher and episode overviews.
- **Active Season Indicators**: Active state indicators for selected TV series seasons.

---

## [1.0.5] - 2023-08-25

### Added
- **Rich Search Microdata**: Schema.org JSON-LD microdata for rich search engine result snippets.
- **Accessibility & Screen Readers**: Screen reader support and semantic HTML markup across cards and navigation.
- **Skeleton Placeholders**: Skeleton loading placeholders across sliders, cards, and detail sections.

---

## [1.0.2] - 2023-08-09

### Added
- **Poster Rating Badges**: Rating badge overlay directly on media card posters.
- **Streaming Provider Section**: Initial watch provider platforms section.

### Changed
- **Responsive Media Layouts**: Updated film details layout with responsive mobile viewport adjustments.

---

## [1.0.0] - 2023-07-01

### Added
- **Platform Genesis Launch**: Initial launch of Popcorn Vision powered by TMDb API.
- **Media Discovery Feeds**: Trending, popular, top-rated, and upcoming movie & TV discovery feeds.
- **Rich Media Details**: Media detail pages with synopses, cast lists, and official YouTube trailers.
- **Responsive Cinema Layout**: Cinema dark theme layout built with Next.js and Tailwind CSS.

---

## [0.1.0] - 2023-02-17

### Added
- **Concept & Architecture**: Project conception and technical architecture design for movie discovery.
- **Domain Modeling**: Core data schemas and domain modeling for media catalogs and rating systems.
