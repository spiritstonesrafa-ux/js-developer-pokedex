/**
 * ====================================================================
 * RESOLVEDOR DE EFEITOS VISUAIS: (move-vfx-resolver.js)
 * ====================================================================
 * Converte metadados de golpes em descritores visuais normalizados e
 * imutáveis para a camada de renderização (Fase PBA-010).
 *
 * Princípios Fundamentais:
 * - Função pura: sem mutação, sem DOM, sem áudio, sem chamadas a fetch;
 * - Mapeamento em camadas: Move -> Move Descriptor -> Type Family -> Archetype;
 * - Suporta 18 famílias de tipo com fallback seguro para qualquer golpe válido;
 * - Rejeita tipos inválidos e golpes de status não suportados;
 * - Suporta Node.js (CommonJS) e Navegadores (window.PBABattleVfx).
 */

(function () {
  let constants;
  if (typeof module !== 'undefined' && module.exports) {
    constants = require('./move-vfx-constants.js');
  } else if (typeof window !== 'undefined' && window.PBABattleVfx) {
    constants = window.PBABattleVfx;
  } else {
    constants = {
      VFX_TYPE_FAMILIES: {},
      VFX_ARCHETYPES: {},
      VFX_INTENSITY: { LOW: 'LOW', MEDIUM: 'MEDIUM', HIGH: 'HIGH' },
      POWER_THRESHOLDS: { LOW_MAX: 50, MEDIUM_MAX: 90 },
      TYPE_DEFAULT_ARCHETYPES: {},
      TYPE_PALETTES: {},
      MOVE_OVERRIDES: {},
      VFX_DURATIONS: {}
    };
  }

  const {
    VFX_TYPE_FAMILIES,
    VFX_ARCHETYPES,
    VFX_INTENSITY,
    POWER_THRESHOLDS,
    TYPE_DEFAULT_ARCHETYPES,
    TYPE_PALETTES,
    MOVE_OVERRIDES,
    VFX_DURATIONS
  } = constants;

  const validTypes = new Set(Object.values(VFX_TYPE_FAMILIES));

  /**
   * Determina a intensidade visual a partir do poder base do golpe.
   * Não altera o cálculo de dano.
   * @param {number|null} power
   * @returns {string}
   */
  function resolveIntensity(power) {
    if (power === null || power === undefined || !Number.isFinite(Number(power))) {
      return VFX_INTENSITY.MEDIUM;
    }
    const p = Number(power);
    if (p <= POWER_THRESHOLDS.LOW_MAX) {
      return VFX_INTENSITY.LOW;
    }
    if (p <= POWER_THRESHOLDS.MEDIUM_MAX) {
      return VFX_INTENSITY.MEDIUM;
    }
    return VFX_INTENSITY.HIGH;
  }

  /**
   * Resolve os dados de um golpe para um descritor de efeito visual.
   * @param {Object} raw - Dados do golpe ({ moveName, moveType, damageClass, power, ... }).
   * @returns {Object} Descritor visual imutável.
   * @throws {Error} Se o tipo for inválido ou for golpe de status.
   */
  function resolve(raw) {
    if (!raw || typeof raw !== 'object') {
      throw new Error('INVALID_MOVE_DATA: Dados do golpe devem ser um objeto não nulo.');
    }

    const moveName = (raw.moveName || raw.name || '').toString().trim().toLowerCase();
    const damageClass = (raw.damageClass || raw.damage_class || '').toString().trim().toLowerCase();

    // Rejeita golpes de status nesta fase
    if (damageClass === 'status') {
      throw new Error(`UNSUPPORTED_STATUS_MOVE: Golpes de status ("${moveName}") não possuem efeito visual na PBA-010.`);
    }

    // Normalização e validação de tipo
    const rawType = (raw.moveType || raw.type || '').toString().trim().toLowerCase();
    if (!rawType || !validTypes.has(rawType)) {
      throw new Error(`INVALID_MOVE_TYPE: Tipo elemental "${rawType}" não é reconhecido no catálogo de 18 tipos.`);
    }

    // Resolução de arquétipo: Override específico ou Fallback de Tipo
    let archetype;
    if (moveName && MOVE_OVERRIDES[moveName]) {
      archetype = MOVE_OVERRIDES[moveName].archetype;
    } else {
      archetype = TYPE_DEFAULT_ARCHETYPES[rawType] || VFX_ARCHETYPES.PROJECTILE;
    }

    // Resolução de intensidade
    const intensity = resolveIntensity(raw.power);

    // Resolução de paleta
    const palette = TYPE_PALETTES[rawType] || {
      primary: '#ffffff',
      secondary: '#cccccc',
      glow: 'rgba(255, 255, 255, 0.6)'
    };

    const duration = (VFX_DURATIONS && VFX_DURATIONS[archetype]) ? VFX_DURATIONS[archetype] : 350;

    return Object.freeze({
      moveName: moveName || 'unknown-move',
      moveType: rawType,
      archetype,
      intensity,
      power: Number(raw.power) || 0,
      damageClass: damageClass || 'special',
      impactFamily: `${rawType.toUpperCase()}_IMPACT`,
      colors: Object.freeze({ ...palette }),
      duration
    });
  }

  const MoveVfxResolver = Object.freeze({
    resolve,
    resolveIntensity
  });

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MoveVfxResolver;
  } else if (typeof window !== 'undefined') {
    window.PBABattleVfx = window.PBABattleVfx || {};
    window.PBABattleVfx.MoveVfxResolver = MoveVfxResolver;
  }
})();
