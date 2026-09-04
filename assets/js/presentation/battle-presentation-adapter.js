/**
 * ====================================================================
 * ADAPTADORES DE APRESENTAÇÃO: (battle-presentation-adapter.js)
 * ====================================================================
 * Interface abstrata de execução e adaptadores para testes e execução
 * headless (Fase PBA-008).
 *
 * Princípios Fundamentais:
 * - O adaptador recebe comandos de apresentação e executa-os de forma assíncrona;
 * - O adaptador NÃO recalcula dano, tipos ou qualquer regra de combate;
 * - Suporta Node.js (testes automatizados) e Browser (window.PBABattlePresentation).
 */

(function () {
  /**
   * Interface base do Adaptador de Apresentação.
   */
  class BattlePresentationAdapter {
    /**
     * Executa um comando de apresentação de forma assíncrona.
     * @param {Object} command - Comando de apresentação normalizado.
     * @param {Object} [context] - Contexto imutável opcional.
     * @returns {Promise<void>}
     */
    async execute(command, context) {
      throw new Error('Método execute(command, context) deve ser implementado pela subclasse de BattlePresentationAdapter.');
    }
  }

  /**
   * NullAdapter: resolve imediatamente qualquer comando sem efeito colateral.
   * Ideal para execuções headless ou testes rápidos de fluxo.
   */
  class NullAdapter extends BattlePresentationAdapter {
    async execute(command, context) {
      return Promise.resolve();
    }
  }

  /**
   * RecordingAdapter: registra os comandos executados em ordem estrita.
   * Permite validar a linha do tempo (timeline), payloads e sequencialidade.
   */
  class RecordingAdapter extends BattlePresentationAdapter {
    /**
     * @param {Object} [options]
     * @param {number} [options.delayMs=0] - Atraso simulado opcional por comando.
     * @param {Function} [options.onExecute] - Callback invocado antes de resolver o comando.
     */
    constructor(options = {}) {
      super();
      this.delayMs = Number(options.delayMs) || 0;
      this.onExecute = typeof options.onExecute === 'function' ? options.onExecute : null;
      this.commands = [];
      this.calls = [];
      this.activeExecutions = 0;
      this.maxConcurrent = 0;
    }

    async execute(command, context) {
      this.activeExecutions++;
      if (this.activeExecutions > this.maxConcurrent) {
        this.maxConcurrent = this.activeExecutions;
      }

      // Clona comando para proteger contra mutações
      const clonedCommand = JSON.parse(JSON.stringify(command));
      this.commands.push(clonedCommand);
      this.calls.push({
        command: clonedCommand,
        context: context ? JSON.parse(JSON.stringify(context)) : null,
        timestamp: Date.now()
      });

      if (this.onExecute) {
        await this.onExecute(clonedCommand, context);
      }

      if (this.delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, this.delayMs));
      }

      this.activeExecutions--;
    }

    /**
     * Retorna a lista dos tipos de comandos executados em ordem.
     * @returns {Array<string>}
     */
    getExecutedCommandTypes() {
      return this.commands.map(cmd => cmd.type);
    }

    /**
     * Limpa o histórico de comandos gravados.
     */
    clear() {
      this.commands = [];
      this.calls = [];
      this.activeExecutions = 0;
      this.maxConcurrent = 0;
    }
  }

  const adapters = Object.freeze({
    BattlePresentationAdapter,
    NullAdapter,
    RecordingAdapter
  });

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = adapters;
  } else if (typeof window !== 'undefined') {
    window.PBABattlePresentation = window.PBABattlePresentation || {};
    Object.assign(window.PBABattlePresentation, adapters);
  }
})();
