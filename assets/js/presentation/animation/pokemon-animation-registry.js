/**
 * ====================================================================
 * REGISTRO DE ALVOS DE ANIMAÇÃO: (pokemon-animation-registry.js)
 * ====================================================================
 * Mantém e resolve os elementos DOM dos combatentes (player e enemy),
 * referências de imagem e tratamento de fallback (Fase PBA-009).
 *
 * Princípios Fundamentais:
 * - O Registry NÃO faz chamadas fetch ou rede;
 * - Associa elementos DOM ao side ('player' ou 'enemy');
 * - Garante fallback de sprites quebrados para prevenir imagens quebradas;
 * - Suporta Node.js (testes) e Browser (window.PBABattlePresentation).
 */

(function () {
  let constants;

  if (typeof module !== 'undefined' && module.exports) {
    constants = require('./pokemon-animation-constants.js');
  } else if (typeof window !== 'undefined' && window.PBABattlePresentation) {
    constants = window.PBABattlePresentation.AnimationConstants || {};
  } else {
    constants = {
      ANIMATION_CSS_CLASSES: {
        BASE_SPRITE: 'pba-pokemon-sprite',
        HIDDEN: 'pba-sprite-hidden'
      }
    };
  }

  const { ANIMATION_CSS_CLASSES } = constants;

  class PokemonAnimationRegistry {
    constructor() {
      this.targets = new Map();
    }

    /**
     * Registra um combatente com seus elementos DOM associados.
     * @param {'player'|'enemy'} side - Lado do combate.
     * @param {Object} elements - Elementos e metadados { container, sprite, metadata }.
     * @returns {Object} Target registrado.
     */
    register(side, elements = {}) {
      if (side !== 'player' && side !== 'enemy') {
        throw new Error(`INVALID_TARGET_SIDE: Lado inválido "${side}". Deve ser 'player' ou 'enemy'.`);
      }

      if (!elements || typeof elements !== 'object') {
        throw new Error(`INVALID_TARGET_ELEMENTS: elements deve ser um objeto para o lado "${side}".`);
      }

      const sprite = elements.sprite || null;
      const container = elements.container || (sprite ? sprite.parentElement : null);
      const metadata = elements.metadata ? { ...elements.metadata } : {};

      // Configura classes base e atributos se estiver em ambiente DOM
      if (sprite && sprite.classList) {
        sprite.classList.add(ANIMATION_CSS_CLASSES.BASE_SPRITE);
      }

      if (container && container.setAttribute) {
        container.setAttribute('data-battle-side', side);
      }

      // Configuração de fallback seguro de imagem (evita loop infinito com onerror = null)
      if (sprite && typeof sprite.addEventListener === 'function') {
        const fallbackUrl = metadata.fallbackUrl || metadata.artworkUrl || metadata.photo || metadata.spriteUrl || '';
        if (fallbackUrl) {
          sprite.onerror = () => {
            if (sprite.src !== fallbackUrl) {
              sprite.src = fallbackUrl;
            } else {
              sprite.onerror = null;
            }
          };
        }
      }

      const target = {
        side,
        container,
        sprite,
        metadata,
        isIdle: false,
        currentAnimation: null,
        activeTimer: null
      };

      this.targets.set(side, target);
      return target;
    }

    /**
     * Retorna o alvo registrado para o lado especificado.
     * @param {'player'|'enemy'} side
     * @returns {Object}
     * @throws {Error} Se o lado não estiver registrado.
     */
    getTarget(side) {
      const target = this.targets.get(side);
      if (!target) {
        throw new Error(`TARGET_NOT_FOUND: Alvo de animação para o lado "${side}" não foi registrado.`);
      }
      return target;
    }

    /**
     * Verifica se existe alvo registrado para o lado.
     * @param {'player'|'enemy'} side
     * @returns {boolean}
     */
    hasTarget(side) {
      return this.targets.has(side);
    }

    /**
     * Atualiza as informações visuais e fonte de sprite do alvo.
     * @param {'player'|'enemy'} side
     * @param {Object} pokemonData - Dados do Pokémon { id, name, spriteUrl, animatedUrl, fallbackUrl }.
     */
    updateSprite(side, pokemonData = {}) {
      const target = this.getTarget(side);
      target.metadata = Object.assign({}, target.metadata, pokemonData);

      const sprite = target.sprite;
      if (!sprite) return;

      const primaryUrl = pokemonData.animatedUrl || pokemonData.animatedPhoto || pokemonData.spriteUrl || pokemonData.photo || '';
      const fallbackUrl = pokemonData.fallbackUrl || pokemonData.artworkUrl || pokemonData.photo || pokemonData.spriteUrl || '';

      if (sprite.setAttribute) {
        sprite.setAttribute('alt', pokemonData.name ? String(pokemonData.name) : `${side} Pokémon`);
      }

      if (primaryUrl) {
        sprite.src = primaryUrl;
      }

      if (fallbackUrl && typeof sprite.addEventListener === 'function') {
        sprite.onerror = () => {
          if (sprite.src !== fallbackUrl) {
            sprite.src = fallbackUrl;
          } else {
            sprite.onerror = null;
          }
        };
      }
    }

    /**
     * Remove todos os alvos registrados.
     */
    clear() {
      this.targets.clear();
    }
  }

  const registryModule = Object.freeze({
    PokemonAnimationRegistry,
    createAnimationRegistry: () => new PokemonAnimationRegistry()
  });

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = registryModule;
  } else if (typeof window !== 'undefined') {
    window.PBABattlePresentation = window.PBABattlePresentation || {};
    Object.assign(window.PBABattlePresentation, registryModule);
  }
})();
