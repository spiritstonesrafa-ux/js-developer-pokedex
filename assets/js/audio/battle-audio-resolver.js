/**
 * ====================================================================
 * RESOLVER DE ÁUDIO DE BATALHA: (battle-audio-resolver.js)
 * ====================================================================
 * Mapeador determinístico e funcional puro de dados de golpes e ações
 * para descritores de áudio normalizados.
 *
 * Princípios Fundamentais:
 * - AUDIO SYSTEM ≠ GAME RULES;
 * - AUDIO_DAMAGE_CALCULATION = 0;
 * - AUDIO_TYPE_CALCULATION = 0;
 * - AUDIO_AI_DECISIONS = 0;
 * - AUDIO_GAME_RULES = 0;
 * - Não toca áudio, não consulta AudioContext e não muta objetos recebidos;
 * - Fallback genérico garantido para qualquer golpe válido sem quebrar timeline.
 */

(function () {
  let constants;

  if (typeof module !== 'undefined' && module.exports) {
    constants = require('./battle-audio-constants.js');
  } else if (typeof window !== 'undefined') {
    constants = window.PBABattleAudio || {};
  } else {
    constants = {
      TYPE_AUDIO_FAMILIES: { NORMAL: 'normal' },
      TYPE_AUDIO_DEFAULTS: { normal: 'IMPACT' },
      AUDIO_INTENSITY: { LOW: 'LOW', MEDIUM: 'MEDIUM', HIGH: 'HIGH' },
      AUDIO_INTENSITY_THRESHOLDS: { LOW_MAX: 50, MEDIUM_MAX: 90 },
      AUDIO_CATEGORIES: { MOVE_ATTACK: 'MOVE_ATTACK' }
    };
  }

  const {
    TYPE_AUDIO_FAMILIES,
    TYPE_AUDIO_DEFAULTS,
    AUDIO_INTENSITY,
    AUDIO_INTENSITY_THRESHOLDS,
    AUDIO_CATEGORIES
  } = constants;

  const validTypes = new Set(Object.values(TYPE_AUDIO_FAMILIES));

  /**
   * Determina a intensidade do efeito sonoro com base no poder nominal do golpe.
   * Regra Estrita: VISUAL/AUDIO_INTENSITY ≠ DAMAGE_CALCULATION.
   * @param {number|undefined} power
   * @returns {string} 'LOW' | 'MEDIUM' | 'HIGH'
   */
  function resolveIntensity(power) {
    if (power === undefined || power === null || Number.isNaN(Number(power))) {
      return AUDIO_INTENSITY.MEDIUM;
    }
    const numPower = Number(power);
    if (numPower <= AUDIO_INTENSITY_THRESHOLDS.LOW_MAX) {
      return AUDIO_INTENSITY.LOW;
    }
    if (numPower <= AUDIO_INTENSITY_THRESHOLDS.MEDIUM_MAX) {
      return AUDIO_INTENSITY.MEDIUM;
    }
    return AUDIO_INTENSITY.HIGH;
  }

  /**
   * Mapeia dados de um golpe para um descritor de áudio imutável.
   * @param {Object} moveData
   * @param {string} [moveData.moveId]
   * @param {string} [moveData.moveName]
   * @param {string} [moveData.moveType]
   * @param {number} [moveData.power]
   * @returns {Object} Descritor de áudio imutável
   */
  function resolve(moveData = {}) {
    if (!moveData || typeof moveData !== 'object') {
      throw new Error('INVALID_MOVE_DATA: resolve requer um objeto de dados de golpe.');
    }

    const rawType = (moveData.moveType || moveData.type || '').trim().toLowerCase();

    // Validação controlada: se type foi informado mas não existe no catálogo moderno de 18 tipos
    if (rawType && !validTypes.has(rawType)) {
      throw new Error(`INVALID_AUDIO_TYPE: O tipo "${rawType}" não é reconhecido no catálogo de 18 tipos.`);
    }

    // Fallback genérico para 'normal' se type não foi especificado
    const typeFamily = rawType && validTypes.has(rawType) ? rawType : TYPE_AUDIO_FAMILIES.NORMAL;
    const archetype = TYPE_AUDIO_DEFAULTS[typeFamily] || 'IMPACT';
    const intensity = resolveIntensity(moveData.power);

    return Object.freeze({
      category: AUDIO_CATEGORIES.MOVE_ATTACK,
      typeFamily,
      archetype,
      intensity,
      moveId: moveData.moveId || null,
      moveName: moveData.moveName || null
    });
  }

  const resolverModule = Object.freeze({
    resolve,
    resolveIntensity,
    BattleAudioResolver: { resolve, resolveIntensity }
  });

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = resolverModule;
  } else if (typeof window !== 'undefined') {
    window.PBABattleAudio = window.PBABattleAudio || {};
    Object.assign(window.PBABattleAudio, resolverModule);
  }
})();
