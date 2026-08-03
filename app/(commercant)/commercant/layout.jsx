import DashboardShell from "@/composants/layout/DashboardShell";
import SidebarLink from "@/composants/layout/SidebarLink";
import AuthGate from "@/composants/layout/AuthGate";

export default function CommercantLayout({children}) {
    return <AuthGate allowedRoles={["commercant", "super_gestionnaire"]}><DashboardShell role="Commerçant" sidebar={<nav className="flex gap-1 lg:block lg:space-y-1"><p className="hidden px-3 pb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-600 lg:block">Navigation commerçant</p><SidebarLink href="/commercant/dashboard" label="Tableau de bord"/><SidebarLink href="/commercant/commerce" label="Mon commerce"/><SidebarLink href="/commercant/livraisons" label="Livraisons"/><SidebarLink href="/commercant/planification" label="Planifier une livraison"/><SidebarLink href="/commercant/suivi" label="Suivi des colis"/><SidebarLink href="/commercant/signalements" label="Signalements"/><SidebarLink href="/commercant/notifications" label="Notifications"/><SidebarLink href="/commercant/profil" label="Profil"/></nav>}>{children}</DashboardShell></AuthGate>;
}
