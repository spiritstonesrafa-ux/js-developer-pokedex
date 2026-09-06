#!/usr/bin/env node
// Development-only: validates static catalog metadata and uses the production hydrator with a live PokéAPI adapter.
const Catalog = require('../assets/js/campaign/campaign-catalog.js');
const { BattleTeamHydrator } = require('../assets/js/battle-session/battle-team-hydrator.js');
const PLACEHOLDER_NAME = /^pokemon-\d+$/i;
const pokemonCache = new Map(), moveCache = new Map();
async function getJson(url) { const response = await fetch(url); if (!response.ok) throw new Error('PokéAPI ' + response.status + ' ' + url); return response.json(); }
const api = {
  async getPokemonDetail(id) {
    if (!pokemonCache.has(id)) pokemonCache.set(id, getJson('https://pokeapi.co/api/v2/pokemon/' + id).then(raw => ({
      id: raw.id, number: raw.id, name: raw.name, types: raw.types.sort((a,b)=>a.slot-b.slot).map(slot=>slot.type.name),
      stats: Object.fromEntries(raw.stats.map(stat=>[stat.stat.name === 'special-attack' ? 'specialAttack' : stat.stat.name === 'special-defense' ? 'specialDefense' : stat.stat.name, stat.base_stat])),
      photo: raw.sprites.other?.['official-artwork']?.front_default || raw.sprites.front_default, animatedPhoto: raw.sprites.other?.showdown?.front_default || raw.sprites.front_default, cry: raw.cries?.latest || '',
      moves: raw.moves.map(slot=>({ name: slot.move.name, url: slot.move.url, versionGroupDetails: slot.version_group_details.map(detail=>({ levelLearnedAt: detail.level_learned_at, moveLearnMethod: detail.move_learn_method.name, versionGroup: detail.version_group.name })) }))
    })));
    return pokemonCache.get(id);
  },
  async getMoveDetail(candidate) {
    const url = candidate.url || 'https://pokeapi.co/api/v2/move/' + (candidate.name || candidate.id);
    if (!moveCache.has(url)) moveCache.set(url, getJson(url).then(raw => ({ id: raw.id, name: raw.name, type: raw.type.name, power: raw.power, accuracy: raw.accuracy, pp: raw.pp, damageClass: raw.damage_class.name })));
    return moveCache.get(url);
  }
};
async function mapLimit(items, limit, fn) { const results = new Array(items.length); let cursor = 0; await Promise.all(Array.from({length:limit}, async () => { while (cursor < items.length) { const index=cursor++; results[index]=await fn(items[index]); } })); return results; }
(async () => {
  const metadataFailures = Catalog.DRAFT.filter(entry => PLACEHOLDER_NAME.test(entry.name) || !Array.isArray(entry.types) || entry.types.length === 0 || !Number.isInteger(entry.bst) || entry.bst <= 0 || !Number.isInteger(entry.generation) || entry.generation < 1 || entry.generation > 9 || !entry.sprite || entry.legendary || entry.mythical);
  const hydrator = new BattleTeamHydrator({ api });
  const rows = await mapLimit(Catalog.DRAFT, 4, async entry => { const [pokemon] = await hydrator.hydrateTeam([entry.id]); return { id:entry.id, name:entry.name, moves:pokemon.moves.length, compatible:pokemon.moves.length === 4 }; });
  const incompatible=rows.filter(row=>!row.compatible), count=predicate=>Catalog.DRAFT.filter(predicate).length;
  const report={ DRAFT_SIZE:Catalog.DRAFT.length, UNIQUE_IDS:new Set(Catalog.DRAFT.map(entry=>entry.id)).size, CANONICAL_NAMES:count(entry=>!PLACEHOLDER_NAME.test(entry.name))+'/'+Catalog.DRAFT.length, CANONICAL_TYPES:count(entry=>entry.types.length>0)+'/'+Catalog.DRAFT.length, CANONICAL_BST:count(entry=>entry.bst>0)+'/'+Catalog.DRAFT.length, CANONICAL_GENERATION:count(entry=>entry.generation>=1&&entry.generation<=9)+'/'+Catalog.DRAFT.length, BATTLE_COMPATIBLE:rows.filter(row=>row.compatible).length+'/'+Catalog.DRAFT.length, FOUR_SUPPORTED_MOVES:rows.filter(row=>row.moves===4).length+'/'+Catalog.DRAFT.length, LEGENDARY:count(entry=>entry.legendary), MYTHICAL:count(entry=>entry.mythical), SUPER_OVERLAP:Catalog.DRAFT.filter(entry=>Catalog.SUPER_TEAM.some(superEntry=>superEntry.id===entry.id)).length };
  console.log(JSON.stringify(report,null,2)); if(metadataFailures.length||incompatible.length||report.DRAFT_SIZE!==144||report.UNIQUE_IDS!==144||report.SUPER_OVERLAP!==0){console.error(JSON.stringify({metadataFailures,incompatible},null,2));process.exitCode=1;}
})().catch(error=>{console.error(error);process.exitCode=1;});