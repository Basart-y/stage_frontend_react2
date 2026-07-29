let cachedClientPromise;

export async function getMongoDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  if (!cachedClientPromise) {
    cachedClientPromise = import('mongodb').then(({ MongoClient }) => {
      const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
      return client.connect();
    });
  }
  const client = await cachedClientPromise;
  return client.db(process.env.MONGODB_DB || 'relayflow');
}
