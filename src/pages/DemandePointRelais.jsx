import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";

export default function DemandePointRelais() {
    return (
        <div className="space-y-6">
            <Card className="p-6 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold">Demande de point relais</h1>
                        <p className="mt-2 text-sm text-slate-400">
                            Remplissez ce formulaire pour soumettre une nouvelle demande de création de point relais.
                        </p>
                    </div>

                    <Link to="/dashboard">
                        <Button variant="secondary" className="w-full sm:w-auto">
                            <ArrowLeft size={16} />
                            Retour
                        </Button>
                    </Link>
                </div>
            </Card>

            <Card className="p-6">
                <form className="grid gap-5 lg:grid-cols-2">
                    <Input label="Nom du demandeur" placeholder="Jean Martin" />
                    <Input label="Prénom du demandeur" placeholder="Jean" />
                    <Input label="Email" type="email" placeholder="exemple@mail.com" />
                    <Input label="Téléphone" placeholder="06 00 00 00 00" />
                    <Input label="Nom de l'enseigne" placeholder="Point Relais Centre" />
                    <Input label="Ville" placeholder="Lyon" />
                    <Input label="Adresse" placeholder="12 rue de la République" className="lg:col-span-2" />
                    <Input label="Type d'activité" placeholder="Commerce, tabac, superette..." className="lg:col-span-2" />
                    <Input label="Horaires d'ouverture" placeholder="Lun-Sam : 8h-20h" className="lg:col-span-2" />
                </form>

                <div className="mt-6 flex justify-end">
                    <Button>Soumettre la demande</Button>
                </div>
            </Card>
        </div>
    );
}