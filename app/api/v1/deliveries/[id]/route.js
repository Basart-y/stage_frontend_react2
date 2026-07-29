import { ok, apiError } from '@/lib/backend/http.js';
import { requireAuth } from '@/lib/backend/auth.js';
import { deliveryRepository } from '@/lib/backend/deliveryRepository.js';
import { canReadDelivery } from '@/lib/backend/deliveryDomain.js';

export async function GET(request, { params }) {
  const auth = await requireAuth(request, ['commercant','point_relais','gestionnaire','super_gestionnaire','gestionnaire_financier']);
  if (auth.error) return auth.error;
  const { id } = await params;
  const delivery = await deliveryRepository.findById(id);
  if (!delivery) return apiError(404,'DELIVERY_NOT_FOUND','Livraison introuvable.');
  if (!canReadDelivery(auth.claims, delivery)) return apiError(403,'FORBIDDEN','Accès refusé à cette livraison.');
  return ok(delivery);
}
