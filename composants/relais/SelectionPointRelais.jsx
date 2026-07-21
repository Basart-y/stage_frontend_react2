"use client";

import {useState} from "react";
import RecherchePointRelais from "@/composants/relais/RecherchePointRelais.jsx";
import CartePointRelais from "@/composants/relais/CartePointRelais.jsx";
import CartePointRelais from "@/composants/relais/CartePointsRelais.jsx";

const MAX_DISPLAYED = 20; // limite d'affichage (carte + liste)

export default function SelectionPointRelais({onSelect}) {
    const [relays, setRelays] = useState([]);
    const [selected, setSelected] = useState(null);

    // On n'affiche que les N premiers pour performance / UX
    const displayedRelays = relays.slice(0, MAX_DISPLAYED);

    function handleSelect(relay) {
        setSelected(relay);
        onSelect?.(relay);
    }

    return (<div className="space-y-6">
            {/* Barre de recherche */}
            <RecherchePointRelais onResults={setRelays}/>

            {relays.length > 0 && (<p className="text-sm text-slate-400">
                    {relays.length} points relais trouvés
                    {" "}
                    (affichage des {displayedRelays.length} premiers)
                </p>)}

            {/* Carte + liste */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Carte */}
                <div className="lg:col-span-2 h-[450px] rounded-xl overflow-hidden border border-slate-700">
                    {displayedRelays.length > 0 ? (<CartePointRelais
                            relayPoints={displayedRelays}
                            selected={selected}
                            onSelect={handleSelect}
                        />) : (<div className="h-full flex items-center justify-center text-slate-400 bg-slate-900">
                            Recherchez une zone pour afficher les relais
                        </div>)}
                </div>

                {/* Liste */}
                <div className="space-y-3 max-h-[450px] overflow-y-auto">
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

            {selected && (<div className="rounded-xl border border-green-600 bg-green-900/20 p-5">
                    <p className="text-sm text-slate-300">
                        Point relais sélectionné
                    </p>
                    <h3 className="text-lg font-semibold">
                        {selected.name}
                    </h3>
                    <p>
                        {selected.address}
                    </p>
                </div>)}
        </div>);
}