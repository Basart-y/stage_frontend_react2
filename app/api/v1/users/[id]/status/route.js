import { ok, apiError } from '@/lib/backend/http.js';
import { requireAuth } from '@/lib/backend/auth.js';
import { userRepository } from '@/lib/backend/userRepository.js';
import { scopeAllows } from '@/lib/backend/geography.js';
import { writeAuditTrace } from '@/lib/backend/auditDomain.js';
export async function PATCH(request, { params }) {
  const auth = await requireAuth(request, ['gestionnaire','super_gestionnaire']);
  if (auth.error) return auth.error;
  const { id } = await params;
  const target = await userRepository.findById(id);
  if (!target) return apiError(404, 'USER_NOT_FOUND', 'Compte introuvable.');
  if (auth.claims.role === 'gestionnaire' && (!['commercant','point_relais'].includes(target.role) || !scopeAllows(auth.claims.scope, target))) return apiError(403, 'OUT_OF_SCOPE', 'Compte hors de votre périmètre géographique.');
  const { statutCompte } = await request.json();
  if (!['actif','suspendu'].includes(statutCompte)) return apiError(400, 'INVALID_STATUS', 'Statut de compte invalide.');
  const updated=await userRepository.update(id,{statutCompte,updatedAt:new Date().toISOString()});
  await writeAuditTrace({request,eventType:'account.status.changed',action:statutCompte==='suspendu'?'iam.actor.suspend':'iam.actor.restore',actor:auth.claims,resourceType:'user',resourceId:id,before:{statutCompte:target.statutCompte},after:{statutCompte:updated.statutCompte}});
  return ok(updated);
}
