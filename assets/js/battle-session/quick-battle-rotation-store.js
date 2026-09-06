(function () {
  const ROTATION_STORAGE_KEY = 'battle.quick.opponentRotation';
  const ROTATION_VERSION = 1;
  const MAX_RECENT_TEAMS = 10;
  const MAX_SEEN_IN_CYCLE = 72;
  const emptyRotationState = () => ({ version: ROTATION_VERSION, seenInCycle: [], recentTeams: [], updatedAt: null });

  class QuickBattleRotationStore {
    constructor(options = {}) {
      this.storage = options.storage !== undefined ? options.storage : (typeof localStorage !== 'undefined' ? localStorage : null);
      this.key = options.key || ROTATION_STORAGE_KEY;
      this.memoryState = emptyRotationState();
    }
    sanitize(value) {
      if (!value || value.version !== ROTATION_VERSION || !Array.isArray(value.seenInCycle) || !Array.isArray(value.recentTeams)) return emptyRotationState();
      return {
        version: ROTATION_VERSION,
        seenInCycle: [...new Set(value.seenInCycle.map(Number).filter(Number.isInteger))].slice(0, MAX_SEEN_IN_CYCLE),
        recentTeams: value.recentTeams.filter(t => Array.isArray(t) && t.length === 3)
          .map(t => [...new Set(t.map(Number).filter(Number.isInteger))]).filter(t => t.length === 3).slice(-MAX_RECENT_TEAMS),
        updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : null
      };
    }
    load() {
      if (!this.storage || typeof this.storage.getItem !== 'function') return this.sanitize(this.memoryState);
      try { const raw = this.storage.getItem(this.key); return raw ? this.sanitize(JSON.parse(raw)) : emptyRotationState(); }
      catch (_) { return emptyRotationState(); }
    }
    save(state) {
      const safe = this.sanitize({ ...state, version: ROTATION_VERSION });
      safe.updatedAt = new Date().toISOString();
      this.memoryState = safe;
      if (this.storage && typeof this.storage.setItem === 'function') {
        try { this.storage.setItem(this.key, JSON.stringify(safe)); } catch (_) {}
      }
      return safe;
    }
    reset() {
      this.memoryState = emptyRotationState();
      if (this.storage && typeof this.storage.removeItem === 'function') { try { this.storage.removeItem(this.key); } catch (_) {} }
      return this.memoryState;
    }
  }
  const exportsObj = { QuickBattleRotationStore, ROTATION_STORAGE_KEY, ROTATION_VERSION, MAX_RECENT_TEAMS, MAX_SEEN_IN_CYCLE, emptyRotationState };
  if (typeof module !== 'undefined' && module.exports) module.exports = exportsObj;
  else if (typeof window !== 'undefined') { window.PBABattleSession = window.PBABattleSession || {}; Object.assign(window.PBABattleSession, exportsObj); }
})();