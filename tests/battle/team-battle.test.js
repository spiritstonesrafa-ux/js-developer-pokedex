/**
 * ====================================================================
 * SUÍTE DE TESTES AUTOMATIZADOS: 3x3 TEAM BATTLE (team-battle.test.js)
 * ====================================================================
 * Validação rigorosa dos gates B3-01 a B3-35 da Fase PBA-006.
 * Execução com Node.js nativo (node --test).
 * 
 * Critérios:
 * - 100% offline (fixtures estáticas isoladas);
 * - Batalha 3x3: controle de Pokémon ativo e banco;
 * - Validação de equipe: 3 membros obrigatórios, sem duplicatas;
 * - Preservação do Líder (Slot 1);
 * - Banco não pode atacar;
 * - Troca voluntária (SWITCH) com prioridade sobre ataque (MOVE);
 * - Persistência estrita de HP e PP no banco;
 * - Troca forçada (forced replacement) após nocaute com reservas vivas;
 * - Derrota da equipe inteira (TEAM_DEFEATED) após 3 nocautes;
 * - Sequência exata de eventos de troca e nocaute;
 * - Determinismo e imutabilidade de entradas;
 * - Simulação completa 3v3.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const BattleConstants = require('../../assets/js/battle/battle-constants.js');
const DamageCalculator = require('../../assets/js/battle/damage-calculator.js');
const TurnManager = require('../../assets/js/battle/turn-manager.js');
const BattleEngine = require('../../assets/js/battle/battle-engine.js');

const {
  ThunderboltFixture,
  ScratchFixture,
  FlamethrowerFixture,
  EmberFixture,
  WaterGunFixture,
  VineWhipFixture
} = require('../fixtures/move-fixtures.js');

const {
  CharmanderFixture,
  BulbasaurFixture,
  SquirtleFixture,
  PikachuFixture,
  GyaradosFixture,
  SwampertFixture,
  ScizorFixture,
  GeodudeFixture,
  FragileOneHpFixture
} = require('../fixtures/pokemon-fixtures.js');

const {
  PlayerTeam3Fixture,
  EnemyTeam3Fixture,
  AltPlayerTeamFixture,
  TwoPokemonTeamFixture,
  FourPokemonTeamFixture,
  DuplicatePokemonTeamFixture
} = require('../fixtures/team-fixtures.js');

describe('PHASE PBA-006 — BATTLE 3x3 & SWITCHING SUITE (B3-01–B3-35)', () => {

  // ==================================================================
  // 1. CRIAÇÃO E VALIDAÇÃO DA EQUIPE 3x3 (B3-01 a B3-06)
  // ==================================================================

  test('B3-01 — Create 3x3 Battle: inicializa batalha 3x3 com Battle State v2, activeIndex 0 e status IN_PROGRESS', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);

    assert.equal(battle.version, 2, 'Battle State deve ter versão 2');
    assert.equal(battle.status, BattleConstants.BATTLE_STATUS.IN_PROGRESS);
    assert.equal(battle.turn, 1);
    assert.equal(battle.winner, null);

    assert.equal(battle.player.activeIndex, 0);
    assert.equal(battle.player.team.length, 3);
    assert.equal(battle.player.team[0].id, CharmanderFixture.id);

    assert.equal(battle.enemy.activeIndex, 0);
    assert.equal(battle.enemy.team.length, 3);
    assert.equal(battle.enemy.team[0].id, BulbasaurFixture.id);
  });

  test('B3-02 — Two Pokémon Rejected: rejeita equipe com apenas 2 Pokémon', () => {
    assert.throws(
      () => BattleEngine.createTeamBattle(TwoPokemonTeamFixture, EnemyTeam3Fixture),
      /Tamanho de equipe inválido/
    );
  });

  test('B3-03 — Four Pokémon Rejected: rejeita equipe com 4 Pokémon', () => {
    assert.throws(
      () => BattleEngine.createTeamBattle(FourPokemonTeamFixture, EnemyTeam3Fixture),
      /Tamanho de equipe inválido/
    );
  });

  test('B3-04 — Duplicate Species Rejected: rejeita equipe com espécies repetidas', () => {
    assert.throws(
      () => BattleEngine.createTeamBattle(DuplicatePokemonTeamFixture, EnemyTeam3Fixture),
      /Espécie duplicada na equipe/
    );
  });

  test('B3-05 — Lead Preservation: Slot 1 (índice 0) é preservado rigorosamente como líder ativo inicial', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    const activePlayer = BattleEngine.getActiveCombatant(battle, 'player');

    assert.equal(battle.player.activeIndex, 0);
    assert.equal(activePlayer.id, PlayerTeam3Fixture[0].id);
    assert.equal(activePlayer.name, PlayerTeam3Fixture[0].name);
  });

  test('B3-06 — Bench Cannot Attack: apenas o Pokémon ativo pode executar ações de combate', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);

    // Tentativa de executar ação com o ID do Pikachu (banco, índice 1) enquanto Charmander está ativo
    assert.throws(
      () => BattleEngine.resolveTurn(battle, {
        player: { pokemonId: PikachuFixture.id, moveId: ThunderboltFixture.id }
      }),
      /Apenas o Pokémon ativo/
    );

    // Tentativa de usar golpe que não pertence ao Pokémon ativo
    assert.throws(
      () => BattleEngine.resolveTurn(battle, {
        player: { moveId: ThunderboltFixture.id } // Thunderbolt é do Pikachu, não do Charmander!
      }),
      /Golpe especificado não pertence ao loadout/
    );
  });

  // ==================================================================
  // 2. TROCA VOLUNTÁRIA (SWITCH) (B3-07 a B3-10)
  // ==================================================================

  test('B3-07 — Valid Switch: troca voluntária válida altera o Pokémon ativo com emissão de eventos', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);

    const { state, events } = BattleEngine.resolveTurn(battle, {
      player: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: PikachuFixture.id },
      enemy: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: GeodudeFixture.id }
    });

    assert.equal(state.player.activeIndex, 1, 'Player deve ter trocado para o índice 1 (Pikachu)');
    assert.equal(BattleEngine.getActiveCombatant(state, 'player').id, PikachuFixture.id);

    assert.equal(state.enemy.activeIndex, 1, 'Enemy deve ter trocado para o índice 1 (Geodude)');
    assert.equal(BattleEngine.getActiveCombatant(state, 'enemy').id, GeodudeFixture.id);

    const playerSwitchEvt = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.POKEMON_SWITCHED && e.side === 'player');
    assert.ok(playerSwitchEvt);
    assert.equal(playerSwitchEvt.previousPokemonId, CharmanderFixture.id);
    assert.equal(playerSwitchEvt.newPokemonId, PikachuFixture.id);
    assert.equal(playerSwitchEvt.reason, 'VOLUNTARY');
  });

  test('B3-08 — Switch to Active: tentar trocar para o Pokémon que já está em campo é rejeitado', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);

    assert.throws(
      () => BattleEngine.resolveTurn(battle, {
        player: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: CharmanderFixture.id }
      }),
      /já é o Pokémon ativo/
    );
  });

  test('B3-09 — Switch to Fainted: tentar trocar voluntariamente para um Pokémon nocauteado é rejeitado', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    // Simula que Squirtle (índice 2) está nocauteado no banco
    battle.player.team[2].currentHp = 0;

    assert.throws(
      () => BattleEngine.resolveTurn(battle, {
        player: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: SquirtleFixture.id }
      }),
      /já está nocauteado/
    );
  });

  test('B3-10 — Switch Outside Team: tentar trocar para Pokémon que não pertence à equipe é rejeitado', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);

    assert.throws(
      () => BattleEngine.resolveTurn(battle, {
        player: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: 9999 }
      }),
      /Alvo de troca inválido ou não pertence à equipe/
    );
  });

  // ==================================================================
  // 3. PERSISTÊNCIA DE HP E PP NO BANCO (B3-11 a B3-12)
  // ==================================================================

  test('B3-11 — HP Preserved: o dano sofrido por um Pokémon permanece inalterado quando ele é colocado no banco', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);

    // Turno 1: Charmander sofre dano de Bulbasaur
    const { state: stateT1 } = BattleEngine.resolveTurn(battle, {
      player: { moveId: ScratchFixture.id },
      enemy: { moveId: VineWhipFixture.id }
    });

    const charmanderHpAfterT1 = stateT1.player.team[0].currentHp;
    assert.ok(charmanderHpAfterT1 < CharmanderFixture.stats.hp, 'Charmander deve ter sofrido dano');

    // Turno 2: Player troca Charmander por Pikachu
    const { state: stateT2 } = BattleEngine.resolveTurn(stateT1, {
      player: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: PikachuFixture.id },
      enemy: { moveId: ScratchFixture.id }
    });

    assert.equal(stateT2.player.team[0].currentHp, charmanderHpAfterT1, 'HP de Charmander no banco não deve mudar');

    // Turno 3: Player troca Pikachu de volta para Charmander
    const { state: stateT3 } = BattleEngine.resolveTurn(stateT2, {
      player: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: CharmanderFixture.id },
      enemy: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: GeodudeFixture.id }
    });

    assert.equal(stateT3.player.team[0].currentHp, charmanderHpAfterT1, 'HP de Charmander ao retornar deve ser idêntico');
  });

  test('B3-12 — PP Preserved: PP consumido de um golpe permanece preservado quando o Pokémon vai para o banco', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);

    // Turno 1: Charmander usa Ember (PP 25 -> 24)
    const { state: stateT1 } = BattleEngine.resolveTurn(battle, {
      player: { moveId: EmberFixture.id },
      enemy: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: GeodudeFixture.id }
    });

    const emberPpT1 = stateT1.player.team[0].moves.find(m => m.id === EmberFixture.id).currentPp;
    assert.equal(emberPpT1, 24);

    // Turno 2: Troca para Pikachu
    const { state: stateT2 } = BattleEngine.resolveTurn(stateT1, {
      player: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: PikachuFixture.id },
      enemy: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: BulbasaurFixture.id }
    });

    // Turno 3: Troca de volta para Charmander
    const { state: stateT3 } = BattleEngine.resolveTurn(stateT2, {
      player: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: CharmanderFixture.id },
      enemy: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: GeodudeFixture.id }
    });

    const emberPpT3 = stateT3.player.team[0].moves.find(m => m.id === EmberFixture.id).currentPp;
    assert.equal(emberPpT3, 24, 'PP no banco e após retorno deve permanecer em 24');
  });

  // ==================================================================
  // 4. PRIORIDADE DO SWITCH SOBRE MOVE (B3-13 a B3-15)
  // ==================================================================

  test('B3-13 — Player Switch vs Enemy Move: troca do jogador ocorre primeiro e o ataque inimigo atinge o novo Pokémon', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);

    // Player troca de Charmander para Pikachu. Enemy usa Vine Whip (Grass).
    // O golpe deve atingir PIKACHU (não Charmander)!
    const initialPikachuHp = battle.player.team[1].currentHp;
    const initialCharmanderHp = battle.player.team[0].currentHp;

    const { state, events } = BattleEngine.resolveTurn(battle, {
      player: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: PikachuFixture.id },
      enemy: { moveId: VineWhipFixture.id, accuracyRoll: 10 }
    });

    assert.equal(state.player.activeIndex, 1, 'Pikachu deve estar ativo');
    assert.equal(state.player.team[0].currentHp, initialCharmanderHp, 'Charmander não deve ter recebido o golpe');
    assert.ok(state.player.team[1].currentHp < initialPikachuHp, 'Pikachu deve ter recebido o dano do Vine Whip');

    const dmgEvt = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.DAMAGE_APPLIED && e.source === 'enemy');
    assert.equal(dmgEvt.target, 'player');
    assert.deepEqual(dmgEvt.defenderTypes, ['electric'], 'Defensor atingido deve ter os tipos do Pikachu');
  });

  test('B3-14 — Enemy Switch vs Player Move: troca do adversário ocorre primeiro e o ataque do jogador atinge o novo Pokémon', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);

    // Player usa Ember (Fire). Enemy troca de Bulbasaur para Geodude (Rock/Ground).
    // O Ember atinge GEODUDE (que resiste Fire: 0.5x), e não Bulbasaur (que teria 2x fraqueza)!
    const { state, events } = BattleEngine.resolveTurn(battle, {
      player: { moveId: EmberFixture.id, accuracyRoll: 10 },
      enemy: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: GeodudeFixture.id }
    });

    assert.equal(state.enemy.activeIndex, 1, 'Geodude deve estar ativo');

    const typeEvt = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.TYPE_EFFECTIVENESS_RESOLVED && e.source === 'player');
    assert.deepEqual(typeEvt.defenderTypes, ['rock', 'ground'], 'Efetividade deve ser calculada contra os tipos de Geodude');
    assert.equal(typeEvt.multiplier, 0.5, 'Fire contra Rock/Ground é resistido (0.5x)');
  });

  test('B3-15 — Both Switch: ambos realizam troca voluntária, nenhum dano é causado e o turno avança', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);

    const { state, events } = BattleEngine.resolveTurn(battle, {
      player: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: SquirtleFixture.id },
      enemy: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: GyaradosFixture.id }
    });

    assert.equal(state.turn, 2, 'Turno deve ter avançado');
    assert.equal(state.player.activeIndex, 2);
    assert.equal(state.enemy.activeIndex, 2);

    const dmgEvt = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.DAMAGE_APPLIED);
    assert.equal(dmgEvt, undefined, 'Nenhum dano deve ser aplicado em turno de switch duplo');
  });

  // ==================================================================
  // 5. MOVE VS MOVE EM 3x3 (B3-16 a B3-17)
  // ==================================================================

  test('B3-16 — Move vs Move Speed Ordering: iniciativa por velocidade continua regendo ataques entre ativos', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    // Charmander (Speed 65) vs Bulbasaur (Speed 45) -> Player atua primeiro
    const { events } = BattleEngine.resolveTurn(battle, {
      player: { moveId: ScratchFixture.id },
      enemy: { moveId: ScratchFixture.id }
    });

    const firstAction = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.ACTION_STARTED);
    assert.equal(firstAction.actor, 'player');
  });

  test('B3-17 — Move vs Move Rules Preserved: regras da PBA-005 (PP, STAB, Types, Accuracy) preservadas integralmente', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    const { events } = BattleEngine.resolveTurn(battle, {
      player: { moveId: EmberFixture.id, accuracyRoll: 10 },
      enemy: { moveId: VineWhipFixture.id, accuracyRoll: 10 }
    });

    const stabEvt = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.STAB_RESOLVED && e.actor === 'player');
    assert.equal(stabEvt.hasStab, true);
    assert.equal(stabEvt.multiplier, 1.5);

    const typeEvt = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.TYPE_EFFECTIVENESS_RESOLVED && e.source === 'player');
    assert.equal(typeEvt.multiplier, 2); // Fire vs Grass/Poison
  });

  // ==================================================================
  // 6. NOCAUTE E SUBSTITUIÇÃO OBRIGATÓRIA (B3-18 a B3-23)
  // ==================================================================

  test('B3-18 — Faint With Bench: nocaute com reservas vivas NÃO encerra batalha e exige substituição (AWAITING_REPLACEMENT)', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);

    // Charmander nocauteia Bulbasaur (Bulbasaur tem 45 HP e sofre 54 de dano de Ember)
    const { state, events } = BattleEngine.resolveTurn(battle, {
      player: { moveId: EmberFixture.id, accuracyRoll: 10 },
      enemy: { moveId: VineWhipFixture.id }
    });

    assert.equal(state.enemy.team[0].currentHp, 0, 'Bulbasaur ativo deve estar nocauteado');
    assert.equal(state.status, BattleConstants.BATTLE_STATUS.AWAITING_REPLACEMENT, 'Status deve ser AWAITING_REPLACEMENT');
    assert.equal(state.winner, null, 'Vencedor ainda deve ser null pois há banco');

    const replEvt = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.REPLACEMENT_REQUIRED);
    assert.ok(replEvt);
    assert.equal(replEvt.side, 'enemy');
    assert.equal(replEvt.faintedPokemonId, BulbasaurFixture.id);
    assert.deepEqual(replEvt.availablePokemonIds, [GeodudeFixture.id, GyaradosFixture.id]);

    const endEvt = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.BATTLE_ENDED);
    assert.equal(endEvt, undefined, 'BATTLE_ENDED NÃO deve ser emitido enquanto houver reservas vivas');
  });

  test('B3-19 — Faint Without Bench: nocaute do último Pokémon vivo encerra a batalha com vitória', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    // Simula que os dois reservas do adversário já foram derrotados anteriormente
    battle.enemy.team[1].currentHp = 0; // Geodude fainted
    battle.enemy.team[2].currentHp = 0; // Gyarados fainted

    const { state, events } = BattleEngine.resolveTurn(battle, {
      player: { moveId: EmberFixture.id, accuracyRoll: 10 }
    });

    assert.equal(state.status, BattleConstants.BATTLE_STATUS.PLAYER_WIN);
    assert.equal(state.winner, 'player');

    const teamDefeatedEvt = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.TEAM_DEFEATED);
    assert.ok(teamDefeatedEvt);
    assert.equal(teamDefeatedEvt.side, 'enemy');

    const endEvt = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.BATTLE_ENDED);
    assert.ok(endEvt);
    assert.equal(endEvt.winner, 'player');
  });

  test('B3-20 — Fainted Pokémon Cannot Counterattack: Pokémon nocauteado no 1º golpe não contra-ataca e não gasta PP', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    const initialBulbasaurVineWhipPp = VineWhipFixture.pp;

    const { state, events } = BattleEngine.resolveTurn(battle, {
      player: { moveId: EmberFixture.id, accuracyRoll: 10 },
      enemy: { moveId: VineWhipFixture.id }
    });

    const enemyActions = events.filter(e => e.actor === 'enemy');
    assert.equal(enemyActions.length, 0, 'Inimigo nocauteado não pode ter nenhuma ação executada');

    const vineWhipPp = state.enemy.team[0].moves.find(m => m.id === VineWhipFixture.id).currentPp;
    assert.equal(vineWhipPp, initialBulbasaurVineWhipPp, 'PP do golpe não executado não deve ser consumido');
  });

  test('B3-21 — Replacement Select Valid: seleção de substituto válido transita para novo ativo e retoma IN_PROGRESS', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    // Nocauteia Bulbasaur
    const { state: stateAwaiting } = BattleEngine.resolveTurn(battle, {
      player: { moveId: EmberFixture.id, accuracyRoll: 10 }
    });

    assert.equal(stateAwaiting.status, BattleConstants.BATTLE_STATUS.AWAITING_REPLACEMENT);

    // Adversário escolhe Geodude (índice 1) para entrar no lugar de Bulbasaur
    const { state: stateReplaced, events } = BattleEngine.resolveReplacement(stateAwaiting, {
      enemy: { targetPokemonId: GeodudeFixture.id }
    });

    assert.equal(stateReplaced.status, BattleConstants.BATTLE_STATUS.IN_PROGRESS);
    assert.equal(stateReplaced.enemy.activeIndex, 1);
    assert.equal(BattleEngine.getActiveCombatant(stateReplaced, 'enemy').id, GeodudeFixture.id);
    assert.equal(stateReplaced.turn, 2, 'Contador de turnos deve avançar para o próximo round');

    const switchEvt = events.find(e => e.type === BattleConstants.BATTLE_EVENTS.POKEMON_SWITCHED && e.side === 'enemy');
    assert.ok(switchEvt);
    assert.equal(switchEvt.previousPokemonId, BulbasaurFixture.id);
    assert.equal(switchEvt.newPokemonId, GeodudeFixture.id);
    assert.equal(switchEvt.reason, 'FAINT_REPLACEMENT');
  });

  test('B3-22 — Replacement Fainted Rejected: selecionar substituto nocauteado na troca forçada é rejeitado', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    battle.enemy.team[1].currentHp = 0; // Geodude já nocauteado

    const { state: stateAwaiting } = BattleEngine.resolveTurn(battle, {
      player: { moveId: EmberFixture.id, accuracyRoll: 10 }
    });

    assert.throws(
      () => BattleEngine.resolveReplacement(stateAwaiting, {
        enemy: { targetPokemonId: GeodudeFixture.id }
      }),
      /já está nocauteado/
    );
  });

  test('B3-23 — Replacement Active Rejected: selecionar o próprio Pokémon que acabou de ser nocauteado é rejeitado', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    const { state: stateAwaiting } = BattleEngine.resolveTurn(battle, {
      player: { moveId: EmberFixture.id, accuracyRoll: 10 }
    });

    assert.throws(
      () => BattleEngine.resolveReplacement(stateAwaiting, {
        enemy: { targetPokemonId: BulbasaurFixture.id } // Índice 0 que acabou de cair
      }),
      /Substituto inválido/
    );
  });

  // ==================================================================
  // 7. PROGRESSÃO DOS 3 NOCAUTES (B3-24 a B3-26)
  // ==================================================================

  test('B3-24 — First Knockout: 1º nocaute deixa 2 Pokémon vivos e a batalha continua', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    const { state } = BattleEngine.resolveTurn(battle, {
      player: { moveId: EmberFixture.id, accuracyRoll: 10 }
    });

    const aliveCount = state.enemy.team.filter(p => p.currentHp > 0).length;
    assert.equal(aliveCount, 2);
    assert.equal(state.status, BattleConstants.BATTLE_STATUS.AWAITING_REPLACEMENT);
  });

  test('B3-25 — Second Knockout: 2º nocaute deixa 1 Pokémon vivo e a batalha continua', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    battle.enemy.team[0].currentHp = 0; // 1º já nocauteado
    battle.enemy.activeIndex = 1; // Geodude ativo (índice 1)

    // Squirtle do player usa Water Gun (Water 2x em Rock/Ground Geodude, 40 HP -> nocaute!)
    battle.player.activeIndex = 2; // Squirtle ativo

    const { state } = BattleEngine.resolveTurn(battle, {
      player: { moveId: WaterGunFixture.id, accuracyRoll: 10 }
    });

    const aliveCount = state.enemy.team.filter(p => p.currentHp > 0).length;
    assert.equal(aliveCount, 1, 'Apenas Gyarados deve restar vivo');
    assert.equal(state.status, BattleConstants.BATTLE_STATUS.AWAITING_REPLACEMENT);
  });

  test('B3-26 — Third Knockout: 3º nocaute encerra o combate com TEAM_DEFEATED e BATTLE_ENDED', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    battle.enemy.team[0].currentHp = 0; // Bulbasaur fainted
    battle.enemy.team[1].currentHp = 0; // Geodude fainted
    battle.enemy.activeIndex = 2; // Gyarados ativo

    // Pikachu (Electric) usa Thunderbolt (Electric 4x em Water/Flying Gyarados -> nocaute!)
    battle.player.activeIndex = 1; // Pikachu ativo

    const { state, events } = BattleEngine.resolveTurn(battle, {
      player: { moveId: ThunderboltFixture.id, accuracyRoll: 10 }
    });

    const aliveCount = state.enemy.team.filter(p => p.currentHp > 0).length;
    assert.equal(aliveCount, 0, 'Todos os 3 Pokémon inimigos devem estar nocauteados');
    assert.equal(state.status, BattleConstants.BATTLE_STATUS.PLAYER_WIN);
    assert.equal(state.winner, 'player');

    assert.ok(events.some(e => e.type === BattleConstants.BATTLE_EVENTS.TEAM_DEFEATED));
    assert.ok(events.some(e => e.type === BattleConstants.BATTLE_EVENTS.BATTLE_ENDED));
  });

  // ==================================================================
  // 8. ORDENAÇÃO DE EVENTOS ESTRUTURADOS (B3-27 a B3-29)
  // ==================================================================

  test('B3-27 — Switch + Move Events: sequência ordenada de eventos na troca com ataque subsequente', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);

    const { events } = BattleEngine.resolveTurn(battle, {
      player: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: PikachuFixture.id },
      enemy: { moveId: ScratchFixture.id }
    });

    const turnStartedIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.TURN_STARTED);
    const switchStartedIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.SWITCH_STARTED);
    const switchedIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.POKEMON_SWITCHED);
    const actionStartedIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.ACTION_STARTED);
    const moveUsedIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.MOVE_USED);
    const damageAppliedIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.DAMAGE_APPLIED);

    assert.ok(turnStartedIdx < switchStartedIdx, 'TURN_STARTED < SWITCH_STARTED');
    assert.ok(switchStartedIdx < switchedIdx, 'SWITCH_STARTED < POKEMON_SWITCHED');
    assert.ok(switchedIdx < actionStartedIdx, 'POKEMON_SWITCHED < ACTION_STARTED');
    assert.ok(actionStartedIdx < moveUsedIdx, 'ACTION_STARTED < MOVE_USED');
    assert.ok(moveUsedIdx < damageAppliedIdx, 'MOVE_USED < DAMAGE_APPLIED');
  });

  test('B3-28 — Forced Replacement Events: sequência em nocaute com reservas vivas', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);

    const { events } = BattleEngine.resolveTurn(battle, {
      player: { moveId: EmberFixture.id, accuracyRoll: 10 }
    });

    const dmgIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.DAMAGE_APPLIED);
    const faintIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.POKEMON_FAINTED);
    const replIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.REPLACEMENT_REQUIRED);

    assert.ok(dmgIdx < faintIdx, 'DAMAGE_APPLIED < POKEMON_FAINTED');
    assert.ok(faintIdx < replIdx, 'POKEMON_FAINTED < REPLACEMENT_REQUIRED');

    const battleEndedIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.BATTLE_ENDED);
    assert.equal(battleEndedIdx, -1, 'BATTLE_ENDED não deve existir');
  });

  test('B3-29 — Final Team Defeat Events: sequência no nocaute final da equipe inteira', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    battle.enemy.team[1].currentHp = 0;
    battle.enemy.team[2].currentHp = 0;

    const { events } = BattleEngine.resolveTurn(battle, {
      player: { moveId: EmberFixture.id, accuracyRoll: 10 }
    });

    const dmgIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.DAMAGE_APPLIED);
    const faintIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.POKEMON_FAINTED);
    const teamDefeatedIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.TEAM_DEFEATED);
    const battleEndedIdx = events.findIndex(e => e.type === BattleConstants.BATTLE_EVENTS.BATTLE_ENDED);

    assert.ok(dmgIdx < faintIdx, 'DAMAGE_APPLIED < POKEMON_FAINTED');
    assert.ok(faintIdx < teamDefeatedIdx, 'POKEMON_FAINTED < TEAM_DEFEATED');
    assert.ok(teamDefeatedIdx < battleEndedIdx, 'TEAM_DEFEATED < BATTLE_ENDED');
  });

  // ==================================================================
  // 9. DETERMINISMO E IMUTABILIDADE (B3-30 a B3-34)
  // ==================================================================

  test('B3-30 — Determinism: mesmas equipes, ações e trocas produzem resultados rigorosamente idênticos', () => {
    const actions = [
      { player: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: PikachuFixture.id }, enemy: { moveId: ScratchFixture.id } }
    ];

    const run1 = BattleEngine.simulateTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture, 50, actions);
    const run2 = BattleEngine.simulateTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture, 50, actions);

    assert.deepEqual(run1.state, run2.state);
    assert.deepEqual(run1.events, run2.events);
  });

  test('B3-31 — Immutability: equipes originais e dados de Pokémon fornecidos não sofrem mutação', () => {
    const clonePlayer = JSON.parse(JSON.stringify(PlayerTeam3Fixture));
    const cloneEnemy = JSON.parse(JSON.stringify(EnemyTeam3Fixture));

    BattleEngine.simulateTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture, 50);

    assert.deepEqual(PlayerTeam3Fixture, clonePlayer, 'Equipe do jogador não pode sofrer mutação');
    assert.deepEqual(EnemyTeam3Fixture, cloneEnemy, 'Equipe adversária não pode sofrer mutação');
  });

  test('B3-32 — Switch Does Not Reset Move State: PP consumido antes da troca permanece com o mesmo valor após retorno', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);

    // Charmander usa Scratch (35 -> 34 PP)
    const { state: s1 } = BattleEngine.resolveTurn(battle, {
      player: { moveId: ScratchFixture.id },
      enemy: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: GeodudeFixture.id }
    });

    // Troca para Pikachu
    const { state: s2 } = BattleEngine.resolveTurn(s1, {
      player: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: PikachuFixture.id },
      enemy: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: BulbasaurFixture.id }
    });

    // Troca de volta para Charmander
    const { state: s3 } = BattleEngine.resolveTurn(s2, {
      player: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: CharmanderFixture.id },
      enemy: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: GeodudeFixture.id }
    });

    const scratch = s3.player.team[0].moves.find(m => m.id === ScratchFixture.id);
    assert.equal(scratch.currentPp, 34);
  });

  test('B3-33 — Switch Does Not Heal: HP não é restaurado ao trocar para o banco e voltar', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    battle.player.team[0].currentHp = 12; // Charmander ferido

    // Troca para Pikachu e volta
    const { state: s1 } = BattleEngine.resolveTurn(battle, {
      player: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: PikachuFixture.id },
      enemy: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: GeodudeFixture.id }
    });

    const { state: s2 } = BattleEngine.resolveTurn(s1, {
      player: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: CharmanderFixture.id },
      enemy: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: BulbasaurFixture.id }
    });

    assert.equal(s2.player.team[0].currentHp, 12, 'HP deve permanecer exatamente 12');
  });

  test('B3-34 — Fainted Never Returns: Pokémon nocauteado é bloqueado permanentemente de retornar ao combate', () => {
    const battle = BattleEngine.createTeamBattle(PlayerTeam3Fixture, EnemyTeam3Fixture);
    battle.player.team[0].currentHp = 0; // Charmander nocauteado
    battle.player.activeIndex = 1; // Pikachu ativo

    assert.throws(
      () => BattleEngine.resolveTurn(battle, {
        player: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: CharmanderFixture.id }
      }),
      /já está nocauteado/
    );
  });

  // ==================================================================
  // 10. SIMULAÇÃO COMPLETA 3x3 (B3-35)
  // ==================================================================

  test('B3-35 — Full 3x3 Simulation: confronto completo 3v3 até nocaute final com trocas voluntárias e forçadas', () => {
    // Roteiro de simulação 3x3:
    // Turno 1: Charmander usa Ember (super effective 2x + STAB) -> 1-hit KO em Bulbasaur!
    // Substituição 1: Enemy substitui Bulbasaur por Geodude -> IN_PROGRESS
    // Turno 2: Player faz troca voluntária (Charmander -> Squirtle), Geodude usa Scratch (Squirtle resiste com alta defesa)
    // Turno 3: Squirtle usa Water Gun (super effective 4x + STAB) -> 1-hit KO em Geodude!
    // Substituição 2: Enemy substitui Geodude por Gyarados -> IN_PROGRESS
    // Turno 4: Player faz troca voluntária (Squirtle -> Pikachu), Gyarados ataca e erra (accuracyRoll: 100)
    // Turno 5: Pikachu (mais rápido, Spd 90 vs 81) usa Thunderbolt (super effective 4x + STAB) -> 1-hit KO em Gyarados!
    // Fim: TEAM_DEFEATED -> BATTLE_ENDED -> PLAYER_WIN!
    const turnActions = [
      { player: { moveId: EmberFixture.id, accuracyRoll: 10 }, enemy: { moveId: VineWhipFixture.id } },
      { player: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: SquirtleFixture.id }, enemy: { moveId: ScratchFixture.id, accuracyRoll: 10 } },
      { player: { moveId: WaterGunFixture.id, accuracyRoll: 10 }, enemy: { moveId: ScratchFixture.id } },
      { player: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetPokemonId: PikachuFixture.id }, enemy: { moveId: WaterGunFixture.id, accuracyRoll: 10 } },
      { player: { moveId: ThunderboltFixture.id, accuracyRoll: 10 }, enemy: { moveId: ScratchFixture.id } }
    ];

    const replacementActions = [
      { enemy: { targetPokemonId: GeodudeFixture.id } },
      { enemy: { targetPokemonId: GyaradosFixture.id } }
    ];

    const result = BattleEngine.simulateTeamBattle(
      PlayerTeam3Fixture,
      EnemyTeam3Fixture,
      50,
      turnActions,
      replacementActions
    );

    assert.equal(result.state.status, BattleConstants.BATTLE_STATUS.PLAYER_WIN);
    assert.equal(result.state.winner, 'player');

    // Confirma que todos os 3 Pokémon do adversário foram derrotados
    assert.equal(result.state.enemy.team[0].currentHp, 0, 'Bulbasaur nocauteado');
    assert.equal(result.state.enemy.team[1].currentHp, 0, 'Geodude nocauteado');
    assert.equal(result.state.enemy.team[2].currentHp, 0, 'Gyarados nocauteado');

    // Confirma que o player venceu com membros saudáveis
    assert.ok(result.state.player.team.some(p => p.currentHp > 0));

    // Valida a presença dos eventos críticos
    assert.ok(result.events.some(e => e.type === BattleConstants.BATTLE_EVENTS.SWITCH_STARTED), 'Deve conter trocas voluntárias');
    assert.ok(result.events.some(e => e.type === BattleConstants.BATTLE_EVENTS.REPLACEMENT_REQUIRED), 'Deve conter trocas forçadas');
    assert.ok(result.events.some(e => e.type === BattleConstants.BATTLE_EVENTS.TEAM_DEFEATED), 'Deve conter TEAM_DEFEATED');
    assert.ok(result.events.some(e => e.type === BattleConstants.BATTLE_EVENTS.BATTLE_ENDED), 'Deve conter BATTLE_ENDED');
  });

});
