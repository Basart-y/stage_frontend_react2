"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {useParams} from "next/navigation";
import {ArrowLeft} from "lucide-react";
import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import Alert from "@/composants/ui/Alert";
import {serviceLivraison} from "@/services/ServiceLivraison.js";

export default function ParcelDetailPage(){
 const {id}=useParams(); const [d,setD]=useState(null); const [message,setMessage]=useState(""); const [error,setError]=useState("");
 useEffect(()=>{serviceLivraison.findById(id).then(setD)},[id]);
 async function receive(){try{const u=await serviceLivraison.receive(d.id,"Réception confirmée depuis le détail du colis.");setD(u);setMessage("Réception confirmée.");setError("")}catch(e){setError(e.message)}}
 async function handoff(){try{const u=await serviceLivraison.handoff(d.id,{recipientName:`${d.client?.firstName||""} ${d.client?.lastName||""}`.trim(),identification:"numero_suivi",proofReference:`PREUVE-${d.reference}`});setD(u);setMessage("Remise au client confirmée.");setError("")}catch(e){setError(e.message)}}
 if(!d)return <p className="text-sm text-slate-500">Chargement...</p>;
 const transitions=serviceLivraison.getAllowedTransitions(d.status);
 return <div className="space-y-8"><Link href="/point-relais/suivi" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-400"><ArrowLeft size={16}/> Retour au suivi</Link><PageTitle title={`Colis ${d.reference}`} description="Détail opérationnel du colis et historique des changements d'état."/>{message&&<Alert type="success" message={message}/>} {error&&<Alert type="error" message={error}/>}<Section title="Informations colis"><div className="grid gap-4 md:grid-cols-2"><Info label="Client" value={`${d.client?.firstName||""} ${d.client?.lastName||""}`.trim()||"—"}/><Info label="Statut" value={d.status}/><Info label="Point relais" value={d.relayPoint||d.relayName||"—"}/><Info label="Transporteur" value={d.carrierName||"—"}/><Info label="Contenu" value={d.contents||"—"}/><Info label="Retrait avant" value={d.pickupDeadline?new Date(d.pickupDeadline).toLocaleString("fr-FR"):"—"}/></div></Section><Section title="Actions disponibles" description={transitions.length?`Transitions autorisées : ${transitions.join(" · ")}`:"Cette livraison est dans un état terminal."}><div className="flex flex-wrap gap-3">{transitions.includes("Arrivé au point relais")&&<button onClick={receive} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-500">Confirmer réception</button>}{transitions.includes("Retiré")&&<button onClick={handoff} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-500">Confirmer remise client</button>}</div></Section><Section title="Historique"><div className="space-y-4">{[...(d.history||[])].reverse().map((h,i)=><div key={`${h.date}-${i}`} className="border-b border-slate-800 pb-4 last:border-0"><p className="text-sm font-bold text-slate-100">{h.status}</p><p className="mt-1 text-xs text-slate-500">{new Date(h.date).toLocaleString("fr-FR")}</p>{h.comment&&<p className="mt-1 text-sm text-slate-400">{h.comment}</p>}</div>)}</div></Section></div>
}
function Info({label,value}){return <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4"><p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 text-sm font-bold text-slate-200">{value}</p></div>}
