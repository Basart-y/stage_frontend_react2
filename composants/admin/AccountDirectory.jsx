"use client";

import {useEffect, useMemo, useState} from "react";
import PageTitle from "@/composants/ui/PageTitle";
import Alert from "@/composants/ui/Alert";
import Loading from "@/composants/ui/Loading";
import TableauDonnees from "@/composants/table/TableauDonnees.jsx";
import {serviceAdministration} from "@/services/ServiceAdministration.js";

const statusLabel = {invite: "Invitation envoyée", actif: "Actif", suspendu: "Suspendu"};

export default function AccountDirectory({role, title, description}) {
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({page:1, limit:20, total:0, hasNext:false});
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState(null);

    async function load() {
        setLoading(true);
        try {
            const result = await serviceAdministration.listUsers({role, page, limit: 20, search, statutCompte: status});
            setRows(result.data);
            setPagination(result.pagination);
        } catch (error) {
            setFeedback({type: "error", message: error.message || "Impossible de charger les comptes."});
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, [role, page, status]);

    const counts = useMemo(() => ({
        total: rows.length,
        invite: rows.filter(r => r.statutCompte === "invite").length,
        actif: rows.filter(r => r.statutCompte === "actif").length,
        suspendu: rows.filter(r => r.statutCompte === "suspendu").length,
    }), [rows]);

    async function toggleStatus(row) {
        const next = row.statutCompte === "actif" ? "suspendu" : "actif";
        if (row.statutCompte === "invite") return;
        setFeedback(null);
        try {
            const updated = await serviceAdministration.setStatus(row.id, next);
            setRows(current => current.map(item => item.id === row.id ? updated : item));
            setFeedback({type: "success", message: next === "actif" ? "Compte réactivé." : "Compte suspendu."});
        } catch (error) {
            setFeedback({type: "error", message: error.message || "Impossible de modifier le compte."});
        }
    }

    return <div className="space-y-8">
        <PageTitle title={title} description={description}/>

        <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
            <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&(setPage(1),load())} placeholder="Rechercher nom, e-mail ou ville" className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none focus:border-blue-500"/>
            <select value={status} onChange={e=>{setStatus(e.target.value);setPage(1)}} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900"><option value="">Tous les statuts</option><option value="actif">Actifs</option><option value="invite">Invités</option><option value="suspendu">Suspendus</option></select>
            <button onClick={()=>{setPage(1);load()}} className="rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white hover:bg-indigo-700">Rechercher</button>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
            <Summary label="Total" value={counts.total}/><Summary label="Actifs" value={counts.actif}/><Summary label="Invités" value={counts.invite}/><Summary label="Suspendus" value={counts.suspendu}/>
        </div>

        {feedback && <Alert type={feedback.type} message={feedback.message}/>} 

        {loading ? <Loading message="Chargement des comptes…"/> : <TableauDonnees columns={[
            {key: "name", label: "Nom"},
            {key: "email", label: "Email"},
            {key: "city", label: "Ville"},
            {key: "departement", label: "Département"},
            {key: "status", label: "Statut", render: row => <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{statusLabel[row.statutCompte] || row.statutCompte}</span>},
            {key: "actions", label: "Actions", render: row => row.statutCompte === "invite" ? <span className="text-xs text-slate-600">En attente d’activation</span> : <button onClick={() => toggleStatus(row)} className={row.statutCompte === "actif" ? "font-semibold text-red-700 underline" : "font-semibold text-indigo-700 underline"}>{row.statutCompte === "actif" ? "Suspendre" : "Réactiver"}</button>},
        ]} data={rows} emptyMessage="Aucun compte dans votre périmètre."/>}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"><span>Page {pagination.page || page} · {pagination.total || 0} compte(s)</span><div className="flex gap-2"><button disabled={page<=1} onClick={()=>setPage(v=>Math.max(1,v-1))} className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-40">Précédent</button><button disabled={!pagination.hasNext} onClick={()=>setPage(v=>v+1)} className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-40">Suivant</button></div></div>
    </div>;
}

function Summary({label, value}) { return <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-600">{label}</p><p className="mt-2 text-2xl font-bold text-slate-950">{value}</p></div>; }
