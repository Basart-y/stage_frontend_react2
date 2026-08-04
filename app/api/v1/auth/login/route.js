import { createHash } from 'node:crypto';
import { ok, apiError } from '@/lib/backend/http.js';
import { login } from '@/lib/backend/accountDomain.js';
import { writeAuditTrace } from '@/lib/backend/auditDomain.js';
import { clearRateLimit, consumeRateLimit, loginRateLimitKey } from '@/lib/backend/rateLimit.js';
import { log, requestIdFrom } from '@/lib/backend/logger.js';

function anonymizedIdentity(email) {
  return createHash('sha256').update(String(email || '').trim().toLowerCase()).digest('hex').slice(0, 16);
}

export async function POST(request) {
  const requestId = requestIdFrom(request);
  let email = '';
  let rateKey = '';
  try {
    const body = await request.json();
    email = String(body?.email || '').trim().toLowerCase();
    rateKey = loginRateLimitKey(request, email);
    const rate = consumeRateLimit(rateKey);
    if (!rate.allowed) {
      log('warn', 'auth.login.rate_limited', { requestId, ctx: { identityHash: anonymizedIdentity(email) } });
      const response = apiError(429, 'TOO_MANY_LOGIN_ATTEMPTS', 'Trop de tentatives de connexion. Réessayez plus tard.', [], requestId);
      response.headers.set('Retry-After', String(rate.retryAfterSeconds));
      return response;
    }

    const session = await login(body);
    clearRateLimit(rateKey);
    await writeAuditTrace({
      request,
      requestId,
      eventType: 'auth.login.succeeded',
      action: 'identity.login',
      actor: { sub: session.user.id, role: session.user.role },
      resourceType: 'identity',
      resourceId: session.user.id,
      metadata: { portalRole: String(body?.portalRole || '') },
    });
    log('info', 'auth.login.succeeded', { requestId, ctx: { actorId: session.user.id, role: session.user.role } });
    return ok(session, {}, requestId);
  } catch (e) {
    const identityHash = anonymizedIdentity(email);
    await writeAuditTrace({
      request,
      requestId,
      eventType: 'auth.login.failed',
      action: 'identity.login',
      resourceType: 'identity',
      resourceId: identityHash,
      metadata: { identityHash, errorCode: e.message },
    }).catch(() => {});
    log(e?.name === 'MongoServerSelectionError' ? 'error' : 'warn', 'auth.login.failed', {
      requestId,
      ctx: { identityHash, errorCode: e?.message || 'UNKNOWN' },
      error: e?.name === 'MongoServerSelectionError' ? e : undefined,
    });
    if (e.message === 'ROLE_PORTAL_MISMATCH') return apiError(403, e.message, 'Ce compte ne peut pas se connecter depuis cet espace.', [], requestId);
    if (e.message === 'INVALID_PORTAL_ROLE') return apiError(400, e.message, 'Espace de connexion invalide.', [], requestId);
    if (e.message === 'INVALID_CREDENTIALS') return apiError(401, e.message, 'Email ou mot de passe incorrect.', [], requestId);
    if (e.message === 'ACCOUNT_SUSPENDED') return apiError(403, e.message, 'Ce compte est suspendu.', [], requestId);
    if (e.message === 'ACCOUNT_INACTIVE') return apiError(403, e.message, 'Ce compte n’est pas encore actif.', [], requestId);
    if (e.message === 'JWT_SECRET_MISSING_OR_WEAK') return apiError(500, e.message, 'Configuration serveur invalide.', [], requestId);
    if (e?.name === 'MongoServerSelectionError' || /ECONNREFUSED|MongoServerSelection/i.test(String(e?.message || ''))) {
      return apiError(503, 'MONGODB_UNAVAILABLE', 'Service temporairement indisponible.', [], requestId);
    }
    return apiError(500, 'INTERNAL_ERROR', 'Connexion impossible.', [], requestId);
  }
}
