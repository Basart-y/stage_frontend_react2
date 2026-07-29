import DashboardShell from "@/composants/layout/DashboardShell";
import SidebarLink from "@/composants/layout/SidebarLink";
import AuthGate from "@/composants/layout/AuthGate";

export default function SuperManagerLayout({children}) {
    return <AuthGate allowedRoles={["super_gestionnaire"]}><DashboardShell role="Super gestionnaire" sidebar={<nav className="flex gap-1 lg:block lg:space-y-1"><p className="hidden px-3 pb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400 lg:block">Administration</p><SidebarLink href="/supermanager/dashboard" label="Tableau de bord"/><SidebarLink href="/supermanager/managers" label="Managers"/><SidebarLink href="/supermanager/commerces" label="Commerces"/><SidebarLink href="/supermanager/points-relais" label="Points relais"/><SidebarLink href="/supermanager/statistiques" label="Statistiques"/><SidebarLink href="/supermanager/signalements" label="Arbitrages"/><SidebarLink href="/supermanager/notifications" label="Notifications"/><SidebarLink href="/supermanager/profil" label="Profil"/></nav>}>{children}</DashboardShell></AuthGate>;
}
