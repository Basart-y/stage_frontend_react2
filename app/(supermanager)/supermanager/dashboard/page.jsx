import PageTitle from "@/composants/ui/PageTitle";
import GrillesStatistiques from "@/composants/TableauDeBord/GrillesStatistiques.jsx";
import ActionsRapides from "@/composants/TableauDeBord/ActionsRapides.jsx";


const stats = [

    {
        label: "Managers", value: 8
    },

    {
        label: "Commerces", value: 250
    },

    {
        label: "Points relais", value: 95
    },

    {
        label: "Livraisons", value: 1500
    }

];


const actions = [{
    label: "Créer manager",

    href: "/supermanager/managers/create",

    description: "Ajouter un responsable"
}, {
    label: "Gestion managers",

    href: "/supermanager/managers",

    description: "Administrer les comptes"
}, {
    label: "Statistiques",

    href: "/supermanager/statistiques",

    description: "Voir les indicateurs"
}];


export default function SuperManagerDashboardPage() {

    return (<section className="space-y-8">
            <PageTitle title="Espace SuperManager" description="Administration globale de la plateforme."/>
            <GrillesStatistiques stats={stats}/>
            <ActionsRapides actions={actions}/>
        </section>

    );


}