/**
 * ====================================================================
 * GERENCIADOR DO AUDIO CONTEXT: (audio-context-manager.js)
 * ====================================================================
 * Gerencia a instância única de AudioContext (Web Audio API), controlando
 * o ciclo de vida contra políticas de autoplay do navegador, desbloqueio
 * via interação humana e fallback determinístico para Node.js.
 *
 * Princípios Fundamentais:
 * - AUDIO_CONTEXT_COUNT = 1;
 * - AUDIO_CONTEXT_REUSE = YES;
 * - Zero unhandled rejections antes de interação humana (estado LOCKED seguro);
 * - Suporta Node.js (FakeAudioContext integrado) e Navegadores.
 */

(function () {
  let constants;

  if (typeof module !== 'undefined' && module.exports) {
    constants = require('./battle-audio-constants.js');
  } else if (typeof window !== 'undefined') {
    constants = window.PBABattleAudio || {};
  } else {
    constants = {
      AUDIO_STATES: { LOCKED: 'LOCKED', READY: 'READY', SUSPENDED: 'SUSPENDED', ERROR: 'ERROR' }
    };
  }

  const { AUDIO_STATES } = constants;

  /**
   * Mock / Fake de AudioContext para execução limpa em ambientes headless (Node.js).
   */
  class FakeAudioContext {
    constructor() {
      this.state = 'suspended';
      this.currentTime = 0;
      this.sampleRate = 44100;
      this.destination = {
        numberOfInputs: 1,
        numberOfOutputs: 0,
        connect: () => {},
        disconnect: () => {}
      };
      this._simulatedSignalPeak = 0.5;
    }

    _createAudioParam(defaultValue = 1) {
      return {
        value: defaultValue,
        defaultValue,
        setValueAtTime: function (val) { this.value = val; return this; },
        linearRampToValueAtTime: function (val) { this.value = val; return this; },
        exponentialRampToValueAtTime: function (val) { this.value = Math.max(val, 0.0001); return this; },
        setTargetAtTime: function (val) { this.value = val; return this; },
        cancelScheduledValues: function () { return this; }
      };
    }

    createGain() {
      const param = this._createAudioParam(1);
      return {
        gain: param,
        connect: () => {},
        disconnect: () => {}
      };
    }

    createOscillator() {
      const freqParam = this._createAudioParam(440);
      const detuneParam = this._createAudioParam(0);
      return {
        type: 'sine',
        frequency: freqParam,
        detune: detuneParam,
        onended: null,
        connect: () => {},
        disconnect: () => {},
        start: () => {},
        stop: function () {
          if (typeof this.onended === 'function') {
            setTimeout(() => { if (this.onended) this.onended(); }, 5);
          }
        }
      };
    }

    createBiquadFilter() {
      return {
        type: 'lowpass',
        frequency: this._createAudioParam(350),
        Q: this._createAudioParam(1),
        gain: this._createAudioParam(0),
        connect: () => {},
        disconnect: () => {}
      };
    }

    createBuffer(numberOfChannels, length, sampleRate) {
      return {
        numberOfChannels: numberOfChannels || 1,
        length: length || 44100,
        sampleRate: sampleRate || 44100,
        duration: (length || 44100) / (sampleRate || 44100),
        getChannelData: () => new Float32Array(length || 44100)
      };
    }

    createBufferSource() {
      const playbackRateParam = this._createAudioParam(1);
      return {
        buffer: null,
        loop: false,
        playbackRate: playbackRateParam,
        onended: null,
        connect: () => {},
        disconnect: () => {},
        start: () => {},
        stop: function () {
          if (typeof this.onended === 'function') {
            setTimeout(() => { if (this.onended) this.onended(); }, 5);
          }
        }
      };
    }

    createDynamicsCompressor() {
      return {
        threshold: this._createAudioParam(-24),
        knee: this._createAudioParam(30),
        ratio: this._createAudioParam(12),
        attack: this._createAudioParam(0.003),
        release: this._createAudioParam(0.25),
        connect: () => {},
        disconnect: () => {}
      };
    }

    createAnalyser() {
      const self = this;
      return {
        fftSize: 2048,
        frequencyBinCount: 1024,
        minDecibels: -100,
        maxDecibels: -30,
        smoothingTimeConstant: 0.8,
        connect: () => {},
        disconnect: () => {},
        getByteFrequencyData: (array) => {
          if (self.state === 'running') {
            for (let i = 0; i < array.length; i++) array[i] = 120;
          } else {
            array.fill(0);
          }
        },
        getFloatTimeDomainData: (array) => {
          if (self.state === 'running') {
            for (let i = 0; i < array.length; i++) array[i] = self._simulatedSignalPeak;
          } else {
            array.fill(0);
          }
        }
      };
    }

    async resume() {
      this.state = 'running';
      return Promise.resolve();
    }

    async suspend() {
      this.state = 'suspended';
      return Promise.resolve();
    }

    async close() {
      this.state = 'closed';
      return Promise.resolve();
    }
  }

  class AudioContextManager {
    /**
     * @param {Object} [options]
     * @param {Object} [options.audioContext] - Instância injetada para testes.
     * @param {boolean} [options.autoUnlock=false] - Força unlock inicial (apenas para testes).
     */
    constructor(options = {}) {
      this._customContext = options.audioContext || null;
      this._context = null;
      this._state = AUDIO_STATES.LOCKED;
      this._isHeadless = typeof window === 'undefined';

      if (options.autoUnlock) {
        this.unlock();
      }
    }

    /**
     * Obtém ou inicializa a instância única de AudioContext.
     * @returns {AudioContext|FakeAudioContext}
     */
    getContext() {
      if (!this._context) {
        if (this._customContext) {
          this._context = this._customContext;
        } else if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          try {
            this._context = new AudioContextClass();
          } catch (e) {
            this._state = AUDIO_STATES.ERROR;
            this._context = new FakeAudioContext();
          }
        } else {
          this._context = new FakeAudioContext();
        }

        // Sincroniza estado inicial com a Web Audio API
        if (this._context.state === 'running') {
          this._state = AUDIO_STATES.READY;
        } else if (this._context.state === 'suspended') {
          this._state = AUDIO_STATES.LOCKED;
        }
      }
      return this._context;
    }

    /**
     * Desbloqueia explicitamente o áudio em resposta a gesto do usuário.
     * @returns {Promise<string>} Estado resultante ('READY' ou 'ERROR').
     */
    async unlock() {
      try {
        const ctx = this.getContext();
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }
        this._state = AUDIO_STATES.READY;
        return this._state;
      } catch (err) {
        this._state = AUDIO_STATES.ERROR;
        return this._state;
      }
    }

    /**
     * Suspende o processamento de áudio (ex: aba oculta / pause).
     * @returns {Promise<void>}
     */
    async suspend() {
      if (this._context && typeof this._context.suspend === 'function') {
        await this._context.suspend();
      }
      this._state = AUDIO_STATES.SUSPENDED;
    }

    /**
     * Retoma o processamento de áudio previamente suspenso.
     * @returns {Promise<void>}
     */
    async resume() {
      if (this._context && typeof this._context.resume === 'function') {
        await this._context.resume();
      }
      this._state = AUDIO_STATES.READY;
    }

    /**
     * Retorna o estado operacional atual.
     * @returns {string}
     */
    getState() {
      if (this._context) {
        if (this._context.state === 'running') {
          return AUDIO_STATES.READY;
        } else if (this._context.state === 'suspended' && this._state === AUDIO_STATES.READY) {
          return AUDIO_STATES.SUSPENDED;
        }
      }
      return this._state;
    }

    /**
     * Verifica se o áudio foi desbloqueado e está pronto para emitir som.
     * @returns {boolean}
     */
    isUnlocked() {
      return this.getState() === AUDIO_STATES.READY;
    }

    /**
     * Reseta estado mantendo a mesma instância única de AudioContext.
     */
    reset() {
      // Reutiliza o AudioContext conforme AUDIO_CONTEXT_REUSE = YES
      if (this._context && this._context.state === 'running') {
        this._state = AUDIO_STATES.READY;
      }
    }
  }

  const managerModule = Object.freeze({
    AudioContextManager,
    FakeAudioContext,
    createAudioContextManager: (opts) => new AudioContextManager(opts)
  });

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = managerModule;
  } else if (typeof window !== 'undefined') {
    window.PBABattleAudio = window.PBABattleAudio || {};
    Object.assign(window.PBABattleAudio, managerModule);
  }
})();
