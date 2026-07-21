"use client";

import {useState} from "react";
import PageTitle from "@/composants/ui/PageTitle";
import {translateStatus} from "@/utils/statusLabels";


const relayPoints = [{
    id: 1, name: "Relay Istres", status: "ACTIVE"
}, {
    id: 2, name: "Relay Aix", status: "VACATION"
}, {
    id: 3, name: "Relay Marseille", status: "INCIDENT"
}];


export default function RelayManagement() {

    const [data, setData] = useState(relayPoints);


    function changeStatus(id, status) {

        setData(data.map(item => item.id === id ? {
            ...item, status
        } : item));

    }


    return (<div className="space-y-8">

            <PageTitle
                title="Points relais"
                description="Gestion des états des points relais."
            />


            <div className="space-y-4">

                {data.map(point => (

                    <div
                        key={point.id}
                        className="rounded-xl border border-slate-800 bg-slate-900 p-5 flex justify-between items-center"
                    >

                        <div>

                            <h3 className="font-semibold">
                                {point.name}
                            </h3>


                            <p className="text-slate-400">
                                {translateStatus(point.status)}
                            </p>

                        </div>


                        <select
                            value={point.status}
                            onChange={(e) => changeStatus(point.id, e.target.value)}
                            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2"
                        >

                            <option value="ACTIVE">
                                Actif
                            </option>

                            <option value="VACATION">
                                En pause
                            </option>

                            <option value="INCIDENT">
                                Incident
                            </option>

                            <option value="SUSPENDED">
                                Suspendu
                            </option>

                        </select>

                    </div>

                ))}

            </div>

        </div>);

}