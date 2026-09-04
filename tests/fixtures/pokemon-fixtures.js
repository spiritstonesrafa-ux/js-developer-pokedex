/**
 * ====================================================================
 * FIXTURES DE POKÉMON PARA TESTES OFFLINE (pokemon-fixtures.js)
 * ====================================================================
 * Dados estáticos e isolados para testes automatizados da Fase PBA-003.
 * Permite execução 100% offline sem nenhuma dependência da PokéAPI.
 */

const CharmanderFixture = Object.freeze({
  id: 4,
  name: 'charmander',
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
  stats: {
    hp: 1, // 1 HP para ser derrotado no primeiro golpe
    attack: 30,
    defense: 30,
    speed: 10
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
    FragileOneHpFixture
  };
}
