/**
 * ====================================================================
 * HIDRATADOR DE EQUIPES DE BATALHA: (battle-team-hydrator.js)
 * ====================================================================
 * Transforma IDs brutos de Pokémon (ex: de team.current) em instâncias
 * completas e prontas para o BattleEngine (Combatant Model v3).
 *
 * Responsabilidades:
 * - Consulta PokéAPI ou cache existente;
 * - Extrai stats de combate normalizados;
 * - Aplica política determinística de seleção de loadout de 1 a 4 golpes legais;
 * - Filtra e descarta golpes de status e com power nulo/inválido;
 * - Respeita o teto de requisições por Pokémon (MAX_MOVE_DETAIL_REQUESTS_PER_POKEMON);
 * - Previne explosão de requisições de rede;
 * - Tolerância a falhas: fallback offline seguro sem uso de fixtures de teste.
 *
 * Suporta Node.js (CommonJS) e Navegadores (window.PBABattleSession).
 */

(function () {
  let sessionConstants;
  let pokeApiService;
  let BattleStatNormalizer;

  if (typeof module !== 'undefined' && module.exports) {
    sessionConstants = require('./battle-session-constants.js');
    try {
      pokeApiService = require('../poke-api.js');
    } catch {
      pokeApiService = null;
    }
    try {
      BattleStatNormalizer = require('../battle/battle-stat-normalizer.js');
    } catch {
      BattleStatNormalizer = null;
    }
  } else if (typeof window !== 'undefined') {
    sessionConstants = window.PBABattleSession || {};
    pokeApiService = window.pokeApi;
    BattleStatNormalizer = window.PBABattle ? window.PBABattle.BattleStatNormalizer : null;
  }

  const {
    SESSION_CONFIG,
    MOVESET_LOADOUT_SOURCE,
    MOVESET_LIMIT_REASON,
    UNSUPPORTED_COMPLEX_MOVES,
    isMechanicallySupportedMove
  } = sessionConstants || {
    SESSION_CONFIG: {
      TEAM_SIZE: 3,
      MOVE_LOADOUT_MIN: 1,
      MOVE_LOADOUT_MAX: 4,
      MOVE_LOADOUT_TARGET: 4,
      MOVE_DISCOVERY_WINDOW_SIZE: 8,
      MOVE_DISCOVERY_INITIAL_BUDGET: 24,
      MOVE_CANDIDATE_POOL_TARGET: 8,
      MAX_MOVE_DETAIL_REQUESTS_PER_POKEMON: 8
    },
    MOVESET_LOADOUT_SOURCE: {
      API_MOVESET: 'API_MOVESET',
      LIMITED_API_MOVESET: 'LIMITED_API_MOVESET',
      UNSUPPORTED_ENGINE_MOVESET: 'UNSUPPORTED_ENGINE_MOVESET',
      NETWORK_FALLBACK_MOVESET: 'NETWORK_FALLBACK_MOVESET'
    },
    MOVESET_LIMIT_REASON: {
      NONE: 'NONE',
      ENGINE_CAPABILITY_LIMIT: 'ENGINE_CAPABILITY_LIMIT',
      ZERO_SUPPORTED_ENGINE_MOVES: 'ZERO_SUPPORTED_ENGINE_MOVES',
      NETWORK_FALLBACK: 'NETWORK_FALLBACK'
    },
    UNSUPPORTED_COMPLEX_MOVES: {
      'hidden-power': { category: 'UNSUPPORTED_DYNAMIC_TYPE', reason: 'DYNAMIC_TYPE_FROM_IVS' },
      'eruption': { category: 'UNSUPPORTED_VARIABLE_DAMAGE', reason: 'POWER_FROM_USER_HP' },
      'water-spout': { category: 'UNSUPPORTED_VARIABLE_DAMAGE', reason: 'POWER_FROM_USER_HP' }
    },
    isMechanicallySupportedMove: (m) => {
      if (!m) return false;
      const n = String(m.name || '').toLowerCase();
      if (n === 'hidden-power' || n === 'eruption' || n === 'water-spout') return false;
      const dc = String(m.damageClass || m.damage_class?.name || '').toLowerCase();
      return (dc === 'physical' || dc === 'special') && Number(m.power) > 0;
    }
  };

  /**
   * Tabela de golpes padrão de contingência puramente determinísticos baseados em tipo
   * para casos de falha de rede ou ausência de golpes válidos na PokéAPI.
   */
  const FALLBACK_MOVES_BY_TYPE = Object.freeze({
    normal: { id: 33, name: 'tackle', type: 'normal', power: 40, accuracy: 100, pp: 35, damageClass: 'physical' },
    fire: { id: 52, name: 'ember', type: 'fire', power: 40, accuracy: 100, pp: 25, damageClass: 'special' },
    water: { id: 55, name: 'water-gun', type: 'water', power: 40, accuracy: 100, pp: 25, damageClass: 'special' },
    electric: { id: 84, name: 'thunder-shock', type: 'electric', power: 40, accuracy: 100, pp: 30, damageClass: 'special' },
    grass: { id: 71, name: 'vine-whip', type: 'grass', power: 45, accuracy: 100, pp: 25, damageClass: 'physical' },
    ice: { id: 181, name: 'powder-snow', type: 'ice', power: 40, accuracy: 100, pp: 25, damageClass: 'special' },
    fighting: { id: 67, name: 'low-kick', type: 'fighting', power: 50, accuracy: 100, pp: 20, damageClass: 'physical' },
    poison: { id: 40, name: 'poison-sting', type: 'poison', power: 35, accuracy: 100, pp: 35, damageClass: 'physical' },
    ground: { id: 189, name: 'mud-slap', type: 'ground', power: 20, accuracy: 100, pp: 20, damageClass: 'special' },
    flying: { id: 16, name: 'gust', type: 'flying', power: 40, accuracy: 100, pp: 35, damageClass: 'special' },
    psychic: { id: 93, name: 'confusion', type: 'psychic', power: 50, accuracy: 100, pp: 25, damageClass: 'special' },
    bug: { id: 450, name: 'bug-bite', type: 'bug', power: 60, accuracy: 100, pp: 20, damageClass: 'physical' },
    rock: { id: 88, name: 'rock-throw', type: 'rock', power: 50, accuracy: 90, pp: 15, damageClass: 'physical' },
    ghost: { id: 122, name: 'lick', type: 'ghost', power: 30, accuracy: 100, pp: 30, damageClass: 'physical' },
    dragon: { id: 225, name: 'dragon-breath', type: 'dragon', power: 60, accuracy: 100, pp: 20, damageClass: 'special' },
    dark: { id: 228, name: 'pursuit', type: 'dark', power: 40, accuracy: 100, pp: 20, damageClass: 'physical' },
    steel: { id: 232, name: 'metal-claw', type: 'steel', power: 50, accuracy: 95, pp: 35, damageClass: 'physical' },
    fairy: { id: 577, name: 'disarming-voice', type: 'fairy', power: 40, accuracy: null, pp: 15, damageClass: 'special' }
  });

  const FALLBACK_SPECIES = Object.freeze({
    1: { id: 1, number: 1, name: 'bulbasaur', types: ['grass', 'poison'], stats: { hp: 45, attack: 49, defense: 49, specialAttack: 65, specialDefense: 65, speed: 45 }, photo: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png', animatedPhoto: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/1.gif', cry: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/1.ogg', moves: [{ id: 71, name: 'vine-whip', power: 45, type: 'grass', damageClass: 'physical', pp: 25 }, { id: 33, name: 'tackle', power: 40, type: 'normal', damageClass: 'physical', pp: 35 }] },
    2: { id: 2, number: 2, name: 'ivysaur', types: ['grass', 'poison'], stats: { hp: 60, attack: 62, defense: 63, specialAttack: 80, specialDefense: 80, speed: 60 }, photo: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png', animatedPhoto: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/2.gif', cry: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/2.ogg', moves: [{ id: 71, name: 'vine-whip', power: 45, type: 'grass', damageClass: 'physical', pp: 25 }, { id: 33, name: 'tackle', power: 40, type: 'normal', damageClass: 'physical', pp: 35 }] },
    3: { id: 3, number: 3, name: 'venusaur', types: ['grass', 'poison'], stats: { hp: 80, attack: 82, defense: 83, specialAttack: 100, specialDefense: 100, speed: 80 }, photo: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png', animatedPhoto: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/3.gif', cry: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/3.ogg', moves: [{ id: 71, name: 'vine-whip', power: 45, type: 'grass', damageClass: 'physical', pp: 25 }, { id: 33, name: 'tackle', power: 40, type: 'normal', damageClass: 'physical', pp: 35 }] },
    4: { id: 4, number: 4, name: 'charmander', types: ['fire'], stats: { hp: 39, attack: 52, defense: 43, specialAttack: 60, specialDefense: 50, speed: 65 }, photo: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png', animatedPhoto: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/4.gif', cry: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/4.ogg', moves: [{ id: 53, name: 'flamethrower', power: 90, type: 'fire', damageClass: 'special', pp: 15 }, { id: 52, name: 'ember', power: 40, type: 'fire', damageClass: 'special', pp: 25 }] },
    6: { id: 6, number: 6, name: 'charizard', types: ['fire', 'flying'], stats: { hp: 78, attack: 84, defense: 78, specialAttack: 109, specialDefense: 85, speed: 100 }, photo: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png', animatedPhoto: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/6.gif', cry: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/6.ogg', moves: [{ id: 53, name: 'flamethrower', power: 90, type: 'fire', damageClass: 'special', pp: 15 }, { id: 52, name: 'ember', power: 40, type: 'fire', damageClass: 'special', pp: 25 }] },
    7: { id: 7, number: 7, name: 'squirtle', types: ['water'], stats: { hp: 44, attack: 48, defense: 65, specialAttack: 50, specialDefense: 64, speed: 43 }, photo: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png', animatedPhoto: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/7.gif', cry: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/7.ogg', moves: [{ id: 55, name: 'water-gun', power: 40, type: 'water', damageClass: 'special', pp: 25 }, { id: 33, name: 'tackle', power: 40, type: 'normal', damageClass: 'physical', pp: 35 }] },
    9: { id: 9, number: 9, name: 'blastoise', types: ['water'], stats: { hp: 79, attack: 83, defense: 100, specialAttack: 85, specialDefense: 105, speed: 78 }, photo: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png', animatedPhoto: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/9.gif', cry: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/9.ogg', moves: [{ id: 55, name: 'water-gun', power: 40, type: 'water', damageClass: 'special', pp: 25 }, { id: 33, name: 'tackle', power: 40, type: 'normal', damageClass: 'physical', pp: 35 }] },
    25: { id: 25, number: 25, name: 'pikachu', types: ['electric'], stats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 }, photo: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png', animatedPhoto: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/25.gif', cry: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/25.ogg', moves: [{ id: 85, name: 'thunderbolt', power: 90, type: 'electric', damageClass: 'special', pp: 15 }, { id: 98, name: 'quick-attack', power: 40, type: 'normal', damageClass: 'physical', pp: 30 }] },
    38: { id: 38, number: 38, name: 'ninetales', types: ['fire'], stats: { hp: 73, attack: 76, defense: 75, specialAttack: 81, specialDefense: 100, speed: 100 }, photo: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/38.png', animatedPhoto: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/38.gif', cry: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/38.ogg', moves: [{ id: 53, name: 'flamethrower', power: 90, type: 'fire', damageClass: 'special', pp: 15 }, { id: 52, name: 'ember', power: 40, type: 'fire', damageClass: 'special', pp: 25 }] },
    59: { id: 59, number: 59, name: 'arcanine', types: ['fire'], stats: { hp: 90, attack: 110, defense: 80, specialAttack: 100, specialDefense: 80, speed: 95 }, photo: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/59.png', animatedPhoto: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/59.gif', cry: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/59.ogg', moves: [{ id: 53, name: 'flamethrower', power: 90, type: 'fire', damageClass: 'special', pp: 15 }, { id: 52, name: 'ember', power: 40, type: 'fire', damageClass: 'special', pp: 25 }] },
    65: { id: 65, number: 65, name: 'alakazam', types: ['psychic'], stats: { hp: 55, attack: 50, defense: 45, specialAttack: 135, specialDefense: 95, speed: 120 }, photo: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/65.png', animatedPhoto: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/65.gif', cry: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/65.ogg', moves: [{ id: 93, name: 'confusion', power: 50, type: 'psychic', damageClass: 'special', pp: 25 }] },
    68: { id: 68, number: 68, name: 'machamp', types: ['fighting'], stats: { hp: 90, attack: 130, defense: 80, specialAttack: 65, specialDefense: 85, speed: 55 }, photo: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/68.png', animatedPhoto: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/68.gif', cry: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/68.ogg', moves: [{ id: 67, name: 'low-kick', power: 50, type: 'fighting', damageClass: 'physical', pp: 20 }, { id: 33, name: 'tackle', power: 40, type: 'normal', damageClass: 'physical', pp: 35 }] },
    94: { id: 94, number: 94, name: 'gengar', types: ['ghost', 'poison'], stats: { hp: 60, attack: 65, defense: 60, specialAttack: 130, specialDefense: 75, speed: 110 }, photo: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png', animatedPhoto: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/94.gif', cry: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/94.ogg', moves: [{ id: 122, name: 'lick', power: 30, type: 'ghost', damageClass: 'physical', pp: 30 }, { id: 40, name: 'poison-sting', power: 35, type: 'poison', damageClass: 'physical', pp: 35 }] },
    130: { id: 130, number: 130, name: 'gyarados', types: ['water', 'flying'], stats: { hp: 95, attack: 125, defense: 79, specialAttack: 60, specialDefense: 100, speed: 81 }, photo: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/130.png', animatedPhoto: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/130.gif', cry: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/130.ogg', moves: [{ id: 55, name: 'water-gun', power: 40, type: 'water', damageClass: 'special', pp: 25 }, { id: 33, name: 'tackle', power: 40, type: 'normal', damageClass: 'physical', pp: 35 }] },
    131: { id: 131, number: 131, name: 'lapras', types: ['water', 'ice'], stats: { hp: 130, attack: 85, defense: 80, specialAttack: 85, specialDefense: 95, speed: 60 }, photo: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/131.png', animatedPhoto: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/131.gif', cry: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/131.ogg', moves: [{ id: 55, name: 'water-gun', power: 40, type: 'water', damageClass: 'special', pp: 25 }, { id: 181, name: 'powder-snow', power: 40, type: 'ice', damageClass: 'special', pp: 25 }] },
    143: { id: 143, number: 143, name: 'snorlax', types: ['normal'], stats: { hp: 160, attack: 110, defense: 65, specialAttack: 65, specialDefense: 110, speed: 30 }, photo: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png', animatedPhoto: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/143.gif', cry: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/143.ogg', moves: [{ id: 33, name: 'tackle', power: 40, type: 'normal', damageClass: 'physical', pp: 35 }] },
    149: { id: 149, number: 149, name: 'dragonite', types: ['dragon', 'flying'], stats: { hp: 91, attack: 134, defense: 95, specialAttack: 100, specialDefense: 100, speed: 80 }, photo: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png', animatedPhoto: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/149.gif', cry: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/149.ogg', moves: [{ id: 225, name: 'dragon-breath', power: 60, type: 'dragon', damageClass: 'special', pp: 20 }, { id: 16, name: 'gust', power: 40, type: 'flying', damageClass: 'special', pp: 35 }] }
  });

  function getFallbackSpecies(idOrName) {
    const num = Number(idOrName);
    if (FALLBACK_SPECIES[num]) {
      return JSON.parse(JSON.stringify(FALLBACK_SPECIES[num]));
    }
    const foundByName = Object.values(FALLBACK_SPECIES).find(s => s.name === String(idOrName).toLowerCase());
    if (foundByName) {
      return JSON.parse(JSON.stringify(foundByName));
    }
    return {
      id: num || 25,
      number: num || 25,
      name: `pokemon-${idOrName}`,
      types: ['normal'],
      stats: { hp: 50, attack: 50, defense: 50, specialAttack: 50, specialDefense: 50, speed: 50 },
      photo: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${num || 25}.png`,
      animatedPhoto: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${num || 25}.gif`,
      cry: '',
      moves: [{ id: 33, name: 'tackle', power: 40, type: 'normal', damageClass: 'physical', pp: 35 }]
    };
  }

  class BattleTeamHydrator {
    /**
     * @param {Object} [options]
     * @param {Object} [options.api] - Serviço PokéAPI injetável para testes.
     * @param {number} [options.maxMoveRequests] - Teto de requisições por Pokémon.
     */
    constructor(options = {}) {
      this.api = options.api || (typeof window !== 'undefined' ? window.pokeApi : null) || pokeApiService || (typeof pokeApi !== 'undefined' ? pokeApi : null);
      this.maxMoveRequests = options.maxMoveRequests || SESSION_CONFIG.MAX_MOVE_DETAIL_REQUESTS_PER_POKEMON;
    }

    /**
     * Hidrata um time de IDs em combatentes prontos para o Battle Engine.
     * @param {number[]} pokemonIds - Lista de IDs únicos (ex: [25, 4, 1]).
     * @returns {Promise<Object[]>} Array de combatentes normalizados.
     */
    async hydrateTeam(pokemonIds) {
      if (!Array.isArray(pokemonIds) || pokemonIds.length === 0) {
        throw new Error('Lista de IDs de Pokémon para hidratação inválida ou vazia.');
      }

      const combatants = [];
      for (const id of pokemonIds) {
        const combatant = await this.hydratePokemon(id);
        combatants.push(combatant);
      }

      return combatants;
    }

    /**
     * Hidrata um Pokémon individual a partir de ID ou objeto pré-carregado.
     * @param {number|string|Object} pokemonOrId
     * @returns {Promise<Object>} Combatente normalizado no Combatant Model v3.
     */
    async hydratePokemon(pokemonOrId) {
      let pokeData;

      if (typeof pokemonOrId === 'object' && pokemonOrId !== null && pokemonOrId.stats && pokemonOrId.moves) {
        pokeData = pokemonOrId;
      } else if (this.api && typeof this.api.getPokemonDetail === 'function') {
        try {
          pokeData = await this.api.getPokemonDetail(pokemonOrId);
        } catch (fetchErr) {
          pokeData = getFallbackSpecies(pokemonOrId);
        }
      } else {
        pokeData = getFallbackSpecies(pokemonOrId);
      }

      const id = Number(pokeData.number || pokeData.id);
      const name = String(pokeData.name || '').trim();
      const types = Array.isArray(pokeData.types) ? [...pokeData.types] : (pokeData.type ? [pokeData.type] : ['normal']);

      const rawStats = pokeData.stats || {};
      const baseStats = {
        hp: Math.max(1, Number(rawStats.hp || 50)),
        attack: Math.max(1, Number(rawStats.attack || 50)),
        defense: Math.max(1, Number(rawStats.defense || 50)),
        specialAttack: Math.max(1, Number(rawStats.specialAttack || rawStats.attack || 50)),
        specialDefense: Math.max(1, Number(rawStats.specialDefense || rawStats.defense || 50)),
        speed: Math.max(1, Number(rawStats.speed || 50))
      };

      const normalized = (BattleStatNormalizer && typeof BattleStatNormalizer.normalizeStats === 'function')
        ? BattleStatNormalizer.normalizeStats(baseStats, { pokemonId: id, pokemonName: name })
        : {
            hp: baseStats.hp,
            attack: baseStats.attack,
            defense: baseStats.defense,
            specialAttack: baseStats.specialAttack,
            specialDefense: baseStats.specialDefense,
            speed: baseStats.speed,
            baseStats
          };

      const hp = normalized.hp;
      const attack = normalized.attack;
      const defense = normalized.defense;
      const specialAttack = normalized.specialAttack;
      const specialDefense = normalized.specialDefense;
      const speed = normalized.speed;

      const stats = {
        hp,
        attack,
        defense,
        specialAttack,
        specialDefense,
        speed
      };

      // Resolve loadout de golpes determinístico com descoberta progressiva e qualidade
      const candidateMoves = Array.isArray(pokeData.moves) ? pokeData.moves : [];
      const loadoutResult = await this.selectDeterministicLoadout(candidateMoves, types, stats);
      const moves = loadoutResult.moves || [];
      const moveLoadoutSource = loadoutResult.source || MOVESET_LOADOUT_SOURCE.API_MOVESET;
      const moveLoadoutReason = loadoutResult.reason || MOVESET_LIMIT_REASON.NONE;

      return {
        id,
        name,
        types,
        hp,
        maxHp: hp,
        currentHp: hp,
        attack,
        defense,
        specialAttack,
        specialDefense,
        speed,
        stats,
        baseStats: normalized.baseStats || baseStats,
        moves,
        moveLoadoutSource,
        moveLoadoutReason,
        photo: pokeData.photo || '',
        animatedPhoto: pokeData.animatedPhoto || pokeData.photo || '',
        cry: pokeData.cry || ''
      };
    }

    /**
     * Prioriza os candidatos disponíveis da espécie de forma estável e agnóstica de versão,
     * priorizando golpes com aprendizado por level-up para maximizar STABs naturais e clássicos
     * antes de TMs/tutores/outros, minimizando requisições de rede.
     *
     * @param {Array<Object>} candidates
     * @returns {Array<Object>}
     */
    prioritizeCandidates(candidates) {
      if (!Array.isArray(candidates) || candidates.length === 0) return [];
      const levelUp = [];
      const other = [];

      for (const cand of candidates) {
        if (!cand) continue;
        const vgDetails = cand.versionGroupDetails || cand.version_group_details;
        const isLevelUp = Array.isArray(vgDetails) && vgDetails.some((vg) => {
          const method = (vg && (vg.moveLearnMethod || vg.move_learn_method)) || '';
          const methodName = typeof method === 'object' ? method.name : method;
          return String(methodName).toLowerCase() === 'level-up';
        });

        if (isLevelUp) {
          levelUp.push(cand);
        } else {
          other.push(cand);
        }
      }

      return [...levelUp, ...other];
    }

    /**
     * Seleciona determinística e ordenadamente até 4 golpes suportados válidos,
     * com descoberta progressiva por janelas, parada antecipada, resgate exaustivo
     * e heurística de qualidade (STAB, afinidade ofensiva, cobertura e acurácia).
     *
     * @param {Array<{ name: string, url: string }|Object>} candidates - Lista de candidatos da PokéAPI.
     * @param {string[]} types - Tipos do Pokémon (para pontuação STAB).
     * @param {Object} stats - Stats do Pokémon (para priorização físico/especial).
     * @returns {Promise<{ moves: Object[], source: string, reason: string }|Object[]>} Objeto com moves ou array de 1 a 4 golpes normalizados.
     */
    async selectDeterministicLoadout(candidates, types, stats) {
      const normalizedTypes = (Array.isArray(types) ? types : ['normal']).map((t) => String(t || '').toLowerCase());
      const candidateList = Array.isArray(candidates) ? candidates : [];

      if (candidateList.length === 0) {
        return this.createNetworkFallback(normalizedTypes);
      }

      // Reordena os candidatos dando prioridade a level-up moves (mais propensos a STAB e identidade)
      const prioritizedCandidates = this.prioritizeCandidates(candidateList);

      const validPool = [];
      const seenMoveIds = new Set();
      const seenMoveNames = new Set();

      const windowSize = Math.max(1, Number(SESSION_CONFIG.MOVE_DISCOVERY_WINDOW_SIZE || 8));
      const poolTarget = Math.max(4, Number(SESSION_CONFIG.MOVE_CANDIDATE_POOL_TARGET || 8));
      const initialBudget = Math.max(windowSize, Number(SESSION_CONFIG.MOVE_DISCOVERY_INITIAL_BUDGET || 24));
      const maxLoadoutTarget = Number(SESSION_CONFIG.MOVE_LOADOUT_TARGET || 4);

      let moveDetailSuccesses = 0;
      let moveDetailFailures = 0;

      // Descoberta progressiva em janelas
      let currentIndex = 0;
      const totalCandidates = prioritizedCandidates.length;

      while (currentIndex < totalCandidates) {
        // Define o lote da janela atual
        const windowChunk = prioritizedCandidates.slice(currentIndex, currentIndex + windowSize);
        currentIndex += windowSize;

        // Processa a janela em paralelo
        const detailPromises = windowChunk.map(async (cand) => {
          try {
            if (cand.power !== undefined && cand.damageClass !== undefined) {
              moveDetailSuccesses++;
              return cand;
            }
            if (this.api && typeof this.api.getMoveDetail === 'function') {
              const res = await this.api.getMoveDetail(cand);
              if (res) {
                moveDetailSuccesses++;
                return res;
              } else {
                moveDetailFailures++;
                return null;
              }
            }
            // Sem API disponível: falha de resolução de rede/serviço
            moveDetailFailures++;
            return null;
          } catch {
            // Falhas de rede individuais são contabilizadas
            moveDetailFailures++;
            return null;
          }
        });

        const details = await Promise.all(detailPromises);

        for (const moveDetail of details) {
          if (!moveDetail) continue;

          // Validações estritas de suporte (PBA-005 / MQ06 / MQ07 / PBA-014C-FINAL-HARDENING):
          // Descarta status moves, golpes sem power base positivo e golpes com mecânicas especiais não suportadas (ex: hidden-power)
          if (!isMechanicallySupportedMove(moveDetail)) continue;

          const dmgClass = String(moveDetail.damageClass || moveDetail.damage_class?.name || '').toLowerCase();
          const power = Number(moveDetail.power);

          let moveId = Number(moveDetail.id);
          if (!Number.isInteger(moveId) || moveId <= 0) {
            if (moveDetail.url) {
              const match = String(moveDetail.url).match(/\/move\/(\d+)\/?/);
              if (match) moveId = parseInt(match[1], 10);
            }
          }
          if (!Number.isInteger(moveId) || moveId <= 0) {
            const fallbackByType = FALLBACK_MOVES_BY_TYPE[String(moveDetail.type || 'normal').toLowerCase()] || FALLBACK_MOVES_BY_TYPE.normal;
            moveId = fallbackByType.id || 33;
          }
          const moveName = String(moveDetail.name).trim().toLowerCase();

          if (seenMoveIds.has(moveId) || seenMoveNames.has(moveName)) continue;

          seenMoveIds.add(moveId);
          seenMoveNames.add(moveName);

          const pp = Math.max(1, Number(moveDetail.pp || 15));
          validPool.push({
            id: moveId,
            name: moveName,
            type: String(moveDetail.type || 'normal').toLowerCase(),
            power,
            accuracy: moveDetail.accuracy !== undefined ? moveDetail.accuracy : 100,
            pp,
            maxPp: pp,
            currentPp: pp,
            damageClass: dmgClass
          });
        }

        // Critério de Parada Antecipada (MQ10):
        // Se a pool atingiu o poolTarget E já temos ao menos um STAB (ou se já consumimos o initialBudget)
        const hasStab = validPool.some((m) => normalizedTypes.includes(m.type));
        if (validPool.length >= poolTarget && (hasStab || currentIndex >= initialBudget)) {
          break;
        }

        // Resgate Exaustivo (MQ09):
        // Se após initialBudget tivermos menos de 4 golpes válidos, o loop continua automaticamente
        // até atingir 4 golpes ou esgotar totalCandidates.
        if (currentIndex >= initialBudget && validPool.length >= maxLoadoutTarget) {
          break;
        }
      }

      // Se nenhum golpe suportado foi encontrado após a busca:
      if (validPool.length === 0) {
        // Distinção Semântica Estrita (PBA-014C-HARDENING):
        // Se houve requisições e TODAS falharam por erro de rede (ou se a lista era puramente de rede e zero responderam),
        // trata-se de falha real de rede -> NETWORK_FALLBACK_MOVESET.
        // Se a API respondeu e detalhes foram obtidos com sucesso, mas nenhum golpe ofensivo é suportado pelo Engine,
        // trata-se de limitação do Engine -> UNSUPPORTED_ENGINE_MOVESET com moves = [] (sem injeção de golpes falsos).
        const hadCandidates = totalCandidates > 0;
        const totalAttempts = moveDetailSuccesses + moveDetailFailures;
        const isNetworkFailure = totalAttempts > 0 && moveDetailSuccesses === 0 && moveDetailFailures > 0;

        if (isNetworkFailure || !hadCandidates) {
          const fallback = this.createNetworkFallback(normalizedTypes);
          this.lastLoadoutDiagnostic = {
            candidateCount: totalCandidates,
            moveDetailSuccesses,
            moveDetailFailures,
            supportedCount: 0,
            source: fallback.source,
            reason: fallback.reason
          };
          return fallback;
        }

        const unsupported = this.createUnsupportedLoadout();
        this.lastLoadoutDiagnostic = {
          candidateCount: totalCandidates,
          moveDetailSuccesses,
          moveDetailFailures,
          supportedCount: 0,
          source: unsupported.source,
          reason: unsupported.reason
        };
        return unsupported;
      }

      // Aplica Seletor de Qualidade Heurístico Determinístico (STAB, afinidade, cobertura, acurácia)
      const selectedMoves = this.selectQualityLoadout(validPool, normalizedTypes, stats, maxLoadoutTarget);

      const isTrulyLimited = selectedMoves.length < maxLoadoutTarget;
      const source = isTrulyLimited
        ? MOVESET_LOADOUT_SOURCE.LIMITED_API_MOVESET
        : MOVESET_LOADOUT_SOURCE.API_MOVESET;
      const reason = isTrulyLimited
        ? MOVESET_LIMIT_REASON.ENGINE_CAPABILITY_LIMIT
        : MOVESET_LIMIT_REASON.NONE;

      // Compatibilidade regressiva: adiciona propriedades ao array caso código legado espere Array puro
      selectedMoves.source = source;
      selectedMoves.reason = reason;
      selectedMoves.moves = selectedMoves;

      this.lastLoadoutDiagnostic = {
        candidateCount: totalCandidates,
        moveDetailSuccesses,
        moveDetailFailures,
        supportedCount: validPool.length,
        source,
        reason
      };

      return selectedMoves;
    }

    /**
     * Cria resultado para espécies cujos golpes são todos incompatíveis com o Engine atual.
     * Retorna moves vazio SEM injetar fake moves (Tackle, etc.).
     */
    createUnsupportedLoadout() {
      const emptyMoves = [];
      emptyMoves.source = MOVESET_LOADOUT_SOURCE.UNSUPPORTED_ENGINE_MOVESET;
      emptyMoves.reason = MOVESET_LIMIT_REASON.ZERO_SUPPORTED_ENGINE_MOVES;
      emptyMoves.moves = emptyMoves;
      return emptyMoves;
    }

    /**
     * Heurística determinística de montagem de loadout ótimo.
     * Considera:
     * 1. STAB (+50 pontos)
     * 2. Afinidade física / especial (+20 pontos)
     * 3. Acurácia esperada (fator de confiabilidade)
     * 4. Cobertura elemental diversificada
     * 5. Ordenação final estável e decrescente por score -> power -> accuracy -> nome
     */
    selectQualityLoadout(validPool, types, stats, targetCount) {
      const isPhysicalAttacker = Number(stats.attack || 50) >= Number(stats.specialAttack || 50);

      // Calcula a pontuação individual de cada golpe candidato
      const scoredCandidates = validPool.map((move) => {
        let score = move.power;

        // 1. Bônus de STAB (Same-Type Attack Bonus)
        const isStab = types.includes(move.type);
        if (isStab) score += 50;

        // 2. Afinidade com atributo de ataque dominante
        if (isPhysicalAttacker && move.damageClass === 'physical') {
          score += 20;
        } else if (!isPhysicalAttacker && move.damageClass === 'special') {
          score += 20;
        }

        // 3. Fator de acurácia (evita que golpes com acurácia muito baixa dominem cegamente)
        const acc = (move.accuracy !== null && move.accuracy !== undefined) ? Number(move.accuracy) : 100;
        score += (acc - 80) * 0.2;

        return {
          move,
          score,
          isStab
        };
      });

      // Ordenação primária determinística dos candidatos pontuados
      scoredCandidates.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.move.power !== a.move.power) return b.move.power - a.move.power;
        const accA = a.move.accuracy !== null ? a.move.accuracy : 100;
        const accB = b.move.accuracy !== null ? b.move.accuracy : 100;
        if (accB !== accA) return accB - accA;
        return a.move.name.localeCompare(b.move.name);
      });

      const selected = [];
      const seenTypes = new Set();

      // PASSO 1: Garantir pelo menos um STAB quando disponível (MQ19)
      const bestStabCandidate = scoredCandidates.find((c) => c.isStab);
      if (bestStabCandidate) {
        selected.push(bestStabCandidate.move);
        seenTypes.add(bestStabCandidate.move.type);
      }

      // PASSO 2: Priorizar diversidade de cobertura elemental (MQ21)
      for (const item of scoredCandidates) {
        if (selected.length >= targetCount) break;
        if (selected.some((m) => m.name === item.move.name)) continue;

        if (!seenTypes.has(item.move.type)) {
          selected.push(item.move);
          seenTypes.add(item.move.type);
        }
      }

      // PASSO 3: Preencher vagas restantes até atingir targetCount com os melhores golpes restantes
      for (const item of scoredCandidates) {
        if (selected.length >= targetCount) break;
        if (!selected.some((m) => m.name === item.move.name)) {
          selected.push(item.move);
        }
      }

      // Ordenação final estável do loadout para UI/AI (MQ26)
      selected.sort((a, b) => {
        const itemA = scoredCandidates.find((c) => c.move.name === a.name);
        const itemB = scoredCandidates.find((c) => c.move.name === b.name);
        const scoreA = itemA ? itemA.score : a.power;
        const scoreB = itemB ? itemB.score : b.power;
        if (scoreB !== scoreA) return scoreB - scoreA;
        if (b.power !== a.power) return b.power - a.power;
        const accA = a.accuracy !== null ? a.accuracy : 100;
        const accB = b.accuracy !== null ? b.accuracy : 100;
        if (accB !== accA) return accB - accA;
        return a.name.localeCompare(b.name);
      });

      return selected;
    }

    /**
     * Fallback determinístico de contingência estritamente reservado para falhas de rede.
     */
    createNetworkFallback(types) {
      const primaryType = (types[0] || 'normal').toLowerCase();
      const primaryFallback = FALLBACK_MOVES_BY_TYPE[primaryType] || FALLBACK_MOVES_BY_TYPE.normal;
      const tackleFallback = FALLBACK_MOVES_BY_TYPE.normal;

      const fallbackList = [
        {
          ...primaryFallback,
          maxPp: primaryFallback.pp,
          currentPp: primaryFallback.pp
        }
      ];

      if (primaryType !== 'normal') {
        fallbackList.push({
          ...tackleFallback,
          maxPp: tackleFallback.pp,
          currentPp: tackleFallback.pp
        });
      }

      fallbackList.source = MOVESET_LOADOUT_SOURCE.NETWORK_FALLBACK_MOVESET;
      fallbackList.reason = MOVESET_LIMIT_REASON.NETWORK_FALLBACK;
      fallbackList.moves = fallbackList;

      return fallbackList;
    }
  }

  const exportsObj = {
    BattleTeamHydrator,
    FALLBACK_MOVES_BY_TYPE
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exportsObj;
  } else if (typeof window !== 'undefined') {
    window.PBABattleSession = window.PBABattleSession || {};
    Object.assign(window.PBABattleSession, exportsObj);
  }
})();
