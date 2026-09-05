/**
 * ====================================================================
 * FONTE EXTERNA DE ALEATORIEDADE: (battle-random-source.js)
 * ====================================================================
 * Provedor desacoplado de aleatoriedade externa para rolagens de acurácia
 * e seleção de oponentes no Quick Battle da Fase PBA-013.
 *
 * Princípios:
 * - ENGINE_INTERNAL_RNG = 0 (BattleEngine permanece 100% determinístico);
 * - AI_INTERNAL_RNG = 0 (BattleAI permanece 100% determinística);
 * - RUNTIME_RANDOM_SOURCE_INJECTABLE = YES (testes injetam sementes ou listas fixas);
 * - No navegador runtime utiliza crypto.getRandomValues() para alta entropia.
 *
 * Suporta Node.js (CommonJS) e Navegadores (window.PBABattleSession).
 */

(function () {
  /**
   * Gera um número pseudo-aleatório float no intervalo [0, 1) usando crypto seguro quando disponível.
   * @returns {number} Float entre 0 (inclusivo) e 1 (exclusivo).
   */
  function defaultCryptoRandom() {
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      const buffer = new Uint32Array(1);
      crypto.getRandomValues(buffer);
      return buffer[0] / (0xFFFFFFFF + 1);
    }
    return Math.random();
  }

  class BattleRandomSource {
    /**
     * @param {Object} [options]
     * @param {Function} [options.rng] - Gerador de números aleatórios [0, 1).
     * @param {number[]} [options.accuracySequence] - Fila fixa de rolagens (1..100) para testes.
     * @param {number[]} [options.opponentSequence] - Lista fixa de IDs de oponentes para testes.
     */
    constructor(options = {}) {
      this.rng = typeof options.rng === 'function' ? options.rng : defaultCryptoRandom;
      this.accuracySequence = Array.isArray(options.accuracySequence) ? [...options.accuracySequence] : null;
      this.damageSequence = Array.isArray(options.damageSequence) ? [...options.damageSequence] : null;
      this.opponentSequence = Array.isArray(options.opponentSequence) ? [...options.opponentSequence] : null;
    }

    /**
     * Realiza uma rolagem de acurácia no intervalo inteiro [1, 100].
     * Se houver uma sequência injetada, consome o primeiro valor.
     * @returns {number} Inteiro entre 1 e 100.
     */
    rollAccuracy() {
      if (this.accuracySequence && this.accuracySequence.length > 0) {
        const next = this.accuracySequence.shift();
        const intVal = Math.floor(Number(next));
        return Math.max(1, Math.min(100, intVal));
      }

      const floatVal = this.rng();
      return Math.floor(floatVal * 100) + 1;
    }

    /**
     * Realiza uma rolagem de variação de dano no intervalo inteiro [85, 100].
     * Se houver uma sequência injetada, consome o primeiro valor.
     * @returns {number} Inteiro entre 85 e 100.
     */
    rollDamage() {
      if (this.damageSequence && this.damageSequence.length > 0) {
        const next = this.damageSequence.shift();
        const intVal = Math.floor(Number(next));
        return Math.max(85, Math.min(100, intVal));
      }

      const floatVal = this.rng();
      return Math.floor(floatVal * 16) + 85;
    }

    /**
     * Seleciona `count` oponentes distintos da pool especificada sem repetição de espécie.
     * @param {number[]} pool - Array de IDs de Pokémon disponíveis.
     * @param {number} [count=3] - Quantidade de oponentes a selecionar.
     * @returns {number[]} Array com `count` IDs únicos.
     */
    pickOpponents(pool, count = 3) {
      if (!Array.isArray(pool) || pool.length === 0) {
        throw new Error('Pool de oponentes inválida ou vazia.');
      }

      if (this.opponentSequence && this.opponentSequence.length >= count) {
        const selected = this.opponentSequence.slice(0, count);
        const unique = new Set(selected);
        if (unique.size === count) {
          return [...selected];
        }
      }

      const available = [...new Set(pool)];
      if (available.length < count) {
        throw new Error(`Pool não possui Pokémon suficientes (${available.length}) para selecionar ${count} sem duplicatas.`);
      }

      // Algoritmo Fisher-Yates shuffle parcial
      const shuffled = [...available];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(this.rng() * (i + 1));
        const temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
      }

      return shuffled.slice(0, count);
    }
  }

  /**
   * Subclasse para testes com total controle determinístico.
   */
  class DeterministicRandomSource extends BattleRandomSource {
    constructor(options = {}) {
      super({
        rng: () => 0.5,
        ...options
      });
    }

    setAccuracySequence(seq) {
      this.accuracySequence = Array.isArray(seq) ? [...seq] : null;
    }

    setDamageSequence(seq) {
      this.damageSequence = Array.isArray(seq) ? [...seq] : null;
    }

    setOpponentSequence(seq) {
      this.opponentSequence = Array.isArray(seq) ? [...seq] : null;
    }
  }

  const exportsObj = {
    BattleRandomSource,
    DeterministicRandomSource
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exportsObj;
  } else if (typeof window !== 'undefined') {
    window.PBABattleSession = window.PBABattleSession || {};
    Object.assign(window.PBABattleSession, exportsObj);
  }
})();
