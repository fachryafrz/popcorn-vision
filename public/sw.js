// Service worker for Web Push Notifications
self.addEventListener('push', function (event) {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || 'New Message';

    const absoluteIcon = data.icon 
      ? (data.icon.startsWith('http') ? data.icon : `${self.location.origin}${data.icon}`)
      : `${self.location.origin}/favicon/android-chrome-192x192.png`;
    
    const absoluteBadge = `${self.location.origin}/favicon/favicon-32x32.png`;

    const options = {
      body: data.body || 'You received a new message.',
      icon: absoluteIcon,
      badge: absoluteBadge,
      data: {
        url: data.url || '/chat',
        chatId: data.chatId,
        notificationType: data.notificationType,
      },
      vibrate: [100, 50, 100],
    };

    if (data.notificationType === 'chat_message' && data.chatId) {
      options.actions = [
        {
          action: 'reply',
          type: 'text',
          title: 'Reply',
          placeholder: 'Type a message...',
        }
      ];
    }

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  } catch (err) {
    console.error('Error handling push event:', err);
  }
});

self.addEventListener('notificationclick', function (event) {
  if (event.action === 'reply' && event.reply) {
    const chatId = event.notification.data?.chatId;
    const replyText = event.reply;

    if (chatId) {
      event.waitUntil(
        fetch('/api/chat/reply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chatId, content: replyText }),
        })
        .then(function (res) {
          if (!res.ok) {
            console.error('Failed to send reply from notification');
          }
          event.notification.close();
        })
        .catch(function (err) {
          console.error('Error sending reply:', err);
          event.notification.close();
        })
      );
    }
    return;
  }

  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/chat';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes('/chat') && 'focus' in client) {
          if (client.navigate) {
            client.navigate(urlToOpen);
          }
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
