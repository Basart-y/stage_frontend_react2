"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {useParams} from "next/navigation";
import {ArrowLeft} from "lucide-react";
import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import Loading from "@/composants/ui/Loading";
import Alert from "@/composants/ui/Alert";
import {serviceAdministration} from "@/services/ServiceAdministration.js";

const label={invite:"Invitation envoyée",actif:"Actif",suspendu:"Suspendu"};
export default function Page(){
 const {id}=useParams(); const [user,setUser]=useState(null); const [loading,setLoading]=useState(true); const [feedback,setFeedback]=useState(null);
 useEffect(()=>{serviceAdministration.getUser(id).then(setUser).catch(e=>setFeedback({type:"error",message:e.message})).finally(()=>setLoading(false));},[id]);
 async function toggle(){try{const updated=await serviceAdministration.setStatus(id,user.statutCompte==='actif'?'suspendu':'actif');setUser(updated);setFeedback({type:"success",message:updated.statutCompte==='actif'?"Compte réactivé.":"Compte suspendu."});}catch(e){setFeedback({type:"error",message:e.message});}}
 if(loading)return <Loading message="Chargement du compte…"/>;
 if(!user)return <div className="space-y-4"><Link href="/manager/demandes-commerces" className="text-blue-300 underline">Retour</Link>{feedback&&<Alert type={feedback.type} message={feedback.message}/>}</div>;
 const p=user.profile||{};
 return <div className="space-y-8"><div><Link href="/manager/demandes-commerces" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-300"><ArrowLeft size={16}/> Retour aux commerçants</Link><PageTitle title={user.name} description="Compte commerçant dans votre périmètre."/></div>{feedback&&<Alert type={feedback.type} message={feedback.message}/>}<div className="grid gap-6 lg:grid-cols-2"><Section title="Commerce"><Info label="Raison sociale" value={p.raisonSociale||user.name}/><Info label="Ville" value={p.ville}/><Info label="Département" value={p.departement}/><Info label="Adresse" value={p.adresse}/></Section><Section title="Compte"><Info label="Email" value={user.email}/><Info label="Téléphone" value={p.telephone}/><Info label="Statut" value={label[user.statutCompte]||user.statutCompte}/><Info label="Créé le" value={user.dateCreation?new Date(user.dateCreation).toLocaleString('fr-FR'):''}/></Section></div>{user.statutCompte!=='invite'&&<button onClick={toggle} className={user.statutCompte==='actif'?"rounded-xl bg-red-600 px-4 py-2.5 font-semibold text-white":"rounded-xl bg-emerald-600 px-4 py-2.5 font-semibold text-white"}>{user.statutCompte==='actif'?"Suspendre le compte":"Réactiver le compte"}</button>}</div>
}
function Info({label,value}){return <div className="flex justify-between gap-6 border-b border-slate-800 py-3 text-sm"><span className="text-slate-500">{label}</span><span className="text-right font-medium text-slate-100">{value||"—"}</span></div>}
