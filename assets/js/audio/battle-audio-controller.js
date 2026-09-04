/**
 * ====================================================================
 * CONTROLADOR PRINCIPAL DE ÁUDIO DE BATALHA: (battle-audio-controller.js)
 * ====================================================================
 * Coordena todos os canais de áudio, geração procedural de SFX, música de batalha,
 * reprodução de cries, volumes e gerenciamento de ciclo de vida e cancelamento.
 *
 * Princípios Fundamentais:
 * - AUDIO SYSTEM ≠ GAME RULES;
 * - AUTOPLAY_POLICY_HANDLED = YES (estado inicial LOCKED seguro);
 * - AUDIO_CONTEXT_COUNT = 1 e AUDIO_CONTEXT_REUSE = YES;
 * - Limpeza total e ausência de vazamento de nós ou timers;
 * - Ausência de duplicidade de música (MULTIPLE_MUSIC_INSTANCES = NO);
 * - Falhas de cry não bloqueiam combate (CRY_FAILURE_BLOCKS_BATTLE = NO);
 * - Suporta Node.js (testes automatizados) e Browser.
 */

(function () {
  let constants;
  let contextManagerModule;
  let mixerModule;
  let sfxModule;
  let resolverModule;

  if (typeof module !== 'undefined' && module.exports) {
    constants = require('./battle-audio-constants.js');
    contextManagerModule = require('./audio-context-manager.js');
    mixerModule = require('./audio-mixer.js');
    sfxModule = require('./procedural-sfx.js');
    resolverModule = require('./battle-audio-resolver.js');
  } else if (typeof window !== 'undefined') {
    constants = window.PBABattleAudio || {};
    contextManagerModule = window.PBABattleAudio || {};
    mixerModule = window.PBABattleAudio || {};
    sfxModule = window.PBABattleAudio || {};
    resolverModule = (window.PBABattleAudio && window.PBABattleAudio.BattleAudioResolver) || window.PBABattleAudio || {};
  } else {
    constants = {};
    contextManagerModule = {};
    mixerModule = {};
    sfxModule = {};
    resolverModule = {};
  }

  const { AUDIO_CHANNELS, AUDIO_STATES } = constants;

  class BattleAudioController {
    /**
     * @param {Object} [options]
     * @param {Object} [options.contextManager]
     * @param {Object} [options.mixer]
     * @param {Object} [options.sfxGenerator]
     * @param {Object} [options.resolver]
     */
    constructor(options = {}) {
      this.contextManager = options.contextManager || (
        contextManagerModule.createAudioContextManager ? contextManagerModule.createAudioContextManager(options) : null
      );
      this.mixer = options.mixer || (
        mixerModule.createAudioMixer ? mixerModule.createAudioMixer(this.contextManager) : null
      );
      this.sfx = options.sfxGenerator || (
        sfxModule.createProceduralSfx ? sfxModule.createProceduralSfx(this.mixer, this.contextManager) : null
      );
      this.resolver = options.resolver || (
        resolverModule.resolve ? resolverModule : (resolverModule.BattleAudioResolver || resolverModule)
      );

      // Controle de Música de Batalha (instância única garantida)
      this._isMusicPlaying = false;
      this._musicNodes = [];
      this._musicIntervalId = null;

      // Controle e deduplicação de Pokémon Cry
      this._activeCryUrl = null;
      this._activeCryAudio = null;
      this._lastCryTimestamp = 0;
    }

    /**
     * Desbloqueia explicitamente a Web Audio API via gesto do usuário.
     * @returns {Promise<string>}
     */
    async unlock() {
      if (this.contextManager) {
        return this.contextManager.unlock();
      }
      return AUDIO_STATES.ERROR;
    }

    /**
     * Verifica se o áudio está desbloqueado e ativo.
     * @returns {boolean}
     */
    isUnlocked() {
      return this.contextManager ? this.contextManager.isUnlocked() : false;
    }

    /**
     * Toca o efeito sonoro de ataque elemental correspondente ao golpe.
     * @param {Object} moveDataOrDescriptor
     * @param {Object} [options]
     * @returns {Promise<void>}
     */
    async playMoveAttack(moveDataOrDescriptor, options = {}) {
      if (!this.isUnlocked() || !this.sfx) {
        return Promise.resolve();
      }

      let descriptor = moveDataOrDescriptor;
      if (!descriptor || !descriptor.typeFamily) {
        try {
          descriptor = this.resolver.resolve(moveDataOrDescriptor || {});
        } catch (e) {
          descriptor = { typeFamily: 'normal', intensity: 'MEDIUM' };
        }
      }

      return this.sfx.playAttackSfx(descriptor.typeFamily, {
        intensity: descriptor.intensity || 'MEDIUM',
        ...options
      });
    }

    /**
     * Toca o som de impacto de dano no defensor.
     * @param {Object} [options]
     * @param {number} [options.multiplier=1]
     * @param {string} [options.typeFamily='normal']
     * @returns {Promise<void>}
     */
    async playMoveImpact(options = {}) {
      if (!this.isUnlocked() || !this.sfx) {
        return Promise.resolve();
      }
      return this.sfx.playImpactSfx(options);
    }

    /**
     * Toca o som de golpe que errou o alvo (Miss).
     * @returns {Promise<void>}
     */
    async playMiss() {
      if (!this.isUnlocked() || !this.sfx) {
        return Promise.resolve();
      }
      return this.sfx.playMissSfx();
    }

    /**
     * Toca o som de imunidade / absorção de golpe sem dano.
     * @returns {Promise<void>}
     */
    async playImmunity() {
      if (!this.isUnlocked() || !this.sfx) {
        return Promise.resolve();
      }
      return this.sfx.playImmunitySfx();
    }

    /**
     * Reproduz o som oficial (cry) do Pokémon.
     * Tolerante a falhas de rede e com deduplicação ativa.
     * @param {string} cryUrl - URL do arquivo de áudio.
     * @param {Object} [options]
     * @returns {Promise<void>}
     */
    async playPokemonCry(cryUrl, options = {}) {
      if (!cryUrl || typeof cryUrl !== 'string') {
        return Promise.resolve();
      }

      // Deduplicação estrita: previne tocar o mesmo cry dentro de 400ms
      const now = Date.now();
      if (this._activeCryUrl === cryUrl && (now - this._lastCryTimestamp) < 400) {
        return Promise.resolve();
      }

      this._activeCryUrl = cryUrl;
      this._lastCryTimestamp = now;

      // Em ambientes sem HTMLAudioElement (ex: Node headless), conclui silenciosamente
      if (typeof Audio === 'undefined') {
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        try {
          const audio = new Audio(cryUrl);
          this._activeCryAudio = audio;

          const cryVol = this.mixer ? this.mixer.getCryVolume() : 0.7;
          const masterVol = this.mixer && this.mixer.isMuted() ? 0 : (this.mixer ? this.mixer.getMasterVolume() : 0.8);
          audio.volume = Math.max(0, Math.min(1, cryVol * masterVol));

          let finished = false;
          const finish = () => {
            if (!finished) {
              finished = true;
              if (this._activeCryAudio === audio) {
                this._activeCryAudio = null;
                this._activeCryUrl = null;
              }
              resolve();
            }
          };

          audio.onended = finish;
          audio.onerror = () => {
            // Falha remota não bloqueia combate (CRY_FAILURE_BLOCKS_BATTLE = NO)
            finish();
          };

          const playPromise = audio.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => finish());
          }

          // Timeout de segurança para caso o áudio trave o evento
          setTimeout(finish, 1800);
        } catch (e) {
          resolve();
        }
      });
    }

    /**
     * Inicia a música de batalha procedural (loop original dinâmico).
     * Garante MULTIPLE_MUSIC_INSTANCES = NO e MUSIC_LOOP_LEAK = NONE.
     * @returns {Promise<void>}
     */
    async startBattleMusic() {
      if (this._isMusicPlaying) {
        return Promise.resolve();
      }

      if (!this.isUnlocked()) {
        return Promise.resolve();
      }

      this._isMusicPlaying = true;
      const ctx = this.contextManager.getContext();
      const musicGain = this.mixer ? this.mixer.getChannelNode(AUDIO_CHANNELS.MUSIC) : ctx.destination;

      // Padrão musical original: Loop procedural de baixo dinâmico e arpejo (não cópia)
      const bpm = 128;
      const beatDuration = 60 / bpm; // ~0.468s
      const notes = [110, 110, 130.8, 146.8, 110, 98, 110, 164.8]; // Sequência em Lá menor
      let step = 0;

      const playBeat = () => {
        if (!this._isMusicPlaying) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        const freq = notes[step % notes.length];
        step++;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        // Filtro de síntese analógica
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);
        filter.frequency.exponentialRampToValueAtTime(150, now + (beatDuration * 0.8));

        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.3, now + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + (beatDuration * 0.85));

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(musicGain);

        osc.start(now);
        osc.stop(now + beatDuration);

        this._musicNodes.push(osc, filter, noteGain);

        // Limpeza dos nós do compasso anterior
        setTimeout(() => {
          try {
            osc.disconnect();
            filter.disconnect();
            noteGain.disconnect();
          } catch (e) {}
          const idx = this._musicNodes.indexOf(osc);
          if (idx !== -1) this._musicNodes.splice(idx, 3);
        }, (beatDuration * 1000) + 100);
      };

      // Dispara primeiro beat imediatamente e agenda o loop
      playBeat();
      this._musicIntervalId = setInterval(playBeat, beatDuration * 500);

      return Promise.resolve();
    }

    /**
     * Interrompe a música de batalha com fade out opcional.
     * @param {Object} [options]
     * @param {number} [options.fadeDuration=0.2]
     * @returns {Promise<void>}
     */
    async stopBattleMusic(options = {}) {
      if (!this._isMusicPlaying) {
        return Promise.resolve();
      }

      this._isMusicPlaying = false;
      if (this._musicIntervalId) {
        clearInterval(this._musicIntervalId);
        this._musicIntervalId = null;
      }

      // Desconecta nós remanescentes
      this._musicNodes.forEach(node => {
        try {
          if (typeof node.stop === 'function') node.stop();
          if (typeof node.disconnect === 'function') node.disconnect();
        } catch (e) {}
      });
      this._musicNodes = [];

      return Promise.resolve();
    }

    /**
     * Toca fanfarra procedural de vitória.
     * @returns {Promise<void>}
     */
    async playVictory() {
      await this.stopBattleMusic();

      if (!this.isUnlocked()) return Promise.resolve();

      const ctx = this.contextManager.getContext();
      const musicGain = this.mixer ? this.mixer.getChannelNode(AUDIO_CHANNELS.MUSIC) : ctx.destination;

      // Arpejo triunfante original (Dó maior -> Sol)
      const chord = [261.63, 329.63, 392.00, 523.25];
      const now = ctx.currentTime;

      return new Promise((resolve) => {
        chord.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + (idx * 0.1);

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.001, start);
          gain.gain.exponentialRampToValueAtTime(0.4, start + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);

          osc.connect(gain);
          gain.connect(musicGain);

          osc.start(start);
          osc.stop(start + 0.65);
        });

        setTimeout(resolve, 800);
      });
    }

    /**
     * Toca acorde procedural de derrota.
     * @returns {Promise<void>}
     */
    async playDefeat() {
      await this.stopBattleMusic();

      if (!this.isUnlocked()) return Promise.resolve();

      const ctx = this.contextManager.getContext();
      const musicGain = this.mixer ? this.mixer.getChannelNode(AUDIO_CHANNELS.MUSIC) : ctx.destination;

      // Acorde menor descendente sombrio
      const chord = [220.00, 174.61, 130.81];
      const now = ctx.currentTime;

      return new Promise((resolve) => {
        chord.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + (idx * 0.12);

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.001, start);
          gain.gain.exponentialRampToValueAtTime(0.3, start + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.7);

          osc.connect(gain);
          gain.connect(musicGain);

          osc.start(start);
          osc.stop(start + 0.75);
        });

        setTimeout(resolve, 900);
      });
    }

    /**
     * Cancela sons ativos e interrompe música sem quebrar a timeline.
     */
    cancel() {
      this.stopBattleMusic();
      if (this.sfx && typeof this.sfx.cancel === 'function') {
        this.sfx.cancel();
      }
      if (this._activeCryAudio) {
        try {
          this._activeCryAudio.pause();
          this._activeCryAudio = null;
        } catch (e) {}
      }
      this._activeCryUrl = null;
    }

    /**
     * Reseta estado mantendo o AudioContext e mixer para reutilização.
     */
    reset() {
      this.cancel();
      if (this.mixer && typeof this.mixer.reset === 'function') {
        this.mixer.reset();
      }
      if (this.contextManager && typeof this.contextManager.reset === 'function') {
        this.contextManager.reset();
      }
    }

    /**
     * Retorna configurações atuais dos canais de áudio.
     * @returns {Object}
     */
    getSettings() {
      return this.mixer ? this.mixer.getTelemetry() : {};
    }

    /**
     * Aplica configurações externas aos canais de áudio.
     * @param {Object} settings
     */
    setSettings(settings = {}) {
      if (!this.mixer) return;
      if (settings.masterVolume !== undefined) this.mixer.setMasterVolume(settings.masterVolume);
      if (settings.musicVolume !== undefined) this.mixer.setMusicVolume(settings.musicVolume);
      if (settings.sfxVolume !== undefined) this.mixer.setSfxVolume(settings.sfxVolume);
      if (settings.cryVolume !== undefined) this.mixer.setCryVolume(settings.cryVolume);
      if (settings.uiVolume !== undefined) this.mixer.setUiVolume(settings.uiVolume);
      if (settings.isMuted !== undefined) this.mixer.setMute(settings.isMuted);
    }

    /**
     * Coleta telemetria em tempo real para o harness visual.
     * @returns {Object}
     */
    getTelemetry() {
      const telemetry = this.mixer ? this.mixer.getTelemetry() : {};
      telemetry.isMusicPlaying = this._isMusicPlaying;
      return telemetry;
    }
  }

  const controllerModule = Object.freeze({
    BattleAudioController,
    createBattleAudioController: (opts) => new BattleAudioController(opts)
  });

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = controllerModule;
  } else if (typeof window !== 'undefined') {
    window.PBABattleAudio = window.PBABattleAudio || {};
    Object.assign(window.PBABattleAudio, controllerModule);
  }
})();
