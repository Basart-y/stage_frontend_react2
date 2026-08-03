"use client";

import Link from "next/link";
import {useEffect, useMemo, useState} from "react";
import {Command, LogOut, Search, X} from "lucide-react";
import NotificationBell from "@/composants/ui/NotificationBell";
import {serviceAuthentification} from "@/services/ServiceAuthentification.js";

const links = [
    {label: "Tableau de bord commerçant", href: "/commercant/dashboard"},
    {label: "Créer une livraison", href: "/commercant/planification"},
    {label: "Mes livraisons", href: "/commercant/livraisons"},
    {label: "Points relais", href: "/commercant/points-relais"},
    {label: "Réception colis", href: "/point-relais/reception"},
    {label: "Remise client", href: "/point-relais/retrait"},
    {label: "Demandes commerçants", href: "/manager/demandes-commerces"},
    {label: "Tableau de bord manager", href: "/manager/dashboard"},
    {label: "Tableau de bord super gestionnaire", href: "/supermanager/dashboard"},
    {label: "Signalements manager", href: "/manager/signalements"},
    {label: "Gestion financière", href: "/finance/dashboard"},
    {label: "Factures commerçants", href: "/finance/factures"},
    {label: "Paiements points relais", href: "/finance/paiements"},
];

export default function UserHeader({userId = 1, role = "Utilisateur"}) {
    const [paletteOpen, setPaletteOpen] = useState(false);
    const [query, setQuery] = useState("");
    useEffect(() => {
        const onKey = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setPaletteOpen(true); }
            if (event.key === "Escape") setPaletteOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);
    const filtered = useMemo(() => links.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())).slice(0, 6), [query]);

    return <>
        <header className="sticky top-0 z-40 h-[76px] border-b border-slate-200 bg-white/95 backdrop-blur-xl">
            <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 xl:px-10">
                <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-600">Espace</p>
                    <p className="mt-1 truncate text-sm font-bold text-slate-900">{role}</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                    <button type="button" onClick={() => setPaletteOpen(true)} className="hidden w-64 items-center gap-2.5 rounded-xl border border-slate-200 bg-white/70 px-3.5 py-2.5 text-left text-sm text-slate-600 transition hover:border-slate-300 xl:flex"><Search size={16}/><span>Rechercher...</span><span className="ml-auto inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600"><Command size={10}/>K</span></button>
                    <NotificationBell userId={userId}/>
                    <button type="button" onClick={() => { serviceAuthentification.logout(); window.location.href = "/login"; }} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-950" aria-label="Déconnexion"><LogOut size={17}/></button>
                </div>
            </div>
        </header>
        {paletteOpen && <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[14vh] backdrop-blur-sm" onMouseDown={() => setPaletteOpen(false)}>
            <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-3 border-b border-slate-200 px-4"><Search size={18} className="text-slate-600"/><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Livraison, manager, point relais..." className="h-14 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-600"/><button onClick={() => setPaletteOpen(false)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-950"><X size={17}/></button></div>
                <div className="p-2">{filtered.length ? filtered.map((item) => <Link key={item.href} href={item.href} onClick={() => setPaletteOpen(false)} className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-indigo-700/10 hover:text-blue-700"><span>{item.label}</span><span className="text-xs text-slate-600">↵</span></Link>) : <p className="px-3 py-7 text-center text-sm text-slate-600">Aucun résultat.</p>}</div>
            </div>
        </div>}
    </>;
}
