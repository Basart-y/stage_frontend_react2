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
    const limit = Math.min(Math.max(Number(filters.limit) || 20, 1), 100);
    const skip = Math.max(Number(filters.skip) || 0, 0);
    if (filters.query) {
      const escaped = String(filters.query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { reference: { $regex: escaped, $options: 'i' } },
        { 'client.firstName': { $regex: escaped, $options: 'i' } },
        { 'client.lastName': { $regex: escaped, $options: 'i' } },
        { commerceName: { $regex: escaped, $options: 'i' } },
        { relayName: { $regex: escaped, $options: 'i' } },
      ];
    }
    const db = await getMongoDb();
    if (db) {
      const collection = db.collection('livraisons');
      const [data, total] = await Promise.all([
        collection.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
        collection.countDocuments(query),
      ]);
      return { data, total };
    }
    const filtered = memory.items.filter(item =>
      (!filters.commerceId || String(item.commerceId) === String(filters.commerceId)) &&
      (!filters.relayPointId || String(item.relayPointId) === String(filters.relayPointId)) &&
      (!filters.status || item.status === filters.status) &&
      (!filters.query || `${item.reference || ''} ${item.client?.firstName || ''} ${item.client?.lastName || ''} ${item.commerceName || ''} ${item.relayName || ''}`.toLowerCase().includes(String(filters.query).toLowerCase()))
    );
    return { data: filtered.slice(skip, skip + limit), total: filtered.length };
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
