module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/lib/backend/http.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiError",
    ()=>apiError,
    "collection",
    ()=>collection,
    "ok",
    ()=>ok
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
;
function resolvedRequestId(requestId) {
    return requestId || (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])();
}
function ok(data, init = {}, requestId) {
    return Response.json({
        data,
        meta: {
            requestId: resolvedRequestId(requestId)
        }
    }, init);
}
function collection(data, pagination = {}, init = {}, requestId) {
    return Response.json({
        data,
        pagination: {
            limit: data.length,
            hasNext: false,
            ...pagination
        },
        meta: {
            requestId: resolvedRequestId(requestId)
        }
    }, init);
}
function apiError(status, code, message, details = [], requestId) {
    return Response.json({
        error: {
            code,
            message,
            user_facing_error: message,
            details,
            requestId: resolvedRequestId(requestId),
            retryable: status >= 500
        }
    }, {
        status
    });
}
}),
"[project]/lib/backend/mongodb.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getMongoDb",
    ()=>getMongoDb
]);
let cachedClientPromise;
async function getMongoDb() {
    const uri = process.env.MONGODB_URI;
    if (!uri) return null;
    if (!cachedClientPromise) {
        cachedClientPromise = __turbopack_context__.A("[externals]/mongodb [external] (mongodb, cjs, [project]/node_modules/mongodb, async loader)").then(({ MongoClient })=>{
            const client = new MongoClient(uri, {
                serverSelectionTimeoutMS: 5000
            });
            return client.connect();
        });
    }
    const client = await cachedClientPromise;
    return client.db(process.env.MONGODB_DB || 'relayflow');
}
}),
"[project]/lib/backend/userRepository.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "userRepository",
    ()=>userRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/mongodb.js [app-route] (ecmascript)");
;
const memory = globalThis.__relayflowUsers || {
    users: [],
    invitations: []
};
globalThis.__relayflowUsers = memory;
function clean(user) {
    if (!user) return null;
    const { passwordHash, invitationTokenHash, ...safe } = user;
    return safe;
}
function buildQuery(filters = {}) {
    const query = {};
    if (filters.role) query.role = filters.role;
    if (filters.statutCompte) query.statutCompte = filters.statutCompte;
    if (filters.search) {
        const rx = new RegExp(String(filters.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        query.$or = [
            {
                email: rx
            },
            {
                'profile.nom': rx
            },
            {
                'profile.nomFamille': rx
            },
            {
                'profile.raisonSociale': rx
            },
            {
                'profile.nomCommerce': rx
            },
            {
                'profile.ville': rx
            }
        ];
    }
    return query;
}
function memoryMatches(user, filters = {}) {
    if (filters.role && user.role !== filters.role) return false;
    if (filters.statutCompte && user.statutCompte !== filters.statutCompte) return false;
    if (filters.search) {
        const haystack = JSON.stringify({
            email: user.email,
            profile: user.profile || {}
        }).toLowerCase();
        if (!haystack.includes(String(filters.search).toLowerCase())) return false;
    }
    return true;
}
const userRepository = {
    async findByEmail (email) {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMongoDb"])();
        const normalized = String(email).trim().toLowerCase();
        return db ? db.collection('utilisateurs').findOne({
            email: normalized
        }) : memory.users.find((u)=>u.email === normalized) || null;
    },
    async findById (id) {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMongoDb"])();
        if (db) return db.collection('utilisateurs').findOne({
            id: String(id)
        });
        return memory.users.find((u)=>String(u.id) === String(id)) || null;
    },
    async create (user) {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMongoDb"])();
        if (db) await db.collection('utilisateurs').insertOne(user);
        else memory.users.push(user);
        return clean(user);
    },
    async update (id, patch) {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMongoDb"])();
        if (db) {
            await db.collection('utilisateurs').updateOne({
                id: String(id)
            }, {
                $set: patch
            });
            return clean(await db.collection('utilisateurs').findOne({
                id: String(id)
            }));
        }
        const index = memory.users.findIndex((u)=>String(u.id) === String(id));
        if (index < 0) return null;
        memory.users[index] = {
            ...memory.users[index],
            ...patch
        };
        return clean(memory.users[index]);
    },
    async list (filters = {}) {
        const limit = Math.min(Math.max(Number(filters.limit) || 20, 1), 100);
        const page = Math.max(Number(filters.page) || 1, 1);
        const skip = (page - 1) * limit;
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMongoDb"])();
        if (db) {
            const query = buildQuery(filters);
            const [rows, total] = await Promise.all([
                db.collection('utilisateurs').find(query).sort({
                    createdAt: -1,
                    email: 1
                }).skip(skip).limit(limit).toArray(),
                db.collection('utilisateurs').countDocuments(query)
            ]);
            return {
                rows: rows.map(clean),
                total,
                page,
                limit
            };
        }
        const all = memory.users.filter((u)=>memoryMatches(u, filters)).sort((a, b)=>String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
        return {
            rows: all.slice(skip, skip + limit).map(clean),
            total: all.length,
            page,
            limit
        };
    }
};
}),
"[project]/lib/backend/password.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hashPassword",
    ()=>hashPassword,
    "isLegacyPasswordHash",
    ()=>isLegacyPasswordHash,
    "verifyPassword",
    ()=>verifyPassword
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$bcrypt__$5b$external$5d$__$28$bcrypt$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$bcrypt$29$__ = __turbopack_context__.i("[externals]/bcrypt [external] (bcrypt, cjs, [project]/node_modules/bcrypt)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
;
;
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
async function hashPassword(password) {
    validatePassword(password);
    return __TURBOPACK__imported__module__$5b$externals$5d2f$bcrypt__$5b$external$5d$__$28$bcrypt$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$bcrypt$29$__["default"].hash(password, bcryptRounds());
}
function isLegacyPasswordHash(stored) {
    return String(stored || '').startsWith('pbkdf2-sha256$');
}
async function verifyLegacyPbkdf2(password, stored) {
    try {
        const [scheme, iterationsRaw, saltRaw, expectedRaw] = String(stored).split('$');
        if (scheme !== 'pbkdf2-sha256') return false;
        const iterations = Number(iterationsRaw);
        if (!Number.isInteger(iterations) || iterations < 100000 || iterations > 1000000) return false;
        const key = await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["webcrypto"].subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
            'deriveBits'
        ]);
        const bits = await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["webcrypto"].subtle.deriveBits({
            name: 'PBKDF2',
            salt: Buffer.from(saltRaw, 'base64url'),
            iterations,
            hash: 'SHA-256'
        }, key, 256);
        const actual = Buffer.from(bits);
        const expected = Buffer.from(expectedRaw, 'base64url');
        return actual.length === expected.length && (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["timingSafeEqual"])(actual, expected);
    } catch  {
        return false;
    }
}
async function verifyPassword(password, stored) {
    try {
        if (typeof password !== 'string' || !stored) return false;
        const value = String(stored);
        if (/^\$2[aby]\$/.test(value)) return __TURBOPACK__imported__module__$5b$externals$5d2f$bcrypt__$5b$external$5d$__$28$bcrypt$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$bcrypt$29$__["default"].compare(password, value);
        // Compatibilité de migration uniquement : les nouveaux mots de passe ne sont plus créés en PBKDF2.
        if (isLegacyPasswordHash(value)) return verifyLegacyPbkdf2(password, value);
        return false;
    } catch  {
        return false;
    }
}
}),
"[project]/lib/backend/auth.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "requireAuth",
    ()=>requireAuth,
    "signAccessToken",
    ()=>signAccessToken,
    "verifyAccessToken",
    ()=>verifyAccessToken
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/http.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$userRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/userRepository.js [app-route] (ecmascript)");
;
;
;
const encoder = new TextEncoder();
const JWT_TTL_SECONDS = 15 * 60;
function b64url(value) {
    return Buffer.from(value).toString('base64url');
}
function fromB64url(value) {
    return Buffer.from(value, 'base64url');
}
async function hmac(data) {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) throw new Error('JWT_SECRET_MISSING_OR_WEAK');
    const key = await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["webcrypto"].subtle.importKey('raw', encoder.encode(secret), {
        name: 'HMAC',
        hash: 'SHA-256'
    }, false, [
        'sign'
    ]);
    return new Uint8Array(await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["webcrypto"].subtle.sign('HMAC', key, encoder.encode(data)));
}
async function signAccessToken(user) {
    const now = Math.floor(Date.now() / 1000);
    const header = b64url(JSON.stringify({
        alg: 'HS256',
        typ: 'JWT'
    }));
    // Le token transporte l'identité et un hint de rôle, mais l'autorisation réelle est revalidée côté serveur.
    const payload = b64url(JSON.stringify({
        sub: String(user.id),
        role: user.role,
        iat: now,
        exp: now + JWT_TTL_SECONDS
    }));
    const content = `${header}.${payload}`;
    return `${content}.${b64url(await hmac(content))}`;
}
async function verifyAccessToken(token) {
    try {
        const [header, payload, signature] = String(token || '').split('.');
        if (!header || !payload || !signature) return null;
        const parsedHeader = JSON.parse(fromB64url(header).toString('utf8'));
        if (parsedHeader.alg !== 'HS256' || parsedHeader.typ !== 'JWT') return null;
        const content = `${header}.${payload}`;
        const expected = Buffer.from(await hmac(content));
        const given = fromB64url(signature);
        if (expected.length !== given.length || !(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["timingSafeEqual"])(expected, given)) return null;
        const claims = JSON.parse(fromB64url(payload).toString('utf8'));
        if (!claims.sub || !claims.exp || claims.exp <= Math.floor(Date.now() / 1000)) return null;
        return claims;
    } catch  {
        return null;
    }
}
async function requireAuth(request, roles = []) {
    const auth = request.headers.get('authorization') || '';
    const tokenClaims = await verifyAccessToken(auth.startsWith('Bearer ') ? auth.slice(7) : '');
    if (!tokenClaims) return {
        error: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiError"])(401, 'UNAUTHORIZED', 'Authentification requise.')
    };
    // Relecture de l'utilisateur à chaque requête sensible : suspension, rôle et périmètre prennent effet immédiatement.
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$userRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["userRepository"].findById(tokenClaims.sub);
    if (!user || user.statutCompte !== 'actif') {
        return {
            error: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiError"])(401, user?.statutCompte === 'suspendu' ? 'ACCOUNT_SUSPENDED' : 'UNAUTHORIZED', 'Compte indisponible.')
        };
    }
    if (roles.length && !roles.includes(user.role)) {
        return {
            error: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiError"])(403, 'FORBIDDEN', 'Action non autorisée pour ce rôle.')
        };
    }
    return {
        claims: {
            sub: String(user.id),
            role: user.role,
            scope: user.scope || null
        },
        user
    };
}
}),
"[project]/lib/backend/geography.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assertScopeAllows",
    ()=>assertScopeAllows,
    "scopeAllows",
    ()=>scopeAllows
]);
function norm(value) {
    return String(value || '').trim().toLocaleLowerCase('fr-FR');
}
function scopeAllows(scope, resource = {}) {
    if (!scope || scope.niveau === 'pays') return true;
    if (scope.niveau === 'departement') return norm(resource.departement || resource.profile?.departement) === norm(scope.valeur);
    if (scope.niveau === 'ville') return norm(resource.ville || resource.profile?.ville) === norm(scope.valeur);
    return false;
}
function assertScopeAllows(scope, resource) {
    if (!scopeAllows(scope, resource)) throw new Error('OUT_OF_SCOPE');
}
}),
"[project]/lib/backend/accountDomain.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "acceptInvitation",
    ()=>acceptInvitation,
    "inviteUser",
    ()=>inviteUser,
    "login",
    ()=>login
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$userRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/userRepository.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$password$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/password.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/auth.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$geography$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/geography.js [app-route] (ecmascript)");
;
;
;
;
;
const INVITABLE = [
    'commercant',
    'point_relais',
    'gestionnaire',
    'gestionnaire_financier'
];
const tokenHash = (token)=>(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHash"])('sha256').update(token).digest('hex');
async function inviteUser(input, inviter) {
    const email = String(input?.email || '').trim().toLowerCase();
    const role = String(input?.role || '');
    if (!email.includes('@')) throw new Error('INVALID_EMAIL');
    if (!INVITABLE.includes(role)) throw new Error('INVALID_ROLE');
    if (await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$userRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["userRepository"].findByEmail(email)) throw new Error('EMAIL_ALREADY_USED');
    if (inviter.role === 'gestionnaire' && ![
        'commercant',
        'point_relais'
    ].includes(role)) throw new Error('GRANT_NOT_ALLOWED');
    if (role === 'gestionnaire' && inviter.role !== 'super_gestionnaire') throw new Error('GRANT_NOT_ALLOWED');
    if (inviter.role === 'gestionnaire') (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$geography$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assertScopeAllows"])(inviter.scope, input.profile || {});
    if (role === 'gestionnaire' && input.scope && inviter.scope) (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$geography$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assertScopeAllows"])(inviter.scope, {
        ville: input.scope.niveau === 'ville' ? input.scope.valeur : '',
        departement: input.scope.niveau === 'departement' ? input.scope.valeur : ''
    });
    const rawToken = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(32).toString('base64url');
    const now = new Date();
    const expires = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const user = {
        id: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])(),
        email,
        role,
        statutCompte: 'invite',
        passwordHash: null,
        invitationTokenHash: tokenHash(rawToken),
        invitationExpiration: expires.toISOString(),
        scope: input.scope || null,
        profile: input.profile || {},
        invitedBy: inviter.sub,
        dateCreation: now.toISOString(),
        derniereConnexion: null
    };
    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$userRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["userRepository"].create(user);
    return {
        user: {
            id: user.id,
            email,
            role,
            statutCompte: user.statutCompte,
            scope: user.scope
        },
        invitationToken: rawToken,
        expiresAt: expires.toISOString()
    };
}
async function acceptInvitation(input) {
    const email = String(input?.email || '').trim().toLowerCase();
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$userRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["userRepository"].findByEmail(email);
    if (!user || user.statutCompte !== 'invite') throw new Error('INVITATION_NOT_FOUND');
    if (new Date(user.invitationExpiration).getTime() < Date.now()) throw new Error('INVITATION_EXPIRED');
    if (user.invitationTokenHash !== tokenHash(String(input?.token || ''))) throw new Error('INVALID_INVITATION_TOKEN');
    const passwordHash = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$password$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hashPassword"])(input.password);
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$userRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["userRepository"].update(user.id, {
        passwordHash,
        statutCompte: 'actif',
        invitationTokenHash: null,
        invitationExpiration: null,
        activatedAt: new Date().toISOString()
    });
}
async function login(input) {
    const portalRole = String(input?.portalRole || '');
    const allowedPortals = [
        'commercant',
        'point_relais',
        'gestionnaire',
        'super_gestionnaire',
        'gestionnaire_financier'
    ];
    if (portalRole && !allowedPortals.includes(portalRole)) throw new Error('INVALID_PORTAL_ROLE');
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$userRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["userRepository"].findByEmail(input?.email || '');
    const password = String(input?.password || '');
    if (!user || !user.passwordHash || !await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$password$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyPassword"])(password, user.passwordHash)) throw new Error('INVALID_CREDENTIALS');
    if (portalRole && user.role !== portalRole) throw new Error('ROLE_PORTAL_MISMATCH');
    if (user.statutCompte !== 'actif') throw new Error(user.statutCompte === 'suspendu' ? 'ACCOUNT_SUSPENDED' : 'ACCOUNT_INACTIVE');
    // Migration transparente : un ancien compte PBKDF2 est re-haché en bcrypt après une connexion réussie.
    const patch = {
        derniereConnexion: new Date().toISOString()
    };
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$password$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isLegacyPasswordHash"])(user.passwordHash)) patch.passwordHash = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$password$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hashPassword"])(password);
    const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$userRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["userRepository"].update(user.id, patch);
    const activeUser = {
        ...user,
        ...updated,
        passwordHash: patch.passwordHash || user.passwordHash
    };
    return {
        accessToken: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["signAccessToken"])(activeUser),
        tokenType: 'Bearer',
        expiresIn: 900,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            scope: user.scope || null
        }
    };
}
}),
"[project]/lib/backend/auditRepository.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "auditRepository",
    ()=>auditRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/mongodb.js [app-route] (ecmascript)");
;
const memory = globalThis.__relayflowAuditStore || {
    items: []
};
globalThis.__relayflowAuditStore = memory;
const auditRepository = {
    async create (entry) {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMongoDb"])();
        if (db) await db.collection('audit_traces').insertOne(entry);
        else memory.items.push(entry);
        return entry;
    },
    async list (filters = {}) {
        const query = {};
        if (filters.resourceType) query.resourceType = String(filters.resourceType);
        if (filters.resourceId) query.resourceId = String(filters.resourceId);
        if (filters.actorId) query.actorId = String(filters.actorId);
        if (filters.eventType) query.eventType = String(filters.eventType);
        const limit = Math.min(Math.max(Number(filters.limit) || 50, 1), 200);
        const skip = Math.max(Number(filters.skip) || 0, 0);
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMongoDb"])();
        if (db) {
            const collection = db.collection('audit_traces');
            const [data, total] = await Promise.all([
                collection.find(query).sort({
                    occurredAt: -1
                }).skip(skip).limit(limit).toArray(),
                collection.countDocuments(query)
            ]);
            return {
                data,
                total
            };
        }
        const filtered = memory.items.filter((item)=>(!filters.resourceType || item.resourceType === String(filters.resourceType)) && (!filters.resourceId || item.resourceId === String(filters.resourceId)) && (!filters.actorId || item.actorId === String(filters.actorId)) && (!filters.eventType || item.eventType === String(filters.eventType))).sort((a, b)=>String(b.occurredAt).localeCompare(String(a.occurredAt)));
        return {
            data: filtered.slice(skip, skip + limit),
            total: filtered.length
        };
    }
};
}),
"[project]/lib/backend/auditDomain.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "writeAuditTrace",
    ()=>writeAuditTrace
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$auditRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/auditRepository.js [app-route] (ecmascript)");
;
function header(request, name) {
    try {
        return request?.headers?.get(name) || null;
    } catch  {
        return null;
    }
}
async function writeAuditTrace({ request = null, requestId = null, eventType, action, actor = null, resourceType, resourceId, before = null, after = null, metadata = {} }) {
    const forwarded = header(request, 'x-forwarded-for');
    const entry = {
        id: crypto.randomUUID(),
        requestId: requestId || header(request, 'x-request-id') || crypto.randomUUID(),
        eventType,
        action,
        actorId: actor?.sub || actor?.id || null,
        actorRole: actor?.role || null,
        resourceType,
        resourceId: String(resourceId),
        before,
        after,
        metadata,
        technical: {
            method: request?.method || null,
            path: request ? new URL(request.url).pathname : null,
            ip: forwarded?.split(',')[0]?.trim() || header(request, 'x-real-ip'),
            userAgent: header(request, 'user-agent')
        },
        occurredAt: new Date().toISOString()
    };
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$auditRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auditRepository"].create(entry);
}
}),
"[project]/app/api/v1/auth/login/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/http.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$accountDomain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/accountDomain.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$auditDomain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/auditDomain.js [app-route] (ecmascript)");
;
;
;
async function POST(request) {
    let email = '';
    try {
        const body = await request.json();
        email = String(body?.email || '').trim().toLowerCase();
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$accountDomain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["login"])(body);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$auditDomain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writeAuditTrace"])({
            request,
            eventType: 'auth.login.succeeded',
            action: 'identity.login',
            actor: {
                sub: session.user.id,
                role: session.user.role
            },
            resourceType: 'identity',
            resourceId: session.user.id,
            metadata: {
                email,
                portalRole: String(body?.portalRole || '')
            }
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"])(session);
    } catch (e) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$auditDomain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writeAuditTrace"])({
            request,
            eventType: 'auth.login.failed',
            action: 'identity.login',
            resourceType: 'identity',
            resourceId: email || 'unknown',
            metadata: {
                email,
                errorCode: e.message
            }
        }).catch(()=>{});
        if (e.message === 'ROLE_PORTAL_MISMATCH') return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiError"])(403, e.message, 'Ce compte ne peut pas se connecter depuis cet espace.');
        if (e.message === 'INVALID_PORTAL_ROLE') return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiError"])(400, e.message, 'Espace de connexion invalide.');
        if (e.message === 'INVALID_CREDENTIALS') return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiError"])(401, e.message, 'Email ou mot de passe incorrect.');
        if (e.message === 'ACCOUNT_SUSPENDED') return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiError"])(403, e.message, 'Ce compte est suspendu.');
        if (e.message === 'ACCOUNT_INACTIVE') return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiError"])(403, e.message, 'Ce compte n’est pas encore actif.');
        if (e.message === 'JWT_SECRET_MISSING_OR_WEAK') return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiError"])(500, e.message, 'Configuration serveur invalide : JWT_SECRET doit contenir au moins 32 caractères.');
        if (e?.name === 'MongoServerSelectionError' || /ECONNREFUSED|MongoServerSelection/i.test(String(e?.message || ''))) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiError"])(503, 'MONGODB_UNAVAILABLE', 'MongoDB est inaccessible. Vérifiez que le serveur MongoDB est démarré et que MONGODB_URI est correct.');
        console.error('[auth/login]', e);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiError"])(500, 'INTERNAL_ERROR', 'Connexion impossible. Consultez le terminal du serveur pour le détail.');
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0befsrr._.js.map