"use client";

import {useEffect, useMemo, useState} from "react";
import {BadgeCheck, CheckCircle2, PackageCheck, Search} from "lucide-react";
import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import Input from "@/composants/ui/Input";
import Select from "@/composants/ui/Select";
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

function HandoffSheet({delivery, proof, completed = false}) {
    return <div className="overflow-hidden rounded-2xl border border-indigo-200 bg-indigo-50/40">
        <div className="flex flex-col gap-3 border-b border-indigo-200 bg-white/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-indigo-700">{completed ? "Fiche après remise" : "Fiche de remise"}</p>
                <h3 className="mt-1 text-xl font-black tracking-tight text-slate-950">{delivery.reference}</h3>
            </div>
            <span className="w-fit rounded-full bg-indigo-100 px-3 py-1.5 text-xs font-extrabold text-indigo-800">{completed ? "Retiré" : delivery.status}</span>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
            <Info label="Client prévu" value={`${delivery.client?.firstName || ""} ${delivery.client?.lastName || ""}`.trim() || "Client non renseigné"}/>
            <Info label="Téléphone client" value={delivery.client?.phone || "Non renseigné"}/>
            <Info label="Personne récupérant le colis" value={proof?.recipientName || "À renseigner"}/>
            <Info label="Contenu" value={delivery.contents || delivery.type || "Non renseigné"}/>
            <Info label="Livreur / transporteur" value={delivery.carrierName || "Non renseigné"}/>
            <Info label="Point relais" value={delivery.relayPoint || delivery.relayName || "Point relais actuel"}/>
            <Info label="Réception au relais" value={formatDate(delivery.receivedAt)}/>
            <Info label="Date limite de retrait" value={formatDate(delivery.pickupDeadline)}/>
            <Info label="Mode d'identification" value={proof?.identification === "qr_code" ? "QR Code" : proof?.identification === "numero_suivi" ? "Numéro de suivi" : "Pièce d'identité"}/>
            {completed && <Info label="Référence de preuve" value={proof?.proofReference || "Aucune référence saisie"}/>} 
            {completed && <Info label="Remis le" value={formatDate(delivery.handedOffAt)}/>} 
        </div>
    </div>;
}

export default function RemiseColisPage() {
    const [deliveries, setDeliveries] = useState([]);
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(null);
    const [lastHandoff, setLastHandoff] = useState(null);
    const [proof, setProof] = useState({recipientName: "", identification: "piece_identite", proofReference: ""});
    const [message, setMessage] = useState(null);

    async function refresh(){ setDeliveries(await serviceLivraison.getAll()); }
    useEffect(() => { refresh(); }, []);
    const available = useMemo(() => deliveries.filter((delivery) => delivery.status === "Arrivé au point relais" && `${delivery.reference} ${delivery.client?.firstName || ""} ${delivery.client?.lastName || ""}`.toLowerCase().includes(query.toLowerCase())), [deliveries, query]);

    async function handoff() {
        if (!selected || !proof.recipientName.trim()) { setMessage({type:"error", message:"Renseignez le nom de la personne qui récupère le colis."}); return; }
        const completedDelivery = {...selected, status: "Retiré", handedOffAt: new Date().toISOString()};
        const completedProof = {...proof};
        await serviceLivraison.handoff(selected.id, proof);
        setLastHandoff({delivery: completedDelivery, proof: completedProof});
        setMessage({type:"success", message:`${selected.reference} a été remis au client avec une preuve de remise enregistrée.`});
        setSelected(null); setProof({recipientName:"", identification:"piece_identite", proofReference:""}); await refresh();
    }

    return <div className="space-y-8">
        <PageTitle title="Remise au client" description="Recherchez un colis disponible, consultez sa fiche complète, identifiez la personne puis enregistrez la preuve de remise."/>
        {message && <Alert type={message.type} message={message.message}/>} 

        {lastHandoff && <Section title="Remise enregistrée" description="La fiche reste affichée après confirmation pour vérifier le colis et la preuve enregistrée.">
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                <CheckCircle2 className="mt-0.5 shrink-0" size={20}/><div><p className="font-extrabold">Colis remis avec succès</p><p className="mt-1 text-sm">La remise et son mode d'identification ont été enregistrés dans l'historique.</p></div>
            </div>
            <HandoffSheet delivery={lastHandoff.delivery} proof={lastHandoff.proof} completed/>
        </Section>}

        <Section title="Rechercher un colis"><div className="relative"><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Référence, nom ou prénom du client" className="w-full rounded-xl border border-slate-200 bg-white/70 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-blue-500"/></div></Section>
        <Section title={`Colis disponibles (${available.length})`}>
            <div className="grid gap-3 md:grid-cols-2">{available.length === 0 ? <p className="text-sm text-slate-600">Aucun colis disponible.</p> : available.map((delivery)=><button key={delivery.id} onClick={()=>{setSelected(delivery); setLastHandoff(null); setProof((p)=>({...p, recipientName:`${delivery.client?.firstName || ""} ${delivery.client?.lastName || ""}`.trim()}));}} className={`rounded-2xl border p-4 text-left transition ${selected?.id===delivery.id?"border-indigo-500 bg-indigo-500/10":"border-slate-200 bg-slate-50 hover:border-slate-300"}`}><div className="flex items-start justify-between gap-3"><div><p className="font-black text-slate-900">{delivery.reference}</p><p className="mt-1 text-sm text-slate-700">{delivery.client?.firstName} {delivery.client?.lastName}</p></div><PackageCheck size={19} className="text-indigo-700"/></div><p className="mt-3 text-xs text-slate-600">Disponible depuis {delivery.receivedAt ? new Date(delivery.receivedAt).toLocaleDateString("fr-FR") : "aujourd’hui"}</p></button>)}</div>
        </Section>
        {selected && <Section title="Fiche et preuve de remise" description="Vérifiez les informations du colis avant de confirmer sa sortie du stock.">
            <HandoffSheet delivery={selected} proof={proof}/>
            <div className="mt-5 grid gap-5 md:grid-cols-2"><Input label="Nom de la personne" name="recipientName" value={proof.recipientName} onChange={(e)=>setProof({...proof,recipientName:e.target.value})}/><Select label="Mode d'identification" name="identification" value={proof.identification} onChange={(e)=>setProof({...proof,identification:e.target.value})}><option value="piece_identite">Pièce d'identité</option><option value="qr_code">QR Code</option><option value="numero_suivi">Numéro de suivi</option></Select><Input label="Référence de preuve (optionnelle)" name="proofReference" value={proof.proofReference} onChange={(e)=>setProof({...proof,proofReference:e.target.value})} placeholder="Ex. QR vérifié"/></div><button onClick={handoff} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-500"><BadgeCheck size={17}/> Confirmer la remise</button>
        </Section>}
    </div>;
}
