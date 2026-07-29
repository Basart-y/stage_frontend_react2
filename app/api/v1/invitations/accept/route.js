import { ok, apiError } from '@/lib/backend/http.js';
import { acceptInvitation } from '@/lib/backend/accountDomain.js';
export async function POST(request) {
  try { return ok(await acceptInvitation(await request.json())); }
  catch (e) {
    const map = { INVITATION_NOT_FOUND: [404,'Invitation introuvable.'], INVITATION_EXPIRED:[410,'Invitation expirée.'], INVALID_INVITATION_TOKEN:[400,'Lien d’invitation invalide.'], WEAK_PASSWORD:[400,'Le mot de passe doit contenir au moins 8 caractères.'], PASSWORD_TOO_LONG:[400,'Le mot de passe dépasse la limite de 72 octets acceptée par bcrypt.'] };
    if (map[e.message]) return apiError(map[e.message][0], e.message, map[e.message][1]);
    return apiError(500, 'INTERNAL_ERROR', 'Activation du compte impossible.');
  }
}
