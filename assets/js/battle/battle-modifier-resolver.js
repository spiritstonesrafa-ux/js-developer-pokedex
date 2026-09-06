(function () {
  const MODIFIER_IDS = Object.freeze({ SHADOW_AURA: 'SHADOW_AURA' });
  function resolveTypeMultiplier(baseMultiplier, context = {}) {
    const base = Number(baseMultiplier);
    if (!Number.isFinite(base) || base < 0) throw new Error('Invalid base type multiplier.');
    const modifiers = context.modifiers || {};
    if (context.attackerSide === 'enemy' && modifiers[MODIFIER_IDS.SHADOW_AURA]) return Math.max(2, base);
    return base;
  }
  const api = Object.freeze({ MODIFIER_IDS, resolveTypeMultiplier });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else { window.PBABattle = window.PBABattle || {}; Object.assign(window.PBABattle, { BattleModifierResolver: api }); }
})();
