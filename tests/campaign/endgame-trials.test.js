const test = require('node:test');
const assert = require('node:assert/strict');
const mem = new Map();
global.localStorage = {
  getItem: key => mem.get(key) || null,
  setItem: (key, value) => mem.set(key, String(value)),
  removeItem: key => mem.delete(key)
};

const C = require('../../assets/js/campaign/campaign-constants');
const K = require('../../assets/js/campaign/campaign-catalog');
const S = require('../../assets/js/campaign/campaign-store');
const { CampaignManager } = require('../../assets/js/campaign/campaign-manager');
const { BattleTeamHydrator } = require('../../assets/js/battle-session/battle-team-hydrator');
const E = require('../../assets/js/battle/battle-engine');

function fresh(clear = true) {
  if (clear) mem.clear();
  return new CampaignManager(S);
}

function start(manager) {
  assert.equal(manager.start(K.DRAFT.slice(0, 6).map(p => p.id)).ok, true);
}

function unlock18(manager) {
  start(manager);
  for (const master of K.MASTERS) {
    assert.equal(manager.recordBattle({
      battleId: `master-${master.challengeId}`,
      kind: 'MASTER',
      id: master.challengeId,
      winner: 'player'
    }).processed, true);
    assert.equal(manager.claimReward(manager.getRewardCandidates().find(candidate => candidate.selectable).id).ok, true);
  }
  assert.equal(manager.getBadgeCount(), 18);
  assert.equal(manager.getRosterIds().length, 24);
}

function trial(manager, kind, battleId, opponentId = null) {
  const team = manager.getRosterIds().slice(0, 3);
  const trialDef = {
    LEGENDARY_TRIAL: K.LEGENDARY_TRIAL_TEAM,
    MYTHICAL_TRIAL: K.MYTHICAL_TRIAL_TEAM,
    TITANS_TRIAL: K.TITANS_TRIAL_TEAM,
    CELESTIAL_TRIAL: K.CELESTIAL_TRIAL_TEAM
  }[kind];
  const chosenOpponentId = opponentId || trialDef.find(p => !manager.getRosterIds().includes(p.id))?.id || trialDef[0].id;
  const config = manager.getBattleConfig(kind, chosenOpponentId, team);
  assert.equal(config.enemyTeamIds.length, 1);
  assert.equal(config.enemyTeamIds[0], chosenOpponentId);
  assert.equal(config.metadata.kind, kind);
  assert.equal(config.metadata.battleFormat, 'TRIAL_3X1');
  assert.deepEqual(config.modifiers, {});
  return manager.recordBattle({ battleId, kind, id: chosenOpponentId, opponentPokemonId: chosenOpponentId, winner: 'player' });
}

function eliteTrial(manager, kind, battleId, opponentId = null) {
  return trial(manager, kind, battleId, opponentId);
}

test('PBA-015E canonical trial teams are battle-compatible and exclude the Super team', () => {
  assert.deepEqual(K.LEGENDARY_TRIAL_TEAM.map(p => p.id), [145, 245, 381]);
  assert.deepEqual(K.MYTHICAL_TRIAL_TEAM.map(p => p.id), [151, 385, 494]);
  assert.deepEqual(K.TITANS_TRIAL_TEAM.map(p => p.id), [1007, 383, 717]);
  assert.deepEqual(K.CELESTIAL_TRIAL_TEAM.map(p => p.id), [889, 791, 487]);

  const superIds = new Set(K.SUPER_TEAM.map(p => p.id));
  const allTrials = [
    ...K.LEGENDARY_TRIAL_TEAM,
    ...K.MYTHICAL_TRIAL_TEAM,
    ...K.TITANS_TRIAL_TEAM,
    ...K.CELESTIAL_TRIAL_TEAM
  ];

  for (const pokemon of allTrials) {
    assert.ok(!superIds.has(pokemon.id), `Trial mon ${pokemon.id} must not overlap with Super team`);
    assert.ok(pokemon.name);
    assert.ok(pokemon.types.length);
    assert.ok(pokemon.bst >= 580);
    assert.ok(K.byId(pokemon.id));
  }
});

test('3x1 Trial Battle — Valid and invalid opponent selection in getBattleConfig and recordBattle', () => {
  const manager = fresh();
  unlock18(manager);
  const team = manager.getRosterIds().slice(0, 3);

  // Missing opponent throws
  assert.throws(() => manager.getBattleConfig('LEGENDARY_TRIAL', null, team), /Escolha um adversário válido/);
  assert.throws(() => manager.getBattleConfig('LEGENDARY_TRIAL', undefined, team), /Escolha um adversário válido/);

  // Foreign opponent (Mewtwo 150 in Legendary Trial) throws
  assert.throws(() => manager.getBattleConfig('LEGENDARY_TRIAL', 150, team), /Escolha um adversário válido/);
  assert.throws(() => manager.getBattleConfig('MYTHICAL_TRIAL', 999, team), /Escolha um adversário válido/);

  // Valid candidates for each of the 4 trials
  for (const [kind, teamDef] of [
    ['LEGENDARY_TRIAL', K.LEGENDARY_TRIAL_TEAM],
    ['MYTHICAL_TRIAL', K.MYTHICAL_TRIAL_TEAM],
    ['TITANS_TRIAL', K.TITANS_TRIAL_TEAM],
    ['CELESTIAL_TRIAL', K.CELESTIAL_TRIAL_TEAM]
  ]) {
    for (const cand of teamDef) {
      const config = manager.getBattleConfig(kind, cand.id, team);
      assert.equal(config.enemyTeamIds.length, 1);
      assert.equal(config.enemyTeamIds[0], cand.id);
      assert.equal(config.metadata.battleFormat, 'TRIAL_3X1');
      assert.equal(config.metadata.opponentPokemonId, cand.id);
      assert.equal(config.playerTeamIds.length, 3);
    }
  }

  // Player team invalid size throws
  assert.throws(() => manager.getBattleConfig('LEGENDARY_TRIAL', 145, [team[0]]), /Escolha exatamente três Pokémon/);
  assert.throws(() => manager.getBattleConfig('LEGENDARY_TRIAL', 145, [team[0], team[1]]), /Escolha exatamente três Pokémon/);
  assert.throws(() => manager.getBattleConfig('LEGENDARY_TRIAL', 145, [team[0], team[0], team[1]]), /Escolha exatamente três Pokémon/);

  // Invalid opponent in recordBattle throws
  assert.throws(() => manager.recordBattle({
    battleId: 'invalid-opp',
    kind: 'LEGENDARY_TRIAL',
    opponentPokemonId: 999,
    winner: 'player'
  }), /Adversário inválido/);
});

test('3x1 Trial Battle — rejected results leave progress intact and the battle ID reusable', () => {
  const manager = fresh();
  unlock18(manager);

  for (const [kind, key, candidate] of [
    ['LEGENDARY_TRIAL', 'legendary', 145],
    ['MYTHICAL_TRIAL', 'mythical', 151],
    ['TITANS_TRIAL', 'titans', 1007],
    ['CELESTIAL_TRIAL', 'celestial', 889]
  ]) {
    const battleId = `rejected-${kind}`;
    const before = manager.getState();
    const savedBefore = mem.get(C.STORAGE_KEY);
    for (const winner of ['player', 'enemy']) {
      assert.throws(() => manager.recordBattle({
        battleId, kind, opponentPokemonId: 999, winner
      }), /Adversário inválido/);
      assert.deepEqual(manager.getState(), before, `${kind}: resultado inválido não pode alterar o estado em memória`);
      assert.equal(mem.get(C.STORAGE_KEY), savedBefore, `${kind}: resultado inválido não pode alterar o save`);
      const reloaded = fresh(false).getState();
      assert.equal(reloaded.endgameTrials[key].attempts, before.endgameTrials[key].attempts);
      assert.equal(reloaded.processedBattleIds.includes(battleId), false);
    }

    const retry = manager.recordBattle({ battleId, kind, opponentPokemonId: candidate, winner: 'enemy' });
    assert.equal(retry.processed, true, `${kind}: o ID rejeitado deve continuar disponível`);
    assert.equal(manager.getState().processedBattleIds.includes(battleId), true);
    assert.equal(manager.getState().endgameTrials[key].attempts, 1);
    assert.equal(manager.getState().pendingReward, null);
  }
});

test('3x1 Trial Battle — preparation copy matches the post-victory reward confirmation', () => {
  const fs = require('node:fs'), path = require('node:path');
  const source = fs.readFileSync(path.join(__dirname, '../../assets/js/campaign/campaign-view.js'), 'utf8');
  assert.match(source, /confirme o resgate após a vitória/);
  assert.match(source, /Confirmar e Resgatar/);
  assert.doesNotMatch(source, /será recrutado imediatamente/);
});

test('3x1 Trial Battle — Engine accepts 3x1 format, defeats single opponent immediately without replacement, and handles player loss', () => {
  const mon = (id, hp = 80, speed = 70) => ({
    id,
    name: 'mon-' + id,
    types: ['normal'],
    stats: { hp, attack: 70, defense: 70, specialAttack: 70, specialDefense: 70, speed },
    moves: [{ id: 1, name: 'tackle', type: 'normal', power: 50, accuracy: 100, damageClass: 'physical', pp: 35 }]
  });

  // Regular createTeamBattle requires 3x3 and rejects 3x1
  assert.throws(() => E.createTeamBattle([1, 2, 3].map(id => mon(id)), [mon(145)]));

  // TRIAL_3X1 requires exactly 3 player Pokémon and 1 enemy Pokémon
  assert.throws(() => E.createTeamBattle([mon(1), mon(2)], [mon(145)], { battleFormat: 'TRIAL_3X1' }));
  assert.throws(() => E.createTeamBattle([mon(1), mon(2), mon(3)], [mon(145), mon(245)], { battleFormat: 'TRIAL_3X1' }));

  // Valid 3x1 initialization
  const state = E.createTeamBattle([1, 2, 3].map(id => mon(id)), [mon(145)], { battleFormat: 'TRIAL_3X1' });
  assert.equal(state.player.team.length, 3);
  assert.equal(state.enemy.team.length, 1);
  assert.equal(state.status, 'IN_PROGRESS');

  // Fast player defeats single enemy in one turn
  const pLead = mon(1, 100, 100); // fast player
  pLead.moves[0].power = 500; // instant knockout
  const eSolo = mon(145, 50, 10); // slow enemy
  const btl = E.createTeamBattle([pLead, mon(2), mon(3)], [eSolo], { battleFormat: 'TRIAL_3X1' });

  const turnResult = E.resolveTurn(btl, {
    player: { moveId: 1, damageRoll: 100 },
    enemy: { moveId: 1, damageRoll: 100 }
  });

  // Enemy is defeated immediately: winner is player, status PLAYER_WIN
  assert.equal(turnResult.state.status, 'PLAYER_WIN');
  assert.equal(turnResult.state.winner, 'player');
  assert.equal(turnResult.state.enemy.team[0].currentHp, 0);

  // No enemy REPLACEMENT_REQUIRED event is emitted
  const replEvents = turnResult.events.filter(e => e.type === 'REPLACEMENT_REQUIRED');
  assert.equal(replEvents.length, 0);
  assert.ok(turnResult.events.some(e => e.type === 'TEAM_DEFEATED' && e.side === 'enemy'));
  assert.ok(turnResult.events.some(e => e.type === 'BATTLE_ENDED' && e.winner === 'player'));

  // Player loss: enemy with high power defeats player's 3 Pokémon
  const manager = fresh();
  unlock18(manager);
  const defeatResult = manager.recordBattle({
    battleId: 'legendary-defeat',
    kind: 'LEGENDARY_TRIAL',
    opponentPokemonId: 145,
    winner: 'enemy'
  });
  assert.equal(defeatResult.processed, true);
  assert.equal(defeatResult.pendingReward, null);
  assert.equal(manager.getState().endgameTrials.legendary.completed, false);
  assert.equal(manager.getState().endgameTrials.legendary.attempts, 1);
  assert.equal(manager.getState().pendingReward, null);

  // Player can retry with same or different opponent after loss
  const retryResult = manager.recordBattle({
    battleId: 'legendary-retry-win',
    kind: 'LEGENDARY_TRIAL',
    opponentPokemonId: 245,
    winner: 'player'
  });
  assert.equal(retryResult.processed, true);
  assert.equal(manager.getState().endgameTrials.legendary.completed, true);
  assert.deepEqual(manager.getState().pendingReward.candidates, [245]);
});

test('PBA-015E Legendary trial 3x1 grants exactly the chosen opponent, prevents switching, and permits replay without new reward', () => {
  const manager = fresh();
  unlock18(manager);
  assert.equal(manager.canChallenge('LEGENDARY_TRIAL'), true);

  // Challenge and defeat Suicune (245)
  assert.equal(trial(manager, 'LEGENDARY_TRIAL', 'legendary-suicune-win', 245).processed, true);
  assert.equal(manager.getState().endgameTrials.legendary.completed, true);
  assert.equal(manager.getState().pendingReward.kind, 'LEGENDARY_TRIAL');
  assert.deepEqual(manager.getState().pendingReward.candidates, [245]);

  // Candidates only offers Suicune (245)
  const candidates = manager.getRewardCandidates();
  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].id, 245);
  assert.equal(candidates[0].selectable, true);

  // Attempt to claim Zapdos (145) or Latios (381) fails
  assert.equal(manager.claimReward(145).ok, false);
  assert.equal(manager.claimReward(381).ok, false);

  // Reload keeps exactly Suicune (245) without allowing switch
  const reloaded = fresh(false);
  assert.equal(reloaded.getState().endgameTrials.legendary.completed, true);
  assert.deepEqual(reloaded.getState().pendingReward.candidates, [245]);
  assert.equal(reloaded.getRewardCandidates().length, 1);
  assert.equal(reloaded.getRewardCandidates()[0].id, 245);

  // Claim Suicune
  assert.equal(reloaded.claimReward(245).ok, true);
  assert.equal(reloaded.getState().endgameTrials.legendary.rewardClaimed, true);
  assert.equal(reloaded.getState().endgameTrials.legendary.rewardPokemonId, 245);
  assert.ok(reloaded.getRosterIds().includes(245));
  assert.equal(reloaded.getRosterIds().length, 25);

  // Replay without second reward
  const claimedReload = fresh(false);
  assert.equal(claimedReload.canChallenge('LEGENDARY_TRIAL'), true);
  assert.equal(trial(claimedReload, 'LEGENDARY_TRIAL', 'legendary-replay', 145).pendingReward, null);
  assert.equal(claimedReload.claimReward(145).ok, false);
  assert.equal(claimedReload.getRosterIds().length, 25);
});

test('PBA-015E Mythical trial 3x1 grants exactly the chosen opponent, prevents switching, and permits replay', () => {
  const manager = fresh();
  unlock18(manager);
  assert.equal(manager.canChallenge('MYTHICAL_TRIAL'), true);

  // Challenge and defeat Victini (494)
  assert.equal(trial(manager, 'MYTHICAL_TRIAL', 'mythical-victini-win', 494).processed, true);
  assert.deepEqual(manager.getState().pendingReward.candidates, [494]);

  const reloaded = fresh(false);
  const candidates = reloaded.getRewardCandidates();
  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].id, 494);

  // Claim Victini
  assert.equal(reloaded.claimReward(494).ok, true);
  assert.equal(reloaded.getState().endgameTrials.mythical.rewardClaimed, true);
  assert.equal(reloaded.getRosterIds().length, 25);

  // Replay
  const claimedReload = fresh(false);
  assert.equal(trial(claimedReload, 'MYTHICAL_TRIAL', 'mythical-replay', 151).pendingReward, null);
  assert.equal(claimedReload.claimReward(151).ok, false);
  assert.equal(new Set(claimedReload.getRosterIds()).size, claimedReload.getRosterIds().length);
});

test('PBA-015E trial rewards support final rosters of 25, 26 and 27 without relocking Super', () => {
  const manager = fresh();
  unlock18(manager);

  const first = trial(manager, 'LEGENDARY_TRIAL', 'legendary-roster', 145);
  assert.equal(first.processed, true);
  assert.equal(manager.claimReward(145).ok, true);
  assert.equal(manager.getRosterIds().length, 25);
  assert.equal(manager.canChallenge('SUPER'), true);

  const second = trial(manager, 'MYTHICAL_TRIAL', 'mythical-roster', 151);
  assert.equal(second.processed, true);
  assert.equal(manager.claimReward(151).ok, true);
  assert.equal(manager.getRosterIds().length, 26);
  assert.equal(manager.canChallenge('SUPER'), true);

  manager.recordBattle({ battleId: 'super-after-trials', kind: 'SUPER', winner: 'player' });
  assert.equal(manager.claimReward(manager.getRewardCandidates().find(candidate => candidate.selectable).id).ok, true);
  assert.equal(manager.getRosterIds().length, 27);
  assert.equal(new Set(manager.getRosterIds()).size, 27);
});

test('PBA-015E Super unlock is available at 24, 25 and 26, never at 23, with all badges', () => {
  const manager = fresh();
  unlock18(manager);
  for (const [size, expected] of [[23, false], [24, true], [25, true], [26, true]]) {
    manager.getRosterIds = () => Array.from({ length: size }, (_, index) => index + 1);
    assert.equal(manager.canChallenge('SUPER'), expected);
  }
});

test('PBA-015E legacy save migration preserves pending 3-choice reward and isolates trial state', () => {
  // Legacy save where a trial victory generated 3 candidate choices
  const rawLegacyPending = {
    version: C.VERSION,
    status: 'ACTIVE',
    startedAt: '2026-01-01T00:00:00.000Z',
    startingRosterIds: K.DRAFT.slice(0, 6).map(p => p.id),
    challenges: { 'master-fire': { attempts: 2, badgeEarned: true, rewardPokemonId: K.MASTERS.find(m => m.challengeId === 'master-fire').team[0].id } },
    superTrainer: { attempts: 0, defeated: false },
    shadowTrainer: { revealed: false },
    pendingReward: { kind: 'LEGENDARY_TRIAL', challengeId: 'legendary', candidates: [145, 245, 381] },
    endgameTrials: {
      legendary: { completed: true, rewardClaimed: false, rewardPokemonId: null, attempts: 1 },
      mythical: { completed: false, rewardClaimed: false, rewardPokemonId: null, attempts: 0 },
      titans: { completed: false, rewardClaimed: false, rewardPokemonId: null, attempts: 0 },
      celestial: { completed: false, rewardClaimed: false, rewardPokemonId: null, attempts: 0 }
    },
    processedBattleIds: []
  };

  const migrated = S.sanitize(rawLegacyPending);
  // Preserves all 3 candidates for legacy pending reward!
  assert.deepEqual(migrated.pendingReward.candidates, [145, 245, 381]);

  mem.clear();
  mem.set(C.STORAGE_KEY, JSON.stringify(rawLegacyPending));
  const manager = fresh(false);
  const candidates = manager.getRewardCandidates();
  assert.equal(candidates.length, 3);
  assert.ok(candidates.some(c => c.id === 145));
  assert.ok(candidates.some(c => c.id === 245));
  assert.ok(candidates.some(c => c.id === 381));
  // Player can choose any of the 3 in legacy flow
  assert.equal(manager.claimReward(381).ok, true);
  assert.equal(manager.getState().endgameTrials.legendary.rewardPokemonId, 381);
});

test('PBA-015E retains existing Super, false-ending, Shadow and aura contracts', () => {
  const manager = fresh();
  unlock18(manager);
  const config = manager.getBattleConfig('SUPER', null, manager.getRosterIds().slice(0, 3));
  assert.deepEqual(config.enemyTeamIds, K.SUPER_TEAM.map(p => p.id));
  assert.deepEqual(config.modifiers, {});
  manager.recordBattle({ battleId: 'super-contract', kind: 'SUPER', winner: 'player' });
  assert.equal(manager.getState().status, 'SUPER_REWARD_PENDING');
  assert.equal(manager.acknowledgeSuperVictory(), true);
  assert.equal(manager.claimReward(manager.getRewardCandidates().find(candidate => candidate.selectable).id).ok, true);
  assert.equal(manager.getState().shadowTrainer.revealed, true);
  assert.equal(manager.acknowledgeShadowReveal(), true);
  const shadow = manager.getBattleConfig('SHADOW', null, manager.getRosterIds().slice(0, 3));
  assert.deepEqual(shadow.enemyTeamIds, K.SUPER_TEAM.map(p => p.id));
  assert.deepEqual(shadow.modifiers, { SHADOW_AURA: true });
});

test('PBA-015E trial Pokémon hydrate through canonical offline battle fallbacks', async () => {
  const hydrator = new BattleTeamHydrator({ api: { getPokemonDetail: async () => { throw new Error('offline'); } } });
  const team = await hydrator.hydrateTeam([...K.LEGENDARY_TRIAL_TEAM, ...K.MYTHICAL_TRIAL_TEAM].map(p => p.id));
  assert.deepEqual(team.map(p => p.id), [145, 245, 381, 151, 385, 494]);
  for (const combatant of team) {
    assert.ok(combatant.moves.length >= 1);
    assert.ok(combatant.baseStats.hp > 0);
    assert.ok(combatant.types.length > 0);
  }
});

test('PBA-015F boss presentation keeps canonical previews and player selector contracts', () => {
  const fs = require('node:fs'), path = require('node:path');
  const source = fs.readFileSync(path.join(__dirname, '../../assets/js/campaign/campaign-view.js'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '../../assets/css/campaign.css'), 'utf8');
  assert.match(source, /campaign-preparation--super/);
  assert.match(source, /campaign-preparation--trial/);
  assert.match(source, /opponent-team-preview/);
  assert.match(source, /C\.SUPER_TEAM/);
  assert.match(source, /C\.LEGENDARY_TRIAL_TEAM/);
  assert.match(source, /C\.MYTHICAL_TRIAL_TEAM/);
  assert.match(source, /this\.pick\.length < 3/);
  assert.match(source, /getSpecialTrainerVisual\('SUPER'\)/);
  assert.match(css, /\.endgame-super__portrait/);
  assert.match(css, /\.campaign-preparation--super/);
  assert.match(css, /@media\(max-width:600px\)/);
});

test('PBA-015G Titans and Celestial are canonical, independent at 18 badges and exclude Super rewards', () => {
  assert.deepEqual(K.TITANS_TRIAL_TEAM.map(p => p.id), [1007, 383, 717]);
  assert.deepEqual(K.CELESTIAL_TRIAL_TEAM.map(p => p.id), [889, 791, 487]);
  const superIds = new Set(K.SUPER_TEAM.map(p => p.id));
  for (const pokemon of [...K.TITANS_TRIAL_TEAM, ...K.CELESTIAL_TRIAL_TEAM]) {
    assert.ok(!superIds.has(pokemon.id));
    assert.ok(pokemon.legendary);
    assert.ok(pokemon.sprite);
    assert.ok(pokemon.bst >= 670);
    assert.ok(K.byId(pokemon.id));
  }
  const manager = fresh();
  unlock18(manager);
  assert.equal(manager.canChallenge('TITANS_TRIAL'), true);
  assert.equal(manager.canChallenge('CELESTIAL_TRIAL'), true);
});

test('PBA-015G Titans 3x1 pending reload, one reward, replay and duplicate rejection', () => {
  const manager = fresh();
  unlock18(manager);
  // Defeat Koraidon (1007)
  assert.equal(eliteTrial(manager, 'TITANS_TRIAL', 'titans-win', 1007).processed, true);
  assert.equal(manager.getState().pendingReward.kind, 'TITANS_TRIAL');
  assert.deepEqual(manager.getState().pendingReward.candidates, [1007]);

  const reloaded = fresh(false);
  assert.equal(reloaded.getState().pendingReward.kind, 'TITANS_TRIAL');
  assert.deepEqual(reloaded.getState().pendingReward.candidates, [1007]);
  const reward = reloaded.getRewardCandidates().find(x => x.selectable);
  assert.equal(reward.id, 1007);
  assert.equal(reloaded.claimReward(reward.id).ok, true);
  assert.equal(reloaded.getRosterIds().length, 25);

  // Cannot challenge Koraidon again before rewardClaimed or generate duplicate
  assert.equal(eliteTrial(reloaded, 'TITANS_TRIAL', 'titans-replay', 383).pendingReward, null);
  assert.equal(reloaded.claimReward(383).ok, false);
  assert.equal(new Set(reloaded.getRosterIds()).size, reloaded.getRosterIds().length);
});

test('PBA-015G Celestial 3x1 pending reload, one reward and replay without a second reward', () => {
  const manager = fresh();
  unlock18(manager);
  // Defeat Giratina (487)
  assert.equal(eliteTrial(manager, 'CELESTIAL_TRIAL', 'celestial-win', 487).processed, true);
  assert.deepEqual(manager.getState().pendingReward.candidates, [487]);

  const reloaded = fresh(false);
  assert.equal(reloaded.getState().pendingReward.kind, 'CELESTIAL_TRIAL');
  const reward = reloaded.getRewardCandidates().find(x => x.selectable);
  assert.equal(reward.id, 487);
  assert.equal(reloaded.claimReward(reward.id).ok, true);
  assert.equal(reloaded.getState().endgameTrials.celestial.rewardClaimed, true);
  assert.equal(eliteTrial(reloaded, 'CELESTIAL_TRIAL', 'celestial-replay', 791).pendingReward, null);
  assert.equal(new Set(reloaded.getRosterIds()).size, reloaded.getRosterIds().length);
});

test('PBA-015G roster expands through 27, 28 and 29 while Super remains available', () => {
  const manager = fresh();
  unlock18(manager);
  for (const [kind, battleId, oppId] of [
    ['LEGENDARY_TRIAL', 'g-legendary', 145],
    ['MYTHICAL_TRIAL', 'g-mythical', 151],
    ['TITANS_TRIAL', 'g-titans', 1007],
    ['CELESTIAL_TRIAL', 'g-celestial', 889]
  ]) {
    eliteTrial(manager, kind, battleId, oppId);
    assert.equal(manager.claimReward(manager.getRewardCandidates().find(x => x.selectable).id).ok, true);
  }
  assert.equal(manager.getRosterIds().length, 28);
  assert.equal(manager.canChallenge('SUPER'), true);
  manager.recordBattle({ battleId: 'g-super', kind: 'SUPER', winner: 'player' });
  assert.equal(manager.claimReward(manager.getRewardCandidates().find(x => x.selectable).id).ok, true);
  assert.equal(manager.getRosterIds().length, 29);
  assert.equal(new Set(manager.getRosterIds()).size, 29);
});

test('PBA-015G Super stays unlocked at roster 27 and 28, legacy PBA-015F migrates, reset isolates new trials', () => {
  const manager = fresh();
  unlock18(manager);
  for (const size of [27, 28]) {
    manager.getRosterIds = () => Array.from({ length: size }, (_, i) => i + 1);
    assert.equal(manager.canChallenge('SUPER'), true);
  }
  const raw = {
    version: C.VERSION,
    status: 'ACTIVE',
    startedAt: '2026-01-01T00:00:00.000Z',
    startingRosterIds: K.DRAFT.slice(0, 6).map(p => p.id),
    challenges: {},
    superTrainer: {},
    shadowTrainer: {},
    endgameTrials: {
      legendary: { completed: true, rewardClaimed: true, rewardPokemonId: 145 },
      mythical: { completed: true, rewardClaimed: true, rewardPokemonId: 151 }
    },
    processedBattleIds: []
  };
  const migrated = S.sanitize(raw);
  assert.equal(migrated.endgameTrials.titans.completed, false);
  assert.equal(migrated.endgameTrials.celestial.rewardPokemonId, null);
  mem.clear();
  mem.set(C.STORAGE_KEY, JSON.stringify(migrated));
  mem.set('quick.rotation', 'keep');
  new CampaignManager(S).reset();
  assert.equal(S.load().endgameTrials.titans.completed, false);
  assert.equal(mem.get('quick.rotation'), 'keep');
});

test('PBA-015G six elite Pokémon hydrate through canonical offline fallbacks and presentation references all four trials', async () => {
  const hydrator = new BattleTeamHydrator({ api: { getPokemonDetail: async () => { throw new Error('offline'); } } });
  const team = await hydrator.hydrateTeam([...K.TITANS_TRIAL_TEAM, ...K.CELESTIAL_TRIAL_TEAM].map(p => p.id));
  assert.deepEqual(team.map(p => p.id), [1007, 383, 717, 889, 791, 487]);
  for (const member of team) {
    assert.ok(member.moves.length >= 1);
    assert.ok(member.baseStats.hp > 0);
  }
  const fs = require('node:fs'), path = require('node:path');
  const source = fs.readFileSync(path.join(__dirname, '../../assets/js/campaign/campaign-view.js'), 'utf8');
  assert.match(source, /TITANS_TRIAL/);
  assert.match(source, /CELESTIAL_TRIAL/);
  assert.match(source, /Prova dos Titãs/);
  assert.match(source, /Prova Celestial/);
});

test('PBA-015H Shadow presentation preserves reveal, makes Shadow dominant and retains battle aura contract', () => {
  const fs = require('node:fs'), path = require('node:path');
  const view = fs.readFileSync(path.join(__dirname, '../../assets/js/campaign/campaign-view.js'), 'utf8');
  const campaignCss = fs.readFileSync(path.join(__dirname, '../../assets/css/campaign.css'), 'utf8');
  const battleCss = fs.readFileSync(path.join(__dirname, '../../assets/css/battle-arena.css'), 'utf8');
  assert.match(view, /shadow-spotlight/);
  assert.match(view, /SHADOW SUPER TRAINER/);
  assert.match(view, /AURA SOMBRIA/);
  assert.match(view, /getSpecialTrainerVisual\('SHADOW'\)/);
  assert.match(view, /C\.SUPER_TEAM/);
  assert.match(campaignCss, /campaign-preparation--shadow/);
  assert.match(campaignCss, /endgame-super--secondary/);
  assert.match(battleCss, /shadow-aura-active/);
  assert.match(battleCss, /SHADOW/);

  let manager = fresh();
  unlock18(manager);
  manager.recordBattle({ battleId: 'shadow-super', kind: 'SUPER', winner: 'player' });
  manager.claimReward(manager.getRewardCandidates().find(x => x.selectable).id);
  assert.equal(manager.getState().shadowTrainer.revealed, true);
  assert.equal(manager.acknowledgeShadowReveal(), true);
  const config = manager.getBattleConfig('SHADOW', null, manager.getRosterIds().slice(0, 3));
  assert.deepEqual(config.enemyTeamIds, K.SUPER_TEAM.map(x => x.id));
  assert.deepEqual(config.modifiers, { SHADOW_AURA: true });
  manager.recordBattle({ battleId: 'shadow-final', kind: 'SHADOW', winner: 'player' });
  assert.equal(manager.getState().status, 'COMPLETED');
});

test('PBA-015I derives temporary Final Stand guests from claimed canonical Trials without roster ownership changes', () => {
  const manager = fresh();
  unlock18(manager);
  for (const [kind, battleId, oppId] of [
    ['LEGENDARY_TRIAL', 'i-l', 145],
    ['MYTHICAL_TRIAL', 'i-m', 151],
    ['TITANS_TRIAL', 'i-t', 1007],
    ['CELESTIAL_TRIAL', 'i-c', 889]
  ]) {
    trial(manager, kind, battleId, oppId);
    assert.equal(manager.claimReward(manager.getRewardCandidates().find(x => x.selectable).id).ok, true);
  }
  manager.recordBattle({ battleId: 'i-super', kind: 'SUPER', winner: 'player' });
  assert.equal(manager.claimReward(manager.getRewardCandidates().find(x => x.selectable).id).ok, true);
  assert.equal(manager.getRosterIds().length, 29);
  const guests = manager.getShadowGuests();
  assert.equal(guests.length, 8);
  assert.equal(new Set(guests.map(x => x.id)).size, 8);
  assert.ok(guests.every(x => !manager.getRosterIds().includes(x.id) && x.temporary));
  const config = manager.getBattleConfig('SHADOW', null, [manager.getRosterIds()[0]]);
  assert.equal(config.metadata.battleFormat, 'FINAL_STAND');
  assert.equal(config.playerTeamIds.length, 37);
  assert.equal(config.enemyTeamIds.length, 3);
  assert.deepEqual(config.modifiers, { SHADOW_AURA: true });
  assert.equal(manager.getRosterIds().length, 29);
  assert.equal(manager.acknowledgeShadowReinforcements(), true);
  const reload = fresh(false);
  assert.equal(reload.getState().shadowTrainer.reinforcementsSeen, true);
});

test('PBA-015I engine accepts variable player team only in FINAL_STAND and keeps regular format 3x3', () => {
  const mon = id => ({
    id,
    name: 'mon-' + id,
    types: ['normal'],
    stats: { hp: 80, attack: 70, defense: 70, specialAttack: 70, specialDefense: 70, speed: 70 },
    moves: [{ id: 1, name: 'tackle', type: 'normal', power: 40, accuracy: 100, damageClass: 'physical', pp: 35 }]
  });
  assert.throws(() => E.createTeamBattle([1, 2, 3, 4, 5].map(mon), [6, 7, 8].map(mon)));
  const state = E.createTeamBattle([1, 2, 3, 4, 5].map(mon), [6, 7, 8].map(mon), { battleFormat: 'FINAL_STAND' });
  assert.equal(state.player.team.length, 5);
  assert.equal(state.enemy.team.length, 3);
  state.player.team[0].currentHp = 0;
  const replacement = E.resolveReplacement({ ...state, status: 'AWAITING_REPLACEMENT' }, { player: { targetPokemonId: 4 } });
  assert.equal(replacement.state.player.activeIndex, 3);
});
