"use client";

import Link from "next/link";
import {useState} from "react";
import {ArrowLeft} from "lucide-react";

import Input from "@/composants/ui/Input";
import Select from "@/composants/ui/Select";
import Textarea from "@/composants/ui/Textarea";
import Section from "@/composants/ui/Section";
import Alert from "@/composants/ui/Alert";
import ActionButton from "@/composants/ui/ActionButton";
import {serviceRegistrationRequests} from "@/services/ServiceRegistrationRequests.js";
import {DEPARTEMENTS_FRANCE,departementParCode,departementPourVille,codePourDepartement} from "@/donnees/geographieFrance.js";

export default function InscriptionCommercantPage() {
    const [form, setForm] = useState({
        email: "", password: "", confirmPassword: "",
        name: "", siret: "", type: "", phone: "",
        address: "", city: "", department: "", postalCode: "", country: "France",
        website: "", openingHours: "", packageVolume: "",
        subscriptionType: "", subscriptionPlan: "", description: "",
    });
    const [feedback, setFeedback] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    function handleChange(field, value) {
        setForm((prev) => ({...prev, [field]: value}));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setFeedback(null);
        if (form.password !== form.confirmPassword) {
            setFeedback({type: "error", message: "Les mots de passe ne correspondent pas."});
            return;
        }
        try {
            setSubmitting(true);
            await serviceRegistrationRequests.create({role: "commercant", ...form});
            setFeedback({type: "success", message: "Votre demande a bien été envoyée. Elle va être traitée."});
        } catch (error) {
            console.error(error);
            setFeedback({type: "error", message: "Impossible d’envoyer la demande d’inscription pour le moment."});
        } finally {
            setSubmitting(false);
        }
    }

    return (<main className="min-h-screen bg-slate-50 px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
            <div>
                <Link href="/inscription" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-950"><ArrowLeft size={16}/> Choix du compte</Link>
                <div className="mt-6">
                    <p className="text-sm font-bold uppercase tracking-[0.12em] text-blue-700">Compte commerçant</p>
                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">Demande d’inscription</h1>
                    <p className="mt-3 max-w-2xl leading-7 text-slate-700">Renseignez votre compte, votre commerce et votre mode de facturation. La demande sera ensuite traitée.</p>
                </div>
            </div>

            {feedback && <Alert type={feedback.type} message={feedback.message}/>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <Section title="Compte utilisateur">
                    <div className="grid gap-5 md:grid-cols-2">
                        <Input label="Email" type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} required/>
                        <Input label="Mot de passe" type="password" value={form.password} onChange={(e) => handleChange("password", e.target.value)} required/>
                        <Input label="Confirmation du mot de passe" type="password" value={form.confirmPassword} onChange={(e) => handleChange("confirmPassword", e.target.value)} required/>
                    </div>
                </Section>

                <Section title="Informations du commerce">
                    <div className="grid gap-5 md:grid-cols-2">
                        <Input label="Nom du commerce" value={form.name} onChange={(e) => handleChange("name", e.target.value)} required/>
                        <Input label="SIRET" placeholder="00000000000000" value={form.siret} onChange={(e) => handleChange("siret", e.target.value)} required/>
                        <Select label="Type de commerce" value={form.type} onChange={(e) => handleChange("type", e.target.value)} required>
                            <option value="">Sélectionner</option><option value="COMMERCE_PHYSIQUE">Commerce physique</option><option value="ECOMMERCE">E-commerce</option><option value="PRODUCTEUR">Producteur</option><option value="MOBILE">Marchand mobile</option>
                        </Select>
                        <Input label="Téléphone" placeholder="06..." value={form.phone} onChange={(e) => handleChange("phone", e.target.value)}/>
                        <Input label="Adresse" value={form.address} onChange={(e) => handleChange("address", e.target.value)} required/>
                        <Input label="Ville" value={form.city} onChange={(e) => {const city=e.target.value;handleChange("city",city);const dep=departementPourVille(city);if(dep)handleChange("department",dep.nom)}} required/>
                        <Select label="Département" value={codePourDepartement(form.department)} onChange={(e)=>handleChange("department",departementParCode(e.target.value)?.nom||"")} required><option value="">Sélectionner</option>{DEPARTEMENTS_FRANCE.map(d=><option key={d.code} value={d.code}>{d.code} - {d.nom}</option>)}</Select>
                        <Input label="Code postal" value={form.postalCode} onChange={(e) => handleChange("postalCode", e.target.value)} required/>
                        <Input label="Pays" value={form.country} onChange={(e) => handleChange("country", e.target.value)}/>
                        <Input label="Site web" placeholder="https://..." value={form.website} onChange={(e) => handleChange("website", e.target.value)}/>
                        <Input label="Volume estimé de colis / mois" type="number" value={form.packageVolume} onChange={(e) => handleChange("packageVolume", e.target.value)}/>
                    </div>
                    <div className="mt-5 space-y-5">
                        <Textarea label="Horaires" placeholder="Ex. Lundi au vendredi : 9h - 18h" value={form.openingHours} onChange={(e) => handleChange("openingHours", e.target.value)}/>
                        <Textarea label="Présentation du commerce" placeholder="Présentez votre activité..." value={form.description} onChange={(e) => handleChange("description", e.target.value)}/>
                    </div>
                </Section>

                <Section title="Mode de facturation">
                    <Select label="Mode choisi" value={form.subscriptionType} onChange={(e) => handleChange("subscriptionType", e.target.value)} required>
                        <option value="">Sélectionner</option><option value="FORFAIT">Abonnement forfaitaire</option><option value="COMMANDE">Paiement à la commande</option>
                    </Select>
                    {form.subscriptionType === "FORFAIT" && <div className="mt-5"><Select label="Formule choisie" value={form.subscriptionPlan} onChange={(e) => handleChange("subscriptionPlan", e.target.value)} required><option value="">Sélectionner une formule</option><option value="ESSENTIEL">Starter — 25 colis/mois</option><option value="PROFESSIONNEL">Pro — 150 colis/mois</option><option value="ENTREPRISE">Business — 500 colis/mois</option></Select></div>}
                </Section>

                <div className="flex justify-end"><ActionButton type="submit" disabled={submitting}>{submitting ? "Envoi en cours..." : "Envoyer la demande"}</ActionButton></div>
            </form>
        </div>
    </main>);
}
