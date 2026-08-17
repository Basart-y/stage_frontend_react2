import {ok,apiError} from '@/lib/backend/http.js';
import {requireAuth} from '@/lib/backend/auth.js';
import {userRepository} from '@/lib/backend/userRepository.js';
import {financeRepository} from '@/lib/backend/financeRepository.js';
import {createPayout} from '@/lib/backend/financeDomain.js';

export async function POST(request){
  const a=await requireAuth(request,['gestionnaire_financier','super_gestionnaire']);
  if(a.error)return a.error;
  try{
    const body=await request.json();
    const period=String(body?.period||'').trim();
    if(!period)return apiError(400,'PERIOD_REQUIRED','La période est obligatoire.');
    const requested=Array.isArray(body?.relayPointIds)?body.relayPointIds.map(String):[];
    const relayResult=await userRepository.list({role:'point_relais',statutCompte:'actif',limit:1000});
    const relayRows=Array.isArray(relayResult)?relayResult:(relayResult?.rows||relayResult?.data||[]);
    const relays=relayRows.filter(u=>!requested.length||requested.includes(String(u.id)));
    const existing=await financeRepository.listPayouts();
    const created=[]; const skipped=[];
    for(const relay of relays){
      if(existing.some(i=>String(i.relayPointId)===String(relay.id)&&String(i.period)===period)){skipped.push(relay.id);continue;}
      const p=relay.profile||{};
      const name=p.relayName||p.nomCommerce||p.nom||relay.email;
      created.push(await createPayout({relayPointId:relay.id,relay:name,period},a.claims));
    }
    return ok({created,skipped,total:created.length});
  }catch(e){return apiError(400,e.message,'Impossible de générer les bons de paiement.');}
}
