import DashboardShell from "@/composants/layout/DashboardShell";
import SidebarLink from "@/composants/layout/SidebarLink";
import AuthGate from "@/composants/layout/AuthGate";

export default function PointRelaisLayout({children}) {
    return <AuthGate allowedRoles={["point_relais", "super_gestionnaire"]}><DashboardShell role="Responsable point relais" sidebar={<nav className="flex gap-1 lg:block lg:space-y-1"><p className="hidden px-3 pb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400 lg:block">Navigation point relais</p><SidebarLink href="/point-relais/dashboard" label="Tableau de bord"/><SidebarLink href="/point-relais/reception" label="Réception colis"/><SidebarLink href="/point-relais/retrait" label="Remise colis"/><SidebarLink href="/point-relais/retour" label="Retour colis"/><SidebarLink href="/point-relais/suivi" label="Suivi"/><SidebarLink href="/point-relais/signalements" label="Signalements"/><SidebarLink href="/point-relais/notifications" label="Notifications"/><SidebarLink href="/point-relais/profil" label="Profil"/></nav>}>{children}</DashboardShell></AuthGate>;
}
