"use client";

import {useState} from "react";
import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import Input from "@/composants/ui/Input";
import Textarea from "@/composants/ui/Textarea";

export default function CommercantProfilPage() {
    const [form, setForm] = useState({
        firstname: "Jean",
        lastname: "Dupont",
        email: "jean.dupont@example.com",
        phone: "06...",
        commerceName: "Mon commerce",
        commerceType: "Commerce physique",
        description: "",
    });

    function handleChange(field, value) {
        setForm((prev) => ({...prev, [field]: value}));
    }

    async function handleSave(e) {
        e.preventDefault();
        // plus tard : await userService.updateProfile(form);
        alert("Profil commerçant enregistré (mock)");
    }

    return (<div className="space-y-8">
        <PageTitle
            title="Profil commerçant"
            description="Paramètres de votre compte et informations personnelles."
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
            <Section title="Commerce associé">
                <div className="grid gap-6 md:grid-cols-2">
                    <Input
                        label="Nom du commerce"
                        value={form.commerceName}
                        onChange={(e) => handleChange("commerceName", e.target.value)}
                    />
                    <Input
                        label="Type de commerce"
                        value={form.commerceType}
                        onChange={(e) => handleChange("commerceType", e.target.value)}
                    />
                </div>
                <Textarea
                    label="Description du commerce"
                    placeholder="Présentez rapidement votre activité..."
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