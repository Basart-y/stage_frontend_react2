"use client";

import { useState } from "react";
import PageTitle from "@/composants/ui/PageTitle";
import Section from "@/composants/ui/Section";
import Alert from "@/composants/ui/Alert";
import { serviceAdministration } from "@/services/ServiceAdministration.js";
import {
  DEPARTEMENTS_FRANCE,
  VILLES_PRINCIPALES,
  departementParCode,
  departementPourVille,
} from "@/donnees/geographieFrance.js";

export default function Page() {
  const [form, setForm] = useState({
    email: "",
    role: "commercant",
    name: "",
    ville: "",
    departement: "",
    codeDepartement: "",
  });
  const [feedback, setFeedback] = useState(null);
  const [busy, setBusy] = useState(false);

  function ch(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function changeVille(value) {
    const linkedDepartment = departementPourVille(value);
    setForm((current) => ({
      ...current,
      ville: value,
      ...(linkedDepartment
        ? { departement: linkedDepartment.nom, codeDepartement: linkedDepartment.code }
        : {}),
    }));
  }

  function changeDepartement(code) {
    const department = departementParCode(code);
    setForm((current) => ({
      ...current,
      codeDepartement: code,
      departement: department?.nom || "",
    }));
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setFeedback(null);
    try {
      const r = await serviceAdministration.inviteUser({
        ...form,
        profile: {
          ville: form.ville,
          departement: form.departement,
          codeDepartement: form.codeDepartement,
        },
      });
      setFeedback({
        type: r.emailDelivery?.sent ? "success" : "warning",
        message: r.emailDelivery?.sent
          ? "Invitation créée et email envoyé."
          : "Invitation créée. L’email n’a pas été envoyé : vérifiez la configuration SMTP.",
      });
      setForm((current) => ({ ...current, email: "", name: "" }));
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Invitation impossible." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageTitle
        title="Inviter un utilisateur"
        description="Créez un compte commerçant ou point relais et envoyez son lien d’activation par email."
      />
      {feedback && <Alert type={feedback.type} message={feedback.message} />}

      <Section title="Nouvelle invitation">
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => ch("email", e.target.value)}
            placeholder="Email"
            className="rounded-xl border p-3"
          />

          <select
            value={form.role}
            onChange={(e) => ch("role", e.target.value)}
            className="rounded-xl border p-3"
          >
            <option value="commercant">Commerçant</option>
            <option value="point_relais">Point relais</option>
          </select>

          <input
            required
            value={form.name}
            onChange={(e) => ch("name", e.target.value)}
            placeholder="Nom"
            className="rounded-xl border p-3"
          />

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="invitation-ville">
              Ville
            </label>
            <input
              id="invitation-ville"
              required
              list="villes-france"
              value={form.ville}
              onChange={(e) => changeVille(e.target.value)}
              placeholder="Ex. Marseille ou Montpellier"
              className="w-full rounded-xl border p-3"
            />
            <datalist id="villes-france">
              {VILLES_PRINCIPALES.map((ville) => {
                const department = departementParCode(ville.departementCode);
                return (
                  <option
                    key={`${ville.nom}-${ville.departementCode}`}
                    value={ville.nom}
                    label={`${ville.departementCode} - ${department?.nom || ""}`}
                  />
                );
              })}
            </datalist>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="invitation-departement">
              Département
            </label>
            <select
              id="invitation-departement"
              required
              value={form.codeDepartement}
              onChange={(e) => changeDepartement(e.target.value)}
              className="w-full rounded-xl border p-3"
            >
              <option value="">Sélectionner un département</option>
              {DEPARTEMENTS_FRANCE.map((department) => (
                <option key={department.code} value={department.code}>
                  {department.code} - {department.nom}
                </option>
              ))}
            </select>
            {form.departement && (
              <p className="text-xs text-slate-500">
                Enregistré en base : {form.codeDepartement} - {form.departement}
              </p>
            )}
          </div>

          <button
            disabled={busy}
            className="rounded-xl bg-indigo-600 p-3 font-bold text-white disabled:opacity-50"
          >
            {busy ? "Envoi…" : "Créer et envoyer l’invitation"}
          </button>
        </form>
      </Section>
    </div>
  );
}
