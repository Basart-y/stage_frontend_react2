"use client";

import { useEffect, useMemo, useState } from 'react';
import PageTitle from '@/composants/ui/PageTitle';
import Section from '@/composants/ui/Section';
import TableauDonnees from '@/composants/table/TableauDonnees.jsx';
import { apiRequest } from '@/services/api.js';

export default function TechnicalTraceabilityPage() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/api/v1/audit-traces?resourceType=delivery&limit=100')
      .then(result => setItems(result.data || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => items.filter(item =>
    `${item.resourceId} ${item.actorId || ''} ${item.actorRole || ''} ${item.action || ''}`
      .toLowerCase().includes(query.toLowerCase())
  ), [items, query]);

  return <div className="space-y-8">
    <PageTitle title="Traçabilité technique" description="Historique des opérations réalisées sur les colis : date, acteur, action et changement d’état."/>
    <Section title="Recherche dans le journal">
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Colis, acteur, rôle ou action..." className="w-full max-w-xl rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-950 outline-none focus:border-blue-500"/>
    </Section>
    <TableauDonnees loading={loading} columns={[
      { key: 'occurredAt', label: 'Date', render: row => new Date(row.occurredAt).toLocaleString('fr-FR') },
      { key: 'action', label: 'Action' },
      { key: 'resourceId', label: 'Colis', render: row => <span className="font-mono text-xs">{row.resourceId}</span> },
      { key: 'actorRole', label: 'Rôle' },
      { key: 'transition', label: 'Transition', render: row => `${row.before?.status || '—'} → ${row.after?.status || '—'}` },
    ]} data={filtered} emptyMessage="Aucune trace enregistrée."/>
  </div>;
}
