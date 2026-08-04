import { createHash } from 'node:crypto';

const store = globalThis.__relayflowRateLimitStore || new Map();
globalThis.__relayflowRateLimitStore = store;

function hash(value) {
  return createHash('sha256').update(String(value || '')).digest('hex').slice(0, 24);
}

export function clientIp(request) {
  const forwarded = request?.headers?.get?.('x-forwarded-for');
  return String(forwarded?.split(',')[0]?.trim() || request?.headers?.get?.('x-real-ip') || 'unknown');
}

export function loginRateLimitKey(request, email) {
  return `login:${hash(clientIp(request))}:${hash(String(email || '').trim().toLowerCase())}`;
}

export function consumeRateLimit(key, { limit = 8, windowMs = 15 * 60 * 1000 } = {}) {
  const now = Date.now();
  const current = store.get(key);
  if (!current || current.resetAt <= now) {
    const fresh = { count: 1, resetAt: now + windowMs };
    store.set(key, fresh);
    return { allowed: true, remaining: Math.max(0, limit - 1), retryAfterSeconds: 0 };
  }
  current.count += 1;
  store.set(key, current);
  const allowed = current.count <= limit;
  return {
    allowed,
    remaining: Math.max(0, limit - current.count),
    retryAfterSeconds: allowed ? 0 : Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}

export function clearRateLimit(key) {
  store.delete(key);
}
