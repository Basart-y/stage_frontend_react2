"use client";

import {useState} from "react";

import Input from "@/composants/ui/Input";
import Select from "@/composants/ui/Select";
import Textarea from "@/composants/ui/Textarea";
import Section from "@/composants/ui/Section";


export default function InscriptionPointRelaisPage() {


    const [form, setForm] = useState({

        // Compte
        email: "", password: "", confirmPassword: "",


        // Responsable
        firstname: "", lastname: "", phone: "",


        // Point relais
        name: "", structureType: "", address: "", city: "", postalCode: "", country: "France",


        // Gestion
        capacity: "", openingHours: "",


        // Services
        reception: false, withdrawal: false, returnPackage: false,


        // Description
        description: "",

    });


    function handleChange(field, value) {

        setForm((prev) => ({
            ...prev, [field]: value,
        }));

    }


    function validateForm() {


        if (form.password !== form.confirmPassword) {

            alert("Les mots de passe ne correspondent pas.");

            return false;

        }


        return true;

    }


    async function handleSubmit(e) {

        e.preventDefault();


        if (!validateForm()) {
            return;
        }


        // Plus tard :
        // servicePointRelais.createRequest(form)


        console.log("Demande inscription point relais", form);


        alert("Demande d'inscription point relais envoyée (mock)");

    }


    return (

        <main className="min-h-screen bg-slate-950 text-white">


            <div className="mx-auto max-w-4xl px-4 py-16 space-y-8">


                <header className="space-y-2">

                    <h1 className="text-2xl font-semibold">
                        Inscription point relais
                    </h1>


                    <p className="text-sm text-slate-400">
                        Proposez votre établissement comme point relais.
                    </p>

                </header>


                <form
                    onSubmit={handleSubmit}
                    className="space-y-8"
                >


                    <Section title="Compte utilisateur">


                        <div className="grid gap-6 md:grid-cols-2">


                            <Input
                                label="Email"
                                type="email"
                                value={form.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                            />


                            <Input
                                label="Mot de passe"
                                type="password"
                                value={form.password}
                                onChange={(e) => handleChange("password", e.target.value)}
                            />


                            <Input
                                label="Confirmation mot de passe"
                                type="password"
                                value={form.confirmPassword}
                                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                            />


                        </div>


                    </Section>

                    <Section title="Responsable du point relais">


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
                                label="Téléphone"
                                placeholder="06..."
                                value={form.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                            />


                        </div>


                    </Section>


                    <Section title="Informations point relais">


                        <div className="grid gap-6 md:grid-cols-2">


                            <Input
                                label="Nom du point relais"
                                value={form.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                            />


                            <Select
                                label="Type de structure"
                                value={form.structureType}
                                onChange={(e) => handleChange("structureType", e.target.value)}
                            >

                                <option value="">
                                    Sélectionner
                                </option>


                                <option value="COMMERCE">
                                    Commerce
                                </option>


                                <option value="TABAC">
                                    Bureau de tabac
                                </option>


                                <option value="SUPERMARCHE">
                                    Supérette / Supermarché
                                </option>


                                <option value="LIBRAIRIE">
                                    Librairie
                                </option>


                                <option value="AUTRE">
                                    Autre
                                </option>


                            </Select>


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
                                value={form.country}
                                onChange={(e) => handleChange("country", e.target.value)}
                            />


                        </div>


                    </Section>
                    <Section title="Gestion du point relais">


                        <div className="grid gap-6 md:grid-cols-2">


                            <Input
                                label="Capacité maximale de colis"
                                placeholder="Ex : 100"
                                type="number"
                                value={form.capacity}
                                onChange={(e) => handleChange("capacity", e.target.value)}
                            />


                        </div>


                        <Textarea
                            label="Horaires d'ouverture"
                            placeholder="
Lundi : 9h - 18h
Mardi : 9h - 18h
Mercredi : fermé
..."
                            value={form.openingHours}
                            onChange={(e) => handleChange("openingHours", e.target.value)}
                        />


                    </Section>


                    <Section title="Services proposés">


                        <div className="space-y-4">


                            <label className="flex items-center gap-3">

                                <input
                                    type="checkbox"
                                    checked={form.reception}
                                    onChange={(e) => handleChange("reception", e.target.checked)}
                                />

                                <span>
                                    Réception des colis
                                </span>

                            </label>


                            <label className="flex items-center gap-3">

                                <input
                                    type="checkbox"
                                    checked={form.withdrawal}
                                    onChange={(e) => handleChange("withdrawal", e.target.checked)}
                                />

                                <span>
                                    Retrait des colis
                                </span>

                            </label>


                            <label className="flex items-center gap-3">

                                <input
                                    type="checkbox"
                                    checked={form.returnPackage}
                                    onChange={(e) => handleChange("returnPackage", e.target.checked)}
                                />

                                <span>
                                    Gestion des retours
                                </span>

                            </label>


                        </div>


                    </Section>


                    <Section title="Description">


                        <Textarea
                            label="Informations complémentaires"
                            placeholder="Décrivez votre établissement, son accès, ses particularités..."
                            value={form.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                        />


                    </Section>


                    <div className="flex justify-end">


                        <button
                            type="submit"
                            className="
                                rounded-lg
                                bg-blue-600
                                px-6
                                py-3
                                font-medium
                                hover:bg-blue-500
                                transition
                            "
                        >

                            Envoyer la demande

                        </button>


                    </div>


                </form>


            </div>


        </main>

    );


}