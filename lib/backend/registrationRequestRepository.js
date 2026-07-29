import { getMongoDb } from '@/lib/backend/mongodb.js';

const memory = globalThis.__relayflowRegistrationRequests || { items: [] };
globalThis.__relayflowRegistrationRequests = memory;

function clean(item) {
  if (!item) return null;
  const { passwordHash, ...safe } = item;
  return safe;
}

function matches(item, filters = {}) {
  if (filters.role && item.role !== filters.role) return false;
  if (filters.status && item.status !== filters.status) return false;
  if (filters.email && item.email !== String(filters.email).trim().toLowerCase()) return false;
  return true;
}

export const registrationRequestRepository = {
  async create(item) {
    const db = await getMongoDb();
    if (db) await db.collection('demandes_inscription').insertOne(item);
    else memory.items.push(item);
    return clean(item);
  },

  async findById(id) {
    const db = await getMongoDb();
    const item = db
      ? await db.collection('demandes_inscription').findOne({ id: String(id) })
      : memory.items.find((row) => String(row.id) === String(id)) || null;
    return item;
  },

  async findPendingByEmail(email) {
    const normalized = String(email || '').trim().toLowerCase();
    const db = await getMongoDb();
    return db
      ? db.collection('demandes_inscription').findOne({ email: normalized, status: 'PENDING' })
      : memory.items.find((row) => row.email === normalized && row.status === 'PENDING') || null;
  },

  async list(filters = {}) {
    const db = await getMongoDb();
    let rows;
    if (db) {
      const query = {};
      if (filters.role) query.role = filters.role;
      if (filters.status) query.status = filters.status;
      rows = await db.collection('demandes_inscription').find(query).sort({ createdAt: -1 }).limit(filters.limit || 100).toArray();
    } else {
      rows = memory.items.filter((row) => matches(row, filters)).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))).slice(0, filters.limit || 100);
    }
    return rows.map(clean);
  },

  async update(id, patch) {
    const db = await getMongoDb();
    if (db) {
      await db.collection('demandes_inscription').updateOne({ id: String(id) }, { $set: patch });
      return clean(await db.collection('demandes_inscription').findOne({ id: String(id) }));
    }
    const index = memory.items.findIndex((row) => String(row.id) === String(id));
    if (index < 0) return null;
    memory.items[index] = { ...memory.items[index], ...patch };
    return clean(memory.items[index]);
  },
};
