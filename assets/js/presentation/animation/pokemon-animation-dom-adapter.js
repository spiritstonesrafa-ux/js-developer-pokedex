/**
 * ====================================================================
 * ADAPTADOR DOM DE APRESENTAÇÃO: (pokemon-animation-dom-adapter.js)
 * ====================================================================
 * Implementa BattlePresentationAdapter da Fase PBA-008 conectando os
 * Presentation Commands emitidos pela timeline ao PokemonAnimationController
 * (Fase PBA-009).
 *
 * Princípios Fundamentais:
 * - Implementa execute(command, context) assíncrono;
 * - Anima o POKÉMON (movimentos corporais), NÃO os efeitos de golpes (PBA-010);
 * - Comandos de dano zero (imunidade/miss) não disparam reação a dano;
 * - Comandos não visuais nesta fase resolvem imediatamente sem erro;
 * - Suporta Node.js (testes automatizados) e Browser (window.PBABattlePresentation).
 */

(function () {
  let presentationConstants;
  let adapterBase;
  let controllerModule;

  if (typeof module !== 'undefined' && module.exports) {
    presentationConstants = require('../battle-presentation-constants.js');
    adapterBase = require('../battle-presentation-adapter.js');
    controllerModule = require('./pokemon-animation-controller.js');
  } else if (typeof window !== 'undefined' && window.PBABattlePresentation) {
    presentationConstants = window.PBABattlePresentation;
    adapterBase = window.PBABattlePresentation;
    controllerModule = window.PBABattlePresentation;
  } else {
    presentationConstants = { PRESENTATION_COMMANDS: {} };
    adapterBase = { BattlePresentationAdapter: class {} };
    controllerModule = {};
  }

  const { PRESENTATION_COMMANDS } = presentationConstants;
  const { BattlePresentationAdapter } = adapterBase;

  class DomBattlePresentationAdapter extends BattlePresentationAdapter {
    /**
     * @param {Object} [options]
     * @param {Object} [options.controller] - Instância de PokemonAnimationController.
     * @param {Object} [options.registry] - Instância de PokemonAnimationRegistry.
     */
    constructor(options = {}) {
      super();
      this.controller = options.controller || (controllerModule.createAnimationController ? controllerModule.createAnimationController(options) : null);
      this.registry = options.registry || (this.controller ? this.controller.registry : null);
      this.executedCommands = [];
    }

    /**
     * Executa comandos de apresentação delegando para animações visuais correspondentes.
     * @param {Object} command - Comando de apresentação normalizado.
     * @param {Object} [context] - Contexto imutável da batalha.
     * @returns {Promise<void>}
     */
    async execute(command, context = null) {
      if (!command || typeof command !== 'object') {
        return Promise.resolve();
      }

      this.executedCommands.push({
        type: command.type,
        command: JSON.parse(JSON.stringify(command)),
        timestamp: Date.now()
      });

      if (!this.controller) {
        return Promise.resolve();
      }

      switch (command.type) {
        case PRESENTATION_COMMANDS.BATTLE_INTRO: {
          // Entrada de ambos os combatentes seguida pelo início de idle
          await Promise.all([
            this.controller.playEntrance('player'),
            this.controller.playEntrance('enemy')
          ]);
          this.controller.startIdle('player');
          this.controller.startIdle('enemy');
          break;
        }

        case PRESENTATION_COMMANDS.MOVE_ANNOUNCEMENT: {
          // Animação genérica de ataque do combatente que desferiu o golpe
          const side = command.actor || command.side;
          if (side) {
            await this.controller.playAttack(side);
          }
          break;
        }

        case PRESENTATION_COMMANDS.HP_TRANSITION: {
          // Reação visual a dano apenas quando houver perda real de HP (> 0)
          if (command.damage !== undefined && Number(command.damage) > 0) {
            const side = command.side || command.target;
            if (side) {
              await this.controller.playDamageReaction(side);
            }
          }
          break;
        }

        case PRESENTATION_COMMANDS.FAINT_SEQUENCE: {
          // Animação de nocaute do Pokémon derrotado
          const side = command.side || command.target;
          if (side) {
            await this.controller.playFaint(side);
          }
          break;
        }

        case PRESENTATION_COMMANDS.SWITCH_OUT_SEQUENCE: {
          // Animação de saída do Pokémon que vai para o banco
          const side = command.side || command.actor;
          if (side) {
            await this.controller.playSwitchOut(side);
          }
          break;
        }

        case PRESENTATION_COMMANDS.SWITCH_IN_SEQUENCE: {
          // Animação de entrada do novo Pokémon ativo
          const side = command.side;
          if (side) {
            let pokemonData = null;
            // Se houver dados no context para o novo Pokémon
            if (context && context[side] && context[side].team) {
              const activeMon = context[side].team.find(p => p.id === command.newPokemonId);
              if (activeMon) {
                pokemonData = activeMon;
              }
            }
            await this.controller.playSwitchIn(side, pokemonData);
          }
          break;
        }

        case PRESENTATION_COMMANDS.BATTLE_RESULT: {
          // Celebração de vitória do combatente ativo vencedor
          if (command.winner && (command.winner === 'player' || command.winner === 'enemy')) {
            await this.controller.playVictory(command.winner);
          }
          break;
        }

        // Comandos não visuais para o sprite nesta fase resolvem imediatamente
        case PRESENTATION_COMMANDS.TURN_INDICATOR:
        case PRESENTATION_COMMANDS.ACTION_FOCUS:
        case PRESENTATION_COMMANDS.MOVE_FOCUS:
        case PRESENTATION_COMMANDS.PP_TRANSITION:
        case PRESENTATION_COMMANDS.MOVE_MISS_FEEDBACK:
        case PRESENTATION_COMMANDS.STAB_METADATA:
        case PRESENTATION_COMMANDS.EFFECTIVENESS_FEEDBACK:
        case PRESENTATION_COMMANDS.REPLACEMENT_PROMPT:
        case PRESENTATION_COMMANDS.TEAM_DEFEAT_SEQUENCE:
        default:
          return Promise.resolve();
      }
    }

    /**
     * Cancela animações ativas no Controller.
     */
    cancel() {
      if (this.controller) {
        this.controller.cancel();
      }
    }

    /**
     * Reseta alvos e Controller.
     */
    reset() {
      this.executedCommands = [];
      if (this.controller) {
        this.controller.reset();
      }
    }
  }

  const adapterModule = Object.freeze({
    DomBattlePresentationAdapter,
    createDomPresentationAdapter: (opts) => new DomBattlePresentationAdapter(opts)
  });

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = adapterModule;
  } else if (typeof window !== 'undefined') {
    window.PBABattlePresentation = window.PBABattlePresentation || {};
    Object.assign(window.PBABattlePresentation, adapterModule);
  }
})();
