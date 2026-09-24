const test = require('node:test');
const assert = require('node:assert/strict');

const mem = new Map();
global.localStorage = {
  getItem: key => mem.get(key) || null,
  setItem: (key, value) => mem.set(key, String(value)),
  removeItem: key => mem.delete(key)
};

global.confirm = () => true;
global.alert = () => {};

const C = require('../../assets/js/campaign/campaign-constants');
const K = require('../../assets/js/campaign/campaign-catalog');
const S = require('../../assets/js/campaign/campaign-store');

global.window = {
  confirm: global.confirm,
  alert: global.alert,
  switchAppTab: () => {}
};
global.window.PBACampaign = Object.assign({}, K);

const { CampaignManager } = require('../../assets/js/campaign/campaign-manager');
const { CampaignView } = require('../../assets/js/campaign/campaign-view');
global.window.PBACampaign.CampaignView = CampaignView;

const { BattleTeamHydrator } = require('../../assets/js/battle-session/battle-team-hydrator');
const { isMechanicallySupportedMove, UNSUPPORTED_COMPLEX_MOVES } = require('../../assets/js/battle-session/battle-session-constants');
const DraftIds = require('../../assets/js/campaign/campaign-draft-ids');
const FallbackCatalog = require('../../assets/js/campaign/campaign-battle-fallback-catalog');

function fresh() {
  mem.clear();
  return new CampaignManager(S);
}

const PREVIOUS_144_IDS = [
  3,6,9,143,7,8,25,38,59,65,68,94,131,149,130,141,
  154,157,160,181,169,182,199,212,214,229,242,248,215,225,230,233,
  254,257,260,282,262,272,276,277,286,306,319,330,350,365,373,376,
  389,392,395,461,398,405,407,445,462,468,477,478,472,473,475,437,
  497,500,503,596,510,526,530,553,597,609,612,635,637,628,623,626,
  652,655,658,706,663,681,691,700,701,707,709,713,697,699,692,715,
  724,745,784,733,734,746,750,758,763,768,776,778,780,781,743,752,
  812,815,818,823,826,849,851,858,869,862,867,873,879,884,886,887,
  908,911,914,959,920,923,960,962,964,966,968,970,973,977,983,998
];

test('1 & 2. DRAFT.length === 450 and exactly 450 unique IDs', () => {
  assert.equal(K.DRAFT.length, 450);
  const ids = K.DRAFT.map(p => p.id);
  assert.equal(new Set(ids).size, 450);
  assert.equal(DraftIds.DRAFT_IDS.length, 450);
  assert.equal(new Set(DraftIds.DRAFT_IDS).size, 450);
});

test('3 & 4. Exactly 9 generations and exactly 50 per generation', () => {
  assert.equal(Object.keys(DraftIds.DRAFT_IDS_BY_GENERATION).length, 9);
  for (let g = 1; g <= 9; g++) {
    const list = DraftIds.DRAFT_IDS_BY_GENERATION[g];
    assert.ok(list, `Gen ${g} must exist`);
    assert.equal(list.length, 50, `Gen ${g} must have 50 IDs`);
    assert.equal(new Set(list).size, 50, `Gen ${g} must have unique IDs`);
    const fromDraft = K.DRAFT.filter(p => p.generation === g);
    assert.equal(fromDraft.length, 50, `Draft in gen ${g} must have 50 entries`);
  }
});

test('5. All 144 previous IDs are preserved in the draft', () => {
  assert.equal(PREVIOUS_144_IDS.length, 144);
  const draftIds = new Set(K.DRAFT.map(p => p.id));
  for (const id of PREVIOUS_144_IDS) {
    assert.ok(draftIds.has(id), `Previous ID #${id} must be in draft`);
  }
});

test('6 & 7. Zero legendaries and zero mythicals in DRAFT', () => {
  for (const p of K.DRAFT) {
    assert.equal(p.legendary, false, `ID #${p.id} ${p.name} cannot be legendary`);
    assert.equal(p.mythical, false, `ID #${p.id} ${p.name} cannot be mythical`);
  }
});

test('8 & 9. Disjointness with Super Team and the 4 Endgame Trials', () => {
  const draftIds = new Set(K.DRAFT.map(p => p.id));

  for (const p of K.SUPER_TEAM) {
    assert.equal(draftIds.has(p.id), false, `Super member #${p.id} (${p.name}) cannot be in draft`);
  }

  const trialTeams = [
    { name: 'Legendary', team: K.LEGENDARY_TRIAL_TEAM },
    { name: 'Mythical', team: K.MYTHICAL_TRIAL_TEAM },
    { name: 'Titans', team: K.TITANS_TRIAL_TEAM },
    { name: 'Celestial', team: K.CELESTIAL_TRIAL_TEAM }
  ];

  for (const { name, team } of trialTeams) {
    for (const p of team) {
      assert.equal(draftIds.has(p.id), false, `${name} trial member #${p.id} (${p.name}) cannot be in draft`);
    }
  }
});

test('10, 11, 12, 13, 14 & 15. Draft metadata validity and byId access', () => {
  for (const p of K.DRAFT) {
    assert.ok(typeof p.name === 'string' && p.name.length > 0, `ID #${p.id} must have valid name`);
    assert.doesNotMatch(p.name, /^pokemon-\d+$/i, `ID #${p.id} cannot be placeholder`);
    assert.ok(Array.isArray(p.types) && p.types.length >= 1 && p.types.length <= 2, `ID #${p.id} types`);
    for (const t of p.types) {
      assert.ok(typeof t === 'string' && t.length > 0);
    }
    assert.ok(typeof p.bst === 'number' && p.bst >= 175, `ID #${p.id} must have valid BST (${p.bst})`);
    assert.ok(p.generation >= 1 && p.generation <= 9, `ID #${p.id} must have gen 1-9`);
    assert.ok(typeof p.sprite === 'string' && p.sprite.startsWith('http'), `ID #${p.id} must have sprite URL`);

    const found = K.byId(p.id);
    assert.ok(found, `byId(${p.id}) must return record`);
    assert.equal(found.id, p.id);
    assert.equal(found.name, p.name);
  }
});

test('16. Unsupported complex moves and canonical accuracy in 1,800 offline moves', () => {
  const mons = Object.values(FallbackCatalog.byId);
  assert.equal(mons.length, 450);

  // Independent of the production blacklist: these moves still need turn/state rules.
  const pendingMechanics = new Set([
    'sucker-punch', 'first-impression', 'bolt-beak', 'payback',
    'assurance', 'stomping-tantrum', 'temper-flare', 'last-respects'
  ]);

  let totalMoves = 0;
  for (const p of mons) {
    assert.equal(p.moves.length, 4, `Pokemon #${p.id} ${p.name} must have exactly 4 moves`);
    for (const m of p.moves) {
      totalMoves++;
      assert.ok(!pendingMechanics.has(m.name), `Move ${m.name} on #${p.id} still requires engine support`);
      // No unsupported complex move allowed
      assert.ok(!UNSUPPORTED_COMPLEX_MOVES[m.name], `Move ${m.name} on #${p.id} is an unsupported complex move`);
      assert.ok(isMechanicallySupportedMove(m), `Move ${m.name} must be mechanically supported`);

      // Accuracy must be present and canonical
      assert.notEqual(m.accuracy, undefined, `Move ${m.name} must have accuracy property defined`);
      if (m.accuracy !== null) {
        assert.ok(typeof m.accuracy === 'number', `Move ${m.name} accuracy must be number or null`);
        assert.ok(m.accuracy >= 1 && m.accuracy <= 100, `Move ${m.name} accuracy must be between 1 and 100`);
      }

      // Specific mechanics banned
      assert.notEqual(m.name, 'explosion');
      assert.notEqual(m.name, 'self-destruct');
      assert.notEqual(m.name, 'hyper-beam');
      assert.notEqual(m.name, 'giga-impact');
      assert.notEqual(m.name, 'solar-beam');
      assert.notEqual(m.name, 'solar-blade');
      assert.notEqual(m.name, 'fly');
      assert.notEqual(m.name, 'dig');
      assert.notEqual(m.name, 'dive');
      assert.notEqual(m.name, 'bounce');
      assert.notEqual(m.name, 'phantom-force');
      assert.notEqual(m.name, 'double-edge');
      assert.notEqual(m.name, 'brave-bird');
      assert.notEqual(m.name, 'flare-blitz');
      assert.notEqual(m.name, 'head-smash');
      assert.notEqual(m.name, 'outrage');
      assert.notEqual(m.name, 'low-kick');
      assert.notEqual(m.name, 'glaive-rush');

      // Valid basic combat attributes
      assert.ok(m.power > 0, `Move ${m.name} must have positive power`);
      assert.ok(m.type, `Move ${m.name} must have type`);
      assert.ok(m.damageClass === 'physical' || m.damageClass === 'special');
      assert.ok(m.pp > 0, `Move ${m.name} must have positive PP`);
    }
  }

  assert.equal(totalMoves, 1800);
});

test('17. Accuracy values are not flattened to 100%', () => {
  const mons = Object.values(FallbackCatalog.byId);
  const movesByName = new Map();
  for (const p of mons) {
    for (const m of p.moves) {
      if (!movesByName.has(m.name)) movesByName.set(m.name, m.accuracy);
    }
  }

  if (movesByName.has('hydro-pump')) assert.equal(movesByName.get('hydro-pump'), 80);
  if (movesByName.has('stone-edge')) assert.equal(movesByName.get('stone-edge'), 80);
  if (movesByName.has('power-whip')) assert.equal(movesByName.get('power-whip'), 85);
  if (movesByName.has('icicle-crash')) assert.equal(movesByName.get('icicle-crash'), 90);
  if (movesByName.has('play-rough')) assert.equal(movesByName.get('play-rough'), 90);
  if (movesByName.has('air-slash')) assert.equal(movesByName.get('air-slash'), 95);
  if (movesByName.has('swift')) assert.equal(movesByName.get('swift'), null);
  if (movesByName.has('aerial-ace')) assert.equal(movesByName.get('aerial-ace'), null);
  if (movesByName.has('aura-sphere')) assert.equal(movesByName.get('aura-sphere'), null);
});

test('18. Endgame recommendations: exactly 54 total, exactly 6 per gen, STAB present, and pseudo-legendaries', () => {
  const recommended = K.DRAFT.filter(p => p.recommendedForEndgame === true);
  assert.equal(recommended.length, 54, 'Must have exactly 54 recommended Pokémon');

  // Exactly 6 per generation
  for (let g = 1; g <= 9; g++) {
    const genRecs = recommended.filter(p => p.generation === g);
    assert.equal(genRecs.length, 6, `Gen ${g} must have exactly 6 recommended, got ${genRecs.length}`);
  }

  // Each recommended has at least 1 valid STAB in its actual fallback loadout
  for (const p of recommended) {
    const fallback = FallbackCatalog.byId[p.id];
    assert.ok(fallback, `Fallback for #${p.id} must exist`);
    const hasStab = fallback.moves.some(m => p.types.includes(m.type));
    assert.ok(hasStab, `Recommended #${p.id} ${p.name} must have at least one STAB move in loadout`);
    assert.ok(p.bst >= 490, `Recommended #${p.id} ${p.name} must have BST >= 490`);
    const maxOffense = Math.max(fallback.stats.attack, fallback.stats.specialAttack);
    assert.ok(maxOffense >= 70, `Recommended #${p.id} ${p.name} must have offensive stat >= 70`);
  }

  // Spot-check iconic pseudo-legendaries
  const PSEUDOS = [
    { id: 149, name: 'dragonite', gen: 1 },
    { id: 248, name: 'tyranitar', gen: 2 },
    { id: 376, name: 'metagross', gen: 3 },
    { id: 445, name: 'garchomp', gen: 4 },
    { id: 635, name: 'hydreigon', gen: 5 },
    { id: 706, name: 'goodra', gen: 6 },
    { id: 784, name: 'kommo-o', gen: 7 },
    { id: 887, name: 'dragapult', gen: 8 },
    { id: 998, name: 'baxcalibur', gen: 9 }
  ];

  for (const pseudo of PSEUDOS) {
    const mon = K.byId(pseudo.id);
    assert.ok(mon, `Pseudo-legendary #${pseudo.id} must exist`);
    assert.equal(mon.recommendedForEndgame, true, `Pseudo-legendary ${pseudo.name} (#${pseudo.id}) must be recommended`);
  }

  // Goodra has Dragon move
  const goodra = FallbackCatalog.byId[706];
  assert.ok(goodra.moves.some(m => m.type === 'dragon'), 'Goodra must have a Dragon move');

  // Metagross has Meteor Mash and no self-destruct
  const metagross = FallbackCatalog.byId[376];
  assert.ok(metagross.moves.some(m => m.name === 'meteor-mash'), 'Metagross must have Meteor Mash');
  assert.ok(!metagross.moves.some(m => m.name === 'explosion' || m.name === 'self-destruct'));

  // Baxcalibur has Icicle Crash and no Glaive Rush
  const baxcalibur = FallbackCatalog.byId[998];
  assert.ok(baxcalibur.moves.some(m => m.name === 'icicle-crash'), 'Baxcalibur must have Icicle Crash');
  assert.ok(!baxcalibur.moves.some(m => m.name === 'glaive-rush'));

  // Shuckle is NOT recommended
  const shuckle = K.byId(213);
  assert.equal(shuckle.recommendedForEndgame, false, 'Shuckle must not be recommended for endgame');
});

test('19, 20, 21 & 22. Campaign start rules: exact 6, invalid rejected, duplicates rejected, master conflict', () => {
  const manager = fresh();

  // 19. Exact 6 required
  assert.equal(manager.start(K.DRAFT.slice(0, 5).map(p => p.id)).ok, false, 'Less than 6 rejected');
  assert.equal(manager.start(K.DRAFT.slice(0, 7).map(p => p.id)).ok, false, 'More than 6 rejected');

  // 20. Invalid IDs rejected
  assert.equal(manager.start([1, 2, 4, 7, 8, 9999]).ok, false, 'ID 9999 not in draft');

  // 21. Duplicates rejected
  const id = K.DRAFT[0].id;
  assert.equal(manager.start([id, id, K.DRAFT[1].id, K.DRAFT[2].id, K.DRAFT[3].id, K.DRAFT[4].id]).ok, false, 'Duplicate IDs rejected');

  // 22. MASTER_REWARD_CONFLICT works
  const steelMaster = K.MASTERS.find(m => m.challengeId === 'master-steel');
  const steelTeam = steelMaster.team.map(p => p.id);
  const starterWithSteel = [...steelTeam, ...K.DRAFT.filter(p => !steelTeam.includes(p.id)).slice(0, 3).map(p => p.id)];
  const res = manager.start(starterWithSteel);
  assert.equal(res.ok, false);
  assert.equal(res.reason, 'MASTER_REWARD_CONFLICT');

  // Successful start
  const validTeam = K.DRAFT.slice(0, 6).map(p => p.id);
  assert.equal(manager.start(validTeam).ok, true);
});

// Deterministic DOM Harness Helpers
function createDeterministicClock() {
  let nextTimerId = 1;
  const timers = new Map();
  const origSetTimeout = global.setTimeout;
  const origClearTimeout = global.clearTimeout;

  function setTimeoutMock(fn, ms) {
    const id = nextTimerId++;
    timers.set(id, { fn, ms });
    return id;
  }
  function clearTimeoutMock(id) {
    timers.delete(id);
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
    global.window.setTimeout = setTimeoutMock;
    global.window.clearTimeout = clearTimeoutMock;
  }

  function restore() {
    global.setTimeout = origSetTimeout;
    global.clearTimeout = origClearTimeout;
    global.window.setTimeout = origSetTimeout;
    global.window.clearTimeout = origClearTimeout;
  }

  return { timers, runAllTimers, install, restore };
}

function parseHTMLToElements(html) {
  const elements = [];

  function parseAttrs(attrStr) {
    const attrs = {};
    const attrRegex = /([a-zA-Z0-9_\-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^>\s]+)))?/g;
    let m;
    while ((m = attrRegex.exec(attrStr)) !== null) {
      const name = m[1].toLowerCase();
      const val = m[2] !== undefined ? m[2] : (m[3] !== undefined ? m[3] : (m[4] !== undefined ? m[4] : ''));
      attrs[name] = val;
    }
    return attrs;
  }

  const tagOpenRegex = /<([a-z0-9]+)\b([^>]*)>/gi;
  let m;
  while ((m = tagOpenRegex.exec(html)) !== null) {
    const tagName = m[1].toLowerCase();
    const attrStr = m[2] || '';
    const attrs = parseAttrs(attrStr);

    const el = {
      tagName,
      id: attrs.id || '',
      className: attrs.class || '',
      classList: {
        contains: (c) => (attrs.class || '').split(/\s+/).includes(c)
      },
      dataset: {},
      disabled: 'disabled' in attrs,
      checked: 'checked' in attrs,
      value: attrs.value || '',
      attrs,
      focus: () => {},
      setSelectionRange: () => {}
    };

    for (const [k, v] of Object.entries(attrs)) {
      if (k.startsWith('data-')) {
        const camel = k.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        el.dataset[camel] = v;
      }
    }

    elements.push(el);
  }

  return elements;
}

function createMockContainer() {
  let htmlContent = '';
  let parsedElements = [];

  return {
    get innerHTML() {
      return htmlContent;
    },
    set innerHTML(val) {
      htmlContent = String(val);
      parsedElements = parseHTMLToElements(htmlContent);
    },
    querySelector(sel) {
      if (!sel) return null;
      if (sel.startsWith('#')) {
        const id = sel.slice(1);
        return parsedElements.find(e => e.id === id) || null;
      }
      if (sel.startsWith('.')) {
        const cls = sel.slice(1);
        return parsedElements.find(e => e.classList.contains(cls)) || null;
      }
      if (sel.startsWith('[') && sel.endsWith(']')) {
        const attr = sel.slice(1, -1);
        return parsedElements.find(e => attr in e.attrs) || null;
      }
      return parsedElements.find(e => e.tagName === sel.toLowerCase()) || null;
    },
    querySelectorAll(sel) {
      if (!sel) return [];
      if (sel.startsWith('#')) {
        const id = sel.slice(1);
        return parsedElements.filter(e => e.id === id);
      }
      if (sel.startsWith('.')) {
        const cls = sel.slice(1);
        return parsedElements.filter(e => e.classList.contains(cls));
      }
      if (sel.startsWith('[') && sel.endsWith(']')) {
        const attr = sel.slice(1, -1);
        return parsedElements.filter(e => attr in e.attrs);
      }
      return parsedElements.filter(e => e.tagName === sel.toLowerCase());
    }
  };
}

test('23. Real CampaignView DOM testing: filters, pagination, multi-page selection, team bar removal, limit 6 and master conflict', () => {
  const clock = createDeterministicClock();
  clock.install();

  try {
    const manager = fresh();
    const container = createMockContainer();
    const coordinator = { start: async () => {} };

    const view = new CampaignView({ manager, coordinator, container });
    view.render();

    // 1. Initial render checks
    assert.ok(container.innerHTML.includes('Circuito dos Mestres'));
    const cardsPage1 = container.querySelectorAll('.campaign-mon');
    assert.equal(cardsPage1.length, 50, 'Page 1 must render 50 cards');

    // 2. Generation filter
    const genSelect = container.querySelector('#draftGen');
    assert.ok(genSelect);
    genSelect.value = '2';
    genSelect.onchange({ target: genSelect });
    assert.equal(view.draftGeneration, '2');
    const cardsGen2 = container.querySelectorAll('.campaign-mon');
    assert.equal(cardsGen2.length, 50, 'Gen 2 must have 50 cards');
    assert.equal(cardsGen2[0].dataset.id, '154');

    // 3. Type filter
    const typeSelect = container.querySelector('#draftType');
    assert.ok(typeSelect);
    typeSelect.value = 'fire';
    typeSelect.onchange({ target: typeSelect });
    const fireGen2Cards = container.querySelectorAll('.campaign-mon');
    assert.ok(fireGen2Cards.length > 0 && fireGen2Cards.length < 50);

    // 4. Recommended toggle
    genSelect.value = '';
    genSelect.onchange({ target: genSelect });
    typeSelect.value = '';
    typeSelect.onchange({ target: typeSelect });
    const recCheckbox = container.querySelector('#draftRecommended');
    recCheckbox.checked = true;
    recCheckbox.onchange({ target: recCheckbox });
    assert.equal(view.draftRecommended, true);
    const recCardsPage1 = container.querySelectorAll('.campaign-mon');
    assert.equal(recCardsPage1.length, 50);
    const nextBtn = container.querySelector('#draftNextPage');
    assert.ok(nextBtn);
    assert.equal(nextBtn.disabled, false);
    nextBtn.onclick();
    assert.equal(view.draftPage, 2);
    const recCardsPage2 = container.querySelectorAll('.campaign-mon');
    assert.equal(recCardsPage2.length, 4);
    const prevBtn = container.querySelector('#draftPrevPage');
    prevBtn.onclick();
    assert.equal(view.draftPage, 1);

    // 5. Select across pages & team persistence
    recCheckbox.checked = false;
    recCheckbox.onchange({ target: recCheckbox });
    assert.equal(view.draftPage, 1);
    const firstMon = container.querySelectorAll('.campaign-mon')[0];
    const firstId = Number(firstMon.dataset.id);
    firstMon.onclick();
    assert.deepEqual(view.draft, [firstId]);

    const p2Btn = container.querySelector('#draftNextPage');
    p2Btn.onclick();
    assert.equal(view.draftPage, 2);
    const page2Mon = container.querySelectorAll('.campaign-mon')[0];
    const p2Id = Number(page2Mon.dataset.id);
    page2Mon.onclick();
    assert.deepEqual(view.draft, [firstId, p2Id]);

    // Check removal via team bar
    const removeButtons = container.querySelectorAll('[data-remove]');
    assert.equal(removeButtons.length, 2);
    removeButtons[0].onclick();
    assert.deepEqual(view.draft, [p2Id]);

    // 6. Empty state
    const searchInput = container.querySelector('#draftSearch');
    searchInput.value = 'nonexistentpokemonquery123';
    searchInput.oninput({ target: searchInput });
    clock.runAllTimers();
    assert.ok(container.innerHTML.includes('draft-empty-state'));

    // Reset search
    searchInput.value = '';
    searchInput.oninput({ target: searchInput });
    clock.runAllTimers();

    // 7. Max 6 selection limit
    view.draft = [3, 6, 9, 25, 38, 59];
    view.render();
    assert.equal(view.draft.length, 6);
    const someOtherMon = container.querySelectorAll('.campaign-mon').find(m => !view.draft.includes(Number(m.dataset.id)));
    someOtherMon.onclick();
    assert.equal(view.draft.length, 6, 'Cannot select more than 6');

    // 8. Master reward conflict check in draft UI
    view.draft = [227, 398]; // 2 Steel master mons (Skarmory, Staraptor - wait Skarmory is 227)
    const steelMaster = K.MASTERS.find(m => m.challengeId === 'master-steel');
    view.draft = [steelMaster.team[0].id, steelMaster.team[1].id];
    view.render();
    // Try to click 3rd mon from steel master
    const thirdSteelId = steelMaster.team[2].id;
    // Search for 3rd steel mon
    view.draftQuery = String(thirdSteelId);
    view.render();
    const thirdMonBtn = container.querySelectorAll('.campaign-mon').find(m => Number(m.dataset.id) === thirdSteelId);
    if (thirdMonBtn) {
      thirdMonBtn.onclick();
      const draftMsg = container.querySelector('#draftMessage');
      assert.ok(draftMsg.textContent.includes('no máximo 2 Pokémon da equipe de um mesmo Mestre'));
    }
  } finally {
    clock.restore();
  }
});

test('24. Search debounce, cancellation, and campaign start race condition protection', () => {
  const clock = createDeterministicClock();
  clock.install();

  try {
    const manager = fresh();
    const container = createMockContainer();
    const coordinator = { start: async () => {} };

    const view = new CampaignView({ manager, coordinator, container });
    view.render();

    // 1. Search debounce delays render until timer expires
    const searchInput = container.querySelector('#draftSearch');
    searchInput.value = 'baxcalibur';
    searchInput.oninput({ target: searchInput });
    assert.ok(view.draftDebounceTimer, 'Debounce timer must be active');
    assert.equal(view.draftQuery, '', 'Query must not be applied before debounce expires');

    clock.runAllTimers();
    assert.equal(view.draftDebounceTimer, null);
    assert.equal(view.draftQuery, 'baxcalibur');
    const searchResults = container.querySelectorAll('.campaign-mon');
    assert.equal(searchResults.length, 1);
    assert.equal(searchResults[0].dataset.id, '998');

    // 2. Clear debounce on filter change
    searchInput.value = 'char';
    searchInput.oninput({ target: searchInput });
    assert.ok(view.draftDebounceTimer);
    const genSelect = container.querySelector('#draftGen');
    genSelect.value = '1';
    genSelect.onchange({ target: genSelect });
    assert.equal(view.draftDebounceTimer, null, 'Debounce must be cleared on gen change');

    // 3. Race condition: player types search and confirms team BEFORE debounce timer expires
    view.draft = [3, 6, 9, 25, 38, 59];
    view.render();
    const confirmBtn = container.querySelector('#campaignConfirmDraft');
    assert.equal(confirmBtn.disabled, false);

    // Type search (starts pending timer)
    const searchInput2 = container.querySelector('#draftSearch');
    searchInput2.value = 'pikachu';
    searchInput2.oninput({ target: searchInput2 });
    assert.ok(view.draftDebounceTimer);

    // Confirm team while timer is pending
    confirmBtn.onclick();
    assert.equal(manager.isStarted(), true, 'Campaign must have started');
    assert.ok(!container.innerHTML.includes('draft-tools'), 'Must transition away from draft');

    // Obsolete timer fires after campaign started
    if (clock.timers.size > 0) {
      clock.runAllTimers();
    }
    // Draft must NEVER overwrite active campaign
    assert.equal(manager.isStarted(), true);
    assert.ok(!container.innerHTML.includes('draft-tools'), 'Active campaign map must NOT be replaced by draft');

    // 4. deactivate() cancels any timer
    view.draftDebounceTimer = 999;
    view.deactivate();
    assert.equal(view.draftDebounceTimer, null);
  } finally {
    clock.restore();
  }
});
