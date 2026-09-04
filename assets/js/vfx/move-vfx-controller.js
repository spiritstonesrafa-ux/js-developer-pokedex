/**
 * ====================================================================
 * CONTROLADOR DE EFEITOS VISUAIS DE GOLPES: (move-vfx-controller.js)
 * ====================================================================
 * Orquestra a execução, concorrência, cancelamento e ciclo de vida dos
 * efeitos visuais de golpes na Battle Arena (Fase PBA-010).
 *
 * Princípios Fundamentais:
 * - POKEMON ANIMATION ≠ MOVE VISUAL EFFECT;
 * - MoveVfxController NÃO decide dano, tipos ou regras;
 * - Política de Concorrência: CANCEL_PREVIOUS;
 * - Gerenciamento de canais: Miss sem impacto de dano, Imunidade sem dano;
 * - Suporta Node.js (CommonJS) e Navegadores (window.PBABattleVfx).
 */

(function () {
  let resolverModule;
  let registryModule;
  let rendererModule;
  let constantsModule;

  if (typeof module !== 'undefined' && module.exports) {
    constantsModule = require('./move-vfx-constants.js');
    resolverModule = require('./move-vfx-resolver.js');
    registryModule = require('./move-vfx-registry.js');
    rendererModule = require('./move-vfx-dom-renderer.js');
  } else if (typeof window !== 'undefined' && window.PBABattleVfx) {
    constantsModule = window.PBABattleVfx;
    resolverModule = window.PBABattleVfx.MoveVfxResolver || window.PBABattleVfx;
    registryModule = window.PBABattleVfx;
    rendererModule = window.PBABattleVfx;
  } else {
    constantsModule = {};
    resolverModule = { resolve: (d) => d };
    registryModule = { MoveVfxRegistry: class {} };
    rendererModule = { MoveVfxDomRenderer: class {} };
  }

  const { MoveVfxRegistry } = registryModule;
  const { MoveVfxDomRenderer } = rendererModule;

  class MoveVfxController {
    /**
     * @param {Object} [options]
     * @param {Object} [options.registry] - Instância de MoveVfxRegistry.
     * @param {Object} [options.renderer] - Instância de MoveVfxDomRenderer.
     * @param {boolean} [options.reducedMotion] - Flag de acessibilidade.
     */
    constructor(options = {}) {
      this.registry = options.registry || (MoveVfxRegistry ? new MoveVfxRegistry() : null);
      this.renderer = options.renderer || (MoveVfxDomRenderer ? new MoveVfxDomRenderer({ registry: this.registry }) : null);
      this.reducedMotion = Boolean(options.reducedMotion);
      this.activeVfx = null;
    }

    /**
     * Define ou atualiza a preferência de acessibilidade.
     * @param {boolean} value
     */
    setReducedMotion(value) {
      this.reducedMotion = Boolean(value);
    }

    /**
     * Executa a animação visual de um golpe entre o atacante e o defensor.
     *
     * @param {Object} moveDataOrDescriptor - Metadados do golpe ou descritor já resolvido.
     * @param {Object} [options] - Opções de execução.
     * @param {string} [options.attackerSide='player'] - 'player' ou 'enemy'.
     * @param {string} [options.defenderSide='enemy'] - 'player' ou 'enemy'.
     * @param {boolean} [options.isMiss=false] - Se o golpe errou.
     * @param {boolean} [options.isImmune=false] - Se houve imunidade de tipo.
     * @param {number} [options.multiplier=1] - Multiplicador de efetividade.
     * @param {boolean} [options.reducedMotion] - Sobrescreve flag local.
     * @returns {Promise<void>}
     */
    playMoveVfx(moveDataOrDescriptor, options = {}) {
      if (!moveDataOrDescriptor || typeof moveDataOrDescriptor !== 'object') {
        return Promise.resolve();
      }

      // Política de concorrência: CANCEL_PREVIOUS
      if (this.activeVfx) {
        this.cancel();
      }

      // Resolução do descritor
      let descriptor;
      if (moveDataOrDescriptor.archetype && moveDataOrDescriptor.colors) {
        descriptor = moveDataOrDescriptor;
      } else {
        const resolver = (resolverModule && resolverModule.resolve)
          ? resolverModule
          : (resolverModule.MoveVfxResolver || resolverModule);
        descriptor = resolver.resolve(moveDataOrDescriptor);
      }

      const mergedOptions = {
        attackerSide: options.attackerSide || 'player',
        defenderSide: options.defenderSide || (options.attackerSide === 'enemy' ? 'player' : 'enemy'),
        isMiss: Boolean(options.isMiss),
        isImmune: Boolean(options.isImmune || options.multiplier === 0),
        multiplier: options.multiplier !== undefined ? Number(options.multiplier) : 1,
        reducedMotion: options.reducedMotion !== undefined ? Boolean(options.reducedMotion) : this.reducedMotion
      };

      let cancelResolver = null;

      const promise = new Promise((resolve, reject) => {
        cancelResolver = () => {
          if (this.renderer) {
            this.renderer.cleanup();
          }
          resolve();
        };

        if (this.renderer) {
          this.renderer.renderMoveEffect(descriptor, mergedOptions)
            .then(() => {
              if (this.activeVfx && this.activeVfx.descriptor === descriptor) {
                this.activeVfx = null;
              }
              resolve();
            })
            .catch((err) => {
              if (this.activeVfx && this.activeVfx.descriptor === descriptor) {
                this.activeVfx = null;
              }
              reject(err);
            });
        } else {
          resolve();
        }
      });

      this.activeVfx = {
        descriptor,
        options: mergedOptions,
        cancel: cancelResolver
      };

      return promise;
    }

    /**
     * Cancela o efeito visual ativo, limpa elementos e temporizadores.
     */
    cancel() {
      if (this.activeVfx) {
        const cancelFn = this.activeVfx.cancel;
        this.activeVfx = null;
        if (cancelFn) cancelFn();
      }

      if (this.renderer) {
        this.renderer.cleanup();
      }
    }

    /**
     * Reseta completamente o subsistema de efeitos visuais para estado neutro.
     */
    reset() {
      this.cancel();
      if (this.registry) {
        this.registry.reset();
      }
    }
  }

  const controllerModule = Object.freeze({
    MoveVfxController,
    createVfxController: (opts) => new MoveVfxController(opts)
  });

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = controllerModule;
  } else if (typeof window !== 'undefined') {
    window.PBABattleVfx = window.PBABattleVfx || {};
    Object.assign(window.PBABattleVfx, controllerModule);
  }
})();
