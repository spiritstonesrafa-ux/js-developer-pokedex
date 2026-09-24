const test = require('node:test');
const assert = require('node:assert/strict');
const Engine = require('../../assets/js/battle/battle-engine.js');
const AI = require('../../assets/js/battle/battle-ai.js');
const MoveModel = require('../../assets/js/battle/move-model.js');
const { SUPPORTED_STATUS_MOVES, BATTLE_EVENTS } = require('../../assets/js/battle/battle-constants.js');
const Mapper = require('../../assets/js/presentation/battle-presentation-mapper.js');
const { BattleUiDomAdapter } = require('../../assets/js/ui/battle-ui-adapter.js');
const { BattleView } = require('../../assets/js/ui/battle-view.js');
const { BattleTeamHydrator } = require('../../assets/js/battle-session/battle-team-hydrator.js');

const powder = SUPPORTED_STATUS_MOVES['poison-powder'];
const tap = { id: 33, name: 'tackle', type: 'normal', power: 40,
  accuracy: 100, pp: 35, damageClass: 'physical' };
function mon(id, types = ['grass'], moves = [tap], hp = 160, speed = 70) {
  return { id, name: `mon-${id}`, types, hp, attack: 75, defense: 100,
    specialAttack: 75, specialDefense: 100, speed, moves };
}
const action = (moveId, accuracyRoll = 1) => ({ type: 'MOVE', moveId, accuracyRoll });

test('Poison Powder is the only accepted status move and has canonical metadata', () => {
  assert.deepEqual(MoveModel.createMove(powder), powder);
  assert.throws(() => MoveModel.createMove({ ...powder, name: 'toxic' }), /não é suportado/);
  assert.throws(() => MoveModel.createMove({ ...powder, accuracy: 100 }), /não é suportado/);
});

test('hit applies poison, consumes PP and deals one-eighth max HP after both actions', () => {
  const initial = Engine.createBattle(mon(3, ['grass'], [powder, tap], 160, 120),
    mon(25, ['electric'], [tap], 160, 50));
  const { state, events } = Engine.resolveTurn(initial,
    { player: action(77), enemy: action(33) });
  assert.equal(initial.enemy.statusCondition, null);
  assert.equal(state.enemy.statusCondition, 'poison');
  assert.equal(state.player.moves[0].currentPp, 34);
  assert.equal(state.enemy.currentHp, 140);
  assert.equal(events.filter(event => event.type === BATTLE_EVENTS.STATUS_APPLIED).length, 1);
  assert.deepEqual(events.find(event => event.type === BATTLE_EVENTS.STATUS_DAMAGE),
    { type: 'STATUS_DAMAGE', target: 'enemy', pokemonName: 'mon-25',
      statusCondition: 'poison', damage: 20, previousHp: 160, currentHp: 140, maxHp: 160 });
  assert.ok(Mapper.mapEvents(events).some(command => command.type === 'STATUS_FEEDBACK'));
  assert.ok(Mapper.mapEvents(events).some(command => command.type === 'HP_TRANSITION' && command.cause === 'poison'));
});

test('miss and type immunity never apply poison', () => {
  const player = mon(3, ['grass'], [powder, tap], 160, 120);
  const enemy = mon(25, ['electric'], [tap], 160, 50);
  const missed = Engine.resolveTurn(Engine.createBattle(player, enemy),
    { player: action(77, 76), enemy: action(33) });
  assert.equal(missed.state.enemy.statusCondition, null);
  assert.equal(missed.state.player.moves[0].currentPp, 34);
  assert.equal(missed.events.some(event => event.type === BATTLE_EVENTS.STATUS_DAMAGE), false);
  for (const type of ['poison', 'steel', 'grass']) {
    const immune = Engine.resolveTurn(Engine.createBattle(player, mon(25, [type], [tap], 160, 50)),
      { player: action(77), enemy: action(33) });
    assert.equal(immune.state.enemy.statusCondition, null);
    assert.equal(immune.events.find(event => event.type === BATTLE_EVENTS.STATUS_BLOCKED).reason, 'IMMUNE');
  }
});

test('reapplying poison fails safely and residual damage has a one-HP minimum', () => {
  const initial = Engine.createBattle(mon(3, ['grass'], [powder], 7, 120),
    mon(25, ['electric'], [powder], 7, 50));
  initial.enemy.statusCondition = 'poison';
  const result = Engine.resolveTurn(initial, { player: action(77), enemy: action(77) });
  assert.equal(result.events.find(event => event.type === BATTLE_EVENTS.STATUS_BLOCKED).reason,
    'ALREADY_STATUS');
  assert.equal(result.state.enemy.currentHp, 6);
  assert.equal(result.events.find(event => event.type === BATTLE_EVENTS.STATUS_DAMAGE).damage, 1);
});

test('poison persists in reserve and ticks only while active', () => {
  let state = Engine.createTeamBattle([mon(3, ['grass'], [powder, tap], 160, 120), mon(4), mon(5)],
    [mon(25, ['electric'], [tap], 160, 50), mon(26), mon(27)]);
  state = Engine.resolveTurn(state, { player: action(77), enemy: action(33) }).state;
  const poisonedHp = state.enemy.team[0].currentHp;
  state = Engine.resolveTurn(state, { player: action(33), enemy: { type: 'SWITCH', targetIndex: 1 } }).state;
  assert.equal(state.enemy.team[0].statusCondition, 'poison');
  assert.equal(state.enemy.team[0].currentHp, poisonedHp);
  state = Engine.resolveTurn(state, { player: { type: 'SWITCH', targetIndex: 1 },
    enemy: { type: 'SWITCH', targetIndex: 0 } }).state;
  assert.equal(state.enemy.team[0].currentHp, poisonedHp - 20);
});

test('residual poison knockout requests replacement without granting an extra turn', () => {
  const base = Engine.createTeamBattle([mon(3, ['grass'], [powder, tap], 160, 120), mon(4), mon(5)],
    [mon(25, ['electric'], [tap], 160, 50), mon(26), mon(27)]);
  const state = structuredClone(base);
  state.enemy.team[0].currentHp = 1;
  const result = Engine.resolveTurn(state, { player: action(77), enemy: action(33) });
  assert.equal(result.state.status, 'AWAITING_REPLACEMENT');
  assert.equal(result.state.turn, 1);
  assert.equal(result.state.enemy.team[0].currentHp, 0);
  assert.ok(result.events.some(event => event.type === BATTLE_EVENTS.REPLACEMENT_REQUIRED));
  const replaced = Engine.resolveReplacement(result.state, { enemy: { targetIndex: 1 } });
  assert.equal(replaced.state.turn, 2);
  assert.equal(replaced.state.enemy.activeIndex, 1);
});

test('poison still ticks on a turn with a direct knockout and both reserves can replace', () => {
  const state = Engine.createTeamBattle([mon(3, ['grass'], [tap], 160, 120), mon(4), mon(5)],
    [mon(25, ['electric'], [tap], 160, 50), mon(26), mon(27)]);
  state.player.team[0].statusCondition = 'poison';
  state.player.team[0].currentHp = 1;
  state.enemy.team[0].currentHp = 1;
  const result = Engine.resolveTurn(state, { player: action(33), enemy: action(33) });
  assert.equal(result.state.status, 'AWAITING_REPLACEMENT');
  assert.equal(result.state.turn, 1);
  assert.equal(result.events.filter(event => event.type === BATTLE_EVENTS.REPLACEMENT_REQUIRED).length, 2);
  const replaced = Engine.resolveReplacement(result.state,
    { player: { targetIndex: 1 }, enemy: { targetIndex: 1 } });
  assert.equal(replaced.state.turn, 2);
});

test('simultaneous final poison knockouts are resolved deterministically as player defeat', () => {
  const state = Engine.createBattle(mon(3, ['grass'], [powder], 160, 120),
    mon(25, ['electric'], [powder], 160, 50));
  state.player.currentHp = 1;
  state.enemy.currentHp = 1;
  state.player.statusCondition = 'poison';
  state.enemy.statusCondition = 'poison';
  const result = Engine.resolveTurn(state, { player: action(77), enemy: action(77) });
  assert.equal(result.state.status, 'ENEMY_WIN');
  assert.equal(result.state.winner, 'enemy');
  assert.equal(result.events.filter(event => event.type === BATTLE_EVENTS.POKEMON_FAINTED).length, 2);
});

test('smart AI uses poison strategically but avoids it against immune or already poisoned targets', () => {
  const team = [mon(407, ['grass'], [powder, tap], 160, 120), mon(4), mon(5)];
  const opponents = [mon(25, ['electric'], [tap], 240, 50), mon(26), mon(27)];
  const state = Engine.createTeamBattle(team, opponents);
  assert.equal(AI.chooseAction(state, 'player').action.moveId, 77);
  assert.equal(AI.chooseAction(state, 'player').diagnostics.reason, 'STATUS_PRESSURE');
  state.enemy.team[0].statusCondition = 'poison';
  assert.equal(AI.chooseAction(state, 'player').action.moveId, 33);
  state.enemy.team[0].statusCondition = null;
  state.enemy.team[0].types = ['steel'];
  assert.equal(AI.chooseAction(state, 'player').action.moveId, 33);
});

test('battle HUD and presentation show poison without portraying it as a damaging move', async () => {
  const container = { innerHTML: '' };
  const view = new BattleView({ container });
  const state = Engine.createTeamBattle([mon(3, ['grass'], [powder, tap]), mon(4), mon(5)],
    [mon(25, ['electric'], [tap]), mon(26), mon(27)]);
  state.enemy.team[0].statusCondition = 'poison';
  view.renderActiveBattleView(state, 'AWAITING_PLAYER_ACTION');
  assert.match(container.innerHTML, /STATUS · VENENO/);
  assert.match(container.innerHTML, /causa veneno/);
  assert.match(container.innerHTML, /id="enemyStatusBadge"[^>]*aria-label="Envenenado"/);
  assert.doesNotMatch(container.innerHTML, /Pwr 0/);

  const messages = [];
  const badges = [];
  const hp = [];
  const adapter = new BattleUiDomAdapter({ view: {
    displayMessage: message => messages.push(message),
    updateStatusBadge: (...args) => badges.push(args),
    updateHpBar: (...args) => hp.push(args)
  } });
  for (const command of Mapper.mapEvents([
    { type: BATTLE_EVENTS.STATUS_APPLIED, target: 'enemy', pokemonName: 'mon-25', statusCondition: 'poison' },
    { type: BATTLE_EVENTS.STATUS_DAMAGE, target: 'enemy', pokemonName: 'mon-25',
      statusCondition: 'poison', damage: 20, previousHp: 160, currentHp: 140, maxHp: 160 }
  ])) await adapter.execute(command);
  assert.deepEqual(badges, [['enemy', 'poison']]);
  assert.deepEqual(hp, [['enemy', 140, 160, 160]]);
  assert.ok(messages.some(message => message.includes('foi envenenado')));
  assert.ok(messages.some(message => message.includes('perdeu 20 HP')));
});

test('Quick Battle discovery still excludes Poison Powder', async () => {
  const hydrator = new BattleTeamHydrator({ api: null });
  const result = await hydrator.selectDeterministicLoadout([powder, tap], ['grass'],
    { attack: 75, defense: 100, specialAttack: 75, specialDefense: 100, speed: 70 });
  assert.ok(result.moves.every(move => move.damageClass !== 'status'));
  assert.equal(result.moves.some(move => move.id === 77), false);
});
