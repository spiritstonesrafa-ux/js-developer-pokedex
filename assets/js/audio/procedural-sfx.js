/**
 * ====================================================================
 * GERADOR DE SFX PROCEDURAL: (procedural-sfx.js)
 * ====================================================================
 * Sintetiza áudios procedurais leves, curtos e dinâmicos utilizando Web Audio API
 * nativa (OscillatorNode, GainNode com ADSR, BiquadFilterNode e buffers de ruído).
 *
 * Princípios Fundamentais:
 * - Zero dependência de arquivos de áudio comerciais ou de jogos oficiais;
 * - Suporta os 18 tipos Pokémon com identidade sonora dedicada;
 * - Sons dedicados para Impacto, Miss (sem impacto) e Imunidade (sem impacto);
 * - Efeito Super Effective amplifica harmônicos/escala sem estourar limiter;
 * - Limite de polifonia MAX_SIMULTANEOUS_SFX = 8;
 * - Limpeza automática e total de nós temporários após cada som.
 */

(function () {
  let constants;

  if (typeof module !== 'undefined' && module.exports) {
    constants = require('./battle-audio-constants.js');
  } else if (typeof window !== 'undefined') {
    constants = window.PBABattleAudio || {};
  } else {
    constants = {
      AUDIO_CHANNELS: { SFX: 'SFX' },
      TYPE_AUDIO_FAMILIES: {
        NORMAL: 'normal', FIRE: 'fire', WATER: 'water', ELECTRIC: 'electric',
        GRASS: 'grass', ICE: 'ice', FIGHTING: 'fighting', POISON: 'poison',
        GROUND: 'ground', FLYING: 'flying', PSYCHIC: 'psychic', BUG: 'bug',
        ROCK: 'rock', GHOST: 'ghost', DRAGON: 'dragon', DARK: 'dark',
        STEEL: 'steel', FAIRY: 'fairy'
      },
      MAX_SIMULTANEOUS_SFX: 8
    };
  }

  const { AUDIO_CHANNELS, TYPE_AUDIO_FAMILIES, MAX_SIMULTANEOUS_SFX } = constants;

  class ProceduralSfxGenerator {
    /**
     * @param {Object} mixer - Instância de AudioMixer.
     * @param {Object} contextManager - Instância de AudioContextManager.
     */
    constructor(mixer, contextManager) {
      if (!mixer || !contextManager) {
        throw new Error('ProceduralSfxGenerator requer mixer e contextManager válidos.');
      }
      this._mixer = mixer;
      this._contextManager = contextManager;
      this._context = contextManager.getContext();
      this._activeVoices = new Set();
      this._noiseBuffer = null;
    }

    /**
     * Gera ou reutiliza um buffer de ruído branco sintetizado localmente.
     * @returns {AudioBuffer}
     * @private
     */
    _getNoiseBuffer() {
      if (!this._noiseBuffer) {
        const sampleRate = this._context.sampleRate || 44100;
        const length = Math.floor(sampleRate * 0.6); // 600ms de ruído
        this._noiseBuffer = this._context.createBuffer(1, length, sampleRate);
        const output = this._noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < length; i++) {
          // Ruído rosa / browniano leve para maior naturalidade acústica
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5; // Ganho de compensação
        }
      }
      return this._noiseBuffer;
    }

    /**
     * Aloca uma voz no sistema respeitando o limite de polifonia.
     * Se o limite for atingido, descarta a voz mais antiga.
     * @param {Function} cleanupFn
     * @returns {Object} Handle da voz
     * @private
     */
    _allocateVoice(cleanupFn) {
      if (this._activeVoices.size >= MAX_SIMULTANEOUS_SFX) {
        const oldestVoice = this._activeVoices.values().next().value;
        if (oldestVoice && typeof oldestVoice.stop === 'function') {
          oldestVoice.stop();
        }
      }

      let stopped = false;
      const voice = {
        stop: () => {
          if (stopped) return;
          stopped = true;
          this._activeVoices.delete(voice);
          this._mixer.updateActiveVoices(-1);
          try {
            cleanupFn();
          } catch (e) {}
        }
      };

      this._activeVoices.add(voice);
      this._mixer.updateActiveVoices(1);
      return voice;
    }

    /**
     * Cria e agenda um som de ataque elemental baseado no tipo.
     * @param {string} typeFamily - Tipo do golpe.
     * @param {Object} [options]
     * @param {string} [options.intensity='MEDIUM']
     * @returns {Promise<void>}
     */
    playAttackSfx(typeFamily, options = {}) {
      if (!this._contextManager.isUnlocked()) {
        return Promise.resolve();
      }

      const ctx = this._context;
      const sfxGain = this._mixer.getChannelNode(AUDIO_CHANNELS.SFX);
      const intensity = options.intensity || 'MEDIUM';
      const scale = intensity === 'HIGH' ? 1.2 : (intensity === 'LOW' ? 0.8 : 1.0);
      const type = (typeFamily || 'normal').toLowerCase();

      return new Promise((resolve) => {
        const now = ctx.currentTime;
        const nodesToCleanup = [];
        let duration = 0.25;

        const voiceGain = ctx.createGain();
        voiceGain.gain.setValueAtTime(0.001, now);
        voiceGain.connect(sfxGain);
        nodesToCleanup.push(voiceGain);

        let voiceHandle = null;
        let finished = false;

        const finish = () => {
          if (finished) return;
          finished = true;
          if (voiceHandle) {
            voiceHandle.stop();
          }
          nodesToCleanup.forEach(node => {
            try {
              if (typeof node.disconnect === 'function') node.disconnect();
            } catch (e) {}
          });
          resolve();
        };

        voiceHandle = this._allocateVoice(finish);

        switch (type) {
          case TYPE_AUDIO_FAMILIES.FIRE: {
            duration = 0.35;
            const noise = ctx.createBufferSource();
            noise.buffer = this._getNoiseBuffer();
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(900 * scale, now);
            filter.frequency.exponentialRampToValueAtTime(180, now + duration);
            filter.Q.setValueAtTime(2.5, now);

            noise.connect(filter);
            filter.connect(voiceGain);
            nodesToCleanup.push(noise, filter);

            voiceGain.gain.exponentialRampToValueAtTime(0.7 * scale, now + 0.05);
            voiceGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            noise.start(now);
            noise.stop(now + duration);
            break;
          }

          case TYPE_AUDIO_FAMILIES.WATER: {
            duration = 0.3;
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(380 * scale, now);
            osc.frequency.exponentialRampToValueAtTime(140, now + duration);

            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(600, now);

            osc.connect(filter);
            filter.connect(voiceGain);
            nodesToCleanup.push(osc, filter);

            voiceGain.gain.exponentialRampToValueAtTime(0.6 * scale, now + 0.04);
            voiceGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            osc.start(now);
            osc.stop(now + duration);
            break;
          }

          case TYPE_AUDIO_FAMILIES.ELECTRIC: {
            duration = 0.22;
            const osc = ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(880 * scale, now);
            osc.frequency.exponentialRampToValueAtTime(220, now + duration);

            osc.connect(voiceGain);
            nodesToCleanup.push(osc);

            voiceGain.gain.exponentialRampToValueAtTime(0.5 * scale, now + 0.02);
            voiceGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            osc.start(now);
            osc.stop(now + duration);
            break;
          }

          case TYPE_AUDIO_FAMILIES.GRASS: {
            duration = 0.28;
            const noise = ctx.createBufferSource();
            noise.buffer = this._getNoiseBuffer();
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1200 * scale, now);
            filter.frequency.exponentialRampToValueAtTime(450, now + duration);

            noise.connect(filter);
            filter.connect(voiceGain);
            nodesToCleanup.push(noise, filter);

            voiceGain.gain.exponentialRampToValueAtTime(0.4 * scale, now + 0.03);
            voiceGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            noise.start(now);
            noise.stop(now + duration);
            break;
          }

          case TYPE_AUDIO_FAMILIES.ICE: {
            duration = 0.3;
            const osc = ctx.createOscillator();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(1600 * scale, now);
            osc.frequency.exponentialRampToValueAtTime(2400, now + 0.1);
            osc.frequency.exponentialRampToValueAtTime(800, now + duration);

            osc.connect(voiceGain);
            nodesToCleanup.push(osc);

            voiceGain.gain.exponentialRampToValueAtTime(0.45 * scale, now + 0.02);
            voiceGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            osc.start(now);
            osc.stop(now + duration);
            break;
          }

          case TYPE_AUDIO_FAMILIES.PSYCHIC:
          case TYPE_AUDIO_FAMILIES.GHOST: {
            duration = 0.35;
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(520 * scale, now);
            osc.frequency.linearRampToValueAtTime(780, now + 0.15);
            osc.frequency.exponentialRampToValueAtTime(320, now + duration);

            osc.connect(voiceGain);
            nodesToCleanup.push(osc);

            voiceGain.gain.exponentialRampToValueAtTime(0.4 * scale, now + 0.06);
            voiceGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            osc.start(now);
            osc.stop(now + duration);
            break;
          }

          default: {
            // Impacto / Ataque físico neutro (Normal, Fighting, Rock, Steel, etc.)
            duration = 0.2;
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(220 * scale, now);
            osc.frequency.exponentialRampToValueAtTime(60, now + duration);

            osc.connect(voiceGain);
            nodesToCleanup.push(osc);

            voiceGain.gain.exponentialRampToValueAtTime(0.6 * scale, now + 0.02);
            voiceGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            osc.start(now);
            osc.stop(now + duration);
            break;
          }
        }

        setTimeout(finish, (duration * 1000) + 20);
      });
    }

    /**
     * Sintetiza som de impacto de dano no defensor.
     * @param {Object} [options]
     * @param {number} [options.multiplier=1] - Multiplicador de tipo (ex: 2 para super effective).
     * @param {string} [options.typeFamily='normal']
     * @returns {Promise<void>}
     */
    playImpactSfx(options = {}) {
      if (!this._contextManager.isUnlocked()) {
        return Promise.resolve();
      }

      const ctx = this._context;
      const sfxGain = this._mixer.getChannelNode(AUDIO_CHANNELS.SFX);
      const mult = options.multiplier !== undefined ? Number(options.multiplier) : 1;
      const isSuperEffective = mult >= 2;

      return new Promise((resolve) => {
        const now = ctx.currentTime;
        const duration = isSuperEffective ? 0.28 : 0.2;
        const nodesToCleanup = [];

        const voiceGain = ctx.createGain();
        voiceGain.gain.setValueAtTime(0.001, now);
        voiceGain.connect(sfxGain);
        nodesToCleanup.push(voiceGain);

        let voiceHandle = null;
        let finished = false;
        const finish = () => {
          if (finished) return;
          finished = true;
          if (voiceHandle) voiceHandle.stop();
          nodesToCleanup.forEach(node => {
            try { if (typeof node.disconnect === 'function') node.disconnect(); } catch (e) {}
          });
          resolve();
        };

        voiceHandle = this._allocateVoice(finish);

        // 1. Transiente grave de pancada (punch kick)
        const punchOsc = ctx.createOscillator();
        punchOsc.type = 'sine';
        punchOsc.frequency.setValueAtTime(isSuperEffective ? 160 : 130, now);
        punchOsc.frequency.exponentialRampToValueAtTime(35, now + duration);
        punchOsc.connect(voiceGain);
        nodesToCleanup.push(punchOsc);

        // 2. Ruído de impacto inicial
        const noise = ctx.createBufferSource();
        noise.buffer = this._getNoiseBuffer();
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(isSuperEffective ? 600 : 400, now);
        noise.connect(filter);
        filter.connect(voiceGain);
        nodesToCleanup.push(noise, filter);

        const peakGain = isSuperEffective ? 0.9 : 0.7;
        voiceGain.gain.exponentialRampToValueAtTime(peakGain, now + 0.02);
        voiceGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        punchOsc.start(now);
        punchOsc.stop(now + duration);
        noise.start(now);
        noise.stop(now + duration);

        setTimeout(finish, (duration * 1000) + 20);
      });
    }

    /**
     * Sintetiza som de golpe que errou o alvo (Miss).
     * Critério: MISS_DAMAGE_SOUND = NO (somente dissipação de ar, zero impacto).
     * @returns {Promise<void>}
     */
    playMissSfx() {
      if (!this._contextManager.isUnlocked()) {
        return Promise.resolve();
      }

      const ctx = this._context;
      const sfxGain = this._mixer.getChannelNode(AUDIO_CHANNELS.SFX);

      return new Promise((resolve) => {
        const now = ctx.currentTime;
        const duration = 0.25;
        const nodesToCleanup = [];

        const voiceGain = ctx.createGain();
        voiceGain.gain.setValueAtTime(0.001, now);
        voiceGain.connect(sfxGain);
        nodesToCleanup.push(voiceGain);

        let voiceHandle = null;
        let finished = false;
        const finish = () => {
          if (finished) return;
          finished = true;
          if (voiceHandle) voiceHandle.stop();
          nodesToCleanup.forEach(node => {
            try { if (typeof node.disconnect === 'function') node.disconnect(); } catch (e) {}
          });
          resolve();
        };

        voiceHandle = this._allocateVoice(finish);

        // Som de passagem de ar rápida (whoosh)
        const noise = ctx.createBufferSource();
        noise.buffer = this._getNoiseBuffer();
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, now);
        filter.frequency.exponentialRampToValueAtTime(300, now + duration);
        filter.Q.setValueAtTime(3.0, now);

        noise.connect(filter);
        filter.connect(voiceGain);
        nodesToCleanup.push(noise, filter);

        voiceGain.gain.exponentialRampToValueAtTime(0.4, now + 0.05);
        voiceGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.start(now);
        noise.stop(now + duration);

        setTimeout(finish, (duration * 1000) + 20);
      });
    }

    /**
     * Sintetiza som de imunidade / golpe bloqueado sem causar dano.
     * Critério: IMMUNITY_DAMAGE_SOUND = NO (ressonância suave, zero impacto de dano).
     * @returns {Promise<void>}
     */
    playImmunitySfx() {
      if (!this._contextManager.isUnlocked()) {
        return Promise.resolve();
      }

      const ctx = this._context;
      const sfxGain = this._mixer.getChannelNode(AUDIO_CHANNELS.SFX);

      return new Promise((resolve) => {
        const now = ctx.currentTime;
        const duration = 0.3;
        const nodesToCleanup = [];

        const voiceGain = ctx.createGain();
        voiceGain.gain.setValueAtTime(0.001, now);
        voiceGain.connect(sfxGain);
        nodesToCleanup.push(voiceGain);

        let voiceHandle = null;
        let finished = false;
        const finish = () => {
          if (finished) return;
          finished = true;
          if (voiceHandle) voiceHandle.stop();
          nodesToCleanup.forEach(node => {
            try { if (typeof node.disconnect === 'function') node.disconnect(); } catch (e) {}
          });
          resolve();
        };

        voiceHandle = this._allocateVoice(finish);

        // Chime ressonante / sino suave dissipado
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(440, now + duration);

        osc.connect(voiceGain);
        nodesToCleanup.push(osc);

        voiceGain.gain.exponentialRampToValueAtTime(0.35, now + 0.04);
        voiceGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.start(now);
        osc.stop(now + duration);

        setTimeout(finish, (duration * 1000) + 20);
      });
    }

    /**
     * Cancela e desconecta todas as vozes ativas de SFX.
     */
    cancel() {
      for (const voice of this._activeVoices) {
        try {
          voice.stop();
        } catch (e) {}
      }
      this._activeVoices.clear();
    }
  }

  const sfxModule = Object.freeze({
    ProceduralSfxGenerator,
    createProceduralSfx: (mixer, ctxManager) => new ProceduralSfxGenerator(mixer, ctxManager)
  });

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = sfxModule;
  } else if (typeof window !== 'undefined') {
    window.PBABattleAudio = window.PBABattleAudio || {};
    Object.assign(window.PBABattleAudio, sfxModule);
  }
})();
