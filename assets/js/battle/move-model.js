/**
 * ====================================================================
 * MODELO DE GOLPE: MOVE MODEL (move-model.js)
 * ====================================================================
 * Define a estrutura canônica normalizada de golpes Pokémon para o Battle Engine.
 * 
 * Atributos:
 * - id: Identificador numérico único (> 0);
 * - name: Nome do golpe (string não-vazia minúscula);
 * - type: Tipo elemental validado (ex: 'electric', 'fire');
 * - power: Poder base do golpe (> 0);
 * - accuracy: Taxa de precisão (1 a 100) ou null/'ALWAYS_HIT' para golpes infallíveis;
 * - pp: Quantidade máxima de Power Points (> 0);
 * - damageClass: Categoria de dano ('physical' ou 'special').
 * 
 * Golpes de categoria 'status' são reconhecidos porém rejeitados como UNSUPPORTED na PBA-005.
 * Compatível com Node.js (CommonJS) e navegadores (window.PBABattle).
 */

(function () {
  let constants;
  let TypeEffectiveness;

  if (typeof module !== 'undefined' && module.exports) {
    constants = require('./battle-constants.js');
    TypeEffectiveness = require('./type-effectiveness.js');
  } else if (typeof window !== 'undefined' && window.PBABattle) {
    constants = window.PBABattle;
    TypeEffectiveness = window.PBABattle.TypeEffectiveness;
  } else {
    constants = {
      MOVE_DAMAGE_CLASSES: {
        PHYSICAL: 'physical',
        SPECIAL: 'special',
        STATUS: 'status'
      }
    };
  }

  const { MOVE_DAMAGE_CLASSES } = constants;

  /**
   * Valida e normaliza um golpe Pokémon.
   * Não muta o objeto original.
   * 
   * @param {Object} raw - Dados brutos do golpe.
   * @returns {Object} Golpe normalizado e imutável.
   * @throws {Error} Se qualquer atributo for inválido ou se for golpe de status.
   */
  function createMove(raw) {
    if (!raw || typeof raw !== 'object') {
      throw new Error('Golpe inválido: dados devem ser um objeto não nulo.');
    }

    const id = Number(raw.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(`ID do golpe inválido: ${raw.id}. Deve ser um inteiro positivo.`);
    }

    if (typeof raw.name !== 'string' || raw.name.trim().length === 0) {
      throw new Error(`Nome do golpe inválido: "${raw.name}". Deve ser uma string não vazia.`);
    }

    // Normalização e validação da categoria de dano (damageClass)
    const rawClass = (raw.damageClass || raw.damage_class?.name || raw.damage_class || '').toString().trim().toLowerCase();

    if (rawClass === MOVE_DAMAGE_CLASSES.STATUS) {
      throw new Error(`Golpe de status "${raw.name}" não é suportado no Battle Engine v2 (UNSUPPORTED_IN_PBA_005).`);
    }

    if (rawClass !== MOVE_DAMAGE_CLASSES.PHYSICAL && rawClass !== MOVE_DAMAGE_CLASSES.SPECIAL) {
      throw new Error(`Categoria de dano inválida: "${rawClass}". Deve ser "physical" ou "special".`);
    }

    // Validação do tipo elemental
    const rawType = raw.type?.name || raw.type;
    let normalizedType;
    if (TypeEffectiveness && typeof TypeEffectiveness.normalizeType === 'function') {
      normalizedType = TypeEffectiveness.normalizeType(rawType);
    } else {
      if (typeof rawType !== 'string' || rawType.trim().length === 0) {
        throw new Error(`Tipo do golpe inválido: "${rawType}".`);
      }
      normalizedType = rawType.trim().toLowerCase();
    }

    // Validação de Power (> 0)
    const power = Number(raw.power);
    if (!Number.isFinite(power) || !Number.isInteger(power) || power <= 0) {
      throw new Error(`Poder do golpe "${raw.name}" inválido: ${raw.power}. Deve ser um inteiro positivo maior que zero.`);
    }

    // Validação de Accuracy (1 a 100, ou null/'ALWAYS_HIT')
    let normalizedAccuracy = null;
    if (raw.accuracy === null || raw.accuracy === undefined || raw.accuracy === 'ALWAYS_HIT') {
      normalizedAccuracy = null; // Representa golpe infallível (Always-Hit)
    } else {
      const acc = Number(raw.accuracy);
      if (!Number.isFinite(acc) || !Number.isInteger(acc) || acc < 1 || acc > 100) {
        throw new Error(`Precisão (accuracy) do golpe "${raw.name}" inválida: ${raw.accuracy}. Deve ser entre 1 e 100 ou null.`);
      }
      normalizedAccuracy = acc;
    }

    // Validação de PP (> 0)
    const pp = Number(raw.pp);
    if (!Number.isFinite(pp) || !Number.isInteger(pp) || pp <= 0) {
      throw new Error(`PP do golpe "${raw.name}" inválido: ${raw.pp}. Deve ser um inteiro maior que zero.`);
    }

    return Object.freeze({
      id,
      name: raw.name.trim().toLowerCase(),
      type: normalizedType,
      power,
      accuracy: normalizedAccuracy,
      pp,
      damageClass: rawClass
    });
  }

  /**
   * Converte o payload bruto de um move da PokéAPI em um Move normalizado.
   * @param {Object} rawApi - Resposta JSON da PokéAPI (/api/v2/move/{id}).
   * @returns {Object} Move normalizado.
   */
  function convertPokeApiMove(rawApi) {
    if (!rawApi) throw new Error('Payload da PokéAPI nulo ou indefinido.');

    return createMove({
      id: rawApi.id,
      name: rawApi.name,
      type: rawApi.type?.name || rawApi.type,
      power: rawApi.power,
      accuracy: rawApi.accuracy,
      pp: rawApi.pp,
      damageClass: rawApi.damage_class?.name || rawApi.damageClass
    });
  }

  /**
   * Verifica se o golpe é da categoria status (não suportado na PBA-005).
   * @param {Object} raw - Dados brutos do golpe.
   * @returns {boolean}
   */
  function isStatusMove(raw) {
    if (!raw || typeof raw !== 'object') return false;
    const rawClass = (raw.damageClass || raw.damage_class?.name || raw.damage_class || '').toString().trim().toLowerCase();
    return rawClass === MOVE_DAMAGE_CLASSES.STATUS;
  }

  /**
   * Verifica se o golpe é suportado no Battle Engine v2 (physical ou special com dano).
   * @param {Object} raw - Dados brutos do golpe.
   * @returns {boolean}
   */
  function isSupportedMove(raw) {
    if (!raw || typeof raw !== 'object') return false;
    const rawClass = (raw.damageClass || raw.damage_class?.name || raw.damage_class || '').toString().trim().toLowerCase();
    return rawClass === MOVE_DAMAGE_CLASSES.PHYSICAL || rawClass === MOVE_DAMAGE_CLASSES.SPECIAL;
  }

  const MoveModel = Object.freeze({
    createMove,
    convertPokeApiMove,
    isStatusMove,
    isSupportedMove
  });

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MoveModel;
  } else if (typeof window !== 'undefined') {
    window.PBABattle = window.PBABattle || {};
    window.PBABattle.MoveModel = MoveModel;
  }
})();
