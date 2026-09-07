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
test('PBA-015F boss presentation keeps canonical previews and player selector contracts',()=>{
  const fs=require('node:fs'),path=require('node:path');
  const source=fs.readFileSync(path.join(__dirname,'../../assets/js/campaign/campaign-view.js'),'utf8');
  const css=fs.readFileSync(path.join(__dirname,'../../assets/css/campaign.css'),'utf8');
  assert.match(source,/campaign-preparation--super/);assert.match(source,/campaign-preparation--trial/);assert.match(source,/opponent-team-preview/);assert.match(source,/C\.SUPER_TEAM/);assert.match(source,/C\.LEGENDARY_TRIAL_TEAM/);assert.match(source,/C\.MYTHICAL_TRIAL_TEAM/);assert.match(source,/this\.pick\.length < 3/);assert.match(source,/getSpecialTrainerVisual\('SUPER'\)/);assert.match(css,/\.endgame-super__portrait/);assert.match(css,/\.campaign-preparation--super/);assert.match(css,/@media\(max-width:600px\)/);
});
function eliteTrial(manager,kind,battleId){return trial(manager,kind,battleId)}
test('PBA-015G Titans and Celestial are canonical, independent at 18 badges and exclude Super rewards',()=>{
  assert.deepEqual(K.TITANS_TRIAL_TEAM.map(p=>p.id),[1007,383,717]);assert.deepEqual(K.CELESTIAL_TRIAL_TEAM.map(p=>p.id),[889,791,487]);const superIds=new Set(K.SUPER_TEAM.map(p=>p.id));for(const pokemon of [...K.TITANS_TRIAL_TEAM,...K.CELESTIAL_TRIAL_TEAM]){assert.ok(!superIds.has(pokemon.id));assert.ok(pokemon.legendary);assert.ok(pokemon.sprite);assert.ok(pokemon.bst>=670);assert.ok(K.byId(pokemon.id))}const manager=fresh();unlock18(manager);assert.equal(manager.canChallenge('TITANS_TRIAL'),true);assert.equal(manager.canChallenge('CELESTIAL_TRIAL'),true);
});
test('PBA-015G Titans pending reload, one reward, replay and duplicate rejection',()=>{
  const manager=fresh();unlock18(manager);assert.equal(eliteTrial(manager,'TITANS_TRIAL','titans-win').processed,true);assert.equal(manager.getState().pendingReward.kind,'TITANS_TRIAL');const reloaded=fresh(false);assert.equal(reloaded.getState().pendingReward.kind,'TITANS_TRIAL');const reward=reloaded.getRewardCandidates().find(x=>x.selectable);assert.equal(reloaded.claimReward(reward.id).ok,true);assert.equal(reloaded.getRosterIds().length,25);assert.equal(eliteTrial(reloaded,'TITANS_TRIAL','titans-replay').pendingReward,null);assert.equal(reloaded.claimReward(reward.id).ok,false);assert.equal(new Set(reloaded.getRosterIds()).size,reloaded.getRosterIds().length);
});
test('PBA-015G Celestial pending reload, one reward and replay without a second reward',()=>{
  const manager=fresh();unlock18(manager);assert.equal(eliteTrial(manager,'CELESTIAL_TRIAL','celestial-win').processed,true);const reloaded=fresh(false);assert.equal(reloaded.getState().pendingReward.kind,'CELESTIAL_TRIAL');const reward=reloaded.getRewardCandidates().find(x=>x.selectable);assert.equal(reloaded.claimReward(reward.id).ok,true);assert.equal(reloaded.getState().endgameTrials.celestial.rewardClaimed,true);assert.equal(eliteTrial(reloaded,'CELESTIAL_TRIAL','celestial-replay').pendingReward,null);assert.equal(new Set(reloaded.getRosterIds()).size,reloaded.getRosterIds().length);
});
test('PBA-015G roster expands through 27, 28 and 29 while Super remains available',()=>{
  const manager=fresh();unlock18(manager);for(const [kind,battleId] of [['LEGENDARY_TRIAL','g-legendary'],['MYTHICAL_TRIAL','g-mythical'],['TITANS_TRIAL','g-titans'],['CELESTIAL_TRIAL','g-celestial']]){eliteTrial(manager,kind,battleId);assert.equal(manager.claimReward(manager.getRewardCandidates().find(x=>x.selectable).id).ok,true)}assert.equal(manager.getRosterIds().length,28);assert.equal(manager.canChallenge('SUPER'),true);manager.recordBattle({battleId:'g-super',kind:'SUPER',winner:'player'});assert.equal(manager.claimReward(manager.getRewardCandidates().find(x=>x.selectable).id).ok,true);assert.equal(manager.getRosterIds().length,29);assert.equal(new Set(manager.getRosterIds()).size,29);
});
test('PBA-015G Super stays unlocked at roster 27 and 28, legacy PBA-015F migrates, reset isolates new trials',()=>{
  const manager=fresh();unlock18(manager);for(const size of [27,28]){manager.getRosterIds=()=>Array.from({length:size},(_,i)=>i+1);assert.equal(manager.canChallenge('SUPER'),true)}const raw={version:C.VERSION,status:'ACTIVE',startedAt:'2026-01-01T00:00:00.000Z',startingRosterIds:K.DRAFT.slice(0,6).map(p=>p.id),challenges:{},superTrainer:{},shadowTrainer:{},endgameTrials:{legendary:{completed:true,rewardClaimed:true,rewardPokemonId:145},mythical:{completed:true,rewardClaimed:true,rewardPokemonId:151}},processedBattleIds:[]};const migrated=S.sanitize(raw);assert.equal(migrated.endgameTrials.titans.completed,false);assert.equal(migrated.endgameTrials.celestial.rewardPokemonId,null);mem.clear();mem.set(C.STORAGE_KEY,JSON.stringify(migrated));mem.set('quick.rotation','keep');new CampaignManager(S).reset();assert.equal(S.load().endgameTrials.titans.completed,false);assert.equal(mem.get('quick.rotation'),'keep');
});
test('PBA-015G six elite Pokémon hydrate through canonical offline fallbacks and presentation references all four trials',async()=>{
  const hydrator=new BattleTeamHydrator({api:{getPokemonDetail:async()=>{throw new Error('offline')}}});const team=await hydrator.hydrateTeam([...K.TITANS_TRIAL_TEAM,...K.CELESTIAL_TRIAL_TEAM].map(p=>p.id));assert.deepEqual(team.map(p=>p.id),[1007,383,717,889,791,487]);for(const member of team){assert.ok(member.moves.length>=1);assert.ok(member.baseStats.hp>0)}const fs=require('node:fs'),path=require('node:path'),source=fs.readFileSync(path.join(__dirname,'../../assets/js/campaign/campaign-view.js'),'utf8');assert.match(source,/TITANS_TRIAL/);assert.match(source,/CELESTIAL_TRIAL/);assert.match(source,/Prova dos Titãs/);assert.match(source,/Prova Celestial/);
});
test('PBA-015H Shadow presentation preserves reveal, makes Shadow dominant and retains battle aura contract',()=>{
 const fs=require('node:fs'),path=require('node:path');const view=fs.readFileSync(path.join(__dirname,'../../assets/js/campaign/campaign-view.js'),'utf8'),campaignCss=fs.readFileSync(path.join(__dirname,'../../assets/css/campaign.css'),'utf8'),battleCss=fs.readFileSync(path.join(__dirname,'../../assets/css/battle-arena.css'),'utf8');assert.match(view,/shadow-spotlight/);assert.match(view,/SHADOW SUPER TRAINER/);assert.match(view,/AURA SOMBRIA/);assert.match(view,/getSpecialTrainerVisual\('SHADOW'\)/);assert.match(view,/C\.SUPER_TEAM/);assert.match(campaignCss,/campaign-preparation--shadow/);assert.match(campaignCss,/endgame-super--secondary/);assert.match(battleCss,/shadow-aura-active/);assert.match(battleCss,/SHADOW/);
 let manager=fresh();unlock18(manager);manager.recordBattle({battleId:'shadow-super',kind:'SUPER',winner:'player'});manager.claimReward(manager.getRewardCandidates().find(x=>x.selectable).id);assert.equal(manager.getState().shadowTrainer.revealed,true);assert.equal(manager.acknowledgeShadowReveal(),true);const config=manager.getBattleConfig('SHADOW',null,manager.getRosterIds().slice(0,3));assert.deepEqual(config.enemyTeamIds,K.SUPER_TEAM.map(x=>x.id));assert.deepEqual(config.modifiers,{SHADOW_AURA:true});manager.recordBattle({battleId:'shadow-final',kind:'SHADOW',winner:'player'});assert.equal(manager.getState().status,'COMPLETED');
});
test('PBA-015I derives temporary Final Stand guests from claimed canonical Trials without roster ownership changes',()=>{
 const manager=fresh();unlock18(manager);
 for(const [kind,battleId] of [['LEGENDARY_TRIAL','i-l'],['MYTHICAL_TRIAL','i-m'],['TITANS_TRIAL','i-t'],['CELESTIAL_TRIAL','i-c']]){trial(manager,kind,battleId);assert.equal(manager.claimReward(manager.getRewardCandidates().find(x=>x.selectable).id).ok,true)}
 manager.recordBattle({battleId:'i-super',kind:'SUPER',winner:'player'});assert.equal(manager.claimReward(manager.getRewardCandidates().find(x=>x.selectable).id).ok,true);
 assert.equal(manager.getRosterIds().length,29);const guests=manager.getShadowGuests();assert.equal(guests.length,8);assert.equal(new Set(guests.map(x=>x.id)).size,8);assert.ok(guests.every(x=>!manager.getRosterIds().includes(x.id)&&x.temporary));
 const config=manager.getBattleConfig('SHADOW',null,[manager.getRosterIds()[0]]);assert.equal(config.metadata.battleFormat,'FINAL_STAND');assert.equal(config.playerTeamIds.length,37);assert.equal(config.enemyTeamIds.length,3);assert.deepEqual(config.modifiers,{SHADOW_AURA:true});assert.equal(manager.getRosterIds().length,29);
 assert.equal(manager.acknowledgeShadowReinforcements(),true);const reload=fresh(false);assert.equal(reload.getState().shadowTrainer.reinforcementsSeen,true);
});

test('PBA-015I engine accepts variable player team only in FINAL_STAND and keeps regular format 3x3',()=>{
 const E=require('../../assets/js/battle/battle-engine');const mon=id=>({id,name:'mon-'+id,types:['normal'],stats:{hp:80,attack:70,defense:70,specialAttack:70,specialDefense:70,speed:70},moves:[{id:1,name:'tackle',type:'normal',power:40,accuracy:100,damageClass:'physical',pp:35}]});
 assert.throws(()=>E.createTeamBattle([1,2,3,4,5].map(mon),[6,7,8].map(mon)));const state=E.createTeamBattle([1,2,3,4,5].map(mon),[6,7,8].map(mon),{battleFormat:'FINAL_STAND'});assert.equal(state.player.team.length,5);assert.equal(state.enemy.team.length,3);state.player.team[0].currentHp=0;const replacement=E.resolveReplacement({...state,status:'AWAITING_REPLACEMENT'},{player:{targetPokemonId:4}});assert.equal(replacement.state.player.activeIndex,3);
});