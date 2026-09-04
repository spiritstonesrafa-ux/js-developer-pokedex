/**
 * ====================================================================
 * CONSTANTES DO MOTOR DE BATALHA: BATTLE CONSTANTS (battle-constants.js)
 * ====================================================================
 * Centraliza todos os estados, tipos de eventos, identificadores de ações,
 * catálogo de tipos elementais, categorias de golpe e parâmetros matemáticos
 * das Fases PBA-003, PBA-004 e PBA-005.
 * 
 * Compatível com Node.js (CommonJS) e navegadores (window.PBABattle).
 */

(function () {
  const BATTLE_STATUS = Object.freeze({
    READY: 'READY',
    IN_PROGRESS: 'IN_PROGRESS',
    AWAITING_REPLACEMENT: 'AWAITING_REPLACEMENT',
    PLAYER_WIN: 'PLAYER_WIN',
    ENEMY_WIN: 'ENEMY_WIN'
  });

  const BATTLE_EVENTS = Object.freeze({
    BATTLE_STARTED: 'BATTLE_STARTED',
    TURN_STARTED: 'TURN_STARTED',
    ACTION_STARTED: 'ACTION_STARTED',
    MOVE_SELECTED: 'MOVE_SELECTED',
    MOVE_USED: 'MOVE_USED',
    PP_CHANGED: 'PP_CHANGED',
    MOVE_MISSED: 'MOVE_MISSED',
    STAB_RESOLVED: 'STAB_RESOLVED',
    TYPE_EFFECTIVENESS_RESOLVED: 'TYPE_EFFECTIVENESS_RESOLVED',
    DAMAGE_APPLIED: 'DAMAGE_APPLIED',
    POKEMON_FAINTED: 'POKEMON_FAINTED',
    SWITCH_STARTED: 'SWITCH_STARTED',
    POKEMON_SWITCHED: 'POKEMON_SWITCHED',
    REPLACEMENT_REQUIRED: 'REPLACEMENT_REQUIRED',
    TEAM_DEFEATED: 'TEAM_DEFEATED',
    BATTLE_ENDED: 'BATTLE_ENDED'
  });

  const BATTLE_ACTIONS = Object.freeze({
    MOVE: 'MOVE',
    SWITCH: 'SWITCH',
    BASIC_ATTACK: 'BASIC_ATTACK' // Mantido para compatibilidade
  });

  const SWITCH_REASON = Object.freeze({
    VOLUNTARY: 'VOLUNTARY',
    FAINT_REPLACEMENT: 'FAINT_REPLACEMENT'
  });

  const MOVE_DAMAGE_CLASSES = Object.freeze({
    PHYSICAL: 'physical',
    SPECIAL: 'special',
    STATUS: 'status'
  });

  const POKEMON_TYPES = Object.freeze({
    NORMAL: 'normal',
    FIRE: 'fire',
    WATER: 'water',
    ELECTRIC: 'electric',
    GRASS: 'grass',
    ICE: 'ice',
    FIGHTING: 'fighting',
    POISON: 'poison',
    GROUND: 'ground',
    FLYING: 'flying',
    PSYCHIC: 'psychic',
    BUG: 'bug',
    ROCK: 'rock',
    GHOST: 'ghost',
    DRAGON: 'dragon',
    DARK: 'dark',
    STEEL: 'steel',
    FAIRY: 'fairy'
  });

  const TYPE_EFFECTIVENESS_CLASSIFICATION = Object.freeze({
    IMMUNE: 'IMMUNE',
    RESISTED: 'RESISTED',
    NEUTRAL: 'NEUTRAL',
    SUPER_EFFECTIVE: 'SUPER_EFFECTIVE'
  });

  const BATTLE_CONFIG = Object.freeze({
    SIMULATION_LEVEL: 50,
    BASIC_ATTACK_POWER: 40,
    PLAYER_FIRST_ON_SPEED_TIE: true,
    MAX_TURNS_LIMIT: 100,
    MOVE_LOADOUT_MIN: 1,
    MOVE_LOADOUT_MAX: 4,
    STAB_MULTIPLIER: 1.5,
    TEAM_SIZE: 3
  });

  const AI_STRATEGY = Object.freeze({
    SIMPLE: 'SIMPLE',
    SMART: 'SMART'
  });

  const AI_DECISION_REASON = Object.freeze({
    FIRST_USABLE_MOVE: 'FIRST_USABLE_MOVE',
    BEST_EXPECTED_DAMAGE: 'BEST_EXPECTED_DAMAGE',
    GUARANTEED_KO: 'GUARANTEED_KO',
    AVOID_IMMUNITY_SWITCH: 'AVOID_IMMUNITY_SWITCH',
    STRATEGIC_MATCHUP_SWITCH: 'STRATEGIC_MATCHUP_SWITCH',
    NO_PP_SWITCH: 'NO_PP_SWITCH',
    FIRST_HEALTHY_RESERVE: 'FIRST_HEALTHY_RESERVE',
    BEST_MATCHUP_REPLACEMENT: 'BEST_MATCHUP_REPLACEMENT',
    NO_USABLE_ACTION: 'NO_USABLE_ACTION'
  });

  const AI_CONFIG = Object.freeze({
    KO_BONUS: 1000,
    SMART_SWITCH_MARGIN: 1.3
  });

  const BattleConstants = Object.freeze({
    BATTLE_STATUS,
    BATTLE_EVENTS,
    BATTLE_ACTIONS,
    SWITCH_REASON,
    MOVE_DAMAGE_CLASSES,
    POKEMON_TYPES,
    TYPE_EFFECTIVENESS_CLASSIFICATION,
    BATTLE_CONFIG,
    AI_STRATEGY,
    AI_DECISION_REASON,
    AI_CONFIG
  });

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = BattleConstants;
  } else if (typeof window !== 'undefined') {
    window.PBABattle = window.PBABattle || {};
    Object.assign(window.PBABattle, BattleConstants);
  }
})();
