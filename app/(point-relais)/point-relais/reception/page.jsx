"use client";

import {useEffect, useMemo, useState} from "react";
import {CheckCircle2, PackageCheck, QrCode, Search, XCircle} from "lucide-react";
import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import Input from "@/composants/ui/Input";
import Textarea from "@/composants/ui/Textarea";
import Alert from "@/composants/ui/Alert";
import serviceLivraison from "@/services/ServiceLivraison.js";

export default function ReceptionPage() {
    const [deliveries, setDeliveries] = useState([]);
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(null);
    const [comment, setComment] = useState("");
    const [mode, setMode] = useState("manual");
    const [message, setMessage] = useState(null);

    async function refresh() { setDeliveries(await serviceLivraison.getAll()); }
    useEffect(() => { refresh(); }, []);

    const results = useMemo(() => deliveries.filter((delivery) => {
        const searchable = `${delivery.reference} ${delivery.client?.firstName || ""} ${delivery.client?.lastName || ""}`.toLowerCase();
        return ["Créée", "En transit"].includes(delivery.status) && (!query || searchable.includes(query.toLowerCase()));
    }), [deliveries, query]);

    async function accept() {
        if (!selected) return;
        await serviceLivraison.receive(selected.id, comment);
        setMessage({type: "success", message: `${selected.reference} a été réceptionnée et ajoutée au stock.`});
        setSelected(null); setComment(""); await refresh();
    }

    async function refuse() {
        if (!selected || !comment.trim()) {
            setMessage({type: "error", message: "Ajoutez un motif avant de refuser une livraison."});
            return;
        }
        await serviceLivraison.refuse(selected.id, comment);
        setMessage({type: "success", message: `${selected.reference} a été refusée. Le commerçant est notifié.`});
        setSelected(null); setComment(""); await refresh();
    }

    return <div className="space-y-8">
        <PageTitle title="Réception des colis" description="Identifiez une livraison, vérifiez ses informations puis acceptez ou refusez son entrée en stock."/>
        {message && <Alert type={message.type} message={message.message}/>} 

        <Section title="Mode d'identification">
            <div className="flex flex-wrap gap-3">
                <button onClick={() => setMode("manual")} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ${mode === "manual" ? "bg-blue-600 text-white" : "border border-slate-700 bg-slate-900 text-slate-300"}`}><Search size={16}/> Recherche</button>
                <button onClick={() => setMode("qr")} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ${mode === "qr" ? "bg-blue-600 text-white" : "border border-slate-700 bg-slate-900 text-slate-300"}`}><QrCode size={16}/> QR Code</button>
            </div>
            {mode === "qr" && <div className="mt-5 flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-blue-500/50 bg-blue-500/5 p-8 text-center"><div><QrCode size={46} className="mx-auto text-blue-400"/><p className="mt-3 font-bold text-slate-100">Scanner le QR code</p><p className="mt-1 text-sm text-slate-400">Pour la démo, saisissez ensuite la référence ci-dessous.</p></div></div>}
            <div className="mt-5"><Input label="Référence ou nom du client" name="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="LIV-00001 ou Dupont"/></div>
        </Section>

        <Section title={`Livraisons attendues (${results.length})`}>
            <div className="grid gap-3">
                {results.length === 0 ? <p className="text-sm text-slate-500">Aucune livraison en attente ne correspond à la recherche.</p> : results.slice(0, 8).map((delivery) => <button key={delivery.id} onClick={() => setSelected(delivery)} className={`flex flex-col gap-2 rounded-2xl border p-4 text-left transition sm:flex-row sm:items-center sm:justify-between ${selected?.id === delivery.id ? "border-blue-500 bg-blue-500/10" : "border-slate-700 bg-slate-900/50 hover:border-slate-600"}`}><div><p className="font-black text-slate-100">{delivery.reference}</p><p className="mt-1 text-sm text-slate-300">{delivery.client?.firstName} {delivery.client?.lastName || "Client non renseigné"}</p></div><div className="text-sm text-slate-400 sm:text-right"><p>{delivery.quantity || 1} colis · {delivery.weight || 0} kg</p><p className="mt-1">Prévue le {delivery.date || "—"}</p></div></button>)}
            </div>
        </Section>

        {selected && <Section title="Décision de réception">
            <div className="grid gap-4 rounded-2xl border border-slate-700 bg-slate-900/60 p-5 md:grid-cols-2">
                <div><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Livraison</p><p className="mt-1 font-black text-slate-100">{selected.reference}</p><p className="mt-2 text-sm text-slate-300">Client : {selected.client?.firstName} {selected.client?.lastName}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Transport</p><p className="mt-1 text-sm text-slate-200">{selected.carrierName || "Livreur non renseigné"}</p><p className="mt-2 text-sm text-slate-400">{selected.contents || selected.type || "Contenu non renseigné"}</p></div>
            </div>
            <div className="mt-5"><Textarea label="Observation / motif de refus" name="comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Colis reçu sans anomalie, emballage endommagé..."/></div>
            <div className="mt-5 flex flex-wrap gap-3"><button onClick={accept} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-500"><CheckCircle2 size={17}/> Accepter et stocker</button><button onClick={refuse} className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-5 py-3 text-sm font-bold text-rose-300 hover:bg-rose-500/15"><XCircle size={17}/> Refuser</button></div>
        </Section>}
    </div>;
}
