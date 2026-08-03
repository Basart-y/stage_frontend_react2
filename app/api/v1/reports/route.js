import { collection, ok, apiError } from '@/lib/backend/http.js';
import { requireAuth } from '@/lib/backend/auth.js';
import { reportRepository } from '@/lib/backend/reportRepository.js';
import { createReport } from '@/lib/backend/reportDomain.js';
import { userRepository } from '@/lib/backend/userRepository.js';
import { scopeAllows } from '@/lib/backend/geography.js';
import { writeAuditTrace } from '@/lib/backend/auditDomain.js';
export async function GET(request) {
  const auth = await requireAuth(request, ['commercant','point_relais','gestionnaire','super_gestionnaire','gestionnaire_financier']); if (auth.error) return auth.error;
  const { searchParams } = new URL(request.url);
  const filters = { type:searchParams.get('type')||undefined,status:searchParams.get('status')||undefined,search:searchParams.get('search')||undefined,deliveryId:searchParams.get('deliveryId')||undefined,page:Number(searchParams.get('page'))||1,limit:Math.min(Number(searchParams.get('limit'))||20,100) };
  const role=auth.claims.role; if(['commercant','point_relais'].includes(role))filters.authorId=auth.claims.sub; if(role==='gestionnaire_financier')filters.assignedRole='gestionnaire_financier';
  let result=await reportRepository.list(filters); let reports=result.rows;
  if(role==='gestionnaire') reports=reports.filter(r=>r.type!=='probleme_paiement'&&r.status!=='escalade'&&scopeAllows(auth.claims.scope,r.geography||{}));
  if(role==='gestionnaire_financier') reports=reports.filter(r=>r.type==='probleme_paiement');
  return collection(reports,{page:result.page,limit:result.limit,total:role==='gestionnaire'||role==='gestionnaire_financier'?reports.length:result.total,hasNext:result.page*result.limit<result.total});
}
export async function POST(request) {
  const auth=await requireAuth(request,['commercant','point_relais']); if(auth.error)return auth.error;
  try { const author=await userRepository.findById(auth.claims.sub); if(!author)return apiError(404,'USER_NOT_FOUND','Compte introuvable.'); const created=await createReport(await request.json(),author); await writeAuditTrace({request,eventType:'report.created',action:'moderation.report.file',actor:auth.claims,resourceType:'report',resourceId:created.id,after:created}); return ok(created,{status:201}); }
  catch(error){ if(error.message==='INVALID_REPORT_TYPE')return apiError(400,error.message,'Type de signalement invalide.'); if(error.message==='DESCRIPTION_REQUIRED')return apiError(400,error.message,'La description du problème est requise.'); return apiError(500,'INTERNAL_ERROR','Impossible de créer le signalement.'); }
}
