import { Link } from "react-router-dom";
import { Search, Eye } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Table from "../components/ui/Table";
import Pagination from "../components/ui/Pagination";

const data = [
    { id: "PR-001", nom: "Relais Centre", ville: "Lyon", statut: "Actif", responsable: "A. Dupont" },
    { id: "PR-002", nom: "Relais Gare", ville: "Paris", statut: "Actif", responsable: "M. Bernard" },
    { id: "PR-003", nom: "Relais Nord", ville: "Lille", statut: "Suspendu", responsable: "S. Martin" },
];

export default function PointsRelais() {
    return (
        <div className="space-y-6">
            <Card className="p-6 sm:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold">Page des points relais</h1>
                        <p className="mt-2 text-sm text-slate-400">
                            Consultez et administrez les points relais.
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto]">
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 flex items-center gap-3">
                        <Search size={16} className="text-slate-400" />
                        <input
                            className="w-full bg-transparent outline-none text-sm placeholder:text-slate-500"
                            placeholder="Rechercher un point relais..."
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
                    { key: "responsable", label: "Responsable" },
                    { key: "statut", label: "Statut" },
                    { key: "action", label: "Action" },
                ]}
                data={data}
                renderRow={(item) => (
                    <tr key={item.id} className="border-b border-white/5 last:border-0">
                        <td className="px-5 py-4 text-sm">{item.id}</td>
                        <td className="px-5 py-4 text-sm">{item.nom}</td>
                        <td className="px-5 py-4 text-sm">{item.ville}</td>
                        <td className="px-5 py-4 text-sm">{item.responsable}</td>
                        <td className="px-5 py-4 text-sm">
                            <Badge variant={item.statut === "Actif" ? "success" : "warning"}>{item.statut}</Badge>
                        </td>
                        <td className="px-5 py-4 text-sm">
                            <Link to={`/points-relais/${item.id}`}>
                                <Button variant="secondary" size="sm">
                                    <Eye size={16} />
                                    Voir le point relais
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