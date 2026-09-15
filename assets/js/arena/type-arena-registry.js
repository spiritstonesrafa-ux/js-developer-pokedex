/**
 * ====================================================================
 * REGISTRY CENTRAL DE ARENAS POR TIPO: (type-arena-registry.js)
 * ====================================================================
 * Mantém o catálogo de temas e provê resolução determinística com fallback
 * obrigatório para todas as batalhas da Battle Arena (PBA-018B).
 *
 * Suporta Node.js (CommonJS) e Navegadores (window.PBATypeArena).
 */

(function () {
  let constants;
  if (typeof module !== 'undefined' && module.exports) {
    constants = require('./type-arena-constants.js');
  } else if (typeof window !== 'undefined' && window.PBATypeArena) {
    constants = window.PBATypeArena;
  } else {
    constants = {
      ALL_18_TYPES: [
        'normal', 'fire', 'water', 'electric', 'grass', 'ice',
        'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
        'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
      ],
      ACTIVE_PROTOTYPE_TYPES: [
        'normal', 'fire', 'water', 'electric', 'grass', 'ice',
        'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
        'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
      ],
      ACTIVE_ARENA_TYPES: [
        'normal', 'fire', 'water', 'electric', 'grass', 'ice',
        'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
        'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
      ],
      ARENA_THEME_KEYS: {
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
      },
      ARENA_PARTICLE_LIMITS: {
        NORMAL: 6, FIRE: 10, WATER: 10, ELECTRIC: 6, GRASS: 10, ICE: 10,
        FIGHTING: 6, POISON: 8, GROUND: 8, FLYING: 8, PSYCHIC: 8, BUG: 10,
        ROCK: 6, GHOST: 8, DRAGON: 8, DARK: 8, STEEL: 6, FAIRY: 10,
        DEFAULT: 0, REDUCED_MOTION: 0
      },
      ARENA_CLASSES: {
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
        FAIRY: 'arena-theme-fairy'
      }
    };
  }

  const {
    ALL_18_TYPES,
    ARENA_THEME_KEYS,
    ARENA_PARTICLE_LIMITS,
    ARENA_CLASSES
  } = constants;

  const DEFAULT_ARENA_THEME = Object.freeze({
    key: ARENA_THEME_KEYS.DEFAULT,
    name: 'Arena Padrão',
    type: 'default',
    themeClass: ARENA_CLASSES.DEFAULT,
    backgroundSrc: null,
    baseGradient: 'radial-gradient(circle at 50% 30%, #1e293b 0%, #0f172a 70%, #020617 100%)',
    accentColor: '#38bdf8',
    accentGlow: 'rgba(56, 189, 248, 0.25)',
    platformGlow: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.15) 0%, rgba(15, 23, 42, 0.6) 70%, transparent 100%)',
    particleType: null,
    particleCount: ARENA_PARTICLE_LIMITS.DEFAULT,
    reducedMotionBehavior: 'static'
  });

  const ARENA_CATALOG = Object.freeze({
    [ARENA_THEME_KEYS.DEFAULT]: DEFAULT_ARENA_THEME,

    [ARENA_THEME_KEYS.NORMAL]: Object.freeze({
      key: ARENA_THEME_KEYS.NORMAL,
      name: 'Estádio da Liga',
      type: 'normal',
      themeClass: ARENA_CLASSES.NORMAL,
      backgroundSrc: 'assets/images/arenas/arena-normal.webp',
      baseGradient: 'radial-gradient(circle at 50% 30%, #1e293b 0%, #111827 65%, #030712 100%)',
      accentColor: '#94a3b8',
      accentGlow: 'rgba(148, 163, 184, 0.30)',
      platformGlow: 'radial-gradient(ellipse at center, rgba(148, 163, 184, 0.25) 0%, rgba(17, 24, 39, 0.7) 70%, transparent 100%)',
      particleType: 'stadium',
      particleCount: ARENA_PARTICLE_LIMITS.NORMAL,
      reducedMotionBehavior: 'static'
    }),

    [ARENA_THEME_KEYS.FIRE]: Object.freeze({
      key: ARENA_THEME_KEYS.FIRE,
      name: 'Caldeira Vulcânica',
      type: 'fire',
      themeClass: ARENA_CLASSES.FIRE,
      backgroundSrc: 'assets/images/arenas/arena-fire.webp',
      baseGradient: 'radial-gradient(circle at 50% 30%, #3b1408 0%, #1c0803 65%, #0d0402 100%)',
      accentColor: '#f97316',
      accentGlow: 'rgba(249, 115, 22, 0.35)',
      platformGlow: 'radial-gradient(ellipse at center, rgba(249, 115, 22, 0.30) 0%, rgba(30, 10, 5, 0.7) 70%, transparent 100%)',
      particleType: 'embers',
      particleCount: ARENA_PARTICLE_LIMITS.FIRE,
      reducedMotionBehavior: 'static'
    }),

    [ARENA_THEME_KEYS.WATER]: Object.freeze({
      key: ARENA_THEME_KEYS.WATER,
      name: 'Santuário das Marés',
      type: 'water',
      themeClass: ARENA_CLASSES.WATER,
      backgroundSrc: 'assets/images/arenas/arena-water.webp',
      baseGradient: 'radial-gradient(circle at 50% 30%, #062038 0%, #041424 65%, #020912 100%)',
      accentColor: '#00b4d8',
      accentGlow: 'rgba(0, 180, 216, 0.35)',
      platformGlow: 'radial-gradient(ellipse at center, rgba(0, 180, 216, 0.30) 0%, rgba(4, 20, 36, 0.7) 70%, transparent 100%)',
      particleType: 'bubbles',
      particleCount: ARENA_PARTICLE_LIMITS.WATER,
      reducedMotionBehavior: 'static'
    }),

    [ARENA_THEME_KEYS.ELECTRIC]: Object.freeze({
      key: ARENA_THEME_KEYS.ELECTRIC,
      name: 'Cúpula Tecnológica',
      type: 'electric',
      themeClass: ARENA_CLASSES.ELECTRIC,
      backgroundSrc: 'assets/images/arenas/arena-electric.webp',
      baseGradient: 'radial-gradient(circle at 50% 30%, #151d32 0%, #0c1220 65%, #060910 100%)',
      accentColor: '#facc15',
      accentGlow: 'rgba(250, 204, 21, 0.32)',
      platformGlow: 'radial-gradient(ellipse at center, rgba(250, 204, 21, 0.28) 0%, rgba(12, 18, 32, 0.7) 70%, transparent 100%)',
      particleType: 'pulses',
      particleCount: ARENA_PARTICLE_LIMITS.ELECTRIC,
      reducedMotionBehavior: 'static'
    }),

    [ARENA_THEME_KEYS.GRASS]: Object.freeze({
      key: ARENA_THEME_KEYS.GRASS,
      name: 'Bosque Ancestral',
      type: 'grass',
      themeClass: ARENA_CLASSES.GRASS,
      backgroundSrc: 'assets/images/arenas/arena-grass.webp',
      baseGradient: 'radial-gradient(circle at 50% 30%, #062d17 0%, #03180c 65%, #010a05 100%)',
      accentColor: '#22c55e',
      accentGlow: 'rgba(34, 197, 94, 0.32)',
      platformGlow: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.28) 0%, rgba(6, 45, 23, 0.7) 70%, transparent 100%)',
      particleType: 'leaves',
      particleCount: ARENA_PARTICLE_LIMITS.GRASS,
      reducedMotionBehavior: 'static'
    }),

    [ARENA_THEME_KEYS.ICE]: Object.freeze({
      key: ARENA_THEME_KEYS.ICE,
      name: 'Caverna Glacial',
      type: 'ice',
      themeClass: ARENA_CLASSES.ICE,
      backgroundSrc: 'assets/images/arenas/arena-ice.webp',
      baseGradient: 'radial-gradient(circle at 50% 30%, #0e2f44 0%, #071a26 65%, #030d14 100%)',
      accentColor: '#38bdf8',
      accentGlow: 'rgba(56, 189, 248, 0.32)',
      platformGlow: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.28) 0%, rgba(14, 47, 68, 0.7) 70%, transparent 100%)',
      particleType: 'snow',
      particleCount: ARENA_PARTICLE_LIMITS.ICE,
      reducedMotionBehavior: 'static'
    }),

    [ARENA_THEME_KEYS.FIGHTING]: Object.freeze({
      key: ARENA_THEME_KEYS.FIGHTING,
      name: 'Dojo Marcial',
      type: 'fighting',
      themeClass: ARENA_CLASSES.FIGHTING,
      backgroundSrc: 'assets/images/arenas/arena-fighting.webp',
      baseGradient: 'radial-gradient(circle at 50% 30%, #2e140d 0%, #1a0b07 65%, #0d0503 100%)',
      accentColor: '#fb923c',
      accentGlow: 'rgba(251, 146, 60, 0.30)',
      platformGlow: 'radial-gradient(ellipse at center, rgba(251, 146, 60, 0.25) 0%, rgba(46, 20, 13, 0.7) 70%, transparent 100%)',
      particleType: 'focus',
      particleCount: ARENA_PARTICLE_LIMITS.FIGHTING,
      reducedMotionBehavior: 'static'
    }),

    [ARENA_THEME_KEYS.POISON]: Object.freeze({
      key: ARENA_THEME_KEYS.POISON,
      name: 'Complexo Químico',
      type: 'poison',
      themeClass: ARENA_CLASSES.POISON,
      backgroundSrc: 'assets/images/arenas/arena-poison.webp',
      baseGradient: 'radial-gradient(circle at 50% 30%, #200f38 0%, #120822 65%, #090312 100%)',
      accentColor: '#a855f7',
      accentGlow: 'rgba(168, 85, 247, 0.32)',
      platformGlow: 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.28) 0%, rgba(32, 15, 56, 0.7) 70%, transparent 100%)',
      particleType: 'toxic',
      particleCount: ARENA_PARTICLE_LIMITS.POISON,
      reducedMotionBehavior: 'static'
    }),

    [ARENA_THEME_KEYS.GROUND]: Object.freeze({
      key: ARENA_THEME_KEYS.GROUND,
      name: 'Cânion Terracota',
      type: 'ground',
      themeClass: ARENA_CLASSES.GROUND,
      backgroundSrc: 'assets/images/arenas/arena-ground.webp',
      baseGradient: 'radial-gradient(circle at 50% 30%, #361c0d 0%, #1e0e06 65%, #0f0703 100%)',
      accentColor: '#d97706',
      accentGlow: 'rgba(217, 119, 6, 0.30)',
      platformGlow: 'radial-gradient(ellipse at center, rgba(217, 119, 6, 0.25) 0%, rgba(54, 28, 13, 0.7) 70%, transparent 100%)',
      particleType: 'dust',
      particleCount: ARENA_PARTICLE_LIMITS.GROUND,
      reducedMotionBehavior: 'static'
    }),

    [ARENA_THEME_KEYS.FLYING]: Object.freeze({
      key: ARENA_THEME_KEYS.FLYING,
      name: 'Templo dos Céus',
      type: 'flying',
      themeClass: ARENA_CLASSES.FLYING,
      backgroundSrc: 'assets/images/arenas/arena-flying.webp',
      baseGradient: 'radial-gradient(circle at 50% 30%, #102a45 0%, #081726 65%, #040c14 100%)',
      accentColor: '#60a5fa',
      accentGlow: 'rgba(96, 165, 250, 0.32)',
      platformGlow: 'radial-gradient(ellipse at center, rgba(96, 165, 250, 0.28) 0%, rgba(16, 42, 69, 0.7) 70%, transparent 100%)',
      particleType: 'wind',
      particleCount: ARENA_PARTICLE_LIMITS.FLYING,
      reducedMotionBehavior: 'static'
    }),

    [ARENA_THEME_KEYS.PSYCHIC]: Object.freeze({
      key: ARENA_THEME_KEYS.PSYCHIC,
      name: 'Observatório Astral',
      type: 'psychic',
      themeClass: ARENA_CLASSES.PSYCHIC,
      backgroundSrc: 'assets/images/arenas/arena-psychic.webp',
      baseGradient: 'radial-gradient(circle at 50% 30%, #270e3c 0%, #160724 65%, #0b0312 100%)',
      accentColor: '#e879f9',
      accentGlow: 'rgba(232, 121, 249, 0.32)',
      platformGlow: 'radial-gradient(ellipse at center, rgba(232, 121, 249, 0.28) 0%, rgba(39, 14, 60, 0.7) 70%, transparent 100%)',
      particleType: 'astral',
      particleCount: ARENA_PARTICLE_LIMITS.PSYCHIC,
      reducedMotionBehavior: 'static'
    }),

    [ARENA_THEME_KEYS.BUG]: Object.freeze({
      key: ARENA_THEME_KEYS.BUG,
      name: 'Bosque dos Esporos',
      type: 'bug',
      themeClass: ARENA_CLASSES.BUG,
      backgroundSrc: 'assets/images/arenas/arena-bug.webp',
      baseGradient: 'radial-gradient(circle at 50% 30%, #1a2908 0%, #0d1603 65%, #060b01 100%)',
      accentColor: '#84cc16',
      accentGlow: 'rgba(132, 204, 22, 0.32)',
      platformGlow: 'radial-gradient(ellipse at center, rgba(132, 204, 22, 0.28) 0%, rgba(26, 41, 8, 0.7) 70%, transparent 100%)',
      particleType: 'spores',
      particleCount: ARENA_PARTICLE_LIMITS.BUG,
      reducedMotionBehavior: 'static'
    }),

    [ARENA_THEME_KEYS.ROCK]: Object.freeze({
      key: ARENA_THEME_KEYS.ROCK,
      name: 'Pedreira Monolítica',
      type: 'rock',
      themeClass: ARENA_CLASSES.ROCK,
      backgroundSrc: 'assets/images/arenas/arena-rock.webp',
      baseGradient: 'radial-gradient(circle at 50% 30%, #29241e 0%, #171410 65%, #0b0908 100%)',
      accentColor: '#a1a1aa',
      accentGlow: 'rgba(161, 161, 170, 0.30)',
      platformGlow: 'radial-gradient(ellipse at center, rgba(161, 161, 170, 0.25) 0%, rgba(41, 36, 30, 0.7) 70%, transparent 100%)',
      particleType: 'pebbles',
      particleCount: ARENA_PARTICLE_LIMITS.ROCK,
      reducedMotionBehavior: 'static'
    }),

    [ARENA_THEME_KEYS.GHOST]: Object.freeze({
      key: ARENA_THEME_KEYS.GHOST,
      name: 'Mausoléu Espectral',
      type: 'ghost',
      themeClass: ARENA_CLASSES.GHOST,
      backgroundSrc: 'assets/images/arenas/arena-ghost.webp',
      baseGradient: 'radial-gradient(circle at 50% 30%, #1e1233 0%, #10091e 65%, #08040f 100%)',
      accentColor: '#c084fc',
      accentGlow: 'rgba(192, 132, 252, 0.32)',
      platformGlow: 'radial-gradient(ellipse at center, rgba(192, 132, 252, 0.28) 0%, rgba(30, 18, 51, 0.7) 70%, transparent 100%)',
      particleType: 'wisps',
      particleCount: ARENA_PARTICLE_LIMITS.GHOST,
      reducedMotionBehavior: 'static'
    }),

    [ARENA_THEME_KEYS.DRAGON]: Object.freeze({
      key: ARENA_THEME_KEYS.DRAGON,
      name: 'Santuário Dracônico',
      type: 'dragon',
      themeClass: ARENA_CLASSES.DRAGON,
      backgroundSrc: 'assets/images/arenas/arena-dragon.webp',
      baseGradient: 'radial-gradient(circle at 50% 30%, #2b0b14 0%, #17050a 65%, #0c0205 100%)',
      accentColor: '#f59e0b',
      accentGlow: 'rgba(245, 158, 11, 0.35)',
      platformGlow: 'radial-gradient(ellipse at center, rgba(245, 158, 11, 0.30) 0%, rgba(43, 11, 20, 0.7) 70%, transparent 100%)',
      particleType: 'draconic',
      particleCount: ARENA_PARTICLE_LIMITS.DRAGON,
      reducedMotionBehavior: 'static'
    }),

    [ARENA_THEME_KEYS.DARK]: Object.freeze({
      key: ARENA_THEME_KEYS.DARK,
      name: 'Ruínas do Eclipse',
      type: 'dark',
      themeClass: ARENA_CLASSES.DARK,
      backgroundSrc: 'assets/images/arenas/arena-dark.webp',
      baseGradient: 'radial-gradient(circle at 50% 30%, #150d24 0%, #0b0614 65%, #05020a 100%)',
      accentColor: '#a855f7',
      accentGlow: 'rgba(168, 85, 247, 0.30)',
      platformGlow: 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.25) 0%, rgba(21, 13, 36, 0.7) 70%, transparent 100%)',
      particleType: 'shadows',
      particleCount: ARENA_PARTICLE_LIMITS.DARK,
      reducedMotionBehavior: 'static'
    }),

    [ARENA_THEME_KEYS.STEEL]: Object.freeze({
      key: ARENA_THEME_KEYS.STEEL,
      name: 'Fortaleza Siderúrgica',
      type: 'steel',
      themeClass: ARENA_CLASSES.STEEL,
      backgroundSrc: 'assets/images/arenas/arena-steel.webp',
      baseGradient: 'radial-gradient(circle at 50% 30%, #1e293b 0%, #0f172a 65%, #070b14 100%)',
      accentColor: '#cbd5e1',
      accentGlow: 'rgba(203, 213, 225, 0.30)',
      platformGlow: 'radial-gradient(ellipse at center, rgba(203, 213, 225, 0.25) 0%, rgba(30, 41, 59, 0.7) 70%, transparent 100%)',
      particleType: 'sparks',
      particleCount: ARENA_PARTICLE_LIMITS.STEEL,
      reducedMotionBehavior: 'static'
    }),

    [ARENA_THEME_KEYS.FAIRY]: Object.freeze({
      key: ARENA_THEME_KEYS.FAIRY,
      name: 'Clareira Encantada',
      type: 'fairy',
      themeClass: ARENA_CLASSES.FAIRY,
      backgroundSrc: 'assets/images/arenas/arena-fairy.webp',
      baseGradient: 'radial-gradient(circle at 50% 30%, #2f143a 0%, #1a0a21 65%, #0e0512 100%)',
      accentColor: '#f472b6',
      accentGlow: 'rgba(244, 114, 182, 0.35)',
      platformGlow: 'radial-gradient(ellipse at center, rgba(244, 114, 182, 0.30) 0%, rgba(47, 20, 58, 0.7) 70%, transparent 100%)',
      particleType: 'sparkles',
      particleCount: ARENA_PARTICLE_LIMITS.FAIRY,
      reducedMotionBehavior: 'static'
    })
  });

  class TypeArenaRegistry {
    /**
     * Retorna o catálogo imutável de todas as arenas cadastradas.
     * @returns {Object}
     */
    static getCatalog() {
      return ARENA_CATALOG;
    }

    /**
     * Obtém uma arena pelo nome do tipo/chave diretamente.
     * @param {string} typeKey
     * @returns {Object}
     */
    static getTheme(typeKey) {
      if (!typeKey || typeof typeKey !== 'string') return DEFAULT_ARENA_THEME;
      const normalized = typeKey.trim().toLowerCase();
      if (ALL_18_TYPES.includes(normalized) && ARENA_CATALOG[normalized]) {
        return ARENA_CATALOG[normalized];
      }
      return DEFAULT_ARENA_THEME;
    }

    /**
     * Resolve a arena a partir do contexto/metadados da batalha.
     * Regras:
     * 1. Apenas batalhas com mode === 'CAMPAIGN' e kind === 'MASTER' recebem arena temática.
     * 2. Quick Battle -> DEFAULT_ARENA_THEME (zero regressão visual).
     * 3. SUPER e SHADOW -> DEFAULT_ARENA_THEME (visuais próprios preservados).
     * 4. Trials -> DEFAULT_ARENA_THEME (visuais próprios de trial preservados).
     * 5. Tipos válidos (18 tipos) -> resolve o tema correspondente.
     * 6. Erro / dados ausentes -> DEFAULT_ARENA_THEME (resiliência total).
     *
     * @param {Object|string} [context]
     * @returns {Object} Tema de arena resolvido.
     */
    static resolve(context) {
      try {
        if (!context) return DEFAULT_ARENA_THEME;

        // Se passado diretamente como string (ex: 'fire', 'water', 'ghost')
        if (typeof context === 'string') {
          return TypeArenaRegistry.getTheme(context);
        }

        if (typeof context !== 'object') return DEFAULT_ARENA_THEME;

        // Batalhas especiais (Super Trainer, Shadow Final Stand) nunca recebem type arena
        if (context.isSuperTrainer || context.isShadowFinalStand || context.kind === 'SUPER' || context.kind === 'SHADOW') {
          return DEFAULT_ARENA_THEME;
        }

        // Valida se o contexto pertence à Campaign
        if (context.mode !== 'CAMPAIGN') {
          return DEFAULT_ARENA_THEME;
        }

        // Apenas Masters recebem arenas elementais (Trials continuam com visual padrão/próprio)
        if (context.kind !== 'MASTER') {
          return DEFAULT_ARENA_THEME;
        }

        // Identifica o tipo do Master a partir dos metadados
        let candidateType = null;
        if (context.masterType && typeof context.masterType === 'string') {
          candidateType = context.masterType;
        } else if (context.opponentTrainer && typeof context.opponentTrainer.type === 'string') {
          candidateType = context.opponentTrainer.type;
        } else if (typeof context.id === 'string' && context.id.startsWith('master-')) {
          candidateType = context.id.replace('master-', '');
        }

        if (!candidateType) return DEFAULT_ARENA_THEME;

        const normalized = candidateType.trim().toLowerCase();

        if (ALL_18_TYPES.includes(normalized) && ARENA_CATALOG[normalized]) {
          return ARENA_CATALOG[normalized];
        }

        // Tipo não reconhecido cai com segurança no default
        return DEFAULT_ARENA_THEME;
      } catch (err) {
        console.warn('Falha controlada ao resolver arena temática; utilizando default:', err);
        return DEFAULT_ARENA_THEME;
      }
    }
  }

  const exportsObj = {
    DEFAULT_ARENA_THEME,
    ARENA_CATALOG,
    TypeArenaRegistry,
    resolveArenaTheme: (ctx) => TypeArenaRegistry.resolve(ctx)
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exportsObj;
  } else if (typeof window !== 'undefined') {
    window.PBATypeArena = window.PBATypeArena || {};
    Object.assign(window.PBATypeArena, exportsObj);
  }
})();
