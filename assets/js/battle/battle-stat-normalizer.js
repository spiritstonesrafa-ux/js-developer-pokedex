/**
 * ====================================================================
 * NORMALIZADOR DE STATS DE BATALHA: (battle-stat-normalizer.js)
 * ====================================================================
 * Implementação matemática pura e determinística das fórmulas de atributos
 * da série principal (Generation III onward) para a Fase PBA-014B.
 *
 * Responsabilidades:
 * - Converter Base Stats da PokéAPI em Battle Stats padronizados em Level 50;
 * - Respeitar o padrão competitivo: Level 50, IV 31, EV 0, Nature neutra (1.0);
 * - Fonte de verdade única de nível: BATTLE_CONFIG.SIMULATION_LEVEL (50);
 * - Caso especial auditado: Shedinja (#292) possui HP fixo em 1;
 * - 100% livre de efeitos colaterais (sem DOM, sem fetch, sem áudio, sem storage, sem RNG).
 *
 * Fórmulas canônicas:
 * - HP = floor(((2 * Base + IV + floor(EV / 4)) * Level) / 100) + Level + 10
 * - Other = floor((floor(((2 * Base + IV + floor(EV / 4)) * Level) / 100) + 5) * Nature)
 *
 * Suporta Node.js (CommonJS) e Navegadores (window.PBABattle).
 */

(function () {
  let constants;
  if (typeof module !== 'undefined' && module.exports) {
    try {
      constants = require('./battle-constants.js');
    } catch {
      constants = null;
    }
  } else if (typeof window !== 'undefined' && window.PBABattle) {
    constants = window.PBABattle;
  }

  const BATTLE_LEVEL = (constants && constants.BATTLE_CONFIG && constants.BATTLE_CONFIG.SIMULATION_LEVEL) || 50;
  const DEFAULT_IV = 31;
  const DEFAULT_EV = 0;
  const DEFAULT_NATURE_MULTIPLIER = 1.0;

  const BattleStatNormalizer = (() => {
    /**
     * Calcula o HP de batalha em conformidade com a fórmula da série principal.
     * @param {number} baseHp - Base HP da espécie (> 0).
     * @param {Object} [options]
     * @param {number} [options.level] - Nível do Pokémon (padrão 50).
     * @param {number} [options.iv] - Individual Value (padrão 31).
     * @param {number} [options.ev] - Effort Value (padrão 0).
     * @param {boolean} [options.isShedinja] - Flag para a exceção canônica de Shedinja (HP = 1).
     * @returns {number} HP final normalizado (inteiro >= 1).
     */
    function calculateHp(baseHp, options = {}) {
      if (options.isShedinja === true) {
        return 1;
      }

      const base = Number(baseHp);
      if (!Number.isFinite(base) || base <= 0) {
        throw new Error(`Base HP inválido: ${baseHp}. Deve ser um número maior que zero.`);
      }

      const level = Number.isFinite(Number(options.level)) ? Number(options.level) : BATTLE_LEVEL;
      const iv = Number.isFinite(Number(options.iv)) ? Number(options.iv) : DEFAULT_IV;
      const ev = Number.isFinite(Number(options.ev)) ? Number(options.ev) : DEFAULT_EV;

      const evContribution = Math.floor(ev / 4);
      const inner = (2 * base + iv + evContribution) * level;
      const calculatedHp = Math.floor(inner / 100) + level + 10;

      return Math.max(1, calculatedHp);
    }

    /**
     * Calcula um atributo de combate que não seja HP (Attack, Defense, Sp. Atk, Sp. Def, Speed).
     * @param {number} baseStat - Base stat da espécie (> 0).
     * @param {Object} [options]
     * @param {number} [options.level] - Nível do Pokémon (padrão 50).
     * @param {number} [options.iv] - Individual Value (padrão 31).
     * @param {number} [options.ev] - Effort Value (padrão 0).
     * @param {number} [options.natureMultiplier] - Multiplicador de nature (padrão 1.0).
     * @returns {number} Atributo final normalizado (inteiro >= 1).
     */
    function calculateOtherStat(baseStat, options = {}) {
      const base = Number(baseStat);
      if (!Number.isFinite(base) || base <= 0) {
        throw new Error(`Base Stat inválido: ${baseStat}. Deve ser um número maior que zero.`);
      }

      const level = Number.isFinite(Number(options.level)) ? Number(options.level) : BATTLE_LEVEL;
      const iv = Number.isFinite(Number(options.iv)) ? Number(options.iv) : DEFAULT_IV;
      const ev = Number.isFinite(Number(options.ev)) ? Number(options.ev) : DEFAULT_EV;
      const nature = Number.isFinite(Number(options.natureMultiplier)) ? Number(options.natureMultiplier) : DEFAULT_NATURE_MULTIPLIER;

      const evContribution = Math.floor(ev / 4);
      const inner = Math.floor(((2 * base + iv + evContribution) * level) / 100) + 5;
      const finalStat = Math.floor(inner * nature);

      return Math.max(1, finalStat);
    }

    /**
     * Normaliza um conjunto completo de Base Stats em Battle Stats de Level 50.
     * Preserva as propriedades originais sob a chave baseStats.
     *
     * @param {Object} baseStats - { hp, attack, defense, specialAttack, specialDefense, speed }
     * @param {Object} [options]
     * @param {number} [options.pokemonId] - ID para detecção de exceções (ex: #292 Shedinja).
     * @param {string} [options.pokemonName] - Nome para detecção de exceções.
     * @param {number} [options.level] - Nível (padrão 50).
     * @param {number} [options.iv] - IV (padrão 31).
     * @param {number} [options.ev] - EV (padrão 0).
     * @param {number} [options.natureMultiplier] - Multiplicador nature (padrão 1.0).
     * @returns {Object} Stats normalizados com { hp, attack, defense, specialAttack, specialDefense, speed, baseStats }.
     */
    function normalizeStats(baseStats = {}, options = {}) {
      const isShedinja = options.isShedinja === true ||
        options.pokemonId === 292 ||
        (typeof options.pokemonName === 'string' && options.pokemonName.trim().toLowerCase() === 'shedinja');

      const hpBase = baseStats.hp !== undefined ? baseStats.hp : 50;
      const atkBase = baseStats.attack !== undefined ? baseStats.attack : 50;
      const defBase = baseStats.defense !== undefined ? baseStats.defense : 50;
      const spAtkBase = baseStats.specialAttack !== undefined ? baseStats.specialAttack : atkBase;
      const spDefBase = baseStats.specialDefense !== undefined ? baseStats.specialDefense : defBase;
      const spdBase = baseStats.speed !== undefined ? baseStats.speed : 50;

      const hp = calculateHp(hpBase, { ...options, isShedinja });
      const attack = calculateOtherStat(atkBase, options);
      const defense = calculateOtherStat(defBase, options);
      const specialAttack = calculateOtherStat(spAtkBase, options);
      const specialDefense = calculateOtherStat(spDefBase, options);
      const speed = calculateOtherStat(spdBase, options);

      return {
        hp,
        attack,
        defense,
        specialAttack,
        specialDefense,
        speed,
        baseStats: {
          hp: Number(hpBase),
          attack: Number(atkBase),
          defense: Number(defBase),
          specialAttack: Number(spAtkBase),
          specialDefense: Number(spDefBase),
          speed: Number(spdBase)
        }
      };
    }

    return {
      BATTLE_LEVEL,
      DEFAULT_IV,
      DEFAULT_EV,
      DEFAULT_NATURE_MULTIPLIER,
      calculateHp,
      calculateOtherStat,
      normalizeStats
    };
  })();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = BattleStatNormalizer;
  } else if (typeof window !== 'undefined') {
    window.PBABattle = window.PBABattle || {};
    window.PBABattle.BattleStatNormalizer = BattleStatNormalizer;
  }
})();
