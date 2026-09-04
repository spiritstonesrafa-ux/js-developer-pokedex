/**
 * ====================================================================
 * CONSTANTES DE ANIMAÇÃO DE POKÉMON (pokemon-animation-constants.js)
 * ====================================================================
 * Centraliza o catálogo de animações reutilizáveis, durações conceituais,
 * classes CSS associadas e orientações para Player e Enemy (Fase PBA-009).
 *
 * Princípios Fundamentais:
 * - PRESENTATION ENGINE ≠ ANIMATION IMPLEMENTATION;
 * - Animação do Pokémon (sprites) ≠ Animação do Golpe (PBA-010);
 * - Sem valores mágicos de duração espalhados;
 * - Suporta Node.js (testes) e Browser (window.PBABattlePresentation).
 */

(function () {
  const POKEMON_ANIMATIONS = Object.freeze({
    ENTER: 'ENTER',
    IDLE: 'IDLE',
    ATTACK: 'ATTACK',
    DAMAGE: 'DAMAGE',
    FAINT: 'FAINT',
    SWITCH_OUT: 'SWITCH_OUT',
    SWITCH_IN: 'SWITCH_IN',
    VICTORY: 'VICTORY'
  });

  const ANIMATION_DURATIONS = Object.freeze({
    ENTER: 500,
    IDLE: 1400,
    ATTACK: 350,
    DAMAGE: 300,
    FAINT: 600,
    SWITCH_OUT: 400,
    SWITCH_IN: 500,
    VICTORY: 700,
    REDUCED_MOTION: 0
  });

  const ANIMATION_DIRECTIONS = Object.freeze({
    player: {
      multiplier: 1,
      enterFrom: 'left',
      attackDirection: 1,
      label: 'player'
    },
    enemy: {
      multiplier: -1,
      enterFrom: 'right',
      attackDirection: -1,
      label: 'enemy'
    }
  });

  const ANIMATION_CSS_CLASSES = Object.freeze({
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
  });

  const AnimationConstants = Object.freeze({
    POKEMON_ANIMATIONS,
    ANIMATION_DURATIONS,
    ANIMATION_DIRECTIONS,
    ANIMATION_CSS_CLASSES
  });

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationConstants;
  } else if (typeof window !== 'undefined') {
    window.PBABattlePresentation = window.PBABattlePresentation || {};
    window.PBABattlePresentation.AnimationConstants = AnimationConstants;
  }
})();
