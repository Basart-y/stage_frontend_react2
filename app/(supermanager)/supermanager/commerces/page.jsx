"use client";


import {useRouter} from "next/navigation";


import PageTitle from "@/composants/ui/PageTitle";
import TableauDonnees from "@/composants/table/TableauDonnees.jsx";


const shops = [


    {
        id: 1,
        name: "Boutique Provence",
        type: "PHYSICAL",
        status: "ACTIVE",
        city: "Istres",
        email: "contact@boutiqueprovence.fr"
    },


    {
        id: 2, name: "E-Shop", type: "ECOMMERCE", status: "ACTIVE", city: "Marseille", email: "contact@eshop.fr"
    },


    {
        id: 3,
        name: "Producteur Local",
        type: "PRODUCTEUR",
        status: "PENDING",
        city: "Aix-en-Provence",
        email: "contact@producteur.fr"
    }


];


const typeLabels = {

    PHYSICAL: "Commerce physique",

    ECOMMERCE: "E-commerce",

    PRODUCTEUR: "Producteur",

    MOBILE: "Marchand mobile"

};


const statusLabels = {


    ACTIVE: "Actif",

    PENDING: "En attente",

    SUSPENDED: "Suspendu",

    REFUSED: "Refusé"


};


export default function ShopsPage() {


    const router = useRouter();
    return (<div className="space-y-8">
            <PageTitle
                title="Commerces"
                description="Vue globale des commerces inscrits."
            />
            <TableauDonnees
                columns={[{
                    key: "name", label: "Nom"
                },

                    {
                        key: "type", label: "Type", render: (row) => typeLabels[row.type] ?? row.type

                    }, {
                        key: "city", label: "Ville"
                    }, {
                        key: "status",

                        label: "Etat",

                        render: (row) => (

                            <span className="
                                rounded-full
                                bg-slate-800
                                px-3
                                py-1
                                text-sm
                            ">
                                {statusLabels[row.status] ?? row.status}
                            </span>)
                    }, {
                        key: "actions", label: "Actions", render: (row) => (<button className=" text-blue-400underline
                                " onClick={() => router.push(`/supermanager/commerces/${row.id}`)}
                            >
                                Voir détail
                            </button>)
                    }]}
                data={shops}
            />
        </div>);
}