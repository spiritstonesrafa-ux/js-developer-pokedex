(function () {
 const CAMPAIGN_STATUS = Object.freeze({ NOT_STARTED:'NOT_STARTED', ACTIVE:'ACTIVE', SUPER_AVAILABLE:'SUPER_AVAILABLE', SUPER_REWARD_PENDING:'SUPER_REWARD_PENDING', SHADOW_AVAILABLE:'SHADOW_AVAILABLE', COMPLETED:'COMPLETED' });
 const CHALLENGE_KINDS = Object.freeze({ MASTER:'MASTER', SUPER:'SUPER', SHADOW:'SHADOW' });
 const STORAGE_KEY='campaign.progress', VERSION=1, TEAM_SIZE=3, START_SIZE=6, MAX_ROSTER=25, MAX_PROCESSED=96;
 const api=Object.freeze({CAMPAIGN_STATUS,CHALLENGE_KINDS,STORAGE_KEY,VERSION,TEAM_SIZE,START_SIZE,MAX_ROSTER,MAX_PROCESSED});
 if(typeof module!=='undefined'&&module.exports)module.exports=api; else { window.PBACampaign=window.PBACampaign||{};Object.assign(window.PBACampaign,api); }
})();
