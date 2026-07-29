#!/usr/bin/env node
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';
import { MongoClient } from 'mongodb';

const [, , emailArg, passwordArg] = process.argv;
const email = String(emailArg || '').trim().toLowerCase();
const password = String(passwordArg || '');
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'relayflow';
const roundsRaw = Number(process.env.BCRYPT_ROUNDS || 12);
const rounds = Number.isInteger(roundsRaw) && roundsRaw >= 10 && roundsRaw <= 14 ? roundsRaw : 12;

if (!uri) {
  console.error('MONGODB_URI est requis.');
  process.exit(1);
}
if (!email.includes('@')) {
  console.error('Usage: node scripts_seed_supermanager.js email motDePasse');
  process.exit(1);
}
if (password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
  console.error('Le mot de passe doit contenir au moins 8 caractères et au plus 72 octets UTF-8.');
  process.exit(1);
}

const client = new MongoClient(uri);
try {
  await client.connect();
  const collection = client.db(dbName).collection('utilisateurs');
  const existing = await collection.findOne({ email });
  if (existing) {
    console.error(`Un compte existe déjà pour ${email}.`);
    process.exitCode = 2;
  } else {
    const now = new Date().toISOString();
    await collection.insertOne({
      id: randomUUID(),
      email,
      passwordHash: await bcrypt.hash(password, rounds),
      role: 'super_gestionnaire',
      statutCompte: 'actif',
      scope: null,
      profile: {},
      invitationTokenHash: null,
      invitationExpiration: null,
      dateCreation: now,
      activatedAt: now,
      derniereConnexion: null,
    });
    console.log(`Super gestionnaire créé : ${email}`);
  }
} catch (error) {
  console.error('Provisioning impossible :', error.message);
  process.exitCode = 1;
} finally {
  await client.close().catch(() => {});
}
