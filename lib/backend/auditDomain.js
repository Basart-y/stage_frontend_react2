import { auditRepository } from '@/lib/backend/auditRepository.js';

function header(request, name) {
  try { return request?.headers?.get(name) || null; } catch { return null; }
}

export async function writeAuditTrace({ request = null, requestId = null, eventType, action, actor = null, resourceType, resourceId, before = null, after = null, metadata = {} }) {
  const forwarded = header(request, 'x-forwarded-for');
  const entry = {
    id: crypto.randomUUID(),
    requestId: requestId || header(request, 'x-request-id') || crypto.randomUUID(),
    eventType,
    action,
    actorId: actor?.sub || actor?.id || null,
    actorRole: actor?.role || null,
    resourceType,
    resourceId: String(resourceId),
    before,
    after,
    metadata,
    technical: {
      method: request?.method || null,
      path: request ? new URL(request.url).pathname : null,
      ip: forwarded?.split(',')[0]?.trim() || header(request, 'x-real-ip'),
      userAgent: header(request, 'user-agent'),
    },
    occurredAt: new Date().toISOString(),
  };
  return auditRepository.create(entry);
}
