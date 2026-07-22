"use client";

import {useState} from "react";
import RecherchePointRelais from "@/composants/relais/RecherchePointRelais.jsx";
import CartePointRelais from "@/composants/relais/CartePointRelais.jsx";
import CartePointsRelais from "@/composants/relais/CartePointsRelais.jsx";

const MAX_DISPLAYED = 20;

export default function SelectionPointRelais({onSelect}) {
    const [relays, setRelays] = useState([]);
    const [selected, setSelected] = useState(null);

    const displayedRelays = relays.slice(0, MAX_DISPLAYED);

    function handleSelect(relay) {
        setSelected(relay);
        onSelect?.(relay);
    }

    return (<div className="space-y-6">
            {/* Barre de recherche */}
            <RecherchePointRelais onResults={setRelays}/>

            {relays.length > 0 && (<p className="text-sm text-slate-400">
                    {relays.length} points relais trouvés (affichage des{" "}
                    {displayedRelays.length} premiers)
                </p>)}

            {/* Carte + liste */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Carte */}
                <div className="lg:col-span-2 h-[450px] rounded-xl overflow-hidden border border-slate-700">
                    {displayedRelays.length > 0 ? (<CartePointsRelais
                            relayPoints={displayedRelays}
                            selected={selected}
                            onSelect={handleSelect}
                        />) : (<div className="flex h-full items-center justify-center bg-slate-900 text-slate-400">
                            Recherchez une zone pour afficher les relais
                        </div>)}
                </div>

                {/* Liste */}
                <div className="max-h-[450px] space-y-3 overflow-y-auto">
                    {displayedRelays.length > 0 ? (displayedRelays.map((relay) => (<CartePointRelais
                                key={relay.id}
                                relay={relay}
                                selected={selected?.id === relay.id}
                                onClick={() => handleSelect(relay)}
                            />))) : (<div className="rounded-xl border border-slate-700 p-5 text-slate-400">
                            Aucun relais sélectionné
                        </div>)}
                </div>
            </div>

            {/* Résumé du relais sélectionné */}
            {selected && (<div className="rounded-xl border border-green-600 bg-green-900/20 p-5">
                    <p className="text-sm text-slate-300">
                        Point relais sélectionné
                    </p>

                    <h3 className="text-lg font-semibold">
                        {selected.name}
                    </h3>

                    <p>{selected.address}</p>
                </div>)}
        </div>);
}
