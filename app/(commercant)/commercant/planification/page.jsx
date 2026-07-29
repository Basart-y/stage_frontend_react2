"use client";

import {useState} from "react";
import {CheckCircle2, Package, MapPin} from "lucide-react";

import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import Input from "@/composants/ui/Input";
import Select from "@/composants/ui/Select";
import Textarea from "@/composants/ui/Textarea";
import Alert from "@/composants/ui/Alert";
import ActionButton from "@/composants/ui/ActionButton";
import SelectionPointRelais from "@/composants/relais/SelectionPointRelais.jsx";
import serviceLivraison from "@/services/ServiceLivraison.js";

export default function PlanificationPage() {
    const [selectedRelay, setSelectedRelay] = useState(null);
    const [formData, setFormData] = useState({reference: "", quantity: 1, weight: "", type: "Standard", date: "", comment: "", clientFirstName: "", clientLastName: "", clientPhone: "", carrierName: "", contents: ""});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState(null);

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
                <Input label="Prénom du client" name="clientFirstName" value={formData.clientFirstName} onChange={handleChange} required/>
                <Input label="Nom du client" name="clientLastName" value={formData.clientLastName} onChange={handleChange} required/>
                <Input label="Téléphone du client" name="clientPhone" type="tel" placeholder="06 00 00 00 00" value={formData.clientPhone} onChange={handleChange}/>
                <Input label="Livreur / transporteur" name="carrierName" placeholder="Nom du livreur" value={formData.carrierName} onChange={handleChange}/>
            </div>
            <div className="mt-5"><Textarea label="Description du contenu" name="contents" placeholder="Ex. vêtements, accessoires..." value={formData.contents} onChange={handleChange}/></div>
        </Section>

        <Section title="3. Choix du point relais">
            <SelectionPointRelais onSelect={setSelectedRelay}/>
        </Section>

        <Section title="4. Vérification avant création">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-slate-900/60 p-4"><div className="flex items-center gap-2 font-semibold text-slate-100"><Package size={18} className="text-blue-400"/> Colis</div><dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm"><dt className="text-slate-500">Référence</dt><dd className="text-right font-medium text-slate-200">{formData.reference || "Automatique"}</dd><dt className="text-slate-500">Quantité</dt><dd className="text-right font-medium text-slate-200">{formData.quantity || "—"}</dd><dt className="text-slate-500">Poids</dt><dd className="text-right font-medium text-slate-200">{formData.weight ? `${formData.weight} kg` : "—"}</dd><dt className="text-slate-500">Date</dt><dd className="text-right font-medium text-slate-200">{formData.date || "—"}</dd><dt className="text-slate-500">Client</dt><dd className="text-right font-medium text-slate-200">{`${formData.clientFirstName} ${formData.clientLastName}`.trim() || "—"}</dd></dl></div>
                <div className="rounded-xl bg-slate-900/60 p-4"><div className="flex items-center gap-2 font-semibold text-slate-100"><MapPin size={18} className="text-blue-400"/> Point relais</div>{selectedRelay ? <div className="mt-4 text-sm"><p className="font-semibold text-slate-100">{selectedRelay.name}</p><p className="mt-1 leading-6 text-slate-300">{selectedRelay.address}<br/>{selectedRelay.postalCode} {selectedRelay.city}</p></div> : <p className="mt-4 text-sm text-slate-500">Aucun point relais sélectionné.</p>}</div>
            </div>
            <div className="mt-5 flex flex-col gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-slate-500">La création ajoutera immédiatement la livraison au suivi dans la version de démonstration.</p><ActionButton onClick={handleSubmit} disabled={!canSubmit || isSubmitting}>{isSubmitting ? "Création en cours..." : <><CheckCircle2 size={17} className="mr-2"/>Créer la livraison</>}</ActionButton></div>
        </Section>
    </div>;
}
