const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Catalog = require('../../assets/js/campaign/campaign-catalog.js');
const Fixed = require('../../assets/js/campaign/campaign-fixed-battle-catalog.js');
const Extras = require('../../assets/js/campaign/campaign-move-options-catalog.js');
const Options = require('../../assets/js/campaign/campaign-move-options.js');
const Store = require('../../assets/js/campaign/campaign-store.js');
const { CampaignManager } = require('../../assets/js/campaign/campaign-manager.js');
const { CampaignBattleCoordinator } = require('../../assets/js/campaign/campaign-battle-coordinator.js');
const { BattleSessionController } = require('../../assets/js/battle-session/battle-session-controller.js');
const { BattleTeamHydrator } = require('../../assets/js/battle-session/battle-team-hydrator.js');
const Guide = require('../../assets/js/campaign/campaign-matchup-guide.js');
const Editor = require('../../assets/js/campaign/campaign-move-customization.js');

const starters = [3, 6, 9, 25, 38, 94];
function memoryStore() {
  let persisted = null;
  return { getDefaultState: Store.getDefaultState, sanitize: Store.sanitize,
    load: () => Store.sanitize(persisted),
    save: data => { persisted = JSON.parse(JSON.stringify(Store.sanitize(data))); return persisted; },
    reset: () => { persisted = null; return Store.getDefaultState(); },
    raw: () => persisted };
}
function startedManager(store = memoryStore()) {
  const manager = new CampaignManager(store);
  assert.equal(manager.start(starters).ok, true);
  return manager;
}

test('offline candidate pool is species-specific, canonical and bounded', () => {
  assert.equal(Object.keys(Fixed.byId).length, 468);
  assert.equal(Object.keys(Extras.byId).length, 454);
  for (const [key, species] of Object.entries(Fixed.byId)) {
    const pool = Options.getPool(Number(key));
    assert.ok(pool.length >= 4 && pool.length <= 6, key);
    assert.equal(new Set(pool.map(move => move.id)).size, pool.length, key);
    assert.deepEqual(pool.slice(0, 4).map(move => move.id), species.moves.map(move => move.id));
    const file = path.join(__dirname, '../../.cache_pokeapi',
      `https___pokeapi_co_api_v2_pokemon_${key}.json`);
    if (fs.existsSync(file)) {
      const canonical = new Set(JSON.parse(fs.readFileSync(file, 'utf8')).moves.map(entry => entry.move.name));
      for (const move of Extras.byId[key] || []) assert.ok(canonical.has(move.name), `${key}: ${move.name}`);
    }
  }
  assert.equal(Options.getPool(999999).length, 0);
});

test('selection rejects duplicates, cross-species moves, zero/five slots and forged status metadata', () => {
  const pool = Options.getPool(25);
  const ids = pool.slice(0, 4).map(move => move.id);
  assert.ok(Options.validateSelection(25, ids));
  assert.ok(Options.validateSelection(25, [pool[4].id]));
  assert.equal(Options.validateSelection(25, []), null);
  assert.equal(Options.validateSelection(25, [...ids, pool[4].id]), null);
  assert.equal(Options.validateSelection(25, [ids[0], ids[0]]), null);
  assert.equal(Options.validateSelection(25, [99999]), null);
  const wrongSpeciesMove = Options.getPool(94).find(move => !pool.some(choice => choice.id === move.id));
  assert.equal(Options.validateSelection(25, [wrongSpeciesMove.id]), null);
  assert.deepEqual(Options.resolveLoadout(25, [99999]).map(move => move.id), ids);
});

test('preferences save and reload without changing save version, and reset to default', () => {
  const store = memoryStore();
  const manager = startedManager(store);
  const choice = [Options.getPool(25)[4].id, Options.getPool(25)[0].id];
  assert.deepEqual(manager.setMovePreference(25, choice), { ok: true });
  assert.deepEqual(store.raw().movePreferences[25], choice);
  assert.equal(store.raw().version, 1);
  const reloaded = new CampaignManager(store);
  assert.deepEqual(reloaded.getEffectiveMoveIds(25), choice);
  assert.equal(reloaded.setMovePreference(405, choice).reason, 'NOT_OWNED');
  assert.equal(reloaded.setMovePreference(25, [choice[0], choice[0]]).reason, 'INVALID_MOVESET');
  assert.deepEqual(reloaded.resetMovePreference(25), { ok: true });
  assert.deepEqual(new CampaignManager(store).getEffectiveMoveIds(25), Options.getDefaultMoveIds(25));
  reloaded.setMovePreference(25, choice);
  reloaded.reset();
  assert.deepEqual(store.raw(), null);
  assert.deepEqual(new CampaignManager(store).getState().movePreferences, {});
});

test('legacy and corrupted saves fall back safely, drop unowned species and keep progress', () => {
  const manager = startedManager();
  const legacy = manager.getState();
  delete legacy.movePreferences;
  const cleanLegacy = Store.sanitize(legacy);
  assert.deepEqual(cleanLegacy.movePreferences, {});
  assert.deepEqual(cleanLegacy.startingRosterIds, starters);
  legacy.movePreferences = { 25: [99999], 94: [Options.getPool(94)[0].id],
    405: [Options.getPool(405)[0].id], '__proto__': [33] };
  const cleaned = Store.sanitize(legacy);
  assert.deepEqual(cleaned.movePreferences[25], undefined);
  assert.deepEqual(cleaned.movePreferences[94], [Options.getPool(94)[0].id]);
  assert.equal(cleaned.movePreferences[405], undefined);
  assert.deepEqual(cleaned.startingRosterIds, starters);
});

test('coordinator and real session pass chosen moves only to player, with canonical PP and accuracy', async () => {
  const manager = startedManager();
  const pool = Options.getPool(25);
  const selected = [pool[4].id, pool[0].id, pool[3].id];
  assert.equal(manager.setMovePreference(25, selected).ok, true);
  let config;
  const coordinator = new CampaignBattleCoordinator(manager, {
    prepareBattle: async value => { config = value; }, startBattle: async () => {}
  });
  const master = Catalog.MASTERS.find(item => item.type === 'electric');
  await coordinator.start('MASTER', master.challengeId, [25, 3, 6]);
  assert.deepEqual(config.playerMovePreferences[25], selected);
  assert.equal(config.playerMovePreferences[3], undefined);
  const session = new BattleSessionController({
    hydrator: new BattleTeamHydrator({ api: { getPokemonDetail: async () => { throw Error('offline'); } } }),
    view: { renderState() {} }
  });
  await session.prepareBattle(config);
  assert.deepEqual(session.battleState.player.team[0].moves.map(move => move.id), selected);
  assert.deepEqual(session.battleState.enemy.team[0].moves.map(move => move.id),
    Fixed.byId[config.enemyTeamIds[0]].moves.map(move => move.id));
  for (const move of session.battleState.player.team[0].moves) {
    const source = pool.find(option => option.id === move.id);
    assert.equal(move.accuracy, source.accuracy);
    assert.equal(move.maxPp, source.pp);
    assert.equal(move.currentPp, source.pp);
    assert.equal(move.statusEffect || null, source.statusEffect || null);
  }
  await session.prepareBattle({ ...config, playerMovePreferences: { 25: [99999] } });
  assert.deepEqual(session.battleState.player.team[0].moves.map(move => move.id),
    Options.getDefaultMoveIds(25));
});

test('Quick Battle never applies campaign move preferences', async () => {
  const hydratedInputs = [];
  const session = new BattleSessionController({
    hydrator: { hydrateTeam: async ids => {
      hydratedInputs.push(ids);
      return ids.map(id => Fixed.byId[id]);
    } }, view: { renderState() {} }
  });
  await session.prepareBattle({ playerTeamIds: [25, 3, 6], enemyTeamIds: [38, 94, 9],
    playerMovePreferences: { 25: [Options.getPool(25)[4].id] },
    metadata: { mode: 'QUICK' } });
  assert.ok(hydratedInputs.every(team => team.every(id => typeof id === 'number')));
  assert.deepEqual(session.battleState.player.team[0].moves.map(move => move.id),
    Fixed.byId[25].moves.map(move => move.id));
});

test('installed tactical guide and picker editor use the same saved selection', () => {
  const manager = startedManager();
  const pool = Options.getPool(25);
  const custom = [pool[4].id, pool[3].id];
  manager.setMovePreference(25, custom);
  const inserted = [];
  const anchor = { insertAdjacentHTML: (_, html) => inserted.push(html) };
  const nodes = { '#pickerActionBar': anchor, '#saveCampaignMoves': {},
    '#resetCampaignMoves': {}, '#cancelCampaignMoves': {} };
  const container = { querySelector: selector => nodes[selector] || null,
    querySelectorAll: () => [] };
  class FakeView { renderPicker() {} }
  Guide.install(FakeView, Catalog, Fixed.byId);
  Editor.install(FakeView);
  const view = new FakeView();
  view.manager = manager;
  view.container = container;
  view.pending = { kind: 'MASTER', id: Catalog.MASTERS[0].challengeId };
  view.pick = [25];
  view.renderPicker();
  assert.equal(inserted.length, 2);
  assert.match(inserted[0], /Mega Kick/);
  assert.doesNotMatch(inserted[0], /Play Rough/);
  assert.match(inserted[1], /Personalizado/);
  view.editingMovePokemonId = 25;
  view.moveDraft = custom;
  inserted.length = 0;
  view.renderPicker();
  assert.match(inserted[1], /Salvar golpes/);
  assert.match(inserted[1], /Restaurar padrão/);
  assert.match(inserted[1], /1 a 4 golpes/);
});

test('picker controls save a changed selection and restore the original four moves', () => {
  const manager = startedManager();
  const pool = Options.getPool(25);
  const inserted = [];
  const nodes = { '#pickerActionBar': { insertAdjacentHTML: (_, html) => inserted.push(html) },
    '#moveChoiceCount': { textContent: '' }, '#moveChoiceError': { textContent: '' },
    '#saveCampaignMoves': { disabled: false }, '#resetCampaignMoves': {},
    '#cancelCampaignMoves': {} };
  let view;
  let inputs = [];
  const container = { querySelector: selector => nodes[selector] || null,
    querySelectorAll: selector => {
      if (selector === '[data-edit-moves]') return [{ dataset: { editMoves: '25' } }];
      if (selector === '[data-move-id]') {
        inputs = pool.map(move => ({ dataset: { moveId: String(move.id) },
          checked: (view.moveDraft || []).includes(move.id) }));
        return inputs;
      }
      return [];
    } };
  class FakeView { renderPicker() {} render() { this.renderPicker(); } }
  Guide.install(FakeView, Catalog, Fixed.byId);
  Editor.install(FakeView);
  view = new FakeView();
  view.manager = manager;
  view.container = container;
  view.pending = { kind: 'MASTER', id: Catalog.MASTERS[0].challengeId };
  view.pick = [25];
  view.renderPicker();
  // Use the handler wired by the render, not a standalone store API call.
  const wiredEdit = { dataset: { editMoves: '25' } };
  container.querySelectorAll = selector => selector === '[data-edit-moves]' ? [wiredEdit] :
    selector === '[data-move-id]' ? (inputs = pool.map(move => ({
      dataset: { moveId: String(move.id) }, checked: (view.moveDraft || []).includes(move.id)
    }))) : [];
  view.renderPicker();
  wiredEdit.onclick();
  assert.equal(view.moveDraft.length, 4);
  inputs[0].checked = false;
  inputs[0].onchange();
  inputs[4].checked = true;
  inputs[4].onchange();
  assert.equal(nodes['#moveChoiceCount'].textContent, '4/4 golpes escolhidos');
  nodes['#saveCampaignMoves'].onclick();
  assert.deepEqual(manager.getEffectiveMoveIds(25), [pool[1].id, pool[2].id, pool[3].id, pool[4].id]);
  view.editingMovePokemonId = 25;
  view.moveDraft = manager.getEffectiveMoveIds(25);
  view.renderPicker();
  nodes['#resetCampaignMoves'].onclick();
  assert.deepEqual(manager.getEffectiveMoveIds(25), Options.getDefaultMoveIds(25));
});

test('browser script order places validation before save and editor after tactical guide', () => {
  const html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8');
  const names = ['campaign-fixed-battle-catalog.js', 'campaign-move-options-catalog.js',
    'campaign-move-options.js', 'campaign-store.js', 'campaign-manager.js',
    'campaign-matchup-guide.js', 'campaign-move-customization.js', 'main.js'];
  const positions = names.map(name => html.indexOf(`src="assets/js/${name === 'main.js' ? name : `campaign/${name}`}`));
  assert.ok(positions.every(position => position >= 0));
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
});
