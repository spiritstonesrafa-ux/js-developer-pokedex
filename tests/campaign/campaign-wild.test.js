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
