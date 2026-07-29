import { getMongoDb } from '@/lib/backend/mongodb.js';

const memory = globalThis.__relayflowPushSubscriptions || { items: [] };
globalThis.__relayflowPushSubscriptions = memory;

export const pushSubscriptionRepository = {
  async upsert(userId, subscription) {
    const doc = {
      userId: String(userId),
      endpoint: String(subscription.endpoint),
      subscription,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    const db = await getMongoDb();
    if (db) {
      await db.collection('pushSubscriptions').updateOne(
        { userId: doc.userId, endpoint: doc.endpoint },
        { $set: { subscription: doc.subscription, updatedAt: doc.updatedAt }, $setOnInsert: { createdAt: doc.createdAt, userId: doc.userId, endpoint: doc.endpoint } },
        { upsert: true },
      );
      return doc;
    }
    const index = memory.items.findIndex(item => item.userId === doc.userId && item.endpoint === doc.endpoint);
    if (index >= 0) memory.items[index] = { ...memory.items[index], ...doc, createdAt: memory.items[index].createdAt };
    else memory.items.push(doc);
    return doc;
  },

  async listByUser(userId) {
    const db = await getMongoDb();
    if (db) return db.collection('pushSubscriptions').find({ userId: String(userId) }).toArray();
    return memory.items.filter(item => item.userId === String(userId));
  },

  async remove(userId, endpoint) {
    const db = await getMongoDb();
    if (db) {
      const result = await db.collection('pushSubscriptions').deleteMany({ userId: String(userId), endpoint: String(endpoint) });
      return result.deletedCount;
    }
    const before = memory.items.length;
    memory.items = memory.items.filter(item => !(item.userId === String(userId) && item.endpoint === String(endpoint)));
    return before - memory.items.length;
  },
};
