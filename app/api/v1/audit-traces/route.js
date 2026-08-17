import { collection } from '@/lib/backend/http.js';
import { requireAuth } from '@/lib/backend/auth.js';
import { auditRepository } from '@/lib/backend/auditRepository.js';

function endOfDay(value) {
  if (!value) return undefined;
  return `${value}T23:59:59.999Z`;
}

function startOfDay(value) {
  if (!value) return undefined;
  return `${value}T00:00:00.000Z`;
}

export async function GET(request) {
  const auth = await requireAuth(request, ['gestionnaire','super_gestionnaire']);
  if (auth.error) return auth.error;
  const { searchParams } = new URL(request.url);
  const page = Math.max(Number(searchParams.get('page')) || 1, 1);
  const limit = Math.min(Math.max(Number(searchParams.get('limit')) || 50, 1), 200);
  const result = await auditRepository.list({
    resourceType: searchParams.get('resourceType') || undefined,
    resourceId: searchParams.get('resourceId') || undefined,
    actorId: searchParams.get('actorId') || undefined,
    actorRole: searchParams.get('actorRole') || undefined,
    eventType: searchParams.get('eventType') || undefined,
    action: searchParams.get('action') || undefined,
    dateFrom: startOfDay(searchParams.get('dateFrom')),
    dateTo: endOfDay(searchParams.get('dateTo')),
    limit,
    skip: (page - 1) * limit,
  });
  return collection(result.data, { page, limit, total: result.total, hasNext: page * limit < result.total });
}
