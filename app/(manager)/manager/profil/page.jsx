"use client";

import {useState} from "react";
import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import Input from "@/composants/ui/Input";
import Textarea from "@/composants/ui/Textarea";
import Alert from "@/composants/ui/Alert";
import ActionButton from "@/composants/ui/ActionButton";

export default function ManagerProfilPage() {
    const [form, setForm] = useState({
        firstname: "Paul",
        lastname: "Martin",
        email: "paul.martin@example.com",
        phone: "06...",
        region: "Provence-Alpes-Côte d'Azur",
        notes: "",
    });
    const [saved, setSaved] = useState(false);

    function handleChange(field, value) {
        setSaved(false);
        setForm((prev) => ({...prev, [field]: value}));
    }

    function handleSave(e) {
        e.preventDefault();
        setSaved(true);
    }

    return <div className="space-y-8">
        <PageTitle title="Profil manager" description="Gérez les informations utilisées dans votre espace de supervision."/>
        {saved && <Alert type="success" message="Profil manager enregistré pour la démonstration."/>}
        <form onSubmit={handleSave} className="space-y-6">
            <Section title="Informations personnelles">
                <div className="grid gap-5 md:grid-cols-2">
                    <Input label="Prénom" value={form.firstname} onChange={(e) => handleChange("firstname", e.target.value)}/>
                    <Input label="Nom" value={form.lastname} onChange={(e) => handleChange("lastname", e.target.value)}/>
                    <Input label="Email" type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)}/>
                    <Input label="Téléphone" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)}/>
                </div>
            </Section>
            <Section title="Zone de gestion">
                <div className="space-y-5">
                    <Input label="Région / Zone" value={form.region} onChange={(e) => handleChange("region", e.target.value)}/>
                    <Textarea label="Notes internes" placeholder="Informations utiles sur votre périmètre..." value={form.notes} onChange={(e) => handleChange("notes", e.target.value)}/>
                </div>
            </Section>
            <div className="flex justify-end"><ActionButton type="submit">Enregistrer</ActionButton></div>
        </form>
    </div>;
}
