"use client";

import {useEffect, useMemo, useState} from "react";
import PageTitle from "@/composants/ui/PageTitle";
import Alert from "@/composants/ui/Alert";
import Loading from "@/composants/ui/Loading";
import TableauDonnees from "@/composants/table/TableauDonnees.jsx";
import {serviceSuperManager} from "@/services/ServiceSuperManager.js";

const statusLabel = {invite:"Invitation envoyée", actif:"Actif", suspendu:"Suspendu"};

export default function FinanceManagersPage(){
  const [rows,setRows]=useState([]), [open,setOpen]=useState(false), [busy,setBusy]=useState(false), [loading,setLoading]=useState(true);
  const [feedback,setFeedback]=useState(null), [activationUrl,setActivationUrl]=useState("");
  const [form,setForm]=useState({firstName:"",lastName:"",email:"",phone:""});
  async function load(){setLoading(true);try{setRows(await serviceSuperManager.getFinanceManagers())}catch(e){setFeedback({type:"error",message:e.message||"Chargement impossible."})}finally{setLoading(false)}}
  useEffect(()=>{load()},[]);
  const activeCount=useMemo(()=>rows.filter(r=>r.statutCompte==='actif').length,[rows]);
  async function submit(e){e.preventDefault();setBusy(true);setFeedback(null);setActivationUrl("");try{const r=await serviceSuperManager.createFinanceManager(form);setActivationUrl(r.activationUrl||"");setFeedback({type:"success",message:"Gestionnaire financier invité. Il doit définir son mot de passe via le lien d’activation."});setForm({firstName:"",lastName:"",email:"",phone:""});await load()}catch(err){setFeedback({type:"error",message:err.message||"Invitation impossible."})}finally{setBusy(false)}}
  async function toggle(row){if(row.statutCompte==='invite')return;try{const u=await serviceSuperManager.updateStatus(row.id,row.statutCompte==='actif'?'SUSPENDED':'ACTIVE');setRows(x=>x.map(i=>i.id===row.id?u:i))}catch(e){setFeedback({type:"error",message:e.message||"Modification impossible."})}}
  return <div className="space-y-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><PageTitle title="Gestionnaires financiers" description="Créez, invitez, suspendez ou réactivez les comptes chargés de la facturation et des bons de paiement."/><button onClick={()=>setOpen(v=>!v)} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white">{open?"Fermer":"Créer un gestionnaire financier"}</button></div>
    <div className="grid gap-4 sm:grid-cols-3"><Summary label="Total" value={rows.length}/><Summary label="Actifs" value={activeCount}/><Summary label="À activer" value={rows.filter(r=>r.statutCompte==='invite').length}/></div>
    {feedback&&<Alert type={feedback.type} message={feedback.message}/>} 
    {open&&<form onSubmit={submit} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2">
      <Field label="Prénom" value={form.firstName} onChange={v=>setForm({...form,firstName:v})}/><Field label="Nom" value={form.lastName} onChange={v=>setForm({...form,lastName:v})}/><Field label="Email" type="email" required value={form.email} onChange={v=>setForm({...form,email:v})}/><Field label="Téléphone" value={form.phone} onChange={v=>setForm({...form,phone:v})}/>
      <div className="md:col-span-2"><p className="mb-3 text-sm text-slate-600">Ce rôle n’a pas de périmètre géographique : il accède à la partie Finance selon ses autorisations.</p><button disabled={busy} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy?"Création…":"Envoyer l’invitation"}</button></div>
      {activationUrl&&<div className="md:col-span-2 rounded-xl border border-amber-700/50 bg-amber-500/10 p-4"><p className="text-sm font-semibold">Lien d’activation</p><p className="mt-2 break-all text-xs">{activationUrl}</p><button type="button" onClick={()=>navigator.clipboard.writeText(activationUrl)} className="mt-3 text-sm font-semibold text-blue-700 underline">Copier le lien</button></div>}
    </form>}
    {loading?<Loading message="Chargement…"/>:<TableauDonnees columns={[{key:"name",label:"Gestionnaire financier"},{key:"email",label:"Email"},{key:"status",label:"Statut",render:r=>statusLabel[r.statutCompte]||r.statutCompte},{key:"actions",label:"Actions",render:r=>r.statutCompte==='invite'?<span className="text-xs text-slate-600">Activation en attente</span>:<button onClick={()=>toggle(r)} className="font-semibold text-indigo-700 underline">{r.statutCompte==='actif'?"Suspendre":"Réactiver"}</button>}]} data={rows} emptyMessage="Aucun gestionnaire financier."/>}
  </div>
}
function Field({label,type="text",value,onChange,required=false}){return <label className="space-y-2 text-sm font-medium text-slate-700"><span>{label}</span><input type={type} required={required} value={value} onChange={e=>onChange(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5"/></label>}
function Summary({label,value}){return <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-600">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>}
