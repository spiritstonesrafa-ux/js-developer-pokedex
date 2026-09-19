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
    'assets/js/campaign/campaign-trainer-visuals.js',
    'assets/js/campaign/campaign-type-guide.js',
    'assets/js/campaign/campaign-store.js',
    'assets/js/campaign/campaign-manager.js',
    'assets/js/campaign/campaign-map-catalog.js',
    'assets/js/campaign/campaign-map-model.js',
    'assets/js/campaign/campaign-map-view.js',
    'assets/js/campaign/campaign-view.js'
  ];

  const scripts = indexScripts.filter(src => requiredScripts.includes(src));
  assert.equal(scripts.length, requiredScripts.length, 'Todos os 12 scripts requeridos devem estar presentes em index.html');
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

