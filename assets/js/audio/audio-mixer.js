/**
 * ====================================================================
 * MIXER DE ÁUDIO DE BATALHA: (audio-mixer.js)
 * ====================================================================
 * Roteia e gerencia canais de ganho independentes (MUSIC, SFX, CRY, UI)
 * convergindo para o Master Gain, compressor dinâmico e analisador de sinal.
 *
 * Princípios Fundamentais:
 * - Canais independentes: MASTER, MUSIC, SFX, CRY, UI;
 * - Validação estrita de volumes (0.0 a 1.0);
 * - Mute afeta somente o Master Gain sem destruir os volumes configurados;
 * - Unmute restaura exatamente o volume anterior (UNMUTE_VOLUME_RESTORE = PASS);
 * - DynamicsCompressorNode ativo para evitar clipping (headroom de segurança);
 * - AnalyserNode ativo para telemetria em tempo real.
 */

(function () {
  let constants;

  if (typeof module !== 'undefined' && module.exports) {
    constants = require('./battle-audio-constants.js');
  } else if (typeof window !== 'undefined') {
    constants = window.PBABattleAudio || {};
  } else {
    constants = {
      AUDIO_CHANNELS: { MASTER: 'MASTER', MUSIC: 'MUSIC', SFX: 'SFX', CRY: 'CRY', UI: 'UI' },
      DEFAULT_VOLUMES: { MASTER: 0.8, MUSIC: 0.5, SFX: 0.8, CRY: 0.7, UI: 0.6 }
    };
  }

  const { AUDIO_CHANNELS, DEFAULT_VOLUMES } = constants;

  class AudioMixer {
    /**
     * @param {Object} contextManager - Instância de AudioContextManager.
     */
    constructor(contextManager) {
      if (!contextManager || typeof contextManager.getContext !== 'function') {
        throw new Error('INVALID_AUDIO_CONTEXT_MANAGER: AudioMixer requer um AudioContextManager válido.');
      }

      this._contextManager = contextManager;
      this._context = contextManager.getContext();

      // Volumes lógicos configurados (0.0 .. 1.0)
      this._volumes = {
        [AUDIO_CHANNELS.MASTER]: DEFAULT_VOLUMES[AUDIO_CHANNELS.MASTER],
        [AUDIO_CHANNELS.MUSIC]: DEFAULT_VOLUMES[AUDIO_CHANNELS.MUSIC],
        [AUDIO_CHANNELS.SFX]: DEFAULT_VOLUMES[AUDIO_CHANNELS.SFX],
        [AUDIO_CHANNELS.CRY]: DEFAULT_VOLUMES[AUDIO_CHANNELS.CRY],
        [AUDIO_CHANNELS.UI]: DEFAULT_VOLUMES[AUDIO_CHANNELS.UI]
      };

      this._isMuted = false;
      this._activeVoicesCount = 0;

      this._initAudioGraph();
    }

    /**
     * Constrói o grafo de nós Web Audio:
     * Canais -> Master Gain -> DynamicsCompressor -> Analyser -> Destination
     * @private
     */
    _initAudioGraph() {
      const ctx = this._context;

      // 1. Nós de Ganho dos Canais
      this._channelNodes = {
        [AUDIO_CHANNELS.MUSIC]: ctx.createGain(),
        [AUDIO_CHANNELS.SFX]: ctx.createGain(),
        [AUDIO_CHANNELS.CRY]: ctx.createGain(),
        [AUDIO_CHANNELS.UI]: ctx.createGain()
      };

      // 2. Master Gain
      this._masterNode = ctx.createGain();

      // 3. Compressor dinâmico contra clipping (headroom)
      this._compressorNode = ctx.createDynamicsCompressor();
      if (this._compressorNode.threshold) this._compressorNode.threshold.value = -12;
      if (this._compressorNode.knee) this._compressorNode.knee.value = 30;
      if (this._compressorNode.ratio) this._compressorNode.ratio.value = 8;
      if (this._compressorNode.attack) this._compressorNode.attack.value = 0.003;
      if (this._compressorNode.release) this._compressorNode.release.value = 0.25;

      // 4. Analisador para telemetria de sinal
      this._analyserNode = ctx.createAnalyser();
      this._analyserNode.fftSize = 512;

      // Conexão do grafo
      for (const channelKey of Object.keys(this._channelNodes)) {
        const node = this._channelNodes[channelKey];
        node.gain.value = this._volumes[channelKey];
        node.connect(this._masterNode);
      }

      this._masterNode.gain.value = this._volumes[AUDIO_CHANNELS.MASTER];
      this._masterNode.connect(this._compressorNode);
      this._compressorNode.connect(this._analyserNode);
      this._analyserNode.connect(ctx.destination);
    }

    /**
     * Valida se um valor de volume é válido no intervalo [0.0, 1.0].
     * @param {*} value
     * @returns {boolean}
     */
    isValidVolume(value) {
      if (typeof value !== 'number') return false;
      if (Number.isNaN(value) || !Number.isFinite(value)) return false;
      return value >= 0.0 && value <= 1.0;
    }

    /**
     * Retorna o nó de entrada para um canal específico.
     * @param {string} channel
     * @returns {GainNode}
     */
    getChannelNode(channel) {
      if (channel === AUDIO_CHANNELS.MASTER) {
        return this._masterNode;
      }
      const node = this._channelNodes[channel];
      if (!node) {
        throw new Error(`UNKNOWN_AUDIO_CHANNEL: Canal de áudio "${channel}" não existe.`);
      }
      return node;
    }

    /**
     * Retorna o volume configurado de um canal.
     * @param {string} channel
     * @returns {number}
     */
    getVolume(channel) {
      if (!this._volumes.hasOwnProperty(channel)) {
        throw new Error(`UNKNOWN_AUDIO_CHANNEL: Canal "${channel}" inválido.`);
      }
      return this._volumes[channel];
    }

    /**
     * Define o volume de um canal com validação estrita.
     * @param {string} channel
     * @param {number} value
     */
    setVolume(channel, value) {
      if (!this.isValidVolume(value)) {
        throw new Error(`INVALID_VOLUME: Volume deve ser um número finito entre 0.0 e 1.0. Recebido: ${value}`);
      }

      if (!this._volumes.hasOwnProperty(channel)) {
        throw new Error(`UNKNOWN_AUDIO_CHANNEL: Canal "${channel}" inválido.`);
      }

      this._volumes[channel] = Number(value);

      if (channel === AUDIO_CHANNELS.MASTER) {
        if (!this._isMuted) {
          this._masterNode.gain.setValueAtTime(this._volumes[channel], this._context.currentTime);
        }
      } else {
        const node = this._channelNodes[channel];
        if (node) {
          node.gain.setValueAtTime(this._volumes[channel], this._context.currentTime);
        }
      }
    }

    /**
     * Atalhos de conveniência para cada canal.
     */
    getMasterVolume() { return this.getVolume(AUDIO_CHANNELS.MASTER); }
    setMasterVolume(val) { this.setVolume(AUDIO_CHANNELS.MASTER, val); }

    getMusicVolume() { return this.getVolume(AUDIO_CHANNELS.MUSIC); }
    setMusicVolume(val) { this.setVolume(AUDIO_CHANNELS.MUSIC, val); }

    getSfxVolume() { return this.getVolume(AUDIO_CHANNELS.SFX); }
    setSfxVolume(val) { this.setVolume(AUDIO_CHANNELS.SFX, val); }

    getCryVolume() { return this.getVolume(AUDIO_CHANNELS.CRY); }
    setCryVolume(val) { this.setVolume(AUDIO_CHANNELS.CRY, val); }

    getUiVolume() { return this.getVolume(AUDIO_CHANNELS.UI); }
    setUiVolume(val) { this.setVolume(AUDIO_CHANNELS.UI, val); }

    /**
     * Alterna ou define o status de Mute.
     * Mute age exclusivamente no Master Gain, preservando as configurações individuais.
     * @param {boolean} shouldMute
     */
    setMute(shouldMute) {
      this._isMuted = Boolean(shouldMute);
      const targetGain = this._isMuted ? 0 : this._volumes[AUDIO_CHANNELS.MASTER];
      this._masterNode.gain.setValueAtTime(targetGain, this._context.currentTime);
    }

    /**
     * Informa se o áudio está silenciado.
     * @returns {boolean}
     */
    isMuted() {
      return this._isMuted;
    }

    /**
     * Registra o início ou término de uma voz sonora para rastreamento de polifonia.
     * @param {number} delta - +1 para início, -1 para término.
     */
    updateActiveVoices(delta) {
      this._activeVoicesCount = Math.max(0, this._activeVoicesCount + delta);
    }

    /**
     * Retorna a quantidade de vozes simultâneas ativas.
     * @returns {number}
     */
    getActiveVoicesCount() {
      return this._activeVoicesCount;
    }

    /**
     * Coleta telemetria em tempo real através do AnalyserNode.
     * @returns {Object}
     */
    getTelemetry() {
      const state = this._contextManager.getState();
      let peakSignal = 0;
      let rmsSignal = 0;

      if (this._analyserNode && !this._isMuted && state === 'READY') {
        const bufferLength = this._analyserNode.frequencyBinCount || 256;
        const dataArray = new Float32Array(bufferLength);
        if (typeof this._analyserNode.getFloatTimeDomainData === 'function') {
          this._analyserNode.getFloatTimeDomainData(dataArray);
          let sumSquares = 0;
          for (let i = 0; i < bufferLength; i++) {
            const abs = Math.abs(dataArray[i]);
            if (abs > peakSignal) peakSignal = abs;
            sumSquares += abs * abs;
          }
          rmsSignal = Math.sqrt(sumSquares / bufferLength);
        }
      }

      return {
        state,
        isMuted: this._isMuted,
        masterVolume: this._volumes[AUDIO_CHANNELS.MASTER],
        musicVolume: this._volumes[AUDIO_CHANNELS.MUSIC],
        sfxVolume: this._volumes[AUDIO_CHANNELS.SFX],
        cryVolume: this._volumes[AUDIO_CHANNELS.CRY],
        uiVolume: this._volumes[AUDIO_CHANNELS.UI],
        activeVoices: this._activeVoicesCount,
        peakSignal: Number(peakSignal.toFixed(3)),
        rmsSignal: Number(rmsSignal.toFixed(3))
      };
    }

    /**
     * Reseta mixer para estado padrão mantendo o contexto.
     */
    reset() {
      this._activeVoicesCount = 0;
      if (!this._isMuted) {
        this._masterNode.gain.setValueAtTime(this._volumes[AUDIO_CHANNELS.MASTER], this._context.currentTime);
      }
    }
  }

  const mixerModule = Object.freeze({
    AudioMixer,
    createAudioMixer: (ctxManager) => new AudioMixer(ctxManager)
  });

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = mixerModule;
  } else if (typeof window !== 'undefined') {
    window.PBABattleAudio = window.PBABattleAudio || {};
    Object.assign(window.PBABattleAudio, mixerModule);
  }
})();
