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

test("un périmètre régional PACA autorise les Bouches-du-Rhône", () => {
  assert.equal(scopeAllows({niveau:'region', valeur:"Provence-Alpes-Côte d'Azur"}, {departement:'Bouches-du-Rhône', ville:'Marseille'}), true);
  assert.equal(scopeAllows({niveau:'region', valeur:"Provence-Alpes-Côte d'Azur"}, {departement:'Haute-Garonne', ville:'Toulouse'}), false);
});

test("un ancien périmètre départemental contenant un nom de région reste compatible", () => {
  assert.equal(scopeAllows({niveau:'departement', valeur:"Provence-Alpes-Côte d'Azur"}, {departement:'Bouches-du-Rhône', ville:'Marseille'}), true);
});

test("les codes départementaux sont reconnus pour les périmètres régionaux", () => {
  assert.equal(scopeAllows({niveau:'region', valeur:'Occitanie'}, {departement:'34', ville:'Béziers'}), true);
});

test('PACA accepte les variantes courantes de Bouches-du-Rhône', () => {
  assert.equal(scopeAllows({niveau:'region', valeur:'PACA'}, {departement:'Bouches du Rhone', ville:'Marseille'}), true);
  assert.equal(scopeAllows({niveau:'région', valeur:"Provence-Alpes-Côte d’Azur"}, {departement:'13 - Bouches-du-Rhône', ville:'Marseille'}), true);
});
