/**
 * ====================================================================
 * AGENDADOR DE APRESENTAÇÃO: (battle-presentation-scheduler.js)
 * ====================================================================
 * Controla os timings e durações de passos de apresentação sem espalhar
 * setTimeout pelos módulos (Fase PBA-008).
 *
 * Princípios Fundamentais:
 * - Não usar setTimeout disperso no código de negócio;
 * - Suporta Fake/ImmediateScheduler para que testes executem em milissegundos;
 * - Suporta reducedMotion e skipAnimations para acessibilidade e aceleração;
 * - Suporta Node.js (testes automatizados) e Browser (window.PBABattlePresentation).
 */

(function () {
  let constants;

  if (typeof module !== 'undefined' && module.exports) {
    constants = require('./battle-presentation-constants.js');
  } else if (typeof window !== 'undefined' && window.PBABattlePresentation) {
    constants = window.PBABattlePresentation;
  } else {
    constants = {
      DEFAULT_DURATIONS: {},
      PRESENTATION_CONFIG: { REDUCED_MOTION_DURATION: 0 }
    };
  }

  /**
   * ImmediateScheduler: Resolve todos os atrasos instantaneamente (0ms).
   * Padrão recomendado para suítes de testes unitários automatizados.
   */
  class ImmediateScheduler {
    constructor(options = {}) {
      this.reducedMotion = Boolean(options.reducedMotion);
      this.skipAnimations = Boolean(options.skipAnimations);
      this.durations = Object.assign({}, constants.DEFAULT_DURATIONS, options.durations || {});
    }

    /**
     * Retorna a duração efetiva calculada para o tipo de comando.
     * Em ImmediateScheduler, a duração efetiva para execução é 0.
     * @param {string} commandType
     * @returns {number}
     */
    getEffectiveDuration(commandType) {
      if (this.reducedMotion || this.skipAnimations) {
        return constants.PRESENTATION_CONFIG ? constants.PRESENTATION_CONFIG.REDUCED_MOTION_DURATION : 0;
      }
      return 0;
    }

    /**
     * Retorna a duração nominal configurada (para fins de consulta/metadata).
     * @param {string} commandType
     * @returns {number}
     */
    getConfiguredDuration(commandType) {
      if (this.reducedMotion || this.skipAnimations) {
        return constants.PRESENTATION_CONFIG ? constants.PRESENTATION_CONFIG.REDUCED_MOTION_DURATION : 0;
      }
      return this.durations[commandType] !== undefined ? this.durations[commandType] : 0;
    }

    /**
     * Aguarda o tempo especificado (imediatamente resolvido no ImmediateScheduler).
     * @param {number} [ms=0]
     * @returns {Promise<void>}
     */
    async delay(ms = 0) {
      return Promise.resolve();
    }
  }

  /**
   * TimerScheduler: Agendador assíncrono real com suporte a setTimeout e cancelamento.
   */
  class TimerScheduler {
    constructor(options = {}) {
      this.reducedMotion = Boolean(options.reducedMotion);
      this.skipAnimations = Boolean(options.skipAnimations);
      this.durations = Object.assign({}, constants.DEFAULT_DURATIONS, options.durations || {});
      this.activeTimers = new Set();
    }

    /**
     * Retorna a duração efetiva a ser aguardada.
     * @param {string} commandType
     * @returns {number}
     */
    getEffectiveDuration(commandType) {
      if (this.reducedMotion || this.skipAnimations) {
        return constants.PRESENTATION_CONFIG ? constants.PRESENTATION_CONFIG.REDUCED_MOTION_DURATION : 0;
      }
      const base = this.durations[commandType];
      return base !== undefined ? base : 0;
    }

    /**
     * Retorna a duração configurada nominal.
     * @param {string} commandType
     * @returns {number}
     */
    getConfiguredDuration(commandType) {
      if (this.reducedMotion || this.skipAnimations) {
        return constants.PRESENTATION_CONFIG ? constants.PRESENTATION_CONFIG.REDUCED_MOTION_DURATION : 0;
      }
      return this.durations[commandType] !== undefined ? this.durations[commandType] : 0;
    }

    /**
     * Aguarda ms milissegundos com suporte a cancelamento.
     * @param {number} ms
     * @param {Object} [cancellationToken] - Objeto opcional com flag { isCancelled: boolean }.
     * @returns {Promise<void>}
     */
    delay(ms, cancellationToken = null) {
      const effectiveMs = (this.reducedMotion || this.skipAnimations) ? 0 : Math.max(0, Number(ms) || 0);

      if (effectiveMs === 0 || (cancellationToken && cancellationToken.isCancelled)) {
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        let timerId = null;

        const cleanup = () => {
          if (timerId !== null) {
            clearTimeout(timerId);
            this.activeTimers.delete(timerId);
            timerId = null;
          }
        };

        timerId = setTimeout(() => {
          cleanup();
          resolve();
        }, effectiveMs);

        this.activeTimers.add(timerId);

        if (cancellationToken) {
          cancellationToken.onCancel = cleanup;
        }
      });
    }

    /**
     * Cancela todos os timers pendentes ativos.
     */
    clearAll() {
      for (const timerId of this.activeTimers) {
        clearTimeout(timerId);
      }
      this.activeTimers.clear();
    }
  }

  const schedulers = Object.freeze({
    ImmediateScheduler,
    TimerScheduler
  });

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = schedulers;
  } else if (typeof window !== 'undefined') {
    window.PBABattlePresentation = window.PBABattlePresentation || {};
    Object.assign(window.PBABattlePresentation, schedulers);
  }
})();
