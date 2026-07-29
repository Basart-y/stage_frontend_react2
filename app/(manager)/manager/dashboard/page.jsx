"use client";

import {useEffect, useState} from "react";
import PageTitle from "@/composants/ui/PageTitle";
import GrillesStatistiques from "@/composants/TableauDeBord/GrillesStatistiques.jsx";
import ActionsRapides from "@/composants/TableauDeBord/ActionsRapides.jsx";
import Alert from "@/composants/ui/Alert";
import {serviceRegistrationRequests} from "@/services/ServiceRegistrationRequests.js";
import {serviceLivraison} from "@/services/ServiceLivraison.js";

const actions = [
    {label: "Demandes commerces", href: "/manager/demandes-commerces", description: "Examiner et valider les inscriptions"},
    {label: "Points relais", href: "/manager/points-relais", description: "Superviser l'état des relais"},
    {label: "Livraisons", href: "/manager/livraisons", description: "Suivre l'activité logistique"},
];

export default function ManagerDashboardPage() {
    const [stats, setStats] = useState([
        {label: "Demandes à traiter", value: "—"},
        {label: "Points relais suivis", value: 3},
        {label: "Livraisons", value: "—"},
    ]);
    const [error, setError] = useState("");

    useEffect(() => {
        Promise.all([serviceRegistrationRequests.list({status: "PENDING", limit: 100}), serviceLivraison.getAll()])
            .then(([requests, deliveries]) => setStats([
                {label: "Demandes à traiter", value: requests.length},
                {label: "Points relais suivis", value: 3},
                {label: "Livraisons", value: deliveries.length},
            ]))
            .catch(() => setError("Certaines données du tableau de bord n'ont pas pu être chargées."));
    }, []);

    return <section className="space-y-8">
        <PageTitle title="Tableau de bord manager" description="Validez les inscriptions et supervisez l'activité opérationnelle."/>
        {error && <Alert type="info" message={error}/>} 
        <GrillesStatistiques stats={stats}/>
        <div>
            <h2 className="mb-4 text-lg font-bold text-slate-50">Actions principales</h2>
            <ActionsRapides actions={actions}/>
        </div>
    </section>;
}
