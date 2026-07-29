import { randomUUID } from 'node:crypto';
import { hashPassword } from '@/lib/backend/password.js';
import { userRepository } from '@/lib/backend/userRepository.js';
import { registrationRequestRepository } from '@/lib/backend/registrationRequestRepository.js';
import { scopeAllows } from '@/lib/backend/geography.js';
import { createNotification } from '@/lib/backend/notificationDomain.js';

const PUBLIC_ROLES = ['commercant', 'point_relais'];
const STATUSES = ['PENDING', 'APPROVED', 'REJECTED'];

function normalizedProfile(input, role) {
  const profile = input?.profile || {};
  const ville = String(profile.ville || input?.city || '').trim();
  const departement = String(profile.departement || input?.department || '').trim();
  if (!ville || !departement) throw new Error('GEOGRAPHY_REQUIRED');

  if (role === 'commercant') {
    const raisonSociale = String(profile.raisonSociale || input?.name || '').trim();
    if (!raisonSociale) throw new Error('NAME_REQUIRED');
    return {
      ...profile,
      raisonSociale,
      siret: String(input?.siret || profile.siret || '').trim(),
      type: String(input?.type || profile.type || '').trim(),
      telephone: String(input?.phone || profile.telephone || '').trim(),
      adresse: String(input?.address || profile.adresse || '').trim(),
      ville,
      departement,
      codePostal: String(input?.postalCode || profile.codePostal || '').trim(),
      siteWeb: String(input?.website || profile.siteWeb || '').trim(),
      horaires: String(input?.openingHours || profile.horaires || '').trim(),
      volumeColis: input?.packageVolume ?? profile.volumeColis ?? '',
      description: String(input?.description || profile.description || '').trim(),
      subscriptionType: String(input?.subscriptionType || profile.subscriptionType || '').trim(),
      subscriptionPlan: String(input?.subscriptionPlan || profile.subscriptionPlan || '').trim(),
    };
  }

  const nom = String(profile.nom || input?.name || '').trim();
  if (!nom) throw new Error('NAME_REQUIRED');
  return {
    ...profile,
    nom,
    prenomResponsable: String(input?.firstname || profile.prenomResponsable || '').trim(),
    nomResponsable: String(input?.lastname || profile.nomResponsable || '').trim(),
    telephone: String(input?.phone || profile.telephone || '').trim(),
    typeStructure: String(input?.structureType || profile.typeStructure || '').trim(),
    adresse: String(input?.address || profile.adresse || '').trim(),
    ville,
    departement,
    codePostal: String(input?.postalCode || profile.codePostal || '').trim(),
    capacite: Number(input?.capacity || profile.capacite || 0),
    horaires: String(input?.openingHours || profile.horaires || '').trim(),
    services: input?.services || profile.services || {
      reception: Boolean(input?.reception),
      withdrawal: Boolean(input?.withdrawal),
      returnPackage: Boolean(input?.returnPackage),
    },
    description: String(input?.description || profile.description || '').trim(),
  };
}

export async function createRegistrationRequest(input) {
  const role = String(input?.role || '');
  const email = String(input?.email || '').trim().toLowerCase();
  if (!PUBLIC_ROLES.includes(role)) throw new Error('INVALID_ROLE');
  if (!email.includes('@')) throw new Error('INVALID_EMAIL');
  if (await userRepository.findByEmail(email)) throw new Error('EMAIL_ALREADY_USED');
  if (await registrationRequestRepository.findPendingByEmail(email)) throw new Error('REQUEST_ALREADY_PENDING');

  const profile = normalizedProfile(input, role);
  const passwordHash = await hashPassword(String(input?.password || ''));
  const now = new Date().toISOString();
  const request = {
    id: randomUUID(),
    role,
    email,
    passwordHash,
    profile,
    status: 'PENDING',
    createdAt: now,
    updatedAt: now,
    decisionAt: null,
    decisionBy: null,
    decisionComment: null,
  };
  const safe = await registrationRequestRepository.create(request);
  await Promise.all([
    createNotification({ audienceRole: 'gestionnaire', type: 'info_message', title: role === 'commercant' ? 'Nouvelle demande commerçant' : 'Nouvelle demande point relais', message: `${profile.raisonSociale || profile.nom} a envoyé une demande d’inscription.`, resourceType: 'registration_request', resourceId: request.id }),
    createNotification({ audienceRole: 'super_gestionnaire', type: 'info_message', title: 'Nouvelle demande d’inscription', message: `${profile.raisonSociale || profile.nom} a envoyé une demande à traiter.`, resourceType: 'registration_request', resourceId: request.id }),
  ]);
  return safe;
}

export async function listRegistrationRequests(filters, actor) {
  let rows = await registrationRequestRepository.list(filters);
  if (actor.role === 'gestionnaire') rows = rows.filter((row) => scopeAllows(actor.scope, row.profile || {}));
  return rows;
}

export async function decideRegistrationRequest(id, action, actor, comment = '') {
  const request = await registrationRequestRepository.findById(id);
  if (!request) throw new Error('REQUEST_NOT_FOUND');
  if (!STATUSES.includes(request.status) || request.status !== 'PENDING') throw new Error('REQUEST_ALREADY_DECIDED');
  if (!PUBLIC_ROLES.includes(request.role)) throw new Error('INVALID_ROLE');
  if (actor.role === 'gestionnaire' && !scopeAllows(actor.scope, request.profile || {})) throw new Error('OUT_OF_SCOPE');

  const normalizedAction = String(action || '').toUpperCase();
  if (!['APPROVE', 'REJECT'].includes(normalizedAction)) throw new Error('INVALID_ACTION');
  const now = new Date().toISOString();

  if (normalizedAction === 'REJECT') {
    return registrationRequestRepository.update(id, {
      status: 'REJECTED', decisionAt: now, decisionBy: actor.sub, decisionComment: String(comment || '').trim(), updatedAt: now,
    });
  }

  if (await userRepository.findByEmail(request.email)) throw new Error('EMAIL_ALREADY_USED');
  const user = {
    id: randomUUID(),
    email: request.email,
    role: request.role,
    statutCompte: 'actif',
    passwordHash: request.passwordHash,
    invitationTokenHash: null,
    invitationExpiration: null,
    scope: null,
    profile: request.profile || {},
    approvedBy: actor.sub,
    approvedFromRequestId: request.id,
    dateCreation: now,
    activatedAt: now,
    derniereConnexion: null,
  };
  await userRepository.create(user);
  const updated = await registrationRequestRepository.update(id, {
    status: 'APPROVED', decisionAt: now, decisionBy: actor.sub, decisionComment: String(comment || '').trim(), createdUserId: user.id, updatedAt: now,
  });
  await createNotification({ recipientId: user.id, type: 'info_message', title: 'Compte validé', message: 'Votre demande a été validée. Vous pouvez maintenant vous connecter.', resourceType: 'user', resourceId: user.id });
  return { ...updated, createdUser: { id: user.id, email: user.email, role: user.role, statutCompte: user.statutCompte } };
}
