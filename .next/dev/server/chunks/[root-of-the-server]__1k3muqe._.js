module.exports = [
"[externals]/mongodb [external] (mongodb, cjs, [project]/node_modules/mongodb, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/[externals]_mongodb_0pl2hd_._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[externals]/mongodb [external] (mongodb, cjs, [project]/node_modules/mongodb)");
    });
});
}),
"[project]/app/api/v1/auth/login/route.js [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.resolve().then(() => {
        return parentImport("[project]/app/api/v1/auth/login/route.js [app-route] (ecmascript)");
    });
});
}),
];