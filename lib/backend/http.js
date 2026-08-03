import {randomUUID} from 'node:crypto';

function resolvedRequestId(requestId) { return requestId || randomUUID(); }

export function ok(data, init = {}, requestId) {
    return Response.json({data, meta: {requestId: resolvedRequestId(requestId)}}, init);
}

export function collection(data, pagination = {}, init = {}, requestId) {
    return Response.json({
        data,
        pagination: {limit: data.length, hasNext: false, ...pagination},
        meta: {requestId: resolvedRequestId(requestId)},
    }, init);
}

export function apiError(status, code, message, details = [], requestId) {
    return Response.json({
        error: {
            code,
            message,
            user_facing_error: message,
            details,
            requestId: resolvedRequestId(requestId),
            retryable: status >= 500,
        },
    }, {status});
}
