const { test } = require('node:test');
const assert = require('node:assert/strict');

const BattleEngine = require('../../assets/js/battle/battle-engine.js');
const BattleEvaluator = require('../../assets/js/battle/battle-evaluator.js');
const DamageCalculator = require('../../assets/js/battle/damage-calculator.js');
const { BATTLE_EVENTS, usesDefenseAsAttack } = require('../../assets/js/battle/battle-constants.js');
const { isMechanicallySupportedMove } = require('../../assets/js/battle-session/battle-session-constants.js');

const bodyPress = Object.freeze({ id: 776, name: 'body-press', type: 'fighting', power: 80, accuracy: 100, pp: 10, damageClass: 'physical' });
const tackle = Object.freeze({ id: 33, name: 'tackle', type: 'normal', power: 40, accuracy: 100, pp: 35, damageClass: 'physical' });

function combatant(id, attack, defense, speed, moves = [bodyPress, tackle]) {
  return {
    id,
    name: `pokemon-${id}`,
    types: ['normal'],
    stats: { hp: 300, attack, defense, specialAttack: 60, specialDefense: 80, speed },
    moves
  };
}

test('Body Press uses the attacker Defense for damage, while ordinary physical moves still use Attack', () => {
  const defender = combatant(2, 60, 100, 0, [tackle]);
  const cases = [
    { attack: 40, defense: 140 },
    { attack: 180, defense: 140 },
    { attack: 180, defense: 60 }
  ];

  for (const { attack, defense } of cases) {
    const attacker = combatant(1, attack, defense, 100);
    const battle = BattleEngine.createBattle(attacker, defender);
    const { state, events } = BattleEngine.resolveTurn(battle, {
      player: { moveId: bodyPress.id, accuracyRoll: 1, damageRoll: 100 },
      enemy: { moveId: tackle.id, accuracyRoll: 1, damageRoll: 100 }
    });
    const hit = events.find(event => event.type === BATTLE_EVENTS.DAMAGE_APPLIED && event.source === 'player');
    assert.ok(hit);
    assert.equal(hit.baseDamage, DamageCalculator.calculateBaseDamage(defense, defender.stats.defense, bodyPress.power));
    assert.equal(state.enemy.currentHp, defender.stats.hp - hit.damage);
    assert.equal(battle.enemy.currentHp, defender.stats.hp, 'The input battle must remain unchanged');

    const evaluation = BattleEvaluator.evaluateMove(battle.player, battle.enemy, battle.player.moves[0]);
    assert.equal(evaluation.attackStat, defense);
    assert.equal(evaluation.baseDamage, hit.baseDamage);

    const ordinary = BattleEvaluator.evaluateMove(battle.player, battle.enemy, battle.player.moves[1]);
    assert.equal(ordinary.attackStat, attack);
  }
});

test('Only Body Press is enabled among the newly reviewed special moves', () => {
  assert.equal(usesDefenseAsAttack(bodyPress), true);
  assert.equal(isMechanicallySupportedMove(bodyPress), true);

  const pending = [
    'sucker-punch', 'first-impression', 'bolt-beak', 'payback',
    'assurance', 'stomping-tantrum', 'temper-flare', 'last-respects'
  ];
  for (const name of pending) {
    assert.equal(isMechanicallySupportedMove({ name, power: 80, damageClass: 'physical' }), false, name);
  }
});
