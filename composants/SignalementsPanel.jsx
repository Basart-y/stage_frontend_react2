"use client";
import {useEffect,useState} from "react";
import {AlertTriangle,CheckCircle2,ChevronRight} from "lucide-react";
import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import Input from "@/composants/ui/Input";
import Select from "@/composants/ui/Select";
import Textarea from "@/composants/ui/Textarea";
import Alert from "@/composants/ui/Alert";
import serviceSignalement from "@/services/ServiceSignalement.js";

const statusStyle={ouvert:"bg-rose-500/10 text-rose-300",en_traitement:"bg-amber-500/10 text-amber-300",escalade:"bg-violet-500/10 text-violet-300",resolu:"bg-emerald-500/10 text-emerald-300",rejete:"bg-slate-700 text-slate-300"};
export default function SignalementsPanel({origin="Commerçant",manager=false,superManager=false}){
 const [items,setItems]=useState([]); const [form,setForm]=useState({type:"autre",deliveryRef:"",description:"",priority:"normale"}); const [message,setMessage]=useState(null);
 async function refresh(){setItems(await serviceSignalement.getAll());} useEffect(()=>{refresh();},[]);
 async function create(){if(!form.description.trim()){setMessage({type:"error",message:"Décrivez le problème avant d'envoyer le signalement."});return;} await serviceSignalement.create({...form,origin});setForm({type:"autre",deliveryRef:"",description:"",priority:"normale"});setMessage({type:"success",message:"Signalement enregistré."});await refresh();}
 async function act(id,status){
   try{
     setMessage(null);
     await serviceSignalement.update(id,status,status==="escalade"?"Dossier transmis pour arbitrage.":"Décision enregistrée.");
     setMessage({type:"success",message:status==="escalade"?"Le signalement a été transmis pour arbitrage.":"La décision a été enregistrée."});
     await refresh();
   }catch(error){
     setMessage({type:"error",message:error?.message||"Impossible de traiter ce signalement."});
   }
 }
 const visible=superManager?items.filter(i=>i.status==="escalade"):manager?items.filter(i=>i.type!=="probleme_paiement"):items.filter(i=>i.origin===origin);
 return <div className="space-y-8"><PageTitle title={manager?"Signalements":superManager?"Arbitrages escaladés":"Mes signalements"} description={manager?"Traitez les problèmes remontés dans votre périmètre.":superManager?"Arbitrez les dossiers transmis par les managers.":"Déclarez un problème et suivez son traitement."}/>{message&&<Alert type={message.type} message={message.message}/>} {!manager&&!superManager&&<Section title="Nouveau signalement"><div className="grid gap-5 md:grid-cols-2"><Select label="Type" name="type" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option value="autre">Autre problème</option>{origin==="Point relais"&&<><option value="probleme_reception_livreur">Problème avec un livreur</option><option value="probleme_livraison_client">Problème avec un client</option></>}{origin==="Commerçant"&&<option value="probleme_paiement">Problème de paiement</option>}</Select><Input label="Référence livraison (optionnelle)" name="deliveryRef" value={form.deliveryRef} onChange={e=>setForm({...form,deliveryRef:e.target.value})} placeholder="LIV-00001"/><Select label="Priorité" name="priority" value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}><option value="normale">Normale</option><option value="haute">Haute</option></Select></div><div className="mt-5"><Textarea label="Description" name="description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Expliquez précisément le problème..."/></div><button onClick={create} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500"><AlertTriangle size={17}/> Envoyer</button></Section>}
 <Section title={`${visible.length} dossier(s)`}><div className="space-y-3">{visible.length===0?<p className="text-sm text-slate-500">Aucun signalement à afficher.</p>:visible.map(item=><article key={item.id} className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><p className="font-black text-slate-100">Signalement #{item.id}</p><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusStyle[item.status]||statusStyle.ouvert}`}>{item.status.replaceAll("_"," ")}</span>{item.priority==="haute"&&<span className="rounded-full bg-rose-500/10 px-2.5 py-1 text-[11px] font-bold text-rose-300">Prioritaire</span>}</div><p className="mt-2 text-xs text-slate-500">{item.origin} · {item.deliveryRef||"Sans livraison"} · {new Date(item.createdAt).toLocaleDateString("fr-FR")}</p></div><ChevronRight size={18} className="text-slate-600"/></div><p className="mt-4 text-sm leading-6 text-slate-300">{item.description}</p>{(manager||superManager)&&!["resolu","rejete"].includes(item.status)&&<div className="mt-4 flex flex-wrap gap-2"><button onClick={()=>act(item.id,"resolu")} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white"><CheckCircle2 size={14}/> Résoudre</button><button onClick={()=>act(item.id,"rejete")} className="rounded-lg border border-slate-600 px-3 py-2 text-xs font-bold text-slate-300">Rejeter</button>{manager&&item.status!=="escalade"&&<button onClick={()=>act(item.id,"escalade")} className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-xs font-bold text-violet-300">Escalader</button>}</div>}</article>)}</div></Section></div>;
}
