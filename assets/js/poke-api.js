/**
 * PokéAPI Service Layer
 */
const pokeApi = {};

/**
 * Converte resposta da PokeAPI para o modelo local Pokemon
 */
function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  pokemon.types = types;
  pokemon.type = type;

  // Imagem de alta resolução (Official Artwork) ou fallback para showndown/pixel sprite
  pokemon.photo =
    pokeDetail.sprites.other['official-artwork'].front_default ||
    pokeDetail.sprites.other['dream_world'].front_default ||
    pokeDetail.sprites.front_default;

  // Sprite animada
  pokemon.animatedPhoto =
    pokeDetail.sprites.other?.showdown?.front_default ||
    pokeDetail.sprites.front_default;

  // Medidas (PokeAPI retorna decímetros e hectogramas)
  pokemon.height = pokeDetail.height / 10;
  pokemon.weight = pokeDetail.weight / 10;

  // Habilidades
  pokemon.abilities = pokeDetail.abilities.map((abilitySlot) => abilitySlot.ability.name);

  // Status Base
  const statsMap = {};
  let totalStats = 0;
  pokeDetail.stats.forEach((statObj) => {
    statsMap[statObj.stat.name] = statObj.base_stat;
    totalStats += statObj.base_stat;
  });

  pokemon.stats = {
    hp: statsMap['hp'] || 0,
    attack: statsMap['attack'] || 0,
    defense: statsMap['defense'] || 0,
    specialAttack: statsMap['special-attack'] || 0,
    specialDefense: statsMap['special-defense'] || 0,
    speed: statsMap['speed'] || 0,
    total: totalStats
  };

  pokemon.speciesUrl = pokeDetail.species ? pokeDetail.species.url : '';
  pokemon.cry = pokeDetail.cries ? (pokeDetail.cries.latest || pokeDetail.cries.legacy) : '';

  return pokemon;
}

/**
 * Busca detalhes de um Pokémon por URL ou ID/Nome
 */
pokeApi.getPokemonDetail = (pokemonOrUrl) => {
  const url = typeof pokemonOrUrl === 'string' 
    ? pokemonOrUrl 
    : (pokemonOrUrl.url || `https://pokeapi.co/api/v2/pokemon/${pokemonOrUrl}`);

  return fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error('Pokémon não encontrado');
      return response.json();
    })
    .then(convertPokeApiDetailToPokemon);
};

/**
 * Lista Pokémon com paginação (limit e offset)
 */
pokeApi.getPokemons = (offset = 0, limit = 20) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
    .then((detailRequests) => Promise.all(detailRequests))
    .catch((error) => {
      console.error('Erro ao buscar lista de pokemons:', error);
      throw error;
    });
};

/**
 * Busca cadeia de evolução de um Pokémon
 */
pokeApi.getPokemonEvolutionChain = async (speciesUrl) => {
  if (!speciesUrl) return [];
  try {
    const speciesRes = await fetch(speciesUrl);
    const speciesData = await speciesRes.json();
    
    if (!speciesData.evolution_chain?.url) return [];

    const evoRes = await fetch(speciesData.evolution_chain.url);
    const evoData = await evoRes.json();

    const chain = [];
    let current = evoData.chain;

    while (current) {
      const pokeIdMatch = current.species.url.match(/\/pokemon-species\/(\d+)\//);
      const pokeId = pokeIdMatch ? pokeIdMatch[1] : null;

      chain.push({
        id: pokeId,
        name: current.species.name,
        minLevel: current.evolution_details?.[0]?.min_level || null,
        trigger: current.evolution_details?.[0]?.trigger?.name || null,
        photo: pokeId 
          ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeId}.png`
          : ''
      });

      current = current.evolves_to && current.evolves_to.length > 0 ? current.evolves_to[0] : null;
    }

    return chain;
  } catch (err) {
    console.warn('Erro ao carregar cadeia de evolução:', err);
    return [];
  }
};

/**
 * Busca lista de Pokémon por Tipo
 */
pokeApi.getPokemonsByType = async (type, limit = 40) => {
  const url = `https://pokeapi.co/api/v2/type/${type}`;
  const response = await fetch(url);
  const data = await response.json();
  const pokemonEntries = data.pokemon.slice(0, limit);
  const detailPromises = pokemonEntries.map(entry => pokeApi.getPokemonDetail(entry.pokemon.url));
  return Promise.all(detailPromises);
};
