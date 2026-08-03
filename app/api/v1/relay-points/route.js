import { collection } from '@/lib/backend/http.js';
import { requireAuth } from '@/lib/backend/auth.js';
import { listRelayPoints } from '@/lib/backend/relayPointDomain.js';
import {log, requestIdFrom} from '@/lib/backend/logger.js';

export async function GET(request) {
  const requestId = requestIdFrom(request);
  const startedAt = Date.now();
  try {
  log('info', 'recherche points relais reçue', {requestId, ctx:{path:'/api/v1/relay-points'}});
  const auth = await requireAuth(request, ['commercant','point_relais','gestionnaire','super_gestionnaire']);
  if (auth.error) return auth.error;
  const { searchParams } = new URL(request.url);
  const points = await listRelayPoints({
    city: searchParams.get('city') || '',
    postalCode: searchParams.get('postalCode') || '',
    department: searchParams.get('department') || '',
    openOnly: auth.claims.role === 'commercant' ? true : searchParams.get('openOnly') !== 'false',
    managerScope: auth.claims.role === 'gestionnaire' ? auth.claims.scope : null,
  });
  log('info', 'recherche points relais terminée', {requestId, ctx:{count:points.length, durationMs:Date.now()-startedAt}});
  return collection(points, { limit: points.length, hasNext: false }, {}, requestId);
  } catch (error) {
    log('error', 'échec recherche points relais', {requestId, error, ctx:{durationMs:Date.now()-startedAt}});
    const { apiError } = await import('@/lib/backend/http.js');
    return apiError(500, 'INTERNAL_ERROR', 'Impossible de rechercher les points relais pour le moment.', [], requestId);
  }
}
