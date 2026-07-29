import { collection } from '@/lib/backend/http.js';
import { requireAuth } from '@/lib/backend/auth.js';
import { notificationRepository } from '@/lib/backend/notificationRepository.js';

export async function GET(request) {
  const auth = await requireAuth(request, ['commercant','point_relais','gestionnaire','super_gestionnaire','gestionnaire_financier']);
  if (auth.error) return auth.error;
  const { searchParams } = new URL(request.url);
  const unreadOnly = searchParams.get('unreadOnly') === 'true';
  const limit = Math.min(Number(searchParams.get('limit')) || 50, 100);
  const direct = await notificationRepository.list({ recipientId: auth.claims.sub, unreadOnly, limit });
  const roleWide = await notificationRepository.list({ audienceRole: auth.claims.role, viewerId: auth.claims.sub, unreadOnly, limit });
  const merged = [...direct, ...roleWide]
    .filter((item, index, arr) => arr.findIndex(candidate => candidate.id === item.id) === index)
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    .slice(0, limit);
  return collection(merged, { limit, hasNext: false });
}
