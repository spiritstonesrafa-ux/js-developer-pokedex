/**
 * ====================================================================
 * MODELO DE DADOS: POKÉMON
 * ====================================================================
 * Em Análise e Desenvolvimento de Sistemas (ADS), usamos classes e modelos
 * para padronizar as informações recebidas de uma API externa (PokéAPI).
 * Isso evita que o código dependa diretamente do formato bruto da API.
 */

class Pokemon {
  constructor() {
    this.number = 0;          // Identificador único (ID / Pokédex Number)
    this.name = '';           // Nome do Pokémon
    this.types = [];          // Lista de tipos (ex: ['grass', 'poison'])
    this.type = '';           // Tipo principal (usado para estilização e cores)
    this.photo = '';          // Imagem principal em alta resolução
    this.animatedPhoto = '';  // Sprite animada
    this.height = 0;          // Altura em metros
    this.weight = 0;          // Peso em quilogramas
    this.abilities = [];       // Lista de habilidades
    this.moves = [];           // Lista de golpes disponíveis ({ name, url })
    this.stats = {            // Atributos de batalha (Base Stats)
      hp: 0,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
      total: 0
    };
    this.speciesUrl = '';     // URL para buscar dados adicionais (evolução, descrições)
    this.cry = '';            // URL do áudio com o som oficial (cry)
  }
}
