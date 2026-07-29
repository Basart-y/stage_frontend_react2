"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, Package, RotateCcw, Weight, Printer } from "lucide-react";
import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import Loading from "@/composants/ui/Loading";
import Alert from "@/composants/ui/Alert";
import serviceLivraison from "@/services/ServiceLivraison.js";

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
        const updated = await serviceLivraison.updateStatus(delivery.id, "Retour demandé", "Retour demandé par le commerçant depuis son espace.");
        if (updated) { setDelivery(updated); setActionMessage("Demande de retour enregistrée. Le point relais peut désormais la traiter."); }
    }

    if (loading) {
        return <Loading message="Chargement de la livraison..." />;
    }

    if (error || !delivery) {
        return (
            <div className="space-y-6">
                <Alert type="error" message={error || "Livraison introuvable."} />
                <Link href="/commercant/livraisons" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300">
                    <ArrowLeft size={16} /> Retour aux livraisons
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <Link href="/commercant/livraisons" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-400">
                    <ArrowLeft size={16} /> Mes livraisons
                </Link>
                <PageTitle title={`Livraison ${delivery.reference}`} description="Consultez les informations, l’historique et déclenchez les actions disponibles." actions={<div className="flex flex-wrap gap-2"><Link href={`/commercant/livraisons/${delivery.id}/etiquette`} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm font-bold text-slate-200 hover:border-slate-600"><Printer size={16}/> Étiquette</Link>{!["Retiré", "Retourné", "Retour demandé"].includes(delivery.status) && <button onClick={requestReturn} className="inline-flex items-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2.5 text-sm font-bold text-orange-300 transition hover:bg-orange-500/15"><RotateCcw size={16}/> Demander un retour</button>}</div>} />
            </div>

            {actionMessage && <Alert type="success" message={actionMessage}/>}

            <Section title="Informations principales">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl bg-slate-900/60 p-4">
                        <Package size={18} className="text-blue-400" />
                        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Statut</p>
                        <p className="mt-1 font-semibold text-slate-100">{delivery.status}</p>
                    </div>
                    <div className="rounded-xl bg-slate-900/60 p-4">
                        <MapPin size={18} className="text-blue-400" />
                        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Point relais</p>
                        <p className="mt-1 font-semibold text-slate-100">{delivery.relayPoint || delivery.relayName || "—"}</p>
                    </div>
                    <div className="rounded-xl bg-slate-900/60 p-4">
                        <Package size={18} className="text-blue-400" />
                        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Nombre de colis</p>
                        <p className="mt-1 font-semibold text-slate-100">{delivery.quantity ?? "—"}</p>
                    </div>
                    <div className="rounded-xl bg-slate-900/60 p-4">
                        <Weight size={18} className="text-blue-400" />
                        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Poids total</p>
                        <p className="mt-1 font-semibold text-slate-100">{delivery.weight ?? "—"} kg</p>
                    </div>
                </div>

                <dl className="mt-6 grid gap-4 border-t border-slate-800 pt-6 text-sm md:grid-cols-2">
                    <div><dt className="text-slate-500">Type</dt><dd className="mt-1 font-medium text-slate-100">{delivery.type || "—"}</dd></div>
                    <div><dt className="text-slate-500">Date prévue</dt><dd className="mt-1 font-medium text-slate-100">{formatDate(delivery.date)}</dd></div>
                    <div><dt className="text-slate-500">Créée le</dt><dd className="mt-1 font-medium text-slate-100">{formatDate(delivery.createdAt)}</dd></div>
                    <div><dt className="text-slate-500">Dernière mise à jour</dt><dd className="mt-1 font-medium text-slate-100">{formatDate(delivery.updatedAt)}</dd></div>
                </dl>

                <div className="mt-6 grid gap-4 border-t border-slate-800 pt-6 md:grid-cols-2">
                    <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Destinataire</p><p className="mt-2 font-bold text-slate-100">{delivery.client?.firstName} {delivery.client?.lastName}</p><p className="mt-1 text-sm text-slate-400">{delivery.client?.phone || "Téléphone non renseigné"}</p></div>
                    <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Acheminement</p><p className="mt-2 font-bold text-slate-100">{delivery.carrierName || "Livreur non renseigné"}</p><p className="mt-1 text-sm text-slate-400">{delivery.contents || "Contenu non renseigné"}</p></div>
                </div>

                {delivery.handoffProof && <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Preuve de remise</p><p className="mt-2 text-sm text-slate-200">Remis à <strong>{delivery.handoffProof.recipientName}</strong> · {delivery.handoffProof.identification?.replaceAll("_", " ")}</p><p className="mt-1 text-xs text-slate-400">{delivery.handoffProof.proofReference || "Preuve enregistrée"}</p></div>}

                {delivery.refusalReason && <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-rose-300">Motif du refus</p><p className="mt-2 text-sm text-slate-200">{delivery.refusalReason}</p></div>}

                {delivery.comment && (
                    <div className="mt-6 rounded-xl border border-slate-700 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Instructions</p>
                        <p className="mt-2 text-sm leading-6 text-slate-200">{delivery.comment}</p>
                    </div>
                )}
            </Section>

            <Section title="Historique">
                <div className="space-y-4">
                    {(delivery.history || []).length === 0 ? (
                        <p className="text-sm text-slate-500">Aucun événement enregistré.</p>
                    ) : (
                        [...delivery.history].reverse().map((item, index) => (
                            <div key={`${item.date}-${index}`} className="flex gap-4 border-b border-slate-800 pb-4 last:border-0 last:pb-0">
                                <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
                                <div>
                                    <p className="font-semibold text-slate-100">{item.status}</p>
                                    <p className="mt-1 text-sm text-slate-500">{formatDate(item.date)}</p>
                                    {item.comment && <p className="mt-1 text-sm text-slate-300">{item.comment}</p>}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Section>
        </div>
    );
}
