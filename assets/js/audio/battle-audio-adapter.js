/**
 * ====================================================================
 * ADAPTADOR DE ÁUDIO DE APRESENTAÇÃO: (battle-audio-adapter.js)
 * ====================================================================
 * Conecta os Presentation Commands da Presentation Engine (PBA-008) ao
 * BattleAudioController (PBA-011).
 *
 * Princípios Fundamentais:
 * - Implementa a interface BattlePresentationAdapter;
 * - Audio System recebe fatos, NÃO decide regras de combate;
 * - AUDIO_DAMAGE_CALCULATION = 0, AUDIO_TYPE_CALCULATION = 0;
 * - Suporta Node.js (testes automatizados) e Browser.
 */

(function () {
  let presentationConstants;
  let adapterBase;
  let audioControllerModule;

  if (typeof module !== 'undefined' && module.exports) {
    presentationConstants = require('../presentation/battle-presentation-constants.js');
    adapterBase = require('../presentation/battle-presentation-adapter.js');
    audioControllerModule = require('./battle-audio-controller.js');
  } else if (typeof window !== 'undefined') {
    presentationConstants = window.PBABattlePresentation || {};
    adapterBase = window.PBABattlePresentation || {};
    audioControllerModule = window.PBABattleAudio || {};
  } else {
    presentationConstants = { PRESENTATION_COMMANDS: {} };
    adapterBase = { BattlePresentationAdapter: class {} };
    audioControllerModule = {};
  }

  const { PRESENTATION_COMMANDS } = presentationConstants;
  const { BattlePresentationAdapter } = adapterBase;

  class BattleAudioAdapter extends BattlePresentationAdapter {
    /**
     * @param {Object} [options]
     * @param {Object} [options.audioController]
     */
    constructor(options = {}) {
      super();
      this.audioController = options.audioController || (
        audioControllerModule.createBattleAudioController ? audioControllerModule.createBattleAudioController(options) : null
      );
      this.executedCommands = [];
    }

    /**
     * Executa comandos de apresentação reproduzindo o feedback sonoro correspondente.
     * @param {Object} command
     * @param {Object} [context]
     * @returns {Promise<void>}
     */
    async execute(command, context = null) {
      if (!command || typeof command !== 'object' || !this.audioController) {
        return Promise.resolve();
      }

      this.executedCommands.push({
        type: command.type,
        command: JSON.parse(JSON.stringify(command)),
        timestamp: Date.now()
      });

      switch (command.type) {
        case PRESENTATION_COMMANDS.BATTLE_INTRO: {
          await this.audioController.startBattleMusic();
          break;
        }

        case PRESENTATION_COMMANDS.MOVE_ANNOUNCEMENT: {
          await this.audioController.playMoveAttack({
            moveId: command.moveId,
            moveName: command.moveName,
            moveType: command.moveType,
            damageClass: command.damageClass,
            power: command.power,
            intensity: command.intensity
          });
          break;
        }

        case PRESENTATION_COMMANDS.HP_TRANSITION: {
          // Impacto sonoro apenas quando houver dano real (> 0)
          if (command.damage !== undefined && Number(command.damage) > 0) {
            await this.audioController.playMoveImpact({
              multiplier: command.multiplier !== undefined ? Number(command.multiplier) : 1,
              typeFamily: command.attackType || 'normal'
            });
          }
          break;
        }

        case PRESENTATION_COMMANDS.MOVE_MISS_FEEDBACK: {
          await this.audioController.playMiss();
          break;
        }

        case PRESENTATION_COMMANDS.EFFECTIVENESS_FEEDBACK: {
          // Som de imunidade se o multiplicador for zero
          if (Number(command.multiplier) === 0) {
            await this.audioController.playImmunity();
          }
          break;
        }

        case PRESENTATION_COMMANDS.SWITCH_IN_SEQUENCE: {
          let cryUrl = command.cry || null;
          if (!cryUrl && context && command.side && context[command.side] && context[command.side].team) {
            const mon = context[command.side].team.find(p => p.id === command.newPokemonId);
            if (mon && mon.cry) {
              cryUrl = mon.cry;
            }
          }
          if (cryUrl) {
            await this.audioController.playPokemonCry(cryUrl);
          }
          break;
        }

        case PRESENTATION_COMMANDS.BATTLE_RESULT: {
          if (command.winner === 'player') {
            await this.audioController.playVictory();
          } else if (command.winner === 'enemy') {
            await this.audioController.playDefeat();
          }
          break;
        }

        default:
          return Promise.resolve();
      }
    }

    cancel() {
      if (this.audioController) {
        this.audioController.cancel();
      }
    }

    reset() {
      this.executedCommands = [];
      if (this.audioController) {
        this.audioController.reset();
      }
    }
  }

  const adapterModule = Object.freeze({
    BattleAudioAdapter,
    createBattleAudioAdapter: (opts) => new BattleAudioAdapter(opts)
  });

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = adapterModule;
  } else if (typeof window !== 'undefined') {
    window.PBABattleAudio = window.PBABattleAudio || {};
    Object.assign(window.PBABattleAudio, adapterModule);
  }
})();
