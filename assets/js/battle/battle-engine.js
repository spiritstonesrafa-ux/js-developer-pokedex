/**
 * ====================================================================
 * MOTOR DE BATALHA: BATTLE ENGINE V2 + MOVE SYSTEM (battle-engine.js)
 * ====================================================================
 * Núcleo matemático de simulação de combate 1x1 das Fases PBA-003, PBA-004 e PBA-005.
 * 
 * Princípios Fundamentais:
 * - GAME ENGINE ≠ PRESENTATION ENGINE;
 * - Isolado de DOM, Fetch/PokéAPI, LocalStorage, Áudio e Math.random();
 * - Determinístico: acurácia resolvida com rolls externos fornecidos pelo chamador;
 * - Imutabilidade: entradas originais nunca são modificadas;
 * - Move System completo: Power, Accuracy, Physical/Special, PP e STAB;
 * - Integração completa com o sistema de tipos (TypeEffectiveness);
 * - Suporta Node.js (testes automatizados) e Browser (window.PBABattle).
 */

(function () {
  let constants;
  let DamageCalculator;
  let TurnManager;
  let TypeEffectiveness;
  let MoveModel;

  if (typeof module !== 'undefined' && module.exports) {
    constants = require('./battle-constants.js');
    DamageCalculator = require('./damage-calculator.js');
    TurnManager = require('./turn-manager.js');
    TypeEffectiveness = require('./type-effectiveness.js');
    MoveModel = require('./move-model.js');
  } else if (typeof window !== 'undefined' && window.PBABattle) {
    constants = window.PBABattle;
    DamageCalculator = window.PBABattle.DamageCalculator;
    TurnManager = window.PBABattle.TurnManager;
    TypeEffectiveness = window.PBABattle.TypeEffectiveness;
    MoveModel = window.PBABattle.MoveModel;
  } else {
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
        MOVE_SELECTED: 'MOVE_SELECTED',
        MOVE_USED: 'MOVE_USED',
        PP_CHANGED: 'PP_CHANGED',
        MOVE_MISSED: 'MOVE_MISSED',
        STAB_RESOLVED: 'STAB_RESOLVED',
        TYPE_EFFECTIVENESS_RESOLVED: 'TYPE_EFFECTIVENESS_RESOLVED',
        DAMAGE_APPLIED: 'DAMAGE_APPLIED',
        POKEMON_FAINTED: 'POKEMON_FAINTED',
        BATTLE_ENDED: 'BATTLE_ENDED'
      },
      BATTLE_ACTIONS: {
        MOVE: 'MOVE',
        BASIC_ATTACK: 'BASIC_ATTACK'
      },
      MOVE_DAMAGE_CLASSES: {
        PHYSICAL: 'physical',
        SPECIAL: 'special',
        STATUS: 'status'
      },
      BATTLE_CONFIG: {
        SIMULATION_LEVEL: 50,
        BASIC_ATTACK_POWER: 40,
        PLAYER_FIRST_ON_SPEED_TIE: true,
        MAX_TURNS_LIMIT: 100,
        MOVE_LOADOUT_MIN: 1,
        MOVE_LOADOUT_MAX: 4,
        STAB_MULTIPLIER: 1.5
      }
    };
  }

  const BattleEngine = (() => {
    const { BATTLE_STATUS, BATTLE_EVENTS, BATTLE_ACTIONS, MOVE_DAMAGE_CLASSES, BATTLE_CONFIG } = constants;

    /**
     * Valida e normaliza um Pokémon para o Combatant Model v3.
     * Não muta o objeto de entrada.
     * 
     * @param {Object} raw - Dados brutos do Pokémon.
     * @returns {Object} Combatente normalizado com atributos, tipos e moves.
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

      // Validação dos tipos (1 a 2 tipos)
      const rawTypes = raw.types || (raw.type ? [raw.type] : null);
      if (!rawTypes) {
        throw new Error(`Tipos do combatente "${raw.name}" inválidos: tipos são obrigatórios.`);
      }

      const normalizedTypes = TypeEffectiveness.normalizeDefenderTypes(rawTypes);

      // Extrai stats
      const rawStats = raw.stats || {};
      const hpVal = rawStats.hp ?? raw.maxHp ?? raw.hp ?? raw.currentHp;
      const atkVal = rawStats.attack ?? raw.attack;
      const defVal = rawStats.defense ?? raw.defense;
      const spAtkVal = rawStats.specialAttack ?? raw.specialAttack ?? rawStats['special-attack'] ?? atkVal;
      const spDefVal = rawStats.specialDefense ?? raw.specialDefense ?? rawStats['special-defense'] ?? defVal;
      const spdVal = rawStats.speed ?? raw.speed;

      const hp = Number(hpVal);
      const attack = Number(atkVal);
      const defense = Number(defVal);
      const specialAttack = Number(spAtkVal);
      const specialDefense = Number(spDefVal);
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

      if (!Number.isFinite(specialAttack) || specialAttack <= 0) {
        throw new Error(`Ataque Especial do combatente "${raw.name}" inválido: ${spAtkVal}. Deve ser maior que zero.`);
      }

      if (!Number.isFinite(specialDefense) || specialDefense <= 0) {
        throw new Error(`Defesa Especial do combatente "${raw.name}" inválido: ${spDefVal}. Deve ser maior que zero.`);
      }

      if (!Number.isFinite(speed) || speed < 0) {
        throw new Error(`Velocidade do combatente "${raw.name}" inválida: ${spdVal}. Não pode ser negativa.`);
      }

      // Validação do loadout de moves (Fase PBA-005: 1 a 4 moves sem duplicatas)
      const rawMoves = raw.moves;
      if (!Array.isArray(rawMoves) || rawMoves.length < BATTLE_CONFIG.MOVE_LOADOUT_MIN) {
        throw new Error(`Loadout de golpes inválido para "${raw.name}": deve possuir pelo menos ${BATTLE_CONFIG.MOVE_LOADOUT_MIN} golpe.`);
      }

      if (rawMoves.length > BATTLE_CONFIG.MOVE_LOADOUT_MAX) {
        throw new Error(`Loadout de golpes excede o limite máximo para "${raw.name}": possui ${rawMoves.length}, máximo permitido é ${BATTLE_CONFIG.MOVE_LOADOUT_MAX}.`);
      }

      const normalizedMoves = [];
      const seenMoveIds = new Set();
      const seenMoveNames = new Set();

      for (const m of rawMoves) {
        let normalizedMove;
        if (MoveModel && typeof MoveModel.createMove === 'function') {
          normalizedMove = MoveModel.createMove(m);
        } else {
          normalizedMove = {
            id: Number(m.id),
            name: String(m.name).trim().toLowerCase(),
            type: String(m.type).trim().toLowerCase(),
            power: Number(m.power),
            accuracy: m.accuracy !== undefined ? m.accuracy : 100,
            pp: Number(m.pp),
            damageClass: String(m.damageClass || 'physical').toLowerCase()
          };
        }

        if (seenMoveIds.has(normalizedMove.id) || seenMoveNames.has(normalizedMove.name)) {
          throw new Error(`Golpe duplicado no loadout de "${raw.name}": [ID ${normalizedMove.id} - ${normalizedMove.name}].`);
        }

        seenMoveIds.add(normalizedMove.id);
        seenMoveNames.add(normalizedMove.name);

        // Estado runtime de combate do move
        normalizedMoves.push({
          id: normalizedMove.id,
          name: normalizedMove.name,
          type: normalizedMove.type,
          power: normalizedMove.power,
          accuracy: normalizedMove.accuracy,
          maxPp: normalizedMove.pp,
          currentPp: m.currentPp !== undefined ? Number(m.currentPp) : normalizedMove.pp,
          damageClass: normalizedMove.damageClass
        });
      }

      return {
        id,
        name: raw.name.trim().toLowerCase(),
        types: normalizedTypes,
        maxHp: Math.floor(hp),
        currentHp: Math.floor(hp),
        attack: Math.floor(attack),
        defense: Math.floor(defense),
        specialAttack: Math.floor(specialAttack),
        specialDefense: Math.floor(specialDefense),
        speed: Math.floor(speed),
        moves: normalizedMoves
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
     * @param {Object} [actions] - Comandos de ação: { player: { moveId, accuracyRoll }, enemy: { moveId, accuracyRoll } }.
     * @returns {{ state: Object, events: Array<Object> }} Novo estado e eventos gerados.
     * @throws {Error} Se o estado for inválido ou se a batalha já estiver encerrada.
     */
    function resolveTurn(currentState, actions = {}) {
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

      const firstAction = actions[firstRole];
      const secondAction = actions[secondRole];

      // --- AÇÃO DO PRIMEIRO COMBATENTE ---
      executeAction(firstRole, secondRole, nextState, events, firstAction);

      // Se o defensor foi derrotado, o segundo combatente NÃO contra-ataca e NÃO consome PP
      if (nextState.status !== BATTLE_STATUS.IN_PROGRESS) {
        return {
          state: nextState,
          events
        };
      }

      // --- AÇÃO DO SEGUNDO COMBATENTE ---
      executeAction(secondRole, firstRole, nextState, events, secondAction);

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
     * Executa a ação de golpe de um combatente contra outro dentro do turno.
     * Atualiza o estado recebido e empilha os eventos correspondentes em ordem estrita.
     * 
     * @private
     * @param {'player'|'enemy'} attackerRole - Papel de quem ataca.
     * @param {'player'|'enemy'} defenderRole - Papel de quem defende.
     * @param {Object} state - Estado mutável do turno em resolução.
     * @param {Array<Object>} events - Lista de eventos do turno.
     * @param {Object} [action] - Comando da ação { moveId, accuracyRoll }.
     */
    function executeAction(attackerRole, defenderRole, state, events, action) {
      const attacker = state[attackerRole];
      const defender = state[defenderRole];

      // 1. Seleciona o golpe a ser executado
      let selectedMove;
      if (action && (action.moveId !== undefined || action.moveName !== undefined)) {
        selectedMove = attacker.moves.find(m =>
          (action.moveId !== undefined && m.id === Number(action.moveId)) ||
          (action.moveName !== undefined && m.name.toLowerCase() === String(action.moveName).trim().toLowerCase())
        );
        if (!selectedMove) {
          throw new Error(`Golpe especificado não pertence ao loadout de "${attacker.name}": ${JSON.stringify(action)}`);
        }
      } else {
        // Fallback automático para o primeiro golpe com PP disponível
        selectedMove = attacker.moves.find(m => m.currentPp > 0);
      }

      if (!selectedMove) {
        throw new Error(`NO_USABLE_MOVES: "${attacker.name}" não possui golpes utilizáveis com PP disponível.`);
      }

      // Validação de PP
      if (selectedMove.currentPp <= 0) {
        throw new Error(`ACTION_REJECTED: PP do golpe "${selectedMove.name}" está esgotado.`);
      }

      // Validação do roll de acurácia determinístico
      let accuracyRoll = 1; // Padrão garante acerto em chamadas sem roll explícito
      if (action && action.accuracyRoll !== undefined) {
        const roll = Number(action.accuracyRoll);
        if (!Number.isFinite(roll) || !Number.isInteger(roll) || roll < 1 || roll > 100) {
          throw new Error(`Roll de acurácia inválido: ${action.accuracyRoll}. Deve ser um inteiro entre 1 e 100.`);
        }
        accuracyRoll = roll;
      }

      // Evento de início de ação
      events.push({
        type: BATTLE_EVENTS.ACTION_STARTED,
        actor: attackerRole,
        pokemonName: attacker.name,
        action: BATTLE_ACTIONS.MOVE
      });

      // Evento de seleção do golpe
      events.push({
        type: BATTLE_EVENTS.MOVE_SELECTED,
        actor: attackerRole,
        pokemonId: attacker.id,
        pokemonName: attacker.name,
        moveId: selectedMove.id,
        moveName: selectedMove.name
      });

      // Evento de disparo do golpe
      events.push({
        type: BATTLE_EVENTS.MOVE_USED,
        actor: attackerRole,
        pokemonId: attacker.id,
        pokemonName: attacker.name,
        moveId: selectedMove.id,
        moveName: selectedMove.name,
        moveType: selectedMove.type,
        damageClass: selectedMove.damageClass,
        power: selectedMove.power
      });

      // Consumo de PP (ocorre antes da resolução de dano, em hits e em misses)
      const previousPp = selectedMove.currentPp;
      selectedMove.currentPp = Math.max(0, selectedMove.currentPp - 1);

      events.push({
        type: BATTLE_EVENTS.PP_CHANGED,
        actor: attackerRole,
        moveId: selectedMove.id,
        moveName: selectedMove.name,
        previousPp,
        currentPp: selectedMove.currentPp,
        maxPp: selectedMove.maxPp
      });

      // 2. Resolução de Acurácia (Hit vs Miss)
      let isHit = true;
      if (selectedMove.accuracy !== null && selectedMove.accuracy !== 'ALWAYS_HIT') {
        isHit = accuracyRoll <= selectedMove.accuracy;
      }

      if (!isHit) {
        // Notifica erro do golpe
        events.push({
          type: BATTLE_EVENTS.MOVE_MISSED,
          actor: attackerRole,
          target: defenderRole,
          moveId: selectedMove.id,
          moveName: selectedMove.name,
          accuracyRoll,
          accuracy: selectedMove.accuracy
        });
        // Em miss, o defensor não sofre dano, DAMAGE_APPLIED não é emitido e seu HP permanece inalterado
        return;
      }

      // 3. Resolução de STAB (Same-Type Attack Bonus)
      const hasStab = attacker.types.includes(selectedMove.type);
      const stabMultiplier = hasStab ? constants.BATTLE_CONFIG.STAB_MULTIPLIER : 1;

      events.push({
        type: BATTLE_EVENTS.STAB_RESOLVED,
        actor: attackerRole,
        moveType: selectedMove.type,
        attackerTypes: attacker.types,
        multiplier: stabMultiplier,
        hasStab
      });

      // 4. Resolução de Type Effectiveness
      const effectiveness = TypeEffectiveness.calculate(selectedMove.type, defender.types);

      events.push({
        type: BATTLE_EVENTS.TYPE_EFFECTIVENESS_RESOLVED,
        source: attackerRole,
        target: defenderRole,
        attackType: effectiveness.attackType,
        defenderTypes: effectiveness.defenderTypes,
        multiplier: effectiveness.multiplier,
        classification: effectiveness.classification
      });

      // 5. Seleção de atributos de ataque e defesa baseados na categoria de dano
      let attackStat;
      let defenseStat;
      if (selectedMove.damageClass === MOVE_DAMAGE_CLASSES.PHYSICAL) {
        attackStat = attacker.attack;
        defenseStat = defender.defense;
      } else {
        attackStat = attacker.specialAttack;
        defenseStat = defender.specialDefense;
      }

      // 6. Pipeline de cálculo de dano v2
      const baseDamage = DamageCalculator.calculateBaseDamage(attackStat, defenseStat, selectedMove.power);
      const finalDamage = DamageCalculator.applyModifier(baseDamage, effectiveness.multiplier, stabMultiplier);

      // 7. Aplicação do dano ao HP
      const previousHp = defender.currentHp;
      const currentHp = Math.max(0, previousHp - finalDamage);
      defender.currentHp = currentHp;

      // 8. Emite evento de dano aplicado com dados completos
      events.push({
        type: BATTLE_EVENTS.DAMAGE_APPLIED,
        source: attackerRole,
        target: defenderRole,
        attackType: selectedMove.type,
        damageClass: selectedMove.damageClass,
        moveName: selectedMove.name,
        power: selectedMove.power,
        baseDamage,
        stabMultiplier,
        typeMultiplier: effectiveness.multiplier,
        multiplier: effectiveness.multiplier,
        damage: finalDamage,
        previousHp,
        currentHp
      });

      // 9. Nocaute (Faint Detection)
      if (currentHp === 0) {
        events.push({
          type: BATTLE_EVENTS.POKEMON_FAINTED,
          target: defenderRole,
          pokemonName: defender.name
        });

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
     * @param {number} [maxTurns] - Limite máximo de turnos (padrão 100).
     * @param {Array<Object>} [turnActions] - Lista opcional de ações para cada turno.
     * @returns {{ state: Object, events: Array<Object>, totalTurns: number }}
     */
    function simulateBattle(playerInput, enemyInput, maxTurns = BATTLE_CONFIG.MAX_TURNS_LIMIT, turnActions = null) {
      let state = createBattle(playerInput, enemyInput);
      const allEvents = [
        {
          type: BATTLE_EVENTS.BATTLE_STARTED,
          player: { id: state.player.id, name: state.player.name, types: state.player.types, maxHp: state.player.maxHp },
          enemy: { id: state.enemy.id, name: state.enemy.name, types: state.enemy.types, maxHp: state.enemy.maxHp }
        }
      ];

      let safetyCounter = 0;
      while (state.status === BATTLE_STATUS.IN_PROGRESS) {
        safetyCounter++;
        if (safetyCounter > maxTurns) {
          throw new Error(`Limite de segurança de turnos (${maxTurns}) atingido. Simulação abortada para evitar loop infinito.`);
        }

        const actionsForTurn = (turnActions && turnActions[safetyCounter - 1]) ? turnActions[safetyCounter - 1] : {};
        const turnResult = resolveTurn(state, actionsForTurn);
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
})();
