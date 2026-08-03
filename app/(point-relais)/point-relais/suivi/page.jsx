"use client";
import {useEffect,useMemo,useState} from "react";
import {useRouter} from "next/navigation";
import PageTitle from "@/composants/ui/PageTitle";
import TableauDonnees from "@/composants/table/TableauDonnees.jsx";
import {serviceLivraison} from "@/services/ServiceLivraison.js";

export default function SuiviColisPage(){
 const [items,setItems]=useState([]); const [query,setQuery]=useState(""); const router=useRouter();
 useEffect(()=>{serviceLivraison.getForRelay().then(setItems).catch(()=>setItems([]))},[]);
 const filtered=useMemo(()=>items.filter(d=>`${d.reference} ${d.client?.firstName||""} ${d.client?.lastName||""} ${d.status}`.toLowerCase().includes(query.toLowerCase())),[items,query]);
 return <div className="space-y-8"><PageTitle title="Suivi des colis" description="Consultez les colis du relais et leur dernier état connu."/>
 <div className="max-w-md"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Référence, client, statut..." className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-950 outline-none focus:border-blue-500"/></div>
 <TableauDonnees columns={[{key:"reference",label:"Référence"},{key:"client",label:"Client",render:r=>`${r.client?.firstName||""} ${r.client?.lastName||""}`.trim()||"—"},{key:"relayPoint",label:"Point relais",render:r=>r.relayPoint||r.relayName||"—"},{key:"status",label:"Statut"},{key:"actions",label:"Action",render:r=><button onClick={()=>router.push(`/point-relais/suivi/${r.id}`)} className="text-sm font-bold text-blue-700 hover:text-blue-700">Voir détail</button>}]} data={filtered} emptyMessage="Aucun colis trouvé."/>
 </div>
}
