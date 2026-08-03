import { getMongoDb } from '@/lib/backend/mongodb.js';

const memory = globalThis.__relayflowUsers || { users: [], invitations: [] };
globalThis.__relayflowUsers = memory;

function clean(user) {
  if (!user) return null;
  const { passwordHash, invitationTokenHash, ...safe } = user;
  return safe;
}
function buildQuery(filters = {}) {
  const query = {};
  if (filters.role) query.role = filters.role;
  if (filters.statutCompte) query.statutCompte = filters.statutCompte;
  if (filters.search) {
    const rx = new RegExp(String(filters.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [{ email: rx }, { 'profile.nom': rx }, { 'profile.nomFamille': rx }, { 'profile.raisonSociale': rx }, { 'profile.nomCommerce': rx }, { 'profile.ville': rx }];
  }
  return query;
}
function memoryMatches(user, filters={}) {
  if (filters.role && user.role !== filters.role) return false;
  if (filters.statutCompte && user.statutCompte !== filters.statutCompte) return false;
  if (filters.search) {
    const haystack = JSON.stringify({email:user.email, profile:user.profile || {}}).toLowerCase();
    if (!haystack.includes(String(filters.search).toLowerCase())) return false;
  }
  return true;
}
export const userRepository = {
  async findByEmail(email) {
    const db = await getMongoDb();
    const normalized = String(email).trim().toLowerCase();
    return db ? db.collection('utilisateurs').findOne({ email: normalized }) : memory.users.find(u => u.email === normalized) || null;
  },
  async findById(id) {
    const db = await getMongoDb();
    if (db) return db.collection('utilisateurs').findOne({ id: String(id) });
    return memory.users.find(u => String(u.id) === String(id)) || null;
  },
  async create(user) {
    const db = await getMongoDb();
    if (db) await db.collection('utilisateurs').insertOne(user); else memory.users.push(user);
    return clean(user);
  },
  async update(id, patch) {
    const db = await getMongoDb();
    if (db) {
      await db.collection('utilisateurs').updateOne({ id: String(id) }, { $set: patch });
      return clean(await db.collection('utilisateurs').findOne({ id: String(id) }));
    }
    const index = memory.users.findIndex(u => String(u.id) === String(id));
    if (index < 0) return null;
    memory.users[index] = { ...memory.users[index], ...patch };
    return clean(memory.users[index]);
  },
  async list(filters = {}) {
    const limit = Math.min(Math.max(Number(filters.limit) || 20, 1), 100);
    const page = Math.max(Number(filters.page) || 1, 1);
    const skip = (page - 1) * limit;
    const db = await getMongoDb();
    if (db) {
      const query = buildQuery(filters);
      const [rows, total] = await Promise.all([
        db.collection('utilisateurs').find(query).sort({ createdAt: -1, email: 1 }).skip(skip).limit(limit).toArray(),
        db.collection('utilisateurs').countDocuments(query),
      ]);
      return { rows: rows.map(clean), total, page, limit };
    }
    const all = memory.users.filter(u => memoryMatches(u, filters)).sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')));
    return { rows: all.slice(skip, skip + limit).map(clean), total: all.length, page, limit };
  }
};
