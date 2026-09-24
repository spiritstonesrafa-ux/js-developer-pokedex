const test = require('node:test');
const assert = require('node:assert/strict');
const Engine = require('../../assets/js/battle/battle-engine.js');
const AI = require('../../assets/js/battle/battle-ai.js');
const Evaluator = require('../../assets/js/battle/battle-evaluator.js');
const TurnManager = require('../../assets/js/battle/turn-manager.js');
const MoveModel = require('../../assets/js/battle/move-model.js');
const Mapper = require('../../assets/js/presentation/battle-presentation-mapper.js');
const { BattleView } = require('../../assets/js/ui/battle-view.js');
const { BattleUiDomAdapter } = require('../../assets/js/ui/battle-ui-adapter.js');
const { DeterministicRandomSource } = require('../../assets/js/battle-session/battle-random-source.js');
const { SUPPORTED_STATUS_MOVES, BATTLE_EVENTS } = require('../../assets/js/battle/battle-constants.js');

const burn = SUPPORTED_STATUS_MOVES['will-o-wisp'];
const wave = SUPPORTED_STATUS_MOVES['thunder-wave'];
const poison = SUPPORTED_STATUS_MOVES['poison-powder'];
const tackle = { id: 33, name: 'tackle', type: 'normal', power: 40,
  accuracy: 100, pp: 35, damageClass: 'physical' };
const beam = { id: 58, name: 'ice-beam', type: 'ice', power: 90,
  accuracy: 100, pp: 10, damageClass: 'special' };
const mon = (id, types, moves, speed = 80) => ({ id, name: `mon-${id}`, types,
  hp: 160, attack: 80, defense: 100, specialAttack: 80, specialDefense: 100, speed, moves });
const act = (id, extras = {}) => ({ type: 'MOVE', moveId: id, accuracyRoll: 1,
  damageRoll: 100, statusRoll: 100, ...extras });
const duel = (left, right, leftAct, rightAct) => Engine.resolveTurn(
  Engine.createBattle(left, right), { player: leftAct, enemy: rightAct });

test('only the three exact curated status moves are accepted', () => {
  for (const move of [poison, burn, wave]) assert.deepEqual(MoveModel.createMove(move), move);
  assert.throws(() => MoveModel.createMove({ ...burn, accuracy: 100 }), /não é suportado/);
  assert.throws(() => MoveModel.createMove({ ...wave, name: 'stun-spore' }), /não é suportado/);
});

test('burn lands only after accuracy, deals 1/16 and halves physical damage but not special', () => {
  const a = mon(38, ['fire'], [burn], 120);
  const b = mon(25, ['electric'], [tackle, beam], 60);
  const missed = duel(a, b, act(261, { accuracyRoll: 86 }), act(33));
  assert.equal(missed.state.enemy.statusCondition, null);
  const hit = duel(a, b, act(261), act(33));
  assert.equal(hit.state.enemy.statusCondition, 'burn');
  assert.equal(hit.state.enemy.currentHp, 150);
  assert.equal(hit.events.find(e => e.type === BATTLE_EVENTS.STATUS_DAMAGE).damage, 10);
  assert.ok(Mapper.mapEvents(hit.events).some(c => c.cause === 'burn'));
  const fresh = Engine.createBattle(b, a);
  const scorched = Engine.createBattle(b, a);
  scorched.player.statusCondition = 'burn';
  const plainPhysical = Evaluator.evaluateMove(fresh.player, fresh.enemy, fresh.player.moves[0]);
  const burntPhysical = Evaluator.evaluateMove(scorched.player, scorched.enemy, scorched.player.moves[0]);
  assert.equal(burntPhysical.maxDamage, Math.floor(plainPhysical.maxDamage / 2));
  assert.equal(Evaluator.evaluateMove(scorched.player, scorched.enemy, scorched.player.moves[1]).maxDamage,
    Evaluator.evaluateMove(fresh.player, fresh.enemy, fresh.player.moves[1]).maxDamage);
  const paralyzed = Engine.createBattle(b, a);
  paralyzed.player.statusCondition = 'paralysis';
  assert.equal(Evaluator.evaluateMove(paralyzed.player, paralyzed.enemy, paralyzed.player.moves[1]).expectedDamage,
    Math.floor(Evaluator.evaluateMove(fresh.player, fresh.enemy, fresh.player.moves[1]).averageDamage * 0.75));
  const burnedHit = Engine.resolveTurn(scorched, { player: act(33), enemy: act(261, { accuracyRoll: 100 }) });
  const direct = burnedHit.events.find(e => e.type === BATTLE_EVENTS.DAMAGE_APPLIED && e.source === 'player');
  assert.equal(direct.damage, burntPhysical.maxDamage);
});

test('burn and paralysis respect type immunity and a single major status slot', () => {
  for (const [move, immuneTypes] of [[burn, ['fire']], [wave, ['electric']], [wave, ['ground']]]) {
    const result = duel(mon(94, ['ghost'], [move], 120), mon(25, immuneTypes, [tackle], 50),
      act(move.id), act(33));
    assert.equal(result.state.enemy.statusCondition, null);
    assert.equal(result.events.find(e => e.type === BATTLE_EVENTS.STATUS_BLOCKED).reason, 'IMMUNE');
  }
  const state = Engine.createBattle(mon(38, ['fire'], [burn], 120),
    mon(25, ['electric'], [tackle], 50));
  state.enemy.statusCondition = 'poison';
  const blocked = Engine.resolveTurn(state, { player: act(261), enemy: act(33) });
  assert.equal(blocked.state.enemy.statusCondition, 'poison');
  assert.equal(blocked.events.find(e => e.type === BATTLE_EVENTS.STATUS_BLOCKED).reason, 'ALREADY_STATUS');
});

test('paralysis halves initiative and 1–25 prevents action after PP consumption', () => {
  const state = Engine.createBattle(mon(25, ['electric'], [wave, tackle], 60),
    mon(94, ['ghost'], [tackle], 100));
  const applied = Engine.resolveTurn(state, { player: act(86), enemy: act(33) });
  assert.equal(applied.state.enemy.statusCondition, 'paralysis');
  assert.equal(TurnManager.effectiveSpeed(applied.state.enemy), 50);
  assert.deepEqual(TurnManager.determineOrder(applied.state.player, applied.state.enemy), ['player', 'enemy']);
  const beforePp = applied.state.enemy.moves[0].currentPp;
  const stopped = Engine.resolveTurn(applied.state,
    { player: act(33), enemy: act(33, { statusRoll: 25 }) });
  assert.equal(stopped.state.enemy.moves[0].currentPp, beforePp - 1);
  assert.ok(stopped.events.some(e => e.type === BATTLE_EVENTS.STATUS_IMMOBILIZED));
  assert.equal(stopped.events.some(e => e.type === BATTLE_EVENTS.MOVE_USED && e.actor === 'enemy'), false);
  assert.ok(Mapper.mapEvents(stopped.events).some(c => c.outcome === 'IMMOBILIZED'));
  const moving = Engine.resolveTurn(applied.state,
    { player: act(33), enemy: act(33, { statusRoll: 26 }) });
  assert.ok(moving.events.some(e => e.type === BATTLE_EVENTS.DAMAGE_APPLIED && e.source === 'enemy'));
  assert.throws(() => Engine.resolveTurn(applied.state,
    { player: act(33), enemy: act(33, { statusRoll: 0 }) }), /Roll de status inválido/);
});

test('mid-turn paralysis can stop a slower action; switch preserves status and stops residual in reserve', () => {
  const mid = duel(mon(25, ['electric'], [wave], 120), mon(94, ['ghost'], [tackle], 80),
    act(86), act(33, { statusRoll: 1 }));
  assert.ok(mid.events.some(e => e.type === BATTLE_EVENTS.STATUS_IMMOBILIZED));
  let state = Engine.createTeamBattle([
    mon(38, ['fire'], [burn], 120), mon(3, ['grass'], [tackle]), mon(6, ['fire'], [tackle])
  ], [mon(25, ['electric'], [tackle], 60), mon(26, ['electric'], [tackle]),
    mon(27, ['ground'], [tackle])]);
  state = Engine.resolveTurn(state, { player: act(261), enemy: act(33) }).state;
  const previousHp = state.enemy.team[0].currentHp;
  state = Engine.resolveTurn(state, { player: act(261, { accuracyRoll: 100 }),
    enemy: { type: 'SWITCH', targetPokemonId: 26 } }).state;
  assert.equal(state.enemy.team[0].statusCondition, 'burn');
  assert.equal(state.enemy.team[0].currentHp, previousHp);
});

test('status rolls are independently injectable and AI avoids immune or already-status targets', () => {
  const random = new DeterministicRandomSource({ statusSequence: [25, 26] });
  assert.deepEqual([random.rollStatus(), random.rollStatus()], [25, 26]);
  const state = Engine.createTeamBattle([
    mon(94, ['ghost'], [burn, tackle]), mon(3, ['grass'], [tackle]), mon(4, ['fire'], [tackle])
  ], [mon(38, ['fire'], [tackle]), mon(25, ['electric'], [tackle]),
    mon(27, ['ground'], [tackle])]);
  assert.notEqual(AI.chooseAction(state, 'player', { strategy: 'SMART' }).action?.moveId, 261);
  state.enemy.team[0].types = ['normal'];
  state.enemy.team[0].statusCondition = 'paralysis';
  assert.notEqual(AI.chooseAction(state, 'player', { strategy: 'SMART' }).action?.moveId, 261);
});

test('burn and poison can knock out both last Pokémon together; player loses the tie', () => {
  const state = Engine.createBattle(mon(38, ['fire'], [burn]), mon(3, ['grass'], [poison]));
  state.player.statusCondition = 'poison';
  state.enemy.statusCondition = 'burn';
  state.player.currentHp = 1;
  state.enemy.currentHp = 1;
  const result = Engine.resolveTurn(state, { player: act(261, { accuracyRoll: 100 }),
    enemy: act(77, { accuracyRoll: 100 }) });
  assert.equal(result.state.winner, 'enemy');
  assert.equal(result.events.filter(e => e.type === BATTLE_EVENTS.STATUS_DAMAGE).length, 2);
  assert.equal(result.events.filter(e => e.type === BATTLE_EVENTS.POKEMON_FAINTED).length, 2);
});

test('HUD and spoken feedback distinguish burn and paralysis without fake damage', async () => {
  const container = { innerHTML: '' };
  const view = new BattleView({ container });
  const state = Engine.createTeamBattle([
    mon(25, ['electric'], [wave, tackle]), mon(3, ['grass'], [tackle]), mon(4, ['fire'], [tackle])
  ], [mon(94, ['ghost'], [burn, beam]), mon(38, ['fire'], [tackle]), mon(6, ['fire'], [tackle])]);
  state.player.team[0].statusCondition = 'burn';
  state.enemy.team[0].statusCondition = 'paralysis';
  view.renderActiveBattleView(state, 'AWAITING_PLAYER_ACTION');
  assert.match(container.innerHTML, /STATUS · PARALISIA/);
  assert.match(container.innerHTML, /aria-label="Queimado"/);
  assert.match(container.innerHTML, /aria-label="Paralisado"/);
  assert.doesNotMatch(container.innerHTML, /Pwr 0/);
  const messages = [];
  const adapter = new BattleUiDomAdapter({ view: { displayMessage: message => messages.push(message),
    updateStatusBadge() {} } });
  for (const command of Mapper.mapEvents([
    { type: BATTLE_EVENTS.STATUS_APPLIED, target: 'enemy', pokemonName: 'mon-94', statusCondition: 'burn' },
    { type: BATTLE_EVENTS.STATUS_IMMOBILIZED, actor: 'enemy', pokemonName: 'mon-94',
      statusCondition: 'paralysis', statusRoll: 1 }
  ])) await adapter.execute(command);
  assert.ok(messages.some(message => message.includes('queimadura')));
  assert.ok(messages.some(message => message.includes('não conseguiu agir')));
});
