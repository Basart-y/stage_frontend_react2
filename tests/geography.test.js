import test from 'node:test';
import assert from 'node:assert/strict';
import {scopeAllows} from '../lib/backend/geography.js';

test('un gestionnaire départemental reste dans son périmètre', () => {
  assert.equal(scopeAllows({niveau:'departement', valeur:'Hérault'}, {departement:'Hérault', ville:'Montpellier'}), true);
  assert.equal(scopeAllows({niveau:'departement', valeur:'Hérault'}, {departement:'Bouches-du-Rhône', ville:'Marseille'}), false);
});

test('un périmètre pays autorise toutes les zones françaises', () => {
  assert.equal(scopeAllows({niveau:'pays'}, {departement:'Nord', ville:'Lille'}), true);
});
