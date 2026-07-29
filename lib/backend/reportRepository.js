import { getMongoDb } from '@/lib/backend/mongodb.js';

const memory = globalThis.__relayflowReports || { items: [] };
globalThis.__relayflowReports = memory;

function matches(item, filters = {}) {
  if (filters.type && item.type !== filters.type) return false;
  if (filters.status && item.status !== filters.status) return false;
  if (filters.authorId && String(item.authorId) !== String(filters.authorId)) return false;
  if (filters.assignedRole && item.assignedRole !== filters.assignedRole) return false;
  return true;
}

export const reportRepository = {
  async create(report) {
    const db = await getMongoDb();
    if (db) await db.collection('signalements').insertOne(report);
    else memory.items.push(report);
    return report;
  },
  async findById(id) {
    const db = await getMongoDb();
    return db ? db.collection('signalements').findOne({ id: String(id) }) : memory.items.find(item => String(item.id) === String(id)) || null;
  },
  async list(filters = {}) {
    const db = await getMongoDb();
    if (db) {
      const query = {};
      if (filters.type) query.type = filters.type;
      if (filters.status) query.status = filters.status;
      if (filters.authorId) query.authorId = String(filters.authorId);
      if (filters.assignedRole) query.assignedRole = filters.assignedRole;
      return db.collection('signalements').find(query).sort({ createdAt: -1 }).limit(filters.limit || 50).toArray();
    }
    return memory.items.filter(item => matches(item, filters)).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))).slice(0, filters.limit || 50);
  },
  async replace(id, report) {
    const db = await getMongoDb();
    if (db) {
      await db.collection('signalements').replaceOne({ id: String(id) }, report);
      return report;
    }
    const index = memory.items.findIndex(item => String(item.id) === String(id));
    if (index < 0) return null;
    memory.items[index] = report;
    return report;
  },
};
