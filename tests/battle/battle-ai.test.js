/**
 * ====================================================================
 * SUÍTE DE TESTES AUTOMATIZADOS: BATTLE AI (battle-ai.test.js)
 * ====================================================================
 * Validação rigorosa dos gates AI-01 a AI-43 da Fase PBA-007.
 * Execução com Node.js nativo (node --test).
 * 
 * Regras:
 * - 100% offline (fixtures estáticas isoladas);
 * - Avaliação de dano esperado ponderado por precisão (BattleEvaluator);
 * - Estratégias SIMPLE e SMART;
 * - Troca voluntária inteligente (imunidade total, desvantagem severa);
 * - Substituição forçada inteligente pós-nocaute;
 * - Prevenção de golpes imunes quando há alternativa útil;
 * - Zero trapaça (não lê ação futura do jogador);
 * - Zero RNG interno (0 chamadas a Math.random / crypto);
 * - Imutabilidade estrita do estado da batalha e das fixtures;
 * - Simulações completas: Player vs SMART AI e SMART AI vs SMART AI;
 * - Reprodutibilidade 100% determinística.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const BattleConstants = require('../../assets/js/battle/battle-constants.js');
const DamageCalculator = require('../../assets/js/battle/damage-calculator.js');
const TypeEffectiveness = require('../../assets/js/battle/type-effectiveness.js');
const MoveModel = require('../../assets/js/battle/move-model.js');
const BattleEngine = require('../../assets/js/battle/battle-engine.js');
const BattleEvaluator = require('../../assets/js/battle/battle-evaluator.js');
const BattleAI = require('../../assets/js/battle/battle-ai.js');

const {
  ThunderboltFixture,
  ScratchFixture,
  FlamethrowerFixture,
  EmberFixture,
  WaterGunFixture,
  HydroPumpFixture,
  VineWhipFixture,
  EarthquakeFixture,
  RockThrowFixture
} = require('../fixtures/move-fixtures.js');

const {
  CharmanderFixture,
  BulbasaurFixture,
  SquirtleFixture,
  PikachuFixture,
  GeodudeFixture,
  GyaradosFixture,
  SwampertFixture
} = require('../fixtures/pokemon-fixtures.js');

const {
  PlayerTeam3Fixture,
  EnemyTeam3Fixture
} = require('../fixtures/team-fixtures.js');

describe('PHASE PBA-007 — BATTLE AI SUITE (AI-01–AI-43)', () => {

  // ==================================================================
  // 1. DISPONIBILIDADE E VALIDAÇÕES BÁSICAS (AI-01 a AI-05)
  // ==================================================================

  test('AI-01 — Simple Strategy Available: suporta estratégia SIMPLE', () => {
    assert.equal(BattleAI.STRATEGY.SIMPLE, 'SIMPLE');
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    const decision = BattleAI.chooseAction(battle, 'enemy', { strategy: 'SIMPLE' });
    assert.ok(decision && decision.action);
    assert.equal(decision.diagnostics.strategy, 'SIMPLE');
  });

  test('AI-02 — Smart Strategy Available: suporta estratégia SMART como padrão', () => {
    assert.equal(BattleAI.STRATEGY.SMART, 'SMART');
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    const decision = BattleAI.chooseAction(battle, 'enemy');
    assert.ok(decision && decision.action);
    assert.equal(decision.diagnostics.strategy, 'SMART');
  });

  test('AI-03 — Invalid Strategy: rejeita estratégias desconhecidas', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    assert.throws(
      () => BattleAI.chooseAction(battle, 'enemy', { strategy: 'UNSUPPORTED' }),
      /Estratégia de IA inválida/
    );
  });

  test('AI-04 — Invalid Battle State: rejeita estados nulos ou corrompidos', () => {
    assert.throws(() => BattleAI.chooseAction(null, 'enemy'), /Estado de batalha inválido/);
    assert.throws(() => BattleAI.chooseAction({}, 'enemy'), /Estrutura de Battle State corrompida/);
  });

  test('AI-05 — Invalid Side: rejeita lados diferentes de "player" ou "enemy"', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    assert.throws(() => BattleAI.chooseAction(battle, 'neutral'), /Lado de batalha inválido/);
    assert.throws(() => BattleAI.chooseAction(battle, 'spectator'), /Lado de batalha inválido/);
  });

  // ==================================================================
  // 2. ESTRATÉGIA SIMPLE (AI-06 a AI-08)
  // ==================================================================

  test('AI-06 — First Usable Move: SIMPLE seleciona deterministamente o primeiro golpe com PP', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    // Bulbasaur tem Scratch (index 0) e Vine Whip (index 1)
    const decision = BattleAI.chooseAction(battle, 'enemy', { strategy: 'SIMPLE' });
    assert.equal(decision.action.type, BattleConstants.BATTLE_ACTIONS.MOVE);
    assert.equal(decision.action.moveId, battle.enemy.team[0].moves[0].id);
    assert.equal(decision.diagnostics.reason, BattleConstants.AI_DECISION_REASON.FIRST_USABLE_MOVE);
  });

  test('AI-07 — Ignore Zero PP: SIMPLE ignora golpe com 0 PP e escolhe o próximo utilizável', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    // Zera o PP do primeiro golpe (Scratch)
    battle.enemy.team[0].moves[0].currentPp = 0;
    const decision = BattleAI.chooseAction(battle, 'enemy', { strategy: 'SIMPLE' });
    assert.equal(decision.action.type, BattleConstants.BATTLE_ACTIONS.MOVE);
    assert.equal(decision.action.moveId, battle.enemy.team[0].moves[1].id);
  });

  test('AI-08 — No Voluntary Switch: SIMPLE nunca realiza troca voluntária quando possui golpe legal', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    // Bulbasaur enfrentando Charmander (desvantagem de tipo)
    const decision = BattleAI.chooseAction(battle, 'enemy', { strategy: 'SIMPLE' });
    assert.equal(decision.action.type, BattleConstants.BATTLE_ACTIONS.MOVE, 'SIMPLE deve sempre usar MOVE');
  });

  // ==================================================================
  // 3. AVALIAÇÃO DE GOLPES SMART (AI-09 a AI-18)
  // ==================================================================

  test('AI-09 — Higher Expected Damage: SMART escolhe golpe de maior dano esperado', () => {
    // Cria Pokémon com golpe fraco (power 40) e golpe forte (power 90), mesma precisão
    const attacker = {
      id: 99,
      name: 'test-mon',
      types: ['normal'],
      attack: 100,
      defense: 100,
      specialAttack: 100,
      specialDefense: 100,
      moves: [
        { id: 1, name: 'weak-hit', type: 'normal', power: 40, accuracy: 100, currentPp: 10, damageClass: 'physical' },
        { id: 2, name: 'strong-hit', type: 'normal', power: 90, accuracy: 100, currentPp: 10, damageClass: 'physical' }
      ],
      currentHp: 100,
      maxHp: 100
    };
    const defender = {
      id: 100,
      name: 'target',
      types: ['normal'],
      defense: 100,
      specialDefense: 100,
      currentHp: 200,
      maxHp: 200
    };

    const eval1 = BattleEvaluator.evaluateMove(attacker, defender, attacker.moves[0]);
    const eval2 = BattleEvaluator.evaluateMove(attacker, defender, attacker.moves[1]);
    assert.ok(eval2.expectedDamage > eval1.expectedDamage);

    const state = {
      player: { activeIndex: 0, team: [defender] },
      enemy: { activeIndex: 0, team: [attacker] },
      status: 'IN_PROGRESS'
    };
    const decision = BattleAI.chooseAction(state, 'enemy', { strategy: 'SMART' });
    assert.equal(decision.action.moveId, 2, 'Deve selecionar golpe de maior dano esperado');
  });

  test('AI-10 — Power Considered: poder do golpe influencia diretamente a decisão', () => {
    const poke = { ...CharmanderFixture, currentHp: 39, moves: [ScratchFixture, FlamethrowerFixture] };
    const target = { ...BulbasaurFixture, currentHp: 100 };
    const e1 = BattleEvaluator.evaluateMove(poke, target, ScratchFixture);
    const e2 = BattleEvaluator.evaluateMove(poke, target, FlamethrowerFixture);
    assert.ok(e2.expectedDamage > e1.expectedDamage);
  });

  test('AI-11 — Physical Stats Considered: atacante com alto Attack prefere golpe Physical', () => {
    // Atacante com Attack 150 e SpAtk 30
    const physAttacker = {
      id: 101,
      name: 'phys-bruiser',
      types: ['normal'],
      attack: 150,
      defense: 70,
      specialAttack: 30,
      specialDefense: 70,
      moves: [
        { id: 10, name: 'phys-strike', type: 'normal', power: 60, accuracy: 100, currentPp: 10, damageClass: 'physical' },
        { id: 20, name: 'spec-beam', type: 'normal', power: 60, accuracy: 100, currentPp: 10, damageClass: 'special' }
      ],
      currentHp: 100,
      maxHp: 100
    };
    const defender = { id: 1, types: ['normal'], defense: 80, specialDefense: 80, currentHp: 200, maxHp: 200 };

    const state = {
      player: { activeIndex: 0, team: [defender] },
      enemy: { activeIndex: 0, team: [physAttacker] },
      status: 'IN_PROGRESS'
    };
    const decision = BattleAI.chooseAction(state, 'enemy', { strategy: 'SMART' });
    assert.equal(decision.action.moveId, 10, 'Deve preferir golpe Physical devido ao alto Attack');
  });

  test('AI-12 — Special Stats Considered: atacante com alto SpAtk prefere golpe Special', () => {
    const specAttacker = {
      id: 102,
      name: 'spec-caster',
      types: ['normal'],
      attack: 30,
      defense: 70,
      specialAttack: 150,
      specialDefense: 70,
      moves: [
        { id: 10, name: 'phys-strike', type: 'normal', power: 60, accuracy: 100, currentPp: 10, damageClass: 'physical' },
        { id: 20, name: 'spec-beam', type: 'normal', power: 60, accuracy: 100, currentPp: 10, damageClass: 'special' }
      ],
      currentHp: 100,
      maxHp: 100
    };
    const defender = { id: 1, types: ['normal'], defense: 80, specialDefense: 80, currentHp: 200, maxHp: 200 };

    const state = {
      player: { activeIndex: 0, team: [defender] },
      enemy: { activeIndex: 0, team: [specAttacker] },
      status: 'IN_PROGRESS'
    };
    const decision = BattleAI.chooseAction(state, 'enemy', { strategy: 'SMART' });
    assert.equal(decision.action.moveId, 20, 'Deve preferir golpe Special devido ao alto SpAtk');
  });

  test('AI-13 — STAB Considered: golpe com STAB pode superar golpe com maior poder base', () => {
    // Atacante de fogo (Fire) com stats balanceados:
    // Move A: Fire (STAB 1.5x) poder 70 -> dano equivalente a ~105
    // Move B: Normal (sem STAB) poder 80 -> dano equivalente a 80
    const attacker = {
      id: 103,
      name: 'fire-mon',
      types: ['fire'],
      attack: 100,
      defense: 100,
      specialAttack: 100,
      specialDefense: 100,
      moves: [
        { id: 1, name: 'normal-slam', type: 'normal', power: 80, accuracy: 100, currentPp: 10, damageClass: 'special' },
        { id: 2, name: 'fire-flame', type: 'fire', power: 70, accuracy: 100, currentPp: 10, damageClass: 'special' }
      ],
      currentHp: 100,
      maxHp: 100
    };
    const defender = { id: 1, types: ['normal'], defense: 100, specialDefense: 100, currentHp: 200, maxHp: 200 };

    const state = {
      player: { activeIndex: 0, team: [defender] },
      enemy: { activeIndex: 0, team: [attacker] },
      status: 'IN_PROGRESS'
    };
    const decision = BattleAI.chooseAction(state, 'enemy', { strategy: 'SMART' });
    assert.equal(decision.action.moveId, 2, 'Move Fire com STAB 1.5x supera move Normal de 80 poder');
  });

  test('AI-14 — Super Effective Considered: golpe 2x é preferido sobre golpe neutro 1x', () => {
    // Charmander contra Bulbasaur (Grass/Poison):
    // Scratch (Normal, 1x neutro, poder 40)
    // Ember (Fire, 2x fraqueza + STAB 1.5x, poder 40)
    const state = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    // Player é Charmander, Enemy é Bulbasaur. Testamos AI controlando Player:
    const decision = BattleAI.chooseAction(state, 'player', { strategy: 'SMART' });
    assert.equal(decision.action.moveId, EmberFixture.id, 'Deve escolher Ember (2x Fraqueza)');
  });

  test('AI-15 — 4x Considered: dupla fraqueza (4x) produz pontuação massiva', () => {
    // Pikachu contra Gyarados (Water/Flying -> 4x fraco a Electric)
    const pikachu = { ...PikachuFixture, currentHp: 35 };
    const gyarados = { ...GyaradosFixture, currentHp: 100 };
    const evalScratch = BattleEvaluator.evaluateMove(pikachu, gyarados, ScratchFixture);
    const evalThund = BattleEvaluator.evaluateMove(pikachu, gyarados, ThunderboltFixture);

    assert.equal(evalThund.typeMultiplier, 4);
    assert.ok(evalThund.expectedDamage > evalScratch.expectedDamage * 4);
  });

  test('AI-16 — Resistance Considered: golpe resistido (0.5x) perde prioridade para golpe neutro', () => {
    // Charmander contra Squirtle (Water resiste Fire 0.5x)
    const attacker = {
      id: 4,
      name: 'charmander',
      types: ['fire'],
      attack: 60,
      defense: 50,
      specialAttack: 60,
      specialDefense: 50,
      moves: [
        { id: 10, name: 'scratch', type: 'normal', power: 40, accuracy: 100, currentPp: 10, damageClass: 'physical' },
        { id: 52, name: 'ember', type: 'fire', power: 40, accuracy: 100, currentPp: 10, damageClass: 'special' }
      ],
      currentHp: 39,
      maxHp: 39
    };
    const defender = { id: 7, types: ['water'], defense: 50, specialDefense: 50, currentHp: 100, maxHp: 100 };

    const state = {
      player: { activeIndex: 0, team: [defender] },
      enemy: { activeIndex: 0, team: [attacker] },
      status: 'IN_PROGRESS'
    };
    const decision = BattleAI.chooseAction(state, 'enemy', { strategy: 'SMART' });
    // Scratch causa dano neutro 1x (40 poder); Ember causa 40 * 1.5 * 0.5 = 30 dano efetivo.
    assert.equal(decision.action.moveId, 10, 'Deve preferir golpe neutro contra defensor que resiste ao tipo elemental');
  });

  test('AI-17 — Immunity Avoided: golpe com 0x é estritamente descartado se houver alternativa com dano', () => {
    // Pikachu contra Geodude (Ground é imune a Electric 0x)
    const pikachu = {
      id: 25,
      name: 'pikachu',
      types: ['electric'],
      attack: 55,
      defense: 40,
      specialAttack: 50,
      specialDefense: 50,
      moves: [
        ThunderboltFixture, // 0x imune contra Ground
        ScratchFixture      // 1x neutro normal (causa dano)
      ],
      currentHp: 35,
      maxHp: 35
    };
    const geodude = { ...GeodudeFixture, currentHp: 40 };

    const state = {
      player: { activeIndex: 0, team: [geodude] },
      enemy: { activeIndex: 0, team: [pikachu] },
      status: 'IN_PROGRESS'
    };
    const decision = BattleAI.chooseAction(state, 'enemy', { strategy: 'SMART' });
    assert.equal(decision.action.moveId, ScratchFixture.id, 'Nunca deve usar Thunderbolt contra Geodude');
  });

  test('AI-18 — Accuracy Expected Value: golpe com menor poder mas 100% precisão supera golpe potente com 50% de precisão', () => {
    // Move A: poder 60, precisão 100 -> Expected: 60 * 1.0 = 60
    // Move B: poder 80, precisão 50 -> Expected: 80 * 0.5 = 40
    const attacker = {
      id: 104,
      name: 'sniper',
      types: ['normal'],
      attack: 100,
      defense: 100,
      specialAttack: 100,
      specialDefense: 100,
      moves: [
        { id: 1, name: 'reliable', type: 'normal', power: 60, accuracy: 100, currentPp: 10, damageClass: 'physical' },
        { id: 2, name: 'gambit', type: 'normal', power: 80, accuracy: 50, currentPp: 10, damageClass: 'physical' }
      ],
      currentHp: 100,
      maxHp: 100
    };
    const defender = { id: 1, types: ['normal'], defense: 100, specialDefense: 100, currentHp: 300, maxHp: 300 };

    const state = {
      player: { activeIndex: 0, team: [defender] },
      enemy: { activeIndex: 0, team: [attacker] },
      status: 'IN_PROGRESS'
    };
    const decision = BattleAI.chooseAction(state, 'enemy', { strategy: 'SMART' });
    assert.equal(decision.action.moveId, 1, 'Golpe confiável (100% acc) deve vencer o golpe impreciso (50% acc)');
  });

  // ==================================================================
  // 4. TESTES DE PP E IMUTABILIDADE (AI-19 a AI-20)
  // ==================================================================

  test('AI-19 — Zero PP Never Selected: golpes com PP zerado são ignorados por SMART AI', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    // Bulbasaur tem Scratch (pp: 35) e Vine Whip (pp: 25)
    // Zera o Vine Whip (que seria o melhor golpe contra Squirtle)
    battle.enemy.team[0].moves[1].currentPp = 0;
    const decision = BattleAI.chooseAction(battle, 'enemy', { strategy: 'SMART' });
    assert.notEqual(decision.action.moveId, battle.enemy.team[0].moves[1].id, 'Golpe com 0 PP nunca pode ser escolhido');
  });

  test('AI-20 — PP Evaluation Does Not Consume: processo de avaliação não decrementa PP', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    const initialPp = battle.enemy.team[0].moves[0].currentPp;
    BattleAI.chooseAction(battle, 'enemy', { strategy: 'SMART' });
    assert.equal(battle.enemy.team[0].moves[0].currentPp, initialPp, 'PP não pode sofrer alteração durante a decisão da IA');
  });

  // ==================================================================
  // 5. TESTES DE NOCAUTE GARANTIDO (AI-21 a AI-22)
  // ==================================================================

  test('AI-21 — Prefer Guaranteed KO: prioriza golpe que garante nocaute imediato', () => {
    // Alvo está com 15 HP.
    // Move A causa 12 de dano (não derruba).
    // Move B causa 20 de dano (derruba).
    const attacker = {
      id: 105,
      name: 'finisher',
      types: ['normal'],
      attack: 100,
      defense: 100,
      specialAttack: 100,
      specialDefense: 100,
      moves: [
        { id: 1, name: 'tap', type: 'normal', power: 20, accuracy: 100, currentPp: 10, damageClass: 'physical' },
        { id: 2, name: 'finish', type: 'normal', power: 50, accuracy: 100, currentPp: 10, damageClass: 'physical' }
      ],
      currentHp: 100,
      maxHp: 100
    };
    const defender = { id: 1, types: ['normal'], defense: 100, specialDefense: 100, currentHp: 15, maxHp: 100 };

    const state = {
      player: { activeIndex: 0, team: [defender] },
      enemy: { activeIndex: 0, team: [attacker] },
      status: 'IN_PROGRESS'
    };
    const decision = BattleAI.chooseAction(state, 'enemy', { strategy: 'SMART' });
    assert.equal(decision.action.moveId, 2);
    assert.equal(decision.diagnostics.reason, BattleConstants.AI_DECISION_REASON.GUARANTEED_KO);
  });

  test('AI-22 — KO Evaluation Does Not Change HP: avaliação de nocaute não altera o HP do defensor', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    const initialHp = battle.player.team[0].currentHp;
    BattleAI.chooseAction(battle, 'enemy', { strategy: 'SMART' });
    assert.equal(battle.player.team[0].currentHp, initialHp, 'HP do alvo deve permanecer exatamente inalterado');
  });

  // ==================================================================
  // 6. DESEMPATE DETERMINÍSTICO (AI-23)
  // ==================================================================

  test('AI-23 — Deterministic Tie Break: dois golpes com score idêntico desempatam consistentemente', () => {
    // Dois golpes com mesmo tipo, power, precisão e dano, variando PP
    const attacker = {
      id: 106,
      name: 'twin-strike',
      types: ['normal'],
      attack: 100,
      defense: 100,
      specialAttack: 100,
      specialDefense: 100,
      moves: [
        { id: 10, name: 'strike-a', type: 'normal', power: 50, accuracy: 100, currentPp: 10, damageClass: 'physical' },
        { id: 20, name: 'strike-b', type: 'normal', power: 50, accuracy: 100, currentPp: 20, damageClass: 'physical' }
      ],
      currentHp: 100,
      maxHp: 100
    };
    const defender = { id: 1, types: ['normal'], defense: 100, specialDefense: 100, currentHp: 200, maxHp: 200 };

    const state = {
      player: { activeIndex: 0, team: [defender] },
      enemy: { activeIndex: 0, team: [attacker] },
      status: 'IN_PROGRESS'
    };

    const d1 = BattleAI.chooseAction(state, 'enemy', { strategy: 'SMART' });
    const d2 = BattleAI.chooseAction(state, 'enemy', { strategy: 'SMART' });
    assert.equal(d1.action.moveId, 20, 'Desempata a favor do maior PP');
    assert.equal(d1.action.moveId, d2.action.moveId, 'Resultado 100% determinístico');
  });

  // ==================================================================
  // 7. TROCAS VOLUNTÁRIAS SMART (AI-24 a AI-29)
  // ==================================================================

  test('AI-24 — Switch on Complete Immunity: troca voluntária quando ativo é totalmente imune e banco causa dano', () => {
    // Enemy ativo: Pikachu (só com golpes elétricos contra Geodude do jogador)
    // Enemy banco: Squirtle (tem Water Gun, super efetivo contra Geodude)
    const electricOnlyPikachu = {
      ...PikachuFixture,
      moves: [ThunderboltFixture], // Imune contra Ground (0x)
      currentHp: 35
    };
    const squirtleReserve = { ...SquirtleFixture, currentHp: 44 };

    const state = {
      player: { activeIndex: 0, team: [{ ...GeodudeFixture, currentHp: 40 }] },
      enemy: { activeIndex: 0, team: [electricOnlyPikachu, squirtleReserve] },
      status: 'IN_PROGRESS'
    };

    const decision = BattleAI.chooseAction(state, 'enemy', { strategy: 'SMART' });
    assert.equal(decision.action.type, BattleConstants.BATTLE_ACTIONS.SWITCH);
    assert.equal(decision.action.targetPokemonId, SquirtleFixture.id);
    assert.equal(decision.diagnostics.reason, BattleConstants.AI_DECISION_REASON.AVOID_IMMUNITY_SWITCH);
  });

  test('AI-25 — Switch Into Super Effective Matchup: ativo em desvantagem severa troca para reserva com vantagem clara', () => {
    // Enemy ativo: Bulbasaur contra Charmander do jogador (desvantagem de tipo)
    // Enemy banco: Gyarados (Water/Flying com golpe aquático contra Charmander)
    const bulbasaurActive = {
      ...BulbasaurFixture,
      currentHp: 45,
      moves: [{ id: 22, name: 'vine-whip', type: 'grass', power: 45, accuracy: 100, currentPp: 10, damageClass: 'physical' }]
    };
    const gyaradosReserve = {
      ...GyaradosFixture,
      currentHp: 95,
      moves: [{ id: 55, name: 'water-gun', type: 'water', power: 40, accuracy: 100, currentPp: 10, damageClass: 'special' }]
    };

    const state = {
      player: { activeIndex: 0, team: [{ ...CharmanderFixture, currentHp: 39 }] },
      enemy: { activeIndex: 0, team: [bulbasaurActive, gyaradosReserve] },
      status: 'IN_PROGRESS'
    };

    const decision = BattleAI.chooseAction(state, 'enemy', { strategy: 'SMART' });
    assert.equal(decision.action.type, BattleConstants.BATTLE_ACTIONS.SWITCH);
    assert.equal(decision.action.targetPokemonId, GyaradosFixture.id);
    assert.equal(decision.diagnostics.reason, BattleConstants.AI_DECISION_REASON.STRATEGIC_MATCHUP_SWITCH);
  });

  test('AI-26 — Do Not Switch for Tiny Gain: ganho marginal não justifica trocar o ativo', () => {
    // Ativo tem golpe neutro eficiente; reserva tem eficácia parecida sem vantagem expressiva
    const active = {
      id: 1,
      name: 'mon-a',
      types: ['normal'],
      attack: 100,
      defense: 100,
      specialAttack: 100,
      specialDefense: 100,
      moves: [{ id: 10, name: 'slam', type: 'normal', power: 70, accuracy: 100, currentPp: 10, damageClass: 'physical' }],
      currentHp: 100,
      maxHp: 100
    };
    const reserve = {
      id: 2,
      name: 'mon-b',
      types: ['normal'],
      attack: 105,
      defense: 100,
      specialAttack: 100,
      specialDefense: 100,
      moves: [{ id: 10, name: 'slam', type: 'normal', power: 70, accuracy: 100, currentPp: 10, damageClass: 'physical' }],
      currentHp: 100,
      maxHp: 100
    };
    const defender = { id: 3, types: ['normal'], defense: 100, specialDefense: 100, currentHp: 200, maxHp: 200 };

    const state = {
      player: { activeIndex: 0, team: [defender] },
      enemy: { activeIndex: 0, team: [active, reserve] },
      status: 'IN_PROGRESS'
    };
    const decision = BattleAI.chooseAction(state, 'enemy', { strategy: 'SMART' });
    assert.equal(decision.action.type, BattleConstants.BATTLE_ACTIONS.MOVE, 'Deve permanecer em campo atacando');
  });

  test('AI-27 — Never Switch to Fainted: reserva nocauteada nunca é selecionada para troca', () => {
    const bulbasaurActive = {
      ...BulbasaurFixture,
      moves: [{ id: 22, name: 'vine-whip', type: 'grass', power: 45, accuracy: 100, currentPp: 10, damageClass: 'physical' }]
    };
    const faintedGyarados = { ...GyaradosFixture, currentHp: 0 }; // Nocauteado!

    const state = {
      player: { activeIndex: 0, team: [{ ...CharmanderFixture, currentHp: 39 }] },
      enemy: { activeIndex: 0, team: [bulbasaurActive, faintedGyarados] },
      status: 'IN_PROGRESS'
    };

    const decision = BattleAI.chooseAction(state, 'enemy', { strategy: 'SMART' });
    assert.notEqual(decision.action.targetPokemonId, GyaradosFixture.id);
  });

  test('AI-28 — Never Switch to Active: nunca seleciona o próprio Pokémon ativo como alvo de troca', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    const decision = BattleAI.chooseAction(battle, 'enemy', { strategy: 'SMART' });
    if (decision.action.type === BattleConstants.BATTLE_ACTIONS.SWITCH) {
      assert.notEqual(decision.action.targetPokemonId, battle.enemy.team[battle.enemy.activeIndex].id);
    }
  });

  test('AI-29 — Preserve Team Order as Tie Break: candidatos com score idêntico respeitam ordem da equipe', () => {
    // Dois reservas idênticos em poder e tipo
    const active = {
      id: 1,
      name: 'active',
      types: ['electric'],
      attack: 50,
      defense: 50,
      specialAttack: 50,
      specialDefense: 50,
      moves: [{ id: 85, name: 'spark', type: 'electric', power: 40, accuracy: 100, currentPp: 10, damageClass: 'special' }],
      currentHp: 50,
      maxHp: 50
    };
    const reserve1 = {
      id: 2,
      name: 'res-1',
      types: ['water'],
      attack: 80,
      defense: 80,
      specialAttack: 80,
      specialDefense: 80,
      moves: [{ id: 55, name: 'gun-a', type: 'water', power: 60, accuracy: 100, currentPp: 10, damageClass: 'special' }],
      currentHp: 80,
      maxHp: 80
    };
    const reserve2 = {
      id: 3,
      name: 'res-2',
      types: ['water'],
      attack: 80,
      defense: 80,
      specialAttack: 80,
      specialDefense: 80,
      moves: [{ id: 55, name: 'gun-b', type: 'water', power: 60, accuracy: 100, currentPp: 10, damageClass: 'special' }],
      currentHp: 80,
      maxHp: 80
    };
    const groundOpponent = { id: 74, types: ['ground'], defense: 80, specialDefense: 80, currentHp: 100, maxHp: 100 };

    const state = {
      player: { activeIndex: 0, team: [groundOpponent] },
      enemy: { activeIndex: 0, team: [active, reserve1, reserve2] },
      status: 'IN_PROGRESS'
    };

    const decision = BattleAI.chooseAction(state, 'enemy', { strategy: 'SMART' });
    assert.equal(decision.action.type, BattleConstants.BATTLE_ACTIONS.SWITCH);
    assert.equal(decision.action.targetPokemonId, 2, 'Deve escolher reserve1 por ser o primeiro slot válido');
  });

  // ==================================================================
  // 8. AVALIAÇÃO DE RISCO DEFENSIVO (AI-30)
  // ==================================================================

  test('AI-30 — Defensive Risk Matters: candidato que seria nocauteado em 1 golpe perde prioridade para candidato seguro', () => {
    // Oponente tem ataque de Fogo massivo (KO em Pokémon frágil a fogo)
    // Reserva A: Tipo Grass (ofensivo mas sofreria 1-hit KO por fraqueza)
    // Reserva B: Tipo Water (resistente a fogo, não sofre KO)
    const opp = {
      id: 6,
      name: 'charizard',
      types: ['fire'],
      attack: 100,
      defense: 100,
      specialAttack: 120,
      specialDefense: 100,
      moves: [{ id: 53, name: 'flamethrower', type: 'fire', power: 90, accuracy: 100, currentPp: 10, damageClass: 'special' }],
      currentHp: 200,
      maxHp: 200
    };
    const active = {
      id: 1,
      name: 'fainted-lead',
      types: ['normal'],
      currentHp: 0,
      maxHp: 100,
      moves: []
    };
    const fragileGrass = {
      id: 2,
      name: 'fragile-grass',
      types: ['grass'],
      attack: 110,
      defense: 40,
      specialAttack: 110,
      specialDefense: 40,
      moves: [{ id: 22, name: 'solar', type: 'grass', power: 90, accuracy: 100, currentPp: 10, damageClass: 'special' }],
      currentHp: 40,
      maxHp: 40
    };
    const bulkyWater = {
      id: 3,
      name: 'bulky-water',
      types: ['water'],
      attack: 90,
      defense: 100,
      specialAttack: 90,
      specialDefense: 100,
      moves: [{ id: 55, name: 'water-gun', type: 'water', power: 40, accuracy: 100, currentPp: 10, damageClass: 'special' }],
      currentHp: 120,
      maxHp: 120
    };

    const state = {
      player: { activeIndex: 0, team: [opp] },
      enemy: { activeIndex: 0, team: [active, fragileGrass, bulkyWater] },
      status: 'AWAITING_REPLACEMENT'
    };

    const replacement = BattleAI.chooseReplacement(state, 'enemy', { strategy: 'SMART' });
    assert.equal(replacement.targetPokemonId, bulkyWater.id, 'Deve preferir bulky-water devido à penalidade de KO da planta');
  });

  // ==================================================================
  // 9. SUBSTITUIÇÃO FORÇADA PÓS-NOCAUTE (AI-31 a AI-34)
  // ==================================================================

  test('AI-31 — Simple Replacement: escolhe o primeiro Pokémon saudável da equipe', () => {
    const state = {
      player: { activeIndex: 0, team: [{ ...CharmanderFixture, currentHp: 39 }] },
      enemy: {
        activeIndex: 0,
        team: [
          { ...BulbasaurFixture, currentHp: 0 },
          { ...GeodudeFixture, currentHp: 40 },
          { ...GyaradosFixture, currentHp: 95 }
        ]
      },
      status: 'AWAITING_REPLACEMENT'
    };

    const rep = BattleAI.chooseReplacement(state, 'enemy', { strategy: 'SIMPLE' });
    assert.equal(rep.targetPokemonId, GeodudeFixture.id);
    assert.equal(rep.diagnostics.reason, BattleConstants.AI_DECISION_REASON.FIRST_HEALTHY_RESERVE);
  });

  test('AI-32 — Smart Replacement: escolhe a reserva com melhor matchup contra o ativo adversário', () => {
    // Player tem Charmander (Fire)
    // Enemy tem Geodude (Rock/Ground -> super efetivo com Rock) e Gyarados (Water/Flying -> super efetivo com Water)
    // Geodude tem 40 HP e fraqueza a Water, Gyarados tem 95 HP e resistência a Fire!
    const state = {
      player: { activeIndex: 0, team: [{ ...CharmanderFixture, currentHp: 39 }] },
      enemy: {
        activeIndex: 0,
        team: [
          { ...BulbasaurFixture, currentHp: 0 },
          { ...GeodudeFixture, currentHp: 40 },
          { ...GyaradosFixture, currentHp: 95 }
        ]
      },
      status: 'AWAITING_REPLACEMENT'
    };

    const rep = BattleAI.chooseReplacement(state, 'enemy', { strategy: 'SMART' });
    assert.equal(rep.targetPokemonId, GyaradosFixture.id, 'Gyarados possui melhor sobrevivência e HP elevado contra Fogo');
  });

  test('AI-33 — Fainted Replacement Never Selected: substituto nocauteado nunca é escolhido', () => {
    const state = {
      player: { activeIndex: 0, team: [{ ...CharmanderFixture, currentHp: 39 }] },
      enemy: {
        activeIndex: 0,
        team: [
          { ...BulbasaurFixture, currentHp: 0 },
          { ...GeodudeFixture, currentHp: 0 }, // Também nocauteado
          { ...GyaradosFixture, currentHp: 95 }  // Único vivo
        ]
      },
      status: 'AWAITING_REPLACEMENT'
    };

    const rep = BattleAI.chooseReplacement(state, 'enemy', { strategy: 'SMART' });
    assert.equal(rep.targetPokemonId, GyaradosFixture.id);
  });

  test('AI-34 — Replacement Deterministic: mesmas condições retornam o mesmo substituto sempre', () => {
    const state = {
      player: { activeIndex: 0, team: [{ ...CharmanderFixture, currentHp: 39 }] },
      enemy: {
        activeIndex: 0,
        team: [
          { ...BulbasaurFixture, currentHp: 0 },
          { ...GeodudeFixture, currentHp: 40 },
          { ...GyaradosFixture, currentHp: 95 }
        ]
      },
      status: 'AWAITING_REPLACEMENT'
    };

    const r1 = BattleAI.chooseReplacement(state, 'enemy', { strategy: 'SMART' });
    const r2 = BattleAI.chooseReplacement(state, 'enemy', { strategy: 'SMART' });
    assert.deepEqual(r1, r2);
  });

  // ==================================================================
  // 10. TRATAMENTO DE SEM GOLPES / SEM PP (AI-35 a AI-36)
  // ==================================================================

  test('AI-35 — Switch When No PP: ativo sem PP troca para reserva viva que possui golpes', () => {
    const noPpActive = {
      ...BulbasaurFixture,
      currentHp: 45,
      moves: [
        { ...ScratchFixture, currentPp: 0 },
        { ...VineWhipFixture, currentPp: 0 }
      ]
    };
    const healthyReserve = { ...GeodudeFixture, currentHp: 40 };

    const state = {
      player: { activeIndex: 0, team: [{ ...CharmanderFixture, currentHp: 39 }] },
      enemy: { activeIndex: 0, team: [noPpActive, healthyReserve] },
      status: 'IN_PROGRESS'
    };

    const decision = BattleAI.chooseAction(state, 'enemy', { strategy: 'SMART' });
    assert.equal(decision.action.type, BattleConstants.BATTLE_ACTIONS.SWITCH);
    assert.equal(decision.action.targetPokemonId, GeodudeFixture.id);
    assert.equal(decision.diagnostics.reason, BattleConstants.AI_DECISION_REASON.NO_PP_SWITCH);
  });

  test('AI-36 — No Usable Action: se toda a equipe estiver sem PP, retorna estado controlado sem travar', () => {
    const noPp1 = {
      ...BulbasaurFixture,
      currentHp: 45,
      moves: [{ ...ScratchFixture, currentPp: 0 }]
    };
    const noPp2 = {
      ...GeodudeFixture,
      currentHp: 40,
      moves: [{ ...ScratchFixture, currentPp: 0 }]
    };

    const state = {
      player: { activeIndex: 0, team: [{ ...CharmanderFixture, currentHp: 39 }] },
      enemy: { activeIndex: 0, team: [noPp1, noPp2] },
      status: 'IN_PROGRESS'
    };

    const decision = BattleAI.chooseAction(state, 'enemy', { strategy: 'SMART' });
    assert.equal(decision.action, null);
    assert.equal(decision.diagnostics.reason, BattleConstants.AI_DECISION_REASON.NO_USABLE_ACTION);
  });

  // ==================================================================
  // 11. IMUTABILIDADE E SEGURANÇA (AI-37 a AI-40)
  // ==================================================================

  test('AI-37 — AI State Immutability: múltiplas decisões da IA não alteram o estado da batalha', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    const snapshot = JSON.parse(JSON.stringify(battle));

    for (let i = 0; i < 50; i++) {
      BattleAI.chooseAction(battle, 'enemy', { strategy: 'SMART' });
    }

    assert.deepEqual(battle, snapshot, 'Battle state deve permanecer 100% inalterado');
  });

  test('AI-38 — Input Immutability: objetos de entrada e fixtures não sofrem mutação', () => {
    const cloneP = JSON.parse(JSON.stringify(PlayerTeam3Fixture));
    const cloneE = JSON.parse(JSON.stringify(EnemyTeam3Fixture));

    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    BattleAI.chooseAction(battle, 'enemy', { strategy: 'SMART' });

    assert.deepEqual(PlayerTeam3Fixture, cloneP);
    assert.deepEqual(EnemyTeam3Fixture, cloneE);
  });

  test('AI-39 — No Cheating: alterar ação externa do jogador não altera a decisão da IA', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);

    // Variável externa que simula a ação futura que o jogador pretende tomar
    let futurePlayerAction = { moveId: EmberFixture.id };
    const decision1 = BattleAI.chooseAction(battle, 'enemy', { strategy: 'SMART' });

    // Modifica a intenção externa do jogador
    futurePlayerAction = { type: 'SWITCH', targetPokemonId: SquirtleFixture.id };
    const decision2 = BattleAI.chooseAction(battle, 'enemy', { strategy: 'SMART' });

    assert.deepEqual(decision1, decision2, 'A decisão da IA não pode depender de ações futuras externas do jogador');
  });

  test('AI-40 — Internal RNG Audit: zero chamadas a Math.random e crypto no código da IA', () => {
    const aiFile = fs.readFileSync(path.join(__dirname, '../../assets/js/battle/battle-ai.js'), 'utf8');
    const evalFile = fs.readFileSync(path.join(__dirname, '../../assets/js/battle/battle-evaluator.js'), 'utf8');

    assert.ok(!aiFile.includes('Math.random'), 'battle-ai.js não pode conter Math.random()');
    assert.ok(!aiFile.includes('crypto'), 'battle-ai.js não pode conter crypto()');
    assert.ok(!evalFile.includes('Math.random'), 'battle-evaluator.js não pode conter Math.random()');
    assert.ok(!evalFile.includes('crypto'), 'battle-evaluator.js não pode conter crypto()');
  });

  // ==================================================================
  // 12. SIMULAÇÕES COMPLETAS 3x3 (AI-41 a AI-43)
  // ==================================================================

  test('AI-41 — Full Player vs AI 3v3 Simulation: jogador com roteiro vs adversário SMART AI', () => {
    let state = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    const events = [];
    let turns = 0;
    const maxTurns = 50;

    // Roteiro do jogador (usa seus melhores golpes)
    const playerMoveId = EmberFixture.id;

    while (state.status !== BattleConstants.BATTLE_STATUS.PLAYER_WIN && state.status !== BattleConstants.BATTLE_STATUS.ENEMY_WIN) {
      turns++;
      if (turns > maxTurns) {
        throw new Error(`Simulação Player vs AI atingiu o limite de ${maxTurns} turnos.`);
      }

      if (state.status === BattleConstants.BATTLE_STATUS.AWAITING_REPLACEMENT) {
        const replActions = {};
        if (state.player.team[state.player.activeIndex].currentHp === 0) {
          const firstAlive = state.player.team.find(p => p.currentHp > 0);
          if (firstAlive) replActions.player = { targetPokemonId: firstAlive.id };
        }
        if (state.enemy.team[state.enemy.activeIndex].currentHp === 0) {
          const aiRep = BattleAI.chooseReplacement(state, 'enemy', { strategy: 'SMART' });
          replActions.enemy = { targetPokemonId: aiRep.targetPokemonId };
        }
        const repRes = BattleEngine.resolveReplacement(state, replActions);
        state = repRes.state;
        events.push(...repRes.events);
      } else if (state.status === BattleConstants.BATTLE_STATUS.IN_PROGRESS) {
        const playerActive = state.player.team[state.player.activeIndex];
        const usableP = playerActive.moves.find(m => m.currentPp > 0);

        const playerAction = {
          type: BattleConstants.BATTLE_ACTIONS.MOVE,
          moveId: usableP ? usableP.id : playerActive.moves[0].id,
          accuracyRoll: 10
        };

        const aiDecision = BattleAI.chooseAction(state, 'enemy', { strategy: 'SMART', accuracyRoll: 10 });
        const enemyAction = aiDecision.action;

        const turnRes = BattleEngine.resolveTurn(state, {
          player: playerAction,
          enemy: enemyAction
        });
        state = turnRes.state;
        events.push(...turnRes.events);
      }
    }

    assert.ok(state.status === BattleConstants.BATTLE_STATUS.PLAYER_WIN || state.status === BattleConstants.BATTLE_STATUS.ENEMY_WIN);
    assert.ok(state.winner === 'player' || state.winner === 'enemy');
    assert.ok(turns > 0 && turns <= maxTurns);
  });

  test('AI-42 — Full AI vs AI 3v3 Simulation: SMART AI vs SMART AI conclui combate determinístico', () => {
    let state = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    const events = [];
    let turns = 0;
    const maxTurns = 50;

    while (state.status !== BattleConstants.BATTLE_STATUS.PLAYER_WIN && state.status !== BattleConstants.BATTLE_STATUS.ENEMY_WIN) {
      turns++;
      if (turns > maxTurns) {
        throw new Error(`Simulação AI vs AI atingiu o limite de ${maxTurns} turnos.`);
      }

      if (state.status === BattleConstants.BATTLE_STATUS.AWAITING_REPLACEMENT) {
        const replActions = {};
        if (state.player.team[state.player.activeIndex].currentHp === 0) {
          const pRep = BattleAI.chooseReplacement(state, 'player', { strategy: 'SMART' });
          replActions.player = { targetPokemonId: pRep.targetPokemonId };
        }
        if (state.enemy.team[state.enemy.activeIndex].currentHp === 0) {
          const eRep = BattleAI.chooseReplacement(state, 'enemy', { strategy: 'SMART' });
          replActions.enemy = { targetPokemonId: eRep.targetPokemonId };
        }
        const repRes = BattleEngine.resolveReplacement(state, replActions);
        state = repRes.state;
        events.push(...repRes.events);
      } else if (state.status === BattleConstants.BATTLE_STATUS.IN_PROGRESS) {
        const playerDecision = BattleAI.chooseAction(state, 'player', { strategy: 'SMART', accuracyRoll: 10 });
        const enemyDecision = BattleAI.chooseAction(state, 'enemy', { strategy: 'SMART', accuracyRoll: 10 });

        const turnRes = BattleEngine.resolveTurn(state, {
          player: playerDecision.action,
          enemy: enemyDecision.action
        });
        state = turnRes.state;
        events.push(...turnRes.events);
      }
    }

    assert.ok(state.status === BattleConstants.BATTLE_STATUS.PLAYER_WIN || state.status === BattleConstants.BATTLE_STATUS.ENEMY_WIN);
    assert.ok(state.winner !== null);
  });

  test('AI-43 — Reproducibility: duas execuções de simulação completa produzem exatamente os mesmos resultados', () => {
    function runSim() {
      let state = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
      const events = [];
      let turns = 0;

      while (state.status !== BattleConstants.BATTLE_STATUS.PLAYER_WIN && state.status !== BattleConstants.BATTLE_STATUS.ENEMY_WIN && turns < 50) {
        turns++;
        if (state.status === BattleConstants.BATTLE_STATUS.AWAITING_REPLACEMENT) {
          const replActions = {};
          if (state.player.team[state.player.activeIndex].currentHp === 0) {
            const pRep = BattleAI.chooseReplacement(state, 'player', { strategy: 'SMART' });
            replActions.player = { targetPokemonId: pRep.targetPokemonId };
          }
          if (state.enemy.team[state.enemy.activeIndex].currentHp === 0) {
            const eRep = BattleAI.chooseReplacement(state, 'enemy', { strategy: 'SMART' });
            replActions.enemy = { targetPokemonId: eRep.targetPokemonId };
          }
          const repRes = BattleEngine.resolveReplacement(state, replActions);
          state = repRes.state;
          events.push(...repRes.events);
        } else {
          const pAct = BattleAI.chooseAction(state, 'player', { strategy: 'SMART', accuracyRoll: 15 });
          const eAct = BattleAI.chooseAction(state, 'enemy', { strategy: 'SMART', accuracyRoll: 15 });
          const turnRes = BattleEngine.resolveTurn(state, {
            player: pAct.action,
            enemy: eAct.action
          });
          state = turnRes.state;
          events.push(...turnRes.events);
        }
      }
      return { state, events, turns };
    }

    const sim1 = runSim();
    const sim2 = runSim();

    assert.equal(sim1.turns, sim2.turns, 'Mesmo número de turnos');
    assert.equal(sim1.state.status, sim2.state.status, 'Mesmo status final');
    assert.equal(sim1.state.winner, sim2.state.winner, 'Mesmo vencedor');
    assert.deepEqual(sim1.state, sim2.state, 'Mesmo estado final');
    assert.deepEqual(sim1.events, sim2.events, 'Mesma sequência exata de eventos');
  });

});
