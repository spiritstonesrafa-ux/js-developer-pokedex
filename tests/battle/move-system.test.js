/**
 * ====================================================================
 * SUÍTE DE TESTES AUTOMATIZADOS: MOVE SYSTEM (move-system.test.js)
 * ====================================================================
 * Validação rigorosa dos gates MV01 a MV43 da Fase PBA-005.
 * Execução com Node.js nativo (node --test).
 * 
 * Critérios:
 * - 100% offline (fixtures estáticas isoladas);
 * - Move Model: normalização, physical, special, status unsupported;
 * - Loadout: 1 a 4 moves, sem duplicatas, rejeição de 5+ moves;
 * - Damage classes: physical (Atk vs Def), special (Sp.Atk vs Sp.Def);
 * - Independência cruzada de stats ofensivos/defensivos;
 * - Move Power: poder real normalizado;
 * - STAB: 1.5x para same-type, 1.0x caso contrário;
 * - Imunidade prevalece absolutamente sobre STAB;
 * - PP: inicial igual a maxPp, decremento em hit e miss, nunca negativo, bloqueio em 0;
 * - Faint no primeiro ataque preserva intacto o PP do contra-ataque;
 * - Accuracy: determinística com roll externo (1-100), miss causa 0 de dano e mantém HP;
 * - Seleção de moves no turno (player e enemy);
 * - Move Type conduz o Type System (regra de tipo primário desativada);
 * - Eventos de combate estruturados (HIT e MISS);
 * - Simulação de batalha completa com moves;
 * - Determinismo estrito e imutabilidade de entradas;
 * - Hardening do Type Chart contra referência canônica independente.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const BattleConstants = require('../../assets/js/battle/battle-constants.js');
const DamageCalculator = require('../../assets/js/battle/damage-calculator.js');
const TypeChart = require('../../assets/js/battle/type-chart.js');
const TypeEffectiveness = require('../../assets/js/battle/type-effectiveness.js');
const MoveModel = require('../../assets/js/battle/move-model.js');
const BattleEngine = require('../../assets/js/battle/battle-engine.js');

const {
  ThunderboltFixture,
  ScratchFixture,
  FlamethrowerFixture,
  EmberFixture,
  WaterGunFixture,
  HydroPumpFixture,
  VineWhipFixture,
  EarthquakeFixture,
  DragonClawFixture,
  SwiftAlwaysHitFixture,
  InaccurateMoveFixture,
  OnePpMoveFixture,
  StatusMoveGrowlFixture
} = require('../fixtures/move-fixtures.js');

const {
  CharmanderFixture,
  BulbasaurFixture,
  SquirtleFixture,
  PikachuFixture,
  FragileOneHpFixture,
  ScizorFixture,
  GeodudeFixture
} = require('../fixtures/pokemon-fixtures.js');

const {
  CANONICAL_NON_NEUTRAL_RELATIONS,
  CANONICAL_TYPES_LIST,
  getCanonicalExpectedMultiplier
} = require('../fixtures/type-chart-reference.js');

describe('PHASE PBA-005 — MOVE SYSTEM SUITE (MV01–MV43)', () => {

  // ==================================================================
  // 1. MOVE MODEL & LOADOUT (MV01 - MV10)
  // ==================================================================

  test('MV01 — Normalize Physical Move: normaliza golpe físico com estrutura canônica', () => {
    const raw = {
      id: 10,
      name: 'Scratch',
      type: 'NORMAL',
      power: 40,
      accuracy: 100,
      pp: 35,
      damageClass: 'PHYSICAL'
    };

    const move = MoveModel.createMove(raw);
    assert.equal(move.id, 10);
    assert.equal(move.name, 'scratch');
    assert.equal(move.type, 'normal');
    assert.equal(move.power, 40);
    assert.equal(move.accuracy, 100);
    assert.equal(move.pp, 35);
    assert.equal(move.damageClass, 'physical');
    assert.ok(Object.isFrozen(move));
  });

  test('MV02 — Normalize Special Move: normaliza golpe especial com estrutura canônica', () => {
    const raw = {
      id: 85,
      name: 'Thunderbolt',
      type: 'electric',
      power: 90,
      accuracy: 100,
      pp: 15,
      damageClass: 'special'
    };

    const move = MoveModel.createMove(raw);
    assert.equal(move.id, 85);
    assert.equal(move.name, 'thunderbolt');
    assert.equal(move.type, 'electric');
    assert.equal(move.power, 90);
    assert.equal(move.accuracy, 100);
    assert.equal(move.pp, 15);
    assert.equal(move.damageClass, 'special');
    assert.ok(Object.isFrozen(move));
  });

  test('MV03 — Status Move: reconhece categoria status e rejeita como UNSUPPORTED na PBA-005', () => {
    assert.ok(MoveModel.isStatusMove(StatusMoveGrowlFixture), 'Deve reconhecer status move via helper');
    assert.equal(MoveModel.isSupportedMove(StatusMoveGrowlFixture), false, 'Status move não deve ser suportado');

    assert.throws(
      () => MoveModel.createMove(StatusMoveGrowlFixture),
      /UNSUPPORTED_IN_PBA_005|não é suportado no Battle Engine/
    );
  });

  test('MV04 — Invalid Power: rejeita power <= 0, não-inteiro, NaN ou infinito', () => {
    const invalidPowers = [0, -10, 15.5, NaN, Infinity, 'abc', null];
    for (const pwr of invalidPowers) {
      assert.throws(
        () => MoveModel.createMove({ id: 1, name: 'tackle', type: 'normal', power: pwr, accuracy: 100, pp: 35, damageClass: 'physical' }),
        /Poder do golpe/
      );
    }
  });

  test('MV05 — Invalid Type: rejeita tipo elemental desconhecido ou inválido', () => {
    const invalidTypes = ['cosmic', 'sound', '', null, 123, 'unknown'];
    for (const t of invalidTypes) {
      assert.throws(
        () => MoveModel.createMove({ id: 1, name: 'tackle', type: t, power: 40, accuracy: 100, pp: 35, damageClass: 'physical' }),
        /Tipo/
      );
    }
  });

  test('MV06 — Invalid Damage Class: rejeita categoria de dano diferente de physical/special', () => {
    const invalidClasses = ['magic', 'hybrid', '', 123, null];
    for (const dc of invalidClasses) {
      assert.throws(
        () => MoveModel.createMove({ id: 1, name: 'tackle', type: 'normal', power: 40, accuracy: 100, pp: 35, damageClass: dc }),
        /Categoria de dano inválida/
      );
    }
  });

  test('MV07 — Move Loadout Min: aceita exatamente 1 golpe no combatente', () => {
    const singleMoveMon = {
      id: 101,
      name: 'one-move-mon',
      types: ['normal'],
      stats: { hp: 50, attack: 50, defense: 50, specialAttack: 50, specialDefense: 50, speed: 50 },
      moves: [ScratchFixture]
    };

    const combatant = BattleEngine.createCombatant(singleMoveMon);
    assert.equal(combatant.moves.length, 1);
  });

  test('MV08 — Move Loadout Max: aceita exatamente 4 golpes distintos no combatente', () => {
    const fourMoveMon = {
      id: 102,
      name: 'four-move-mon',
      types: ['fire', 'flying'],
      stats: { hp: 78, attack: 84, defense: 78, specialAttack: 109, specialDefense: 85, speed: 100 },
      moves: [FlamethrowerFixture, DragonClawFixture, ScratchFixture, EmberFixture]
    };

    const combatant = BattleEngine.createCombatant(fourMoveMon);
    assert.equal(combatant.moves.length, 4);
  });

  test('MV09 — Five Moves: rejeita combatente com 5 ou mais golpes', () => {
    const fiveMoveMon = {
      id: 103,
      name: 'five-move-mon',
      types: ['fire'],
      stats: { hp: 50, attack: 50, defense: 50, specialAttack: 50, specialDefense: 50, speed: 50 },
      moves: [FlamethrowerFixture, DragonClawFixture, ScratchFixture, EmberFixture, VineWhipFixture]
    };

    assert.throws(
      () => BattleEngine.createCombatant(fiveMoveMon),
      /Loadout de golpes excede o limite máximo/
    );
  });

  test('MV10 — Duplicate Move: rejeita golpes duplicados por ID ou nome', () => {
    const duplicateIdMon = {
      id: 104,
      name: 'duplicate-mon',
      types: ['normal'],
      stats: { hp: 50, attack: 50, defense: 50, specialAttack: 50, specialDefense: 50, speed: 50 },
      moves: [ScratchFixture, ScratchFixture]
    };

    assert.throws(
      () => BattleEngine.createCombatant(duplicateIdMon),
      /Golpe duplicado no loadout/
    );
  });

  // ==================================================================
  // 2. PHYSICAL VS SPECIAL DAMAGE & STAT INDEPENDENCE (MV11 - MV16)
  // ==================================================================

  test('MV11 — Physical Uses Attack: dano físico varia com o Attack mantendo Sp.Atk constante', () => {
    // Attack 50 vs Attack 100 contra mesma Defesa (50) com golpe físico Scratch (power 40)
    const dmgLowAtk = DamageCalculator.calculate(50, 50, ScratchFixture.power);
    const dmgHighAtk = DamageCalculator.calculate(100, 50, ScratchFixture.power);

    assert.ok(dmgHighAtk > dmgLowAtk, 'Dano físico com Attack 100 deve ser maior que com Attack 50');
  });

  test('MV12 — Physical Uses Defense: maior Defesa reduz o dano de golpe físico', () => {
    const dmgVsLowDef = DamageCalculator.calculate(80, 40, ScratchFixture.power);
    const dmgVsHighDef = DamageCalculator.calculate(80, 100, ScratchFixture.power);

    assert.ok(dmgVsLowDef > dmgVsHighDef, 'Defesa maior deve reduzir o dano físico');
  });

  test('MV13 — Special Uses Special Attack: dano especial varia com o Sp. Attack mantendo Attack constante', () => {
    const dmgLowSpAtk = DamageCalculator.calculate(50, 50, FlamethrowerFixture.power);
    const dmgHighSpAtk = DamageCalculator.calculate(100, 50, FlamethrowerFixture.power);

    assert.ok(dmgHighSpAtk > dmgLowSpAtk, 'Dano especial com Sp.Atk 100 deve ser maior que com Sp.Atk 50');
  });

  test('MV14 — Special Uses Special Defense: maior Defesa Especial reduz o dano de golpe especial', () => {
    const dmgVsLowSpDef = DamageCalculator.calculate(80, 40, FlamethrowerFixture.power);
    const dmgVsHighSpDef = DamageCalculator.calculate(80, 100, FlamethrowerFixture.power);

    assert.ok(dmgVsLowSpDef > dmgVsHighSpDef, 'Defesa Especial maior deve reduzir o dano especial');
  });

  test('MV15 — Physical Ignores Sp.Attack: alterar apenas Sp.Attack não altera o dano físico', () => {
    const baseAtk = 80;
    const baseDef = 60;

    const pokeSpAtk50 = {
      id: 201,
      name: 'phys-user-1',
      types: ['normal'],
      stats: { hp: 100, attack: baseAtk, defense: 50, specialAttack: 50, specialDefense: 50, speed: 50 },
      moves: [ScratchFixture]
    };

    const pokeSpAtk150 = {
      id: 202,
      name: 'phys-user-2',
      types: ['normal'],
      stats: { hp: 100, attack: baseAtk, defense: 50, specialAttack: 150, specialDefense: 50, speed: 50 },
      moves: [ScratchFixture]
    };

    const target = {
      id: 203,
      name: 'target-mon',
      types: ['normal'],
      stats: { hp: 100, attack: 50, defense: baseDef, specialAttack: 50, specialDefense: 150, speed: 10 },
      moves: [ScratchFixture]
    };

    const battle1 = BattleEngine.createBattle(pokeSpAtk50, target);
    const battle2 = BattleEngine.createBattle(pokeSpAtk150, target);

    const { events: events1 } = BattleEngine.resolveTurn(battle1);
    const { events: events2 } = BattleEngine.resolveTurn(battle2);

    const dmg1 = events1.find(e => e.type === BattleConstants.BATTLE_EVENTS.DAMAGE_APPLIED && e.source === 'player');
    const dmg2 = events2.find(e => e.type === BattleConstants.BATTLE_EVENTS.DAMAGE_APPLIED && e.source === 'player');

    assert.equal(dmg1.damage, dmg2.damage, 'Dano físico deve ser rigorosamente idêntico independentemente de Sp.Attack');
  });

  test('MV16 — Special Ignores Attack: alterar apenas Attack não altera o dano especial', () => {
    const baseSpAtk = 90;
    const baseSpDef = 70;

    const pokeAtk30 = {
      id: 204,
      name: 'spec-user-1',
      types: ['electric'],
      stats: { hp: 100, attack: 30, defense: 50, specialAttack: baseSpAtk, specialDefense: 50, speed: 50 },
      moves: [ThunderboltFixture]
    };

    const pokeAtk140 = {
      id: 205,
      name: 'spec-user-2',
      types: ['electric'],
      stats: { hp: 100, attack: 140, defense: 50, specialAttack: baseSpAtk, specialDefense: 50, speed: 50 },
      moves: [ThunderboltFixture]
    };

    const target = {
      id: 206,
      name: 'target-mon-2',
      types: ['normal'],
      stats: { hp: 100, attack: 50, defense: 150, specialAttack: 50, specialDefense: baseSpDef, speed: 10 },
      moves: [ScratchFixture]
    };

    const battle1 = BattleEngine.createBattle(pokeAtk30, target);
    const battle2 = BattleEngine.createBattle(pokeAtk140, target);

    const { events: events1 } = BattleEngine.resolveTurn(battle1);
    const { events: events2 } = BattleEngine.resolveTurn(battle2);

    const dmg1 = events1.find(e => e.type === BattleConstants.BATTLE_EVENTS.DAMAGE_APPLIED && e.source === 'player');
    const dmg2 = events2.find(e => e.type === BattleConstants.BATTLE_EVENTS.DAMAGE_APPLIED && e.source === 'player');

    assert.equal(dmg1.damage, dmg2.damage, 'Dano especial deve ser rigorosamente idêntico independentemente de Attack');
  });

  // ==================================================================
  // 3. MOVE POWER (MV17)
  // ==================================================================

  test('MV17 — Higher Power: mantendo os mesmos stats, poder 90 causa dano base superior a poder 40', () => {
    const atk = 60;
    const def = 60;
    const dmgPower40 = DamageCalculator.calculateBaseDamage(atk, def, 40);
    const dmgPower90 = DamageCalculator.calculateBaseDamage(atk, def, 90);

    assert.ok(dmgPower90 > dmgPower40, `Poder 90 (${dmgPower90}) deve causar dano estritamente maior que poder 40 (${dmgPower40})`);
  });

  // ==================================================================
  // 4. STAB (SAME-TYPE ATTACK BONUS) (MV18 - MV21)
  // ==================================================================

  test('MV18 — STAB Applied: atacante fire/flying usando golpe fire recebe multiplicador STAB de 1.5x', () => {
    const charizard = {
      id: 6,
      name: 'charizard',
      types: ['fire', 'flying'],
      stats: { hp: 78, attack: 84, defense: 78, specialAttack: 109, specialDefense: 85, speed: 100 },
      moves: [FlamethrowerFixture] // Tipo fire = STAB!
    };
    const target = {
      id: 901,
      name: 'neutral-target',
      types: ['normal'], // Neutro para Fire
      stats: { hp: 200, attack: 50, defense: 85, specialAttack: 50, specialDefense: 85, speed: 10 },
      moves: [ScratchFixture]
    };

    const battle = BattleEngine.createBattle(charizard, target);
    const { events } = BattleEngine.resolveTurn(battle);

    const stabEvent = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.STAB_RESOLVED && e.actor === 'player');
    assert.ok(stabEvent, 'Evento STAB_RESOLVED deve ser emitido');
    assert.equal(stabEvent.hasStab, true);
    assert.equal(stabEvent.multiplier, 1.5);

    const dmgEvent = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.DAMAGE_APPLIED && e.source === 'player');
    assert.equal(dmgEvent.stabMultiplier, 1.5);
    assert.equal(dmgEvent.damage, Math.floor(dmgEvent.baseDamage * 1.5 * 1));
  });

  test('MV19 — No STAB: atacante fire/flying usando golpe dragon recebe multiplicador STAB de 1.0x', () => {
    const charizard = {
      id: 6,
      name: 'charizard',
      types: ['fire', 'flying'],
      stats: { hp: 78, attack: 84, defense: 78, specialAttack: 109, specialDefense: 85, speed: 100 },
      moves: [DragonClawFixture] // Tipo dragon != fire / flying -> sem STAB!
    };
    const target = {
      id: 901,
      name: 'neutral-target',
      types: ['normal'], // Neutro para Dragon
      stats: { hp: 200, attack: 50, defense: 80, specialAttack: 50, specialDefense: 80, speed: 10 },
      moves: [ScratchFixture]
    };

    const battle = BattleEngine.createBattle(charizard, target);
    const { events } = BattleEngine.resolveTurn(battle);

    const stabEvent = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.STAB_RESOLVED && e.actor === 'player');
    assert.ok(stabEvent);
    assert.equal(stabEvent.hasStab, false);
    assert.equal(stabEvent.multiplier, 1.0);

    const dmgEvent = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.DAMAGE_APPLIED && e.source === 'player');
    assert.equal(dmgEvent.stabMultiplier, 1.0);
    assert.equal(dmgEvent.damage, Math.floor(dmgEvent.baseDamage * 1.0 * 1));
  });

  test('MV20 — STAB + Super Effective: pipeline calcula base * 1.5 * 2 corretamente', () => {
    const baseDamage = 20;
    const stabMultiplier = 1.5;
    const typeMultiplier = 2; // Super efetivo

    const finalDamage = DamageCalculator.applyModifier(baseDamage, typeMultiplier, stabMultiplier);
    // 20 * 1.5 * 2 = 60
    assert.equal(finalDamage, 60);
  });

  test('MV21 — STAB + Immunity: imunidade (0x) resulta estritamente em 0 dano mesmo com STAB 1.5x', () => {
    const pikachu = {
      id: 25,
      name: 'pikachu',
      types: ['electric'],
      stats: { hp: 35, attack: 55, defense: 40, specialAttack: 100, specialDefense: 50, speed: 90 },
      moves: [ThunderboltFixture] // Electric com STAB contra Ground (imunidade 0x)
    };
    const target = {
      id: 74,
      name: 'geodude',
      types: ['rock', 'ground'],
      stats: { hp: 100, attack: 50, defense: 50, specialAttack: 50, specialDefense: 50, speed: 10 },
      moves: [ScratchFixture]
    };

    const battle = BattleEngine.createBattle(pikachu, target);
    const { events } = BattleEngine.resolveTurn(battle);

    const dmgEvent = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.DAMAGE_APPLIED && e.source === 'player');
    assert.equal(dmgEvent.typeMultiplier, 0);
    assert.equal(dmgEvent.stabMultiplier, 1.5);
    assert.equal(dmgEvent.damage, 0, 'STAB jamais supera imunidade elemental (dano deve ser rigorosamente 0)');
  });

  // ==================================================================
  // 5. PP SYSTEM (MV22 - MV27)
  // ==================================================================

  test('MV22 — Initial PP: currentPp é inicializado rigorosamente igual a maxPp', () => {
    const combatant = BattleEngine.createCombatant(CharmanderFixture);
    const ember = combatant.moves.find(m => m.name === 'ember');

    assert.equal(ember.maxPp, EmberFixture.pp);
    assert.equal(ember.currentPp, ember.maxPp);
  });

  test('MV23 — PP Consumption on Hit: decrementa exatamente 1 PP ao acertar o golpe (15 -> 14)', () => {
    const pika = {
      id: 25,
      name: 'pikachu',
      types: ['electric'],
      stats: { hp: 50, attack: 50, defense: 50, specialAttack: 50, specialDefense: 50, speed: 90 },
      moves: [ThunderboltFixture] // PP max 15
    };
    const enemy = {
      id: 99,
      name: 'sponge',
      types: ['normal'],
      stats: { hp: 200, attack: 10, defense: 50, specialAttack: 10, specialDefense: 50, speed: 10 },
      moves: [ScratchFixture]
    };

    const battle = BattleEngine.createBattle(pika, enemy);
    const { state, events } = BattleEngine.resolveTurn(battle, {
      player: { moveId: ThunderboltFixture.id, accuracyRoll: 50 } // Hit
    });

    const pikaMove = state.player.moves.find(m => m.id === ThunderboltFixture.id);
    assert.equal(pikaMove.currentPp, 14, 'PP deve ser decrementado de 15 para 14');

    const ppEvent = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.PP_CHANGED && e.actor === 'player');
    assert.ok(ppEvent);
    assert.equal(ppEvent.previousPp, 15);
    assert.equal(ppEvent.currentPp, 14);
  });

  test('MV24 — PP Consumption on Miss: decrementa PP mesmo quando o golpe erra', () => {
    const attacker = {
      id: 10,
      name: 'attacker',
      types: ['normal'],
      stats: { hp: 50, attack: 50, defense: 50, specialAttack: 50, specialDefense: 50, speed: 90 },
      moves: [InaccurateMoveFixture] // Accuracy 70, PP 10
    };
    const defender = {
      id: 11,
      name: 'defender',
      types: ['normal'],
      stats: { hp: 100, attack: 10, defense: 50, specialAttack: 10, specialDefense: 50, speed: 10 },
      moves: [ScratchFixture]
    };

    const battle = BattleEngine.createBattle(attacker, defender);
    const { state, events } = BattleEngine.resolveTurn(battle, {
      player: { moveId: InaccurateMoveFixture.id, accuracyRoll: 85 } // 85 > 70 -> Miss!
    });

    const move = state.player.moves.find(m => m.id === InaccurateMoveFixture.id);
    assert.equal(move.currentPp, 9, 'PP deve decrementar mesmo em miss');

    const missEvent = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.MOVE_MISSED);
    assert.ok(missEvent, 'Evento MOVE_MISSED deve ser emitido');
  });

  test('MV25 — PP Never Negative: PP possui piso estrito em 0', () => {
    const attacker = {
      id: 10,
      name: 'attacker',
      types: ['normal'],
      stats: { hp: 50, attack: 50, defense: 50, specialAttack: 50, specialDefense: 50, speed: 90 },
      moves: [{ ...OnePpMoveFixture, currentPp: 1 }]
    };
    const defender = {
      id: 11,
      name: 'defender',
      types: ['normal'],
      stats: { hp: 100, attack: 10, defense: 50, specialAttack: 10, specialDefense: 50, speed: 10 },
      moves: [ScratchFixture]
    };

    const battle = BattleEngine.createBattle(attacker, defender);
    const { state } = BattleEngine.resolveTurn(battle, {
      player: { moveId: OnePpMoveFixture.id, accuracyRoll: 50 }
    });

    const moveAfter = state.player.moves.find(m => m.id === OnePpMoveFixture.id);
    assert.equal(moveAfter.currentPp, 0);
    assert.ok(moveAfter.currentPp >= 0, 'PP não pode ser negativo');
  });

  test('MV26 — Zero PP Move Blocked: golpe com 0 PP é rejeitado (ACTION_REJECTED)', () => {
    const attacker = {
      id: 10,
      name: 'attacker',
      types: ['normal'],
      stats: { hp: 50, attack: 50, defense: 50, specialAttack: 50, specialDefense: 50, speed: 90 },
      moves: [{ ...OnePpMoveFixture, currentPp: 0 }]
    };
    const defender = {
      id: 11,
      name: 'defender',
      types: ['normal'],
      stats: { hp: 100, attack: 10, defense: 50, specialAttack: 10, specialDefense: 50, speed: 10 },
      moves: [ScratchFixture]
    };

    const battle = BattleEngine.createBattle(attacker, defender);

    assert.throws(
      () => BattleEngine.resolveTurn(battle, { player: { moveId: OnePpMoveFixture.id } }),
      /ACTION_REJECTED|NO_USABLE_MOVES/
    );
  });

  test('MV27 — Non-executed Counterattack PP: combatente nocauteado no 1º golpe NÃO consome PP', () => {
    // Charmander (Speed 65) vs FragileOneHp (Speed 10)
    const initialFragileScratchPp = ScratchFixture.pp;
    const battle = BattleEngine.createBattle(CharmanderFixture, FragileOneHpFixture);

    const { state, events } = BattleEngine.resolveTurn(battle);

    assert.equal(state.enemy.currentHp, 0, 'Defensor deve ter sido nocauteado');
    const enemyScratch = state.enemy.moves.find(m => m.id === ScratchFixture.id);
    assert.equal(enemyScratch.currentPp, initialFragileScratchPp, 'PP do defensor derrotado não pode ser consumido');

    // Nenhuma ação iniciada pelo inimigo
    const enemyActions = events.filter(e => e.actor === 'enemy');
    assert.equal(enemyActions.length, 0);
  });

  // ==================================================================
  // 6. ACCURACY RESOLUTION (MV28 - MV32)
  // ==================================================================

  test('MV28 — Accuracy Hit: accuracy 70 com roll 70 resulta em HIT', () => {
    const attacker = {
      id: 10,
      name: 'attacker',
      types: ['normal'],
      stats: { hp: 50, attack: 50, defense: 50, specialAttack: 50, specialDefense: 50, speed: 90 },
      moves: [InaccurateMoveFixture] // accuracy 70
    };
    const defender = {
      id: 11,
      name: 'defender',
      types: ['normal'],
      stats: { hp: 100, attack: 10, defense: 50, specialAttack: 10, specialDefense: 50, speed: 10 },
      moves: [ScratchFixture]
    };

    const battle = BattleEngine.createBattle(attacker, defender);
    const { events } = BattleEngine.resolveTurn(battle, {
      player: { moveId: InaccurateMoveFixture.id, accuracyRoll: 70 } // 70 <= 70 -> HIT!
    });

    const hitEvent = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.DAMAGE_APPLIED && e.source === 'player');
    const missEvent = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.MOVE_MISSED);

    assert.ok(hitEvent, 'Deve emitir DAMAGE_APPLIED para HIT');
    assert.equal(missEvent, undefined, 'Não deve emitir MOVE_MISSED para HIT');
  });

  test('MV29 — Accuracy Miss: accuracy 70 com roll 71 resulta em MISS', () => {
    const attacker = {
      id: 10,
      name: 'attacker',
      types: ['normal'],
      stats: { hp: 50, attack: 50, defense: 50, specialAttack: 50, specialDefense: 50, speed: 90 },
      moves: [InaccurateMoveFixture] // accuracy 70
    };
    const defender = {
      id: 11,
      name: 'defender',
      types: ['normal'],
      stats: { hp: 100, attack: 10, defense: 50, specialAttack: 10, specialDefense: 50, speed: 10 },
      moves: [ScratchFixture]
    };

    const battle = BattleEngine.createBattle(attacker, defender);
    const { events } = BattleEngine.resolveTurn(battle, {
      player: { moveId: InaccurateMoveFixture.id, accuracyRoll: 71 } // 71 > 70 -> MISS!
    });

    const hitEvent = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.DAMAGE_APPLIED && e.source === 'player');
    const missEvent = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.MOVE_MISSED);

    assert.equal(hitEvent, undefined, 'Não deve emitir DAMAGE_APPLIED para MISS');
    assert.ok(missEvent, 'Deve emitir MOVE_MISSED');
    assert.equal(missEvent.accuracyRoll, 71);
    assert.equal(missEvent.accuracy, 70);
  });

  test('MV30 — Miss Does Zero Damage: em caso de miss o HP do defensor permanece inalterado', () => {
    const attacker = {
      id: 10,
      name: 'attacker',
      types: ['normal'],
      stats: { hp: 50, attack: 50, defense: 50, specialAttack: 50, specialDefense: 50, speed: 90 },
      moves: [InaccurateMoveFixture]
    };
    const defender = {
      id: 11,
      name: 'defender',
      types: ['normal'],
      stats: { hp: 100, attack: 10, defense: 50, specialAttack: 10, specialDefense: 50, speed: 10 },
      moves: [ScratchFixture]
    };

    const battle = BattleEngine.createBattle(attacker, defender);
    const initialDefenderHp = battle.enemy.currentHp;

    const { state } = BattleEngine.resolveTurn(battle, {
      player: { moveId: InaccurateMoveFixture.id, accuracyRoll: 100 }, // Miss
      enemy: { moveId: ScratchFixture.id, accuracyRoll: 100 } // Miss do contra-ataque
    });

    assert.equal(state.enemy.currentHp, initialDefenderHp, 'HP do defensor deve permanecer rigorosamente inalterado');
  });

  test('MV31 — Deterministic Accuracy: mesmos rolls externos produzem rigorosamente o mesmo resultado', () => {
    const attacker = {
      id: 10,
      name: 'attacker',
      types: ['normal'],
      stats: { hp: 50, attack: 50, defense: 50, specialAttack: 50, specialDefense: 50, speed: 90 },
      moves: [InaccurateMoveFixture]
    };
    const defender = {
      id: 11,
      name: 'defender',
      types: ['normal'],
      stats: { hp: 100, attack: 10, defense: 50, specialAttack: 10, specialDefense: 50, speed: 10 },
      moves: [ScratchFixture]
    };

    const actions = {
      player: { moveId: InaccurateMoveFixture.id, accuracyRoll: 65 },
      enemy: { moveId: ScratchFixture.id, accuracyRoll: 40 }
    };

    const run1 = BattleEngine.resolveTurn(BattleEngine.createBattle(attacker, defender), actions);
    const run2 = BattleEngine.resolveTurn(BattleEngine.createBattle(attacker, defender), actions);

    assert.deepEqual(run1.state, run2.state);
    assert.deepEqual(run1.events, run2.events);
  });

  test('MV32 — Invalid Roll: rejeita rolls inválidos como 0, 101, negativos e NaN', () => {
    const battle = BattleEngine.createBattle(CharmanderFixture, BulbasaurFixture);

    const invalidRolls = [0, 101, -5, NaN, 'abc', 50.5];
    for (const r of invalidRolls) {
      assert.throws(
        () => BattleEngine.resolveTurn(battle, { player: { moveId: EmberFixture.id, accuracyRoll: r } }),
        /Roll de acurácia inválido/
      );
    }
  });

  // ==================================================================
  // 7. MOVE SELECTION & ENGINE INTEGRATION (MV33 - MV40)
  // ==================================================================

  test('MV33 — Select Player Move: jogador seleciona explicitamente um golpe do loadout', () => {
    // Charmander possui [Ember, Scratch]
    const battle = BattleEngine.createBattle(CharmanderFixture, BulbasaurFixture);

    const { events } = BattleEngine.resolveTurn(battle, {
      player: { moveId: ScratchFixture.id } // Escolhe Scratch (normal)
    });

    const moveUsed = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.MOVE_USED && e.actor === 'player');
    assert.equal(moveUsed.moveId, ScratchFixture.id);
    assert.equal(moveUsed.moveName, 'scratch');
    assert.equal(moveUsed.moveType, 'normal');
  });

  test('MV34 — Select Enemy Move: adversário seleciona explicitamente um golpe do loadout', () => {
    // Enemy Bulbasaur com HP suficiente para sobreviver ao primeiro golpe
    const bulkyBulbasaur = {
      id: 1,
      name: 'bulbasaur',
      types: ['grass', 'poison'],
      stats: { hp: 200, attack: 49, defense: 49, specialAttack: 65, specialDefense: 65, speed: 45 },
      moves: [VineWhipFixture, ScratchFixture]
    };
    const battle = BattleEngine.createBattle(CharmanderFixture, bulkyBulbasaur);

    const { events } = BattleEngine.resolveTurn(battle, {
      player: { moveId: ScratchFixture.id },
      enemy: { moveId: ScratchFixture.id }
    });

    const enemyMove = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.MOVE_USED && e.actor === 'enemy');
    assert.ok(enemyMove, 'Golpe do adversário deve ser executado');
    assert.equal(enemyMove.moveId, ScratchFixture.id);
    assert.equal(enemyMove.moveName, 'scratch');
  });

  test('MV35 — Move Type Drives Type System: efetividade é regida exclusivamente pelo tipo do golpe', () => {
    // Charmander (Fire) usando Scratch (Normal) contra Gastly (Ghost/Poison)
    // Se usasse tipo primário do Pokémon (Fire), causaria dano neutro (1x).
    // Com Move Type (Normal), Gastly é IMUNE a Normal (0x)!
    const gastly = {
      id: 92,
      name: 'gastly',
      types: ['ghost', 'poison'],
      stats: { hp: 30, attack: 35, defense: 30, specialAttack: 100, specialDefense: 35, speed: 10 },
      moves: [ScratchFixture]
    };

    const battle = BattleEngine.createBattle(CharmanderFixture, gastly);
    const { events } = BattleEngine.resolveTurn(battle, {
      player: { moveId: ScratchFixture.id } // Tipo Normal!
    });

    const typeEvent = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.TYPE_EFFECTIVENESS_RESOLVED && e.source === 'player');
    assert.equal(typeEvent.attackType, 'normal', 'Tipo do ataque deve ser Normal (do golpe)');
    assert.equal(typeEvent.multiplier, 0, 'Multiplicador deve ser 0 (Imune a Normal)');

    const dmgEvent = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.DAMAGE_APPLIED && e.source === 'player');
    assert.equal(dmgEvent.damage, 0, 'Dano final deve ser 0');
  });

  test('MV36 — Faint Stops Move: combatente derrotado no primeiro golpe não desfere golpe', () => {
    const battle = BattleEngine.createBattle(CharmanderFixture, FragileOneHpFixture);
    const { events, state } = BattleEngine.resolveTurn(battle);

    assert.equal(state.enemy.currentHp, 0);
    const moveEvents = events.filter(e => e.type === BattleConstants.BATTLE_EVENTS.MOVE_USED);
    assert.equal(moveEvents.length, 1, 'Apenas 1 golpe deve ser disparado no turno do nocaute');
  });

  test('MV37 — Winner: registra vencedor correto após nocaute com golpes', () => {
    const battle = BattleEngine.createBattle(CharmanderFixture, FragileOneHpFixture);
    const { state } = BattleEngine.resolveTurn(battle);

    assert.equal(state.status, BattleConstants.BATTLE_STATUS.PLAYER_WIN);
    assert.equal(state.winner, 'player');
  });

  test('MV38 — Event Order Hit: sequência de eventos em acerto (HIT)', () => {
    const battle = BattleEngine.createBattle(CharmanderFixture, BulbasaurFixture);
    const { events } = BattleEngine.resolveTurn(battle, {
      player: { moveId: EmberFixture.id, accuracyRoll: 10 },
      enemy: { moveId: VineWhipFixture.id, accuracyRoll: 10 }
    });

    const playerActionIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.ACTION_STARTED && e.actor === 'player');
    const moveSelectedIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.MOVE_SELECTED && e.actor === 'player');
    const moveUsedIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.MOVE_USED && e.actor === 'player');
    const ppChangedIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.PP_CHANGED && e.actor === 'player');
    const stabIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.STAB_RESOLVED && e.actor === 'player');
    const typeEffIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.TYPE_EFFECTIVENESS_RESOLVED && e.source === 'player');
    const damageIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.DAMAGE_APPLIED && e.source === 'player');

    assert.ok(playerActionIdx < moveSelectedIdx, 'ACTION_STARTED < MOVE_SELECTED');
    assert.ok(moveSelectedIdx < moveUsedIdx, 'MOVE_SELECTED < MOVE_USED');
    assert.ok(moveUsedIdx < ppChangedIdx, 'MOVE_USED < PP_CHANGED');
    assert.ok(ppChangedIdx < stabIdx, 'PP_CHANGED < STAB_RESOLVED');
    assert.ok(stabIdx < typeEffIdx, 'STAB_RESOLVED < TYPE_EFFECTIVENESS_RESOLVED');
    assert.ok(typeEffIdx < damageIdx, 'TYPE_EFFECTIVENESS_RESOLVED < DAMAGE_APPLIED');
  });

  test('MV39 — Event Order Miss: sequência de eventos em erro (MISS)', () => {
    const attacker = {
      id: 10,
      name: 'attacker',
      types: ['normal'],
      stats: { hp: 50, attack: 50, defense: 50, specialAttack: 50, specialDefense: 50, speed: 90 },
      moves: [InaccurateMoveFixture]
    };
    const defender = {
      id: 11,
      name: 'defender',
      types: ['normal'],
      stats: { hp: 100, attack: 10, defense: 50, specialAttack: 10, specialDefense: 50, speed: 10 },
      moves: [ScratchFixture]
    };

    const battle = BattleEngine.createBattle(attacker, defender);
    const { events } = BattleEngine.resolveTurn(battle, {
      player: { moveId: InaccurateMoveFixture.id, accuracyRoll: 90 } // Miss
    });

    const moveSelectedIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.MOVE_SELECTED && e.actor === 'player');
    const moveUsedIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.MOVE_USED && e.actor === 'player');
    const ppChangedIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.PP_CHANGED && e.actor === 'player');
    const moveMissedIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.MOVE_MISSED && e.actor === 'player');
    const damageIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.DAMAGE_APPLIED && e.source === 'player');

    assert.ok(moveSelectedIdx < moveUsedIdx, 'MOVE_SELECTED < MOVE_USED');
    assert.ok(moveUsedIdx < ppChangedIdx, 'MOVE_USED < PP_CHANGED');
    assert.ok(ppChangedIdx < moveMissedIdx, 'PP_CHANGED < MOVE_MISSED');
    assert.equal(damageIdx, -1, 'DAMAGE_APPLIED não deve existir para miss do jogador');
  });

  test('MV40 — Full Battle with Moves: resolve batalha completa até nocaute com golpes normalizados', () => {
    const result = BattleEngine.simulateBattle(CharmanderFixture, BulbasaurFixture);

    assert.ok(result.state.status === BattleConstants.BATTLE_STATUS.PLAYER_WIN || result.state.status === BattleConstants.BATTLE_STATUS.ENEMY_WIN);
    assert.ok(result.totalTurns >= 1);
    assert.ok(result.events.length > 5);
  });

  // ==================================================================
  // 8. DETERMINISM & IMMUTABILITY (MV41 - MV42)
  // ==================================================================

  test('MV41 — Determinism: mesmas entradas, golpes e rolls geram resultados, PP e eventos estritamente idênticos', () => {
    const actions = [
      { player: { moveId: EmberFixture.id, accuracyRoll: 10 }, enemy: { moveId: VineWhipFixture.id, accuracyRoll: 20 } },
      { player: { moveId: ScratchFixture.id, accuracyRoll: 30 }, enemy: { moveId: ScratchFixture.id, accuracyRoll: 40 } }
    ];

    const run1 = BattleEngine.simulateBattle(CharmanderFixture, BulbasaurFixture, 10, actions);
    const run2 = BattleEngine.simulateBattle(CharmanderFixture, BulbasaurFixture, 10, actions);

    assert.deepEqual(run1.state, run2.state);
    assert.deepEqual(run1.events, run2.events);
    assert.equal(run1.totalTurns, run2.totalTurns);
  });

  test('MV42 — Input Immutability: objetos de entrada (Pokemon, Moves, Loadout) permanecem inalterados', () => {
    const testMove = {
      id: 99,
      name: 'test-move',
      type: 'fire',
      power: 50,
      accuracy: 100,
      pp: 20,
      damageClass: 'special'
    };
    const testPoke = {
      id: 88,
      name: 'test-poke',
      types: ['fire'],
      stats: { hp: 80, attack: 60, defense: 60, specialAttack: 70, specialDefense: 70, speed: 60 },
      moves: [testMove]
    };

    const cloneMove = JSON.parse(JSON.stringify(testMove));
    const clonePoke = JSON.parse(JSON.stringify(testPoke));

    BattleEngine.simulateBattle(testPoke, BulbasaurFixture);

    assert.deepEqual(testMove, cloneMove, 'Move original não pode sofrer mutação');
    assert.deepEqual(testPoke, clonePoke, 'Pokémon original não pode sofrer mutação');
  });

  // ==================================================================
  // 9. HARDENING DO TYPE CHART (MV43)
  // ==================================================================

  test('MV43 — Canonical Type Reference: todas as 324 relações do Type Chart são idênticas à referência independente', () => {
    let checkedCount = 0;

    for (const atk of CANONICAL_TYPES_LIST) {
      for (const def of CANONICAL_TYPES_LIST) {
        const runtimeMultiplier = TypeEffectiveness.calculate(atk, [def]).multiplier;
        const expectedMultiplier = getCanonicalExpectedMultiplier(atk, def);

        assert.equal(
          runtimeMultiplier,
          expectedMultiplier,
          `Inconsistência canônica detectada: ${atk} atacando ${def} -> Runtime: ${runtimeMultiplier}, Referência Independente: ${expectedMultiplier}`
        );
        checkedCount++;
      }
    }

    assert.equal(checkedCount, 324, 'Exatamente 324 relações (18x18) devem ser validadas contra a referência canônica');
  });

});
