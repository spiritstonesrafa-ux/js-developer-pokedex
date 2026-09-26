(function () {
  'use strict';

  const Manager = typeof module !== 'undefined' && module.exports
    ? require('./campaign-manager.js').CampaignManager : window.PBACampaign?.CampaignManager;
  const Catalog = typeof module !== 'undefined' && module.exports
    ? require('./campaign-catalog.js') : window.PBACampaign;
  const Wild = typeof module !== 'undefined' && module.exports
    ? require('./campaign-wild-encounters.js') : window.PBACampaign?.CampaignWildEncounters;
  const C = typeof module !== 'undefined' && module.exports
    ? require('./campaign-constants.js') : window.PBACampaign;
  if (!Manager || !Wild) return;

  const previousRoster = Manager.prototype.getRosterIds;
  const previousChallenge = Manager.prototype.canChallenge;
  const previousConfig = Manager.prototype.getBattleConfig;
  const previousRecord = Manager.prototype.recordBattle;

  function encounterId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return 'wild_' + crypto.randomUUID();
    }
    return 'wild_' + Date.now() + '_' + Math.floor(Wild.randomUnit() * 0x100000000).toString(16);
  }

  Manager.prototype.getRosterIds = function () {
    return [...new Set([...previousRoster.call(this), ...(this.data.wild?.capturedIds || [])])];
  };

  Manager.prototype.beginWildEncounter = function (regionId, roll) {
    if (!Wild.isRegionId(regionId) || !this.isStarted()
      || this.data.status === C.CAMPAIGN_STATUS.COMPLETED || this.data.pendingReward) {
      return { ok: false, reason: 'UNAVAILABLE' };
    }
    const wild = this.data.wild || (this.data.wild = Wild.getDefaultState());
    if (wild.pendingCapture || wild.result) return { ok: false, reason: 'RESOLVE_PREVIOUS' };
    if (wild.active) {
      return wild.active.regionId === regionId
        ? { ok: true, pokemonId: wild.active.pokemonId, resumed: true }
        : { ok: false, reason: 'RESOLVE_PREVIOUS' };
    }
    if (Wild.getRegionCaptureCount(wild, regionId) >= Wild.MAX_CAPTURES_PER_REGION) {
      return { ok: false, reason: 'REGION_LIMIT' };
    }
    const pokemonId = Wild.choose(this.getRosterIds(), roll === undefined ? Wild.randomUnit() : roll, regionId);
    if (!pokemonId) return { ok: false, reason: 'POOL_EMPTY' };
    wild.active = { regionId, pokemonId, encounterId: encounterId() };
    this.save('WILD_ENCOUNTER_STARTED');
    return { ok: true, pokemonId, resumed: false };
  };

  Manager.prototype.cancelWildEncounter = function () {
    if (!this.data.wild?.active || this.data.wild.pendingCapture) return false;
    this.data.wild.active = null;
    this.save('WILD_ENCOUNTER_CANCELLED');
    return true;
  };

  Manager.prototype.canChallenge = function (kind, id) {
    if (kind === 'WILD') {
      return this.isStarted() && !this.data.pendingReward
        && this.data.wild?.active?.pokemonId === Number(id);
    }
    return previousChallenge.call(this, kind, id);
  };

  Manager.prototype.getBattleConfig = function (kind, id, teamIds, options) {
    if (kind !== 'WILD') return previousConfig.call(this, kind, id, teamIds, options);
    if (!this.canChallenge(kind, id)) throw new Error('Encontro selvagem indisponível.');
    const team = [...new Set((teamIds || []).map(Number))];
    if (team.length !== 3 || team.some(pokemonId => !this.getRosterIds().includes(pokemonId))) {
      throw new Error('Escolha exatamente três Pokémon do elenco da campanha.');
    }
    const pokemonId = Number(id);
    const pokemon = Catalog.byId(pokemonId);
    return {
      playerTeamIds: team,
      enemyTeamIds: [pokemonId],
      metadata: {
        mode: 'CAMPAIGN', kind: 'WILD', id: pokemonId, opponentPokemonId: pokemonId,
        regionId: this.data.wild.active.regionId,
        battleFormat: 'TRIAL_3X1', opponentName: 'Pokémon selvagem — ' + pokemon.name
      },
      modifiers: {}
    };
  };

  Manager.prototype.recordBattle = function (result) {
    if (result?.kind !== 'WILD') return previousRecord.call(this, result);
    const wild = this.data.wild;
    const battleId = result.battleId;
    const pokemonId = Number(result.opponentPokemonId ?? result.id);
    if (typeof battleId === 'string' && this.data.processedBattleIds.includes(battleId)) {
      return { processed: false, duplicate: true };
    }
    if (!wild?.active || wild.active.pokemonId !== pokemonId
      || typeof battleId !== 'string' || !battleId || battleId.length >= 100
      || !['player', 'enemy'].includes(result.winner)) {
      return { processed: false, reason: 'INVALID_WILD_RESULT' };
    }
    this.data.processedBattleIds.push(battleId);
    this.data.processedBattleIds = this.data.processedBattleIds.slice(-C.MAX_PROCESSED);
    if (result.winner === 'player') {
      wild.pendingCapture = { ...wild.active, battleId };
    } else {
      wild.result = { status: 'LOST', pokemonId, regionId: wild.active.regionId };
    }
    wild.active = null;
    this.save('WILD_BATTLE_RECORDED');
    return { processed: true, pendingCapture: this.data.wild.pendingCapture };
  };

  Manager.prototype.attemptWildCapture = function (roll) {
    const wild = this.data.wild;
    const pending = wild?.pendingCapture;
    if (!pending) return { ok: false, reason: 'NO_PENDING_CAPTURE' };
    if (roll !== undefined && (!Number.isFinite(roll) || roll < 0 || roll >= 1)) {
      return { ok: false, reason: 'INVALID_ROLL' };
    }
    const captured = Number.isFinite(roll) ? roll < Wild.CAPTURE_CHANCE : Wild.randomUnit() < Wild.CAPTURE_CHANCE;
    if (captured && Wild.getRegionCaptureCount(wild, pending.regionId) < Wild.MAX_CAPTURES_PER_REGION
      && !this.getRosterIds().includes(pending.pokemonId)) {
      wild.capturedIds.push(pending.pokemonId);
      wild.captureRegions[pending.pokemonId] = pending.regionId;
      wild.result = { status: 'CAUGHT', pokemonId: pending.pokemonId, regionId: pending.regionId };
    } else {
      wild.result = { status: 'FLED', pokemonId: pending.pokemonId, regionId: pending.regionId };
    }
    wild.pendingCapture = null;
    this.save('WILD_CAPTURE_RESOLVED');
    return { ok: true, captured: this.data.wild.result.status === 'CAUGHT', pokemonId: pending.pokemonId };
  };

  Manager.prototype.acknowledgeWildResult = function () {
    if (!this.data.wild?.result) return false;
    this.data.wild.result = null;
    this.save('WILD_RESULT_ACKNOWLEDGED');
    return true;
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = { CampaignManager: Manager };
})();
