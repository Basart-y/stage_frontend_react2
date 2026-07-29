import {ok, apiError} from "@/lib/backend/http.js";
import {markOverduePickups} from "@/lib/backend/deliveryDomain.js";

export async function POST(request) {
    const configuredSecret = process.env.CRON_SECRET;
    if (configuredSecret) {
        const auth = request.headers.get("authorization");
        if (auth !== `Bearer ${configuredSecret}`) return apiError(401, "UNAUTHORIZED", "Automatisation non autorisée.");
    }
    return ok(await markOverduePickups());
}
