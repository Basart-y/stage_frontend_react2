"use client";

import {useState} from "react";
import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import Input from "@/composants/ui/Input";
import Textarea from "@/composants/ui/Textarea";

export default function PointRelaisProfilPage() {
    const [form, setForm] = useState({
        firstname: "Marie",
        lastname: "Durand",
        email: "marie.durand@example.com",
        phone: "06...",
        relayName: "Point relais Demo",
        relayAddress: "12 rue de la Poste",
        relayCity: "Marseille",
        relayStatus: "ACTIF",
        notes: "",
    });

    function handleChange(field, value) {
        setForm((prev) => ({...prev, [field]: value}));
    }

    async function handleSave(e) {
        e.preventDefault();
        // plus tard : userService.updateProfile(form);
        alert("Profil point relais enregistré (mock)");
    }

    return (<div className="space-y-8">
            <PageTitle
                title="Profil responsable point relais"
                description="Paramètres du compte et informations du point relais."
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

                <Section title="Point relais">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Input
                            label="Nom du point relais"
                            value={form.relayName}
                            onChange={(e) => handleChange("relayName", e.target.value)}
                        />
                        <Input
                            label="Adresse"
                            value={form.relayAddress}
                            onChange={(e) => handleChange("relayAddress", e.target.value)}
                        />
                        <Input
                            label="Ville"
                            value={form.relayCity}
                            onChange={(e) => handleChange("relayCity", e.target.value)}
                        />
                        <Input
                            label="Statut"
                            value={form.relayStatus}
                            onChange={(e) => handleChange("relayStatus", e.target.value)}
                        />
                    </div>

                    <Textarea
                        label="Notes internes"
                        placeholder="Notes sur le fonctionnement du point relais..."
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