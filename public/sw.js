self.addEventListener('push', event => {
  let payload = {};
  try { payload = event.data ? event.data.json() : {}; } catch { payload = {}; }
  const title = payload.title || 'Notification';
  event.waitUntil(self.registration.showNotification(title, {
    body: payload.body || 'Nouvelle notification',
    data: payload,
  }));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const data = event.notification.data || {};
  const path = data.resourceType === 'delivery' && data.resourceId
    ? `/suivi-colis?reference=${encodeURIComponent(data.resourceId)}`
    : '/';
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windows => {
    for (const client of windows) {
      if ('focus' in client) { client.navigate(path); return client.focus(); }
    }
    if (clients.openWindow) return clients.openWindow(path);
  }));
});
