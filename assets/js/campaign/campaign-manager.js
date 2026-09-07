(function(){
 let C,Store,Catalog,Visuals;if(typeof module!=='undefined'&&module.exports){C=require('./campaign-constants.js');Store=require('./campaign-store.js');Catalog=require('./campaign-catalog.js');Visuals=require('./campaign-trainer-visuals.js')}else{C=window.PBACampaign;Store=window.PBACampaign.CampaignStore;Catalog=window.PBACampaign;Visuals=window.PBACampaign}
 class CampaignManager{constructor(store=Store){this.store=store;this.data=store.load();this.listeners=[]} notify(e){this.listeners.forEach(f=>f(e,this.getState()))} onChange(f){if(typeof f==='function')this.listeners.push(f)} save(e){this.data=this.store.save(this.data);this.notify(e);return this.getState()} getState(){return JSON.parse(JSON.stringify(this.data))} getRosterIds(){const d=this.data;return [...new Set([...d.startingRosterIds,...Catalog.MASTERS.map(m=>d.challenges[m.challengeId]?.rewardPokemonId).filter(Boolean),d.superTrainer.rewardPokemonId].filter(Boolean))]} getRoster(){return this.getRosterIds().map(Catalog.byId).filter(Boolean)} getBadgeCount(){return Catalog.MASTERS.filter(m=>this.data.challenges[m.challengeId]?.badgeEarned).length} isStarted(){return this.data.startingRosterIds.length===C.START_SIZE} start(ids){if(this.isStarted())return{ok:false,reason:'IMMUTABLE'};const clean=[...new Set((ids||[]).map(Number))].filter(x=>Catalog.DRAFT.some(p=>p.id===x));if(clean.length!==C.START_SIZE)return{ok:false,reason:'REQUIRES_SIX'};if(Catalog.MASTERS.some(m=>m.team.every(p=>clean.includes(p.id))))return{ok:false,reason:'MASTER_REWARD_CONFLICT'};this.data=this.store.getDefaultState();this.data.startingRosterIds=clean;this.data.status=C.CAMPAIGN_STATUS.ACTIVE;this.data.startedAt=new Date().toISOString();this.save('STARTED');return{ok:true}} reset(){this.data=this.store.reset();this.notify('RESET');return this.getState()} getMaster(id){return Catalog.MASTERS.find(m=>m.challengeId===id)||null} canChallenge(kind,id){if(!this.isStarted()||this.data.pendingReward)return false;if(kind==='MASTER')return !!this.getMaster(id);if(kind==='SUPER')return this.getBadgeCount()===18&&this.getRosterIds().length===24&&!this.data.superTrainer.defeated;if(kind==='SHADOW')return this.data.status===C.CAMPAIGN_STATUS.SHADOW_AVAILABLE&&!this.data.shadowTrainer.defeated;return false} getBattleConfig(kind,id,teamIds){if(!this.canChallenge(kind,id))throw new Error('Desafio indisponível.');const team=[...new Set((teamIds||[]).map(Number))];if(team.length!==3||team.some(x=>!this.getRosterIds().includes(x)))throw new Error('Escolha exatamente três Pokémon do elenco da campanha.');let enemy,meta,modifiers={};if(kind==='MASTER'){const m=this.getMaster(id);enemy=m.team.map(x=>x.id);meta={mode:'CAMPAIGN',kind,id,opponentName:`${m.trainerName} — ${m.trainerTitle}`,opponentTrainer:Visuals.getMasterVisual(m.challengeId)}}else if(kind==='SUPER'){enemy=Catalog.SUPER_TEAM.map(x=>x.id);meta={mode:'CAMPAIGN',kind,opponentName:'Super Treinador',opponentTrainer:Visuals.getSpecialTrainerVisual('SUPER')}}else{enemy=Catalog.SUPER_TEAM.map(x=>x.id);modifiers={SHADOW_AURA:true};meta={mode:'CAMPAIGN',kind,opponentName:'Desafio Final',opponentTrainer:Visuals.getSpecialTrainerVisual('SHADOW'),modifiers}}return{playerTeamIds:team,enemyTeamIds:enemy,metadata:meta,modifiers}} recordBattle(result){const {battleId,kind,id,winner}=result||{};if(typeof battleId!=='string'||this.data.processedBattleIds.includes(battleId))return{processed:false,duplicate:true};this.data.processedBattleIds.push(battleId);this.data.processedBattleIds=this.data.processedBattleIds.slice(-C.MAX_PROCESSED);if(kind==='MASTER'){const r=this.data.challenges[id]||{attempts:0,badgeEarned:false,rewardPokemonId:null,rewardBattleId:null};r.attempts++;this.data.challenges[id]=r;if(winner==='player'&&!r.badgeEarned){r.badgeEarned=true;r.rewardBattleId=battleId;this.data.pendingReward={kind:'MASTER',challengeId:id,candidates:this.getMaster(id).team.map(x=>x.id)}}}else if(kind==='SUPER'){this.data.superTrainer.attempts++;if(winner==='player'&&!this.data.superTrainer.defeated){this.data.superTrainer.defeated=true;this.data.pendingReward={kind:'SUPER',challengeId:null,candidates:Catalog.SUPER_TEAM.map(x=>x.id)};this.data.status=C.CAMPAIGN_STATUS.SUPER_REWARD_PENDING;this.data.superTrainer.victorySeen=false}}else if(kind==='SHADOW'){this.data.shadowTrainer.attempts++;if(winner==='player'){this.data.shadowTrainer.defeated=true;this.data.shadowTrainer.battleId=battleId;this.data.status=C.CAMPAIGN_STATUS.COMPLETED}}this.save('BATTLE_RECORDED');return{processed:true,pendingReward:this.data.pendingReward}}acknowledgeSuperVictory(){if(this.data.status!==C.CAMPAIGN_STATUS.SUPER_REWARD_PENDING)return false;this.data.superTrainer.victorySeen=true;this.save('SUPER_VICTORY_SEEN');return true}acknowledgeShadowReveal(){if(!this.data.shadowTrainer.revealed||this.data.shadowTrainer.revealSeen)return false;this.data.shadowTrainer.revealSeen=true;this.save('SHADOW_REVEAL_SEEN');return true} getRewardCandidates(){const p=this.data.pendingReward;if(!p)return[];const owned=new Set(this.getRosterIds());return p.candidates.map(id=>({id,owned:owned.has(id),selectable:!owned.has(id)}))} claimReward(pokemonId){const p=this.data.pendingReward,id=Number(pokemonId);if(!p||!p.candidates.includes(id))return{ok:false,reason:'INVALID_REWARD'};if(this.getRosterIds().includes(id))return{ok:false,reason:'ALREADY_OWNED'};if(p.kind==='MASTER'){const r=this.data.challenges[p.challengeId];r.rewardPokemonId=id;if(this.getBadgeCount()===18)this.data.status=C.CAMPAIGN_STATUS.SUPER_AVAILABLE}else{this.data.superTrainer.rewardPokemonId=id;this.data.status=C.CAMPAIGN_STATUS.SHADOW_AVAILABLE;this.data.shadowTrainer.revealed=true;this.data.shadowTrainer.revealSeen=false}this.data.pendingReward=null;this.save('REWARD_CLAIMED');return{ok:true}} }
 const trialDefinition={LEGENDARY_TRIAL:{key:'legendary',name:'Prova Lendária',team:Catalog.LEGENDARY_TRIAL_TEAM},MYTHICAL_TRIAL:{key:'mythical',name:'Prova Mítica',team:Catalog.MYTHICAL_TRIAL_TEAM},TITANS_TRIAL:{key:'titans',name:'Prova dos Titãs',team:Catalog.TITANS_TRIAL_TEAM},CELESTIAL_TRIAL:{key:'celestial',name:'Prova Celestial',team:Catalog.CELESTIAL_TRIAL_TEAM}};
 const previousRoster=CampaignManager.prototype.getRosterIds,previousCanChallenge=CampaignManager.prototype.canChallenge,previousBattle=CampaignManager.prototype.getBattleConfig,previousRecord=CampaignManager.prototype.recordBattle,previousCandidates=CampaignManager.prototype.getRewardCandidates,previousClaim=CampaignManager.prototype.claimReward;
 const trials=function(manager){if(!manager.data.endgameTrials)manager.data.endgameTrials={legendary:{completed:false,rewardClaimed:false,rewardPokemonId:null,attempts:0},mythical:{completed:false,rewardClaimed:false,rewardPokemonId:null,attempts:0},titans:{completed:false,rewardClaimed:false,rewardPokemonId:null,attempts:0},celestial:{completed:false,rewardClaimed:false,rewardPokemonId:null,attempts:0}};return manager.data.endgameTrials};
 CampaignManager.prototype.getRosterIds=function(){const base=previousRoster.call(this),t=trials(this);return [...new Set([...base,t.legendary.rewardPokemonId,t.mythical.rewardPokemonId,t.titans.rewardPokemonId,t.celestial.rewardPokemonId].filter(Boolean))]};
 CampaignManager.prototype.canChallenge=function(kind,id){if(kind==='LEGENDARY_TRIAL'||kind==='MYTHICAL_TRIAL'||kind==='TITANS_TRIAL'||kind==='CELESTIAL_TRIAL'){return this.isStarted()&&!this.data.pendingReward&&this.getBadgeCount()===18}if(kind==='SUPER')return this.isStarted()&&!this.data.pendingReward&&this.getBadgeCount()===18&&this.getRosterIds().length>=24&&!this.data.superTrainer.defeated;return previousCanChallenge.call(this,kind,id)};
 CampaignManager.prototype.getBattleConfig=function(kind,id,teamIds){if(kind!=='LEGENDARY_TRIAL'&&kind!=='MYTHICAL_TRIAL'&&kind!=='TITANS_TRIAL'&&kind!=='CELESTIAL_TRIAL')return previousBattle.call(this,kind,id,teamIds);if(!this.canChallenge(kind))throw new Error('Desafio indisponível.');const team=[...new Set((teamIds||[]).map(Number))];if(team.length!==3||team.some(x=>!this.getRosterIds().includes(x)))throw new Error('Escolha exatamente três Pokémon do elenco da campanha.');const d=trialDefinition[kind];return {playerTeamIds:team,enemyTeamIds:d.team.map(x=>x.id),metadata:{mode:'CAMPAIGN',kind,opponentName:d.name},modifiers:{}}};
 CampaignManager.prototype.recordBattle=function(result){const kind=result&&result.kind;if(kind!=='LEGENDARY_TRIAL'&&kind!=='MYTHICAL_TRIAL'&&kind!=='TITANS_TRIAL'&&kind!=='CELESTIAL_TRIAL')return previousRecord.call(this,result);const d=trialDefinition[kind],t=trials(this)[d.key],battleId=result.battleId;if(typeof battleId!=='string'||this.data.processedBattleIds.includes(battleId))return {processed:false,duplicate:true};this.data.processedBattleIds.push(battleId);this.data.processedBattleIds=this.data.processedBattleIds.slice(-C.MAX_PROCESSED);t.attempts++;if(result.winner==='player'&&!t.completed){t.completed=true;this.data.pendingReward={kind,challengeId:d.key,candidates:d.team.map(x=>x.id)}}this.save('TRIAL_RECORDED');return {processed:true,pendingReward:this.data.pendingReward}};
 CampaignManager.prototype.getRewardCandidates=function(){const p=this.data.pendingReward;if(p&&(p.kind==='LEGENDARY_TRIAL'||p.kind==='MYTHICAL_TRIAL'||p.kind==='TITANS_TRIAL'||p.kind==='CELESTIAL_TRIAL')){const d=trialDefinition[p.kind],owned=new Set(this.getRosterIds());return d.team.map(x=>({id:x.id,owned:owned.has(x.id),selectable:!owned.has(x.id)}))}return previousCandidates.call(this)};
 CampaignManager.prototype.claimReward=function(pokemonId){const p=this.data.pendingReward;if(!(p&&(p.kind==='LEGENDARY_TRIAL'||p.kind==='MYTHICAL_TRIAL'||p.kind==='TITANS_TRIAL'||p.kind==='CELESTIAL_TRIAL')))return previousClaim.call(this,pokemonId);const d=trialDefinition[p.kind],id=Number(pokemonId),t=trials(this)[d.key];if(!d.team.some(x=>x.id===id)||this.getRosterIds().includes(id))return {ok:false,reason:'ALREADY_OWNED'};if(t.rewardClaimed)return {ok:false,reason:'REWARD_ALREADY_CLAIMED'};t.rewardPokemonId=id;t.rewardClaimed=true;this.data.pendingReward=null;this.save('TRIAL_REWARD_CLAIMED');return {ok:true}};
 const api={CampaignManager};if(typeof module!=='undefined'&&module.exports)module.exports=api;else{window.PBACampaign=window.PBACampaign||{};Object.assign(window.PBACampaign,api)}
})();

/* PBA-015I — Shadow Final Stand: guests are derived at runtime from canonical trial teams. */
(function () {
  let CampaignManager, Catalog, C, Visuals;
  if (typeof module !== 'undefined' && module.exports) {
    CampaignManager = module.exports.CampaignManager;
    Catalog = require('./campaign-catalog.js');
    C = require('./campaign-constants.js');
    Visuals = require('./campaign-trainer-visuals.js');
  } else {
    CampaignManager = window.PBACampaign && window.PBACampaign.CampaignManager;
    Catalog = window.PBACampaign;
    C = window.PBACampaign;
    Visuals = window.PBACampaign;
  }
  if (!CampaignManager) return;
  const trialPools = Object.freeze([
    { key: 'legendary', label: 'Prova Lendária', team: () => Catalog.LEGENDARY_TRIAL_TEAM || [] },
    { key: 'mythical', label: 'Prova Mítica', team: () => Catalog.MYTHICAL_TRIAL_TEAM || [] },
    { key: 'titans', label: 'Prova dos Titãs', team: () => Catalog.TITANS_TRIAL_TEAM || [] },
    { key: 'celestial', label: 'Prova Celestial', team: () => Catalog.CELESTIAL_TRIAL_TEAM || [] }
  ]);
  CampaignManager.prototype.getShadowGuests = function () {
    const trials = this.data.endgameTrials || {};
    const owned = new Set(this.getRosterIds());
    const guests = [];
    for (const definition of trialPools) {
      const progress = trials[definition.key] || {};
      if (!progress.completed || !progress.rewardClaimed || !Number.isInteger(Number(progress.rewardPokemonId))) continue;
      for (const pokemon of definition.team()) {
        if (pokemon.id === Number(progress.rewardPokemonId) || owned.has(pokemon.id) || guests.some(guest => guest.id === pokemon.id)) continue;
        guests.push({ ...pokemon, temporary: true, trialKey: definition.key, trialLabel: definition.label });
      }
    }
    return guests;
  };
  CampaignManager.prototype.getShadowFinalStandArmy = function (leaderId) {
    const permanent = this.getRosterIds().map(Catalog.byId).filter(Boolean);
    const candidates = [...permanent, ...this.getShadowGuests()];
    const unique = candidates.filter((pokemon, index, all) => all.findIndex(other => other.id === pokemon.id) === index);
    const leader = unique.find(pokemon => pokemon.id === Number(leaderId));
    if (!leader) throw new Error('Escolha um líder disponível para o Final Stand.');
    return [leader, ...unique.filter(pokemon => pokemon.id !== leader.id)];
  };
  CampaignManager.prototype.acknowledgeShadowReinforcements = function () {
    if (!this.data.shadowTrainer?.revealed || this.data.shadowTrainer?.reinforcementsSeen) return false;
    this.data.shadowTrainer.reinforcementsSeen = true;
    this.save('SHADOW_REINFORCEMENTS_SEEN');
    return true;
  };
  const previousBattleConfig = CampaignManager.prototype.getBattleConfig;
  CampaignManager.prototype.getBattleConfig = function (kind, id, teamIds) {
    if (kind !== 'SHADOW') return previousBattleConfig.call(this, kind, id, teamIds);
    if (!this.canChallenge(kind, id)) throw new Error('Desafio indisponível.');
    const leaders = [...new Set((teamIds || []).map(Number))];
    if (leaders.length < 1) throw new Error('Escolha exatamente um líder para o Final Stand.');
    const army = this.getShadowFinalStandArmy(leaders[0]);
    return {
      playerTeamIds: army.map(pokemon => pokemon.id),
      enemyTeamIds: Catalog.SUPER_TEAM.map(pokemon => pokemon.id),
      metadata: {
        mode: 'CAMPAIGN', kind: 'SHADOW', battleFormat: 'FINAL_STAND',
        opponentName: 'Shadow Super Trainer', opponentTrainer: Visuals.getSpecialTrainerVisual('SHADOW'),
        permanentRosterCount: this.getRosterIds().length, temporaryGuestCount: this.getShadowGuests().length
      },
      modifiers: { SHADOW_AURA: true }
    };
  };
  if (typeof module !== 'undefined' && module.exports) module.exports.CampaignManager = CampaignManager;
})();