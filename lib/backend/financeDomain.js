import { randomUUID } from 'node:crypto';
import { financeRepository } from '@/lib/backend/financeRepository.js';
import { deliveryRepository } from '@/lib/backend/deliveryRepository.js';

export const MERCHANT_MONTHLY_PRICE = Number(process.env.MERCHANT_MONTHLY_PRICE || 19.90);
export const RELAY_PICKUP_UNIT_PRICE = Number(process.env.RELAY_PICKUP_UNIT_PRICE || 1.50);
const now=()=>new Date().toISOString();
export async function createInvoice(input,actor){if(!input?.merchantId||!input?.merchant)throw new Error('MERCHANT_REQUIRED');if(!input?.period)throw new Error('PERIOD_REQUIRED');const t=now();return financeRepository.createInvoice({id:`FAC-${randomUUID()}`,merchantId:String(input.merchantId),merchant:String(input.merchant),period:String(input.period),amount:MERCHANT_MONTHLY_PRICE,status:'emise',date:t.slice(0,10),createdAt:t,createdBy:actor.sub,history:[{status:'emise',date:t,actorId:actor.sub}]});}
function periodBounds(period){
  const raw=String(period||'').trim().toLocaleLowerCase('fr-FR');
  const months={janvier:0,fevrier:1,'février':1,mars:2,avril:3,mai:4,juin:5,juillet:6,aout:7,'août':7,septembre:8,octobre:9,novembre:10,decembre:11,'décembre':11};
  let year,month; const iso=raw.match(/^(\d{4})-(\d{1,2})$/);
  if(iso){year=Number(iso[1]);month=Number(iso[2])-1}else{const parts=raw.split(/\s+/);month=months[parts[0]];year=Number(parts[1]);}
  if(!Number.isInteger(year)||!Number.isInteger(month)||month<0||month>11)return null;
  return [new Date(Date.UTC(year,month,1)),new Date(Date.UTC(year,month+1,1))];
}
function pickupDate(delivery){const direct=delivery.handoffSheet?.handedOffAt||delivery.handoffProof?.date; if(direct)return new Date(direct); const h=[...(delivery.history||[])].reverse().find(x=>x.status==='Retiré');return h?.date?new Date(h.date):null;}
export async function createPayout(input,actor){if(!input?.relayPointId||!input?.relay)throw new Error('RELAY_REQUIRED');if(!input?.period)throw new Error('PERIOD_REQUIRED');const result=await deliveryRepository.list({relayPointId:String(input.relayPointId),limit:10000});const deliveries=result.data||result;const bounds=periodBounds(input.period);const parcels=deliveries.filter(d=>{if(d.status!=='Retiré')return false;if(!bounds)return true;const dt=pickupDate(d);return dt&&!Number.isNaN(dt.getTime())&&dt>=bounds[0]&&dt<bounds[1]}).length;const t=now();return financeRepository.createPayout({id:`BON-${randomUUID()}`,relayPointId:String(input.relayPointId),relay:String(input.relay),period:String(input.period),parcels,unit:RELAY_PICKUP_UNIT_PRICE,amount:Number((parcels*RELAY_PICKUP_UNIT_PRICE).toFixed(2)),status:'emis',date:t.slice(0,10),createdAt:t,createdBy:actor.sub,history:[{status:'emis',date:t,actorId:actor.sub}]});}
export async function changeInvoiceStatus(id,status,actor){if(!['emise','payee','en_litige'].includes(status))throw new Error('INVALID_STATUS');const items=await financeRepository.listInvoices();const item=items.find(x=>String(x.id)===String(id));if(!item)throw new Error('NOT_FOUND');const t=now();return financeRepository.updateInvoice(id,{status,updatedAt:t,history:[...(item.history||[]),{status,date:t,actorId:actor.sub}]});}
export async function changePayoutStatus(id,status,actor){if(!['emis','paye'].includes(status))throw new Error('INVALID_STATUS');const items=await financeRepository.listPayouts();const item=items.find(x=>String(x.id)===String(id));if(!item)throw new Error('NOT_FOUND');const t=now();return financeRepository.updatePayout(id,{status,updatedAt:t,history:[...(item.history||[]),{status,date:t,actorId:actor.sub}]});}
