import { timingSafeEqual, webcrypto } from 'node:crypto';
import { apiError } from '@/lib/backend/http.js';
import { userRepository } from '@/lib/backend/userRepository.js';

const encoder = new TextEncoder();
const JWT_TTL_SECONDS = 15 * 60;

function b64url(value) {
  return Buffer.from(value).toString('base64url');
}
function fromB64url(value) {
  return Buffer.from(value, 'base64url');
}
async function hmac(data) {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) throw new Error('JWT_SECRET_MISSING_OR_WEAK');
  const key = await webcrypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await webcrypto.subtle.sign('HMAC', key, encoder.encode(data)));
}
export async function signAccessToken(user) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  // Le token transporte l'identité et un hint de rôle, mais l'autorisation réelle est revalidée côté serveur.
  const payload = b64url(JSON.stringify({ sub: String(user.id), role: user.role, iat: now, exp: now + JWT_TTL_SECONDS }));
  const content = `${header}.${payload}`;
  return `${content}.${b64url(await hmac(content))}`;
}
export async function verifyAccessToken(token) {
  try {
    const [header, payload, signature] = String(token || '').split('.');
    if (!header || !payload || !signature) return null;
    const parsedHeader = JSON.parse(fromB64url(header).toString('utf8'));
    if (parsedHeader.alg !== 'HS256' || parsedHeader.typ !== 'JWT') return null;
    const content = `${header}.${payload}`;
    const expected = Buffer.from(await hmac(content));
    const given = fromB64url(signature);
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
    const claims = JSON.parse(fromB64url(payload).toString('utf8'));
    if (!claims.sub || !claims.exp || claims.exp <= Math.floor(Date.now() / 1000)) return null;
    return claims;
  } catch {
    return null;
  }
}
export async function requireAuth(request, roles = []) {
  const auth = request.headers.get('authorization') || '';
  const tokenClaims = await verifyAccessToken(auth.startsWith('Bearer ') ? auth.slice(7) : '');
  if (!tokenClaims) return { error: apiError(401, 'UNAUTHORIZED', 'Authentification requise.') };

  // Relecture de l'utilisateur à chaque requête sensible : suspension, rôle et périmètre prennent effet immédiatement.
  const user = await userRepository.findById(tokenClaims.sub);
  if (!user || user.statutCompte !== 'actif') {
    return { error: apiError(401, user?.statutCompte === 'suspendu' ? 'ACCOUNT_SUSPENDED' : 'UNAUTHORIZED', 'Compte indisponible.') };
  }
  if (roles.length && !roles.includes(user.role)) {
    return { error: apiError(403, 'FORBIDDEN', 'Action non autorisée pour ce rôle.') };
  }
  return { claims: { sub: String(user.id), role: user.role, scope: user.scope || null }, user };
}
