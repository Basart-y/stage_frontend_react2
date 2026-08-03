"use client";

import {useEffect, useState} from "react";
import {RotateCcw} from "lucide-react";
import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import Textarea from "@/composants/ui/Textarea";
import Alert from "@/composants/ui/Alert";
import serviceLivraison from "@/services/ServiceLivraison.js";

export default function RetourPage() {
    const [deliveries, setDeliveries] = useState([]);
    const [selected, setSelected] = useState(null);
    const [reason, setReason] = useState("");
    const [message, setMessage] = useState(null);
    async function refresh(){ setDeliveries((await serviceLivraison.getAll()).filter((d)=>d.status === "Retour demandé")); }
    useEffect(()=>{ refresh(); },[]);
    async function confirm(){ if(!selected) return; await serviceLivraison.confirmReturn(selected.id, reason); setMessage({type:"success",message:`Retour de ${selected.reference} confirmé.`}); setSelected(null); setReason(""); await refresh(); }
    return <div className="space-y-8"><PageTitle title="Retours" description="Traitez les demandes de retour et confirmez la sortie physique du colis."/>{message&&<Alert type={message.type} message={message.message}/>}<Section title={`Retours à traiter (${deliveries.length})`}><div className="grid gap-3">{deliveries.length===0?<p className="text-sm text-slate-600">Aucune demande de retour en attente.</p>:deliveries.map((d)=><button key={d.id} onClick={()=>setSelected(d)} className={`flex items-center justify-between rounded-2xl border p-4 text-left ${selected?.id===d.id?"border-orange-500 bg-orange-500/10":"border-slate-200 bg-slate-50"}`}><div><p className="font-black text-slate-900">{d.reference}</p><p className="mt-1 text-sm text-slate-600">{d.client?.firstName} {d.client?.lastName} · {d.relayPoint}</p></div><RotateCcw size={18} className="text-orange-700"/></button>)}</div></Section>{selected&&<Section title="Confirmer le retour"><p className="text-sm text-slate-700">Vous allez confirmer la sortie de <strong>{selected.reference}</strong> du stock du point relais.</p><div className="mt-5"><Textarea label="Commentaire" name="reason" value={reason} onChange={(e)=>setReason(e.target.value)} placeholder="Colis remis au transporteur, emballage vérifié..."/></div><button onClick={confirm} className="mt-5 rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white hover:bg-orange-500">Confirmer le retour</button></Section>}</div>;
}
