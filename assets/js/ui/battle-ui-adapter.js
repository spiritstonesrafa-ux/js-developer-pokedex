/**
 * ====================================================================
 * ADAPTADOR DE APRESENTAÇÃO DE UI: (battle-ui-adapter.js)
 * ====================================================================
 * Implementa BattlePresentationAdapter da Fase PBA-008 para sincronizar
 * os comandos da Presentation Timeline com a interface visual (PBA-013).
 *
 * Responsabilidades:
 * - Atualiza barras de HP, valores numéricos e classes de alerta de cor;
 * - Atualiza PP de golpes no painel de ação;
 * - Exibe mensagens contextuais na caixa de narrativa / log de batalha;
 * - Atualiza marcadores de status da equipe (ativo, banco, nocauteado);
 * - Atualiza indicadores visuais de troca e nocaute;
 * - Apresenta o banner de resultado (Vitória / Derrota);
 * - ZERO cálculo de dano, efetividade ou regras de combate.
 *
 * Suporta Node.js (CommonJS) e Navegadores (window.PBABattleUi).
 */

(function () {
  let presentationConstants;
  let adapterBase;

  if (typeof module !== 'undefined' && module.exports) {
    presentationConstants = require('../presentation/battle-presentation-constants.js');
    adapterBase = require('../presentation/battle-presentation-adapter.js');
  } else if (typeof window !== 'undefined') {
    presentationConstants = window.PBABattlePresentation || {};
    adapterBase = window.PBABattlePresentation || {};
  } else {
    presentationConstants = { PRESENTATION_COMMANDS: {} };
    adapterBase = { BattlePresentationAdapter: class {} };
  }

  const { PRESENTATION_COMMANDS } = presentationConstants;
  const { BattlePresentationAdapter } = adapterBase;

  class BattleUiDomAdapter extends BattlePresentationAdapter {
    /**
     * @param {Object} [options]
     * @param {Object} [options.view] - Instância de BattleView.
     */
    constructor(options = {}) {
      super();
      this.view = options.view || null;
      this.executedCommands = [];
    }

    setView(view) {
      this.view = view;
    }

    /**
     * Trata o comando de apresentação recebido da timeline.
     * @param {Object} command - Comando de apresentação.
     * @param {Object} [context] - Contexto imutável.
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

      if (!this.view) {
        return Promise.resolve();
      }

      switch (command.type) {
        case PRESENTATION_COMMANDS.TURN_INDICATOR: {
          if (typeof this.view.updateTurnIndicator === 'function') {
            this.view.updateTurnIndicator(command.turnNumber);
          }
          break;
        }

        case PRESENTATION_COMMANDS.MOVE_ANNOUNCEMENT: {
          const moveName = command.moveName ? command.moveName.toUpperCase() : 'GOLPE';
          const msg = `${command.pokemonName} usou ${moveName}!`;
          if (typeof this.view.displayMessage === 'function') {
            this.view.displayMessage(msg);
          }
          break;
        }

        case PRESENTATION_COMMANDS.PP_TRANSITION: {
          if (command.side === 'player' && typeof this.view.updateMovePp === 'function') {
            this.view.updateMovePp(command.moveId, command.currentPp, command.maxPp);
          }
          break;
        }

        case PRESENTATION_COMMANDS.MOVE_MISS_FEEDBACK: {
          if (typeof this.view.displayMessage === 'function') {
            this.view.displayMessage('O golpe errou!');
          }
          break;
        }

        case PRESENTATION_COMMANDS.EFFECTIVENESS_FEEDBACK: {
          if (typeof this.view.displayMessage === 'function') {
            if (command.multiplier >= 2) {
              this.view.displayMessage('É super efetivo!');
            } else if (command.multiplier <= 0.5 && command.multiplier > 0) {
              this.view.displayMessage('Não é muito efetivo...');
            } else if (command.multiplier === 0) {
              this.view.displayMessage('Não teve efeito!');
            }
          }
          break;
        }

        case PRESENTATION_COMMANDS.HP_TRANSITION: {
          if (typeof this.view.updateHpBar === 'function') {
            await this.view.updateHpBar(
              command.target,
              command.currentHp,
              command.previousHp,
              command.maxHp
            );
          }
          break;
        }

        case PRESENTATION_COMMANDS.FAINT_SEQUENCE: {
          if (typeof this.view.handleFaint === 'function') {
            this.view.handleFaint(command.target, command.pokemonId, command.pokemonName);
          }
          if (typeof this.view.displayMessage === 'function') {
            this.view.displayMessage(`${command.pokemonName} foi nocauteado!`);
          }
          break;
        }

        case PRESENTATION_COMMANDS.SWITCH_OUT_SEQUENCE: {
          if (typeof this.view.displayMessage === 'function') {
            this.view.displayMessage(`${command.pokemonName} foi recolhido!`);
          }
          break;
        }

        case PRESENTATION_COMMANDS.SWITCH_IN_SEQUENCE: {
          if (typeof this.view.handleSwitchIn === 'function') {
            this.view.handleSwitchIn(command.side, command.pokemonId, command.pokemonName);
          }
          if (typeof this.view.displayMessage === 'function') {
            this.view.displayMessage(`${command.pokemonName} entrou em campo!`);
          }
          break;
        }

        case PRESENTATION_COMMANDS.REPLACEMENT_PROMPT: {
          if (typeof this.view.displayMessage === 'function') {
            this.view.displayMessage('Escolha o próximo Pokémon para lutar!');
          }
          break;
        }

        case PRESENTATION_COMMANDS.TEAM_DEFEAT_SEQUENCE: {
          if (typeof this.view.displayMessage === 'function') {
            const teamLabel = command.side === 'player' ? 'Sua equipe' : 'A equipe adversária';
            this.view.displayMessage(`${teamLabel} foi derrotada!`);
          }
          break;
        }

        case PRESENTATION_COMMANDS.BATTLE_RESULT: {
          if (typeof this.view.showBattleResult === 'function') {
            this.view.showBattleResult(command.winner, command.reason);
          }
          break;
        }
      }

      return Promise.resolve();
    }

    handleCommand(command, context = null) {
      return this.execute(command, context);
    }

    cancel() {
      // Nenhum estado pendente a cancelar no adapter
    }

    reset() {
      this.executedCommands = [];
    }
  }

  const exportsObj = {
    BattleUiDomAdapter
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exportsObj;
  } else if (typeof window !== 'undefined') {
    window.PBABattleUi = window.PBABattleUi || {};
    Object.assign(window.PBABattleUi, exportsObj);
  }
})();
