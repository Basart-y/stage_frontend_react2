import { getMongoDb } from '@/lib/backend/mongodb.js';

const memory = globalThis.__relayflowUsers || { users: [], invitations: [] };
globalThis.__relayflowUsers = memory;

function clean(user) {
  if (!user) return null;
  const { passwordHash, invitationTokenHash, ...safe } = user;
  return safe;
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
    const query = {};
    if (filters.role) query.role = filters.role;
    if (filters.statutCompte) query.statutCompte = filters.statutCompte;
    const db = await getMongoDb();
    const rows = db ? await db.collection('utilisateurs').find(query).limit(filters.limit || 50).toArray() : memory.users.filter(u => (!filters.role || u.role === filters.role) && (!filters.statutCompte || u.statutCompte === filters.statutCompte)).slice(0, filters.limit || 50);
    return rows.map(clean);
  }
};
