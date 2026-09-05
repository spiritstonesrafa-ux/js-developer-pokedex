/**
 * ====================================================================
 * CONSTANTES DA SESSÃO DE BATALHA: (battle-session-constants.js)
 * ====================================================================
 * Define estados da UI, limites de requisições e pool de oponentes para a
 * camada de orquestração jogável da Battle Arena (PBA-013).
 *
 * Suporta Node.js (CommonJS) e Navegadores (window.PBABattleSession).
 */

(function () {
  const BATTLE_UI_STATES = Object.freeze({
    NO_TEAM: 'NO_TEAM',
    READY: 'READY',
    PREPARING: 'PREPARING',
    BATTLE: 'BATTLE',
    AWAITING_PLAYER_ACTION: 'AWAITING_PLAYER_ACTION',
    RESOLVING: 'RESOLVING',
    AWAITING_PLAYER_REPLACEMENT: 'AWAITING_PLAYER_REPLACEMENT',
    VICTORY: 'VICTORY',
    DEFEAT: 'DEFEAT',
    ERROR: 'ERROR'
  });

  const SESSION_CONFIG = Object.freeze({
    TEAM_SIZE: 3,
    MOVE_LOADOUT_MIN: 1,
    MOVE_LOADOUT_MAX: 4,
    MAX_MOVE_DETAIL_REQUESTS_PER_POKEMON: 8,
    // Pool balanceada de espécies da 1ª Geração (Kanto #1–151) com diversidade elemental
    KANTO_OPPONENT_POOL: Object.freeze([
      3,   // Venusaur (Grass/Poison)
      6,   // Charizard (Fire/Flying)
      9,   // Blastoise (Water)
      25,  // Pikachu (Electric)
      38,  // Ninetales (Fire)
      59,  // Arcanine (Fire)
      65,  // Alakazam (Psychic)
      68,  // Machamp (Fighting)
      94,  // Gengar (Ghost/Poison)
      130, // Gyarados (Water/Flying)
      131, // Lapras (Water/Ice)
      143, // Snorlax (Normal)
      149  // Dragonite (Dragon/Flying)
    ])
  });

  const constants = {
    BATTLE_UI_STATES,
    SESSION_CONFIG
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = constants;
  } else if (typeof window !== 'undefined') {
    window.PBABattleSession = window.PBABattleSession || {};
    Object.assign(window.PBABattleSession, constants);
  }
})();
