import test from 'node:test';
import assert from 'node:assert/strict';
import { clearRateLimit, consumeRateLimit } from '../lib/backend/rateLimit.js';

test('le rate limiting bloque après la limite configurée', () => {
  const key = `test-${Date.now()}-${Math.random()}`;
  clearRateLimit(key);
  assert.equal(consumeRateLimit(key, { limit: 2, windowMs: 60_000 }).allowed, true);
  assert.equal(consumeRateLimit(key, { limit: 2, windowMs: 60_000 }).allowed, true);
  const blocked = consumeRateLimit(key, { limit: 2, windowMs: 60_000 });
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSeconds > 0);
  clearRateLimit(key);
});

test('la remise à zéro réautorise une tentative', () => {
  const key = `test-${Date.now()}-${Math.random()}`;
  consumeRateLimit(key, { limit: 1, windowMs: 60_000 });
  assert.equal(consumeRateLimit(key, { limit: 1, windowMs: 60_000 }).allowed, false);
  clearRateLimit(key);
  assert.equal(consumeRateLimit(key, { limit: 1, windowMs: 60_000 }).allowed, true);
  clearRateLimit(key);
});
