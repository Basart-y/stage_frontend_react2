import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";


export default function ConfigurationPage() {


    return (<div className="space-y-8">
            <PageTitle
                title="Configuration"
                description="Paramètres généraux de la plateforme."
            />
            <Section title="Paramètres">
                <ul className="space-y-3">
                    <li>
                        Durée avant retour colis : 14 jours
                    </li>
                    <li>
                        Abonnement forfaitaire activé
                    </li>
                    <li>
                        Paiement à la commande activé
                    </li>
                </ul>
            </Section>
        </div>);
}