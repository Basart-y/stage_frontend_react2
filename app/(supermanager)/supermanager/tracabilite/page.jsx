"use client";

import { useEffect, useMemo, useState } from 'react';
import PageTitle from '@/composants/ui/PageTitle';
import Section from '@/composants/ui/Section';
import TableauDonnees from '@/composants/table/TableauDonnees.jsx';
import { apiRequest } from '@/services/api.js';

const ROLE_LABELS = {
  commercant: 'Commerçant',
  point_relais: 'Point de relais',
  gestionnaire: 'Gestionnaire',
  super_gestionnaire: 'Super gestionnaire',
  gestionnaire_financier: 'Gestionnaire financier',
};

const RESOURCE_LABELS = {
  delivery: 'Colis',
  report: 'Signalement',
  user: 'Utilisateur',
  identity: 'Connexion',
};

const ACTION_LABELS = {
  'identity.login': 'Connexion',
  'iam.invitation.write': 'Invitation créée',
  'iam.actor.suspend': 'Compte suspendu',
  'iam.actor.restore': 'Compte réactivé',
  'moderation.report.file': 'Signalement créé',
  'moderation.report.handle': 'Signalement traité',
  'delivery.request.create': 'Livraison créée',
  'delivery.transition': 'État de livraison modifié',
};

function actionLabel(value) {
  if (!value) return '—';
  return ACTION_LABELS[value] || value.replaceAll('.', ' ');
}

function csvCell(value) {
  const text = String(value ?? '');
  return `"${text.replaceAll('"', '""')}"`;
}

function downloadCsv(rows) {
  const header = ['Date', 'Action', 'Type', 'Référence', 'Rôle', 'Transition'];
  const lines = rows.map(row => [
    new Date(row.occurredAt).toLocaleString('fr-FR'),
    actionLabel(row.action),
    RESOURCE_LABELS[row.resourceType] || row.resourceType || '',
    row.resourceId || '',
    ROLE_LABELS[row.actorRole] || row.actorRole || '',
    row.before?.status || row.after?.status ? `${row.before?.status || '—'} -> ${row.after?.status || '—'}` : '',
  ].map(csvCell).join(';'));
  const blob = new Blob(['\ufeff' + [header.map(csvCell).join(';'), ...lines].join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tracabilite-super-gestionnaire-${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function SuperManagerTraceabilityPage() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, total: 0, hasNext: false });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('');
  const [resourceType, setResourceType] = useState('');
  const [action, setAction] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const params = useMemo(() => {
    const p = new URLSearchParams({ page: String(page), limit: '100' });
    if (role) p.set('actorRole', role);
    if (resourceType) p.set('resourceType', resourceType);
    if (action) p.set('action', action);
    if (dateFrom) p.set('dateFrom', dateFrom);
    if (dateTo) p.set('dateTo', dateTo);
    return p;
  }, [page, role, resourceType, action, dateFrom, dateTo]);

  useEffect(() => {
    setLoading(true);
    apiRequest(`/api/v1/audit-traces?${params.toString()}`)
      .then(result => {
        setItems(result.data || []);
        setMeta(result.pagination || result.meta || { page, total: (result.data || []).length, hasNext: false });
      })
      .finally(() => setLoading(false));
  }, [params, page]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter(item => `${item.resourceId || ''} ${item.actorId || ''} ${item.actorRole || ''} ${item.action || ''} ${item.eventType || ''}`.toLowerCase().includes(needle));
  }, [items, query]);

  const reset = () => {
    setQuery('');
    setRole('');
    setResourceType('');
    setAction('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const exportAll = async () => {
    setExporting(true);
    try {
      const exportParams = new URLSearchParams();
      if (role) exportParams.set('actorRole', role);
      if (resourceType) exportParams.set('resourceType', resourceType);
      if (action) exportParams.set('action', action);
      if (dateFrom) exportParams.set('dateFrom', dateFrom);
      if (dateTo) exportParams.set('dateTo', dateTo);
      exportParams.set('limit', '200');

      let current = 1;
      let hasNext = true;
      const rows = [];
      while (hasNext) {
        exportParams.set('page', String(current));
        const result = await apiRequest(`/api/v1/audit-traces?${exportParams.toString()}`);
        rows.push(...(result.data || []));
        const pagination = result.pagination || result.meta || {};
        hasNext = Boolean(pagination.hasNext);
        current += 1;
        if (current > 100) break;
      }
      const needle = query.trim().toLowerCase();
      const finalRows = needle
        ? rows.filter(item => `${item.resourceId || ''} ${item.actorId || ''} ${item.actorRole || ''} ${item.action || ''} ${item.eventType || ''}`.toLowerCase().includes(needle))
        : rows;
      downloadCsv(finalRows);
    } finally {
      setExporting(false);
    }
  };

  return <div className="space-y-8">
    <PageTitle title="Traçabilité" description="Vue globale des opérations importantes réalisées dans l'application."/>

    <Section title="Filtres">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher une référence, un acteur, une action..." className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"/>
        <select value={role} onChange={e => { setRole(e.target.value); setPage(1); }} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
          <option value="">Tous les rôles</option>
          <option value="commercant">Commerçant</option>
          <option value="point_relais">Point de relais</option>
          <option value="gestionnaire">Gestionnaire</option>
          <option value="super_gestionnaire">Super gestionnaire</option>
          <option value="gestionnaire_financier">Gestionnaire financier</option>
        </select>
        <select value={resourceType} onChange={e => { setResourceType(e.target.value); setPage(1); }} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
          <option value="">Tous les éléments</option>
          <option value="delivery">Colis</option>
          <option value="report">Signalements</option>
          <option value="user">Utilisateurs</option>
          <option value="identity">Connexions</option>
        </select>
        <select value={action} onChange={e => { setAction(e.target.value); setPage(1); }} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
          <option value="">Toutes les actions</option>
          <option value="identity.login">Connexion</option>
          <option value="iam.invitation.write">Invitation créée</option>
          <option value="iam.actor.suspend">Compte suspendu</option>
          <option value="iam.actor.restore">Compte réactivé</option>
          <option value="moderation.report.file">Signalement créé</option>
          <option value="moderation.report.handle">Signalement traité</option>
          <option value="delivery.request.create">Livraison créée</option>
          <option value="delivery.transition">État de livraison modifié</option>
        </select>
        <label className="text-sm text-slate-700">Du
          <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"/>
        </label>
        <label className="text-sm text-slate-700">Au
          <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"/>
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">Réinitialiser</button>
        <button type="button" onClick={exportAll} disabled={exporting} className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{exporting ? 'Export en cours...' : 'Exporter en CSV'}</button>
      </div>
    </Section>

    <Section title={`Journal (${meta.total ?? filtered.length})`}>
      <TableauDonnees loading={loading} columns={[
        { key: 'occurredAt', label: 'Date', render: row => new Date(row.occurredAt).toLocaleString('fr-FR') },
        { key: 'action', label: 'Action', render: row => actionLabel(row.action) },
        { key: 'resourceType', label: 'Type', render: row => RESOURCE_LABELS[row.resourceType] || row.resourceType || '—' },
        { key: 'resourceId', label: 'Référence', render: row => <span className="font-mono text-xs">{row.resourceId}</span> },
        { key: 'actorRole', label: 'Rôle', render: row => ROLE_LABELS[row.actorRole] || row.actorRole || '—' },
        { key: 'transition', label: 'Transition', render: row => row.before?.status || row.after?.status ? `${row.before?.status || '—'} → ${row.after?.status || '—'}` : '—' },
      ]} data={filtered} emptyMessage="Aucune trace pour ces filtres."/>
      <div className="mt-4 flex items-center justify-between gap-4 text-sm text-slate-600">
        <span>Page {page}</span>
        <div className="flex gap-2">
          <button type="button" disabled={page <= 1 || loading} onClick={() => setPage(v => Math.max(1, v - 1))} className="rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-40">Précédent</button>
          <button type="button" disabled={!meta.hasNext || loading} onClick={() => setPage(v => v + 1)} className="rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-40">Suivant</button>
        </div>
      </div>
    </Section>
  </div>;
}
