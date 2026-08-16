import test from 'node:test';
import assert from 'node:assert/strict';
import {ALLOWED_TRANSITIONS} from '../lib/domain/deliveryState.js';

test('refuse le saut direct de Créée vers Retiré', () => {
  assert.equal(ALLOWED_TRANSITIONS['Créée'].includes('Retiré'), false);
});

test('les états terminaux ne permettent aucune transition', () => {
  assert.deepEqual(ALLOWED_TRANSITIONS['Retiré'], []);
  assert.deepEqual(ALLOWED_TRANSITIONS['Retourné'], []);
});

test('la réception permet ensuite le retrait ou le retour', () => {
  assert.ok(ALLOWED_TRANSITIONS['Arrivé au point relais'].includes('Retiré'));
  assert.ok(ALLOWED_TRANSITIONS['Arrivé au point relais'].includes('Retour demandé'));
});

test('une livraison en transit peut être réceptionnée', () => {
  assert.ok(ALLOWED_TRANSITIONS['En transit'].includes('Arrivé au point relais'));
});

test('une demande de retour ne peut aboutir qu’à Retourné', () => {
  assert.deepEqual(ALLOWED_TRANSITIONS['Retour demandé'], ['Retourné']);
});

test('un colis non récupéré peut être retourné', () => {
  assert.ok(ALLOWED_TRANSITIONS['Non récupéré'].includes('Retourné'));
});

test('un colis refusé peut entrer dans le flux de retour', () => {
  assert.ok(ALLOWED_TRANSITIONS['Refusé'].includes('Retour demandé'));
});
