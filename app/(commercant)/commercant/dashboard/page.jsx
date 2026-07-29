"use client";

import Link from "next/link";
import {useEffect, useState} from "react";
import {ArrowRight, CheckCircle2, MapPin, Package, Truck} from "lucide-react";
import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import GrillesStatistiques from "@/composants/TableauDeBord/GrillesStatistiques.jsx";
import ActionsRapides from "@/composants/TableauDeBord/ActionsRapides.jsx";
import serviceLivraison from "@/services/ServiceLivraison.js";

const actions = [
    {label: "Créer une livraison", description: "Planifier un nouvel envoi vers un point relais", href: "/commercant/planification"},
    {label: "Trouver un point relais", description: "Comparer les relais disponibles autour du client", href: "/commercant/points-relais"},
    {label: "Suivre mes colis", description: "Consulter l'état et l'historique des expéditions", href: "/commercant/livraisons"},
];

const statusIcon = (status) => status?.toLowerCase().includes("retir") ? CheckCircle2 : status?.toLowerCase().includes("transit") ? Truck : Package;

export default function Dashboard() {
    const [deliveries, setDeliveries] = useState([]);
    useEffect(() => { serviceLivraison.getMyDeliveries().then(setDeliveries).catch(() => setDeliveries([])); }, []);
    const inProgress = deliveries.filter((item) => !["Retiré", "Retourné", "Refusée"].includes(item.status)).length;
    const stats = [
        {label: "Livraisons actives", value: inProgress},
        {label: "Total expéditions", value: deliveries.length},
        {label: "Abonnement", value: "PRO"},
        {label: "Quota mensuel", value: "34 / 100"},
    ];
    const recent = [...deliveries].slice(-4).reverse();

    return <div className="space-y-8">
        <PageTitle title="Bonjour, votre réseau est prêt." description="Pilotez vos expéditions depuis un seul espace : création, sélection du relais, suivi et retours." actions={<Link href="/commercant/planification" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700">Nouvel envoi <ArrowRight size={16}/></Link>}/>
        <GrillesStatistiques stats={stats}/>
        <div>
            <Section title="Activité récente" description="Les dernières opérations enregistrées dans votre espace.">
                <div className="space-y-1">{recent.length ? recent.map((delivery) => {
                    const Icon = statusIcon(delivery.status);
                    return <Link href={`/commercant/livraisons/${delivery.id}`} key={delivery.id} className="group flex items-center gap-4 rounded-2xl px-3 py-3 transition hover:bg-slate-900/60">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300"><Icon size={17}/></span>
                        <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="truncate text-sm font-bold text-slate-100">{delivery.reference}</p><span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">{delivery.status}</span></div><p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-500"><MapPin size={12}/>{delivery.relayPoint || delivery.relayName || "Point relais"}</p></div>
                        <ArrowRight size={15} className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-400"/>
                    </Link>;
                }) : <p className="py-8 text-center text-sm text-slate-500">Créez une première livraison pour alimenter l'activité.</p>}</div>
            </Section>
        </div>
        <div><div className="mb-4 flex items-end justify-between"><div><p className="rf-kicker">Raccourcis</p><h2 className="mt-1 text-lg font-black tracking-tight text-slate-50">Actions principales</h2></div></div><ActionsRapides actions={actions}/></div>
    </div>;
}
