import { useState } from "react";
import { QrCode, PackageCheck } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";

export default function ReceptionColis() {
    const [mode, setMode] = useState("qr");

    return (
        <div className="space-y-6">
            <Card className="p-6 sm:p-8">
                <h1 className="text-3xl font-semibold">Réception d'un colis</h1>
                <p className="mt-2 text-sm text-slate-400">
                    Enregistrez l’arrivée d’un colis dans un point relais.
                </p>
            </Card>

            <Card className="p-6">
                <div className="flex flex-wrap gap-3">
                    <Button variant={mode === "qr" ? "primary" : "secondary"} onClick={() => setMode("qr")}>
                        <QrCode size={16} />
                        QR code
                    </Button>
                    <Button variant={mode === "manual" ? "primary" : "secondary"} onClick={() => setMode("manual")}>
                        <PackageCheck size={16} />
                        Saisie manuelle
                    </Button>
                </div>
            </Card>

            <Card className="p-6">
                <div className="grid gap-5 lg:grid-cols-2">
                    {mode === "qr" ? (
                        <>
                            <div
                                className="lg:col-span-2 rounded-[24px] border border-dashed border-white/15 bg-white/5 p-8 text-center text-slate-400">
                                Zone de scan QR code
                            </div>
                        </>
                    ) : (
                        <>
                            <Input label="Numéro de colis" placeholder="COL-2026-001"/>
                            <Input label="Code destinataire" placeholder="DST-4582"/>
                            <Input label="Nom du destinataire" placeholder="Jean Martin"/>
                            <Input label="Point relais" placeholder="Relais Centre"/>
                        </>
                    )}
                    <Input label="Date de réception" type="date"/>
                    <Input label="Heure de réception" type="time"/>
                </div>

                <div className="mt-6 flex items-center justify-center">
                    <Button>Valider la réception</Button>
                </div>
            </Card>
        </div>
    );
}
{/* Formulaire pour mettre les informations du colis*/
}