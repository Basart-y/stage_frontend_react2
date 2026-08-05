"use client";

import {useEffect, useMemo, useState} from "react";
import {CheckCircle2, QrCode, Search, XCircle} from "lucide-react";
import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import Input from "@/composants/ui/Input";
import Textarea from "@/composants/ui/Textarea";
import Alert from "@/composants/ui/Alert";
import serviceLivraison from "@/services/ServiceLivraison.js";

function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("fr-FR");
}

function Info({label, value}) {
    return <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-1.5 break-words text-sm font-semibold text-slate-900">{value || "—"}</p>
    </div>;
}

function DeliverySheet({delivery, title = "Fiche de réception"}) {
    return <div className="overflow-hidden rounded-2xl border border-blue-200 bg-blue-50/40">
        <div className="flex flex-col gap-3 border-b border-blue-200 bg-white/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-blue-700">{title}</p>
                <h3 className="mt-1 text-xl font-black tracking-tight text-slate-950">{delivery.reference}</h3>
            </div>
            <span className="w-fit rounded-full bg-blue-100 px-3 py-1.5 text-xs font-extrabold text-blue-800">{delivery.status || "État inconnu"}</span>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
            <Info label="Client" value={`${delivery.client?.firstName || ""} ${delivery.client?.lastName || ""}`.trim() || "Client non renseigné"}/>
            <Info label="Téléphone client" value={delivery.client?.phone || "Non renseigné"}/>
            <Info label="Livreur / transporteur" value={delivery.carrierName || "Non renseigné"}/>
            <Info label="Contenu" value={delivery.contents || delivery.type || "Non renseigné"}/>
            <Info label="Quantité" value={`${delivery.quantity || 1} colis`}/>
            <Info label="Poids" value={`${delivery.weight || 0} kg`}/>
            <Info label="Point relais" value={delivery.relayPoint || delivery.relayName || "Point relais actuel"}/>
            <Info label="Réception prévue" value={formatDate(delivery.date || delivery.expectedReceptionDate)}/>
            <Info label="Réception réelle" value={formatDate(delivery.receivedAt)}/>
        </div>
    </div>;
}

export default function ReceptionPage() {
    const [deliveries, setDeliveries] = useState([]);
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(null);
    const [lastProcessed, setLastProcessed] = useState(null);
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
        const processed = {...selected, status: "Arrivé au point relais", receivedAt: new Date().toISOString(), receptionComment: comment || "Colis reçu sans anomalie."};
        await serviceLivraison.receive(selected.id, comment);
        setLastProcessed({delivery: processed, action: "accepted"});
        setMessage({type: "success", message: `${selected.reference} a été réceptionnée et ajoutée au stock.`});
        setSelected(null); setComment(""); await refresh();
    }

    async function refuse() {
        if (!selected || !comment.trim()) {
            setMessage({type: "error", message: "Ajoutez un motif avant de refuser une livraison."});
            return;
        }
        const processed = {...selected, status: "Refusé", receivedAt: new Date().toISOString(), receptionComment: comment};
        await serviceLivraison.refuse(selected.id, comment);
        setLastProcessed({delivery: processed, action: "refused"});
        setMessage({type: "success", message: `${selected.reference} a été refusée. Le commerçant est notifié.`});
        setSelected(null); setComment(""); await refresh();
    }

    return <div className="space-y-8">
        <PageTitle title="Réception des colis" description="Identifiez une livraison, consultez sa fiche complète puis acceptez ou refusez son entrée en stock."/>
        {message && <Alert type={message.type} message={message.message}/>} 

        {lastProcessed && <Section title={lastProcessed.action === "accepted" ? "Réception enregistrée" : "Refus enregistré"} description="La fiche reste visible après l'action afin de pouvoir vérifier les informations traitées.">
            <div className={`mb-5 flex items-start gap-3 rounded-2xl border p-4 ${lastProcessed.action === "accepted" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-rose-200 bg-rose-50 text-rose-900"}`}>
                {lastProcessed.action === "accepted" ? <CheckCircle2 className="mt-0.5 shrink-0" size={20}/> : <XCircle className="mt-0.5 shrink-0" size={20}/>} 
                <div><p className="font-extrabold">{lastProcessed.action === "accepted" ? "Colis accepté et ajouté au stock" : "Réception refusée"}</p><p className="mt-1 text-sm">Observation : {lastProcessed.delivery.receptionComment}</p></div>
            </div>
            <DeliverySheet delivery={lastProcessed.delivery} title="Fiche après traitement"/>
        </Section>}

        <Section title="Mode d'identification">
            <div className="flex flex-wrap gap-3">
                <button onClick={() => setMode("manual")} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ${mode === "manual" ? "bg-blue-600 text-white" : "border border-slate-200 bg-white text-slate-700"}`}><Search size={16}/> Recherche</button>
                <button onClick={() => setMode("qr")} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ${mode === "qr" ? "bg-blue-600 text-white" : "border border-slate-200 bg-white text-slate-700"}`}><QrCode size={16}/> QR Code</button>
            </div>
            {mode === "qr" && <div className="mt-5 flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-blue-500/50 bg-blue-500/5 p-8 text-center"><div><QrCode size={46} className="mx-auto text-blue-700"/><p className="mt-3 font-bold text-slate-900">Scanner le QR code</p><p className="mt-1 text-sm text-slate-600">Pour la démo, saisissez ensuite la référence ci-dessous.</p></div></div>}
            <div className="mt-5"><Input label="Référence ou nom du client" name="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="LIV-00001 ou Dupont"/></div>
        </Section>

        <Section title={`Livraisons attendues (${results.length})`}>
            <div className="grid gap-3">
                {results.length === 0 ? <p className="text-sm text-slate-600">Aucune livraison en attente ne correspond à la recherche.</p> : results.slice(0, 8).map((delivery) => <button key={delivery.id} onClick={() => {setSelected(delivery); setLastProcessed(null);}} className={`flex flex-col gap-2 rounded-2xl border p-4 text-left transition sm:flex-row sm:items-center sm:justify-between ${selected?.id === delivery.id ? "border-blue-500 bg-blue-500/10" : "border-slate-200 bg-slate-50 hover:border-slate-300"}`}><div><p className="font-black text-slate-900">{delivery.reference}</p><p className="mt-1 text-sm text-slate-700">{delivery.client?.firstName} {delivery.client?.lastName || "Client non renseigné"}</p></div><div className="text-sm text-slate-600 sm:text-right"><p>{delivery.quantity || 1} colis · {delivery.weight || 0} kg</p><p className="mt-1">Prévue le {delivery.date || "—"}</p></div></button>)}
            </div>
        </Section>

        {selected && <Section title="Fiche et décision de réception" description="Vérifiez toutes les informations avant de confirmer l'entrée en stock ou le refus.">
            <DeliverySheet delivery={selected}/>
            <div className="mt-5"><Textarea label="Observation / motif de refus" name="comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Colis reçu sans anomalie, emballage endommagé..."/></div>
            <div className="mt-5 flex flex-wrap gap-3"><button onClick={accept} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-500"><CheckCircle2 size={17}/> Accepter et stocker</button><button onClick={refuse} className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-5 py-3 text-sm font-bold text-rose-700 hover:bg-rose-500/15"><XCircle size={17}/> Refuser</button></div>
        </Section>}
    </div>;
}
