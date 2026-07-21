"use client";

import {useState} from "react";
import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import Input from "@/composants/ui/Input";
import Textarea from "@/composants/ui/Textarea";

export default function ManagerProfilPage() {
    const [form, setForm] = useState({
        firstname: "Paul",
        lastname: "Martin",
        email: "paul.martin@example.com",
        phone: "06...",
        region: "Provence-Alpes-Côte d'Azur",
        notes: "",
    });

    function handleChange(field, value) {
        setForm((prev) => ({...prev, [field]: value}));
    }

    async function handleSave(e) {
        e.preventDefault();
        alert("Profil manager enregistré (mock)");
    }

    return (<div className="space-y-8">
            <PageTitle
                title="Profil manager"
                description="Paramètres du compte manager et informations personnelles."
            />

            <form onSubmit={handleSave} className="space-y-8">
                <Section title="Informations personnelles">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Input
                            label="Prénom"
                            value={form.firstname}
                            onChange={(e) => handleChange("firstname", e.target.value)}
                        />
                        <Input
                            label="Nom"
                            value={form.lastname}
                            onChange={(e) => handleChange("lastname", e.target.value)}
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={form.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                        />
                        <Input
                            label="Téléphone"
                            value={form.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                        />
                    </div>
                </Section>

                <Section title="Zone de gestion">
                    <Input
                        label="Région / Zone"
                        value={form.region}
                        onChange={(e) => handleChange("region", e.target.value)}
                    />

                    <Textarea
                        label="Notes internes"
                        placeholder="Infos sur les points relais / commerces suivis..."
                        value={form.notes}
                        onChange={(e) => handleChange("notes", e.target.value)}
                    />
                </Section>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="rounded-lg bg-blue-600 px-6 py-3 font-medium"
                    >
                        Enregistrer
                    </button>
                </div>
            </form>
        </div>);
}