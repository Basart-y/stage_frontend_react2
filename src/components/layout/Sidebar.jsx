import {NavLink} from "react-router-dom";
import {
    LayoutDashboard,
    Home,
    ClipboardList,
    Building2,
    Package,
    Truck,
    RotateCcw,
    Send,
    UserRound,
    LogOut
} from "lucide-react";

const navigation = [
    {
        title: "Général",
        items: [
            {to: "/", label: "Accueil", icon: Home},
            {to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard},
        ]
    },
    {
        title: "Gestion",
        items: [
            {to: "/demandes", label: "Demandes relais", icon: ClipboardList},
            {to: "/points-relais", label: "Points relais", icon: Building2},
            {to: "/reception-colis", label: "Réception colis", icon: Package},
            {to: "/retrait-colis", label: "Retrait colis", icon: Truck},
            {to: "/retour-colis", label: "Retour colis", icon: RotateCcw},
            {to: "/suivi-colis", label: "Suivi colis", icon: Send}
        ]
    }
];
// Définit les catégories de la sideBar et les différents composants de la barre avec leur destination , nom et icone car a la fonction NavSection

function NavSection({title, items}) {
    return (
        <div className="space-y-2">
            <p className="px-3 text-[11px] uppercase tracking-[0.2em] text-slate-400/80">
                {title}
            </p>
            <div className="space-y-1">  {/* Bouton pour chaque élément navlink comme link mais il sait si la page est active */}
                {items.map(({to, label, icon: Icon}) => (
                    <NavLink
                        key={to} // Clé unique pour chaque élément de la liste
                        to={to}
                        className={({isActive}) =>
                            `group flex items-center gap-3 rounded-2xl px-3 py-3 transition-all duration-200 ${
                                isActive
                                    ? "bg-[#4F8CFF] text-white shadow-[0_10px_30px_rgba(79,140,255,0.35)]"
                                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                            }`
                        }
                    > {/* Si la page est active le bouton devient bleu */}
            <span
                className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10">
              <Icon size={18}/>
            </span>
                        <span className="text-sm font-medium">{label}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    );
}

export default function Sidebar() {
    return (
        <aside className="hidden lg:block w-[290px] p-4">
            <div
                className="sticky top-4 h-[calc(100vh-2rem)] rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div
                            className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#4F8CFF] to-[#7AB7FF] grid place-items-center shadow-lg">
                            <span className="font-bold text-white">PR</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold leading-none">PointRelais+</h1>
                            <p className="text-xs text-slate-400 mt-1">Gestion des relais</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
                    {navigation.map((section) => (
                        <NavSection key={section.title} title={section.title} items={section.items}/>
                    ))}
                </div>

                <div className="p-4 border-t border-white/10">
                    <button
                        className="w-full flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition">
                        <LogOut size={16}/>
                        Déconnexion
                    </button>
                </div>
            </div>
        </aside>
    );
}