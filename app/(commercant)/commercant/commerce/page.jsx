"use client";

import {useState} from "react";
import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import Input from "@/composants/ui/Input";
import Select from "@/composants/ui/Select";
import Textarea from "@/composants/ui/Textarea";

export default function CommercePage() {
    const [form, setForm] = useState({
        name: "",
        siret: "",
        type: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        country: "France",
        description: "",
    });

    function handleChange(field, value) {
        setForm((prev) => ({...prev, [field]: value}));
    }

    async function handleSave(e) {
        e.preventDefault();
        //plus tard await serviceCommerce.save(form);
        alert("Commerce enregistré (mock)");
    }

    return (<div className="space-y-8">
        <PageTitle
            title="Mon commerce"
            description="Création ou modification des informations de votre commerce."
        />

        <form onSubmit={handleSave} className="space-y-8">
            <Section title="Informations générales">
                <div className="grid gap-6 md:grid-cols-2">
                    <Input
                        label="Nom du commerce"
                        placeholder="Mon commerce"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                    />
                    <Input
                        label="SIRET"
                        placeholder="00000000000000"
                        value={form.siret}
                        onChange={(e) => handleChange("siret", e.target.value)}
                    />
                    <Select
                        label="Type de commerce"
                        value={form.type}
                        onChange={(e) => handleChange("type", e.target.value)}
                    >
                        <option value="">Sélectionnez un type</option>
                        <option>Commerce physique</option>
                        <option>E-commerce</option>
                        <option>Producteur</option>
                        <option>Marchand mobile</option>
                    </Select>
                    <Input
                        label="Téléphone"
                        placeholder="06..."
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                    />
                </div>
            </Section>

            <Section title="Adresse">
                <div className="grid gap-6 md:grid-cols-2">
                    <Input
                        label="Adresse"
                        value={form.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                    />
                    <Input
                        label="Ville"
                        value={form.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                    />
                    <Input
                        label="Code postal"
                        value={form.postalCode}
                        onChange={(e) => handleChange("postalCode", e.target.value)}
                    />
                    <Input
                        label="Pays"
                        placeholder="France"
                        value={form.country}
                        onChange={(e) => handleChange("country", e.target.value)}
                    />
                </div>
            </Section>

            <Section title="Description">
                <Textarea
                    label="Présentation"
                    placeholder="Présentez votre commerce..."
                    value={form.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                />
            </Section>

            <div className="flex justify-end">
                <button type="submit" className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700">
                    Enregistrer
                </button>
            </div>
        </form>
    </div>);
}