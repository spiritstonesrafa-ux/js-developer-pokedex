/**
 * ====================================================================
 * CONSTANTES DO MOTOR DE BATALHA: BATTLE CONSTANTS (battle-constants.js)
 * ====================================================================
 * Centraliza todos os estados, tipos de eventos, identificadores de ações
 * e parâmetros matemáticos da Fase PBA-003.
 * 
 * Compatível com Node.js (CommonJS) e navegadores (window.PBABattle).
 */

const BATTLE_STATUS = Object.freeze({
  READY: 'READY',
  IN_PROGRESS: 'IN_PROGRESS',
  PLAYER_WIN: 'PLAYER_WIN',
  ENEMY_WIN: 'ENEMY_WIN'
});

const BATTLE_EVENTS = Object.freeze({
  BATTLE_STARTED: 'BATTLE_STARTED',
  TURN_STARTED: 'TURN_STARTED',
  ACTION_STARTED: 'ACTION_STARTED',
  DAMAGE_APPLIED: 'DAMAGE_APPLIED',
  POKEMON_FAINTED: 'POKEMON_FAINTED',
  BATTLE_ENDED: 'BATTLE_ENDED'
});

const BATTLE_ACTIONS = Object.freeze({
  BASIC_ATTACK: 'BASIC_ATTACK'
});

const BATTLE_CONFIG = Object.freeze({
  SIMULATION_LEVEL: 50,
  BASIC_ATTACK_POWER: 40,
  PLAYER_FIRST_ON_SPEED_TIE: true,
  MAX_TURNS_LIMIT: 100
});

const BattleConstants = Object.freeze({
  BATTLE_STATUS,
  BATTLE_EVENTS,
  BATTLE_ACTIONS,
  BATTLE_CONFIG
});

// Suporte universal (Node.js & Browser)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BattleConstants;
} else if (typeof window !== 'undefined') {
  window.PBABattle = window.PBABattle || {};
  Object.assign(window.PBABattle, BattleConstants);
}
