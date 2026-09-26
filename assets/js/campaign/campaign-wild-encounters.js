(function () {
  'use strict';

  const Catalog = typeof module !== 'undefined' && module.exports
    ? require('./campaign-catalog.js') : window.PBACampaign;

  const MAX_REGION_1_CAPTURES = 2;
  const CAPTURE_CHANCE = 0.72;
  const reserved = new Set([
    ...Catalog.MASTER_SPECIES,
    ...Catalog.SUPER_TEAM,
    ...Catalog.LEGENDARY_TRIAL_TEAM,
    ...Catalog.MYTHICAL_TRIAL_TEAM,
    ...Catalog.TITANS_TRIAL_TEAM,
    ...Catalog.CELESTIAL_TRIAL_TEAM
  ].map(pokemon => pokemon.id));

  // A small, biome-appropriate pool for the first playable region. Every entry
  // already has a supported local battle loadout in the campaign draft.
  const REGION_1_POOL = Object.freeze(Catalog.DRAFT
    .filter(pokemon => !pokemon.legendary && !pokemon.mythical
      && !reserved.has(pokemon.id)
      && pokemon.bst >= 250 && pokemon.bst <= 480
      && pokemon.types.some(type => ['normal', 'grass', 'bug', 'water', 'flying'].includes(type)))
    .map(pokemon => pokemon.id));
  const allowed = new Set(REGION_1_POOL);

  function getDefaultState() {
    return { capturedIds: [], active: null, pendingCapture: null, result: null };
  }

  function randomUnit() {
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      const value = new Uint32Array(1);
      crypto.getRandomValues(value);
      return value[0] / 0x100000000;
    }
    return Math.random();
  }

  function getPool(ownedIds = []) {
    const owned = new Set(ownedIds.map(Number));
    return REGION_1_POOL.filter(id => !owned.has(id));
  }

  function choose(ownedIds = [], roll = randomUnit()) {
    const pool = getPool(ownedIds);
    if (!pool.length) return null;
    const normalized = Number.isFinite(roll) ? Math.max(0, Math.min(0.999999999, roll)) : 0;
    return pool[Math.floor(normalized * pool.length)];
  }

  function sanitize(raw, campaign) {
    const clean = getDefaultState();
    if (!raw || typeof raw !== 'object' || !Array.isArray(campaign?.startingRosterIds)
      || campaign.startingRosterIds.length !== 6) return clean;
    const coreOwned = new Set([
      ...campaign.startingRosterIds,
      ...Object.values(campaign.challenges || {}).map(challenge => challenge.rewardPokemonId),
      campaign.superTrainer?.rewardPokemonId,
      ...Object.values(campaign.endgameTrials || {}).map(trial => trial.rewardPokemonId)
    ].filter(Boolean));
    const seen = new Set();
    if (Array.isArray(raw.capturedIds)) {
      for (const value of raw.capturedIds) {
        const id = Number(value);
        if (allowed.has(id) && !coreOwned.has(id) && !seen.has(id)) {
          clean.capturedIds.push(id);
          seen.add(id);
          if (clean.capturedIds.length === MAX_REGION_1_CAPTURES) break;
        }
      }
    }
    const validPokemon = value => allowed.has(Number(value))
      && !coreOwned.has(Number(value)) && !seen.has(Number(value));
    const validEncounterId = value => typeof value === 'string' && value.length > 0 && value.length < 100;
    if (raw.pendingCapture && validPokemon(raw.pendingCapture.pokemonId)
      && validEncounterId(raw.pendingCapture.encounterId)
      && typeof raw.pendingCapture.battleId === 'string'
      && campaign.processedBattleIds.includes(raw.pendingCapture.battleId)) {
      clean.pendingCapture = {
        regionId: 'region-1',
        pokemonId: Number(raw.pendingCapture.pokemonId),
        encounterId: raw.pendingCapture.encounterId,
        battleId: raw.pendingCapture.battleId
      };
    } else if (raw.result && allowed.has(Number(raw.result.pokemonId))
      && ['CAUGHT', 'FLED', 'LOST'].includes(raw.result.status)
      && (raw.result.status !== 'CAUGHT' || seen.has(Number(raw.result.pokemonId)))) {
      clean.result = { status: raw.result.status, pokemonId: Number(raw.result.pokemonId) };
    } else if (raw.active && clean.capturedIds.length < MAX_REGION_1_CAPTURES
      && validPokemon(raw.active.pokemonId) && validEncounterId(raw.active.encounterId)) {
      clean.active = {
        regionId: 'region-1',
        pokemonId: Number(raw.active.pokemonId),
        encounterId: raw.active.encounterId
      };
    }
    return clean;
  }

  const api = Object.freeze({
    REGION_1_POOL, MAX_REGION_1_CAPTURES, CAPTURE_CHANCE,
    getDefaultState, getPool, choose, randomUnit, sanitize
  });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else {
    window.PBACampaign = window.PBACampaign || {};
    window.PBACampaign.CampaignWildEncounters = api;
  }
})();
