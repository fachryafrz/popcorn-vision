# Design System & Visual Guidelines — Popcorn Vision

**Status:** Living Documentation (Derived from Codebase Audit v2.12.5)  
**Last Updated:** October 2026  
**Repository:** [popcorn-vision](file:///f:/Projects/popcorn-vision)

---

## 1. Design Philosophy & Aesthetic Foundation

Popcorn Vision features a dark-first, cinematic aesthetic tailored for media exploration. The UI emphasizes:
- **Cinematic Contrast:** Rich deep backgrounds with high-contrast text and luminous accent highlights.
- **Glassmorphic & Subtle Borders:** Borders use transparent white alphas (`oklch(1 0 0 / 10%)`) rather than hard gray borders.
- **Fluid Animation & Tactility:** Integrated with `tw-animate-css` and custom tactile touch utilities (`active-press`), accompanied by mobile haptic vibration feedback via [hooks/use-haptic.ts](file:///f:/Projects/popcorn-vision/hooks/use-haptic.ts).
- **Mobile-First & Safe-Area Aware:** Strict support for native mobile viewports with safe area padding classes (`pb-safe`, `pt-safe`, `min-h-screen-safe`).

---

## 2. Color Palette & Theming Architecture

The color system is built on Tailwind CSS v4 and modern CSS variables using OKLCH color spaces ([app/globals.css](file:///f:/Projects/popcorn-vision/app/globals.css)).

### 2.1 Core Neutral Tokens
- **Background:** `oklch(0.141 0.005 285.823)` (Deep cinematic charcoal/black)
- **Foreground:** `oklch(0.985 0 0)` (Crisp white)
- **Card / Surface:** `oklch(0.21 0.006 285.885)` (Elevated dark surface)
- **Border:** `oklch(1 0 0 / 10%)` (10% translucent white)
- **Input:** `oklch(1 0 0 / 15%)` (15% translucent white)
- **Muted Foreground:** `oklch(0.705 0.015 286.067)` (Subtle secondary silver text)

### 2.2 Preset Themes (`data-theme`)
The application supports 8 curated preset themes configurable in Settings or via [components/theme-provider.tsx](file:///f:/Projects/popcorn-vision/components/theme-provider.tsx):

| Theme Key | Name / Inspiration | Primary Token (OKLCH) | Ring Accent |
| :--- | :--- | :--- | :--- |
| `dark` (default) | Indigo / Popcorn Blue | `oklch(0.424 0.199 265.638)` | `oklch(0.552 0.016 285.938)` |
| `netflix` | Crimson Red | `oklch(0.52 0.22 25)` | `oklch(0.52 0.22 25)` |
| `hbo` | Regal Purple / Magenta | `oklch(0.55 0.22 310)` | `oklch(0.55 0.22 310)` |
| `disney` | Disney Blue | `oklch(0.55 0.16 235)` | `oklch(0.55 0.16 235)` |
| `prime` | Prime Video Cyan | `oklch(0.65 0.15 210)` | `oklch(0.65 0.15 210)` |
| `letterboxd` | Letterboxd Orange | `oklch(0.66 0.2 38)` | `oklch(0.66 0.2 38)` |
| `cinema` | Golden Popcorn Amber | `oklch(0.76 0.15 85)` | `oklch(0.76 0.15 85)` |
| `sakura` | Sakura Blossom Pink | `oklch(0.62 0.21 350)` | `oklch(0.62 0.21 350)` |

---

## 3. Typography & Spacing Scale

### 3.1 Font Families
- **Sans-Serif (Body & Headings):** Geist Sans and Inter loaded through `next/font/google` in [app/layout.tsx](file:///f:/Projects/popcorn-vision/app/layout.tsx).
- **Monospace (Code & Badges):** Geist Mono.

### 3.2 Border Radii Scale
- Base radius: `--radius: 0.625rem` (10px)
- `radius-sm`: `calc(var(--radius) * 0.6)` (6px)
- `radius-md`: `calc(var(--radius) * 0.8)` (8px)
- `radius-lg`: `var(--radius)` (10px)
- `radius-xl`: `calc(var(--radius) * 1.4)` (14px)
- `radius-2xl`: `calc(var(--radius) * 1.8)` (18px)
- `radius-3xl`: `calc(var(--radius) * 2.2)` (22px)
- `radius-4xl`: `calc(var(--radius) * 2.6)` (26px)

---

## 4. UI Components & Layout Patterns

### 4.1 Primitive Components
The component library sits under [components/ui/](file:///f:/Projects/popcorn-vision/components/ui/) based on shadcn/ui and `@base-ui/react`:
- **Buttons & Badges:** `Button`, `ButtonGroup`, `Badge`, `Toggle`, `ToggleGroup`.
- **Modals & Overlays:** `Dialog`, `Drawer` (Vaul-based bottom sheet for mobile), `Sheet`, `Popover`, `Tooltip`, `AlertDialog`.
- **Form Controls:** `Input`, `Textarea`, `Select`, `NativeSelect`, `InputOTP`, `Checkbox`, `Switch`, `Slider`, `Calendar`.
- **Feedback & Loaders:** `Sonner` (toast notifications), `Spinner`, `Skeleton`, `Progress`.
- **Navigation & Menus:** `DropdownMenu`, `ContextMenu`, `Menubar`, `NavigationMenu`, `Pagination`, `Tabs`.

### 4.2 Composite Feature Components
- **Media Card ([components/card.tsx](file:///f:/Projects/popcorn-vision/components/card.tsx)):** Universal poster card supporting hover actions (quick view, watchlist toggle, favorite toggle, rating overlay), aspect ratio lock, and image error fallbacks.
- **Hero Carousel ([components/hero.tsx](file:///f:/Projects/popcorn-vision/components/hero.tsx)):** Dynamic backdrop banner with smooth crossfade, backdrop logo overlay, and direct trailer preview trigger.
- **Section Shelf ([components/section.tsx](file:///f:/Projects/popcorn-vision/components/section.tsx)):** Horizontal carousel shelf utilizing Embla Carousel or Swiper.
- **Responsive Navigation:** Desktop top navigation bar ([components/navbar.tsx](file:///f:/Projects/popcorn-vision/components/navbar.tsx)) and mobile floating bottom navigation bar ([components/navbar/bottom-nav.tsx](file:///f:/Projects/popcorn-vision/components/navbar/bottom-nav.tsx)).

---

## 5. Mobile & Responsive Layout Rules

1. **Bottom Navigation Offset:** On mobile screens (`< lg`), the main content area has `pb-16` to prevent obstruction by the persistent `BottomNav`.
2. **Safe Area Insets:** For standalone PWA installs or modern iOS Safari viewports, use `@utility pb-safe`, `@utility pt-safe`, and `@utility min-h-screen-safe`.
3. **No Unintentional Text Selection:** In standalone display mode, `-webkit-user-select: none` is applied to eliminate inadvertent text selection during gestures.
4. **Overscroll Behavior:** `overscroll-behavior-y: none` is set on `html, body` to prevent iOS pull-to-refresh rubber-banding inside app containers.

---

## 6. Design Inconsistencies & Observations

- **Light Mode Tokens:** While `:root` defines light variables, the application has no active light theme toggle and explicitly forces dark background tokens across body and layouts.
- **Icon Variety:** Global rules strictly prohibit overusing the `Sparkles` icon. Icons across discovery feeds, lists, and ratings use specific contextual Lucide icons (`Flame`, `Star`, `Film`, `Tv`, `Bookmark`, `Heart`, `Share2`, `MessageSquare`).
