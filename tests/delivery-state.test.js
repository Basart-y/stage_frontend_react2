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
