/* Validated, offline move choices for player-owned campaign Pokémon. */
(function () {
  const Fixed = typeof module !== 'undefined' && module.exports
    ? require('./campaign-fixed-battle-catalog.js') : window.PBACampaign.CampaignFixedBattleCatalog;
  const Extras = typeof module !== 'undefined' && module.exports
    ? require('./campaign-move-options-catalog.js') : window.PBACampaign.CampaignMoveOptionsCatalog;
  const Support = typeof module !== 'undefined' && module.exports
    ? require('../battle-session/battle-session-constants.js') : window.PBABattleSession;

  function getPool(id) {
    const species = Fixed.byId[Number(id)];
    if (!species) return [];
    return [...species.moves, ...(Extras.byId[Number(id)] || [])]
      .map(move => Object.freeze({ ...move }));
  }

  function getDefaultMoveIds(id) {
    return (Fixed.byId[Number(id)]?.moves || []).map(move => move.id);
  }

  function validateSelection(id, moveIds) {
    const species = Fixed.byId[Number(id)];
    if (!species || !Array.isArray(moveIds) || moveIds.length < 1 || moveIds.length > 4) return null;
    const ids = moveIds.map(Number);
    if (ids.some(moveId => !Number.isInteger(moveId) || moveId <= 0) ||
        new Set(ids).size !== ids.length) return null;
    const available = new Map(getPool(id).map(move => [move.id, move]));
    const moves = ids.map(moveId => available.get(moveId));
    if (moves.some(move => !move || !Support.isMechanicallySupportedMove(move))) return null;
    return moves;
  }

  function resolveLoadout(id, moveIds) {
    return (validateSelection(id, moveIds) || Fixed.byId[Number(id)]?.moves || [])
      .map(move => ({ ...move }));
  }

  function sanitizePreferences(raw, allowedIds) {
    const result = {};
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return result;
    const allowed = new Set(allowedIds || []);
    for (const [key, moveIds] of Object.entries(raw)) {
      const id = Number(key);
      if (!Number.isInteger(id) || !allowed.has(id)) continue;
      const moves = validateSelection(id, moveIds);
      if (!moves) continue;
      const ids = moves.map(move => move.id);
      if (JSON.stringify(ids) !== JSON.stringify(getDefaultMoveIds(id))) result[id] = ids;
    }
    return result;
  }

  const api = Object.freeze({ getPool, getDefaultMoveIds, validateSelection,
    resolveLoadout, sanitizePreferences });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else {
    window.PBACampaign = window.PBACampaign || {};
    window.PBACampaign.CampaignMoveOptions = api;
  }
})();
