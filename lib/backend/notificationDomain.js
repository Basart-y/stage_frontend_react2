import { notificationRepository } from '@/lib/backend/notificationRepository.js';
import { broadcastRealtime } from '@/lib/backend/realtimeHub.js';
import { sendPushToUser } from '@/lib/backend/pushDomain.js';
import { userRepository } from '@/lib/backend/userRepository.js';

export async function createNotification({ recipientId = null, audienceRole = null, type, title, message, resourceType = null, resourceId = null, priority = 'normal' }) {
  if (!recipientId && !audienceRole) throw new Error('NOTIFICATION_TARGET_REQUIRED');
  const notification = {
    id: crypto.randomUUID(),
    recipientId: recipientId ? String(recipientId) : null,
    audienceRole,
    type,
    title,
    message,
    resourceType,
    resourceId: resourceId ? String(resourceId) : null,
    priority,
    readAt: null,
    readBy: [],
    createdAt: new Date().toISOString(),
  };
  const saved = await notificationRepository.create(notification);
  broadcastRealtime({ type: 'notification.created', data: saved, recipientId: saved.recipientId, audienceRole: saved.audienceRole });
  if (saved.recipientId) {
    sendPushToUser(saved.recipientId, saved).catch(error => console.error('WEB_PUSH_BACKGROUND_FAILED', error));
  } else if (saved.audienceRole) {
    userRepository.list({ role: saved.audienceRole, statutCompte: 'actif', limit: 500 })
      .then(users => Promise.all(users.map(user => sendPushToUser(user.id, saved))))
      .catch(error => console.error('WEB_PUSH_AUDIENCE_FAILED', error));
  }
  return saved;
}

export async function notifyDeliveryTransition(delivery, oldStatus, newStatus) {
  const jobs = [];
  if (delivery.commerceId) {
    jobs.push(createNotification({
      recipientId: delivery.commerceId,
      type: 'maj_etat_livraison',
      title: `Livraison ${delivery.reference}`,
      message: `Le statut est passé de « ${oldStatus} » à « ${newStatus} ».` ,
      resourceType: 'delivery',
      resourceId: delivery.id,
    }));
  }
  if (delivery.relayPointUserId) {
    jobs.push(createNotification({
      recipientId: delivery.relayPointUserId,
      type: newStatus === 'Non récupéré' ? 'livraison_non_recuperee' : 'maj_etat_livraison',
      title: `Livraison ${delivery.reference}`,
      message: `Nouveau statut : « ${newStatus} ».` ,
      resourceType: 'delivery',
      resourceId: delivery.id,
    }));
  }
  return Promise.all(jobs);
}
