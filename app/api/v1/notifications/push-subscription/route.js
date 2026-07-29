import { ok, apiError } from '@/lib/backend/http.js';
import { requireAuth } from '@/lib/backend/auth.js';
import { pushSubscriptionRepository } from '@/lib/backend/pushSubscriptionRepository.js';

const ROLES = ['commercant','point_relais','gestionnaire','super_gestionnaire','gestionnaire_financier'];

export async function POST(request) {
  const auth = await requireAuth(request, ROLES);
  if (auth.error) return auth.error;
  const body = await request.json();
  if (!body?.subscription?.endpoint || !body?.subscription?.keys?.p256dh || !body?.subscription?.keys?.auth) {
    return apiError(400, 'INVALID_PUSH_SUBSCRIPTION', 'Abonnement Web Push invalide.');
  }
  const saved = await pushSubscriptionRepository.upsert(auth.claims.sub, body.subscription);
  return ok({ endpoint: saved.endpoint, registered: true });
}

export async function DELETE(request) {
  const auth = await requireAuth(request, ROLES);
  if (auth.error) return auth.error;
  const body = await request.json();
  if (!body?.endpoint) return apiError(400, 'PUSH_ENDPOINT_REQUIRED', 'Endpoint Web Push requis.');
  const removed = await pushSubscriptionRepository.remove(auth.claims.sub, body.endpoint);
  return ok({ removed });
}
