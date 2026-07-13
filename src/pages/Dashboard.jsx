import { Link } from "react-router-dom";
import { ClipboardList, Building2, Package, Truck, RotateCcw, Send, PlusCircle } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const quickActions = [
    { to: "/demande-point-relais", label: "Soumettre une demande", icon: ClipboardList, desc: "Créer une demande de point relais." },
    { to: "/demandes", label: "Gérer les demandes", icon: PlusCircle, desc: "Valider, refuser ou demander des infos." },
    { to: "/points-relais", label: "Gérer les points relais", icon: Building2, desc: "Administrer les relais existants." },
    { to: "/reception-colis", label: "Réception colis", icon: Package, desc: "Réception manuelle ou QR code." },
    { to: "/retrait-colis", label: "Retrait colis", icon: Truck, desc: "Vérifier puis confirmer le retrait." },
    { to: "/retour-colis", label: "Retour colis", icon: RotateCcw, desc: "Enregistrer un retour expéditeur." },
    { to: "/suivi-colis", label: "Suivi colis", icon: Send, desc: "Consulter l’état d’un colis." },
];

export default function Dashboard() {
    return (
        <div className="space-y-6">
            <Card className="p-6 sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <h1 className="text-3xl sm:text-4xl font-semibold">Tableau de bord</h1>
                        <p className="mt-3 text-sm sm:text-base text-slate-400">
                            Accédez rapidement aux principales actions de gestion des points relais et des colis.
                        </p>
                    </div>
                </div>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {quickActions.map(({ to, label, icon: Icon, desc }) => (
                    <Link key={to} to={to} className="group">
                        <Card className="h-full p-6 transition-transform duration-200 group-hover:-translate-y-1 group-hover:border-[#4F8CFF]/30">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4F8CFF]/15 text-[#82b2ff]">
                                <Icon size={22} />
                            </div>
                            <h2 className="mt-5 text-xl font-semibold">{label}</h2>
                            <p className="mt-2 text-sm text-slate-400">{desc}</p>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}