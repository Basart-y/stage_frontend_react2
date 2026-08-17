"use client";
import {useEffect,useMemo,useState} from "react";
import {useRouter} from "next/navigation";
import {Download,Search} from "lucide-react";
import PageTitle from "@/composants/ui/PageTitle";
import TableauDonnees from "@/composants/table/TableauDonnees.jsx";
import {serviceLivraison} from "@/services/ServiceLivraison.js";

function dateValue(d){return d.receivedAt||d.handedOffAt||d.updatedAt||d.createdAt||d.date||""}
function csvCell(v){return `"${String(v??"").replaceAll('"','""')}"`}

export default function SuiviColisPage(){
 const [items,setItems]=useState([]),[query,setQuery]=useState(""),[status,setStatus]=useState("Tous"),[from,setFrom]=useState(""),[to,setTo]=useState(""); const router=useRouter();
 useEffect(()=>{serviceLivraison.getForRelay().then(setItems).catch(()=>setItems([]))},[]);
 const statuses=useMemo(()=>["Tous",...new Set(items.map(x=>x.status).filter(Boolean))],[items]);
 const filtered=useMemo(()=>items.filter(d=>{
   const text=`${d.reference} ${d.client?.firstName||""} ${d.client?.lastName||""} ${d.status||""} ${d.merchantName||d.merchant||""}`.toLowerCase();
   if(query&&!text.includes(query.toLowerCase()))return false;
   if(status!=="Tous"&&d.status!==status)return false;
   const raw=dateValue(d); if((from||to)&&raw){const dt=new Date(raw);if(!Number.isNaN(dt.getTime())){if(from&&dt<new Date(`${from}T00:00:00`))return false;if(to&&dt>new Date(`${to}T23:59:59`))return false;}}
   return true;
 }),[items,query,status,from,to]);
 function exportCsv(){const rows=[["Référence","Client","Commerçant","Statut","Réception","Remise","Point relais"],...filtered.map(d=>[d.reference,`${d.client?.firstName||""} ${d.client?.lastName||""}`.trim(),d.merchantName||d.merchant||"",d.status||"",d.receivedAt||"",d.handedOffAt||"",d.relayPoint||d.relayName||""])];const blob=new Blob(["\ufeff"+rows.map(r=>r.map(csvCell).join(";")).join("\n")],{type:"text/csv;charset=utf-8"});const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`historique-colis-relais-${new Date().toISOString().slice(0,10)}.csv`;a.click();URL.revokeObjectURL(url)}
 return <div className="space-y-8"><PageTitle title="Historique et export des colis" description="Consultez tous les colis liés à votre relais, ouvrez leur détail et exportez la sélection filtrée en CSV."/>
 <div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5"><label className="relative xl:col-span-2"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Référence, client, commerçant..." className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm"/></label><select value={status} onChange={e=>setStatus(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm">{statuses.map(s=><option key={s}>{s}</option>)}</select><input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"/><input type="date" value={to} onChange={e=>setTo(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"/></div><div className="mt-3 flex items-center justify-between gap-3"><p className="text-sm text-slate-600">{filtered.length} colis affiché(s)</p><button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white"><Download size={16}/> Exporter le CSV</button></div></div>
 <TableauDonnees columns={[{key:"reference",label:"Référence"},{key:"client",label:"Client",render:r=>`${r.client?.firstName||""} ${r.client?.lastName||""}`.trim()||"—"},{key:"merchant",label:"Commerçant",render:r=>r.merchantName||r.merchant||"—"},{key:"status",label:"Statut"},{key:"receivedAt",label:"Réception",render:r=>r.receivedAt?new Date(r.receivedAt).toLocaleDateString("fr-FR"):"—"},{key:"actions",label:"Action",render:r=><button onClick={()=>router.push(`/point-relais/suivi/${r.id}`)} className="text-sm font-bold text-blue-700">Voir détail</button>}]} data={filtered} emptyMessage="Aucun colis trouvé."/>
 </div>
}
