import PageTitle from "@/composants/ui/PageTitle";
import GrillesStatistiques from "@/composants/TableauDeBord/GrillesStatistiques.jsx";
import ActionsRapides from "@/composants/TableauDeBord/ActionsRapides.jsx";


const stats = [

    {
        label: "Demandes commerces", value: 15
    }, {
        label: "Points relais actifs", value: 42
    }, {
        label: "Livraisons aujourd'hui", value: 120
    }];


const actions = [{
    label: "Demandes commerces", href: "/manager/demandes-commerces", description: "Valider les inscriptions"
}, {
    label: "Points relais", href: "/manager/points-relais", description: "Gérer les relais"
}, {
    label: "Livraisons", href: "/manager/livraisons", description: "Suivi global"
}];


export default function ManagerDashboardPage() {
    return (<section className="space-y-8">
            <PageTitle
                title="Espace Manager"
                description="Gestion des commerces, points relais et livraisons."
            />
            <GrillesStatistiques stats={stats}/>
            <ActionsRapides actions={actions}/>
        </section>);
}