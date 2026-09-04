/**
 * ====================================================================
 * FIXTURES DE POKÉMON PARA TESTES OFFLINE (pokemon-fixtures.js)
 * ====================================================================
 * Dados estáticos e isolados para testes automatizados das Fases PBA-003, PBA-004 e PBA-005.
 * Permite execução 100% offline sem nenhuma dependência da PokéAPI.
 * Atualizado para Combatant Model v3 (com specialAttack, specialDefense e moves).
 */

let moveFixtures;
if (typeof require !== 'undefined') {
  moveFixtures = require('./move-fixtures.js');
} else if (typeof window !== 'undefined' && window.PBABattleMoveFixtures) {
  moveFixtures = window.PBABattleMoveFixtures;
} else {
  moveFixtures = {
    ThunderboltFixture: { id: 85, name: 'thunderbolt', type: 'electric', power: 90, accuracy: 100, pp: 15, damageClass: 'special' },
    ScratchFixture: { id: 10, name: 'scratch', type: 'normal', power: 40, accuracy: 100, pp: 35, damageClass: 'physical' },
    FlamethrowerFixture: { id: 53, name: 'flamethrower', type: 'fire', power: 90, accuracy: 100, pp: 15, damageClass: 'special' },
    EmberFixture: { id: 52, name: 'ember', type: 'fire', power: 40, accuracy: 100, pp: 25, damageClass: 'special' },
    WaterGunFixture: { id: 55, name: 'water-gun', type: 'water', power: 40, accuracy: 100, pp: 25, damageClass: 'special' },
    HydroPumpFixture: { id: 56, name: 'hydro-pump', type: 'water', power: 110, accuracy: 80, pp: 5, damageClass: 'special' },
    VineWhipFixture: { id: 22, name: 'vine-whip', type: 'grass', power: 45, accuracy: 100, pp: 25, damageClass: 'physical' },
    EarthquakeFixture: { id: 89, name: 'earthquake', type: 'ground', power: 100, accuracy: 100, pp: 10, damageClass: 'physical' },
    DragonClawFixture: { id: 337, name: 'dragon-claw', type: 'dragon', power: 80, accuracy: 100, pp: 15, damageClass: 'physical' }
  };
}

const {
  ThunderboltFixture,
  ScratchFixture,
  FlamethrowerFixture,
  EmberFixture,
  WaterGunFixture,
  HydroPumpFixture,
  VineWhipFixture,
  EarthquakeFixture,
  DragonClawFixture
} = moveFixtures;

const CharmanderFixture = Object.freeze({
  id: 4,
  name: 'charmander',
  types: ['fire'],
  stats: {
    hp: 39,
    attack: 52,
    defense: 43,
    specialAttack: 60,
    specialDefense: 50,
    speed: 65
  },
  moves: [EmberFixture, ScratchFixture]
});

const BulbasaurFixture = Object.freeze({
  id: 1,
  name: 'bulbasaur',
  types: ['grass', 'poison'],
  stats: {
    hp: 45,
    attack: 49,
    defense: 49,
    specialAttack: 65,
    specialDefense: 65,
    speed: 45
  },
  moves: [VineWhipFixture, ScratchFixture]
});

const SquirtleFixture = Object.freeze({
  id: 7,
  name: 'squirtle',
  types: ['water'],
  stats: {
    hp: 44,
    attack: 48,
    defense: 65,
    specialAttack: 50,
    specialDefense: 64,
    speed: 43
  },
  moves: [WaterGunFixture, ScratchFixture]
});

const PikachuFixture = Object.freeze({
  id: 25,
  name: 'pikachu',
  types: ['electric'],
  stats: {
    hp: 35,
    attack: 55,
    defense: 40,
    specialAttack: 50,
    specialDefense: 50,
    speed: 90
  },
  moves: [ThunderboltFixture, ScratchFixture]
});

const HighDefenseFixture = Object.freeze({
  id: 213,
  name: 'shuckle',
  types: ['bug', 'rock'],
  stats: {
    hp: 20,
    attack: 10,
    defense: 9999,
    specialAttack: 10,
    specialDefense: 9999,
    speed: 5
  },
  moves: [ScratchFixture]
});

const LowDefenseFixture = Object.freeze({
  id: 901,
  name: 'low-def',
  types: ['normal'],
  stats: {
    hp: 100,
    attack: 50,
    defense: 10,
    specialAttack: 50,
    specialDefense: 10,
    speed: 50
  },
  moves: [ScratchFixture]
});

const HighAttackFixture = Object.freeze({
  id: 902,
  name: 'high-atk',
  types: ['normal'],
  stats: {
    hp: 100,
    attack: 150,
    defense: 50,
    specialAttack: 150,
    specialDefense: 50,
    speed: 50
  },
  moves: [ScratchFixture]
});

const LowAttackFixture = Object.freeze({
  id: 903,
  name: 'low-atk',
  types: ['normal'],
  stats: {
    hp: 100,
    attack: 20,
    defense: 50,
    specialAttack: 20,
    specialDefense: 50,
    speed: 50
  },
  moves: [ScratchFixture]
});

const SpeedTieWithCharmanderFixture = Object.freeze({
  id: 999,
  name: 'speed-tie-mon',
  types: ['normal'],
  stats: {
    hp: 50,
    attack: 50,
    defense: 50,
    specialAttack: 50,
    specialDefense: 50,
    speed: 65
  },
  moves: [ScratchFixture]
});

const FragileOneHpFixture = Object.freeze({
  id: 998,
  name: 'fragile-mon',
  types: ['normal'],
  stats: {
    hp: 1,
    attack: 30,
    defense: 30,
    specialAttack: 30,
    specialDefense: 30,
    speed: 10
  },
  moves: [ScratchFixture]
});

// --- FIXTURES ESPECÍFICAS DA FASE PBA-004 (TYPE SYSTEM) ---

const GyaradosFixture = Object.freeze({
  id: 130,
  name: 'gyarados',
  types: ['water', 'flying'],
  stats: {
    hp: 95,
    attack: 125,
    defense: 79,
    specialAttack: 60,
    specialDefense: 100,
    speed: 81
  },
  moves: [WaterGunFixture, ScratchFixture]
});

const SwampertFixture = Object.freeze({
  id: 260,
  name: 'swampert',
  types: ['water', 'ground'],
  stats: {
    hp: 100,
    attack: 110,
    defense: 90,
    specialAttack: 85,
    specialDefense: 90,
    speed: 60
  },
  moves: [WaterGunFixture, EarthquakeFixture]
});

const ScizorFixture = Object.freeze({
  id: 212,
  name: 'scizor',
  types: ['bug', 'steel'],
  stats: {
    hp: 70,
    attack: 130,
    defense: 100,
    specialAttack: 55,
    specialDefense: 80,
    speed: 65
  },
  moves: [ScratchFixture]
});

const CharizardFixture = Object.freeze({
  id: 6,
  name: 'charizard',
  types: ['fire', 'flying'],
  stats: {
    hp: 78,
    attack: 84,
    defense: 78,
    specialAttack: 109,
    specialDefense: 85,
    speed: 100
  },
  moves: [FlamethrowerFixture, DragonClawFixture, ScratchFixture]
});

const KingdraFixture = Object.freeze({
  id: 230,
  name: 'kingdra',
  types: ['water', 'dragon'],
  stats: {
    hp: 75,
    attack: 95,
    defense: 95,
    specialAttack: 95,
    specialDefense: 95,
    speed: 85
  },
  moves: [WaterGunFixture, DragonClawFixture]
});

const GastlyFixture = Object.freeze({
  id: 92,
  name: 'gastly',
  types: ['ghost', 'poison'],
  stats: {
    hp: 30,
    attack: 35,
    defense: 30,
    specialAttack: 100,
    specialDefense: 35,
    speed: 80
  },
  moves: [ScratchFixture]
});

const GeodudeFixture = Object.freeze({
  id: 74,
  name: 'geodude',
  types: ['rock', 'ground'],
  stats: {
    hp: 40,
    attack: 80,
    defense: 100,
    specialAttack: 30,
    specialDefense: 30,
    speed: 20
  },
  moves: [EarthquakeFixture, ScratchFixture]
});

const ClefairyFixture = Object.freeze({
  id: 35,
  name: 'clefairy',
  types: ['fairy'],
  stats: {
    hp: 70,
    attack: 45,
    defense: 48,
    specialAttack: 60,
    specialDefense: 65,
    speed: 35
  },
  moves: [ScratchFixture]
});

const PidgeotFixture = Object.freeze({
  id: 18,
  name: 'pidgeot',
  types: ['normal', 'flying'],
  stats: {
    hp: 83,
    attack: 80,
    defense: 75,
    specialAttack: 70,
    specialDefense: 70,
    speed: 101
  },
  moves: [ScratchFixture]
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CharmanderFixture,
    BulbasaurFixture,
    SquirtleFixture,
    PikachuFixture,
    HighDefenseFixture,
    LowDefenseFixture,
    HighAttackFixture,
    LowAttackFixture,
    SpeedTieWithCharmanderFixture,
    FragileOneHpFixture,
    GyaradosFixture,
    SwampertFixture,
    ScizorFixture,
    CharizardFixture,
    KingdraFixture,
    GastlyFixture,
    GeodudeFixture,
    ClefairyFixture,
    PidgeotFixture
  };
}
