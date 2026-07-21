"use client";


import {useState} from "react";


import {useRouter} from "next/navigation";


import PageTitle from "@/composants/ui/PageTitle";
import TableauDonnees from "@/composants/table/TableauDonnees.jsx";


const relayPoints = [


    {
        id: 1, name: "Tabac du Centre", city: "Istres", status: "ACTIVE", manager: "Jean Martin"
    },


    {
        id: 2, name: "Relais Express", city: "Marseille", status: "ACTIVE", manager: "Sophie Bernard"
    },


    {
        id: 3, name: "Point Relais Centre", city: "Aix-en-Provence", status: "PENDING", manager: "Non attribué"
    }


];


const statusLabel = {


    ACTIVE: "Actif",

    INACTIVE: "Inactif",

    PENDING: "En attente",

    SUSPENDED: "Suspendu"


};


export default function RelayPointsPage() {
    const router = useRouter();
    const [data, setData] = useState(relayPoints);

    function changeStatus(id, status) {
        setData(data.map(point => point.id === id ? {
            ...point, status
        } : point));
    }

    return (<div className="space-y-8">
            <PageTitle
                title="Points relais"
                description="Gestion des points relais."
            />
            <TableauDonnees
                columns={[{
                    key: "name", label: "Nom"
                }, {
                    key: "city", label: "Ville"
                }, {
                    key: "status", label: "Statut", render: (row) => statusLabel[row.status] || row.status
                }, {
                    key: "manager", label: "Manager"
                }, {
                    key: "actions", label: "Actions", render: (row) => (<div className="flex gap-3">
                            <button
                                className="
                                text-blue-400
                                underline
                                "
                                onClick={() => router.push(`/supermanager/points-relais/${row.id}`)}
                            >
                                Voir détail
                            </button>
                            <select
                                className="
                                bg-slate-900
                                border
                                border-slate-700
                                rounded-lg
                                px-3
                                py-2
                                "
                                value={row.status}
                                onChange={(e) => changeStatus(row.id, e.target.value)}
                            >
                                <option value="ACTIVE">
                                    Actif
                                </option>
                                <option value="INACTIVE">
                                    Inactif
                                </option>
                                <option value="PENDING">
                                    En attente
                                </option>
                                <option value="SUSPENDED">
                                    Suspendu
                                </option>
                            </select>
                        </div>)
                }]}
                data={data}
            />
        </div>

    );

}