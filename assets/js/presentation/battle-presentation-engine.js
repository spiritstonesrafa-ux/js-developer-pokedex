/**
 * ====================================================================
 * MOTOR DE APRESENTAÇÃO DE BATALHA: (battle-presentation-engine.js)
 * ====================================================================
 * Orquestrador central responsável por receber batches de eventos do
 * Battle Engine, transformá-los em comandos via Mapper e executá-los em
 * ordem sequencial estrita através de um Adapter (Fase PBA-008).
 *
 * Princípios Fundamentais:
 * - GAME ENGINE ≠ PRESENTATION ENGINE;
 * - O Presentation Engine NÃO toma decisões de regras de jogo;
 * - Execução estritamente sequencial (MAX_CONCURRENT_COMMANDS = 1);
 * - Proteção contra chamadas concorrentes;
 * - Suporte a cancelamento seguro e reset de timeline;
 * - Isolamento de erros: falhas do Adapter não alteram o estado da batalha;
 * - Suporta Node.js (testes automatizados) e Browser (window.PBABattlePresentation).
 */

(function () {
  let constants;
  let adapters;
  let schedulers;
  let PresentationMapper;

  if (typeof module !== 'undefined' && module.exports) {
    constants = require('./battle-presentation-constants.js');
    adapters = require('./battle-presentation-adapter.js');
    schedulers = require('./battle-presentation-scheduler.js');
    PresentationMapper = require('./battle-presentation-mapper.js');
  } else if (typeof window !== 'undefined') {
    constants = window.PBABattlePresentation || {};
    adapters = window.PBABattlePresentation || {};
    schedulers = window.PBABattlePresentation || {};
    PresentationMapper = (window.PBABattlePresentation && window.PBABattlePresentation.PresentationMapper) || {};
  } else {
    constants = {
      PRESENTATION_STATUS: { IDLE: 'IDLE', PLAYING: 'PLAYING', COMPLETED: 'COMPLETED', CANCELLED: 'CANCELLED', ERROR: 'ERROR' }
    };
  }

  const { PRESENTATION_STATUS } = constants;

  class BattlePresentationEngine {
    /**
     * @param {Object} [options]
     * @param {Object} [options.adapter] - Instância de BattlePresentationAdapter (padrão NullAdapter).
     * @param {Object} [options.scheduler] - Instância de Scheduler (padrão ImmediateScheduler).
     * @param {boolean} [options.reducedMotion=false] - Modo de acessibilidade com durações zeradas.
     * @param {boolean} [options.skipAnimations=false] - Pula durações de animação.
     * @param {boolean} [options.strict=true] - Modo estrito de validação de eventos.
     * @param {boolean} [options.throwOnError=false] - Se true, relança erros do adapter em vez de retornar status ERROR.
     */
    constructor(options = {}) {
      this.reducedMotion = Boolean(options.reducedMotion);
      this.skipAnimations = Boolean(options.skipAnimations);
      this.strict = options.strict !== undefined ? Boolean(options.strict) : true;
      this.throwOnError = Boolean(options.throwOnError);

      // Adapter de execução
      this.adapter = options.adapter || (adapters.NullAdapter ? new adapters.NullAdapter() : null);

      // Agendador de timings
      if (options.scheduler) {
        this.scheduler = options.scheduler;
      } else if (schedulers.ImmediateScheduler) {
        this.scheduler = new schedulers.ImmediateScheduler({
          reducedMotion: this.reducedMotion,
          skipAnimations: this.skipAnimations,
          durations: options.durations
        });
      }

      this.mapper = options.mapper || PresentationMapper;

      // Estados de controle interno
      this.status = PRESENTATION_STATUS.IDLE;
      this.cancellationToken = { isCancelled: false, onCancel: null };
      this.activeCommandsCount = 0;
      this.maxConcurrentCommands = 0;
      this.lastError = null;
    }

    /**
     * Retorna o status atual do orquestrador.
     * @returns {string}
     */
    getStatus() {
      return this.status;
    }

    /**
     * Indica se uma timeline está ativamente em reprodução.
     * @returns {boolean}
     */
    isPlaying() {
      return this.status === PRESENTATION_STATUS.PLAYING;
    }

    /**
     * Cancela a execução da timeline ativa.
     * Comandos subsequentes não serão executados.
     */
    cancel() {
      this.cancellationToken.isCancelled = true;
      if (typeof this.cancellationToken.onCancel === 'function') {
        this.cancellationToken.onCancel();
      }
      this.status = PRESENTATION_STATUS.CANCELLED;
      if (this.scheduler && typeof this.scheduler.clearAll === 'function') {
        this.scheduler.clearAll();
      }
    }

    /**
     * Reseta o motor de apresentação para o estado IDLE, liberando-o para nova timeline.
     */
    reset() {
      if (this.scheduler && typeof this.scheduler.clearAll === 'function') {
        this.scheduler.clearAll();
      }
      this.status = PRESENTATION_STATUS.IDLE;
      this.cancellationToken = { isCancelled: false, onCancel: null };
      this.activeCommandsCount = 0;
      this.maxConcurrentCommands = 0;
      this.lastError = null;
    }

    /**
     * Reproduz um lote (batch) de eventos de batalha, convertendo-os em comandos
     * e executando-os sequencialmente através do Adapter.
     *
     * @param {Array<Object>} events - Lista de eventos do Battle Engine.
     * @param {Object} [context] - Contexto imutável opcional.
     * @returns {Promise<Object>} Resultado estruturado da reprodução.
     * @throws {Error} Se chamado concorrentemente ou se a entrada for inválida.
     */
    async play(events, context = null) {
      // 1. Proteção de Concorrência
      if (this.status === PRESENTATION_STATUS.PLAYING) {
        throw new Error('CONCURRENT_PLAYBACK_REJECTED: PresentationEngine já está executando uma timeline ativa. Não é permitido executar reproduções concorrentes.');
      }

      if (!Array.isArray(events)) {
        throw new Error('INVALID_EVENT_STREAM: events deve ser um Array.');
      }

      // Se não há eventos, conclui imediatamente
      if (events.length === 0) {
        this.status = PRESENTATION_STATUS.COMPLETED;
        return {
          status: PRESENTATION_STATUS.COMPLETED,
          eventsProcessed: 0,
          commandsExecuted: 0
        };
      }

      this.status = PRESENTATION_STATUS.PLAYING;
      this.cancellationToken = { isCancelled: false, onCancel: null };
      this.activeCommandsCount = 0;
      this.maxConcurrentCommands = 0;
      this.lastError = null;

      // 2. Mapeamento de Eventos -> Comandos
      let commands;
      try {
        commands = this.mapper.mapEvents(events, context);
      } catch (err) {
        this.status = PRESENTATION_STATUS.ERROR;
        this.lastError = err;
        throw err;
      }

      let commandsExecuted = 0;
      let eventsProcessed = events.length;

      // 3. Execução Sequencial dos Comandos
      try {
        for (let i = 0; i < commands.length; i++) {
          // Checagem prévia de cancelamento
          if (this.cancellationToken.isCancelled) {
            this.status = PRESENTATION_STATUS.CANCELLED;
            return {
              status: PRESENTATION_STATUS.CANCELLED,
              eventsProcessed,
              commandsExecuted
            };
          }

          const command = commands[i];

          // Agendamento do timing / atraso do comando se houver
          if (this.scheduler) {
            const duration = this.scheduler.getEffectiveDuration(command.type);
            if (duration > 0) {
              await this.scheduler.delay(duration, this.cancellationToken);
            }
          }

          // Checagem de cancelamento após delay
          if (this.cancellationToken.isCancelled) {
            this.status = PRESENTATION_STATUS.CANCELLED;
            return {
              status: PRESENTATION_STATUS.CANCELLED,
              eventsProcessed,
              commandsExecuted
            };
          }

          // Execução através do Adapter
          if (this.adapter) {
            this.activeCommandsCount++;
            if (this.activeCommandsCount > this.maxConcurrentCommands) {
              this.maxConcurrentCommands = this.activeCommandsCount;
            }

            try {
              await this.adapter.execute(command, context);
            } finally {
              this.activeCommandsCount--;
            }
          }

          commandsExecuted++;
        }

        this.status = PRESENTATION_STATUS.COMPLETED;
        return {
          status: PRESENTATION_STATUS.COMPLETED,
          eventsProcessed,
          commandsExecuted
        };
      } catch (err) {
        this.status = PRESENTATION_STATUS.ERROR;
        this.lastError = err;

        if (this.throwOnError) {
          throw err;
        }

        return {
          status: PRESENTATION_STATUS.ERROR,
          error: err.message,
          eventsProcessed,
          commandsExecuted
        };
      }
    }
  }

  const presentationModule = Object.freeze({
    BattlePresentationEngine,
    createPresentationEngine: (opts) => new BattlePresentationEngine(opts)
  });

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = presentationModule;
  } else if (typeof window !== 'undefined') {
    window.PBABattlePresentation = window.PBABattlePresentation || {};
    Object.assign(window.PBABattlePresentation, presentationModule);
  }
})();
