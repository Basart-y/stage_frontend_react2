"use client";

import {useEffect, useState} from "react";
import {useParams} from "next/navigation";

import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";

import {serviceManager} from "@/services/ServiceManager.js";
import {translateStatus} from "@/utils/statusLabels";


export default function ShopRequestDetailPage() {

    const params = useParams();
    const id = params.id;
    const [request, setRequest] = useState(null);
    useEffect(() => {
        if (!id) return;
        serviceManager
            .getShopRequestById(id)
            .then(setRequest);
    }, [id]);
    return (

        <div className="space-y-8">
            <PageTitle
                title={`Demande commerce : ${request.name}`}
                description="Détail de la demande d'inscription."
            />
            <Section title="Informations commerce">
                <p>
                    Type : {request.type}
                </p>
                <p>
                    Ville : {request.city}
                </p>
                <p>
                    Statut : {translateStatus(request.status)}
                </p>
            </Section>


            <Section title="Coordonnées">
                <p>
                    Contact : {request.contactName}
                </p>
                <p>
                    Email : {request.email}
                </p>
                <p>
                    Téléphone : {request.phone}
                </p>
            </Section>

            <div className="flex gap-3">
                <button className="rounded-lg bg-green-600 px-4 py-2">
                    Valider
                </button>
                <button className="rounded-lg bg-red-600 px-4 py-2">
                    Refuser
                </button>
                <button className="rounded-lg bg-slate-600 px-4 py-2">
                    Demander plus d&apos;infos
                </button>
            </div>
        </div>);
}