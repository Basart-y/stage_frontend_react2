import { ok, apiError } from '@/lib/backend/http.js';
import { requireAuth } from '@/lib/backend/auth.js';
import { getRelayProfile, updateRelayProfile } from '@/lib/backend/relayPointDomain.js';

export async function GET(request) {
  const auth = await requireAuth(request, ['point_relais']);
  if (auth.error) return auth.error;
  try { return ok(await getRelayProfile(auth.claims.sub)); }
  catch { return apiError(404, 'RELAY_NOT_FOUND', 'Point relais introuvable.'); }
}
export async function PATCH(request) {
  const auth = await requireAuth(request, ['point_relais']);
  if (auth.error) return auth.error;
  try { return ok(await updateRelayProfile(auth.claims.sub, await request.json())); }
  catch (e) {
    const errors = {
      RELAY_NOT_FOUND: [404,'Point relais introuvable.'], INVALID_OPERATIONAL_STATUS:[400,'Statut opérationnel invalide.'],
      RELAY_NAME_REQUIRED:[400,'Le nom du point relais est requis.'], GEOGRAPHY_REQUIRED:[400,'La ville et le département sont requis.'],
      INVALID_CAPACITY:[400,'La capacité doit être un nombre positif.'],
    };
    const entry = errors[e.message];
    return entry ? apiError(entry[0], e.message, entry[1]) : apiError(500,'INTERNAL_ERROR','Impossible de mettre à jour le point relais.');
  }
}
