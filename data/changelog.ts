export type ChangelogType = "feat" | "fix" | "perf" | "refactor" | "ui";

export interface ChangelogItem {
  type: ChangelogType;
  title: string;
  description?: string;
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
    version: "2.12.1",
    title: "Changelog Responsive Layout & Performance Improvements",
    releaseDate: "2026-10-04",
    isLatest: true,
    summary:
      "Enhanced responsive formatting for changelog milestone cards across all mobile and desktop viewports, and improved overall app speed and responsiveness.",
    changes: [
      {
        type: "ui",
        title: "Changelog Timeline Layout",
        description:
          "Refined milestone card layout to prevent badge cramping and text overflow on smaller screens.",
      },
      {
        type: "perf",
        title: "App Performance",
        description:
          "Improved overall app responsiveness and faster page transitions throughout the platform.",
      },
    ],
  },
  {
    version: "2.12.0",
    title: "Instant Cloud Cache & Lightning-Fast Discovery",
    releaseDate: "2026-10-04",
    summary:
      "Experience near-instant cross-device media discovery. Movies, TV shows, and cast filmographies now load in milliseconds for everyone worldwide.",
    changes: [
      {
        type: "perf",
        title: "Instant Movie Details",
        description:
          "Exploring movies, TV shows, and cast pages now loads near-instantly with zero delay.",
      },
      {
        type: "perf",
        title: "Fresh & Adaptive Content",
        description:
          "Automated smart background refresh ensures trending charts, upcoming releases, and ratings always stay current.",
      },
      {
        type: "ui",
        title: "Zero-Latency Browsing",
        description:
          "Drastically reduced initial loading times across all media categories, seasons, and actor filmographies.",
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
        title: "Instant Page Revisits",
        description:
          "Previously viewed movies, series, and people now open immediately without waiting for loading animations.",
      },
      {
        type: "perf",
        title: "High-Speed Artwork Delivery",
        description:
          "High-resolution posters and backdrops now stream directly from global delivery networks for crisper visuals.",
      },
      {
        type: "ui",
        title: "Flicker-Free Navigation",
        description:
          "Eliminated page loading flickers when navigating back and forth between the discovery feed and media details.",
      },
      {
        type: "refactor",
        title: "Optimized Background Sync",
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
        title: "In-App Release Notes Hub (/changelog)",
        description:
          "Added dedicated changelog page with chronological milestone cards and detailed update summaries.",
      },
      {
        type: "feat",
        title: "Interactive What's New Dialog",
        description:
          "Implemented interactive modal dialog with shareable links and seamless back-button support.",
      },
      {
        type: "feat",
        title: "Quick Release Notes Links",
        description:
          "Integrated release notes links in the footer version badge, desktop user menu, and mobile drawer.",
      },
      {
        type: "ui",
        title: "Accessible Milestone Cards",
        description:
          "Crafted high-contrast, accessible milestone cards with semantic status badges and responsive layout.",
      },
    ],
  },
  {
    version: "2.9.0",
    title: "Progressive Web App, Web Push & Offline Support",
    releaseDate: "2026-09-27",
    summary:
      "Transforming Popcorn Vision into a full Progressive Web App with background push notifications and reliable offline caching.",
    changes: [
      {
        type: "feat",
        title: "Offline Resilience & Caching",
        description:
          "Added offline resilience and faster page loading when exploring movies without an internet connection.",
      },
      {
        type: "feat",
        title: "Browser Push Notifications",
        description:
          "Receive timely alerts and notifications directly through your browser.",
      },
      {
        type: "perf",
        title: "Visual Page Loading Feedback",
        description:
          "Added top progress bar for smooth and clear page loading feedback.",
      },
      {
        type: "fix",
        title: "Mobile Viewport Stability",
        description:
          "Resolved WebView launch flickering and mobile restart issues.",
      },
    ],
  },
  {
    version: "2.8.0",
    title: "Instant Browsing & UI Performance Polish",
    releaseDate: "2026-09-17",
    summary:
      "Major performance optimizations for faster screen loading, instant search responses, and smoother browsing.",
    changes: [
      {
        type: "perf",
        title: "Smart Data Caching",
        description:
          "Instant browsing with smart data caching so your favorite lists and media load immediately.",
      },
      {
        type: "refactor",
        title: "Modular UI Architecture",
        description:
          "Smoother scrolling and improved app responsiveness across all screens.",
      },
      {
        type: "perf",
        title: "Fast Initial Page Loads",
        description:
          "Accelerated initial page load times across all media routes.",
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
        title: "Live Release Countdown Timers",
        description:
          "Added live countdown timers for upcoming cinema releases and scheduled TV episodes.",
      },
      {
        type: "feat",
        title: "Automatic Scroll to Top",
        description:
          "Smooth automatic scroll-to-top whenever you navigate to a new page.",
      },
      {
        type: "ui",
        title: "Harmonized Status Badges",
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
        title: "Guest Mode Exploration",
        description:
          "Enabled Guest Mode allowing visitors to maintain a local watchlist and watch progress without logging in.",
      },
      {
        type: "feat",
        title: "Global Keyboard Shortcuts",
        description:
          "Introduced global keyboard navigation shortcuts including Cmd/Ctrl+K and the shortcuts dialog.",
      },
      {
        type: "ui",
        title: "Offline Status Indicator",
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
        title: "Mobile Bottom Navigation Bar",
        description:
          "Overhauled mobile bottom navigation bar and desktop header UX for easier one-handed use.",
      },
      {
        type: "feat",
        title: "Rich Text Reviews",
        description:
          "Added rich text styling support for your written media reviews.",
      },
      {
        type: "ui",
        title: "Expandable Movie Overviews",
        description:
          "Expandable synopsis descriptions so you can read full movie overviews comfortably on mobile.",
      },
    ],
  },
  {
    version: "2.4.0",
    title: "TMDB Reviews & Instant Chat Workspaces",
    releaseDate: "2026-08-22",
    summary:
      "Integration of community TMDB reviews, media gallery players, and snappy chat messaging.",
    changes: [
      {
        type: "feat",
        title: "Community Reviews & Video Players",
        description:
          "Integrated TMDB community reviews and media gallery video players.",
      },
      {
        type: "feat",
        title: "Snappy Messaging Interactions",
        description:
          "Instant messaging interactions with immediate message delivery feedback.",
      },
      {
        type: "feat",
        title: "Spotlight Search Overlay",
        description:
          "Added instant Spotlight search overlay triggered via keyboard shortcuts.",
      },
    ],
  },
  {
    version: "2.3.0",
    title: "Shareable Dialog Links & Push Notifications",
    releaseDate: "2026-08-08",
    summary:
      "Deep-linked quick view dialogs and browser Web Push notification infrastructure.",
    changes: [
      {
        type: "feat",
        title: "Shareable Dialog Links",
        description:
          "Share quick view and login dialogs directly via links with seamless back-button support.",
      },
      {
        type: "feat",
        title: "Real-Time Push Alerts",
        description:
          "Receive real-time push notification alerts for new activity, mentions, and friend requests.",
      },
      {
        type: "perf",
        title: "Placeholder Loading Skeletons",
        description:
          "Media feeds now display clean placeholder animations while loading.",
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
        title: "Production Company Profiles",
        description:
          "Created dedicated production company profile pages with complete movie and show catalogs.",
      },
      {
        type: "feat",
        title: "Admin User Console",
        description:
          "Introduced Admin User Management console and role assignment features.",
      },
      {
        type: "ui",
        title: "Role & Permission Badges",
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
        title: "Actor Quick View Dialog",
        description:
          "Built Person quick view modal for instant actor and crew exploration.",
      },
      {
        type: "feat",
        title: "Bulk Diary Deletion",
        description:
          "Added Diary selection mode allowing bulk watch log deletions.",
      },
      {
        type: "feat",
        title: "Dynamic Currency Conversion",
        description:
          "Automatic currency conversion for box office figures in your preferred currency.",
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
        title: "Real-Time Cloud Synchronization",
        description:
          "Real-time synchronization across all your devices for watchlist, ratings, and social interactions.",
      },
      {
        type: "feat",
        title: "Enhanced Account Security",
        description:
          "Fast, secure sign-in with Google and email with enhanced account privacy.",
      },
      {
        type: "feat",
        title: "Direct & Group Messaging",
        description:
          "Built real-time messaging system supporting 1-on-1 direct chats, group channels, and media card attachments.",
      },
      {
        type: "feat",
        title: "Collaborative Lists & Discussions",
        description:
          "Created custom and collaborative media list system with community upvoting and discussions.",
      },
      {
        type: "feat",
        title: "Social Activity Feed & Diary",
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
    title: "Shareable Links & Navigation Improvements",
    releaseDate: "2025-12-16",
    summary:
      "Share search results and media views easily with instant browser history and shareable link support.",
    changes: [
      {
        type: "refactor",
        title: "Shareable Search & Media Links",
        description:
          "Reliable shareable links for media popups and search filters.",
      },
      {
        type: "refactor",
        title: "Fast Discovery Feeds",
        description:
          "Faster and more reliable connection when loading media discovery feeds.",
      },
      {
        type: "ui",
        title: "Backdrop Blur Navbar",
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
        title: "International & Local Release Dates",
        description:
          "Added dual release date tracking comparing international premieres with country-specific dates.",
      },
      {
        type: "refactor",
        title: "Smooth Modal Routing",
        description:
          "Improved URL routing when opening popup media and person modals.",
      },
      {
        type: "fix",
        title: "Mobile Tooltip Responsiveness",
        description:
          "Enhanced tooltip responsiveness on mobile viewport touch interactions.",
      },
    ],
  },
  {
    version: "1.7.5",
    title: "Add to Calendar & Sharing Enhancements",
    releaseDate: "2025-05-06",
    summary:
      "Calendar scheduling integration for movie and TV premieres, and unified sharing buttons.",
    changes: [
      {
        type: "feat",
        title: "Add to Calendar Reminders",
        description:
          "Schedule calendar reminders for upcoming film and episode premieres with one click.",
      },
      {
        type: "refactor",
        title: "Optimized App Delivery",
        description:
          "Optimized app build processes for faster delivery of new features.",
      },
      {
        type: "ui",
        title: "Unified Share Controls",
        description:
          "Unified mobile and desktop share button logic and button sizing.",
      },
    ],
  },
  {
    version: "1.7.0",
    title: "Disclaimer Modal & Session Security",
    releaseDate: "2025-04-07",
    summary:
      "User disclaimer modal, secure session management, and collection view layout polish.",
    changes: [
      {
        type: "feat",
        title: "User Disclaimer & Privacy",
        description:
          "Introduced user disclaimer modal dialog and privacy policy updates.",
      },
      {
        type: "feat",
        title: "Seamless Account Connection",
        description:
          "Secure, seamless account connection for syncing your ratings and watchlist.",
      },
      {
        type: "ui",
        title: "Collection Tab Switcher",
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
        title: "Built-In Media Streaming",
        description:
          "Integrated film streaming player with server selection and episode watch history.",
      },
      {
        type: "feat",
        title: "Cast & Crew Photo Carousel",
        description:
          "Added image carousel modal for actor and crew photo exploration.",
      },
      {
        type: "feat",
        title: "Multi-Director Support",
        description:
          "Enhanced film director component to support multiple directors.",
      },
    ],
  },
  {
    version: "1.6.2",
    title: "Live Profile Sync & Search Autocomplete",
    releaseDate: "2025-01-30",
    summary:
      "Live profile collection updates, polished phrasing, and keyboard autocomplete enhancements.",
    changes: [
      {
        type: "refactor",
        title: "Instant Profile Updates",
        description:
          "Real-time profile updates that automatically refresh your watchlist and collection counts.",
      },
      {
        type: "feat",
        title: "Dynamic Search Autocomplete",
        description:
          "Updated search input text dynamically when cycling through autocomplete results.",
      },
      {
        type: "refactor",
        title: "Polished Collection Labels",
        description:
          "Polished wording and counter labels across all collections.",
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
        title: "Live Autocomplete Search",
        description:
          "Built search bar autocomplete dropdown fetching live movie and TV matches.",
      },
      {
        type: "feat",
        title: "Keyboard Arrow Navigation",
        description:
          "Added full keyboard arrow navigation for dropdown suggestions.",
      },
      {
        type: "perf",
        title: "Fast Search Responsiveness",
        description:
          "Optimized search responsiveness and eliminated unnecessary network requests.",
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
        title: "Smooth Loading Placeholders",
        description:
          "Implemented clean skeleton placeholders for person details and media preview dialogs.",
      },
      {
        type: "feat",
        title: "Native Mobile Sharing",
        description:
          "One-tap native sharing to apps and messages on mobile devices.",
      },
      {
        type: "perf",
        title: "Snappy Animations & Scrolling",
        description:
          "Smoother animations and snappier scrolling on all devices.",
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
        title: "Desktop Filter Sidebar",
        description:
          "Added toggleable filter sidebar menu for desktop search views.",
      },
      {
        type: "refactor",
        title: "Clean Filter Reset",
        description:
          "Streamlined filter reset button behavior to cleanly reset input states.",
      },
      {
        type: "perf",
        title: "Adaptive Image Resolution",
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
        title: "Release Window Classification",
        description:
          "Added release date classification distinguishing theatrical, digital, and physical release windows.",
      },
      {
        type: "perf",
        title: "Parallel Feed Fetching",
        description:
          "Faster feed loading speeds across all movie and TV show sections.",
      },
      {
        type: "fix",
        title: "Localized Release Dates",
        description:
          "Accurate localized release dates based on your country and region.",
      },
    ],
  },
  {
    version: "1.4.2",
    title: "Smooth State Management & Open Source Release",
    releaseDate: "2024-04-13",
    summary:
      "Lightweight app state management, MIT open source licensing, and dialog fix.",
    changes: [
      {
        type: "refactor",
        title: "Lightweight State Architecture",
        description:
          "Snappier app performance and reduced battery usage during extended browsing.",
      },
      {
        type: "fix",
        title: "Modal Navigation Fixes",
        description:
          "Resolved navigation issues when closing person and media modal dialogs.",
      },
      {
        type: "feat",
        title: "Open Source Documentation",
        description:
          "Published open-source license documentation.",
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
        title: "TMDB Account Synchronization",
        description:
          "Connect your TMDB account to sync watchlists and favorite movies.",
      },
      {
        type: "feat",
        title: "10-Star Rating System",
        description:
          "Rate movies and shows on a 1-to-10 star scale with average community scores.",
      },
      {
        type: "feat",
        title: "Watchlist & Favorites",
        description:
          "Added personal Watchlist and Favorites collections with instant 1-click toggles.",
      },
    ],
  },
  {
    version: "1.3.0",
    title: "Modern Platform Upgrade & Refreshed Design System",
    releaseDate: "2024-02-26",
    summary:
      "Upgraded core foundation for faster page loads and a refined visual theme.",
    changes: [
      {
        type: "refactor",
        title: "Fast App Foundation",
        description:
          "Faster initial load times and smoother navigation across all pages.",
      },
      {
        type: "perf",
        title: "Visual Placeholders",
        description:
          "Instant visual placeholders while media data is being fetched.",
      },
      {
        type: "ui",
        title: "Refined Theme & Typography",
        description:
          "Updated base theme colors and typography for a cleaner, modern look.",
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
        title: "Interactive Hover Previews",
        description:
          "Interactive hover preview card displaying synopsis, rating, and trailer playback.",
      },
      {
        type: "feat",
        title: "Premiere Countdown Timers",
        description:
          "Dynamic countdown timers for upcoming cinema releases.",
      },
      {
        type: "feat",
        title: "Episode Keyboard Navigation",
        description:
          "Easy keyboard navigation support for TV series episodes.",
      },
    ],
  },
  {
    version: "1.1.8",
    title: "Multi-Search & Structured Review Scores",
    releaseDate: "2024-01-09",
    summary:
      "Unified multi-search matching movies, shows, and people, with search engine review integration.",
    changes: [
      {
        type: "feat",
        title: "Unified Multi-Search",
        description:
          "Multi-search query matching movies, TV shows, and cast members simultaneously.",
      },
      {
        type: "feat",
        title: "Rich Review Snippets",
        description:
          "Enhanced search engine snippets with aggregate ratings.",
      },
      {
        type: "feat",
        title: "Grid Recommendations",
        description:
          "Added grid recommendation section with smooth auto loading.",
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
        title: "Network & Studio Filters",
        description:
          "Filter by TV broadcast networks, series status, and production studios.",
      },
      {
        type: "feat",
        title: "Cast Filmography Explorer",
        description:
          "Cast and crew filmography explorer with comprehensive role-based credits.",
      },
      {
        type: "feat",
        title: "Infinite Discovery Scroll",
        description:
          "Seamless infinite scroll on search and media discovery feeds.",
      },
      {
        type: "perf",
        title: "Search Discovery Indexing",
        description:
          "Enhanced search discovery indexing for movie and actor profiles.",
      },
    ],
  },
  {
    version: "1.1.4",
    title: "Redesigned Home, Search & Details UI",
    releaseDate: "2023-12-20",
    summary:
      "Visual redesign of home page, search sidebar, and polished film detail layouts.",
    changes: [
      {
        type: "ui",
        title: "Dark Aesthetic Redesign",
        description:
          "Redesigned homepage, search page, and film detail layouts with polished dark aesthetics.",
      },
      {
        type: "refactor",
        title: "Filter Dropdown Navigation",
        description:
          "Smoother search filter dropdowns with keyboard navigation support.",
      },
      {
        type: "feat",
        title: "Movie Release Countdowns",
        description:
          "Added live countdown for upcoming movie releases.",
      },
    ],
  },
  {
    version: "1.1.2",
    title: "Fast Detail Pages & Global Search Bar",
    releaseDate: "2023-12-11",
    summary:
      "Faster detail page loading, clean URLs, and global search bar in navigation.",
    changes: [
      {
        type: "feat",
        title: "Header Search Bar",
        description:
          "Global search bar integrated directly into the navigation header.",
      },
      {
        type: "perf",
        title: "Fast Detail Page Loading",
        description:
          "Media detail pages now load rich preview content even faster.",
      },
      {
        type: "feat",
        title: "Home Screen App Prompt",
        description:
          "Added web app installation prompt support for your home screen.",
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
        title: "Regional Streaming Availability",
        description:
          "Find where to stream, rent, or buy movies and TV shows in your country.",
      },
      {
        type: "feat",
        title: "Smart Title Recommendations",
        description:
          "Recommendations carousel suggesting similar titles you might enjoy.",
      },
      {
        type: "feat",
        title: "Comprehensive Studio & Cast Info",
        description:
          "Rich director, actor, and production studio information.",
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
        title: "TV Series & Season Switcher",
        description:
          "TV series explorer with multi-season switcher and episode overviews.",
      },
      {
        type: "ui",
        title: "Season State Indicators",
        description:
          "Clear visual indicators for selected TV series seasons.",
      },
      {
        type: "perf",
        title: "Optimized Season Payload",
        description:
          "Optimized season details for faster page display.",
      },
    ],
  },
  {
    version: "1.0.5",
    title: "SEO, Accessibility & Smooth Placeholders",
    releaseDate: "2023-08-25",
    summary:
      "Search engine optimization, screen reader accessibility, and smooth loading placeholders.",
    changes: [
      {
        type: "feat",
        title: "Search Engine Optimization",
        description:
          "Enhanced search engine results and preview cards.",
      },
      {
        type: "feat",
        title: "Accessibility & Keyboard Support",
        description:
          "Full screen reader accessibility and keyboard support across cards and navigation.",
      },
      {
        type: "ui",
        title: "Smooth Loading Placeholders",
        description:
          "Smooth placeholder animations across sliders, cards, and detail sections.",
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
        title: "Responsive Film Details",
        description:
          "Updated film details layout with responsive mobile viewport adjustments.",
      },
      {
        type: "feat",
        title: "Poster Rating Overlay",
        description:
          "Rating badge overlay directly on media card posters.",
      },
      {
        type: "feat",
        title: "Streaming Platform Guides",
        description:
          "Where-to-watch streaming platforms section.",
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
        title: "Comprehensive Media Catalog",
        description:
          "Explore a rich catalog of movies and TV series with real-time ratings and synopses.",
      },
      {
        type: "feat",
        title: "Trending Hero & Categories",
        description:
          "Trending hero carousel, category discovery rows, and dedicated media detail pages.",
      },
      {
        type: "feat",
        title: "Official Trailers & Media",
        description:
          "Official YouTube trailer playback and responsive navigation.",
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
        title: "Technical Prototype",
        description:
          "Established project concept and technical architecture design for TMDB movie discovery.",
      },
      {
        type: "feat",
        title: "Media Catalog Schemas",
        description:
          "Prototyped core data schemas for media catalogs, watch status, and rating models.",
      },
    ],
  },
] as const;

export function getLatestMilestone(): ChangelogMilestone {
  return CHANGELOG_MILESTONES[0];
}
