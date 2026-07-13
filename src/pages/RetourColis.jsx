import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";

export default function RetourColis() {
    return (
        <div className="space-y-6">
            <Card className="p-6 sm:p-8">
                <h1 className="text-3xl font-semibold">Retour d'un colis</h1>
                <p className="mt-2 text-sm text-slate-400">
                    Gèrez le retour vers l’expéditeur.
                </p>
            </Card>

            <Card className="p-6">
                <div className="grid gap-5 lg:grid-cols-2">
                    <Input label="Numéro de colis" placeholder="COL-2026-001" />
                    <Input label="Expéditeur" placeholder="Entreprise ABC" />
                    <Input label="Motif du retour" placeholder="Colis non retiré" />
                    <Input label="Date du retour" type="date" />
                </div>
                <div className="mt-6 flex justify-end">
                    <Button>Enregistrer le retour</Button>
                </div>
            </Card>
        </div>
    );
}
{/* Formulaire de retour colis */}