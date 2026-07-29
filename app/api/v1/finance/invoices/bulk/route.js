import {ok,apiError} from '@/lib/backend/http.js';
import {requireAuth} from '@/lib/backend/auth.js';
import {userRepository} from '@/lib/backend/userRepository.js';
import {financeRepository} from '@/lib/backend/financeRepository.js';
import {createInvoice} from '@/lib/backend/financeDomain.js';

export async function POST(request){
  const a=await requireAuth(request,['gestionnaire_financier','super_gestionnaire']);
  if(a.error)return a.error;
  try{
    const body=await request.json();
    const period=String(body?.period||'').trim();
    if(!period) return apiError(400,'PERIOD_REQUIRED','La période est obligatoire.');
    const requested=Array.isArray(body?.merchantIds)?body.merchantIds.map(String):[];
    const merchants=(await userRepository.list({role:'commercant',statutCompte:'actif',limit:1000})).filter(u=>!requested.length||requested.includes(String(u.id)));
    const existing=await financeRepository.listInvoices();
    const created=[]; const skipped=[];
    for(const merchant of merchants){
      if(existing.some(i=>String(i.merchantId)===String(merchant.id)&&String(i.period)===period)){skipped.push(merchant.id);continue;}
      const profile=merchant.profile||{};
      const name=profile.raisonSociale||profile.nomCommerce||profile.nom||merchant.email;
      created.push(await createInvoice({merchantId:merchant.id,merchant:name,period},a.claims));
    }
    return ok({created,skipped,total:created.length});
  }catch(e){return apiError(400,e.message,'Impossible de générer les factures.');}
}
