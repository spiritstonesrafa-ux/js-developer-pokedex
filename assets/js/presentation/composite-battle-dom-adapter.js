/**
 * ====================================================================
 * ADAPTADOR DOM COMPOSTO DE APRESENTAÇÃO: (composite-battle-dom-adapter.js)
 * ====================================================================
 * Implementa BattlePresentationAdapter da Fase PBA-008 coordenando de forma
 * desacoplada o PokemonAnimationController (PBA-009) e o MoveVfxController (PBA-010).
 *
 * Princípios Fundamentais:
 * - GAME ENGINE ≠ PRESENTATION ENGINE;
 * - PRESENTATION ENGINE ≠ ANIMATION IMPLEMENTATION;
 * - POKEMON ANIMATION ≠ MOVE VISUAL EFFECT;
 * - O adaptador coordena o ataque do Pokémon e o efeito do golpe em MOVE_ANNOUNCEMENT;
 * - A reação a dano continua sendo ativada estritamente em HP_TRANSITION (se dano > 0);
 * - Suporta Node.js (CommonJS) e Navegadores (window.PBABattlePresentation).
 */

(function () {
  let presentationConstants;
  let adapterBase;
  let pokemonControllerModule;
  let vfxControllerModule;
  let vfxResolverModule;

  if (typeof module !== 'undefined' && module.exports) {
    presentationConstants = require('./battle-presentation-constants.js');
    adapterBase = require('./battle-presentation-adapter.js');
    pokemonControllerModule = require('./animation/pokemon-animation-controller.js');
    vfxControllerModule = require('../vfx/move-vfx-controller.js');
    vfxResolverModule = require('../vfx/move-vfx-resolver.js');
  } else if (typeof window !== 'undefined') {
    presentationConstants = window.PBABattlePresentation || {};
    adapterBase = window.PBABattlePresentation || {};
    pokemonControllerModule = (window.PBABattlePresentation && window.PBABattlePresentation.animation) || window.PBABattlePresentation || {};
    vfxControllerModule = window.PBABattleVfx || {};
    vfxResolverModule = (window.PBABattleVfx && window.PBABattleVfx.MoveVfxResolver) || window.PBABattleVfx || {};
  } else {
    presentationConstants = { PRESENTATION_COMMANDS: {} };
    adapterBase = { BattlePresentationAdapter: class {} };
    pokemonControllerModule = {};
    vfxControllerModule = {};
    vfxResolverModule = {};
  }

  const { PRESENTATION_COMMANDS } = presentationConstants;
  const { BattlePresentationAdapter } = adapterBase;

  class CompositeBattleDomAdapter extends BattlePresentationAdapter {
    /**
     * @param {Object} [options]
     * @param {Object} [options.pokemonController] - Instância de PokemonAnimationController.
     * @param {Object} [options.vfxController] - Instância de MoveVfxController.
     */
    constructor(options = {}) {
      super();
      this.pokemonController = options.pokemonController || (
        pokemonControllerModule.createAnimationController ? pokemonControllerModule.createAnimationController(options) : null
      );
      this.vfxController = options.vfxController || (
        vfxControllerModule.createVfxController ? vfxControllerModule.createVfxController(options) : null
      );
      this.executedCommands = [];
    }

    /**
     * Executa comandos de apresentação delegando em paralelo ou sequência coordenada.
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

      switch (command.type) {
        case PRESENTATION_COMMANDS.BATTLE_INTRO: {
          if (this.pokemonController) {
            await Promise.all([
              this.pokemonController.playEntrance('player'),
              this.pokemonController.playEntrance('enemy')
            ]);
            this.pokemonController.startIdle('player');
            this.pokemonController.startIdle('enemy');
          }
          break;
        }

        case PRESENTATION_COMMANDS.MOVE_ANNOUNCEMENT: {
          const attackerSide = command.actor || command.side || 'player';
          const defenderSide = command.target || (attackerSide === 'player' ? 'enemy' : 'player');

          const tasks = [];

          // 1. Movimento corporal genérico do Pokémon atacante
          if (this.pokemonController) {
            tasks.push(this.pokemonController.playAttack(attackerSide));
          }

          // 2. Efeito visual do golpe e impacto correspondente
          if (this.vfxController) {
            const resolver = vfxResolverModule.resolve ? vfxResolverModule : (vfxResolverModule.MoveVfxResolver || vfxResolverModule);
            let descriptor = null;
            try {
              descriptor = resolver.resolve({
                moveId: command.moveId,
                moveName: command.moveName,
                moveType: command.moveType,
                damageClass: command.damageClass,
                power: command.power
              });
            } catch (e) {
              // Fallback defensivo para golpe sem tipo conhecido
              descriptor = null;
            }

            if (descriptor) {
              tasks.push(this.vfxController.playMoveVfx(descriptor, {
                attackerSide,
                defenderSide,
                isMiss: Boolean(command.isMiss),
                isImmune: Boolean(command.isImmune || command.multiplier === 0),
                multiplier: command.multiplier !== undefined ? Number(command.multiplier) : 1
              }));
            }
          }

          await Promise.all(tasks);
          break;
        }

        case PRESENTATION_COMMANDS.HP_TRANSITION: {
          // Reação visual a dano corporal apenas quando houver perda real de HP (> 0)
          if (command.damage !== undefined && Number(command.damage) > 0) {
            const side = command.side || command.target;
            if (side && this.pokemonController) {
              await this.pokemonController.playDamageReaction(side);
            }
          }
          break;
        }

        case PRESENTATION_COMMANDS.FAINT_SEQUENCE: {
          const side = command.side || command.target;
          if (side && this.pokemonController) {
            await this.pokemonController.playFaint(side);
          }
          break;
        }

        case PRESENTATION_COMMANDS.SWITCH_OUT_SEQUENCE: {
          const side = command.side || command.actor;
          if (side && this.pokemonController) {
            await this.pokemonController.playSwitchOut(side);
          }
          break;
        }

        case PRESENTATION_COMMANDS.SWITCH_IN_SEQUENCE: {
          const side = command.side;
          if (side && this.pokemonController) {
            let pokemonData = null;
            if (context && context[side] && context[side].team) {
              const activeMon = context[side].team.find(p => p.id === command.newPokemonId);
              if (activeMon) {
                pokemonData = activeMon;
              }
            }
            await this.pokemonController.playSwitchIn(side, pokemonData);
          }
          break;
        }

        case PRESENTATION_COMMANDS.BATTLE_RESULT: {
          if (command.winner && (command.winner === 'player' || command.winner === 'enemy')) {
            if (this.pokemonController) {
              await this.pokemonController.playVictory(command.winner);
            }
          }
          break;
        }

        default:
          return Promise.resolve();
      }
    }

    /**
     * Cancela animações do Pokémon e efeitos visuais em voo.
     */
    cancel() {
      if (this.pokemonController) {
        this.pokemonController.cancel();
      }
      if (this.vfxController) {
        this.vfxController.cancel();
      }
    }

    /**
     * Reseta ambos os subsistemas para estado limpo.
     */
    reset() {
      this.executedCommands = [];
      if (this.pokemonController) {
        this.pokemonController.reset();
      }
      if (this.vfxController) {
        this.vfxController.reset();
      }
    }
  }

  const compositeModule = Object.freeze({
    CompositeBattleDomAdapter,
    BattleDomPresentationAdapter: CompositeBattleDomAdapter,
    createCompositeBattleDomAdapter: (opts) => new CompositeBattleDomAdapter(opts)
  });

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = compositeModule;
  } else if (typeof window !== 'undefined') {
    window.PBABattlePresentation = window.PBABattlePresentation || {};
    Object.assign(window.PBABattlePresentation, compositeModule);
  }
})();
