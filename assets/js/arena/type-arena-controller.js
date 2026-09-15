/**
 * ====================================================================
 * CONTROLADOR DE AMBIENTE DA ARENA: (type-arena-controller.js)
 * ====================================================================
 * Gerencia o ciclo de vida (mount, update, unmount/cleanup) dos efeitos
 * visuais de ambiente e partículas das arenas temáticas (PBA-018B).
 *
 * Princípios Fundamentais:
 * - Decorações puramente visuais, sem interação com o cursor (pointer-events: none);
 * - Não afeta layout (posicionamento absoluto, aceleração por GPU);
 * - Respeito estrito a prefers-reduced-motion (0 partículas, loops estáticos);
 * - Ciclo de vida determinístico com garantia de ZERO leaks de memória ou DOM;
 * - Suporta Node.js (headless seguro) e Navegadores (window.PBATypeArena).
 */

(function () {
  let constants;
  if (typeof module !== 'undefined' && module.exports) {
    constants = require('./type-arena-constants.js');
  } else if (typeof window !== 'undefined' && window.PBATypeArena) {
    constants = window.PBATypeArena;
  } else {
    constants = {
      ARENA_PARTICLE_LIMITS: {
        NORMAL: 6, FIRE: 10, WATER: 10, ELECTRIC: 6, GRASS: 10, ICE: 10,
        FIGHTING: 6, POISON: 8, GROUND: 8, FLYING: 8, PSYCHIC: 8, BUG: 10,
        ROCK: 6, GHOST: 8, DRAGON: 8, DARK: 8, STEEL: 6, FAIRY: 10,
        DEFAULT: 0, REDUCED_MOTION: 0
      },
      ARENA_DOM_IDS: { AMBIENT_CONTAINER: 'arenaAmbientContainer' }
    };
  }

  const {
    ARENA_PARTICLE_LIMITS,
    ARENA_DOM_IDS
  } = constants;

  class TypeArenaController {
    constructor() {
      this.currentTheme = null;
      this.currentStage = null;
      this.activeElements = new Set();
      this.activeTimers = new Set();
      this.isMounted = false;
    }

    /**
     * Verifica se o usuário prefere redução de movimento.
     * @returns {boolean}
     */
    isReducedMotion() {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return false;
      }
      try {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      } catch {
        return false;
      }
    }

    /**
     * Monta o tema e as partículas decorativas no palco da batalha.
     * @param {HTMLElement} stageElement - Elemento do palco (.battle-stage).
     * @param {Object} theme - Objeto de configuração da arena (TypeArenaRegistry).
     * @param {Object} [options]
     * @param {boolean} [options.reducedMotion] - Sobrescrita para testes.
     * @returns {boolean} True se montado com sucesso.
     */
    mount(stageElement, theme, options = {}) {
      // Limpeza estrita prévia para impedir vazamentos entre batalhas
      this.cleanup();

      if (!stageElement || !theme || typeof stageElement !== 'object') {
        return false;
      }

      this.currentStage = stageElement;
      this.currentTheme = theme;
      this.isMounted = true;

      // Localiza ou cria o contêiner de partículas de ambiente
      let ambientContainer = null;
      if (typeof stageElement.querySelector === 'function') {
        ambientContainer = stageElement.querySelector(`#${ARENA_DOM_IDS.AMBIENT_CONTAINER}`) ||
                           stageElement.querySelector('.arena-ambient-container');
      }

      const reducedMotion = options.reducedMotion !== undefined
        ? Boolean(options.reducedMotion)
        : this.isReducedMotion();

      if (!ambientContainer) return true;

      // Se reduced motion ativo ou tema sem partículas, garante contêiner limpo e encerra
      if (reducedMotion || !theme.particleType || theme.particleCount <= 0) {
        if (typeof ambientContainer.replaceChildren === 'function') {
          ambientContainer.replaceChildren();
        } else {
          ambientContainer.innerHTML = '';
        }
        return true;
      }

      // Criação de partículas leves e seguras
      this.spawnParticles(ambientContainer, theme);
      return true;
    }

    /**
     * Cria nós de partículas no contêiner com atributos aleatórios para variação natural.
     * @private
     */
    spawnParticles(container, theme) {
      if (typeof document === 'undefined' || !container || typeof container.appendChild !== 'function') {
        return;
      }

      const maxLimit = (theme.type && ARENA_PARTICLE_LIMITS[theme.type.toUpperCase()]) || 10;
      const count = Math.min(theme.particleCount, maxLimit);
      const fragment = typeof document.createDocumentFragment === 'function'
        ? document.createDocumentFragment()
        : null;

      for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = `arena-particle arena-particle--${theme.particleType}`;
        particle.setAttribute('aria-hidden', 'true');

        // Variações determinísticas de posição e tempo por CSS custom properties
        const leftPct = Math.round(5 + (i * (90 / count)) + ((i % 3) * 2));
        const delayMs = Math.round((i * 450) % 3200);
        const durationMs = 2800 + ((i % 4) * 600);

        let sizePx = 4 + (i % 3);
        if (theme.particleType === 'embers' || theme.particleType === 'sparks' || theme.particleType === 'pebbles') {
          sizePx = 3 + (i % 3);
        } else if (theme.particleType === 'bubbles' || theme.particleType === 'leaves') {
          sizePx = 5 + (i % 4);
        } else if (theme.particleType === 'snow' || theme.particleType === 'sparkles') {
          sizePx = 4 + (i % 3);
        }

        particle.style.setProperty('--particle-left', `${leftPct}%`);
        particle.style.setProperty('--particle-delay', `${delayMs}ms`);
        particle.style.setProperty('--particle-duration', `${durationMs}ms`);
        particle.style.setProperty('--particle-size', `${sizePx}px`);

        if (fragment) {
          fragment.appendChild(particle);
        } else {
          container.appendChild(particle);
        }
        this.activeElements.add(particle);
      }

      if (fragment) {
        container.appendChild(fragment);
      }
    }

    /**
     * Desmonta e limpa 100% dos elementos e referências de ambiente.
     * Chamado ao sair da batalha, trocar de arena ou desmontar a view.
     */
    cleanup() {
      // Cancela todos os timers pendentes
      for (const timerId of this.activeTimers) {
        clearTimeout(timerId);
      }
      this.activeTimers.clear();

      // Remove nós do DOM registrados
      for (const element of this.activeElements) {
        if (element && typeof element.remove === 'function') {
          element.remove();
        }
      }
      this.activeElements.clear();

      // Esvazia contêiner de ambiente no palco se ainda acessível
      if (this.currentStage && typeof this.currentStage.querySelector === 'function') {
        const ambientContainer = this.currentStage.querySelector(`#${ARENA_DOM_IDS.AMBIENT_CONTAINER}`) ||
                                 this.currentStage.querySelector('.arena-ambient-container');
        if (ambientContainer) {
          if (typeof ambientContainer.replaceChildren === 'function') {
            ambientContainer.replaceChildren();
          } else {
            ambientContainer.innerHTML = '';
          }
        }
      }

      this.currentTheme = null;
      this.currentStage = null;
      this.isMounted = false;
    }
  }

  const exportsObj = {
    TypeArenaController,
    createTypeArenaController: () => new TypeArenaController()
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exportsObj;
  } else if (typeof window !== 'undefined') {
    window.PBATypeArena = window.PBATypeArena || {};
    Object.assign(window.PBATypeArena, exportsObj);
  }
})();
