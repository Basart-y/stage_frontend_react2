import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, X, MessageSquare } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";

export default function DemandeDetail() {
    const { id } = useParams();

    return (
        <div className="space-y-6">
            <Card className="p-6 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold">Détail de la demande</h1>
                        <p className="mt-2 text-sm text-slate-400">
                            Visualisation des informations de la demande de point relais.
                        </p>
                    </div>

                    <Link to="/demandes">
                        <Button variant="secondary">
                        <ArrowLeft size={16} />
                            Retour
                        </Button>
                    </Link>
                </div>
            </Card>

            <div className="grid gap-6 xl:grid-cols-2">
                <Card className="p-6">
                    <h2 className="text-xl font-semibold">Informations du dossier</h2>
                    <div className="mt-5 space-y-3 text-sm text-slate-300">
                        <p><span className="text-slate-400">Référence :</span> {id}</p>
                        <p><span className="text-slate-400">Nom :</span> Jean Martin</p>
                        <p><span className="text-slate-400">Ville :</span> Lyon</p>
                        <p><span className="text-slate-400">Adresse :</span> 12 rue de la République</p>
                        <p><span className="text-slate-400">Téléphone :</span> 06 00 00 00 00</p>
                        <p><span className="text-slate-400">Email :</span> jean@mail.com</p>
                        <p><span className="text-slate-400">Statut :</span> <Badge variant="warning">En attente</Badge></p>
                    </div>
                </Card>

                <Card className="p-6">
                    <h2 className="text-xl font-semibold">
                        Actions disponibles
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                        Sélectionnez l'action à effectuer sur cette demande.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">

                        <Button>
                            <Check size={16}/>
                            Valider
                        </Button>

                        <Button variant="secondary">
                            <X size={16}/>
                            Refuser
                        </Button>

                        <Button variant="secondary">
                            <MessageSquare size={16}/>
                            Informations complémentaires
                        </Button>

                    </div>
                </Card>
            </div>
        </div>
    );
}