import { getMongoDb } from '@/lib/backend/mongodb.js';

const memory = globalThis.__relayflowAuditStore || { items: [] };
globalThis.__relayflowAuditStore = memory;

export const auditRepository = {
  async create(entry) {
    const db = await getMongoDb();
    if (db) await db.collection('audit_traces').insertOne(entry);
    else memory.items.push(entry);
    return entry;
  },
  async list(filters = {}) {
    const query = {};
    if (filters.resourceType) query.resourceType = String(filters.resourceType);
    if (filters.resourceId) query.resourceId = String(filters.resourceId);
    if (filters.actorId) query.actorId = String(filters.actorId);
    if (filters.eventType) query.eventType = String(filters.eventType);
    const limit = Math.min(Math.max(Number(filters.limit) || 50, 1), 200);
    const skip = Math.max(Number(filters.skip) || 0, 0);
    const db = await getMongoDb();
    if (db) {
      const collection = db.collection('audit_traces');
      const [data, total] = await Promise.all([
        collection.find(query).sort({ occurredAt: -1 }).skip(skip).limit(limit).toArray(),
        collection.countDocuments(query),
      ]);
      return { data, total };
    }
    const filtered = memory.items.filter(item =>
      (!filters.resourceType || item.resourceType === String(filters.resourceType)) &&
      (!filters.resourceId || item.resourceId === String(filters.resourceId)) &&
      (!filters.actorId || item.actorId === String(filters.actorId)) &&
      (!filters.eventType || item.eventType === String(filters.eventType))
    ).sort((a,b) => String(b.occurredAt).localeCompare(String(a.occurredAt)));
    return { data: filtered.slice(skip, skip + limit), total: filtered.length };
  },
};
