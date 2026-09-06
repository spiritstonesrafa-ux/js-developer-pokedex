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

  const MOVESET_LOADOUT_SOURCE = Object.freeze({
    API_MOVESET: 'API_MOVESET',
    LIMITED_API_MOVESET: 'LIMITED_API_MOVESET',
    UNSUPPORTED_ENGINE_MOVESET: 'UNSUPPORTED_ENGINE_MOVESET',
    NETWORK_FALLBACK_MOVESET: 'NETWORK_FALLBACK_MOVESET'
  });

  const MOVESET_LIMIT_REASON = Object.freeze({
    NONE: 'NONE',
    ENGINE_CAPABILITY_LIMIT: 'ENGINE_CAPABILITY_LIMIT',
    ZERO_SUPPORTED_ENGINE_MOVES: 'ZERO_SUPPORTED_ENGINE_MOVES',
    NETWORK_FALLBACK: 'NETWORK_FALLBACK'
  });

  const SESSION_CONFIG = Object.freeze({
    TEAM_SIZE: 3,
    MOVE_LOADOUT_MIN: 1,
    MOVE_LOADOUT_MAX: 4,
    MOVE_LOADOUT_TARGET: 4,
    MOVE_DISCOVERY_WINDOW_SIZE: 8,
    MOVE_DISCOVERY_INITIAL_BUDGET: 24,
    MOVE_CANDIDATE_POOL_TARGET: 8,
    MAX_MOVE_DETAIL_REQUESTS_PER_POKEMON: 8, // Mantido para compatibilidade regressiva de testes legados
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

  /**
   * Catálogo de golpes ofensivos cuja mecânica especial de dano/tipo não pode ser representada
   * pelo modelo de batalha atual (PBA-014C-FINAL-HARDENING).
   * Motivos:
   * - 'hidden-power': tipo dinâmico derivado dos IVs do Pokémon (DYNAMIC_TYPE_FROM_IVS).
   */
  const UNSUPPORTED_COMPLEX_MOVES = Object.freeze({
    'hidden-power': Object.freeze({
      name: 'hidden-power',
      category: 'UNSUPPORTED_DYNAMIC_TYPE',
      reason: 'DYNAMIC_TYPE_FROM_IVS'
    })
  });

  /**
   * Determina se um golpe é mecanicamente suportado pelo Battle Engine atual.
   * Descarta status moves, golpes sem poder positivo e golpes com mecânicas especiais não suportadas.
   *
   * @param {Object} moveDetail - Objeto do golpe (com damageClass/power/name).
   * @returns {boolean}
   */
  function isMechanicallySupportedMove(moveDetail) {
    if (!moveDetail || typeof moveDetail !== 'object') return false;
    const name = String(moveDetail.name || '').trim().toLowerCase();
    if (UNSUPPORTED_COMPLEX_MOVES[name]) return false;

    const dmgClass = String(moveDetail.damageClass || moveDetail.damage_class?.name || moveDetail.damage_class || '').toLowerCase();
    if (dmgClass !== 'physical' && dmgClass !== 'special') return false;

    const power = Number(moveDetail.power);
    if (!Number.isFinite(power) || power <= 0) return false;

    return true;
  }

  const constants = {
    BATTLE_UI_STATES,
    SESSION_CONFIG,
    MOVESET_LOADOUT_SOURCE,
    MOVESET_LIMIT_REASON,
    UNSUPPORTED_COMPLEX_MOVES,
    isMechanicallySupportedMove
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = constants;
  } else if (typeof window !== 'undefined') {
    window.PBABattleSession = window.PBABattleSession || {};
    Object.assign(window.PBABattleSession, constants);
  }
})();
