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
"[project]/app/api/v1/auth/me/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/auth.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/http.js [app-route] (ecmascript)");
;
;
const ROLES = [
    'commercant',
    'point_relais',
    'gestionnaire',
    'super_gestionnaire',
    'gestionnaire_financier'
];
async function GET(request) {
    const auth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireAuth"])(request, ROLES);
    if (auth.error) return auth.error;
    const user = auth.user;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"])({
        id: user.id,
        email: user.email,
        role: user.role,
        scope: user.scope || null,
        profile: user.profile || {},
        statutCompte: user.statutCompte
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__016z13d._.js.map