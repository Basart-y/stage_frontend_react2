"use client";

import Link from "next/link";
import {useEffect, useMemo, useState} from "react";
import {ArrowRight, Download, PackageSearch, Plus, Search} from "lucide-react";
import PageTitle from "@/composants/ui/PageTitle";
import Loading from "@/composants/ui/Loading";
import Alert from "@/composants/ui/Alert";
import serviceLivraison from "@/services/ServiceLivraison.js";

function badge(status) {
    const styles = {"Créée": "bg-blue-500/10 text-blue-300", "En transit": "bg-amber-500/10 text-amber-300", "Arrivé au point relais": "bg-violet-500/10 text-violet-300", "Retiré": "bg-emerald-500/10 text-emerald-300", "Retourné": "bg-rose-500/10 text-rose-300", "Retour demandé": "bg-orange-500/10 text-orange-300"};
    return styles[status] || "bg-slate-800 text-slate-200";
}

export default function LivraisonsPage() {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("Toutes");
    useEffect(() => { serviceLivraison.getMyDeliveries().then(setDeliveries).catch(() => setError("Impossible de charger les livraisons.")).finally(() => setLoading(false)); }, []);
    const filtered = useMemo(() => deliveries.filter((delivery) => {
        const matchQuery = `${delivery.reference} ${delivery.relayPoint || ""} ${delivery.status || ""}`.toLowerCase().includes(query.toLowerCase());
        const matchFilter = filter === "Toutes" || delivery.status === filter;
        return matchQuery && matchFilter;
    }), [deliveries, query, filter]);
    const statuses = ["Toutes", ...new Set(deliveries.map((item) => item.status).filter(Boolean))];
    function exportCsv() {
        const rows = [["Référence", "Statut", "Point relais", "Date", "Quantité", "Poids"], ...filtered.map((d) => [d.reference, d.status, d.relayPoint || d.relayName || "", d.date || "", d.quantity ?? "", d.weight ?? ""])];
        const csv = rows.map((row) => row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(";")).join("\n");
        const blob = new Blob(["\ufeff" + csv], {type: "text/csv;charset=utf-8"});
        const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "relayflow-livraisons.csv"; a.click(); URL.revokeObjectURL(url);
    }

    return <div className="space-y-6">
        <PageTitle title="Mes livraisons" description="Recherchez, filtrez, exportez et suivez toutes vos expéditions." actions={<Link href="/commercant/planification" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"><Plus size={17}/> Nouvelle livraison</Link>}/>
        {error && <Alert type="error" message={error}/>} 
        <div className="rf-panel p-4 sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <label className="relative flex-1"><Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Référence, relais ou statut..." className="w-full rounded-xl border border-slate-700 bg-slate-900/60 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:bg-[#111b2b] focus:ring-4 focus:ring-blue-500/10"/></label>
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-xl border border-slate-700 bg-[#111b2b] px-3 py-2.5 text-sm font-semibold text-slate-200 outline-none focus:border-blue-500">{statuses.map((status) => <option key={status}>{status}</option>)}</select>
                <button onClick={exportCsv} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-[#111b2b] px-4 py-2.5 text-sm font-bold text-slate-200 transition hover:bg-slate-900/60"><Download size={16}/> Export CSV</button>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500"><span>{filtered.length} résultat(s)</span><span>{deliveries.length} livraison(s) au total</span></div>
        </div>
        {loading ? <Loading label="Chargement des livraisons..."/> : <div className="overflow-hidden rounded-[1.8rem] border border-slate-800 bg-[#111b2b] shadow-[0_12px_38px_rgba(15,23,42,.045)]">
            {filtered.length === 0 ? <div className="p-12 text-center"><PackageSearch size={30} className="mx-auto text-slate-300"/><p className="mt-4 font-bold text-slate-200">Aucune livraison trouvée</p><p className="mt-1 text-sm text-slate-500">Modifiez la recherche ou créez une nouvelle livraison.</p></div> : <div className="divide-y divide-slate-800">{filtered.map((delivery) => <article key={delivery.id} className="group flex flex-col gap-4 p-5 transition hover:bg-slate-800/70 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-3"><h3 className="font-black tracking-tight text-slate-50">{delivery.reference}</h3><span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${badge(delivery.status)}`}>{delivery.status}</span></div><p className="mt-2 truncate text-sm font-medium text-slate-300">{delivery.relayPoint || delivery.relayName || "Point relais non renseigné"}</p><p className="mt-1 text-xs text-slate-400">Prévue : {delivery.date || "—"} · {delivery.quantity ?? 1} colis · {delivery.weight ?? 0} kg</p></div><Link href={`/commercant/livraisons/${delivery.id}`} className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300">Voir le détail <ArrowRight size={16} className="transition group-hover:translate-x-1"/></Link></article>)}</div>}
        </div>}
    </div>;
}
