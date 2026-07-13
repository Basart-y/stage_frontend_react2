import { Link } from "react-router-dom";
import { Search, Eye } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Table from "../components/ui/Table";
import Pagination from "../components/ui/Pagination";

const data = [
    { id: "D-001", nom: "Jean Martin", ville: "Lyon", statut: "En attente", date: "10/07/2026" },
    { id: "D-002", nom: "Sarah Diallo", ville: "Nantes", statut: "Validée", date: "09/07/2026" },
    { id: "D-003", nom: "Lucas Petit", ville: "Paris", statut: "Refusée", date: "08/07/2026" },
];

export default function Demandes() {
    return (
        <div className="space-y-6">
            <Card className="p-6 sm:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold">Page des demandes</h1>
                        <p className="mt-2 text-sm text-slate-400">
                            Consultez la liste des demandes de point relais déposées.
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto]">
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 flex items-center gap-3">
                        <Search size={16} className="text-slate-400" />
                        <input
                            className="w-full bg-transparent outline-none text-sm placeholder:text-slate-500"
                            placeholder="Rechercher une demande..."
                        />
                    </div>
                    <Button variant="secondary">Filtres</Button>
                </div>
            </Card>

            <Table
                columns={[
                    { key: "id", label: "ID" },
                    { key: "nom", label: "Nom" },
                    { key: "ville", label: "Ville" },
                    { key: "statut", label: "Statut" },
                    { key: "date", label: "Date" },
                    { key: "action", label: "Action" },
                ]}
                data={data}
                renderRow={(item) => (
                    <tr key={item.id} className="border-b border-white/5 last:border-0">
                        <td className="px-5 py-4 text-sm">{item.id}</td>
                        <td className="px-5 py-4 text-sm">{item.nom}</td>
                        <td className="px-5 py-4 text-sm">{item.ville}</td>
                        <td className="px-5 py-4 text-sm">
                            <Badge
                                variant={
                                    item.statut === "Validée"
                                        ? "success"
                                        : item.statut === "Refusée"
                                            ? "danger"
                                            : "warning"
                                }
                            >
                                {item.statut}
                            </Badge>
                        </td>
                        <td className="px-5 py-4 text-sm">{item.date}</td>
                        <td className="px-5 py-4 text-sm">
                            <Link to={`/demandes/${item.id}`}>
                                <Button variant="secondary" size="sm">
                                    <Eye size={16} />
                                    Voir la demande
                                </Button>
                            </Link>
                        </td>
                    </tr>
                )}
            />

            <Pagination />
        </div>
    );
}