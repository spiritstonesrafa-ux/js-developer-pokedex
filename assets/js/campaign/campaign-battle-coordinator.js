(function(){
 let C;if(typeof module!=='undefined'&&module.exports)C=require('./campaign-constants.js');else C=window.PBACampaign;
 class CampaignBattleCoordinator{constructor(manager,session){this.manager=manager;this.session=session}async start(kind,id,teamIds){const config=this.manager.getBattleConfig(kind,id,teamIds);await this.session.prepareBattle(config);await this.session.startBattle();return config}}
 const api={CampaignBattleCoordinator};if(typeof module!=='undefined'&&module.exports)module.exports=api;else{window.PBACampaign=window.PBACampaign||{};Object.assign(window.PBACampaign,api)}
})();
