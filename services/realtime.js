import { getAccessToken, apiRequest } from '@/services/api.js';

function wsUrl(token) {
  if (typeof window === 'undefined') return null;
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/ws?token=${encodeURIComponent(token)}`;
}

export function connectRealtime({ onNotification, onStatus } = {}) {
  const token = getAccessToken();
  if (!token || typeof window === 'undefined' || !('WebSocket' in window)) return () => {};
  let socket;
  let stopped = false;
  let retryTimer;
  let heartbeat;
  let attempts = 0;

  const connect = () => {
    if (stopped) return;
    socket = new WebSocket(wsUrl(token));
    onStatus?.('connecting');
    socket.onopen = () => {
      attempts = 0;
      onStatus?.('connected');
      heartbeat = window.setInterval(() => {
        if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'ping' }));
      }, 30000);
    };
    socket.onmessage = event => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'notification.created') onNotification?.(message.data);
      } catch {}
    };
    socket.onclose = () => {
      if (heartbeat) window.clearInterval(heartbeat);
      onStatus?.('disconnected');
      if (!stopped) {
        attempts += 1;
        retryTimer = window.setTimeout(connect, Math.min(30000, 1000 * 2 ** Math.min(attempts, 5)));
      }
    };
    socket.onerror = () => socket.close();
  };

  connect();
  return () => {
    stopped = true;
    if (retryTimer) window.clearTimeout(retryTimer);
    if (heartbeat) window.clearInterval(heartbeat);
    socket?.close();
  };
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

export async function enableWebPush() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('WEB_PUSH_UNSUPPORTED');
  }
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!publicKey) throw new Error('VAPID_PUBLIC_KEY_MISSING');
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('NOTIFICATION_PERMISSION_DENIED');
  const registration = await navigator.serviceWorker.register('/sw.js');
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }
  await apiRequest('/api/v1/notifications/push-subscription', {
    method: 'POST',
    body: JSON.stringify({ subscription: subscription.toJSON() }),
  });
  return subscription;
}
