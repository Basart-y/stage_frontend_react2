"use client";

import {useParams} from "next/navigation";

import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";


const parcels = [

    {
        id: "COL-1001",
        sender: "Jean Martin",
        status: "EN_TRANSIT",
        relay: "Relay Marseille",
        date: "21/07/2026",
        description: "Colis en cours d'acheminement."
    },

    {
        id: "COL-1002",
        sender: "Claire Dupont",
        status: "RECU",
        relay: "Relay Aix",
        date: "20/07/2026",
        description: "Colis reçu au point relais."
    },

    {
        id: "COL-1003",
        sender: "Marc Bernard",
        status: "DISPONIBLE",
        relay: "Relay Istres",
        date: "19/07/2026",
        description: "Colis disponible pour retrait."
    }

];


function translateStatus(status) {

    const labels = {
        EN_TRANSIT: "En transit", RECU: "Reçu au point relais", DISPONIBLE: "Disponible au point relais"
    };

    return labels[status] ?? status;

}


export default function ParcelDetailPage() {

    const params = useParams();


    const parcel = parcels.find(item => item.id === params.id);


    if (!parcel) {

        return (<p>
                Colis introuvable
            </p>);

    }


    return (

        <div className="space-y-8">


            <PageTitle
                title={`Colis ${parcel.id}`}
                description="Détails du colis au point relais."
            />


            <Section title="Informations colis">

                <div className="space-y-3">

                    <p>
                        Numéro :
                        <strong> {parcel.id}</strong>
                    </p>


                    <p>
                        Expéditeur :
                        <strong> {parcel.sender}</strong>
                    </p>


                    <p>
                        Statut :
                        <strong>
                            {" "}
                            {translateStatus(parcel.status)}
                        </strong>
                    </p>


                    <p>
                        Date :
                        <strong> {parcel.date}</strong>
                    </p>

                </div>

            </Section>


            <Section title="Actions point relais">

                <div className="flex gap-3">

                    <button
                        className="rounded-lg bg-green-600 px-4 py-2"
                    >
                        Confirmer réception
                    </button>


                    <button
                        className="rounded-lg bg-blue-600 px-4 py-2"
                    >
                        Marquer retiré
                    </button>

                </div>

            </Section>


        </div>

    );

}