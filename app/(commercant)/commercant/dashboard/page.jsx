"use client";

import PageTitle from "@/composants/ui/PageTitle";

import GrillesStatistiques from "@/composants/TableauDeBord/GrillesStatistiques.jsx";
import ActionsRapides from "@/composants/TableauDeBord/ActionsRapides.jsx";


const stats = [

    {
        label: "Livraisons en cours", value: 12
    },

    {
        label: "Colis à préparer", value: 5
    },

    {
        label: "Abonnement actuel", value: "Professionnel"
    },

    {
        label: "Colis utilisés", value: "34 / 100"
    }

];


const actions = [

    {
        label: "Créer une livraison",

        description: "Planifier un nouvel envoi vers un point relais",

        href: "/commercant/planification"
    },


    {
        label: "Suivre mes colis",

        description: "Consulter l'état de vos expéditions",

        href: "/commercant/suivi"
    },


    {
        label: "Gérer mon abonnement",

        description: "Modifier votre formule",

        href: "/commercant/abonnements"
    },


];


export default function Dashboard() {


    return (

        <div className="space-y-8">


            <PageTitle

                title="Espace Commerçant"

                description="
                Gérez vos livraisons, vos colis et votre abonnement RelayFlow.
                "

            />


            <GrillesStatistiques

                stats={stats}

            />


            <ActionsRapides

                actions={actions}

            />


        </div>

    );

}