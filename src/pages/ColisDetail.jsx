import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";

const history = [
    { date: "08/07/2026", event: "Colis reçu", detail: "Enregistré au point relais Centre" },
    { date: "09/07/2026", event: "Mis à disposition", detail: "Colis prêt pour retrait" },
    { date: "10/07/2026", event: "Disponible", detail: "En attente de retrait" },
];

export default function ColisDetail() {
    const { id } = useParams();

    return (
        <div className="space-y-6">
            <Card className="p-6 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold">Détail du colis</h1>
                        <p className="mt-2 text-sm text-slate-400">
                            Consultation complète du colis et de son historique.
                        </p>
                    </div>
                    <Link to="/suivi-colis">
                        <Button variant="secondary">
                            <ArrowLeft size={16} />
                            Retour
                        </Button>
                    </Link>
                </div>
            </Card>

            <Card className="p-6">
                <h2 className="text-xl font-semibold">Informations du colis</h2>
                <div className="mt-5 space-y-3 text-sm text-slate-300">
                    <p><span className="text-slate-400">Référence :</span> {id}</p>
                    <p><span className="text-slate-400">Destinataire :</span> Jean Martin</p>
                    <p><span className="text-slate-400">Point relais :</span> Relais Centre</p>
                    <p><span className="text-slate-400">Statut :</span> <Badge variant="success">Disponible</Badge></p>
                </div>
            </Card>

            <Card className="p-6">
                <h2 className="text-xl font-semibold">Historique complet</h2>
                <div className="mt-6 space-y-4">
                    {history.map((item) => (
                        <div key={item.date + item.event} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-sm text-slate-400">{item.date}</p>
                            <p className="mt-1 font-medium">{item.event}</p>
                            <p className="mt-1 text-sm text-slate-300">{item.detail}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}