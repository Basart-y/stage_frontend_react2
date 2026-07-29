import { collection } from '@/lib/backend/http.js';
import { requireAuth } from '@/lib/backend/auth.js';
import { userRepository } from '@/lib/backend/userRepository.js';
import { scopeAllows } from '@/lib/backend/geography.js';
export async function GET(request) {
  const auth = await requireAuth(request, ['gestionnaire','super_gestionnaire','gestionnaire_financier']);
  if (auth.error) return auth.error;
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role') || undefined;
  const statutCompte = searchParams.get('statutCompte') || undefined;
  const limit = Math.min(Number(searchParams.get('limit')) || 50, 100);
  let users = await userRepository.list({ role, statutCompte, limit });
  if (auth.claims.role === 'gestionnaire') users = users.filter(u => ['commercant','point_relais'].includes(u.role) && scopeAllows(auth.claims.scope, u));
  return collection(users, { limit, hasNext: false });
}
