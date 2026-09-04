/**
 * ====================================================================
 * SUÍTE DE TESTES: TYPE EFFECTIVENESS (type-effectiveness.test.js)
 * ====================================================================
 * Validação rigorosa dos gates TY01 a TY15 e integridade das 324 relações
 * da tabela completa de tipos da Fase PBA-004.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const BattleConstants = require('../../assets/js/battle/battle-constants.js');
const TypeChart = require('../../assets/js/battle/type-chart.js');
const TypeEffectiveness = require('../../assets/js/battle/type-effectiveness.js');

describe('PHASE PBA-004 — TYPE SYSTEM TEST SUITE', () => {

  // --- TY01: CATALOG ---
  test('TY01 — Catalog: catálogo centralizado reconhece exatamente 18 tipos modernos', () => {
    const types = Object.values(BattleConstants.POKEMON_TYPES);
    assert.equal(types.length, 18, 'Deve haver exatamente 18 tipos modernos');
    assert.equal(TypeChart.ALL_TYPES.length, 18, 'TypeChart deve conter os 18 tipos');

    const expectedTypes = [
      'normal', 'fire', 'water', 'electric', 'grass', 'ice',
      'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
      'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
    ];

    for (const type of expectedTypes) {
      assert.ok(types.includes(type), `Tipo esperado "${type}" deve estar presente no catálogo`);
    }
  });

  // --- TY02: NORMALIZE TYPE ---
  test('TY02 — Normalize Type: normaliza espaços e letras maiúsculas para minúsculas', () => {
    assert.equal(TypeEffectiveness.normalizeType(' FIRE '), 'fire');
    assert.equal(TypeEffectiveness.normalizeType('Water'), 'water');
    assert.equal(TypeEffectiveness.normalizeType('  ELECTRIC  '), 'electric');
  });

  // --- TY03: INVALID TYPE ---
  test('TY03 — Invalid Type: rejeita tipos inexistentes, vazios ou inválidos', () => {
    assert.throws(() => TypeEffectiveness.normalizeType('shadow'), /desconhecido ou inválido/);
    assert.throws(() => TypeEffectiveness.normalizeType('unknown'), /desconhecido ou inválido/);
    assert.throws(() => TypeEffectiveness.normalizeType(''), /vazia/);
    assert.throws(() => TypeEffectiveness.normalizeType(null), /esperado string/);
    assert.throws(() => TypeEffectiveness.normalizeType(undefined), /esperado string/);
    assert.throws(() => TypeEffectiveness.normalizeType(123), /esperado string/);
  });

  // --- TY04: FIRE VS GRASS ---
  test('TY04 — Fire vs Grass: super efetivo (multiplicador 2)', () => {
    const result = TypeEffectiveness.calculate('fire', ['grass']);
    assert.equal(result.multiplier, 2);
    assert.equal(result.classification, BattleConstants.TYPE_EFFECTIVENESS_CLASSIFICATION.SUPER_EFFECTIVE);
  });

  // --- TY05: FIRE VS WATER ---
  test('TY05 — Fire vs Water: pouco efetivo / resistido (multiplicador 0.5)', () => {
    const result = TypeEffectiveness.calculate('fire', ['water']);
    assert.equal(result.multiplier, 0.5);
    assert.equal(result.classification, BattleConstants.TYPE_EFFECTIVENESS_CLASSIFICATION.RESISTED);
  });

  // --- TY06: NORMAL VS GHOST ---
  test('TY06 — Normal vs Ghost: imune (multiplicador 0)', () => {
    const result = TypeEffectiveness.calculate('normal', ['ghost']);
    assert.equal(result.multiplier, 0);
    assert.equal(result.classification, BattleConstants.TYPE_EFFECTIVENESS_CLASSIFICATION.IMMUNE);
  });

  // --- TY07: ELECTRIC VS GROUND ---
  test('TY07 — Electric vs Ground: imune (multiplicador 0)', () => {
    const result = TypeEffectiveness.calculate('electric', ['ground']);
    assert.equal(result.multiplier, 0);
    assert.equal(result.classification, BattleConstants.TYPE_EFFECTIVENESS_CLASSIFICATION.IMMUNE);
  });

  // --- TY08: NEUTRAL ---
  test('TY08 — Neutral: ataque com efetividade neutra (multiplicador 1)', () => {
    const result = TypeEffectiveness.calculate('normal', ['normal']);
    assert.equal(result.multiplier, 1);
    assert.equal(result.classification, BattleConstants.TYPE_EFFECTIVENESS_CLASSIFICATION.NEUTRAL);

    const result2 = TypeEffectiveness.calculate('water', ['normal']);
    assert.equal(result2.multiplier, 1);
    assert.equal(result2.classification, BattleConstants.TYPE_EFFECTIVENESS_CLASSIFICATION.NEUTRAL);
  });

  // --- TY09: DUAL TYPE 4X ---
  test('TY09 — Dual Type 4x: Electric vs Water/Flying resulta em multiplicador 4', () => {
    const result = TypeEffectiveness.calculate('electric', ['water', 'flying']);
    assert.equal(result.multiplier, 4);
    assert.equal(result.classification, BattleConstants.TYPE_EFFECTIVENESS_CLASSIFICATION.SUPER_EFFECTIVE);
  });

  // --- TY10: DUAL TYPE 0.25X ---
  test('TY10 — Dual Type 0.25x: Fire vs Water/Dragon resulta em multiplicador 0.25', () => {
    const result = TypeEffectiveness.calculate('fire', ['water', 'dragon']);
    assert.equal(result.multiplier, 0.25);
    assert.equal(result.classification, BattleConstants.TYPE_EFFECTIVENESS_CLASSIFICATION.RESISTED);
  });

  // --- TY11: DUAL TYPE MIXED NEUTRAL ---
  test('TY11 — Dual Type Mixed Neutral: Fire vs Grass/Water (2 * 0.5 = 1) resulta em dano neutro', () => {
    const result = TypeEffectiveness.calculate('fire', ['grass', 'water']);
    assert.equal(result.multiplier, 1);
    assert.equal(result.classification, BattleConstants.TYPE_EFFECTIVENESS_CLASSIFICATION.NEUTRAL);
  });

  // --- TY12: IMMUNITY PRECEDENCE ---
  test('TY12 — Immunity Precedence: imunidade anula qualquer outro multiplicador (2 * 0 = 0)', () => {
    // Electric vs Water/Ground (Water = 2, Ground = 0 -> 2 * 0 = 0)
    const result = TypeEffectiveness.calculate('electric', ['water', 'ground']);
    assert.equal(result.multiplier, 0);
    assert.equal(result.classification, BattleConstants.TYPE_EFFECTIVENESS_CLASSIFICATION.IMMUNE);

    // Normal vs Ghost/Poison (Ghost = 0, Poison = 1 -> 0 * 1 = 0)
    const result2 = TypeEffectiveness.calculate('normal', ['ghost', 'poison']);
    assert.equal(result2.multiplier, 0);
    assert.equal(result2.classification, BattleConstants.TYPE_EFFECTIVENESS_CLASSIFICATION.IMMUNE);
  });

  // --- TY13: DUPLICATE DEFENDER TYPE ---
  test('TY13 — Duplicate Defender Type: rejeita array com tipos repetidos', () => {
    assert.throws(
      () => TypeEffectiveness.calculate('fire', ['water', 'water']),
      /Tipos duplicados não são permitidos/
    );
  });

  // --- TY14: MORE THAN TWO TYPES ---
  test('TY14 — More Than Two Types: rejeita combatente com mais de 2 tipos', () => {
    assert.throws(
      () => TypeEffectiveness.calculate('fire', ['water', 'grass', 'flying']),
      /Quantidade de tipos inválida/
    );
  });

  // --- TY15: EMPTY TYPES ---
  test('TY15 — Empty Types: rejeita lista de tipos vazia ou nula', () => {
    assert.throws(() => TypeEffectiveness.calculate('fire', []), /Tipos do defensor inválidos/);
    assert.throws(() => TypeEffectiveness.calculate('fire', null), /Tipos do defensor inválidos/);
    assert.throws(() => TypeEffectiveness.calculate('fire', undefined), /Tipos do defensor inválidos/);
  });

  // --- TESTE DE INTEGRIDADE: 324 RELAÇÕES DA TABELA DE TIPOS ---
  test('TYPE_CHART_324_RELATIONS: todas as 324 combinações 18x18 são estritamente resolvíveis', () => {
    const allTypes = TypeChart.ALL_TYPES;
    assert.equal(allTypes.length, 18);

    const validMultipliers = new Set([0, 0.5, 1, 2]);
    let count = 0;

    for (const atk of allTypes) {
      for (const def of allTypes) {
        const mult = TypeChart.getTypeEffectiveness(atk, def);
        assert.ok(
          validMultipliers.has(mult),
          `Relação [${atk} -> ${def}] possui multiplicador inválido: ${mult}`
        );
        count++;
      }
    }

    assert.equal(count, 324, 'Devem ser testadas rigorosamente 324 relações elementais');
  });
});
