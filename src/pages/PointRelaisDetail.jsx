import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, PauseCircle, PlayCircle, Trash2 } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";

export default function PointRelaisDetail() {
    const { id } = useParams();

    return (
        <div className="space-y-6">
            <Card className="p-6 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold">Détail du point relais</h1>
                        <p className="mt-2 text-sm text-slate-400">
                            Consultation et administration du point relais sélectionné.
                        </p>
                    </div>

                    <Link to="/points-relais">
                        <Button variant="secondary">
                            <ArrowLeft size={16} />
                            Retour
                        </Button>
                    </Link>
                </div>
            </Card>

            <div className="grid gap-6 xl:grid-cols-2">
                <Card className="p-6">
                    <h2 className="text-xl font-semibold">Informations du relais</h2>
                    <div className="mt-5 space-y-3 text-sm text-slate-300">
                        <p><span className="text-slate-400">Référence :</span> {id}</p>
                        <p><span className="text-slate-400">Nom :</span> Relais Centre</p>
                        <p><span className="text-slate-400">Ville :</span> Lyon</p>
                        <p><span className="text-slate-400">Responsable :</span> A. Dupont</p>
                        <p><span className="text-slate-400">Adresse :</span> 12 rue de la République</p>
                        <p><span className="text-slate-400">Statut :</span> <Badge variant="success">Actif</Badge></p>
                    </div>
                </Card>

                <Card className="p-6">
                    <h2 className="text-xl font-semibold">
                        Actions disponibles
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                        Sélectionnez l'action à effectuer sur ce point relais.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3 justify-end">
                        <Button>
                            <Pencil size={16}/>
                            Modifier
                        </Button>

                        <Button variant="secondary">
                            <PauseCircle size={16}/>
                            Suspendre
                        </Button>

                        <Button variant="secondary">
                            <PlayCircle size={16}/>
                            Réactiver
                        </Button>

                        <Button variant="danger">
                            <Trash2 size={16}/>
                            Supprimer
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}