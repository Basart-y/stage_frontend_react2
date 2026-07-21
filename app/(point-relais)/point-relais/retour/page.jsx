"use client";


import {useState} from "react";


import PageTitle from "@/composants/ui/PageTitle";

import Section from "@/composants/ui/Section";

import Input from "@/composants/ui/Input";

import Textarea from "@/composants/ui/Textarea";


import {serviceColis} from "@/services/ServiceColis.js";


export default function RetourPage() {


    const [id, setId] = useState("");

    const [reason, setReason] = useState("");


    async function sendReturn() {
        await serviceColis.returnParcel(id, {
            reason
        });
        alert("Retour enregistré");
    }

    return (<div className="space-y-8">
            <PageTitle
                title="Retour colis"
                description="Retour vers le commerçant."
            />
            <Section title="Colis">
                <Input
                    label="Référence"
                    onChange={e => setId(e.target.value)}
                />
            </Section>
            <Section title="Motif">
                <Textarea
                    label="Explication"
                    placeholder="Client non venu après délai..."
                />
            </Section>
            <button
                onClick={sendReturn}
                className="bg-red-600 px-6 py-3rounded-lg"
            >
                Déclarer retour
            </button>
        </div>

    );


}