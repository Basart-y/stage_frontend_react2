import { requireAuth } from '@/lib/backend/auth.js';
import { ok } from '@/lib/backend/http.js';

const ROLES = ['commercant','point_relais','gestionnaire','super_gestionnaire','gestionnaire_financier'];

export async function GET(request) {
  const auth = await requireAuth(request, ROLES);
  if (auth.error) return auth.error;
  const user = auth.user;
  return ok({
    id: user.id,
    email: user.email,
    role: user.role,
    scope: user.scope || null,
    profile: user.profile || {},
    statutCompte: user.statutCompte,
  });
}
