/**
 * ====================================================================
 * CONTROLADOR DE ANIMAÇÃO DE POKÉMON (pokemon-animation-controller.js)
 * ====================================================================
 * Executa as animações visuais dos sprites de combate (ENTER, IDLE,
 * ATTACK, DAMAGE, FAINT, SWITCH_OUT, SWITCH_IN, VICTORY) (Fase PBA-009).
 *
 * Princípios Fundamentais:
 * - PRESENTATION ENGINE ≠ ANIMATION IMPLEMENTATION;
 * - O Controller NÃO decide regras de combate (dano, tipos, vencedor ou IA);
 * - Política de concorrência por target: CANCEL_PREVIOUS;
 * - Suporte rigoroso a reducedMotion (durações ~0 e estado final imediato);
 * - Gestão limpa do ciclo de vida de IDLE (pausa durante ataques/dano e retoma);
 * - Suporta Node.js (testes automatizados) e Browser (window.PBABattlePresentation).
 */

(function () {
  let constants;
  let registryModule;

  if (typeof module !== 'undefined' && module.exports) {
    constants = require('./pokemon-animation-constants.js');
    registryModule = require('./pokemon-animation-registry.js');
  } else if (typeof window !== 'undefined' && window.PBABattlePresentation) {
    constants = window.PBABattlePresentation.AnimationConstants || {};
    registryModule = window.PBABattlePresentation || {};
  } else {
    constants = {
      POKEMON_ANIMATIONS: {},
      ANIMATION_DURATIONS: { REDUCED_MOTION: 0 },
      ANIMATION_DIRECTIONS: { player: { multiplier: 1 }, enemy: { multiplier: -1 } },
      ANIMATION_CSS_CLASSES: {
        BASE_SPRITE: 'pba-pokemon-sprite',
        ENTER: 'pba-anim-enter',
        IDLE: 'pba-anim-idle',
        ATTACK: 'pba-anim-attack',
        DAMAGE: 'pba-anim-damage',
        FAINT: 'pba-anim-faint',
        SWITCH_OUT: 'pba-anim-switch-out',
        SWITCH_IN: 'pba-anim-switch-in',
        VICTORY: 'pba-anim-victory',
        REDUCED_MOTION: 'pba-reduced-motion',
        HIDDEN: 'pba-sprite-hidden'
      }
    };
  }

  const { POKEMON_ANIMATIONS, ANIMATION_DURATIONS, ANIMATION_CSS_CLASSES, ANIMATION_DIRECTIONS } = constants;

  class PokemonAnimationController {
    /**
     * @param {Object} [options]
     * @param {Object} [options.registry] - Instância de PokemonAnimationRegistry.
     * @param {boolean} [options.reducedMotion=false] - Modo de movimento reduzido.
     * @param {Object} [options.durations] - Sobrescritas opcionais de durações.
     */
    constructor(options = {}) {
      this.reducedMotion = Boolean(options.reducedMotion);
      this.registry = options.registry || (registryModule.createAnimationRegistry ? registryModule.createAnimationRegistry() : null);
      this.durations = Object.assign({}, ANIMATION_DURATIONS, options.durations || {});
      this.activeAnimations = new Map(); // side -> { animation, cancel, promise }
    }

    /**
     * Retorna a duração efetiva para a animação respeitando reducedMotion.
     * @param {string} animationName
     * @returns {number}
     */
    getEffectiveDuration(animationName) {
      if (this.reducedMotion) {
        return ANIMATION_DURATIONS.REDUCED_MOTION || 0;
      }
      return this.durations[animationName] !== undefined ? this.durations[animationName] : 0;
    }

    /**
     * Executa uma animação genérica com ciclo de vida controlado e limpeza automática.
     * @private
     */
    _runAnimation(side, animationName, cssClass, onComplete = null) {
      const target = this.registry.getTarget(side);

      // Política de concorrência por target: CANCEL_PREVIOUS
      if (this.activeAnimations.has(side)) {
        this.cancel(side);
      }

      const duration = this.getEffectiveDuration(animationName);
      const sprite = target.sprite;

      return new Promise((resolve) => {
        let isCancelled = false;
        let timerId = null;

        const cleanup = () => {
          if (timerId !== null) {
            clearTimeout(timerId);
            timerId = null;
          }
          if (sprite && sprite.classList) {
            sprite.classList.remove(cssClass);
          }
          target.currentAnimation = null;
          this.activeAnimations.delete(side);
        };

        const finalize = () => {
          if (isCancelled) return;
          cleanup();
          if (typeof onComplete === 'function') {
            onComplete(target);
          }
          resolve();
        };

        // Aplica classe de animação e orientação
        if (sprite && sprite.classList) {
          if (this.reducedMotion) {
            sprite.classList.add(ANIMATION_CSS_CLASSES.REDUCED_MOTION);
          }
          sprite.classList.add(cssClass);
        }

        target.currentAnimation = animationName;

        const cancelFn = () => {
          isCancelled = true;
          cleanup();
          // Restaura transform e opacidade padrão
          if (sprite && sprite.style) {
            sprite.style.transform = '';
            sprite.style.opacity = '';
          }
          resolve();
        };

        this.activeAnimations.set(side, {
          animation: animationName,
          cancel: cancelFn
        });

        if (duration <= 0) {
          finalize();
        } else {
          timerId = setTimeout(finalize, duration);
        }
      });
    }

    /**
     * Animação de Entrada (ENTER).
     * @param {'player'|'enemy'} side
     * @returns {Promise<void>}
     */
    async playEntrance(side) {
      const target = this.registry.getTarget(side);
      if (target.sprite && target.sprite.classList) {
        target.sprite.classList.remove(ANIMATION_CSS_CLASSES.HIDDEN);
      }
      if (target.sprite && target.sprite.style) {
        target.sprite.style.opacity = '1';
        target.sprite.style.visibility = 'visible';
      }

      await this._runAnimation(side, POKEMON_ANIMATIONS.ENTER, ANIMATION_CSS_CLASSES.ENTER, (t) => {
        if (t.sprite && t.sprite.style) {
          t.sprite.style.transform = '';
          t.sprite.style.opacity = '1';
        }
      });
    }

    /**
     * Inicia a animação de repouso (IDLE) se o sprite estiver visível.
     * @param {'player'|'enemy'} side
     */
    startIdle(side) {
      const target = this.registry.getTarget(side);
      target.isIdle = true;

      const sprite = target.sprite;
      if (sprite && sprite.classList && !this.reducedMotion) {
        sprite.classList.add(ANIMATION_CSS_CLASSES.IDLE);
      }
    }

    /**
     * Interrompe a animação de repouso (IDLE).
     * @param {'player'|'enemy'} side
     */
    stopIdle(side) {
      const target = this.registry.getTarget(side);
      target.isIdle = false;

      const sprite = target.sprite;
      if (sprite && sprite.classList) {
        sprite.classList.remove(ANIMATION_CSS_CLASSES.IDLE);
      }
    }

    /**
     * Verifica se o IDLE está ativo para o combatente.
     * @param {'player'|'enemy'} side
     * @returns {boolean}
     */
    isIdleActive(side) {
      const target = this.registry.getTarget(side);
      return Boolean(target.isIdle);
    }

    /**
     * Animação de Ataque Genérico (ATTACK).
     * Suspende o idle durante o golpe e o restaura ao concluir.
     * @param {'player'|'enemy'} side
     * @returns {Promise<void>}
     */
    async playAttack(side) {
      const target = this.registry.getTarget(side);
      const wasIdle = target.isIdle;

      if (wasIdle) {
        this.stopIdle(side);
      }

      await this._runAnimation(side, POKEMON_ANIMATIONS.ATTACK, ANIMATION_CSS_CLASSES.ATTACK, (t) => {
        if (t.sprite && t.sprite.style) {
          t.sprite.style.transform = '';
        }
        if (wasIdle) {
          this.startIdle(side);
        }
      });
    }

    /**
     * Reação visual a dano (DAMAGE).
     * @param {'player'|'enemy'} side
     * @returns {Promise<void>}
     */
    async playDamageReaction(side) {
      const target = this.registry.getTarget(side);
      const wasIdle = target.isIdle;

      if (wasIdle) {
        this.stopIdle(side);
      }

      await this._runAnimation(side, POKEMON_ANIMATIONS.DAMAGE, ANIMATION_CSS_CLASSES.DAMAGE, (t) => {
        if (t.sprite && t.sprite.style) {
          t.sprite.style.transform = '';
          t.sprite.style.opacity = '1';
        }
        if (wasIdle) {
          this.startIdle(side);
        }
      });
    }

    /**
     * Animação de Nocaute (FAINT).
     * Interrompe o idle permanentemente e oculta o sprite.
     * @param {'player'|'enemy'} side
     * @returns {Promise<void>}
     */
    async playFaint(side) {
      this.stopIdle(side);

      await this._runAnimation(side, POKEMON_ANIMATIONS.FAINT, ANIMATION_CSS_CLASSES.FAINT, (t) => {
        if (t.sprite) {
          if (t.sprite.classList) {
            t.sprite.classList.add(ANIMATION_CSS_CLASSES.HIDDEN);
          }
          if (t.sprite.style) {
            t.sprite.style.opacity = '0';
            t.sprite.style.visibility = 'hidden';
          }
        }
      });
    }

    /**
     * Animação de Saída de Troca (SWITCH_OUT).
     * @param {'player'|'enemy'} side
     * @returns {Promise<void>}
     */
    async playSwitchOut(side) {
      this.stopIdle(side);

      await this._runAnimation(side, POKEMON_ANIMATIONS.SWITCH_OUT, ANIMATION_CSS_CLASSES.SWITCH_OUT, (t) => {
        if (t.sprite) {
          if (t.sprite.classList) {
            t.sprite.classList.add(ANIMATION_CSS_CLASSES.HIDDEN);
          }
          if (t.sprite.style) {
            t.sprite.style.opacity = '0';
          }
        }
      });
    }

    /**
     * Animação de Entrada de Troca (SWITCH_IN).
     * Atualiza dados visuais do Pokémon no Registry, entra no campo e inicia idle.
     * @param {'player'|'enemy'} side
     * @param {Object} [pokemonData]
     * @returns {Promise<void>}
     */
    async playSwitchIn(side, pokemonData = null) {
      const target = this.registry.getTarget(side);

      if (pokemonData) {
        this.registry.updateSprite(side, pokemonData);
      }

      if (target.sprite) {
        if (target.sprite.classList) {
          target.sprite.classList.remove(ANIMATION_CSS_CLASSES.HIDDEN);
        }
        if (target.sprite.style) {
          target.sprite.style.opacity = '1';
          target.sprite.style.visibility = 'visible';
        }
      }

      await this._runAnimation(side, POKEMON_ANIMATIONS.SWITCH_IN, ANIMATION_CSS_CLASSES.SWITCH_IN, (t) => {
        if (t.sprite && t.sprite.style) {
          t.sprite.style.transform = '';
          t.sprite.style.opacity = '1';
        }
        this.startIdle(side);
      });
    }

    /**
     * Animação de Vitória (VICTORY) do combatente ativo vencedor.
     * @param {'player'|'enemy'} side
     * @returns {Promise<void>}
     */
    async playVictory(side) {
      const target = this.registry.getTarget(side);
      const wasIdle = target.isIdle;

      if (wasIdle) {
        this.stopIdle(side);
      }

      await this._runAnimation(side, POKEMON_ANIMATIONS.VICTORY, ANIMATION_CSS_CLASSES.VICTORY, (t) => {
        if (t.sprite && t.sprite.style) {
          t.sprite.style.transform = '';
        }
        if (wasIdle) {
          this.startIdle(side);
        }
      });
    }

    /**
     * Cancela a animação em execução para o lado especificado ou para todos os lados.
     * @param {'player'|'enemy'} [side]
     */
    cancel(side = null) {
      if (side) {
        const active = this.activeAnimations.get(side);
        if (active && typeof active.cancel === 'function') {
          active.cancel();
        }
      } else {
        for (const [s, active] of this.activeAnimations.entries()) {
          if (active && typeof active.cancel === 'function') {
            active.cancel();
          }
        }
      }
    }

    /**
     * Reseta todos os alvos registrados para o estado base limpo e desativa idle.
     */
    reset() {
      this.cancel();

      for (const side of ['player', 'enemy']) {
        if (this.registry.hasTarget(side)) {
          const target = this.registry.getTarget(side);
          target.isIdle = false;
          target.currentAnimation = null;

          const sprite = target.sprite;
          if (sprite) {
            if (sprite.classList) {
              sprite.classList.remove(
                ANIMATION_CSS_CLASSES.ENTER,
                ANIMATION_CSS_CLASSES.IDLE,
                ANIMATION_CSS_CLASSES.ATTACK,
                ANIMATION_CSS_CLASSES.DAMAGE,
                ANIMATION_CSS_CLASSES.FAINT,
                ANIMATION_CSS_CLASSES.SWITCH_OUT,
                ANIMATION_CSS_CLASSES.SWITCH_IN,
                ANIMATION_CSS_CLASSES.VICTORY,
                ANIMATION_CSS_CLASSES.HIDDEN
              );
            }
            if (sprite.style) {
              sprite.style.transform = '';
              sprite.style.opacity = '1';
              sprite.style.visibility = 'visible';
            }
          }
        }
      }
    }
  }

  const controllerModule = Object.freeze({
    PokemonAnimationController,
    createAnimationController: (opts) => new PokemonAnimationController(opts)
  });

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = controllerModule;
  } else if (typeof window !== 'undefined') {
    window.PBABattlePresentation = window.PBABattlePresentation || {};
    Object.assign(window.PBABattlePresentation, controllerModule);
  }
})();
