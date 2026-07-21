"use client";

import {useState} from "react";

import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import Input from "@/composants/ui/Input";
import Textarea from "@/composants/ui/Textarea";

import {serviceColis} from "@/services/ServiceColis.js";

export default function ReceptionPage() {

    const [parcelId, setParcelId] = useState("");
    const [comment, setComment] = useState("");
    const [mode, setMode] = useState("manual");

    async function receive() {

        await serviceColis.receive(parcelId, {
            comment
        });

        alert("Colis réceptionné (mock)");

    }

    return (<div className="space-y-8">

            <PageTitle
                title="Réception colis"
                description="Enregistrez l'arrivée d'un colis au point relais."
            />

            <Section title="Mode de réception">

                <div className="flex gap-4">

                    <button
                        onClick={() => setMode("manual")}
                        className={`
                            rounded-lg
                            px-5
                            py-3
                            ${mode === "manual" ? "bg-green-600" : "bg-slate-800"}
                        `}
                    >
                        Réception manuelle
                    </button>

                    <button
                        onClick={() => setMode("qr")}
                        className={`
                            rounded-lg
                            px-5
                            py-3
                            ${mode === "qr" ? "bg-green-600" : "bg-slate-800"}
                        `}
                    >
                        Scanner QR Code
                    </button>

                </div>

            </Section>

            {mode === "manual" && (<Section title="Identification du colis">

                    <Input
                        label="Référence colis"
                        placeholder="COL-1001"
                        value={parcelId}
                        onChange={(e) => setParcelId(e.target.value)}
                    />

                </Section>)}

            {mode === "qr" && (<Section title="Scanner le QR Code">

                    <div
                        className="
                                mx-auto
                                flex
                                h-64
                                w-full
                                max-w-md
                                items-center
                                justify-center
                                rounded-2xl
                                border-2
                                border-dashed
                                border-green-500
                                bg-slate-900
                            "
                    >

                        <div className="text-center space-y-3">

                            <div
                                className="
                                        mx-auto
                                        flex
                                        h-20
                                        w-20
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-green-600/20
                                        text-4xl
                                    "
                            >
                                ▦
                            </div>

                            <p className="text-slate-300">
                                Scanner le QR code du colis
                            </p>

                        </div>

                    </div>

                </Section>)}

            <Section title="Commentaire">

                <Textarea
                    label="Observation"
                    placeholder="Colis reçu sans anomalie..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

            </Section>

            <button
                onClick={receive}
                className="
                    rounded-lg
                    bg-green-600
                    px-6
                    py-3
                    font-medium
                    hover:bg-green-500
                "
            >
                Valider réception
            </button>

        </div>);

}