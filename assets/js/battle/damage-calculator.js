/**
 * ====================================================================
 * CALCULADORA DE DANO: DAMAGE CALCULATOR (damage-calculator.js)
 * ====================================================================
 * Implementação matemática e determinística do cálculo de dano da Fase PBA-003.
 * 
 * Baseada na fórmula clássica simplificada:
 * damage = floor(((((2 * level / 5) + 2) * power * attack / defense) / 50) + 2)
 * 
 * Regras:
 * - Determinística: sem Math.random(), sem crítico, sem STAB ou fraquezas nesta fase;
 * - Piso de dano: sempre produz no mínimo 1 de dano;
 * - Validação estrita: rejeita inputs menores ou iguais a zero, NaN ou Infinity.
 */

// Importa constantes se em ambiente Node
let constants;
if (typeof module !== 'undefined' && module.exports) {
  constants = require('./battle-constants.js');
} else if (typeof window !== 'undefined' && window.PBABattle) {
  constants = window.PBABattle;
} else {
  constants = {
    BATTLE_CONFIG: {
      SIMULATION_LEVEL: 50,
      BASIC_ATTACK_POWER: 40
    }
  };
}

const DamageCalculator = (() => {
  /**
   * Calcula o dano físico de um ataque básico.
   * @param {number} attack - Atributo de ataque do agressor (> 0).
   * @param {number} defense - Atributo de defesa do defensor (> 0).
   * @param {number} [power] - Poder base do movimento (padrão 40).
   * @param {number} [level] - Nível de simulação (padrão 50).
   * @returns {number} Dano inteiro calculado (>= 1).
   */
  function calculate(attack, defense, power = constants.BATTLE_CONFIG.BASIC_ATTACK_POWER, level = constants.BATTLE_CONFIG.SIMULATION_LEVEL) {
    const atk = Number(attack);
    const def = Number(defense);
    const pwr = Number(power);
    const lvl = Number(level);

    if (!Number.isFinite(atk) || atk <= 0) {
      throw new Error(`Valor de Ataque inválido: ${attack}. Deve ser um número maior que zero.`);
    }

    if (!Number.isFinite(def) || def <= 0) {
      throw new Error(`Valor de Defesa inválido: ${defense}. Deve ser um número maior que zero.`);
    }

    if (!Number.isFinite(pwr) || pwr <= 0) {
      throw new Error(`Valor de Poder inválido: ${power}. Deve ser um número maior que zero.`);
    }

    if (!Number.isFinite(lvl) || lvl <= 0) {
      throw new Error(`Valor de Nível inválido: ${level}. Deve ser um número maior que zero.`);
    }

    // Parte 1: ((2 * level / 5) + 2) -> Para level 50 = ((100 / 5) + 2) = 22
    const levelFactor = Math.floor((2 * lvl) / 5) + 2;

    // Parte 2: (levelFactor * power * attack) / defense
    const baseCalculation = (levelFactor * pwr * atk) / def;

    // Parte 3: (baseCalculation / 50) + 2
    const rawDamage = Math.floor(baseCalculation / 50) + 2;

    // Garante que o dano mínimo seja sempre no mínimo 1
    return Math.max(1, rawDamage);
  }

  return {
    calculate
  };
})();

// Suporte universal (Node.js & Browser)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DamageCalculator;
} else if (typeof window !== 'undefined') {
  window.PBABattle = window.PBABattle || {};
  window.PBABattle.DamageCalculator = DamageCalculator;
}
