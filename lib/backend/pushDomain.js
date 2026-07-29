import webpush from 'web-push';
import { pushSubscriptionRepository } from '@/lib/backend/pushSubscriptionRepository.js';

let configured = false;
function configureWebPush() {
  if (configured) return true;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:admin@example.com';
  if (!publicKey || !privateKey) return false;
  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
  return true;
}

export async function sendPushToUser(userId, notification) {
  if (!configureWebPush() || !userId) return { sent: 0, disabled: true };
  const subscriptions = await pushSubscriptionRepository.listByUser(userId);
  let sent = 0;
  for (const item of subscriptions) {
    try {
      await webpush.sendNotification(item.subscription, JSON.stringify({
        title: notification.title,
        body: notification.message,
        type: notification.type,
        resourceType: notification.resourceType,
        resourceId: notification.resourceId,
        notificationId: notification.id,
      }));
      sent += 1;
    } catch (error) {
      if (error?.statusCode === 404 || error?.statusCode === 410) {
        await pushSubscriptionRepository.remove(userId, item.endpoint);
      } else {
        console.error('WEB_PUSH_SEND_FAILED', error?.message || error);
      }
    }
  }
  return { sent, disabled: false };
}
