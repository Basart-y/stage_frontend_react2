"use client";

import {useEffect, useState} from "react";
import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import Input from "@/composants/ui/Input";
import Select from "@/composants/ui/Select";
import {servicePointRelais} from "@/services/ServicePointRelais.js";

const statuses=[
 {value:"ouvert",label:"Ouvert"},{value:"vacances",label:"Vacances"},{value:"travaux",label:"Travaux"},{value:"fermeture_exceptionnelle",label:"Fermeture exceptionnelle"},{value:"autre",label:"Autre"}
];
export default function PointRelaisProfilPage(){
 const [form,setForm]=useState(null); const [saved,setSaved]=useState(false);
 useEffect(()=>{servicePointRelais.getMyProfile().then(setForm)},[]);
 function change(field,value){setForm(p=>({...p,[field]:value}));setSaved(false)}
 function hour(index,field,value){setForm(p=>({...p,hours:p.hours.map((h,i)=>i===index?{...h,[field]:value}:h)}));setSaved(false)}
 async function submit(e){e.preventDefault();await servicePointRelais.saveMyProfile(form);setSaved(true)}
 if(!form)return <p className="text-sm text-slate-500">Chargement...</p>;
 return <div className="space-y-8"><PageTitle title="Mon point relais" description="Gérez les informations visibles, la capacité, le statut opérationnel et les horaires d'ouverture."/>
 <form onSubmit={submit} className="space-y-8">
 <Section title="Informations du relais"><div className="grid gap-5 md:grid-cols-2"><Input label="Nom" value={form.relayName} onChange={e=>change("relayName",e.target.value)}/><Input label="Adresse" value={form.relayAddress} onChange={e=>change("relayAddress",e.target.value)}/><Input label="Ville" value={form.relayCity} onChange={e=>change("relayCity",e.target.value)}/><Input label="Département" value={form.department} onChange={e=>change("department",e.target.value)}/><Input label="Capacité de stockage" type="number" min="1" value={form.capacity} onChange={e=>change("capacity",Number(e.target.value))}/><Select label="Statut opérationnel" value={form.operationalStatus} onChange={e=>change("operationalStatus",e.target.value)}>{statuses.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}</Select></div></Section>
 <Section title="Coordonnées"><div className="grid gap-5 md:grid-cols-2"><Input label="Latitude" type="number" step="any" value={form.latitude} onChange={e=>change("latitude",Number(e.target.value))}/><Input label="Longitude" type="number" step="any" value={form.longitude} onChange={e=>change("longitude",Number(e.target.value))}/></div></Section>
 <Section title="Horaires d'ouverture" description="Définissez les horaires utilisés par les commerçants lors de la recherche d'un relais."><div className="space-y-3">{form.hours.map((h,i)=><div key={h.day} className="grid items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/30 p-4 sm:grid-cols-[120px_1fr_1fr_auto]"><p className="text-sm font-bold text-slate-200">{h.day}</p><Input aria-label={`Ouverture ${h.day}`} type="time" value={h.open} disabled={h.closed} onChange={e=>hour(i,"open",e.target.value)}/><Input aria-label={`Fermeture ${h.day}`} type="time" value={h.close} disabled={h.closed} onChange={e=>hour(i,"close",e.target.value)}/><label className="flex items-center gap-2 text-xs font-bold text-slate-400"><input type="checkbox" checked={h.closed} onChange={e=>hour(i,"closed",e.target.checked)} className="h-4 w-4"/> Fermé</label></div>)}</div></Section>
 <div className="flex items-center justify-end gap-4">{saved&&<span className="text-sm font-bold text-emerald-400">Modifications enregistrées</span>}<button className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-500">Enregistrer</button></div>
 </form></div>
}
