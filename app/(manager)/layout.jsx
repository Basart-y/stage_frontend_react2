import DashboardShell from "@/composants/layout/DashboardShell";
import SidebarLink from "@/composants/layout/SidebarLink";
import AuthGate from "@/composants/layout/AuthGate";

export default function ManagerLayout({children}) {
    return <AuthGate allowedRoles={["gestionnaire", "super_gestionnaire"]}><DashboardShell role="Manager" sidebar={<nav className="flex gap-1 lg:block lg:space-y-1"><p className="hidden px-3 pb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-600 lg:block">Navigation manager</p><SidebarLink href="/manager/dashboard" label="Tableau de bord"/><SidebarLink href="/manager/invitations" label="Inviter un utilisateur"/><SidebarLink href="/manager/demandes-commerces" label="Demandes commerçants"/><SidebarLink href="/manager/demandes-points-relais" label="Demandes points relais"/><SidebarLink href="/manager/points-relais" label="Points relais"/><SidebarLink href="/manager/livraisons" label="Livraisons"/><SidebarLink href="/manager/tracabilite-technique" label="Traçabilité technique"/><SidebarLink href="/manager/signalements" label="Signalements"/><SidebarLink href="/manager/notifications" label="Notifications"/><SidebarLink href="/manager/profil" label="Profil"/></nav>}>{children}</DashboardShell></AuthGate>;
}
