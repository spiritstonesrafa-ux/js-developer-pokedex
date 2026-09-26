(function () {
  'use strict';

  const Catalog = typeof module !== 'undefined' && module.exports
    ? require('./campaign-catalog.js') : window.PBACampaign;

  const MAX_CAPTURES_PER_REGION = 2;
  const MAX_REGION_1_CAPTURES = MAX_CAPTURES_PER_REGION;
  const CAPTURE_CHANCE = 0.72;
  const RARITY_WEIGHTS = Object.freeze({ COMMON: 70, UNCOMMON: 25, RARE: 5 });
  const REGIONS = Object.freeze({
    'region-1': Object.freeze({
      name: 'Região 1', biome: 'mata', zoneLabel: 'Explorar mata',
      zoneNodeId: 'node-grass', zonePosition: Object.freeze({ x: 28, y: 44 }),
      types: Object.freeze(['normal', 'grass', 'bug', 'water', 'flying']),
      minBst: 250, maxBst: 480
    }),
    'region-2': Object.freeze({
      name: 'Região 2', biome: 'cânion', zoneLabel: 'Explorar cânion',
      zoneNodeId: 'node-ground', zonePosition: Object.freeze({ x: 42, y: 82 }),
      types: Object.freeze(['fighting', 'ground', 'poison', 'rock', 'fire', 'ice']),
      minBst: 300, maxBst: 540
    }),
    'region-3': Object.freeze({
      name: 'Região 3', biome: 'ruínas', zoneLabel: 'Explorar ruínas',
      zoneNodeId: 'node-dark', zonePosition: Object.freeze({ x: 60, y: 72 }),
      types: Object.freeze(['fairy', 'psychic', 'dark', 'ghost', 'steel', 'dragon']),
      minBst: 350, maxBst: 600
    })
  });
  const reserved = new Set([
    ...Catalog.MASTER_SPECIES,
    ...Catalog.SUPER_TEAM,
    ...Catalog.LEGENDARY_TRIAL_TEAM,
    ...Catalog.MYTHICAL_TRIAL_TEAM,
    ...Catalog.TITANS_TRIAL_TEAM,
    ...Catalog.CELESTIAL_TRIAL_TEAM
  ].map(pokemon => pokemon.id));

  // The draft already supplies supported offline moves for every wild species.
  const REGION_POOLS = Object.freeze(Object.fromEntries(Object.entries(REGIONS).map(([regionId, config]) => [
    regionId,
    Object.freeze(Catalog.DRAFT
      .filter(pokemon => !pokemon.legendary && !pokemon.mythical
        && !reserved.has(pokemon.id)
        && pokemon.bst >= config.minBst && pokemon.bst <= config.maxBst
        && pokemon.types.some(type => config.types.includes(type)))
      .map(pokemon => pokemon.id))
  ])));
  const REGION_1_POOL = REGION_POOLS['region-1'];
  const allowedByRegion = Object.fromEntries(Object.entries(REGION_POOLS)
    .map(([regionId, pool]) => [regionId, new Set(pool)]));
  const rarityByRegion = Object.fromEntries(Object.entries(REGION_POOLS).map(([regionId, pool]) => {
    const ranked = [...pool].sort((a, b) => Catalog.byId(a).bst - Catalog.byId(b).bst || a - b);
    const commonEnd = Math.ceil(ranked.length * 0.5);
    const uncommonEnd = Math.ceil(ranked.length * 0.85);
    const rarity = new Map(ranked.map((id, index) => [
      id, index < commonEnd ? 'COMMON' : index < uncommonEnd ? 'UNCOMMON' : 'RARE'
    ]));
    return [regionId, rarity];
  }));

  function isRegionId(regionId) {
    return Object.prototype.hasOwnProperty.call(REGIONS, regionId);
  }

  function getDefaultState() {
    return { capturedIds: [], captureRegions: {}, active: null, pendingCapture: null, result: null };
  }

  function randomUnit() {
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      const value = new Uint32Array(1);
      crypto.getRandomValues(value);
      return value[0] / 0x100000000;
    }
    return Math.random();
  }

  function getRegionCaptureCount(wild, regionId) {
    if (!isRegionId(regionId)) return 0;
    return (wild?.capturedIds || []).filter(id => (wild.captureRegions?.[id] || 'region-1') === regionId).length;
  }

  function getPool(ownedIds = [], regionId = 'region-1') {
    if (!isRegionId(regionId)) return [];
    const owned = new Set(ownedIds.map(Number));
    return REGION_POOLS[regionId].filter(id => !owned.has(id));
  }

  function getRarity(regionId, pokemonId) {
    return isRegionId(regionId) ? rarityByRegion[regionId].get(Number(pokemonId)) || null : null;
  }

  function choose(ownedIds = [], roll = randomUnit(), regionId = 'region-1') {
    const pool = getPool(ownedIds, regionId);
    if (!pool.length) return null;
    const buckets = Object.entries(RARITY_WEIGHTS)
      .map(([rarity, weight]) => ({
        rarity, weight, ids: pool.filter(id => getRarity(regionId, id) === rarity)
      }))
      .filter(bucket => bucket.ids.length);
    const totalWeight = buckets.reduce((sum, bucket) => sum + bucket.weight, 0);
    let position = (Number.isFinite(roll) ? Math.max(0, Math.min(0.999999999, roll)) : 0) * totalWeight;
    for (const bucket of buckets) {
      if (position < bucket.weight) {
        return bucket.ids[Math.min(bucket.ids.length - 1, Math.floor(position / bucket.weight * bucket.ids.length))];
      }
      position -= bucket.weight;
    }
    return buckets[buckets.length - 1].ids.at(-1);
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
        const regionId = raw.captureRegions?.[id] || 'region-1';
        if (isRegionId(regionId) && allowedByRegion[regionId].has(id) && !coreOwned.has(id) && !seen.has(id)
          && getRegionCaptureCount(clean, regionId) < MAX_CAPTURES_PER_REGION) {
          clean.capturedIds.push(id);
          clean.captureRegions[id] = regionId;
          seen.add(id);
        }
      }
    }
    const validPokemon = (regionId, value) => isRegionId(regionId) && allowedByRegion[regionId].has(Number(value))
      && !coreOwned.has(Number(value)) && !seen.has(Number(value));
    const validEncounterId = value => typeof value === 'string' && value.length > 0 && value.length < 100;
    const pending = raw.pendingCapture;
    const pendingRegion = pending?.regionId || 'region-1';
    if (pending && validPokemon(pendingRegion, pending.pokemonId)
      && getRegionCaptureCount(clean, pendingRegion) < MAX_CAPTURES_PER_REGION
      && validEncounterId(pending.encounterId)
      && typeof pending.battleId === 'string' && pending.battleId.length > 0
      && pending.battleId.length < 100
      && campaign.processedBattleIds.includes(pending.battleId)) {
      clean.pendingCapture = {
        regionId: pendingRegion,
        pokemonId: Number(pending.pokemonId),
        encounterId: pending.encounterId,
        battleId: pending.battleId
      };
    } else if (raw.result && ['CAUGHT', 'FLED', 'LOST'].includes(raw.result.status)) {
      const regionId = raw.result.regionId || 'region-1';
      const id = Number(raw.result.pokemonId);
      if (isRegionId(regionId) && allowedByRegion[regionId].has(id)
        && (raw.result.status !== 'CAUGHT' || (seen.has(id) && clean.captureRegions[id] === regionId))) {
        clean.result = { status: raw.result.status, pokemonId: id, regionId };
      }
    } else if (raw.active) {
      const regionId = raw.active.regionId || 'region-1';
      if (validPokemon(regionId, raw.active.pokemonId)
        && getRegionCaptureCount(clean, regionId) < MAX_CAPTURES_PER_REGION
        && validEncounterId(raw.active.encounterId)) {
        clean.active = {
          regionId,
          pokemonId: Number(raw.active.pokemonId),
          encounterId: raw.active.encounterId
        };
      }
    }
    return clean;
  }

  const api = Object.freeze({
    REGIONS, REGION_POOLS, REGION_1_POOL, RARITY_WEIGHTS,
    MAX_CAPTURES_PER_REGION, MAX_REGION_1_CAPTURES, CAPTURE_CHANCE,
    isRegionId, getDefaultState, getRegionCaptureCount, getPool, getRarity, choose, randomUnit, sanitize
  });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else {
    window.PBACampaign = window.PBACampaign || {};
    window.PBACampaign.CampaignWildEncounters = api;
  }
})();
