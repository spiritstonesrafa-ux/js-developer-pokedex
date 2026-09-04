/**
 * ====================================================================
 * SISTEMA DE EFETIVIDADE DE TIPOS: TYPE EFFECTIVENESS (type-effectiveness.js)
 * ====================================================================
 * Calcula matematicamente o multiplicador de dano e classificação elementar
 * para combatentes com 1 ou 2 tipos (single-type e dual-type).
 * 
 * Regras:
 * - Determinístico e independente de interface;
 * - Suporta multiplicadores 0, 0.25, 0.5, 1, 2 e 4;
 * - Prevalência estrita de imunidade (2 x 0 = 0);
 * - Validação rigorosa contra tipos inválidos, duplicados, vazios ou acima do limite.
 * 
 * Compatível com Node.js (CommonJS) e navegadores (window.PBABattle).
 */

(function () {
  let constants;
  let TypeChart;

  if (typeof module !== 'undefined' && module.exports) {
    constants = require('./battle-constants.js');
    TypeChart = require('./type-chart.js');
  } else if (typeof window !== 'undefined' && window.PBABattle) {
    constants = window.PBABattle;
    TypeChart = window.PBABattle;
  } else {
    constants = {
      POKEMON_TYPES: {},
      TYPE_EFFECTIVENESS_CLASSIFICATION: {
        IMMUNE: 'IMMUNE',
        RESISTED: 'RESISTED',
        NEUTRAL: 'NEUTRAL',
        SUPER_EFFECTIVE: 'SUPER_EFFECTIVE'
      }
    };
  }

  const { POKEMON_TYPES, TYPE_EFFECTIVENESS_CLASSIFICATION } = constants;
  const VALID_TYPES_SET = new Set(
    TypeChart.ALL_TYPES || Object.values(POKEMON_TYPES || {})
  );

  /**
   * Normaliza e valida um tipo Pokémon.
   * Remove espaços nas extremidades e converte para minúsculas.
   * 
   * @param {string} rawType - Tipo bruto a validar.
   * @returns {string} Tipo normalizado.
   * @throws {Error} Se o tipo for nulo, vazio, não-string ou desconhecido.
   */
  function normalizeType(rawType) {
    if (typeof rawType !== 'string') {
      throw new Error(`Tipo inválido: esperado string, recebido ${typeof rawType}.`);
    }

    const trimmed = rawType.trim().toLowerCase();
    if (trimmed.length === 0) {
      throw new Error('Tipo inválido: string vazia não é permitida.');
    }

    if (!VALID_TYPES_SET.has(trimmed)) {
      throw new Error(`Tipo Pokémon desconhecido ou inválido: "${rawType}".`);
    }

    return trimmed;
  }

  /**
   * Verifica se uma string corresponde a um tipo Pokémon válido.
   * @param {string} type - Tipo a testar.
   * @returns {boolean}
   */
  function isValidType(type) {
    if (typeof type !== 'string') return false;
    return VALID_TYPES_SET.has(type.trim().toLowerCase());
  }

  /**
   * Normaliza e valida um conjunto de tipos de um defensor (1 ou 2 tipos).
   * @param {Array<string>} rawTypes - Lista de tipos do defensor.
   * @returns {Array<string>} Lista de tipos normalizados.
   * @throws {Error} Se a lista for vazia, contiver duplicatas ou mais de 2 tipos.
   */
  function normalizeDefenderTypes(rawTypes) {
    if (!Array.isArray(rawTypes) || rawTypes.length === 0) {
      throw new Error('Tipos do defensor inválidos: deve ser um array com pelo menos 1 tipo.');
    }

    if (rawTypes.length > 2) {
      throw new Error(`Quantidade de tipos inválida: ${rawTypes.length}. Um Pokémon pode ter no máximo 2 tipos.`);
    }

    const normalized = rawTypes.map(t => normalizeType(t));

    if (normalized.length === 2 && normalized[0] === normalized[1]) {
      throw new Error(`Tipos duplicados não são permitidos: [${normalized[0]}, ${normalized[1]}].`);
    }

    return normalized;
  }

  /**
   * Determina a classificação da efetividade a partir do multiplicador numérico.
   * @param {number} multiplier - Multiplicador final.
   * @returns {string} IMMUNE, RESISTED, NEUTRAL ou SUPER_EFFECTIVE.
   */
  function getClassification(multiplier) {
    if (multiplier === 0) {
      return TYPE_EFFECTIVENESS_CLASSIFICATION.IMMUNE;
    }
    if (multiplier < 1) {
      return TYPE_EFFECTIVENESS_CLASSIFICATION.RESISTED;
    }
    if (multiplier === 1) {
      return TYPE_EFFECTIVENESS_CLASSIFICATION.NEUTRAL;
    }
    return TYPE_EFFECTIVENESS_CLASSIFICATION.SUPER_EFFECTIVE;
  }

  /**
   * Calcula a efetividade de um ataque contra um ou dois tipos defensores.
   * 
   * @param {string} attackType - Tipo do golpe atacante.
   * @param {Array<string>} defenderTypes - Array de tipos do defensor (1 ou 2 tipos).
   * @returns {{
   *   attackType: string,
   *   defenderTypes: Array<string>,
   *   multiplier: number,
   *   classification: string
   * }}
   */
  function calculate(attackType, defenderTypes) {
    const normalizedAtk = normalizeType(attackType);
    const normalizedDefs = normalizeDefenderTypes(defenderTypes);

    let multiplier = 1;
    for (const defType of normalizedDefs) {
      const singleMultiplier = TypeChart.getTypeEffectiveness(normalizedAtk, defType);
      multiplier *= singleMultiplier;
    }

    return {
      attackType: normalizedAtk,
      defenderTypes: normalizedDefs,
      multiplier,
      classification: getClassification(multiplier)
    };
  }

  const TypeEffectiveness = {
    normalizeType,
    isValidType,
    normalizeDefenderTypes,
    getClassification,
    calculate
  };

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TypeEffectiveness;
  } else if (typeof window !== 'undefined') {
    window.PBABattle = window.PBABattle || {};
    window.PBABattle.TypeEffectiveness = TypeEffectiveness;
  }
})();
