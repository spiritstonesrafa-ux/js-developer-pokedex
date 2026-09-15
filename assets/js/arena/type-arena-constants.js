/**
 * ====================================================================
 * CONSTANTES DO SISTEMA DE ARENAS POR TIPO: (type-arena-constants.js)
 * ====================================================================
 * Define chaves, tipos ativos (conjunto completo de 18 tipos Pokémon),
 * limites de partículas e configurações visuais das arenas temáticas da
 * Battle Arena (PBA-018B).
 *
 * Suporta Node.js (CommonJS) e Navegadores (window.PBATypeArena).
 */

(function () {
  const ALL_18_TYPES = Object.freeze([
    'normal',
    'fire',
    'water',
    'electric',
    'grass',
    'ice',
    'fighting',
    'poison',
    'ground',
    'flying',
    'psychic',
    'bug',
    'rock',
    'ghost',
    'dragon',
    'dark',
    'steel',
    'fairy'
  ]);

  // Mantém retrocompatibilidade com referências legadas
  const ACTIVE_PROTOTYPE_TYPES = ALL_18_TYPES;
  const ACTIVE_ARENA_TYPES = ALL_18_TYPES;

  const ARENA_THEME_KEYS = Object.freeze({
    DEFAULT: 'default',
    NORMAL: 'normal',
    FIRE: 'fire',
    WATER: 'water',
    ELECTRIC: 'electric',
    GRASS: 'grass',
    ICE: 'ice',
    FIGHTING: 'fighting',
    POISON: 'poison',
    GROUND: 'ground',
    FLYING: 'flying',
    PSYCHIC: 'psychic',
    BUG: 'bug',
    ROCK: 'rock',
    GHOST: 'ghost',
    DRAGON: 'dragon',
    DARK: 'dark',
    STEEL: 'steel',
    FAIRY: 'fairy'
  });

  const ARENA_PARTICLE_LIMITS = Object.freeze({
    NORMAL: 6,
    FIRE: 10,
    WATER: 10,
    ELECTRIC: 6,
    GRASS: 10,
    ICE: 10,
    FIGHTING: 6,
    POISON: 8,
    GROUND: 8,
    FLYING: 8,
    PSYCHIC: 8,
    BUG: 10,
    ROCK: 6,
    GHOST: 8,
    DRAGON: 8,
    DARK: 8,
    STEEL: 6,
    FAIRY: 10,
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
    NORMAL: 'arena-theme-normal',
    FIRE: 'arena-theme-fire',
    WATER: 'arena-theme-water',
    ELECTRIC: 'arena-theme-electric',
    GRASS: 'arena-theme-grass',
    ICE: 'arena-theme-ice',
    FIGHTING: 'arena-theme-fighting',
    POISON: 'arena-theme-poison',
    GROUND: 'arena-theme-ground',
    FLYING: 'arena-theme-flying',
    PSYCHIC: 'arena-theme-psychic',
    BUG: 'arena-theme-bug',
    ROCK: 'arena-theme-rock',
    GHOST: 'arena-theme-ghost',
    DRAGON: 'arena-theme-dragon',
    DARK: 'arena-theme-dark',
    STEEL: 'arena-theme-steel',
    FAIRY: 'arena-theme-fairy',
    TRANSITIONING: 'arena-transitioning'
  });

  const constants = {
    ALL_18_TYPES,
    ACTIVE_PROTOTYPE_TYPES,
    ACTIVE_ARENA_TYPES,
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
