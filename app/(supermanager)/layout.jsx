import DashboardShell from "@/composants/layout/DashboardShell";
import Link from "next/link";

export default function SuperManagerLayout({children}) {
    return (<DashboardShell
        sidebar={<nav className="space-y-2 text-sm">
            <p className="text-xs font-semibold text-slate-400 mb-2">
                SuperManager
            </p>
            <SidebarLink href="/supermanager/dashboard" label="Tableau de bord"/>
            <SidebarLink href="/supermanager/managers" label="Managers"/>
            <SidebarLink href="/supermanager/commerces" label="Commerces"/>
            <SidebarLink href="/supermanager/points-relais" label="Points relais"/>
            <SidebarLink href="/supermanager/statistiques" label="Statistiques"/>
            <SidebarLink href="/supermanager/profil" label="Profil"/>
        </nav>}
    >
        {children}
    </DashboardShell>);
}

function SidebarLink({href, label}) {
    return (<Link href={href} className="block px-2 py-1 rounded-md hover:bg-slate-800">
        {label}
    </Link>);
}