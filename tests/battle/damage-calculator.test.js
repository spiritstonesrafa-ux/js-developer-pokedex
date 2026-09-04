/**
 * ====================================================================
 * TESTES UNITÁRIOS: DAMAGE CALCULATOR (damage-calculator.test.js)
 * ====================================================================
 * Valida a fórmula matemática isolada de cálculo de dano da Fase PBA-003.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const DamageCalculator = require('../../assets/js/battle/damage-calculator.js');

describe('DamageCalculator Unit Tests', () => {
  test('calcula dano determinístico padrão com valores de referência', () => {
    // Formula: floor(((((2 * 50 / 5) + 2) * 40 * 52 / 43) / 50) + 2)
    // LevelFactor = (100 / 5) + 2 = 22
    // baseCalculation = 22 * 40 * 52 / 43 = 45760 / 43 = 1064.186
    // (1064.186 / 50) + 2 = 21.28 + 2 = 23.28 -> floor = 23
    const damage = DamageCalculator.calculate(52, 43, 40, 50);
    assert.equal(damage, 23, 'Dano calculado deve ser 23 para Attack 52 vs Defense 43');
  });

  test('garante piso mínimo de dano >= 1 mesmo com defesa extrema', () => {
    const damage = DamageCalculator.calculate(1, 10000, 40, 50);
    assert.ok(damage >= 1, 'Dano mínimo nunca deve ser menor que 1');
  });

  test('rejeita valores não numéricos, <= 0, NaN e Infinity', () => {
    assert.throws(() => DamageCalculator.calculate(0, 50), /Valor de Ataque inválido/);
    assert.throws(() => DamageCalculator.calculate(-10, 50), /Valor de Ataque inválido/);
    assert.throws(() => DamageCalculator.calculate(50, 0), /Valor de Defesa inválido/);
    assert.throws(() => DamageCalculator.calculate(50, -5), /Valor de Defesa inválido/);
    assert.throws(() => DamageCalculator.calculate(NaN, 50), /Valor de Ataque inválido/);
    assert.throws(() => DamageCalculator.calculate(50, Infinity), /Valor de Defesa inválido/);
    assert.throws(() => DamageCalculator.calculate(50, 50, 0), /Valor de Poder inválido/);
    assert.throws(() => DamageCalculator.calculate(50, 50, 40, 0), /Valor de Nível inválido/);
  });
});
