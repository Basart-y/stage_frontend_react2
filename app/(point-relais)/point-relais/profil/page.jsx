"use client";

import {useEffect, useState} from "react";
import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import Input from "@/composants/ui/Input";
import Select from "@/composants/ui/Select";
import {servicePointRelais} from "@/services/ServicePointRelais.js";
import {apiRequest} from "@/services/api.js";
import {DEPARTEMENTS_FRANCE,departementParCode,codePourDepartement,departementPourVille} from "@/donnees/geographieFrance.js";

const statuses=[
 {value:"ouvert",label:"Ouvert"},{value:"vacances",label:"Vacances"},{value:"travaux",label:"Travaux"},{value:"fermeture_exceptionnelle",label:"Fermeture exceptionnelle"},{value:"autre",label:"Autre"}
];
export default function PointRelaisProfilPage(){
 const [form,setForm]=useState(null); const [saved,setSaved]=useState(false);
 const [locating,setLocating]=useState(false); const [locationMessage,setLocationMessage]=useState(""); const [locationError,setLocationError]=useState("");
 useEffect(()=>{servicePointRelais.getMyProfile().then(setForm)},[]);
 function change(field,value){setForm(p=>({...p,[field]:value}));setSaved(false); if(["relayAddress","relayCity","postalCode","department"].includes(field)){setLocationMessage("");setLocationError("")}}
 function hour(index,field,value){setForm(p=>({...p,hours:p.hours.map((h,i)=>i===index?{...h,[field]:value}:h)}));setSaved(false)}
 async function locateFromAddress(){
  setLocating(true); setLocationMessage(""); setLocationError("");
  try{
   const result=await apiRequest('/api/v1/geocoding/address',{method:'POST',body:JSON.stringify({address:form.relayAddress,city:form.relayCity,postalCode:form.postalCode,department:form.department})});
   setForm(p=>({...p,latitude:result.data.latitude,longitude:result.data.longitude}));
   setLocationMessage("Coordonnées calculées depuis l’adresse. Vous pouvez encore les corriger manuellement.");
   setSaved(false);
  }catch(error){setLocationError(error.message||"Impossible de localiser cette adresse.")}
  finally{setLocating(false)}
 }
 async function submit(e){e.preventDefault();await servicePointRelais.saveMyProfile(form);setSaved(true)}
 if(!form)return <p className="text-sm text-slate-600">Chargement...</p>;
 return <div className="space-y-8"><PageTitle title="Mon point relais" description="Gérez les informations visibles, la capacité, le statut opérationnel et les horaires d'ouverture."/>
 <form onSubmit={submit} className="space-y-8">
 <Section title="Informations du relais"><div className="grid gap-5 md:grid-cols-2"><Input label="Nom" value={form.relayName} onChange={e=>change("relayName",e.target.value)}/><Input label="Adresse" value={form.relayAddress} onChange={e=>change("relayAddress",e.target.value)}/><Input label="Code postal" value={form.postalCode||""} onChange={e=>change("postalCode",e.target.value)}/><Input label="Ville" value={form.relayCity} onChange={e=>{const ville=e.target.value;change("relayCity",ville);const dep=departementPourVille(ville);if(dep)change("department",dep.nom)}}/><Select label="Département" value={codePourDepartement(form.department)} onChange={e=>change("department",departementParCode(e.target.value)?.nom||"")}><option value="">Sélectionner</option>{DEPARTEMENTS_FRANCE.map(d=><option key={d.code} value={d.code}>{d.code} - {d.nom}</option>)}</Select><Input label="Capacité de stockage" type="number" min="1" value={form.capacity} onChange={e=>change("capacity",Number(e.target.value))}/><Select label="Statut opérationnel" value={form.operationalStatus} onChange={e=>change("operationalStatus",e.target.value)}>{statuses.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}</Select></div></Section>
 <Section title="Position sur la carte" description="Les coordonnées peuvent être calculées depuis l’adresse, puis corrigées manuellement si le marqueur n’est pas placé exactement au bon endroit."><div className="space-y-4"><button type="button" onClick={locateFromAddress} disabled={locating} className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-700 hover:bg-indigo-100 disabled:cursor-wait disabled:opacity-60">{locating?"Localisation en cours…":"Calculer depuis l’adresse"}</button>{locationMessage&&<p className="text-sm font-semibold text-emerald-700">{locationMessage}</p>}{locationError&&<p className="text-sm font-semibold text-red-700">{locationError}</p>}<div className="grid gap-5 md:grid-cols-2"><Input label="Latitude" type="number" step="any" value={form.latitude} onChange={e=>change("latitude",Number(e.target.value))}/><Input label="Longitude" type="number" step="any" value={form.longitude} onChange={e=>change("longitude",Number(e.target.value))}/></div></div></Section>
 <Section title="Horaires d'ouverture" description="Définissez les horaires utilisés par les commerçants lors de la recherche d'un relais."><div className="space-y-3">{form.hours.map((h,i)=><div key={h.day} className="grid items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[120px_1fr_1fr_auto]"><p className="text-sm font-bold text-slate-700">{h.day}</p><Input aria-label={`Ouverture ${h.day}`} type="time" value={h.open} disabled={h.closed} onChange={e=>hour(i,"open",e.target.value)}/><Input aria-label={`Fermeture ${h.day}`} type="time" value={h.close} disabled={h.closed} onChange={e=>hour(i,"close",e.target.value)}/><label className="flex items-center gap-2 text-xs font-bold text-slate-600"><input type="checkbox" checked={h.closed} onChange={e=>hour(i,"closed",e.target.checked)} className="h-4 w-4"/> Fermé</label></div>)}</div></Section>
 <div className="flex items-center justify-end gap-4">{saved&&<span className="text-sm font-bold text-indigo-700">Modifications enregistrées</span>}<button className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700">Enregistrer</button></div>
 </form></div>
}
