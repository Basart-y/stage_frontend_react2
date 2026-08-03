"use client";

import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";

import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";

import {serviceSuperManager} from "@/services/ServiceSuperManager.js";


export default function ManagerDetailPage() {

    const params = useParams();
    const router = useRouter();
    const [manager, setManager] = useState(null);
    useEffect(() => {
        if (!params.id) {
            return;
        }
        serviceSuperManager
            .getManagerById(params.id)
            .then(setManager);
    }, [params.id]);


    function changeStatus(status) {

        // Plus tard :
        // serviceSuperManager.updateStatus(manager.id,status)
        console.log("Nouveau statut", status);
        alert(`Statut modifié : ${status}`);
    }


    function deleteManager() {


        const confirmed = window.confirm("Supprimer définitivement ce manager ?");
        if (!confirmed) {
            return;
        }
        // Plus tard :
        // serviceSuperManager.deleteManager(manager.id)
        router.push("/supermanager/managers");

    }


    return (<div className="space-y-8">
            <PageTitle title="Détail du manager" description="Informations et administration du compte."/>
            <Section title="Informations du compte">

                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <p className="text-sm text-slate-600">
                            Prénom
                        </p>
                        <p className="font-medium">
                            {manager.firstname}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-600">
                            Nom
                        </p>

                        <p className="font-medium">
                            {manager.lastname}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-600">
                            Email
                        </p>
                        <p className="font-medium">
                            {manager.email}
                        </p>

                    </div>

                    <div>
                        <p className="text-sm text-slate-600">
                            Statut
                        </p>
                        <span
                            className={`inline-block rounded-full px-3 py-1 text-xs ${manager.status === "ACTIVE" ? "bg-green-500/20 text-green-700" : "bg-red-500/20 text-red-700"}`}>
                            {manager.status}
                        </span>

                    </div>


                    <div>
                        <p className="text-sm text-slate-600">
                            Région
                        </p>
                        <p className="font-medium">
                            {manager.region ?? "Non renseignée"}
                        </p>

                    </div>


                </div>


            </Section>


            <Section title="Actions administrateur">
                <div className="flex flex-wrap gap-4">
                    <button className="rounded-lg bg-green-600 px-5 py-2 hover:bg-green-500"
                            onClick={() => changeStatus("ACTIVE")}
                    >
                        Activer
                    </button>

                    <button className="rounded-lg bg-yellow-600 px-5 py-2 hover:bg-yellow-500"
                            onClick={() => changeStatus("INACTIVE")}
                    >
                        Désactiver
                    </button>

                    <button
                        className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
                        onClick={() => alert("Modification manager (mock)")}
                    >
                        Modifier
                    </button>

                    <button
                        className="rounded-lg bg-red-600 px-5 py-2 hover:bg-red-500/100"
                        onClick={deleteManager}>
                        Supprimer
                    </button>
                </div>
            </Section>
        </div>);
}