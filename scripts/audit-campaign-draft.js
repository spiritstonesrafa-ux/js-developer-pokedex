#!/usr/bin/env node
// Development-only audit: uses the production hydrator and move policy; never loaded by the app.
const Catalog=require('../assets/js/campaign/campaign-catalog.js');
const {BattleTeamHydrator}=require('../assets/js/battle-session/battle-team-hydrator.js');
(async()=>{const h=new BattleTeamHydrator();const rows=[];for(const entry of Catalog.DRAFT){const [p]=await h.hydrateTeam([entry.id]);rows.push({id:entry.id,name:p.name,moves:p.moves.length,compatible:p.moves.length===4});}const failed=rows.filter(x=>!x.compatible);console.table(rows);console.log(JSON.stringify({audited:rows.length,compatible:rows.length-failed.length,failed},null,2));process.exitCode=failed.length?1:0;})();
