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

  if (typeof module !== 'undefined' && module.exports) {
    sessionConstants = require('./battle-session-constants.js');
    try {
      pokeApiService = require('../poke-api.js');
    } catch {
      pokeApiService = null;
    }
  } else if (typeof window !== 'undefined') {
    sessionConstants = window.PBABattleSession || {};
    pokeApiService = window.pokeApi;
  }

  const { SESSION_CONFIG } = sessionConstants || {
    SESSION_CONFIG: {
      TEAM_SIZE: 3,
      MOVE_LOADOUT_MIN: 1,
      MOVE_LOADOUT_MAX: 4,
      MAX_MOVE_DETAIL_REQUESTS_PER_POKEMON: 8
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
      this.api = options.api || pokeApiService || (typeof window !== 'undefined' ? window.pokeApi : null);
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
      const hp = Math.max(1, Number(rawStats.hp || 50));
      const attack = Math.max(1, Number(rawStats.attack || 50));
      const defense = Math.max(1, Number(rawStats.defense || 50));
      const specialAttack = Math.max(1, Number(rawStats.specialAttack || attack));
      const specialDefense = Math.max(1, Number(rawStats.specialDefense || defense));
      const speed = Math.max(1, Number(rawStats.speed || 50));

      const stats = {
        hp,
        attack,
        defense,
        specialAttack,
        specialDefense,
        speed
      };

      // Resolve loadout de golpes determinístico
      const candidateMoves = Array.isArray(pokeData.moves) ? pokeData.moves : [];
      const moves = await this.selectDeterministicLoadout(candidateMoves, types, stats);

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
        moves,
        photo: pokeData.photo || '',
        animatedPhoto: pokeData.animatedPhoto || pokeData.photo || '',
        cry: pokeData.cry || ''
      };
    }

    /**
     * Seleciona determinística e ordenadamente até 4 golpes suportados válidos.
     * @param {Array<{ name: string, url: string }|Object>} candidates - Lista de candidatos da PokéAPI.
     * @param {string[]} types - Tipos do Pokémon (para pontuação STAB).
     * @param {Object} stats - Stats do Pokémon (para priorização físico/especial).
     * @returns {Promise<Object[]>} Array de 1 a 4 golpes normalizados.
     */
    async selectDeterministicLoadout(candidates, types, stats) {
      const validMoves = [];
      const seenMoveIds = new Set();
      const seenMoveNames = new Set();

      // Limita a busca a uma shortlist determinística para evitar explosão de requisições
      const shortlist = candidates.slice(0, this.maxMoveRequests);

      for (const cand of shortlist) {
        if (validMoves.length >= SESSION_CONFIG.MOVE_LOADOUT_MAX) break;

        try {
          let moveDetail;
          if (cand.power !== undefined && cand.damageClass !== undefined) {
            moveDetail = cand;
          } else if (this.api && typeof this.api.getMoveDetail === 'function') {
            moveDetail = await this.api.getMoveDetail(cand);
          } else {
            continue;
          }

          if (!moveDetail) continue;

          // Validações estritas de suporte (PBA-005):
          // Descarta status moves e moves sem poder base positivo
          const dmgClass = String(moveDetail.damageClass || '').toLowerCase();
          const power = Number(moveDetail.power);

          if (dmgClass !== 'physical' && dmgClass !== 'special') continue;
          if (!Number.isFinite(power) || power <= 0) continue;

          let moveId = Number(moveDetail.id);
          if (!Number.isInteger(moveId) || moveId <= 0) {
            if (moveDetail.url) {
              const match = String(moveDetail.url).match(/\/move\/(\d+)\/?/);
              if (match) moveId = parseInt(match[1], 10);
            } else if (cand && cand.url) {
              const match = String(cand.url).match(/\/move\/(\d+)\/?/);
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
          validMoves.push({
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
        } catch {
          // Ignora falhas de golpe individual e prossegue
          continue;
        }
      }

      // Se não encontrou golpes suficientes pela API, adiciona fallbacks determinísticos de segurança
      if (validMoves.length === 0) {
        const primaryType = (types[0] || 'normal').toLowerCase();
        const primaryFallback = FALLBACK_MOVES_BY_TYPE[primaryType] || FALLBACK_MOVES_BY_TYPE.normal;
        const tackleFallback = FALLBACK_MOVES_BY_TYPE.normal;

        validMoves.push({
          ...primaryFallback,
          maxPp: primaryFallback.pp,
          currentPp: primaryFallback.pp
        });

        if (primaryType !== 'normal') {
          validMoves.push({
            ...tackleFallback,
            maxPp: tackleFallback.pp,
            currentPp: tackleFallback.pp
          });
        }
      }

      // Ordenação heurística determinística:
      // 1. STAB (+50 pontos)
      // 2. Afinidade com melhor atributo ofensivo (+20 pontos)
      // 3. Maior poder base
      const isPhysicalAttacker = stats.attack >= stats.specialAttack;
      validMoves.sort((a, b) => {
        let scoreA = a.power;
        let scoreB = b.power;

        if (types.includes(a.type)) scoreA += 50;
        if (types.includes(b.type)) scoreB += 50;

        if (isPhysicalAttacker && a.damageClass === 'physical') scoreA += 20;
        else if (!isPhysicalAttacker && a.damageClass === 'special') scoreA += 20;

        if (isPhysicalAttacker && b.damageClass === 'physical') scoreB += 20;
        else if (!isPhysicalAttacker && b.damageClass === 'special') scoreB += 20;

        return scoreB - scoreA;
      });

      return validMoves.slice(0, SESSION_CONFIG.MOVE_LOADOUT_MAX);
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
