"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import Input from "@/composants/ui/Input";
import Select from "@/composants/ui/Select";
import ActionButton from "@/composants/ui/ActionButton";
import {serviceSuperManager} from "@/services/ServiceSuperManager.js";
import {DEPARTEMENTS_FRANCE,REGIONS_FRANCE,VILLES_PRINCIPALES,departementParCode,departementPourVille,codePourDepartement} from "@/donnees/geographieFrance.js";

export default function CreateManagerPage() {
    const router = useRouter();
    const [form, setForm] = useState({firstName:"",lastName:"",email:"",phone:"",city:"",departement:"",sector:"",scopeLevel:"departement",scopeValue:""});
    function update(field,value){setForm(current=>({...current,[field]:value}));}
    function changeCity(city){const dep=departementPourVille(city);setForm(current=>({...current,city,...(dep?{departement:dep.nom}:{})}));}
    async function submit(){await serviceSuperManager.createManager(form);router.push("/supermanager/managers");}
    return <div className="space-y-8"><PageTitle title="Créer un manager" description="Ajouter un gestionnaire avec un périmètre géographique normalisé."/><Section title="Informations manager"><div className="grid gap-4 md:grid-cols-2"><Input label="Prénom" value={form.firstName} onChange={e=>update("firstName",e.target.value)}/><Input label="Nom" value={form.lastName} onChange={e=>update("lastName",e.target.value)}/><Input label="Email" type="email" value={form.email} onChange={e=>update("email",e.target.value)}/><Input label="Téléphone" value={form.phone} onChange={e=>update("phone",e.target.value)}/><label className="space-y-2 text-sm font-medium text-slate-700"><span>Ville</span><input list="create-manager-villes" value={form.city} onChange={e=>changeCity(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5"/><datalist id="create-manager-villes">{VILLES_PRINCIPALES.map(v=><option key={`${v.nom}-${v.departementCode}`} value={v.nom} label={`${v.departementCode} - ${departementParCode(v.departementCode)?.nom||''}`}/>)}</datalist></label><Select label="Département" value={codePourDepartement(form.departement)} onChange={e=>update("departement",departementParCode(e.target.value)?.nom||"")}><option value="">Sélectionner</option>{DEPARTEMENTS_FRANCE.map(d=><option key={d.code} value={d.code}>{d.code} - {d.nom}</option>)}</Select><Input label="Secteur" placeholder="Ex : Béziers centre" value={form.sector} onChange={e=>update("sector",e.target.value)}/><Select label="Niveau du périmètre" value={form.scopeLevel} onChange={e=>setForm({...form,scopeLevel:e.target.value,scopeValue:""})}><option value="ville">Ville</option><option value="departement">Département</option><option value="region">Région</option><option value="pays">Pays</option></Select>{form.scopeLevel==='ville'&&<label className="space-y-2 text-sm font-medium text-slate-700"><span>Ville du périmètre</span><input required list="create-manager-villes" value={form.scopeValue} onChange={e=>update("scopeValue",e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5"/></label>}{form.scopeLevel==='departement'&&<Select label="Département du périmètre" value={codePourDepartement(form.scopeValue)} onChange={e=>update("scopeValue",departementParCode(e.target.value)?.nom||"")} required><option value="">Sélectionner</option>{DEPARTEMENTS_FRANCE.map(d=><option key={d.code} value={d.code}>{d.code} - {d.nom}</option>)}</Select>}{form.scopeLevel==='region'&&<Select label="Région du périmètre" value={form.scopeValue} onChange={e=>update("scopeValue",e.target.value)} required><option value="">Sélectionner</option>{REGIONS_FRANCE.map(r=><option key={r} value={r}>{r}</option>)}</Select>}<div className="md:col-span-2"><ActionButton color="blue" onClick={submit}>Créer le manager</ActionButton></div></div></Section></div>;
}
