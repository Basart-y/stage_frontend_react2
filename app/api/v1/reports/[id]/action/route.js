import { ok, apiError } from '@/lib/backend/http.js';
import { requireAuth } from '@/lib/backend/auth.js';
import { reportRepository } from '@/lib/backend/reportRepository.js';
import { transitionReport } from '@/lib/backend/reportDomain.js';
import { scopeAllows } from '@/lib/backend/geography.js';

export async function POST(request, { params }) {
  const auth = await requireAuth(request, ['gestionnaire','super_gestionnaire','gestionnaire_financier']);
  if (auth.error) return auth.error;
  const { id } = await params;
  const body = await request.json();
  const report = await reportRepository.findById(id);
  if (!report) return apiError(404, 'REPORT_NOT_FOUND', 'Signalement introuvable.');
  if (auth.claims.role === 'gestionnaire' && !scopeAllows(auth.claims.scope, report.geography || {})) return apiError(403, 'OUT_OF_SCOPE', 'Signalement hors de votre périmètre.');
  if (auth.claims.role === 'gestionnaire' && report.type === 'probleme_paiement') return apiError(403, 'FORBIDDEN', 'Les litiges de paiement sont réservés au Gestionnaire Financier.');
  if (auth.claims.role === 'gestionnaire_financier' && report.type !== 'probleme_paiement') return apiError(403, 'FORBIDDEN', 'Ce signalement n’est pas financier.');
  try {
    return ok(await transitionReport(id, body.action, { id: auth.claims.sub, role: auth.claims.role }, body.comment));
  } catch (error) {
    if (error.message === 'INVALID_REPORT_TRANSITION') return apiError(409, error.message, 'Cette transition de signalement n’est pas autorisée.');
    if (error.message === 'FORBIDDEN_REPORT_ACTION') return apiError(403, error.message, 'Vous ne pouvez pas effectuer cette action.');
    return apiError(500, 'INTERNAL_ERROR', 'Impossible de traiter le signalement.');
  }
}
