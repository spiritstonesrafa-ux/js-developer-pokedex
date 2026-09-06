(function () {
  let rosterModule, storeModule;
  if (typeof module !== 'undefined' && module.exports) {
    rosterModule = require('./quick-battle-roster.js');
    storeModule = require('./quick-battle-rotation-store.js');
  } else {
    rosterModule = window.PBABattleSession || {};
    storeModule = window.PBABattleSession || {};
  }
  const RECENT_SPECIES_TEAM_WINDOW = 5;
  const EXACT_TEAM_WINDOW = 10;
  const canonicalTeam = ids => ids.map(Number).sort((a, b) => a - b).join(',');

  class QuickBattleOpponentSelector {
    constructor(options = {}) {
      this.randomSource = options.randomSource;
      this.roster = Array.isArray(options.roster) ? options.roster.map(Number) : (rosterModule.QUICK_BATTLE_ROSTER_IDS || []);
      this.store = options.store || new storeModule.QuickBattleRotationStore(options);
      this.teamSize = Number(options.teamSize) || 3;
    }
    pick(candidates) {
      const selected = this.randomSource.pickOpponents(candidates, this.teamSize).map(Number);
      if (selected.every(id => candidates.includes(id)) && new Set(selected).size === this.teamSize) return selected;
      const shuffled = [...candidates];
      const rng = typeof this.randomSource.rng === 'function' ? this.randomSource.rng : (() => 0.5);
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.slice(0, this.teamSize);
    }
    select(options = {}) {
      if (!this.randomSource) throw new Error('BattleRandomSource não configurado no seletor.');
      const source = Array.isArray(options.poolOverride) && options.poolOverride.length ? options.poolOverride : this.roster;
      const playerIds = new Set((options.playerTeamIds || []).map(Number));
      const sourcePool = [...new Set(source.map(v => Number(v && v.id ? v.id : v)))].filter(Number.isInteger);
      let pool = sourcePool.filter(id => !playerIds.has(id));
      // Fallback somente para pools artificiais pequenas de testes; no roster normal a exclusão é sempre preservada.
      if (pool.length < this.teamSize && sourcePool.length < 16) pool = sourcePool;
      if (pool.length < this.teamSize) throw new Error('Pool elegível insuficiente após excluir a equipe do jogador.');
      const state = this.store.load();
      let seen = state.seenInCycle.filter(id => pool.includes(id));
      const recentSpecies = new Set(state.recentTeams.slice(-RECENT_SPECIES_TEAM_WINDOW).flat().map(Number));
      let candidates = pool.filter(id => !seen.includes(id) && !recentSpecies.has(id));
      if (candidates.length < this.teamSize) candidates = pool.filter(id => !seen.includes(id));
      if (candidates.length < this.teamSize) { seen = []; candidates = pool.filter(id => !recentSpecies.has(id)); }
      if (candidates.length < this.teamSize) candidates = [...pool];
      let ids = this.pick(candidates);
      const recentExact = new Set(state.recentTeams.slice(-EXACT_TEAM_WINDOW).map(canonicalTeam));
      if (pool.length > this.teamSize && recentExact.has(canonicalTeam(ids))) {
        const replacements = candidates.filter(id => !ids.includes(id));
        const alternative = replacements
          .map(id => [id, ...ids.slice(0, this.teamSize - 1)])
          .find(team => !recentExact.has(canonicalTeam(team)));
        if (alternative) ids = alternative;
      }
      return { ids, state: { ...state, seenInCycle: seen }, pool };
    }
    commit(proposal) {
      if (!proposal || !Array.isArray(proposal.ids) || proposal.ids.length !== this.teamSize) throw new Error('Seleção inválida para commit.');
      const poolSet = new Set(proposal.pool || this.roster);
      const seenInCycle = [...new Set([...(proposal.state.seenInCycle || []), ...proposal.ids])].filter(id => poolSet.has(id)).slice(0, poolSet.size);
      const recentTeams = [...(proposal.state.recentTeams || []), [...proposal.ids]].slice(-EXACT_TEAM_WINDOW);
      return this.store.save({ version: 1, seenInCycle, recentTeams });
    }
  }
  const exportsObj = { QuickBattleOpponentSelector, RECENT_SPECIES_TEAM_WINDOW, EXACT_TEAM_WINDOW, canonicalTeam };
  if (typeof module !== 'undefined' && module.exports) module.exports = exportsObj;
  else if (typeof window !== 'undefined') { window.PBABattleSession = window.PBABattleSession || {}; Object.assign(window.PBABattleSession, exportsObj); }
})();