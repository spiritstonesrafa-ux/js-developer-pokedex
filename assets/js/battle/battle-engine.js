/**
 * ====================================================================
 * MOTOR DE BATALHA: BATTLE ENGINE V1 (battle-engine.js)
 * ====================================================================
 * Núcleo matemático de simulação de combate 1x1 da Fase PBA-003.
 * 
 * Princípios Fundamentais:
 * - GAME ENGINE ≠ PRESENTATION ENGINE;
 * - Completamente isolado de DOM, Fetch/PokéAPI, LocalStorage e Áudio;
 * - Determinístico (sem Math.random());
 * - Imutabilidade: entradas originais nunca são modificadas;
 * - Baseado em eventos descritivos de ciclo de combate;
 * - Suporta Node.js (testes automatizados) e Browser (window.PBABattle).
 */

let constants;
let DamageCalculator;
let TurnManager;

if (typeof module !== 'undefined' && module.exports) {
  constants = require('./battle-constants.js');
  DamageCalculator = require('./damage-calculator.js');
  TurnManager = require('./turn-manager.js');
} else if (typeof window !== 'undefined' && window.PBABattle) {
  constants = window.PBABattle;
  DamageCalculator = window.PBABattle.DamageCalculator;
  TurnManager = window.PBABattle.TurnManager;
} else {
  // Fallbacks de segurança se carregado fora de ordem
  constants = {
    BATTLE_STATUS: {
      READY: 'READY',
      IN_PROGRESS: 'IN_PROGRESS',
      PLAYER_WIN: 'PLAYER_WIN',
      ENEMY_WIN: 'ENEMY_WIN'
    },
    BATTLE_EVENTS: {
      BATTLE_STARTED: 'BATTLE_STARTED',
      TURN_STARTED: 'TURN_STARTED',
      ACTION_STARTED: 'ACTION_STARTED',
      DAMAGE_APPLIED: 'DAMAGE_APPLIED',
      POKEMON_FAINTED: 'POKEMON_FAINTED',
      BATTLE_ENDED: 'BATTLE_ENDED'
    },
    BATTLE_ACTIONS: {
      BASIC_ATTACK: 'BASIC_ATTACK'
    },
    BATTLE_CONFIG: {
      SIMULATION_LEVEL: 50,
      BASIC_ATTACK_POWER: 40,
      PLAYER_FIRST_ON_SPEED_TIE: true,
      MAX_TURNS_LIMIT: 100
    }
  };
}

const BattleEngine = (() => {
  const { BATTLE_STATUS, BATTLE_EVENTS, BATTLE_ACTIONS, BATTLE_CONFIG } = constants;

  /**
   * Valida e normaliza um Pokémon para o modelo de combate.
   * Não muta o objeto de entrada.
   * 
   * @param {Object} raw - Dados brutos do Pokémon.
   * @returns {Object} Combatente normalizado.
   * @throws {Error} Se qualquer dado obrigatório for ausente ou inválido.
   */
  function createCombatant(raw) {
    if (!raw || typeof raw !== 'object') {
      throw new Error('Combatente inválido: dados devem ser um objeto não nulo.');
    }

    const id = Number(raw.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(`ID do combatente inválido: ${raw.id}. Deve ser um inteiro positivo.`);
    }

    if (typeof raw.name !== 'string' || raw.name.trim().length === 0) {
      throw new Error(`Nome do combatente inválido: "${raw.name}". Deve ser uma string não vazia.`);
    }

    // Extrai atributos de stats aninhados ou de propriedades planas
    const rawStats = raw.stats || {};
    const hpVal = rawStats.hp ?? raw.maxHp ?? raw.hp ?? raw.currentHp;
    const atkVal = rawStats.attack ?? raw.attack;
    const defVal = rawStats.defense ?? raw.defense;
    const spdVal = rawStats.speed ?? raw.speed;

    const hp = Number(hpVal);
    const attack = Number(atkVal);
    const defense = Number(defVal);
    const speed = Number(spdVal);

    if (!Number.isFinite(hp) || hp <= 0) {
      throw new Error(`HP do combatente "${raw.name}" inválido: ${hpVal}. Deve ser maior que zero.`);
    }

    if (!Number.isFinite(attack) || attack <= 0) {
      throw new Error(`Ataque do combatente "${raw.name}" inválido: ${atkVal}. Deve ser maior que zero.`);
    }

    if (!Number.isFinite(defense) || defense <= 0) {
      throw new Error(`Defesa do combatente "${raw.name}" inválido: ${defVal}. Deve ser maior que zero.`);
    }

    if (!Number.isFinite(speed) || speed < 0) {
      throw new Error(`Velocidade do combatente "${raw.name}" inválida: ${spdVal}. Não pode ser negativa.`);
    }

    return {
      id,
      name: raw.name.trim().toLowerCase(),
      maxHp: Math.floor(hp),
      currentHp: Math.floor(hp),
      attack: Math.floor(attack),
      defense: Math.floor(defense),
      speed: Math.floor(speed)
    };
  }

  /**
   * Inicializa um estado de batalha 1x1 a partir de dois combatentes.
   * Garante total imutabilidade dos parâmetros de entrada.
   * 
   * @param {Object} playerInput - Dados do Pokémon do jogador.
   * @param {Object} enemyInput - Dados do Pokémon adversário.
   * @returns {Object} Estado inicial da batalha.
   */
  function createBattle(playerInput, enemyInput) {
    const playerCombatant = createCombatant(playerInput);
    const enemyCombatant = createCombatant(enemyInput);

    const state = {
      version: 1,
      status: BATTLE_STATUS.IN_PROGRESS,
      turn: 1,
      player: playerCombatant,
      enemy: enemyCombatant,
      winner: null
    };

    return state;
  }

  /**
   * Executa um único turno completo da batalha.
   * Não muta o estado recebido; retorna um novo estado clonado e a lista de eventos.
   * 
   * @param {Object} currentState - Estado atual da batalha.
   * @returns {{ state: Object, events: Array<Object> }} Novo estado e eventos gerados.
   * @throws {Error} Se o estado for inválido ou se a batalha já estiver encerrada.
   */
  function resolveTurn(currentState) {
    if (!currentState || typeof currentState !== 'object') {
      throw new Error('Estado de batalha inválido.');
    }

    if (currentState.status !== BATTLE_STATUS.IN_PROGRESS) {
      throw new Error(`Não é possível executar turno em uma batalha com status: ${currentState.status}. A batalha já foi encerrada.`);
    }

    // Clona o estado para garantir total imutabilidade da entrada
    const nextState = JSON.parse(JSON.stringify(currentState));
    const events = [];
    const currentTurn = nextState.turn;

    // Evento de início do turno
    events.push({
      type: BATTLE_EVENTS.TURN_STARTED,
      turn: currentTurn
    });

    // Determina a ordem de ação usando o TurnManager
    const order = TurnManager.determineOrder(nextState.player, nextState.enemy);
    const [firstRole, secondRole] = order;

    // --- AÇÃO DO PRIMEIRO COMBATENTE ---
    executeAction(firstRole, secondRole, nextState, events);

    // Se o defensor foi derrotado, o segundo combatente NÃO contra-ataca
    if (nextState.status !== BATTLE_STATUS.IN_PROGRESS) {
      return {
        state: nextState,
        events
      };
    }

    // --- AÇÃO DO SEGUNDO COMBATENTE ---
    executeAction(secondRole, firstRole, nextState, events);

    // Se a batalha continuar, avança o contador de turnos
    if (nextState.status === BATTLE_STATUS.IN_PROGRESS) {
      nextState.turn += 1;
    }

    return {
      state: nextState,
      events
    };
  }

  /**
   * Executa a ação de ataque de um combatente contra outro dentro do turno.
   * Atualiza o estado recebido e empilha os eventos correspondentes.
   * 
   * @private
   * @param {'player'|'enemy'} attackerRole - Papel de quem ataca.
   * @param {'player'|'enemy'} defenderRole - Papel de quem defende.
   * @param {Object} state - Estado mutável do turno em resolução.
   * @param {Array<Object>} events - Lista de eventos do turno.
   */
  function executeAction(attackerRole, defenderRole, state, events) {
    const attacker = state[attackerRole];
    const defender = state[defenderRole];

    // 1. Notifica início da ação
    events.push({
      type: BATTLE_EVENTS.ACTION_STARTED,
      actor: attackerRole,
      pokemonName: attacker.name,
      action: BATTLE_ACTIONS.BASIC_ATTACK
    });

    // 2. Calcula dano determinístico
    const damage = DamageCalculator.calculate(attacker.attack, defender.defense);

    // 3. Aplica o dano respeitando o piso de 0 HP
    const previousHp = defender.currentHp;
    const currentHp = Math.max(0, previousHp - damage);
    defender.currentHp = currentHp;

    // 4. Emite evento de dano aplicado
    events.push({
      type: BATTLE_EVENTS.DAMAGE_APPLIED,
      source: attackerRole,
      target: defenderRole,
      damage,
      previousHp,
      currentHp
    });

    // 5. Verifica se o defensor foi nocauteado
    if (currentHp === 0) {
      events.push({
        type: BATTLE_EVENTS.POKEMON_FAINTED,
        target: defenderRole,
        pokemonName: defender.name
      });

      // Define vencedor e status final
      state.winner = attackerRole;
      state.status = attackerRole === 'player' ? BATTLE_STATUS.PLAYER_WIN : BATTLE_STATUS.ENEMY_WIN;

      events.push({
        type: BATTLE_EVENTS.BATTLE_ENDED,
        winner: attackerRole,
        reason: `${defender.name} foi derrotado.`
      });
    }
  }

  /**
   * Simula uma batalha completa até existir um vencedor ou atingir o limite de turnos.
   * 
   * @param {Object} playerInput - Dados do Pokémon do jogador.
   * @param {Object} enemyInput - Dados do Pokémon adversário.
   * @param {number} [maxTurns] - Limite máximo de turnos para segurança contra loop (padrão 100).
   * @returns {{ state: Object, events: Array<Object>, totalTurns: number }}
   */
  function simulateBattle(playerInput, enemyInput, maxTurns = BATTLE_CONFIG.MAX_TURNS_LIMIT) {
    let state = createBattle(playerInput, enemyInput);
    const allEvents = [
      {
        type: BATTLE_EVENTS.BATTLE_STARTED,
        player: { id: state.player.id, name: state.player.name, maxHp: state.player.maxHp },
        enemy: { id: state.enemy.id, name: state.enemy.name, maxHp: state.enemy.maxHp }
      }
    ];

    let safetyCounter = 0;
    while (state.status === BATTLE_STATUS.IN_PROGRESS) {
      safetyCounter++;
      if (safetyCounter > maxTurns) {
        throw new Error(`Limite de segurança de turnos (${maxTurns}) atingido. Simulação abortada para evitar loop infinito.`);
      }

      const turnResult = resolveTurn(state);
      state = turnResult.state;
      allEvents.push(...turnResult.events);
    }

    return {
      state,
      events: allEvents,
      totalTurns: state.turn
    };
  }

  return {
    createCombatant,
    createBattle,
    resolveTurn,
    simulateBattle
  };
})();

// Suporte universal (Node.js & Browser)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BattleEngine;
} else if (typeof window !== 'undefined') {
  window.PBABattle = window.PBABattle || {};
  window.PBABattle.BattleEngine = BattleEngine;
}
