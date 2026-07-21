import DashboardShell from "@/composants/layout/DashboardShell";
import Link from "next/link";

export default function ManagerLayout({children}) {
    return (<DashboardShell
            sidebar={<nav className="space-y-2 text-sm">
                <p className="text-xs font-semibold text-slate-400 mb-2">
                    Manager
                </p>
                <SidebarLink href="/manager/dashboard" label="Tableau de bord"/>
                <SidebarLink href="/manager/demandes-commerces" label="Demandes commerces"/>
                <SidebarLink href="/manager/points-relais" label="Points relais"/>
                <SidebarLink href="/manager/livraisons" label="Livraisons"/>
                <SidebarLink href="/manager/profil" label="Profil"/>
            </nav>}
        >
            {children}
        </DashboardShell>);
}

function SidebarLink({href, label}) {
    return (<Link
            href={href}
            className="block px-2 py-1 rounded-md hover:bg-slate-800"
        >
            {label}
        </Link>);
}