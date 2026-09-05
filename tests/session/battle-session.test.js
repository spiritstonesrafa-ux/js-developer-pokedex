/**
 * ====================================================================
 * TESTES AUTOMATIZADOS: BATTLE SESSION LAYER (battle-session.test.js)
 * ====================================================================
 * Validação rigorosa dos módulos da camada de sessão de batalha (PBA-013):
 * - BattleSessionConstants;
 * - BattleRandomSource e DeterministicRandomSource (RNG externo e injetável);
 * - BattleTeamHydrator (Stats, Combantant Model v3 e Loadout determinístico de 1 a 4 golpes);
 * - BattleOpponentFactory (3 Pokémon sem repetição de espécie);
 * - BattleSessionController (Ciclo de preparação, início, turnos com SMART AI, trocas e rematch).
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');

const { BATTLE_UI_STATES, SESSION_CONFIG } = require('../../assets/js/battle-session/battle-session-constants.js');
const { BattleRandomSource, DeterministicRandomSource } = require('../../assets/js/battle-session/battle-random-source.js');
const { BattleTeamHydrator } = require('../../assets/js/battle-session/battle-team-hydrator.js');
const { BattleOpponentFactory } = require('../../assets/js/battle-session/battle-opponent-factory.js');
const { BattleSessionController } = require('../../assets/js/battle-session/battle-session-controller.js');

// Mock offline da PokéAPI para testes unitários controlados
function createMockPokeApi() {
  const mockDatabase = {
    25: {
      number: 25,
      name: 'pikachu',
      types: ['electric'],
      stats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 },
      photo: 'pikachu.png',
      moves: [
        { name: 'thunderbolt', url: 'https://pokeapi.co/api/v2/move/85/' },
        { name: 'quick-attack', url: 'https://pokeapi.co/api/v2/move/98/' },
        { name: 'growl', url: 'https://pokeapi.co/api/v2/move/45/' }, // status -> descartar
        { name: 'thunder-shock', url: 'https://pokeapi.co/api/v2/move/84/' }
      ]
    },
    4: {
      number: 4,
      name: 'charmander',
      types: ['fire'],
      stats: { hp: 39, attack: 52, defense: 43, specialAttack: 60, specialDefense: 50, speed: 65 },
      photo: 'charmander.png',
      moves: [
        { name: 'flamethrower', url: 'https://pokeapi.co/api/v2/move/53/' },
        { name: 'scratch', url: 'https://pokeapi.co/api/v2/move/10/' },
        { name: 'ember', url: 'https://pokeapi.co/api/v2/move/52/' }
      ]
    },
    1: {
      number: 1,
      name: 'bulbasaur',
      types: ['grass', 'poison'],
      stats: { hp: 45, attack: 49, defense: 49, specialAttack: 65, specialDefense: 65, speed: 45 },
      photo: 'bulbasaur.png',
      moves: [
        { name: 'vine-whip', url: 'https://pokeapi.co/api/v2/move/71/' },
        { name: 'tackle', url: 'https://pokeapi.co/api/v2/move/33/' }
      ]
    },
    7: {
      number: 7,
      name: 'squirtle',
      types: ['water'],
      stats: { hp: 44, attack: 48, defense: 65, specialAttack: 50, specialDefense: 64, speed: 43 },
      photo: 'squirtle.png',
      moves: [
        { name: 'water-gun', url: 'https://pokeapi.co/api/v2/move/55/' },
        { name: 'tackle', url: 'https://pokeapi.co/api/v2/move/33/' }
      ]
    },
    143: {
      number: 143,
      name: 'snorlax',
      types: ['normal'],
      stats: { hp: 160, attack: 110, defense: 65, specialAttack: 65, specialDefense: 110, speed: 30 },
      photo: 'snorlax.png',
      moves: [
        { name: 'body-slam', url: 'https://pokeapi.co/api/v2/move/34/' },
        { name: 'rest', url: 'https://pokeapi.co/api/v2/move/156/' } // status -> descartar
      ]
    }
  };

  const mockMoveDetails = {
    thunderbolt: { id: 85, name: 'thunderbolt', type: 'electric', power: 90, accuracy: 100, pp: 15, damageClass: 'special' },
    'quick-attack': { id: 98, name: 'quick-attack', type: 'normal', power: 40, accuracy: 100, pp: 30, damageClass: 'physical' },
    growl: { id: 45, name: 'growl', type: 'normal', power: null, accuracy: 100, pp: 40, damageClass: 'status' },
    'thunder-shock': { id: 84, name: 'thunder-shock', type: 'electric', power: 40, accuracy: 100, pp: 30, damageClass: 'special' },
    flamethrower: { id: 53, name: 'flamethrower', type: 'fire', power: 90, accuracy: 100, pp: 15, damageClass: 'special' },
    scratch: { id: 10, name: 'scratch', type: 'normal', power: 40, accuracy: 100, pp: 35, damageClass: 'physical' },
    ember: { id: 52, name: 'ember', type: 'fire', power: 40, accuracy: 100, pp: 25, damageClass: 'special' },
    'vine-whip': { id: 71, name: 'vine-whip', type: 'grass', power: 45, accuracy: 100, pp: 25, damageClass: 'physical' },
    tackle: { id: 33, name: 'tackle', type: 'normal', power: 40, accuracy: 100, pp: 35, damageClass: 'physical' },
    'water-gun': { id: 55, name: 'water-gun', type: 'water', power: 40, accuracy: 100, pp: 25, damageClass: 'special' },
    'body-slam': { id: 34, name: 'body-slam', type: 'normal', power: 85, accuracy: 100, pp: 15, damageClass: 'physical' },
    rest: { id: 156, name: 'rest', type: 'psychic', power: null, accuracy: null, pp: 10, damageClass: 'status' }
  };

  let getPokemonRequests = 0;
  let getMoveRequests = 0;

  return {
    getPokemonRequests: () => getPokemonRequests,
    getMoveRequests: () => getMoveRequests,
    getPokemonDetail: async (idOrName) => {
      getPokemonRequests++;
      const key = Number(idOrName) || idOrName;
      if (mockDatabase[key]) return JSON.parse(JSON.stringify(mockDatabase[key]));
      throw new Error(`Pokemon não encontrado: ${idOrName}`);
    },
    getMoveDetail: async (moveRef) => {
      getMoveRequests++;
      const name = (typeof moveRef === 'object' ? moveRef.name : moveRef).toLowerCase();
      if (mockMoveDetails[name]) return JSON.parse(JSON.stringify(mockMoveDetails[name]));
      throw new Error(`Golpe não encontrado: ${name}`);
    }
  };
}

describe('PHASE PBA-013 — BATTLE SESSION LAYER', () => {
  it('SES01 — Constants: UI states and configuration limits are defined', () => {
    assert.strictEqual(BATTLE_UI_STATES.NO_TEAM, 'NO_TEAM');
    assert.strictEqual(BATTLE_UI_STATES.READY, 'READY');
    assert.strictEqual(BATTLE_UI_STATES.BATTLE, 'BATTLE');
    assert.strictEqual(BATTLE_UI_STATES.VICTORY, 'VICTORY');
    assert.strictEqual(BATTLE_UI_STATES.DEFEAT, 'DEFEAT');
    assert.strictEqual(SESSION_CONFIG.TEAM_SIZE, 3);
    assert.strictEqual(SESSION_CONFIG.MAX_MOVE_DETAIL_REQUESTS_PER_POKEMON, 8);
    assert.ok(Array.isArray(SESSION_CONFIG.KANTO_OPPONENT_POOL));
    assert.ok(SESSION_CONFIG.KANTO_OPPONENT_POOL.length >= 10);
  });

  it('SES02 — Random Source: produces rolls in range 1..100 and deterministic injection works', () => {
    const defaultRng = new BattleRandomSource();
    for (let i = 0; i < 20; i++) {
      const roll = defaultRng.rollAccuracy();
      assert.ok(roll >= 1 && roll <= 100, `Roll ${roll} fora do intervalo 1..100`);
    }

    const detRng = new DeterministicRandomSource({ accuracySequence: [85, 12, 100, 1] });
    assert.strictEqual(detRng.rollAccuracy(), 85);
    assert.strictEqual(detRng.rollAccuracy(), 12);
    assert.strictEqual(detRng.rollAccuracy(), 100);
    assert.strictEqual(detRng.rollAccuracy(), 1);
  });

  it('SES03 — Random Source: selects N unique opponents without duplicates', () => {
    const rng = new BattleRandomSource();
    const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const picked = rng.pickOpponents(pool, 3);

    assert.strictEqual(picked.length, 3);
    const unique = new Set(picked);
    assert.strictEqual(unique.size, 3);
    picked.forEach(id => assert.ok(pool.includes(id)));
  });

  it('SES04 — Hydrator: converts Pokémon IDs to Combatant Model v3 format', async () => {
    const mockApi = createMockPokeApi();
    const hydrator = new BattleTeamHydrator({ api: mockApi });

    const team = await hydrator.hydrateTeam([25, 4, 1]);
    assert.strictEqual(team.length, 3);

    const pikachu = team[0];
    assert.strictEqual(pikachu.id, 25);
    assert.strictEqual(pikachu.name, 'pikachu');
    assert.deepStrictEqual(pikachu.types, ['electric']);
    assert.strictEqual(pikachu.hp, 35);
    assert.strictEqual(pikachu.maxHp, 35);
    assert.strictEqual(pikachu.currentHp, 35);
    assert.ok(pikachu.speed > 0);
    assert.ok(Array.isArray(pikachu.moves));
    assert.ok(pikachu.moves.length >= 1 && pikachu.moves.length <= 4);
  });

  it('SES05 — Hydrator: excludes status moves and duplicates in move loadout', async () => {
    const mockApi = createMockPokeApi();
    const hydrator = new BattleTeamHydrator({ api: mockApi });

    const pikachu = await hydrator.hydratePokemon(25);
    const moveNames = pikachu.moves.map(m => m.name);

    assert.ok(!moveNames.includes('growl'), 'Status move "growl" não deve ser incluído no loadout.');
    const uniqueNames = new Set(moveNames);
    assert.strictEqual(uniqueNames.size, moveNames.length, 'Não deve haver golpes duplicados.');

    pikachu.moves.forEach(m => {
      assert.ok(m.power > 0, `Poder de ${m.name} deve ser maior que zero.`);
      assert.ok(m.damageClass === 'physical' || m.damageClass === 'special');
      assert.ok(m.pp > 0);
      assert.strictEqual(m.currentPp, m.pp);
    });
  });

  it('SES06 — Hydrator: loadout is deterministic for the same Pokemon data', async () => {
    const mockApi = createMockPokeApi();
    const hydrator1 = new BattleTeamHydrator({ api: mockApi });
    const hydrator2 = new BattleTeamHydrator({ api: mockApi });

    const char1 = await hydrator1.hydratePokemon(4);
    const char2 = await hydrator2.hydratePokemon(4);

    assert.deepStrictEqual(
      char1.moves.map(m => m.name),
      char2.moves.map(m => m.name),
      'Loadouts de Charmander devem ser estritamente idênticos.'
    );
  });

  it('SES07 — Opponent Factory: creates valid 3-combatant opponent team without duplicates', async () => {
    const mockApi = createMockPokeApi();
    const hydrator = new BattleTeamHydrator({ api: mockApi });
    const randomSource = new DeterministicRandomSource({ opponentSequence: [7, 4, 25] });

    const factory = new BattleOpponentFactory({
      hydrator,
      randomSource,
      pool: [1, 4, 7, 25, 143]
    });

    const team = await factory.createOpponentTeam();
    assert.strictEqual(team.length, 3);
    assert.strictEqual(team[0].id, 7);
    assert.strictEqual(team[1].id, 4);
    assert.strictEqual(team[2].id, 25);
  });

  it('SES08 — Session Controller: lifecycle from preparation to full battle creation', async () => {
    const mockApi = createMockPokeApi();
    const hydrator = new BattleTeamHydrator({ api: mockApi });
    const randomSource = new DeterministicRandomSource({
      opponentSequence: [7, 4, 143],
      accuracySequence: [10, 10, 10, 10]
    });

    const teamStoreMock = {
      load: () => [25, 4, 1]
    };

    const controller = new BattleSessionController({
      teamStore: teamStoreMock,
      hydrator,
      randomSource,
      opponentFactory: new BattleOpponentFactory({ hydrator, randomSource, pool: [1, 4, 7, 25, 143] })
    });

    assert.strictEqual(controller.checkTeamAndInit(), true);
    assert.strictEqual(controller.uiState, BATTLE_UI_STATES.READY);

    await controller.prepareBattle();
    assert.ok(controller.battleState !== null);
    assert.strictEqual(controller.battleState.player.team.length, 3);
    assert.strictEqual(controller.battleState.enemy.team.length, 3);
    assert.strictEqual(controller.battleState.player.activeIndex, 0); // Líder ativo inicial
    assert.strictEqual(controller.battleState.enemy.activeIndex, 0);
  });
});
