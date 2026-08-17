import { ok, apiError } from '@/lib/backend/http.js';
import { inspectInvitation } from '@/lib/backend/accountDomain.js';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    return ok(await inspectInvitation({ email: url.searchParams.get('email'), token: url.searchParams.get('token') }));
  } catch (e) {
    const map = {
      INVITATION_NOT_FOUND: [404, 'Invitation introuvable.'],
      INVITATION_EXPIRED: [410, 'Invitation expirée.'],
      INVALID_INVITATION_TOKEN: [400, "Lien d’invitation invalide."],
    };
    if (map[e.message]) return apiError(map[e.message][0], e.message, map[e.message][1]);
    return apiError(500, 'INTERNAL_ERROR', "Lecture de l’invitation impossible.");
  }
}
