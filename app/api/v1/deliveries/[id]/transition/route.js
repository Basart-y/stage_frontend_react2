import { ok, apiError } from '@/lib/backend/http.js';
import { requireAuth } from '@/lib/backend/auth.js';
import { transitionDelivery } from '@/lib/backend/deliveryDomain.js';

export async function POST(request, { params }) {
  const auth = await requireAuth(request, ['commercant','point_relais','gestionnaire','super_gestionnaire']);
  if (auth.error) return auth.error;
  const { id } = await params;
  const body = await request.json();
  if (!body?.status) return apiError(400,'STATUS_REQUIRED','Le statut cible est requis.');
  try {
    const extra = {};
    if (body.parcelCondition) extra.parcelCondition = body.parcelCondition;
    if (body.status === 'Retiré') extra.proof = { ...(body.proof || {}), date: new Date().toISOString() };
    if (body.status === 'Retour demandé') extra.returnReason = String(body.returnReason || body.comment || '').trim();
    if (body.status === 'Retourné') extra.returnedAt = new Date().toISOString();
    return ok(await transitionDelivery(id, body.status, body.comment, extra, auth.claims, { request }));
  } catch (error) {
    const map = {
      DELIVERY_NOT_FOUND:[404,'Livraison introuvable.'], INVALID_TRANSITION:[409,'Cette transition d’état n’est pas autorisée.'],
      FORBIDDEN:[403,'Accès refusé à cette livraison.'], FORBIDDEN_TRANSITION_ROLE:[403,'Votre rôle ne peut pas effectuer cette transition.'],
    };
    const entry = map[error.message];
    return entry ? apiError(entry[0], error.message, entry[1]) : apiError(500,'INTERNAL_ERROR','Impossible de mettre à jour la livraison.');
  }
}
