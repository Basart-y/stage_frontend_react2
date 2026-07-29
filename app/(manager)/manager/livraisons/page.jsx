"use client";

import {useEffect, useState} from "react";
import PageTitle from "@/composants/ui/PageTitle";
import Loading from "@/composants/ui/Loading";
import Alert from "@/composants/ui/Alert";
import TableauDonnees from "@/composants/table/TableauDonnees.jsx";
import {serviceLivraison} from "@/services/ServiceLivraison.js";
import {translateStatus} from "@/utils/statusLabels";

export default function ManagerLivraisonsPage() {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        serviceLivraison.getAll()
            .then(setDeliveries)
            .catch(() => setError("Impossible de charger les livraisons."))
            .finally(() => setLoading(false));
    }, []);

    return <div className="space-y-8">
        <PageTitle title="Livraisons" description="Suivez l'activité globale des livraisons."/>
        {error && <Alert type="error" message={error}/>} 
        {loading ? <Loading message="Chargement des livraisons..."/> : <TableauDonnees
            columns={[
                {key: "reference", label: "Référence"},
                {key: "commerceName", label: "Commerce"},
                {key: "relayName", label: "Point relais", render: (row) => row.relayName || row.relayPoint || "—"},
                {key: "status", label: "Statut", render: (row) => translateStatus(row.status)},
                {key: "updatedAt", label: "Dernière mise à jour", render: (row) => row.updatedAt ? new Date(row.updatedAt).toLocaleDateString("fr-FR") : "—"},
            ]}
            data={deliveries}
            emptyMessage="Aucune livraison à superviser."
        />}
    </div>;
}
