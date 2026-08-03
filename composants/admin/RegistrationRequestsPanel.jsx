"use client";

import { useEffect, useMemo, useState } from "react";
import Alert from "@/composants/ui/Alert";
import Loading from "@/composants/ui/Loading";
import Section from "@/composants/ui/Section";
import { serviceRegistrationRequests } from "@/services/ServiceRegistrationRequests.js";

const statusLabels = { PENDING: "À valider", APPROVED: "Validée", REJECTED: "Refusée" };

export default function RegistrationRequestsPanel({ role }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [status, setStatus] = useState("PENDING");

  async function load() {
    setLoading(true);
    try {
      setRows(await serviceRegistrationRequests.list({ role, status, limit: 100 }));
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Impossible de charger les demandes." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [role, status]);

  const title = role === "commercant" ? "Demandes d’inscription commerçants" : "Demandes d’inscription points relais";
  const count = useMemo(() => rows.length, [rows]);

  async function decide(row, action) {
    const label = action === "APPROVE" ? "valider" : "refuser";
    if (!window.confirm(`Confirmer : ${label} la demande de ${row.profile?.raisonSociale || row.profile?.nom || row.email} ?`)) return;
    setBusyId(row.id);
    setFeedback(null);
    try {
      await serviceRegistrationRequests.decide(row.id, action);
      setFeedback({ type: "success", message: action === "APPROVE" ? "Demande validée : le compte est maintenant actif." : "Demande refusée." });
      await load();
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Impossible de traiter la demande." });
    } finally {
      setBusyId(null);
    }
  }

  return <Section title={title} description={`${count} demande(s) dans ce filtre. Le Manager voit uniquement les demandes de son périmètre ; le Super Gestionnaire peut toutes les traiter.`}>
    <div className="mb-4 flex flex-wrap gap-2">
      {[['PENDING','À valider'],['APPROVED','Validées'],['REJECTED','Refusées']].map(([value,label]) => <button key={value} type="button" onClick={() => setStatus(value)} className={`rounded-xl px-3 py-2 text-sm font-semibold ${status === value ? 'bg-blue-600 text-white' : 'border border-slate-200 bg-white text-slate-700'}`}>{label}</button>)}
    </div>
    {feedback && <div className="mb-4"><Alert type={feedback.type} message={feedback.message}/></div>}
    {loading ? <Loading message="Chargement des demandes…"/> : rows.length === 0 ? <p className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">Aucune demande dans ce filtre.</p> : <div className="space-y-3">{rows.map((row) => {
      const profile = row.profile || {};
      return <div key={row.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2"><p className="font-black text-slate-900">{profile.raisonSociale || profile.nom || row.email}</p><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">{statusLabels[row.status] || row.status}</span></div>
            <p className="mt-1 text-sm text-slate-600">{row.email}</p>
            <p className="mt-1 text-xs text-slate-600">{profile.ville || '—'} · {profile.departement || '—'} · reçue le {row.createdAt ? new Date(row.createdAt).toLocaleString('fr-FR') : '—'}</p>
          </div>
          {row.status === 'PENDING' && <div className="flex gap-2"><button disabled={busyId === row.id} onClick={() => decide(row, 'REJECT')} className="rounded-xl border border-red-500/40 px-3 py-2 text-sm font-bold text-red-700 disabled:opacity-50">Refuser</button><button disabled={busyId === row.id} onClick={() => decide(row, 'APPROVE')} className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-bold text-white disabled:opacity-50">Valider</button></div>}
        </div>
      </div>;
    })}</div>}
  </Section>;
}
