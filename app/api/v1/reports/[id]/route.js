import { ok, apiError } from '@/lib/backend/http.js';
import { requireAuth } from '@/lib/backend/auth.js';
import { reportRepository } from '@/lib/backend/reportRepository.js';
import { scopeAllows } from '@/lib/backend/geography.js';

export async function GET(request, { params }) {
  const auth = await requireAuth(request, ['commercant','point_relais','gestionnaire','super_gestionnaire','gestionnaire_financier']);
  if (auth.error) return auth.error;
  const { id } = await params;
  const report = await reportRepository.findById(id);
  if (!report) return apiError(404, 'REPORT_NOT_FOUND', 'Signalement introuvable.');
  const role = auth.claims.role;
  if (['commercant','point_relais'].includes(role) && String(report.authorId) !== String(auth.claims.sub)) return apiError(403, 'FORBIDDEN', 'Accès refusé à ce signalement.');
  if (role === 'gestionnaire' && (report.type === 'probleme_paiement' || !scopeAllows(auth.claims.scope, report.geography || {}))) return apiError(403, 'OUT_OF_SCOPE', 'Signalement hors de votre périmètre.');
  if (role === 'gestionnaire_financier' && report.type !== 'probleme_paiement') return apiError(403, 'FORBIDDEN', 'Ce signalement n’est pas financier.');
  return ok(report);
}
