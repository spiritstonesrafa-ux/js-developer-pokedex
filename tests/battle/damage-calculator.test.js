/**
 * ====================================================================
 * TESTES UNITÁRIOS: DAMAGE CALCULATOR (damage-calculator.test.js)
 * ====================================================================
 * Valida a fórmula matemática isolada de cálculo de dano e os gates
 * TY16 a TY20 da integração com o sistema de tipos (Fase PBA-004).
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

  // --- TY16: SUPER EFFECTIVE DAMAGE ---
  test('TY16 — Super Effective Damage: dano 2x é maior que dano neutro e segue o multiplicador', () => {
    const baseDamage = DamageCalculator.calculateBaseDamage(50, 50, 40, 50);
    const neutralDamage = DamageCalculator.applyModifier(baseDamage, 1);
    const superEffectiveDamage = DamageCalculator.applyModifier(baseDamage, 2);

    assert.ok(superEffectiveDamage > neutralDamage, 'Dano super efetivo deve ser estritamente maior que o neutro');
    assert.equal(superEffectiveDamage, Math.floor(baseDamage * 2));
  });

  // --- TY17: RESISTANCE DAMAGE ---
  test('TY17 — Resistance Damage: dano com resistência (0.5x) é menor que dano neutro', () => {
    const baseDamage = DamageCalculator.calculateBaseDamage(50, 50, 40, 50);
    const neutralDamage = DamageCalculator.applyModifier(baseDamage, 1);
    const resistedDamage = DamageCalculator.applyModifier(baseDamage, 0.5);

    assert.ok(resistedDamage < neutralDamage, 'Dano resistido deve ser estritamente menor que o neutro');
    assert.equal(resistedDamage, Math.floor(baseDamage * 0.5));
  });

  // --- TY18: IMMUNITY DAMAGE ---
  test('TY18 — Immunity Damage: multiplicador 0 resulta rigorosamente em dano 0', () => {
    const baseDamage = DamageCalculator.calculateBaseDamage(150, 20, 40, 50);
    const immuneDamage = DamageCalculator.applyModifier(baseDamage, 0);

    assert.equal(immuneDamage, 0, 'Dano contra imunidade deve ser exatamente 0');
  });

  // --- TY19: 4X DAMAGE ---
  test('TY19 — 4x Damage: multiplicador 4 quadruplica o dano base', () => {
    const baseDamage = DamageCalculator.calculateBaseDamage(50, 50, 40, 50);
    const quadrupleDamage = DamageCalculator.applyModifier(baseDamage, 4);

    assert.equal(quadrupleDamage, Math.floor(baseDamage * 4));
  });

  // --- TY20: 0.25 DAMAGE ---
  test('TY20 — 0.25 Damage: multiplicador 0.25 reduz para um quarto com piso mínimo de 1', () => {
    const baseDamage = DamageCalculator.calculateBaseDamage(50, 50, 40, 50);
    const quarterDamage = DamageCalculator.applyModifier(baseDamage, 0.25);

    assert.equal(quarterDamage, Math.max(1, Math.floor(baseDamage * 0.25)));

    // Caso extremo com baseDamage baixo que resultaria em 0 sem a regra de piso
    const lowBase = 2;
    const extremeQuarter = DamageCalculator.applyModifier(lowBase, 0.25); // floor(2 * 0.25) = 0 -> piso = 1
    assert.equal(extremeQuarter, 1, 'Mesmo 0.25x deve ter piso de 1 se não for imune');
  });
});
