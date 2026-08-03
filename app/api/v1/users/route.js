import { collection } from '@/lib/backend/http.js';
import { requireAuth } from '@/lib/backend/auth.js';
import { userRepository } from '@/lib/backend/userRepository.js';
import { scopeAllows } from '@/lib/backend/geography.js';
export async function GET(request) {
  const auth = await requireAuth(request, ['gestionnaire','super_gestionnaire','gestionnaire_financier']);
  if (auth.error) return auth.error;
  const { searchParams } = new URL(request.url);
  const filters = { role: searchParams.get('role') || undefined, statutCompte: searchParams.get('statutCompte') || undefined, search: searchParams.get('search') || undefined, page: Number(searchParams.get('page')) || 1, limit: Math.min(Number(searchParams.get('limit')) || 20, 100) };
  let result = await userRepository.list(filters);
  if (auth.claims.role === 'gestionnaire') {
    const filtered = result.rows.filter(u => ['commercant','point_relais'].includes(u.role) && scopeAllows(auth.claims.scope, u));
    result = { ...result, rows: filtered, total: filtered.length };
  }
  return collection(result.rows, { page: result.page, limit: result.limit, total: result.total, hasNext: result.page * result.limit < result.total });
}
