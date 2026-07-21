"use client";

import {useEffect, useState} from "react";
import PageTitle from "@/composants/ui/PageTitle";
import TableauDonnees from "@/composants/table/TableauDonnees.jsx";
import {serviceLivraison} from "@/services/ServiceLivraison.js";

export default function ManagerLivraisonsPage() {
    const [deliveries, setDeliveries] = useState([]);

    useEffect(() => {
        serviceLivraison.getAll().then(setDeliveries);
    }, []);

    return (<div className="space-y-8">
            <PageTitle
                title="Livraisons"
                description="Suivi des livraisons dans l'écosystème des points relais."
            />

            <TableauDonnees
                columns={[{key: "reference", label: "Référence"}, {
                    key: "commerceName",
                    label: "Commerce"
                }, {key: "relayName", label: "Point relais"}, {key: "status", label: "Statut"}, {
                    key: "updatedAt",
                    label: "Dernière mise à jour"
                },]}
                data={deliveries}
            />
        </div>);
}