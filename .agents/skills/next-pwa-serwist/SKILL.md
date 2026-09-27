---
name: next-pwa-serwist
description: Complete guide and setup patterns for Progressive Web Apps (PWA) in Next.js App Router using Serwist and Web Push Notifications.
---

# Next.js App Router PWA with Serwist & Web Push

This skill provides a complete setup pattern for implementing a Progressive Web App (PWA) with Serwist in Next.js App Router (including Next.js 15/16), caching strategies, and Web Push Notifications.

---

## 1. Install Dependencies

```bash
pnpm add @serwist/next serwist
```

---

## 2. Configure `next.config.ts`

Wrap Next.js configuration with `withSerwistInit`. For Next.js 16+, ensure `--webpack` is passed during build when Serwist is enabled:

```ts
// next.config.ts
import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts", // or "src/app/sw.ts"
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development" && process.env.ENABLE_PWA !== "true",
  reloadOnOnline: true,
});

const nextConfig: NextConfig = {
  turbopack: {},
};

export default withSerwist(nextConfig);
```

---

## 3. Create Service Worker (`app/sw.ts` or `src/app/sw.ts`)

```ts
/// <reference lib="webworker" />

import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
  interface NotificationOptions {
    renotify?: boolean;
    vibrate?: number | number[];
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();

// Push Notification Handler
self.addEventListener("push", (event: ExtendableEvent) => {
  const pushEvent = event as PushEvent;
  if (!pushEvent.data) return;

  let data = {
    title: "App Notification",
    body: "You have a new update.",
    url: "/",
  };

  try {
    data = pushEvent.data.json();
  } catch {
    data.body = pushEvent.data.text();
  }

  pushEvent.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/images/v1/logo/web-app-manifest-192x192.png",
      badge: "/images/v1/logo/web-app-manifest-192x192.png",
      data: { url: data.url },
    })
  );
});

// Notification Click Handler
self.addEventListener("notificationclick", (event: ExtendableEvent) => {
  const notificationEvent = event as NotificationEvent;
  notificationEvent.notification.close();
  const targetUrl = (notificationEvent.notification.data as { url?: string })?.url || "/";

  notificationEvent.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        const win = client as WindowClient;
        if (win.url && "focus" in win) {
          if ("navigate" in win) win.navigate(targetUrl);
          return win.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});
```

---

## 4. Manifest Configuration (`app/manifest.ts`)

```ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "App Name",
    short_name: "App",
    description: "App description",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#09090b",
    theme_color: "#10b981",
    icons: [
      {
        src: "/images/v1/logo/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/v1/logo/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/v1/maskable/maskable_icon_x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/images/v1/maskable/maskable_icon_x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
```

---

## 5. Metadata & Viewport (`app/layout.tsx`)

```tsx
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "App Name",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/images/v1/logo/Logo Nutria.svg", type: "image/svg+xml" },
      { url: "/images/v1/logo/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/images/v1/logo/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/images/v1/logo/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};
```
