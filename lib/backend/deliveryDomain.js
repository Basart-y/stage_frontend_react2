import { randomUUID } from 'node:crypto';
import { deliveryRepository } from '@/lib/backend/deliveryRepository.js';
import { userRepository } from '@/lib/backend/userRepository.js';
import { notifyDeliveryTransition, createNotification } from '@/lib/backend/notificationDomain.js';
import { createRefusalReport } from '@/lib/backend/reportDomain.js';
import { scopeAllows } from '@/lib/backend/geography.js';
import { writeAuditTrace } from '@/lib/backend/auditDomain.js';

import {ALLOWED_TRANSITIONS} from '@/lib/domain/deliveryState.js';
export {ALLOWED_TRANSITIONS};

export function canReadDelivery(actor, delivery) {
  if (actor.role === 'super_gestionnaire' || actor.role === 'gestionnaire_financier') return true;
  if (actor.role === 'commercant') return String(delivery.commerceId) === String(actor.sub);
  if (actor.role === 'point_relais') return String(delivery.relayPointId) === String(actor.sub);
  if (actor.role === 'gestionnaire') return scopeAllows(actor.scope, { ville: delivery.ville, departement: delivery.departement });
  return false;
}

export async function createDelivery(input, actor, context = {}) {
  if (actor?.role !== 'commercant') throw new Error('FORBIDDEN');
  if (!input?.relayPointId) throw new Error('RELAY_POINT_REQUIRED');
  if (!input?.clientFirstName || !input?.clientLastName) throw new Error('CLIENT_NAME_REQUIRED');
  const relay = await userRepository.findById(input.relayPointId);
  if (!relay || relay.role !== 'point_relais' || relay.statutCompte !== 'actif') throw new Error('RELAY_NOT_FOUND');
  const relayProfile = relay.profile || {};
  if ((relayProfile.operationalStatus || 'ouvert') !== 'ouvert') throw new Error('RELAY_NOT_OPEN');
  const merchant = await userRepository.findById(actor.sub);
  const now = new Date().toISOString();
  const id = randomUUID();
  const reference = `LIV-${Date.now().toString(36).toUpperCase()}-${id.slice(0,6).toUpperCase()}`;
  const delivery = {
    id, reference,
    commerceId: String(actor.sub), commerceName: merchant?.profile?.raisonSociale || merchant?.email || 'Commerçant',
    relayPointId: String(relay.id), relayPointUserId: String(relay.id), relayPoint: relayProfile.relayName || relay.email,
    relayName: relayProfile.relayName || relay.email,
    ville: relayProfile.relayCity || relayProfile.ville || '', departement: relayProfile.department || relayProfile.departement || '',
    quantity: Number(input.quantity ?? 1), weight: Number(input.weight ?? 0), type: input.type || 'Standard',
    date: input.date || now.slice(0,10), comment: input.comment?.trim() || '', contents: input.contents?.trim() || '',
    carrierName: input.carrierName?.trim() || '',
    client: { firstName: input.clientFirstName.trim(), lastName: input.clientLastName.trim(), phone: input.clientPhone?.trim() || '' },
    status: 'Créée', createdAt: now, updatedAt: now, receivedAt: null, pickupDeadline: null, handoffProof: null,
    refusalReason: null,
    history: [{ oldStatus: null, status: 'Créée', actorId: String(actor.sub), date: now, comment: 'Livraison créée depuis l’espace commerçant.' }],
  };
  const saved = await deliveryRepository.create(delivery);
  await writeAuditTrace({
    request: context.request,
    eventType: 'DELIVERY_CREATED',
    action: 'delivery.create',
    actor,
    resourceType: 'delivery',
    resourceId: id,
    after: {
      status: saved.status,
      reference: saved.reference,
      history: saved.history,
    },
    metadata: {
      relayPointId: saved.relayPointId,
      historyEntry: saved.history?.at(-1) || null,
    },
  });
  await createNotification({ recipientId: relay.id, type:'maj_etat_livraison', title:`Nouvelle livraison ${reference}`, message:'Une nouvelle livraison est prévue dans votre point relais.', resourceType:'delivery', resourceId:id });
  return saved;
}

export async function transitionDelivery(id, status, comment = '', extra = {}, actor = null, context = {}) {
  const current = await deliveryRepository.findById(id);
  if (!current) throw new Error('DELIVERY_NOT_FOUND');
  if (actor && !canReadDelivery(actor, current)) throw new Error('FORBIDDEN');
  if (actor?.role === 'commercant' && !['Retour demandé'].includes(status)) throw new Error('FORBIDDEN_TRANSITION_ROLE');
  if (actor?.role === 'point_relais' && !['Arrivé au point relais','Refusé','Retiré','Retourné'].includes(status)) throw new Error('FORBIDDEN_TRANSITION_ROLE');
  const allowed = ALLOWED_TRANSITIONS[current.status] || [];
  if (current.status !== status && !allowed.includes(status)) throw new Error('INVALID_TRANSITION');
  const now = new Date().toISOString();
  const patch = {};
  if (status === 'Arrivé au point relais') {
    patch.receivedAt = now;
    patch.receptionSheet = {
      id: crypto.randomUUID(), reference: current.reference, receivedAt: now,
      parcelCondition: extra.parcelCondition || 'bon_etat', observations: comment || '',
      carrierName: current.carrierName || '', quantity: current.quantity || 1, weight: current.weight || 0,
      recordedBy: actor?.sub || null, recordedByRole: actor?.role || null,
    };
    const days = Math.max(1, Number(process.env.PICKUP_DEADLINE_DAYS || 7));
    patch.pickupDeadline = new Date(Date.now() + days * 86400000).toISOString();
  }
  if (status === 'Refusé') patch.refusalReason = comment || 'Réception refusée.';
  if (status === 'Retiré' && extra.proof) {
    patch.handoffProof = extra.proof;
    patch.handoffSheet = {
      id: crypto.randomUUID(), reference: current.reference, handedOffAt: now,
      recipientName: extra.proof.recipientName || '', identification: extra.proof.identification || '',
      proofReference: extra.proof.proofReference || '', observations: comment || '',
      recordedBy: actor?.sub || null, recordedByRole: actor?.role || null,
    };
  }
  const historyEntry = {
    oldStatus: current.status,
    status,
    actorId: actor?.sub || extra.actorId || null,
    date: now,
    comment: comment || 'Statut mis à jour.',
  };
  const updated = {
    ...current,
    ...patch,
    ...extra,
    status,
    updatedAt: now,
    history: [...(current.history || []), historyEntry],
  };
  const saved = await deliveryRepository.replace(id, updated);
  await writeAuditTrace({
    request: context.request,
    requestId: context.requestId,
    eventType: 'DELIVERY_STATUS_TRANSITION',
    action: `delivery.transition.${status}`,
    actor,
    resourceType: 'delivery',
    resourceId: id,
    before: {
      status: current.status,
      updatedAt: current.updatedAt,
      history: current.history || [],
    },
    after: {
      status: saved.status,
      updatedAt: saved.updatedAt,
      history: saved.history || [],
    },
    metadata: {
      comment,
      historyEntry,
      reference: saved.reference,
      receptionSheetId: saved.receptionSheet?.id || null,
      handoffSheetId: saved.handoffSheet?.id || null,
    },
  });
  await notifyDeliveryTransition(saved, current.status, status);
  if (status === 'Refusé' && current.status !== 'Refusé') await createRefusalReport(saved, actor?.sub || extra.actorId || null);
  return saved;
}

export async function markOverduePickups() {
  const result = await deliveryRepository.list({ status: 'Arrivé au point relais', limit: 200 });
  const items = result.data || result;
  const now = Date.now(); let updatedCount = 0;
  for (const item of items) if (item.pickupDeadline && new Date(item.pickupDeadline).getTime() < now) {
    await transitionDelivery(item.id, 'Non récupéré', 'Délai de retrait dépassé automatiquement.'); updatedCount += 1;
  }
  return { updatedCount, checkedCount: items.length, executedAt: new Date().toISOString() };
}
