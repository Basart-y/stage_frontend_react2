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
"[project]/donnees/livraisonsFictives.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "livraisonsFictives",
    ()=>livraisonsFictives
]);
const livraisonsFictives = [
    {
        id: 1,
        reference: "LIV-00001",
        commerceName: "Atelier Nova",
        relayPointId: 1,
        relayPoint: "Relais République",
        relayName: "Relais République",
        quantity: 1,
        weight: 2.4,
        type: "Standard",
        date: "2026-07-26",
        comment: "Manipuler avec soin.",
        contents: "Accessoires textiles",
        carrierName: "TransColis",
        client: {
            firstName: "Emma",
            lastName: "Bernard",
            phone: "06 12 45 78 90"
        },
        status: "Créée",
        createdAt: "2026-07-25T08:30:00Z",
        updatedAt: "2026-07-25T08:30:00Z",
        history: [
            {
                status: "Créée",
                date: "2026-07-25T08:30:00Z",
                comment: "Livraison créée depuis l'espace commerçant."
            }
        ]
    },
    {
        id: 2,
        reference: "LIV-00002",
        commerceName: "Atelier Nova",
        relayPointId: 1,
        relayPoint: "Relais République",
        relayName: "Relais République",
        quantity: 2,
        weight: 4.1,
        type: "Fragile",
        date: "2026-07-25",
        comment: "Carton fragile.",
        contents: "Objets décoratifs",
        carrierName: "RapidExpress",
        client: {
            firstName: "Lucas",
            lastName: "Martin",
            phone: "06 11 22 33 44"
        },
        status: "Arrivé au point relais",
        createdAt: "2026-07-23T10:00:00Z",
        updatedAt: "2026-07-25T09:10:00Z",
        receivedAt: "2026-07-25T09:10:00Z",
        pickupDeadline: "2026-08-01T09:10:00Z",
        history: [
            {
                status: "Créée",
                date: "2026-07-23T10:00:00Z",
                comment: "Livraison créée."
            },
            {
                status: "Arrivé au point relais",
                date: "2026-07-25T09:10:00Z",
                comment: "Colis réceptionné sans anomalie."
            }
        ]
    },
    {
        id: 3,
        reference: "LIV-00003",
        commerceName: "Atelier Nova",
        relayPointId: 2,
        relayPoint: "Relais Gare",
        relayName: "Relais Gare",
        quantity: 1,
        weight: 1.2,
        type: "Standard",
        date: "2026-07-24",
        comment: "",
        contents: "Chaussures",
        carrierName: "TransColis",
        client: {
            firstName: "Sarah",
            lastName: "Petit",
            phone: "06 98 76 54 32"
        },
        status: "Retour demandé",
        createdAt: "2026-07-22T14:20:00Z",
        updatedAt: "2026-07-25T10:40:00Z",
        receivedAt: "2026-07-24T08:00:00Z",
        history: [
            {
                status: "Créée",
                date: "2026-07-22T14:20:00Z",
                comment: "Livraison créée."
            },
            {
                status: "Arrivé au point relais",
                date: "2026-07-24T08:00:00Z",
                comment: "Réceptionnée."
            },
            {
                status: "Retour demandé",
                date: "2026-07-25T10:40:00Z",
                comment: "Retour demandé par le commerçant."
            }
        ]
    },
    {
        id: 4,
        reference: "LIV-00004",
        commerceName: "Atelier Nova",
        relayPointId: 1,
        relayPoint: "Relais République",
        relayName: "Relais République",
        quantity: 1,
        weight: 0.8,
        type: "Standard",
        date: "2026-07-23",
        comment: "",
        contents: "Livre",
        carrierName: "ColisGo",
        client: {
            firstName: "Nora",
            lastName: "Dubois",
            phone: "06 44 55 66 77"
        },
        status: "Retiré",
        createdAt: "2026-07-21T11:00:00Z",
        updatedAt: "2026-07-24T17:30:00Z",
        receivedAt: "2026-07-23T09:00:00Z",
        handoffProof: {
            recipientName: "Nora Dubois",
            identification: "qr_code",
            proofReference: "QR vérifié",
            date: "2026-07-24T17:30:00Z"
        },
        history: [
            {
                status: "Créée",
                date: "2026-07-21T11:00:00Z",
                comment: "Livraison créée."
            },
            {
                status: "Arrivé au point relais",
                date: "2026-07-23T09:00:00Z",
                comment: "Réceptionnée."
            },
            {
                status: "Retiré",
                date: "2026-07-24T17:30:00Z",
                comment: "Remis à Nora Dubois."
            }
        ]
    },
    {
        id: 5,
        reference: "LIV-00005",
        commerceName: "Atelier Nova",
        relayPointId: 3,
        relayPoint: "Relais Centre",
        relayName: "Relais Centre",
        quantity: 3,
        weight: 6.8,
        type: "Volumineux",
        date: "2026-07-27",
        comment: "Prévoir de la place en réserve.",
        contents: "Petit équipement maison",
        carrierName: "RapidExpress",
        client: {
            firstName: "Yanis",
            lastName: "Robert",
            phone: "06 55 44 33 22"
        },
        status: "En transit",
        createdAt: "2026-07-24T16:00:00Z",
        updatedAt: "2026-07-25T07:20:00Z",
        history: [
            {
                status: "Créée",
                date: "2026-07-24T16:00:00Z",
                comment: "Livraison créée."
            },
            {
                status: "En transit",
                date: "2026-07-25T07:20:00Z",
                comment: "Prise en charge par le transporteur."
            }
        ]
    },
    {
        id: 6,
        reference: "LIV-00006",
        commerceName: "Atelier Nova",
        relayPointId: 1,
        relayPoint: "Relais République",
        relayName: "Relais République",
        quantity: 1,
        weight: 3.2,
        type: "Fragile",
        date: "2026-07-25",
        comment: "",
        contents: "Vaisselle",
        carrierName: "ColisGo",
        client: {
            firstName: "Inès",
            lastName: "Leroy",
            phone: "06 10 20 30 40"
        },
        status: "Refusé",
        createdAt: "2026-07-24T09:30:00Z",
        updatedAt: "2026-07-25T11:20:00Z",
        refusalReason: "Carton ouvert et produit potentiellement cassé.",
        history: [
            {
                status: "Créée",
                date: "2026-07-24T09:30:00Z",
                comment: "Livraison créée."
            },
            {
                status: "Refusé",
                date: "2026-07-25T11:20:00Z",
                comment: "Carton ouvert et produit potentiellement cassé."
            }
        ]
    }
];
}),
"[project]/lib/backend/deliveryRepository.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deliveryRepository",
    ()=>deliveryRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/mongodb.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$donnees$2f$livraisonsFictives$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/donnees/livraisonsFictives.js [app-route] (ecmascript)");
;
;
const memory = globalThis.__relayflowDeliveryStore || {
    items: structuredClone(__TURBOPACK__imported__module__$5b$project$5d2f$donnees$2f$livraisonsFictives$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["livraisonsFictives"])
};
globalThis.__relayflowDeliveryStore = memory;
const deliveryRepository = {
    async list (filters = {}) {
        const query = {};
        if (filters.commerceId) query.commerceId = String(filters.commerceId);
        if (filters.relayPointId) query.relayPointId = String(filters.relayPointId);
        if (filters.status) query.status = filters.status;
        const limit = Math.min(Math.max(Number(filters.limit) || 20, 1), 100);
        const skip = Math.max(Number(filters.skip) || 0, 0);
        if (filters.query) {
            const escaped = String(filters.query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.$or = [
                {
                    reference: {
                        $regex: escaped,
                        $options: 'i'
                    }
                },
                {
                    'client.firstName': {
                        $regex: escaped,
                        $options: 'i'
                    }
                },
                {
                    'client.lastName': {
                        $regex: escaped,
                        $options: 'i'
                    }
                },
                {
                    commerceName: {
                        $regex: escaped,
                        $options: 'i'
                    }
                },
                {
                    relayName: {
                        $regex: escaped,
                        $options: 'i'
                    }
                }
            ];
        }
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMongoDb"])();
        if (db) {
            const collection = db.collection('livraisons');
            const [data, total] = await Promise.all([
                collection.find(query).sort({
                    createdAt: -1
                }).skip(skip).limit(limit).toArray(),
                collection.countDocuments(query)
            ]);
            return {
                data,
                total
            };
        }
        const filtered = memory.items.filter((item)=>(!filters.commerceId || String(item.commerceId) === String(filters.commerceId)) && (!filters.relayPointId || String(item.relayPointId) === String(filters.relayPointId)) && (!filters.status || item.status === filters.status) && (!filters.query || `${item.reference || ''} ${item.client?.firstName || ''} ${item.client?.lastName || ''} ${item.commerceName || ''} ${item.relayName || ''}`.toLowerCase().includes(String(filters.query).toLowerCase())));
        return {
            data: filtered.slice(skip, skip + limit),
            total: filtered.length
        };
    },
    async findById (id) {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMongoDb"])();
        if (db) return db.collection('livraisons').findOne({
            id: String(id)
        });
        return memory.items.find((item)=>String(item.id) === String(id)) || null;
    },
    async findByReference (reference) {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMongoDb"])();
        if (db) return db.collection('livraisons').findOne({
            reference: String(reference)
        });
        return memory.items.find((item)=>item.reference === String(reference)) || null;
    },
    async create (delivery) {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMongoDb"])();
        if (db) await db.collection('livraisons').insertOne(delivery);
        else memory.items.push(delivery);
        return delivery;
    },
    async replace (id, delivery) {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMongoDb"])();
        if (db) {
            const result = await db.collection('livraisons').findOneAndReplace({
                id: String(id)
            }, delivery, {
                returnDocument: 'after'
            });
            return result || null;
        }
        const index = memory.items.findIndex((item)=>String(item.id) === String(id));
        if (index < 0) return null;
        memory.items[index] = delivery;
        return delivery;
    }
};
}),
"[project]/lib/backend/notificationRepository.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "notificationRepository",
    ()=>notificationRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/mongodb.js [app-route] (ecmascript)");
;
const memory = globalThis.__relayflowNotifications || {
    items: []
};
globalThis.__relayflowNotifications = memory;
function matches(item, filters = {}) {
    if (filters.recipientId && String(item.recipientId) !== String(filters.recipientId)) return false;
    if (filters.audienceRole && item.audienceRole !== filters.audienceRole) return false;
    if (filters.unreadOnly && filters.recipientId && item.readAt) return false;
    if (filters.unreadOnly && filters.audienceRole && (item.readBy || []).includes(String(filters.viewerId || ''))) return false;
    return true;
}
const notificationRepository = {
    async create (notification) {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMongoDb"])();
        if (db) await db.collection('notifications').insertOne(notification);
        else memory.items.push(notification);
        return notification;
    },
    async list (filters = {}) {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMongoDb"])();
        if (db) {
            const query = {};
            if (filters.recipientId) query.recipientId = String(filters.recipientId);
            if (filters.audienceRole) query.audienceRole = filters.audienceRole;
            if (filters.unreadOnly && filters.recipientId) query.readAt = null;
            if (filters.unreadOnly && filters.audienceRole && filters.viewerId) query.readBy = {
                $ne: String(filters.viewerId)
            };
            return db.collection('notifications').find(query).sort({
                createdAt: -1
            }).limit(filters.limit || 50).toArray();
        }
        return memory.items.filter((item)=>matches(item, filters)).sort((a, b)=>String(b.createdAt).localeCompare(String(a.createdAt))).slice(0, filters.limit || 50);
    },
    async markRead (ids, recipientId, audienceRole = null) {
        const normalized = [
            ...new Set((ids || []).map(String))
        ];
        const now = new Date().toISOString();
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMongoDb"])();
        if (db) {
            const direct = await db.collection('notifications').updateMany({
                id: {
                    $in: normalized
                },
                recipientId: String(recipientId)
            }, {
                $set: {
                    readAt: now
                }
            });
            const roleWide = audienceRole ? await db.collection('notifications').updateMany({
                id: {
                    $in: normalized
                },
                audienceRole
            }, {
                $addToSet: {
                    readBy: String(recipientId)
                }
            }) : {
                modifiedCount: 0
            };
            return {
                updatedCount: direct.modifiedCount + roleWide.modifiedCount
            };
        }
        let updatedCount = 0;
        for (const item of memory.items){
            if (!normalized.includes(String(item.id))) continue;
            if (String(item.recipientId) === String(recipientId) && !item.readAt) {
                item.readAt = now;
                updatedCount += 1;
            } else if (audienceRole && item.audienceRole === audienceRole && !(item.readBy || []).includes(String(recipientId))) {
                item.readBy = [
                    ...item.readBy || [],
                    String(recipientId)
                ];
                updatedCount += 1;
            }
        }
        return {
            updatedCount
        };
    }
};
}),
"[project]/lib/backend/realtimeHub.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "broadcastRealtime",
    ()=>broadcastRealtime,
    "realtimeStats",
    ()=>realtimeStats,
    "registerRealtimeClient",
    ()=>registerRealtimeClient
]);
const state = globalThis.__relayflowRealtimeHub || {
    clients: new Map()
};
globalThis.__relayflowRealtimeHub = state;
function registerRealtimeClient(userId, role, socket) {
    const id = crypto.randomUUID();
    state.clients.set(id, {
        id,
        userId: String(userId),
        role,
        socket
    });
    return ()=>state.clients.delete(id);
}
function broadcastRealtime(event) {
    const payload = JSON.stringify({
        type: event.type,
        data: event.data,
        emittedAt: new Date().toISOString()
    });
    let delivered = 0;
    for (const client of state.clients.values()){
        const directMatch = event.recipientId && String(event.recipientId) === client.userId;
        const roleMatch = event.audienceRole && event.audienceRole === client.role;
        if (!directMatch && !roleMatch) continue;
        try {
            if (client.socket.readyState === 1) {
                client.socket.send(payload);
                delivered += 1;
            }
        } catch  {
            state.clients.delete(client.id);
        }
    }
    return delivered;
}
function realtimeStats() {
    return {
        connectedClients: state.clients.size
    };
}
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[project]/lib/backend/pushSubscriptionRepository.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "pushSubscriptionRepository",
    ()=>pushSubscriptionRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/mongodb.js [app-route] (ecmascript)");
;
const memory = globalThis.__relayflowPushSubscriptions || {
    items: []
};
globalThis.__relayflowPushSubscriptions = memory;
const pushSubscriptionRepository = {
    async upsert (userId, subscription) {
        const doc = {
            userId: String(userId),
            endpoint: String(subscription.endpoint),
            subscription,
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMongoDb"])();
        if (db) {
            await db.collection('pushSubscriptions').updateOne({
                userId: doc.userId,
                endpoint: doc.endpoint
            }, {
                $set: {
                    subscription: doc.subscription,
                    updatedAt: doc.updatedAt
                },
                $setOnInsert: {
                    createdAt: doc.createdAt,
                    userId: doc.userId,
                    endpoint: doc.endpoint
                }
            }, {
                upsert: true
            });
            return doc;
        }
        const index = memory.items.findIndex((item)=>item.userId === doc.userId && item.endpoint === doc.endpoint);
        if (index >= 0) memory.items[index] = {
            ...memory.items[index],
            ...doc,
            createdAt: memory.items[index].createdAt
        };
        else memory.items.push(doc);
        return doc;
    },
    async listByUser (userId) {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMongoDb"])();
        if (db) return db.collection('pushSubscriptions').find({
            userId: String(userId)
        }).toArray();
        return memory.items.filter((item)=>item.userId === String(userId));
    },
    async remove (userId, endpoint) {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMongoDb"])();
        if (db) {
            const result = await db.collection('pushSubscriptions').deleteMany({
                userId: String(userId),
                endpoint: String(endpoint)
            });
            return result.deletedCount;
        }
        const before = memory.items.length;
        memory.items = memory.items.filter((item)=>!(item.userId === String(userId) && item.endpoint === String(endpoint)));
        return before - memory.items.length;
    }
};
}),
"[project]/lib/backend/pushDomain.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sendPushToUser",
    ()=>sendPushToUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$web$2d$push$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/web-push/src/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$pushSubscriptionRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/pushSubscriptionRepository.js [app-route] (ecmascript)");
;
;
let configured = false;
function configureWebPush() {
    if (configured) return true;
    const publicKey = ("TURBOPACK compile-time value", "");
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const subject = process.env.VAPID_SUBJECT || 'mailto:admin@example.com';
    if ("TURBOPACK compile-time truthy", 1) return false;
    //TURBOPACK unreachable
    ;
}
async function sendPushToUser(userId, notification) {
    if (!configureWebPush() || !userId) return {
        sent: 0,
        disabled: true
    };
    const subscriptions = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$pushSubscriptionRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pushSubscriptionRepository"].listByUser(userId);
    let sent = 0;
    for (const item of subscriptions){
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$web$2d$push$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sendNotification(item.subscription, JSON.stringify({
                title: notification.title,
                body: notification.message,
                type: notification.type,
                resourceType: notification.resourceType,
                resourceId: notification.resourceId,
                notificationId: notification.id
            }));
            sent += 1;
        } catch (error) {
            if (error?.statusCode === 404 || error?.statusCode === 410) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$pushSubscriptionRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pushSubscriptionRepository"].remove(userId, item.endpoint);
            } else {
                console.error('WEB_PUSH_SEND_FAILED', error?.message || error);
            }
        }
    }
    return {
        sent,
        disabled: false
    };
}
}),
"[project]/lib/backend/notificationDomain.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createNotification",
    ()=>createNotification,
    "notifyDeliveryTransition",
    ()=>notifyDeliveryTransition
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$notificationRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/notificationRepository.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$realtimeHub$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/realtimeHub.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$pushDomain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/pushDomain.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$userRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/userRepository.js [app-route] (ecmascript)");
;
;
;
;
async function createNotification({ recipientId = null, audienceRole = null, type, title, message, resourceType = null, resourceId = null, priority = 'normal' }) {
    if (!recipientId && !audienceRole) throw new Error('NOTIFICATION_TARGET_REQUIRED');
    const notification = {
        id: crypto.randomUUID(),
        recipientId: recipientId ? String(recipientId) : null,
        audienceRole,
        type,
        title,
        message,
        resourceType,
        resourceId: resourceId ? String(resourceId) : null,
        priority,
        readAt: null,
        readBy: [],
        createdAt: new Date().toISOString()
    };
    const saved = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$notificationRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["notificationRepository"].create(notification);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$realtimeHub$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["broadcastRealtime"])({
        type: 'notification.created',
        data: saved,
        recipientId: saved.recipientId,
        audienceRole: saved.audienceRole
    });
    if (saved.recipientId) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$pushDomain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendPushToUser"])(saved.recipientId, saved).catch((error)=>console.error('WEB_PUSH_BACKGROUND_FAILED', error));
    } else if (saved.audienceRole) {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$userRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["userRepository"].list({
            role: saved.audienceRole,
            statutCompte: 'actif',
            limit: 500
        }).then((users)=>Promise.all(users.map((user)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$pushDomain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendPushToUser"])(user.id, saved)))).catch((error)=>console.error('WEB_PUSH_AUDIENCE_FAILED', error));
    }
    return saved;
}
async function notifyDeliveryTransition(delivery, oldStatus, newStatus) {
    const jobs = [];
    if (delivery.commerceId) {
        jobs.push(createNotification({
            recipientId: delivery.commerceId,
            type: 'maj_etat_livraison',
            title: `Livraison ${delivery.reference}`,
            message: `Le statut est passé de « ${oldStatus} » à « ${newStatus} ».`,
            resourceType: 'delivery',
            resourceId: delivery.id
        }));
    }
    if (delivery.relayPointUserId) {
        jobs.push(createNotification({
            recipientId: delivery.relayPointUserId,
            type: newStatus === 'Non récupéré' ? 'livraison_non_recuperee' : 'maj_etat_livraison',
            title: `Livraison ${delivery.reference}`,
            message: `Nouveau statut : « ${newStatus} ».`,
            resourceType: 'delivery',
            resourceId: delivery.id
        }));
    }
    return Promise.all(jobs);
}
}),
"[project]/lib/backend/reportRepository.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "reportRepository",
    ()=>reportRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/mongodb.js [app-route] (ecmascript)");
;
const memory = globalThis.__relayflowReports || {
    items: []
};
globalThis.__relayflowReports = memory;
function matches(item, filters = {}) {
    if (filters.type && item.type !== filters.type) return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.authorId && String(item.authorId) !== String(filters.authorId)) return false;
    if (filters.assignedRole && item.assignedRole !== filters.assignedRole) return false;
    if (filters.deliveryId && String(item.deliveryId || '') !== String(filters.deliveryId)) return false;
    if (filters.search) {
        const text = `${item.id || ''} ${item.description || ''} ${item.deliveryId || ''}`.toLowerCase();
        if (!text.includes(String(filters.search).toLowerCase())) return false;
    }
    return true;
}
function buildQuery(filters = {}) {
    const query = {};
    if (filters.type) query.type = filters.type;
    if (filters.status) query.status = filters.status;
    if (filters.authorId) query.authorId = String(filters.authorId);
    if (filters.assignedRole) query.assignedRole = filters.assignedRole;
    if (filters.deliveryId) query.deliveryId = String(filters.deliveryId);
    if (filters.search) {
        const escaped = String(filters.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const rx = new RegExp(escaped, 'i');
        query.$or = [
            {
                id: rx
            },
            {
                description: rx
            },
            {
                deliveryId: rx
            }
        ];
    }
    return query;
}
const reportRepository = {
    async create (report) {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMongoDb"])();
        if (db) await db.collection('signalements').insertOne(report);
        else memory.items.push(report);
        return report;
    },
    async findById (id) {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMongoDb"])();
        return db ? db.collection('signalements').findOne({
            id: String(id)
        }) : memory.items.find((item)=>String(item.id) === String(id)) || null;
    },
    async list (filters = {}) {
        const limit = Math.min(Math.max(Number(filters.limit) || 20, 1), 100);
        const page = Math.max(Number(filters.page) || 1, 1);
        const skip = (page - 1) * limit;
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMongoDb"])();
        if (db) {
            const query = buildQuery(filters);
            const [rows, total] = await Promise.all([
                db.collection('signalements').find(query).sort({
                    createdAt: -1
                }).skip(skip).limit(limit).toArray(),
                db.collection('signalements').countDocuments(query)
            ]);
            return {
                rows,
                total,
                page,
                limit
            };
        }
        const all = memory.items.filter((item)=>matches(item, filters)).sort((a, b)=>String(b.createdAt).localeCompare(String(a.createdAt)));
        return {
            rows: all.slice(skip, skip + limit),
            total: all.length,
            page,
            limit
        };
    },
    async replace (id, report) {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMongoDb"])();
        if (db) {
            await db.collection('signalements').replaceOne({
                id: String(id)
            }, report);
            return report;
        }
        const index = memory.items.findIndex((item)=>String(item.id) === String(id));
        if (index < 0) return null;
        memory.items[index] = report;
        return report;
    }
};
}),
"[project]/lib/backend/reportDomain.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "REPORT_STATUSES",
    ()=>REPORT_STATUSES,
    "REPORT_TYPES",
    ()=>REPORT_TYPES,
    "createRefusalReport",
    ()=>createRefusalReport,
    "createReport",
    ()=>createReport,
    "transitionReport",
    ()=>transitionReport
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$reportRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/reportRepository.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$notificationDomain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/notificationDomain.js [app-route] (ecmascript)");
;
;
const REPORT_TYPES = [
    'probleme_reception_livreur',
    'probleme_livraison_client',
    'probleme_paiement',
    'autre'
];
const REPORT_STATUSES = [
    'ouvert',
    'en_traitement',
    'escalade',
    'resolu',
    'rejete'
];
function routingFor(type) {
    return type === 'probleme_paiement' ? 'gestionnaire_financier' : 'gestionnaire';
}
async function createReport(input, author) {
    if (!REPORT_TYPES.includes(input?.type)) throw new Error('INVALID_REPORT_TYPE');
    if (!String(input?.description || '').trim()) throw new Error('DESCRIPTION_REQUIRED');
    const now = new Date().toISOString();
    const assignedRole = routingFor(input.type);
    const report = {
        id: crypto.randomUUID(),
        type: input.type,
        origin: input.origin || (author?.role === 'point_relais' ? 'Point relais' : 'Commerçant'),
        priority: input.priority || 'normale',
        deliveryId: input.deliveryId || input.deliveryRef ? String(input.deliveryId || input.deliveryRef) : null,
        deliveryRef: input.deliveryRef || input.deliveryId || '',
        authorId: author?.id ? String(author.id) : String(input.authorId || ''),
        authorRole: author?.role || input.authorRole || null,
        description: String(input.description).trim(),
        status: 'ouvert',
        assignedRole,
        assignedManagerId: null,
        geography: {
            ville: input.ville || author?.profile?.ville || author?.ville || null,
            departement: input.departement || author?.profile?.departement || author?.departement || null
        },
        resolutionComment: null,
        createdAt: now,
        updatedAt: now,
        resolvedAt: null,
        history: [
            {
                status: 'ouvert',
                actorId: author?.id || null,
                at: now,
                comment: 'Signalement créé.'
            }
        ]
    };
    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$reportRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["reportRepository"].create(report);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$notificationDomain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createNotification"])({
        audienceRole: assignedRole,
        type: 'urgence',
        title: input.type === 'probleme_paiement' ? 'Nouveau litige de paiement' : 'Nouveau signalement',
        message: `Un signalement ${report.id.slice(0, 8)} doit être traité.`,
        resourceType: 'report',
        resourceId: report.id,
        priority: input.type === 'probleme_paiement' ? 'high' : 'normal'
    });
    return report;
}
async function createRefusalReport(delivery, actorId = null) {
    return createReport({
        type: 'probleme_reception_livreur',
        deliveryId: delivery.id,
        description: delivery.refusalReason || 'Réception refusée par le point relais.',
        ville: delivery.relayCity || null,
        departement: delivery.relayDepartment || null,
        authorId: actorId || delivery.relayPointUserId || '',
        authorRole: 'point_relais'
    }, actorId ? {
        id: actorId,
        role: 'point_relais'
    } : null);
}
async function transitionReport(id, action, actor, comment = '') {
    const report = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$reportRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["reportRepository"].findById(id);
    if (!report) throw new Error('REPORT_NOT_FOUND');
    const transitions = {
        take: {
            from: [
                'ouvert'
            ],
            to: 'en_traitement'
        },
        escalate: {
            from: [
                'ouvert',
                'en_traitement'
            ],
            to: 'escalade'
        },
        resolve: {
            from: [
                'ouvert',
                'en_traitement',
                'escalade'
            ],
            to: 'resolu'
        },
        reject: {
            from: [
                'ouvert',
                'en_traitement',
                'escalade'
            ],
            to: 'rejete'
        }
    };
    const rule = transitions[action];
    if (!rule || !rule.from.includes(report.status)) throw new Error('INVALID_REPORT_TRANSITION');
    if (action === 'escalate' && actor.role !== 'gestionnaire') throw new Error('FORBIDDEN_REPORT_ACTION');
    if (report.type === 'probleme_paiement' && actor.role !== 'gestionnaire_financier' && actor.role !== 'super_gestionnaire') throw new Error('FORBIDDEN_REPORT_ACTION');
    if (action === 'take' && ![
        'gestionnaire',
        'gestionnaire_financier',
        'super_gestionnaire'
    ].includes(actor.role)) throw new Error('FORBIDDEN_REPORT_ACTION');
    if ([
        'resolve',
        'reject'
    ].includes(action) && ![
        'gestionnaire',
        'gestionnaire_financier',
        'super_gestionnaire'
    ].includes(actor.role)) throw new Error('FORBIDDEN_REPORT_ACTION');
    const now = new Date().toISOString();
    const updated = {
        ...report,
        status: rule.to,
        assignedRole: action === 'escalate' ? 'super_gestionnaire' : report.assignedRole,
        assignedManagerId: action === 'take' ? String(actor.id) : report.assignedManagerId,
        resolutionComment: [
            'resolve',
            'reject'
        ].includes(action) ? String(comment || '').trim() : report.resolutionComment,
        resolvedAt: [
            'resolve',
            'reject'
        ].includes(action) ? now : report.resolvedAt,
        updatedAt: now,
        history: [
            ...report.history || [],
            {
                status: rule.to,
                actorId: String(actor.id),
                at: now,
                comment: String(comment || '').trim() || `Action ${action}.`
            }
        ]
    };
    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$reportRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["reportRepository"].replace(id, updated);
    if (action === 'escalate') {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$notificationDomain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createNotification"])({
            audienceRole: 'super_gestionnaire',
            type: 'urgence',
            title: 'Signalement escaladé',
            message: `Le signalement ${id.slice(0, 8)} nécessite un arbitrage.`,
            resourceType: 'report',
            resourceId: id,
            priority: 'high'
        });
    }
    if ([
        'resolve',
        'reject'
    ].includes(action) && updated.authorId) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$notificationDomain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createNotification"])({
            recipientId: updated.authorId,
            type: 'info_message',
            title: 'Signalement traité',
            message: action === 'resolve' ? 'Votre signalement a été résolu.' : 'Votre signalement a été rejeté.',
            resourceType: 'report',
            resourceId: id
        });
    }
    return updated;
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
"[project]/lib/domain/deliveryState.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ALLOWED_TRANSITIONS",
    ()=>ALLOWED_TRANSITIONS
]);
const ALLOWED_TRANSITIONS = {
    'Créée': [
        'En transit',
        'Arrivé au point relais',
        'Refusé',
        'Retour demandé'
    ],
    'En transit': [
        'Arrivé au point relais',
        'Refusé',
        'Retour demandé'
    ],
    'Arrivé au point relais': [
        'Retiré',
        'Retour demandé',
        'Non récupéré'
    ],
    'Retour demandé': [
        'Retourné'
    ],
    'Non récupéré': [
        'Retour demandé',
        'Retourné'
    ],
    'Refusé': [
        'Retour demandé',
        'Retourné'
    ],
    'Retiré': [],
    'Retourné': []
};
}),
"[project]/lib/backend/deliveryDomain.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "canReadDelivery",
    ()=>canReadDelivery,
    "createDelivery",
    ()=>createDelivery,
    "markOverduePickups",
    ()=>markOverduePickups,
    "transitionDelivery",
    ()=>transitionDelivery
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$deliveryRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/deliveryRepository.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$userRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/userRepository.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$notificationDomain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/notificationDomain.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$reportDomain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/reportDomain.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$geography$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/geography.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$auditDomain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/auditDomain.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$deliveryState$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/domain/deliveryState.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
function canReadDelivery(actor, delivery) {
    if (actor.role === 'super_gestionnaire' || actor.role === 'gestionnaire_financier') return true;
    if (actor.role === 'commercant') return String(delivery.commerceId) === String(actor.sub);
    if (actor.role === 'point_relais') return String(delivery.relayPointId) === String(actor.sub);
    if (actor.role === 'gestionnaire') return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$geography$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scopeAllows"])(actor.scope, {
        ville: delivery.ville,
        departement: delivery.departement
    });
    return false;
}
async function createDelivery(input, actor, context = {}) {
    if (actor?.role !== 'commercant') throw new Error('FORBIDDEN');
    if (!input?.relayPointId) throw new Error('RELAY_POINT_REQUIRED');
    if (!input?.clientFirstName || !input?.clientLastName) throw new Error('CLIENT_NAME_REQUIRED');
    const relay = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$userRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["userRepository"].findById(input.relayPointId);
    if (!relay || relay.role !== 'point_relais' || relay.statutCompte !== 'actif') throw new Error('RELAY_NOT_FOUND');
    const relayProfile = relay.profile || {};
    if ((relayProfile.operationalStatus || 'ouvert') !== 'ouvert') throw new Error('RELAY_NOT_OPEN');
    const merchant = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$userRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["userRepository"].findById(actor.sub);
    const now = new Date().toISOString();
    const id = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])();
    const reference = `LIV-${Date.now().toString(36).toUpperCase()}-${id.slice(0, 6).toUpperCase()}`;
    const delivery = {
        id,
        reference,
        commerceId: String(actor.sub),
        commerceName: merchant?.profile?.raisonSociale || merchant?.email || 'Commerçant',
        relayPointId: String(relay.id),
        relayPointUserId: String(relay.id),
        relayPoint: relayProfile.relayName || relay.email,
        relayName: relayProfile.relayName || relay.email,
        ville: relayProfile.relayCity || relayProfile.ville || '',
        departement: relayProfile.department || relayProfile.departement || '',
        quantity: Number(input.quantity ?? 1),
        weight: Number(input.weight ?? 0),
        type: input.type || 'Standard',
        date: input.date || now.slice(0, 10),
        comment: input.comment?.trim() || '',
        contents: input.contents?.trim() || '',
        carrierName: input.carrierName?.trim() || '',
        client: {
            firstName: input.clientFirstName.trim(),
            lastName: input.clientLastName.trim(),
            phone: input.clientPhone?.trim() || ''
        },
        status: 'Créée',
        createdAt: now,
        updatedAt: now,
        receivedAt: null,
        pickupDeadline: null,
        handoffProof: null,
        refusalReason: null,
        history: [
            {
                oldStatus: null,
                status: 'Créée',
                actorId: String(actor.sub),
                date: now,
                comment: 'Livraison créée depuis l’espace commerçant.'
            }
        ]
    };
    const saved = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$deliveryRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deliveryRepository"].create(delivery);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$auditDomain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writeAuditTrace"])({
        request: context.request,
        eventType: 'DELIVERY_CREATED',
        action: 'delivery.create',
        actor,
        resourceType: 'delivery',
        resourceId: id,
        after: {
            status: saved.status,
            reference: saved.reference
        },
        metadata: {
            relayPointId: saved.relayPointId
        }
    });
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$notificationDomain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createNotification"])({
        recipientId: relay.id,
        type: 'maj_etat_livraison',
        title: `Nouvelle livraison ${reference}`,
        message: 'Une nouvelle livraison est prévue dans votre point relais.',
        resourceType: 'delivery',
        resourceId: id
    });
    return saved;
}
async function transitionDelivery(id, status, comment = '', extra = {}, actor = null, context = {}) {
    const current = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$deliveryRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deliveryRepository"].findById(id);
    if (!current) throw new Error('DELIVERY_NOT_FOUND');
    if (actor && !canReadDelivery(actor, current)) throw new Error('FORBIDDEN');
    if (actor?.role === 'commercant' && ![
        'Retour demandé'
    ].includes(status)) throw new Error('FORBIDDEN_TRANSITION_ROLE');
    if (actor?.role === 'point_relais' && ![
        'Arrivé au point relais',
        'Refusé',
        'Retiré',
        'Retourné'
    ].includes(status)) throw new Error('FORBIDDEN_TRANSITION_ROLE');
    const allowed = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2f$deliveryState$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ALLOWED_TRANSITIONS"][current.status] || [];
    if (current.status !== status && !allowed.includes(status)) throw new Error('INVALID_TRANSITION');
    const now = new Date().toISOString();
    const patch = {};
    if (status === 'Arrivé au point relais') {
        patch.receivedAt = now;
        patch.receptionSheet = {
            id: crypto.randomUUID(),
            reference: current.reference,
            receivedAt: now,
            parcelCondition: extra.parcelCondition || 'bon_etat',
            observations: comment || '',
            carrierName: current.carrierName || '',
            quantity: current.quantity || 1,
            weight: current.weight || 0,
            recordedBy: actor?.sub || null,
            recordedByRole: actor?.role || null
        };
        const days = Math.max(1, Number(process.env.PICKUP_DEADLINE_DAYS || 7));
        patch.pickupDeadline = new Date(Date.now() + days * 86400000).toISOString();
    }
    if (status === 'Refusé') patch.refusalReason = comment || 'Réception refusée.';
    if (status === 'Retiré' && extra.proof) {
        patch.handoffProof = extra.proof;
        patch.handoffSheet = {
            id: crypto.randomUUID(),
            reference: current.reference,
            handedOffAt: now,
            recipientName: extra.proof.recipientName || '',
            identification: extra.proof.identification || '',
            proofReference: extra.proof.proofReference || '',
            observations: comment || '',
            recordedBy: actor?.sub || null,
            recordedByRole: actor?.role || null
        };
    }
    const updated = {
        ...current,
        ...patch,
        ...extra,
        status,
        updatedAt: now,
        history: [
            ...current.history || [],
            {
                oldStatus: current.status,
                status,
                actorId: actor?.sub || extra.actorId || null,
                date: now,
                comment: comment || 'Statut mis à jour.'
            }
        ]
    };
    const saved = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$deliveryRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deliveryRepository"].replace(id, updated);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$auditDomain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writeAuditTrace"])({
        request: context.request,
        requestId: context.requestId,
        eventType: 'DELIVERY_STATUS_TRANSITION',
        action: `delivery.transition.${status}`,
        actor,
        resourceType: 'delivery',
        resourceId: id,
        before: {
            status: current.status,
            updatedAt: current.updatedAt
        },
        after: {
            status: saved.status,
            updatedAt: saved.updatedAt
        },
        metadata: {
            comment,
            receptionSheetId: saved.receptionSheet?.id || null,
            handoffSheetId: saved.handoffSheet?.id || null
        }
    });
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$notificationDomain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["notifyDeliveryTransition"])(saved, current.status, status);
    if (status === 'Refusé' && current.status !== 'Refusé') await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$reportDomain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createRefusalReport"])(saved, actor?.sub || extra.actorId || null);
    return saved;
}
async function markOverduePickups() {
    const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$deliveryRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deliveryRepository"].list({
        status: 'Arrivé au point relais',
        limit: 200
    });
    const items = result.data || result;
    const now = Date.now();
    let updatedCount = 0;
    for (const item of items)if (item.pickupDeadline && new Date(item.pickupDeadline).getTime() < now) {
        await transitionDelivery(item.id, 'Non récupéré', 'Délai de retrait dépassé automatiquement.');
        updatedCount += 1;
    }
    return {
        updatedCount,
        checkedCount: items.length,
        executedAt: new Date().toISOString()
    };
}
}),
"[project]/app/api/v1/deliveries/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/http.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/auth.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$deliveryRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/backend/deliveryRepository.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$deliveryDomain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/backend/deliveryDomain.js [app-route] (ecmascript) <locals>");
;
;
;
;
async function GET(request) {
    const auth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireAuth"])(request, [
        'commercant',
        'point_relais',
        'gestionnaire',
        'super_gestionnaire',
        'gestionnaire_financier'
    ]);
    if (auth.error) return auth.error;
    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get('page')) || 1, 1);
    const limit = Math.min(Math.max(Number(searchParams.get('limit')) || 20, 1), 100);
    const filters = {
        status: searchParams.get('status') || undefined,
        query: searchParams.get('query') || undefined,
        limit,
        skip: (page - 1) * limit
    };
    if (auth.claims.role === 'commercant') filters.commerceId = auth.claims.sub;
    if (auth.claims.role === 'point_relais') filters.relayPointId = auth.claims.sub;
    const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$deliveryRepository$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deliveryRepository"].list(filters);
    const rows = result.data || result;
    const visible = rows.filter((row)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$deliveryDomain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["canReadDelivery"])(auth.claims, row));
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["collection"])(visible, {
        page,
        limit,
        total: result.total ?? visible.length,
        hasNext: page * limit < (result.total ?? visible.length)
    });
}
async function POST(request) {
    const auth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireAuth"])(request, [
        'commercant'
    ]);
    if (auth.error) return auth.error;
    try {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"])(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$deliveryDomain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createDelivery"])(await request.json(), auth.claims, {
            request
        }), {
            status: 201
        });
    } catch (error) {
        const map = {
            RELAY_POINT_REQUIRED: [
                400,
                'Un point relais est requis.'
            ],
            CLIENT_NAME_REQUIRED: [
                400,
                'Le nom et le prénom du client sont requis.'
            ],
            RELAY_NOT_FOUND: [
                404,
                'Point relais introuvable.'
            ],
            RELAY_NOT_OPEN: [
                409,
                'Ce point relais n’est actuellement pas ouvert.'
            ],
            FORBIDDEN: [
                403,
                'Action non autorisée.'
            ]
        };
        const entry = map[error.message];
        return entry ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiError"])(entry[0], error.message, entry[1]) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$backend$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiError"])(500, 'INTERNAL_ERROR', 'Impossible de créer la livraison.');
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0-72wom._.js.map