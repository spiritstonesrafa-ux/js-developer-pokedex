const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { QUICK_BATTLE_ROSTER, QUICK_BATTLE_ROSTER_IDS } = require('../../assets/js/battle-session/quick-battle-roster.js');
const { BattleRandomSource } = require('../../assets/js/battle-session/battle-random-source.js');
const { QuickBattleRotationStore, ROTATION_VERSION, MAX_RECENT_TEAMS } = require('../../assets/js/battle-session/quick-battle-rotation-store.js');
const { QuickBattleOpponentSelector, canonicalTeam } = require('../../assets/js/battle-session/quick-battle-opponent-selector.js');
const { BattleOpponentFactory } = require('../../assets/js/battle-session/battle-opponent-factory.js');

function createSelector(seed = 123456789, storage = null) {
  let value = seed >>> 0;
  const rng = () => ((value = (value * 1664525 + 1013904223) >>> 0) / 4294967296);
  const store = new QuickBattleRotationStore({ storage });
  return { selector: new QuickBattleOpponentSelector({ randomSource: new BattleRandomSource({ rng }), store }), store };
}

function simulate(count) {
  const { selector } = createSelector();
  const teams = [];
  for (let index = 0; index < count; index++) {
    const proposal = selector.select({ playerTeamIds: [3, 6, 9] });
    teams.push(proposal.ids);
    selector.commit(proposal);
  }
  return teams;
}

describe('PBA-014D — QUICK BATTLE VARIETY', () => {
  it('VAR01–VAR06 — curated roster has 72 species, 9 generations and all 18 types', () => {
    assert.equal(QUICK_BATTLE_ROSTER_IDS.length, 72);
    assert.equal(new Set(QUICK_BATTLE_ROSTER_IDS).size, 72);
    assert.equal(new Set(QUICK_BATTLE_ROSTER.map(p => p.generation)).size, 9);
    assert.equal(new Set(QUICK_BATTLE_ROSTER.flatMap(p => p.types)).size, 18);
    for (let generation = 1; generation <= 9; generation++) {
      assert.equal(QUICK_BATTLE_ROSTER.filter(p => p.generation === generation).length, 8);
    }
  });

  it('VAR07–VAR10 — roster uses valid positive IDs and excludes unsupported species', () => {
    const forbidden = new Set([132, 201, 202, 235]);
    QUICK_BATTLE_ROSTER.forEach(entry => {
      assert.ok(Number.isInteger(entry.id) && entry.id > 0);
      assert.ok(entry.name && entry.types.length >= 1);
      assert.equal(forbidden.has(entry.id), false);
    });
  });

  it('VAR11–VAR14 — selection excludes player species, stays unique and uses injected RNG', () => {
    const { selector } = createSelector(42);
    const proposal = selector.select({ playerTeamIds: [3, 6, 9] });
    assert.equal(proposal.ids.length, 3);
    assert.equal(new Set(proposal.ids).size, 3);
    assert.equal(proposal.ids.some(id => [3, 6, 9].includes(id)), false);
  });

  it('VAR15–VAR18 — persistence is versioned, bounded and recovers from corruption', () => {
    const data = new Map([['battle.quick.opponentRotation', '{bad json']]);
    const storage = { getItem: key => data.get(key), setItem: (key, val) => data.set(key, val), removeItem: key => data.delete(key) };
    const store = new QuickBattleRotationStore({ storage });
    assert.equal(store.load().version, ROTATION_VERSION);
    assert.deepEqual(store.load().seenInCycle, []);
    store.save({ version: ROTATION_VERSION, seenInCycle: [...QUICK_BATTLE_ROSTER_IDS, 9999], recentTeams: Array.from({ length: 15 }, (_, i) => [i + 1, i + 2, i + 3]) });
    assert.equal(store.load().recentTeams.length, MAX_RECENT_TEAMS);
    assert.ok(store.load().seenInCycle.length <= 72);
  });

  it('VAR19–VAR21 — recent-five anti-repeat and cycle reset remain safe', () => {
    const teams = simulate(30);
    teams.forEach((team, index) => {
      const recent = teams.slice(Math.max(0, index - 5), index).flat();
      assert.equal(team.some(id => recent.includes(id)), false);
    });
  });

  it('VAR20/VAR23 — exact opponent trio never repeats in 30 battles', () => {
    const teams = simulate(30);
    assert.equal(new Set(teams.map(canonicalTeam)).size, teams.length);
  });

  it('VAR22 — 30 battles expose at least 60 unique opponent species', () => {
    assert.ok(new Set(simulate(30).flat()).size >= 60);
  });

  it('VAR24 — 100 battles cover at least 95% of the full roster', () => {
    assert.ok(new Set(simulate(100).flat()).size / QUICK_BATTLE_ROSTER_IDS.length >= 0.95);
  });

  it('hydration failures do not commit rotation state', async () => {
    const { selector, store } = createSelector();
    const factory = new BattleOpponentFactory({
      selector,
      randomSource: selector.randomSource,
      hydrator: { hydrateTeam: async () => { throw new Error('network'); } }
    });
    await assert.rejects(() => factory.createOpponentTeam(null, { playerTeamIds: [3, 6, 9] }));
    assert.deepEqual(store.load().seenInCycle, []);
    assert.deepEqual(store.load().recentTeams, []);
  });
});