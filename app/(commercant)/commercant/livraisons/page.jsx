import Link from "next/link";
import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";

const deliveries = [{
    id: "LIV-458", destination: "Point Relais Marseille", status: "En cours"
}, {
    id: "LIV-457", destination: "Point Relais Aix", status: "Terminée"
}, {
    id: "LIV-456", destination: "Point Relais Istres", status: "Préparation"
}];

export default function LivraisonsPage() {
    return (<div className="space-y-8">
            <PageTitle
                title="Mes livraisons"
                description="Toutes vos livraisons."
            />

            <Section title="Liste">
                <div className="space-y-3">
                    {deliveries.map((delivery) => (<div
                            key={delivery.id}
                            className="rounded-lg border border-slate-800 p-4 flex justify-between items-center"
                        >
                            <div>
                                <h3 className="font-semibold">
                                    {delivery.id}
                                </h3>

                                <p className="text-sm text-slate-400">
                                    {delivery.destination}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <span>
                                    {delivery.status}
                                </span>

                                <Link
                                    href={`/commercant/livraisons/${delivery.id}`}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm hover:bg-blue-500"
                                >
                                    Détail
                                </Link>
                            </div>
                        </div>))}
                </div>
            </Section>
        </div>);
}