import { ok, apiError } from '@/lib/backend/http.js';
import { requireAuth } from '@/lib/backend/auth.js';
import { notificationRepository } from '@/lib/backend/notificationRepository.js';

export async function POST(request) {
  const auth = await requireAuth(request, ['commercant','point_relais','gestionnaire','super_gestionnaire','gestionnaire_financier']);
  if (auth.error) return auth.error;
  const body = await request.json();
  if (!Array.isArray(body.ids) || !body.ids.length) return apiError(400, 'NOTIFICATION_IDS_REQUIRED', 'Sélectionnez au moins une notification.');
  return ok(await notificationRepository.markRead(body.ids, auth.claims.sub, auth.claims.role));
}
