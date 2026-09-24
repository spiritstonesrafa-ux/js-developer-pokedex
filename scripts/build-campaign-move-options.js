#!/usr/bin/env node
/* Offline-only curator. Generates extra moves from cached PokéAPI learnsets. */
const fs = require('node:fs');
const path = require('node:path');
const Fixed = require('../assets/js/campaign/campaign-fixed-battle-catalog.js');
const { isMechanicallySupportedMove } = require('../assets/js/battle-session/battle-session-constants.js');

// Explicit allowlist: no priority, conditional power, switch, recoil, critical-rate,
// item, screen, weather or stat side effects are introduced by customization.
const SIMPLE_MOVES = new Set([
  'aerial-ace', 'aqua-tail', 'aura-sphere', 'body-press', 'boomburst',
  'branch-poke', 'brutal-swing', 'cut', 'dazzling-gleam', 'disarming-voice',
  'dragon-claw', 'dragon-pulse', 'drill-peck', 'earthquake', 'egg-bomb',
  'fairy-wind', 'gust', 'high-horsepower', 'horn-attack', 'hydro-pump',
  'hyper-voice', 'karate-chop', 'leafage', 'magical-leaf', 'mega-kick',
  'mega-punch', 'megahorn', 'overdrive', 'peck', 'petal-blizzard',
  'pound', 'power-gem', 'power-whip', 'rock-throw', 'scratch',
  'seed-bomb', 'shadow-punch', 'shock-wave', 'slam', 'smart-strike',
  'strength', 'surf', 'swift', 'tackle', 'vice-grip', 'vine-whip',
  'water-gun', 'wing-attack', 'x-scissor'
]);

const cache = path.join(__dirname, '..', '.cache_pokeapi');
const output = path.join(__dirname, '..', 'assets/js/campaign/campaign-move-options-catalog.js');
const read = name => {
  const file = path.join(cache, name);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
};
const cachedMoves = new Map();
for (const file of fs.readdirSync(cache).filter(name => /_move_\d+_\.json$/.test(name))) {
  const raw = read(file);
  if (!raw || !SIMPLE_MOVES.has(raw.name) || !isMechanicallySupportedMove(raw) || raw.damage_class?.name === 'status' ||
      raw.meta?.category?.name !== 'damage' || raw.priority !== 0 ||
      (raw.meta?.drain || 0) !== 0 || (raw.meta?.healing || 0) !== 0 ||
      (raw.meta?.ailment_chance || 0) !== 0 || (raw.meta?.stat_chance || 0) !== 0 ||
      (raw.meta?.flinch_chance || 0) !== 0 || (raw.meta?.crit_rate || 0) !== 0 ||
      raw.meta?.min_hits || raw.meta?.min_turns ||
      (raw.accuracy !== null && (!Number.isInteger(raw.accuracy) || raw.accuracy < 1 || raw.accuracy > 100)) ||
      !Number.isInteger(raw.pp) || raw.pp <= 0) continue;
  cachedMoves.set(raw.name, Object.freeze({ id: raw.id, name: raw.name, type: raw.type.name,
    power: raw.power, accuracy: raw.accuracy, pp: raw.pp,
    damageClass: raw.damage_class.name }));
}

const extrasById = {};
for (const [id, species] of Object.entries(Fixed.byId)) {
  const pokemon = read(`https___pokeapi_co_api_v2_pokemon_${id}.json`);
  if (!pokemon) continue; // Nine legacy reward species have no full cached learnset.
  const selected = new Set(species.moves.map(move => move.name));
  const currentTypes = new Set(species.moves.map(move => move.type));
  const candidates = [...new Map(pokemon.moves.map(entry => {
    const move = cachedMoves.get(entry.move.name);
    return [entry.move.name, move];
  }).filter(([, move]) => move && !selected.has(move.name))).values()];
  const score = move => move.power * (move.accuracy === null ? 1 : move.accuracy / 100) +
    (species.types.includes(move.type) ? 35 : 0) + (currentTypes.has(move.type) ? 0 : 20);
  candidates.sort((a, b) => score(b) - score(a) || a.id - b.id);
  const chosen = [];
  for (const move of candidates) {
    if (chosen.length >= 2) break;
    if (chosen.length === 0 || move.type !== chosen[0].type || candidates.length < 2) chosen.push(move);
  }
  if (chosen.length < 2) {
    for (const move of candidates) {
      if (chosen.length >= 2) break;
      if (!chosen.some(item => item.id === move.id)) chosen.push(move);
    }
  }
  if (chosen.length) extrasById[id] = chosen;
}

const header = `/* Generated offline by scripts/build-campaign-move-options.js. Do not edit manually. */\n`;
const body = `(function () {\n  const byId = Object.freeze(${JSON.stringify(extrasById)});\n` +
  `  if (typeof module !== 'undefined' && module.exports) module.exports = { byId };\n` +
  `  else { window.PBACampaign = window.PBACampaign || {}; window.PBACampaign.CampaignMoveOptionsCatalog = { byId }; }\n})();\n`;
fs.writeFileSync(output, header + body);
console.log(`Curated options for ${Object.keys(extrasById).length}/${Object.keys(Fixed.byId).length} species; ${cachedMoves.size} safe move definitions.`);
