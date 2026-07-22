import DashboardShell from "@/composants/layout/DashboardShell";
import Link from "next/link";

export default function CommercantLayout({children}) {
    return (<DashboardShell
        sidebar={<nav className="space-y-2 text-sm">
            <p className="text-xs font-semibold text-slate-400 mb-2">
                Commerçant
            </p>
            <SidebarLink href="/commercant/dashboard" label="Tableau de bord"/>
            <SidebarLink href="/commercant/commerce" label="Mon commerce"/>
            <SidebarLink href="/commercant/livraisons" label="Livraisons"/>
            <SidebarLink href="/commercant/planification" label="Planifier une livraison"/>
            <SidebarLink href="/commercant/suivi" label="Suivi des colis"/>
            <SidebarLink href="/commercant/profil" label="Profil"/>
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