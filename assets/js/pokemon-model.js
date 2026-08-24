/**
 * Modelo estruturado do Pokémon
 */
class Pokemon {
  constructor() {
    this.number = 0;
    this.name = '';
    this.types = [];
    this.type = '';
    this.photo = '';
    this.animatedPhoto = '';
    this.height = 0; // em metros
    this.weight = 0; // em kg
    this.abilities = [];
    this.stats = {
      hp: 0,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
      total: 0
    };
    this.speciesUrl = '';
    this.cry = '';
  }
}
