"use client";

import {useEffect, useState} from "react";
import {Search} from "lucide-react";
import hookRecherchePointRelais from "@/hooks/HookRecherchePointRelais.js";
import Input from "@/composants/ui/Input";
import Alert from "@/composants/ui/Alert";

export default function RecherchePointRelais({onResults}) {
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const {relayPoints, loading, error, search} = hookRecherchePointRelais();

    useEffect(() => {
        onResults?.(relayPoints);
    }, [relayPoints, onResults]);

    async function handleSubmit(e) {
        e.preventDefault();
        await search({city: city.trim(), postalCode: postalCode.trim()});
    }

    return <div className="space-y-4">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
                <div className="grid flex-1 gap-4 sm:grid-cols-2">
                    <Input label="Ville" placeholder="Ex. Marseille" value={city} onChange={(e) => setCity(e.target.value)}/>
                    <Input label="Code postal" placeholder="Ex. 13001" value={postalCode} onChange={(e) => setPostalCode(e.target.value)}/>
                </div>
                <button type="submit" disabled={loading} className="inline-flex h-[42px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"><Search size={17}/>{loading ? "Recherche..." : "Rechercher"}</button>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">Renseignez une ville, un code postal ou les deux pour trouver les points relais disponibles.</p>
        </form>
        {error && <Alert type="error" message={error}/>} 
    </div>;
}
