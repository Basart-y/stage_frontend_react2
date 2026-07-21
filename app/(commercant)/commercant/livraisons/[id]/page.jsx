import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";

const deliveries = [{
    id: "LIV-458",
    destination: "Point Relais Marseille",
    status: "En cours",
    date: "21/07/2026",
    parcels: 12,
    driver: "Jean Martin"
}, {
    id: "LIV-457",
    destination: "Point Relais Aix",
    status: "Terminée",
    date: "20/07/2026",
    parcels: 8,
    driver: "Sophie Bernard"
}, {
    id: "LIV-456",
    destination: "Point Relais Istres",
    status: "Préparation",
    date: "19/07/2026",
    parcels: 5,
    driver: "Non attribué"
}];

export default async function LivraisonDetailPage({params}) {

    const {id} = await params;

    const delivery = deliveries.find((item) => item.id === id);


    if (!delivery) {
        return (<div>
                Livraison introuvable : {id}
            </div>);
    }


    return (<div className="space-y-8">
            <PageTitle
                title={`Livraison ${delivery.id}`}
                description="Détails de la livraison."
            />

            <Section title="Informations">
                <div className="space-y-3">
                    <p>
                        Destination :
                        <strong> {delivery.destination}</strong>
                    </p>

                    <p>
                        Statut :
                        <strong> {delivery.status}</strong>
                    </p>

                    <p>
                        Date :
                        <strong> {delivery.date}</strong>
                    </p>

                    <p>
                        Nombre de colis :
                        <strong> {delivery.parcels}</strong>
                    </p>

                    <p>
                        Livreur :
                        <strong> {delivery.driver}</strong>
                    </p>
                </div>
            </Section>
        </div>);
}