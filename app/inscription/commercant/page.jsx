"use client";

import {useState} from "react";

import Input from "@/composants/ui/Input";
import Select from "@/composants/ui/Select";
import Textarea from "@/composants/ui/Textarea";
import Section from "@/composants/ui/Section";

import {serviceCommerce} from "@/services/ServiceCommerce.js";


export default function InscriptionCommercantPage() {


    const [form, setForm] = useState({

        // compte utilisateur
        email: "", password: "", confirmPassword: "", // commerce
        name: "", siret: "", type: "", phone: "",

        address: "", city: "", postalCode: "", country: "France",

        website: "",

        openingHours: "",

        packageVolume: "", // abonnement
        subscriptionType: "", // description
        description: "",
    });


    function handleChange(field, value) {
        setForm((prev) => ({
            ...prev, [field]: value

        }));
    }


    async function handleSubmit(e) {

        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }


        try {
            await serviceCommerce.createRequest(form);
            alert("Demande d'inscription commerçant envoyée au manager.");

        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'envoi de la demande.");
        }

    }

    return (<main className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-3xl px-4 py-16 space-y-8">
            <header className="space-y-2">
                <h1 className="text-2xl font-semibold">
                    Inscription commerçant
                </h1>
                <p className="text-sm text-slate-400">
                    Créez votre compte et soumettez votre commerce à validation.
                </p>
            </header>
            <form onSubmit={handleSubmit} className="space-y-8">
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
                <Section title="Informations commerce">
                    <div className="grid gap-6md:grid-cols-2">
                        <Input
                            label="Nom du commerce"
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

                            <option value="">
                                Sélectionner
                            </option>

                            <option value="COMMERCE_PHYSIQUE">
                                Commerce physique
                            </option>

                            <option value="ECOMMERCE">
                                E-commerce
                            </option>

                            <option value="PRODUCTEUR">
                                Producteur
                            </option>

                            <option value="MOBILE">
                                Marchand mobile
                            </option>

                        </Select>


                        <Input
                            label="Téléphone"
                            placeholder="06..."
                            value={form.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                        />


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
                        <Input
                            label="Site web"
                            placeholder="https://..."
                            value={form.website}
                            onChange={(e) => handleChange("website", e.target.value)}
                        />
                    </div>
                    <Textarea
                        label="Horaires"
                        placeholder="Lundi : 9h-18h Mardi : 9h-18h..."
                        value={form.openingHours}
                        onChange={(e) => handleChange("openingHours", e.target.value)}
                    />
                    <Input
                        label="Volume estimé de colis par mois"
                        type="number"
                        value={form.packageVolume}
                        onChange={(e) => handleChange("packageVolume", e.target.value)}
                    />
                    <Textarea
                        label="Présentation du commerce"
                        placeholder="Présentez votre activité..."
                        value={form.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                    />
                </Section>
                <Section title="Abonnement">
                    <Select
                        label="Mode de facturation"
                        value={form.subscriptionType}
                        onChange={(e) => handleChange("subscriptionType", e.target.value)}
                    >
                        <option value="">
                            Sélectionner
                        </option>
                        <option value="FORFAIT">
                            Abonnement forfaitaire
                        </option>
                        <option value="COMMANDE">
                            Paiement à la commande
                        </option>
                    </Select>
                    {form.subscriptionType === "FORFAIT" && (<div className="mt-6">
                        <Select
                            label="Formule choisie"
                            value={form.subscriptionPlan}
                            onChange={(e) => handleChange("subscriptionPlan", e.target.value)}
                        >

                            <option value="">
                                Sélectionner une formule
                            </option>
                            <option value="ESSENTIEL">
                                Essentiel - 25 colis/mois
                            </option>
                            <option value="PROFESSIONNEL">
                                Professionnel - 150 colis/mois
                            </option>
                            <option value="ENTREPRISE">
                                Entreprise - 500 colis/mois
                            </option>
                        </Select>
                    </div>)}
                </Section>
                <div className="flex justify-end">
                    <button type="submit" className="rounded-lg bg-blue-600 px-6 py-3 font-medium hover:bg-blue-500">
                        Envoyer la demande
                    </button>
                </div>
            </form>
        </div>
    </main>);

}