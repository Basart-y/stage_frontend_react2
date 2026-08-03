"use client";

import {useEffect, useMemo, useState} from "react";
import {CheckCircle2, Package, MapPin} from "lucide-react";

import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import Input from "@/composants/ui/Input";
import Select from "@/composants/ui/Select";
import Combobox from "@/composants/ui/Combobox";
import Textarea from "@/composants/ui/Textarea";
import Alert from "@/composants/ui/Alert";
import ActionButton from "@/composants/ui/ActionButton";
import SelectionPointRelais from "@/composants/relais/SelectionPointRelais.jsx";
import serviceLivraison from "@/services/ServiceLivraison.js";

export default function PlanificationPage() {
    const [selectedRelay, setSelectedRelay] = useState(null);
    const [formData, setFormData] = useState({reference: "", quantity: 1, weight: "", type: "Standard", date: "", comment: "", clientFirstName: "", clientLastName: "", clientPhone: "", carrierName: "", contents: ""});
    const [clientQuery, setClientQuery] = useState("");
    const [deliveryHistory, setDeliveryHistory] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState(null);

    const suggestedCarriers = [
        "Chronopost", "Colissimo", "DPD", "DHL Express", "FedEx", "GLS",
        "Mondial Relay", "Relais Colis", "TNT", "UPS", "Ciblex", "Stuart",
        "Livreur interne", "Coursier local", "Transporteur du commerçant"
    ];

    useEffect(() => {
        serviceLivraison.getMyDeliveries().then(setDeliveryHistory).catch(() => setDeliveryHistory([]));
    }, []);

    const clientOptions = useMemo(() => {
        const unique = new Map();
        deliveryHistory.forEach((delivery) => {
            const firstName = String(delivery.client?.firstName || "").trim();
            const lastName = String(delivery.client?.lastName || "").trim();
            const phone = String(delivery.client?.phone || "").trim();
            const label = `${firstName} ${lastName}`.trim();
            if (!label) return;
            const key = `${label.toLowerCase()}|${phone}`;
            if (!unique.has(key)) unique.set(key, {id: key, label, firstName, lastName, phone, description: phone || "Client déjà utilisé"});
        });
        return [...unique.values()];
    }, [deliveryHistory]);

    const carrierOptions = useMemo(() => {
        const unique = new Map();
        deliveryHistory.forEach((delivery) => {
            const label = String(delivery.carrierName || "").trim();
            if (label && !unique.has(label.toLowerCase())) unique.set(label.toLowerCase(), {id: label.toLowerCase(), label, description: "Utilisé récemment"});
        });
        suggestedCarriers.forEach((label) => {
            const key = label.toLowerCase();
            if (!unique.has(key)) unique.set(key, {id: key, label, description: "Suggestion"});
        });
        return [...unique.values()];
    }, [deliveryHistory]);

    function handleChange(e) {
        const {name, value} = e.target;
        setFormData((previous) => ({...previous, [name]: value}));
    }

    async function handleSubmit() {
        if (!selectedRelay) {
            setSubmitResult({type: "error", message: "Veuillez sélectionner un point relais avant de créer la livraison."});
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
                clientFirstName: formData.clientFirstName,
                clientLastName: formData.clientLastName,
                clientPhone: formData.clientPhone,
                carrierName: formData.carrierName,
                contents: formData.contents,
                relayPointId: selectedRelay.id,
                relayPointName: selectedRelay.name,
            });
            setSubmitResult({type: "success", message: `La livraison ${createdDelivery.reference} a été créée avec succès et ajoutée à votre suivi.`});
            setFormData({reference: "", quantity: 1, weight: "", type: "Standard", date: "", comment: "", clientFirstName: "", clientLastName: "", clientPhone: "", carrierName: "", contents: ""});
            setClientQuery("");
            setSelectedRelay(null);
            window.scrollTo({top: 0, behavior: "smooth"});
        } catch (error) {
            console.error(error);
            setSubmitResult({type: "error", message: "Impossible de créer la livraison pour le moment."});
        } finally {
            setIsSubmitting(false);
        }
    }

    const canSubmit = selectedRelay && formData.quantity && formData.weight && formData.date && formData.clientFirstName && formData.clientLastName;

    return <div className="space-y-8">
        <PageTitle title="Nouvelle livraison" description="Renseignez le colis, choisissez un point relais puis vérifiez le résumé avant validation."/>
        {submitResult && <Alert type={submitResult.type} message={submitResult.message}/>} 

        <Section title="1. Informations du colis">
            <div className="grid gap-5 md:grid-cols-2">
                <Input label="Référence colis" name="reference" placeholder="Générée automatiquement si vide" value={formData.reference} onChange={handleChange}/>
                <Input label="Nombre de colis" name="quantity" type="number" value={formData.quantity} onChange={handleChange} required/>
                <Input label="Poids total (kg)" name="weight" type="number" placeholder="Ex. 5" value={formData.weight} onChange={handleChange} required/>
                <Select label="Type de colis" name="type" value={formData.type} onChange={handleChange}><option value="Standard">Standard</option><option value="Fragile">Fragile</option><option value="Volumineux">Volumineux</option></Select>
                <Input label="Date souhaitée" name="date" type="date" value={formData.date} onChange={handleChange} required/>
            </div>
            <div className="mt-5"><Textarea label="Instructions particulières" name="comment" placeholder="Précautions, informations utiles..." value={formData.comment} onChange={handleChange}/></div>
        </Section>

        <Section title="2. Destinataire et acheminement">
            <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                    <Combobox
                        label="Client"
                        value={clientQuery}
                        onChange={(value) => {
                            setClientQuery(value);
                            const parts = value.trim().split(/\s+/);
                            setFormData((previous) => ({...previous, clientFirstName: parts[0] || "", clientLastName: parts.slice(1).join(" ")}));
                        }}
                        onSelect={(client) => {
                            setClientQuery(client.label);
                            setFormData((previous) => ({...previous, clientFirstName: client.firstName, clientLastName: client.lastName, clientPhone: client.phone || previous.clientPhone}));
                        }}
                        options={clientOptions}
                        placeholder="Commencez à saisir un nom ou choisissez un client récent"
                        hint={clientOptions.length ? `${clientOptions.length} client(s) récent(s) disponible(s). La saisie libre reste possible.` : "Aucun historique pour le moment : saisissez le prénom et le nom du nouveau client."}
                        required
                    />
                </div>
                <Input label="Prénom du client" name="clientFirstName" value={formData.clientFirstName} onChange={(event) => {handleChange(event); setClientQuery(`${event.target.value} ${formData.clientLastName}`.trim());}} required/>
                <Input label="Nom du client" name="clientLastName" value={formData.clientLastName} onChange={(event) => {handleChange(event); setClientQuery(`${formData.clientFirstName} ${event.target.value}`.trim());}} required/>
                <Input label="Téléphone du client" name="clientPhone" type="tel" placeholder="06 00 00 00 00" value={formData.clientPhone} onChange={handleChange}/>
                <Combobox
                    label="Livreur / transporteur"
                    value={formData.carrierName}
                    onChange={(value) => setFormData((previous) => ({...previous, carrierName: value}))}
                    onSelect={(carrier) => setFormData((previous) => ({...previous, carrierName: carrier.label}))}
                    options={carrierOptions}
                    placeholder="Saisir ou choisir un livreur récent"
                    hint={`${carrierOptions.length} livreur(s) et transporteur(s) proposé(s). La saisie libre reste possible.`}
                />
            </div>
            <div className="mt-5"><Textarea label="Description du contenu" name="contents" placeholder="Ex. vêtements, accessoires..." value={formData.contents} onChange={handleChange}/></div>
        </Section>

        <Section title="3. Choix du point relais">
            <SelectionPointRelais onSelect={setSelectedRelay}/>
        </Section>

        <Section title="4. Vérification avant création">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4"><div className="flex items-center gap-2 font-semibold text-slate-900"><Package size={18} className="text-blue-700"/> Colis</div><dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm"><dt className="text-slate-600">Référence</dt><dd className="text-right font-medium text-slate-700">{formData.reference || "Automatique"}</dd><dt className="text-slate-600">Quantité</dt><dd className="text-right font-medium text-slate-700">{formData.quantity || "—"}</dd><dt className="text-slate-600">Poids</dt><dd className="text-right font-medium text-slate-700">{formData.weight ? `${formData.weight} kg` : "—"}</dd><dt className="text-slate-600">Date</dt><dd className="text-right font-medium text-slate-700">{formData.date || "—"}</dd><dt className="text-slate-600">Client</dt><dd className="text-right font-medium text-slate-700">{`${formData.clientFirstName} ${formData.clientLastName}`.trim() || "—"}</dd></dl></div>
                <div className="rounded-xl bg-slate-50 p-4"><div className="flex items-center gap-2 font-semibold text-slate-900"><MapPin size={18} className="text-blue-700"/> Point relais</div>{selectedRelay ? <div className="mt-4 text-sm"><p className="font-semibold text-slate-900">{selectedRelay.name}</p><p className="mt-1 leading-6 text-slate-700">{selectedRelay.address}<br/>{selectedRelay.postalCode} {selectedRelay.city}</p></div> : <p className="mt-4 text-sm text-slate-600">Aucun point relais sélectionné.</p>}</div>
            </div>
            <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-slate-600">La création ajoutera immédiatement la livraison au suivi dans la version de démonstration.</p><ActionButton onClick={handleSubmit} disabled={!canSubmit || isSubmitting}>{isSubmitting ? "Création en cours..." : <><CheckCircle2 size={17} className="mr-2"/>Créer la livraison</>}</ActionButton></div>
        </Section>
    </div>;
}
