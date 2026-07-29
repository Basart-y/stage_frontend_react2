import { ok, apiError } from '@/lib/backend/http.js';
import { login } from '@/lib/backend/accountDomain.js';

export async function POST(request) {
  try {
    return ok(await login(await request.json()));
  } catch (e) {
    if (e.message === 'INVALID_CREDENTIALS') return apiError(401, e.message, 'Email ou mot de passe incorrect.');
    if (e.message === 'ACCOUNT_SUSPENDED') return apiError(403, e.message, 'Ce compte est suspendu.');
    if (e.message === 'ACCOUNT_INACTIVE') return apiError(403, e.message, 'Ce compte n’est pas encore actif.');
    if (e.message === 'JWT_SECRET_MISSING_OR_WEAK') {
      return apiError(500, e.message, 'Configuration serveur invalide : JWT_SECRET doit contenir au moins 32 caractères.');
    }
    if (e?.name === 'MongoServerSelectionError' || /ECONNREFUSED|MongoServerSelection/i.test(String(e?.message || ''))) {
      return apiError(503, 'MONGODB_UNAVAILABLE', 'MongoDB est inaccessible. Vérifiez que le serveur MongoDB est démarré et que MONGODB_URI est correct.');
    }
    console.error('[auth/login]', e);
    return apiError(500, 'INTERNAL_ERROR', 'Connexion impossible. Consultez le terminal du serveur pour le détail.');
  }
}
