import { ok, apiError } from '@/lib/backend/http.js';
import { requireAuth } from '@/lib/backend/auth.js';
import { decideRegistrationRequest } from '@/lib/backend/registrationRequestDomain.js';

export async function PATCH(request, { params }) {
  const auth = await requireAuth(request, ['gestionnaire', 'super_gestionnaire']);
  if (auth.error) return auth.error;
  try {
    const { id } = await params;
    const body = await request.json();
    return ok(await decideRegistrationRequest(id, body.action, auth.claims, body.comment));
  } catch (e) {
    const map = {
      REQUEST_NOT_FOUND: [404, 'Demande introuvable.'], REQUEST_ALREADY_DECIDED: [409, 'Cette demande a déjà été traitée.'],
      OUT_OF_SCOPE: [403, 'Cette demande est hors de votre périmètre.'], INVALID_ACTION: [400, 'Action invalide.'],
      EMAIL_ALREADY_USED: [409, 'Un compte existe déjà avec cet email.'], INVALID_ROLE: [400, 'Type de compte invalide.'],
    };
    const item = map[e.message];
    return item ? apiError(item[0], e.message, item[1]) : apiError(500, 'INTERNAL_ERROR', 'Impossible de traiter la demande.');
  }
}
