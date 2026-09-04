/**
 * ====================================================================
 * SUÍTE DE TESTES AUTOMATIZADOS: BATTLE ENGINE V1 + TYPE SYSTEM
 * (battle-engine.test.js)
 * ====================================================================
 * Validação rigorosa dos gates E01 a E18 e TY21 a TY25, além da Simulação Completa.
 * Execução com Node.js nativo (node --test).
 * 
 * Critérios:
 * - 100% offline (sem PokéAPI);
 * - Sem dependência de DOM;
 * - Sem dependência de LocalStorage;
 * - Sem dependência de áudio;
 * - Determinístico e imutável;
 * - Efetividade de tipos integrada ao ciclo de combate.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const BattleConstants = require('../../assets/js/battle/battle-constants.js');
const DamageCalculator = require('../../assets/js/battle/damage-calculator.js');
const TurnManager = require('../../assets/js/battle/turn-manager.js');
const BattleEngine = require('../../assets/js/battle/battle-engine.js');

const {
  CharmanderFixture,
  BulbasaurFixture,
  SquirtleFixture,
  PikachuFixture,
  HighDefenseFixture,
  LowDefenseFixture,
  HighAttackFixture,
  LowAttackFixture,
  SpeedTieWithCharmanderFixture,
  FragileOneHpFixture,
  GyaradosFixture,
  SwampertFixture,
  ScizorFixture,
  CharizardFixture,
  KingdraFixture,
  GastlyFixture,
  GeodudeFixture,
  ClefairyFixture
} = require('../fixtures/pokemon-fixtures.js');

describe('PHASE PBA-003 & PBA-004 — BATTLE ENGINE & TYPE SYSTEM SUITE', () => {

  // --- E01: CREATE BATTLE ---
  test('E01 — Create Battle: inicializa batalha válida com dados corretos', () => {
    const battle = BattleEngine.createBattle(CharmanderFixture, BulbasaurFixture);

    assert.equal(battle.version, 1, 'Versão do estado de batalha deve ser 1');
    assert.equal(battle.status, BattleConstants.BATTLE_STATUS.IN_PROGRESS, 'Status inicial deve ser IN_PROGRESS');
    assert.ok(battle.turn >= 1, 'Turno deve ser inicializado');
    assert.equal(battle.winner, null, 'Vencedor inicial deve ser null');
    assert.equal(battle.player.currentHp, battle.player.maxHp, 'Player HP inicial deve ser igual a maxHp');
    assert.equal(battle.enemy.currentHp, battle.enemy.maxHp, 'Enemy HP inicial deve ser igual a maxHp');
    assert.deepEqual(battle.player.types, ['fire'], 'Tipos do jogador devem ser inicializados');
    assert.deepEqual(battle.enemy.types, ['grass', 'poison'], 'Tipos do adversário devem ser inicializados');
  });

  // --- E02: INVALID COMBATANT ---
  test('E02 — Invalid Combatant: rejeita dados inválidos com segurança sem gerar NaN', () => {
    const invalidInputs = [
      null,
      undefined,
      {},
      { id: 'abc', name: 'poke', types: ['fire'] }, // id inválido
      { id: 1, name: '', types: ['fire'] }, // nome vazio
      { id: 1, name: 'poke', stats: { hp: 10, attack: 10, defense: 10, speed: 10 } }, // tipos ausentes
      { id: 1, name: 'poke', types: [], stats: { hp: 10, attack: 10, defense: 10, speed: 10 } }, // tipos vazios
      { id: 1, name: 'poke', types: ['shadow'], stats: { hp: 10, attack: 10, defense: 10, speed: 10 } }, // tipo desconhecido
      { id: 1, name: 'poke', types: ['fire', 'fire'], stats: { hp: 10, attack: 10, defense: 10, speed: 10 } }, // tipos duplicados
      { id: 1, name: 'poke', types: ['fire', 'water', 'grass'], stats: { hp: 10, attack: 10, defense: 10, speed: 10 } }, // > 2 tipos
      { id: 1, name: 'poke', types: ['fire'], stats: { hp: 0, attack: 10, defense: 10, speed: 10 } }, // hp <= 0
      { id: 1, name: 'poke', types: ['fire'], stats: { hp: -5, attack: 10, defense: 10, speed: 10 } }, // hp negativo
      { id: 1, name: 'poke', types: ['fire'], stats: { hp: 10, attack: 0, defense: 10, speed: 10 } }, // attack <= 0
      { id: 1, name: 'poke', types: ['fire'], stats: { hp: 10, attack: 10, defense: -2, speed: 10 } }, // defense <= 0
      { id: 1, name: 'poke', types: ['fire'], stats: { hp: 10, attack: 10, defense: 10, speed: -1 } }, // speed < 0
      { id: 1, name: 'poke', types: ['fire'], stats: { hp: NaN, attack: 10, defense: 10, speed: 10 } }, // NaN
      { id: 1, name: 'poke', types: ['fire'], stats: { hp: 10, attack: Infinity, defense: 10, speed: 10 } }, // Infinity
    ];

    for (const invalid of invalidInputs) {
      assert.throws(
        () => BattleEngine.createCombatant(invalid),
        /Combatente inválido|ID do combatente|Nome do combatente|HP do combatente|Ataque do combatente|Defesa do combatente|Velocidade do combatente|Tipos do combatente|Tipo|Quantidade de tipos/,
        `Deveria lançar erro para input inválido: ${JSON.stringify(invalid)}`
      );
    }

    // Não permite criação de batalha com combatente inválido
    assert.throws(() => {
      BattleEngine.createBattle(null, BulbasaurFixture);
    });
  });

  // --- E03: HP INITIALIZATION ---
  test('E03 — HP Initialization: currentHp é rigorosamente igual a maxHp', () => {
    const combatant = BattleEngine.createCombatant(CharmanderFixture);
    assert.equal(combatant.maxHp, CharmanderFixture.stats.hp);
    assert.equal(combatant.currentHp, combatant.maxHp);
  });

  // --- E04: PLAYER FASTER ---
  test('E04 — Player Faster: jogador com maior velocidade atua primeiro', () => {
    // Charmander (Speed 65) vs Bulbasaur (Speed 45)
    const order = TurnManager.determineOrder(
      { speed: CharmanderFixture.stats.speed },
      { speed: BulbasaurFixture.stats.speed }
    );
    assert.deepEqual(order, ['player', 'enemy']);

    const battle = BattleEngine.createBattle(CharmanderFixture, BulbasaurFixture);
    const { events } = BattleEngine.resolveTurn(battle);
    const firstAction = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.ACTION_STARTED);
    assert.equal(firstAction.actor, 'player', 'Primeiro a agir deve ser o jogador');
  });

  // --- E05: ENEMY FASTER ---
  test('E05 — Enemy Faster: adversário com maior velocidade atua primeiro', () => {
    // Bulbasaur (Speed 45) vs Pikachu (Speed 90)
    const order = TurnManager.determineOrder(
      { speed: BulbasaurFixture.stats.speed },
      { speed: PikachuFixture.stats.speed }
    );
    assert.deepEqual(order, ['enemy', 'player']);

    const battle = BattleEngine.createBattle(BulbasaurFixture, PikachuFixture);
    const { events } = BattleEngine.resolveTurn(battle);
    const firstAction = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.ACTION_STARTED);
    assert.equal(firstAction.actor, 'enemy', 'Primeiro a agir deve ser o adversário');
  });

  // --- E06: SPEED TIE ---
  test('E06 — Speed Tie: desempate determinístico favorece jogador na PBA-003/PBA-004', () => {
    const order = TurnManager.determineOrder(
      { speed: 65 },
      { speed: 65 }
    );
    assert.deepEqual(order, ['player', 'enemy'], 'Em empate de velocidade, o jogador deve ser o primeiro');
  });

  // --- E07: MINIMUM DAMAGE ---
  test('E07 — Minimum Damage: mesmo com defesa massiva, o dano mínimo é sempre >= 1', () => {
    const damage = DamageCalculator.calculate(10, HighDefenseFixture.stats.defense);
    assert.ok(damage >= 1, `Dano calculado foi ${damage}, esperado >= 1`);
  });

  // --- E08: DEFENSE INFLUENCE ---
  test('E08 — Defense Influence: maior defesa reduz dano recebido', () => {
    const attackerAtk = 50;
    const damageVsLowDef = DamageCalculator.calculate(attackerAtk, LowDefenseFixture.stats.defense);
    const damageVsHighDef = DamageCalculator.calculate(attackerAtk, HighDefenseFixture.stats.defense);

    assert.ok(
      damageVsLowDef > damageVsHighDef,
      `Dano contra defesa baixa (${damageVsLowDef}) deve ser maior que contra defesa alta (${damageVsHighDef})`
    );
  });

  // --- E09: ATTACK INFLUENCE ---
  test('E09 — Attack Influence: maior ataque produz maior dano', () => {
    const targetDef = 50;
    const damageHighAtk = DamageCalculator.calculate(HighAttackFixture.stats.attack, targetDef);
    const damageLowAtk = DamageCalculator.calculate(LowAttackFixture.stats.attack, targetDef);

    assert.ok(
      damageHighAtk > damageLowAtk,
      `Dano com ataque alto (${damageHighAtk}) deve ser maior que com ataque baixo (${damageLowAtk})`
    );
  });

  // --- E10: HP FLOOR ---
  test('E10 — HP Floor: HP nunca atinge valor negativo (piso em 0)', () => {
    const battle = BattleEngine.createBattle(CharmanderFixture, FragileOneHpFixture);
    const { state } = BattleEngine.resolveTurn(battle);

    assert.equal(state.enemy.currentHp, 0, 'HP deve ser exatamente zero após nocaute');
    assert.ok(state.enemy.currentHp >= 0, 'HP nunca deve ser menor que zero');
  });

  // --- E11: FAINT STOPS COUNTERATTACK ---
  test('E11 — Faint Stops Counterattack: combatente nocauteado no 1º golpe não contra-ataca', () => {
    const battle = BattleEngine.createBattle(CharmanderFixture, FragileOneHpFixture);
    const { state, events } = BattleEngine.resolveTurn(battle);

    const actionEvents = events.filter(e => e.type === BattleConstants.BATTLE_EVENTS.ACTION_STARTED);
    assert.equal(actionEvents.length, 1, 'Deve haver apenas 1 ação de ataque no turno do nocaute');
    assert.equal(actionEvents[0].actor, 'player');
    assert.equal(state.player.currentHp, state.player.maxHp, 'Jogador não deve ter recebido contra-ataque');
  });

  // --- E12: PLAYER VICTORY ---
  test('E12 — Player Victory: registra vitória do jogador ao nocautear inimigo', () => {
    const battle = BattleEngine.createBattle(CharmanderFixture, FragileOneHpFixture);
    const { state } = BattleEngine.resolveTurn(battle);

    assert.equal(state.status, BattleConstants.BATTLE_STATUS.PLAYER_WIN);
    assert.equal(state.winner, 'player');
  });

  // --- E13: ENEMY VICTORY ---
  test('E13 — Enemy Victory: registra vitória do inimigo ao nocautear jogador', () => {
    const battle = BattleEngine.createBattle(FragileOneHpFixture, PikachuFixture);
    const { state } = BattleEngine.resolveTurn(battle);

    assert.equal(state.status, BattleConstants.BATTLE_STATUS.ENEMY_WIN);
    assert.equal(state.winner, 'enemy');
  });

  // --- E14: NO TURN AFTER END ---
  test('E14 — No Turn After End: impede execução de turnos após encerramento da batalha', () => {
    const battle = BattleEngine.createBattle(CharmanderFixture, FragileOneHpFixture);
    const { state: endedState } = BattleEngine.resolveTurn(battle);

    assert.notEqual(endedState.status, BattleConstants.BATTLE_STATUS.IN_PROGRESS);

    const hpPlayerBefore = endedState.player.currentHp;
    const hpEnemyBefore = endedState.enemy.currentHp;
    const statusBefore = endedState.status;

    assert.throws(
      () => BattleEngine.resolveTurn(endedState),
      /Não é possível executar turno em uma batalha com status/
    );

    assert.equal(endedState.player.currentHp, hpPlayerBefore);
    assert.equal(endedState.enemy.currentHp, hpEnemyBefore);
    assert.equal(endedState.status, statusBefore);
  });

  // --- E15: EVENT ORDERING ---
  test('E15 — Event Ordering: eventos estruturados emitidos na ordem lógica exata (incluindo TYPE_EFFECTIVENESS_RESOLVED)', () => {
    const battle = BattleEngine.createBattle(CharmanderFixture, FragileOneHpFixture);
    const { events } = BattleEngine.resolveTurn(battle);

    const eventTypes = events.map(e => e.type);
    const expectedSequence = [
      BattleConstants.BATTLE_EVENTS.TURN_STARTED,
      BattleConstants.BATTLE_EVENTS.ACTION_STARTED,
      BattleConstants.BATTLE_EVENTS.MOVE_SELECTED,
      BattleConstants.BATTLE_EVENTS.MOVE_USED,
      BattleConstants.BATTLE_EVENTS.PP_CHANGED,
      BattleConstants.BATTLE_EVENTS.STAB_RESOLVED,
      BattleConstants.BATTLE_EVENTS.TYPE_EFFECTIVENESS_RESOLVED,
      BattleConstants.BATTLE_EVENTS.DAMAGE_APPLIED,
      BattleConstants.BATTLE_EVENTS.POKEMON_FAINTED,
      BattleConstants.BATTLE_EVENTS.BATTLE_ENDED
    ];

    assert.deepEqual(eventTypes, expectedSequence, 'Sequência de eventos com nocaute deve ser rigorosamente ordenada');

    // Valida propriedades do TYPE_EFFECTIVENESS_RESOLVED
    const typeEvent = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.TYPE_EFFECTIVENESS_RESOLVED);
    assert.equal(typeEvent.attackType, 'fire');
    assert.deepEqual(typeEvent.defenderTypes, ['normal']);
    assert.equal(typeEvent.multiplier, 1);

    // Valida propriedades do DAMAGE_APPLIED
    const damageEvent = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.DAMAGE_APPLIED);
    assert.ok(damageEvent.damage > 0);
    assert.equal(damageEvent.multiplier, 1);
    assert.equal(damageEvent.previousHp, 1);
    assert.equal(damageEvent.currentHp, 0);
  });

  // --- E16: DETERMINISM ---
  test('E16 — Determinism: mesmas entradas produzem exatamente o mesmo resultado e eventos', () => {
    const run1 = BattleEngine.simulateBattle(CharmanderFixture, BulbasaurFixture);
    const run2 = BattleEngine.simulateBattle(CharmanderFixture, BulbasaurFixture);

    assert.deepEqual(run1.state, run2.state, 'Os estados finais de duas simulações idênticas devem ser estritamente iguais');
    assert.deepEqual(run1.events, run2.events, 'Os eventos de duas simulações idênticas devem ser estritamente iguais');
    assert.equal(run1.totalTurns, run2.totalTurns, 'O número de turnos deve ser rigorosamente igual');
  });

  // --- E17: INPUT IMMUTABILITY ---
  test('E17 — Input Immutability: objetos de entrada não sofrem nenhuma alteração', () => {
    const sourceCharmander = {
      id: 4,
      name: 'charmander',
      types: ['fire'],
      stats: { hp: 39, attack: 52, defense: 43, specialAttack: 60, specialDefense: 50, speed: 65 },
      moves: [{ id: 52, name: 'ember', type: 'fire', power: 40, accuracy: 100, pp: 25, damageClass: 'special' }]
    };
    const sourceBulbasaur = {
      id: 1,
      name: 'bulbasaur',
      types: ['grass', 'poison'],
      stats: { hp: 45, attack: 49, defense: 49, specialAttack: 65, specialDefense: 65, speed: 45 },
      moves: [{ id: 22, name: 'vine-whip', type: 'grass', power: 45, accuracy: 100, pp: 25, damageClass: 'physical' }]
    };

    const cloneCharmander = JSON.parse(JSON.stringify(sourceCharmander));
    const cloneBulbasaur = JSON.parse(JSON.stringify(sourceBulbasaur));

    BattleEngine.simulateBattle(sourceCharmander, sourceBulbasaur);

    assert.deepEqual(sourceCharmander, cloneCharmander, 'Objeto original do Charmander não pode ser modificado');
    assert.deepEqual(sourceBulbasaur, cloneBulbasaur, 'Objeto original do Bulbasaur não pode ser modificado');
  });

  // --- E18: OFFLINE ENGINE ---
  test('E18 — Offline Engine: motor executa puramente sem chamadas de rede ou PokéAPI', () => {
    const originalFetch = global.fetch;
    global.fetch = () => {
      throw new Error('REDE BLOQUEADA: Battle Engine não pode invocar fetch!');
    };

    try {
      const result = BattleEngine.simulateBattle(CharmanderFixture, SquirtleFixture);
      assert.ok(result.state.winner !== null, 'Batalha deve ser resolvida 100% offline');
    } finally {
      global.fetch = originalFetch;
    }
  });

  // --- TY21: BATTLE USES TYPES ---
  test('TY21 — Battle Uses Types: fraqueza elemental altera decisivamente o dano na batalha real', () => {
    // Charmander (Fire) contra Scizor (Bug/Steel -> 4x fraqueza para Fire)
    const battleVsScizor = BattleEngine.createBattle(CharmanderFixture, ScizorFixture);
    const { events: eventsScizor } = BattleEngine.resolveTurn(battleVsScizor);
    const dmgScizor = eventsScizor.find(e => e.type === BattleConstants.BATTLE_EVENTS.DAMAGE_APPLIED && e.source === 'player');

    // Charmander (Fire) contra LowDefense (Normal -> 1x neutro) com mesma defesa
    const neutralTarget = {
      id: 990,
      name: 'neutral-target',
      types: ['normal'],
      stats: { hp: 100, attack: 10, defense: ScizorFixture.stats.defense, speed: 10 },
      moves: [{ id: 10, name: 'scratch', type: 'normal', power: 40, accuracy: 100, pp: 35, damageClass: 'physical' }]
    };
    const battleVsNeutral = BattleEngine.createBattle(CharmanderFixture, neutralTarget);
    const { events: eventsNeutral } = BattleEngine.resolveTurn(battleVsNeutral);
    const dmgNeutral = eventsNeutral.find(e => e.type === BattleConstants.BATTLE_EVENTS.DAMAGE_APPLIED && e.source === 'player');

    assert.ok(
      dmgScizor.damage > dmgNeutral.damage,
      `Dano 4x no Scizor (${dmgScizor.damage}) deve ser estritamente maior que no alvo neutro (${dmgNeutral.damage})`
    );
    assert.equal(dmgScizor.multiplier, 4, 'Multiplicador contra Scizor deve ser 4');
  });

  // --- TY22: EFFECTIVENESS EVENT ---
  test('TY22 — Effectiveness Event: evento TYPE_EFFECTIVENESS_RESOLVED contém payload completo', () => {
    const battle = BattleEngine.createBattle(PikachuFixture, GyaradosFixture);
    const { events } = BattleEngine.resolveTurn(battle);

    const typeEvent = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.TYPE_EFFECTIVENESS_RESOLVED && e.source === 'player');
    assert.ok(typeEvent, 'Evento TYPE_EFFECTIVENESS_RESOLVED deve existir');
    assert.equal(typeEvent.source, 'player');
    assert.equal(typeEvent.target, 'enemy');
    assert.equal(typeEvent.attackType, 'electric');
    assert.deepEqual(typeEvent.defenderTypes, ['water', 'flying']);
    assert.equal(typeEvent.multiplier, 4);
    assert.equal(typeEvent.classification, BattleConstants.TYPE_EFFECTIVENESS_CLASSIFICATION.SUPER_EFFECTIVE);
  });

  // --- TY23: EVENT ORDERING IN COMBAT ACTION ---
  test('TY23 — Event Ordering: ACTION_STARTED -> TYPE_EFFECTIVENESS_RESOLVED -> DAMAGE_APPLIED', () => {
    const battle = BattleEngine.createBattle(SquirtleFixture, CharmanderFixture);
    const { events } = BattleEngine.resolveTurn(battle);

    const actionIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.ACTION_STARTED);
    const typeIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.TYPE_EFFECTIVENESS_RESOLVED);
    const damageIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.DAMAGE_APPLIED);

    assert.ok(actionIdx < typeIdx, 'ACTION_STARTED deve vir antes de TYPE_EFFECTIVENESS_RESOLVED');
    assert.ok(typeIdx < damageIdx, 'TYPE_EFFECTIVENESS_RESOLVED deve vir antes de DAMAGE_APPLIED');
  });

  // --- TY24: IMMUNITY BATTLE EVENT ---
  test('TY24 — Immunity Battle Event: ataque contra alvo imune resulta em 0 de dano e mantém HP intacto', () => {
    // Pikachu (Electric) contra Geodude (Rock/Ground) -> Imunidade Ground
    const battle = BattleEngine.createBattle(PikachuFixture, GeodudeFixture);
    const initialGeodudeHp = battle.enemy.currentHp;

    const { events, state } = BattleEngine.resolveTurn(battle);

    const pikaTypeEvent = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.TYPE_EFFECTIVENESS_RESOLVED && e.source === 'player');
    assert.equal(pikaTypeEvent.multiplier, 0);
    assert.equal(pikaTypeEvent.classification, BattleConstants.TYPE_EFFECTIVENESS_CLASSIFICATION.IMMUNE);

    const pikaDamageEvent = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.DAMAGE_APPLIED && e.source === 'player');
    assert.equal(pikaDamageEvent.damage, 0);
    assert.equal(pikaDamageEvent.currentHp, initialGeodudeHp, 'HP do defensor imune deve permanecer inalterado');
    assert.equal(state.enemy.currentHp, initialGeodudeHp);
  });

  // --- TY25: DETERMINISM PRESERVED ---
  test('TY25 — Determinism Preserved: simulações completas com tipos mantêm determinismo rigoroso', () => {
    const run1 = BattleEngine.simulateBattle(SquirtleFixture, CharmanderFixture);
    const run2 = BattleEngine.simulateBattle(SquirtleFixture, CharmanderFixture);

    assert.deepEqual(run1.state, run2.state, 'Estados finais devem ser idênticos');
    assert.deepEqual(run1.events, run2.events, 'Eventos emitidos devem ser rigorosamente idênticos');
    assert.equal(run1.totalTurns, run2.totalTurns, 'Contador de turnos deve ser rigorosamente igual');
  });

  // --- FULL BATTLE SIMULATION COM TYPE EFFECTIVENESS ---
  test('FULL BATTLE SIMULATION: Confronto elemental com logs de efetividade e proteção contra loop', () => {
    const maxTestTurns = 50;
    // Charmander (Fire) vs Bulbasaur (Grass/Poison -> 2x fraqueza para Fire)
    const battle = BattleEngine.createBattle(CharmanderFixture, BulbasaurFixture);
    let currentState = battle;
    let turnCount = 0;
    const combatLog = [];

    while (currentState.status === BattleConstants.BATTLE_STATUS.IN_PROGRESS) {
      turnCount++;
      if (turnCount > maxTestTurns) {
        assert.fail(`Loop infinito detectado! Batalha não encerrou em ${maxTestTurns} turnos.`);
      }

      const result = BattleEngine.resolveTurn(currentState);
      currentState = result.state;

      const typeEvents = result.events.filter(e => e.type === BattleConstants.BATTLE_EVENTS.TYPE_EFFECTIVENESS_RESOLVED);
      const damageEvents = result.events.filter(e => e.type === BattleConstants.BATTLE_EVENTS.DAMAGE_APPLIED);

      combatLog.push({
        turn: turnCount,
        actions: damageEvents.map((d, i) => {
          const typeEvt = typeEvents[i];
          return `${d.source} (${d.attackType}) atacou ${d.target} [${typeEvt ? typeEvt.classification : 'N/A'}, mult ${d.multiplier}x] -> ${d.damage} de dano (HP: ${d.previousHp} -> ${d.currentHp})`;
        })
      });
    }

    assert.ok(
      currentState.status === BattleConstants.BATTLE_STATUS.PLAYER_WIN || currentState.status === BattleConstants.BATTLE_STATUS.ENEMY_WIN,
      'Status final deve ser vitória'
    );
    assert.ok(currentState.winner === 'player' || currentState.winner === 'enemy', 'Vencedor deve existir');

    // Com Fire (2x) contra Grass/Poison e Bulbasaur Grass (0.5x) contra Fire, Charmander vence com folga
    assert.equal(currentState.winner, 'player', 'Charmander deve vencer o confronto elemental contra Bulbasaur');
    assert.equal(currentState.enemy.currentHp, 0, 'Bulbasaur derrotado deve ter exatamente 0 HP');
    assert.ok(currentState.player.currentHp > 0, 'Charmander vencedor deve ter HP maior que zero');
  });
});
