import {randomUUID} from 'node:crypto';

const LEVELS = new Set(['debug', 'info', 'warn', 'error']);

export function requestIdFrom(request) {
  return request?.headers?.get?.('x-request-id') || randomUUID();
}

export function log(level, msg, {requestId, ctx = {}, error} = {}) {
  const normalizedLevel = LEVELS.has(level) ? level : 'info';
  if (normalizedLevel === 'debug' && process.env.NODE_ENV === 'production') return;
  const entry = {
    ts: new Date().toISOString(),
    level: normalizedLevel,
    requestId: requestId || randomUUID(),
    msg,
    ctx,
  };
  if (error) entry.error = {name: error.name || 'Error', message: error.message || String(error)};
  const output = JSON.stringify(entry);
  if (normalizedLevel === 'error') console.error(output);
  else if (normalizedLevel === 'warn') console.warn(output);
  else console.log(output);
}
