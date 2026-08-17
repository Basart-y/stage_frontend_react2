"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Download, MapPin, Package, Weight, Printer } from "lucide-react";
import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import Loading from "@/composants/ui/Loading";
import Alert from "@/composants/ui/Alert";
import serviceLivraison from "@/services/ServiceLivraison.js";
import {downloadDeliveryPdf} from "@/utils/pdfDelivery.js";

function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: value.includes?.("T") ? "2-digit" : undefined,
        minute: value.includes?.("T") ? "2-digit" : undefined,
    }).format(date);
}

export default function LivraisonDetailPage() {
    const { id } = useParams();
    const [delivery, setDelivery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionMessage, setActionMessage] = useState("");
    const [returnReason, setReturnReason] = useState("");

    useEffect(() => {
        serviceLivraison
            .findById(id)
            .then((result) => {
                if (!result) {
                    setError("Cette livraison est introuvable.");
                    return;
                }
                setDelivery(result);
            })
            .catch(() => setError("Impossible de charger la livraison."))
            .finally(() => setLoading(false));
    }, [id]);

    async function requestReturn() {
        if (!returnReason.trim()) { setActionMessage("Indiquez la raison du retour avant de valider."); return; }
        const updated = await serviceLivraison.requestReturn(delivery.id, returnReason.trim());
        if (updated) { setDelivery(updated); setActionMessage("Demande de retour enregistrée. Le point relais peut désormais la traiter."); }
    }

    if (loading) {
        return <Loading message="Chargement de la livraison..." />;
    }

    if (error || !delivery) {
        return (
            <div className="space-y-6">
                <Alert type="error" message={error || "Livraison introuvable."} />
                <Link href="/commercant/livraisons" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-700">
                    <ArrowLeft size={16} /> Retour aux livraisons
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <Link href="/commercant/livraisons" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700">
                    <ArrowLeft size={16} /> Mes livraisons
                </Link>
                <PageTitle title={`Livraison ${delivery.reference}`} description="Consultez les informations, l’historique et déclenchez les actions disponibles." actions={<div className="flex flex-wrap gap-2"><Link href={`/commercant/livraisons/${delivery.id}/etiquette`} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-slate-300"><Printer size={16}/> Étiquette</Link>{delivery.receivedAt&&<button onClick={()=>downloadDeliveryPdf(delivery,"receipt",{comment:delivery.receptionComment||delivery.refusalReason})} className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-bold text-blue-700"><Download size={16}/> Réception PDF</button>}{delivery.status==="Retiré"&&<button onClick={()=>downloadDeliveryPdf(delivery,"handoff",{proof:delivery.handoffProof})} className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-bold text-indigo-700"><Download size={16}/> Remise PDF</button>}</div>} />
            </div>

            {actionMessage && <Alert type="success" message={actionMessage}/>}

            {! ["Retiré", "Retourné", "Retour demandé"].includes(delivery.status) && <Section title="Demander un retour"><textarea value={returnReason} onChange={(e)=>setReturnReason(e.target.value)} rows={3} placeholder="Raison du retour" className="w-full rounded-xl border border-slate-200 p-3 text-sm"/><button onClick={requestReturn} disabled={!returnReason.trim()} className="mt-3 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">Confirmer la demande de retour</button></Section>}

            <Section title="Informations principales">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl bg-slate-50 p-4">
                        <Package size={18} className="text-blue-700" />
                        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Statut</p>
                        <p className="mt-1 font-semibold text-slate-900">{delivery.status}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                        <MapPin size={18} className="text-blue-700" />
                        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Point relais</p>
                        <p className="mt-1 font-semibold text-slate-900">{delivery.relayPoint || delivery.relayName || "—"}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                        <Package size={18} className="text-blue-700" />
                        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Nombre de colis</p>
                        <p className="mt-1 font-semibold text-slate-900">{delivery.quantity ?? "—"}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                        <Weight size={18} className="text-blue-700" />
                        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Poids total</p>
                        <p className="mt-1 font-semibold text-slate-900">{delivery.weight ?? "—"} kg</p>
                    </div>
                </div>

                <dl className="mt-6 grid gap-4 border-t border-slate-200 pt-6 text-sm md:grid-cols-2">
                    <div><dt className="text-slate-600">Type</dt><dd className="mt-1 font-medium text-slate-900">{delivery.type || "—"}</dd></div>
                    <div><dt className="text-slate-600">Date prévue</dt><dd className="mt-1 font-medium text-slate-900">{formatDate(delivery.date)}</dd></div>
                    <div><dt className="text-slate-600">Créée le</dt><dd className="mt-1 font-medium text-slate-900">{formatDate(delivery.createdAt)}</dd></div>
                    <div><dt className="text-slate-600">Dernière mise à jour</dt><dd className="mt-1 font-medium text-slate-900">{formatDate(delivery.updatedAt)}</dd></div>
                </dl>

                <div className="mt-6 grid gap-4 border-t border-slate-200 pt-6 md:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-white/40 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Destinataire</p><p className="mt-2 font-bold text-slate-900">{delivery.client?.firstName} {delivery.client?.lastName}</p><p className="mt-1 text-sm text-slate-600">{delivery.client?.phone || "Téléphone non renseigné"}</p></div>
                    <div className="rounded-xl border border-slate-200 bg-white/40 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Acheminement</p><p className="mt-2 font-bold text-slate-900">{delivery.carrierName || "Livreur non renseigné"}</p><p className="mt-1 text-sm text-slate-600">{delivery.contents || "Contenu non renseigné"}</p></div>
                </div>

                {delivery.handoffProof && <div className="mt-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Preuve de remise</p><p className="mt-2 text-sm text-slate-700">Remis à <strong>{delivery.handoffProof.recipientName}</strong> · {delivery.handoffProof.identification?.replaceAll("_", " ")}</p><p className="mt-1 text-xs text-slate-600">{delivery.handoffProof.proofReference || "Preuve enregistrée"}</p></div>}

                {delivery.returnReason && <div className="mt-4 rounded-xl border border-orange-500/20 bg-orange-500/5 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-orange-700">Motif du retour</p><p className="mt-2 text-sm text-slate-700">{delivery.returnReason}</p></div>}

                {delivery.refusalReason && <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Motif du refus</p><p className="mt-2 text-sm text-slate-700">{delivery.refusalReason}</p></div>}

                {delivery.comment && (
                    <div className="mt-6 rounded-xl border border-slate-200 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Instructions</p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{delivery.comment}</p>
                    </div>
                )}
            </Section>

            <Section title="Historique">
                <div className="space-y-4">
                    {(delivery.history || []).length === 0 ? (
                        <p className="text-sm text-slate-600">Aucun événement enregistré.</p>
                    ) : (
                        [...delivery.history].reverse().map((item, index) => (
                            <div key={`${item.date}-${index}`} className="flex gap-4 border-b border-slate-200 pb-4 last:border-0 last:pb-0">
                                <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
                                <div>
                                    <p className="font-semibold text-slate-900">{item.status}</p>
                                    <p className="mt-1 text-sm text-slate-600">{formatDate(item.date)}</p>
                                    {item.comment && <p className="mt-1 text-sm text-slate-700">{item.comment}</p>}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Section>
        </div>
    );
}
