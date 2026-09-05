/**
 * ====================================================================
 * CONSTANTES DA CÂMERA E IMPACTO DE BATALHA: (battle-camera-constants.js)
 * ====================================================================
 * Define o catálogo de efeitos de câmera, níveis de impacto, magnitudes de shake,
 * micro zoom (punch), flash de impacto, pausas de sustentação (hold) e contratos
 * de acessibilidade e segurança para a apresentação de batalha (Fase PBA-012).
 *
 * Princípios Fundamentais:
 * - CAMERA SYSTEM ≠ GAME RULES;
 * - CAMERA SYSTEM ≠ DAMAGE CALCULATION;
 * - O subsistema de câmera apenas recebe metadata de apresentação já calculada;
 * - Zero acoplamento com regras matemáticas, IA ou engine de combate;
 * - Suporta Node.js (CommonJS) e Browser (window.PBABattleCamera).
 */

(function () {
  /**
   * Catálogo centralizado de efeitos visuais de câmera.
   */
  const CAMERA_EFFECTS = Object.freeze({
    SHAKE: 'SHAKE',
    PUNCH_IN: 'PUNCH_IN',
    PUNCH_OUT: 'PUNCH_OUT',
    HIT_FLASH: 'HIT_FLASH',
    IMPACT_HOLD: 'IMPACT_HOLD'
  });

  /**
   * Níveis discretos de intensidade de impacto para apresentação.
   */
  const IMPACT_LEVELS = Object.freeze({
    NONE: 'NONE',
    LIGHT: 'LIGHT',
    MEDIUM: 'MEDIUM',
    HEAVY: 'HEAVY'
  });

  /**
   * Deslocamento máximo em pixels por nível de impacto (X/Y).
   */
  const SHAKE_MAGNITUDES = Object.freeze({
    [IMPACT_LEVELS.NONE]: 0,
    [IMPACT_LEVELS.LIGHT]: 2.5,
    [IMPACT_LEVELS.MEDIUM]: 5.0,
    [IMPACT_LEVELS.HEAVY]: 8.5
  });

  /**
   * Durações nominais de tremor em milissegundos.
   */
  const SHAKE_DURATIONS = Object.freeze({
    [IMPACT_LEVELS.NONE]: 0,
    [IMPACT_LEVELS.LIGHT]: 150,
    [IMPACT_LEVELS.MEDIUM]: 250,
    [IMPACT_LEVELS.HEAVY]: 350
  });

  /**
   * Escala de micro zoom de impacto (punch) por nível.
   */
  const PUNCH_SCALES = Object.freeze({
    [IMPACT_LEVELS.NONE]: 1.0,
    [IMPACT_LEVELS.LIGHT]: 1.015,
    [IMPACT_LEVELS.MEDIUM]: 1.025,
    [IMPACT_LEVELS.HEAVY]: 1.04
  });

  /**
   * Durações nominais do micro zoom (punch) em milissegundos.
   */
  const PUNCH_DURATIONS = Object.freeze({
    [IMPACT_LEVELS.NONE]: 0,
    [IMPACT_LEVELS.LIGHT]: 120,
    [IMPACT_LEVELS.MEDIUM]: 180,
    [IMPACT_LEVELS.HEAVY]: 240
  });

  /**
   * Opacidade máxima do overlay de flash branco por nível de impacto.
   */
  const FLASH_OPACITIES = Object.freeze({
    [IMPACT_LEVELS.NONE]: 0,
    [IMPACT_LEVELS.LIGHT]: 0.15,
    [IMPACT_LEVELS.MEDIUM]: 0.25,
    [IMPACT_LEVELS.HEAVY]: 0.38
  });

  /**
   * Durações nominais do flash em milissegundos.
   */
  const FLASH_DURATIONS = Object.freeze({
    [IMPACT_LEVELS.NONE]: 0,
    [IMPACT_LEVELS.LIGHT]: 100,
    [IMPACT_LEVELS.MEDIUM]: 140,
    [IMPACT_LEVELS.HEAVY]: 180
  });

  /**
   * Duração da pausa de apresentação pós-impacto em milissegundos.
   * Não afeta o relógio do Battle Engine nem introduz slow motion global.
   */
  const IMPACT_HOLD_DURATIONS = Object.freeze({
    [IMPACT_LEVELS.NONE]: 0,
    [IMPACT_LEVELS.LIGHT]: 0,
    [IMPACT_LEVELS.MEDIUM]: 40,
    [IMPACT_LEVELS.HEAVY]: 80
  });

  /**
   * Limites de segurança para evitar desconforto visual e riscos fotossensíveis.
   */
  const SAFETY_LIMITS = Object.freeze({
    MAX_SHAKE_MAGNITUDE: 12.0,
    MAX_PUNCH_SCALE: 1.06,
    MAX_FLASH_OPACITY: 0.5,
    MAX_HOLD_DURATION: 150,
    NO_STROBE_EFFECT: true,
    NO_RAPID_FLASH_PATTERN: true
  });

  /**
   * Contrato de seletores e atributos DOM da câmera.
   */
  const CAMERA_SELECTORS = Object.freeze({
    WRAPPER: '[data-battle-camera]',
    STAGE: '[data-battle-stage]',
    FLASH_OVERLAY: '[data-hit-flash]'
  });

  const BattleCameraConstants = Object.freeze({
    CAMERA_EFFECTS,
    IMPACT_LEVELS,
    SHAKE_MAGNITUDES,
    SHAKE_DURATIONS,
    PUNCH_SCALES,
    PUNCH_DURATIONS,
    FLASH_OPACITIES,
    FLASH_DURATIONS,
    IMPACT_HOLD_DURATIONS,
    SAFETY_LIMITS,
    CAMERA_SELECTORS
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = BattleCameraConstants;
  } else if (typeof window !== 'undefined') {
    window.PBABattleCamera = window.PBABattleCamera || {};
    Object.assign(window.PBABattleCamera, BattleCameraConstants);
  }
})();
