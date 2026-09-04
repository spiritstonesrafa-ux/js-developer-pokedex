/**
 * ====================================================================
 * FIXTURES DE POKÉMON PARA TESTES OFFLINE (pokemon-fixtures.js)
 * ====================================================================
 * Dados estáticos e isolados para testes automatizados das Fases PBA-003 e PBA-004.
 * Permite execução 100% offline sem nenhuma dependência da PokéAPI.
 */

const CharmanderFixture = Object.freeze({
  id: 4,
  name: 'charmander',
  types: ['fire'],
  stats: {
    hp: 39,
    attack: 52,
    defense: 43,
    speed: 65
  }
});

const BulbasaurFixture = Object.freeze({
  id: 1,
  name: 'bulbasaur',
  types: ['grass', 'poison'],
  stats: {
    hp: 45,
    attack: 49,
    defense: 49,
    speed: 45
  }
});

const SquirtleFixture = Object.freeze({
  id: 7,
  name: 'squirtle',
  types: ['water'],
  stats: {
    hp: 44,
    attack: 48,
    defense: 65,
    speed: 43
  }
});

const PikachuFixture = Object.freeze({
  id: 25,
  name: 'pikachu',
  types: ['electric'],
  stats: {
    hp: 35,
    attack: 55,
    defense: 40,
    speed: 90
  }
});

const HighDefenseFixture = Object.freeze({
  id: 213,
  name: 'shuckle',
  types: ['bug', 'rock'],
  stats: {
    hp: 20,
    attack: 10,
    defense: 9999, // Defesa altíssima para testar dano mínimo
    speed: 5
  }
});

const LowDefenseFixture = Object.freeze({
  id: 901,
  name: 'low-def',
  types: ['normal'],
  stats: {
    hp: 100,
    attack: 50,
    defense: 10,
    speed: 50
  }
});

const HighAttackFixture = Object.freeze({
  id: 902,
  name: 'high-atk',
  types: ['normal'],
  stats: {
    hp: 100,
    attack: 150,
    defense: 50,
    speed: 50
  }
});

const LowAttackFixture = Object.freeze({
  id: 903,
  name: 'low-atk',
  types: ['normal'],
  stats: {
    hp: 100,
    attack: 20,
    defense: 50,
    speed: 50
  }
});

const SpeedTieWithCharmanderFixture = Object.freeze({
  id: 999,
  name: 'speed-tie-mon',
  types: ['normal'],
  stats: {
    hp: 50,
    attack: 50,
    defense: 50,
    speed: 65 // Exatamente igual a Charmander (65)
  }
});

const FragileOneHpFixture = Object.freeze({
  id: 998,
  name: 'fragile-mon',
  types: ['normal'],
  stats: {
    hp: 1, // 1 HP para ser derrotado no primeiro golpe
    attack: 30,
    defense: 30,
    speed: 10
  }
});

// --- FIXTURES ESPECÍFICAS DA FASE PBA-004 (TYPE SYSTEM) ---

const GyaradosFixture = Object.freeze({
  id: 130,
  name: 'gyarados',
  types: ['water', 'flying'], // 4x fraqueza para Electric
  stats: {
    hp: 95,
    attack: 125,
    defense: 79,
    speed: 81
  }
});

const SwampertFixture = Object.freeze({
  id: 260,
  name: 'swampert',
  types: ['water', 'ground'], // 4x fraqueza para Grass, Imune a Electric
  stats: {
    hp: 100,
    attack: 110,
    defense: 90,
    speed: 60
  }
});

const ScizorFixture = Object.freeze({
  id: 212,
  name: 'scizor',
  types: ['bug', 'steel'], // 4x fraqueza para Fire
  stats: {
    hp: 70,
    attack: 130,
    defense: 100,
    speed: 65
  }
});

const CharizardFixture = Object.freeze({
  id: 6,
  name: 'charizard',
  types: ['fire', 'flying'], // 0.25x resistência contra Grass e Bug
  stats: {
    hp: 78,
    attack: 84,
    defense: 78,
    speed: 100
  }
});

const KingdraFixture = Object.freeze({
  id: 230,
  name: 'kingdra',
  types: ['water', 'dragon'], // 0.25x resistência contra Fire e Water
  stats: {
    hp: 75,
    attack: 95,
    defense: 95,
    speed: 85
  }
});

const GastlyFixture = Object.freeze({
  id: 92,
  name: 'gastly',
  types: ['ghost', 'poison'], // Imune a Normal e Fighting
  stats: {
    hp: 30,
    attack: 35,
    defense: 30,
    speed: 80
  }
});

const GeodudeFixture = Object.freeze({
  id: 74,
  name: 'geodude',
  types: ['rock', 'ground'], // Imune a Electric
  stats: {
    hp: 40,
    attack: 80,
    defense: 100,
    speed: 20
  }
});

const ClefairyFixture = Object.freeze({
  id: 35,
  name: 'clefairy',
  types: ['fairy'], // Imune a Dragon
  stats: {
    hp: 70,
    attack: 45,
    defense: 48,
    speed: 35
  }
});

const PidgeotFixture = Object.freeze({
  id: 18,
  name: 'pidgeot',
  types: ['normal', 'flying'], // Imune a Ghost e Ground
  stats: {
    hp: 83,
    attack: 80,
    defense: 75,
    speed: 101
  }
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
