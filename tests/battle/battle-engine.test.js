/**
 * ====================================================================
 * SUÍTE DE TESTES AUTOMATIZADOS: BATTLE ENGINE V1 (battle-engine.test.js)
 * ====================================================================
 * Validação rigorosa dos gates E01 a E18 e Simulação Completa.
 * Execução com Node.js nativo (node --test).
 * 
 * Critérios:
 * - 100% offline (sem PokéAPI);
 * - Sem dependência de DOM;
 * - Sem dependência de LocalStorage;
 * - Sem dependência de áudio;
 * - Determinístico e imutável.
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
  FragileOneHpFixture
} = require('../fixtures/pokemon-fixtures.js');

describe('PHASE PBA-003 — BATTLE ENGINE V1 TEST SUITE', () => {

  // --- E01: CREATE BATTLE ---
  test('E01 — Create Battle: inicializa batalha válida com dados corretos', () => {
    const battle = BattleEngine.createBattle(CharmanderFixture, BulbasaurFixture);

    assert.equal(battle.version, 1, 'Versão do estado de batalha deve ser 1');
    assert.equal(battle.status, BattleConstants.BATTLE_STATUS.IN_PROGRESS, 'Status inicial deve ser IN_PROGRESS');
    assert.ok(battle.turn >= 1, 'Turno deve ser inicializado');
    assert.equal(battle.winner, null, 'Vencedor inicial deve ser null');
    assert.equal(battle.player.currentHp, battle.player.maxHp, 'Player HP inicial deve ser igual a maxHp');
    assert.equal(battle.enemy.currentHp, battle.enemy.maxHp, 'Enemy HP inicial deve ser igual a maxHp');
  });

  // --- E02: INVALID COMBATANT ---
  test('E02 — Invalid Combatant: rejeita dados inválidos com segurança sem gerar NaN', () => {
    const invalidInputs = [
      null,
      undefined,
      {},
      { id: 'abc', name: 'poke' }, // id inválido
      { id: 1, name: '' }, // nome vazio
      { id: 1, name: 'poke', stats: { hp: 0, attack: 10, defense: 10, speed: 10 } }, // hp <= 0
      { id: 1, name: 'poke', stats: { hp: -5, attack: 10, defense: 10, speed: 10 } }, // hp negativo
      { id: 1, name: 'poke', stats: { hp: 10, attack: 0, defense: 10, speed: 10 } }, // attack <= 0
      { id: 1, name: 'poke', stats: { hp: 10, attack: 10, defense: -2, speed: 10 } }, // defense <= 0
      { id: 1, name: 'poke', stats: { hp: 10, attack: 10, defense: 10, speed: -1 } }, // speed < 0
      { id: 1, name: 'poke', stats: { hp: NaN, attack: 10, defense: 10, speed: 10 } }, // NaN
      { id: 1, name: 'poke', stats: { hp: 10, attack: Infinity, defense: 10, speed: 10 } }, // Infinity
    ];

    for (const invalid of invalidInputs) {
      assert.throws(
        () => BattleEngine.createCombatant(invalid),
        /Combatente inválido|ID do combatente|Nome do combatente|HP do combatente|Ataque do combatente|Defesa do combatente|Velocidade do combatente/,
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

    // Verifica também na resolução do turno
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
  test('E06 — Speed Tie: desempate determinístico favorece jogador na PBA-003', () => {
    // Charmander (Speed 65) vs SpeedTieWithCharmander (Speed 65)
    const order = TurnManager.determineOrder(
      { speed: 65 },
      { speed: 65 }
    );
    assert.deepEqual(order, ['player', 'enemy'], 'Em empate de velocidade, o jogador deve ser o primeiro');
  });

  // --- E07: MINIMUM DAMAGE ---
  test('E07 — Minimum Damage: mesmo com defesa massiva, o dano mínimo é sempre >= 1', () => {
    // Attack 10 vs Defense 9999
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
    // FragileOneHpFixture tem 1 HP. Charmander causa mais de 10 de dano.
    const battle = BattleEngine.createBattle(CharmanderFixture, FragileOneHpFixture);
    const { state } = BattleEngine.resolveTurn(battle);

    assert.equal(state.enemy.currentHp, 0, 'HP deve ser exatamente zero após nocaute');
    assert.ok(state.enemy.currentHp >= 0, 'HP nunca deve ser menor que zero');
  });

  // --- E11: FAINT STOPS COUNTERATTACK ---
  test('E11 — Faint Stops Counterattack: combatente nocauteado no 1º golpe não contra-ataca', () => {
    // Jogador é mais rápido e nocauteia o adversário (1 HP) na primeira ação
    const battle = BattleEngine.createBattle(CharmanderFixture, FragileOneHpFixture);
    const { state, events } = BattleEngine.resolveTurn(battle);

    // Deve haver apenas uma ação de ataque no turno
    const actionEvents = events.filter(e => e.type === BattleConstants.BATTLE_EVENTS.ACTION_STARTED);
    assert.equal(actionEvents.length, 1, 'Deve haver apenas 1 ação de ataque no turno do nocaute');
    assert.equal(actionEvents[0].actor, 'player');

    // O jogador não deve ter sofrido dano
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
    // Inimigo Pikachu mais rápido e com ataque alto contra jogador frágil
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

    // Salva snapshot do estado final
    const hpPlayerBefore = endedState.player.currentHp;
    const hpEnemyBefore = endedState.enemy.currentHp;
    const statusBefore = endedState.status;

    // Tentativa de executar turno em batalha encerrada deve lançar erro e não corromper estado
    assert.throws(
      () => BattleEngine.resolveTurn(endedState),
      /Não é possível executar turno em uma batalha com status/
    );

    // Verifica que o estado continuou inalterado
    assert.equal(endedState.player.currentHp, hpPlayerBefore);
    assert.equal(endedState.enemy.currentHp, hpEnemyBefore);
    assert.equal(endedState.status, statusBefore);
  });

  // --- E15: EVENT ORDERING ---
  test('E15 — Event Ordering: eventos estruturados emitidos na ordem lógica exata', () => {
    const battle = BattleEngine.createBattle(CharmanderFixture, FragileOneHpFixture);
    const { events } = BattleEngine.resolveTurn(battle);

    const eventTypes = events.map(e => e.type);
    const expectedSequence = [
      BattleConstants.BATTLE_EVENTS.TURN_STARTED,
      BattleConstants.BATTLE_EVENTS.ACTION_STARTED,
      BattleConstants.BATTLE_EVENTS.DAMAGE_APPLIED,
      BattleConstants.BATTLE_EVENTS.POKEMON_FAINTED,
      BattleConstants.BATTLE_EVENTS.BATTLE_ENDED
    ];

    assert.deepEqual(eventTypes, expectedSequence, 'Sequência de eventos do nocaute deve ser rigorosamente ordenada');

    // Valida propriedades do DAMAGE_APPLIED
    const damageEvent = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.DAMAGE_APPLIED);
    assert.ok(damageEvent.damage > 0);
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
      stats: { hp: 39, attack: 52, defense: 43, speed: 65 }
    };
    const sourceBulbasaur = {
      id: 1,
      name: 'bulbasaur',
      stats: { hp: 45, attack: 49, defense: 49, speed: 45 }
    };

    const cloneCharmander = JSON.parse(JSON.stringify(sourceCharmander));
    const cloneBulbasaur = JSON.parse(JSON.stringify(sourceBulbasaur));

    // Executa criação e simulação completa
    BattleEngine.simulateBattle(sourceCharmander, sourceBulbasaur);

    // Garante que os objetos fontes continuam 100% idênticos
    assert.deepEqual(sourceCharmander, cloneCharmander, 'Objeto original do Charmander não pode ser modificado');
    assert.deepEqual(sourceBulbasaur, cloneBulbasaur, 'Objeto original do Bulbasaur não pode ser modificado');
  });

  // --- E18: OFFLINE ENGINE ---
  test('E18 — Offline Engine: motor executa puramente sem chamadas de rede ou PokéAPI', () => {
    // Desabilita global.fetch para comprovar que nenhuma chamada de rede é realizada
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

  // --- TESTE DE BATALHA COMPLETA COM PROTEÇÃO DE LOOP ---
  test('FULL BATTLE SIMULATION: Charmander vs Bulbasaur com logs de turnos e proteção contra loop', () => {
    const maxTestTurns = 50;
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

      const damageEvents = result.events.filter(e => e.type === BattleConstants.BATTLE_EVENTS.DAMAGE_APPLIED);
      combatLog.push({
        turn: turnCount,
        damages: damageEvents.map(d => `${d.source} causou ${d.damage} de dano em ${d.target} (HP: ${d.previousHp} -> ${d.currentHp})`)
      });
    }

    assert.ok(
      currentState.status === BattleConstants.BATTLE_STATUS.PLAYER_WIN || currentState.status === BattleConstants.BATTLE_STATUS.ENEMY_WIN,
      'Status final deve ser vitória de um dos combatentes'
    );
    assert.ok(currentState.winner === 'player' || currentState.winner === 'enemy', 'Vencedor deve ser definido');
    assert.ok(turnCount > 0 && turnCount <= maxTestTurns, 'Quantidade de turnos deve ser razoável');
    
    // Prova que pelo menos um combatente chegou a 0 HP
    const loserHp = currentState.winner === 'player' ? currentState.enemy.currentHp : currentState.player.currentHp;
    assert.equal(loserHp, 0, 'O combatente derrotado deve ter exatamente 0 HP');

    // Prova que o vencedor tem HP positivo
    const winnerHp = currentState.winner === 'player' ? currentState.player.currentHp : currentState.enemy.currentHp;
    assert.ok(winnerHp > 0, 'O vencedor deve ter HP maior que zero');
  });
});
