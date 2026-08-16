"use client";

import {useEffect, useMemo, useState} from "react";
import PageTitle from "@/composants/ui/PageTitle";
import Alert from "@/composants/ui/Alert";
import Loading from "@/composants/ui/Loading";
import TableauDonnees from "@/composants/table/TableauDonnees.jsx";
import {serviceSuperManager} from "@/services/ServiceSuperManager.js";

const statusLabel = {invite: "Invitation envoyée", actif: "Actif", suspendu: "Suspendu"};

export default function ManagersPage() {
    const [managers, setManagers] = useState([]);
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [activationUrl, setActivationUrl] = useState("");
    const [form, setForm] = useState({firstName:"", lastName:"", email:"", phone:"", city:"", departement:"", scopeLevel:"departement", scopeValue:""});
    const [loading, setLoading] = useState(true);

    async function load(){
        setLoading(true);
        try {
            const result = await serviceSuperManager.getManagers();
            setManagers(Array.isArray(result) ? result : []);
        }
        catch(error){ setFeedback({type:"error", message:error.message || "Impossible de charger les gestionnaires."}); }
        finally { setLoading(false); }
    }
    useEffect(()=>{load();},[]);

    const managerList = Array.isArray(managers) ? managers : [];
    const activeCount = useMemo(()=>managerList.filter(m=>m.statutCompte==='actif').length,[managerList]);

    async function submit(event){
        event.preventDefault(); setBusy(true); setFeedback(null); setActivationUrl("");
        try {
            const result = await serviceSuperManager.createManager({...form, scopeValue: form.scopeLevel === 'pays' ? '' : form.scopeValue});
            setActivationUrl(result.activationUrl || '');
            setFeedback({type:"success", message:"Gestionnaire invité avec son périmètre. Il devra définir son mot de passe avant de se connecter."});
            setForm({firstName:"", lastName:"", email:"", phone:"", city:"", departement:"", scopeLevel:"departement", scopeValue:""});
            await load();
        } catch(error){ setFeedback({type:"error", message:error.message || "Impossible de créer le gestionnaire."}); }
        finally {setBusy(false);}
    }

    async function toggle(row){
        if(row.statutCompte==='invite') return;
        try {
            const updated = await serviceSuperManager.updateStatus(row.id, row.statutCompte==='actif'?'SUSPENDED':'ACTIVE');
            setManagers(current=>current.map(item=>item.id===row.id?updated:item));
            setFeedback({type:"success", message: updated.statutCompte==='actif'?"Gestionnaire réactivé.":"Gestionnaire suspendu."});
        } catch(error){setFeedback({type:"error", message:error.message || "Modification impossible."});}
    }

    return <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <PageTitle title="Gestion des managers" description="Créez les Gestionnaires et définissez leur périmètre ville, département, région ou pays."/>
            <button onClick={()=>setOpen(v=>!v)} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">{open?"Fermer":"Créer un accès gestionnaire"}</button>
        </div>
        <div className="grid gap-4 sm:grid-cols-3"><Summary label="Total" value={managerList.length}/><Summary label="Actifs" value={activeCount}/><Summary label="À activer" value={managerList.filter(m=>m.statutCompte==='invite').length}/></div>
        {feedback&&<Alert type={feedback.type} message={feedback.message}/>} 
        {open&&<form onSubmit={submit} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2">
            <div className="md:col-span-2"><h2 className="text-lg font-bold text-slate-950">Nouveau Gestionnaire</h2><p className="mt-1 text-sm text-slate-600">Le périmètre est appliqué par le serveur à toutes ses listes administratives.</p></div>
            <Field label="Prénom" value={form.firstName} onChange={v=>setForm({...form,firstName:v})}/><Field label="Nom" value={form.lastName} onChange={v=>setForm({...form,lastName:v})}/>
            <Field label="Email" type="email" required value={form.email} onChange={v=>setForm({...form,email:v})}/><Field label="Téléphone" value={form.phone} onChange={v=>setForm({...form,phone:v})}/>
            <Field label="Ville" value={form.city} onChange={v=>setForm({...form,city:v})}/><Field label="Département" value={form.departement} onChange={v=>setForm({...form,departement:v})}/>
            <label className="space-y-2 text-sm font-medium text-slate-700"><span>Niveau du périmètre</span><select value={form.scopeLevel} onChange={e=>setForm({...form,scopeLevel:e.target.value,scopeValue:""})} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5"><option value="ville">Ville</option><option value="departement">Département</option><option value="region">Région</option><option value="pays">Pays</option></select></label>
            {form.scopeLevel!=='pays'&&<Field label={form.scopeLevel==='ville'?"Ville du périmètre":form.scopeLevel==='region'?"Région du périmètre":"Département du périmètre"} required value={form.scopeValue} onChange={v=>setForm({...form,scopeValue:v})}/>} 
            <div className="md:col-span-2"><button disabled={busy} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy?"Création…":"Créer l’invitation"}</button></div>
            {activationUrl&&<div className="md:col-span-2 rounded-xl border border-amber-700/50 bg-amber-500/10 p-4"><p className="text-sm font-semibold text-amber-900">Lien d’activation temporaire</p><p className="mt-2 break-all text-xs text-slate-700">{activationUrl}</p><button type="button" onClick={()=>navigator.clipboard.writeText(activationUrl)} className="mt-3 text-sm font-semibold text-blue-700 underline">Copier le lien</button></div>}
        </form>}
        {loading?<Loading message="Chargement des gestionnaires…"/>:<TableauDonnees columns={[
            {key:"name",label:"Gestionnaire"},{key:"email",label:"Email"},
            {key:"scope",label:"Périmètre",render:row=>row.scope?.niveau==='pays'?"France":row.scope?`${row.scope.niveau} : ${row.scope.valeur}`:"—"},
            {key:"status",label:"Statut",render:row=>statusLabel[row.statutCompte]||row.statutCompte},
            {key:"actions",label:"Actions",render:row=>row.statutCompte==='invite'?<span className="text-xs text-slate-600">Activation en attente</span>:<button onClick={()=>toggle(row)} className={row.statutCompte==='actif'?"font-semibold text-red-700 underline":"font-semibold text-indigo-700 underline"}>{row.statutCompte==='actif'?"Suspendre":"Réactiver"}</button>}
        ]} data={managerList} emptyMessage="Aucun gestionnaire créé."/>}
    </div>;
}

function Field({label,type="text",value,onChange,required=false}){return <label className="space-y-2 text-sm font-medium text-slate-700"><span>{label}</span><input type={type} required={required} value={value} onChange={e=>onChange(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500"/></label>}
function Summary({label,value}){return <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-600">{label}</p><p className="mt-2 text-2xl font-bold text-slate-950">{value}</p></div>}
