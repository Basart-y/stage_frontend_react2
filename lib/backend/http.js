export function ok(data, init = {}) {
    return Response.json({data, meta: {requestId: crypto.randomUUID()}}, init);
}

export function collection(data, pagination = {}, init = {}) {
    return Response.json({
        data,
        pagination: {limit: data.length, hasNext: false, ...pagination},
        meta: {requestId: crypto.randomUUID()},
    }, init);
}

export function apiError(status, code, message, details = []) {
    return Response.json({
        error: {
            code,
            message,
            user_facing_error: message,
            details,
            requestId: crypto.randomUUID(),
            retryable: status >= 500,
        },
    }, {status});
}
