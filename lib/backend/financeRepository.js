import { getMongoDb } from '@/lib/backend/mongodb.js';

const seed = {
  invoices:[{id:'FAC-DEMO-1',merchantId:'demo-merchant-1',merchant:'Boulangerie Martin',period:'Juillet 2026',amount:19.90,status:'emise',date:'2026-07-20',history:[]}],
  payouts:[{id:'BON-DEMO-1',relayPointId:'1',relay:'Relais République',period:'Juillet 2026',parcels:1,unit:1.50,amount:1.50,status:'emis',date:'2026-07-27',history:[]}]
};
const memory = globalThis.__relayflowFinance || structuredClone(seed);
globalThis.__relayflowFinance = memory;

export const financeRepository = {
  async listInvoices(filters={}) { const db=await getMongoDb(); if(db){const q={}; if(filters.merchantId)q.merchantId=String(filters.merchantId); return db.collection('factures').find(q).sort({createdAt:-1}).limit(100).toArray();} return memory.invoices.filter(x=>!filters.merchantId||String(x.merchantId)===String(filters.merchantId)); },
  async listPayouts(filters={}) { const db=await getMongoDb(); if(db){const q={}; if(filters.relayPointId)q.relayPointId=String(filters.relayPointId); return db.collection('bons_paiement').find(q).sort({createdAt:-1}).limit(100).toArray();} return memory.payouts.filter(x=>!filters.relayPointId||String(x.relayPointId)===String(filters.relayPointId)); },
  async createInvoice(item){const db=await getMongoDb(); if(db)await db.collection('factures').insertOne(item); else memory.invoices.unshift(item); return item;},
  async createPayout(item){const db=await getMongoDb(); if(db)await db.collection('bons_paiement').insertOne(item); else memory.payouts.unshift(item); return item;},
  async updateInvoice(id,patch){const db=await getMongoDb(); if(db){await db.collection('factures').updateOne({id:String(id)},{$set:patch});return db.collection('factures').findOne({id:String(id)});} const i=memory.invoices.findIndex(x=>String(x.id)===String(id));if(i<0)return null;memory.invoices[i]={...memory.invoices[i],...patch};return memory.invoices[i];},
  async updatePayout(id,patch){const db=await getMongoDb(); if(db){await db.collection('bons_paiement').updateOne({id:String(id)},{$set:patch});return db.collection('bons_paiement').findOne({id:String(id)});} const i=memory.payouts.findIndex(x=>String(x.id)===String(id));if(i<0)return null;memory.payouts[i]={...memory.payouts[i],...patch};return memory.payouts[i];}
};
