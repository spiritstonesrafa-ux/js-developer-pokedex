/**
 * ====================================================================
 * MAPEADOR DE APRESENTAÇÃO: (battle-presentation-mapper.js)
 * ====================================================================
 * Converte eventos emitidos pelo Battle Engine em comandos normalizados
 * de apresentação serializáveis e determinísticos (Fase PBA-008).
 *
 * Princípios Fundamentais:
 * - GAME ENGINE ≠ PRESENTATION ENGINE;
 * - O Mapper NÃO recalcula dano, tipos ou qualquer regra de combate;
 * - Validação estrita: rejeita eventos desconhecidos e payloads corrompidos;
 * - 100% de cobertura dos eventos conhecidos do Battle Engine;
 * - Suporta Node.js (testes automatizados) e Browser (window.PBABattlePresentation).
 */

(function () {
  let constants;
  let presentationConstants;

  if (typeof module !== 'undefined' && module.exports) {
    constants = require('../battle/battle-constants.js');
    presentationConstants = require('./battle-presentation-constants.js');
  } else if (typeof window !== 'undefined') {
    constants = window.PBABattle || {};
    presentationConstants = window.PBABattlePresentation || {};
  } else {
    constants = { BATTLE_EVENTS: {} };
    presentationConstants = { PRESENTATION_COMMANDS: {} };
  }

  const { BATTLE_EVENTS } = constants;
  const { PRESENTATION_COMMANDS } = presentationConstants;

  const PresentationMapper = (() => {
    /**
     * Valida a estrutura básica de um evento e campos obrigatórios para seu tipo.
     * @param {Object} event - Evento emitido pelo Battle Engine.
     * @throws {Error} Se o evento for desconhecido ou seu payload inválido.
     */
    function validateEvent(event) {
      if (!event || typeof event !== 'object' || Array.isArray(event)) {
        throw new Error('INVALID_EVENT: Evento de batalha deve ser um objeto não nulo.');
      }

      if (!event.type || typeof event.type !== 'string') {
        throw new Error('INVALID_EVENT: Evento sem propriedade "type" válida.');
      }

      // Validação estrita de evento conhecido pelo catálogo da Engine
      const isKnownEngineEvent = Object.values(BATTLE_EVENTS).includes(event.type);
      if (!isKnownEngineEvent) {
        throw new Error(`UNKNOWN_ENGINE_EVENT: Tipo de evento "${event.type}" não é reconhecido pelo Presentation Mapper.`);
      }

      // Validações específicas de payload
      switch (event.type) {
        case BATTLE_EVENTS.TURN_STARTED:
          if (event.turn === undefined || !Number.isInteger(Number(event.turn)) || Number(event.turn) < 1) {
            throw new Error(`INVALID_EVENT_PAYLOAD: TURN_STARTED requer campo "turn" numérico positivo. Recebido: ${event.turn}`);
          }
          break;

        case BATTLE_EVENTS.DAMAGE_APPLIED:
          if (
            event.previousHp === undefined ||
            event.currentHp === undefined ||
            event.damage === undefined ||
            !Number.isFinite(Number(event.previousHp)) ||
            !Number.isFinite(Number(event.currentHp)) ||
            !Number.isFinite(Number(event.damage))
          ) {
            throw new Error(`INVALID_EVENT_PAYLOAD: DAMAGE_APPLIED requer "previousHp", "currentHp" e "damage" numéricos válidos.`);
          }
          break;

        case BATTLE_EVENTS.PP_CHANGED:
          if (
            event.previousPp === undefined ||
            event.currentPp === undefined ||
            event.maxPp === undefined ||
            !Number.isFinite(Number(event.previousPp)) ||
            !Number.isFinite(Number(event.currentPp)) ||
            !Number.isFinite(Number(event.maxPp))
          ) {
            throw new Error(`INVALID_EVENT_PAYLOAD: PP_CHANGED requer "previousPp", "currentPp" e "maxPp" numéricos válidos.`);
          }
          break;

        case BATTLE_EVENTS.MOVE_USED:
          if (!event.moveName && event.moveId === undefined) {
            throw new Error(`INVALID_EVENT_PAYLOAD: MOVE_USED requer identificação do golpe ("moveName" ou "moveId").`);
          }
          break;

        case BATTLE_EVENTS.TYPE_EFFECTIVENESS_RESOLVED:
          if (event.multiplier === undefined || !event.classification) {
            throw new Error(`INVALID_EVENT_PAYLOAD: TYPE_EFFECTIVENESS_RESOLVED requer "multiplier" e "classification".`);
          }
          break;

        case BATTLE_EVENTS.POKEMON_FAINTED:
          if (!event.target && !event.pokemonName && !event.side) {
            throw new Error(`INVALID_EVENT_PAYLOAD: POKEMON_FAINTED requer alvo ou nome do Pokémon nocauteado.`);
          }
          break;

        case BATTLE_EVENTS.SWITCH_STARTED:
          if (event.previousPokemonId === undefined || event.targetPokemonId === undefined) {
            throw new Error(`INVALID_EVENT_PAYLOAD: SWITCH_STARTED requer "previousPokemonId" e "targetPokemonId".`);
          }
          break;

        case BATTLE_EVENTS.POKEMON_SWITCHED:
          if (event.previousPokemonId === undefined || event.newPokemonId === undefined) {
            throw new Error(`INVALID_EVENT_PAYLOAD: POKEMON_SWITCHED requer "previousPokemonId" e "newPokemonId".`);
          }
          break;

        case BATTLE_EVENTS.REPLACEMENT_REQUIRED:
          if (!event.side || !Array.isArray(event.availablePokemonIds)) {
            throw new Error(`INVALID_EVENT_PAYLOAD: REPLACEMENT_REQUIRED requer "side" e array "availablePokemonIds".`);
          }
          break;

        case BATTLE_EVENTS.BATTLE_ENDED:
          if (event.winner === undefined) {
            throw new Error(`INVALID_EVENT_PAYLOAD: BATTLE_ENDED requer especificação do campo "winner".`);
          }
          break;
      }
    }

    /**
     * Mapeia um único evento do Battle Engine para um ou mais comandos de apresentação.
     * @param {Object} event - Evento estruturado da engine.
     * @param {Object} [context] - Contexto imutável opcional.
     * @returns {Array<Object>} Lista de comandos de apresentação normalizados.
     */
    function mapEvent(event, context = null) {
      validateEvent(event);

      switch (event.type) {
        case BATTLE_EVENTS.BATTLE_STARTED:
          return [
            {
              type: PRESENTATION_COMMANDS.BATTLE_INTRO,
              player: event.player ? JSON.parse(JSON.stringify(event.player)) : null,
              enemy: event.enemy ? JSON.parse(JSON.stringify(event.enemy)) : null
            }
          ];

        case BATTLE_EVENTS.TURN_STARTED:
          return [
            {
              type: PRESENTATION_COMMANDS.TURN_INDICATOR,
              turn: Number(event.turn)
            }
          ];

        case BATTLE_EVENTS.ACTION_STARTED:
          return [
            {
              type: PRESENTATION_COMMANDS.ACTION_FOCUS,
              actor: event.actor,
              pokemonName: event.pokemonName,
              action: event.action
            }
          ];

        case BATTLE_EVENTS.MOVE_SELECTED:
          return [
            {
              type: PRESENTATION_COMMANDS.MOVE_FOCUS,
              actor: event.actor,
              pokemonId: event.pokemonId,
              pokemonName: event.pokemonName,
              moveId: event.moveId,
              moveName: event.moveName
            }
          ];

        case BATTLE_EVENTS.MOVE_USED:
          return [
            {
              type: PRESENTATION_COMMANDS.MOVE_ANNOUNCEMENT,
              actor: event.actor,
              side: event.actor,
              target: event.target || (event.actor === 'player' ? 'enemy' : 'player'),
              pokemonId: event.pokemonId,
              pokemonName: event.pokemonName,
              moveId: event.moveId,
              moveName: event.moveName,
              moveType: event.moveType,
              damageClass: event.damageClass,
              power: event.power,
              isMiss: Boolean(event.isMiss),
              isImmune: Boolean(event.isImmune),
              multiplier: event.multiplier !== undefined ? Number(event.multiplier) : 1,
              classification: event.classification || 'NEUTRAL'
            }
          ];

        case BATTLE_EVENTS.PP_CHANGED:
          return [
            {
              type: PRESENTATION_COMMANDS.PP_TRANSITION,
              side: event.actor || event.side,
              actor: event.actor || event.side,
              moveId: event.moveId,
              moveName: event.moveName,
              previousPp: Number(event.previousPp),
              currentPp: Number(event.currentPp),
              maxPp: Number(event.maxPp)
            }
          ];

        case BATTLE_EVENTS.MOVE_MISSED:
          return [
            {
              type: PRESENTATION_COMMANDS.MOVE_MISS_FEEDBACK,
              actor: event.actor,
              target: event.target,
              moveId: event.moveId,
              moveName: event.moveName,
              accuracyRoll: event.accuracyRoll,
              accuracy: event.accuracy
            }
          ];

        case BATTLE_EVENTS.STAB_RESOLVED:
          return [
            {
              type: PRESENTATION_COMMANDS.STAB_METADATA,
              actor: event.actor,
              moveType: event.moveType,
              attackerTypes: event.attackerTypes ? [...event.attackerTypes] : [],
              multiplier: Number(event.multiplier),
              hasStab: Boolean(event.hasStab)
            }
          ];

        case BATTLE_EVENTS.TYPE_EFFECTIVENESS_RESOLVED:
          return [
            {
              type: PRESENTATION_COMMANDS.EFFECTIVENESS_FEEDBACK,
              source: event.source,
              target: event.target,
              attackType: event.attackType,
              defenderTypes: event.defenderTypes ? [...event.defenderTypes] : [],
              multiplier: Number(event.multiplier),
              classification: event.classification
            }
          ];

        case BATTLE_EVENTS.DAMAGE_APPLIED:
          return [
            {
              type: PRESENTATION_COMMANDS.HP_TRANSITION,
              side: event.target,
              target: event.target,
              source: event.source,
              damage: Number(event.damage),
              previousHp: Number(event.previousHp),
              currentHp: Number(event.currentHp),
              attackType: event.attackType,
              damageClass: event.damageClass,
              moveName: event.moveName,
              multiplier: event.multiplier !== undefined ? Number(event.multiplier) : 1
            }
          ];

        case BATTLE_EVENTS.POKEMON_FAINTED:
          return [
            {
              type: PRESENTATION_COMMANDS.FAINT_SEQUENCE,
              side: event.target || event.side,
              target: event.target || event.side,
              pokemonId: event.pokemonId !== undefined ? event.pokemonId : null,
              pokemonName: event.pokemonName
            }
          ];

        case BATTLE_EVENTS.SWITCH_STARTED:
          return [
            {
              type: PRESENTATION_COMMANDS.SWITCH_OUT_SEQUENCE,
              side: event.actor || event.side,
              actor: event.actor || event.side,
              previousPokemonId: event.previousPokemonId,
              targetPokemonId: event.targetPokemonId
            }
          ];

        case BATTLE_EVENTS.POKEMON_SWITCHED:
          return [
            {
              type: PRESENTATION_COMMANDS.SWITCH_IN_SEQUENCE,
              side: event.side,
              previousPokemonId: event.previousPokemonId,
              newPokemonId: event.newPokemonId,
              reason: event.reason
            }
          ];

        case BATTLE_EVENTS.REPLACEMENT_REQUIRED:
          return [
            {
              type: PRESENTATION_COMMANDS.REPLACEMENT_PROMPT,
              side: event.side,
              faintedPokemonId: event.faintedPokemonId,
              availablePokemonIds: [...event.availablePokemonIds]
            }
          ];

        case BATTLE_EVENTS.TEAM_DEFEATED:
          return [
            {
              type: PRESENTATION_COMMANDS.TEAM_DEFEAT_SEQUENCE,
              side: event.side,
              winner: event.winner
            }
          ];

        case BATTLE_EVENTS.BATTLE_ENDED:
          return [
            {
              type: PRESENTATION_COMMANDS.BATTLE_RESULT,
              winner: event.winner,
              reason: event.reason
            }
          ];

        default:
          throw new Error(`UNKNOWN_ENGINE_EVENT: Evento "${event.type}" não possui mapeador configurado.`);
      }
    }

    /**
     * Mapeia uma lista de eventos do Battle Engine para uma lista ordenada de comandos de apresentação.
     * Não muta o array nem os objetos de evento recebidos.
     * @param {Array<Object>} events - Lista de eventos do Engine.
     * @param {Object} [context] - Contexto imutável opcional.
     * @returns {Array<Object>} Lista sequencial de comandos de apresentação.
     */
    function mapEvents(events, context = null) {
      if (!Array.isArray(events)) {
        throw new Error('INVALID_EVENTS_STREAM: A entrada de eventos deve ser um Array.');
      }

      const commands = [];
      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        if (event && event.type === BATTLE_EVENTS.MOVE_USED) {
          const enrichedEvent = { ...event };
          for (let j = i + 1; j < events.length; j++) {
            const next = events[j];
            if (!next || next.type === BATTLE_EVENTS.ACTION_STARTED || next.type === BATTLE_EVENTS.TURN_STARTED) {
              break;
            }
            if (next.type === BATTLE_EVENTS.MOVE_MISSED) {
              enrichedEvent.isMiss = true;
            }
            if (next.type === BATTLE_EVENTS.TYPE_EFFECTIVENESS_RESOLVED) {
              enrichedEvent.multiplier = Number(next.multiplier);
              enrichedEvent.classification = next.classification;
              if (Number(next.multiplier) === 0) {
                enrichedEvent.isImmune = true;
              }
            }
          }
          commands.push(...mapEvent(enrichedEvent, context));
        } else {
          commands.push(...mapEvent(event, context));
        }
      }

      return commands;
    }

    /**
     * Retorna o catálogo de eventos suportados pelo mapper.
     * @returns {Array<string>}
     */
    function getSupportedEventTypes() {
      return Object.values(BATTLE_EVENTS);
    }

    return {
      validateEvent,
      mapEvent,
      mapEvents,
      getSupportedEventTypes
    };
  })();

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PresentationMapper;
  } else if (typeof window !== 'undefined') {
    window.PBABattlePresentation = window.PBABattlePresentation || {};
    window.PBABattlePresentation.PresentationMapper = PresentationMapper;
  }
})();
