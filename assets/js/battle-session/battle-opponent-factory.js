/**
 * ====================================================================
 * FÁBRICA DE EQUIPES ADVERSÁRIAS: (battle-opponent-factory.js)
 * ====================================================================
 * Responsável por selecionar e construir a equipe de 3 Pokémon adversários
 * para Quick Battle no simulador (PBA-013).
 *
 * Responsabilidades:
 * - Seleciona exatamente 3 espécies sem duplicatas (ENEMY_DUPLICATE_SPECIES = NO);
 * - Utiliza a fonte injetável de aleatoriedade (BattleRandomSource);
 * - Delega a hidratação completa ao BattleTeamHydrator;
 * - Define o índice 0 como o Líder inicial adversário;
 * - Desacoplado da Battle AI e do Battle Engine.
 *
 * Suporta Node.js (CommonJS) e Navegadores (window.PBABattleSession).
 */

(function () {
  let sessionConstants;
  let randomSourceModule;
  let hydratorModule;

  if (typeof module !== 'undefined' && module.exports) {
    sessionConstants = require('./battle-session-constants.js');
    randomSourceModule = require('./battle-random-source.js');
    hydratorModule = require('./battle-team-hydrator.js');
  } else if (typeof window !== 'undefined') {
    sessionConstants = window.PBABattleSession || {};
    randomSourceModule = window.PBABattleSession || {};
    hydratorModule = window.PBABattleSession || {};
  }

  const { SESSION_CONFIG } = sessionConstants || {
    SESSION_CONFIG: {
      TEAM_SIZE: 3,
      KANTO_OPPONENT_POOL: [3, 6, 9, 25, 38, 59, 65, 68, 94, 130, 131, 143, 149]
    }
  };

  class BattleOpponentFactory {
    /**
     * @param {Object} [options]
     * @param {Object} [options.hydrator] - Instância de BattleTeamHydrator.
     * @param {Object} [options.randomSource] - Instância de BattleRandomSource.
     * @param {number[]} [options.pool] - Pool padrão de espécies de oponentes.
     */
    constructor(options = {}) {
      this.randomSource = options.randomSource || (
        randomSourceModule.BattleRandomSource ? new randomSourceModule.BattleRandomSource() : null
      );
      this.hydrator = options.hydrator || (
        hydratorModule.BattleTeamHydrator ? new hydratorModule.BattleTeamHydrator() : null
      );
      this.pool = Array.isArray(options.pool) ? options.pool : SESSION_CONFIG.KANTO_OPPONENT_POOL;
    }

    /**
     * Cria uma equipe adversária de exatamente 3 Pokémon válidos.
     * @param {number[]} [poolOverride] - Pool customizada para testes determinísticos.
     * @returns {Promise<Object[]>} Array com 3 combatentes normalizados.
     */
    async createOpponentTeam(poolOverride = null) {
      const activePool = Array.isArray(poolOverride) && poolOverride.length > 0 ? poolOverride : this.pool;

      if (!this.randomSource) {
        throw new Error('BattleRandomSource não configurado na fábrica de oponentes.');
      }
      if (!this.hydrator) {
        throw new Error('BattleTeamHydrator não configurado na fábrica de oponentes.');
      }

      // Seleciona 3 IDs sem duplicatas
      const selectedIds = this.randomSource.pickOpponents(activePool, SESSION_CONFIG.TEAM_SIZE);

      if (!Array.isArray(selectedIds) || selectedIds.length !== SESSION_CONFIG.TEAM_SIZE) {
        throw new Error(`A equipe adversária deve conter exatamente ${SESSION_CONFIG.TEAM_SIZE} integrantes.`);
      }

      const uniqueCheck = new Set(selectedIds);
      if (uniqueCheck.size !== SESSION_CONFIG.TEAM_SIZE) {
        throw new Error('A equipe adversária contém espécies duplicadas proibidas.');
      }

      // Hidrata os combatentes
      const opponentTeam = await this.hydrator.hydrateTeam(selectedIds);

      return opponentTeam;
    }
  }

  const exportsObj = {
    BattleOpponentFactory
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exportsObj;
  } else if (typeof window !== 'undefined') {
    window.PBABattleSession = window.PBABattleSession || {};
    Object.assign(window.PBABattleSession, exportsObj);
  }
})();
