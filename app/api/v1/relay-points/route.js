import { collection } from '@/lib/backend/http.js';
import { requireAuth } from '@/lib/backend/auth.js';
import { listRelayPoints } from '@/lib/backend/relayPointDomain.js';

export async function GET(request) {
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
  return collection(points, { limit: points.length, hasNext: false });
}
