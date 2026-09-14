/**
 * ====================================================================
 * REGISTRY CENTRAL DE ARENAS POR TIPO: (type-arena-registry.js)
 * ====================================================================
 * Mantém o catálogo de temas e provê resolução determinística com fallback
 * obrigatório para todas as batalhas da Battle Arena (PBA-018A).
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
      ACTIVE_PROTOTYPE_TYPES: ['fire', 'water', 'electric'],
      ARENA_THEME_KEYS: { DEFAULT: 'default', FIRE: 'fire', WATER: 'water', ELECTRIC: 'electric' },
      ARENA_PARTICLE_LIMITS: { FIRE: 10, WATER: 10, ELECTRIC: 6, DEFAULT: 0, REDUCED_MOTION: 0 },
      ARENA_CLASSES: {
        BASE: 'arena-theme',
        DEFAULT: 'arena-theme-default',
        FIRE: 'arena-theme-fire',
        WATER: 'arena-theme-water',
        ELECTRIC: 'arena-theme-electric'
      }
    };
  }

  const {
    ACTIVE_PROTOTYPE_TYPES,
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
      if (ACTIVE_PROTOTYPE_TYPES.includes(normalized) && ARENA_CATALOG[normalized]) {
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
     * 4. Tipos fora do protótipo (os outros 15) -> DEFAULT_ARENA_THEME (fallback intencional PBA-018A).
     * 5. Erro / dados ausentes -> DEFAULT_ARENA_THEME (resiliência total).
     *
     * @param {Object|string} [context]
     * @returns {Object} Tema de arena resolvido.
     */
    static resolve(context) {
      try {
        if (!context) return DEFAULT_ARENA_THEME;

        // Se passado diretamente como string (ex: 'fire', 'water')
        if (typeof context === 'string') {
          return TypeArenaRegistry.getTheme(context);
        }

        if (typeof context !== 'object') return DEFAULT_ARENA_THEME;

        // Valida se o contexto pertence à Campaign
        if (context.mode !== 'CAMPAIGN') {
          return DEFAULT_ARENA_THEME;
        }

        // Apenas Masters recebem arenas elementais nesta fase
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

        // Apenas os 3 protótipos são ativados nesta fase PBA-018A
        if (ACTIVE_PROTOTYPE_TYPES.includes(normalized) && ARENA_CATALOG[normalized]) {
          return ARENA_CATALOG[normalized];
        }

        // Os outros 15 tipos caem intencionalmente no default
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
