/**
 * ====================================================================
 * ADAPTADOR DOM DA CÂMERA DE BATALHA: (battle-camera-dom-adapter.js)
 * ====================================================================
 * Conecta os comandos da Battle Presentation Engine ao BattleCameraController,
 * traduzindo comandos de apresentação em reações físicas e visuais de câmera.
 *
 * Princípios Fundamentais:
 * - CAMERA SYSTEM ≠ GAME RULES;
 * - HP_TRANSITION com dano > 0 é o gatilho principal de impacto de câmera;
 * - MOVE_ANNOUNCEMENT não dispara hit shake (o golpe ainda não atingiu);
 * - MOVE_MISS_FEEDBACK e EFFECTIVENESS_FEEDBACK (imunidade) não disparam hit shake;
 * - Suporta Node.js (CommonJS) e Navegadores (window.PBABattleCamera).
 */

(function () {
  let presentationConstants;
  let adapterBase;
  let controllerModule;

  if (typeof module !== 'undefined' && module.exports) {
    presentationConstants = require('../presentation/battle-presentation-constants');
    adapterBase = require('../presentation/battle-presentation-adapter');
    controllerModule = require('./battle-camera-controller');
  } else if (typeof window !== 'undefined') {
    presentationConstants = window.PBABattlePresentation || {};
    adapterBase = window.PBABattlePresentation || {};
    controllerModule = window.PBABattleCamera || {};
  } else {
    presentationConstants = { PRESENTATION_COMMANDS: {} };
    adapterBase = { BattlePresentationAdapter: class {} };
    controllerModule = {};
  }

  const { PRESENTATION_COMMANDS } = presentationConstants;
  const BattlePresentationAdapter = adapterBase.BattlePresentationAdapter || class {};

  class BattleCameraDomAdapter extends BattlePresentationAdapter {
    /**
     * @param {Object} [options]
     * @param {BattleCameraController} [options.cameraController]
     */
    constructor(options = {}) {
      super();
      this.cameraController = options.cameraController || (
        controllerModule.createCameraController ? controllerModule.createCameraController(options) : null
      );
      this.executedCommands = [];
    }

    /**
     * Trata comandos de apresentação disparando efeitos de câmera conforme apropriado.
     * @param {Object} command
     * @param {Object} [context]
     * @returns {Promise<void>}
     */
    async execute(command, context = null) {
      if (!command || !command.type) {
        throw new Error('INVALID_PRESENTATION_COMMAND: Comando sem tipo definido.');
      }

      this.executedCommands.push({
        type: command.type,
        timestamp: Date.now(),
        command: JSON.parse(JSON.stringify(command))
      });

      if (!this.cameraController) {
        return;
      }

      switch (command.type) {
        case PRESENTATION_COMMANDS.HP_TRANSITION: {
          // Gatilho principal: impacto físico de dano sofrido
          if (command.damage !== undefined && Number(command.damage) > 0) {
            await this.cameraController.playImpact({
              damage: Number(command.damage),
              multiplier: command.multiplier !== undefined ? Number(command.multiplier) : 1,
              power: command.power,
              intensity: command.intensity,
              target: command.side || command.target
            });
          }
          break;
        }

        case PRESENTATION_COMMANDS.MOVE_MISS_FEEDBACK: {
          await this.cameraController.playMiss();
          break;
        }

        case PRESENTATION_COMMANDS.EFFECTIVENESS_FEEDBACK: {
          if (Number(command.multiplier) === 0) {
            await this.cameraController.playImmunity();
          }
          break;
        }

        case PRESENTATION_COMMANDS.BATTLE_RESULT: {
          if (command.winner === 'player') {
            await this.cameraController.playVictory();
          } else if (command.winner === 'enemy') {
            await this.cameraController.playDefeat();
          }
          break;
        }

        case PRESENTATION_COMMANDS.MOVE_ANNOUNCEMENT:
        default:
          // MOVE_ANNOUNCEMENT não executa hit shake (CAM33)
          break;
      }
    }

    /**
     * Alias de conveniência para execute(command, context).
     */
    async handleCommand(command, context = null) {
      return this.execute(command, context);
    }

    /**
     * Cancela efeitos de câmera ativos.
     */
    cancel() {
      if (this.cameraController) {
        this.cameraController.cancel();
      }
    }

    /**
     * Reseta o adaptador e o controlador.
     */
    reset() {
      this.executedCommands = [];
      if (this.cameraController) {
        this.cameraController.reset();
      }
    }
  }

  function createCameraDomAdapter(options = {}) {
    return new BattleCameraDomAdapter(options);
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      BattleCameraDomAdapter,
      createCameraDomAdapter
    };
  } else if (typeof window !== 'undefined') {
    window.PBABattleCamera = window.PBABattleCamera || {};
    window.PBABattleCamera.BattleCameraDomAdapter = BattleCameraDomAdapter;
    window.PBABattleCamera.createCameraDomAdapter = createCameraDomAdapter;
  }
})();
