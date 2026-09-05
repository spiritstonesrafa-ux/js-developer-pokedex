/**
 * ====================================================================
 * REGISTRO DE ELEMENTOS DE CÂMERA: (battle-camera-registry.js)
 * ====================================================================
 * Mantém referências aos elementos DOM responsáveis pelo viewport de câmera,
 * palco da arena e overlay de hit flash.
 *
 * Princípios Fundamentais:
 * - CAMERA SYSTEM ≠ GAME RULES;
 * - O wrapper de câmera isola os transforms, impedindo layout thrashing na página;
 * - Tolerante a testes headless (fornece objetos virtuais seguros em Node.js);
 * - Suporta Node.js (CommonJS) e Navegadores (window.PBABattleCamera).
 */

(function () {
  let constantsModule;

  if (typeof module !== 'undefined' && module.exports) {
    constantsModule = require('./battle-camera-constants');
  } else if (typeof window !== 'undefined' && window.PBABattleCamera) {
    constantsModule = window.PBABattleCamera;
  } else {
    constantsModule = {
      CAMERA_SELECTORS: {
        WRAPPER: '[data-battle-camera]',
        STAGE: '[data-battle-stage]',
        FLASH_OVERLAY: '[data-hit-flash]'
      }
    };
  }

  const { CAMERA_SELECTORS } = constantsModule;

  /**
   * Cria um mock virtual de elemento DOM para testes em ambientes headless.
   */
  function createVirtualElement(tagName = 'div') {
    const classSet = new Set();
    return {
      tagName,
      style: {
        transform: '',
        opacity: '',
        transformOrigin: 'center center',
        transition: ''
      },
      classList: {
        add: (...names) => names.forEach(n => classSet.add(n)),
        remove: (...names) => names.forEach(n => classSet.delete(n)),
        contains: (n) => classSet.has(n),
        toggle: (n, force) => {
          if (force !== undefined) {
            if (force) classSet.add(n); else classSet.delete(n);
            return force;
          }
          if (classSet.has(n)) { classSet.delete(n); return false; }
          classSet.add(n); return true;
        }
      },
      getBoundingClientRect: () => ({ top: 0, left: 0, width: 800, height: 450, right: 800, bottom: 450 }),
      animate: (_keyframes, options = {}) => {
        let timer = null;
        const anim = {
          onfinish: null,
          cancel: () => {
            if (timer) clearTimeout(timer);
          },
          finish: () => {
            if (timer) clearTimeout(timer);
            if (typeof anim.onfinish === 'function') anim.onfinish();
          }
        };
        const delay = Math.min(typeof options === 'number' ? options : (options.duration || 5), 5);
        timer = setTimeout(() => {
          if (typeof anim.onfinish === 'function') {
            anim.onfinish();
          }
        }, delay);
        return anim;
      }
    };
  }

  class BattleCameraRegistry {
    constructor() {
      this.cameraWrapper = null;
      this.stage = null;
      this.flashOverlay = null;
      this._virtual = typeof document === 'undefined';
    }

    /**
     * Registra o contêiner de câmera (onde os transforms de shake e punch são aplicados).
     * @param {HTMLElement|string} elementOrSelector
     */
    registerCamera(elementOrSelector) {
      if (typeof document !== 'undefined' && typeof elementOrSelector === 'string') {
        this.cameraWrapper = document.querySelector(elementOrSelector);
      } else {
        this.cameraWrapper = elementOrSelector || null;
      }
      return this;
    }

    /**
     * Registra o palco interno de batalha.
     * @param {HTMLElement|string} elementOrSelector
     */
    registerStage(elementOrSelector) {
      if (typeof document !== 'undefined' && typeof elementOrSelector === 'string') {
        this.stage = document.querySelector(elementOrSelector);
      } else {
        this.stage = elementOrSelector || null;
      }
      return this;
    }

    /**
     * Registra a camada de overlay de hit flash.
     * @param {HTMLElement|string} elementOrSelector
     */
    registerFlashOverlay(elementOrSelector) {
      if (typeof document !== 'undefined' && typeof elementOrSelector === 'string') {
        this.flashOverlay = document.querySelector(elementOrSelector);
      } else {
        this.flashOverlay = elementOrSelector || null;
      }
      return this;
    }

    /**
     * Auto-descobre elementos no DOM a partir dos seletores padrão do contrato.
     */
    autoDiscover() {
      if (typeof document !== 'undefined') {
        if (!this.cameraWrapper) {
          this.cameraWrapper = document.querySelector(CAMERA_SELECTORS.WRAPPER);
        }
        if (!this.stage) {
          this.stage = document.querySelector(CAMERA_SELECTORS.STAGE);
        }
        if (!this.flashOverlay) {
          this.flashOverlay = document.querySelector(CAMERA_SELECTORS.FLASH_OVERLAY);
        }
      }
      return this;
    }

    /**
     * Retorna o wrapper de câmera ativo ou virtual.
     * @returns {HTMLElement}
     */
    getCamera() {
      if (!this.cameraWrapper && this._virtual) {
        this.cameraWrapper = createVirtualElement('div');
      }
      return this.cameraWrapper;
    }

    /**
     * Retorna o palco de batalha ativo ou virtual.
     * @returns {HTMLElement}
     */
    getStage() {
      if (!this.stage && this._virtual) {
        this.stage = createVirtualElement('div');
      }
      return this.stage;
    }

    /**
     * Retorna o overlay de hit flash ativo ou virtual.
     * @returns {HTMLElement}
     */
    getFlashOverlay() {
      if (!this.flashOverlay && this._virtual) {
        this.flashOverlay = createVirtualElement('div');
      }
      return this.flashOverlay;
    }

    /**
     * Verifica se elementos essenciais estão registrados.
     * @returns {boolean}
     */
    hasElements() {
      return Boolean(this.cameraWrapper || this._virtual);
    }

    /**
     * Limpa referências e reseta o registro.
     */
    reset() {
      this.cameraWrapper = null;
      this.stage = null;
      this.flashOverlay = null;
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = BattleCameraRegistry;
  } else if (typeof window !== 'undefined') {
    window.PBABattleCamera = window.PBABattleCamera || {};
    window.PBABattleCamera.BattleCameraRegistry = BattleCameraRegistry;
  }
})();
