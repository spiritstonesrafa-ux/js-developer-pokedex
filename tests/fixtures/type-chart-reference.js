/**
 * ====================================================================
 * REFERÊNCIA CANÔNICA INDEPENDENTE DE TIPOS (type-chart-reference.js)
 * ====================================================================
 * Fixture de teste construída de forma 100% autônoma, sem importar
 * ou reaproveitar a implementação de `type-chart.js`.
 * 
 * Mapeia todas as relações canônicas não-neutras (Gen 6+ com Fairy):
 * - super effective = 2
 * - resisted = 0.5
 * - immune = 0
 * 
 * Qualquer par (atacante, defensor) não explicitamente listado aqui
 * é considerado neutro (multiplicador 1.0).
 */

const CANONICAL_NON_NEUTRAL_RELATIONS = Object.freeze({
  normal: { rock: 0.5, steel: 0.5, ghost: 0 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
});

const CANONICAL_TYPES_LIST = Object.freeze([
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
]);

/**
 * Retorna o multiplicador esperado pela referência canônica autônoma.
 * @param {string} attacker - Tipo atacante.
 * @param {string} defender - Tipo defensor.
 * @returns {number} 0, 0.5, 1 ou 2.
 */
function getCanonicalExpectedMultiplier(attacker, defender) {
  const atk = attacker.trim().toLowerCase();
  const def = defender.trim().toLowerCase();

  if (CANONICAL_NON_NEUTRAL_RELATIONS[atk] && CANONICAL_NON_NEUTRAL_RELATIONS[atk][def] !== undefined) {
    return CANONICAL_NON_NEUTRAL_RELATIONS[atk][def];
  }
  return 1;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CANONICAL_NON_NEUTRAL_RELATIONS,
    CANONICAL_TYPES_LIST,
    getCanonicalExpectedMultiplier
  };
}
