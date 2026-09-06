/** Opponent hydration factory. Species selection is delegated to QuickBattleOpponentSelector. */
(function () {
  let sessionConstants, randomSourceModule, hydratorModule, rosterModule, selectorModule;
  if (typeof module !== 'undefined' && module.exports) {
    sessionConstants = require('./battle-session-constants.js');
    randomSourceModule = require('./battle-random-source.js');
    hydratorModule = require('./battle-team-hydrator.js');
    rosterModule = require('./quick-battle-roster.js');
    selectorModule = require('./quick-battle-opponent-selector.js');
  } else if (typeof window !== 'undefined') {
    sessionConstants = randomSourceModule = hydratorModule = rosterModule = selectorModule = window.PBABattleSession || {};
  }
  const { SESSION_CONFIG } = sessionConstants || { SESSION_CONFIG: { TEAM_SIZE: 3, KANTO_OPPONENT_POOL: [] } };

  class BattleOpponentFactory {
    constructor(options = {}) {
      this.randomSource = options.randomSource || (randomSourceModule.BattleRandomSource ? new randomSourceModule.BattleRandomSource() : null);
      this.hydrator = options.hydrator || (hydratorModule.BattleTeamHydrator ? new hydratorModule.BattleTeamHydrator() : null);
      this.pool = Array.isArray(options.pool) ? options.pool : (rosterModule.QUICK_BATTLE_ROSTER_IDS || SESSION_CONFIG.KANTO_OPPONENT_POOL);
      this.selector = options.selector || (selectorModule.QuickBattleOpponentSelector
        ? new selectorModule.QuickBattleOpponentSelector({
            randomSource: this.randomSource, roster: this.pool, store: options.rotationStore,
            storage: options.storage, teamSize: SESSION_CONFIG.TEAM_SIZE
          })
        : null);
    }

    async createOpponentTeam(poolOverride = null, selectionOptions = {}) {
      const activePool = Array.isArray(poolOverride) && poolOverride.length ? poolOverride : this.pool;
      if (!this.randomSource) throw new Error('BattleRandomSource não configurado na fábrica de oponentes.');
      if (!this.hydrator) throw new Error('BattleTeamHydrator não configurado na fábrica de oponentes.');

      const proposal = this.selector
        ? this.selector.select({ poolOverride: activePool, playerTeamIds: selectionOptions.playerTeamIds || [] })
        : { ids: this.randomSource.pickOpponents(activePool, SESSION_CONFIG.TEAM_SIZE) };
      const selectedIds = proposal.ids;
      if (!Array.isArray(selectedIds) || selectedIds.length !== SESSION_CONFIG.TEAM_SIZE) {
        throw new Error('A equipe adversária deve conter exatamente 3 integrantes.');
      }
      if (new Set(selectedIds).size !== SESSION_CONFIG.TEAM_SIZE) throw new Error('A equipe adversária contém espécies duplicadas proibidas.');

      const opponentTeam = await this.hydrator.hydrateTeam(selectedIds);
      if (this.selector) this.selector.commit(proposal);
      return opponentTeam;
    }
  }
  const exportsObj = { BattleOpponentFactory };
  if (typeof module !== 'undefined' && module.exports) module.exports = exportsObj;
  else if (typeof window !== 'undefined') { window.PBABattleSession = window.PBABattleSession || {}; Object.assign(window.PBABattleSession, exportsObj); }
})();
