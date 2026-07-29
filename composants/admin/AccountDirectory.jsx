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
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState(null);

    async function load() {
        setLoading(true);
        try {
            setRows(await serviceAdministration.listUsers({role, limit: 100}));
        } catch (error) {
            setFeedback({type: "error", message: error.message || "Impossible de charger les comptes."});
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, [role]);

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

        <div className="grid gap-4 sm:grid-cols-4">
            <Summary label="Total" value={counts.total}/><Summary label="Actifs" value={counts.actif}/><Summary label="Invités" value={counts.invite}/><Summary label="Suspendus" value={counts.suspendu}/>
        </div>

        {feedback && <Alert type={feedback.type} message={feedback.message}/>} 

        {loading ? <Loading message="Chargement des comptes…"/> : <TableauDonnees columns={[
            {key: "name", label: "Nom"},
            {key: "email", label: "Email"},
            {key: "city", label: "Ville"},
            {key: "departement", label: "Département"},
            {key: "status", label: "Statut", render: row => <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200">{statusLabel[row.statutCompte] || row.statutCompte}</span>},
            {key: "actions", label: "Actions", render: row => row.statutCompte === "invite" ? <span className="text-xs text-slate-500">En attente d’activation</span> : <button onClick={() => toggleStatus(row)} className={row.statutCompte === "actif" ? "font-semibold text-red-300 underline" : "font-semibold text-emerald-300 underline"}>{row.statutCompte === "actif" ? "Suspendre" : "Réactiver"}</button>},
        ]} data={rows} emptyMessage="Aucun compte dans votre périmètre."/>}
    </div>;
}

function Summary({label, value}) { return <div className="rounded-2xl border border-slate-700 bg-[#111b2b] p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-slate-50">{value}</p></div>; }
