"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";

import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import Input from "@/composants/ui/Input";
import Select from "@/composants/ui/Select";
import ActionButton from "@/composants/ui/ActionButton";

import {serviceSuperManager} from "@/services/ServiceSuperManager.js";

export default function CreateManagerPage() {

    const router = useRouter();

    const [form, setForm] = useState({
        firstName: "", lastName: "", email: "", phone: "", city: "", sector: "", scopeLevel: "departement", scopeValue: "Bouches-du-Rhône"
    });

    function update(field, value) {
        setForm({
            ...form, [field]: value
        });
    }


    async function submit() {

        await serviceSuperManager.createManager(form);
        router.push("/supermanager/managers");
    }


    return (<div className="space-y-8">

        <PageTitle title="Créer un manager" description="Ajouter un nouveau manager."/>

        <Section title="Informations manager">
            <div className="space-y-4">
                <Input
                    label="Prénom"
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                />
                <Input
                    label="Nom"
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                />
                <Input
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                />


                <Input
                    label="Téléphone"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                />


                <Input
                    label="Ville"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                />


                <Input
                    label="Secteur"
                    placeholder="Ex : Marseille Nord"
                    value={form.sector}
                    onChange={(e) => update("sector", e.target.value)}
                />
                <Select label="Niveau du périmètre" value={form.scopeLevel} onChange={(e)=>update("scopeLevel",e.target.value)}>
                    <option value="ville">Ville</option><option value="departement">Département</option><option value="pays">Pays</option>
                </Select>
                {form.scopeLevel !== "pays" && <Input label="Valeur du périmètre" placeholder={form.scopeLevel === "ville" ? "Ex : Marseille" : "Ex : Bouches-du-Rhône"} value={form.scopeValue} onChange={(e)=>update("scopeValue",e.target.value)}/>}

                <ActionButton color="blue" onClick={submit}>
                    Créer le manager
                </ActionButton>
            </div>
        </Section>

    </div>);

}