const test = require('node:test');
const assert = require('node:assert/strict');
const Guide = require('../../assets/js/campaign/campaign-matchup-guide.js');

const pokemon = (id, name, types) => ({ id, name, types });
const move = (name, type, power = 80, damageClass = 'special') => ({ name, type, power, damageClass });

test('counts dual-type coverage and preserves immunities', () => {
  const selected = [pokemon(1, 'attacker', ['water'])];
  const opponents = [pokemon(2, 'flying-rock', ['flying', 'rock']), pokemon(3, 'ground', ['ground'])];
  const report = Guide.buildReport({ selected, opponents, fallbackById: {
    1: { moves: [move('spark', 'electric'), move('splash', 'water')] }
  } });
  assert.equal(report.entries[0].matchups[0].bestAttack.multiplier, 2);
  assert.equal(report.entries[0].matchups[1].bestAttack.multiplier, 2);
  assert.equal(report.covered, 2);
  assert.equal(report.entries[0].matchups[1].bestAttack.name, 'splash');
});

test('distinguishes 4× weakness from a zero-damage immunity', () => {
  const report = Guide.buildReport({
    selected: [pokemon(1, 'electric-mon', ['electric'])],
    opponents: [pokemon(2, 'water-flying', ['water', 'flying']),
      pokemon(3, 'ground-mon', ['ground'])],
    fallbackById: { 1: { moves: [move('thunderbolt', 'electric')] } }
  });
  assert.equal(report.entries[0].matchups[0].bestAttack.multiplier, 4);
  assert.equal(report.entries[0].matchups[1].bestAttack.multiplier, 0);
  assert.equal(report.covered, 1);
});

test('ignores status moves and does not fabricate coverage for reward Pokémon', () => {
  const selected = [pokemon(20, 'reward', ['psychic'])];
  const opponents = [pokemon(21, 'dark', ['dark'])];
  const report = Guide.buildReport({ selected, opponents, fallbackById: {
    20: { moves: [move('fake-spark', 'electric', 0, 'status')] }
  } });
  assert.equal(report.covered, 0);
  assert.equal(report.entries[0].hasMoves, false);
  assert.match(Guide.renderReport(report), /Golpes ofensivos não disponíveis/);
});

test('empty selection does not falsely warn about a legacy save', () => {
  const report = Guide.buildReport({
    selected: [], opponents: [pokemon(21, 'dark', ['dark'])]
  });
  const html = Guide.renderReport(report);
  assert.match(html, /golpes da campanha são estáveis/);
  assert.doesNotMatch(html, /Prévia limitada/);
});

test('shows shadow aura floor even against a normal type immunity', () => {
  const report = Guide.buildReport({
    selected: [pokemon(1, 'ghost', ['ghost'])],
    opponents: [pokemon(2, 'normal', ['normal'])],
    shadow: true
  });
  assert.equal(report.entries[0].matchups[0].incoming.multiplier, 2);
  assert.match(Guide.renderReport(report), /aura Shadow/);
});

test('suggests the best opening leader without changing selection order', () => {
  const selected = [pokemon(1, 'water-mon', ['water']), pokemon(2, 'grass-mon', ['grass'])];
  const report = Guide.buildReport({ selected, opponents: [pokemon(3, 'ground-mon', ['ground'])],
    fallbackById: { 1: { moves: [move('tackle', 'normal')] },
      2: { moves: [move('leaf-storm', 'grass')] } } });
  assert.equal(report.suggestedLeader.id, 2);
  assert.deepEqual(selected.map(x => x.id), [1, 2]);
});

test('installs after the picker and adds guidance before battle action', () => {
  const inserted = [];
  class View {
    renderPicker() { this.called = true; return 'original-result'; }
  }
  const catalog = { SUPER_TEAM: [pokemon(3, 'ground-mon', ['ground'])] };
  Guide.install(View, catalog, { 1: { moves: [move('water-gun', 'water')] } });
  const view = new View();
  view.pending = { kind: 'SUPER' };
  view.pick = [1];
  view.manager = { getRoster: () => [pokemon(1, 'water-mon', ['water'])] };
  view.container = { querySelector: selector => selector === '#pickerActionBar'
    ? { insertAdjacentHTML: (where, html) => inserted.push({ where, html }) } : null };
  assert.equal(view.renderPicker(), 'original-result');
  assert.equal(view.called, true);
  assert.equal(inserted.length, 1);
  assert.equal(inserted[0].where, 'beforebegin');
  assert.match(inserted[0].html, /Water Gun/);
  Guide.install(View, catalog, {});
  assert.equal(View.prototype.renderPicker.__matchupGuide, true);
});
