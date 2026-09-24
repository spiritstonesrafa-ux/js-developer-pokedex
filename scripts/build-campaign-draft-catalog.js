#!/usr/bin/env node
/* Development-only: generates static campaign catalogs from PokéAPI. */
const fs = require('node:fs');
const path = require('node:path');

const { DRAFT_IDS_BY_GENERATION, DRAFT_IDS } = require('../assets/js/campaign/campaign-draft-ids.js');
const { ALL_TYPES } = require('../assets/js/battle/type-chart.js');
const { calculate: calculateEffectiveness } = require('../assets/js/battle/type-effectiveness.js');
const { usesDefenseAsAttack } = require('../assets/js/battle/battle-constants.js');
const { isMechanicallySupportedMove, UNSUPPORTED_COMPLEX_MOVES } = require('../assets/js/battle-session/battle-session-constants.js');

const MASTER_IDS = [242,264,335,38,59,609,131,350,423,405,466,849,407,549,841,471,975,713,68,286,701,169,454,691,330,553,750,227,398,715,65,199,858,212,214,768,248,526,697,94,477,778,149,445,887,229,510,983,376,530,681,303,468,869];
const SUPER_IDS = [493,890,150];
const LEGACY_IDS = [249,250,258,259,382,383,384,393,394,485,488,499,501,502,641,656,657,716,717,718,728,729,730,785,786,787,788,816,817,888,889,891,892,912,913,915,1000,1001,1002,1003];

const allIds = [...new Set([...DRAFT_IDS, ...MASTER_IDS, ...SUPER_IDS, ...LEGACY_IDS])];
const draftIdSet = new Set(DRAFT_IDS);

const cacheDir = path.join(__dirname, '..', '.cache_pokeapi');
if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

async function cachedFetchJson(url) {
  const safeName = url.replace(/[^a-zA-Z0-9]/g, '_') + '.json';
  const file = path.join(cacheDir, safeName);
  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error(`PokéAPI ${response.status}: ${url}`);
  const data = await response.json();
  fs.writeFileSync(file, JSON.stringify(data));
  return data;
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: limit }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await fn(items[index]);
    }
  }));
  return results;
}

const FALLBACK_MOVES_BY_TYPE = Object.freeze({
  normal: { id: 33, name: 'tackle', type: 'normal', power: 40, accuracy: 100, pp: 35, damageClass: 'physical' },
  fire: { id: 52, name: 'ember', type: 'fire', power: 40, accuracy: 100, pp: 25, damageClass: 'special' },
  water: { id: 55, name: 'water-gun', type: 'water', power: 40, accuracy: 100, pp: 25, damageClass: 'special' },
  electric: { id: 84, name: 'thunder-shock', type: 'electric', power: 40, accuracy: 100, pp: 30, damageClass: 'special' },
  grass: { id: 71, name: 'vine-whip', type: 'grass', power: 45, accuracy: 100, pp: 25, damageClass: 'physical' },
  ice: { id: 181, name: 'powder-snow', type: 'ice', power: 40, accuracy: 100, pp: 25, damageClass: 'special' },
  fighting: { id: 280, name: 'brick-break', type: 'fighting', power: 75, accuracy: 100, pp: 15, damageClass: 'physical' },
  poison: { id: 40, name: 'poison-sting', type: 'poison', power: 35, accuracy: 100, pp: 35, damageClass: 'physical' },
  ground: { id: 189, name: 'mud-slap', type: 'ground', power: 20, accuracy: 100, pp: 20, damageClass: 'special' },
  flying: { id: 16, name: 'gust', type: 'flying', power: 40, accuracy: 100, pp: 35, damageClass: 'special' },
  psychic: { id: 93, name: 'confusion', type: 'psychic', power: 50, accuracy: 100, pp: 25, damageClass: 'special' },
  bug: { id: 450, name: 'bug-bite', type: 'bug', power: 60, accuracy: 100, pp: 20, damageClass: 'physical' },
  rock: { id: 88, name: 'rock-throw', type: 'rock', power: 50, accuracy: 90, pp: 15, damageClass: 'physical' },
  ghost: { id: 122, name: 'lick', type: 'ghost', power: 30, accuracy: 100, pp: 30, damageClass: 'physical' },
  dragon: { id: 225, name: 'dragon-breath', type: 'dragon', power: 60, accuracy: 100, pp: 20, damageClass: 'special' },
  dark: { id: 44, name: 'bite', type: 'dark', power: 60, accuracy: 100, pp: 25, damageClass: 'physical' },
  steel: { id: 232, name: 'metal-claw', type: 'steel', power: 50, accuracy: 95, pp: 35, damageClass: 'physical' },
  fairy: { id: 577, name: 'disarming-voice', type: 'fairy', power: 40, accuracy: null, pp: 15, damageClass: 'special' }
});

const ENDGAME_BOSSES = [
  { name: 'arceus', types: ['normal'] },
  { name: 'eternatus', types: ['poison', 'dragon'] },
  { name: 'mewtwo', types: ['psychic'] },
  { name: 'zapdos', types: ['electric', 'flying'] },
  { name: 'suicune', types: ['water'] },
  { name: 'latios', types: ['dragon', 'psychic'] },
  { name: 'mew', types: ['psychic'] },
  { name: 'jirachi', types: ['steel', 'psychic'] },
  { name: 'victini', types: ['psychic', 'fire'] },
  { name: 'koraidon', types: ['fighting', 'dragon'] },
  { name: 'groudon', types: ['ground'] },
  { name: 'yveltal', types: ['dark', 'flying'] },
  { name: 'zamazenta', types: ['fighting'] },
  { name: 'solgaleo', types: ['psychic', 'steel'] },
  { name: 'giratina', types: ['ghost', 'dragon'] }
];

async function getMoveDetail(url) {
  try {
    const raw = await cachedFetchJson(url);
    if (!isMechanicallySupportedMove(raw)) return null;
    const name = String(raw.name || '').toLowerCase();
    const damageClass = raw.damage_class?.name;
    const accuracy = raw.accuracy === null ? null : (typeof raw.accuracy === 'number' ? raw.accuracy : null);
    return {
      id: raw.id,
      name,
      type: raw.type.name,
      power: raw.power,
      accuracy,
      pp: raw.pp || 15,
      damageClass
    };
  } catch {
    return null;
  }
}

function scoreMoveForMon(move, types, stats) {
  const isSTAB = types.includes(move.type);
  const effAcc = move.accuracy === null ? 100 : move.accuracy;
  let score = move.power * (effAcc / 100);

  if (isSTAB) score += 40;

  const atk = stats.attack || 50;
  const spa = stats.specialAttack || 50;
  const userStat = usesDefenseAsAttack(move) ? (stats.defense || 50) : (move.damageClass === 'physical' ? atk : spa);
  const oppStat = usesDefenseAsAttack(move) ? Math.max(atk, spa) : (move.damageClass === 'physical' ? spa : atk);

  if (userStat >= oppStat) {
    score += Math.min(25, (userStat - oppStat) * 0.3);
  } else {
    score -= Math.min(35, (oppStat - userStat) * 0.4);
  }

  if (effAcc < 75) score -= 18;
  else if (effAcc >= 90) score += 6;

  if (!types.includes('normal') && move.type === 'normal') {
    score -= 25;
  }

  // Coverage bonus against endgame bosses
  let superEffectiveCount = 0;
  for (const boss of ENDGAME_BOSSES) {
    const eff = calculateEffectiveness(move.type, boss.types);
    if (eff.multiplier >= 2) superEffectiveCount++;
  }
  score += Math.min(15, superEffectiveCount * 2);

  return score;
}

function calculateEndgameScore(pokemon, stats, types, moves, bst) {
  const bstScore = bst * 0.45;
  const bulkScore = (stats.hp * 0.35) + (stats.defense * 0.3) + (stats.specialDefense * 0.35);
  const speedScore = (stats.speed || 50) * 0.35;
  const maxOffense = Math.max(stats.attack || 50, stats.specialAttack || 50);
  const offenseScore = maxOffense * 0.35;

  let movesPowerScore = 0;
  for (const m of moves) {
    const effAcc = m.accuracy === null ? 100 : m.accuracy;
    const userOffense = usesDefenseAsAttack(m) ? (stats.defense || 50) : (m.damageClass === 'physical' ? (stats.attack || 50) : (stats.specialAttack || 50));
    const stabMult = types.includes(m.type) ? 1.5 : 1.0;
    movesPowerScore += (m.power * (effAcc / 100)) * stabMult * (userOffense / 100);
  }

  let bossAdvantage = 0;
  for (const boss of ENDGAME_BOSSES) {
    let bestMult = 1.0;
    for (const m of moves) {
      const eff = calculateEffectiveness(m.type, boss.types);
      if (eff.multiplier > bestMult) bestMult = eff.multiplier;
    }
    if (bestMult >= 4) bossAdvantage += 30;
    else if (bestMult >= 2) bossAdvantage += 18;

    const defEff = calculateEffectiveness(boss.types[0], types);
    if (defEff.multiplier <= 0.5) bossAdvantage += 5;
    else if (defEff.multiplier >= 2) bossAdvantage -= 5;
  }

  return bstScore + bulkScore + speedScore + offenseScore + (movesPowerScore * 0.25) + bossAdvantage;
}

async function loadSpecies(id) {
  const [pokemon, species] = await Promise.all([
    cachedFetchJson(`https://pokeapi.co/api/v2/pokemon/${id}`),
    cachedFetchJson(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
  ]);

  const statsMap = Object.fromEntries(pokemon.stats.map(s => [
    s.stat.name === 'special-attack' ? 'specialAttack' :
    s.stat.name === 'special-defense' ? 'specialDefense' : s.stat.name,
    s.base_stat
  ]));
  const types = pokemon.types.slice().sort((a,b) => a.slot - b.slot).map(x => x.type.name);
  const bst = pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);
  const generation = Number(species.generation.url.match(/generation\/(\d+)/)[1]);

  let moves = [];
  if (draftIdSet.has(id)) {
    const candidateUrls = pokemon.moves.map(m => m.move.url);
    const moveDetails = (await mapLimit(candidateUrls, 16, getMoveDetail)).filter(Boolean);

    // Deduplicate by move name
    const moveMap = new Map();
    for (const m of moveDetails) {
      if (!moveMap.has(m.name)) {
        moveMap.set(m.name, m);
      }
    }

    const scored = Array.from(moveMap.values()).map(m => ({
      ...m,
      score: scoreMoveForMon(m, types, statsMap)
    }));
    scored.sort((a,b) => b.score - a.score);

    const chosen = [];
    const chosenTypes = new Set();

    // 1. Pick primary STAB move
    const type1Moves = scored.filter(m => m.type === types[0]);
    if (type1Moves.length > 0) {
      chosen.push({
        id: type1Moves[0].id,
        name: type1Moves[0].name,
        type: type1Moves[0].type,
        power: type1Moves[0].power,
        accuracy: type1Moves[0].accuracy,
        pp: type1Moves[0].pp,
        damageClass: type1Moves[0].damageClass
      });
      chosenTypes.add(types[0]);
    }

    // 2. Pick secondary STAB move (if dual-type)
    if (types.length > 1) {
      const type2Moves = scored.filter(m => m.type === types[1] && !chosen.some(c => c.name === m.name));
      if (type2Moves.length > 0) {
        chosen.push({
          id: type2Moves[0].id,
          name: type2Moves[0].name,
          type: type2Moves[0].type,
          power: type2Moves[0].power,
          accuracy: type2Moves[0].accuracy,
          pp: type2Moves[0].pp,
          damageClass: type2Moves[0].damageClass
        });
        chosenTypes.add(types[1]);
      }
    }

    // 3. Fill remaining slots prioritizing diverse coverage types
    for (const m of scored) {
      if (chosen.length >= 4) break;
      if (chosen.some(c => c.name === m.name)) continue;
      if (!chosenTypes.has(m.type)) {
        chosen.push({
          id: m.id,
          name: m.name,
          type: m.type,
          power: m.power,
          accuracy: m.accuracy,
          pp: m.pp,
          damageClass: m.damageClass
        });
        chosenTypes.add(m.type);
      }
    }

    // 4. If still need slots, fill with remaining highest scoring moves
    for (const m of scored) {
      if (chosen.length >= 4) break;
      if (chosen.some(c => c.name === m.name)) continue;
      chosen.push({
        id: m.id,
        name: m.name,
        type: m.type,
        power: m.power,
        accuracy: m.accuracy,
        pp: m.pp,
        damageClass: m.damageClass
      });
    }

    // 5. Fallback safety (if ever < 4)
    for (const t of types) {
      if (chosen.length < 4) {
        const fb = FALLBACK_MOVES_BY_TYPE[t] || FALLBACK_MOVES_BY_TYPE.normal;
        if (!chosen.some(c => c.name === fb.name)) {
          chosen.push({ ...fb });
        }
      }
    }
    if (chosen.length < 4) {
      const fb = FALLBACK_MOVES_BY_TYPE.normal;
      if (!chosen.some(c => c.name === fb.name)) chosen.push({ ...fb });
    }

    moves = chosen.slice(0, 4);
  }

  return {
    id,
    name: pokemon.name,
    types,
    bst,
    generation,
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
    photo: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    animatedPhoto: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`,
    cry: `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`,
    legendary: species.is_legendary,
    mythical: species.is_mythical,
    stats: statsMap,
    moves
  };
}

(async () => {
  console.log(`Loading ${allIds.length} Pokémon metadata (draft: ${DRAFT_IDS.length})...`);
  const rows = await mapLimit(allIds, 12, loadSpecies);
  const lookup = new Map(rows.map(r => [r.id, r]));

  // Validate draft species
  for (const [gen, ids] of Object.entries(DRAFT_IDS_BY_GENERATION)) {
    if (ids.length !== 50) throw new Error(`Gen ${gen} must have 50 IDs, got ${ids.length}`);
    for (const id of ids) {
      const row = lookup.get(id);
      if (!row) throw new Error(`Missing species #${id}`);
      if (row.generation !== Number(gen)) throw new Error(`Invalid generation for #${id}: ${row.generation} != ${gen}`);
      if (row.legendary) throw new Error(`Legendary #${id} in draft`);
      if (row.mythical) throw new Error(`Mythical #${id} in draft`);
    }
  }

  // Determine recommendedForEndgame AFTER loadouts are finalized
  // Filter: BST >= 490, max offense >= 70, at least 1 valid STAB in final loadout
  const recommendedIds = new Set();
  for (let g = 1; g <= 9; g++) {
    const candidates = [];
    for (const id of DRAFT_IDS_BY_GENERATION[g]) {
      const r = lookup.get(id);
      const hasSTAB = r.moves.some(m => r.types.includes(m.type));
      const maxOffense = Math.max(r.stats.attack || 50, r.stats.specialAttack || 50);
      if (r.bst >= 490 && hasSTAB && maxOffense >= 70) {
        const score = calculateEndgameScore(r, r.stats, r.types, r.moves, r.bst);
        candidates.push({ id: r.id, name: r.name, score });
      }
    }
    candidates.sort((a,b) => b.score - a.score);
    const topGen = candidates.slice(0, 6);
    topGen.forEach(r => recommendedIds.add(r.id));
  }

  console.log(`Selected ${recommendedIds.size} recommended Pokémon for endgame across 9 generations.`);

  // Generate campaign-pokemon-catalog.js
  const catalogEntries = rows.sort((a,b) => a.id - b.id).map(r => ({
    id: r.id,
    name: r.name,
    types: r.types,
    bst: r.bst,
    generation: r.generation,
    sprite: r.sprite,
    legendary: r.legendary,
    mythical: r.mythical,
    recommendedForEndgame: recommendedIds.has(r.id)
  }));

  const catalogOutput = `/* Generated by scripts/build-campaign-draft-catalog.js. Do not fetch at runtime. */\n(function () {\n  const freeze = entry => Object.freeze({ ...entry, types: Object.freeze(entry.types) });\n  const entries = Object.freeze(${JSON.stringify(catalogEntries, null, 2)}.map(freeze));\n  const byId = Object.freeze(Object.fromEntries(entries.map(entry => [entry.id, entry])));\n  const draftIdsByGeneration = Object.freeze(${JSON.stringify(DRAFT_IDS_BY_GENERATION, null, 2)});\n  const api = Object.freeze({ entries, byId, draftIdsByGeneration });\n  if (typeof module !== 'undefined' && module.exports) module.exports = api;\n  else { window.PBACampaign = window.PBACampaign || {}; window.PBACampaign.CampaignPokemonCatalog = api; }\n})();\n`;
  fs.writeFileSync(path.join(__dirname, '..', 'assets', 'js', 'campaign', 'campaign-pokemon-catalog.js'), catalogOutput);

  // Generate campaign-battle-fallback-catalog.js
  const draftFallbackRows = DRAFT_IDS.map(id => lookup.get(id)).sort((a,b) => a.id - b.id);
  const fallbackById = {};
  for (const r of draftFallbackRows) {
    fallbackById[r.id] = {
      id: r.id,
      number: r.id,
      name: r.name,
      types: r.types,
      stats: r.stats,
      photo: r.photo,
      animatedPhoto: r.animatedPhoto,
      cry: r.cry,
      moves: r.moves
    };
  }

  const fallbackOutput = `/**\n * ====================================================================\n * CATÁLOGO DE FALLBACK DE BATALHA DA CAMPANHA (campaign-battle-fallback-catalog.js)\n * ====================================================================\n * Modelos determinísticos de combatentes offline para todos os 450 Pokémon\n * selecionáveis do draft inicial da campanha.\n *\n * Gerado por scripts/build-campaign-draft-catalog.js. Não editar manualmente.\n */\n(function () {\n  const byId = Object.freeze(${JSON.stringify(fallbackById, null, 2)});\n  const api = Object.freeze({ byId });\n  if (typeof module !== 'undefined' && module.exports) module.exports = api;\n  else { window.PBACampaign = window.PBACampaign || {}; window.PBACampaign.CampaignBattleFallbackCatalog = api; }\n})();\n`;
  fs.writeFileSync(path.join(__dirname, '..', 'assets', 'js', 'campaign', 'campaign-battle-fallback-catalog.js'), fallbackOutput);

  console.log(`Generated:
- assets/js/campaign/campaign-pokemon-catalog.js (${catalogEntries.length} species, ${DRAFT_IDS.length} draft)
- assets/js/campaign/campaign-battle-fallback-catalog.js (${draftFallbackRows.length} offline fallback combatants)
- Recommended count: ${recommendedIds.size}
`);
})().catch(error => { console.error(error); process.exitCode = 1; });
