import PageTitle from "@/composants/ui/PageTitle";

import GrillesStatistiques from "@/composants/TableauDeBord/GrillesStatistiques.jsx";


const stats = [

    {
        label: "Livraisons totales", value: "15 420"
    }, {
        label: "Retours", value: "125"
    }, {
        label: "Incidents", value: "42"
    }, {
        label: "Points relais", value: "267"
    }];


export default function StatisticsPage() {
    return (<div className="space-y-8">
            <PageTitle
                title="Statistiques"
                description="Indicateurs globaux de performance."
            />
            <GrillesStatistiques
                stats={stats}
            />
        </div>

    );


}