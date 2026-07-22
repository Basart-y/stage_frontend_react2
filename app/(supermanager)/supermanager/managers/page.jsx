"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

import PageTitle from "@/composants/ui/PageTitle";
import TableauDonnees from "@/composants/table/TableauDonnees.jsx";

import {serviceSuperManager} from "@/services/ServiceSuperManager.js";
import {translateStatus} from "@/utils/statusLabels";


export default function ManagersPage() {

    const [managers, setManagers] = useState([]);
    const router = useRouter();
    useEffect(() => {
        serviceSuperManager
            .getManagers()
            .then(setManagers);

    }, []);


    function handleDelete(manager) {

        const confirmed = window.confirm(`Voulez-vous supprimer le manager ${manager.firstname} ${manager.lastname} ?`);
        if (!confirmed) {
            return;
        }
        console.log("Suppression manager", manager.id);
        alert("Suppression du manager simulée (mock)");

    }


    function handleToggleStatus(manager) {

        const newStatus = manager.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        console.log("Changement statut", manager.id, newStatus);
        alert(`Statut modifié : ${newStatus}`);

    }


    return (<div className="space-y-8">
        <PageTitle title="Gestion des managers" description="Créer, consulter et administrer les comptes managers."/>

        <TableauDonnees
            columns={[{
                key: "firstname", label: "Prénom"
            }, {
                key: "lastname", label: "Nom"
            }, {
                key: "email", label: "Email"
            }, {
                key: "status", label: "Statut", render: (row) => (

                    <span className={` rounded-full px-3 py-1 text-xs
                                    ${row.status === "ACTIVE" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}
                                `}
                    >
                                {translateStatus(row.status)}
                            </span>)
            }, {
                key: "actions", label: "Actions", render: (row) => (

                    <div className="flex flex-wrap gap-3">
                        <button className="text-blue-400 hover:text-blue-300 underline"
                                onClick={() => router.push(`/supermanager/managers/${row.id}`)}
                        >
                            Voir
                        </button>

                        <button className="text-yellow-400 hover:text-yellow-300 underline"
                                onClick={() => alert("Modification manager (mock)")}
                        >
                            Modifier
                        </button>

                        <button className="text-green-400 hover:text-green-300 underline"
                                onClick={() => handleToggleStatus(row)}
                        >
                            {row.status === "ACTIVE" ? "Désactiver" : "Activer"}
                        </button>

                        <button className="text-red-400 hover:text-red-300 underline"
                                onClick={() => handleDelete(row)}
                        >
                            Supprimer
                        </button>
                    </div>)
            }

            ]}
            data={managers}
        />
    </div>);
}