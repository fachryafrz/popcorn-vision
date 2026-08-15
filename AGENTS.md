<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->

# Popcorn Vision - AI Agent Guidelines

## 🌟 Project Overview
Popcorn Vision is a modern, responsive web application for movie and TV show discovery, streaming tracking, watchlists, ratings, and social features.

### Tech Stack
- **Framework:** Next.js 16 (App Router) & React 19
- **Package Manager:** `pnpm` (always use `pnpm` as `pnpm-lock.yaml` is present)
- **Backend & Database:** [Convex](https://convex.dev) (`convex/`)
- **Authentication:** [Better Auth](https://better-auth.com) with Convex integration (`@convex-dev/better-auth`)
- **Styling:** Tailwind CSS v4, `tw-animate-css`
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/), Base UI (`@base-ui/react`), Lucide React icons
- **Carousels / Sliders:** Embla Carousel (`embla-carousel-react`), Swiper
- **State Management & URL State:** Zustand, `nuqs`
- **Third-party APIs:** TMDB API (The Movie Database)

---

## 📋 Core Engineering Rules & Standards

### 1. Strict TypeScript (Zero `any`)
- **NEVER use the `any` type** under any circumstance.
- Create explicit interfaces, type aliases, and generic utilities for all data models, API responses, component props, and Convex schemas.
- Use `unknown` with proper type guards / narrowing if input types are genuinely unpredictable.

### 2. DRY (Don't Repeat Yourself)
- Keep all code, components, utilities, and types reusable and modular.
- Avoid duplicate business logic, API calls, and styling definitions.
- Centralize shared types in dedicated type files or close to their domain models.

### 3. Implementation Planning
- **Always create an implementation plan** before executing complex, multi-file, or architectural modifications.
- Detail the affected components, logic changes, and verification steps.

### 4. Scalability & Directory Conventions
- Maintain a clean and scalable modular structure:
  - `app/`: Next.js App Router pages, layouts, and route handlers.
  - `components/`: Modular, reusable UI and feature-specific components.
  - `convex/`: Convex database schema, queries, mutations, and backend actions.
  - `hooks/`: Reusable custom React hooks.
  - `lib/`: Helper functions, API clients, and shared utilities.
  - `config/`: Application configuration, navigation constants, site metadata.
- Use consistent, descriptive, kebab-case or PascalCase file naming in line with project standards.

---

## ⚡ Next.js 16 & React 19 Conventions
- **Server Components by Default:** Fetch data and render on the server whenever possible. Use `'use client'` only for interactive components, client-side event handlers, or browser APIs.
- **Async Route Parameters:** In Next.js 16, `params` and `searchParams` in page/layout/route handlers are asynchronous (`Promise<Params>`). Always `await` them.
- **Performance & Loading:**
  - Implement granular skeleton loading states per section (e.g., Hero Skeleton, Card Carousel Skeleton) rather than blocking global loaders.
  - Optimize images using `next/image` with appropriate dimensions and aspect ratios.
- **SEO & Metadata:** Include semantic HTML structure (`h1`, `h2`, `main`, `nav`, `section`) and dynamic `generateMetadata` for movie, TV show, and profile pages.

---

## 🗄️ Convex Backend Guidelines
- Always refer to `convex/_generated/ai/guidelines.md` when writing Convex code.
- Define explicit table schemas and validators with `v` from `convex/values` in `convex/schema.ts`.
- Ensure all queries, mutations, and actions are strictly typed with `query`, `mutation`, and `action` wrappers from `./_generated/server`.
- Enforce authentication checks and authorization helpers in Convex functions where required.

---

## 🛠️ Development & CLI Commands
Always use `pnpm` for package operations:

```bash
# Start Next.js development server
pnpm dev

# Start Convex backend sync
pnpm convex
# or: pnpm dlx convex dev

# Build for production
pnpm build

# Run linter
pnpm lint
```
