/**
 * ====================================================================
 * SUÍTE DE TESTES: BATTLE PRESENTATION ENGINE (PR01–PR40)
 * ====================================================================
 * Valida a arquitetura, mapeamento determinístico, orquestração assíncrona,
 * proteção contra concorrência, cancelamento, ausência de regras de combate
 * e cobertura integral de eventos (Fase PBA-008).
 *
 * Execução: node --test tests/presentation/battle-presentation.test.js
 */

const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// Módulos de Batalha do Engine
const BattleConstants = require('../../assets/js/battle/battle-constants.js');
const BattleEngine = require('../../assets/js/battle/battle-engine.js');
const BattleAI = require('../../assets/js/battle/battle-ai.js');

// Módulos da Apresentação
const PresentationConstants = require('../../assets/js/presentation/battle-presentation-constants.js');
const PresentationMapper = require('../../assets/js/presentation/battle-presentation-mapper.js');
const { BattlePresentationAdapter, NullAdapter, RecordingAdapter } = require('../../assets/js/presentation/battle-presentation-adapter.js');
const { ImmediateScheduler, TimerScheduler } = require('../../assets/js/presentation/battle-presentation-scheduler.js');
const { BattlePresentationEngine } = require('../../assets/js/presentation/battle-presentation-engine.js');

// Fixtures
const {
  PikachuFixture,
  SquirtleFixture,
  CharmanderFixture,
  BulbasaurFixture
} = require('../fixtures/pokemon-fixtures.js');
const {
  PlayerTeam3Fixture,
  EnemyTeam3Fixture
} = require('../fixtures/team-fixtures.js');

const { BATTLE_EVENTS } = BattleConstants;
const { PRESENTATION_COMMANDS, PRESENTATION_STATUS } = PresentationConstants;

describe('PHASE PBA-008 — BATTLE PRESENTATION ENGINE SUITE (PR01–PR40)', () => {

  // ====================================================================
  // 1. EXISTÊNCIA E ARQUITETURA BASE (PR01–PR04)
  // ====================================================================

  test('PR01 — Mapper Exists: PresentationMapper exporta funções de mapeamento e validação', () => {
    assert.ok(PresentationMapper, 'PresentationMapper deve existir');
    assert.equal(typeof PresentationMapper.mapEvent, 'function');
    assert.equal(typeof PresentationMapper.mapEvents, 'function');
    assert.equal(typeof PresentationMapper.validateEvent, 'function');
    assert.equal(typeof PresentationMapper.getSupportedEventTypes, 'function');
  });

  test('PR02 — Presentation Engine Exists: BattlePresentationEngine é instanciável com status inicial IDLE', () => {
    const engine = new BattlePresentationEngine();
    assert.ok(engine, 'BattlePresentationEngine deve ser instanciável');
    assert.equal(engine.getStatus(), PRESENTATION_STATUS.IDLE);
    assert.equal(engine.isPlaying(), false);
  });

  test('PR03 — Recording Adapter: registra comandos em ordem estrita com payloads e timestamps', async () => {
    const adapter = new RecordingAdapter();
    const cmd1 = { type: PRESENTATION_COMMANDS.TURN_INDICATOR, turn: 1 };
    const cmd2 = { type: PRESENTATION_COMMANDS.MOVE_ANNOUNCEMENT, moveName: 'Thunderbolt' };

    await adapter.execute(cmd1);
    await adapter.execute(cmd2);

    assert.equal(adapter.commands.length, 2);
    assert.deepEqual(adapter.commands[0], cmd1);
    assert.deepEqual(adapter.commands[1], cmd2);
    assert.deepEqual(adapter.getExecutedCommandTypes(), [
      PRESENTATION_COMMANDS.TURN_INDICATOR,
      PRESENTATION_COMMANDS.MOVE_ANNOUNCEMENT
    ]);

    adapter.clear();
    assert.equal(adapter.commands.length, 0);
  });

  test('PR04 — Null Adapter: executa comandos de forma segura sem lançar exceções', async () => {
    const adapter = new NullAdapter();
    await assert.doesNotReject(async () => {
      await adapter.execute({ type: PRESENTATION_COMMANDS.BATTLE_INTRO });
    });
  });

  // ====================================================================
  // 2. MAPEAMENTO ESPECÍFICO DE EVENTOS (PR05–PR15)
  // ====================================================================

  test('PR05 — Turn Mapping: TURN_STARTED -> TURN_INDICATOR com número do turno', () => {
    const event = { type: BATTLE_EVENTS.TURN_STARTED, turn: 3 };
    const commands = PresentationMapper.mapEvent(event);

    assert.equal(commands.length, 1);
    assert.equal(commands[0].type, PRESENTATION_COMMANDS.TURN_INDICATOR);
    assert.equal(commands[0].turn, 3);
  });

  test('PR06 — Move Used Mapping: MOVE_USED -> MOVE_ANNOUNCEMENT com detalhes do golpe', () => {
    const event = {
      type: BATTLE_EVENTS.MOVE_USED,
      actor: 'player',
      pokemonId: 25,
      pokemonName: 'pikachu',
      moveId: 85,
      moveName: 'thunderbolt',
      moveType: 'electric',
      damageClass: 'special',
      power: 90
    };
    const commands = PresentationMapper.mapEvent(event);

    assert.equal(commands.length, 1);
    assert.equal(commands[0].type, PRESENTATION_COMMANDS.MOVE_ANNOUNCEMENT);
    assert.equal(commands[0].actor, 'player');
    assert.equal(commands[0].pokemonId, 25);
    assert.equal(commands[0].moveName, 'thunderbolt');
    assert.equal(commands[0].power, 90);
  });

  test('PR07 — PP Mapping: PP_CHANGED -> PP_TRANSITION com valores de PP', () => {
    const event = {
      type: BATTLE_EVENTS.PP_CHANGED,
      actor: 'player',
      moveId: 85,
      moveName: 'thunderbolt',
      previousPp: 15,
      currentPp: 14,
      maxPp: 15
    };
    const commands = PresentationMapper.mapEvent(event);

    assert.equal(commands.length, 1);
    assert.equal(commands[0].type, PRESENTATION_COMMANDS.PP_TRANSITION);
    assert.equal(commands[0].side, 'player');
    assert.equal(commands[0].previousPp, 15);
    assert.equal(commands[0].currentPp, 14);
    assert.equal(commands[0].maxPp, 15);
  });

  test('PR08 — Miss Mapping: MOVE_MISSED -> MOVE_MISS_FEEDBACK (sem gerar HP_TRANSITION)', () => {
    const event = {
      type: BATTLE_EVENTS.MOVE_MISSED,
      actor: 'player',
      target: 'enemy',
      moveId: 85,
      moveName: 'thunderbolt',
      accuracyRoll: 85,
      accuracy: 70
    };
    const commands = PresentationMapper.mapEvent(event);

    assert.equal(commands.length, 1);
    assert.equal(commands[0].type, PRESENTATION_COMMANDS.MOVE_MISS_FEEDBACK);
    assert.equal(commands[0].actor, 'player');
    assert.equal(commands[0].target, 'enemy');

    // Garante que nenhum comando HP_TRANSITION foi gerado para miss
    assert.equal(commands.some(c => c.type === PRESENTATION_COMMANDS.HP_TRANSITION), false);
  });

  test('PR09 — Effectiveness Mapping: TYPE_EFFECTIVENESS_RESOLVED -> EFFECTIVENESS_FEEDBACK', () => {
    const event = {
      type: BATTLE_EVENTS.TYPE_EFFECTIVENESS_RESOLVED,
      source: 'player',
      target: 'enemy',
      attackType: 'fire',
      defenderTypes: ['grass'],
      multiplier: 2,
      classification: 'SUPER_EFFECTIVE'
    };
    const commands = PresentationMapper.mapEvent(event);

    assert.equal(commands.length, 1);
    assert.equal(commands[0].type, PRESENTATION_COMMANDS.EFFECTIVENESS_FEEDBACK);
    assert.equal(commands[0].multiplier, 2);
    assert.equal(commands[0].classification, 'SUPER_EFFECTIVE');
    assert.equal(commands[0].attackType, 'fire');
  });

  test('PR10 — Damage Mapping: DAMAGE_APPLIED -> HP_TRANSITION com previousHp, currentHp e damage', () => {
    const event = {
      type: BATTLE_EVENTS.DAMAGE_APPLIED,
      source: 'player',
      target: 'enemy',
      attackType: 'fire',
      damageClass: 'special',
      moveName: 'flamethrower',
      damage: 42,
      previousHp: 100,
      currentHp: 58,
      multiplier: 2
    };
    const commands = PresentationMapper.mapEvent(event);

    assert.equal(commands.length, 1);
    assert.equal(commands[0].type, PRESENTATION_COMMANDS.HP_TRANSITION);
    assert.equal(commands[0].target, 'enemy');
    assert.equal(commands[0].damage, 42);
    assert.equal(commands[0].previousHp, 100);
    assert.equal(commands[0].currentHp, 58);
  });

  test('PR11 — Faint Mapping: POKEMON_FAINTED -> FAINT_SEQUENCE com identificação do combatente', () => {
    const event = {
      type: BATTLE_EVENTS.POKEMON_FAINTED,
      target: 'enemy',
      pokemonName: 'charizard'
    };
    const commands = PresentationMapper.mapEvent(event);

    assert.equal(commands.length, 1);
    assert.equal(commands[0].type, PRESENTATION_COMMANDS.FAINT_SEQUENCE);
    assert.equal(commands[0].side, 'enemy');
    assert.equal(commands[0].pokemonName, 'charizard');
  });

  test('PR12 — Switch Mapping: SWITCH_STARTED e POKEMON_SWITCHED -> comandos de troca com reason', () => {
    const switchStartEvent = {
      type: BATTLE_EVENTS.SWITCH_STARTED,
      actor: 'player',
      previousPokemonId: 25,
      targetPokemonId: 1
    };
    const switchedEvent = {
      type: BATTLE_EVENTS.POKEMON_SWITCHED,
      side: 'player',
      previousPokemonId: 25,
      newPokemonId: 1,
      reason: 'VOLUNTARY'
    };

    const cmd1 = PresentationMapper.mapEvent(switchStartEvent);
    const cmd2 = PresentationMapper.mapEvent(switchedEvent);

    assert.equal(cmd1[0].type, PRESENTATION_COMMANDS.SWITCH_OUT_SEQUENCE);
    assert.equal(cmd2[0].type, PRESENTATION_COMMANDS.SWITCH_IN_SEQUENCE);
    assert.equal(cmd2[0].reason, 'VOLUNTARY');
    assert.equal(cmd2[0].newPokemonId, 1);
  });

  test('PR13 — Replacement Mapping: REPLACEMENT_REQUIRED -> REPLACEMENT_PROMPT com reservas', () => {
    const event = {
      type: BATTLE_EVENTS.REPLACEMENT_REQUIRED,
      side: 'player',
      faintedPokemonId: 25,
      availablePokemonIds: [1, 4]
    };
    const commands = PresentationMapper.mapEvent(event);

    assert.equal(commands.length, 1);
    assert.equal(commands[0].type, PRESENTATION_COMMANDS.REPLACEMENT_PROMPT);
    assert.equal(commands[0].side, 'player');
    assert.equal(commands[0].faintedPokemonId, 25);
    assert.deepEqual(commands[0].availablePokemonIds, [1, 4]);
  });

  test('PR14 — Team Defeat Mapping: TEAM_DEFEATED -> TEAM_DEFEAT_SEQUENCE', () => {
    const event = {
      type: BATTLE_EVENTS.TEAM_DEFEATED,
      side: 'enemy',
      winner: 'player'
    };
    const commands = PresentationMapper.mapEvent(event);

    assert.equal(commands.length, 1);
    assert.equal(commands[0].type, PRESENTATION_COMMANDS.TEAM_DEFEAT_SEQUENCE);
    assert.equal(commands[0].side, 'enemy');
    assert.equal(commands[0].winner, 'player');
  });

  test('PR15 — Battle End Mapping: BATTLE_ENDED -> BATTLE_RESULT com winner e reason', () => {
    const event = {
      type: BATTLE_EVENTS.BATTLE_ENDED,
      winner: 'player',
      reason: 'Todos os Pokémon da equipe inimiga foram derrotados.'
    };
    const commands = PresentationMapper.mapEvent(event);

    assert.equal(commands.length, 1);
    assert.equal(commands[0].type, PRESENTATION_COMMANDS.BATTLE_RESULT);
    assert.equal(commands[0].winner, 'player');
    assert.equal(commands[0].reason, event.reason);
  });

  // ====================================================================
  // 3. COBERTURA E VALIDAÇÃO DE EVENTOS (PR16–PR18)
  // ====================================================================

  test('PR16 — Event Coverage: 100% de todos os eventos ativos do Battle Engine possuem mapper', () => {
    const engineEvents = Object.values(BATTLE_EVENTS);
    const supportedTypes = PresentationMapper.getSupportedEventTypes();

    assert.ok(engineEvents.length >= 16, 'Engine deve ter pelo menos 16 eventos catalogados');

    for (const eventType of engineEvents) {
      assert.ok(
        supportedTypes.includes(eventType),
        `Evento do Battle Engine "${eventType}" DEVE possuir mapeador suportado!`
      );
    }
  });

  test('PR17 — Unknown Event: rejeita eventos inexistentes no catálogo da engine', () => {
    const unknownEvent = { type: 'UNKNOWN_CUSTOM_EVENT', data: 123 };
    assert.throws(
      () => PresentationMapper.mapEvent(unknownEvent),
      /UNKNOWN_ENGINE_EVENT/
    );
  });

  test('PR18 — Invalid Payload: rejeita eventos com campos obrigatórios ausentes', () => {
    // DAMAGE_APPLIED sem previousHp
    const badDamageEvent = {
      type: BATTLE_EVENTS.DAMAGE_APPLIED,
      damage: 20
    };
    assert.throws(
      () => PresentationMapper.mapEvent(badDamageEvent),
      /INVALID_EVENT_PAYLOAD/
    );

    // TURN_STARTED sem turn
    const badTurnEvent = {
      type: BATTLE_EVENTS.TURN_STARTED
    };
    assert.throws(
      () => PresentationMapper.mapEvent(badTurnEvent),
      /INVALID_EVENT_PAYLOAD/
    );
  });

  // ====================================================================
  // 4. PRESERVAÇÃO DA ORDEM CAUSAL (PR19–PR21)
  // ====================================================================

  test('PR19 — Command Order: preserva estritamente a ordem causal (MOVE -> EFFECTIVENESS -> DAMAGE)', () => {
    const events = [
      { type: BATTLE_EVENTS.MOVE_USED, actor: 'player', moveId: 10, moveName: 'ember' },
      { type: BATTLE_EVENTS.TYPE_EFFECTIVENESS_RESOLVED, source: 'player', target: 'enemy', attackType: 'fire', defenderTypes: ['grass'], multiplier: 2, classification: 'SUPER_EFFECTIVE' },
      { type: BATTLE_EVENTS.DAMAGE_APPLIED, source: 'player', target: 'enemy', damage: 30, previousHp: 50, currentHp: 20 }
    ];

    const commands = PresentationMapper.mapEvents(events);
    const commandTypes = commands.map(c => c.type);

    assert.deepEqual(commandTypes, [
      PRESENTATION_COMMANDS.MOVE_ANNOUNCEMENT,
      PRESENTATION_COMMANDS.EFFECTIVENESS_FEEDBACK,
      PRESENTATION_COMMANDS.HP_TRANSITION
    ]);
  });

  test('PR20 — Faint Order: preserva DAMAGE -> FAINT -> BATTLE_RESULT', () => {
    const events = [
      { type: BATTLE_EVENTS.DAMAGE_APPLIED, source: 'player', target: 'enemy', damage: 50, previousHp: 50, currentHp: 0 },
      { type: BATTLE_EVENTS.POKEMON_FAINTED, target: 'enemy', pokemonName: 'oddish' },
      { type: BATTLE_EVENTS.BATTLE_ENDED, winner: 'player', reason: 'oddish foi derrotado.' }
    ];

    const commands = PresentationMapper.mapEvents(events);
    const commandTypes = commands.map(c => c.type);

    assert.deepEqual(commandTypes, [
      PRESENTATION_COMMANDS.HP_TRANSITION,
      PRESENTATION_COMMANDS.FAINT_SEQUENCE,
      PRESENTATION_COMMANDS.BATTLE_RESULT
    ]);
  });

  test('PR21 — Switch Order: preserva SWITCH OUT -> SWITCH IN', () => {
    const events = [
      { type: BATTLE_EVENTS.SWITCH_STARTED, actor: 'player', previousPokemonId: 25, targetPokemonId: 4 },
      { type: BATTLE_EVENTS.POKEMON_SWITCHED, side: 'player', previousPokemonId: 25, newPokemonId: 4, reason: 'VOLUNTARY' }
    ];

    const commands = PresentationMapper.mapEvents(events);
    const commandTypes = commands.map(c => c.type);

    assert.deepEqual(commandTypes, [
      PRESENTATION_COMMANDS.SWITCH_OUT_SEQUENCE,
      PRESENTATION_COMMANDS.SWITCH_IN_SEQUENCE
    ]);
  });

  // ====================================================================
  // 5. EXECUÇÃO SEQUENCIAL E PROTEÇÃO DE CONCORRÊNCIA (PR22–PR23)
  // ====================================================================

  test('PR22 — Sequential Execution: comando N+1 só inicia após término do comando N', async () => {
    const executionTrace = [];
    const adapter = new RecordingAdapter({
      onExecute: async (cmd) => {
        executionTrace.push(`start:${cmd.type}`);
        await new Promise(res => setTimeout(res, 5));
        executionTrace.push(`end:${cmd.type}`);
      }
    });

    const engine = new BattlePresentationEngine({ adapter });
    const events = [
      { type: BATTLE_EVENTS.TURN_STARTED, turn: 1 },
      { type: BATTLE_EVENTS.MOVE_USED, actor: 'player', moveId: 1, moveName: 'tackle' }
    ];

    await engine.play(events);

    assert.deepEqual(executionTrace, [
      `start:${PRESENTATION_COMMANDS.TURN_INDICATOR}`,
      `end:${PRESENTATION_COMMANDS.TURN_INDICATOR}`,
      `start:${PRESENTATION_COMMANDS.MOVE_ANNOUNCEMENT}`,
      `end:${PRESENTATION_COMMANDS.MOVE_ANNOUNCEMENT}`
    ]);
  });

  test('PR23 — No Parallel Leakage: MAX_CONCURRENT_COMMANDS = 1 em qualquer instante', async () => {
    const adapter = new RecordingAdapter({ delayMs: 2 });
    const engine = new BattlePresentationEngine({ adapter });

    const events = [
      { type: BATTLE_EVENTS.TURN_STARTED, turn: 1 },
      { type: BATTLE_EVENTS.MOVE_USED, actor: 'player', moveId: 1, moveName: 'tackle' },
      { type: BATTLE_EVENTS.DAMAGE_APPLIED, source: 'player', target: 'enemy', damage: 10, previousHp: 50, currentHp: 40 }
    ];

    await engine.play(events);

    assert.equal(engine.maxConcurrentCommands, 1);
    assert.equal(adapter.maxConcurrent, 1);
  });

  // ====================================================================
  // 6. ACESSIBILIDADE: REDUCED MOTION E TIMINGS (PR24–PR25)
  // ====================================================================

  test('PR24 — Reduced Motion: reducedMotion=true zera durações efetivas do Scheduler', () => {
    const scheduler = new TimerScheduler({ reducedMotion: true });
    assert.equal(scheduler.getEffectiveDuration(PRESENTATION_COMMANDS.HP_TRANSITION), 0);
    assert.equal(scheduler.getEffectiveDuration(PRESENTATION_COMMANDS.FAINT_SEQUENCE), 0);
  });

  test('PR25 — Normal Motion: preserva durações configuradas no Scheduler', () => {
    const scheduler = new TimerScheduler({ reducedMotion: false });
    assert.equal(
      scheduler.getEffectiveDuration(PRESENTATION_COMMANDS.HP_TRANSITION),
      PresentationConstants.DEFAULT_DURATIONS.HP_TRANSITION
    );
    assert.equal(
      scheduler.getEffectiveDuration(PRESENTATION_COMMANDS.FAINT_SEQUENCE),
      PresentationConstants.DEFAULT_DURATIONS.FAINT_SEQUENCE
    );
  });

  // ====================================================================
  // 7. CANCELAMENTO E RESET (PR26–PR27)
  // ====================================================================

  test('PR26 — Cancellation: cancel() no meio da timeline interrompe comandos restantes', async () => {
    let executedCount = 0;
    const adapter = new RecordingAdapter({
      onExecute: async () => {
        executedCount++;
        if (executedCount === 1) {
          engine.cancel();
        }
      }
    });

    const engine = new BattlePresentationEngine({ adapter });
    const events = [
      { type: BATTLE_EVENTS.TURN_STARTED, turn: 1 },
      { type: BATTLE_EVENTS.MOVE_USED, actor: 'player', moveId: 1, moveName: 'tackle' },
      { type: BATTLE_EVENTS.DAMAGE_APPLIED, source: 'player', target: 'enemy', damage: 10, previousHp: 50, currentHp: 40 }
    ];

    const result = await engine.play(events);

    assert.equal(result.status, PRESENTATION_STATUS.CANCELLED);
    assert.equal(executedCount, 1);
    assert.equal(adapter.commands.length, 1);
    assert.equal(engine.getStatus(), PRESENTATION_STATUS.CANCELLED);
  });

  test('PR27 — Reset After Cancel: engine pode ser resetado e executa nova timeline normalmente', async () => {
    const adapter = new RecordingAdapter();
    const engine = new BattlePresentationEngine({ adapter });

    engine.cancel();
    assert.equal(engine.getStatus(), PRESENTATION_STATUS.CANCELLED);

    engine.reset();
    assert.equal(engine.getStatus(), PRESENTATION_STATUS.IDLE);

    const events = [{ type: BATTLE_EVENTS.TURN_STARTED, turn: 2 }];
    const result = await engine.play(events);

    assert.equal(result.status, PRESENTATION_STATUS.COMPLETED);
    assert.equal(adapter.commands.length, 1);
  });

  // ====================================================================
  // 8. PROTEÇÃO CONTRA EXECUÇÃO CONCORRENTE (PR28)
  // ====================================================================

  test('PR28 — Concurrency: rejeita chamada concorrente de play() enquanto uma timeline está ativa', async () => {
    const adapter = new RecordingAdapter({ delayMs: 15 });
    const engine = new BattlePresentationEngine({ adapter });

    const events = [{ type: BATTLE_EVENTS.TURN_STARTED, turn: 1 }];

    const firstPlay = engine.play(events);

    // Segunda chamada síncrona/concorrente durante o play ativo
    await assert.rejects(
      async () => {
        await engine.play(events);
      },
      /CONCURRENT_PLAYBACK_REJECTED/
    );

    await firstPlay;
    assert.equal(engine.getStatus(), PRESENTATION_STATUS.COMPLETED);
  });

  // ====================================================================
  // 9. IMUTABILIDADE DE ENTRADA (PR29–PR30)
  // ====================================================================

  test('PR29 — State Immutability: eventos originais da batalha permanecem estritamente intactos', async () => {
    const originalEvent = {
      type: BATTLE_EVENTS.DAMAGE_APPLIED,
      source: 'player',
      target: 'enemy',
      damage: 25,
      previousHp: 80,
      currentHp: 55,
      nested: { test: true }
    };
    const snapshot = JSON.stringify(originalEvent);
    const events = [originalEvent];

    const engine = new BattlePresentationEngine();
    await engine.play(events);

    assert.equal(JSON.stringify(originalEvent), snapshot);
  });

  test('PR30 — Context Immutability: objeto de contexto original permanece inalterado', async () => {
    const originalContext = {
      battleId: 'b-123',
      playerTrainer: 'Ash',
      meta: { difficulty: 'hard' }
    };
    const snapshot = JSON.stringify(originalContext);

    const engine = new BattlePresentationEngine();
    const events = [{ type: BATTLE_EVENTS.TURN_STARTED, turn: 1 }];

    await engine.play(events, originalContext);

    assert.equal(JSON.stringify(originalContext), snapshot);
  });

  // ====================================================================
  // 10. TRATAMENTO DE ERROS E RECUPERAÇÃO (PR31–PR32)
  // ====================================================================

  test('PR31 — Error Handling: erro lançado pelo Adapter aborta timeline com segurança e status ERROR', async () => {
    class FailingAdapter extends BattlePresentationAdapter {
      async execute() {
        throw new Error('SIMULATED_ADAPTER_FAILURE');
      }
    }

    const engine = new BattlePresentationEngine({ adapter: new FailingAdapter() });
    const events = [{ type: BATTLE_EVENTS.TURN_STARTED, turn: 1 }];

    const result = await engine.play(events);

    assert.equal(result.status, PRESENTATION_STATUS.ERROR);
    assert.ok(result.error.includes('SIMULATED_ADAPTER_FAILURE'));
    assert.equal(engine.getStatus(), PRESENTATION_STATUS.ERROR);
  });

  test('PR32 — Reset After Error: após erro do Adapter, engine pode ser resetado e reutilizado', async () => {
    let shouldFail = true;
    const adapter = new RecordingAdapter({
      onExecute: async () => {
        if (shouldFail) throw new Error('FAIL_ONCE');
      }
    });

    const engine = new BattlePresentationEngine({ adapter });
    const events = [{ type: BATTLE_EVENTS.TURN_STARTED, turn: 1 }];

    const res1 = await engine.play(events);
    assert.equal(res1.status, PRESENTATION_STATUS.ERROR);

    // Reseta o engine
    engine.reset();
    assert.equal(engine.getStatus(), PRESENTATION_STATUS.IDLE);

    // Segunda execução com sucesso
    shouldFail = false;
    const res2 = await engine.play(events);
    assert.equal(res2.status, PRESENTATION_STATUS.COMPLETED);
  });

  // ====================================================================
  // 11. DETERMINISMO (PR33)
  // ====================================================================

  test('PR33 — Determinism: mesmo fluxo de eventos gera exatamente os mesmos comandos e payloads', () => {
    const events = [
      { type: BATTLE_EVENTS.TURN_STARTED, turn: 1 },
      { type: BATTLE_EVENTS.ACTION_STARTED, actor: 'player', pokemonName: 'pikachu', action: 'MOVE' },
      { type: BATTLE_EVENTS.MOVE_SELECTED, actor: 'player', pokemonId: 25, pokemonName: 'pikachu', moveId: 85, moveName: 'thunderbolt' },
      { type: BATTLE_EVENTS.MOVE_USED, actor: 'player', pokemonId: 25, pokemonName: 'pikachu', moveId: 85, moveName: 'thunderbolt', moveType: 'electric', damageClass: 'special', power: 90 },
      { type: BATTLE_EVENTS.PP_CHANGED, actor: 'player', moveId: 85, moveName: 'thunderbolt', previousPp: 15, currentPp: 14, maxPp: 15 },
      { type: BATTLE_EVENTS.DAMAGE_APPLIED, source: 'player', target: 'enemy', damage: 45, previousHp: 100, currentHp: 55 }
    ];

    const run1 = PresentationMapper.mapEvents(events);
    const run2 = PresentationMapper.mapEvents(events);

    assert.deepEqual(run1, run2);
    assert.equal(JSON.stringify(run1), JSON.stringify(run2));
  });

  // ====================================================================
  // 12. TRACES REAIS COM BATTLE ENGINE (PR34–PR37)
  // ====================================================================

  test('PR34 — Full Turn Trace: eventos reais de BattleEngine.resolveTurn são processados com sucesso', async () => {
    const pika = PikachuFixture;
    const squirt = SquirtleFixture;

    const battle = BattleEngine.createBattle(pika, squirt);
    const turnResult = BattleEngine.resolveTurn(battle, {
      player: { moveName: 'thunderbolt', accuracyRoll: 1 },
      enemy: { moveName: 'water-gun', accuracyRoll: 1 }
    });

    assert.ok(turnResult.events.length > 0, 'Deve gerar eventos reais');

    const adapter = new RecordingAdapter();
    const engine = new BattlePresentationEngine({ adapter });

    const playResult = await engine.play(turnResult.events);

    assert.equal(playResult.status, PRESENTATION_STATUS.COMPLETED);
    assert.equal(playResult.eventsProcessed, turnResult.events.length);
    assert.ok(adapter.commands.length >= turnResult.events.length);
  });

  test('PR35 — Full Faint Trace: nocaute real gera timeline com FAINT_SEQUENCE e REPLACEMENT_REQUIRED', async () => {
    const p1 = PlayerTeam3Fixture;
    const p2 = EnemyTeam3Fixture;

    const battle = BattleEngine.createTeamBattle(p1, p2);
    // Reduz HP do adversário para 1 para forçar nocaute no primeiro golpe
    battle.enemy.team[0].currentHp = 1;

    const turnResult = BattleEngine.resolveTurn(battle, {
      player: { moveName: 'ember', accuracyRoll: 1 },
      enemy: { moveName: 'vine-whip', accuracyRoll: 1 }
    });

    const adapter = new RecordingAdapter();
    const engine = new BattlePresentationEngine({ adapter });

    const playResult = await engine.play(turnResult.events);

    assert.equal(playResult.status, PRESENTATION_STATUS.COMPLETED);
    const commandTypes = adapter.getExecutedCommandTypes();

    assert.ok(commandTypes.includes(PRESENTATION_COMMANDS.HP_TRANSITION));
    assert.ok(commandTypes.includes(PRESENTATION_COMMANDS.FAINT_SEQUENCE));
    assert.ok(commandTypes.includes(PRESENTATION_COMMANDS.REPLACEMENT_PROMPT));
  });

  test('PR36 — Full Switch Trace: troca voluntária real gera timeline com SWITCH_OUT e SWITCH_IN', async () => {
    const team1 = PlayerTeam3Fixture;
    const team2 = EnemyTeam3Fixture;

    const battle = BattleEngine.createTeamBattle(team1, team2);

    const turnResult = BattleEngine.resolveTurn(battle, {
      player: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetIndex: 1 },
      enemy: { moveName: 'vine-whip', accuracyRoll: 1 }
    });

    const adapter = new RecordingAdapter();
    const engine = new BattlePresentationEngine({ adapter });

    const playResult = await engine.play(turnResult.events);

    assert.equal(playResult.status, PRESENTATION_STATUS.COMPLETED);
    const commandTypes = adapter.getExecutedCommandTypes();

    assert.ok(commandTypes.includes(PRESENTATION_COMMANDS.SWITCH_OUT_SEQUENCE));
    assert.ok(commandTypes.includes(PRESENTATION_COMMANDS.SWITCH_IN_SEQUENCE));
  });

  test('PR37 — Full Battle Result Trace: eventos finais reais produzem TEAM_DEFEAT_SEQUENCE e BATTLE_RESULT', async () => {
    const team1 = PlayerTeam3Fixture;
    const team2 = EnemyTeam3Fixture;

    const battle = BattleEngine.createTeamBattle(team1, team2);
    // Deixa apenas o líder adversário vivo com 1 HP no estado da batalha
    battle.enemy.team[0].currentHp = 1;
    battle.enemy.team[1].currentHp = 0;
    battle.enemy.team[2].currentHp = 0;

    const turnResult = BattleEngine.resolveTurn(battle, {
      player: { moveName: 'ember', accuracyRoll: 1 },
      enemy: { moveName: 'vine-whip', accuracyRoll: 1 }
    });

    const adapter = new RecordingAdapter();
    const engine = new BattlePresentationEngine({ adapter });

    const playResult = await engine.play(turnResult.events);

    assert.equal(playResult.status, PRESENTATION_STATUS.COMPLETED);
    const commandTypes = adapter.getExecutedCommandTypes();

    assert.ok(commandTypes.includes(PRESENTATION_COMMANDS.FAINT_SEQUENCE));
    assert.ok(commandTypes.includes(PRESENTATION_COMMANDS.TEAM_DEFEAT_SEQUENCE));
    assert.ok(commandTypes.includes(PRESENTATION_COMMANDS.BATTLE_RESULT));
  });

  // ====================================================================
  // 13. COMPATIBILIDADE COM BATTLE AI (PR38)
  // ====================================================================

  test('PR38 — AI Battle Compatibility: eventos de rodada Player vs SMART AI processados sem acoplamento à IA', async () => {
    const team1 = PlayerTeam3Fixture;
    const team2 = EnemyTeam3Fixture;

    const battle = BattleEngine.createTeamBattle(team1, team2);
    const aiDecision = BattleAI.chooseAction(battle, 'enemy', 'SMART');

    const turnResult = BattleEngine.resolveTurn(battle, {
      player: { moveName: 'ember', accuracyRoll: 1 },
      enemy: aiDecision.action
    });

    const adapter = new RecordingAdapter();
    const engine = new BattlePresentationEngine({ adapter });

    const playResult = await engine.play(turnResult.events);

    assert.equal(playResult.status, PRESENTATION_STATUS.COMPLETED);
    assert.ok(adapter.commands.length > 0);
  });

  // ====================================================================
  // 14. AUDITORIA DE DEPENDÊNCIAS PROIBIDAS (PR39)
  // ====================================================================

  test('PR39 — Forbidden Dependencies Audit: Presentation possui 0 chamadas a fetch, localStorage, Audio, DamageCalculator, TypeEffectiveness e BattleAI', () => {
    const presentationDir = path.join(__dirname, '../../assets/js/presentation');
    const files = fs.readdirSync(presentationDir).filter(f => f.endsWith('.js'));

    assert.ok(files.length >= 5, 'Deve haver pelo menos 5 arquivos no diretório de apresentação');

    const forbiddenPatterns = [
      /\bfetch\s*\(/,
      /\blocalStorage\b/,
      /\bnew\s+Audio\s*\(/,
      /\bDamageCalculator\b/,
      /\bTypeEffectiveness\b/,
      /\bBattleAI\b/
    ];

    for (const file of files) {
      const content = fs.readFileSync(path.join(presentationDir, file), 'utf8');

      for (const pattern of forbiddenPatterns) {
        const match = content.match(pattern);
        assert.equal(
          match,
          null,
          `Violação de dependência proibida encontrada no arquivo "${file}": ${pattern}`
        );
      }
    }
  });

  // ====================================================================
  // 15. PIPELINE COMPLETO DE APRESENTAÇÃO (PR40)
  // ====================================================================

  test('PR40 — Full Presentation Pipeline: simulação programática 3x3 completa até BATTLE_ENDED executada no pipeline', async () => {
    const team1 = PlayerTeam3Fixture;
    const team2 = EnemyTeam3Fixture;

    const simulation = BattleEngine.simulateTeamBattle(team1, team2, 100);
    assert.ok(simulation.events.length > 10, 'A simulação 3x3 deve ter gerado eventos');

    const adapter = new RecordingAdapter();
    const engine = new BattlePresentationEngine({ adapter });

    const playResult = await engine.play(simulation.events);

    assert.equal(playResult.status, PRESENTATION_STATUS.COMPLETED);
    assert.equal(playResult.eventsProcessed, simulation.events.length);
    assert.ok(playResult.commandsExecuted >= simulation.events.length);

    const executedTypes = adapter.getExecutedCommandTypes();
    assert.ok(executedTypes.includes(PRESENTATION_COMMANDS.BATTLE_INTRO));
    assert.ok(executedTypes.includes(PRESENTATION_COMMANDS.TURN_INDICATOR));
    assert.ok(executedTypes.includes(PRESENTATION_COMMANDS.BATTLE_RESULT));
  });
});
