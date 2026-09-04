/**
 * ====================================================================
 * TESTES UNITÁRIOS: TURN MANAGER (turn-manager.test.js)
 * ====================================================================
 * Valida a regra de iniciativa e determinação de ordem da Fase PBA-003.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const TurnManager = require('../../assets/js/battle/turn-manager.js');

describe('TurnManager Unit Tests', () => {
  test('ordena corretamente quando player possui velocidade maior', () => {
    const order = TurnManager.determineOrder({ speed: 100 }, { speed: 50 });
    assert.deepEqual(order, ['player', 'enemy']);
  });

  test('ordena corretamente quando enemy possui velocidade maior', () => {
    const order = TurnManager.determineOrder({ speed: 45 }, { speed: 90 });
    assert.deepEqual(order, ['enemy', 'player']);
  });

  test('desempata determinística e estritamente em favor do jogador na PBA-003', () => {
    const order = TurnManager.determineOrder({ speed: 70 }, { speed: 70 });
    assert.deepEqual(order, ['player', 'enemy']);
  });

  test('rejeita combatentes com velocidade inválida, NaN ou ausente', () => {
    assert.throws(() => TurnManager.determineOrder(null, { speed: 50 }), /velocidade/);
    assert.throws(() => TurnManager.determineOrder({ speed: 50 }, null), /velocidade/);
    assert.throws(() => TurnManager.determineOrder({ speed: NaN }, { speed: 50 }), /velocidade/);
    assert.throws(() => TurnManager.determineOrder({ speed: 'rápido' }, { speed: 50 }), /velocidade/);
  });
});
