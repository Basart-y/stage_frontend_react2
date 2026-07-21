"use client";


import {useEffect, useState} from "react";


import PageTitle from "@/composants/ui/PageTitle";

import TableauDonnees from "@/composants/table/TableauDonnees.jsx";

import SearchBar from "@/composants/search/SearchBar";

import FiltresLivraisons from "@/composants/livraison/FiltresLivraisons.jsx";


import {serviceLivraison} from "@/services/ServiceLivraison.js";


export default function SuiviPage() {


    const [deliveries, setDeliveries] = useState([]);


    const [search, setSearch] = useState("");


    const [status, setStatus] = useState("");


    useEffect(() => {


        serviceLivraison
            .findAll()
            .then(setDeliveries);


    }, []);


    const filtered = deliveries.filter(item => {


        const matchSearch = item.reference
            .toLowerCase()
            .includes(search.toLowerCase());


        const matchStatus = status ? item.status === status : true;


        return matchSearch && matchStatus;


    });


    return (

        <div className="space-y-8">


            <PageTitle

                title="Suivi des colis"

                description="Suivez l'état de vos expéditions."

            />


            <div className="flex gap-4">


                <SearchBar

                    value={search}

                    onChange={setSearch}

                />


                <FiltresLivraisons

                    status={status}

                    setStatus={setStatus}

                />


            </div>


            <TableauDonnees

                columns={[


                    {
                        key: "reference", label: "Référence"
                    },


                    {
                        key: "relayPoint", label: "Point relais"
                    },


                    {
                        key: "status", label: "Statut"
                    },


                    {
                        key: "date", label: "Date"
                    }


                ]}


                data={filtered}


            />


        </div>

    );


}