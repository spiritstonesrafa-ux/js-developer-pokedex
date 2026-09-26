const test = require('node:test');
const assert = require('node:assert/strict');

const memory = new Map();
global.localStorage = {
  getItem: key => memory.get(key) || null,
  setItem: (key, value) => memory.set(key, String(value)),
  removeItem: key => memory.delete(key)
};
global.window = global.window || {};
global.window.PBACampaign = global.window.PBACampaign || {};
global.window.matchMedia = () => ({ matches: true });
global.window.switchAppTab = () => {};
global.document = global.document || {
  getElementById: () => null, addEventListener: () => {}, removeEventListener: () => {}
};

const Catalog = require('../../assets/js/campaign/campaign-catalog.js');
Object.assign(global.window.PBACampaign, Catalog);
const Wild = require('../../assets/js/campaign/campaign-wild-encounters.js');
const WildAudio = require('../../assets/js/campaign/campaign-wild-audio.js');
const MoveOptions = require('../../assets/js/campaign/campaign-move-options.js');
const Store = require('../../assets/js/campaign/campaign-store.js');
const { CampaignManager } = require('../../assets/js/campaign/campaign-wild-manager.js');
const { CampaignMapView } = require('../../assets/js/campaign/campaign-map-view.js');
const { CampaignView } = require('../../assets/js/campaign/campaign-view.js');
const Session = require('../../assets/js/battle-session/battle-session-controller.js').BattleSessionController;
const Hydrator = require('../../assets/js/battle-session/battle-team-hydrator.js').BattleTeamHydrator;
const Engine = require('../../assets/js/battle/battle-engine.js');
require('../../assets/js/campaign/campaign-wild-view.js');

function fresh() {
  memory.clear();
  const manager = new CampaignManager(Store);
  assert.equal(manager.start(Catalog.DRAFT.slice(0, 6).map(pokemon => pokemon.id)).ok, true);
  return manager;
}

test('Wild Phase 1 — Região 1 sorteia somente espécies seguras e não pertencentes ao elenco', () => {
  const reserved = new Set([
    ...Catalog.MASTER_SPECIES, ...Catalog.SUPER_TEAM,
    ...Catalog.LEGENDARY_TRIAL_TEAM, ...Catalog.MYTHICAL_TRIAL_TEAM,
    ...Catalog.TITANS_TRIAL_TEAM, ...Catalog.CELESTIAL_TRIAL_TEAM
  ].map(pokemon => pokemon.id));
  assert.ok(Wild.REGION_1_POOL.length >= 20);
  assert.equal(new Set(Wild.REGION_1_POOL).size, Wild.REGION_1_POOL.length);
  for (const id of Wild.REGION_1_POOL) {
    const pokemon = Catalog.byId(id);
    assert.ok(pokemon && !pokemon.legendary && !pokemon.mythical);
    assert.ok(!reserved.has(id));
    assert.ok(Catalog.DRAFT.some(candidate => candidate.id === id));
  }
  const manager = fresh();
  const encounter = manager.beginWildEncounter('region-1', 0);
  assert.equal(encounter.ok, true);
  assert.ok(!manager.getRosterIds().includes(encounter.pokemonId));
  assert.equal(manager.beginWildEncounter('region-1', 0.99).pokemonId, encounter.pokemonId, 'Repetir pedido não rerrola o encontro');
  const reloaded = new CampaignManager(Store);
  assert.equal(reloaded.getState().wild.active.pokemonId, encounter.pokemonId, 'Reload preserva o sorteio');
  assert.equal(reloaded.beginWildEncounter('region-2').ok, false);
});

test('Wild Phase 1 — batalha 3x1, captura salva no elenco, máximo de duas e recompensas intactas', () => {
  let manager = fresh();
  const initialRoster = manager.getRosterIds();
  const first = manager.beginWildEncounter('region-1', 0).pokemonId;
  const config = manager.getBattleConfig('WILD', first, initialRoster.slice(0, 3));
  assert.deepEqual(config.enemyTeamIds, [first]);
  assert.equal(config.metadata.battleFormat, 'TRIAL_3X1');
  assert.throws(() => manager.getBattleConfig('WILD', 999, initialRoster.slice(0, 3)));
  assert.throws(() => manager.getBattleConfig('WILD', first, initialRoster.slice(0, 2)));
  assert.equal(manager.recordBattle({ battleId: 'wild-win-1', kind: 'WILD', id: first, winner: 'player' }).processed, true);
  assert.equal(manager.getBadgeCount(), 0);
  assert.equal(manager.getState().wild.pendingCapture.pokemonId, first);
  manager = new CampaignManager(Store);
  assert.equal(manager.getState().wild.pendingCapture.battleId, 'wild-win-1', 'Captura pendente sobrevive a reload');
  assert.equal(manager.attemptWildCapture(0).captured, true);
  assert.equal(manager.attemptWildCapture(0).ok, false, 'A mesma vitória não dá segunda tentativa');
  assert.equal(manager.recordBattle({ battleId: 'wild-win-1', kind: 'WILD', id: first, winner: 'player' }).duplicate, true);
  assert.ok(manager.getRosterIds().includes(first));
  assert.equal(manager.getRosterIds().length, initialRoster.length + 1);
  const reorderedMoves = MoveOptions.getDefaultMoveIds(first).reverse();
  assert.equal(manager.setMovePreference(first, reorderedMoves).ok, true);
  assert.deepEqual(new CampaignManager(Store).getEffectiveMoveIds(first), reorderedMoves,
    'Capturado permite salvar e restaurar seus golpes');
  assert.equal(manager.getState().wild.result.status, 'CAUGHT');
  assert.equal(manager.acknowledgeWildResult(), true);
  const second = manager.beginWildEncounter('region-1', 0).pokemonId;
  assert.notEqual(second, first);
  manager.recordBattle({ battleId: 'wild-win-2', kind: 'WILD', id: second, winner: 'player' });
  assert.equal(manager.attemptWildCapture(0).captured, true);
  manager.acknowledgeWildResult();
  assert.equal(manager.beginWildEncounter('region-1').reason, 'REGION_LIMIT');
  assert.equal(manager.getRosterIds().length, initialRoster.length + 2);

  const master = Catalog.MASTERS[0];
  manager.recordBattle({ battleId: 'master-after-wild', kind: 'MASTER', id: master.challengeId, winner: 'player' });
  assert.equal(manager.getRewardCandidates().some(candidate => candidate.selectable), true);
  assert.equal(manager.getBadgeCount(), 1);
});

test('Wild Phase 1 — sessão real prepara selvagem 3x1 offline com quatro golpes suportados', async () => {
  const manager = fresh();
  const pokemonId = manager.beginWildEncounter('region-1', 0).pokemonId;
  const config = manager.getBattleConfig('WILD', pokemonId, manager.getRosterIds().slice(0, 3));
  let apiCalls = 0;
  const priorDocument = global.document;
  delete global.document;
  try {
    const session = new Session({
      hydrator: new Hydrator({ api: { getPokemonDetail: async () => { apiCalls++; throw Error('offline'); } } }),
      engine: Engine,
      view: { renderState() {} }
    });
    const battle = await session.prepareBattle(config);
    assert.equal(battle.player.team.length, 3);
    assert.equal(battle.enemy.team.length, 1);
    assert.equal(battle.enemy.team[0].id, pokemonId);
    assert.equal(session.enemyTeam[0].moves.length, 4);
    assert.equal(apiCalls, 0);
  } finally {
    global.document = priorDocument;
  }
});

test('Wild Phase 1 — derrota e falha da Poké Bola não entregam Pokémon; saves antigos e reset seguem seguros', () => {
  let manager = fresh();
  const old = JSON.parse(memory.get(Store.STORAGE_KEY));
  delete old.wild;
  memory.set(Store.STORAGE_KEY, JSON.stringify(old));
  manager = new CampaignManager(Store);
  assert.deepEqual(manager.getState().wild, Wild.getDefaultState());
  const pokemonId = manager.beginWildEncounter('region-1', 0).pokemonId;
  assert.equal(manager.recordBattle({ battleId: 'wild-loss', kind: 'WILD', id: pokemonId, winner: 'enemy' }).processed, true);
  assert.equal(manager.getState().wild.result.status, 'LOST');
  assert.equal(manager.getState().wild.pendingCapture, null);
  manager.acknowledgeWildResult();
  manager.beginWildEncounter('region-1', 0);
  manager.recordBattle({ battleId: 'wild-fled', kind: 'WILD', id: pokemonId, winner: 'player' });
  assert.equal(manager.attemptWildCapture(-1).reason, 'INVALID_ROLL');
  assert.equal(manager.getState().wild.pendingCapture.pokemonId, pokemonId);
  assert.equal(manager.attemptWildCapture(0.99).captured, false);
  assert.equal(manager.getState().wild.result.status, 'FLED');
  assert.equal(manager.getState().wild.capturedIds.length, 0);
  assert.equal(manager.getRosterIds().length, 6);
  manager.reset();
  assert.deepEqual(manager.getState().wild, Wild.getDefaultState());
});

test('Wild Phase 1 — save adulterado descarta lendários, recompensas, duplicatas e captura falsa', () => {
  const manager = fresh();
  const safe = Wild.getPool(manager.getRosterIds())[0];
  const raw = manager.getState();
  raw.wild = {
    capturedIds: [Catalog.MASTERS[0].team[0].id, 145, safe, safe],
    pendingCapture: { regionId: 'region-1', pokemonId: safe, encounterId: 'forged', battleId: 'not-played' },
    active: { regionId: 'region-1', pokemonId: 145, encounterId: 'invalid' },
    result: null
  };
  const clean = Store.sanitize(raw);
  assert.deepEqual(clean.wild.capturedIds, [safe]);
  assert.equal(clean.wild.pendingCapture, null);
  assert.equal(clean.wild.active, null);
  assert.equal(clean.wild.result, null);
  assert.equal(clean.version, raw.version, 'Save principal permanece na mesma versão');
});

test('Wild Phase 1 — capturas extras não bloqueiam o Super após as 18 insígnias', () => {
  const manager = fresh();
  for (let index = 0; index < 2; index++) {
    const pokemonId = manager.beginWildEncounter('region-1', 0).pokemonId;
    manager.recordBattle({ battleId: 'wild-super-' + index, kind: 'WILD', id: pokemonId, winner: 'player' });
    assert.equal(manager.attemptWildCapture(0).captured, true);
    manager.acknowledgeWildResult();
  }
  for (const master of Catalog.MASTERS) {
    manager.recordBattle({ battleId: 'wild-master-' + master.challengeId,
      kind: 'MASTER', id: master.challengeId, winner: 'player' });
    const reward = manager.getRewardCandidates().find(candidate => candidate.selectable);
    assert.ok(reward, `Recompensa de ${master.challengeId} deve continuar disponível`);
    assert.equal(manager.claimReward(reward.id).ok, true);
  }
  assert.equal(manager.getBadgeCount(), 18);
  assert.equal(manager.getRosterIds().length, 26);
  assert.equal(manager.canChallenge('SUPER'), true);
  const trials = [
    ['LEGENDARY_TRIAL', Catalog.LEGENDARY_TRIAL_TEAM],
    ['MYTHICAL_TRIAL', Catalog.MYTHICAL_TRIAL_TEAM],
    ['TITANS_TRIAL', Catalog.TITANS_TRIAL_TEAM],
    ['CELESTIAL_TRIAL', Catalog.CELESTIAL_TRIAL_TEAM]
  ];
  for (const [kind, team] of trials) {
    const pokemonId = team[0].id;
    manager.recordBattle({ battleId: 'wild-' + kind, kind, id: pokemonId,
      opponentPokemonId: pokemonId, winner: 'player' });
    assert.equal(manager.claimReward(pokemonId).ok, true);
  }
  manager.recordBattle({ battleId: 'wild-super-final', kind: 'SUPER', winner: 'player' });
  assert.equal(manager.claimReward(Catalog.SUPER_TEAM[0].id).ok, true);
  assert.equal(manager.getRosterIds().length, 31);
  assert.equal(manager.getShadowGuests().length, 8);
  assert.equal(manager.getShadowFinalStandArmy(manager.getRosterIds()[0]).length, 39);
});

test('Wild Phase 1 — mapa oferece exploração opcional e avatar vai à mata sem iniciar mestre', () => {
  const manager = fresh();
  const wildButton = { disabled: false, onclick: null };
  const container = {
    innerHTML: '',
    querySelector: selector => selector === '#wildEncounterZone' ? wildButton : null,
    querySelectorAll: () => []
  };
  const visits = [];
  const challenges = [];
  const map = new CampaignMapView({
    manager, container, initialViewMode: 'MAP',
    onWildEncounter: region => visits.push(region),
    onChallenge: challenge => challenges.push(challenge)
  });
  map.render();
  assert.match(container.innerHTML, /id="wildEncounterZone"/);
  wildButton.onclick();
  assert.deepEqual(visits, ['region-1']);
  assert.deepEqual(challenges, []);
  assert.equal(map.avatarNodeByRegion.get('region-1'), 'node-grass');
  map.destroy();
});

test('Wild Phase 1 — tela permite lançar Poké Bola e mostra resultado antes de voltar ao mapa', () => {
  const manager = fresh();
  const buttons = new Map();
  const container = {
    innerHTML: '',
    querySelector(selector) {
      if (!buttons.has(selector)) buttons.set(selector, { onclick: null, disabled: false, classList: { add() {} } });
      return buttons.get(selector);
    },
    querySelectorAll: () => []
  };
  const view = new CampaignView({ manager, coordinator: { start: async () => {} }, container });
  const pokemonId = manager.beginWildEncounter('region-1', 0).pokemonId;
  assert.match(container.innerHTML, /ENCONTRO SELVAGEM · REGIÃO 1/);
  manager.recordBattle({ battleId: 'wild-ui-win', kind: 'WILD', id: pokemonId, winner: 'player' });
  assert.match(container.innerHTML, /Lançar Poké Bola/);
  const throwButton = buttons.get('#throwWildBall');
  // The UI runs immediately under reduced motion; the probabilistic outcome
  // itself is tested deterministically above.
  throwButton.onclick();
  assert.match(container.innerHTML, /Voltar ao mapa/);
  assert.ok(['CAUGHT', 'FLED'].includes(manager.getState().wild.result.status));
  buttons.get('#wildResultContinue').onclick();
  assert.equal(manager.getState().wild.result, null);
  view.deactivate();
});

test('Wild capture — suspense precedes both the success and escape result', () => {
  const originalTimeout = global.setTimeout;
  const originalMatchMedia = global.window.matchMedia;
  const timers = [];
  global.setTimeout = (callback, delay) => {
    timers.push({ callback, delay });
    return timers.length;
  };
  global.window.matchMedia = () => ({ matches: false });
  try {
    for (const [roll, expected] of [[0, 'CAUGHT'], [0.99, 'FLED']]) {
      timers.length = 0;
      const manager = fresh();
      const elements = new Map();
      const container = {
        innerHTML: '',
        querySelector(selector) {
          if (!elements.has(selector)) {
            const classes = new Set();
            elements.set(selector, {
              disabled: false, textContent: '', classes,
              classList: { add: name => classes.add(name) }
            });
          }
          return elements.get(selector);
        },
        querySelectorAll: () => []
      };
      const view = new CampaignView({ manager, coordinator: { start: async () => {} }, container });
      const pokemonId = manager.beginWildEncounter('region-1', 0).pokemonId;
      manager.recordBattle({ battleId: 'wild-animation-' + expected, kind: 'WILD',
        id: pokemonId, winner: 'player' });
      const originalAttempt = manager.attemptWildCapture;
      manager.attemptWildCapture = () => originalAttempt.call(manager, roll);

      elements.get('#throwWildBall').onclick();
      assert.equal(elements.get('#throwWildBall').disabled, true);
      assert.ok(elements.get('.wild-capture-stage').classes.has('is-playing'));
      assert.ok(manager.getState().wild.pendingCapture, 'Outcome stays pending during the suspense');
      const suspense = timers.shift();
      assert.equal(suspense.delay, 3800);
      suspense.callback();
      assert.equal(manager.getState().wild.result.status, expected);
      assert.match(container.innerHTML, /wild-capture-stage/,
        'The outcome animation plays before the result card replaces the stage');
      assert.ok(elements.get('.wild-capture-stage').classes.has(
        expected === 'CAUGHT' ? 'is-caught' : 'is-escaped'));
      const reveal = timers.shift();
      assert.equal(reveal.delay, 900);
      reveal.callback();
      assert.match(container.innerHTML, expected === 'CAUGHT' ? /foi capturado/ : /escapou/);
      assert.equal(timers.length, 0);
      view.deactivate();
    }
  } finally {
    global.setTimeout = originalTimeout;
    global.window.matchMedia = originalMatchMedia;
  }
});

test('Wild Phase 2 — three thematic pools use 70/25/5 weighted rarity without reserved species', () => {
  const reserved = new Set([
    ...Catalog.MASTER_SPECIES, ...Catalog.SUPER_TEAM,
    ...Catalog.LEGENDARY_TRIAL_TEAM, ...Catalog.MYTHICAL_TRIAL_TEAM,
    ...Catalog.TITANS_TRIAL_TEAM, ...Catalog.CELESTIAL_TRIAL_TEAM
  ].map(pokemon => pokemon.id));
  assert.deepEqual(Object.keys(Wild.REGIONS), ['region-1', 'region-2', 'region-3']);
  assert.equal(Wild.REGIONS['region-endgame'], undefined);
  assert.deepEqual(Wild.RARITY_WEIGHTS, { COMMON: 70, UNCOMMON: 25, RARE: 5 });
  assert.equal(Wild.REGION_POOLS['region-1'], Wild.REGION_1_POOL);
  for (const [regionId, config] of Object.entries(Wild.REGIONS)) {
    const pool = Wild.REGION_POOLS[regionId];
    assert.ok(pool.length >= 40, `${regionId} precisa de diversidade suficiente`);
    assert.equal(new Set(pool).size, pool.length);
    for (const id of pool) {
      const pokemon = Catalog.byId(id);
      assert.ok(pokemon && !pokemon.legendary && !pokemon.mythical);
      assert.ok(!reserved.has(id), `${id} não pode substituir recompensa fixa`);
      assert.ok(pokemon.types.some(type => config.types.includes(type)));
      assert.ok(pokemon.bst >= config.minBst && pokemon.bst <= config.maxBst);
      assert.ok(Catalog.DRAFT.some(candidate => candidate.id === id));
    }
    for (const [roll, rarity] of [[0.3, 'COMMON'], [0.82, 'UNCOMMON'], [0.98, 'RARE']]) {
      assert.equal(Wild.getRarity(regionId, Wild.choose([], roll, regionId)), rarity);
    }
    const commonIds = pool.filter(id => Wild.getRarity(regionId, id) === 'COMMON');
    assert.equal(Wild.getRarity(regionId, Wild.choose(commonIds, 0, regionId)), 'UNCOMMON',
      'When common species are owned, the remaining weights renormalize');
  }
});

test('Wild Phase 2 — two captures per region survive reload and allow 43-member Final Stand', () => {
  let manager = fresh();
  assert.equal(manager.beginWildEncounter('region-endgame').ok, false);
  for (const regionId of Object.keys(Wild.REGIONS)) {
    for (let index = 0; index < 2; index++) {
      const encounter = manager.beginWildEncounter(regionId, index === 0 ? 0 : 0.8);
      assert.equal(encounter.ok, true, `${regionId} deve oferecer encontro`);
      const pokemonId = encounter.pokemonId;
      assert.equal(manager.getState().wild.active.regionId, regionId);
      assert.equal(manager.getBattleConfig('WILD', pokemonId, manager.getRosterIds().slice(0, 3))
        .metadata.regionId, regionId);
      manager.recordBattle({ battleId: `phase2-${regionId}-${index}`,
        kind: 'WILD', id: pokemonId, winner: 'player' });
      assert.equal(manager.attemptWildCapture(0).captured, true);
      assert.equal(manager.getState().wild.captureRegions[pokemonId], regionId);
      manager = new CampaignManager(Store);
      assert.equal(manager.getState().wild.result.regionId, regionId);
      assert.equal(manager.acknowledgeWildResult(), true);
    }
    assert.equal(Wild.getRegionCaptureCount(manager.getState().wild, regionId), 2);
    assert.equal(manager.beginWildEncounter(regionId).reason, 'REGION_LIMIT');
  }
  assert.equal(manager.getState().wild.capturedIds.length, 6);
  assert.equal(manager.getRosterIds().length, 12);
  for (const master of Catalog.MASTERS) {
    manager.recordBattle({ battleId: 'phase2-master-' + master.challengeId,
      kind: 'MASTER', id: master.challengeId, winner: 'player' });
    const reward = manager.getRewardCandidates().find(candidate => candidate.selectable);
    assert.ok(reward);
    assert.equal(manager.claimReward(reward.id).ok, true);
  }
  assert.equal(manager.canChallenge('SUPER'), true);
  const trials = [
    ['LEGENDARY_TRIAL', Catalog.LEGENDARY_TRIAL_TEAM],
    ['MYTHICAL_TRIAL', Catalog.MYTHICAL_TRIAL_TEAM],
    ['TITANS_TRIAL', Catalog.TITANS_TRIAL_TEAM],
    ['CELESTIAL_TRIAL', Catalog.CELESTIAL_TRIAL_TEAM]
  ];
  for (const [kind, team] of trials) {
    const pokemonId = team[0].id;
    manager.recordBattle({ battleId: 'phase2-' + kind, kind, id: pokemonId,
      opponentPokemonId: pokemonId, winner: 'player' });
    assert.equal(manager.claimReward(pokemonId).ok, true);
  }
  manager.recordBattle({ battleId: 'phase2-super', kind: 'SUPER', winner: 'player' });
  assert.equal(manager.claimReward(Catalog.SUPER_TEAM[0].id).ok, true);
  assert.equal(manager.getShadowFinalStandArmy(manager.getRosterIds()[0]).length, 43);
});

test('Wild Phase 2 — old captures migrate to Region 1 and bad regional data is discarded', () => {
  let manager = fresh();
  for (let index = 0; index < 2; index++) {
    const pokemonId = manager.beginWildEncounter('region-1', 0).pokemonId;
    manager.recordBattle({ battleId: 'legacy-' + index, kind: 'WILD', id: pokemonId, winner: 'player' });
    manager.attemptWildCapture(0);
    manager.acknowledgeWildResult();
  }
  const legacy = manager.getState();
  delete legacy.wild.captureRegions;
  memory.set(Store.STORAGE_KEY, JSON.stringify(legacy));
  manager = new CampaignManager(Store);
  assert.equal(Wild.getRegionCaptureCount(manager.getState().wild, 'region-1'), 2);
  assert.equal(Wild.getRegionCaptureCount(manager.getState().wild, 'region-2'), 0);
  assert.equal(manager.beginWildEncounter('region-2', 0).ok, true);
  assert.equal(manager.beginWildEncounter('region-3', 0).reason, 'RESOLVE_PREVIOUS');

  const forged = manager.getState();
  const wrongRegionId = Wild.REGION_POOLS['region-2'].find(id =>
    !Wild.REGION_POOLS['region-1'].includes(id) && !manager.getRosterIds().includes(id));
  forged.wild.capturedIds.push(wrongRegionId);
  forged.wild.captureRegions[wrongRegionId] = 'region-1';
  forged.wild.active = { regionId: 'constructor', pokemonId: wrongRegionId, encounterId: 'forged' };
  const clean = Store.sanitize(forged);
  assert.equal(clean.wild.capturedIds.includes(wrongRegionId), false);
  assert.equal(clean.wild.active, null);
  assert.equal(clean.wild.capturedIds.length, 2);
  assert.equal(manager.beginWildEncounter('constructor').ok, false);
  assert.deepEqual(Wild.getPool([], '__proto__'), []);
  assert.equal(Wild.getRarity('toString', wrongRegionId), null);
});

test('Wild Phase 2 — map exploration walks to each regional biome without a Master challenge', () => {
  const manager = fresh();
  for (const [regionId, config] of Object.entries(Wild.REGIONS)) {
    const wildButton = { disabled: false, onclick: null };
    const container = {
      innerHTML: '',
      querySelector: selector => selector === '#wildEncounterZone' ? wildButton : null,
      querySelectorAll: () => []
    };
    const visits = [];
    const challenges = [];
    const map = new CampaignMapView({
      manager, container, initialRegionId: regionId, initialViewMode: 'MAP',
      onWildEncounter: region => visits.push(region),
      onChallenge: challenge => challenges.push(challenge)
    });
    map.render();
    assert.match(container.innerHTML, new RegExp(config.zoneLabel));
    wildButton.onclick();
    assert.deepEqual(visits, [regionId]);
    assert.deepEqual(challenges, []);
    assert.equal(map.avatarNodeByRegion.get(regionId), config.zoneNodeId);
    map.destroy();
  }
});

test('Wild Phase 2 — encounter screen names the current region and its rarity', () => {
  for (const regionId of ['region-2', 'region-3']) {
    const manager = fresh();
    const container = {
      innerHTML: '',
      querySelector: () => ({ onclick: null, disabled: false }),
      querySelectorAll: () => []
    };
    const view = new CampaignView({ manager, coordinator: { start: async () => {} }, container });
    const encounter = manager.beginWildEncounter(regionId, 0.98);
    assert.equal(encounter.ok, true);
    assert.match(container.innerHTML, new RegExp(Wild.REGIONS[regionId].name.toUpperCase()));
    assert.match(container.innerHTML, /Raridade: raro/);
    assert.match(container.innerHTML, new RegExp(Wild.REGIONS[regionId].biome));
    view.deactivate();
  }
});

test('Wild Phase 2 — pending capture and regional map limits remain correct after reload', () => {
  let manager = fresh();
  const pokemonId = manager.beginWildEncounter('region-2', 0.98).pokemonId;
  manager.recordBattle({ battleId: 'phase2-pending-region-2', kind: 'WILD',
    id: pokemonId, winner: 'player' });
  manager = new CampaignManager(Store);
  assert.equal(manager.getState().wild.pendingCapture.regionId, 'region-2');
  assert.equal(manager.attemptWildCapture(0).captured, true);
  manager.acknowledgeWildResult();
  const nextId = manager.beginWildEncounter('region-2', 0).pokemonId;
  manager.recordBattle({ battleId: 'phase2-region-2-second', kind: 'WILD',
    id: nextId, winner: 'player' });
  manager.attemptWildCapture(0);
  manager.acknowledgeWildResult();

  for (const [regionId, shouldDisable] of [['region-1', false], ['region-2', true], ['region-3', false]]) {
    const wildButton = { disabled: false, onclick: null };
    const container = {
      innerHTML: '',
      querySelector: selector => selector === '#wildEncounterZone' ? wildButton : null,
      querySelectorAll: () => []
    };
    const map = new CampaignMapView({ manager, container,
      initialRegionId: regionId, initialViewMode: 'MAP' });
    map.render();
    assert.match(container.innerHTML, shouldDisable ? /Área explorada/ : /\/2/);
    assert.equal(/id="wildEncounterZone"[^>]*disabled/.test(container.innerHTML), shouldDisable);
    map.destroy();
  }
});

test('Wild Phase 3 — capture cues reuse the UI mixer and obey mute, preference and hidden tab', () => {
  memory.clear();
  const starts = [];
  const context = {
    state: 'running', currentTime: 10,
    createOscillator() {
      return {
        frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
        connect() {}, disconnect() {}, start: time => starts.push(time), stop() {}
      };
    },
    createGain() {
      return {
        gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
        connect() {}, disconnect() {}
      };
    }
  };
  let muted = false;
  const controller = {
    isUnlocked: () => true,
    contextManager: { getContext: () => context },
    mixer: { isMuted: () => muted, getChannelNode: channel => {
      assert.equal(channel, 'UI');
      return {};
    } }
  };
  assert.equal(WildAudio.playCue(controller, 'CAPTURE'), true);
  assert.equal(starts.length, 7);
  assert.ok(starts[0] >= 10 && starts.at(-1) > 13);
  muted = true;
  assert.equal(WildAudio.playCue(controller, 'CAUGHT'), false);
  muted = false;
  WildAudio.setEnabled(false);
  assert.equal(WildAudio.isEnabled(), false);
  assert.equal(WildAudio.playCue(controller, 'ESCAPED'), false);
  WildAudio.setEnabled(true);
  const previousHidden = global.document.hidden;
  global.document.hidden = true;
  assert.equal(WildAudio.playCue(controller, 'ENCOUNTER'), false);
  global.document.hidden = previousHidden;
  assert.equal(WildAudio.playCue(null, 'ENCOUNTER'), false);
});

test('Wild Phase 3 — sound toggle, screen-reader focus and regional scenes survive reduced motion', () => {
  const manager = fresh();
  const focused = [];
  const elements = new Map();
  const container = {
    offsetParent: {},
    innerHTML: '',
    querySelector(selector) {
      if (!elements.has(selector)) {
        elements.set(selector, {
          disabled: false, textContent: '', onclick: null,
          classList: { add() {} },
          setAttribute(name, value) { this[name] = value; },
          focus() { focused.push(selector); }
        });
      }
      return elements.get(selector);
    },
    querySelectorAll: () => []
  };
  const view = new CampaignView({ manager, coordinator: { start: async () => {} }, container });
  const pokemonId = manager.beginWildEncounter('region-3', 0.98).pokemonId;
  assert.match(container.innerHTML, /wild-encounter-preview/);
  assert.match(container.innerHTML, /data-region="region-3"/);
  assert.match(container.innerHTML, /id="wildScreenHeading" tabindex="-1"/);
  assert.deepEqual(focused, ['#wildScreenHeading']);
  elements.get('#wildSoundToggle').onclick();
  assert.equal(WildAudio.isEnabled(), false);
  assert.equal(elements.get('#wildSoundToggle')['aria-pressed'], 'false');
  view.render();
  assert.equal(focused.length, 1, 'Selecting team should not repeatedly steal screen-reader focus');
  manager.recordBattle({ battleId: 'wild-polish', kind: 'WILD', id: pokemonId, winner: 'player' });
  assert.match(container.innerHTML, /wild-capture-stage" data-region="region-3"/);
  assert.equal(focused.length, 2);
  elements.get('#throwWildBall').onclick();
  assert.ok(manager.getState().wild.result);
  assert.equal(focused.length, 3);
  elements.get('#wildResultContinue').onclick();
  assert.ok(focused.includes('#wildEncounterZone:not(:disabled)'));
  WildAudio.setEnabled(true);
  view.deactivate();
});

test('Wild Phase 3 — mobile and reduced-motion styles cover encounter and capture screens', () => {
  const css = require('node:fs').readFileSync(
    require('node:path').join(__dirname, '../../assets/css/campaign-wild.css'), 'utf8');
  for (const marker of [
    '[data-region="region-2"] .wild-encounter-preview',
    '[data-region="region-3"] .wild-encounter-preview',
    '.wild-capture-stage[data-region="region-2"]',
    '.wild-capture-stage[data-region="region-3"]',
    '@media (max-width: 560px)',
    '@media (prefers-reduced-motion: reduce)'
  ]) assert.ok(css.includes(marker), marker);
});
