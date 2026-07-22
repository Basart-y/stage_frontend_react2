"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

import PageTitle from "@/composants/ui/PageTitle";
import TableauDonnees from "@/composants/table/TableauDonnees.jsx";

import {serviceColis} from "@/services/ServiceColis.js";


const statusLabel = {
    IN_TRANSIT: "En transit", AVAILABLE: "Disponible au point relais", RECEIVED: "Retiré", RECU: "Reçu au point relais"
};


export default function SuiviColisPage() {

    const [parcels, setParcels] = useState([]);
    const router = useRouter();

    useEffect(() => {
        serviceColis
            .findAll()
            .then(setParcels);
    }, []);

    return (<div className="space-y-8">
            <PageTitle title="Suivi colis" description="Suivi des colis reçus dans votre point relais."/>

            <TableauDonnees
                columns={[{
                    key: "reference", label: "Référence"
                }, {
                    key: "customer", label: "Client"
                }, {
                    key: "status", label: "Statut", render: (row) => statusLabel[row.status] || row.status
                }, {
                    key: "actions", label: "Actions", render: (row) => (

                        <button className="text-blue-400 underline"
                                onClick={() => router.push(`../point-relais/suivi/${row.reference}`)}>
                            Voir détail
                        </button>)
                }]}
                data={parcels}
            />
        </div>);
}