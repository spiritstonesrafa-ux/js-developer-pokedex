const test=require('node:test');
const assert=require('node:assert/strict');
const mem=new Map();
global.localStorage={getItem:key=>mem.get(key)||null,setItem:(key,value)=>mem.set(key,String(value)),removeItem:key=>mem.delete(key)};
const C=require('../../assets/js/campaign/campaign-constants');
const K=require('../../assets/js/campaign/campaign-catalog');
const S=require('../../assets/js/campaign/campaign-store');
const {CampaignManager}=require('../../assets/js/campaign/campaign-manager');
const {BattleTeamHydrator}=require('../../assets/js/battle-session/battle-team-hydrator');
function fresh(clear=true){if(clear)mem.clear();return new CampaignManager(S)}
function start(manager){assert.equal(manager.start(K.DRAFT.slice(0,6).map(p=>p.id)).ok,true)}
function unlock18(manager){start(manager);for(const master of K.MASTERS){assert.equal(manager.recordBattle({battleId:`master-${master.challengeId}`,kind:'MASTER',id:master.challengeId,winner:'player'}).processed,true);assert.equal(manager.claimReward(manager.getRewardCandidates().find(candidate=>candidate.selectable).id).ok,true)}assert.equal(manager.getBadgeCount(),18);assert.equal(manager.getRosterIds().length,24)}
function trial(manager,kind,battleId){const team=manager.getRosterIds().slice(0,3);const config=manager.getBattleConfig(kind,null,team);assert.equal(config.enemyTeamIds.length,3);assert.equal(config.metadata.kind,kind);assert.deepEqual(config.modifiers,{});return manager.recordBattle({battleId,kind,winner:'player'})}

test('PBA-015E canonical trial teams are battle-compatible and exclude the Super team',()=>{
  assert.deepEqual(K.LEGENDARY_TRIAL_TEAM.map(p=>p.id),[145,245,381]);
  assert.deepEqual(K.MYTHICAL_TRIAL_TEAM.map(p=>p.id),[151,385,494]);
  const forbidden=new Set(K.SUPER_TEAM.map(p=>p.id));
  for(const pokemon of [...K.LEGENDARY_TRIAL_TEAM,...K.MYTHICAL_TRIAL_TEAM]){assert.ok(!forbidden.has(pokemon.id));assert.ok(pokemon.name);assert.ok(pokemon.types.length);assert.ok(pokemon.bst>0);assert.ok(K.byId(pokemon.id))}
});

test('PBA-015E Legendary trial persists pending reward, grants exactly one unique roster member and permits replay',()=>{
  const manager=fresh();unlock18(manager);assert.equal(manager.canChallenge('LEGENDARY_TRIAL'),true);assert.equal(trial(manager,'LEGENDARY_TRIAL','legendary-win').processed,true);assert.equal(manager.getState().endgameTrials.legendary.completed,true);assert.equal(manager.getState().pendingReward.kind,'LEGENDARY_TRIAL');
  const reloaded=fresh(false);assert.equal(reloaded.getState().endgameTrials.legendary.completed,true);assert.equal(reloaded.getState().pendingReward.kind,'LEGENDARY_TRIAL');const reward=reloaded.getRewardCandidates().find(candidate=>candidate.selectable);assert.ok(reward);assert.equal(reloaded.claimReward(reward.id).ok,true);assert.equal(reloaded.getState().endgameTrials.legendary.rewardClaimed,true);assert.ok(reloaded.getRosterIds().includes(reward.id));assert.equal(reloaded.getRosterIds().length,25);
  const claimedReload=fresh(false);assert.equal(claimedReload.getState().endgameTrials.legendary.rewardClaimed,true);assert.ok(claimedReload.getRosterIds().includes(reward.id));assert.equal(claimedReload.canChallenge('LEGENDARY_TRIAL'),true);assert.equal(trial(claimedReload,'LEGENDARY_TRIAL','legendary-replay').pendingReward,null);assert.equal(claimedReload.claimReward(reward.id).ok,false);assert.equal(new Set(claimedReload.getRosterIds()).size,claimedReload.getRosterIds().length);
});

test('PBA-015E Mythical trial persists pending reward, grants exactly one unique roster member and permits replay',()=>{
  const manager=fresh();unlock18(manager);assert.equal(manager.canChallenge('MYTHICAL_TRIAL'),true);assert.equal(trial(manager,'MYTHICAL_TRIAL','mythical-win').processed,true);assert.equal(manager.getState().pendingReward.kind,'MYTHICAL_TRIAL');
  const reloaded=fresh(false);const reward=reloaded.getRewardCandidates().find(candidate=>candidate.selectable);assert.ok(reward);assert.equal(reloaded.claimReward(reward.id).ok,true);assert.equal(reloaded.getState().endgameTrials.mythical.rewardClaimed,true);assert.equal(reloaded.getRosterIds().length,25);const claimedReload=fresh(false);assert.equal(claimedReload.getState().endgameTrials.mythical.rewardClaimed,true);assert.equal(trial(claimedReload,'MYTHICAL_TRIAL','mythical-replay').pendingReward,null);assert.equal(new Set(claimedReload.getRosterIds()).size,claimedReload.getRosterIds().length);
});

test('PBA-015E trial rewards support final rosters of 25, 26 and 27 without relocking Super',()=>{
  const manager=fresh();unlock18(manager);const first=trial(manager,'LEGENDARY_TRIAL','legendary-roster');assert.equal(first.processed,true);assert.equal(manager.claimReward(manager.getRewardCandidates().find(candidate=>candidate.selectable).id).ok,true);assert.equal(manager.getRosterIds().length,25);assert.equal(manager.canChallenge('SUPER'),true);const second=trial(manager,'MYTHICAL_TRIAL','mythical-roster');assert.equal(second.processed,true);assert.equal(manager.claimReward(manager.getRewardCandidates().find(candidate=>candidate.selectable).id).ok,true);assert.equal(manager.getRosterIds().length,26);assert.equal(manager.canChallenge('SUPER'),true);manager.recordBattle({battleId:'super-after-trials',kind:'SUPER',winner:'player'});assert.equal(manager.claimReward(manager.getRewardCandidates().find(candidate=>candidate.selectable).id).ok,true);assert.equal(manager.getRosterIds().length,27);assert.equal(new Set(manager.getRosterIds()).size,27);
});

test('PBA-015E Super unlock is available at 24, 25 and 26, never at 23, with all badges',()=>{
  const manager=fresh();unlock18(manager);for(const [size,expected] of [[23,false],[24,true],[25,true],[26,true]]){manager.getRosterIds=()=>Array.from({length:size},(_,index)=>index+1);assert.equal(manager.canChallenge('SUPER'),expected)}
});

test('PBA-015E legacy save migration and campaign reset isolate trial state',()=>{
  const raw={version:C.VERSION,status:'ACTIVE',startedAt:'2026-01-01T00:00:00.000Z',startingRosterIds:K.DRAFT.slice(0,6).map(p=>p.id),challenges:{'master-fire':{attempts:2,badgeEarned:true,rewardPokemonId:K.MASTERS.find(m=>m.challengeId==='master-fire').team[0].id}},superTrainer:{attempts:3,defeated:false},shadowTrainer:{revealed:false},processedBattleIds:[]};const migrated=S.sanitize(raw);assert.equal(migrated.challenges['master-fire'].badgeEarned,true);assert.equal(migrated.endgameTrials.legendary.completed,false);assert.equal(migrated.endgameTrials.mythical.rewardClaimed,false);
  mem.clear();mem.set(C.STORAGE_KEY,JSON.stringify(raw));mem.set('team.current','keep');mem.set('trainer.profile','keep');mem.set('quick.rotation','keep');const manager=new CampaignManager(S);manager.reset();const reset=S.load();assert.equal(reset.endgameTrials.legendary.completed,false);assert.equal(reset.endgameTrials.mythical.rewardPokemonId,null);assert.equal(mem.get('team.current'),'keep');assert.equal(mem.get('trainer.profile'),'keep');assert.equal(mem.get('quick.rotation'),'keep');
});

test('PBA-015E retains existing Super, false-ending, Shadow and aura contracts',()=>{
  const manager=fresh();unlock18(manager);const config=manager.getBattleConfig('SUPER',null,manager.getRosterIds().slice(0,3));assert.deepEqual(config.enemyTeamIds,K.SUPER_TEAM.map(p=>p.id));assert.deepEqual(config.modifiers,{});manager.recordBattle({battleId:'super-contract',kind:'SUPER',winner:'player'});assert.equal(manager.getState().status,'SUPER_REWARD_PENDING');assert.equal(manager.acknowledgeSuperVictory(),true);assert.equal(manager.claimReward(manager.getRewardCandidates().find(candidate=>candidate.selectable).id).ok,true);assert.equal(manager.getState().shadowTrainer.revealed,true);assert.equal(manager.acknowledgeShadowReveal(),true);const shadow=manager.getBattleConfig('SHADOW',null,manager.getRosterIds().slice(0,3));assert.deepEqual(shadow.enemyTeamIds,K.SUPER_TEAM.map(p=>p.id));assert.deepEqual(shadow.modifiers,{SHADOW_AURA:true});
});
test('PBA-015E trial Pokémon hydrate through canonical offline battle fallbacks',async()=>{
  const hydrator=new BattleTeamHydrator({api:{getPokemonDetail:async()=>{throw new Error('offline')}}});
  const team=await hydrator.hydrateTeam([...K.LEGENDARY_TRIAL_TEAM,...K.MYTHICAL_TRIAL_TEAM].map(p=>p.id));
  assert.deepEqual(team.map(p=>p.id),[145,245,381,151,385,494]);
  for(const combatant of team){assert.ok(combatant.moves.length>=1);assert.ok(combatant.baseStats.hp>0);assert.ok(combatant.types.length>0)}
});