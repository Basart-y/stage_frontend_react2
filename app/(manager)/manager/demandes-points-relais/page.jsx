"use client";


import {useEffect, useState} from "react";


import PageTitle from "@/composants/ui/PageTitle";

import TableauDonnees from "@/composants/table/TableauDonnees.jsx";


import {serviceManager} from "@/services/ServiceManager.js";


export default function RelayRequestsPage() {


    const [requests, setRequests] = useState([]);
    useEffect(() => {
        serviceManager
            .getRelayRequests()
            .then(setRequests);
    }, []);


    return (<div className="space-y-8">
            <PageTitle title="Demandes points relais" description="Validation des candidatures."/>

            <TableauDonnees
                columns={[{
                    key: "name", label: "Nom"
                }, {
                    key: "city", label: "Ville"
                }, {
                    key: "status", label: "Statut"
                }]}
                data={requests}
            />
        </div>);
}