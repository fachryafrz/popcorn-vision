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

interface PushPayload {
  title?: string;
  body?: string;
  icon?: string;
  badge?: string;
  url?: string;
  chatId?: string;
  notificationType?: string;
}

// Web Push Notification Handler
self.addEventListener("push", (event: ExtendableEvent) => {
  const pushEvent = event as PushEvent;
  if (!pushEvent.data) return;

  try {
    let data: PushPayload = {};
    try {
      data = pushEvent.data.json() as PushPayload;
    } catch {
      data = {
        title: "Popcorn Vision",
        body: pushEvent.data.text(),
        url: "/chat",
      };
    }

    const title = data.title || "Popcorn Vision";
    const absoluteIcon = data.icon
      ? data.icon.startsWith("http")
        ? data.icon
        : `${self.location.origin}${data.icon}`
      : `${self.location.origin}/favicon/android-chrome-192x192.png`;

    const absoluteBadge = data.badge
      ? data.badge.startsWith("http")
        ? data.badge
        : `${self.location.origin}${data.badge}`
      : `${self.location.origin}/favicon/favicon-32x32.png`;

    const options: NotificationOptions = {
      body: data.body || "You received a new notification.",
      icon: absoluteIcon,
      badge: absoluteBadge,
      data: {
        url: data.url || "/chat",
        chatId: data.chatId,
        notificationType: data.notificationType,
      },
      vibrate: [100, 50, 100],
    };

    pushEvent.waitUntil(self.registration.showNotification(title, options));
  } catch (err: unknown) {
    console.error("Error handling push event:", err);
  }
});

// Notification Click Handler
self.addEventListener("notificationclick", (event: ExtendableEvent) => {
  const notificationEvent = event as NotificationEvent & { reply?: string };
  const notificationData = notificationEvent.notification.data as
    | { url?: string; chatId?: string; notificationType?: string }
    | undefined;

  notificationEvent.notification.close();

  const urlToOpen = notificationData?.url || (notificationData?.chatId ? `/chat?id=${notificationData.chatId}` : "/chat");

  notificationEvent.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          const win = client as WindowClient;
          if (win.url && win.url.includes("/chat") && "focus" in win) {
            if ("navigate" in win) {
              win.navigate(urlToOpen);
            }
            return win.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});
