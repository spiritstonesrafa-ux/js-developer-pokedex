/**
 * ====================================================================
 * FIXTURES DE EQUIPES PARA BATALHA 3x3: TEAM FIXTURES (team-fixtures.js)
 * ====================================================================
 * Conjuntos de equipes estáticas e isoladas para validação da Fase PBA-006.
 * Execução 100% offline.
 */

let pokemonFixtures;
if (typeof require !== 'undefined') {
  pokemonFixtures = require('./pokemon-fixtures.js');
} else if (typeof window !== 'undefined' && window.PBABattlePokemonFixtures) {
  pokemonFixtures = window.PBABattlePokemonFixtures;
}

const {
  CharmanderFixture,
  BulbasaurFixture,
  SquirtleFixture,
  PikachuFixture,
  GyaradosFixture,
  SwampertFixture,
  ScizorFixture,
  CharizardFixture,
  GeodudeFixture
} = pokemonFixtures;

// Equipe principal do jogador (3 membros canônicos)
// Slot 1: Charmander (Lead), Slot 2: Pikachu, Slot 3: Squirtle
const PlayerTeam3Fixture = Object.freeze([
  CharmanderFixture,
  PikachuFixture,
  SquirtleFixture
]);

// Equipe principal adversária (3 membros canônicos)
// Slot 1: Bulbasaur (Lead), Slot 2: Geodude, Slot 3: Gyarados
const EnemyTeam3Fixture = Object.freeze([
  BulbasaurFixture,
  GeodudeFixture,
  GyaradosFixture
]);

// Equipe alternativa de teste
const AltPlayerTeamFixture = Object.freeze([
  CharizardFixture,
  SwampertFixture,
  ScizorFixture
]);

// Equipe inválida: apenas 2 membros
const TwoPokemonTeamFixture = Object.freeze([
  CharmanderFixture,
  PikachuFixture
]);

// Equipe inválida: 4 membros
const FourPokemonTeamFixture = Object.freeze([
  CharmanderFixture,
  PikachuFixture,
  SquirtleFixture,
  CharizardFixture
]);

// Equipe inválida: espécie duplicada (2 Charmanders)
const DuplicatePokemonTeamFixture = Object.freeze([
  CharmanderFixture,
  CharmanderFixture,
  SquirtleFixture
]);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PlayerTeam3Fixture,
    EnemyTeam3Fixture,
    AltPlayerTeamFixture,
    TwoPokemonTeamFixture,
    FourPokemonTeamFixture,
    DuplicatePokemonTeamFixture
  };
}
