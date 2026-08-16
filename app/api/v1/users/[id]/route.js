import { ok, apiError } from '@/lib/backend/http.js';
import { requireAuth } from '@/lib/backend/auth.js';
import { userRepository } from '@/lib/backend/userRepository.js';
import { scopeAllows, assertScopeAllows } from '@/lib/backend/geography.js';

const MANAGED_BY_MANAGER = ['commercant', 'point_relais'];

function canRead(auth, target) {
  if (auth.claims.role === 'super_gestionnaire') return true;
  if (auth.claims.role === 'gestionnaire') return MANAGED_BY_MANAGER.includes(target.role) && scopeAllows(auth.claims.scope, target);
  if (auth.claims.role === 'gestionnaire_financier') return ['commercant', 'point_relais'].includes(target.role);
  return String(auth.claims.sub) === String(target.id);
}

export async function GET(request, { params }) {
  const auth = await requireAuth(request, ['commercant','point_relais','gestionnaire','super_gestionnaire','gestionnaire_financier']);
  if (auth.error) return auth.error;
  const { id } = await params;
  const target = await userRepository.findById(id);
  if (!target) return apiError(404, 'USER_NOT_FOUND', 'Compte introuvable.');
  if (!canRead(auth, target)) return apiError(403, 'FORBIDDEN', 'Accès refusé à ce compte.');
  const { passwordHash, invitationTokenHash, ...safe } = target;
  return ok(safe);
}

export async function PATCH(request, { params }) {
  const auth = await requireAuth(request, ['gestionnaire','super_gestionnaire']);
  if (auth.error) return auth.error;
  const { id } = await params;
  const target = await userRepository.findById(id);
  if (!target) return apiError(404, 'USER_NOT_FOUND', 'Compte introuvable.');

  if (auth.claims.role === 'gestionnaire') {
    if (!MANAGED_BY_MANAGER.includes(target.role) || !scopeAllows(auth.claims.scope, target)) {
      return apiError(403, 'OUT_OF_SCOPE', 'Compte hors de votre périmètre géographique.');
    }
  }

  const body = await request.json();
  const patch = { updatedAt: new Date().toISOString() };
  if (body.profile && typeof body.profile === 'object') {
    const profile = { ...(target.profile || {}), ...body.profile };
    if (auth.claims.role === 'gestionnaire') {
      try { assertScopeAllows(auth.claims.scope, profile); }
      catch { return apiError(403, 'OUT_OF_SCOPE', 'Le nouveau profil sort de votre périmètre.'); }
    }
    patch.profile = profile;
  }
  if (body.scope && target.role === 'gestionnaire' && auth.claims.role === 'super_gestionnaire') {
    if (!['ville','departement','region','pays'].includes(body.scope.niveau)) return apiError(400, 'INVALID_SCOPE', 'Périmètre invalide.');
    if (body.scope.niveau !== 'pays' && !String(body.scope.valeur || '').trim()) return apiError(400, 'INVALID_SCOPE', 'La valeur du périmètre est requise.');
    patch.scope = body.scope.niveau === 'pays' ? { niveau: 'pays' } : { niveau: body.scope.niveau, valeur: String(body.scope.valeur).trim() };
  }
  return ok(await userRepository.update(id, patch));
}
