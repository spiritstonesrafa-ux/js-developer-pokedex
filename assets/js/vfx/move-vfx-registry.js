/**
 * ====================================================================
 * REGISTRO DE ALVOS VISUAIS VFX: (move-vfx-registry.js)
 * ====================================================================
 * Mantém referências aos elementos DOM do palco de batalha e combatentes,
 * calculando trajetórias espaciais relativas sem layout thrashing contínuo.
 *
 * Princípios Fundamentais:
 * - Registra stage container, player target e enemy target;
 * - Tolerante a ambientes headless (fornece coordenadas determinísticas virtuais);
 * - Suporta Node.js (CommonJS) e Navegadores (window.PBABattleVfx).
 */

(function () {
  class MoveVfxRegistry {
    constructor() {
      this.stage = null;
      this.targets = {
        player: null,
        enemy: null
      };
    }

    /**
     * Registra o contêiner de efeitos da arena.
     * @param {HTMLElement|string} stageElement
     */
    registerStage(stageElement) {
      if (typeof document !== 'undefined' && typeof stageElement === 'string') {
        this.stage = document.querySelector(stageElement);
      } else {
        this.stage = stageElement || null;
      }
      return this;
    }

    /**
     * Registra o elemento âncora de um lado (player ou enemy).
     * @param {string} side - 'player' ou 'enemy'.
     * @param {HTMLElement|string} targetElement
     */
    registerTarget(side, targetElement) {
      if (side !== 'player' && side !== 'enemy') {
        throw new Error(`INVALID_SIDE: Lado inválido "${side}". Deve ser "player" ou "enemy".`);
      }

      if (typeof document !== 'undefined' && typeof targetElement === 'string') {
        this.targets[side] = document.querySelector(targetElement);
      } else {
        this.targets[side] = targetElement || null;
      }
      return this;
    }

    /**
     * Retorna o elemento registrado para um lado.
     * @param {string} side
     * @returns {HTMLElement|null}
     */
    getTarget(side) {
      return this.targets[side] || null;
    }

    /**
     * Retorna o contêiner do palco.
     * @returns {HTMLElement|null}
     */
    getStage() {
      return this.stage;
    }

    /**
     * Calcula as coordenadas relativas de origem e destino entre atacante e defensor.
     * Se os elementos estiverem no DOM, usa suas posições reais; caso contrário,
     * retorna coordenadas padrão determinísticas.
     *
     * @param {string} attackerSide - 'player' ou 'enemy'.
     * @param {string} defenderSide - 'player' ou 'enemy'.
     * @returns {Object} { fromX, fromY, toX, toY, deltaX, deltaY, distance, angle }
     */
    getCoordinates(attackerSide, defenderSide) {
      const attElem = this.targets[attackerSide];
      const defElem = this.targets[defenderSide];
      const stageElem = this.stage;

      // Fallback determinístico para ambiente virtual / Node.js
      if (!attElem || !defElem || !stageElem || typeof attElem.getBoundingClientRect !== 'function') {
        const isPlayerAttacking = attackerSide === 'player';
        const fromX = isPlayerAttacking ? 220 : 580;
        const fromY = isPlayerAttacking ? 280 : 160;
        const toX = isPlayerAttacking ? 580 : 220;
        const toY = isPlayerAttacking ? 160 : 280;

        const deltaX = toX - fromX;
        const deltaY = toY - fromY;
        const distance = Math.hypot(deltaX, deltaY);
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

        return {
          fromX,
          fromY,
          toX,
          toY,
          deltaX,
          deltaY,
          distance,
          angle
        };
      }

      const stageRect = stageElem.getBoundingClientRect();
      const attRect = attElem.getBoundingClientRect();
      const defRect = defElem.getBoundingClientRect();

      const fromX = (attRect.left + attRect.width / 2) - stageRect.left;
      const fromY = (attRect.top + attRect.height / 2) - stageRect.top;
      const toX = (defRect.left + defRect.width / 2) - stageRect.left;
      const toY = (defRect.top + defRect.height / 2) - stageRect.top;

      const deltaX = toX - fromX;
      const deltaY = toY - fromY;
      const distance = Math.hypot(deltaX, deltaY);
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

      return {
        fromX,
        fromY,
        toX,
        toY,
        deltaX,
        deltaY,
        distance,
        angle
      };
    }

    /**
     * Limpa referências armazenadas.
     */
    reset() {
      this.targets = {
        player: null,
        enemy: null
      };
      this.stage = null;
    }
  }

  const registryModule = Object.freeze({
    MoveVfxRegistry,
    createVfxRegistry: () => new MoveVfxRegistry()
  });

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = registryModule;
  } else if (typeof window !== 'undefined') {
    window.PBABattleVfx = window.PBABattleVfx || {};
    Object.assign(window.PBABattleVfx, registryModule);
  }
})();
