import PageTitle from "@/composants/ui/PageTitle";
import GrillesStatistiques from "@/composants/TableauDeBord/GrillesStatistiques.jsx";
import ActionsRapides from "@/composants/TableauDeBord/ActionsRapides.jsx";


const stats = [

    {
        label: "Colis en attente", value: 12
    },

    {
        label: "Colis reçus aujourd'hui", value: 8
    },

    {
        label: "Colis retirés", value: 20
    }

];


const actions = [

    {
        label: "Réception colis", href: "/point-relais/reception", description: "Scanner ou saisir un colis"
    },

    {
        label: "Remise client", href: "/point-relais/retrait", description: "Valider un retrait"
    },

    {
        label: "Retour colis", href: "/point-relais/retour", description: "Retour commerçant"
    }

];


export default function PointRelaisDashboardPage() {


    return (

        <section className="space-y-8">


            <PageTitle

                title="Espace Responsable Point Relais"

                description="Gestion des colis et opérations quotidiennes."

            />


            <GrillesStatistiques

                stats={stats}

            />


            <ActionsRapides

                actions={actions}

            />


        </section>

    );

}