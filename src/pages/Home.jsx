import { ArrowRight, Package, MapPinned, Truck, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";

const features = [
    {
        icon: MapPinned,
        title: "Points relais",
        desc: "Gérez facilement les points relais et leur état.",
    },
    {
        icon: Package,
        title: "Colis",
        desc: "Suivez les réceptions, retraits et retours.",
    },
    {
        icon: Truck,
        title: "Flux logistique",
        desc: "Visualisez le parcours complet des colis.",
    },
    {
        icon: BarChart3,
        title: "Tableau de bord",
        desc: "Accédez rapidement aux principales fonctionnalités de l'application.",
    },
];

export default function Home() {
    return (
        <div className="space-y-8">
            <Card className="p-8 lg:p-12">
                <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                    <div className="space-y-6">
                        <h2 className="text-4xl lg:text-6xl font-semibold leading-tight">
                            Simplifiez la gestion de vos points relais
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link to="/login">
                                <Button className="w-full sm:w-auto">
                                    Se connecter
                                    <ArrowRight size={16} />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {features.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Card key={item.title} className="p-5 bg-white/5">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4F8CFF]/15 text-[#7fb0ff]">
                                        <Icon size={22} />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                                    <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
                                </Card>
                            );
                        })}
                    </div> {/* Affichage des différents composants créer au début dans features*/}
                </div>
            </Card>

        </div>
    );
}