import bcrypt from 'bcrypt';
import { timingSafeEqual, webcrypto } from 'node:crypto';

const DEFAULT_BCRYPT_ROUNDS = 12;
const encoder = new TextEncoder();

function bcryptRounds() {
  const configured = Number(process.env.BCRYPT_ROUNDS || DEFAULT_BCRYPT_ROUNDS);
  if (!Number.isInteger(configured) || configured < 10 || configured > 14) return DEFAULT_BCRYPT_ROUNDS;
  return configured;
}

function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 8) throw new Error('WEAK_PASSWORD');
  // bcrypt ne considère que les 72 premiers octets : refuser au lieu de tronquer silencieusement.
  if (Buffer.byteLength(password, 'utf8') > 72) throw new Error('PASSWORD_TOO_LONG');
}

export async function hashPassword(password) {
  validatePassword(password);
  return bcrypt.hash(password, bcryptRounds());
}

export function isLegacyPasswordHash(stored) {
  return String(stored || '').startsWith('pbkdf2-sha256$');
}

async function verifyLegacyPbkdf2(password, stored) {
  try {
    const [scheme, iterationsRaw, saltRaw, expectedRaw] = String(stored).split('$');
    if (scheme !== 'pbkdf2-sha256') return false;
    const iterations = Number(iterationsRaw);
    if (!Number.isInteger(iterations) || iterations < 100000 || iterations > 1000000) return false;
    const key = await webcrypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await webcrypto.subtle.deriveBits({
      name: 'PBKDF2',
      salt: Buffer.from(saltRaw, 'base64url'),
      iterations,
      hash: 'SHA-256',
    }, key, 256);
    const actual = Buffer.from(bits);
    const expected = Buffer.from(expectedRaw, 'base64url');
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export async function verifyPassword(password, stored) {
  try {
    if (typeof password !== 'string' || !stored) return false;
    const value = String(stored);
    if (/^\$2[aby]\$/.test(value)) return bcrypt.compare(password, value);
    // Compatibilité de migration uniquement : les nouveaux mots de passe ne sont plus créés en PBKDF2.
    if (isLegacyPasswordHash(value)) return verifyLegacyPbkdf2(password, value);
    return false;
  } catch {
    return false;
  }
}
