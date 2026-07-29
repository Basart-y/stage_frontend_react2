import {ok,apiError} from '@/lib/backend/http.js';
import {requireAuth} from '@/lib/backend/auth.js';
import {changeInvoiceStatus} from '@/lib/backend/financeDomain.js';

export async function PATCH(request){
  const a=await requireAuth(request,['gestionnaire_financier','super_gestionnaire']);
  if(a.error)return a.error;
  try{
    const body=await request.json();
    const ids=Array.isArray(body?.invoiceIds)?[...new Set(body.invoiceIds.map(String))]:[];
    const status=String(body?.status||'');
    if(!ids.length)return apiError(400,'INVOICE_IDS_REQUIRED','Sélectionnez au moins une facture.');
    if(!['payee','en_litige'].includes(status))return apiError(400,'INVALID_STATUS','Statut de facture invalide.');
    const updated=[];
    for(const id of ids) updated.push(await changeInvoiceStatus(id,status,a.claims));
    return ok({updated,total:updated.length});
  }catch(e){return apiError(400,e.message,'Impossible de mettre à jour les factures sélectionnées.');}
}
