import { getMongoDb } from '@/lib/backend/mongodb.js';

const memory = globalThis.__relayflowReports || { items: [] };
globalThis.__relayflowReports = memory;

function matches(item, filters = {}) {
  if (filters.type && item.type !== filters.type) return false;
  if (filters.status && item.status !== filters.status) return false;
  if (filters.authorId && String(item.authorId) !== String(filters.authorId)) return false;
  if (filters.assignedRole && item.assignedRole !== filters.assignedRole) return false;
  if (filters.deliveryId && String(item.deliveryId || '') !== String(filters.deliveryId)) return false;
  if (filters.search) {
    const text = `${item.id||''} ${item.description||''} ${item.deliveryId||''}`.toLowerCase();
    if (!text.includes(String(filters.search).toLowerCase())) return false;
  }
  return true;
}
function buildQuery(filters={}) {
  const query = {};
  if (filters.type) query.type = filters.type;
  if (filters.status) query.status = filters.status;
  if (filters.authorId) query.authorId = String(filters.authorId);
  if (filters.assignedRole) query.assignedRole = filters.assignedRole;
  if (filters.deliveryId) query.deliveryId = String(filters.deliveryId);
  if (filters.search) {
    const escaped=String(filters.search).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const rx=new RegExp(escaped,'i'); query.$or=[{id:rx},{description:rx},{deliveryId:rx}];
  }
  return query;
}
export const reportRepository = {
  async create(report) { const db = await getMongoDb(); if (db) await db.collection('signalements').insertOne(report); else memory.items.push(report); return report; },
  async findById(id) { const db = await getMongoDb(); return db ? db.collection('signalements').findOne({ id: String(id) }) : memory.items.find(item => String(item.id) === String(id)) || null; },
  async list(filters = {}) {
    const limit=Math.min(Math.max(Number(filters.limit)||20,1),100); const page=Math.max(Number(filters.page)||1,1); const skip=(page-1)*limit;
    const db = await getMongoDb();
    if (db) { const query=buildQuery(filters); const [rows,total]=await Promise.all([db.collection('signalements').find(query).sort({createdAt:-1}).skip(skip).limit(limit).toArray(),db.collection('signalements').countDocuments(query)]); return {rows,total,page,limit}; }
    const all=memory.items.filter(item=>matches(item,filters)).sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt))); return {rows:all.slice(skip,skip+limit),total:all.length,page,limit};
  },
  async replace(id, report) { const db=await getMongoDb(); if(db){await db.collection('signalements').replaceOne({id:String(id)},report);return report;} const index=memory.items.findIndex(item=>String(item.id)===String(id)); if(index<0)return null; memory.items[index]=report; return report; },
};
