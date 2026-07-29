"use client";

import {useMemo, useState} from "react";
import RecherchePointRelais from "@/composants/relais/RecherchePointRelais.jsx";
import CartePointRelais from "@/composants/relais/CartePointRelais.jsx";

const MAX_DISPLAYED = 20;

export default function SelectionPointRelais({onSelect}) {
    const [relays, setRelays] = useState([]);
    const [selected, setSelected] = useState(null);
    const displayedRelays = useMemo(() => relays.slice(0, MAX_DISPLAYED), [relays]);

    function handleSelect(relay) {
        setSelected(relay);
        onSelect?.(relay);
    }

    return <div className="space-y-5">
        <RecherchePointRelais onResults={setRelays}/>

        {relays.length > 0 && <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <p className="font-medium text-slate-200">{relays.length} point{relays.length > 1 ? "s" : ""} relais trouvé{relays.length > 1 ? "s" : ""}</p>
            {relays.length > MAX_DISPLAYED && <p className="text-slate-500">Affichage des {MAX_DISPLAYED} premiers résultats</p>}
        </div>}

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {displayedRelays.length > 0 ? displayedRelays.map((relay) => <CartePointRelais
                key={relay.id}
                relay={relay}
                selected={selected?.id === relay.id}
                onClick={() => handleSelect(relay)}
            />) : <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8 text-center text-sm text-slate-500">Lancez une recherche pour afficher les points relais disponibles.</div>}
        </div>

        {selected && <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-blue-400">Point relais sélectionné</p>
            <h3 className="mt-2 font-bold text-slate-50">{selected.name}</h3>
            <p className="mt-1 text-sm text-slate-300">{selected.address}{selected.postalCode || selected.city ? ", " : ""}{selected.postalCode} {selected.city}</p>
        </div>}
    </div>;
}
