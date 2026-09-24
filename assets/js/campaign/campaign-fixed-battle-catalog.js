/* One loadout source for campaign battles and their tactical preview. */
(function () {
  const Campaign = typeof module !== 'undefined' && module.exports
    ? require('./campaign-catalog.js') : window.PBACampaign;
  const Draft = typeof module !== 'undefined' && module.exports
    ? require('./campaign-battle-fallback-catalog.js') : Campaign.CampaignBattleFallbackCatalog;
  const Hydrator = typeof module !== 'undefined' && module.exports
    ? require('../battle-session/battle-team-hydrator.js') : window.PBABattleSession;
  const Battle = typeof module !== 'undefined' && module.exports
    ? require('../battle/battle-constants.js') : window.PBABattle;

  const movesByName = new Map();
  for (const species of Object.values(Draft.byId)) {
    for (const move of species.moves) {
      if (!movesByName.has(move.name)) movesByName.set(move.name, move);
    }
  }
  const curated = Object.freeze({
    264: { stats: [78, 70, 61, 50, 61, 100], moves: ['body-slam', 'play-rough', 'throat-chop', 'seed-bomb'] },
    549: { stats: [70, 60, 75, 110, 75, 90], moves: ['energy-ball', 'pollen-puff', 'alluring-voice', 'round'] },
    303: { stats: [50, 85, 85, 55, 55, 50], moves: ['play-rough', 'iron-head', 'crunch', 'ice-punch'] },
    493: { stats: [120, 120, 120, 120, 120, 120], moves: ['hyper-voice', 'earthquake', 'ice-beam', 'shadow-ball'] },
    890: { stats: [140, 85, 95, 145, 95, 130], moves: ['sludge-wave', 'dragon-pulse', 'flamethrower', 'shadow-ball'] },
    150: { stats: [106, 110, 90, 154, 90, 130], moves: ['psychic', 'ice-beam', 'thunderbolt', 'flamethrower'] }
  });
  const trialOverrides = Object.freeze({
    1007: ['dragon-claw', 'brick-break', 'iron-head', 'heat-wave'],
    383: ['earthquake', 'stone-edge', 'fire-punch', 'crunch'],
    889: ['body-press', 'iron-head', 'crunch', 'earthquake'],
    791: ['psychic', 'iron-head', 'earthquake', 'crunch']
  });
  const trialTeams = [
    Campaign.LEGENDARY_TRIAL_TEAM, Campaign.MYTHICAL_TRIAL_TEAM,
    Campaign.TITANS_TRIAL_TEAM, Campaign.CELESTIAL_TRIAL_TEAM
  ];
  const trialIds = new Set(trialTeams.flatMap(team => team.map(pokemon => pokemon.id)));

  function fixedMoves(names, id) {
    if (names.length !== 4 || new Set(names).size !== 4) {
      throw new Error(`Conjunto fixo inválido para Pokémon ${id}.`);
    }
    return Object.freeze(names.map(name => {
      const move = movesByName.get(name);
      if (!move) throw new Error(`Golpe fixo desconhecido: ${name} (Pokémon ${id}).`);
      return Object.freeze({ ...move });
    }));
  }

  function extraSpecies(id) {
    const canonical = Campaign.byId(id);
    if (!canonical) throw new Error(`Pokémon da campanha desconhecido: ${id}.`);
    const definition = curated[id];
    const legacy = trialIds.has(id) ? Hydrator.getFallbackSpecies(id) : null;
    const stats = definition
      ? Object.fromEntries(['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed']
        .map((key, index) => [key, definition.stats[index]]))
      : legacy.stats;
    const names = definition ? definition.moves : (trialOverrides[id] || legacy.moves.map(move => move.name));
    return Object.freeze({
      id, number: id, name: canonical.name, types: Object.freeze([...canonical.types]),
      stats: Object.freeze({ ...stats }), moves: fixedMoves(names, id),
      photo: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      animatedPhoto: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`,
      cry: `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`
    });
  }

  const extraIds = new Set([...Object.keys(curated).map(Number), ...trialIds]);
  const extras = Object.fromEntries([...extraIds].filter(id => !Draft.byId[id])
    .map(id => [id, extraSpecies(id)]));
  const statusOverrides = Object.fromEntries([
    [3, 'knock-off', 'poison-powder'], [407, 'shadow-ball', 'poison-powder'],
    [94, 'psychic', 'will-o-wisp'], [38, 'dark-pulse', 'will-o-wisp'],
    [25, 'knock-off', 'thunder-wave'], [405, 'psychic-fangs', 'thunder-wave']
  ].map(([id, replaced, statusName]) => {
    const species = Draft.byId[id] || extras[id];
    if (!species || !species.moves.some(move => move.name === replaced)) {
      throw new Error(`Conjunto de status inválido para Pokémon ${id}.`);
    }
    return [id, Object.freeze({ ...species, moves: Object.freeze(species.moves.map(move =>
      move.name === replaced ? Battle.SUPPORTED_STATUS_MOVES[statusName] : move)) })];
  }));
  const byId = Object.freeze({ ...Draft.byId, ...extras, ...statusOverrides });
  const api = Object.freeze({ byId, extras: Object.freeze(extras) });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else {
    window.PBACampaign = window.PBACampaign || {};
    window.PBACampaign.CampaignFixedBattleCatalog = api;
  }
})();
