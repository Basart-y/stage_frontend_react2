import { getMongoDb } from '@/lib/backend/mongodb.js';
import { livraisonsFictives } from '@/donnees/livraisonsFictives.js';

const memory = globalThis.__relayflowDeliveryStore || { items: structuredClone(livraisonsFictives) };
globalThis.__relayflowDeliveryStore = memory;

export const deliveryRepository = {
  async list(filters = {}) {
    const query = {};
    if (filters.commerceId) query.commerceId = String(filters.commerceId);
    if (filters.relayPointId) query.relayPointId = String(filters.relayPointId);
    if (filters.status) query.status = filters.status;
    const limit = Math.min(Number(filters.limit) || 100, 200);
    const db = await getMongoDb();
    if (db) return db.collection('livraisons').find(query).sort({ createdAt: -1 }).limit(limit).toArray();
    return memory.items.filter(item =>
      (!filters.commerceId || String(item.commerceId) === String(filters.commerceId)) &&
      (!filters.relayPointId || String(item.relayPointId) === String(filters.relayPointId)) &&
      (!filters.status || item.status === filters.status)
    ).slice(0, limit);
  },

  async findById(id) {
    const db = await getMongoDb();
    if (db) return db.collection('livraisons').findOne({ id: String(id) });
    return memory.items.find(item => String(item.id) === String(id)) || null;
  },

  async findByReference(reference) {
    const db = await getMongoDb();
    if (db) return db.collection('livraisons').findOne({ reference: String(reference) });
    return memory.items.find(item => item.reference === String(reference)) || null;
  },

  async create(delivery) {
    const db = await getMongoDb();
    if (db) await db.collection('livraisons').insertOne(delivery); else memory.items.push(delivery);
    return delivery;
  },

  async replace(id, delivery) {
    const db = await getMongoDb();
    if (db) {
      const result = await db.collection('livraisons').findOneAndReplace({ id: String(id) }, delivery, { returnDocument: 'after' });
      return result || null;
    }
    const index = memory.items.findIndex(item => String(item.id) === String(id));
    if (index < 0) return null;
    memory.items[index] = delivery;
    return delivery;
  },
};
