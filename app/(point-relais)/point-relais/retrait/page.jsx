"use client";

import {useEffect, useMemo, useState} from "react";
import {BadgeCheck, PackageCheck, Search} from "lucide-react";
import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import Input from "@/composants/ui/Input";
import Select from "@/composants/ui/Select";
import Alert from "@/composants/ui/Alert";
import serviceLivraison from "@/services/ServiceLivraison.js";

export default function RemiseColisPage() {
    const [deliveries, setDeliveries] = useState([]);
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(null);
    const [proof, setProof] = useState({recipientName: "", identification: "piece_identite", proofReference: ""});
    const [message, setMessage] = useState(null);

    async function refresh(){ setDeliveries(await serviceLivraison.getAll()); }
    useEffect(() => { refresh(); }, []);
    const available = useMemo(() => deliveries.filter((delivery) => delivery.status === "Arrivé au point relais" && `${delivery.reference} ${delivery.client?.firstName || ""} ${delivery.client?.lastName || ""}`.toLowerCase().includes(query.toLowerCase())), [deliveries, query]);

    async function handoff() {
        if (!selected || !proof.recipientName.trim()) { setMessage({type:"error", message:"Renseignez le nom de la personne qui récupère le colis."}); return; }
        await serviceLivraison.handoff(selected.id, proof);
        setMessage({type:"success", message:`${selected.reference} a été remis au client avec une preuve de remise enregistrée.`});
        setSelected(null); setProof({recipientName:"", identification:"piece_identite", proofReference:""}); await refresh();
    }

    return <div className="space-y-8">
        <PageTitle title="Remise au client" description="Recherchez un colis disponible, identifiez la personne puis enregistrez la preuve de remise."/>
        {message && <Alert type={message.type} message={message.message}/>} 
        <Section title="Rechercher un colis"><div className="relative"><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Référence, nom ou prénom du client" className="w-full rounded-xl border border-slate-200 bg-white/70 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-blue-500"/></div></Section>
        <Section title={`Colis disponibles (${available.length})`}>
            <div className="grid gap-3 md:grid-cols-2">{available.length === 0 ? <p className="text-sm text-slate-600">Aucun colis disponible.</p> : available.map((delivery)=><button key={delivery.id} onClick={()=>{setSelected(delivery); setProof((p)=>({...p, recipientName:`${delivery.client?.firstName || ""} ${delivery.client?.lastName || ""}`.trim()}));}} className={`rounded-2xl border p-4 text-left transition ${selected?.id===delivery.id?"border-indigo-500 bg-indigo-500/10":"border-slate-200 bg-slate-50 hover:border-slate-300"}`}><div className="flex items-start justify-between gap-3"><div><p className="font-black text-slate-900">{delivery.reference}</p><p className="mt-1 text-sm text-slate-700">{delivery.client?.firstName} {delivery.client?.lastName}</p></div><PackageCheck size={19} className="text-indigo-700"/></div><p className="mt-3 text-xs text-slate-600">Disponible depuis {delivery.receivedAt ? new Date(delivery.receivedAt).toLocaleDateString("fr-FR") : "aujourd’hui"}</p></button>)}</div>
        </Section>
        {selected && <Section title="Preuve de remise"><div className="grid gap-5 md:grid-cols-2"><Input label="Nom de la personne" name="recipientName" value={proof.recipientName} onChange={(e)=>setProof({...proof,recipientName:e.target.value})}/><Select label="Mode d'identification" name="identification" value={proof.identification} onChange={(e)=>setProof({...proof,identification:e.target.value})}><option value="piece_identite">Pièce d'identité</option><option value="qr_code">QR Code</option><option value="numero_suivi">Numéro de suivi</option></Select><Input label="Référence de preuve (optionnelle)" name="proofReference" value={proof.proofReference} onChange={(e)=>setProof({...proof,proofReference:e.target.value})} placeholder="Ex. QR vérifié"/></div><button onClick={handoff} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-500"><BadgeCheck size={17}/> Confirmer la remise</button></Section>}
    </div>;
}
