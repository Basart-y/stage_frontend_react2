#!/usr/bin/env node
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'relayflow';
const secret = process.env.JWT_SECRET || '';

let failed = false;

if (!uri) {
  console.error('❌ MONGODB_URI est absent. Ajoutez-le dans .env.local (ou dans les variables du terminal).');
  failed = true;
}

if (secret.length < 32) {
  console.error(`❌ JWT_SECRET est absent ou trop court (${secret.length} caractères). Minimum : 32.`);
  failed = true;
} else {
  console.log(`✅ JWT_SECRET valide (${secret.length} caractères).`);
}

if (uri) {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    await client.db(dbName).command({ ping: 1 });
    const count = await client.db(dbName).collection('utilisateurs').countDocuments();
    console.log(`✅ MongoDB accessible. Base : ${dbName}. Comptes : ${count}.`);
  } catch (error) {
    console.error(`❌ MongoDB inaccessible : ${error.message}`);
    failed = true;
  } finally {
    await client.close().catch(() => {});
  }
}

if (failed) process.exit(1);
console.log('✅ Configuration minimale d’authentification prête.');
