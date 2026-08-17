import { getMongoDb } from '@/lib/backend/mongodb.js';

const memory = globalThis.__relayflowAuditStore || { items: [] };
globalThis.__relayflowAuditStore = memory;

function buildQuery(filters = {}) {
  const query = {};
  if (filters.resourceType) query.resourceType = String(filters.resourceType);
  if (filters.resourceId) query.resourceId = String(filters.resourceId);
  if (filters.actorId) query.actorId = String(filters.actorId);
  if (filters.actorRole) query.actorRole = String(filters.actorRole);
  if (filters.eventType) query.eventType = String(filters.eventType);
  if (filters.action) query.action = String(filters.action);
  if (filters.dateFrom || filters.dateTo) {
    query.occurredAt = {};
    if (filters.dateFrom) query.occurredAt.$gte = String(filters.dateFrom);
    if (filters.dateTo) query.occurredAt.$lte = String(filters.dateTo);
  }
  return query;
}

function matchesMemory(item, filters = {}) {
  if (filters.resourceType && item.resourceType !== String(filters.resourceType)) return false;
  if (filters.resourceId && item.resourceId !== String(filters.resourceId)) return false;
  if (filters.actorId && item.actorId !== String(filters.actorId)) return false;
  if (filters.actorRole && item.actorRole !== String(filters.actorRole)) return false;
  if (filters.eventType && item.eventType !== String(filters.eventType)) return false;
  if (filters.action && item.action !== String(filters.action)) return false;
  if (filters.dateFrom && String(item.occurredAt) < String(filters.dateFrom)) return false;
  if (filters.dateTo && String(item.occurredAt) > String(filters.dateTo)) return false;
  return true;
}

export const auditRepository = {
  async create(entry) {
    const db = await getMongoDb();
    if (db) await db.collection('audit_traces').insertOne(entry);
    else memory.items.push(entry);
    return entry;
  },
  async list(filters = {}) {
    const query = buildQuery(filters);
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
    const filtered = memory.items
      .filter(item => matchesMemory(item, filters))
      .sort((a,b) => String(b.occurredAt).localeCompare(String(a.occurredAt)));
    return { data: filtered.slice(skip, skip + limit), total: filtered.length };
  },
};
