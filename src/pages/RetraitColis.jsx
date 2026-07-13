import { useState } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";

export default function RetraitColis() {
    const [validated, setValidated] = useState(false);

    return (
        <div className="space-y-6">
            <Card className="p-6 sm:p-8">
                <h1 className="text-3xl font-semibold">Retrait d'un colis</h1>
                <p className="mt-2 text-sm text-slate-400">
                    Vérifiez le colis puis confirmez son retrait après validation.
                </p>
            </Card>

            <div className="grid gap-6 xl:grid-cols-2">
                <Card className="p-6">
                    <h2 className="text-xl font-semibold">Recherche du colis</h2>
                    <div className="mt-5 space-y-4">
                        <Input label="Numéro de colis" placeholder="COL-2026-001" />
                        <Input label="Code retrait / QR" placeholder="RET-8841" />
                        <Input label="Nom du destinataire" placeholder="Jean Martin" />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <Button onClick={() => setValidated(true)}>Vérifier le colis</Button>
                    </div>
                </Card>

                <Card className="p-6">
                    <h2 className="text-xl font-semibold">Validation du colis</h2>
                    <div className="mt-5 space-y-3 text-sm text-slate-300">
                        <p>Statut : <Badge variant="info">En attente de validation</Badge></p>
                        <p>Point relais : Relais Centre</p>
                        <p>Date limite : 12/07/2026</p>
                        <p>Contrôle identité : OK</p>
                    </div>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Button variant="secondary">Refuser</Button>
                        <Button disabled={!validated}>Confirmer le retrait</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
{/* Formulaire de recherche d'un colis et partie confirmation d'un colis*/}