"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

import PageTitle from "@/composants/ui/PageTitle";
import TableauDonnees from "@/composants/table/TableauDonnees.jsx";

import {serviceManager} from "@/services/ServiceManager.js";
import {translateStatus} from "@/utils/statusLabels";


export default function ShopRequestsPage() {

    const [requests, setRequests] = useState([]);

    const router = useRouter();


    useEffect(() => {

        serviceManager
            .getShopRequests()
            .then(setRequests);

    }, []);


    return (

        <div className="space-y-8">


            <PageTitle
                title="Demandes commerces"
                description="Validez ou refusez les demandes d'inscription des commerces."
            />


            <TableauDonnees

                columns={[

                    {
                        key: "name", label: "Commerce"
                    },


                    {
                        key: "city", label: "Ville"
                    },


                    {
                        key: "email", label: "Email"
                    },


                    {
                        key: "status", label: "Statut", render: (row) => (<span>
                                {translateStatus(row.status)}
                            </span>)
                    },


                    {
                        key: "actions", label: "Actions", render: (row) => (

                            <button
                                className="text-blue-400 underline"
                                onClick={() => router.push(`/manager/demandes-commerces/${row.id}`)}
                            >
                                Voir détail
                            </button>

                        )
                    }

                ]}


                data={requests}

            />


        </div>

    );

}