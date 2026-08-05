import next from 'next';
import { createServer } from 'node:http';
import { timingSafeEqual, webcrypto } from 'node:crypto';
import { MongoClient } from 'mongodb';
import { WebSocketServer } from 'ws';
import { registerRealtimeClient } from './lib/backend/realtimeHub.js';

const encoder = new TextEncoder();
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = Number(process.env.PORT || 3000);
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
const handleUpgrade = app.getUpgradeHandler();

function fromB64url(value) { return Buffer.from(value, 'base64url'); }
async function hmac(data) {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) return null;
  const key = await webcrypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await webcrypto.subtle.sign('HMAC', key, encoder.encode(data)));
}
async function verifyToken(token) {
  try {
    const [header, payload, signature] = String(token || '').split('.');
    if (!header || !payload || !signature) return null;
    const parsedHeader = JSON.parse(fromB64url(header).toString('utf8'));
    if (parsedHeader.alg !== 'HS256' || parsedHeader.typ !== 'JWT') return null;
    const content = `${header}.${payload}`;
    const signed = await hmac(content);
    if (!signed) return null;
    const expected = Buffer.from(signed);
    const given = fromB64url(signature);
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
    const claims = JSON.parse(fromB64url(payload).toString('utf8'));
    if (!claims.sub || !claims.exp || claims.exp <= Math.floor(Date.now() / 1000)) return null;
    return claims;
  } catch { return null; }
}

let mongoClient;
async function currentUser(claims) {
  if (process.env.MONGODB_URI) {
    try {
      mongoClient ||= new MongoClient(process.env.MONGODB_URI);
      await mongoClient.connect();
      const db = mongoClient.db(process.env.MONGODB_DB || 'relayflow');
      const user = await db.collection('utilisateurs').findOne({ id: String(claims.sub) });
      if (!user || user.statutCompte !== 'actif') return null;
      return { id: String(user.id), role: user.role };
    } catch (error) {
      console.error('[websocket] MongoDB account validation failed', error?.message || error);
      return null;
    }
  }
  const memory = globalThis.__relayflowUsers?.users || [];
  const user = memory.find(item => String(item.id) === String(claims.sub));
  if (user) return user.statutCompte === 'actif' ? { id: String(user.id), role: user.role } : null;
  return { id: String(claims.sub), role: claims.role };
}

await app.prepare();
const server = createServer((req, res) => handle(req, res));
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', async (request, socket, head) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
  if (url.pathname !== '/ws') return handleUpgrade(request, socket, head);
  const claims = await verifyToken(url.searchParams.get('token'));
  const user = claims ? await currentUser(claims) : null;
  if (!user) return socket.destroy();
  wss.handleUpgrade(request, socket, head, ws => {
    const unregister = registerRealtimeClient(user.id, user.role, ws);
    ws.send(JSON.stringify({ type: 'connected', data: { userId: user.id, role: user.role }, emittedAt: new Date().toISOString() }));
    ws.on('close', unregister);
    ws.on('error', unregister);
    ws.on('message', raw => {
      try {
        const msg = JSON.parse(String(raw));
        if (msg.type === 'ping') ws.send(JSON.stringify({ type: 'pong', emittedAt: new Date().toISOString() }));
      } catch {}
    });
  });
});

server.listen(port, hostname, () => {
  console.log(` ready on http://localhost:${port}`);
  if (process.env.ENABLE_INTERNAL_SCHEDULER === 'true') {
    const intervalMs = Math.max(60_000, Number(process.env.AUTOMATION_INTERVAL_MS || 3_600_000));
    const runAutomation = async () => {
      try {
        const headers = process.env.CRON_SECRET ? { Authorization: `Bearer ${process.env.CRON_SECRET}` } : {};
        const response = await fetch(`http://127.0.0.1:${port}/api/v1/automations/mark-overdue-pickups`, { method: 'POST', headers });
        if (!response.ok) console.error('[automation] HTTP', response.status, await response.text());
      } catch (error) {
        console.error('[automation] mark-overdue-pickups failed', error?.message || error);
      }
    };
    setTimeout(runAutomation, 10_000);
    setInterval(runAutomation, intervalMs);
  }
});
