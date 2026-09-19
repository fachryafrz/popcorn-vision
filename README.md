# 🍿 Popcorn Vision

<div align="center">

**Movie & TV Show Discovery, Streaming Tracker, Watchlist, Ratings & Social Platform**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Convex](https://img.shields.io/badge/Convex-Backend-f34e3a?style=flat-square)](https://convex.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-Authentication-black?style=flat-square)](https://better-auth.com/)
[![TMDB](https://img.shields.io/badge/TMDB-API-01d277?style=flat-square&logo=themoviedatabase)](https://www.themoviedb.org/)
[![Web Push](https://img.shields.io/badge/Web_Push-Notifications-orange?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)

</div>

---

## 🌟 Overview

**Popcorn Vision** is a modern, responsive web application for movie and TV show discovery, streaming tracking, personal watchlists, viewing diaries, 10-star ratings, and rich community social features.

Built on **Next.js 16 (App Router)** and **React 19**, powered by a real-time reactive **Convex Backend**, and integrated with **The Movie Database (TMDB) API**, Popcorn Vision allows film and television enthusiasts to explore rich catalogs, log what they watch, collaborate on custom lists, and interact with friends in real time.

---

## ✨ Key Features

- 🎬 **Extensive Film & TV Discovery (TMDB):** Explore trending, popular, top-rated, and upcoming titles with dynamic hero backdrops, official trailers, cast & crew credits, streaming providers, and advanced multi-filter search.
- 🔖 **Watchlist, Favorites & Continue Watching:** One-click addition to personal Watchlist and Favorites, with granular season and episode-level tracking for in-progress TV series.
- ⭐ **10-Star Ratings & Community Scoring:** Rate any title on a 1-to-10 scale with aggregate community scores computed in real time.
- 📖 **Viewing Diary & Review Logging:** Log watched entries with custom watch dates, rewatch flags, runtime tracking, and personal written reviews across movies, series, seasons, or individual episodes.
- 📋 **Custom & Collaborative Media Lists:** Create public, private, or collaborative curated lists with upvoting, comment threads, likes, and direct sharing.
- 👥 **Real-Time Social Feed & Friendship:** Follow friends' viewing activity, share reviews, like and comment with threaded replies, and manage friend requests.
- 💬 **Real-Time Direct & Group Messaging:** Chat 1-on-1 or in groups with live typing indicators, read receipts, and rich movie/TV/list card attachments.
- 📥 **Letterboxd & IMDb Data Import:** Multi-step CSV import wizard with automated TMDB title matching to migrate watch history effortlessly.
- 🔔 **Notification Center & Web Push API:** In-app notification center and automated browser push notifications for friend requests, mentions, comments, and messages.
- 👤 **Custom Profiles & Privacy Controls:** Personalize bios, avatars with built-in crop tools, and configure granular privacy toggles for watchlists, ratings, and diaries.

---

## 📂 Repository Structure

```text
popcorn-vision/
├── app/
│   ├── (chat)/         # Real-time direct & group messaging workspace
│   ├── (main)/         # Discovery feeds, media details, lists, diary, profiles
│   ├── api/            # API route handlers & Web Push subscription endpoints
│   └── layout.tsx      # Root application layout, theme providers, and modals
├── components/
│   ├── chat/           # Chat window, conversation feed, media card attachments
│   ├── ui/             # Reusable UI primitives (Base UI, Radix, shadcn/ui)
│   └── *.tsx           # Feature components (hero, cards, modals, activity feeds)
├── convex/             # Reactive Convex backend (schema, mutations, queries, push)
├── hooks/              # Custom React hooks (modals, search overlays, web push)
├── lib/                # TMDB server actions, Better Auth client, date formatters
└── public/             # Static icons, banners, and service workers
```

---

## 🛠️ Tech Stack

- **Frontend Framework:** [Next.js 16](https://nextjs.org) (App Router), [React 19](https://react.dev)
- **Styling & UI:** [Tailwind CSS v4](https://tailwindcss.com), [tw-animate-css](https://github.com/themarcusking/tw-animate-css), [shadcn/ui](https://ui.shadcn.com), [Base UI](https://base-ui.com), [Lucide React](https://lucide.dev)
- **Carousels & Sliders:** [Embla Carousel](https://www.embla-carousel.com), [Swiper](https://swiperjs.com)
- **Backend & Database:** [Convex](https://convex.dev) real-time reactive database and background actions
- **Authentication:** [Better Auth](https://better-auth.com) with Convex adapter (`@convex-dev/better-auth`)
- **Third-Party APIs:** [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api) via Next.js Server Actions
- **State & URL Management:** [Zustand](https://zustand-demo.pmnd.rs), [nuqs](https://nuqs.47ng.com)
- **Notifications:** Web Push API & Service Workers

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** `>= 20.0.0`
- **pnpm** `>= 9.0.0`

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/fachryafrz/popcorn-vision.git
cd popcorn-vision

# Install project dependencies
pnpm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Convex Deployment
CONVEX_DEPLOYMENT=...
NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://...convex.site

# Application & Authentication
SITE_URL=http://localhost:3000
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
RESEND_API_KEY=...

# The Movie Database (TMDB) API
API_URL=https://api.themoviedb.org/3
API_KEY=your_tmdb_api_key
TMDB_API_KEY=your_tmdb_api_key
NEXT_PUBLIC_API_IMAGE_ORIGINAL=https://image.tmdb.org/t/p/original
NEXT_PUBLIC_API_IMAGE_780=https://image.tmdb.org/t/p/w780
NEXT_PUBLIC_API_IMAGE_500=https://image.tmdb.org/t/p/w500
NEXT_PUBLIC_API_IMAGE_342=https://image.tmdb.org/t/p/w342
NEXT_PUBLIC_API_IMAGE_300=https://image.tmdb.org/t/p/w300

# Web Push (VAPID)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:admin@example.com
```

### 3. Start Development Servers

Run Next.js dev server and Convex backend concurrently:

```bash
# Terminal 1: Next.js dev server
pnpm dev

# Terminal 2: Convex backend sync
pnpm convex
```

The web application will be accessible at [http://localhost:3000](http://localhost:3000).

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Start Next.js development server |
| `pnpm convex` | Start Convex backend development and codegen watcher |
| `pnpm build` | Build the Next.js application for production |
| `pnpm start` | Start Next.js production server |
| `pnpm lint` | Run ESLint checks across the codebase |

---

## 📐 Engineering Guidelines

- **Strict TypeScript (Zero `any`):** Explicit interfaces, models, and type definitions across all TMDB payloads, Convex schemas, and UI components.
- **Server Actions for TMDB Security:** All TMDB API calls are encapsulated in Server Actions (`lib/tmdb-actions.ts`) to safeguard credentials and leverage server caching.
- **DRY & Modular Architecture:** Reusable components, hooks, and presentation helpers centralized under `components/` and `lib/`.
- **Semantic Versioning (SemVer):** Project adheres to standard SemVer `MAJOR.MINOR.PATCH` versioning.

---

## 📸 Screenshots

<div align="center">

[![Popcorn Vision Home](https://fachryafrz.com/projects/popcorn-vision/v2/1%20-%20home.png)](https://popcorn.fachryafrz.com)
[![Popcorn Vision Movie Details](https://fachryafrz.com/projects/popcorn-vision/v2/2%20-%20details.png)](https://popcorn.fachryafrz.com)
[![Popcorn Vision TV Details](https://fachryafrz.com/projects/popcorn-vision/v2/3%20-%20search.png)](https://popcorn.fachryafrz.com)
[![Popcorn Vision Search](https://fachryafrz.com/projects/popcorn-vision/v2/4%20-%20profile.png)](https://popcorn.fachryafrz.com)

</div>

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
