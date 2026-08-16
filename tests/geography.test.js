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

test('un périmètre ville est limité à la ville configurée', () => {
  assert.equal(scopeAllows({niveau:'ville', valeur:'Béziers'}, {departement:'Hérault', ville:'Béziers'}), true);
  assert.equal(scopeAllows({niveau:'ville', valeur:'Béziers'}, {departement:'Hérault', ville:'Montpellier'}), false);
});

test('les comparaisons géographiques ignorent casse et espaces', () => {
  assert.equal(scopeAllows({niveau:'departement', valeur:'  HÉRAULT '}, {departement:'hérault'}), true);
});

test('un périmètre absent est considéré national', () => {
  assert.equal(scopeAllows(null, {departement:'Gironde', ville:'Bordeaux'}), true);
});
