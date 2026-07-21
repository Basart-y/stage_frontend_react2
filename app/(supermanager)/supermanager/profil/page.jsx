"use client";

import {useState} from "react";
import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import Input from "@/composants/ui/Input";
import Textarea from "@/composants/ui/Textarea";

export default function SuperManagerProfilPage() {
    const [form, setForm] = useState({
        firstname: "Admin",
        lastname: "Principal",
        email: "supermanager@example.com",
        phone: "06...",
        role: "SUPER_MANAGER",
        notes: "",
    });

    function handleChange(field, value) {
        setForm((prev) => ({...prev, [field]: value}));
    }

    async function handleSave(e) {
        e.preventDefault();
        alert("Profil SuperManager enregistré (mock)");
    }

    return (<div className="space-y-8">
            <PageTitle
                title="Profil SuperManager"
                description="Paramètres du compte administrateur de la plateforme."
            />

            <form onSubmit={handleSave} className="space-y-8">
                <Section title="Informations administrateur">
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

                <Section title="Informations de rôle">
                    <Input label="Rôle" value={form.role} disabled/>

                    <Textarea
                        label="Notes administrateur"
                        placeholder="Notes sur la plateforme, politiques, etc."
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