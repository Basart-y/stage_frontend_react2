import DashboardShell from "@/composants/layout/DashboardShell";
import Link from "next/link";

export default function PointRelaisLayout({children}) {
    return (<DashboardShell
            sidebar={<nav className="space-y-2 text-sm">
                <p className="text-xs font-semibold text-slate-400 mb-2">
                    Responsable Point Relais
                </p>
                <SidebarLink href="/point-relais/dashboard" label="Tableau de bord"/>
                <SidebarLink href="/point-relais/reception" label="Réception colis"/>
                <SidebarLink href="/point-relais/retrait" label="Remise colis"/>
                <SidebarLink href="/point-relais/retour" label="Retour colis"/>
                <SidebarLink href="/point-relais/suivi" label="Suivi"/>
                <SidebarLink href="/point-relais/profil" label="Profil"/>
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