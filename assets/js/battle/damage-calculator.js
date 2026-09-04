/**
 * ====================================================================
 * CALCULADORA DE DANO: DAMAGE CALCULATOR (damage-calculator.js)
 * ====================================================================
 * Implementação matemática e determinística do cálculo de dano das Fases PBA-003 e PBA-004.
 * 
 * Estrutura em duas etapas:
 * 1. calculateBaseDamage(attack, defense, power, level) -> Dano base puro (>= 1)
 * 2. applyModifier(baseDamage, multiplier) -> Aplica multiplicador elemental
 * 
 * Regras da Fase PBA-004:
 * - Imunidade (multiplier === 0): Dano final = 0;
 * - Demais multiplicadores (0.25, 0.5, 1, 2, 4): Dano final >= 1 (piso não-imune);
 * - Arredondamento consistente: floor(baseDamage * multiplier).
 */

(function () {
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
     * Calcula o dano base físico puro a partir dos atributos de combate.
     * @param {number} attack - Atributo de ataque do agressor (> 0).
     * @param {number} defense - Atributo de defesa do defensor (> 0).
     * @param {number} [power] - Poder base do movimento (padrão 40).
     * @param {number} [level] - Nível de simulação (padrão 50).
     * @returns {number} Dano base calculado (>= 1).
     */
    function calculateBaseDamage(attack, defense, power = constants.BATTLE_CONFIG.BASIC_ATTACK_POWER, level = constants.BATTLE_CONFIG.SIMULATION_LEVEL) {
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

      // Garante que o dano base seja sempre no mínimo 1
      return Math.max(1, rawDamage);
    }

    /**
     * Aplica o multiplicador de efetividade de tipos sobre o dano base.
     * 
     * Regras:
     * - Se multiplier === 0 (imunidade): dano é rigorosamente 0;
     * - Se multiplier > 0: piso mínimo de 1 (mesmo com 0.25).
     * 
     * @param {number} baseDamage - Dano base calculado (>= 1).
     * @param {number} multiplier - Multiplicador de efetividade (0, 0.25, 0.5, 1, 2, 4).
     * @returns {number} Dano final inteiro.
     */
    function applyModifier(baseDamage, multiplier) {
      const base = Number(baseDamage);
      const mult = Number(multiplier);

      if (!Number.isFinite(base) || base < 0) {
        throw new Error(`Dano base inválido: ${baseDamage}.`);
      }

      if (!Number.isFinite(mult) || mult < 0) {
        throw new Error(`Multiplicador inválido: ${multiplier}. Deve ser um número maior ou igual a zero.`);
      }

      // Imunidade absoluta: resulta em 0 de dano
      if (mult === 0) {
        return 0;
      }

      const modifiedDamage = Math.floor(base * mult);

      // Para ataques não imunes, o piso de dano é sempre 1
      return Math.max(1, modifiedDamage);
    }

    /**
     * Calcula o dano final completo combinando dano base e multiplicador.
     * Mantém total retrocompatibilidade com chamadas sem o parâmetro multiplier (padrão 1).
     * 
     * @param {number} attack - Atributo de ataque do agressor (> 0).
     * @param {number} defense - Atributo de defesa do defensor (> 0).
     * @param {number} [power] - Poder base do movimento (padrão 40).
     * @param {number} [level] - Nível de simulação (padrão 50).
     * @param {number} [multiplier] - Multiplicador elemental (padrão 1).
     * @returns {number} Dano final calculado.
     */
    function calculate(attack, defense, power = constants.BATTLE_CONFIG.BASIC_ATTACK_POWER, level = constants.BATTLE_CONFIG.SIMULATION_LEVEL, multiplier = 1) {
      const baseDamage = calculateBaseDamage(attack, defense, power, level);
      return applyModifier(baseDamage, multiplier);
    }

    return {
      calculateBaseDamage,
      applyModifier,
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
})();
