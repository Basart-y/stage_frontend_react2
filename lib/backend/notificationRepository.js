import { getMongoDb } from '@/lib/backend/mongodb.js';

const memory = globalThis.__relayflowNotifications || { items: [] };
globalThis.__relayflowNotifications = memory;

function matches(item, filters = {}) {
  if (filters.recipientId && String(item.recipientId) !== String(filters.recipientId)) return false;
  if (filters.audienceRole && item.audienceRole !== filters.audienceRole) return false;
  if (filters.unreadOnly && filters.recipientId && item.readAt) return false;
  if (filters.unreadOnly && filters.audienceRole && (item.readBy || []).includes(String(filters.viewerId || ''))) return false;
  return true;
}

export const notificationRepository = {
  async create(notification) {
    const db = await getMongoDb();
    if (db) await db.collection('notifications').insertOne(notification);
    else memory.items.push(notification);
    return notification;
  },

  async list(filters = {}) {
    const db = await getMongoDb();
    if (db) {
      const query = {};
      if (filters.recipientId) query.recipientId = String(filters.recipientId);
      if (filters.audienceRole) query.audienceRole = filters.audienceRole;
      if (filters.unreadOnly && filters.recipientId) query.readAt = null;
      if (filters.unreadOnly && filters.audienceRole && filters.viewerId) query.readBy = { $ne: String(filters.viewerId) };
      return db.collection('notifications').find(query).sort({ createdAt: -1 }).limit(filters.limit || 50).toArray();
    }
    return memory.items.filter(item => matches(item, filters)).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))).slice(0, filters.limit || 50);
  },

  async markRead(ids, recipientId, audienceRole = null) {
    const normalized = [...new Set((ids || []).map(String))];
    const now = new Date().toISOString();
    const db = await getMongoDb();
    if (db) {
      const direct = await db.collection('notifications').updateMany({ id: { $in: normalized }, recipientId: String(recipientId) }, { $set: { readAt: now } });
      const roleWide = audienceRole ? await db.collection('notifications').updateMany({ id: { $in: normalized }, audienceRole }, { $addToSet: { readBy: String(recipientId) } }) : { modifiedCount: 0 };
      return { updatedCount: direct.modifiedCount + roleWide.modifiedCount };
    }
    let updatedCount = 0;
    for (const item of memory.items) {
      if (!normalized.includes(String(item.id))) continue;
      if (String(item.recipientId) === String(recipientId) && !item.readAt) { item.readAt = now; updatedCount += 1; }
      else if (audienceRole && item.audienceRole === audienceRole && !(item.readBy || []).includes(String(recipientId))) { item.readBy = [...(item.readBy || []), String(recipientId)]; updatedCount += 1; }
    }
    return { updatedCount };
  },
};
