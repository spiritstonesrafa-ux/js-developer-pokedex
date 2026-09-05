/**
 * ====================================================================
 * RESOLVEDOR DE CÂMERA E IMPACTO: (battle-camera-resolver.js)
 * ====================================================================
 * Mapeador funcional puro que traduz metadados de apresentação já calculados
 * (dano, multiplicador de efetividade, poder e flags de miss/imunidade) em um
 * descritor visual determinístico e imutável para a câmera.
 *
 * Princípios Fundamentais:
 * - CAMERA SYSTEM ≠ GAME RULES;
 * - Zero cálculo de dano (AUDIO_DAMAGE_CALCULATION = 0, CAMERA_DAMAGE_CALCULATION = 0);
 * - Zero decisão de efetividade ou IA;
 * - Suporta Node.js (CommonJS) e Navegadores (window.PBABattleCamera).
 */

(function () {
  let constantsModule;

  if (typeof module !== 'undefined' && module.exports) {
    constantsModule = require('./battle-camera-constants');
  } else if (typeof window !== 'undefined' && window.PBABattleCamera) {
    constantsModule = window.PBABattleCamera;
  } else {
    constantsModule = {
      IMPACT_LEVELS: { NONE: 'NONE', LIGHT: 'LIGHT', MEDIUM: 'MEDIUM', HEAVY: 'HEAVY' },
      SHAKE_MAGNITUDES: { NONE: 0, LIGHT: 2.5, MEDIUM: 5.0, HEAVY: 8.5 },
      SHAKE_DURATIONS: { NONE: 0, LIGHT: 150, MEDIUM: 250, HEAVY: 350 },
      PUNCH_SCALES: { NONE: 1.0, LIGHT: 1.015, MEDIUM: 1.025, HEAVY: 1.04 },
      PUNCH_DURATIONS: { NONE: 0, LIGHT: 120, MEDIUM: 180, HEAVY: 240 },
      FLASH_OPACITIES: { NONE: 0, LIGHT: 0.15, MEDIUM: 0.25, HEAVY: 0.38 },
      FLASH_DURATIONS: { NONE: 0, LIGHT: 100, MEDIUM: 140, HEAVY: 180 },
      IMPACT_HOLD_DURATIONS: { NONE: 0, LIGHT: 0, MEDIUM: 40, HEAVY: 80 }
    };
  }

  const {
    IMPACT_LEVELS,
    SHAKE_MAGNITUDES,
    SHAKE_DURATIONS,
    PUNCH_SCALES,
    PUNCH_DURATIONS,
    FLASH_OPACITIES,
    FLASH_DURATIONS,
    IMPACT_HOLD_DURATIONS
  } = constantsModule;

  class BattleCameraResolver {
    /**
     * Determina o nível de impacto de apresentação a partir dos metadados recebidos.
     * @param {Object} metadata
     * @returns {string} Membro de IMPACT_LEVELS ('NONE', 'LIGHT', 'MEDIUM', 'HEAVY')
     */
    static resolveImpactLevel(metadata = {}) {
      if (!metadata || typeof metadata !== 'object') {
        return IMPACT_LEVELS.NONE;
      }

      const isMiss = Boolean(metadata.isMiss);
      const isImmune = Boolean(metadata.isImmune);
      const damage = metadata.damage !== undefined ? Number(metadata.damage) : 0;
      const multiplier = metadata.multiplier !== undefined ? Number(metadata.multiplier) : 1;

      // 1. Condições de ausência de impacto de dano (Miss, Imunidade, Dano Zero ou Multiplicador Zero)
      if (isMiss || isImmune || damage <= 0 || multiplier === 0) {
        return IMPACT_LEVELS.NONE;
      }

      // 2. Nível base determinado por power ou intensity previamente resolvida
      let baseLevel = IMPACT_LEVELS.MEDIUM;
      if (metadata.intensity === 'HIGH') {
        baseLevel = IMPACT_LEVELS.HEAVY;
      } else if (metadata.intensity === 'LOW') {
        baseLevel = IMPACT_LEVELS.LIGHT;
      } else if (metadata.intensity === 'MEDIUM') {
        baseLevel = IMPACT_LEVELS.MEDIUM;
      } else if (metadata.power !== undefined) {
        const power = Number(metadata.power);
        if (power > 90) {
          baseLevel = IMPACT_LEVELS.HEAVY;
        } else if (power <= 50) {
          baseLevel = IMPACT_LEVELS.LIGHT;
        } else {
          baseLevel = IMPACT_LEVELS.MEDIUM;
        }
      }

      // 3. Ajuste visual de efetividade (baseado no multiplicador pré-calculado)
      let finalLevel = baseLevel;

      if (multiplier <= 0.5) {
        // Golpe resistido: atenua a ênfase visual em uma categoria (piso em LIGHT se houver dano)
        if (baseLevel === IMPACT_LEVELS.HEAVY) {
          finalLevel = IMPACT_LEVELS.MEDIUM;
        } else {
          finalLevel = IMPACT_LEVELS.LIGHT;
        }
      } else if (multiplier >= 4) {
        // Super efetivo 4x: eleva para a categoria máxima HEAVY
        finalLevel = IMPACT_LEVELS.HEAVY;
      } else if (multiplier >= 2) {
        // Super efetivo 2x: promove um nível na escala
        if (baseLevel === IMPACT_LEVELS.LIGHT) {
          finalLevel = IMPACT_LEVELS.MEDIUM;
        } else {
          finalLevel = IMPACT_LEVELS.HEAVY;
        }
      }

      return finalLevel;
    }

    /**
     * Resolve um descritor de câmera completo, imutável e pronto para execução.
     * @param {Object} metadata
     * @returns {Object} Descritor de impacto da câmera
     */
    static resolve(metadata = {}) {
      const level = BattleCameraResolver.resolveImpactLevel(metadata);

      return Object.freeze({
        impactLevel: level,
        shakeMagnitude: SHAKE_MAGNITUDES[level],
        shakeDuration: SHAKE_DURATIONS[level],
        punchScale: PUNCH_SCALES[level],
        punchDuration: PUNCH_DURATIONS[level],
        flash: level !== IMPACT_LEVELS.NONE,
        flashOpacity: FLASH_OPACITIES[level],
        flashDuration: FLASH_DURATIONS[level],
        holdMs: IMPACT_HOLD_DURATIONS[level]
      });
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = BattleCameraResolver;
  } else if (typeof window !== 'undefined') {
    window.PBABattleCamera = window.PBABattleCamera || {};
    window.PBABattleCamera.BattleCameraResolver = BattleCameraResolver;
  }
})();
