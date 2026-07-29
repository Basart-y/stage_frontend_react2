import { collection, ok, apiError } from '@/lib/backend/http.js';
import { requireAuth } from '@/lib/backend/auth.js';
import { reportRepository } from '@/lib/backend/reportRepository.js';
import { createReport } from '@/lib/backend/reportDomain.js';
import { userRepository } from '@/lib/backend/userRepository.js';
import { scopeAllows } from '@/lib/backend/geography.js';

export async function GET(request) {
  const auth = await requireAuth(request, ['commercant','point_relais','gestionnaire','super_gestionnaire','gestionnaire_financier']);
  if (auth.error) return auth.error;
  const { searchParams } = new URL(request.url);
  const filters = {
    type: searchParams.get('type') || undefined,
    status: searchParams.get('status') || undefined,
    limit: Math.min(Number(searchParams.get('limit')) || 50, 100),
  };
  const role = auth.claims.role;
  if (['commercant','point_relais'].includes(role)) filters.authorId = auth.claims.sub;
  if (role === 'gestionnaire_financier') filters.assignedRole = 'gestionnaire_financier';
  let reports = await reportRepository.list(filters);
  if (role === 'gestionnaire') {
    reports = reports.filter(report => report.type !== 'probleme_paiement' && report.status !== 'escalade' && scopeAllows(auth.claims.scope, report.geography || {}));
  }
  if (role === 'gestionnaire_financier') {
    reports = reports.filter(report => report.type === 'probleme_paiement');
  }
  return collection(reports, { limit: filters.limit, hasNext: false });
}

export async function POST(request) {
  const auth = await requireAuth(request, ['commercant','point_relais']);
  if (auth.error) return auth.error;
  try {
    const author = await userRepository.findById(auth.claims.sub);
    if (!author) return apiError(404, 'USER_NOT_FOUND', 'Compte introuvable.');
    return ok(await createReport(await request.json(), author), { status: 201 });
  } catch (error) {
    if (error.message === 'INVALID_REPORT_TYPE') return apiError(400, error.message, 'Type de signalement invalide.');
    if (error.message === 'DESCRIPTION_REQUIRED') return apiError(400, error.message, 'La description du problème est requise.');
    return apiError(500, 'INTERNAL_ERROR', 'Impossible de créer le signalement.');
  }
}
