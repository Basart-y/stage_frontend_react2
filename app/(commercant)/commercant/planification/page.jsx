"use client";

import {useState} from "react";

import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import Input from "@/composants/ui/Input";
import Select from "@/composants/ui/Select";
import Textarea from "@/composants/ui/Textarea";
import Alert from "@/composants/ui/Alert";

import SelectionPointRelais from "@/composants/relais/SelectionPointRelais.jsx";

import serviceLivraison from "@/services/ServiceLivraison.js";

export default function PlanificationPage() {
    const [selectedRelay, setSelectedRelay] = useState(null);

    const [formData, setFormData] = useState({
        reference: "", quantity: 1, weight: "", type: "Standard", date: "", comment: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [submitResult, setSubmitResult] = useState(null);

    function handleChange(e) {
        const {name, value} = e.target;

        setFormData((previous) => ({
            ...previous, [name]: value,
        }));
    }

    async function handleSubmit() {
        if (!selectedRelay) {
            setSubmitResult({
                type: "error", message: "Veuillez sélectionner un point relais.",
            });

            return;
        }

        try {
            setIsSubmitting(true);
            setSubmitResult(null);

            const createdDelivery = await serviceLivraison.createDelivery({
                reference: formData.reference,
                quantity: Number(formData.quantity),
                weight: Number(formData.weight),
                type: formData.type,
                date: formData.date,
                comment: formData.comment,
                relayPointId: selectedRelay.id,
                relayPointName: selectedRelay.name, // plus tard avec l'authentification
                // commerceId: currentUser.commerceId
            });

            setSubmitResult({
                type: "success", message: `La livraison ${createdDelivery.reference} a été créée avec succès.`,
            });

            // Réinitialisation du formulaire
            setFormData({
                reference: "", quantity: 1, weight: "", type: "Standard", date: "", comment: "",
            });

            setSelectedRelay(null);
        } catch (error) {
            console.error(error);

            setSubmitResult({
                type: "error", message: "Impossible de créer la livraison.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (<div className="space-y-8">
        <PageTitle
            title="Nouvelle livraison"
            description="Planifiez une livraison vers un point relais."
        />

        {submitResult && (<Alert
            type={submitResult.type}
            message={submitResult.message}
        />)}

        <Section title="Informations du colis">
            <div className="grid gap-6 md:grid-cols-2">
                <Input
                    label="Référence colis"
                    name="reference"
                    placeholder="COL-0001"
                    value={formData.reference}
                    onChange={handleChange}
                />

                <Input
                    label="Nombre de colis"
                    name="quantity"
                    type="number"
                    placeholder="1"
                    value={formData.quantity}
                    onChange={handleChange}
                />

                <Input
                    label="Poids total (kg)"
                    name="weight"
                    type="number"
                    placeholder="5"
                    value={formData.weight}
                    onChange={handleChange}
                />

                <Select
                    label="Type de colis"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                >
                    <option value="Standard">
                        Standard
                    </option>

                    <option value="Fragile">
                        Fragile
                    </option>

                    <option value="Volumineux">
                        Volumineux
                    </option>
                </Select>

                <Input
                    label="Date souhaitée"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                />
            </div>
        </Section>

        <Section title="Choix du point relais">
            <SelectionPointRelais
                onSelect={setSelectedRelay}
            />
        </Section>

        <Section title="Commentaires">
            <Textarea
                label="Instructions particulières"
                name="comment"
                placeholder="Informations pour le transporteur..."
                value={formData.comment}
                onChange={handleChange}
            />
        </Section>

        <div className="flex justify-end">
            <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedRelay || isSubmitting}
                className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50">
                {isSubmitting ? "Création en cours..." : "Valider la planification"}
            </button>
        </div>
    </div>);
}