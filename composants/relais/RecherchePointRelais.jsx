"use client";

import hookRecherchePointRelais from "@/hooks/HookRecherchePointRelais.js";
import React, {useEffect, useState} from "react";

export default function RecherchePointRelais({onResults}) {
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");

    const {relayPoints, loading, error, search} = hookRecherchePointRelais();

    useEffect(() => {
        onResults?.(relayPoints);
    }, [relayPoints, onResults]);

    async function handleSubmit(e) {
        e.preventDefault();
        await search({city, postalCode});
    }

    return (<div className="space-y-4">
        <form
            onSubmit={handleSubmit}
            className="bg-slate-900 border border-slate-700 rounded-xl shadow p-5 space-y-4"
        >
            <h2 className="text-xl font-semibold">
                Rechercher un point relais
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
                <input
                    className="border rounded-lg p-3 w-full bg-slate-800 text-slate-100"
                    placeholder="Ville"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />

                <input
                    className="border rounded-lg p-3 w-full bg-slate-800 text-slate-100"
                    placeholder="Code postal"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                />
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white rounded-lg px-5 py-3"
            >
                Rechercher
            </button>
        </form>

        {loading && (<p className="text-sm text-slate-400">
            Recherche des points relais...
        </p>)}

        {error && (<p className="text-sm text-red-600">
            {error}
        </p>)}
    </div>);
}