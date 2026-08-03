import { collection, ok, apiError } from '@/lib/backend/http.js';
import { requireAuth } from '@/lib/backend/auth.js';
import { deliveryRepository } from '@/lib/backend/deliveryRepository.js';
import { createDelivery, canReadDelivery } from '@/lib/backend/deliveryDomain.js';

export async function GET(request) {
  const auth = await requireAuth(request, ['commercant','point_relais','gestionnaire','super_gestionnaire','gestionnaire_financier']);
  if (auth.error) return auth.error;
  const { searchParams } = new URL(request.url);
  const page = Math.max(Number(searchParams.get('page')) || 1, 1);
  const limit = Math.min(Math.max(Number(searchParams.get('limit')) || 20, 1), 100);
  const filters = {
    status: searchParams.get('status') || undefined,
    query: searchParams.get('query') || undefined,
    limit,
    skip: (page - 1) * limit,
  };
  if (auth.claims.role === 'commercant') filters.commerceId = auth.claims.sub;
  if (auth.claims.role === 'point_relais') filters.relayPointId = auth.claims.sub;
  const result = await deliveryRepository.list(filters);
  const rows = result.data || result;
  const visible = rows.filter(row => canReadDelivery(auth.claims, row));
  return collection(visible, {
    page, limit, total: result.total ?? visible.length,
    hasNext: page * limit < (result.total ?? visible.length),
  });
}

export async function POST(request) {
  const auth = await requireAuth(request, ['commercant']);
  if (auth.error) return auth.error;
  try { return ok(await createDelivery(await request.json(), auth.claims, { request }), { status: 201 }); }
  catch (error) {
    const map = {
      RELAY_POINT_REQUIRED:[400,'Un point relais est requis.'], CLIENT_NAME_REQUIRED:[400,'Le nom et le prénom du client sont requis.'],
      RELAY_NOT_FOUND:[404,'Point relais introuvable.'], RELAY_NOT_OPEN:[409,'Ce point relais n’est actuellement pas ouvert.'], FORBIDDEN:[403,'Action non autorisée.'],
    };
    const entry = map[error.message];
    return entry ? apiError(entry[0], error.message, entry[1]) : apiError(500,'INTERNAL_ERROR','Impossible de créer la livraison.');
  }
}
