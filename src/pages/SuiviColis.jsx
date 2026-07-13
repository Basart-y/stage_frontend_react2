import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Table from "../components/ui/Table";

const steps = [
    { date: "08/07/2026", event: "Colis reçu", statut: "Terminé", lieu: "Relais Centre" },
    { date: "09/07/2026", event: "Mis à disposition", statut: "Terminé", lieu: "Relais Centre" },
    { date: "10/07/2026", event: "Disponible", statut: "En cours", lieu: "Relais Centre" },
];

const colis = [
    { id: "COL-2026-001", destinataire: "Jean Martin", relais: "Relais Centre", statut: "Disponible" },
    { id: "COL-2026-002", destinataire: "Sarah Diallo", relais: "Relais Gare", statut: "En attente" },
];

export default function SuiviColis() {
    return (
        <div className="space-y-6">
            <Card className="p-6 sm:p-8">
                <h1 className="text-3xl font-semibold">Suivi des colis</h1>
                <p className="mt-2 text-sm text-slate-400">
                    Consultez la liste des colis et ouvrez le détail d’un colis pour voir son historique complet.
                </p>
            </Card>

            <Card className="p-6">
                <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                    <Input label="Numéro de colis" placeholder="COL-2026-001" />
                    <div className="self-end">
                        <Button>Rechercher</Button>
                    </div>
                </div>
            </Card>

            <Table
                columns={[
                    { key: "id", label: "ID" },
                    { key: "destinataire", label: "Destinataire" },
                    { key: "relais", label: "Point relais" },
                    { key: "statut", label: "Statut" },
                    { key: "action", label: "Action" },
                ]}
                data={colis}
                renderRow={(item) => (
                    <tr key={item.id} className="border-b border-white/5 last:border-0">
                        <td className="px-5 py-4 text-sm">{item.id}</td>
                        <td className="px-5 py-4 text-sm">{item.destinataire}</td>
                        <td className="px-5 py-4 text-sm">{item.relais}</td>
                        <td className="px-5 py-4 text-sm">
                            <Badge variant={item.statut === "Disponible" ? "success" : "warning"}>{item.statut}</Badge>
                        </td>
                        <td className="px-5 py-4 text-sm">
                            <Link to={`/colis/${item.id}`}>
                                <Button variant="secondary" size="sm">Voir le détail</Button>
                            </Link>
                        </td>
                    </tr>
                )}
            />

            <Card className="p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Historique du colis</h2>
                </div>

                <div className="mt-6 overflow-hidden rounded-[24px] border border-white/10">
                    <table className="min-w-full text-left">
                        <thead className="bg-white/5">
                        <tr>
                            <th className="px-5 py-4 text-xs uppercase tracking-[0.18em] text-slate-400">Date</th>
                            <th className="px-5 py-4 text-xs uppercase tracking-[0.18em] text-slate-400">Événement</th>
                            <th className="px-5 py-4 text-xs uppercase tracking-[0.18em] text-slate-400">Statut</th>
                            <th className="px-5 py-4 text-xs uppercase tracking-[0.18em] text-slate-400">Lieu</th>
                        </tr>
                        </thead>
                        <tbody>
                        {steps.map((row) => (
                            <tr key={row.date + row.event} className="border-t border-white/5">
                                <td className="px-5 py-4 text-sm">{row.date}</td>
                                <td className="px-5 py-4 text-sm">{row.event}</td>
                                <td className="px-5 py-4 text-sm">{row.statut}</td>
                                <td className="px-5 py-4 text-sm">{row.lieu}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}