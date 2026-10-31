// Popcorn Vision Native Service Worker for Web Push Notifications
// Pure Web API without any external service worker libraries or precaching.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Web Push Notification Handler
self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    let data = {};
    try {
      data = event.data.json();
    } catch {
      data = {
        title: "Popcorn Vision",
        body: event.data.text(),
        url: "/chat",
      };
    }

    const title = data.title || "Popcorn Vision";
    const absoluteIcon = data.icon
      ? data.icon.startsWith("http")
        ? data.icon
        : `${self.location.origin}${data.icon}`
      : `${self.location.origin}/favicon/v2/android-chrome-192x192.png`;

    const absoluteBadge = data.badge
      ? data.badge.startsWith("http")
        ? data.badge
        : `${self.location.origin}${data.badge}`
      : `${self.location.origin}/favicon/v2/favicon-32x32.png`;

    const options = {
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

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.error("Error handling push event:", err);
  }
});

// Notification Click Handler
self.addEventListener("notificationclick", (event) => {
  const notificationData = event.notification.data;
  event.notification.close();

  const urlToOpen =
    notificationData?.url ||
    (notificationData?.chatId ? `/chat?id=${notificationData.chatId}` : "/chat");

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url && client.url.includes("/chat") && "focus" in client) {
            if ("navigate" in client) {
              client.navigate(urlToOpen);
            }
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});