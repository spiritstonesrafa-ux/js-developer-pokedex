/**
 * ====================================================================
 * RENDERIZADOR DOM DE EFEITOS VISUAIS: (move-vfx-dom-renderer.js)
 * ====================================================================
 * Cria e manipula elementos visuais no palco (Stage) da Battle Arena,
 * aplicando propriedades CSS customizadas e animações por hardware (GPU).
 *
 * Princípios Fundamentais:
 * - Uso exclusivo de transform (translate3d, scale, rotate) e opacity;
 * - Sem layout thrashing contínuo;
 * - Limpeza total e estrita de nós e listeners pós-animação (zero leaks);
 * - Suporte a Reduced Motion (sem partículas, durações ~0ms);
 * - Suporta Node.js (headless seguro) e Navegadores (window.PBABattleVfx).
 */

(function () {
  let constants;
  if (typeof module !== 'undefined' && module.exports) {
    constants = require('./move-vfx-constants.js');
  } else if (typeof window !== 'undefined' && window.PBABattleVfx) {
    constants = window.PBABattleVfx;
  } else {
    constants = {
      VFX_ARCHETYPES: {},
      VFX_DURATIONS: {},
      VFX_LIMITS: { MAX_PARTICLES_PER_EFFECT: 12, REDUCED_MOTION_MAX_PARTICLES: 0 },
      LAYER_Z_INDEX: { PROJECTILE: 20, IMPACT: 30 }
    };
  }

  const {
    VFX_ARCHETYPES,
    VFX_DURATIONS,
    VFX_LIMITS,
    LAYER_Z_INDEX
  } = constants;

  class MoveVfxDomRenderer {
    /**
     * @param {Object} [options]
     * @param {Object} [options.registry] - Instância de MoveVfxRegistry.
     */
    constructor(options = {}) {
      this.registry = options.registry || null;
      this.activeElements = new Set();
      this.activeTimers = new Set();
    }

    /**
     * Cria e adiciona um elemento gerenciado ao contêiner de palco.
     * @param {string} className
     * @param {number} zIndex
     * @returns {HTMLElement|Object}
     */
    createElement(className, zIndex = LAYER_Z_INDEX.PROJECTILE) {
      const stage = this.registry ? this.registry.getStage() : null;

      if (typeof document === 'undefined') {
        // Objeto virtual para testes no Node.js
        const virtualElement = {
          className,
          style: {
            setProperty(prop, val) {
              this[prop] = String(val);
            },
            getPropertyValue(prop) {
              return this[prop] || '';
            }
          },
          dataset: {},
          parentNode: stage,
          remove() {},
          addEventListener(evt, fn) {},
          removeEventListener(evt, fn) {}
        };
        this.activeElements.add(virtualElement);
        return virtualElement;
      }

      const el = document.createElement('div');
      el.className = className;
      el.style.zIndex = zIndex;
      el.style.pointerEvents = 'none';

      if (stage && typeof stage.appendChild === 'function') {
        stage.appendChild(el);
      } else if (document.body) {
        document.body.appendChild(el);
      }

      this.activeElements.add(el);
      return el;
    }

    /**
     * Remove com segurança um elemento ativo do DOM e do rastreador.
     * @param {HTMLElement|Object} element
     */
    destroyElement(element) {
      if (!element) return;
      this.activeElements.delete(element);
      try {
        if (typeof element.remove === 'function') {
          element.remove();
        } else if (element.parentNode && typeof element.parentNode.removeChild === 'function') {
          element.parentNode.removeChild(element);
        }
      } catch (e) {
        // Silêncio defensivo
      }
    }

    /**
     * Agenda um timer controlado que pode ser cancelado globalmente.
     * @param {Function} fn
     * @param {number} delayMs
     * @returns {number}
     */
    scheduleTimer(fn, delayMs) {
      const timer = setTimeout(() => {
        this.activeTimers.delete(timer);
        fn();
      }, Math.max(0, delayMs));
      this.activeTimers.add(timer);
      return timer;
    }

    /**
     * Renderiza o efeito do golpe de acordo com seu arquétipo.
     *
     * @param {Object} descriptor - Descritor do golpe gerado por MoveVfxResolver.
     * @param {Object} options - { attackerSide, defenderSide, isMiss, isImmune, multiplier, reducedMotion }
     * @returns {Promise<void>}
     */
    renderMoveEffect(descriptor, options = {}) {
      const {
        attackerSide = 'player',
        defenderSide = 'enemy',
        isMiss = false,
        isImmune = false,
        multiplier = 1,
        reducedMotion = false
      } = options;

      const coords = this.registry
        ? this.registry.getCoordinates(attackerSide, defenderSide)
        : { fromX: 200, fromY: 260, toX: 600, toY: 140, deltaX: 400, deltaY: -120, distance: 417, angle: -16 };

      const duration = reducedMotion ? 0 : (descriptor.duration || 350);
      const isPlayer = attackerSide === 'player';
      const dir = isPlayer ? 1 : -1;

      return new Promise((resolve) => {
        if (reducedMotion) {
          // Em reduced motion, transição instantânea sem partículas
          if (!isMiss && !isImmune) {
            this.renderImpact(descriptor, coords, { multiplier, isMiss, isImmune, reducedMotion: true });
          }
          resolve();
          return;
        }

        const primaryColor = descriptor.colors.primary;
        const secondaryColor = descriptor.colors.secondary;
        const glowColor = descriptor.colors.glow;

        const archetype = descriptor.archetype || VFX_ARCHETYPES.PROJECTILE;

        switch (archetype) {
          case VFX_ARCHETYPES.BEAM: {
            const beam = this.createElement('pba-vfx-beam', LAYER_Z_INDEX.PROJECTILE);
            beam.style.setProperty('--vfx-color-primary', primaryColor);
            beam.style.setProperty('--vfx-color-secondary', secondaryColor);
            beam.style.setProperty('--vfx-color-glow', glowColor);
            beam.style.setProperty('--vfx-start-x', `${coords.fromX}px`);
            beam.style.setProperty('--vfx-start-y', `${coords.fromY}px`);
            beam.style.setProperty('--vfx-length', `${coords.distance}px`);
            beam.style.setProperty('--vfx-angle', `${coords.angle}deg`);
            beam.style.setProperty('--vfx-duration', `${duration}ms`);

            this.scheduleTimer(() => {
              this.destroyElement(beam);
              if (!isMiss && !isImmune) {
                this.renderImpact(descriptor, coords, { multiplier, isMiss, isImmune, reducedMotion });
              } else if (isMiss) {
                this.renderMissDissipate(coords);
              } else if (isImmune) {
                this.renderImmuneDissipate(coords);
              }
              resolve();
            }, duration);
            break;
          }

          case VFX_ARCHETYPES.STREAM: {
            const stream = this.createElement('pba-vfx-stream', LAYER_Z_INDEX.PROJECTILE);
            stream.style.setProperty('--vfx-color-primary', primaryColor);
            stream.style.setProperty('--vfx-color-secondary', secondaryColor);
            stream.style.setProperty('--vfx-color-glow', glowColor);
            stream.style.setProperty('--vfx-start-x', `${coords.fromX}px`);
            stream.style.setProperty('--vfx-start-y', `${coords.fromY}px`);
            stream.style.setProperty('--vfx-length', `${coords.distance}px`);
            stream.style.setProperty('--vfx-angle', `${coords.angle}deg`);
            stream.style.setProperty('--vfx-dir', `${dir}`);
            stream.style.setProperty('--vfx-duration', `${duration}ms`);

            this.scheduleTimer(() => {
              this.destroyElement(stream);
              if (!isMiss && !isImmune) {
                this.renderImpact(descriptor, coords, { multiplier, isMiss, isImmune, reducedMotion });
              } else if (isMiss) {
                this.renderMissDissipate(coords);
              } else if (isImmune) {
                this.renderImmuneDissipate(coords);
              }
              resolve();
            }, duration);
            break;
          }

          case VFX_ARCHETYPES.SLASH: {
            const slash = this.createElement('pba-vfx-slash', LAYER_Z_INDEX.IMPACT);
            slash.style.setProperty('--vfx-color-primary', primaryColor);
            slash.style.setProperty('--vfx-color-secondary', secondaryColor);
            slash.style.setProperty('--vfx-color-glow', glowColor);
            slash.style.setProperty('--vfx-target-x', `${coords.toX}px`);
            slash.style.setProperty('--vfx-target-y', `${coords.toY}px`);
            slash.style.setProperty('--vfx-dir', `${dir}`);
            slash.style.setProperty('--vfx-duration', `${duration}ms`);

            this.scheduleTimer(() => {
              this.destroyElement(slash);
              if (!isMiss && !isImmune) {
                this.renderImpact(descriptor, coords, { multiplier, isMiss, isImmune, reducedMotion });
              } else if (isMiss) {
                this.renderMissDissipate(coords);
              } else if (isImmune) {
                this.renderImmuneDissipate(coords);
              }
              resolve();
            }, duration);
            break;
          }

          case VFX_ARCHETYPES.BURST: {
            const burst = this.createElement('pba-vfx-burst', LAYER_Z_INDEX.IMPACT);
            burst.style.setProperty('--vfx-color-primary', primaryColor);
            burst.style.setProperty('--vfx-color-secondary', secondaryColor);
            burst.style.setProperty('--vfx-color-glow', glowColor);
            burst.style.setProperty('--vfx-target-x', `${coords.toX}px`);
            burst.style.setProperty('--vfx-target-y', `${coords.toY}px`);
            burst.style.setProperty('--vfx-duration', `${duration}ms`);

            this.scheduleTimer(() => {
              this.destroyElement(burst);
              if (!isMiss && !isImmune) {
                this.renderImpact(descriptor, coords, { multiplier, isMiss, isImmune, reducedMotion });
              } else if (isMiss) {
                this.renderMissDissipate(coords);
              } else if (isImmune) {
                this.renderImmuneDissipate(coords);
              }
              resolve();
            }, duration);
            break;
          }

          case VFX_ARCHETYPES.IMPACT: {
            const impact = this.createElement('pba-vfx-impact', LAYER_Z_INDEX.IMPACT);
            impact.style.setProperty('--vfx-color-primary', primaryColor);
            impact.style.setProperty('--vfx-color-secondary', secondaryColor);
            impact.style.setProperty('--vfx-color-glow', glowColor);
            impact.style.setProperty('--vfx-target-x', `${coords.toX}px`);
            impact.style.setProperty('--vfx-target-y', `${coords.toY}px`);
            impact.style.setProperty('--vfx-dir', `${dir}`);
            impact.style.setProperty('--vfx-duration', `${duration}ms`);

            this.scheduleTimer(() => {
              this.destroyElement(impact);
              if (!isMiss && !isImmune) {
                this.renderImpact(descriptor, coords, { multiplier, isMiss, isImmune, reducedMotion });
              } else if (isMiss) {
                this.renderMissDissipate(coords);
              } else if (isImmune) {
                this.renderImmuneDissipate(coords);
              }
              resolve();
            }, duration);
            break;
          }

          case VFX_ARCHETYPES.WAVE: {
            const wave = this.createElement('pba-vfx-wave', LAYER_Z_INDEX.PROJECTILE);
            wave.style.setProperty('--vfx-color-primary', primaryColor);
            wave.style.setProperty('--vfx-color-secondary', secondaryColor);
            wave.style.setProperty('--vfx-color-glow', glowColor);
            wave.style.setProperty('--vfx-start-x', `${coords.fromX}px`);
            wave.style.setProperty('--vfx-start-y', `${coords.fromY}px`);
            wave.style.setProperty('--vfx-target-x', `${coords.toX}px`);
            wave.style.setProperty('--vfx-target-y', `${coords.toY}px`);
            wave.style.setProperty('--vfx-dir', `${dir}`);
            wave.style.setProperty('--vfx-duration', `${duration}ms`);

            this.scheduleTimer(() => {
              this.destroyElement(wave);
              if (!isMiss && !isImmune) {
                this.renderImpact(descriptor, coords, { multiplier, isMiss, isImmune, reducedMotion });
              } else if (isMiss) {
                this.renderMissDissipate(coords);
              } else if (isImmune) {
                this.renderImmuneDissipate(coords);
              }
              resolve();
            }, duration);
            break;
          }

          case VFX_ARCHETYPES.AURA: {
            const aura = this.createElement('pba-vfx-aura', LAYER_Z_INDEX.IMPACT);
            aura.style.setProperty('--vfx-color-primary', primaryColor);
            aura.style.setProperty('--vfx-color-secondary', secondaryColor);
            aura.style.setProperty('--vfx-color-glow', glowColor);
            aura.style.setProperty('--vfx-target-x', `${coords.toX}px`);
            aura.style.setProperty('--vfx-target-y', `${coords.toY}px`);
            aura.style.setProperty('--vfx-duration', `${duration}ms`);

            this.scheduleTimer(() => {
              this.destroyElement(aura);
              if (!isMiss && !isImmune) {
                this.renderImpact(descriptor, coords, { multiplier, isMiss, isImmune, reducedMotion });
              } else if (isMiss) {
                this.renderMissDissipate(coords);
              } else if (isImmune) {
                this.renderImmuneDissipate(coords);
              }
              resolve();
            }, duration);
            break;
          }

          case VFX_ARCHETYPES.PROJECTILE:
          default: {
            const proj = this.createElement('pba-vfx-projectile', LAYER_Z_INDEX.PROJECTILE);
            proj.style.setProperty('--vfx-color-primary', primaryColor);
            proj.style.setProperty('--vfx-color-secondary', secondaryColor);
            proj.style.setProperty('--vfx-color-glow', glowColor);
            proj.style.setProperty('--vfx-start-x', `${coords.fromX}px`);
            proj.style.setProperty('--vfx-start-y', `${coords.fromY}px`);
            proj.style.setProperty('--vfx-target-x', `${coords.toX}px`);
            proj.style.setProperty('--vfx-target-y', `${coords.toY}px`);
            proj.style.setProperty('--vfx-dir', `${dir}`);
            proj.style.setProperty('--vfx-angle', `${coords.angle}deg`);
            proj.style.setProperty('--vfx-duration', `${duration}ms`);

            this.scheduleTimer(() => {
              this.destroyElement(proj);
              if (!isMiss && !isImmune) {
                this.renderImpact(descriptor, coords, { multiplier, isMiss, isImmune, reducedMotion });
              } else if (isMiss) {
                this.renderMissDissipate(coords);
              } else if (isImmune) {
                this.renderImmuneDissipate(coords);
              }
              resolve();
            }, duration);
            break;
          }
        }
      });
    }

    /**
     * Renderiza o impacto visual no defensor quando o golpe acerta com sucesso.
     * NÃO causa dano nem move HP; apenas expressa o efeito visual.
     *
     * @param {Object} descriptor
     * @param {Object} coords
     * @param {Object} options - { multiplier, reducedMotion }
     */
    renderImpact(descriptor, coords, options = {}) {
      const { multiplier = 1, reducedMotion = false } = options;
      if (reducedMotion) return;

      const impactScale = multiplier >= 4 ? 1.8 : (multiplier >= 2 ? 1.4 : (multiplier <= 0.5 ? 0.75 : 1.0));
      const impactDuration = VFX_DURATIONS.HIT_IMPACT || 250;

      const impactEl = this.createElement('pba-vfx-hit-impact', LAYER_Z_INDEX.IMPACT);
      impactEl.style.setProperty('--vfx-color-primary', descriptor.colors.primary);
      impactEl.style.setProperty('--vfx-color-glow', descriptor.colors.glow);
      impactEl.style.setProperty('--vfx-target-x', `${coords.toX}px`);
      impactEl.style.setProperty('--vfx-target-y', `${coords.toY}px`);
      impactEl.style.setProperty('--vfx-scale', `${impactScale}`);
      impactEl.style.setProperty('--vfx-duration', `${impactDuration}ms`);

      // Geração controlada de partículas (respeitando limite máximo estrito de 12)
      const particleCount = multiplier >= 2
        ? Math.min(VFX_LIMITS.MAX_PARTICLES_PER_EFFECT, 12)
        : Math.min(6, VFX_LIMITS.MAX_PARTICLES_PER_EFFECT);

      const particles = [];
      for (let i = 0; i < particleCount; i++) {
        const p = this.createElement('pba-vfx-particle', LAYER_Z_INDEX.IMPACT);
        const angleRad = (i / particleCount) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
        const speed = 25 + (Math.random() * 25) * impactScale;
        const pX = Math.cos(angleRad) * speed;
        const pY = Math.sin(angleRad) * speed;

        p.style.setProperty('--vfx-origin-x', `${coords.toX}px`);
        p.style.setProperty('--vfx-origin-y', `${coords.toY}px`);
        p.style.setProperty('--vfx-dest-x', `${pX}px`);
        p.style.setProperty('--vfx-dest-y', `${pY}px`);
        p.style.setProperty('--vfx-color-primary', descriptor.colors.primary);
        p.style.setProperty('--vfx-duration', `${impactDuration}ms`);
        particles.push(p);
      }

      this.scheduleTimer(() => {
        this.destroyElement(impactEl);
        for (const p of particles) {
          this.destroyElement(p);
        }
      }, impactDuration);
    }

    /**
     * Dissipação de erro (Miss): o golpe passa direto ou desvanece sem atingir.
     * @param {Object} coords
     */
    renderMissDissipate(coords) {
      const missEl = this.createElement('pba-vfx-dissipate-miss', LAYER_Z_INDEX.PROJECTILE);
      missEl.style.setProperty('--vfx-target-x', `${coords.toX}px`);
      missEl.style.setProperty('--vfx-target-y', `${coords.toY}px`);
      const duration = VFX_DURATIONS.DISSIPATE_MISS || 200;

      this.scheduleTimer(() => {
        this.destroyElement(missEl);
      }, duration);
    }

    /**
     * Dissipação de imunidade (Immune): o golpe se desfaz suavemente no defensor sem choque.
     * @param {Object} coords
     */
    renderImmuneDissipate(coords) {
      const immuneEl = this.createElement('pba-vfx-dissipate-immune', LAYER_Z_INDEX.IMPACT);
      immuneEl.style.setProperty('--vfx-target-x', `${coords.toX}px`);
      immuneEl.style.setProperty('--vfx-target-y', `${coords.toY}px`);
      const duration = VFX_DURATIONS.DISSIPATE_IMMUNE || 200;

      this.scheduleTimer(() => {
        this.destroyElement(immuneEl);
      }, duration);
    }

    /**
     * Limpa imediatamente todos os nós criados e timers pendentes.
     */
    cleanup() {
      for (const timer of this.activeTimers) {
        clearTimeout(timer);
      }
      this.activeTimers.clear();

      for (const el of this.activeElements) {
        try {
          if (typeof el.remove === 'function') {
            el.remove();
          } else if (el.parentNode && typeof el.parentNode.removeChild === 'function') {
            el.parentNode.removeChild(el);
          }
        } catch (e) {}
      }
      this.activeElements.clear();
    }
  }

  const rendererModule = Object.freeze({
    MoveVfxDomRenderer,
    createVfxRenderer: (opts) => new MoveVfxDomRenderer(opts)
  });

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = rendererModule;
  } else if (typeof window !== 'undefined') {
    window.PBABattleVfx = window.PBABattleVfx || {};
    Object.assign(window.PBABattleVfx, rendererModule);
  }
})();
