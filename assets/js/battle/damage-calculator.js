/**
 * ====================================================================
 * CALCULADORA DE DANO: DAMAGE CALCULATOR (damage-calculator.js)
 * ====================================================================
 * Implementação matemática e determinística do cálculo de dano das Fases
 * PBA-003, PBA-004 e PBA-005.
 * 
 * Pipeline de Dano v2:
 * 1. calculateBaseDamage(attackStat, defenseStat, power, level) -> Dano base puro (>= 1)
 * 2. applyModifier(baseDamage, typeMultiplier, stabMultiplier) -> Aplica STAB e Efetividade
 * 
 * Regras da Fase PBA-005:
 * - Golpes Físicos: utilizam Attack do atacante e Defense do defensor;
 * - Golpes Especiais: utilizam Special Attack do atacante e Special Defense do defensor;
 * - Move Power: utiliza o poder real do golpe executado (não mais constante fixa);
 * - STAB: 1.5x se o tipo do golpe coincide com algum tipo do atacante; 1.0x caso contrário;
 * - Imunidade (typeMultiplier === 0): Dano final é rigorosamente 0 (STAB não supera imunidade);
 * - Não-imunes: Dano final possui piso de 1;
 * - Arredondamento previsível: floor(baseDamage * stabMultiplier * typeMultiplier).
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
        BASIC_ATTACK_POWER: 40,
        STAB_MULTIPLIER: 1.5
      }
    };
  }

  const DamageCalculator = (() => {
    /**
     * Calcula o dano base puro a partir dos atributos de combate e poder do golpe.
     * 
     * @param {number} attackStat - Atributo ofensivo do atacante (Attack ou Sp. Attack > 0).
     * @param {number} defenseStat - Atributo defensivo do defensor (Defense ou Sp. Defense > 0).
     * @param {number} [power] - Poder base do movimento (padrão 40).
     * @param {number} [level] - Nível de simulação (padrão 50).
     * @returns {number} Dano base calculado (>= 1).
     */
    function calculateBaseDamage(attackStat, defenseStat, power = constants.BATTLE_CONFIG.BASIC_ATTACK_POWER, level = constants.BATTLE_CONFIG.SIMULATION_LEVEL) {
      const atk = Number(attackStat);
      const def = Number(defenseStat);
      const pwr = Number(power);
      const lvl = Number(level);

      if (!Number.isFinite(atk) || atk <= 0) {
        throw new Error(`Valor de Ataque inválido: ${attackStat}. Deve ser um número maior que zero.`);
      }

      if (!Number.isFinite(def) || def <= 0) {
        throw new Error(`Valor de Defesa inválido: ${defenseStat}. Deve ser um número maior que zero.`);
      }

      if (!Number.isFinite(pwr) || pwr <= 0) {
        throw new Error(`Valor de Poder inválido: ${power}. Deve ser um número maior que zero.`);
      }

      if (!Number.isFinite(lvl) || lvl <= 0) {
        throw new Error(`Valor de Nível inválido: ${level}. Deve ser um número maior que zero.`);
      }

      // Parte 1: ((2 * level / 5) + 2) -> Para level 50 = ((100 / 5) + 2) = 22
      const levelFactor = Math.floor((2 * lvl) / 5) + 2;

      // Parte 2: (levelFactor * power * attackStat) / defenseStat
      const baseCalculation = (levelFactor * pwr * atk) / def;

      // Parte 3: (baseCalculation / 50) + 2
      const rawDamage = Math.floor(baseCalculation / 50) + 2;

      // Garante que o dano base seja sempre no mínimo 1
      return Math.max(1, rawDamage);
    }

    /**
     * Aplica os modificadores de STAB e Efetividade de tipos sobre o dano base.
     * 
     * Regras:
     * - Se typeMultiplier === 0 (imunidade): dano é rigorosamente 0 (STAB não supera imunidade);
     * - Se typeMultiplier > 0: piso mínimo de 1 (mesmo com 0.25x);
     * - modifiedDamage = floor(baseDamage * stabMultiplier * typeMultiplier).
     * 
     * @param {number} baseDamage - Dano base calculado (>= 1).
     * @param {number} [typeMultiplier] - Multiplicador de tipo (0, 0.25, 0.5, 1, 2, 4).
     * @param {number} [stabMultiplier] - Multiplicador de STAB (1.5 se ativado, 1.0 senão).
     * @returns {number} Dano final inteiro.
     */
    function applyModifier(baseDamage, typeMultiplier = 1, stabMultiplier = 1) {
      const base = Number(baseDamage);
      const typeMult = Number(typeMultiplier);
      const stabMult = Number(stabMultiplier);

      if (!Number.isFinite(base) || base < 0) {
        throw new Error(`Dano base inválido: ${baseDamage}.`);
      }

      if (!Number.isFinite(typeMult) || typeMult < 0) {
        throw new Error(`Multiplicador de tipo inválido: ${typeMultiplier}. Deve ser >= 0.`);
      }

      if (!Number.isFinite(stabMult) || stabMult < 1) {
        throw new Error(`Multiplicador de STAB inválido: ${stabMultiplier}. Deve ser >= 1.`);
      }

      // Imunidade absoluta: anula o golpe independente de STAB ou poder
      if (typeMult === 0) {
        return 0;
      }

      const modifiedDamage = Math.floor(base * stabMult * typeMult);

      // Para ataques não imunes, o piso de dano é sempre 1
      return Math.max(1, modifiedDamage);
    }

    /**
     * Pipeline completo de cálculo de dano físico ou especial com STAB e efetividade.
     * 
     * @param {number} attackStat - Atributo ofensivo do atacante (Attack ou Sp. Attack).
     * @param {number} defenseStat - Atributo defensivo do defensor (Defense ou Sp. Defense).
     * @param {number} [power] - Poder do golpe.
     * @param {number} [level] - Nível simulado.
     * @param {number} [typeMultiplier] - Multiplicador elemental (padrão 1).
     * @param {number} [stabMultiplier] - Multiplicador STAB (padrão 1).
     * @returns {number} Dano final calculado.
     */
    function calculate(attackStat, defenseStat, power = constants.BATTLE_CONFIG.BASIC_ATTACK_POWER, level = constants.BATTLE_CONFIG.SIMULATION_LEVEL, typeMultiplier = 1, stabMultiplier = 1) {
      const baseDamage = calculateBaseDamage(attackStat, defenseStat, power, level);
      return applyModifier(baseDamage, typeMultiplier, stabMultiplier);
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
