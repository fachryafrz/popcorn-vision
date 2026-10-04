export type ChangelogType = "feat" | "fix" | "perf" | "refactor" | "ui";

export interface ChangelogItem {
  type: ChangelogType;
  description: string;
}

export interface ChangelogMilestone {
  version: string;
  title: string;
  releaseDate: string; // ISO format: YYYY-MM-DD
  isLatest?: boolean;
  isMajor?: boolean;
  summary: string;
  changes: ChangelogItem[];
}

export const CHANGELOG_MILESTONES: readonly ChangelogMilestone[] = [
  // ==========================================
  // --- 2026 Milestones ---
  // ==========================================
  {
    version: "2.12.0",
    title: "Global Shared Cloud Cache & Lightning-Fast Discovery",
    releaseDate: "2026-10-04",
    isLatest: true,
    summary:
      "Experience near-instant cross-device media discovery. Movies, TV shows, and cast filmographies fetched anywhere in the community now load in milliseconds for everyone worldwide.",
    changes: [
      {
        type: "perf",
        description:
          "Global Cloud Cache: First-time visits and private browsing sessions now load movie details and cast pages in milliseconds directly from our global database.",
      },
      {
        type: "perf",
        description:
          "Fresh & Adaptive Content: Automated smart background refresh ensures trending charts, upcoming releases, and ratings always stay current.",
      },
      {
        type: "ui",
        description:
          "Zero-Latency Browsing: Drastically reduced initial loading times across all media categories, seasons, and actor filmographies.",
      },
    ],
  },
  {
    version: "2.11.1",
    title: "Instant Media Loading & Seamless Navigation",
    releaseDate: "2026-10-04",
    summary:
      "Enjoy faster, smoother browsing with instant media previews and zero loading delays when exploring movies, TV shows, and cast profiles you've already visited.",
    changes: [
      {
        type: "perf",
        description:
          "Instant Page Revisits: Previously viewed movies, series, and people now open immediately without waiting for loading animations.",
      },
      {
        type: "perf",
        description:
          "High-Speed Artwork Delivery: High-resolution posters and backdrops now stream directly from global delivery networks for crisper visuals.",
      },
      {
        type: "ui",
        description:
          "Eliminated page loading flickers when navigating back and forth between the discovery feed and media details.",
      },
      {
        type: "refactor",
        description:
          "Streamlined real-time data synchronization for a noticeably snappier and battery-friendly browsing experience.",
      },
    ],
  },
  {
    version: "2.10.0",
    title: "In-App Release Notes & What's New System",
    releaseDate: "2026-10-04",
    summary:
      "A centralized release tracking hub and interactive What's New dialog documenting the evolution of Popcorn Vision since 2023.",
    changes: [
      {
        type: "feat",
        description:
          "Added dedicated /changelog page with chronological milestone cards and detailed update summaries.",
      },
      {
        type: "feat",
        description:
          "Implemented interactive What's New modal dialog with URL state synchronization.",
      },
      {
        type: "feat",
        description:
          "Integrated Release Notes links in the footer version badge, desktop user menu, and mobile drawer.",
      },
      {
        type: "ui",
        description:
          "Crafted high-contrast, accessible milestone cards with semantic status badges and responsive layout.",
      },
    ],
  },
  {
    version: "2.9.0",
    title: "Serwist PWA, Web Push API & Offline Engine",
    releaseDate: "2026-09-27",
    summary:
      "Transforming Popcorn Vision into a full Progressive Web App with background push notifications and reliable offline caching.",
    changes: [
      {
        type: "feat",
        description:
          "Integrated Serwist service worker for asset caching, media fallbacks, and offline resilience.",
      },
      {
        type: "feat",
        description:
          "Implemented Web Push notification backend and token sync in Convex.",
      },
      {
        type: "perf",
        description:
          "Added Next.js TopLoader route progress indicator for smooth page transitions.",
      },
      {
        type: "fix",
        description:
          "Resolved WebView launch flickering and mobile restart issues.",
      },
    ],
  },
  {
    version: "2.8.0",
    title: "Convex Query Cache & Component Modularization",
    releaseDate: "2026-09-17",
    summary:
      "Major performance optimizations through query caching and modular architecture decomposition.",
    changes: [
      {
        type: "perf",
        description:
          "Migrated data fetching hooks to Convex query cache to prevent redundant network requests.",
      },
      {
        type: "refactor",
        description:
          "Split complex monolithic components into modular, reusable sub-components.",
      },
      {
        type: "perf",
        description:
          "Removed blocking dynamic SSR eager queries to accelerate initial page loads.",
      },
    ],
  },
  {
    version: "2.7.0",
    title: "Live Countdown Timers & Route Polish",
    releaseDate: "2026-09-15",
    summary:
      "Dynamic release tracking countdowns for upcoming films and episodes with unified visual status indicators.",
    changes: [
      {
        type: "feat",
        description:
          "Added live countdown timers for upcoming cinema releases and scheduled TV episodes.",
      },
      {
        type: "feat",
        description:
          "Integrated global ScrollToTop navigation listener on route transitions.",
      },
      {
        type: "ui",
        description:
          "Unified status badge styling for upcoming, in-production, and released media items.",
      },
    ],
  },
  {
    version: "2.5.0",
    title: "Guest Mode & Global Keyboard Shortcuts",
    releaseDate: "2026-09-11",
    summary:
      "Local exploration without immediate login and fast desktop keyboard navigation.",
    changes: [
      {
        type: "feat",
        description:
          "Enabled Guest Mode allowing unauthenticated visitors to maintain a local watchlist and watch progress.",
      },
      {
        type: "feat",
        description:
          "Introduced global keyboard navigation shortcuts including Cmd/Ctrl+K and the shortcuts dialog.",
      },
      {
        type: "ui",
        description:
          "Added offline status indicator and refined native application feel.",
      },
    ],
  },
  {
    version: "2.4.5",
    title: "Mobile Bottom Navigation & Markdown Reviews",
    releaseDate: "2026-08-28",
    summary:
      "Modernized mobile bottom bar navigation, markdown-formatted reviews, and expandable overview cards.",
    changes: [
      {
        type: "feat",
        description:
          "Overhauled mobile bottom navigation bar and desktop header UX.",
      },
      {
        type: "feat",
        description:
          "Added rich markdown styling support to media review text.",
      },
      {
        type: "ui",
        description:
          "Created ExpandableText component preventing mobile overview text truncation.",
      },
    ],
  },
  {
    version: "2.4.0",
    title: "TMDB Reviews & Optimistic Chat Workspaces",
    releaseDate: "2026-08-22",
    summary:
      "Integration of community TMDB reviews, media gallery players, and optimistic chat message sending.",
    changes: [
      {
        type: "feat",
        description:
          "Integrated TMDB community reviews and media gallery video players.",
      },
      {
        type: "feat",
        description:
          "Implemented optimistic client updates for messaging actions.",
      },
      {
        type: "feat",
        description:
          "Added instant Spotlight search overlay triggered via keyboard shortcuts.",
      },
    ],
  },
  {
    version: "2.3.0",
    title: "Nuqs Modal Sync & Web Push Architecture",
    releaseDate: "2026-08-08",
    summary:
      "Deep-linked quick view modals synchronized via nuqs and browser Web Push notification infrastructure.",
    changes: [
      {
        type: "feat",
        description:
          "Bound Quick View and Auth modals to URL query state with nuqs.",
      },
      {
        type: "feat",
        description:
          "Implemented Web Push notification subscriber and delivery system.",
      },
      {
        type: "perf",
        description:
          "Migrated media feeds to client-side fetching with granular skeleton loaders.",
      },
    ],
  },
  {
    version: "2.2.0",
    title: "Production Companies & Admin Console",
    releaseDate: "2026-07-25",
    summary:
      "Dedicated company production profile pages, role badges, and user management console for administrators.",
    changes: [
      {
        type: "feat",
        description:
          "Created dedicated production company profile pages with production catalogs.",
      },
      {
        type: "feat",
        description:
          "Introduced Admin User Management console and role assignment features.",
      },
      {
        type: "ui",
        description:
          "Added user role badges for platform owners and administrators.",
      },
    ],
  },
  {
    version: "2.1.0",
    title: "Person Quick View, Insights & Diary Selection",
    releaseDate: "2026-06-08",
    summary:
      "Instant actor previews, insight filmography navigation, multi-item diary selection, and currency exchange integration.",
    changes: [
      {
        type: "feat",
        description:
          "Built Person quick view modal for instant actor and crew exploration.",
      },
      {
        type: "feat",
        description:
          "Added Diary selection mode allowing bulk watch log deletions.",
      },
      {
        type: "feat",
        description:
          "Integrated exchange rates for dynamic currency calculations on box office statistics.",
      },
    ],
  },
  {
    version: "2.0.0",
    title: "Version 2: The Major Social Cinema Overhaul",
    releaseDate: "2026-06-01",
    isMajor: true,
    summary:
      "A complete architectural rebirth turning Popcorn Vision from a static catalog into a full-stack real-time social platform.",
    changes: [
      {
        type: "feat",
        description:
          "Rebuilt backend from scratch using Convex real-time database, subscriptions, and server functions.",
      },
      {
        type: "feat",
        description:
          "Implemented Better Auth authentication system with social providers and email validation.",
      },
      {
        type: "feat",
        description:
          "Built real-time messaging system supporting 1-on-1 direct chats, group channels, and media card attachments.",
      },
      {
        type: "feat",
        description:
          "Created custom and collaborative media list system with community upvoting and discussions.",
      },
      {
        type: "feat",
        description:
          "Introduced real-time social activity feed, friend requests, user blocking, 10-star ratings, and watch diary.",
      },
    ],
  },

  // ==========================================
  // --- 2025 Milestones ---
  // ==========================================
  {
    version: "1.9.0",
    title: "Nuqs URL State & Catch-All API Architecture",
    releaseDate: "2025-12-16",
    summary:
      "Transitioned search parameter state synchronization to nuqs and streamlined server route methods.",
    changes: [
      {
        type: "refactor",
        description:
          "Migrated URL query parameter state handling to nuqs for reliable modal deep-linking.",
      },
      {
        type: "refactor",
        description:
          "Restructured backend API routes using Next.js catch-all segment patterns.",
      },
      {
        type: "ui",
        description:
          "Added dynamic backdrop blur transitions on navbar scroll.",
      },
    ],
  },
  {
    version: "1.8.0",
    title: "Original vs Country Release Tracking & Modal Routing",
    releaseDate: "2025-08-03",
    summary:
      "Detailed release date comparisons and deep-link popup modal routing improvements.",
    changes: [
      {
        type: "feat",
        description:
          "Added dual release date tracking comparing international premieres with country-specific dates.",
      },
      {
        type: "refactor",
        description:
          "Improved URL routing when opening popup media and person modals.",
      },
      {
        type: "fix",
        description:
          "Enhanced tooltip responsiveness on mobile viewport touch interactions.",
      },
    ],
  },
  {
    version: "1.7.5",
    title: "Add to Calendar & Package Manager Migration",
    releaseDate: "2025-05-06",
    summary:
      "Calendar scheduling integration for movie and TV premieres, and project migration to pnpm.",
    changes: [
      {
        type: "feat",
        description:
          "Added AddToCalendar action allowing users to schedule calendar reminders for upcoming premieres.",
      },
      {
        type: "refactor",
        description:
          "Migrated repository package management from npm to pnpm.",
      },
      {
        type: "ui",
        description:
          "Unified mobile and desktop share button logic and button sizing.",
      },
    ],
  },
  {
    version: "1.7.0",
    title: "Disclaimer Modal & Cookie Token Infrastructure",
    releaseDate: "2025-04-07",
    summary:
      "User disclaimer modal, cookie-based session token management, and layout polish.",
    changes: [
      {
        type: "feat",
        description:
          "Introduced user disclaimer modal dialog and privacy policy updates.",
      },
      {
        type: "feat",
        description:
          "Implemented secure cookie token management for authenticated TMDB actions.",
      },
      {
        type: "ui",
        description:
          "Added film type tab switcher on user profile collection views.",
      },
    ],
  },
  {
    version: "1.6.5",
    title: "Media Streaming Integration & Crew Carousels",
    releaseDate: "2025-02-25",
    summary:
      "Built-in streaming media player with server selection, watch history, and crew image sliders.",
    changes: [
      {
        type: "feat",
        description:
          "Integrated film streaming player with server selection and episode watch history.",
      },
      {
        type: "feat",
        description:
          "Added image carousel modal for actor and crew photo exploration.",
      },
      {
        type: "feat",
        description:
          "Enhanced film director component to support multiple directors.",
      },
    ],
  },
  {
    version: "1.6.2",
    title: "SWR Profile Sync & Pluralize Library",
    releaseDate: "2025-01-30",
    summary:
      "SWR live profile data updates, pluralize utility integration, and keyboard autocomplete enhancements.",
    changes: [
      {
        type: "refactor",
        description:
          "Integrated SWR for continuously updated user profile collections.",
      },
      {
        type: "feat",
        description:
          "Updated search input text dynamically when cycling through autocomplete results.",
      },
      {
        type: "refactor",
        description:
          "Replaced custom plural utilities with standard pluralize library.",
      },
    ],
  },
  {
    version: "1.6.0",
    title: "Smart Autocomplete Search Box",
    releaseDate: "2025-01-28",
    summary:
      "Instant autocomplete search bar with keyboard arrow selection and debounced querying.",
    changes: [
      {
        type: "feat",
        description:
          "Built search bar autocomplete dropdown fetching live movie and TV matches.",
      },
      {
        type: "feat",
        description:
          "Added full keyboard arrow navigation for dropdown suggestions.",
      },
      {
        type: "perf",
        description:
          "Optimized search input debounce timing to eliminate redundant API calls.",
      },
    ],
  },
  {
    version: "1.5.0",
    title: "Performance Polish & Native Web Share",
    releaseDate: "2025-01-13",
    summary:
      "Optimized layout responsiveness, smoother modal transitions, and native sharing capabilities.",
    changes: [
      {
        type: "ui",
        description:
          "Implemented skeleton loaders for person details and media preview dialogs.",
      },
      {
        type: "feat",
        description:
          "Added native device sharing via Web Share API on mobile viewports.",
      },
      {
        type: "perf",
        description:
          "Replaced heavy scroll reveal animations with performant CSS transitions.",
      },
    ],
  },

  // ==========================================
  // --- 2024 Milestones ---
  // ==========================================
  {
    version: "1.4.8",
    title: "Desktop Filter Drawer & Responsive Layout",
    releaseDate: "2024-11-08",
    summary:
      "Collapsible desktop filter sidebar, refined reset controls, and responsive image quality scaling.",
    changes: [
      {
        type: "ui",
        description:
          "Added toggleable filter sidebar menu for desktop search views.",
      },
      {
        type: "refactor",
        description:
          "Streamlined filter reset button behavior to cleanly reset input states.",
      },
      {
        type: "perf",
        description:
          "Optimized image resolution scaling for mobile and desktop viewports.",
      },
    ],
  },
  {
    version: "1.4.5",
    title: "Release Localization & Fetch Optimization",
    releaseDate: "2024-07-01",
    summary:
      "Precise theatrical versus digital release tracking and asynchronous data fetching improvements.",
    changes: [
      {
        type: "feat",
        description:
          "Added release date classification distinguishing theatrical, digital, and physical release windows.",
      },
      {
        type: "perf",
        description:
          "Optimized data pipeline using parallel Promise fetching across feed sections.",
      },
      {
        type: "fix",
        description:
          "Fixed localized release date resolution based on user country headers.",
      },
    ],
  },
  {
    version: "1.4.2",
    title: "Zustand Store Architecture & State Management",
    releaseDate: "2024-04-13",
    summary:
      "Migrated global client state to lightweight Zustand stores and added open source licensing.",
    changes: [
      {
        type: "refactor",
        description:
          "Replaced Redux Toolkit with lightweight Zustand store architecture.",
      },
      {
        type: "fix",
        description:
          "Resolved redirect issues when closing person and media modal dialogs.",
      },
      {
        type: "feat",
        description:
          "Added MIT open-source license documentation.",
      },
    ],
  },
  {
    version: "1.4.0",
    title: "TMDB Authentication, Ratings & Watchlist",
    releaseDate: "2024-03-24",
    summary:
      "Initial personal account features including TMDB session login, 10-star rating, and watchlist management.",
    changes: [
      {
        type: "feat",
        description:
          "Integrated TMDB user authentication and session management via secure API routes.",
      },
      {
        type: "feat",
        description:
          "Introduced 10-star media rating capability with score formatting.",
      },
      {
        type: "feat",
        description:
          "Added personal Watchlist and Favorites collections with instant toggles.",
      },
    ],
  },
  {
    version: "1.3.0",
    title: "Next.js 14 App Router Migration",
    releaseDate: "2024-02-26",
    summary:
      "Structural migration to Next.js 14 App Router with Suspense boundaries and refreshed design system tokens.",
    changes: [
      {
        type: "refactor",
        description:
          "Migrated codebase to Next.js 14 App Router with React Server Components.",
      },
      {
        type: "perf",
        description:
          "Wrapped dynamic query-dependent components in React Suspense boundaries.",
      },
      {
        type: "ui",
        description:
          "Updated base theme tokens and consolidated layout typography.",
      },
    ],
  },
  {
    version: "1.2.0",
    title: "Interactive Hover Previews & Countdown Timers",
    releaseDate: "2024-01-13",
    summary:
      "Rich media hover previews with background playback and release countdown calculations.",
    changes: [
      {
        type: "feat",
        description:
          "Implemented interactive hover preview card displaying synopsis, rating, and trailer playback.",
      },
      {
        type: "feat",
        description:
          "Added dynamic countdown calculations for upcoming cinema releases.",
      },
      {
        type: "feat",
        description:
          "Added keyboard navigation support for TV series episodes.",
      },
    ],
  },
  {
    version: "1.1.8",
    title: "Multi-Search & JSON-LD Structured Reviews",
    releaseDate: "2024-01-09",
    summary:
      "Unified multi-search matching movies, shows, and people, with Schema.org aggregate review ratings.",
    changes: [
      {
        type: "feat",
        description:
          "Built multi-search query matching movies, TV shows, and cast members simultaneously.",
      },
      {
        type: "feat",
        description:
          "Injected JSON-LD aggregate rating microdata for search engines.",
      },
      {
        type: "feat",
        description:
          "Added grid recommendation section with infinite auto loading.",
      },
    ],
  },

  // ==========================================
  // --- 2023 Milestones ---
  // ==========================================
  {
    version: "1.1.5",
    title: "Advanced Discovery Filters & Person Credits",
    releaseDate: "2023-12-28",
    summary:
      "In-depth discovery filters by TV networks, production companies, cast filmographies, and infinite scroll.",
    changes: [
      {
        type: "feat",
        description:
          "Added filter parameters for TV broadcast networks, series status, and company productions.",
      },
      {
        type: "feat",
        description:
          "Built cast and crew filmography preview modal with role-based credits.",
      },
      {
        type: "feat",
        description:
          "Implemented infinite scroll pagination on search and media discovery feeds.",
      },
      {
        type: "perf",
        description:
          "Added dynamic XML sitemap generation indexing media and person pages.",
      },
    ],
  },
  {
    version: "1.1.4",
    title: "Redesigned Home, Search & Details UI",
    releaseDate: "2023-12-20",
    summary:
      "Visual redesign of home page, search sidebar with react-select, and polished film detail layouts.",
    changes: [
      {
        type: "ui",
        description:
          "Redesigned homepage, search page, and film detail layouts with polished dark aesthetics.",
      },
      {
        type: "refactor",
        description:
          "Integrated react-select for search filter dropdowns with keyboard support.",
      },
      {
        type: "feat",
        description:
          "Added live countdown for upcoming movie releases.",
      },
    ],
  },
  {
    version: "1.1.2",
    title: "Full Server-Side Rendering & Global Search Bar",
    releaseDate: "2023-12-11",
    summary:
      "Server-side data fetching enhancements, slugify URL helpers, and global search bar in navigation.",
    changes: [
      {
        type: "feat",
        description:
          "Integrated search input bar into top navigation bar with auto-routing.",
      },
      {
        type: "perf",
        description:
          "Converted media detail data fetching to full server-side rendering.",
      },
      {
        type: "feat",
        description:
          "Added initial PWA web app manifest install prompt support.",
      },
    ],
  },
  {
    version: "1.1.0",
    title: "Regional Streaming Providers & Recommendations",
    releaseDate: "2023-10-19",
    summary:
      "Watch provider availability based on visitor location and media recommendation carousels.",
    changes: [
      {
        type: "feat",
        description:
          "Integrated regional watch providers showing streaming, rental, and purchase platforms by country.",
      },
      {
        type: "feat",
        description:
          "Built recommendations carousel suggesting similar titles based on TMDB metadata.",
      },
      {
        type: "feat",
        description:
          "Added Schema.org microdata for movie directors, actors, and production studios.",
      },
    ],
  },
  {
    version: "1.0.8",
    title: "TV Series Collections & Season Selector",
    releaseDate: "2023-09-02",
    summary:
      "TV series collection explorer with season selectors, episode overviews, and date sorting.",
    changes: [
      {
        type: "feat",
        description:
          "Added TV series collection explorer with multi-season switcher and episode overviews.",
      },
      {
        type: "ui",
        description:
          "Added active state indicators for selected TV series seasons.",
      },
      {
        type: "perf",
        description:
          "Optimized season data payload limits for faster rendering.",
      },
    ],
  },
  {
    version: "1.0.5",
    title: "SEO, Microdata & Screen Reader Accessibility",
    releaseDate: "2023-08-25",
    summary:
      "Search engine optimization with Schema.org JSON-LD structured data and screen reader support.",
    changes: [
      {
        type: "feat",
        description:
          "Injected Schema.org JSON-LD structured microdata for rich search engine result snippets.",
      },
      {
        type: "feat",
        description:
          "Added screen reader support and semantic HTML structure across cards and navigation.",
      },
      {
        type: "ui",
        description:
          "Introduced skeleton loading placeholders across sliders, cards, and detail sections.",
      },
    ],
  },
  {
    version: "1.0.2",
    title: "Film Details Layout & Mobile Viewport Updates",
    releaseDate: "2023-08-09",
    summary:
      "Updated media details layout, responsive mobile poster scaling, and rating display formatting.",
    changes: [
      {
        type: "ui",
        description:
          "Updated film details layout with responsive mobile viewport adjustments.",
      },
      {
        type: "feat",
        description:
          "Added rating badge overlay directly on media card posters.",
      },
      {
        type: "feat",
        description:
          "Added initial watch provider platforms section.",
      },
    ],
  },
  {
    version: "1.0.0",
    title: "The Genesis: Initial Launch",
    releaseDate: "2023-07-01",
    isMajor: true,
    summary:
      "The initial launch of Popcorn Vision as a modern web application for discovering movies and TV series.",
    changes: [
      {
        type: "feat",
        description:
          "Launched core platform with TMDb API integration covering movies and TV series catalog.",
      },
      {
        type: "feat",
        description:
          "Built trending hero slider, category rows, and dedicated media detail pages.",
      },
      {
        type: "feat",
        description:
          "Integrated official YouTube trailer playback and responsive navigation.",
      },
    ],
  },
  {
    version: "0.1.0",
    title: "Project Conception & Architecture Prototype",
    releaseDate: "2023-02-17",
    summary:
      "Initial project conception, domain modeling, and technical prototype exploration for tracking movies and television shows.",
    changes: [
      {
        type: "feat",
        description:
          "Established project concept and technical architecture design for TMDB movie discovery.",
      },
      {
        type: "feat",
        description:
          "Prototyped core data schemas for media catalogs, watch status, and rating models.",
      },
    ],
  },
] as const;

export function getLatestMilestone(): ChangelogMilestone {
  return CHANGELOG_MILESTONES[0];
}
