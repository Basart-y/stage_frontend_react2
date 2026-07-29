import { collection, ok, apiError } from '@/lib/backend/http.js';
import { requireAuth } from '@/lib/backend/auth.js';
import { createRegistrationRequest, listRegistrationRequests } from '@/lib/backend/registrationRequestDomain.js';

export async function POST(request) {
  try {
    return ok(await createRegistrationRequest(await request.json()), { status: 201 });
  } catch (e) {
    const map = {
      INVALID_ROLE: [400, 'Type de compte invalide.'], INVALID_EMAIL: [400, 'Email invalide.'],
      EMAIL_ALREADY_USED: [409, 'Un compte existe déjà avec cet email.'], REQUEST_ALREADY_PENDING: [409, 'Une demande est déjà en attente pour cet email.'],
      GEOGRAPHY_REQUIRED: [400, 'La ville et le département sont obligatoires.'], NAME_REQUIRED: [400, 'Le nom est obligatoire.'],
      WEAK_PASSWORD: [400, 'Le mot de passe doit contenir au moins 8 caractères.'], PASSWORD_TOO_LONG: [400, 'Le mot de passe est trop long.'],
    };
    const item = map[e.message];
    return item ? apiError(item[0], e.message, item[1]) : apiError(500, 'INTERNAL_ERROR', 'Impossible d’enregistrer la demande.');
  }
}

export async function GET(request) {
  const auth = await requireAuth(request, ['gestionnaire', 'super_gestionnaire']);
  if (auth.error) return auth.error;
  const { searchParams } = new URL(request.url);
  const filters = {
    role: searchParams.get('role') || undefined,
    status: searchParams.get('status') || undefined,
    limit: Math.min(Number(searchParams.get('limit')) || 100, 100),
  };
  return collection(await listRegistrationRequests(filters, auth.claims), { limit: filters.limit, hasNext: false });
}
