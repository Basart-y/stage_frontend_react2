import {ok,apiError} from '@/lib/backend/http.js';
import {requireAuth} from '@/lib/backend/auth.js';
import {changePayoutStatus} from '@/lib/backend/financeDomain.js';

export async function PATCH(request){
  const a=await requireAuth(request,['gestionnaire_financier','super_gestionnaire']);
  if(a.error)return a.error;
  try{
    const body=await request.json();
    const ids=Array.isArray(body?.payoutIds)?[...new Set(body.payoutIds.map(String))]:[];
    if(!ids.length)return apiError(400,'PAYOUT_IDS_REQUIRED','Sélectionnez au moins un bon de paiement.');
    const updated=[];
    for(const id of ids) updated.push(await changePayoutStatus(id,'paye',a.claims));
    return ok({updated,total:updated.length});
  }catch(e){return apiError(400,e.message,'Impossible de mettre à jour les bons sélectionnés.');}
}
