/**
 * ====================================================================
 * CONSTANTES DO SISTEMA DE ARENAS POR TIPO: (type-arena-constants.js)
 * ====================================================================
 * Define chaves, protótipos ativos, limites de partículas e configurações
 * visuais das arenas temáticas da Battle Arena (PBA-018A).
 *
 * Suporta Node.js (CommonJS) e Navegadores (window.PBATypeArena).
 */

(function () {
  const ACTIVE_PROTOTYPE_TYPES = Object.freeze(['fire', 'water', 'electric']);

  const ARENA_THEME_KEYS = Object.freeze({
    DEFAULT: 'default',
    FIRE: 'fire',
    WATER: 'water',
    ELECTRIC: 'electric'
  });

  const ARENA_PARTICLE_LIMITS = Object.freeze({
    FIRE: 10,
    WATER: 10,
    ELECTRIC: 6,
    DEFAULT: 0,
    REDUCED_MOTION: 0
  });

  const ARENA_DOM_IDS = Object.freeze({
    AMBIENT_CONTAINER: 'arenaAmbientContainer',
    BACKDROP: 'arenaBackdrop',
    STAGE: 'battleStage',
    CAMERA_WRAPPER: 'battleCameraWrapper',
    LAYOUT: 'battleArenaLayout'
  });

  const ARENA_CLASSES = Object.freeze({
    BASE: 'arena-theme',
    DEFAULT: 'arena-theme-default',
    FIRE: 'arena-theme-fire',
    WATER: 'arena-theme-water',
    ELECTRIC: 'arena-theme-electric',
    TRANSITIONING: 'arena-transitioning'
  });

  const constants = {
    ACTIVE_PROTOTYPE_TYPES,
    ARENA_THEME_KEYS,
    ARENA_PARTICLE_LIMITS,
    ARENA_DOM_IDS,
    ARENA_CLASSES
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = constants;
  } else if (typeof window !== 'undefined') {
    window.PBATypeArena = window.PBATypeArena || {};
    Object.assign(window.PBATypeArena, constants);
  }
})();
