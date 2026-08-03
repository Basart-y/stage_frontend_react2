import { userRepository } from '@/lib/backend/userRepository.js';
import { scopeAllows } from '@/lib/backend/geography.js';

const OPERATIONAL = ['ouvert', 'vacances', 'travaux', 'fermeture_exceptionnelle', 'autre'];
const DAYS = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];

function publicRelay(user) {
  const p = user.profile || {};
  return {
    id: user.id,
    userId: user.id,
    name: p.relayName || p.nom || user.email,
    address: p.relayAddress || p.adresse || '',
    city: p.relayCity || p.ville || '',
    ville: p.relayCity || p.ville || '',
    department: p.department || p.departement || '',
    departement: p.department || p.departement || '',
    postalCode: p.postalCode || '',
    latitude: Number(p.latitude || 0),
    longitude: Number(p.longitude || 0),
    capacity: Number(p.capacity || p.capacite || 0),
    operationalStatus: p.operationalStatus || p.statutOperationnel || 'ouvert',
    status: p.operationalStatus || p.statutOperationnel || 'ouvert',
    hours: Array.isArray(p.hours) ? p.hours : [],
  };
}

export async function listRelayPoints({ city = '', postalCode = '', department = '', openOnly = true, managerScope = null } = {}) {
  const result = await userRepository.list({ role: 'point_relais', statutCompte: 'actif', limit: 100 });
  const users = Array.isArray(result) ? result : (result?.rows || []);
  const n = v => String(v || '').trim().toLocaleLowerCase('fr-FR');
  return users
    .filter(u => !managerScope || scopeAllows(managerScope, u))
    .map(publicRelay)
    .filter(p => !city || n(p.city).includes(n(city)))
    .filter(p => !postalCode || n(p.postalCode) === n(postalCode))
    .filter(p => !department || n(p.department) === n(department))
    .filter(p => !openOnly || p.operationalStatus === 'ouvert');
}

export async function getRelayProfile(userId) {
  const user = await userRepository.findById(userId);
  if (!user || user.role !== 'point_relais') throw new Error('RELAY_NOT_FOUND');
  return publicRelay(user);
}

export async function updateRelayProfile(userId, input) {
  const user = await userRepository.findById(userId);
  if (!user || user.role !== 'point_relais') throw new Error('RELAY_NOT_FOUND');
  const status = input.operationalStatus || 'ouvert';
  if (!OPERATIONAL.includes(status)) throw new Error('INVALID_OPERATIONAL_STATUS');
  if (!String(input.relayName || '').trim()) throw new Error('RELAY_NAME_REQUIRED');
  if (!String(input.relayCity || '').trim() || !String(input.department || '').trim()) throw new Error('GEOGRAPHY_REQUIRED');
  if (!Number.isFinite(Number(input.capacity)) || Number(input.capacity) < 0) throw new Error('INVALID_CAPACITY');
  const hours = Array.isArray(input.hours) ? input.hours.map((h, i) => ({
    day: DAYS.includes(h.day) ? h.day : DAYS[i] || String(h.day || ''),
    open: String(h.open || ''), close: String(h.close || ''), closed: Boolean(h.closed),
  })) : [];
  const profile = {
    ...(user.profile || {}),
    relayName: String(input.relayName).trim(), relayAddress: String(input.relayAddress || '').trim(),
    relayCity: String(input.relayCity).trim(), ville: String(input.relayCity).trim(),
    department: String(input.department).trim(), departement: String(input.department).trim(),
    postalCode: String(input.postalCode || '').trim(), latitude: Number(input.latitude || 0), longitude: Number(input.longitude || 0),
    capacity: Number(input.capacity), operationalStatus: status, hours,
  };
  await userRepository.update(userId, { profile, updatedAt: new Date().toISOString() });
  return getRelayProfile(userId);
}
