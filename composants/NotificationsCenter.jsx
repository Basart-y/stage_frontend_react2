"use client";

import {useEffect, useMemo, useState} from "react";
import {Bell, CheckCheck, CircleAlert, PackageCheck} from "lucide-react";
import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import {serviceNotification} from "@/services/ServiceNotification.js";

function isRead(item){ return Boolean(item.read ?? item.readAt ?? ((item.readBy||[]).length)); }
function normalizedType(item){ return String(item.type||"").toLowerCase(); }

export default function NotificationsCenter({userId = 1}) {
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState("all");
    const load = () => serviceNotification.getNotifications(userId).then(setItems).catch(()=>{});

    useEffect(() => { load(); }, [userId]);

    const visible = useMemo(() => items.filter((item) => {
        if(filter === "all") return true;
        if(filter === "unread") return !isRead(item);
        if(filter === "livraison") return normalizedType(item).includes("livraison") || normalizedType(item).includes("etat");
        if(filter === "urgence") return normalizedType(item).includes("urgence");
        return normalizedType(item) === filter;
    }), [items, filter]);
    const unread = items.filter((item) => !isRead(item)).length;

    async function markAll(){ await serviceNotification.markAllAsRead(userId); load(); }
    async function markOne(id){ await serviceNotification.markAsRead(id); load(); }

    return <div className="space-y-8">
        <PageTitle title="Notifications" description="Retrouvez les événements importants liés aux livraisons, retours et incidents."/>
        <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Non lues" value={unread} icon={Bell}/><Stat label="Total" value={items.length} icon={PackageCheck}/><Stat label="Urgentes" value={items.filter(i=>normalizedType(i).includes("urgence")).length} icon={CircleAlert}/>
        </div>
        <Section title="Centre de notifications" description="Les notifications sont enregistrées pour rester disponibles après reconnexion.">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">{[["all","Toutes"],["unread","Non lues"],["livraison","Livraisons"],["urgence","Urgences"]].map(([key,label])=><button key={key} onClick={()=>setFilter(key)} className={`rounded-xl px-3 py-2 text-xs font-bold ${filter===key?"bg-blue-500/15 text-blue-700":"border border-slate-200 text-slate-600 hover:text-slate-950"}`}>{label}</button>)}</div>
                <button onClick={markAll} disabled={!unread} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-40"><CheckCheck size={15}/> Tout marquer comme lu</button>
            </div>
            <div className="space-y-3">{visible.length?visible.map(item=><button key={item.id} onClick={()=>!isRead(item)&&markOne(item.id)} className={`w-full rounded-2xl border p-4 text-left transition ${isRead(item)?"border-slate-200 bg-slate-50":"border-blue-500/20 bg-blue-500/5 hover:bg-indigo-700/10"}`}><div className="flex items-start justify-between gap-4"><div><p className="font-bold text-slate-900">{item.title||item.titre||"Notification"}</p><p className="mt-1 text-sm leading-6 text-slate-600">{item.message||item.content||item.contenu||""}</p></div>{!isRead(item)&&<span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-400"/>}</div></button>):<p className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-600">Aucune notification dans cette catégorie.</p>}</div>
        </Section>
    </div>;
}

function Stat({label,value,icon:Icon}){return <div className="rf-panel p-5"><Icon size={19} className="text-blue-700"/><p className="mt-3 text-2xl font-black text-slate-950">{value}</p><p className="mt-1 text-sm text-slate-600">{label}</p></div>}
