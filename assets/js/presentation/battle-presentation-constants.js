/**
 * ====================================================================
 * CONSTANTES DA APRESENTAÇÃO DE BATALHA: (battle-presentation-constants.js)
 * ====================================================================
 * Define os comandos de apresentação, status de timeline, durações conceituais
 * e configurações padrão da camada de orquestração visual/sonora (Fase PBA-008).
 *
 * Princípios Fundamentais:
 * - GAME ENGINE ≠ PRESENTATION ENGINE;
 * - Zero regras de combate (sem cálculo de dano, tipos ou IA);
 * - Comandos puramente descritivos, serializáveis e determinísticos;
 * - Suporta Node.js (testes automatizados) e Browser (window.PBABattlePresentation).
 */

(function () {
  const PRESENTATION_COMMANDS = Object.freeze({
    BATTLE_INTRO: 'BATTLE_INTRO',
    TURN_INDICATOR: 'TURN_INDICATOR',
    ACTION_FOCUS: 'ACTION_FOCUS',
    MOVE_FOCUS: 'MOVE_FOCUS',
    MOVE_ANNOUNCEMENT: 'MOVE_ANNOUNCEMENT',
    PP_TRANSITION: 'PP_TRANSITION',
    MOVE_MISS_FEEDBACK: 'MOVE_MISS_FEEDBACK',
    STAB_METADATA: 'STAB_METADATA',
    EFFECTIVENESS_FEEDBACK: 'EFFECTIVENESS_FEEDBACK',
    HP_TRANSITION: 'HP_TRANSITION',
    FAINT_SEQUENCE: 'FAINT_SEQUENCE',
    SWITCH_OUT_SEQUENCE: 'SWITCH_OUT_SEQUENCE',
    SWITCH_IN_SEQUENCE: 'SWITCH_IN_SEQUENCE',
    REPLACEMENT_PROMPT: 'REPLACEMENT_PROMPT',
    TEAM_DEFEAT_SEQUENCE: 'TEAM_DEFEAT_SEQUENCE',
    BATTLE_RESULT: 'BATTLE_RESULT'
  });

  const PRESENTATION_STATUS = Object.freeze({
    IDLE: 'IDLE',
    PLAYING: 'PLAYING',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    ERROR: 'ERROR'
  });

  const DEFAULT_DURATIONS = Object.freeze({
    BATTLE_INTRO: 600,
    TURN_INDICATOR: 300,
    ACTION_FOCUS: 200,
    MOVE_FOCUS: 100,
    MOVE_ANNOUNCEMENT: 500,
    PP_TRANSITION: 200,
    MOVE_MISS_FEEDBACK: 400,
    STAB_METADATA: 0,
    EFFECTIVENESS_FEEDBACK: 400,
    HP_TRANSITION: 600,
    FAINT_SEQUENCE: 800,
    SWITCH_OUT_SEQUENCE: 400,
    SWITCH_IN_SEQUENCE: 400,
    REPLACEMENT_PROMPT: 300,
    TEAM_DEFEAT_SEQUENCE: 800,
    BATTLE_RESULT: 1000
  });

  const PRESENTATION_CONFIG = Object.freeze({
    DEFAULT_MAX_CONCURRENT_COMMANDS: 1,
    REDUCED_MOTION_DURATION: 0
  });

  const PresentationConstants = Object.freeze({
    PRESENTATION_COMMANDS,
    PRESENTATION_STATUS,
    DEFAULT_DURATIONS,
    PRESENTATION_CONFIG
  });

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PresentationConstants;
  } else if (typeof window !== 'undefined') {
    window.PBABattlePresentation = window.PBABattlePresentation || {};
    Object.assign(window.PBABattlePresentation, PresentationConstants);
  }
})();
