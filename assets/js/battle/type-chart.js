/**
 * ====================================================================
 * TABELA DE EFETIVIDADE DE TIPOS: TYPE CHART (type-chart.js)
 * ====================================================================
 * Matriz canônica completa de 18x18 tipos da franquia Pokémon moderna (Gen 6+).
 * 
 * Regras elementais:
 * - 0   = Imune
 * - 0.5 = Pouco efetivo (Resistido)
 * - 1   = Dano neutro
 * - 2   = Super efetivo
 * 
 * Total de relações cobertas: 324 combinações resolvíveis sem valores indefinidos.
 * Compatível com Node.js (CommonJS) e navegadores (window.PBABattle).
 */

(function () {
  let constants;
  if (typeof module !== 'undefined' && module.exports) {
    constants = require('./battle-constants.js');
  } else if (typeof window !== 'undefined' && window.PBABattle) {
    constants = window.PBABattle;
  } else {
    constants = {
      POKEMON_TYPES: {
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
      }
    };
  }

  const { POKEMON_TYPES } = constants;
  const ALL_TYPES = Object.values(POKEMON_TYPES);

  // Mapeamento explícito de modificadores especiais (não neutros)
  const SPECIAL_EFFECTIVENESS = {
    [POKEMON_TYPES.NORMAL]: {
      [POKEMON_TYPES.ROCK]: 0.5,
      [POKEMON_TYPES.STEEL]: 0.5,
      [POKEMON_TYPES.GHOST]: 0
    },
    [POKEMON_TYPES.FIRE]: {
      [POKEMON_TYPES.FIRE]: 0.5,
      [POKEMON_TYPES.WATER]: 0.5,
      [POKEMON_TYPES.GRASS]: 2,
      [POKEMON_TYPES.ICE]: 2,
      [POKEMON_TYPES.BUG]: 2,
      [POKEMON_TYPES.ROCK]: 0.5,
      [POKEMON_TYPES.DRAGON]: 0.5,
      [POKEMON_TYPES.STEEL]: 2
    },
    [POKEMON_TYPES.WATER]: {
      [POKEMON_TYPES.FIRE]: 2,
      [POKEMON_TYPES.WATER]: 0.5,
      [POKEMON_TYPES.GRASS]: 0.5,
      [POKEMON_TYPES.GROUND]: 2,
      [POKEMON_TYPES.ROCK]: 2,
      [POKEMON_TYPES.DRAGON]: 0.5
    },
    [POKEMON_TYPES.ELECTRIC]: {
      [POKEMON_TYPES.WATER]: 2,
      [POKEMON_TYPES.ELECTRIC]: 0.5,
      [POKEMON_TYPES.GRASS]: 0.5,
      [POKEMON_TYPES.GROUND]: 0,
      [POKEMON_TYPES.FLYING]: 2,
      [POKEMON_TYPES.DRAGON]: 0.5
    },
    [POKEMON_TYPES.GRASS]: {
      [POKEMON_TYPES.FIRE]: 0.5,
      [POKEMON_TYPES.WATER]: 2,
      [POKEMON_TYPES.GRASS]: 0.5,
      [POKEMON_TYPES.POISON]: 0.5,
      [POKEMON_TYPES.GROUND]: 2,
      [POKEMON_TYPES.FLYING]: 0.5,
      [POKEMON_TYPES.BUG]: 0.5,
      [POKEMON_TYPES.ROCK]: 2,
      [POKEMON_TYPES.DRAGON]: 0.5,
      [POKEMON_TYPES.STEEL]: 0.5
    },
    [POKEMON_TYPES.ICE]: {
      [POKEMON_TYPES.FIRE]: 0.5,
      [POKEMON_TYPES.WATER]: 0.5,
      [POKEMON_TYPES.GRASS]: 2,
      [POKEMON_TYPES.ICE]: 0.5,
      [POKEMON_TYPES.GROUND]: 2,
      [POKEMON_TYPES.FLYING]: 2,
      [POKEMON_TYPES.DRAGON]: 2,
      [POKEMON_TYPES.STEEL]: 0.5
    },
    [POKEMON_TYPES.FIGHTING]: {
      [POKEMON_TYPES.NORMAL]: 2,
      [POKEMON_TYPES.ICE]: 2,
      [POKEMON_TYPES.POISON]: 0.5,
      [POKEMON_TYPES.FLYING]: 0.5,
      [POKEMON_TYPES.PSYCHIC]: 0.5,
      [POKEMON_TYPES.BUG]: 0.5,
      [POKEMON_TYPES.ROCK]: 2,
      [POKEMON_TYPES.GHOST]: 0,
      [POKEMON_TYPES.DARK]: 2,
      [POKEMON_TYPES.STEEL]: 2,
      [POKEMON_TYPES.FAIRY]: 0.5
    },
    [POKEMON_TYPES.POISON]: {
      [POKEMON_TYPES.GRASS]: 2,
      [POKEMON_TYPES.POISON]: 0.5,
      [POKEMON_TYPES.GROUND]: 0.5,
      [POKEMON_TYPES.ROCK]: 0.5,
      [POKEMON_TYPES.GHOST]: 0.5,
      [POKEMON_TYPES.STEEL]: 0,
      [POKEMON_TYPES.FAIRY]: 2
    },
    [POKEMON_TYPES.GROUND]: {
      [POKEMON_TYPES.FIRE]: 2,
      [POKEMON_TYPES.ELECTRIC]: 2,
      [POKEMON_TYPES.GRASS]: 0.5,
      [POKEMON_TYPES.POISON]: 2,
      [POKEMON_TYPES.FLYING]: 0,
      [POKEMON_TYPES.BUG]: 0.5,
      [POKEMON_TYPES.ROCK]: 2,
      [POKEMON_TYPES.STEEL]: 2
    },
    [POKEMON_TYPES.FLYING]: {
      [POKEMON_TYPES.ELECTRIC]: 0.5,
      [POKEMON_TYPES.GRASS]: 2,
      [POKEMON_TYPES.FIGHTING]: 2,
      [POKEMON_TYPES.BUG]: 2,
      [POKEMON_TYPES.ROCK]: 0.5,
      [POKEMON_TYPES.STEEL]: 0.5
    },
    [POKEMON_TYPES.PSYCHIC]: {
      [POKEMON_TYPES.FIGHTING]: 2,
      [POKEMON_TYPES.POISON]: 2,
      [POKEMON_TYPES.PSYCHIC]: 0.5,
      [POKEMON_TYPES.DARK]: 0,
      [POKEMON_TYPES.STEEL]: 0.5
    },
    [POKEMON_TYPES.BUG]: {
      [POKEMON_TYPES.FIRE]: 0.5,
      [POKEMON_TYPES.GRASS]: 2,
      [POKEMON_TYPES.FIGHTING]: 0.5,
      [POKEMON_TYPES.POISON]: 0.5,
      [POKEMON_TYPES.FLYING]: 0.5,
      [POKEMON_TYPES.PSYCHIC]: 2,
      [POKEMON_TYPES.GHOST]: 0.5,
      [POKEMON_TYPES.DARK]: 2,
      [POKEMON_TYPES.STEEL]: 0.5,
      [POKEMON_TYPES.FAIRY]: 0.5
    },
    [POKEMON_TYPES.ROCK]: {
      [POKEMON_TYPES.FIRE]: 2,
      [POKEMON_TYPES.ICE]: 2,
      [POKEMON_TYPES.FIGHTING]: 0.5,
      [POKEMON_TYPES.GROUND]: 0.5,
      [POKEMON_TYPES.FLYING]: 2,
      [POKEMON_TYPES.BUG]: 2,
      [POKEMON_TYPES.STEEL]: 0.5
    },
    [POKEMON_TYPES.GHOST]: {
      [POKEMON_TYPES.NORMAL]: 0,
      [POKEMON_TYPES.PSYCHIC]: 2,
      [POKEMON_TYPES.GHOST]: 2,
      [POKEMON_TYPES.DARK]: 0.5
    },
    [POKEMON_TYPES.DRAGON]: {
      [POKEMON_TYPES.DRAGON]: 2,
      [POKEMON_TYPES.STEEL]: 0.5,
      [POKEMON_TYPES.FAIRY]: 0
    },
    [POKEMON_TYPES.DARK]: {
      [POKEMON_TYPES.FIGHTING]: 0.5,
      [POKEMON_TYPES.PSYCHIC]: 2,
      [POKEMON_TYPES.GHOST]: 2,
      [POKEMON_TYPES.DARK]: 0.5,
      [POKEMON_TYPES.FAIRY]: 0.5
    },
    [POKEMON_TYPES.STEEL]: {
      [POKEMON_TYPES.FIRE]: 0.5,
      [POKEMON_TYPES.WATER]: 0.5,
      [POKEMON_TYPES.ELECTRIC]: 0.5,
      [POKEMON_TYPES.ICE]: 2,
      [POKEMON_TYPES.ROCK]: 2,
      [POKEMON_TYPES.STEEL]: 0.5,
      [POKEMON_TYPES.FAIRY]: 2
    },
    [POKEMON_TYPES.FAIRY]: {
      [POKEMON_TYPES.FIRE]: 0.5,
      [POKEMON_TYPES.FIGHTING]: 2,
      [POKEMON_TYPES.POISON]: 0.5,
      [POKEMON_TYPES.DRAGON]: 2,
      [POKEMON_TYPES.DARK]: 2,
      [POKEMON_TYPES.STEEL]: 0.5
    }
  };

  // Constrói a matriz completa 18x18 preenchendo 1 como valor neutro padrão
  const fullMatrix = {};

  for (const atkType of ALL_TYPES) {
    fullMatrix[atkType] = {};
    for (const defType of ALL_TYPES) {
      if (SPECIAL_EFFECTIVENESS[atkType] && SPECIAL_EFFECTIVENESS[atkType][defType] !== undefined) {
        fullMatrix[atkType][defType] = SPECIAL_EFFECTIVENESS[atkType][defType];
      } else {
        fullMatrix[atkType][defType] = 1;
      }
    }
    Object.freeze(fullMatrix[atkType]);
  }

  const TYPE_CHART = Object.freeze(fullMatrix);

  /**
   * Retorna o multiplicador de dano entre um tipo de ataque e um tipo de defesa.
   * @param {string} attackType - Tipo do ataque.
   * @param {string} defenderType - Tipo do defensor.
   * @returns {number} Multiplicador (0, 0.5, 1 ou 2).
   */
  function getTypeEffectiveness(attackType, defenderType) {
    if (!TYPE_CHART[attackType]) {
      throw new Error(`Tipo de ataque desconhecido: "${attackType}".`);
    }
    if (TYPE_CHART[attackType][defenderType] === undefined) {
      throw new Error(`Tipo de defesa desconhecido: "${defenderType}".`);
    }
    return TYPE_CHART[attackType][defenderType];
  }

  const TypeChartModule = Object.freeze({
    ALL_TYPES,
    TYPE_CHART,
    getTypeEffectiveness
  });

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TypeChartModule;
  } else if (typeof window !== 'undefined') {
    window.PBABattle = window.PBABattle || {};
    Object.assign(window.PBABattle, TypeChartModule);
  }
})();
