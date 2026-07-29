const baseUrl = process.env.RELAYFLOW_BASE_URL || 'http://localhost:3000';
const adminEmail = process.env.RELAYFLOW_ADMIN_EMAIL || 'admin@test.fr';
const adminPassword = process.env.RELAYFLOW_ADMIN_PASSWORD || 'Test123456!';

let passed = 0;
let failed = 0;

function stamp() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

async function request(path, { method = 'GET', token, body } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let json = null;
  try { json = await response.json(); } catch { /* non JSON */ }
  return { status: response.status, json };
}

function check(name, condition, detail = '') {
  if (condition) {
    passed += 1;
    console.log(`✅ ${name}`);
  } else {
    failed += 1;
    console.error(`❌ ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

async function main() {
  console.log(` API smoke test — ${baseUrl}`);
  console.log('Ce test crée deux demandes temporaires (commerçant + point relais) puis les valide.');

  const unauth = await request('/api/v1/auth/me');
  check('API protégée refuse un appel sans JWT', unauth.status === 401, `HTTP ${unauth.status}`);

  const badLogin = await request('/api/v1/auth/login', {
    method: 'POST',
    body: { email: adminEmail, password: `${adminPassword}-incorrect` },
  });
  check('Mauvais mot de passe refusé', badLogin.status === 401, `HTTP ${badLogin.status}`);

  const login = await request('/api/v1/auth/login', {
    method: 'POST',
    body: { email: adminEmail, password: adminPassword },
  });
  const token = login.json?.data?.accessToken || login.json?.data?.token;
  check('Login Super Gestionnaire', login.status === 200 && Boolean(token), `HTTP ${login.status}`);
  if (!token) throw new Error('Impossible de poursuivre sans JWT administrateur.');

  const me = await request('/api/v1/auth/me', { token });
  check('GET /auth/me', me.status === 200 && me.json?.data?.role === 'super_gestionnaire', `HTTP ${me.status}, rôle ${me.json?.data?.role}`);

  const id = stamp();
  const merchantEmail = `smoke-commerce-${id}@example.test`;
  const relayEmail = `smoke-relais-${id}@example.test`;
  const password = 'Test123456!';

  const merchant = await request('/api/v1/registration-requests', {
    method: 'POST',
    body: {
      role: 'commercant', email: merchantEmail, password,
      profile: { raisonSociale: `Commerce Smoke ${id}`, ville: 'Paris', departement: 'Paris' },
    },
  });
  check('Création demande Commerçant', merchant.status === 201 && merchant.json?.data?.status === 'PENDING', `HTTP ${merchant.status}`);
  const merchantId = merchant.json?.data?.id;

  const duplicate = await request('/api/v1/registration-requests', {
    method: 'POST',
    body: {
      role: 'commercant', email: merchantEmail, password,
      profile: { raisonSociale: `Commerce Smoke ${id}`, ville: 'Paris', departement: 'Paris' },
    },
  });
  check('Doublon demande en attente refusé', duplicate.status === 409 && duplicate.json?.error?.code === 'REQUEST_ALREADY_PENDING', `HTTP ${duplicate.status}`);

  const relay = await request('/api/v1/registration-requests', {
    method: 'POST',
    body: {
      role: 'point_relais', email: relayEmail, password,
      profile: { nom: `Relais Smoke ${id}`, ville: 'Paris', departement: 'Paris', capacite: 25 },
    },
  });
  check('Création demande Point relais', relay.status === 201 && relay.json?.data?.status === 'PENDING', `HTTP ${relay.status}`);
  const relayId = relay.json?.data?.id;

  const pending = await request('/api/v1/registration-requests?status=PENDING&limit=100', { token });
  const pendingRows = pending.json?.data || [];
  check('Liste des demandes accessible au Super Gestionnaire', pending.status === 200, `HTTP ${pending.status}`);
  check('Demandes temporaires présentes dans la liste', pendingRows.some((x) => x.id === merchantId) && pendingRows.some((x) => x.id === relayId));

  const approveMerchant = await request(`/api/v1/registration-requests/${merchantId}`, {
    method: 'PATCH', token, body: { action: 'APPROVE', comment: 'Validation smoke test' },
  });
  check('Validation demande Commerçant', approveMerchant.status === 200 && approveMerchant.json?.data?.status === 'APPROVED', `HTTP ${approveMerchant.status}`);

  const approveRelay = await request(`/api/v1/registration-requests/${relayId}`, {
    method: 'PATCH', token, body: { action: 'APPROVE', comment: 'Validation smoke test' },
  });
  check('Validation demande Point relais', approveRelay.status === 200 && approveRelay.json?.data?.status === 'APPROVED', `HTTP ${approveRelay.status}`);

  const doubleApprove = await request(`/api/v1/registration-requests/${merchantId}`, {
    method: 'PATCH', token, body: { action: 'APPROVE' },
  });
  check('Double validation interdite', doubleApprove.status === 409 && doubleApprove.json?.error?.code === 'REQUEST_ALREADY_DECIDED', `HTTP ${doubleApprove.status}`);

  const merchantLogin = await request('/api/v1/auth/login', {
    method: 'POST', body: { email: merchantEmail, password },
  });
  check('Connexion du Commerçant validé', merchantLogin.status === 200, `HTTP ${merchantLogin.status}`);
  const merchantToken = merchantLogin.json?.data?.accessToken || merchantLogin.json?.data?.token;
  if (merchantToken) {
    const merchantMe = await request('/api/v1/auth/me', { token: merchantToken });
    check('Rôle du nouveau Commerçant correct', merchantMe.status === 200 && merchantMe.json?.data?.role === 'commercant');
    const forbiddenList = await request('/api/v1/registration-requests?status=PENDING', { token: merchantToken });
    check('Commerçant interdit de consulter les demandes', forbiddenList.status === 403, `HTTP ${forbiddenList.status}`);
  }

  const relayLogin = await request('/api/v1/auth/login', {
    method: 'POST', body: { email: relayEmail, password },
  });
  check('Connexion du Point relais validé', relayLogin.status === 200, `HTTP ${relayLogin.status}`);

  console.log(`\nRésultat : ${passed} réussi(s), ${failed} échec(s).`);
  if (failed > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`\n❌ Test interrompu : ${error.message}`);
  console.error('Vérifie que MongoDB et npm run dev:next sont démarrés, puis relance npm run test:api.');
  process.exitCode = 1;
});
