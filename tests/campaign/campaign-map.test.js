const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const mem = new Map();
global.localStorage = {
  getItem: k => mem.get(k) || null,
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: k => mem.delete(k)
};

global.window = global.window || {};
global.PBACampaign = global.window.PBACampaign || {};
global.window.PBACampaign = global.PBACampaign;
global.document = global.document || { getElementById: () => null, removeEventListener: () => {}, addEventListener: () => {} };
global.confirm = () => true;

const C = require('../../assets/js/campaign/campaign-constants');
const K = require('../../assets/js/campaign/campaign-catalog');
Object.assign(global.PBACampaign, K);
const S = require('../../assets/js/campaign/campaign-store');
const { CampaignManager } = require('../../assets/js/campaign/campaign-manager');
const { CAMPAIGN_MAP_CATALOG } = require('../../assets/js/campaign/campaign-map-catalog');
const Model = require('../../assets/js/campaign/campaign-map-model');
const { CampaignMapView } = require('../../assets/js/campaign/campaign-map-view');
const { CampaignView } = require('../../assets/js/campaign/campaign-view');

function freshManager() {
  mem.clear();
  return new CampaignManager(S);
}

function startCampaign(mgr) {
  const draftIds = K.DRAFT.slice(0, 6).map(p => p.id);
  const res = mgr.start(draftIds);
  assert.equal(res.ok, true);
}

function unlock18Badges(mgr) {
  startCampaign(mgr);
  for (const master of K.MASTERS) {
    mgr.recordBattle({
      battleId: 'test-badge-' + master.challengeId,
      kind: 'MASTER',
      id: master.challengeId,
      winner: 'player'
    });
    const candidate = mgr.getRewardCandidates().find(c => c.selectable);
    if (candidate) {
      mgr.claimReward(candidate.id);
    }
  }
}

// -----------------------------------------------------------------------------
// CATÁLOGO DECLARATIVO
// -----------------------------------------------------------------------------
test('Map Catalog — Exatamente quatro regiões imutáveis', () => {
  assert.equal(CAMPAIGN_MAP_CATALOG.regions.length, 4);
  const regionIds = CAMPAIGN_MAP_CATALOG.regions.map(r => r.id);
  assert.deepEqual(regionIds, ['region-1', 'region-2', 'region-3', 'region-endgame']);
  assert.ok(Object.isFrozen(CAMPAIGN_MAP_CATALOG));
  assert.ok(Object.isFrozen(CAMPAIGN_MAP_CATALOG.regions));
});

test('Map Catalog — Exatamente 18 nós MASTER sem duplicatas e sem ausências', () => {
  const allNodes = CAMPAIGN_MAP_CATALOG.regions.flatMap(r => r.nodes);
  const masterNodes = allNodes.filter(n => n.challengeKind === 'MASTER');

  assert.equal(masterNodes.length, 18);
  const masterIds = masterNodes.map(n => n.challengeId);
  const canonicalIds = K.MASTERS.map(m => m.challengeId);

  assert.equal(new Set(masterIds).size, 18, 'Nenhum Mestre deve ser duplicado');
  for (const cid of canonicalIds) {
    assert.ok(masterIds.includes(cid), `Mestre canônico ausente no catálogo: ${cid}`);
  }
});

test('Map Catalog — Exatamente 4 Provas, 1 Super, 1 Shadow na Região Final (Total 24 nós)', () => {
  const allNodes = CAMPAIGN_MAP_CATALOG.regions.flatMap(r => r.nodes);
  assert.equal(allNodes.length, 24, 'Total de nós em todas as 4 regiões deve ser 24');

  const endgameRegion = CAMPAIGN_MAP_CATALOG.regions.find(r => r.id === 'region-endgame');
  assert.ok(endgameRegion);
  assert.equal(endgameRegion.nodes.length, 6);

  const trials = endgameRegion.nodes.filter(n => n.challengeKind.includes('TRIAL'));
  assert.equal(trials.length, 4);
  const trialKinds = trials.map(t => t.challengeKind);
  assert.deepEqual(trialKinds.sort(), ['CELESTIAL_TRIAL', 'LEGENDARY_TRIAL', 'MYTHICAL_TRIAL', 'TITANS_TRIAL'].sort());

  const superNode = endgameRegion.nodes.find(n => n.challengeKind === 'SUPER');
  assert.ok(superNode);
  assert.equal(superNode.nodeId, 'node-super');

  const shadowNode = endgameRegion.nodes.find(n => n.challengeKind === 'SHADOW');
  assert.ok(shadowNode);
  assert.equal(shadowNode.nodeId, 'node-shadow');
  assert.equal(shadowNode.visibilityPolicy, 'SHADOW_REVEALED');
});

test('Map Catalog — IDs de nós e rotas são únicos e coordenadas estão no intervalo 0–100', () => {
  const allNodes = CAMPAIGN_MAP_CATALOG.regions.flatMap(r => r.nodes);
  const allRoutes = CAMPAIGN_MAP_CATALOG.regions.flatMap(r => r.routes);

  const nodeIds = allNodes.map(n => n.nodeId);
  assert.equal(new Set(nodeIds).size, allNodes.length, 'Todos os nodeId devem ser únicos');

  const routeIds = allRoutes.map(r => r.routeId);
  assert.equal(new Set(routeIds).size, allRoutes.length, 'Todos os routeId devem ser únicos');

  for (const node of allNodes) {
    assert.ok(typeof node.position.x === 'number' && node.position.x >= 0 && node.position.x <= 100);
    assert.ok(typeof node.position.y === 'number' && node.position.y >= 0 && node.position.y <= 100);
    assert.ok(typeof node.biomeLabel === 'string' && node.biomeLabel.length > 0);
    assert.ok(typeof node.ariaLabelBase === 'string' && node.ariaLabelBase.length > 0);
  }
});

test('Map Catalog — Rotas referenciam nós válidos dentro da mesma região', () => {
  for (const region of CAMPAIGN_MAP_CATALOG.regions) {
    const regionNodeIds = new Set(region.nodes.map(n => n.nodeId));
    assert.ok(region.routes.length > 0, `Região ${region.id} deve possuir rotas SVG`);

    for (const route of region.routes) {
      assert.ok(regionNodeIds.has(route.from), `Rota ${route.routeId} aponta para nó 'from' inválido: ${route.from}`);
      assert.ok(regionNodeIds.has(route.to), `Rota ${route.routeId} aponta para nó 'to' inválido: ${route.to}`);
      assert.ok(typeof route.pathD === 'string' && route.pathD.startsWith('M'), `Rota ${route.routeId} deve ter pathD SVG válido`);
    }
  }
});

test('Map Catalog — Desbloqueio e ausência de estado mutável do jogador', () => {
  for (const region of CAMPAIGN_MAP_CATALOG.regions) {
    if (region.id === 'region-endgame') {
      assert.ok(['BADGE_COUNT', 'BADGES_COUNT'].includes(region.unlockCondition.kind));
      assert.equal(region.unlockCondition.count || region.unlockCondition.badgesRequired, 18);
    } else {
      assert.equal(region.unlockCondition.kind, 'ALWAYS');
    }

    // Static catalog must NOT contain mutated player state
    for (const node of region.nodes) {
      assert.equal(node.defeated, undefined);
      assert.equal(node.available, undefined);
      assert.equal(node.selected, undefined);
      assert.equal(node.badgeEarned, undefined);
      assert.equal(node.attempts, undefined);
    }
  }
  assert.equal(CAMPAIGN_MAP_CATALOG.recommendedNext, undefined);
});

// -----------------------------------------------------------------------------
// MODELO PURO DE APRESENTAÇÃO
// -----------------------------------------------------------------------------
test('Map Model — Imutabilidade: não muta catálogo nem estado de entrada', () => {
  const mgr = freshManager();
  startCampaign(mgr);
  const state = mgr.getState();
  const stateCopy = JSON.parse(JSON.stringify(state));

  const viewModel = Model.buildMapViewModel({
    catalog: CAMPAIGN_MAP_CATALOG,
    campaignState: state,
    masters: K.MASTERS,
    manager: mgr
  });

  assert.ok(viewModel);
  assert.deepEqual(state, stateCopy, 'O modelo não pode mutar o estado recebido');
});

test('Map Model — Zero insígnias: todos os 18 Mestres disponíveis e recomendação dinâmica', () => {
  const mgr = freshManager();
  startCampaign(mgr);
  const state = mgr.getState();

  const viewModel = Model.buildMapViewModel({
    catalog: CAMPAIGN_MAP_CATALOG,
    campaignState: state,
    masters: K.MASTERS,
    manager: mgr
  });

  assert.equal(viewModel.badgeCount, 0);
  assert.equal(viewModel.rosterCount, 6);
  assert.equal(viewModel.hasPendingReward, false);
  assert.equal(viewModel.isCompleted, false);

  // All master nodes across regions 1-3 must be available
  const activeMasterNodes = viewModel.regions
    .filter(r => r.id !== 'region-endgame')
    .flatMap(r => r.nodes);

  assert.equal(activeMasterNodes.length, 18);
  for (const node of activeMasterNodes) {
    assert.equal(node.canChallenge, true);
    assert.equal(node.isDefeated, false);
    assert.ok(node.state === 'AVAILABLE' || node.state === 'RECOMMENDED');
  }

  // Recommendation must pick undefeated master of lowest difficulty
  const recommended = viewModel.recommendedMaster;
  assert.ok(recommended);
  // Lowest difficulty in K.MASTERS is 2 (Aster is difficulty 2, Normal)
  assert.equal(recommended.challengeId, 'master-normal');
  assert.equal(recommended.difficulty, 2);
});

test('Map Model — Mestre derrotado vira revanche e recomendação avança dinamicamente', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  // Defeat master-normal (Aster, diff 1)
  mgr.recordBattle({
    battleId: 'b-norm',
    kind: 'MASTER',
    id: 'master-normal',
    winner: 'player'
  });
  const rewardCandidate = mgr.getRewardCandidates().find(c => c.selectable);
  mgr.claimReward(rewardCandidate.id);

  const viewModel = Model.buildMapViewModel({
    catalog: CAMPAIGN_MAP_CATALOG,
    campaignState: mgr.getState(),
    masters: K.MASTERS,
    manager: mgr
  });

  assert.equal(viewModel.badgeCount, 1);
  const asterNode = viewModel.regions[0].nodes.find(n => n.challengeId === 'master-normal');
  assert.equal(asterNode.isDefeated, true);
  assert.equal(asterNode.state, 'REMATCH_AVAILABLE');
  assert.equal(asterNode.canChallenge, true);

  // Next recommendation must no longer be master-normal; should pick next lowest difficulty (e.g. diff 2)
  const nextRec = viewModel.recommendedMaster;
  assert.ok(nextRec);
  assert.notEqual(nextRec.challengeId, 'master-normal');
  assert.equal(nextRec.difficulty, 3);
});

test('Map Model — Região Final bloqueada com 17 insígnias e desbloqueada com 18', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  // Defeat 17 masters
  for (let i = 0; i < 17; i++) {
    const master = K.MASTERS[i];
    mgr.recordBattle({
      battleId: 'b-' + master.challengeId,
      kind: 'MASTER',
      id: master.challengeId,
      winner: 'player'
    });
    const cand = mgr.getRewardCandidates().find(c => c.selectable);
    if (cand) mgr.claimReward(cand.id);
  }

  let vm = Model.buildMapViewModel({
    catalog: CAMPAIGN_MAP_CATALOG,
    campaignState: mgr.getState(),
    masters: K.MASTERS,
    manager: mgr
  });

  assert.equal(vm.badgeCount, 17);
  const endgameLocked = vm.regions.find(r => r.id === 'region-endgame');
  assert.equal(endgameLocked.isLocked, true);
  assert.equal(endgameLocked.badgeCount, 17);

  // Defeat 18th master
  const lastMaster = K.MASTERS[17];
  mgr.recordBattle({
    battleId: 'b-' + lastMaster.challengeId,
    kind: 'MASTER',
    id: lastMaster.challengeId,
    winner: 'player'
  });
  const candLast = mgr.getRewardCandidates().find(c => c.selectable);
  if (candLast) mgr.claimReward(candLast.id);

  vm = Model.buildMapViewModel({
    catalog: CAMPAIGN_MAP_CATALOG,
    campaignState: mgr.getState(),
    masters: K.MASTERS,
    manager: mgr
  });

  assert.equal(vm.badgeCount, 18);
  const endgameUnlocked = vm.regions.find(r => r.id === 'region-endgame');
  assert.equal(endgameUnlocked.isLocked, false);

  // 4 trials must be available
  const trials = endgameUnlocked.nodes.filter(n => n.challengeKind.includes('TRIAL'));
  assert.equal(trials.length, 4);
  for (const t of trials) {
    assert.equal(t.canChallenge, true);
    assert.equal(t.state, 'AVAILABLE');
  }

  // Super must be available (18 badges, roster >= 24)
  const superNode = endgameUnlocked.nodes.find(n => n.challengeKind === 'SUPER');
  assert.ok(superNode);
  assert.equal(superNode.canChallenge, true);
  assert.equal(superNode.state, 'AVAILABLE');

  // Shadow must be hidden before reveal
  const shadowNode = endgameUnlocked.nodes.find(n => n.challengeKind === 'SHADOW');
  assert.ok(shadowNode);
  assert.equal(shadowNode.isHidden, true);
  assert.equal(shadowNode.state, 'HIDDEN');
});

test('Map Model — Prova concluída permite revanche sem nova recompensa', () => {
  const mgr = freshManager();
  unlock18Badges(mgr);

  // Play and claim Legendary trial
  mgr.recordBattle({
    battleId: 'test-legendary',
    kind: 'LEGENDARY_TRIAL',
    id: 145,
    opponentPokemonId: 145,
    winner: 'player'
  });
  const cand = mgr.getRewardCandidates().find(c => c.selectable);
  mgr.claimReward(cand.id);

  const vm = Model.buildMapViewModel({
    catalog: CAMPAIGN_MAP_CATALOG,
    campaignState: mgr.getState(),
    masters: K.MASTERS,
    manager: mgr
  });

  const endgame = vm.regions.find(r => r.id === 'region-endgame');
  const leg = endgame.nodes.find(n => n.challengeKind === 'LEGENDARY_TRIAL');
  assert.equal(leg.isDefeated, true);
  assert.equal(leg.state, 'REMATCH_AVAILABLE');
  assert.equal(leg.canChallenge, true);
});

test('Map Model — Shadow Trainer permanece oculto e depois revelado', () => {
  const mgr = freshManager();
  unlock18Badges(mgr);

  // Defeat Super
  mgr.recordBattle({
    battleId: 'test-super-win',
    kind: 'SUPER',
    winner: 'player'
  });
  mgr.acknowledgeSuperVictory();
  const elite = mgr.getRewardCandidates().find(c => c.selectable);
  mgr.claimReward(elite.id);

  // Now shadowTrainer.revealed === true
  assert.equal(mgr.getState().shadowTrainer.revealed, true);
  mgr.acknowledgeShadowReveal();

  const vm = Model.buildMapViewModel({
    catalog: CAMPAIGN_MAP_CATALOG,
    campaignState: mgr.getState(),
    masters: K.MASTERS,
    manager: mgr
  });

  const endgame = vm.regions.find(r => r.id === 'region-endgame');
  const shadowNode = endgame.nodes.find(n => n.challengeKind === 'SHADOW');
  assert.equal(shadowNode.isHidden, false);
  assert.equal(shadowNode.state, 'AVAILABLE');
  assert.equal(shadowNode.canChallenge, true);
});

test('Map Model — Sanitized legacy save generates valid view model without migration', () => {
  const raw = {
    version: 1,
    status: 'ACTIVE',
    startedAt: '2026-01-01T00:00:00.000Z',
    startingRosterIds: K.DRAFT.slice(0, 6).map(p => p.id),
    challenges: {
      'master-normal': { attempts: 2, badgeEarned: true, rewardPokemonId: 16 }
    },
    superTrainer: { attempts: 0, defeated: false, victorySeen: false },
    shadowTrainer: { attempts: 0, defeated: false, revealed: false, revealSeen: false, reinforcementsSeen: false },
    endgameTrials: {
      legendary: { completed: false, rewardClaimed: false, rewardPokemonId: null }
    },
    processedBattleIds: ['old-1']
  };

  const sanitized = S.sanitize(raw);
  assert.equal(sanitized.version, 1);

  const vm = Model.buildMapViewModel({
    catalog: CAMPAIGN_MAP_CATALOG,
    campaignState: sanitized,
    masters: K.MASTERS,
    manager: null
  });

  assert.ok(vm);
  assert.equal(vm.badgeCount, 1);
  assert.equal(vm.regions.length, 4);
});

// -----------------------------------------------------------------------------
// VIEW & ORCHESTRATION INTEGRATION
// -----------------------------------------------------------------------------
test('CampaignMapView — Instancia e expõe API com renderização', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  let challenged = null;
  const fakeContainer = { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] };

  const mapView = new CampaignMapView({
    manager: mgr,
    container: fakeContainer,
    onChallenge: action => { challenged = action; },
    onReset: () => {}
  });

  assert.ok(mapView);
  assert.equal(mapView.activeRegionId, 'region-1');
  assert.equal(mapView.viewMode, 'MAP');

  mapView.triggerChallenge({ challengeKind: 'MASTER', challengeId: 'master-grass' });
  assert.deepEqual(challenged, { kind: 'MASTER', id: 'master-grass' });
});

test('CampaignView — Delega renderHome para CampaignMapView e gerencia pendências', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  const fakeContainer = { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] };
  const campaignView = new CampaignView({
    manager: mgr,
    coordinator: { start: async () => {} },
    container: fakeContainer
  });

  assert.equal(campaignView.pending, null);
  campaignView.renderHome();
  assert.ok(campaignView.mapView, 'renderHome deve instanciar CampaignMapView');
});

// -----------------------------------------------------------------------------
// REQUISITOS OBRIGATÓRIOS DA FASE 2
// -----------------------------------------------------------------------------

test('Map Catalog — Imutabilidade profunda (deepFreeze recursivo)', () => {
  assert.ok(Object.isFrozen(CAMPAIGN_MAP_CATALOG), 'Catálogo deve estar congelado');
  for (const region of CAMPAIGN_MAP_CATALOG.regions) {
    assert.ok(Object.isFrozen(region), `Região ${region.id} deve estar congelada`);
    assert.ok(Object.isFrozen(region.fallbackTheme), `FallbackTheme de ${region.id} deve estar congelado`);
    assert.ok(Object.isFrozen(region.unlockCondition), `UnlockCondition de ${region.id} deve estar congelado`);
    assert.ok(Object.isFrozen(region.routes), `Array routes de ${region.id} deve estar congelado`);
    assert.ok(Object.isFrozen(region.nodes), `Array nodes de ${region.id} deve estar congelado`);

    for (const route of region.routes) {
      assert.ok(Object.isFrozen(route), `Rota ${route.routeId} deve estar congelada`);
      assert.throws(() => { 'use strict'; route.pathD = 'invalid'; }, TypeError);
    }
    for (const node of region.nodes) {
      assert.ok(Object.isFrozen(node), `Nó ${node.nodeId} deve estar congelado`);
      assert.ok(Object.isFrozen(node.position), `Position de ${node.nodeId} deve estar congelada`);
      assert.throws(() => { 'use strict'; node.position.x = 999; }, TypeError);
    }
  }
});

test('Caminho Real de Navegador (Script Tag via node:vm sem module/require) — Executa scripts na ordem do index.html', () => {
  const windowObj = {
    location: { href: 'http://localhost/' },
    sessionStorage: { getItem: () => null, setItem: () => {} },
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} }
  };
  windowObj.window = windowObj;
  windowObj.PBACampaign = {};

  const docObj = {
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    removeEventListener: () => {}
  };

  const sandbox = {
    window: windowObj,
    document: docObj,
    console: console,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout
  };
  vm.createContext(sandbox);

  // Ordem canônica rigorosa obtida diretamente do index.html
  const indexHtmlPath = path.resolve(__dirname, '../../index.html');
  const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
  const scriptRegex = /<script\s+[^>]*src="([^"]+)"[^>]*>/g;
  const indexScripts = [];
  let scriptMatch;
  while ((scriptMatch = scriptRegex.exec(indexHtmlContent)) !== null) {
    const cleanSrc = scriptMatch[1].split('?')[0].replace(/^\.\//, '');
    indexScripts.push(cleanSrc);
  }

  const requiredScripts = [
    'assets/js/battle/type-chart.js',
    'assets/js/campaign/campaign-constants.js',
    'assets/js/campaign/campaign-pokemon-catalog.js',
    'assets/js/campaign/campaign-catalog.js',
    'assets/js/campaign/campaign-wild-encounters.js',
    'assets/js/campaign/campaign-trainer-visuals.js',
    'assets/js/campaign/campaign-type-guide.js',
    'assets/js/campaign/campaign-store.js',
    'assets/js/campaign/campaign-manager.js',
    'assets/js/campaign/campaign-wild-manager.js',
    'assets/js/campaign/campaign-map-catalog.js',
    'assets/js/campaign/campaign-map-model.js',
    'assets/js/campaign/campaign-map-view.js',
    'assets/js/campaign/campaign-view.js',
    'assets/js/campaign/campaign-wild-view.js'
  ];

  const scripts = indexScripts.filter(src => requiredScripts.includes(src));
  assert.equal(scripts.length, requiredScripts.length, 'Todos os scripts requeridos devem estar presentes em index.html');
  for (const req of requiredScripts) {
    assert.ok(scripts.includes(req), `Script obrigatório ausente em index.html: ${req}`);
  }

  for (const relPath of scripts) {
    const code = fs.readFileSync(path.resolve(__dirname, '../../', relPath), 'utf8');
    vm.runInContext(code, sandbox, { filename: relPath });
  }

  assert.equal(typeof sandbox.module, 'undefined', 'module não deve estar disponível no contexto do navegador');
  assert.equal(typeof sandbox.require, 'undefined', 'require não deve estar disponível no contexto do navegador');

  const PBABattle = sandbox.window.PBABattle;
  assert.ok(PBABattle, 'window.PBABattle deve existir após carregar type-chart.js');
  assert.ok(PBABattle.TYPE_CHART, 'window.PBABattle.TYPE_CHART deve existir');

  const PBACampaign = sandbox.window.PBACampaign;
  assert.ok(PBACampaign, 'window.PBACampaign deve existir no contexto');
  assert.ok(PBACampaign.CampaignMapModel, 'window.PBACampaign.CampaignMapModel deve existir');
  assert.equal(typeof PBACampaign.CampaignMapModel.buildMapViewModel, 'function', 'CampaignMapModel.buildMapViewModel deve ser função');
  assert.ok(PBACampaign.CampaignMapView, 'window.PBACampaign.CampaignMapView deve existir');
  assert.equal(typeof PBACampaign.CampaignMapView, 'function', 'CampaignMapView deve ser construtor');
  assert.ok(PBACampaign.CampaignView, 'window.PBACampaign.CampaignView deve existir');
  assert.equal(typeof PBACampaign.CampaignView, 'function', 'CampaignView deve ser construtor');

  // Verifica que o guia de tipos funciona no ramo de navegador
  assert.equal(typeof PBACampaign.getTypeGuide, 'function', 'getTypeGuide deve ser função em PBACampaign');
  const grassGuide = PBACampaign.getTypeGuide('grass');
  assert.ok(grassGuide, 'getTypeGuide("grass") deve retornar guia válido');
  assert.ok(Array.isArray(grassGuide.offensiveStrengths), 'offensiveStrengths deve ser array');
  assert.ok(Array.isArray(grassGuide.defensiveWeaknesses), 'defensiveWeaknesses deve ser array');

  // Verifica que um Mestre recebe typeGuide válido no buildMapViewModel
  const manager = new PBACampaign.CampaignManager(PBACampaign.CampaignStore || { load: () => null, save: () => {} });
  const draftIds = (PBACampaign.DRAFT || []).slice(0, 6).map(p => p.id);
  manager.start(draftIds);

  const vmResult = PBACampaign.CampaignMapModel.buildMapViewModel({
    catalog: PBACampaign.CAMPAIGN_MAP_CATALOG,
    campaignState: manager.getState(),
    masters: PBACampaign.MASTERS,
    manager
  });
  const grassMasterNode = vmResult.regions[0].nodes.find(n => n.challengeId === 'master-grass');
  assert.ok(grassMasterNode, 'Nó master-grass deve existir');
  assert.ok(grassMasterNode.typeGuide, 'Mestre deve receber typeGuide válido no navegador, não fallback null');
  assert.ok(grassMasterNode.typeGuide.offensiveStrengths.length > 0, 'Guia do tipo grass deve conter forças ofensivas');

  const container = { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] };
  const view = new PBACampaign.CampaignMapView({
    manager,
    container
  });
  assert.ok(view);

  assert.doesNotThrow(() => {
    view.render();
  }, 'render() não deve lançar TypeError: Model.buildMapViewModel is not a function');

  assert.ok(container.innerHTML.includes('campaign-map-shell'), 'DOM gerado deve conter o shell do mapa');
});

const TRIAL_TEST_CASES = [
  { kind: 'LEGENDARY_TRIAL', expectedKey: 'legendary', expectedTitle: 'Prova Lendária' },
  { kind: 'MYTHICAL_TRIAL', expectedKey: 'mythical', expectedTitle: 'Prova Mítica' },
  { kind: 'TITANS_TRIAL', expectedKey: 'titans', expectedTitle: 'Prova dos Titãs' },
  { kind: 'CELESTIAL_TRIAL', expectedKey: 'celestial', expectedTitle: 'Prova Celestial' }
];

for (const { kind, expectedKey, expectedTitle } of TRIAL_TEST_CASES) {
  test(`Trials — ${kind} é reconhecido, inicia fluxo com { kind: '${kind}', id: null } e possui dados completos`, () => {
    const mgr = freshManager();
    unlock18Badges(mgr);

    const vm = Model.buildMapViewModel({
      catalog: CAMPAIGN_MAP_CATALOG,
      campaignState: mgr.getState(),
      masters: K.MASTERS,
      manager: mgr,
      activeRegionId: 'region-endgame'
    });

    const endgame = vm.regions.find(r => r.id === 'region-endgame');
    const trialNode = endgame.nodes.find(n => n.challengeKind === kind);
    assert.ok(trialNode, `Nó com challengeKind ${kind} deve existir`);
    assert.equal(trialNode.canChallenge, true);
    assert.equal(trialNode.trialKey, expectedKey);
    assert.equal(trialNode.trainerName, expectedTitle);
    assert.ok(Array.isArray(trialNode.team) && trialNode.team.length > 0, 'Equipe da prova deve ter pokémon');
    assert.ok(trialNode.difficulty >= 4, 'Dificuldade de Prova deve ser >= 4');

    let triggeredAction = null;
    const container = { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] };
    const mapView = new CampaignMapView({
      manager: mgr,
      container,
      onChallenge: action => { triggeredAction = action; }
    });

    const result = mapView.triggerChallenge(trialNode);
    assert.equal(result, true);
    assert.deepEqual(triggeredAction, { kind, id: null }, `triggerChallenge deve emitir { kind: '${kind}', id: null }`);
  });
}

test('View Model Contract — Contrato completo e consistente em todos os nós', () => {
  const mgr = freshManager();
  unlock18Badges(mgr);

  const vm = Model.buildMapViewModel({
    catalog: CAMPAIGN_MAP_CATALOG,
    campaignState: mgr.getState(),
    masters: K.MASTERS,
    manager: mgr
  });

  const allNodes = vm.regions.flatMap(r => r.nodes);
  assert.equal(allNodes.length, 24);

  for (const node of allNodes) {
    assert.ok(typeof node.nodeId === 'string' && node.nodeId.length > 0);
    assert.ok(typeof node.trainerName === 'string' && node.trainerName.length > 0, `Nó ${node.nodeId} deve ter trainerName`);
    assert.ok(typeof node.trainerTitle === 'string' && node.trainerTitle.length > 0, `Nó ${node.nodeId} deve ter trainerTitle`);
    assert.ok(typeof node.badgeName === 'string' && node.badgeName.length > 0, `Nó ${node.nodeId} deve ter badgeName`);
    assert.ok(typeof node.difficulty === 'number', `Nó ${node.nodeId} deve ter difficulty numérica`);
    assert.ok(Array.isArray(node.team), `Nó ${node.nodeId} deve ter array team`);
    assert.ok(typeof node.canChallenge === 'boolean', `Nó ${node.nodeId} deve ter booleano canChallenge`);
    assert.ok(typeof node.isDefeated === 'boolean');
    assert.ok(typeof node.isCompleted === 'boolean');
    assert.ok(typeof node.isHidden === 'boolean');
    assert.ok(typeof node.ariaLabel === 'string' && (node.isHidden || node.ariaLabel.length > 0));
  }
});

test('Hidden Routes — Rota para Shadow fica oculta antes da revelação e visível após a revelação', () => {
  const mgr = freshManager();
  unlock18Badges(mgr);

  // Before reveal: shadowTrainer.revealed is false
  let vm = Model.buildMapViewModel({
    catalog: CAMPAIGN_MAP_CATALOG,
    campaignState: mgr.getState(),
    masters: K.MASTERS,
    manager: mgr,
    activeRegionId: 'region-endgame'
  });

  const endgameBefore = vm.regions.find(r => r.id === 'region-endgame');
  const shadowRouteBefore = endgameBefore.routes.find(r => r.routeId === 'rend-super-shadow');
  assert.ok(shadowRouteBefore);
  assert.equal(shadowRouteBefore.status, 'hidden', 'Status da rota Shadow deve ser hidden antes do reveal');

  // Render map view to verify SVG does NOT include hidden route
  const container = { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] };
  const mapView = new CampaignMapView({
    manager: mgr,
    container,
    initialRegionId: 'region-endgame'
  });

  mapView.render();
  assert.ok(!container.innerHTML.includes('id="rend-super-shadow"'), 'SVG não pode desenhar rota oculta do Shadow');
  assert.ok(!container.innerHTML.includes('id="node-shadow"'), 'SVG não pode desenhar nó oculto do Shadow');

  // Now defeat Super and reveal Shadow
  mgr.recordBattle({ battleId: 'win-super', kind: 'SUPER', winner: 'player' });
  mgr.acknowledgeSuperVictory();
  const cand = mgr.getRewardCandidates().find(c => c.selectable);
  mgr.claimReward(cand.id);
  mgr.acknowledgeShadowReveal();

  vm = Model.buildMapViewModel({
    catalog: CAMPAIGN_MAP_CATALOG,
    campaignState: mgr.getState(),
    masters: K.MASTERS,
    manager: mgr,
    activeRegionId: 'region-endgame'
  });

  const endgameAfter = vm.regions.find(r => r.id === 'region-endgame');
  const shadowRouteAfter = endgameAfter.routes.find(r => r.routeId === 'rend-super-shadow');
  assert.ok(shadowRouteAfter);
  assert.notEqual(shadowRouteAfter.status, 'hidden', 'Status da rota Shadow não pode ser hidden após o reveal');

  mapView.render();
  assert.ok(container.innerHTML.includes('id="rend-super-shadow"'), 'SVG deve renderizar a rota do Shadow após o reveal');
  assert.ok(container.innerHTML.includes('id="node-shadow"'), 'SVG deve renderizar o nó do Shadow após o reveal');
});

test('canChallenge — Bloqueia nós e botões quando indisponível e impede disparo programático', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  // Generate pending reward state so canChallenge becomes false
  mgr.recordBattle({ battleId: 'win-normal', kind: 'MASTER', id: 'master-normal', winner: 'player' });
  assert.ok(mgr.getState().pendingReward, 'Deve haver recompensa pendente');

  const vm = Model.buildMapViewModel({
    catalog: CAMPAIGN_MAP_CATALOG,
    campaignState: mgr.getState(),
    masters: K.MASTERS,
    manager: mgr
  });

  const normalNode = vm.regions[0].nodes.find(n => n.challengeId === 'master-normal');
  assert.equal(normalNode.canChallenge, false, 'Com recompensa pendente, canChallenge deve ser falso');
  assert.ok(typeof normalNode.cannotChallengeReason === 'string' && normalNode.cannotChallengeReason.length > 0);

  let triggered = false;
  const container = { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] };
  const mapView = new CampaignMapView({
    manager: mgr,
    container,
    onChallenge: () => { triggered = true; }
  });

  const triggerResult = mapView.triggerChallenge(normalNode);
  assert.equal(triggerResult, false, 'triggerChallenge deve retornar false para nó com canChallenge=false');
  assert.equal(triggered, false, 'onChallenge não pode ser chamado para desafio bloqueado');

  // Verify render output has disabled attribute
  mapView.openNode(normalNode.nodeId);
  assert.ok(container.innerHTML.includes('disabled'), 'Botão do painel deve estar disabled');
});

test('Map Lifecycle — destroy() remove listeners e Escape no picker não substitui a tela', () => {
  const listeners = [];
  const fakeDoc = {
    addEventListener: (type, fn) => listeners.push({ type, fn }),
    removeEventListener: (type, fn) => {
      const idx = listeners.findIndex(l => l.type === type && l.fn === fn);
      if (idx >= 0) listeners.splice(idx, 1);
    }
  };
  global.document = fakeDoc;

  const mgr = freshManager();
  startCampaign(mgr);

  const container = { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] };
  const mapView = new CampaignMapView({
    manager: mgr,
    container
  });

  mapView.render();
  assert.equal(listeners.filter(l => l.type === 'keydown').length, 1, 'Deve registrar 1 listener keydown');

  // Open drawer
  mapView.openNode('node-normal');
  assert.equal(mapView.isDrawerOpen, true);

  // Call destroy
  mapView.destroy();
  assert.equal(listeners.filter(l => l.type === 'keydown').length, 0, 'destroy() deve remover o listener keydown');
  assert.equal(mapView.isDrawerOpen, false);
});

test('Details Drawer — Restauração de foco armazena ID estável e fecha com Escape', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  const container = { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] };
  const mapView = new CampaignMapView({
    manager: mgr,
    container
  });

  mapView.render();
  mapView.openNode('node-grass', null, 'map-node');

  assert.equal(mapView.selectedNodeId, 'node-grass');
  assert.equal(mapView.isDrawerOpen, true);
  assert.equal(mapView.lastFocusedNodeId, 'node-grass');

  // Simulate Escape keydown
  let defaultPrevented = false;
  let propagationStopped = false;
  mapView._handleKeyDown({
    key: 'Escape',
    preventDefault: () => { defaultPrevented = true; },
    stopPropagation: () => { propagationStopped = true; }
  });

  assert.equal(defaultPrevented, true);
  assert.equal(mapView.isDrawerOpen, false, 'Escape deve fechar o painel de detalhes');
});

test('Screen Reader — Região aria-live é renderizada vazia, atualizada de forma assíncrona, limpa pendências e não repete', async () => {
  const mgr = freshManager();
  startCampaign(mgr);

  let mockLiveElement = {
    textContent: '',
    isConnected: true
  };

  let capturedHtml = '';
  const container = {
    get innerHTML() { return capturedHtml; },
    set innerHTML(val) {
      capturedHtml = val;
      mockLiveElement = {
        textContent: '',
        isConnected: true
      };
    },
    querySelector: sel => sel === '#mapAriaLive' ? mockLiveElement : null,
    querySelectorAll: () => []
  };

  const mapView = new CampaignMapView({
    manager: mgr,
    container
  });

  mapView.render();
  assert.ok(capturedHtml.includes('id="mapAriaLive" class="campaign-map-live-region" role="status" aria-live="polite" aria-atomic="true"></div>'), 'Live region deve ser renderizada vazia no HTML inicial');
  assert.equal(mockLiveElement.textContent, '', 'Elemento deve iniciar vazio');

  mapView.announce('Modo Lista ativado');
  assert.equal(mapView.pendingAriaAnnouncement, 'Modo Lista ativado');

  await new Promise(resolve => setTimeout(resolve, 80));

  assert.equal(mockLiveElement.textContent, 'Modo Lista ativado', 'Elemento conectado deve receber o anúncio');
  assert.equal(mapView.pendingAriaAnnouncement, '', 'pendingAriaAnnouncement deve ser limpo após entrega');

  // Nova renderização não repete mensagem antiga
  mapView.render();
  assert.ok(capturedHtml.includes('id="mapAriaLive" class="campaign-map-live-region" role="status" aria-live="polite" aria-atomic="true"></div>'));
  assert.equal(mockLiveElement.textContent, '', 'Nova renderização deve criar live region vazia sem repetir mensagem');
  assert.equal(mapView.pendingAriaAnnouncement, '', 'Nenhum anúncio pendente para repetição');

  // Nova mensagem substitui a anterior e elementos desconectados não são alterados
  const oldElement = mockLiveElement;
  oldElement.isConnected = false;
  const newElement = { textContent: '', isConnected: true };
  container.querySelector = sel => sel === '#mapAriaLive' ? newElement : null;

  mapView.announce('Nova Mensagem de Teste');
  await new Promise(resolve => setTimeout(resolve, 80));

  assert.equal(newElement.textContent, 'Nova Mensagem de Teste', 'Novo elemento conectado recebe a nova mensagem');
  assert.equal(oldElement.textContent, '', 'Elemento antigo desconectado NÃO deve receber a mensagem');
});

test('Single Reset Confirmation — Reinicialização possui somente uma confirmação', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  let confirmCount = 0;
  global.confirm = () => {
    confirmCount++;
    return true;
  };

  const container = {
    innerHTML: '',
    querySelector: () => ({ onclick: null, focus: () => {}, classList: { remove: () => {} } }),
    querySelectorAll: () => []
  };
  const campaignView = new CampaignView({
    manager: mgr,
    coordinator: { start: async () => {} },
    container
  });

  campaignView.renderHome();
  assert.ok(campaignView.mapView);

  campaignView.mapView.onReset();
  assert.equal(confirmCount, 1, 'Deve haver exatamente 1 confirmação no reset da campanha');
});

test('Map Catalog & CSS Themes — Todas as quatro themeClass declaradas no catálogo possuem regra válida no CSS', () => {
  const cssPath = path.resolve(__dirname, '../../assets/css/campaign-map.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');

  assert.equal(CAMPAIGN_MAP_CATALOG.regions.length, 4);
  for (const region of CAMPAIGN_MAP_CATALOG.regions) {
    assert.ok(region.themeClass, `Região ${region.id} deve declarar themeClass`);
    const selectorRegex = new RegExp(`\\.${region.themeClass}\\b`);
    assert.ok(selectorRegex.test(cssContent), `Regra CSS para a classe .${region.themeClass} da região ${region.id} deve existir em assets/css/campaign-map.css`);
  }

  const r3 = CAMPAIGN_MAP_CATALOG.regions.find(r => r.id === 'region-3');
  assert.equal(r3.themeClass, 'theme-region-arcane', 'Região 3 deve declarar theme-region-arcane');
  assert.ok(/\.theme-region-arcane\b/.test(cssContent), '.theme-region-arcane deve existir no CSS');
});

test('Separação Estrutural — Super recebe node-kind-super, Shadow recebe node-kind-shadow, Trials recebem node-kind-trial', () => {
  const mgr = freshManager();
  unlock18Badges(mgr);

  // Reveal Shadow Trainer
  mgr.recordBattle({
    battleId: 'test-super',
    kind: 'SUPER',
    id: null,
    winner: 'player'
  });
  mgr.acknowledgeSuperVictory();
  const reward = mgr.getRewardCandidates().find(c => c.selectable);
  if (reward) mgr.claimReward(reward.id);
  mgr.acknowledgeShadowReveal();

  let capturedHtml = '';
  const container = {
    get innerHTML() { return capturedHtml; },
    set innerHTML(val) { capturedHtml = val; },
    querySelector: () => null,
    querySelectorAll: () => []
  };

  const mapView = new CampaignMapView({
    manager: mgr,
    container,
    initialRegionId: 'region-endgame'
  });

  // MAP VIEW
  mapView.viewMode = 'MAP';
  mapView.render();

  assert.ok(/id="node-legendary"[^>]*class="[^"]*node-kind-trial/.test(capturedHtml), 'node-legendary deve ter classe node-kind-trial');
  assert.ok(/id="node-mythical"[^>]*class="[^"]*node-kind-trial/.test(capturedHtml), 'node-mythical deve ter classe node-kind-trial');
  assert.ok(/id="node-titans"[^>]*class="[^"]*node-kind-trial/.test(capturedHtml), 'node-titans deve ter classe node-kind-trial');
  assert.ok(/id="node-celestial"[^>]*class="[^"]*node-kind-trial/.test(capturedHtml), 'node-celestial deve ter classe node-kind-trial');

  assert.ok(/id="node-super"[^>]*class="[^"]*node-kind-super/.test(capturedHtml), 'node-super deve ter classe node-kind-super');
  assert.ok(!/id="node-super"[^>]*class="[^"]*node-kind-trial/.test(capturedHtml), 'node-super NÃO pode ter classe node-kind-trial');

  assert.ok(/id="node-shadow"[^>]*class="[^"]*node-kind-shadow/.test(capturedHtml), 'node-shadow deve ter classe node-kind-shadow');
  assert.ok(!/id="node-shadow"[^>]*class="[^"]*node-kind-trial/.test(capturedHtml), 'node-shadow NÃO pode ter classe node-kind-trial');

  // DRAWER for Super
  mapView.openNode('node-super');
  assert.ok(capturedHtml.includes('Super Treinador'));
  assert.ok(!capturedHtml.includes('Prova de Elite'), 'Drawer do Super Treinador NÃO deve conter o texto "Prova de Elite"');
  assert.ok(capturedHtml.includes('Desafio Final'), 'Drawer do Super Treinador deve identificar como Desafio Final');

  // DRAWER for Shadow
  mapView.openNode('node-shadow');
  assert.ok(capturedHtml.includes('Shadow Super Trainer'));
  assert.ok(!capturedHtml.includes('Prova de Elite'), 'Drawer do Shadow NÃO deve conter o texto "Prova de Elite"');
  assert.ok(capturedHtml.includes('Anomalia Sombria') || capturedHtml.includes('Desafio Final Verdadeiro'), 'Drawer do Shadow deve identificar como Anomalia Sombria / Desafio Final Verdadeiro');

  // DRAWER for a Trial
  mapView.openNode('node-legendary');
  assert.ok(capturedHtml.includes('Prova de Elite'), 'Drawer de Trial deve conter "Prova de Elite"');
});

test('Separação em Modo Lista — Super e Shadow não exibem Prova Especial ou Prova de Elite', () => {
  const mgr = freshManager();
  unlock18Badges(mgr);

  let capturedHtml = '';
  const container = {
    get innerHTML() { return capturedHtml; },
    set innerHTML(val) { capturedHtml = val; },
    querySelector: () => null,
    querySelectorAll: () => []
  };

  const mapView = new CampaignMapView({
    manager: mgr,
    container,
    initialRegionId: 'region-endgame',
    initialViewMode: 'LIST'
  });

  // Verify challenge for Super when available
  let lastChallenge = null;
  mapView.onChallenge = payload => { lastChallenge = payload; };

  const vmAvailable = Model.buildMapViewModel({
    catalog: CAMPAIGN_MAP_CATALOG,
    campaignState: mgr.getState(),
    masters: K.MASTERS,
    manager: mgr,
    activeRegionId: 'region-endgame'
  });
  const endgameAvailable = vmAvailable.regions.find(r => r.id === 'region-endgame');
  const superNodeAvailable = endgameAvailable.nodes.find(n => n.nodeId === 'node-super');
  const trialNode = endgameAvailable.nodes.find(n => n.nodeId === 'node-legendary');

  assert.equal(superNodeAvailable.canChallenge, true);
  mapView.triggerChallenge(superNodeAvailable);
  assert.deepEqual(lastChallenge, { kind: 'SUPER', id: null });

  mapView.triggerChallenge(trialNode);
  assert.deepEqual(lastChallenge, { kind: 'LEGENDARY_TRIAL', id: null });

  // Now defeat Super and reveal Shadow
  mgr.recordBattle({ battleId: 'b-sup', kind: 'SUPER', id: null, winner: 'player' });
  mgr.acknowledgeSuperVictory();
  const c = mgr.getRewardCandidates().find(x => x.selectable);
  if (c) mgr.claimReward(c.id);
  mgr.acknowledgeShadowReveal();

  mapView.render();
  assert.ok(capturedHtml.includes('campaign-list-view'), 'Deve renderizar a visualização em lista');
  assert.ok(capturedHtml.includes('Desafio Final'), 'Lista deve conter Desafio Final para Super');
  assert.ok(capturedHtml.includes('Desafio Final Verdadeiro'), 'Lista deve conter Desafio Final Verdadeiro para Shadow');

  const vmShadow = Model.buildMapViewModel({
    catalog: CAMPAIGN_MAP_CATALOG,
    campaignState: mgr.getState(),
    masters: K.MASTERS,
    manager: mgr,
    activeRegionId: 'region-endgame'
  });
  const endgameShadow = vmShadow.regions.find(r => r.id === 'region-endgame');
  const shadowNode = endgameShadow.nodes.find(n => n.nodeId === 'node-shadow');

  assert.equal(shadowNode.canChallenge, true);
  mapView.triggerChallenge(shadowNode);
  assert.deepEqual(lastChallenge, { kind: 'SHADOW', id: null });
});

test('Lifecycle — Sair da aba Campanha via switchAppTab chama deactivate, remove listeners e não intercepta Escape', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  const listeners = [];
  const fakeDoc = {
    addEventListener: (type, fn) => listeners.push({ type, fn }),
    removeEventListener: (type, fn) => {
      const idx = listeners.findIndex(l => l.type === type && l.fn === fn);
      if (idx >= 0) listeners.splice(idx, 1);
    },
    getElementById: () => ({ style: {}, classList: { toggle: () => {} }, querySelector: () => null, querySelectorAll: () => [] }),
    querySelector: () => null,
    querySelectorAll: () => []
  };
  global.document = fakeDoc;

  let capturedHtml = '';
  const container = {
    get innerHTML() { return capturedHtml; },
    set innerHTML(val) { capturedHtml = val; },
    querySelector: () => ({ classList: { remove: () => {} }, style: {}, setAttribute: () => {} }),
    querySelectorAll: () => []
  };

  const campaignView = new CampaignView({
    manager: mgr,
    coordinator: { start: async () => {} },
    container
  });
  global.window.campaignView = campaignView;

  campaignView.renderHome();
  assert.ok(campaignView.mapView, 'mapView deve estar instanciado');
  campaignView.mapView.openNode('node-grass');
  assert.equal(campaignView.mapView.isDrawerOpen, true);

  const keydownListenersBefore = listeners.filter(l => l.type === 'keydown');
  assert.equal(keydownListenersBefore.length, 1, 'Deve haver exatamente 1 listener de keydown');

  // Deactivate on tab exit
  campaignView.deactivate();

  const keydownListenersAfter = listeners.filter(l => l.type === 'keydown');
  assert.equal(keydownListenersAfter.length, 0, 'Listener de keydown deve ser removido após deactivate');
  assert.equal(campaignView.mapView.isDrawerOpen, false, 'Drawer deve ser fechado após deactivate');

  // Return to Campaign
  campaignView.renderHome();
  assert.equal(listeners.filter(l => l.type === 'keydown').length, 1, 'Retornar à Campanha deve registrar novamente 1 listener');

  // Multiple switches without listener accumulation
  for (let i = 0; i < 5; i++) {
    campaignView.deactivate();
    assert.equal(listeners.filter(l => l.type === 'keydown').length, 0);
    campaignView.renderHome();
    assert.equal(listeners.filter(l => l.type === 'keydown').length, 1);
  }
  assert.equal(listeners.filter(l => l.type === 'keydown').length, 1, 'Nunca deve haver acúmulo de listeners');
});

test('CommonJS Safety — buildMapViewModel pode ser chamado sem objeto window no escopo', () => {
  const originalWindow = global.window;
  delete global.window;

  try {
    const result = Model.buildMapViewModel({
      catalog: CAMPAIGN_MAP_CATALOG,
      campaignState: {},
      masters: K.MASTERS
    });
    assert.ok(result, 'buildMapViewModel deve executar com sucesso sem window');
    assert.equal(result.badgeCount, 0);
    assert.ok(Array.isArray(result.regions));
  } finally {
    global.window = originalWindow;
  }
});

test('triggerChallenge — Valida desafio e payload sem desmontar o mapa para tipos ou IDs inválidos', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  const listeners = [];
  const fakeDoc = {
    addEventListener: (type, fn) => listeners.push({ type, fn }),
    removeEventListener: (type, fn) => {
      const idx = listeners.findIndex(l => l.type === type && l.fn === fn);
      if (idx >= 0) listeners.splice(idx, 1);
    },
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => []
  };
  global.document = fakeDoc;

  let fired = null;
  let callbackCount = 0;
  const mapView = new CampaignMapView({
    manager: mgr,
    container: { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] },
    onChallenge: action => {
      callbackCount++;
      fired = action;
    }
  });

  // Render para registrar o listener keydown
  mapView.render();
  assert.equal(listeners.filter(l => l.type === 'keydown').length, 1);

  // 1. Nó bloqueado
  callbackCount = 0;
  const lockedResult = mapView.triggerChallenge({ canChallenge: false, cannotChallengeReason: 'Bloqueado' });
  assert.equal(lockedResult, false);
  assert.equal(fired, null);
  assert.equal(callbackCount, 0, 'Nó bloqueado não pode disparar callback');

  // 2. Nó nulo
  callbackCount = 0;
  const nullResult = mapView.triggerChallenge(null);
  assert.equal(nullResult, false);
  assert.equal(fired, null);
  assert.equal(callbackCount, 0);

  // 3. Tipo desconhecido não desmonta o mapa
  mapView.isDrawerOpen = true;
  mapView.selectedNodeId = 'node-grass';
  fired = null;
  callbackCount = 0;
  const unknownResult = mapView.triggerChallenge({ challengeKind: 'UNKNOWN_KIND', canChallenge: true });
  assert.equal(unknownResult, false, 'Tipo desconhecido deve retornar false');
  assert.equal(fired, null, 'Tipo desconhecido não deve chamar onChallenge');
  assert.equal(callbackCount, 0, 'Tipo desconhecido não deve disparar callback');
  assert.equal(mapView.isDrawerOpen, true, 'Tipo desconhecido não deve fechar o drawer');
  assert.equal(mapView.selectedNodeId, 'node-grass', 'Tipo desconhecido não deve limpar selectedNodeId');
  assert.equal(listeners.filter(l => l.type === 'keydown').length, 1, 'Tipo desconhecido não deve remover o listener de teclado');

  // 4. Mestre sem challengeId válido
  fired = null;
  callbackCount = 0;
  const emptyMasterResult = mapView.triggerChallenge({ challengeKind: 'MASTER', challengeId: '', canChallenge: true });
  assert.equal(emptyMasterResult, false, 'Master com challengeId vazio deve retornar false');
  assert.equal(fired, null);
  assert.equal(callbackCount, 0);
  assert.equal(mapView.isDrawerOpen, true, 'Master inválido não deve fechar o drawer');
  assert.equal(mapView.selectedNodeId, 'node-grass');
  assert.equal(listeners.filter(l => l.type === 'keydown').length, 1);

  const whitespaceMasterResult = mapView.triggerChallenge({ challengeKind: 'MASTER', challengeId: '   ', canChallenge: true });
  assert.equal(whitespaceMasterResult, false, 'Master com challengeId apenas com espaços deve retornar false');
  assert.equal(fired, null);
  assert.equal(callbackCount, 0);

  const nullMasterResult = mapView.triggerChallenge({ challengeKind: 'MASTER', challengeId: null, canChallenge: true });
  assert.equal(nullMasterResult, false);
  assert.equal(fired, null);
  assert.equal(callbackCount, 0);

  // 5. Mestre válido executa com sucesso e desmonta mapa
  fired = null;
  callbackCount = 0;
  const masterResult = mapView.triggerChallenge({ challengeKind: 'MASTER', challengeId: 'master-grass', canChallenge: true });
  assert.equal(masterResult, true, 'Master válido deve retornar true');
  assert.deepEqual(fired, { kind: 'MASTER', id: 'master-grass' });
  assert.equal(callbackCount, 1, 'Master válido deve disparar exatamente um callback');
  assert.equal(mapView.isDrawerOpen, false, 'Master válido deve fechar o drawer');
  assert.equal(mapView.selectedNodeId, null, 'Master válido deve limpar selectedNodeId');
  assert.equal(listeners.filter(l => l.type === 'keydown').length, 0, 'Master válido deve remover o listener de teclado');

  // 6. Super Trainer válido
  mapView.render();
  mapView.isDrawerOpen = true;
  mapView.selectedNodeId = 'node-super';
  fired = null;
  callbackCount = 0;
  const superResult = mapView.triggerChallenge({ challengeKind: 'SUPER', canChallenge: true });
  assert.equal(superResult, true);
  assert.deepEqual(fired, { kind: 'SUPER', id: null });
  assert.equal(callbackCount, 1, 'Super Trainer válido deve disparar exatamente um callback');
  assert.equal(mapView.isDrawerOpen, false);
  assert.equal(mapView.selectedNodeId, null);

  // 7. Shadow Trainer válido
  mapView.render();
  mapView.isDrawerOpen = true;
  mapView.selectedNodeId = 'node-shadow';
  fired = null;
  callbackCount = 0;
  const shadowResult = mapView.triggerChallenge({ challengeKind: 'SHADOW', canChallenge: true });
  assert.equal(shadowResult, true);
  assert.deepEqual(fired, { kind: 'SHADOW', id: null });
  assert.equal(callbackCount, 1, 'Shadow Trainer válido deve disparar exatamente um callback');
  assert.equal(mapView.isDrawerOpen, false);
  assert.equal(mapView.selectedNodeId, null);

  // 8. Trials canônicos mantêm seu tipo específico
  const trials = ['LEGENDARY_TRIAL', 'MYTHICAL_TRIAL', 'TITANS_TRIAL', 'CELESTIAL_TRIAL'];
  for (const trialKind of trials) {
    mapView.render();
    mapView.isDrawerOpen = true;
    mapView.selectedNodeId = 'node-trial';
    fired = null;
    callbackCount = 0;
    const res = mapView.triggerChallenge({ challengeKind: trialKind, canChallenge: true });
    assert.equal(res, true, `${trialKind} deve retornar true`);
    assert.deepEqual(fired, { kind: trialKind, id: null });
    assert.equal(callbackCount, 1, `${trialKind} deve disparar exatamente um callback`);
    assert.equal(mapView.isDrawerOpen, false);
  }
});

test('Tabs WAI-ARIA — Painel estável único campaign-map-region-panel, aria-controls válidos e navegação', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  let capturedHtml = '';
  let focusedId = null;
  const mockTabs = [
    { id: 'tab-region-1', dataset: { regionId: 'region-1', isLocked: 'false' }, focus() { focusedId = 'tab-region-1'; }, click() { if (typeof this.onclick === 'function') this.onclick(); } },
    { id: 'tab-region-2', dataset: { regionId: 'region-2', isLocked: 'false' }, focus() { focusedId = 'tab-region-2'; }, click() { if (typeof this.onclick === 'function') this.onclick(); } },
    { id: 'tab-region-3', dataset: { regionId: 'region-3', isLocked: 'false' }, focus() { focusedId = 'tab-region-3'; }, click() { if (typeof this.onclick === 'function') this.onclick(); } },
    { id: 'tab-region-endgame', dataset: { regionId: 'region-endgame', isLocked: 'true' }, focus() { focusedId = 'tab-region-endgame'; }, click() { if (typeof this.onclick === 'function') this.onclick(); } }
  ];

  const container = {
    get innerHTML() { return capturedHtml; },
    set innerHTML(val) { capturedHtml = val; },
    querySelector: sel => {
      if (sel === '#campaign-map-region-panel') {
        return { focus: () => {}, id: 'campaign-map-region-panel' };
      }
      const foundTab = mockTabs.find(t => `#${t.id}` === sel);
      if (foundTab) return foundTab;
      return null;
    },
    querySelectorAll: sel => {
      if (sel === '.campaign-map-tab') return mockTabs;
      return [];
    }
  };

  const mapView = new CampaignMapView({
    manager: mgr,
    container
  });

  // Render inicial na Região 1
  mapView.render();

  // 1. Tabpanel possui ID estável campaign-map-region-panel
  assert.ok(capturedHtml.includes('id="campaign-map-region-panel"'), 'Deve existir o tabpanel estável #campaign-map-region-panel no DOM');
  assert.ok(capturedHtml.includes('role="tabpanel"'), 'Painel deve ter role="tabpanel"');
  assert.ok(capturedHtml.includes('aria-labelledby="tab-region-1"'), 'Painel deve ter aria-labelledby apontando para a aba ativa inicial');

  // 2. Todo aria-controls aponta para campaign-map-region-panel (elemento existente)
  const ariaControlsMatches = [...capturedHtml.matchAll(/aria-controls="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ariaControlsMatches.length, 4, 'Todas as 4 abas devem ter aria-controls');
  for (const targetId of ariaControlsMatches) {
    assert.equal(targetId, 'campaign-map-region-panel', 'aria-controls deve apontar para o painel estável existente');
    assert.ok(capturedHtml.includes(`id="${targetId}"`), `Painel alvo id="${targetId}" deve existir no HTML`);
  }

  // 3. Exatamente uma aba possui aria-selected="true"
  const tabRegex = /<button[^>]*role="tab"[^>]*>/g;
  const tabButtons = capturedHtml.match(tabRegex) || [];
  assert.equal(tabButtons.length, 4, 'Devem existir 4 abas declaradas');

  const selectedTrue = tabButtons.filter(t => t.includes('aria-selected="true"'));
  assert.equal(selectedTrue.length, 1, 'Exatamente uma aba deve ter aria-selected="true"');
  const selectedFalse = tabButtons.filter(t => t.includes('aria-selected="false"'));
  assert.equal(selectedFalse.length, 3, 'As outras 3 abas devem ter aria-selected="false"');

  // 4. Exatamente uma aba possui tabindex="0"
  const tabIndexZero = tabButtons.filter(t => t.includes('tabindex="0"'));
  assert.equal(tabIndexZero.length, 1, 'Exatamente uma aba deve ter tabindex="0"');
  const tabIndexMinusOne = tabButtons.filter(t => t.includes('tabindex="-1"'));
  assert.equal(tabIndexMinusOne.length, 3, 'As outras 3 abas devem ter tabindex="-1"');

  // 5. Aba bloqueada possui aria-disabled="true"
  assert.ok(capturedHtml.includes('id="tab-region-endgame"'));
  assert.ok(/id="tab-region-endgame"[^>]*aria-disabled="true"/.test(capturedHtml), 'Aba da Região Final bloqueada deve ter aria-disabled="true"');

  // 6. Troca de região atualiza aria-labelledby para a nova aba ativa
  mapView.activeRegionId = 'region-2';
  mapView.render();
  assert.ok(capturedHtml.includes('id="campaign-map-region-panel"'), 'Painel permanece com o mesmo ID estável');
  assert.ok(capturedHtml.includes('aria-labelledby="tab-region-2"'), 'aria-labelledby deve ser atualizado para tab-region-2');
  assert.ok(/id="tab-region-2"[^>]*aria-selected="true"/.test(capturedHtml), 'Aba 2 deve ter aria-selected="true"');
  assert.ok(/id="tab-region-1"[^>]*aria-selected="false"/.test(capturedHtml), 'Aba 1 deve ter aria-selected="false"');

  // 7. Tentativa de ativar a Região Final bloqueada não a ativa e produz aviso acessível
  mapView.activeRegionId = 'region-1';
  mapView.render();

  let announcedMessage = '';
  mapView.announce = msg => { announcedMessage = msg; };

  // Executa o click handler REAL da aba bloqueada
  mockTabs[3].click();
  assert.equal(mapView.activeRegionId, 'region-1', 'Região ativa não deve mudar para a Região Final bloqueada');
  assert.ok(announcedMessage.includes('Região Final bloqueada'), 'Aviso acessível deve ser disparado');

  // 8. Navegação por teclado: Setas, Home, End, Enter e Espaço
  // ArrowRight avança foco
  let prevented = false;
  mockTabs[0].onkeydown({ key: 'ArrowRight', preventDefault() { prevented = true; } });
  assert.equal(focusedId, 'tab-region-2', 'ArrowRight deve mover foco para próxima aba');
  assert.equal(prevented, true);

  // ArrowRight no fim dá wrap para o início
  mockTabs[3].onkeydown({ key: 'ArrowRight', preventDefault() {} });
  assert.equal(focusedId, 'tab-region-1', 'ArrowRight no fim deve voltar para tab-region-1');

  // ArrowLeft recua foco
  mockTabs[1].onkeydown({ key: 'ArrowLeft', preventDefault() {} });
  assert.equal(focusedId, 'tab-region-1', 'ArrowLeft deve mover foco para aba anterior');

  // ArrowLeft no início dá wrap para o fim
  mockTabs[0].onkeydown({ key: 'ArrowLeft', preventDefault() {} });
  assert.equal(focusedId, 'tab-region-endgame', 'ArrowLeft no início deve ir para tab-region-endgame');

  // Home vai para a primeira aba
  mockTabs[2].onkeydown({ key: 'Home', preventDefault() {} });
  assert.equal(focusedId, 'tab-region-1', 'Home deve focar a primeira aba');

  // End vai para a última aba
  mockTabs[0].onkeydown({ key: 'End', preventDefault() {} });
  assert.equal(focusedId, 'tab-region-endgame', 'End deve focar a última aba');

  // Enter ativa a aba
  mockTabs[1].onkeydown({ key: 'Enter', preventDefault() {} });
  assert.equal(mapView.activeRegionId, 'region-2', 'Enter deve ativar a aba selecionada');

  // Espaço ativa a aba
  mockTabs[0].onkeydown({ key: ' ', preventDefault() {} });
  assert.equal(mapView.activeRegionId, 'region-1', 'Espaço deve ativar a aba selecionada');
});

test('Integração Real switchAppTab — Executa a implementação real de switchAppTab() de main.js com ciclo completo de vida', () => {
  const mainCode = fs.readFileSync(path.resolve(__dirname, '../../assets/js/main.js'), 'utf8');

  const listeners = [];
  const fakeDoc = {
    getElementById: id => ({
      id,
      style: {},
      classList: { toggle: () => {}, add: () => {}, remove: () => {} },
      addEventListener: () => {},
      setAttribute: () => {},
      querySelector: () => null,
      querySelectorAll: () => [],
      innerHTML: ''
    }),
    querySelectorAll: () => [
      { dataset: { tab: 'pokedex' }, classList: { toggle: () => {} }, addEventListener: () => {} },
      { dataset: { tab: 'team' }, classList: { toggle: () => {} }, addEventListener: () => {} },
      { dataset: { tab: 'battle' }, classList: { toggle: () => {} }, addEventListener: () => {} },
      { dataset: { tab: 'campaign' }, classList: { toggle: () => {} }, addEventListener: () => {} },
      { dataset: { tab: 'profile' }, classList: { toggle: () => {} }, addEventListener: () => {} }
    ],
    documentElement: { setAttribute: () => {} },
    addEventListener: (type, fn) => listeners.push({ type, fn }),
    removeEventListener: (type, fn) => {
      const idx = listeners.findIndex(l => l.type === type && l.fn === fn);
      if (idx >= 0) listeners.splice(idx, 1);
    }
  };

  const sandbox = {
    window: {
      scrollTo: () => {},
      addEventListener: () => {},
      removeEventListener: () => {}
    },
    document: fakeDoc,
    localStorage: { getItem: () => null, setItem: () => {} },
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    console: console,
    pokeApi: { getPokemons: () => Promise.resolve([]) }
  };
  sandbox.window.window = sandbox.window;
  sandbox.window.document = fakeDoc;

  vm.createContext(sandbox);
  vm.runInContext(mainCode, sandbox);

  assert.equal(typeof sandbox.window.switchAppTab, 'function', 'window.switchAppTab deve ser função gerada pelo código real de main.js');

  const mgr = freshManager();
  startCampaign(mgr);

  let deactivateCount = 0;
  let renderCount = 0;

  let capturedHtml = '';
  const container = {
    get innerHTML() { return capturedHtml; },
    set innerHTML(val) { capturedHtml = val; },
    querySelector: () => ({ classList: { remove: () => {} }, style: {}, setAttribute: () => {} }),
    querySelectorAll: () => []
  };

  global.document = fakeDoc;

  // Instância real de CampaignView
  const realCampaignView = new CampaignView({
    manager: mgr,
    coordinator: { start: async () => {} },
    container
  });

  const originalDeactivate = realCampaignView.deactivate.bind(realCampaignView);
  realCampaignView.deactivate = function() {
    deactivateCount++;
    return originalDeactivate();
  };

  const originalRender = realCampaignView.render.bind(realCampaignView);
  realCampaignView.render = function() {
    renderCount++;
    return originalRender();
  };

  sandbox.window.campaignView = realCampaignView;

  // 1. Abre mapa da campanha e abre o drawer
  realCampaignView.render();
  assert.ok(realCampaignView.mapView, 'mapView deve ser instanciado');
  realCampaignView.mapView.openNode('node-grass');
  assert.equal(realCampaignView.mapView.isDrawerOpen, true, 'Drawer deve estar aberto');
  assert.equal(listeners.filter(l => l.type === 'keydown').length, 1, 'Deve haver 1 listener keydown');

  // 2. Executa a função real switchAppTab('pokedex')
  sandbox.window.switchAppTab('pokedex');
  assert.equal(deactivateCount, 1, 'switchAppTab deve ter chamado campaignView.deactivate()');
  assert.equal(realCampaignView.mapView.isDrawerOpen, false, 'Drawer deve estar fechado após sair da Campanha');
  assert.equal(listeners.filter(l => l.type === 'keydown').length, 0, 'Listener keydown deve ter sido removido');

  // 3. Verifica que Escape não é interceptado fora da Campanha
  let escapeHandled = false;
  listeners.forEach(l => {
    if (l.type === 'keydown') {
      l.fn({ key: 'Escape', preventDefault: () => { escapeHandled = true; }, stopPropagation: () => {} });
    }
  });
  assert.equal(escapeHandled, false, 'Escape não deve ser interceptado fora da Campanha');

  // 4. Retorna para a Campanha via switchAppTab('campaign')
  const initialRenderCount = renderCount;
  sandbox.window.switchAppTab('campaign');
  assert.ok(renderCount > initialRenderCount, 'switchAppTab deve ter chamado campaignView.render()');
  assert.equal(listeners.filter(l => l.type === 'keydown').length, 1, 'Exatamente 1 listener keydown deve ser registrado');

  // 5. Repete o ciclo 5 vezes
  for (let i = 0; i < 5; i++) {
    sandbox.window.switchAppTab('pokedex');
    assert.equal(listeners.filter(l => l.type === 'keydown').length, 0);
    sandbox.window.switchAppTab('campaign');
    assert.equal(listeners.filter(l => l.type === 'keydown').length, 1);
  }
  assert.equal(listeners.filter(l => l.type === 'keydown').length, 1, 'Não deve haver acúmulo de listeners após múltiplas trocas de aba');
});

// -----------------------------------------------------------------------------
// FASE 3 — ARTE FINAL E INTEGRAÇÃO DOS MAPAS DE CAMPANHA
// -----------------------------------------------------------------------------
test('Map Phase 3 — Catálogo define bgImage local e único para todas as 4 regiões', () => {
  assert.equal(CAMPAIGN_MAP_CATALOG.regions.length, 4);
  const bgImages = CAMPAIGN_MAP_CATALOG.regions.map(r => r.bgImage);

  // 1. Todas as regiões possuem bgImage
  for (const r of CAMPAIGN_MAP_CATALOG.regions) {
    assert.ok(r.bgImage, `Região ${r.id} deve definir bgImage`);
    assert.equal(typeof r.bgImage, 'string');
    // 2. Caminhos locais terminam em .webp
    assert.ok(r.bgImage.endsWith('.webp'), `bgImage da região ${r.id} deve terminar em .webp`);
    assert.ok(r.bgImage.startsWith('assets/images/campaign/maps/'), `bgImage deve apontar para assets/images/campaign/maps/`);
    // 11. Nenhum fundo remoto ou data URL
    assert.ok(!r.bgImage.startsWith('http://') && !r.bgImage.startsWith('https://') && !r.bgImage.startsWith('//') && !r.bgImage.startsWith('data:'), `Nenhum fundo remoto permitido: ${r.bgImage}`);
  }

  // 2. Caminhos são únicos
  assert.equal(new Set(bgImages).size, 4, 'Cada região deve ter um arquivo de fundo WebP exclusivo');
});

test('Map Phase 3 — Arquivos WebP existem no disco e possuem cabeçalho RIFF/WEBP válido', () => {
  for (const r of CAMPAIGN_MAP_CATALOG.regions) {
    const fullPath = path.resolve(__dirname, '../../', r.bgImage);
    // 3. Os quatro arquivos existem
    assert.ok(fs.existsSync(fullPath), `Arquivo de fundo não encontrado no disco: ${fullPath}`);

    const buffer = fs.readFileSync(fullPath);
    assert.ok(buffer.length > 0, `Arquivo vazio: ${fullPath}`);

    // 4. Conteúdo WebP válido: bytes 0..3 = 'RIFF', bytes 8..11 = 'WEBP'
    const riffHeader = buffer.subarray(0, 4).toString('ascii');
    const webpHeader = buffer.subarray(8, 12).toString('ascii');
    assert.equal(riffHeader, 'RIFF', `Cabeçalho inválido no arquivo ${r.bgImage}: esperado RIFF, obtido ${riffHeader}`);
    assert.equal(webpHeader, 'WEBP', `Cabeçalho inválido no arquivo ${r.bgImage}: esperado WEBP, obtido ${webpHeader}`);
  }
});

test('Map Phase 3 — Orçamento de peso e dimensões reais: <= 140 KB por fundo, <= 560 KB total, 1280x720 (16:9)', () => {
  const MAX_BYTES = 143360; // 140 KB
  let totalBytes = 0;

  function parseWebPDimensions(buf) {
    if (buf.length < 30) throw new Error('Buffer muito curto para cabeçalho WebP');
    const chunkType = buf.subarray(12, 16).toString('ascii');
    if (chunkType === 'VP8 ') {
      const width = ((buf[26] | (buf[27] << 8)) & 0x3fff);
      const height = ((buf[28] | (buf[29] << 8)) & 0x3fff);
      return { width, height };
    } else if (chunkType === 'VP8L') {
      const b21 = buf[21], b22 = buf[22], b23 = buf[23], b24 = buf[24];
      const width = 1 + (((b22 & 0x3f) << 8) | b21);
      const height = 1 + (((b24 & 0x0f) << 10) | (b23 << 2) | ((b22 & 0xc0) >> 6));
      return { width, height };
    } else if (chunkType === 'VP8X') {
      const width = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16));
      const height = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16));
      return { width, height };
    }
    throw new Error('Tipo de chunk WebP desconhecido: ' + chunkType);
  }

  for (const r of CAMPAIGN_MAP_CATALOG.regions) {
    const fullPath = path.resolve(__dirname, '../../', r.bgImage);
    const stats = fs.statSync(fullPath);
    const size = stats.size;
    totalBytes += size;

    // Arquivo existente e conteúdo não vazio
    assert.ok(stats.isFile(), `Asset deve ser arquivo regular: ${r.bgImage}`);
    assert.ok(size > 0, `Fundo não pode ser vazio: ${r.bgImage}`);

    // Limite máximo de 140 KB por asset
    assert.ok(size <= MAX_BYTES, `Fundo ${r.bgImage} ultrapassou o orçamento de 140 KB: ${size} bytes (${(size / 1024).toFixed(2)} KB)`);

    // Validação real das dimensões dos arquivos a partir dos metadados binários WebP
    const buffer = fs.readFileSync(fullPath);
    const dims = parseWebPDimensions(buffer);
    assert.equal(dims.width, 1280, `Largura do arquivo ${r.bgImage} deve ser exatamente 1280px (obtido: ${dims.width})`);
    assert.equal(dims.height, 720, `Altura do arquivo ${r.bgImage} deve ser exatamente 720px (obtido: ${dims.height})`);
    assert.equal(dims.width / dims.height, 16 / 9, `Proporção do arquivo ${r.bgImage} deve ser 16:9`);
  }

  // Total dos 4 fundos não deve ultrapassar 560 KB
  assert.ok(totalBytes <= MAX_BYTES * 4, `Peso acumulado dos 4 fundos (${totalBytes} bytes) excedeu o limite combinado de 560 KB`);
});

test('Map Phase 3 — View usa o fundo correspondente à região ativa com atributos decorativos', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  let capturedHtml = '';
  const container = {
    get innerHTML() { return capturedHtml; },
    set innerHTML(val) { capturedHtml = val; },
    querySelector: () => null,
    querySelectorAll: () => []
  };

  const view = new CampaignMapView({
    manager: mgr,
    container,
    initialRegionId: 'region-1',
    initialViewMode: 'MAP'
  });

  view.render();

  // 6. A view usa o fundo correspondente à região ativa
  assert.ok(capturedHtml.includes('src="assets/images/campaign/maps/region-1-vales.webp"'), 'Stage deve carregar region-1-vales.webp para a região 1');

  // 7. A imagem é decorativa: alt="" e aria-hidden="true"
  assert.ok(capturedHtml.includes('class="campaign-map-bg-image"'), 'Imagem deve ter classe campaign-map-bg-image');
  assert.ok(capturedHtml.includes('alt=""'), 'Imagem deve ter alt="" vazio');
  assert.ok(capturedHtml.includes('aria-hidden="true"'), 'Imagem deve ter aria-hidden="true"');
  assert.ok(capturedHtml.includes('width="1280"'), 'Imagem deve declarar width="1280"');
  assert.ok(capturedHtml.includes('height="720"'), 'Imagem deve declarar height="720"');

  // 8. O fallback permanece presente (classe temática no stage)
  assert.ok(capturedHtml.includes('theme-region-verdant'), 'Stage deve conter a classe de gradiente de fallback theme-region-verdant');
  assert.ok(capturedHtml.includes('class="map-contrast-overlay"'), 'Stage deve conter overlay de contraste');

  // 1. Somente o fundo da região ativa é solicitado (as outras 3 não devem estar no HTML)
  assert.ok(!capturedHtml.includes('region-2-fendas.webp'), 'Região inativa 2 não deve ser carregada inicialmente');
  assert.ok(!capturedHtml.includes('region-3-arcanas.webp'), 'Região inativa 3 não deve ser carregada inicialmente');
  assert.ok(!capturedHtml.includes('region-endgame.webp'), 'Região inativa endgame não deve ser carregada inicialmente');
});

test('Map Phase 3 — Troca de região atualiza para o fundo correspondente sem carregar os outros', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  let capturedHtml = '';
  const container = {
    get innerHTML() { return capturedHtml; },
    set innerHTML(val) { capturedHtml = val; },
    querySelector: () => null,
    querySelectorAll: () => []
  };

  const view = new CampaignMapView({
    manager: mgr,
    container,
    initialRegionId: 'region-1',
    initialViewMode: 'MAP'
  });

  // Troca para Região 2
  view.activeRegionId = 'region-2';
  view.render();
  assert.ok(capturedHtml.includes('src="assets/images/campaign/maps/region-2-fendas.webp"'));
  assert.ok(!capturedHtml.includes('region-1-vales.webp'));
  assert.ok(!capturedHtml.includes('region-3-arcanas.webp'));
  assert.ok(!capturedHtml.includes('region-endgame.webp'));
  assert.ok(capturedHtml.includes('theme-region-crags'));

  // Troca para Região 3
  view.activeRegionId = 'region-3';
  view.render();
  assert.ok(capturedHtml.includes('src="assets/images/campaign/maps/region-3-arcanas.webp"'));
  assert.ok(!capturedHtml.includes('region-1-vales.webp'));
  assert.ok(!capturedHtml.includes('region-2-fendas.webp'));
  assert.ok(!capturedHtml.includes('region-endgame.webp'));
  assert.ok(capturedHtml.includes('theme-region-arcane'));

  // Troca para Região Endgame (requer 18 insígnias desbloqueadas)
  const endgameMgr = freshManager();
  unlock18Badges(endgameMgr);
  const endgameView = new CampaignMapView({
    manager: endgameMgr,
    container,
    initialRegionId: 'region-endgame',
    initialViewMode: 'MAP'
  });
  endgameView.render();
  assert.ok(capturedHtml.includes('src="assets/images/campaign/maps/region-endgame.webp"'));
  assert.ok(!capturedHtml.includes('region-1-vales.webp'));
  assert.ok(!capturedHtml.includes('region-2-fendas.webp'));
  assert.ok(!capturedHtml.includes('region-3-arcanas.webp'));
  assert.ok(capturedHtml.includes('theme-region-endgame'));
});

test('Map Phase 3 — Falha de carregamento da imagem dispara listener comportamental e mantém mapa funcional', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  let capturedHtml = '';
  const listeners = {};
  const mockBgImg = {
    classList: {
      _classes: new Set(),
      add(cls) { this._classes.add(cls); },
      contains(cls) { return this._classes.has(cls); }
    },
    addEventListener(event, fn) {
      listeners[event] = listeners[event] || [];
      listeners[event].push(fn);
    },
    dispatchEvent(event) {
      const type = typeof event === 'string' ? event : event.type;
      (listeners[type] || []).forEach(fn => fn(event));
      return true;
    },
    complete: false,
    naturalWidth: 0
  };

  const container = {
    get innerHTML() { return capturedHtml; },
    set innerHTML(val) { capturedHtml = val; },
    querySelector: (sel) => {
      if (sel === '.campaign-map-bg-image') return mockBgImg;
      return null;
    },
    querySelectorAll: () => []
  };

  const view = new CampaignMapView({
    manager: mgr,
    container,
    initialRegionId: 'region-1',
    initialViewMode: 'MAP'
  });

  view.render();

  // 1. Confirme que não existe onerror= inline na imagem de fundo
  const bgImgMatch = capturedHtml.match(/<img[^>]*class="campaign-map-bg-image"[^>]*>/);
  assert.ok(bgImgMatch, 'Elemento campaign-map-bg-image deve estar presente no HTML gerado');
  assert.ok(!bgImgMatch[0].includes('onerror='), 'Tag de imagem de fundo não deve conter atributo onerror inline');

  // 2. Confirme que um listener de error foi registrado
  assert.ok(Array.isArray(listeners.error) && listeners.error.length > 0, 'Listener de error deve ser registrado via addEventListener');

  // 3. Dispare o evento de erro
  assert.equal(mockBgImg.classList.contains('is-hidden'), false, 'is-hidden não deve estar presente antes do erro');
  mockBgImg.dispatchEvent({ type: 'error' });

  // 4. Confirme a adição de is-hidden
  assert.equal(mockBgImg.classList.contains('is-hidden'), true, 'Disparo de evento de erro deve adicionar a classe is-hidden');

  // 5. Confirme que o stage ainda mantém a classe de fallback
  assert.ok(capturedHtml.includes('theme-region-verdant'), 'Stage deve reter a classe de gradiente temático de fallback');

  // 6. Confirme que nós e rotas continuam presentes
  assert.ok(capturedHtml.includes('class="campaign-map-routes"'), 'Rotas SVG devem permanecer presentes');
  assert.ok(capturedHtml.includes('class="campaign-map-node'), 'Nós interativos devem permanecer presentes');
  assert.ok(capturedHtml.includes('data-node-id="node-grass"'), 'Nó interativo individual deve permanecer presente');

  // Teste de resiliência: imagem que já completou com erro antes da anexação do listener
  const completedErrorImg = {
    classList: {
      _classes: new Set(),
      add(cls) { this._classes.add(cls); },
      contains(cls) { return this._classes.has(cls); }
    },
    addEventListener() {},
    complete: true,
    naturalWidth: 0
  };
  const containerCompleted = {
    get innerHTML() { return capturedHtml; },
    set innerHTML(val) { capturedHtml = val; },
    querySelector: (sel) => sel === '.campaign-map-bg-image' ? completedErrorImg : null,
    querySelectorAll: () => []
  };
  const viewCompleted = new CampaignMapView({
    manager: mgr,
    container: containerCompleted,
    initialRegionId: 'region-1',
    initialViewMode: 'MAP'
  });
  viewCompleted.render();
  assert.equal(completedErrorImg.classList.contains('is-hidden'), true, 'Imagem já completada com erro (naturalWidth=0) deve receber is-hidden imediatamente');
});

test('Map Phase 3 — Calibração da Região Final: Coordenadas e Rotas SVG convergem para centros exatos dos nós', () => {
  const endgame = CAMPAIGN_MAP_CATALOG.regions.find(r => r.id === 'region-endgame');
  assert.ok(endgame, 'Região Final deve existir no catálogo');

  const nodeMap = new Map(endgame.nodes.map(n => [n.nodeId, n]));
  const superNode = nodeMap.get('node-super');
  const shadowNode = nodeMap.get('node-shadow');
  const titansNode = nodeMap.get('node-titans');
  const celestialNode = nodeMap.get('node-celestial');
  const legendaryNode = nodeMap.get('node-legendary');
  const mythicalNode = nodeMap.get('node-mythical');

  // 1. Super e Shadow possuem coordenadas distintas e coerentes com a composição
  assert.notDeepEqual(superNode.position, shadowNode.position, 'Super e Shadow devem ter coordenadas distintas');
  assert.equal(superNode.position.x, 50.0);
  assert.equal(superNode.position.y, 56.0, 'Super deve estar centralizado na arena dourada (~56%)');
  assert.equal(shadowNode.position.x, 50.0);
  assert.equal(shadowNode.position.y, 20.0, 'Shadow deve estar centralizado no trono do eclipse (~20%)');
  assert.ok(superNode.position.y > shadowNode.position.y, 'Super deve ficar visualmente abaixo de Shadow');

  // 4. Os quatro nós das Provas permanecem inalterados
  assert.deepEqual(legendaryNode.position, { x: 20.0, y: 70.0 }, 'Prova Lendária deve permanecer inalterada');
  assert.deepEqual(mythicalNode.position, { x: 80.0, y: 70.0 }, 'Prova Mítica deve permanecer inalterada');
  assert.deepEqual(titansNode.position, { x: 22.0, y: 36.0 }, 'Prova dos Titãs deve permanecer inalterada');
  assert.deepEqual(celestialNode.position, { x: 78.0, y: 36.0 }, 'Prova Celestial deve permanecer inalterada');

  // Helper de conversão canônica: percentual para coordenadas SVG (1000 x 562.5)
  const toSvgCoords = pos => ({
    x: pos.x * 10,
    y: pos.y * 5.625
  });

  const superSvg = toSvgCoords(superNode.position); // { x: 500, y: 315 }
  const shadowSvg = toSvgCoords(shadowNode.position); // { x: 500, y: 112.5 }

  // Extrator de pontos de início e fim de pathD
  function extractEndpoints(pathD) {
    const startMatch = pathD.match(/^M\s*([\d.]+)\s+([\d.]+)/);
    const endMatch = pathD.match(/[\s,]([\d.]+)\s+([\d.]+)$/);
    assert.ok(startMatch, `pathD inválido para extração de início: ${pathD}`);
    assert.ok(endMatch, `pathD inválido para extração de fim: ${pathD}`);
    return {
      start: { x: parseFloat(startMatch[1]), y: parseFloat(startMatch[2]) },
      end: { x: parseFloat(endMatch[1]), y: parseFloat(endMatch[2]) }
    };
  }

  // 2. Todas as 4 rotas destinadas ao Super terminem exatamente nas coordenadas SVG derivadas do nó
  const routesToSuper = [
    'rend-titans-super',
    'rend-celestial-super',
    'rend-legendary-super',
    'rend-mythical-super'
  ];

  for (const routeId of routesToSuper) {
    const route = endgame.routes.find(r => r.routeId === routeId);
    assert.ok(route, `Rota ${routeId} deve existir`);
    assert.equal(route.to, 'node-super', `Rota ${routeId} deve terminar em node-super`);
    const endpoints = extractEndpoints(route.pathD);
    const fromNode = nodeMap.get(route.from);
    const fromSvg = toSvgCoords(fromNode.position);

    // Início coincide com nó de origem (tolerância de arredondamento <= 0.5 px)
    assert.ok(Math.abs(endpoints.start.x - fromSvg.x) <= 0.5, `Início X da rota ${routeId} deve coincidir com origem`);
    assert.ok(Math.abs(endpoints.start.y - fromSvg.y) <= 0.5, `Início Y da rota ${routeId} deve coincidir com origem`);

    // Fim coincide exatamente com centro do Super
    assert.equal(endpoints.end.x, superSvg.x, `Fim X da rota ${routeId} deve coincidir com Super SVG X`);
    assert.equal(endpoints.end.y, superSvg.y, `Fim Y da rota ${routeId} deve coincidir com Super SVG Y`);
  }

  // 3. rend-super-shadow começa no centro do Super e termina no centro do Shadow
  const superShadowRoute = endgame.routes.find(r => r.routeId === 'rend-super-shadow');
  assert.ok(superShadowRoute, 'Rota rend-super-shadow deve existir');
  assert.equal(superShadowRoute.from, 'node-super');
  assert.equal(superShadowRoute.to, 'node-shadow');
  const ssEndpoints = extractEndpoints(superShadowRoute.pathD);
  assert.equal(ssEndpoints.start.x, superSvg.x, 'rend-super-shadow deve iniciar no centro X do Super');
  assert.equal(ssEndpoints.start.y, superSvg.y, 'rend-super-shadow deve iniciar no centro Y do Super');
  assert.equal(ssEndpoints.end.x, shadowSvg.x, 'rend-super-shadow deve terminar no centro X do Shadow');
  assert.ok(Math.abs(ssEndpoints.end.y - shadowSvg.y) <= 0.5, 'rend-super-shadow deve terminar no centro Y do Shadow (112.5 arredondado para 113)');

  // 5. O Shadow continue seguindo SHADOW_REVEALED
  assert.equal(shadowNode.visibilityPolicy, 'SHADOW_REVEALED', 'Shadow deve possuir visibilidade SHADOW_REVEALED');

  // 6. O Super continue seguindo suas regras atuais
  assert.equal(superNode.visibilityPolicy, 'ALWAYS_IN_REGION', 'Super deve possuir visibilidade ALWAYS_IN_REGION');
  assert.equal(superNode.challengeKind, 'SUPER');

  // 7 & 8. Saves VERSION = 1 continuem compatíveis e sem migração de regras de negócio
  const mgr = freshManager();
  unlock18Badges(mgr);
  const vm = Model.buildMapViewModel({
    catalog: CAMPAIGN_MAP_CATALOG,
    campaignState: mgr.getState(),
    masters: K.MASTERS,
    manager: mgr,
    activeRegionId: 'region-endgame'
  });
  const endgameVm = vm.regions.find(r => r.id === 'region-endgame');
  const superVmNode = endgameVm.nodes.find(n => n.nodeId === 'node-super');
  const shadowVmNode = endgameVm.nodes.find(n => n.nodeId === 'node-shadow');
  assert.ok(superVmNode.canChallenge, 'Super deve estar disponível com 18 insígnias');
  assert.equal(shadowVmNode.state, 'HIDDEN', 'Shadow deve permanecer oculto antes de ser revelado');
  assert.equal(mgr.getState().version, 1, 'Versão do save deve continuar VERSION = 1');
});

test('Map Phase 3 — Modo lista não renderiza imagem de fundo do mapa', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  let capturedHtml = '';
  const container = {
    get innerHTML() { return capturedHtml; },
    set innerHTML(val) { capturedHtml = val; },
    querySelector: () => null,
    querySelectorAll: () => []
  };

  const view = new CampaignMapView({
    manager: mgr,
    container,
    initialRegionId: 'region-1',
    initialViewMode: 'LIST'
  });

  view.render();

  // 12. O comportamento do modo lista não é alterado e não renderiza fundo bitmap
  assert.ok(!capturedHtml.includes('class="campaign-map-bg-image"'), 'Modo lista não deve conter a imagem de fundo');
  assert.ok(capturedHtml.includes('class="campaign-list-card'), 'Modo lista deve renderizar os cards de desafios');
});

test('Map Phase 3 — Contratos de acessibilidade continuam válidos', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  let capturedHtml = '';
  const container = {
    get innerHTML() { return capturedHtml; },
    set innerHTML(val) { capturedHtml = val; },
    querySelector: () => null,
    querySelectorAll: () => []
  };

  const view = new CampaignMapView({
    manager: mgr,
    container,
    initialRegionId: 'region-1',
    initialViewMode: 'MAP'
  });

  view.render();

  // 13. Contratos de acessibilidade: abas com tablist/tab, aria-controls, aria-selected, nós com aria-label
  assert.ok(capturedHtml.includes('role="tablist"'), 'Abas devem ter role="tablist"');
  assert.ok(capturedHtml.includes('role="tab"'), 'Cada aba deve ter role="tab"');
  assert.ok(capturedHtml.includes('role="tabpanel"'), 'Painel deve ter role="tabpanel"');
  assert.ok(capturedHtml.includes('aria-controls="campaign-map-region-panel"'), 'Abas devem apontar para aria-controls');
  assert.ok(capturedHtml.includes('aria-label="Mestre Flora, Tipo Planta'), 'Nós devem manter aria-label descritivo');
});

// -----------------------------------------------------------------------------
// FASE 4 — POLIMENTO, TRANSIÇÕES E MICROINTERAÇÕES CONTROLADAS
// -----------------------------------------------------------------------------

test('Map Phase 4 — 1. Troca de região define o tipo de transição correto e limpa estado transitório', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  let capturedHtml = '';
  const container = {
    get innerHTML() { return capturedHtml; },
    set innerHTML(val) { capturedHtml = val; },
    querySelector: () => null,
    querySelectorAll: () => []
  };

  const view = new CampaignMapView({
    manager: mgr,
    container,
    initialRegionId: 'region-1',
    initialViewMode: 'MAP'
  });

  // Render inicial é uma entrada de região
  assert.equal(view.transitionCause, 'REGION_CHANGE');
  view.render();
  assert.equal(view.lastTransitionCause, 'REGION_CHANGE');
  assert.equal(view.transitionCause, 'NONE', 'Estado transitório deve ser limpo para NONE após render');
  assert.ok(capturedHtml.includes('is-entering'), 'Stage deve conter classe is-entering no render inicial de região');

  // Próximo render sem causa explícita não deve adicionar is-entering
  view.render();
  assert.equal(view.lastTransitionCause, 'NONE');
  assert.ok(!capturedHtml.includes('is-entering'), 'Render subsequente sem causa não deve ter is-entering');
});

test('Map Phase 4 — 2 & 3. Abrir e fechar drawer não reiniciam a entrada da região', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  let capturedHtml = '';
  const container = {
    get innerHTML() { return capturedHtml; },
    set innerHTML(val) { capturedHtml = val; },
    querySelector: () => null,
    querySelectorAll: () => []
  };

  const view = new CampaignMapView({
    manager: mgr,
    container,
    initialRegionId: 'region-1',
    initialViewMode: 'MAP'
  });

  view.render();

  // Abrir nó
  view.openNode('node-normal');
  assert.equal(view.lastTransitionCause, 'DRAWER_OPEN');
  assert.equal(view.transitionCause, 'NONE');
  assert.ok(!capturedHtml.includes('is-entering'), 'Abrir drawer não deve reiniciar a entrada da região');

  // Fechar drawer
  view.closeDrawer();
  assert.equal(view.lastTransitionCause, 'DRAWER_CLOSE');
  assert.equal(view.transitionCause, 'NONE');
  assert.ok(!capturedHtml.includes('is-entering'), 'Fechar drawer não deve reiniciar a entrada da região');
});

test('Map Phase 4 — 4. Alternar Mapa/Lista preserva a região ativa e aplica classe de transição', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  let capturedHtml = '';
  const container = {
    get innerHTML() { return capturedHtml; },
    set innerHTML(val) { capturedHtml = val; },
    querySelector: () => null,
    querySelectorAll: () => []
  };

  const view = new CampaignMapView({
    manager: mgr,
    container,
    initialRegionId: 'region-2',
    initialViewMode: 'MAP'
  });

  view.render();
  assert.equal(view.activeRegionId, 'region-2');

  // Alternar para LIST
  view.transitionCause = 'VIEW_MODE_CHANGE';
  view.viewMode = 'LIST';
  view.render();

  assert.equal(view.activeRegionId, 'region-2', 'Região ativa deve permanecer inalterada ao alternar modo');
  assert.equal(view.lastTransitionCause, 'VIEW_MODE_CHANGE');
  assert.ok(capturedHtml.includes('is-switching-view'), 'Painel deve receber is-switching-view');
  assert.ok(!capturedHtml.includes('is-entering'), 'Troca de modo não deve disparar entrada de região');
});

test('Map Phase 4 — 5, 6, 7 & 8. Fundo: listeners de load/error, cache e ausência de handlers inline', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  let capturedHtml = '';
  const listeners = {};
  const classes = new Set();
  const mockBgImg = {
    classList: {
      add(cls) { classes.add(cls); },
      remove(cls) { classes.delete(cls); },
      contains(cls) { return classes.has(cls); }
    },
    addEventListener(event, fn) {
      listeners[event] = listeners[event] || [];
      listeners[event].push(fn);
    },
    dispatchEvent(event) {
      const type = typeof event === 'string' ? event : event.type;
      (listeners[type] || []).forEach(fn => fn(event));
      return true;
    },
    complete: false,
    naturalWidth: 0
  };

  const container = {
    get innerHTML() { return capturedHtml; },
    set innerHTML(val) { capturedHtml = val; },
    querySelector: (sel) => {
      if (sel === '.campaign-map-bg-image') return mockBgImg;
      return null;
    },
    querySelectorAll: () => []
  };

  const view = new CampaignMapView({
    manager: mgr,
    container,
    initialRegionId: 'region-1',
    initialViewMode: 'MAP'
  });

  view.render();

  // 8. Sem handlers inline na imagem de fundo
  const bgImgMatch = capturedHtml.match(/<img[^>]*class="campaign-map-bg-image"[^>]*>/);
  assert.ok(bgImgMatch, 'Elemento de fundo deve estar presente');
  assert.ok(!bgImgMatch[0].includes('onload='), 'Fundo não deve ter handler onload inline');
  assert.ok(!bgImgMatch[0].includes('onerror='), 'Fundo não deve ter handler onerror inline');

  // 5. Listener de load registrado e is-loading inicial adicionado
  assert.ok(Array.isArray(listeners.load) && listeners.load.length > 0, 'Listener de load deve ser registrado');
  assert.equal(classes.has('is-loading'), true, 'Imagem não em cache deve iniciar com is-loading');

  // Simular evento load
  mockBgImg.dispatchEvent('load');
  assert.equal(classes.has('is-loading'), false, 'is-loading deve ser removido após load');
  assert.equal(classes.has('is-loaded'), true, 'is-loaded deve ser adicionado após load');

  // 6. Imagem em cache entra diretamente em is-loaded
  classes.clear();
  mockBgImg.complete = true;
  mockBgImg.naturalWidth = 1280;
  view.render();
  assert.equal(classes.has('is-loaded'), true, 'Imagem já em cache com naturalWidth > 0 deve receber is-loaded imediatamente');

  // 7. Falha aplica is-hidden
  classes.clear();
  mockBgImg.complete = false;
  mockBgImg.naturalWidth = 0;
  view.render();
  mockBgImg.dispatchEvent('error');
  assert.equal(classes.has('is-hidden'), true, 'Evento de erro deve aplicar is-hidden');
});

test('Map Phase 4 — 9, 10 & 11. Nós recebem índices de stagger, nós ocultos não participam e coordenadas intactas', () => {
  const mgr = freshManager();
  unlock18Badges(mgr);

  let capturedHtml = '';
  const container = {
    get innerHTML() { return capturedHtml; },
    set innerHTML(val) { capturedHtml = val; },
    querySelector: () => null,
    querySelectorAll: () => []
  };

  const view = new CampaignMapView({
    manager: mgr,
    container,
    initialRegionId: 'region-endgame',
    initialViewMode: 'MAP'
  });

  view.render();

  // 9. Índices de stagger
  assert.ok(capturedHtml.includes('style="left: 20.0%; top: 70.0%; --node-index: 0;"'), 'Primeiro nó deve ter --node-index: 0');
  assert.ok(capturedHtml.includes('data-node-index="0"'), 'Primeiro nó deve ter data-node-index="0"');
  assert.ok(capturedHtml.includes('--node-index: 1;'), 'Segundo nó deve ter --node-index: 1');

  // 10. Shadow oculto não participa do stagger
  // Na Região Final antes de derrotar o Super, Shadow está oculto.
  // Devem existir exatamente 5 nós visíveis (4 provas + 1 super) indexados de 0 a 4.
  assert.ok(!capturedHtml.includes('id="node-shadow"'), 'Shadow deve estar oculto');
  assert.ok(capturedHtml.includes('data-node-index="4"'), 'Último nó visível antes de Shadow deve ter índice 4');
  assert.ok(!capturedHtml.includes('data-node-index="5"'), 'Nenhum nó invisível deve ocupar o índice 5');

  // 11. Coordenadas do Super permanecem intactas em 50.0%, 56.0%
  assert.ok(capturedHtml.includes('left: 50.0%; top: 56.0%;'), 'Coordenadas do Super devem ser mantidas exatamente');
});

test('Map Phase 4 — 12. Rotas SVG mantêm estados semânticos corretos', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  let capturedHtml = '';
  const container = {
    get innerHTML() { return capturedHtml; },
    set innerHTML(val) { capturedHtml = val; },
    querySelector: () => null,
    querySelectorAll: () => []
  };

  const view = new CampaignMapView({
    manager: mgr,
    container,
    initialRegionId: 'region-1',
    initialViewMode: 'MAP'
  });

  view.render();

  // Todas as rotas da Região 1 devem possuir classes semânticas válidas
  assert.ok(capturedHtml.includes('class="map-route-path is-active"'), 'Rotas devem manter classes semânticas');
  assert.ok(capturedHtml.includes(CAMPAIGN_MAP_CATALOG.regions[0].routes[0].pathD), 'Coordenadas SVG das rotas permanecem inalteradas');
});

function createMockElement(initialTag = 'div') {
  const classes = new Set();
  const attrs = new Map();
  const listeners = new Map();
  let focused = false;

  const el = {
    tagName: initialTag.toUpperCase(),
    style: {},
    dataset: {},
    classList: {
      add(...names) { names.forEach(n => classes.add(n)); },
      remove(...names) { names.forEach(n => classes.delete(n)); },
      contains(name) { return classes.has(name); },
      toggle(name, force) {
        if (typeof force === 'boolean') {
          if (force) classes.add(name); else classes.delete(name);
          return force;
        }
        if (classes.has(name)) { classes.delete(name); return false; }
        classes.add(name); return true;
      },
      has(name) { return classes.has(name); },
      clear() { classes.clear(); }
    },
    setAttribute(name, val) { attrs.set(name, String(val)); },
    getAttribute(name) { return attrs.has(name) ? attrs.get(name) : null; },
    removeAttribute(name) { attrs.delete(name); },
    addEventListener(type, fn) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(fn);
    },
    removeEventListener(type, fn) {
      if (listeners.has(type)) {
        listeners.get(type).delete(fn);
      }
    },
    dispatchEvent(event) {
      const type = typeof event === 'string' ? event : event.type;
      const evt = typeof event === 'string' ? { type: event, target: el } : event;
      if (!evt.target) evt.target = el;
      if (listeners.has(type)) {
        const fns = Array.from(listeners.get(type));
        for (const fn of fns) {
          fn.call(el, evt);
        }
      }
    },
    focus() { focused = true; },
    get isFocused() { return focused; },
    set isFocused(v) { focused = v; },
    listeners,
    hasListener(type) {
      return listeners.has(type) && listeners.get(type).size > 0;
    },
    querySelector: () => null,
    querySelectorAll: () => []
  };

  return el;
}

function createDeterministicEnvironment() {
  let nextTimerId = 1;
  let nextRafId = 1;
  const timers = new Map();
  const rafs = new Map();

  const origSetTimeout = global.setTimeout;
  const origClearTimeout = global.clearTimeout;
  const origRaf = global.requestAnimationFrame;
  const origCaf = global.cancelAnimationFrame;

  function setTimeoutMock(fn, ms) {
    const id = nextTimerId++;
    timers.set(id, { fn, ms });
    return id;
  }

  function clearTimeoutMock(id) {
    timers.delete(id);
  }

  function rafMock(fn) {
    const id = nextRafId++;
    rafs.set(id, fn);
    return id;
  }

  function cafMock(id) {
    rafs.delete(id);
  }

  function runAllRafs() {
    const entries = Array.from(rafs.entries());
    rafs.clear();
    for (const [, fn] of entries) {
      fn();
    }
  }

  function runAllTimers() {
    const entries = Array.from(timers.entries());
    timers.clear();
    for (const [, item] of entries) {
      item.fn();
    }
  }

  function install() {
    global.setTimeout = setTimeoutMock;
    global.clearTimeout = clearTimeoutMock;
    if (global.window) {
      global.window.requestAnimationFrame = rafMock;
      global.window.cancelAnimationFrame = cafMock;
      global.window.setTimeout = setTimeoutMock;
      global.window.clearTimeout = clearTimeoutMock;
    }
  }

  function restore() {
    global.setTimeout = origSetTimeout;
    global.clearTimeout = origClearTimeout;
    if (global.window) {
      global.window.requestAnimationFrame = origRaf;
      global.window.cancelAnimationFrame = origCaf;
      global.window.setTimeout = origSetTimeout;
      global.window.clearTimeout = origClearTimeout;
    }
  }

  return {
    timers,
    rafs,
    runAllRafs,
    runAllTimers,
    install,
    restore
  };
}

function createMockMapHarness({ manager, initialRegionId = 'region-1', initialViewMode = 'MAP', isReducedMotion = false } = {}) {
  const clock = createDeterministicEnvironment();
  const elements = new Map();

  function getOrCreateElement(sel, tag = 'div') {
    if (!elements.has(sel)) {
      const el = createMockElement(tag);
      el.selectorId = sel;
      elements.set(sel, el);
    }
    return elements.get(sel);
  }

  const drawerEl = getOrCreateElement('#trainerDetailsDrawer', 'aside');
  const backdropEl = getOrCreateElement('#detailsBackdrop', 'div');
  const detailsCloseBtn = getOrCreateElement('#detailsCloseBtn', 'button');
  const mapBtn = getOrCreateElement('#viewModeMapBtn', 'button');
  const listBtn = getOrCreateElement('#viewModeListBtn', 'button');
  const resetBtn = getOrCreateElement('#campaignResetBtn', 'button');
  const actionBtn = getOrCreateElement('#drawerActionBtn', 'button');
  const stageEl = getOrCreateElement('.campaign-map-stage', 'div');
  const panelEl = getOrCreateElement('.campaign-map-panel', 'div');
  const bgImgEl = getOrCreateElement('.campaign-map-bg-image', 'img');
  bgImgEl.complete = false;
  bgImgEl.naturalWidth = 0;

  drawerEl.querySelector = (sel) => {
    if (sel === '#detailsCloseBtn') return detailsCloseBtn;
    if (sel === '#drawerActionBtn') return actionBtn;
    return null;
  };

  const tabs = [];
  const nodeButtons = new Map();

  for (const reg of CAMPAIGN_MAP_CATALOG.regions) {
    const tabEl = getOrCreateElement(`#tab-${reg.id}`, 'button');
    tabEl.dataset.regionId = reg.id;
    tabEl.dataset.isLocked = String(reg.id === 'region-endgame' && (!manager || manager.getBadgeCount() < 18));
    tabs.push(tabEl);

    for (const node of reg.nodes) {
      const nodeEl = getOrCreateElement(`#${node.nodeId}`, 'button');
      nodeEl.dataset.nodeId = node.nodeId;
      nodeButtons.set(node.nodeId, nodeEl);
    }
  }

  let capturedHtml = '';
  let renderCount = 0;
  const keydownListeners = [];

  const fakeDoc = {
    addEventListener: (type, fn) => {
      if (type === 'keydown') keydownListeners.push(fn);
    },
    removeEventListener: (type, fn) => {
      if (type === 'keydown') {
        const idx = keydownListeners.indexOf(fn);
        if (idx >= 0) keydownListeners.splice(idx, 1);
      }
    },
    activeElement: null
  };

  const container = {
    get innerHTML() { return capturedHtml; },
    set innerHTML(val) {
      capturedHtml = val;
      renderCount++;
    },
    querySelector: (sel) => {
      if (elements.has(sel)) return elements.get(sel);
      if (sel.startsWith('#tab-')) return getOrCreateElement(sel, 'button');
      if (sel.startsWith('#node-')) return getOrCreateElement(sel, 'button');
      if (sel.startsWith('[data-node-open=')) {
        const id = sel.slice('[data-node-open="'.length, -2);
        return getOrCreateElement(`open-${id}`, 'button');
      }
      if (sel.startsWith('[data-node-challenge=')) {
        const id = sel.slice('[data-node-challenge="'.length, -2);
        return getOrCreateElement(`chal-${id}`, 'button');
      }
      return null;
    },
    querySelectorAll: (sel) => {
      if (sel === '.campaign-map-tab') return tabs;
      if (sel === '.campaign-map-node') return Array.from(nodeButtons.values());
      return [];
    }
  };

  const origDocument = global.document;
  clock.install();
  global.document = fakeDoc;

  const view = new CampaignMapView({
    manager,
    container,
    initialRegionId,
    initialViewMode
  });

  if (isReducedMotion) {
    view._isReducedMotion = () => true;
  }

  function uninstallHarness() {
    clock.restore();
    global.document = origDocument;
  }

  return {
    view,
    container,
    clock,
    drawerEl,
    backdropEl,
    detailsCloseBtn,
    bgImgEl,
    mapBtn,
    listBtn,
    resetBtn,
    tabs,
    nodeButtons,
    keydownListeners,
    getRenderCount: () => renderCount,
    getCapturedHtml: () => capturedHtml,
    uninstallHarness
  };
}

test('Map Phase 4 — 13 & 14. Drawer: ciclo de abertura e fechamento com fallback e classes', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  const harness = createMockMapHarness({ manager: mgr });
  try {
    harness.view.render();

    // 1. Initial state: drawer not open
    assert.equal(harness.view.isDrawerOpen, false);
    assert.equal(harness.drawerEl.classList.contains('is-open'), false);

    // 2. Open node -> DRAWER_OPEN, schedules RAF, does not have is-open yet
    const nodeNormal = harness.nodeButtons.get('node-normal');
    harness.view.openNode('node-normal', nodeNormal, 'map-node');
    assert.equal(harness.view.isDrawerOpen, true);
    assert.equal(harness.drawerEl.classList.contains('is-open'), false, 'Não deve ter is-open antes do RAF');
    assert.equal(harness.clock.rafs.size, 1, 'Deve agendar 1 RAF de abertura');

    // 3. Execute RAF -> drawer receives is-open, aria-hidden="false", backdrop receives is-open, focus moved
    harness.clock.runAllRafs();
    assert.equal(harness.drawerEl.classList.contains('is-open'), true, 'Deve receber is-open após RAF');
    assert.equal(harness.drawerEl.getAttribute('aria-hidden'), 'false');
    assert.equal(harness.backdropEl.classList.contains('is-open'), true);
    assert.equal(harness.detailsCloseBtn.isFocused, true, 'Foco deve ser movido para o botão de fechar');

    // 4. Close drawer -> is-open removed, aria-hidden="true", backdrop closed, transitionend registered
    harness.view.closeDrawer();
    assert.equal(harness.drawerEl.classList.contains('is-open'), false, 'is-open deve ser removido ao iniciar fechamento');
    assert.equal(harness.drawerEl.getAttribute('aria-hidden'), 'true');
    assert.equal(harness.backdropEl.classList.contains('is-open'), false);
    assert.equal(harness.drawerEl.hasListener('transitionend'), true, 'Deve registrar listener de transitionend');
    assert.notEqual(harness.view._drawerCloseFallbackTimer, null, 'Fallback timer deve estar agendado');

    // 5. Fallback timer fires -> finishClose completes, isDrawerOpen=false, focus restored to nodeNormal
    harness.clock.runAllTimers();
    harness.clock.runAllTimers();
    assert.equal(harness.view.isDrawerOpen, false);
    assert.equal(harness.drawerEl.hasListener('transitionend'), false, 'Listener transitionend deve ser removido');
    assert.equal(nodeNormal.isFocused, true, 'Foco deve ser restaurado ao elemento de origem');
  } finally {
    harness.uninstallHarness();
  }
});

test('Map Phase 4 — Teste A: Escape antes do RAF de abertura cancela abertura e fecha imediatamente', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  const harness = createMockMapHarness({ manager: mgr });
  try {
    harness.view.render();
    const nodeEl = harness.nodeButtons.get('node-normal');

    // 1. Abrir nó
    harness.view.openNode('node-normal', nodeEl, 'map-node');
    assert.equal(harness.view.isDrawerOpen, true);
    assert.equal(harness.clock.rafs.size, 1, 'RAF de abertura deve estar pendente');
    assert.equal(harness.drawerEl.classList.contains('is-open'), false, 'Ainda não chegou a abrir visualmente');

    // 2. Não executar o RAF; pressionar Escape
    assert.ok(harness.keydownListeners.length > 0, 'Listener de keydown deve existir');
    harness.keydownListeners[0]({ key: 'Escape', preventDefault() {}, stopPropagation() {} });

    // 3. Executar o RAF que estava pendente (se não foi cancelado ou se o callback foi capturado)
    harness.clock.runAllRafs();
    harness.clock.runAllTimers();

    // 4. Confirmar estado
    assert.equal(harness.view.isDrawerOpen, false, 'Drawer deve estar fechado');
    assert.equal(harness.drawerEl.classList.contains('is-open'), false, 'is-open deve estar ausente');
    assert.equal(harness.backdropEl.classList.contains('is-open'), false, 'Backdrop deve estar fechado');
    assert.equal(nodeEl.isFocused, true, 'Foco deve ser restaurado ao nó de origem');
    assert.equal(harness.detailsCloseBtn.isFocused, false, 'Nenhum foco tardio no botão de fechar');
    assert.equal(harness.view._pendingRafIds.size, 0, 'Nenhum RAF pendente');
    assert.equal(harness.view._pendingTimeoutIds.size, 0, 'Nenhum timer pendente');
  } finally {
    harness.uninstallHarness();
  }
});

test('Map Phase 4 — Teste B: Clique no backdrop antes do RAF cancela abertura e fecha imediatamente', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  const harness = createMockMapHarness({ manager: mgr });
  try {
    harness.view.render();
    const nodeEl = harness.nodeButtons.get('node-normal');

    // 1. Abrir nó
    harness.view.openNode('node-normal', nodeEl, 'map-node');
    assert.equal(harness.view.isDrawerOpen, true);
    assert.equal(harness.clock.rafs.size, 1);
    assert.equal(harness.drawerEl.classList.contains('is-open'), false);

    // 2. Clicar no backdrop antes do RAF
    assert.ok(typeof harness.backdropEl.onclick === 'function', 'Backdrop deve ter handler de clique');
    harness.backdropEl.onclick();

    // 3. Executar RAFs e timers
    harness.clock.runAllRafs();
    harness.clock.runAllTimers();

    // 4. Confirmar
    assert.equal(harness.view.isDrawerOpen, false, 'Drawer deve estar fechado');
    assert.equal(harness.drawerEl.classList.contains('is-open'), false, 'is-open não pode estar presente');
    assert.equal(harness.backdropEl.classList.contains('is-open'), false, 'Backdrop não pode estar aberto');
    assert.equal(nodeEl.isFocused, true, 'Foco deve retornar ao nó de origem');
    assert.equal(harness.detailsCloseBtn.isFocused, false, 'Botão de fechar não deve receber foco');
  } finally {
    harness.uninstallHarness();
  }
});

test('Map Phase 4 — Teste C: destroy() durante fechamento invalida callbacks e limpa listeners', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  const harness = createMockMapHarness({ manager: mgr });
  try {
    harness.view.render();
    // 1. Abrir o drawer
    harness.view.openNode('node-normal');
    // 2. Executar RAF de abertura
    harness.clock.runAllRafs();
    assert.equal(harness.drawerEl.classList.contains('is-open'), true);

    // 3. Iniciar fechamento
    harness.view.closeDrawer();
    assert.equal(harness.drawerEl.hasListener('transitionend'), true, 'Listener transitionend deve estar instalado');
    assert.ok(harness.clock.timers.size > 0, 'Fallback timer deve estar agendado');

    // 4. Chamar destroy() antes do transitionend
    const rendersBefore = harness.getRenderCount();
    harness.view.destroy();

    // 5. Disparar manualmente o antigo transitionend no drawer
    harness.drawerEl.dispatchEvent({ type: 'transitionend', propertyName: 'transform' });

    // 6. Executar timers pendentes
    harness.clock.runAllTimers();

    // 7. Confirmar
    assert.equal(harness.getRenderCount(), rendersBefore, 'Nenhum novo render() deve ocorrer após destroy()');
    assert.equal(harness.keydownListeners.length, 0, 'Nenhum listener keydown deve estar instalado');
    assert.equal(harness.drawerEl.hasListener('transitionend'), false, 'Listener de transição deve ser removido');
    assert.equal(harness.view._drawerCloseFallbackTimer, null, 'Timer de fallback deve ser cancelado');
    assert.equal(harness.view._pendingRafIds.size, 0, 'Conjunto de RAFs deve estar vazio');
    assert.equal(harness.view._pendingTimeoutIds.size, 0, 'Conjunto de timeouts deve estar vazio');
  } finally {
    harness.uninstallHarness();
  }
});

test('Map Phase 4 — Teste D: Abrir nó B durante fechamento do nó A cancela fechamento e mantém nó B', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  const harness = createMockMapHarness({ manager: mgr });
  try {
    harness.view.render();
    const nodeA = harness.nodeButtons.get('node-normal');
    const nodeB = harness.nodeButtons.get('node-grass');

    // 1. Abrir A
    harness.view.openNode('node-normal', nodeA, 'map-node');
    harness.clock.runAllRafs();
    assert.equal(harness.drawerEl.classList.contains('is-open'), true);

    // 2. Iniciar fechamento
    harness.view.closeDrawer();

    // 3. Abrir B antes do término
    harness.view.openNode('node-grass', nodeB, 'map-node');

    // 4. Disparar evento transitionend antigo e timers antigos
    harness.drawerEl.dispatchEvent({ type: 'transitionend', propertyName: 'transform' });
    harness.clock.runAllTimers();

    // 5. Confirmar
    assert.equal(harness.view.selectedNodeId, 'node-grass', 'Nó B continua selecionado');
    assert.equal(harness.view.isDrawerOpen, true, 'Drawer continua aberto');
    assert.ok(harness.getCapturedHtml().includes('Flora') || harness.getCapturedHtml().includes('Planta'), 'Conteúdo deve corresponder ao nó B');
    assert.equal(nodeA.isFocused, false, 'Foco não pode retornar para o nó A');
  } finally {
    harness.uninstallHarness();
  }
});

test('Map Phase 4 — Teste E: Evento transitionend de descendente não consome o fechamento', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  const harness = createMockMapHarness({ manager: mgr });
  try {
    harness.view.render();
    harness.view.openNode('node-normal');
    harness.clock.runAllRafs();

    // 1. Iniciar fechamento
    harness.view.closeDrawer();
    assert.equal(harness.drawerEl.hasListener('transitionend'), true);

    // 2. Disparar transitionend com target diferente do drawer (ex.: tag span filha)
    const childEl = createMockElement('span');
    harness.drawerEl.dispatchEvent({ type: 'transitionend', target: childEl, propertyName: 'opacity' });

    // 3. Confirmar que o fechamento ainda não terminou
    assert.equal(harness.drawerEl.hasListener('transitionend'), true, 'Listener deve continuar ativo após evento de descendente');
    assert.notEqual(harness.view._drawerCloseFallbackTimer, null, 'Fallback timer deve continuar ativo');

    // 4. Disparar transitionend do drawer para transform
    harness.drawerEl.dispatchEvent({ type: 'transitionend', target: harness.drawerEl, propertyName: 'transform' });

    // 5. Confirmar fechamento único e correto
    assert.equal(harness.view.isDrawerOpen, false, 'Drawer deve estar fechado');
    assert.equal(harness.drawerEl.hasListener('transitionend'), false, 'Listener deve ter sido removido');
    assert.equal(harness.view._drawerCloseFallbackTimer, null, 'Timer deve ter sido limpo');
  } finally {
    harness.uninstallHarness();
  }
});

test('Map Phase 4 — Teste F: Fallback de imagem em movimento reduzido preserva tratamento de erro', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  // 1. Ativar movimento reduzido
  const harness = createMockMapHarness({ manager: mgr, isReducedMotion: true });
  try {
    // 2. Fornecer imagem ainda não concluída
    harness.bgImgEl.complete = false;
    harness.bgImgEl.naturalWidth = 0;
    harness.view.render();

    // 3. Confirmar registro de error listener
    assert.equal(harness.bgImgEl.hasListener('error'), true, 'Listener de error deve ser registrado mesmo em movimento reduzido');

    // 4. Disparar erro
    harness.bgImgEl.dispatchEvent('error');

    // 5. Confirmar classes
    assert.equal(harness.bgImgEl.classList.contains('is-hidden'), true, 'is-hidden deve ser adicionado');
    assert.equal(harness.bgImgEl.classList.contains('is-loaded'), false, 'is-loaded deve ser removido');
    assert.equal(harness.bgImgEl.classList.contains('is-loading'), false, 'is-loading não deve estar presente');
    assert.ok(harness.getCapturedHtml().includes('theme-region-verdant'), 'Fallback regional preservado');
  } finally {
    harness.uninstallHarness();
  }
});

test('Map Phase 4 — Teste G: Troca de região durante fechamento cancela drawer e prevalece última ação', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  const harness = createMockMapHarness({ manager: mgr });
  try {
    harness.view.render();
    harness.view.openNode('node-normal');
    harness.clock.runAllRafs();

    // Iniciar fechamento
    harness.view.closeDrawer();

    // Trocar de região clicando na aba da Região 2
    const tab2 = harness.tabs.find(t => t.dataset.regionId === 'region-2');
    assert.ok(tab2, 'Aba da região 2 deve existir');
    tab2.onclick();

    // Disparar callbacks antigos
    harness.drawerEl.dispatchEvent({ type: 'transitionend', propertyName: 'transform' });
    harness.clock.runAllTimers();

    // Confirmar que a última região continua ativa e drawer não reaparece
    assert.equal(harness.view.activeRegionId, 'region-2', 'Região 2 deve permanecer ativa');
    assert.equal(harness.view.isDrawerOpen, false, 'Drawer não deve reabrir');
    assert.equal(harness.view.selectedNodeId, null, 'Seleção de nó anterior deve ser limpa');
  } finally {
    harness.uninstallHarness();
  }
});

test('Map Phase 4 — Teste H: Troca Mapa/Lista durante fechamento cancela drawer e prevalece último modo', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  const harness = createMockMapHarness({ manager: mgr });
  try {
    harness.view.render();
    harness.view.openNode('node-normal');
    harness.clock.runAllRafs();

    // Iniciar fechamento
    harness.view.closeDrawer();

    // Alternar para Modo Lista clicando no botão
    assert.ok(typeof harness.listBtn.onclick === 'function', 'Botão de modo lista deve ter onclick');
    harness.listBtn.onclick();

    // Disparar callbacks antigos
    harness.drawerEl.dispatchEvent({ type: 'transitionend', propertyName: 'transform' });
    harness.clock.runAllTimers();

    // Confirmar que o último modo prevalece
    assert.equal(harness.view.viewMode, 'LIST', 'Modo Lista deve prevalecer');
    assert.equal(harness.view.isDrawerOpen, false, 'Drawer não deve reabrir');
    assert.equal(harness.view.selectedNodeId, null, 'Seleção deve ser limpa');
  } finally {
    harness.uninstallHarness();
  }
});

test('Map Phase 4 — 15. Movimento reduzido elimina animações e delays artificiais', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  let capturedHtml = '';
  const classes = new Set();
  const mockBgImg = {
    classList: {
      add(cls) { classes.add(cls); },
      remove(cls) { classes.delete(cls); },
      contains(cls) { return classes.has(cls); }
    },
    addEventListener() {},
    complete: false,
    naturalWidth: 0
  };

  const container = {
    get innerHTML() { return capturedHtml; },
    set innerHTML(val) { capturedHtml = val; },
    querySelector: (sel) => {
      if (sel === '.campaign-map-bg-image') return mockBgImg;
      return null;
    },
    querySelectorAll: () => []
  };

  const view = new CampaignMapView({
    manager: mgr,
    container,
    initialRegionId: 'region-1',
    initialViewMode: 'MAP'
  });

  // Forçar _isReducedMotion para retornar true
  view._isReducedMotion = () => true;

  view.render();

  // Em movimento reduzido, stage não tem is-entering
  assert.ok(!capturedHtml.includes('is-entering'), 'Movimento reduzido não deve adicionar is-entering');
  // Fundo entra diretamente em is-loaded sem fade
  assert.equal(classes.has('is-loaded'), true, 'Movimento reduzido deve aplicar is-loaded imediatamente');

  // Abrir nó em movimento reduzido renderiza com is-open imediatamente
  view.openNode('node-normal');
  assert.ok(capturedHtml.includes('class="campaign-details-drawer is-open"'), 'Drawer deve nascer is-open em movimento reduzido');

  // Fechar fecha imediatamente sem esperar timer
  view.closeDrawer();
  assert.equal(view.isDrawerOpen, false);
});

test('Map Phase 4 — 16 & 17. Teclado Escape e clique no backdrop fecham drawer e restauram foco', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  let focused = false;
  const mockTarget = {
    focus() { focused = true; }
  };

  let capturedHtml = '';
  const container = {
    get innerHTML() { return capturedHtml; },
    set innerHTML(val) { capturedHtml = val; },
    querySelector: (sel) => {
      if (sel === '#node-normal') return mockTarget;
      return null;
    },
    querySelectorAll: () => []
  };

  const view = new CampaignMapView({
    manager: mgr,
    container,
    initialRegionId: 'region-1',
    initialViewMode: 'MAP'
  });

  view._isReducedMotion = () => true;
  view.render();

  // Abrir nó
  view.openNode('node-normal', mockTarget, 'map-node');
  assert.equal(view.isDrawerOpen, true);

  // Pressionar Escape
  view._handleKeyDown({
    key: 'Escape',
    preventDefault() {},
    stopPropagation() {}
  });

  assert.equal(view.isDrawerOpen, false, 'Escape deve fechar o drawer');
  assert.equal(focused, true, 'Foco deve ser restaurado no nó de origem');
});

test('Map Phase 4 — 18 & 19. Ações rápidas não deixam callbacks obsoletos e mantém última região', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  let capturedHtml = '';
  const container = {
    get innerHTML() { return capturedHtml; },
    set innerHTML(val) { capturedHtml = val; },
    querySelector: () => null,
    querySelectorAll: () => []
  };

  const view = new CampaignMapView({
    manager: mgr,
    container,
    initialRegionId: 'region-1',
    initialViewMode: 'MAP'
  });

  view.render();

  // Simulação de cliques rápidos consecutivos entre regiões
  view.activeRegionId = 'region-2';
  view.transitionCause = 'REGION_CHANGE';
  view.render();

  view.activeRegionId = 'region-3';
  view.transitionCause = 'REGION_CHANGE';
  view.render();

  assert.equal(view.activeRegionId, 'region-3', 'Última região deve prevalecer');
  assert.ok(capturedHtml.includes('region-3-arcanas.webp'), 'HTML final deve refletir a última região selecionada');
});

test('Map Phase 4 — 20 & 21. destroy() cancela timers, RAFs e não acumula listeners', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  const view = new CampaignMapView({
    manager: mgr,
    container: { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] },
    initialRegionId: 'region-1',
    initialViewMode: 'MAP'
  });

  view.render();

  // Criar timers pendentes
  view._safeTimeout(() => {}, 1000);
  view._safeRaf(() => {});
  view.announce('Mensagem teste');

  assert.ok(view._pendingTimeoutIds.size > 0);

  // Chamar destroy
  view.destroy();

  assert.equal(view._pendingTimeoutIds.size, 0, 'Todos os timeouts pendentes devem ser cancelados no destroy()');
  assert.equal(view._pendingRafIds.size, 0, 'Todos os RAFs pendentes devem ser cancelados no destroy()');
  assert.equal(view._ariaTimer, null, 'Timer ARIA deve ser cancelado');
  assert.equal(view._drawerCloseFallbackTimer, null, 'Timer de fechamento do drawer deve ser cancelado');
});

test('Map Phase 4 — 22, 23 & 24. triggerChallenge, saves VERSION = 1 e integridade browser', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  let challengedPayload = null;
  const view = new CampaignMapView({
    manager: mgr,
    container: { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] },
    onChallenge: (payload) => { challengedPayload = payload; },
    initialRegionId: 'region-1',
    initialViewMode: 'MAP'
  });

  view.render();

  const activeRegion = CAMPAIGN_MAP_CATALOG.regions[0];
  const normalNode = activeRegion.nodes[0];

  const ok = view.triggerChallenge({
    ...normalNode,
    canChallenge: true
  });

  assert.equal(ok, true);
  assert.deepEqual(challengedPayload, { kind: 'MASTER', id: 'master-normal' });
  assert.equal(mgr.getState().version, 1, 'Save deve continuar VERSION = 1');
});

/* --------------------------------------------------------------------------
   FASE 5 — HOMOLOGAÇÃO FINAL: HARDENING DE RAF FALLBACK, VIEWPORTS & A11Y
   -------------------------------------------------------------------------- */

test('Map Phase 5 — 1. Fallback sem requestAnimationFrame executa determinísticamente via timeout', () => {
  const env = createDeterministicEnvironment();
  env.install();

  // Simular ambiente de navegador antigo ou headless sem RAF
  const origWindow = global.window;
  global.window = {
    setTimeout: env.setTimeoutMock,
    clearTimeout: env.clearTimeoutMock
    // requestAnimationFrame e cancelAnimationFrame intencionalmente ausentes
  };

  try {
    const mgr = freshManager();
    startCampaign(mgr);

    const view = new CampaignMapView({
      manager: mgr,
      container: { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] }
    });

    let executed = false;
    const fallbackId = view._safeRaf(() => {
      executed = true;
    });

    assert.ok(fallbackId !== null && fallbackId !== undefined, 'Deve retornar ID válido de fallback');
    assert.ok(view._fallbackRafTimeoutIds.has(fallbackId), 'ID deve ser rastreado em _fallbackRafTimeoutIds');
    assert.ok(view._pendingTimeoutIds.has(fallbackId), 'ID deve ser rastreado em _pendingTimeoutIds');
    assert.equal(executed, false, 'Callback não deve executar de forma síncrona');

    env.runAllTimers();

    assert.equal(executed, true, 'Callback de fallback deve executar após avanço dos timers');
    assert.equal(view._fallbackRafTimeoutIds.has(fallbackId), false, 'ID deve ser removido de _fallbackRafTimeoutIds após execução');
    assert.equal(view._pendingTimeoutIds.has(fallbackId), false, 'ID deve ser removido de _pendingTimeoutIds após execução');

    view.destroy();
  } finally {
    global.window = origWindow;
    env.restore();
  }
});

test('Map Phase 5 — 2. Cancelamento antes da execução do fallback remove timeout imediatamente', () => {
  const env = createDeterministicEnvironment();
  env.install();

  const origWindow = global.window;
  global.window = {
    setTimeout: env.setTimeoutMock,
    clearTimeout: env.clearTimeoutMock
  };

  try {
    const mgr = freshManager();
    startCampaign(mgr);

    const view = new CampaignMapView({
      manager: mgr,
      container: { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] }
    });

    let executed = false;
    const fallbackId = view._safeRaf(() => {
      executed = true;
    });

    assert.ok(view._fallbackRafTimeoutIds.has(fallbackId));
    assert.ok(view._pendingTimeoutIds.has(fallbackId));

    // Cancelar imediatamente antes de rodar os timers
    view._clearRaf(fallbackId);

    assert.equal(view._fallbackRafTimeoutIds.has(fallbackId), false, 'ID deve ser removido de _fallbackRafTimeoutIds');
    assert.equal(view._pendingTimeoutIds.has(fallbackId), false, 'ID deve ser removido de _pendingTimeoutIds');
    assert.equal(env.timers.has(fallbackId), false, 'Timeout nativo/mock deve ser cancelado do loop');

    env.runAllTimers();
    assert.equal(executed, false, 'Callback cancelada NÃO deve executar');

    view.destroy();
  } finally {
    global.window = origWindow;
    env.restore();
  }
});

test('Map Phase 5 — 3. Hardening de ID igual a zero (0) não é ignorado por truthiness', () => {
  let clearedTimerId = null;
  let clearedCafId = null;

  const origWindow = global.window;
  const origClearTimeout = global.clearTimeout;

  global.clearTimeout = (id) => { clearedTimerId = id; };
  global.window = {
    cancelAnimationFrame: (id) => { clearedCafId = id; },
    clearTimeout: (id) => { clearedTimerId = id; }
  };

  try {
    const mgr = freshManager();
    startCampaign(mgr);

    const view = new CampaignMapView({
      manager: mgr,
      container: { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] }
    });

    // Simular que timerId 0 foi alocado
    view._pendingTimeoutIds.add(0);
    view._clearTimeout(0);
    assert.equal(clearedTimerId, 0, '_clearTimeout(0) deve chamar clearTimeout(0)');
    assert.equal(view._pendingTimeoutIds.has(0), false, 'ID 0 deve ser deletado de _pendingTimeoutIds');

    // Simular que rafId 0 foi alocado
    view._pendingRafIds.add(0);
    view._clearRaf(0);
    assert.equal(clearedCafId, 0, '_clearRaf(0) deve chamar cancelAnimationFrame(0)');
    assert.equal(view._pendingRafIds.has(0), false, 'ID 0 deve ser deletado de _pendingRafIds');

    // Simular fallback timer com ID 0
    clearedTimerId = null;
    view._fallbackRafTimeoutIds.add(0);
    view._pendingTimeoutIds.add(0);
    view._clearRaf(0);
    assert.equal(clearedTimerId, 0, '_clearRaf(0) em fallback deve chamar clearTimeout(0)');
    assert.equal(view._fallbackRafTimeoutIds.has(0), false, 'ID 0 de fallback deve ser deletado');
    assert.equal(view._pendingTimeoutIds.has(0), false, 'ID 0 deve ser deletado de _pendingTimeoutIds');

    // Testar _cancelDrawerOpening com ID 0
    clearedCafId = null;
    view._drawerOpenRafId = 0;
    view._pendingRafIds.add(0);
    view._cancelDrawerOpening();
    assert.equal(clearedCafId, 0, '_cancelDrawerOpening deve cancelar quando _drawerOpenRafId === 0');
    assert.equal(view._drawerOpenRafId, null, '_drawerOpenRafId deve ser resetado para null');

    // Testar _cancelDrawerClosing com fallback timer ID 0
    clearedTimerId = null;
    view._drawerCloseFallbackTimer = 0;
    view._pendingTimeoutIds.add(0);
    view._cancelDrawerClosing();
    assert.equal(clearedTimerId, 0, '_cancelDrawerClosing deve cancelar quando _drawerCloseFallbackTimer === 0');
    assert.equal(view._drawerCloseFallbackTimer, null, '_drawerCloseFallbackTimer deve ser resetado para null');

    view.destroy();
  } finally {
    global.clearTimeout = origClearTimeout;
    global.window = origWindow;
  }
});

test('Map Phase 5 — 4. destroy() durante fallback pendente cancela callbacks e impede reabertura', () => {
  const env = createDeterministicEnvironment();
  env.install();

  const origWindow = global.window;
  global.window = {
    setTimeout: env.setTimeoutMock,
    clearTimeout: env.clearTimeoutMock
  };

  try {
    const mgr = freshManager();
    startCampaign(mgr);

    let focusedElement = null;
    const mockContainer = {
      innerHTML: '',
      querySelector: (sel) => {
        if (sel === '#trainerDetailsDrawer') {
          return {
            classList: { add: () => {}, remove: () => {} },
            setAttribute: () => {},
            querySelector: (btnSel) => {
              if (btnSel === '#detailsCloseBtn') {
                return { focus: () => { focusedElement = 'detailsCloseBtn'; } };
              }
              return null;
            }
          };
        }
        if (sel === '#detailsBackdrop') {
          return { classList: { add: () => {}, remove: () => {} }, setAttribute: () => {} };
        }
        return null;
      },
      querySelectorAll: () => []
    };

    const view = new CampaignMapView({
      manager: mgr,
      container: mockContainer,
      initialRegionId: 'region-1'
    });

    view.render();
    view.openNode('node-normal');

    // O fallback de abertura está pendente
    assert.ok(view._pendingTimeoutIds.size > 0, 'Deve ter timeouts pendentes agendados');
    assert.ok(view._fallbackRafTimeoutIds.size > 0, 'Deve ter fallback RAF agendado');

    // Chamar destroy enquanto pendente
    view.destroy();

    assert.equal(view._pendingTimeoutIds.size, 0, 'destroy() deve esvaziar todos os timeouts');
    assert.equal(view._fallbackRafTimeoutIds.size, 0, 'destroy() deve esvaziar _fallbackRafTimeoutIds');
    assert.equal(view.isDrawerOpen, false, 'Drawer deve estar fechado no destroy');

    // Avançar relógio para simular timers expirando
    env.runAllTimers();

    assert.equal(focusedElement, null, 'Nenhum foco tardio deve ocorrer após destroy()');
    assert.equal(view.isDrawerOpen, false, 'Drawer não deve reabrir tardiamente');
  } finally {
    global.window = origWindow;
    env.restore();
  }
});

test('Map Phase 5 — 5. Interações rápidas: troca de região durante abertura de nó cancela drawer e prevalece última ação', () => {
  const env = createDeterministicEnvironment();
  env.install();

  const origWindow = global.window;
  global.window = {
    setTimeout: env.setTimeoutMock,
    clearTimeout: env.clearTimeoutMock,
    requestAnimationFrame: env.rafMock,
    cancelAnimationFrame: env.cafMock
  };

  try {
    const mgr = freshManager();
    startCampaign(mgr);

    const view = new CampaignMapView({
      manager: mgr,
      container: { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] },
      initialRegionId: 'region-1'
    });

    view.render();

    // 1. Iniciar abertura do nó
    view.openNode('node-normal');
    assert.equal(view.isDrawerOpen, true);
    assert.equal(view.selectedNodeId, 'node-normal');

    // 2. Antes de qualquer RAF rodar, o usuário troca rapidamente para a Região 2
    view.activeRegionId = 'region-2';
    view.selectedNodeId = null;
    view.isDrawerOpen = false;
    view.transitionCause = 'REGION_CHANGE';
    view.render();

    // 3. Avançar todos os RAFs e timers pendentes
    env.runAllRafs();
    env.runAllTimers();

    // 4. Prevalece a última ação do usuário: Região 2 ativa, drawer fechado
    assert.equal(view.activeRegionId, 'region-2');
    assert.equal(view.isDrawerOpen, false);
    assert.equal(view.selectedNodeId, null);

    view.destroy();
  } finally {
    global.window = origWindow;
    env.restore();
  }
});

test('Map Phase 5 — 6. Contratos de Acessibilidade WAI-ARIA: abas, painel, leitor de tela e foco', () => {
  const mgr = freshManager();
  startCampaign(mgr);

  let mountedHtml = '';
  const view = new CampaignMapView({
    manager: mgr,
    container: {
      set innerHTML(val) { mountedHtml = val; },
      get innerHTML() { return mountedHtml; },
      querySelector: () => null,
      querySelectorAll: () => []
    },
    initialRegionId: 'region-1'
  });

  view.render();

  // Helper para extrair atributos de uma tag de botão específica (eliminando falsos positivos cruzados)
  function parseTabButton(tabId) {
    const match = mountedHtml.match(new RegExp(`<button[^>]*id="${tabId}"[^>]*>`, 'i'));
    assert.ok(match, `Botão com id="${tabId}" deve existir na marcação`);
    const tag = match[0];
    const getAttr = (name) => {
      const m = tag.match(new RegExp(`${name}="([^"]*)"`, 'i'));
      return m ? m[1] : null;
    };
    return {
      tag,
      role: getAttr('role'),
      id: getAttr('id'),
      regionId: getAttr('data-region-id'),
      isLocked: getAttr('data-is-locked'),
      ariaSelected: getAttr('aria-selected'),
      ariaDisabled: getAttr('aria-disabled'),
      ariaControls: getAttr('aria-controls'),
      tabindex: getAttr('tabindex')
    };
  }

  // 1. Validação de tablist
  assert.ok(mountedHtml.includes('role="tablist"'), 'Deve conter container com role="tablist"');
  assert.ok(mountedHtml.includes('aria-label="Regiões do Circuito"'), 'Tablist deve ter rótulo acessível');

  // 2. Validação atômica de cada aba (atributos no mesmo elemento)
  const tab1 = parseTabButton('tab-region-1');
  assert.equal(tab1.role, 'tab', 'tab-region-1 deve ter role="tab"');
  assert.equal(tab1.regionId, 'region-1', 'tab-region-1 deve apontar para region-1');
  assert.equal(tab1.ariaSelected, 'true', 'Aba ativa (region-1) deve ter aria-selected="true"');
  assert.equal(tab1.ariaDisabled, 'false', 'Aba ativa deve ter aria-disabled="false"');
  assert.equal(tab1.ariaControls, 'campaign-map-region-panel', 'Aba deve controlar campaign-map-region-panel');
  assert.equal(tab1.tabindex, '0', 'Aba ativa deve ter tabindex="0" (roving tabindex)');

  const tab2 = parseTabButton('tab-region-2');
  assert.equal(tab2.role, 'tab');
  assert.equal(tab2.regionId, 'region-2');
  assert.equal(tab2.ariaSelected, 'false', 'Aba inativa deve ter aria-selected="false"');
  assert.equal(tab2.ariaDisabled, 'false');
  assert.equal(tab2.ariaControls, 'campaign-map-region-panel');
  assert.equal(tab2.tabindex, '-1', 'Aba inativa deve ter tabindex="-1"');

  const tab3 = parseTabButton('tab-region-3');
  assert.equal(tab3.role, 'tab');
  assert.equal(tab3.regionId, 'region-3');
  assert.equal(tab3.ariaSelected, 'false');
  assert.equal(tab3.ariaDisabled, 'false');
  assert.equal(tab3.ariaControls, 'campaign-map-region-panel');
  assert.equal(tab3.tabindex, '-1');

  const tabEndgame = parseTabButton('tab-region-endgame');
  assert.equal(tabEndgame.role, 'tab');
  assert.equal(tabEndgame.regionId, 'region-endgame');
  assert.equal(tabEndgame.ariaSelected, 'false');
  assert.equal(tabEndgame.ariaDisabled, 'true', 'Região final com 0 insígnias deve ter aria-disabled="true" no botão');
  assert.equal(tabEndgame.isLocked, 'true');
  assert.equal(tabEndgame.ariaControls, 'campaign-map-region-panel');
  assert.equal(tabEndgame.tabindex, '-1');

  // 3. Validação do tabpanel relacionado à aba ativa
  const panelMatch = mountedHtml.match(/<div[^>]*id="campaign-map-region-panel"[^>]*>/i);
  assert.ok(panelMatch, 'Tabpanel com id="campaign-map-region-panel" deve existir');
  const panelTag = panelMatch[0];
  assert.ok(panelTag.includes('role="tabpanel"'), 'Elemento deve ter role="tabpanel"');
  assert.ok(panelTag.includes('aria-labelledby="tab-region-1"'), 'Tabpanel deve ter aria-labelledby apontando para a aba ativa');
  assert.ok(panelTag.includes('tabindex="0"'), 'Tabpanel deve ter tabindex="0"');

  // 4. Live region para leitores de tela
  assert.ok(mountedHtml.includes('id="mapAriaLive"'));
  assert.ok(mountedHtml.includes('role="status"'));
  assert.ok(mountedHtml.includes('aria-live="polite"'));

  view.destroy();
});

test('Map Phase 5 — 7. Paridade Funcional entre Mapa e Lista: desafios, estados e ações idênticas nó a nó', () => {
  function testParityForState(label, setupFn, regionId) {
    const mgr = freshManager();
    setupFn(mgr);

    let mapHtml = '';
    let listHtml = '';

    let challengedPayloadMap = null;
    let challengedPayloadList = null;

    const mapView = new CampaignMapView({
      manager: mgr,
      container: {
        set innerHTML(val) { mapHtml = val; },
        get innerHTML() { return mapHtml; },
        querySelector: () => null,
        querySelectorAll: () => []
      },
      onChallenge: (p) => { challengedPayloadMap = p; },
      initialRegionId: regionId,
      initialViewMode: 'MAP'
    });
    mapView.render();

    const listView = new CampaignMapView({
      manager: mgr,
      container: {
        set innerHTML(val) { listHtml = val; },
        get innerHTML() { return listHtml; },
        querySelector: () => null,
        querySelectorAll: () => []
      },
      onChallenge: (p) => { challengedPayloadList = p; },
      initialRegionId: regionId,
      initialViewMode: 'LIST'
    });
    listView.render();

    const model = Model.buildMapViewModel({
      catalog: CAMPAIGN_MAP_CATALOG,
      campaignState: mgr.getState(),
      masters: K.MASTERS,
      manager: mgr,
      activeRegionId: regionId,
      selectedNodeId: null
    });

    const activeRegion = model.activeRegion;

    for (const node of activeRegion.nodes) {
      const isHidden = Boolean(node.isHidden || (node.challengeKind === 'SHADOW' && node.state === 'HIDDEN'));

      const mapBtnMatch = mapHtml.match(new RegExp(`<button[^>]*data-node-id="${node.nodeId}"[^>]*>`, 'i'));
      const listDetailsMatch = listHtml.match(new RegExp(`<button[^>]*data-node-open="${node.nodeId}"[^>]*>`, 'i'));
      const listChallengeMatch = listHtml.match(new RegExp(`<button[^>]*data-node-challenge="${node.nodeId}"[^>]*>`, 'i'));

      if (isHidden) {
        assert.equal(mapBtnMatch, null, `[${label}] Nó oculto ${node.nodeId} não deve estar no mapa`);
        assert.equal(listDetailsMatch, null, `[${label}] Nó oculto ${node.nodeId} não deve estar na lista`);
        assert.equal(listChallengeMatch, null, `[${label}] Nó oculto ${node.nodeId} não deve ter botão na lista`);
        continue;
      }

      assert.ok(mapBtnMatch, `[${label}] Mapa deve conter nó ${node.nodeId}`);
      assert.ok(listDetailsMatch, `[${label}] Lista deve conter botão de detalhes para ${node.nodeId}`);
      assert.ok(listChallengeMatch, `[${label}] Lista deve conter botão de desafio para ${node.nodeId}`);

      const mapTag = mapBtnMatch[0];
      const listBtnTag = listChallengeMatch[0];

      const getAttr = (tag, name) => {
        const m = tag.match(new RegExp(`${name}="([^"]*)"`, 'i'));
        return m ? m[1] : null;
      };

      const mapIsLocked = mapTag.includes('is-locked');
      const mapIsDefeated = mapTag.includes('is-defeated');
      const listIsDisabled = listBtnTag.includes('disabled');
      const listAriaDisabled = getAttr(listBtnTag, 'aria-disabled');
      const listTitle = getAttr(listBtnTag, 'title') || '';
      const mapTitle = getAttr(mapTag, 'title') || '';

      if (node.canChallenge) {
        assert.equal(mapIsLocked, false, `[${label}] Nó ${node.nodeId} disponível não deve ter classe is-locked no mapa`);
        assert.equal(listIsDisabled, false, `[${label}] Botão ${node.nodeId} disponível não deve ter atributo disabled na lista`);
        assert.equal(listAriaDisabled, null, `[${label}] Botão ${node.nodeId} disponível não deve ter aria-disabled`);

        if (node.isDefeated) {
          assert.equal(mapIsDefeated, true, `[${label}] Nó ${node.nodeId} derrotado deve ter is-defeated no mapa`);
          assert.ok(listBtnTag.includes('btn-rematch'), `[${label}] Botão ${node.nodeId} derrotado deve ter classe btn-rematch na lista`);
        } else {
          assert.equal(mapIsDefeated, false, `[${label}] Nó ${node.nodeId} pendente não deve ter is-defeated no mapa`);
          assert.ok(listBtnTag.includes('btn-challenge') || listBtnTag.includes('btn-danger'), `[${label}] Botão ${node.nodeId} deve ter classe de desafio`);
        }

        // Testar disparo real de desafio
        challengedPayloadMap = null;
        challengedPayloadList = null;
        const resMap = mapView.triggerChallenge(node);
        assert.equal(resMap, true, `[${label}] triggerChallenge deve aceitar nó ${node.nodeId}`);
        assert.ok(challengedPayloadMap, `[${label}] Payload deve ser gerado`);

        const resList = listView.triggerChallenge(node);
        assert.equal(resList, true, `[${label}] triggerChallenge na lista deve aceitar nó ${node.nodeId}`);
        if (node.challengeKind === 'SHADOW') {
          assert.deepEqual(challengedPayloadMap, { kind: 'SHADOW', id: null }, `[${label}] Payload do Shadow no Mapa deve ser { kind: 'SHADOW', id: null }`);
          assert.deepEqual(challengedPayloadList, { kind: 'SHADOW', id: null }, `[${label}] Payload do Shadow na Lista deve ser { kind: 'SHADOW', id: null }`);
        }
      } else {
        assert.equal(mapIsLocked, true, `[${label}] Nó ${node.nodeId} bloqueado deve ter classe is-locked no mapa`);
        assert.equal(listIsDisabled, true, `[${label}] Botão ${node.nodeId} bloqueado deve ter atributo disabled na lista`);
        assert.equal(listAriaDisabled, 'true', `[${label}] Botão ${node.nodeId} bloqueado deve ter aria-disabled="true" na lista`);
        assert.ok(listTitle.length > 0 || node.cannotChallengeReason, `[${label}] Botão ${node.nodeId} bloqueado deve ter motivo de bloqueio`);

        // Testar que disparo é bloqueado
        challengedPayloadMap = null;
        const resMap = mapView.triggerChallenge(node);
        assert.equal(resMap, false, `[${label}] triggerChallenge deve rejeitar nó bloqueado ${node.nodeId}`);
        assert.equal(challengedPayloadMap, null, `[${label}] Nenhum payload deve ser emitido`);
      }
    }

    mapView.destroy();
    listView.destroy();
  }

  // 1. Mestre disponível no início (0 insígnias)
  testParityForState('0 Insígnias - Região 1 (Mestre disponível)', (m) => startCampaign(m), 'region-1');

  // 2. Mestre derrotado (revanche)
  testParityForState('Mestre Derrotado / Revanche - Região 1', (m) => {
    startCampaign(m);
    m.recordBattle({ battleId: 'test-norm', kind: 'MASTER', id: 'master-normal', winner: 'player' });
  }, 'region-1');

  // 3. Região Final liberada com 18 insígnias — provas e Super disponíveis, Shadow oculto
  testParityForState('Endgame Liberado - 18 Insígnias (Provas e Super disponíveis, Shadow oculto)', (m) => unlock18Badges(m), 'region-endgame');

  // 4. Região Final após recompensa do Super — Shadow realmente revelado e disponível
  testParityForState('Shadow Revelado e Disponível (Após vitória e recompensa do Super)', (m) => {
    unlock18Badges(m);
    m.recordBattle({ battleId: 'phase5-super-win', kind: 'SUPER', id: null, winner: 'player' });
    m.acknowledgeSuperVictory();
    const reward = m.getRewardCandidates().find(c => c.selectable);
    assert.ok(reward, 'Deve existir uma recompensa selecionável do Super');
    m.claimReward(reward.id);
    assert.equal(m.getState().shadowTrainer.revealed, true, 'Shadow deve estar efetivamente revelado');
    m.acknowledgeShadowReveal();
    assert.equal(m.canChallenge('SHADOW'), true, 'Shadow deve estar disponível para desafio');
  }, 'region-endgame');
});

test('Map Phase 5 — 10. Região Final bloqueada redireciona para Região 1 e permanece inacessível', () => {
  // 1. Campanha iniciada com zero insígnias
  const mgr = freshManager();
  startCampaign(mgr);
  assert.equal(mgr.getBadgeCount(), 0, 'Campanha deve iniciar com 0 insígnias');

  // 2. Solicitação inicial de region-endgame
  const model = Model.buildMapViewModel({
    catalog: CAMPAIGN_MAP_CATALOG,
    campaignState: mgr.getState(),
    masters: K.MASTERS,
    manager: mgr,
    activeRegionId: 'region-endgame',
    selectedNodeId: null
  });

  // 3. Modelo resolve activeRegionId para region-1
  assert.equal(model.activeRegionId, 'region-1', 'Modelo deve redirecionar region-endgame para region-1 quando bloqueada');
  assert.equal(model.activeRegion.id, 'region-1', 'Região ativa resolvida no modelo deve ser region-1');

  // 4. CampaignMapView.activeRegionId também termina em region-1
  let capturedHtml = '';
  let announcedMessage = null;
  let challengeTriggered = false;

  const mockEndgameTab = {
    dataset: {
      regionId: 'region-endgame',
      isLocked: 'true'
    },
    onclick: null,
    focus: () => {}
  };

  const mockTab1 = {
    dataset: {
      regionId: 'region-1',
      isLocked: 'false'
    },
    onclick: null,
    focus: () => {}
  };

  const mockContainer = {
    get innerHTML() { return capturedHtml; },
    set innerHTML(val) { capturedHtml = val; },
    querySelector(sel) {
      if (sel === '#mapAriaLive') {
        return { textContent: '', innerText: '' };
      }
      return null;
    },
    querySelectorAll(sel) {
      if (sel === '.campaign-map-tab') {
        return [mockTab1, mockEndgameTab];
      }
      return [];
    }
  };

  const mapView = new CampaignMapView({
    manager: mgr,
    container: mockContainer,
    initialRegionId: 'region-endgame',
    onChallenge: () => { challengeTriggered = true; }
  });

  mapView.announce = (msg) => {
    announcedMessage = msg;
  };

  mapView.render();

  assert.equal(mapView.activeRegionId, 'region-1', 'CampaignMapView.activeRegionId deve resolver e terminar em region-1');

  // 5. Aba da Região Final existe na renderização
  const endgameTabMatch = capturedHtml.match(/<button[^>]*id="tab-region-endgame"[^>]*>[\s\S]*?<\/button>/i);
  assert.ok(endgameTabMatch, 'Aba da Região Final deve existir no HTML renderizado');

  // 6. A própria aba final possui aria-selected="false", aria-disabled="true", data-is-locked="true", tabindex="-1"
  const endgameTabTag = endgameTabMatch[0];
  assert.ok(endgameTabTag.includes('aria-selected="false"'), 'Aba final bloqueada deve ter aria-selected="false"');
  assert.ok(endgameTabTag.includes('aria-disabled="true"'), 'Aba final bloqueada deve ter aria-disabled="true"');
  assert.ok(endgameTabTag.includes('data-is-locked="true"'), 'Aba final bloqueada deve ter data-is-locked="true"');
  assert.ok(endgameTabTag.includes('tabindex="-1"'), 'Aba final bloqueada deve ter tabindex="-1"');

  // 7. tabpanel permanece relacionado à Região 1
  assert.ok(capturedHtml.includes('id="campaign-map-region-panel"'), 'Elemento tabpanel deve existir');
  assert.ok(capturedHtml.includes('aria-labelledby="tab-region-1"'), 'tabpanel deve estar associado à aba da Região 1');

  // 8. Nós da Região 1 são renderizados
  assert.ok(capturedHtml.includes('data-node-id="node-normal"'), 'Mestres da Região 1 devem ser renderizados');
  assert.ok(capturedHtml.includes('data-node-id="node-grass"'), 'Mestre Grass da Região 1 deve ser renderizado');
  assert.ok(capturedHtml.includes('data-node-id="node-water"'), 'Mestre Water da Região 1 deve ser renderizado');

  // 9. Nós exclusivos do endgame NÃO são renderizados
  assert.equal(capturedHtml.includes('data-node-id="node-super"'), false, 'Nó Super Trainer não deve ser renderizado');
  assert.equal(capturedHtml.includes('data-node-id="node-shadow"'), false, 'Nó Shadow Trainer não deve ser renderizado');
  assert.equal(capturedHtml.includes('data-node-id="node-legendary"'), false, 'Prova Lendária não deve ser renderizada');
  assert.equal(capturedHtml.includes('data-node-id="node-mythical"'), false, 'Prova Mítica não deve ser renderizada');
  assert.equal(capturedHtml.includes('data-node-id="node-titans"'), false, 'Prova dos Titãs não deve ser renderizada');
  assert.equal(capturedHtml.includes('data-node-id="node-celestial"'), false, 'Prova Celestial não deve ser renderizada');

  // 10. Tentar ativar a aba bloqueada
  assert.equal(typeof mockEndgameTab.onclick, 'function', 'Listener de clique deve estar vinculado à aba');
  mockEndgameTab.onclick();

  assert.equal(mapView.activeRegionId, 'region-1', 'Clicar na aba bloqueada NÃO deve trocar a região ativa');
  assert.equal(mapView.isDrawerOpen, false, 'Clicar na aba bloqueada NÃO deve abrir drawer');
  assert.equal(challengeTriggered, false, 'Clicar na aba bloqueada NÃO deve disparar desafio');
  assert.ok(announcedMessage && announcedMessage.includes('Região Final bloqueada'), 'Deve produzir anúncio sonoro/leitor de tela de Região Final bloqueada');
});

test('Map Phase 5 — 8. Integração CampaignView: estado COMPLETED desmonta mapa e exibe True Ending com reset', () => {
  const mgr = freshManager();
  unlock18Badges(mgr);

  // Derrotar Super Trainer e resolver recompensa de elite
  mgr.recordBattle({ battleId: 'test-super-win', kind: 'SUPER', id: null, winner: 'player' });
  mgr.acknowledgeSuperVictory();
  const elite = mgr.getRewardCandidates().find(c => c.selectable);
  if (elite) mgr.claimReward(elite.id);
  mgr.acknowledgeShadowReveal();

  // Derrotar Shadow Trainer -> status torna-se COMPLETED
  mgr.recordBattle({ battleId: 'test-shadow-win', kind: 'SHADOW', id: null, winner: 'player' });

  assert.equal(mgr.getState().status, 'COMPLETED', 'Status da campanha deve ser COMPLETED após vitória no Shadow');
  assert.equal(mgr.getState().pendingReward, null, 'Nenhuma recompensa pendente ao concluir');

  let capturedHtml = '';
  let resetTriggered = false;

  const mockContainer = {
    get innerHTML() { return capturedHtml; },
    set innerHTML(val) { capturedHtml = val; },
    querySelector(sel) {
      if (sel === '#campaignReset') {
        return {
          onclick: () => { resetTriggered = true; }
        };
      }
      return null;
    },
    querySelectorAll: () => []
  };

  const campaignView = new CampaignView({
    manager: mgr,
    coordinator: null,
    container: mockContainer
  });

  // Simula mapView previamente existente para comprovar que é destruído
  let mapViewDestroyed = false;
  campaignView.mapView = {
    destroy: () => { mapViewDestroyed = true; }
  };

  campaignView.render();

  // 1. O mapa não deve ser renderizado
  assert.equal(capturedHtml.includes('campaign-map-shell'), false, 'Mapa NÃO deve permanecer montado quando COMPLETED');
  assert.equal(capturedHtml.includes('campaign-map-viewport'), false, 'Viewport do mapa não deve existir na tela de conclusão');
  assert.equal(capturedHtml.includes('Revanche'), false, 'Nenhum CTA de revanche deve ser renderizado pós-campanha');

  // 2. Tela de conclusão da campanha deve ser renderizada (renderComplete)
  assert.ok(
    capturedHtml.includes('CAMPANHA 100% CONCLUÍDA') || capturedHtml.includes('True Ending'),
    'Deve conter título de conclusão da campanha'
  );
  assert.ok(
    capturedHtml.includes('CAMPEÃO DO CIRCUITO') || capturedHtml.includes('JORNADA CONCLUÍDA'),
    'Deve conter eyebrow de conclusão'
  );

  // 3. Ação de reset deve existir
  assert.ok(capturedHtml.includes('id="campaignReset"'), 'Deve conter botão de resetar campanha');

  // 4. mapView deve ser destruído
  assert.strictEqual(mapViewDestroyed, true, 'mapView deve ser destruído ao entrar em status COMPLETED');
});

test('Map Phase 5 — 9. Métricas reais dos WebP em disco: conformidade estrita em bytes e KiB', () => {
  const EXPECTED_FILES = [
    { name: 'region-1-vales.webp', expectedBytes: 134778, maxBytes: 140 * 1024 },
    { name: 'region-2-fendas.webp', expectedBytes: 133436, maxBytes: 140 * 1024 },
    { name: 'region-3-arcanas.webp', expectedBytes: 134350, maxBytes: 140 * 1024 },
    { name: 'region-endgame.webp', expectedBytes: 133408, maxBytes: 140 * 1024 }
  ];

  let accumulatedBytes = 0;

  for (const fileInfo of EXPECTED_FILES) {
    const fullPath = path.resolve(__dirname, '../../assets/images/campaign/maps', fileInfo.name);
    assert.ok(fs.existsSync(fullPath), `Arquivo ${fileInfo.name} deve existir`);

    const stats = fs.statSync(fullPath);
    const actualBytes = stats.size;
    accumulatedBytes += actualBytes;

    // Conferência de bytes exatos com o disco real
    assert.equal(actualBytes, fileInfo.expectedBytes, `Tamanho real do ${fileInfo.name} deve ser exatamente ${fileInfo.expectedBytes} bytes (obtido: ${actualBytes})`);

    // Orçamento individual <= 140 KiB (143.360 bytes)
    assert.ok(actualBytes <= fileInfo.maxBytes, `${fileInfo.name} excede o limite de 140 KiB: ${actualBytes} > ${fileInfo.maxBytes}`);
  }

  // Orçamento total: 535.972 bytes (523,41 KiB) <= 560 KiB (573.440 bytes)
  assert.equal(accumulatedBytes, 535972, `Total acumulado dos WebP deve ser exatamente 535.972 bytes (obtido: ${accumulatedBytes})`);
  assert.ok(accumulatedBytes <= 560 * 1024, `Total acumulado excede o limite combinado de 560 KiB: ${accumulatedBytes} > ${560 * 1024}`);
});

// -----------------------------------------------------------------------------
// AVATAR NO MAPA — FASE 1
// -----------------------------------------------------------------------------

test('Avatar Phase 1 — rotas são reversíveis, contínuas e não atravessam nós ocultos', () => {
  const region = CAMPAIGN_MAP_CATALOG.regions[0];
  const forward = Model.findTravelPath(region, 'node-normal', 'node-flying');
  const backward = Model.findTravelPath(region, 'node-flying', 'node-normal');
  assert.ok(forward.length > 1);
  assert.deepEqual(backward.map(edge => edge.routeId), forward.map(edge => edge.routeId).reverse());
  assert.equal(forward[0].from, 'node-normal');
  assert.equal(forward[forward.length - 1].to, 'node-flying');
  for (let index = 1; index < forward.length; index++) {
    assert.equal(forward[index - 1].to, forward[index].from);
  }
  assert.deepEqual(Model.findTravelPath(region, 'node-normal', 'node-normal'), []);
  assert.equal(Model.findTravelPath(region, 'missing', 'node-flying'), null);

  const mgr = freshManager();
  startCampaign(mgr);
  const vm = Model.buildMapViewModel({
    catalog: CAMPAIGN_MAP_CATALOG, campaignState: mgr.getState(), masters: K.MASTERS, manager: mgr,
    activeRegionId: 'region-endgame'
  });
  const endgame = vm.regions.find(item => item.id === 'region-endgame');
  assert.equal(Model.findTravelPath(endgame, endgame.nodes[0].nodeId, 'node-shadow'), null);
});

test('Avatar Phase 3 — seis quadros transparentes cobrem subida, descida e movimento horizontal', () => {
  const imageDir = path.resolve(__dirname, '../../assets/images/campaign');
  const frames = [
    'player-traveler.png', 'player-traveler-step-b.png',
    'player-traveler-down-a.png', 'player-traveler-down-b.png',
    'player-traveler-up-a.png', 'player-traveler-up-b.png'
  ].map(name => fs.readFileSync(path.join(imageDir, name)));
  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  for (const frame of frames) {
    assert.ok(frame.subarray(0, 8).equals(pngSignature));
    assert.equal(frame[25], 6, 'Quadro deve preservar canal alfa RGBA');
    assert.equal(frame.readUInt32BE(16), frames[0].readUInt32BE(16));
    assert.equal(frame.readUInt32BE(20), frames[0].readUInt32BE(20));
  }

  const css = fs.readFileSync(path.resolve(__dirname, '../../assets/css/campaign-map.css'), 'utf8');
  assert.match(css, /\.campaign-map-player-avatar__stride-b\s*\{\s*opacity:\s*0/);
  for (const direction of ['horizontal', 'down', 'up']) {
    assert.match(css, new RegExp(`\\.campaign-map-player-avatar\\.is-direction-${direction} img\\[data-direction="${direction}"\\]`));
  }
  assert.match(css, /\.campaign-map-player-avatar\.is-step-b \.campaign-map-player-avatar__stride-b/);
  assert.match(css, /@keyframes mapAvatarArrive/);
});

test('Avatar Phase 3 — direção e troca de pernas acompanham deslocamento real', () => {
  const classes = new Set(['is-direction-down']);
  const avatar = {
    style: {},
    classList: {
      toggle(name, enabled) {
        if (enabled) classes.add(name);
        else classes.delete(name);
      }
    }
  };
  const view = new CampaignMapView({ container: { querySelector: () => null } });
  const travel = { avatar, direction: 'down' };
  view._orientAvatar(travel, 20, 0);
  assert.ok(classes.has('is-direction-horizontal'));
  assert.ok(!classes.has('is-facing-left'));
  view._orientAvatar(travel, -20, 0);
  assert.ok(classes.has('is-facing-left'));
  view._orientAvatar(travel, 0, -20);
  assert.ok(classes.has('is-direction-up'));
  assert.ok(!classes.has('is-facing-left'));
  view._orientAvatar(travel, 0, 20);
  assert.ok(classes.has('is-direction-down'));

  view._renderVersion = 1;
  view._travel = {
    avatar, renderVersion: 1, startedAt: null, duration: 1000, totalLength: 200,
    lastPoint: null, segments: [{ length: 200, reversed: false, path: { getPointAtLength: distance => ({ x: distance, y: 0 }) } }]
  };
  view._safeRaf = () => 1;
  view._clearRaf = () => {};
  view._stepTravel(0);
  assert.ok(!classes.has('is-step-b'));
  view._stepTravel(250);
  assert.ok(classes.has('is-step-b'), 'Passada troca depois de avançar 48 unidades SVG');
  view._stepTravel(500);
  assert.ok(!classes.has('is-step-b'), 'Próxima distância troca de volta');
  view.destroy();
});

test('Avatar Phase 3 — pular caminhada permanece visível fora da rolagem do mapa no celular', () => {
  const view = new CampaignMapView({ container: {} });
  view._travel = { renderVersion: 0 };
  const html = view._renderMapView(CAMPAIGN_MAP_CATALOG.regions[0], {});
  assert.match(html, /<\/div>\s*<\/div>\s*<button id="skipMapTravel"/);
  const css = fs.readFileSync(path.resolve(__dirname, '../../assets/css/campaign-map.css'), 'utf8');
  assert.match(css, /\.campaign-map-panel\s*\{\s*position:\s*relative/);
  assert.match(css, /@media \(max-width: 640px\)[\s\S]*\.campaign-map-travel-skip\s*\{\s*bottom:\s*36px/);
});

test('Avatar Phase 1 — Enfrentar caminha antes do picker, permite pular, evita duplo clique e lembra posição', () => {
  const mgr = freshManager();
  startCampaign(mgr);
  const catalogRegion = CAMPAIGN_MAP_CATALOG.regions[0];
  const nodes = new Map(catalogRegion.nodes.map(node => [node.nodeId, node]));
  const paths = new Map(catalogRegion.routes.map(route => {
    const from = nodes.get(route.from).position;
    const to = nodes.get(route.to).position;
    const start = { x: from.x * 10, y: from.y * 5.625 };
    const end = { x: to.x * 10, y: to.y * 5.625 };
    const length = Math.hypot(end.x - start.x, end.y - start.y);
    return [`#${route.routeId}`, {
      getTotalLength: () => length,
      getPointAtLength: distance => ({
        x: start.x + (end.x - start.x) * distance / length,
        y: start.y + (end.y - start.y) * distance / length
      })
    }];
  }));
  const avatar = { style: {}, classList: { toggle: () => {} } };
  const skip = { focus: () => {}, onclick: null };
  const container = {
    innerHTML: '',
    querySelector: selector => {
      if (selector === '.campaign-map-stage') return {};
      if (selector === '#campaignPlayerAvatar') return avatar;
      if (selector === '#skipMapTravel') return skip;
      return paths.get(selector) || null;
    },
    querySelectorAll: () => []
  };
  const actions = [];
  const view = new CampaignMapView({ manager: mgr, container, initialViewMode: 'MAP', onChallenge: action => actions.push(action) });
  view._isReducedMotion = () => false;
  view.render();
  assert.match(container.innerHTML, /player-traveler\.png/);
  assert.match(container.innerHTML, /player-traveler-step-b\.png/);
  assert.match(container.innerHTML, /player-traveler-up-a\.png/);
  assert.match(container.innerHTML, /player-traveler-down-a\.png/);
  assert.doesNotMatch(container.innerHTML, /id="skipMapTravel"/);

  const frames = [];
  view._safeRaf = callback => { frames.push(callback); return frames.length; };
  view._clearRaf = () => {};
  const grass = view._activeRegion.nodes.find(node => node.nodeId === 'node-grass');
  assert.equal(view.triggerChallenge(grass), true);
  assert.equal(view.triggerChallenge(grass), false);
  assert.equal(actions.length, 0, 'Picker não deve abrir antes de chegar ao nó');
  assert.equal(mem.has('campaign_map_avatar_progress_v1'), false, 'Caminhada em curso não grava posição intermediária');
  assert.match(container.innerHTML, /id="skipMapTravel"/);
  assert.match(container.innerHTML, /campaign-map-player-avatar is-walking/);
  frames.shift()(0);
  frames.shift()(view._travel.duration / 2);
  assert.ok(parseFloat(avatar.style.left) > 15 && parseFloat(avatar.style.left) < 28);
  skip.onclick();
  assert.deepEqual(actions, [{ kind: 'MASTER', id: 'master-grass' }]);
  assert.equal(view.avatarNodeByRegion.get('region-1'), 'node-grass');
  assert.equal(JSON.parse(mem.get('campaign_map_avatar_progress_v1')).positions['region-1'], 'node-grass');
  assert.equal(view._travel, null);

  view.render();
  const normal = view._activeRegion.nodes.find(node => node.nodeId === 'node-normal');
  assert.equal(view.triggerChallenge(normal), true, 'Caminhada de volta usa a mesma trilha');
  assert.equal(actions.length, 1);
  frames.shift()(1000);
  frames.shift()(1000 + view._travel.duration);
  assert.deepEqual(actions[1], { kind: 'MASTER', id: 'master-normal' });
  assert.equal(view.avatarNodeByRegion.get('region-1'), 'node-normal');
});

test('Avatar Phase 1 — movimento reduzido inicia direto e destroy cancela viagem', () => {
  const mgr = freshManager();
  startCampaign(mgr);
  const actions = [];
  const container = { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] };
  const view = new CampaignMapView({ manager: mgr, container, initialViewMode: 'MAP', onChallenge: action => actions.push(action) });
  view.render();
  view._isReducedMotion = () => true;
  const grass = view._activeRegion.nodes.find(node => node.nodeId === 'node-grass');
  assert.equal(view.triggerChallenge(grass), true);
  assert.deepEqual(actions, [{ kind: 'MASTER', id: 'master-grass' }]);
  assert.equal(view._travel, null);

  view.render();
  view._travel = { payload: { kind: 'MASTER', id: 'master-normal' }, node: view._activeRegion.nodes[0], renderVersion: view._renderVersion };
  view.destroy();
  assert.equal(view._travel, null);
  assert.equal(actions.length, 1, 'Destruir mapa não inicia batalha pendente');
});

// -----------------------------------------------------------------------------
// AVATAR NO MAPA — FASE 2: CONTINUIDADE ENTRE REGIÕES E RECARGAS
// -----------------------------------------------------------------------------

test('Avatar Phase 2 — mantém nó por região e aba ativa após recriar a tela', () => {
  const mgr = freshManager();
  startCampaign(mgr);
  const storageKey = 'campaign_map_avatar_progress_v1';
  const tabs = ['region-1', 'region-2'].map(regionId => ({
    dataset: { regionId, isLocked: 'false' }, focus: () => {}, onclick: null, onkeydown: null
  }));
  const container = {
    innerHTML: '', querySelector: () => null,
    querySelectorAll: selector => selector === '.campaign-map-tab' ? tabs : []
  };
  const view = new CampaignMapView({ manager: mgr, container, initialViewMode: 'MAP' });
  view._isReducedMotion = () => true;
  view.render();
  const grass = view._activeRegion.nodes.find(node => node.nodeId === 'node-grass');
  view.triggerChallenge(grass);
  view.render();
  tabs[1].onclick();
  assert.equal(view.activeRegionId, 'region-2');
  const rock = view._activeRegion.nodes.find(node => node.nodeId === 'node-rock');
  view.triggerChallenge(rock);

  const saved = JSON.parse(mem.get(storageKey));
  assert.equal(saved.version, 1);
  assert.equal(saved.campaignId, mgr.getState().startedAt);
  assert.equal(saved.activeRegionId, 'region-2');
  assert.equal(saved.positions['region-1'], 'node-grass');
  assert.equal(saved.positions['region-2'], 'node-rock');
  assert.equal(mgr.getState().version, 1, 'Save principal não muda de versão');

  const reloadedManager = new CampaignManager(S);
  const reloaded = new CampaignMapView({ manager: reloadedManager, container, initialViewMode: 'MAP' });
  assert.equal(reloaded.activeRegionId, 'region-2');
  assert.equal(reloaded.avatarNodeByRegion.get('region-1'), 'node-grass');
  assert.equal(reloaded.avatarNodeByRegion.get('region-2'), 'node-rock');
  reloaded._isReducedMotion = () => true;
  reloaded.render();
  assert.equal(reloaded._getAvatarNode(reloaded._activeRegion).nodeId, 'node-rock');
  tabs[0].onclick();
  assert.equal(reloaded._getAvatarNode(reloaded._activeRegion).nodeId, 'node-grass');

  const explicit = new CampaignMapView({ manager: reloadedManager, container, initialRegionId: 'region-1' });
  assert.equal(explicit.activeRegionId, 'region-1', 'Região inicial explícita tem prioridade');
  assert.equal(explicit.avatarNodeByRegion.get('region-2'), 'node-rock');
  explicit.destroy();

  reloadedManager.reset();
  reloaded.destroy();
  assert.equal(mem.has(storageKey), false, 'Reset limpa somente a posição visual antiga');
  assert.equal(reloaded.activeRegionId, 'region-1');
  startCampaign(reloadedManager);
  const newCampaign = new CampaignMapView({ manager: reloadedManager, container });
  assert.equal(newCampaign.avatarNodeByRegion.size, 0);
  assert.equal(newCampaign.activeRegionId, 'region-1');
  newCampaign.destroy();
});

test('Avatar Phase 2 — ignora dados inválidos, campanha antiga e região final bloqueada', () => {
  const mgr = freshManager();
  startCampaign(mgr);
  const storageKey = 'campaign_map_avatar_progress_v1';
  const container = { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] };
  mem.set(storageKey, '{broken json');
  const corrupt = new CampaignMapView({ manager: mgr, container });
  assert.equal(corrupt.activeRegionId, 'region-1');
  assert.equal(corrupt.avatarNodeByRegion.size, 0);
  assert.equal(mem.has(storageKey), false);

  mem.set(storageKey, JSON.stringify({
    version: 1, campaignId: mgr.getState().startedAt, activeRegionId: 'region-endgame',
    positions: { 'region-1': 'missing', 'region-2': 'node-rock', unknown: 'node-normal' }
  }));
  const sanitized = new CampaignMapView({ manager: mgr, container });
  assert.equal(sanitized.avatarNodeByRegion.size, 1);
  assert.equal(sanitized.avatarNodeByRegion.get('region-2'), 'node-rock');
  sanitized.render();
  assert.equal(sanitized.activeRegionId, 'region-1', 'Região final ainda respeita as 18 insígnias');
  const lockedEndgame = Model.buildMapViewModel({
    catalog: CAMPAIGN_MAP_CATALOG, campaignState: mgr.getState(), masters: K.MASTERS, manager: mgr,
    activeRegionId: 'region-endgame'
  }).regions.find(region => region.id === 'region-endgame');
  sanitized.avatarNodeByRegion.set('region-endgame', 'node-shadow');
  assert.notEqual(sanitized._getAvatarNode(lockedEndgame).nodeId, 'node-shadow', 'Avatar nunca reaparece em nó oculto');
  sanitized.destroy();

  mem.set(storageKey, JSON.stringify({ version: 1, campaignId: 'another-campaign', activeRegionId: 'region-2', positions: { 'region-2': 'node-rock' } }));
  const stale = new CampaignMapView({ manager: mgr, container });
  assert.equal(stale.activeRegionId, 'region-1');
  assert.equal(stale.avatarNodeByRegion.size, 0);
  assert.equal(mem.has(storageKey), false);
  stale.destroy();
});

test('Avatar Phase 2 — armazenamento indisponível não impede navegação ou desafio', () => {
  const mgr = freshManager();
  startCampaign(mgr);
  const originalStorage = global.localStorage;
  global.localStorage = {
    getItem: () => { throw new Error('blocked'); },
    setItem: () => { throw new Error('blocked'); },
    removeItem: () => { throw new Error('blocked'); }
  };
  try {
    const container = { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] };
    const actions = [];
    const view = new CampaignMapView({ manager: mgr, container, onChallenge: action => actions.push(action) });
    view.render();
    const grass = view._activeRegion.nodes.find(node => node.nodeId === 'node-grass');
    assert.equal(view.triggerChallenge(grass), true);
    assert.deepEqual(actions, [{ kind: 'MASTER', id: 'master-grass' }]);
  } finally {
    global.localStorage = originalStorage;
  }
});

test('Avatar Phase 4 — ligações entre regiões usam saídas e entradas válidas sem criar desafios', () => {
  const links = CAMPAIGN_MAP_CATALOG.regionTravelLinks;
  assert.ok(Object.isFrozen(links));
  for (const source of CAMPAIGN_MAP_CATALOG.regions) {
    assert.equal(Object.keys(links[source.id]).length, 3);
    for (const target of CAMPAIGN_MAP_CATALOG.regions) {
      if (source.id === target.id) continue;
      const link = links[source.id][target.id];
      assert.ok(source.nodes.some(node => node.nodeId === link.exitNodeId), `${source.id} precisa de uma saída válida`);
      assert.ok(target.nodes.some(node => node.nodeId === link.entryNodeId), `${target.id} precisa de uma entrada válida`);
    }
  }
});

test('Avatar Phase 4 — aba inicia caminhada, pular conclui travessia e bloqueio final prevalece', () => {
  const mgr = freshManager();
  startCampaign(mgr);
  const paths = new Map();
  for (const region of CAMPAIGN_MAP_CATALOG.regions) {
    const nodes = new Map(region.nodes.map(node => [node.nodeId, node]));
    for (const route of region.routes) {
      const a = nodes.get(route.from).position;
      const b = nodes.get(route.to).position;
      const from = { x: a.x * 10, y: a.y * 5.625 };
      const to = { x: b.x * 10, y: b.y * 5.625 };
      const length = Math.hypot(to.x - from.x, to.y - from.y);
      paths.set(`#${route.routeId}`, {
        getTotalLength: () => length,
        getPointAtLength: distance => ({
          x: from.x + (to.x - from.x) * distance / length,
          y: from.y + (to.y - from.y) * distance / length
        })
      });
    }
  }
  const tabs = CAMPAIGN_MAP_CATALOG.regions.map(region => ({
    dataset: { regionId: region.id, isLocked: 'false' },
    onclick: null, focus() { this.focused = true; }
  }));
  const stageClasses = new Set();
  const stage = { classList: {
    add: name => stageClasses.add(name),
    remove: name => stageClasses.delete(name)
  } };
  const avatar = { style: {}, classList: { toggle: () => {} } };
  const skip = { onclick: null, focus() {} };
  const container = {
    innerHTML: '',
    querySelector(selector) {
      if (selector === '.campaign-map-stage') return stage;
      if (selector === '#campaignPlayerAvatar') return avatar;
      if (selector === '#skipMapTravel') return skip;
      if (selector.startsWith('#tab-')) return tabs.find(tab => tab.dataset.regionId === selector.slice(5));
      return paths.get(selector) || null;
    },
    querySelectorAll: selector => selector === '.campaign-map-tab' ? tabs : []
  };
  const actions = [];
  const view = new CampaignMapView({ manager: mgr, container, initialViewMode: 'MAP', onChallenge: action => actions.push(action) });
  view._isReducedMotion = () => false;
  const timers = [];
  view._safeTimeout = (fn, ms) => { timers.push({ fn, ms }); return timers.length; };
  view._safeRaf = () => 1;
  view._clearRaf = () => {};
  view.render();
  assert.match(container.innerHTML, /campaign-map-gateway/);
  tabs[3].onclick();
  assert.equal(view.activeRegionId, 'region-1', 'A região final não abre com menos de 18 insígnias');
  assert.equal(view._travel, null);

  tabs[1].onclick();
  assert.equal(view.activeRegionId, 'region-1', 'O mapa não troca antes da caminhada');
  assert.equal(view._travel.kind, 'REGION');
  assert.match(container.innerHTML, /Pular caminhada/);
  assert.equal(actions.length, 0, 'Transferir região não inicia batalha');
  skip.onclick();
  assert.equal(view._travel.kind, 'REGION_FADE');
  assert.ok(stageClasses.has('is-leaving'));
  assert.equal(view.activeRegionId, 'region-1');
  timers.findLast(timer => timer.ms === 220).fn();
  assert.equal(view.activeRegionId, 'region-2');
  assert.equal(view.avatarNodeByRegion.get('region-1'), 'node-flying');
  assert.equal(view.avatarNodeByRegion.get('region-2'), 'node-fighting');
  assert.equal(view._travel, null);
  assert.equal(actions.length, 0);
  const saved = JSON.parse(mem.get('campaign_map_avatar_progress_v1'));
  assert.equal(saved.activeRegionId, 'region-2');
  assert.equal(saved.positions['region-1'], 'node-flying');
  assert.equal(saved.positions['region-2'], 'node-fighting');

  tabs[2].onclick();
  assert.equal(view._travel.kind, 'REGION');
  view._stepTravel(0);
  view._stepTravel(view._travel.duration);
  assert.equal(view._travel.kind, 'REGION_FADE', 'Chegada automática também inicia a transição');
  timers.findLast(timer => timer.ms === 220).fn();
  assert.equal(view.activeRegionId, 'region-3');
  assert.equal(view.avatarNodeByRegion.get('region-2'), 'node-ice');
  assert.equal(view.avatarNodeByRegion.get('region-3'), 'node-fairy');
  view.destroy();
});

test('Avatar Phase 4 — modo Lista e movimento reduzido trocam direto; sair cancela travessia', () => {
  const mgr = freshManager();
  startCampaign(mgr);
  const tabs = ['region-1', 'region-2'].map(regionId => ({
    dataset: { regionId, isLocked: 'false' }, onclick: null, focus() {}
  }));
  const container = {
    innerHTML: '',
    querySelector: () => null,
    querySelectorAll: selector => selector === '.campaign-map-tab' ? tabs : []
  };
  const view = new CampaignMapView({ manager: mgr, container, initialViewMode: 'LIST' });
  view._isReducedMotion = () => false;
  view.render();
  tabs[1].onclick();
  assert.equal(view.activeRegionId, 'region-2');
  assert.equal(view._travel, null);
  view.viewMode = 'MAP';
  view._isReducedMotion = () => true;
  view.render();
  tabs[0].onclick();
  assert.equal(view.activeRegionId, 'region-1');
  assert.equal(view._travel, null);
  view._travel = { kind: 'REGION_FADE', renderVersion: view._renderVersion };
  view.destroy();
  assert.equal(view._travel, null);
  assert.equal(view.activeRegionId, 'region-1', 'Desmontar a tela não completa transferência pendente');
});
