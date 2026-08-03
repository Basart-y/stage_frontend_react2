import { reportRepository } from '@/lib/backend/reportRepository.js';
import { createNotification } from '@/lib/backend/notificationDomain.js';

export const REPORT_TYPES = ['probleme_reception_livreur', 'probleme_livraison_client', 'probleme_paiement', 'autre'];
export const REPORT_STATUSES = ['ouvert', 'en_traitement', 'escalade', 'resolu', 'rejete'];

function routingFor(type) {
  return type === 'probleme_paiement' ? 'gestionnaire_financier' : 'gestionnaire';
}

export async function createReport(input, author) {
  if (!REPORT_TYPES.includes(input?.type)) throw new Error('INVALID_REPORT_TYPE');
  if (!String(input?.description || '').trim()) throw new Error('DESCRIPTION_REQUIRED');
  const now = new Date().toISOString();
  const assignedRole = routingFor(input.type);
  const report = {
    id: crypto.randomUUID(),
    type: input.type,
    origin: input.origin || (author?.role === 'point_relais' ? 'Point relais' : 'Commerçant'),
    priority: input.priority || 'normale',
    deliveryId: input.deliveryId || input.deliveryRef ? String(input.deliveryId || input.deliveryRef) : null,
    deliveryRef: input.deliveryRef || input.deliveryId || '',
    authorId: author?.id ? String(author.id) : String(input.authorId || ''),
    authorRole: author?.role || input.authorRole || null,
    description: String(input.description).trim(),
    status: 'ouvert',
    assignedRole,
    assignedManagerId: null,
    geography: {
      ville: input.ville || author?.profile?.ville || author?.ville || null,
      departement: input.departement || author?.profile?.departement || author?.departement || null,
    },
    resolutionComment: null,
    createdAt: now,
    updatedAt: now,
    resolvedAt: null,
    history: [{ status: 'ouvert', actorId: author?.id || null, at: now, comment: 'Signalement créé.' }],
  };
  await reportRepository.create(report);
  await createNotification({
    audienceRole: assignedRole,
    type: 'urgence',
    title: input.type === 'probleme_paiement' ? 'Nouveau litige de paiement' : 'Nouveau signalement',
    message: `Un signalement ${report.id.slice(0, 8)} doit être traité.`,
    resourceType: 'report', resourceId: report.id,
    priority: input.type === 'probleme_paiement' ? 'high' : 'normal',
  });
  return report;
}

export async function createRefusalReport(delivery, actorId = null) {
  return createReport({
    type: 'probleme_reception_livreur',
    deliveryId: delivery.id,
    description: delivery.refusalReason || 'Réception refusée par le point relais.',
    ville: delivery.relayCity || null,
    departement: delivery.relayDepartment || null,
    authorId: actorId || delivery.relayPointUserId || '',
    authorRole: 'point_relais',
  }, actorId ? { id: actorId, role: 'point_relais' } : null);
}

export async function transitionReport(id, action, actor, comment = '') {
  const report = await reportRepository.findById(id);
  if (!report) throw new Error('REPORT_NOT_FOUND');
  const transitions = {
    take: { from: ['ouvert'], to: 'en_traitement' },
    escalate: { from: ['ouvert', 'en_traitement'], to: 'escalade' },
    resolve: { from: ['ouvert', 'en_traitement', 'escalade'], to: 'resolu' },
    reject: { from: ['ouvert', 'en_traitement', 'escalade'], to: 'rejete' },
  };
  const rule = transitions[action];
  if (!rule || !rule.from.includes(report.status)) throw new Error('INVALID_REPORT_TRANSITION');
  if (action === 'escalate' && actor.role !== 'gestionnaire') throw new Error('FORBIDDEN_REPORT_ACTION');
  if (report.type === 'probleme_paiement' && actor.role !== 'gestionnaire_financier' && actor.role !== 'super_gestionnaire') throw new Error('FORBIDDEN_REPORT_ACTION');
  if (action === 'take' && !['gestionnaire', 'gestionnaire_financier', 'super_gestionnaire'].includes(actor.role)) throw new Error('FORBIDDEN_REPORT_ACTION');
  if (['resolve', 'reject'].includes(action) && !['gestionnaire', 'gestionnaire_financier', 'super_gestionnaire'].includes(actor.role)) throw new Error('FORBIDDEN_REPORT_ACTION');

  const now = new Date().toISOString();
  const updated = {
    ...report,
    status: rule.to,
    assignedRole: action === 'escalate' ? 'super_gestionnaire' : report.assignedRole,
    assignedManagerId: action === 'take' ? String(actor.id) : report.assignedManagerId,
    resolutionComment: ['resolve', 'reject'].includes(action) ? String(comment || '').trim() : report.resolutionComment,
    resolvedAt: ['resolve', 'reject'].includes(action) ? now : report.resolvedAt,
    updatedAt: now,
    history: [...(report.history || []), { status: rule.to, actorId: String(actor.id), at: now, comment: String(comment || '').trim() || `Action ${action}.` }],
  };
  await reportRepository.replace(id, updated);

  if (action === 'escalate') {
    await createNotification({ audienceRole: 'super_gestionnaire', type: 'urgence', title: 'Signalement escaladé', message: `Le signalement ${id.slice(0, 8)} nécessite un arbitrage.`, resourceType: 'report', resourceId: id, priority: 'high' });
  }
  if (['resolve', 'reject'].includes(action) && updated.authorId) {
    await createNotification({ recipientId: updated.authorId, type: 'info_message', title: 'Signalement traité', message: action === 'resolve' ? 'Votre signalement a été résolu.' : 'Votre signalement a été rejeté.', resourceType: 'report', resourceId: id });
  }
  return updated;
}
