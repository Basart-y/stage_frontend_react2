"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {BarChart3, Building2, CircleUserRound, ClipboardCheck, CreditCard, LayoutDashboard, MapPinned, PackageCheck, PackagePlus, RotateCcw, Settings2, Store, Truck, UserCog, UsersRound} from "lucide-react";

function iconFor(href) {
    if (href.includes("dashboard")) return LayoutDashboard;
    if (href.includes("planification")) return PackagePlus;
    if (href.includes("livraisons") || href.includes("suivi")) return Truck;
    if (href.includes("points-relais")) return MapPinned;
    if (href.includes("demandes")) return ClipboardCheck;
    if (href.includes("commerce")) return Store;
    if (href.includes("reception") || href.includes("retrait")) return PackageCheck;
    if (href.includes("retour")) return RotateCcw;
    if (href.includes("managers")) return UserCog;
    if (href.includes("statistiques")) return BarChart3;
    if (href.includes("abonnement")) return CreditCard;
    if (href.includes("profil")) return CircleUserRound;
    if (href.includes("utilisateurs")) return UsersRound;
    if (href.includes("config")) return Settings2;
    return Building2;
}

export default function SidebarLink({href, label}) {
    const pathname = usePathname();
    const active = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
    const Icon = iconFor(href);
    return (
        <Link href={href} className={`group flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-semibold transition lg:mb-1 ${active ? "bg-blue-800 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"}`}>
            <Icon size={17} strokeWidth={1.9} className={active ? "text-white" : "text-slate-500 transition group-hover:text-blue-800"}/>
            <span>{label}</span>
            {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white"/>}
        </Link>
    );
}
