"use client";


import {
    useParams,
    useRouter
}
    from "next/navigation";


import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";



const relayPoints=[


    {
        id:1,

        name:"Tabac du Centre",

        city:"Istres",

        address:"12 rue de la République",

        status:"ACTIVE",

        manager:"Jean Martin"

    },


    {
        id:2,

        name:"Relais Express",

        city:"Marseille",

        address:"25 avenue du Prado",

        status:"ACTIVE",

        manager:"Sophie Bernard"

    },


    {
        id:3,

        name:"Point Relais Centre",

        city:"Aix-en-Provence",

        address:"8 rue Nationale",

        status:"PENDING",

        manager:"Non attribué"

    }


];



const statusLabel={


    ACTIVE:"Actif",

    INACTIVE:"Inactif",

    PENDING:"En attente",

    SUSPENDED:"Suspendu"


};



export default function RelayDetailPage(){


    const params = useParams();

    const router = useRouter();



    const relay =
        relayPoints.find(

            item =>
                item.id == params.id

        );



    if(!relay){

        return (

            <div>

                Point relais introuvable

            </div>

        );

    }



    return (


        <div className="space-y-8">


            <PageTitle

                title={`Point relais : ${relay.name}`}

                description="Informations détaillées du point relais."

            />



            <Section title="Informations">


                <div className="space-y-3">


                    <p>
                        <strong>Nom :</strong> {relay.name}
                    </p>


                    <p>
                        <strong>Ville :</strong> {relay.city}
                    </p>


                    <p>
                        <strong>Adresse :</strong> {relay.address}
                    </p>


                    <p>
                        <strong>Statut :</strong> {statusLabel[relay.status]}
                    </p>


                    <p>
                        <strong>Manager :</strong> {relay.manager}
                    </p>


                </div>


            </Section>









            <button

                onClick={()=>router.back()}

                className="
            rounded-lg
            bg-slate-700
            px-5
            py-3
            "

            >

                Retour

            </button>


        </div>


    );


}