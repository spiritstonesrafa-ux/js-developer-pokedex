/**
 * ====================================================================
 * CONTROLADOR DE CÂMERA E IMPACTO: (battle-camera-controller.js)
 * ====================================================================
 * Gerencia o ciclo de vida visual de efeitos de tremor (screen shake), micro
 * zoom (camera punch), hit flash e pausas de apresentação (impact hold) no
 * contêiner da arena de batalha.
 *
 * Princípios Fundamentais:
 * - CAMERA SYSTEM ≠ GAME RULES;
 * - Isolamento estrito de escopo (somente o palco/wrapper é transformado, nunca body/html);
 * - Política de concorrência CANCEL_PREVIOUS (evita acúmulo de transforms e layout thrashing);
 * - Suporte integral a acessibilidade (reducedMotion) e aceleração por GPU;
 * - Suporta Node.js (CommonJS) e Navegadores (window.PBABattleCamera).
 */

(function () {
  let constantsModule;
  let resolverModule;
  let registryModule;

  if (typeof module !== 'undefined' && module.exports) {
    constantsModule = require('./battle-camera-constants');
    resolverModule = require('./battle-camera-resolver');
    registryModule = require('./battle-camera-registry');
  } else if (typeof window !== 'undefined' && window.PBABattleCamera) {
    constantsModule = window.PBABattleCamera;
    resolverModule = window.PBABattleCamera.BattleCameraResolver || {};
    registryModule = window.PBABattleCamera.BattleCameraRegistry || {};
  } else {
    constantsModule = {
      IMPACT_LEVELS: { NONE: 'NONE', LIGHT: 'LIGHT', MEDIUM: 'MEDIUM', HEAVY: 'HEAVY' },
      SAFETY_LIMITS: { NO_STROBE_EFFECT: true, NO_RAPID_FLASH_PATTERN: true }
    };
    resolverModule = {};
    registryModule = {};
  }

  const { IMPACT_LEVELS } = constantsModule;
  const BattleCameraResolver = resolverModule.BattleCameraResolver || resolverModule;
  const BattleCameraRegistry = registryModule.BattleCameraRegistry || registryModule;

  class BattleCameraController {
    /**
     * @param {Object} [options]
     * @param {BattleCameraRegistry} [options.registry]
     * @param {boolean} [options.reducedMotion]
     * @param {boolean} [options.skipAnimations]
     */
    constructor(options = {}) {
      this.registry = options.registry || (
        typeof BattleCameraRegistry === 'function' ? new BattleCameraRegistry() : null
      );
      if (this.registry && typeof this.registry.autoDiscover === 'function') {
        this.registry.autoDiscover();
      }

      this.reducedMotion = options.reducedMotion !== undefined ? Boolean(options.reducedMotion) : (
        typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
      );
      this.skipAnimations = Boolean(options.skipAnimations);

      this.isShaking = false;
      this.isPunching = false;
      this.isFlashing = false;

      this._activeTimers = new Set();
      this._activeAnimations = new Set();
      this._currentResolve = null;
    }

    /**
     * Executa o impacto audiovisual da câmera com base nos metadados recebidos.
     * @param {Object} metadata - Dados de dano, multiplicador, power, intensity, isMiss, isImmune.
     * @returns {Promise<Object>}
     */
    async playImpact(metadata = {}) {
      // Política CANCEL_PREVIOUS para proteger contra concorrência e evitar acúmulo
      this.cancel();

      const descriptor = BattleCameraResolver.resolve(metadata);

      if (this.skipAnimations) {
        return { played: false, skipped: true, descriptor };
      }

      if (descriptor.impactLevel === IMPACT_LEVELS.NONE) {
        return { played: false, reason: 'NONE', descriptor };
      }

      // Se reducedMotion estiver ativo, desabilita shake, punch e hold
      if (this.reducedMotion) {
        return this._playReducedMotionImpact(descriptor);
      }

      return this._playFullImpact(descriptor);
    }

    /**
     * Executa resposta de Miss da câmera (MISS_DAMAGE_SHAKE = NO).
     * @returns {Promise<Object>}
     */
    async playMiss() {
      // Não executa tremor de dano em caso de miss
      return { type: 'MISS', played: false, damageShake: false };
    }

    /**
     * Executa resposta de Imunidade da câmera (IMMUNITY_DAMAGE_SHAKE = NO).
     * @returns {Promise<Object>}
     */
    async playImmunity() {
      // Não executa tremor de dano em caso de imunidade
      return { type: 'IMMUNITY', played: false, damageShake: false };
    }

    /**
     * Executa câmera de vitória suave (assentamento visual leve).
     * @returns {Promise<Object>}
     */
    async playVictory() {
      if (this.reducedMotion || this.skipAnimations) {
        return { type: 'VICTORY', settled: true };
      }
      const camera = this._getCamera();
      if (!camera) return { type: 'VICTORY', settled: true };

      return new Promise((resolve) => {
        this.isPunching = true;
        if (typeof camera.animate === 'function') {
          const anim = camera.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(1.015)' },
            { transform: 'scale(1)' }
          ], {
            duration: 400,
            easing: 'ease-out'
          });
          this._activeAnimations.add(anim);
          anim.onfinish = () => {
            this._activeAnimations.delete(anim);
            this.isPunching = false;
            this._resetTransforms();
            resolve({ type: 'VICTORY', settled: true });
          };
        } else {
          resolve({ type: 'VICTORY', settled: true });
        }
      });
    }

    /**
     * Executa câmera de derrota suave.
     * @returns {Promise<Object>}
     */
    async playDefeat() {
      if (this.reducedMotion || this.skipAnimations) {
        return { type: 'DEFEAT', settled: true };
      }
      const camera = this._getCamera();
      if (!camera) return { type: 'DEFEAT', settled: true };

      return new Promise((resolve) => {
        this.isPunching = true;
        if (typeof camera.animate === 'function') {
          const anim = camera.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(0.985)' },
            { transform: 'scale(1)' }
          ], {
            duration: 500,
            easing: 'ease-out'
          });
          this._activeAnimations.add(anim);
          anim.onfinish = () => {
            this._activeAnimations.delete(anim);
            this.isPunching = false;
            this._resetTransforms();
            resolve({ type: 'DEFEAT', settled: true });
          };
        } else {
          resolve({ type: 'DEFEAT', settled: true });
        }
      });
    }

    /**
     * Executa impacto seguro sob reduced motion (sem shake, sem punch, sem hold).
     * @private
     */
    async _playReducedMotionImpact(descriptor) {
      const flash = this._getFlashOverlay();
      if (flash && descriptor.flash) {
        // Flash ultra-suave e rápido, sem estrobo (máximo 0.08 de opacidade)
        const safeOpacity = Math.min(descriptor.flashOpacity * 0.25, 0.08);
        return new Promise((resolve) => {
          this.isFlashing = true;
          flash.style.opacity = String(safeOpacity);
          const timerId = setTimeout(() => {
            this._activeTimers.delete(timerId);
            flash.style.opacity = '0';
            this.isFlashing = false;
            resolve({ played: true, reducedMotion: true, descriptor });
          }, 80);
          this._activeTimers.add(timerId);
        });
      }
      return { played: true, reducedMotion: true, descriptor };
    }

    /**
     * Executa o impacto completo com tremor, micro zoom e flash coordenados.
     * @private
     */
    async _playFullImpact(descriptor) {
      const camera = this._getCamera();
      const flash = this._getFlashOverlay();

      const duration = Math.max(descriptor.shakeDuration, descriptor.punchDuration);
      const mag = descriptor.shakeMagnitude;
      const punch = descriptor.punchScale;

      this.isShaking = true;
      this.isPunching = true;

      return new Promise((resolve) => {
        this._currentResolve = resolve;

        // 1. Hit Flash
        if (flash && descriptor.flash && descriptor.flashOpacity > 0) {
          this.isFlashing = true;
          if (typeof flash.animate === 'function') {
            const flashAnim = flash.animate([
              { opacity: 0 },
              { opacity: descriptor.flashOpacity, offset: 0.25 },
              { opacity: 0 }
            ], {
              duration: descriptor.flashDuration,
              easing: 'ease-out'
            });
            this._activeAnimations.add(flashAnim);
            flashAnim.onfinish = () => {
              this._activeAnimations.delete(flashAnim);
              flash.style.opacity = '0';
              this.isFlashing = false;
            };
          } else {
            flash.style.opacity = String(descriptor.flashOpacity);
            const flashTimer = setTimeout(() => {
              this._activeTimers.delete(flashTimer);
              flash.style.opacity = '0';
              this.isFlashing = false;
            }, descriptor.flashDuration);
            this._activeTimers.add(flashTimer);
          }
        }

        // 2. Shake + Punch coordenados no wrapper de câmera
        if (camera && typeof camera.animate === 'function') {
          const keyframes = [
            { transform: 'translate(0px, 0px) scale(1)' },
            { transform: `translate(${-mag}px, ${mag * 0.7}px) scale(${punch})`, offset: 0.15 },
            { transform: `translate(${mag * 0.8}px, ${-mag * 0.5}px) scale(${punch * 0.99})`, offset: 0.35 },
            { transform: `translate(${-mag * 0.5}px, ${mag * 0.3}px) scale(${1 + (punch - 1) * 0.4})`, offset: 0.60 },
            { transform: `translate(${mag * 0.2}px, ${-mag * 0.15}px) scale(${1 + (punch - 1) * 0.1})`, offset: 0.80 },
            { transform: 'translate(0px, 0px) scale(1)' }
          ];

          const cameraAnim = camera.animate(keyframes, {
            duration,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
          });

          this._activeAnimations.add(cameraAnim);

          cameraAnim.onfinish = () => {
            this._activeAnimations.delete(cameraAnim);
            this.isShaking = false;
            this.isPunching = false;
            this._resetTransforms();

            // 3. Impact Hold (apenas pausa visual curta, sem pausar engine)
            if (descriptor.holdMs > 0) {
              const holdTimer = setTimeout(() => {
                this._activeTimers.delete(holdTimer);
                this._currentResolve = null;
                resolve({ played: true, descriptor });
              }, descriptor.holdMs);
              this._activeTimers.add(holdTimer);
            } else {
              this._currentResolve = null;
              resolve({ played: true, descriptor });
            }
          };
        } else {
          // Fallback para ambiente headless sem Web Animations
          const totalMs = duration + descriptor.holdMs;
          const fallbackTimer = setTimeout(() => {
            this._activeTimers.delete(fallbackTimer);
            this.isShaking = false;
            this.isPunching = false;
            this.isFlashing = false;
            this._resetTransforms();
            this._currentResolve = null;
            resolve({ played: true, descriptor });
          }, Math.min(totalMs, 30));
          this._activeTimers.add(fallbackTimer);
        }
      });
    }

    /**
     * Interrompe todos os efeitos ativos, limpa timers e reseta o palco imediatamente.
     */
    cancel() {
      // 1. Cancela timers pendentes
      if (this._activeTimers.size > 0) {
        this._activeTimers.forEach(id => clearTimeout(id));
        this._activeTimers.clear();
      }

      // 2. Cancela animações do Web Animations API
      if (this._activeAnimations.size > 0) {
        this._activeAnimations.forEach(anim => {
          try {
            if (typeof anim.cancel === 'function') anim.cancel();
          } catch (e) {}
        });
        this._activeAnimations.clear();
      }

      // 3. Resolve promise pendente se houver
      if (this._currentResolve) {
        const r = this._currentResolve;
        this._currentResolve = null;
        r({ cancelled: true });
      }

      // 4. Limpa flags de estado
      this.isShaking = false;
      this.isPunching = false;
      this.isFlashing = false;

      // 5. Restaura transforms e opacidades
      this._resetTransforms();
    }

    /**
     * Reseta completamente o subsistema para estado limpo.
     */
    reset() {
      this.cancel();
      this._resetTransforms();
    }

    /**
     * Restaura o elemento de câmera e flash ao estado base.
     * @private
     */
    _resetTransforms() {
      const camera = this._getCamera();
      if (camera) {
        if (camera.style) {
          camera.style.transform = '';
          camera.style.transition = '';
        }
        if (camera.classList) {
          camera.classList.remove('camera-shaking', 'camera-punching');
        }
      }

      const flash = this._getFlashOverlay();
      if (flash) {
        if (flash.style) {
          flash.style.opacity = '0';
        }
      }
    }

    /**
     * Auxiliar para recuperar wrapper da câmera.
     * @private
     */
    _getCamera() {
      return this.registry ? this.registry.getCamera() : null;
    }

    /**
     * Auxiliar para recuperar overlay de flash.
     * @private
     */
    _getFlashOverlay() {
      return this.registry ? this.registry.getFlashOverlay() : null;
    }
  }

  function createCameraController(options = {}) {
    return new BattleCameraController(options);
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      BattleCameraController,
      createCameraController
    };
  } else if (typeof window !== 'undefined') {
    window.PBABattleCamera = window.PBABattleCamera || {};
    window.PBABattleCamera.BattleCameraController = BattleCameraController;
    window.PBABattleCamera.createCameraController = createCameraController;
  }
})();
