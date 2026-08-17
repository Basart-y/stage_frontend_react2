import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { userRepository } from '@/lib/backend/userRepository.js';
import { hashPassword, isLegacyPasswordHash, verifyPassword } from '@/lib/backend/password.js';
import { signAccessToken } from '@/lib/backend/auth.js';
import { assertScopeAllows } from '@/lib/backend/geography.js';

const INVITABLE = ['commercant', 'point_relais', 'gestionnaire', 'gestionnaire_financier'];
const tokenHash = token => createHash('sha256').update(token).digest('hex');

export async function inviteUser(input, inviter) {
  const email = String(input?.email || '').trim().toLowerCase();
  const role = String(input?.role || '');
  if (!email.includes('@')) throw new Error('INVALID_EMAIL');
  if (!INVITABLE.includes(role)) throw new Error('INVALID_ROLE');
  if (await userRepository.findByEmail(email)) throw new Error('EMAIL_ALREADY_USED');
  if (inviter.role === 'gestionnaire' && !['commercant', 'point_relais'].includes(role)) throw new Error('GRANT_NOT_ALLOWED');
  if (role === 'gestionnaire' && inviter.role !== 'super_gestionnaire') throw new Error('GRANT_NOT_ALLOWED');
  if (role === 'gestionnaire_financier' && inviter.role !== 'super_gestionnaire') throw new Error('GRANT_NOT_ALLOWED');
  if (inviter.role === 'gestionnaire') assertScopeAllows(inviter.scope, input.profile || {});
  if (role === 'gestionnaire' && input.scope && inviter.scope) assertScopeAllows(inviter.scope, { ville: input.scope.niveau === 'ville' ? input.scope.valeur : '', departement: input.scope.niveau === 'departement' ? input.scope.valeur : '' });

  const rawToken = randomBytes(32).toString('base64url');
  const now = new Date();
  const expires = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  const user = {
    id: randomUUID(), email, role, statutCompte: 'invite', passwordHash: null,
    invitationTokenHash: tokenHash(rawToken), invitationExpiration: expires.toISOString(),
    scope: input.scope || null, profile: input.profile || {}, invitedBy: inviter.sub,
    dateCreation: now.toISOString(), derniereConnexion: null,
  };
  await userRepository.create(user);
  return { user: { id: user.id, email, role, statutCompte: user.statutCompte, scope: user.scope }, invitationToken: rawToken, expiresAt: expires.toISOString() };
}

function requireText(value, code = 'PROFILE_INCOMPLETE') {
  const text = String(value ?? '').trim();
  if (!text) throw new Error(code);
  return text;
}

function activationProfile(input, user) {
  const raw = input?.profile && typeof input.profile === 'object' ? input.profile : {};
  const existing = user.profile || {};
  if (user.role === 'commercant') {
    const profile = {
      ...existing,
      raisonSociale: requireText(raw.raisonSociale),
      siret: requireText(raw.siret),
      type: requireText(raw.type),
      telephone: requireText(raw.telephone),
      adresse: requireText(raw.adresse),
      ville: requireText(raw.ville),
      departement: requireText(raw.departement),
      codeDepartement: String(raw.codeDepartement || existing.codeDepartement || '').trim(),
      codePostal: requireText(raw.codePostal),
      pays: String(raw.pays || 'France').trim() || 'France',
      siteWeb: String(raw.siteWeb || '').trim(),
      horaires: String(raw.horaires || '').trim(),
      volumeColis: raw.volumeColis === '' || raw.volumeColis == null ? '' : Number(raw.volumeColis),
      description: String(raw.description || '').trim(),
      subscriptionType: requireText(raw.subscriptionType),
      subscriptionPlan: raw.subscriptionType === 'FORFAIT' ? requireText(raw.subscriptionPlan) : '',
    };
    return profile;
  }
  if (user.role === 'point_relais') {
    const capacity = Number(raw.capacite);
    if (!Number.isFinite(capacity) || capacity <= 0) throw new Error('PROFILE_INCOMPLETE');
    return {
      ...existing,
      prenomResponsable: requireText(raw.prenomResponsable),
      nomResponsable: requireText(raw.nomResponsable),
      telephone: requireText(raw.telephone),
      nom: requireText(raw.nom),
      nomCommerce: requireText(raw.nom),
      typeStructure: requireText(raw.typeStructure),
      adresse: requireText(raw.adresse),
      ville: requireText(raw.ville),
      departement: requireText(raw.departement),
      codeDepartement: String(raw.codeDepartement || existing.codeDepartement || '').trim(),
      codePostal: requireText(raw.codePostal),
      pays: String(raw.pays || 'France').trim() || 'France',
      capacite: capacity,
      horaires: requireText(raw.horaires),
      statutOperationnel: String(raw.statutOperationnel || 'ouvert'),
      services: {
        reception: Boolean(raw.services?.reception),
        withdrawal: Boolean(raw.services?.withdrawal),
        returnPackage: Boolean(raw.services?.returnPackage),
      },
      description: String(raw.description || '').trim(),
    };
  }
  return existing;
}

async function invitationUser(input) {
  const email = String(input?.email || '').trim().toLowerCase();
  const user = await userRepository.findByEmail(email);
  if (!user || user.statutCompte !== 'invite') throw new Error('INVITATION_NOT_FOUND');
  if (new Date(user.invitationExpiration).getTime() < Date.now()) throw new Error('INVITATION_EXPIRED');
  if (user.invitationTokenHash !== tokenHash(String(input?.token || ''))) throw new Error('INVALID_INVITATION_TOKEN');
  return user;
}

export async function inspectInvitation(input) {
  const user = await invitationUser(input);
  return {
    email: user.email,
    role: user.role,
    scope: user.scope || null,
    profile: user.profile || {},
    expiresAt: user.invitationExpiration,
  };
}

export async function acceptInvitation(input) {
  const user = await invitationUser(input);
  const profile = activationProfile(input, user);
  // Le périmètre imposé lors de l'invitation reste prioritaire : l'activation ne peut pas changer le rôle/scope.
  if (user.role === 'commercant' || user.role === 'point_relais') {
    const expectedVille = String(user.profile?.ville || '').trim();
    const expectedDepartement = String(user.profile?.departement || '').trim();
    if (expectedVille && profile.ville !== expectedVille) throw new Error('INVITATION_SCOPE_MISMATCH');
    if (expectedDepartement && profile.departement !== expectedDepartement) throw new Error('INVITATION_SCOPE_MISMATCH');
  }
  const passwordHash = await hashPassword(input.password);
  return userRepository.update(user.id, { profile, passwordHash, statutCompte: 'actif', invitationTokenHash: null, invitationExpiration: null, activatedAt: new Date().toISOString() });
}

export async function login(input) {
  const portalRole = String(input?.portalRole || '');
  const allowedPortals = ['commercant','point_relais','gestionnaire','super_gestionnaire','gestionnaire_financier'];
  if (portalRole && !allowedPortals.includes(portalRole)) throw new Error('INVALID_PORTAL_ROLE');
  const user = await userRepository.findByEmail(input?.email || '');
  const password = String(input?.password || '');
  if (!user || !user.passwordHash || !(await verifyPassword(password, user.passwordHash))) throw new Error('INVALID_CREDENTIALS');
  if (portalRole && user.role !== portalRole) throw new Error('ROLE_PORTAL_MISMATCH');
  if (user.statutCompte !== 'actif') throw new Error(user.statutCompte === 'suspendu' ? 'ACCOUNT_SUSPENDED' : 'ACCOUNT_INACTIVE');

  // Migration transparente : un ancien compte PBKDF2 est re-haché en bcrypt après une connexion réussie.
  const patch = { derniereConnexion: new Date().toISOString() };
  if (isLegacyPasswordHash(user.passwordHash)) patch.passwordHash = await hashPassword(password);
  const updated = await userRepository.update(user.id, patch);
  const activeUser = { ...user, ...updated, passwordHash: patch.passwordHash || user.passwordHash };
  return { accessToken: await signAccessToken(activeUser), tokenType: 'Bearer', expiresIn: 900, user: { id: user.id, email: user.email, role: user.role, scope: user.scope || null } };
}
