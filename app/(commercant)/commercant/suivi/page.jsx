"use client";

import {useEffect, useState} from "react";
import PageTitle from "@/composants/ui/PageTitle";
import TableauDonnees from "@/composants/table/TableauDonnees.jsx";
import SearchBar from "@/composants/search/SearchBar";
import FiltresLivraisons from "@/composants/livraison/FiltresLivraisons.jsx";
import Loading from "@/composants/ui/Loading";
import Alert from "@/composants/ui/Alert";
import {serviceLivraison} from "@/services/ServiceLivraison.js";

function StatusBadge({status}) {
    const styles = {"Créée": "bg-blue-500/10 text-blue-700", "En transit": "bg-amber-500/10 text-amber-800", "Arrivé au point relais": "bg-violet-500/10 text-violet-700", "Retiré": "bg-indigo-500/10 text-indigo-700", "Retourné": "bg-red-500/10 text-red-700"};
    return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${styles[status] || "bg-slate-100 text-slate-700"}`}>{status}</span>;
}

export default function SuiviPage() {
    const [deliveries, setDeliveries] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        serviceLivraison.getMyDeliveries().then(setDeliveries).catch(() => setError("Impossible de charger vos livraisons.")).finally(() => setLoading(false));
    }, []);

    const filtered = deliveries.filter(item => {
        const matchSearch = (item.reference || "").toLowerCase().includes(search.toLowerCase()) || (item.relayPoint || "").toLowerCase().includes(search.toLowerCase());
        return matchSearch && (status ? item.status === status : true);
    });

    return <div className="space-y-6">
        <PageTitle title="Suivi des livraisons" description="Recherchez une livraison et consultez rapidement son état actuel."/>
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row"><SearchBar value={search} onChange={setSearch} placeholder="Référence ou point relais..."/><FiltresLivraisons status={status} setStatus={setStatus}/></div>
        {error && <Alert type="error" message={error}/>} 
        {loading ? <Loading message="Chargement de vos livraisons..."/> : <TableauDonnees columns={[{key: "reference", label: "Référence", render: row => <span className="font-semibold text-slate-900">{row.reference}</span>},{key: "relayPoint", label: "Point relais"},{key: "status", label: "Statut", render: row => <StatusBadge status={row.status}/>},{key: "date", label: "Date"}]} data={filtered} emptyMessage="Aucune livraison ne correspond à votre recherche."/>}
    </div>;
}
