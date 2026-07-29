import { ok } from '@/lib/backend/http.js';
import { requireAuth } from '@/lib/backend/auth.js';
import { realtimeStats } from '@/lib/backend/realtimeHub.js';

export async function GET(request) {
  const auth = await requireAuth(request, ['super_gestionnaire']);
  if (auth.error) return auth.error;
  return ok(realtimeStats());
}
