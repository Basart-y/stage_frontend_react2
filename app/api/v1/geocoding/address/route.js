import { apiError, ok } from '@/lib/backend/http.js';
import { requireAuth } from '@/lib/backend/auth.js';
import { log, requestIdFrom } from '@/lib/backend/logger.js';

export async function POST(request) {
  const requestId = requestIdFrom(request);
  const auth = await requireAuth(request, ['point_relais']);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const address = String(body.address || '').trim();
    const city = String(body.city || '').trim();
    const postalCode = String(body.postalCode || '').trim();
    const department = String(body.department || '').trim();

    if (!address || !city) {
      return apiError(400, 'GEOCODING_ADDRESS_REQUIRED', "L'adresse et la ville sont nécessaires pour placer le point relais.", [], requestId);
    }

    const query = [address, postalCode, city, department, 'France'].filter(Boolean).join(', ');
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', query);
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('limit', '1');
    url.searchParams.set('countrycodes', 'fr');

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'RelaisSmart/1.0 (contact: admin@example.com)',
        'Accept-Language': 'fr',
      },
      cache: 'no-store',
    });

    if (!response.ok) throw new Error(`GEOCODING_PROVIDER_${response.status}`);
    const results = await response.json();
    const first = Array.isArray(results) ? results[0] : null;

    if (!first || !Number.isFinite(Number(first.lat)) || !Number.isFinite(Number(first.lon))) {
      log('warn', 'adresse de point relais non géocodée', { requestId, ctx: { userId: auth.claims.sub } });
      return apiError(404, 'ADDRESS_NOT_FOUND', "L'adresse n'a pas été trouvée. Vérifiez-la ou saisissez les coordonnées manuellement.", [], requestId);
    }

    log('info', 'coordonnées de point relais calculées', { requestId, ctx: { userId: auth.claims.sub } });
    return ok({ latitude: Number(first.lat), longitude: Number(first.lon), displayName: String(first.display_name || '') }, {status: 200}, requestId);
  } catch (error) {
    log('error', 'échec du géocodage du point relais', { requestId, ctx: { userId: auth.claims.sub }, error });
    return apiError(502, 'GEOCODING_UNAVAILABLE', 'Le service de localisation est temporairement indisponible. Vous pouvez saisir les coordonnées manuellement.', [], requestId);
  }
}
