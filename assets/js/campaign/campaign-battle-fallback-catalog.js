/**
 * ====================================================================
 * CATÁLOGO DE FALLBACK DE BATALHA DA CAMPANHA (campaign-battle-fallback-catalog.js)
 * ====================================================================
 * Modelos determinísticos de combatentes offline para todos os 450 Pokémon
 * selecionáveis do draft inicial da campanha.
 *
 * Gerado por scripts/build-campaign-draft-catalog.js. Não editar manualmente.
 */
(function () {
  const byId = Object.freeze({
  "3": {
    "id": 3,
    "number": 3,
    "name": "venusaur",
    "types": [
      "grass",
      "poison"
    ],
    "stats": {
      "hp": 80,
      "attack": 82,
      "defense": 83,
      "specialAttack": 100,
      "specialDefense": 100,
      "speed": 80
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/3.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/3.ogg",
    "moves": [
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 482,
        "name": "sludge-wave",
        "type": "poison",
        "power": 95,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 414,
        "name": "earth-power",
        "type": "ground",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 282,
        "name": "knock-off",
        "type": "dark",
        "power": 65,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "6": {
    "id": 6,
    "number": 6,
    "name": "charizard",
    "types": [
      "fire",
      "flying"
    ],
    "stats": {
      "hp": 78,
      "attack": 84,
      "defense": 78,
      "specialAttack": 109,
      "specialDefense": 85,
      "speed": 100
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/6.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/6.ogg",
    "moves": [
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 403,
        "name": "air-slash",
        "type": "flying",
        "power": 75,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 406,
        "name": "dragon-pulse",
        "type": "dragon",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "7": {
    "id": 7,
    "number": 7,
    "name": "squirtle",
    "types": [
      "water"
    ],
    "stats": {
      "hp": 44,
      "attack": 48,
      "defense": 65,
      "specialAttack": 50,
      "specialDefense": 64,
      "speed": 43
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/7.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/7.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 406,
        "name": "dragon-pulse",
        "type": "dragon",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 396,
        "name": "aura-sphere",
        "type": "fighting",
        "power": 80,
        "accuracy": null,
        "pp": 20,
        "damageClass": "special"
      }
    ]
  },
  "8": {
    "id": 8,
    "number": 8,
    "name": "wartortle",
    "types": [
      "water"
    ],
    "stats": {
      "hp": 59,
      "attack": 63,
      "defense": 80,
      "specialAttack": 65,
      "specialDefense": 80,
      "speed": 58
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/8.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/8.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/8.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 406,
        "name": "dragon-pulse",
        "type": "dragon",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 396,
        "name": "aura-sphere",
        "type": "fighting",
        "power": 80,
        "accuracy": null,
        "pp": 20,
        "damageClass": "special"
      }
    ]
  },
  "9": {
    "id": 9,
    "number": 9,
    "name": "blastoise",
    "types": [
      "water"
    ],
    "stats": {
      "hp": 79,
      "attack": 83,
      "defense": 100,
      "specialAttack": 85,
      "specialDefense": 105,
      "speed": 78
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/9.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/9.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "18": {
    "id": 18,
    "number": 18,
    "name": "pidgeot",
    "types": [
      "normal",
      "flying"
    ],
    "stats": {
      "hp": 83,
      "attack": 80,
      "defense": 75,
      "specialAttack": 70,
      "specialDefense": 70,
      "speed": 101
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/18.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/18.ogg",
    "moves": [
      {
        "id": 29,
        "name": "headbutt",
        "type": "normal",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 403,
        "name": "air-slash",
        "type": "flying",
        "power": 75,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 257,
        "name": "heat-wave",
        "type": "fire",
        "power": 95,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 369,
        "name": "u-turn",
        "type": "bug",
        "power": 70,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "25": {
    "id": 25,
    "number": 25,
    "name": "pikachu",
    "types": [
      "electric"
    ],
    "stats": {
      "hp": 35,
      "attack": 55,
      "defense": 40,
      "specialAttack": 50,
      "specialDefense": 50,
      "speed": 90
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/25.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/25.ogg",
    "moves": [
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 282,
        "name": "knock-off",
        "type": "dark",
        "power": 65,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "26": {
    "id": 26,
    "number": 26,
    "name": "raichu",
    "types": [
      "electric"
    ],
    "stats": {
      "hp": 60,
      "attack": 90,
      "defense": 55,
      "specialAttack": 90,
      "specialDefense": 80,
      "speed": 110
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/26.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/26.ogg",
    "moves": [
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 324,
        "name": "signal-beam",
        "type": "bug",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "31": {
    "id": 31,
    "number": 31,
    "name": "nidoqueen",
    "types": [
      "poison",
      "ground"
    ],
    "stats": {
      "hp": 90,
      "attack": 92,
      "defense": 87,
      "specialAttack": 75,
      "specialDefense": 85,
      "speed": 76
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/31.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/31.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/31.ogg",
    "moves": [
      {
        "id": 482,
        "name": "sludge-wave",
        "type": "poison",
        "power": 95,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "34": {
    "id": 34,
    "number": 34,
    "name": "nidoking",
    "types": [
      "poison",
      "ground"
    ],
    "stats": {
      "hp": 81,
      "attack": 102,
      "defense": 77,
      "specialAttack": 85,
      "specialDefense": 75,
      "speed": 85
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/34.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/34.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/34.ogg",
    "moves": [
      {
        "id": 482,
        "name": "sludge-wave",
        "type": "poison",
        "power": 95,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 224,
        "name": "megahorn",
        "type": "bug",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "36": {
    "id": 36,
    "number": 36,
    "name": "clefable",
    "types": [
      "fairy"
    ],
    "stats": {
      "hp": 95,
      "attack": 70,
      "defense": 73,
      "specialAttack": 95,
      "specialDefense": 90,
      "speed": 60
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/36.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/36.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/36.ogg",
    "moves": [
      {
        "id": 585,
        "name": "moonblast",
        "type": "fairy",
        "power": 95,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "38": {
    "id": 38,
    "number": 38,
    "name": "ninetales",
    "types": [
      "fire"
    ],
    "stats": {
      "hp": 73,
      "attack": 76,
      "defense": 75,
      "specialAttack": 81,
      "specialDefense": 100,
      "speed": 100
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/38.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/38.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/38.ogg",
    "moves": [
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "45": {
    "id": 45,
    "number": 45,
    "name": "vileplume",
    "types": [
      "grass",
      "poison"
    ],
    "stats": {
      "hp": 75,
      "attack": 80,
      "defense": 85,
      "specialAttack": 110,
      "specialDefense": 90,
      "speed": 50
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/45.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/45.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/45.ogg",
    "moves": [
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 482,
        "name": "sludge-wave",
        "type": "poison",
        "power": 95,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 585,
        "name": "moonblast",
        "type": "fairy",
        "power": 95,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 676,
        "name": "pollen-puff",
        "type": "bug",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "55": {
    "id": 55,
    "number": 55,
    "name": "golduck",
    "types": [
      "water"
    ],
    "stats": {
      "hp": 80,
      "attack": 82,
      "defense": 78,
      "specialAttack": 95,
      "specialDefense": 80,
      "speed": 85
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/55.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/55.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/55.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 408,
        "name": "power-gem",
        "type": "rock",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "special"
      }
    ]
  },
  "59": {
    "id": 59,
    "number": 59,
    "name": "arcanine",
    "types": [
      "fire"
    ],
    "stats": {
      "hp": 90,
      "attack": 110,
      "defense": 80,
      "specialAttack": 100,
      "specialDefense": 80,
      "speed": 95
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/59.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/59.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/59.ogg",
    "moves": [
      {
        "id": 833,
        "name": "raging-fury",
        "type": "fire",
        "power": 120,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 706,
        "name": "psychic-fangs",
        "type": "psychic",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "62": {
    "id": 62,
    "number": 62,
    "name": "poliwrath",
    "types": [
      "water",
      "fighting"
    ],
    "stats": {
      "hp": 90,
      "attack": 95,
      "defense": 95,
      "specialAttack": 70,
      "specialDefense": 90,
      "speed": 70
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/62.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/62.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/62.ogg",
    "moves": [
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 663,
        "name": "darkest-lariat",
        "type": "dark",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "65": {
    "id": 65,
    "number": 65,
    "name": "alakazam",
    "types": [
      "psychic"
    ],
    "stats": {
      "hp": 55,
      "attack": 50,
      "defense": 45,
      "specialAttack": 135,
      "specialDefense": 95,
      "speed": 120
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/65.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/65.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/65.ogg",
    "moves": [
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 605,
        "name": "dazzling-gleam",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "68": {
    "id": 68,
    "number": 68,
    "name": "machamp",
    "types": [
      "fighting"
    ],
    "stats": {
      "hp": 90,
      "attack": 130,
      "defense": 80,
      "specialAttack": 65,
      "specialDefense": 85,
      "speed": 55
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/68.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/68.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/68.ogg",
    "moves": [
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 663,
        "name": "darkest-lariat",
        "type": "dark",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "71": {
    "id": 71,
    "number": 71,
    "name": "victreebel",
    "types": [
      "grass",
      "poison"
    ],
    "stats": {
      "hp": 80,
      "attack": 105,
      "defense": 65,
      "specialAttack": 100,
      "specialDefense": 70,
      "speed": 70
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/71.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/71.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/71.ogg",
    "moves": [
      {
        "id": 438,
        "name": "power-whip",
        "type": "grass",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 482,
        "name": "sludge-wave",
        "type": "poison",
        "power": 95,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 141,
        "name": "leech-life",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 282,
        "name": "knock-off",
        "type": "dark",
        "power": 65,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "73": {
    "id": 73,
    "number": 73,
    "name": "tentacruel",
    "types": [
      "water",
      "poison"
    ],
    "stats": {
      "hp": 80,
      "attack": 70,
      "defense": 65,
      "specialAttack": 80,
      "specialDefense": 120,
      "speed": 100
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/73.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/73.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/73.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 482,
        "name": "sludge-wave",
        "type": "poison",
        "power": 95,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 605,
        "name": "dazzling-gleam",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "76": {
    "id": 76,
    "number": 76,
    "name": "golem",
    "types": [
      "rock",
      "ground"
    ],
    "stats": {
      "hp": 80,
      "attack": 120,
      "defense": 130,
      "specialAttack": 55,
      "specialDefense": 65,
      "speed": 45
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/76.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/76.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/76.ogg",
    "moves": [
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 7,
        "name": "fire-punch",
        "type": "fire",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "78": {
    "id": 78,
    "number": 78,
    "name": "rapidash",
    "types": [
      "fire"
    ],
    "stats": {
      "hp": 65,
      "attack": 100,
      "defense": 70,
      "specialAttack": 80,
      "specialDefense": 80,
      "speed": 105
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/78.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/78.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/78.ogg",
    "moves": [
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 224,
        "name": "megahorn",
        "type": "bug",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 667,
        "name": "high-horsepower",
        "type": "ground",
        "power": 95,
        "accuracy": 95,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "80": {
    "id": 80,
    "number": 80,
    "name": "slowbro",
    "types": [
      "water",
      "psychic"
    ],
    "stats": {
      "hp": 95,
      "attack": 75,
      "defense": 110,
      "specialAttack": 100,
      "specialDefense": 80,
      "speed": 30
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/80.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/80.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/80.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "87": {
    "id": 87,
    "number": 87,
    "name": "dewgong",
    "types": [
      "water",
      "ice"
    ],
    "stats": {
      "hp": 90,
      "attack": 70,
      "defense": 80,
      "specialAttack": 70,
      "specialDefense": 95,
      "speed": 70
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/87.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/87.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/87.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 224,
        "name": "megahorn",
        "type": "bug",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "89": {
    "id": 89,
    "number": 89,
    "name": "muk",
    "types": [
      "poison"
    ],
    "stats": {
      "hp": 105,
      "attack": 105,
      "defense": 75,
      "specialAttack": 65,
      "specialDefense": 100,
      "speed": 50
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/89.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/89.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/89.ogg",
    "moves": [
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 679,
        "name": "lunge",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 7,
        "name": "fire-punch",
        "type": "fire",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "91": {
    "id": 91,
    "number": 91,
    "name": "cloyster",
    "types": [
      "water",
      "ice"
    ],
    "stats": {
      "hp": 50,
      "attack": 95,
      "defense": 180,
      "specialAttack": 85,
      "specialDefense": 45,
      "speed": 70
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/91.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/91.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/91.ogg",
    "moves": [
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 529,
        "name": "drill-run",
        "type": "ground",
        "power": 80,
        "accuracy": 95,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 398,
        "name": "poison-jab",
        "type": "poison",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "94": {
    "id": 94,
    "number": 94,
    "name": "gengar",
    "types": [
      "ghost",
      "poison"
    ],
    "stats": {
      "hp": 60,
      "attack": 65,
      "defense": 60,
      "specialAttack": 130,
      "specialDefense": 75,
      "speed": 110
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/94.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/94.ogg",
    "moves": [
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 482,
        "name": "sludge-wave",
        "type": "poison",
        "power": 95,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "97": {
    "id": 97,
    "number": 97,
    "name": "hypno",
    "types": [
      "psychic"
    ],
    "stats": {
      "hp": 85,
      "attack": 73,
      "defense": 70,
      "specialAttack": 73,
      "specialDefense": 115,
      "speed": 67
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/97.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/97.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/97.ogg",
    "moves": [
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 605,
        "name": "dazzling-gleam",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "99": {
    "id": 99,
    "number": 99,
    "name": "kingler",
    "types": [
      "water"
    ],
    "stats": {
      "hp": 55,
      "attack": 130,
      "defense": 115,
      "specialAttack": 50,
      "specialDefense": 50,
      "speed": 75
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/99.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/99.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/99.ogg",
    "moves": [
      {
        "id": 152,
        "name": "crabhammer",
        "type": "water",
        "power": 100,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 667,
        "name": "high-horsepower",
        "type": "ground",
        "power": 95,
        "accuracy": 95,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 404,
        "name": "x-scissor",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 282,
        "name": "knock-off",
        "type": "dark",
        "power": 65,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "101": {
    "id": 101,
    "number": 101,
    "name": "electrode",
    "types": [
      "electric"
    ],
    "stats": {
      "hp": 60,
      "attack": 50,
      "defense": 70,
      "specialAttack": 80,
      "specialDefense": 80,
      "speed": 150
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/101.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/101.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/101.ogg",
    "moves": [
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 324,
        "name": "signal-beam",
        "type": "bug",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 168,
        "name": "thief",
        "type": "dark",
        "power": 60,
        "accuracy": 100,
        "pp": 25,
        "damageClass": "physical"
      },
      {
        "id": 129,
        "name": "swift",
        "type": "normal",
        "power": 60,
        "accuracy": null,
        "pp": 20,
        "damageClass": "special"
      }
    ]
  },
  "103": {
    "id": 103,
    "number": 103,
    "name": "exeggutor",
    "types": [
      "grass",
      "psychic"
    ],
    "stats": {
      "hp": 95,
      "attack": 95,
      "defense": 85,
      "specialAttack": 125,
      "specialDefense": 75,
      "speed": 55
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/103.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/103.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/103.ogg",
    "moves": [
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 188,
        "name": "sludge-bomb",
        "type": "poison",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "110": {
    "id": 110,
    "number": 110,
    "name": "weezing",
    "types": [
      "poison"
    ],
    "stats": {
      "hp": 65,
      "attack": 90,
      "defense": 120,
      "specialAttack": 85,
      "specialDefense": 70,
      "speed": 60
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/110.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/110.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/110.ogg",
    "moves": [
      {
        "id": 482,
        "name": "sludge-wave",
        "type": "poison",
        "power": 95,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "112": {
    "id": 112,
    "number": 112,
    "name": "rhydon",
    "types": [
      "ground",
      "rock"
    ],
    "stats": {
      "hp": 105,
      "attack": 130,
      "defense": 120,
      "specialAttack": 45,
      "specialDefense": 45,
      "speed": 40
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/112.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/112.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/112.ogg",
    "moves": [
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 224,
        "name": "megahorn",
        "type": "bug",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "115": {
    "id": 115,
    "number": 115,
    "name": "kangaskhan",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 105,
      "attack": 95,
      "defense": 80,
      "specialAttack": 40,
      "specialDefense": 80,
      "speed": 90
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/115.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/115.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/115.ogg",
    "moves": [
      {
        "id": 34,
        "name": "body-slam",
        "type": "normal",
        "power": 85,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "121": {
    "id": 121,
    "number": 121,
    "name": "starmie",
    "types": [
      "water",
      "psychic"
    ],
    "stats": {
      "hp": 60,
      "attack": 75,
      "defense": 85,
      "specialAttack": 100,
      "specialDefense": 85,
      "speed": 115
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/121.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/121.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/121.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "123": {
    "id": 123,
    "number": 123,
    "name": "scyther",
    "types": [
      "bug",
      "flying"
    ],
    "stats": {
      "hp": 70,
      "attack": 110,
      "defense": 80,
      "specialAttack": 55,
      "specialDefense": 80,
      "speed": 105
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/123.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/123.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/123.ogg",
    "moves": [
      {
        "id": 404,
        "name": "x-scissor",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 17,
        "name": "wing-attack",
        "type": "flying",
        "power": 60,
        "accuracy": 100,
        "pp": 35,
        "damageClass": "physical"
      },
      {
        "id": 400,
        "name": "night-slash",
        "type": "dark",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "125": {
    "id": 125,
    "number": 125,
    "name": "electabuzz",
    "types": [
      "electric"
    ],
    "stats": {
      "hp": 65,
      "attack": 83,
      "defense": 57,
      "specialAttack": 95,
      "specialDefense": 85,
      "speed": 105
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/125.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/125.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/125.ogg",
    "moves": [
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 324,
        "name": "signal-beam",
        "type": "bug",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "126": {
    "id": 126,
    "number": 126,
    "name": "magmar",
    "types": [
      "fire"
    ],
    "stats": {
      "hp": 65,
      "attack": 95,
      "defense": 57,
      "specialAttack": 100,
      "specialDefense": 85,
      "speed": 93
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/126.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/126.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/126.ogg",
    "moves": [
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 815,
        "name": "scorching-sands",
        "type": "ground",
        "power": 70,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 398,
        "name": "poison-jab",
        "type": "poison",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "127": {
    "id": 127,
    "number": 127,
    "name": "pinsir",
    "types": [
      "bug"
    ],
    "stats": {
      "hp": 65,
      "attack": 125,
      "defense": 100,
      "specialAttack": 55,
      "specialDefense": 70,
      "speed": 85
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/127.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/127.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/127.ogg",
    "moves": [
      {
        "id": 404,
        "name": "x-scissor",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      }
    ]
  },
  "128": {
    "id": 128,
    "number": 128,
    "name": "tauros",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 75,
      "attack": 100,
      "defense": 95,
      "specialAttack": 40,
      "specialDefense": 70,
      "speed": 110
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/128.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/128.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/128.ogg",
    "moves": [
      {
        "id": 873,
        "name": "raging-bull",
        "type": "normal",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 224,
        "name": "megahorn",
        "type": "bug",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "130": {
    "id": 130,
    "number": 130,
    "name": "gyarados",
    "types": [
      "water",
      "flying"
    ],
    "stats": {
      "hp": 95,
      "attack": 125,
      "defense": 79,
      "specialAttack": 60,
      "specialDefense": 100,
      "speed": 81
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/130.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/130.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/130.ogg",
    "moves": [
      {
        "id": 401,
        "name": "aqua-tail",
        "type": "water",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 542,
        "name": "hurricane",
        "type": "flying",
        "power": 110,
        "accuracy": 70,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 438,
        "name": "power-whip",
        "type": "grass",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "131": {
    "id": 131,
    "number": 131,
    "name": "lapras",
    "types": [
      "water",
      "ice"
    ],
    "stats": {
      "hp": 130,
      "attack": 85,
      "defense": 80,
      "specialAttack": 85,
      "specialDefense": 95,
      "speed": 60
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/131.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/131.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/131.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 224,
        "name": "megahorn",
        "type": "bug",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "134": {
    "id": 134,
    "number": 134,
    "name": "vaporeon",
    "types": [
      "water"
    ],
    "stats": {
      "hp": 130,
      "attack": 65,
      "defense": 60,
      "specialAttack": 110,
      "specialDefense": 95,
      "speed": 65
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/134.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/134.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/134.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 914,
        "name": "alluring-voice",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "135": {
    "id": 135,
    "number": 135,
    "name": "jolteon",
    "types": [
      "electric"
    ],
    "stats": {
      "hp": 65,
      "attack": 65,
      "defense": 60,
      "specialAttack": 110,
      "specialDefense": 95,
      "speed": 130
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/135.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/135.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/135.ogg",
    "moves": [
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 914,
        "name": "alluring-voice",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 324,
        "name": "signal-beam",
        "type": "bug",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "136": {
    "id": 136,
    "number": 136,
    "name": "flareon",
    "types": [
      "fire"
    ],
    "stats": {
      "hp": 65,
      "attack": 130,
      "defense": 60,
      "specialAttack": 95,
      "specialDefense": 110,
      "speed": 65
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/136.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/136.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/136.ogg",
    "moves": [
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 44,
        "name": "bite",
        "type": "dark",
        "power": 60,
        "accuracy": 100,
        "pp": 25,
        "damageClass": "physical"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 231,
        "name": "iron-tail",
        "type": "steel",
        "power": 100,
        "accuracy": 75,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "139": {
    "id": 139,
    "number": 139,
    "name": "omastar",
    "types": [
      "rock",
      "water"
    ],
    "stats": {
      "hp": 70,
      "attack": 60,
      "defense": 125,
      "specialAttack": 115,
      "specialDefense": 70,
      "speed": 55
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/139.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/139.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/139.ogg",
    "moves": [
      {
        "id": 246,
        "name": "ancient-power",
        "type": "rock",
        "power": 60,
        "accuracy": 100,
        "pp": 5,
        "damageClass": "special"
      },
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 414,
        "name": "earth-power",
        "type": "ground",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "141": {
    "id": 141,
    "number": 141,
    "name": "kabutops",
    "types": [
      "rock",
      "water"
    ],
    "stats": {
      "hp": 60,
      "attack": 115,
      "defense": 105,
      "specialAttack": 65,
      "specialDefense": 70,
      "speed": 80
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/141.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/141.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/141.ogg",
    "moves": [
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 141,
        "name": "leech-life",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 400,
        "name": "night-slash",
        "type": "dark",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "142": {
    "id": 142,
    "number": 142,
    "name": "aerodactyl",
    "types": [
      "rock",
      "flying"
    ],
    "stats": {
      "hp": 80,
      "attack": 105,
      "defense": 65,
      "specialAttack": 60,
      "specialDefense": 75,
      "speed": 130
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/142.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/142.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/142.ogg",
    "moves": [
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 17,
        "name": "wing-attack",
        "type": "flying",
        "power": 60,
        "accuracy": 100,
        "pp": 35,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "143": {
    "id": 143,
    "number": 143,
    "name": "snorlax",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 160,
      "attack": 110,
      "defense": 65,
      "specialAttack": 65,
      "specialDefense": 110,
      "speed": 30
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/143.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/143.ogg",
    "moves": [
      {
        "id": 34,
        "name": "body-slam",
        "type": "normal",
        "power": 85,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 663,
        "name": "darkest-lariat",
        "type": "dark",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      }
    ]
  },
  "149": {
    "id": 149,
    "number": 149,
    "name": "dragonite",
    "types": [
      "dragon",
      "flying"
    ],
    "stats": {
      "hp": 91,
      "attack": 134,
      "defense": 95,
      "specialAttack": 100,
      "specialDefense": 100,
      "speed": 80
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/149.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/149.ogg",
    "moves": [
      {
        "id": 337,
        "name": "dragon-claw",
        "type": "dragon",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 17,
        "name": "wing-attack",
        "type": "flying",
        "power": 60,
        "accuracy": 100,
        "pp": 35,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 861,
        "name": "ice-spinner",
        "type": "ice",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "154": {
    "id": 154,
    "number": 154,
    "name": "meganium",
    "types": [
      "grass"
    ],
    "stats": {
      "hp": 80,
      "attack": 82,
      "defense": 100,
      "specialAttack": 83,
      "specialDefense": 100,
      "speed": 80
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/154.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/154.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/154.ogg",
    "moves": [
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 676,
        "name": "pollen-puff",
        "type": "bug",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 605,
        "name": "dazzling-gleam",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "157": {
    "id": 157,
    "number": 157,
    "name": "typhlosion",
    "types": [
      "fire"
    ],
    "stats": {
      "hp": 78,
      "attack": 84,
      "defense": 78,
      "specialAttack": 109,
      "specialDefense": 85,
      "speed": 100
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/157.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/157.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/157.ogg",
    "moves": [
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 326,
        "name": "extrasensory",
        "type": "psychic",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "special"
      }
    ]
  },
  "160": {
    "id": 160,
    "number": 160,
    "name": "feraligatr",
    "types": [
      "water"
    ],
    "stats": {
      "hp": 85,
      "attack": 105,
      "defense": 100,
      "specialAttack": 79,
      "specialDefense": 83,
      "speed": 78
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/160.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/160.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/160.ogg",
    "moves": [
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 706,
        "name": "psychic-fangs",
        "type": "psychic",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "162": {
    "id": 162,
    "number": 162,
    "name": "furret",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 85,
      "attack": 76,
      "defense": 64,
      "specialAttack": 45,
      "specialDefense": 55,
      "speed": 90
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/162.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/162.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/162.ogg",
    "moves": [
      {
        "id": 34,
        "name": "body-slam",
        "type": "normal",
        "power": 85,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 401,
        "name": "aqua-tail",
        "type": "water",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "164": {
    "id": 164,
    "number": 164,
    "name": "noctowl",
    "types": [
      "normal",
      "flying"
    ],
    "stats": {
      "hp": 100,
      "attack": 50,
      "defense": 50,
      "specialAttack": 86,
      "specialDefense": 96,
      "speed": 70
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/164.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/164.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/164.ogg",
    "moves": [
      {
        "id": 304,
        "name": "hyper-voice",
        "type": "normal",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 403,
        "name": "air-slash",
        "type": "flying",
        "power": 75,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 585,
        "name": "moonblast",
        "type": "fairy",
        "power": 95,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "168": {
    "id": 168,
    "number": 168,
    "name": "ariados",
    "types": [
      "bug",
      "poison"
    ],
    "stats": {
      "hp": 70,
      "attack": 90,
      "defense": 70,
      "specialAttack": 60,
      "specialDefense": 70,
      "speed": 40
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/168.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/168.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/168.ogg",
    "moves": [
      {
        "id": 224,
        "name": "megahorn",
        "type": "bug",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 398,
        "name": "poison-jab",
        "type": "poison",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "169": {
    "id": 169,
    "number": 169,
    "name": "crobat",
    "types": [
      "poison",
      "flying"
    ],
    "stats": {
      "hp": 85,
      "attack": 90,
      "defense": 80,
      "specialAttack": 70,
      "specialDefense": 80,
      "speed": 130
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/169.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/169.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/169.ogg",
    "moves": [
      {
        "id": 188,
        "name": "sludge-bomb",
        "type": "poison",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 17,
        "name": "wing-attack",
        "type": "flying",
        "power": 60,
        "accuracy": 100,
        "pp": 35,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 141,
        "name": "leech-life",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "171": {
    "id": 171,
    "number": 171,
    "name": "lanturn",
    "types": [
      "water",
      "electric"
    ],
    "stats": {
      "hp": 125,
      "attack": 58,
      "defense": 58,
      "specialAttack": 76,
      "specialDefense": 76,
      "speed": 67
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/171.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/171.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/171.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 605,
        "name": "dazzling-gleam",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "178": {
    "id": 178,
    "number": 178,
    "name": "xatu",
    "types": [
      "psychic",
      "flying"
    ],
    "stats": {
      "hp": 65,
      "attack": 75,
      "defense": 70,
      "specialAttack": 95,
      "specialDefense": 70,
      "speed": 95
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/178.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/178.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/178.ogg",
    "moves": [
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 403,
        "name": "air-slash",
        "type": "flying",
        "power": 75,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 605,
        "name": "dazzling-gleam",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "181": {
    "id": 181,
    "number": 181,
    "name": "ampharos",
    "types": [
      "electric"
    ],
    "stats": {
      "hp": 90,
      "attack": 75,
      "defense": 85,
      "specialAttack": 115,
      "specialDefense": 90,
      "speed": 55
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/181.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/181.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/181.ogg",
    "moves": [
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 406,
        "name": "dragon-pulse",
        "type": "dragon",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 605,
        "name": "dazzling-gleam",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 408,
        "name": "power-gem",
        "type": "rock",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "special"
      }
    ]
  },
  "182": {
    "id": 182,
    "number": 182,
    "name": "bellossom",
    "types": [
      "grass"
    ],
    "stats": {
      "hp": 75,
      "attack": 80,
      "defense": 95,
      "specialAttack": 90,
      "specialDefense": 100,
      "speed": 50
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/182.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/182.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/182.ogg",
    "moves": [
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 585,
        "name": "moonblast",
        "type": "fairy",
        "power": 95,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 676,
        "name": "pollen-puff",
        "type": "bug",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 188,
        "name": "sludge-bomb",
        "type": "poison",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "184": {
    "id": 184,
    "number": 184,
    "name": "azumarill",
    "types": [
      "water",
      "fairy"
    ],
    "stats": {
      "hp": 100,
      "attack": 50,
      "defense": 80,
      "specialAttack": 60,
      "specialDefense": 80,
      "speed": 50
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/184.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/184.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/184.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 914,
        "name": "alluring-voice",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 282,
        "name": "knock-off",
        "type": "dark",
        "power": 65,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "185": {
    "id": 185,
    "number": 185,
    "name": "sudowoodo",
    "types": [
      "rock"
    ],
    "stats": {
      "hp": 70,
      "attack": 100,
      "defense": 115,
      "specialAttack": 30,
      "specialDefense": 65,
      "speed": 30
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/185.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/185.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/185.ogg",
    "moves": [
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 7,
        "name": "fire-punch",
        "type": "fire",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "186": {
    "id": 186,
    "number": 186,
    "name": "politoed",
    "types": [
      "water"
    ],
    "stats": {
      "hp": 90,
      "attack": 75,
      "defense": 75,
      "specialAttack": 90,
      "specialDefense": 100,
      "speed": 70
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/186.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/186.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/186.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 414,
        "name": "earth-power",
        "type": "ground",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "189": {
    "id": 189,
    "number": 189,
    "name": "jumpluff",
    "types": [
      "grass",
      "flying"
    ],
    "stats": {
      "hp": 75,
      "attack": 55,
      "defense": 70,
      "specialAttack": 55,
      "specialDefense": 95,
      "speed": 110
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/189.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/189.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/189.ogg",
    "moves": [
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 332,
        "name": "aerial-ace",
        "type": "flying",
        "power": 60,
        "accuracy": null,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 676,
        "name": "pollen-puff",
        "type": "bug",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 605,
        "name": "dazzling-gleam",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "192": {
    "id": 192,
    "number": 192,
    "name": "sunflora",
    "types": [
      "grass"
    ],
    "stats": {
      "hp": 75,
      "attack": 75,
      "defense": 55,
      "specialAttack": 105,
      "specialDefense": 85,
      "speed": 30
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/192.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/192.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/192.ogg",
    "moves": [
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 414,
        "name": "earth-power",
        "type": "ground",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 188,
        "name": "sludge-bomb",
        "type": "poison",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 605,
        "name": "dazzling-gleam",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "195": {
    "id": 195,
    "number": 195,
    "name": "quagsire",
    "types": [
      "water",
      "ground"
    ],
    "stats": {
      "hp": 95,
      "attack": 85,
      "defense": 85,
      "specialAttack": 65,
      "specialDefense": 65,
      "speed": 35
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/195.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/195.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/195.ogg",
    "moves": [
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 482,
        "name": "sludge-wave",
        "type": "poison",
        "power": 95,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "196": {
    "id": 196,
    "number": 196,
    "name": "espeon",
    "types": [
      "psychic"
    ],
    "stats": {
      "hp": 65,
      "attack": 65,
      "defense": 60,
      "specialAttack": 130,
      "specialDefense": 95,
      "speed": 110
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/196.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/196.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/196.ogg",
    "moves": [
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 605,
        "name": "dazzling-gleam",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 408,
        "name": "power-gem",
        "type": "rock",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "special"
      }
    ]
  },
  "197": {
    "id": 197,
    "number": 197,
    "name": "umbreon",
    "types": [
      "dark"
    ],
    "stats": {
      "hp": 95,
      "attack": 65,
      "defense": 110,
      "specialAttack": 60,
      "specialDefense": 130,
      "speed": 65
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/197.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/197.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/197.ogg",
    "moves": [
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 914,
        "name": "alluring-voice",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "199": {
    "id": 199,
    "number": 199,
    "name": "slowking",
    "types": [
      "water",
      "psychic"
    ],
    "stats": {
      "hp": 95,
      "attack": 75,
      "defense": 80,
      "specialAttack": 100,
      "specialDefense": 110,
      "speed": 30
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/199.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/199.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/199.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "200": {
    "id": 200,
    "number": 200,
    "name": "misdreavus",
    "types": [
      "ghost"
    ],
    "stats": {
      "hp": 60,
      "attack": 60,
      "defense": 60,
      "specialAttack": 85,
      "specialDefense": 85,
      "speed": 85
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/200.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/200.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/200.ogg",
    "moves": [
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "203": {
    "id": 203,
    "number": 203,
    "name": "girafarig",
    "types": [
      "normal",
      "psychic"
    ],
    "stats": {
      "hp": 70,
      "attack": 80,
      "defense": 65,
      "specialAttack": 90,
      "specialDefense": 65,
      "speed": 85
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/203.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/203.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/203.ogg",
    "moves": [
      {
        "id": 304,
        "name": "hyper-voice",
        "type": "normal",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "205": {
    "id": 205,
    "number": 205,
    "name": "forretress",
    "types": [
      "bug",
      "steel"
    ],
    "stats": {
      "hp": 75,
      "attack": 90,
      "defense": 140,
      "specialAttack": 60,
      "specialDefense": 60,
      "speed": 40
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/205.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/205.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/205.ogg",
    "moves": [
      {
        "id": 679,
        "name": "lunge",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 861,
        "name": "ice-spinner",
        "type": "ice",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "206": {
    "id": 206,
    "number": 206,
    "name": "dunsparce",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 100,
      "attack": 70,
      "defense": 70,
      "specialAttack": 65,
      "specialDefense": 65,
      "speed": 45
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/206.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/206.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/206.ogg",
    "moves": [
      {
        "id": 887,
        "name": "hyper-drill",
        "type": "normal",
        "power": 100,
        "accuracy": 100,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "207": {
    "id": 207,
    "number": 207,
    "name": "gligar",
    "types": [
      "ground",
      "flying"
    ],
    "stats": {
      "hp": 65,
      "attack": 75,
      "defense": 105,
      "specialAttack": 35,
      "specialDefense": 65,
      "speed": 85
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/207.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/207.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/207.ogg",
    "moves": [
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 17,
        "name": "wing-attack",
        "type": "flying",
        "power": 60,
        "accuracy": 100,
        "pp": 35,
        "damageClass": "physical"
      },
      {
        "id": 152,
        "name": "crabhammer",
        "type": "water",
        "power": 100,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "208": {
    "id": 208,
    "number": 208,
    "name": "steelix",
    "types": [
      "steel",
      "ground"
    ],
    "stats": {
      "hp": 75,
      "attack": 85,
      "defense": 200,
      "specialAttack": 55,
      "specialDefense": 65,
      "speed": 30
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/208.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/208.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/208.ogg",
    "moves": [
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 776,
        "name": "body-press",
        "type": "fighting",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "210": {
    "id": 210,
    "number": 210,
    "name": "granbull",
    "types": [
      "fairy"
    ],
    "stats": {
      "hp": 90,
      "attack": 120,
      "defense": 75,
      "specialAttack": 60,
      "specialDefense": 60,
      "speed": 45
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/210.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/210.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/210.ogg",
    "moves": [
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 706,
        "name": "psychic-fangs",
        "type": "psychic",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "211": {
    "id": 211,
    "number": 211,
    "name": "qwilfish",
    "types": [
      "water",
      "poison"
    ],
    "stats": {
      "hp": 65,
      "attack": 95,
      "defense": 85,
      "specialAttack": 55,
      "specialDefense": 55,
      "speed": 85
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/211.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/211.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/211.ogg",
    "moves": [
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "212": {
    "id": 212,
    "number": 212,
    "name": "scizor",
    "types": [
      "bug",
      "steel"
    ],
    "stats": {
      "hp": 70,
      "attack": 130,
      "defense": 100,
      "specialAttack": 55,
      "specialDefense": 80,
      "speed": 65
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/212.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/212.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/212.ogg",
    "moves": [
      {
        "id": 404,
        "name": "x-scissor",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 400,
        "name": "night-slash",
        "type": "dark",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "213": {
    "id": 213,
    "number": 213,
    "name": "shuckle",
    "types": [
      "bug",
      "rock"
    ],
    "stats": {
      "hp": 20,
      "attack": 10,
      "defense": 230,
      "specialAttack": 10,
      "specialDefense": 230,
      "speed": 5
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/213.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/213.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/213.ogg",
    "moves": [
      {
        "id": 806,
        "name": "skitter-smack",
        "type": "bug",
        "power": 70,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 482,
        "name": "sludge-wave",
        "type": "poison",
        "power": 95,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "214": {
    "id": 214,
    "number": 214,
    "name": "heracross",
    "types": [
      "bug",
      "fighting"
    ],
    "stats": {
      "hp": 80,
      "attack": 125,
      "defense": 75,
      "specialAttack": 40,
      "specialDefense": 95,
      "speed": 85
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/214.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/214.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/214.ogg",
    "moves": [
      {
        "id": 224,
        "name": "megahorn",
        "type": "bug",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "215": {
    "id": 215,
    "number": 215,
    "name": "sneasel",
    "types": [
      "dark",
      "ice"
    ],
    "stats": {
      "hp": 55,
      "attack": 95,
      "defense": 55,
      "specialAttack": 35,
      "specialDefense": 75,
      "speed": 115
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/215.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/215.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/215.ogg",
    "moves": [
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 556,
        "name": "icicle-crash",
        "type": "ice",
        "power": 85,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 404,
        "name": "x-scissor",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "217": {
    "id": 217,
    "number": 217,
    "name": "ursaring",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 90,
      "attack": 130,
      "defense": 75,
      "specialAttack": 75,
      "specialDefense": 75,
      "speed": 55
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/217.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/217.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/217.ogg",
    "moves": [
      {
        "id": 34,
        "name": "body-slam",
        "type": "normal",
        "power": 85,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "219": {
    "id": 219,
    "number": 219,
    "name": "magcargo",
    "types": [
      "fire",
      "rock"
    ],
    "stats": {
      "hp": 60,
      "attack": 50,
      "defense": 120,
      "specialAttack": 90,
      "specialDefense": 80,
      "speed": 30
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/219.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/219.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/219.ogg",
    "moves": [
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 408,
        "name": "power-gem",
        "type": "rock",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "special"
      },
      {
        "id": 414,
        "name": "earth-power",
        "type": "ground",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 499,
        "name": "clear-smog",
        "type": "poison",
        "power": 50,
        "accuracy": null,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "221": {
    "id": 221,
    "number": 221,
    "name": "piloswine",
    "types": [
      "ice",
      "ground"
    ],
    "stats": {
      "hp": 100,
      "attack": 100,
      "defense": 80,
      "specialAttack": 60,
      "specialDefense": 60,
      "speed": 50
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/221.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/221.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/221.ogg",
    "moves": [
      {
        "id": 556,
        "name": "icicle-crash",
        "type": "ice",
        "power": 85,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      }
    ]
  },
  "222": {
    "id": 222,
    "number": 222,
    "name": "corsola",
    "types": [
      "water",
      "rock"
    ],
    "stats": {
      "hp": 65,
      "attack": 55,
      "defense": 95,
      "specialAttack": 65,
      "specialDefense": 95,
      "speed": 35
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/222.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/222.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/222.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 408,
        "name": "power-gem",
        "type": "rock",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "224": {
    "id": 224,
    "number": 224,
    "name": "octillery",
    "types": [
      "water"
    ],
    "stats": {
      "hp": 75,
      "attack": 105,
      "defense": 75,
      "specialAttack": 105,
      "specialDefense": 75,
      "speed": 45
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/224.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/224.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/224.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 482,
        "name": "sludge-wave",
        "type": "poison",
        "power": 95,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "225": {
    "id": 225,
    "number": 225,
    "name": "delibird",
    "types": [
      "ice",
      "flying"
    ],
    "stats": {
      "hp": 45,
      "attack": 55,
      "defense": 45,
      "specialAttack": 65,
      "specialDefense": 45,
      "speed": 75
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/225.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/225.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/225.ogg",
    "moves": [
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 65,
        "name": "drill-peck",
        "type": "flying",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 324,
        "name": "signal-beam",
        "type": "bug",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "226": {
    "id": 226,
    "number": 226,
    "name": "mantine",
    "types": [
      "water",
      "flying"
    ],
    "stats": {
      "hp": 85,
      "attack": 40,
      "defense": 70,
      "specialAttack": 80,
      "specialDefense": 140,
      "speed": 70
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/226.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/226.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/226.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 403,
        "name": "air-slash",
        "type": "flying",
        "power": 75,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 324,
        "name": "signal-beam",
        "type": "bug",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "227": {
    "id": 227,
    "number": 227,
    "name": "skarmory",
    "types": [
      "steel",
      "flying"
    ],
    "stats": {
      "hp": 65,
      "attack": 80,
      "defense": 140,
      "specialAttack": 40,
      "specialDefense": 70,
      "speed": 70
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/227.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/227.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/227.ogg",
    "moves": [
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 65,
        "name": "drill-peck",
        "type": "flying",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 776,
        "name": "body-press",
        "type": "fighting",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 404,
        "name": "x-scissor",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "229": {
    "id": 229,
    "number": 229,
    "name": "houndoom",
    "types": [
      "dark",
      "fire"
    ],
    "stats": {
      "hp": 75,
      "attack": 90,
      "defense": 50,
      "specialAttack": 110,
      "specialDefense": 80,
      "speed": 95
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/229.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/229.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/229.ogg",
    "moves": [
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 188,
        "name": "sludge-bomb",
        "type": "poison",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "230": {
    "id": 230,
    "number": 230,
    "name": "kingdra",
    "types": [
      "water",
      "dragon"
    ],
    "stats": {
      "hp": 75,
      "attack": 95,
      "defense": 95,
      "specialAttack": 95,
      "specialDefense": 95,
      "speed": 85
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/230.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/230.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/230.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 406,
        "name": "dragon-pulse",
        "type": "dragon",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 324,
        "name": "signal-beam",
        "type": "bug",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "232": {
    "id": 232,
    "number": 232,
    "name": "donphan",
    "types": [
      "ground"
    ],
    "stats": {
      "hp": 90,
      "attack": 120,
      "defense": 120,
      "specialAttack": 60,
      "specialDefense": 60,
      "speed": 50
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/232.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/232.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/232.ogg",
    "moves": [
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 861,
        "name": "ice-spinner",
        "type": "ice",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "233": {
    "id": 233,
    "number": 233,
    "name": "porygon2",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 85,
      "attack": 80,
      "defense": 90,
      "specialAttack": 105,
      "specialDefense": 95,
      "speed": 60
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/233.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/233.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/233.ogg",
    "moves": [
      {
        "id": 161,
        "name": "tri-attack",
        "type": "normal",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "234": {
    "id": 234,
    "number": 234,
    "name": "stantler",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 73,
      "attack": 95,
      "defense": 62,
      "specialAttack": 85,
      "specialDefense": 65,
      "speed": 85
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/234.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/234.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/234.ogg",
    "moves": [
      {
        "id": 34,
        "name": "body-slam",
        "type": "normal",
        "power": 85,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 224,
        "name": "megahorn",
        "type": "bug",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "237": {
    "id": 237,
    "number": 237,
    "name": "hitmontop",
    "types": [
      "fighting"
    ],
    "stats": {
      "hp": 50,
      "attack": 95,
      "defense": 95,
      "specialAttack": 35,
      "specialDefense": 110,
      "speed": 70
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/237.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/237.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/237.ogg",
    "moves": [
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 861,
        "name": "ice-spinner",
        "type": "ice",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      }
    ]
  },
  "241": {
    "id": 241,
    "number": 241,
    "name": "miltank",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 95,
      "attack": 80,
      "defense": 105,
      "specialAttack": 40,
      "specialDefense": 70,
      "speed": 100
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/241.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/241.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/241.ogg",
    "moves": [
      {
        "id": 34,
        "name": "body-slam",
        "type": "normal",
        "power": 85,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "242": {
    "id": 242,
    "number": 242,
    "name": "blissey",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 255,
      "attack": 10,
      "defense": 10,
      "specialAttack": 75,
      "specialDefense": 135,
      "speed": 55
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/242.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/242.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/242.ogg",
    "moves": [
      {
        "id": 304,
        "name": "hyper-voice",
        "type": "normal",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "247": {
    "id": 247,
    "number": 247,
    "name": "pupitar",
    "types": [
      "rock",
      "ground"
    ],
    "stats": {
      "hp": 70,
      "attack": 84,
      "defense": 70,
      "specialAttack": 65,
      "specialDefense": 70,
      "speed": 51
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/247.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/247.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/247.ogg",
    "moves": [
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "248": {
    "id": 248,
    "number": 248,
    "name": "tyranitar",
    "types": [
      "rock",
      "dark"
    ],
    "stats": {
      "hp": 100,
      "attack": 134,
      "defense": 110,
      "specialAttack": 95,
      "specialDefense": 100,
      "speed": 61
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/248.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/248.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/248.ogg",
    "moves": [
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "254": {
    "id": 254,
    "number": 254,
    "name": "sceptile",
    "types": [
      "grass"
    ],
    "stats": {
      "hp": 70,
      "attack": 85,
      "defense": 65,
      "specialAttack": 105,
      "specialDefense": 85,
      "speed": 120
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/254.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/254.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/254.ogg",
    "moves": [
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 414,
        "name": "earth-power",
        "type": "ground",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 406,
        "name": "dragon-pulse",
        "type": "dragon",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "257": {
    "id": 257,
    "number": 257,
    "name": "blaziken",
    "types": [
      "fire",
      "fighting"
    ],
    "stats": {
      "hp": 80,
      "attack": 120,
      "defense": 70,
      "specialAttack": 110,
      "specialDefense": 70,
      "speed": 80
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/257.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/257.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/257.ogg",
    "moves": [
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 327,
        "name": "sky-uppercut",
        "type": "fighting",
        "power": 85,
        "accuracy": 90,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 400,
        "name": "night-slash",
        "type": "dark",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "260": {
    "id": 260,
    "number": 260,
    "name": "swampert",
    "types": [
      "water",
      "ground"
    ],
    "stats": {
      "hp": 100,
      "attack": 110,
      "defense": 90,
      "specialAttack": 85,
      "specialDefense": 90,
      "speed": 60
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/260.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/260.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/260.ogg",
    "moves": [
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 663,
        "name": "darkest-lariat",
        "type": "dark",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "262": {
    "id": 262,
    "number": 262,
    "name": "mightyena",
    "types": [
      "dark"
    ],
    "stats": {
      "hp": 70,
      "attack": 90,
      "defense": 70,
      "specialAttack": 60,
      "specialDefense": 60,
      "speed": 70
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/262.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/262.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/262.ogg",
    "moves": [
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 706,
        "name": "psychic-fangs",
        "type": "psychic",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 423,
        "name": "ice-fang",
        "type": "ice",
        "power": 65,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "272": {
    "id": 272,
    "number": 272,
    "name": "ludicolo",
    "types": [
      "water",
      "grass"
    ],
    "stats": {
      "hp": 80,
      "attack": 70,
      "defense": 70,
      "specialAttack": 90,
      "specialDefense": 100,
      "speed": 70
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/272.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/272.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/272.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 7,
        "name": "fire-punch",
        "type": "fire",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "275": {
    "id": 275,
    "number": 275,
    "name": "shiftry",
    "types": [
      "grass",
      "dark"
    ],
    "stats": {
      "hp": 90,
      "attack": 100,
      "defense": 60,
      "specialAttack": 90,
      "specialDefense": 60,
      "speed": 80
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/275.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/275.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/275.ogg",
    "moves": [
      {
        "id": 348,
        "name": "leaf-blade",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 404,
        "name": "x-scissor",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "276": {
    "id": 276,
    "number": 276,
    "name": "taillow",
    "types": [
      "normal",
      "flying"
    ],
    "stats": {
      "hp": 40,
      "attack": 55,
      "defense": 30,
      "specialAttack": 30,
      "specialDefense": 30,
      "speed": 85
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/276.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/276.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/276.ogg",
    "moves": [
      {
        "id": 586,
        "name": "boomburst",
        "type": "normal",
        "power": 140,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 17,
        "name": "wing-attack",
        "type": "flying",
        "power": 60,
        "accuracy": 100,
        "pp": 35,
        "damageClass": "physical"
      },
      {
        "id": 369,
        "name": "u-turn",
        "type": "bug",
        "power": 70,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 168,
        "name": "thief",
        "type": "dark",
        "power": 60,
        "accuracy": 100,
        "pp": 25,
        "damageClass": "physical"
      }
    ]
  },
  "277": {
    "id": 277,
    "number": 277,
    "name": "swellow",
    "types": [
      "normal",
      "flying"
    ],
    "stats": {
      "hp": 60,
      "attack": 85,
      "defense": 60,
      "specialAttack": 75,
      "specialDefense": 50,
      "speed": 125
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/277.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/277.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/277.ogg",
    "moves": [
      {
        "id": 290,
        "name": "secret-power",
        "type": "normal",
        "power": 70,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 403,
        "name": "air-slash",
        "type": "flying",
        "power": 75,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 257,
        "name": "heat-wave",
        "type": "fire",
        "power": 95,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 369,
        "name": "u-turn",
        "type": "bug",
        "power": 70,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "279": {
    "id": 279,
    "number": 279,
    "name": "pelipper",
    "types": [
      "water",
      "flying"
    ],
    "stats": {
      "hp": 60,
      "attack": 50,
      "defense": 100,
      "specialAttack": 95,
      "specialDefense": 70,
      "speed": 65
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/279.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/279.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/279.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 403,
        "name": "air-slash",
        "type": "flying",
        "power": 75,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 466,
        "name": "ominous-wind",
        "type": "ghost",
        "power": 60,
        "accuracy": 100,
        "pp": 5,
        "damageClass": "special"
      }
    ]
  },
  "282": {
    "id": 282,
    "number": 282,
    "name": "gardevoir",
    "types": [
      "psychic",
      "fairy"
    ],
    "stats": {
      "hp": 68,
      "attack": 65,
      "defense": 65,
      "specialAttack": 125,
      "specialDefense": 115,
      "speed": 80
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/282.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/282.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/282.ogg",
    "moves": [
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 585,
        "name": "moonblast",
        "type": "fairy",
        "power": 95,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "284": {
    "id": 284,
    "number": 284,
    "name": "masquerain",
    "types": [
      "bug",
      "flying"
    ],
    "stats": {
      "hp": 70,
      "attack": 60,
      "defense": 62,
      "specialAttack": 100,
      "specialDefense": 82,
      "speed": 80
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/284.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/284.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/284.ogg",
    "moves": [
      {
        "id": 405,
        "name": "bug-buzz",
        "type": "bug",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 403,
        "name": "air-slash",
        "type": "flying",
        "power": 75,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "286": {
    "id": 286,
    "number": 286,
    "name": "breloom",
    "types": [
      "grass",
      "fighting"
    ],
    "stats": {
      "hp": 60,
      "attack": 130,
      "defense": 80,
      "specialAttack": 60,
      "specialDefense": 60,
      "speed": 70
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/286.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/286.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/286.ogg",
    "moves": [
      {
        "id": 402,
        "name": "seed-bomb",
        "type": "grass",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 327,
        "name": "sky-uppercut",
        "type": "fighting",
        "power": 85,
        "accuracy": 90,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      }
    ]
  },
  "291": {
    "id": 291,
    "number": 291,
    "name": "ninjask",
    "types": [
      "bug",
      "flying"
    ],
    "stats": {
      "hp": 61,
      "attack": 90,
      "defense": 45,
      "specialAttack": 50,
      "specialDefense": 50,
      "speed": 160
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/291.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/291.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/291.ogg",
    "moves": [
      {
        "id": 141,
        "name": "leech-life",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 332,
        "name": "aerial-ace",
        "type": "flying",
        "power": 60,
        "accuracy": null,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 168,
        "name": "thief",
        "type": "dark",
        "power": 60,
        "accuracy": 100,
        "pp": 25,
        "damageClass": "physical"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "295": {
    "id": 295,
    "number": 295,
    "name": "exploud",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 104,
      "attack": 91,
      "defense": 63,
      "specialAttack": 91,
      "specialDefense": 73,
      "speed": 68
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/295.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/295.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/295.ogg",
    "moves": [
      {
        "id": 586,
        "name": "boomburst",
        "type": "normal",
        "power": 140,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "297": {
    "id": 297,
    "number": 297,
    "name": "hariyama",
    "types": [
      "fighting"
    ],
    "stats": {
      "hp": 144,
      "attack": 120,
      "defense": 60,
      "specialAttack": 40,
      "specialDefense": 60,
      "speed": 50
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/297.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/297.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/297.ogg",
    "moves": [
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "306": {
    "id": 306,
    "number": 306,
    "name": "aggron",
    "types": [
      "steel",
      "rock"
    ],
    "stats": {
      "hp": 70,
      "attack": 110,
      "defense": 180,
      "specialAttack": 60,
      "specialDefense": 60,
      "speed": 50
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/306.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/306.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/306.ogg",
    "moves": [
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "308": {
    "id": 308,
    "number": 308,
    "name": "medicham",
    "types": [
      "fighting",
      "psychic"
    ],
    "stats": {
      "hp": 60,
      "attack": 60,
      "defense": 75,
      "specialAttack": 60,
      "specialDefense": 75,
      "speed": 80
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/308.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/308.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/308.ogg",
    "moves": [
      {
        "id": 853,
        "name": "axe-kick",
        "type": "fighting",
        "power": 120,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "310": {
    "id": 310,
    "number": 310,
    "name": "manectric",
    "types": [
      "electric"
    ],
    "stats": {
      "hp": 70,
      "attack": 75,
      "defense": 60,
      "specialAttack": 105,
      "specialDefense": 60,
      "speed": 105
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/310.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/310.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/310.ogg",
    "moves": [
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 324,
        "name": "signal-beam",
        "type": "bug",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "317": {
    "id": 317,
    "number": 317,
    "name": "swalot",
    "types": [
      "poison"
    ],
    "stats": {
      "hp": 100,
      "attack": 73,
      "defense": 83,
      "specialAttack": 73,
      "specialDefense": 83,
      "speed": 55
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/317.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/317.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/317.ogg",
    "moves": [
      {
        "id": 482,
        "name": "sludge-wave",
        "type": "poison",
        "power": 95,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "319": {
    "id": 319,
    "number": 319,
    "name": "sharpedo",
    "types": [
      "water",
      "dark"
    ],
    "stats": {
      "hp": 70,
      "attack": 120,
      "defense": 40,
      "specialAttack": 95,
      "specialDefense": 40,
      "speed": 95
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/319.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/319.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/319.ogg",
    "moves": [
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 706,
        "name": "psychic-fangs",
        "type": "psychic",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "321": {
    "id": 321,
    "number": 321,
    "name": "wailord",
    "types": [
      "water"
    ],
    "stats": {
      "hp": 170,
      "attack": 90,
      "defense": 45,
      "specialAttack": 90,
      "specialDefense": 45,
      "speed": 60
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/321.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/321.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/321.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "323": {
    "id": 323,
    "number": 323,
    "name": "camerupt",
    "types": [
      "fire",
      "ground"
    ],
    "stats": {
      "hp": 70,
      "attack": 100,
      "defense": 70,
      "specialAttack": 105,
      "specialDefense": 75,
      "speed": 40
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/323.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/323.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/323.ogg",
    "moves": [
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 430,
        "name": "flash-cannon",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      }
    ]
  },
  "324": {
    "id": 324,
    "number": 324,
    "name": "torkoal",
    "types": [
      "fire"
    ],
    "stats": {
      "hp": 70,
      "attack": 85,
      "defense": 140,
      "specialAttack": 85,
      "specialDefense": 70,
      "speed": 20
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/324.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/324.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/324.ogg",
    "moves": [
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 776,
        "name": "body-press",
        "type": "fighting",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 188,
        "name": "sludge-bomb",
        "type": "poison",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "326": {
    "id": 326,
    "number": 326,
    "name": "grumpig",
    "types": [
      "psychic"
    ],
    "stats": {
      "hp": 80,
      "attack": 45,
      "defense": 65,
      "specialAttack": 90,
      "specialDefense": 110,
      "speed": 80
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/326.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/326.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/326.ogg",
    "moves": [
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 414,
        "name": "earth-power",
        "type": "ground",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "330": {
    "id": 330,
    "number": 330,
    "name": "flygon",
    "types": [
      "ground",
      "dragon"
    ],
    "stats": {
      "hp": 80,
      "attack": 100,
      "defense": 80,
      "specialAttack": 80,
      "specialDefense": 80,
      "speed": 100
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/330.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/330.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/330.ogg",
    "moves": [
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 337,
        "name": "dragon-claw",
        "type": "dragon",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 586,
        "name": "boomburst",
        "type": "normal",
        "power": 140,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "332": {
    "id": 332,
    "number": 332,
    "name": "cacturne",
    "types": [
      "grass",
      "dark"
    ],
    "stats": {
      "hp": 70,
      "attack": 115,
      "defense": 60,
      "specialAttack": 115,
      "specialDefense": 60,
      "speed": 55
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/332.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/332.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/332.ogg",
    "moves": [
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 679,
        "name": "lunge",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "334": {
    "id": 334,
    "number": 334,
    "name": "altaria",
    "types": [
      "dragon",
      "flying"
    ],
    "stats": {
      "hp": 75,
      "attack": 70,
      "defense": 90,
      "specialAttack": 70,
      "specialDefense": 105,
      "speed": 80
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/334.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/334.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/334.ogg",
    "moves": [
      {
        "id": 406,
        "name": "dragon-pulse",
        "type": "dragon",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 332,
        "name": "aerial-ace",
        "type": "flying",
        "power": 60,
        "accuracy": null,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 585,
        "name": "moonblast",
        "type": "fairy",
        "power": 95,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "335": {
    "id": 335,
    "number": 335,
    "name": "zangoose",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 73,
      "attack": 115,
      "defense": 60,
      "specialAttack": 60,
      "specialDefense": 60,
      "speed": 90
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/335.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/335.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/335.ogg",
    "moves": [
      {
        "id": 34,
        "name": "body-slam",
        "type": "normal",
        "power": 85,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "336": {
    "id": 336,
    "number": 336,
    "name": "seviper",
    "types": [
      "poison"
    ],
    "stats": {
      "hp": 73,
      "attack": 100,
      "defense": 60,
      "specialAttack": 100,
      "specialDefense": 60,
      "speed": 65
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/336.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/336.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/336.ogg",
    "moves": [
      {
        "id": 482,
        "name": "sludge-wave",
        "type": "poison",
        "power": 95,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "337": {
    "id": 337,
    "number": 337,
    "name": "lunatone",
    "types": [
      "rock",
      "psychic"
    ],
    "stats": {
      "hp": 90,
      "attack": 55,
      "defense": 65,
      "specialAttack": 95,
      "specialDefense": 85,
      "speed": 70
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/337.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/337.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/337.ogg",
    "moves": [
      {
        "id": 408,
        "name": "power-gem",
        "type": "rock",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 585,
        "name": "moonblast",
        "type": "fairy",
        "power": 95,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "338": {
    "id": 338,
    "number": 338,
    "name": "solrock",
    "types": [
      "rock",
      "psychic"
    ],
    "stats": {
      "hp": 90,
      "attack": 95,
      "defense": 85,
      "specialAttack": 55,
      "specialDefense": 65,
      "speed": 70
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/338.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/338.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/338.ogg",
    "moves": [
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 428,
        "name": "zen-headbutt",
        "type": "psychic",
        "power": 80,
        "accuracy": 90,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "340": {
    "id": 340,
    "number": 340,
    "name": "whiscash",
    "types": [
      "water",
      "ground"
    ],
    "stats": {
      "hp": 110,
      "attack": 78,
      "defense": 73,
      "specialAttack": 76,
      "specialDefense": 71,
      "speed": 60
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/340.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/340.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/340.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      }
    ]
  },
  "342": {
    "id": 342,
    "number": 342,
    "name": "crawdaunt",
    "types": [
      "water",
      "dark"
    ],
    "stats": {
      "hp": 63,
      "attack": 120,
      "defense": 85,
      "specialAttack": 90,
      "specialDefense": 55,
      "speed": 55
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/342.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/342.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/342.ogg",
    "moves": [
      {
        "id": 152,
        "name": "crabhammer",
        "type": "water",
        "power": 100,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 404,
        "name": "x-scissor",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "344": {
    "id": 344,
    "number": 344,
    "name": "claydol",
    "types": [
      "ground",
      "psychic"
    ],
    "stats": {
      "hp": 60,
      "attack": 70,
      "defense": 105,
      "specialAttack": 70,
      "specialDefense": 120,
      "speed": 75
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/344.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/344.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/344.ogg",
    "moves": [
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "346": {
    "id": 346,
    "number": 346,
    "name": "cradily",
    "types": [
      "rock",
      "grass"
    ],
    "stats": {
      "hp": 86,
      "attack": 81,
      "defense": 97,
      "specialAttack": 81,
      "specialDefense": 107,
      "speed": 43
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/346.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/346.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/346.ogg",
    "moves": [
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 438,
        "name": "power-whip",
        "type": "grass",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 482,
        "name": "sludge-wave",
        "type": "poison",
        "power": 95,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "348": {
    "id": 348,
    "number": 348,
    "name": "armaldo",
    "types": [
      "rock",
      "bug"
    ],
    "stats": {
      "hp": 75,
      "attack": 125,
      "defense": 100,
      "specialAttack": 70,
      "specialDefense": 80,
      "speed": 45
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/348.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/348.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/348.ogg",
    "moves": [
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 404,
        "name": "x-scissor",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "350": {
    "id": 350,
    "number": 350,
    "name": "milotic",
    "types": [
      "water"
    ],
    "stats": {
      "hp": 95,
      "attack": 60,
      "defense": 79,
      "specialAttack": 100,
      "specialDefense": 125,
      "speed": 81
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/350.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/350.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/350.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 406,
        "name": "dragon-pulse",
        "type": "dragon",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 914,
        "name": "alluring-voice",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "352": {
    "id": 352,
    "number": 352,
    "name": "kecleon",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 60,
      "attack": 90,
      "defense": 70,
      "specialAttack": 60,
      "specialDefense": 120,
      "speed": 40
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/352.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/352.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/352.ogg",
    "moves": [
      {
        "id": 34,
        "name": "body-slam",
        "type": "normal",
        "power": 85,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 401,
        "name": "aqua-tail",
        "type": "water",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "354": {
    "id": 354,
    "number": 354,
    "name": "banette",
    "types": [
      "ghost"
    ],
    "stats": {
      "hp": 64,
      "attack": 115,
      "defense": 65,
      "specialAttack": 83,
      "specialDefense": 63,
      "speed": 65
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/354.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/354.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/354.ogg",
    "moves": [
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 428,
        "name": "zen-headbutt",
        "type": "psychic",
        "power": 80,
        "accuracy": 90,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "356": {
    "id": 356,
    "number": 356,
    "name": "dusclops",
    "types": [
      "ghost"
    ],
    "stats": {
      "hp": 40,
      "attack": 70,
      "defense": 130,
      "specialAttack": 60,
      "specialDefense": 130,
      "speed": 25
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/356.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/356.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/356.ogg",
    "moves": [
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "357": {
    "id": 357,
    "number": 357,
    "name": "tropius",
    "types": [
      "grass",
      "flying"
    ],
    "stats": {
      "hp": 99,
      "attack": 68,
      "defense": 83,
      "specialAttack": 72,
      "specialDefense": 87,
      "speed": 51
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/357.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/357.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/357.ogg",
    "moves": [
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 403,
        "name": "air-slash",
        "type": "flying",
        "power": 75,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 692,
        "name": "dragon-hammer",
        "type": "dragon",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "358": {
    "id": 358,
    "number": 358,
    "name": "chimecho",
    "types": [
      "psychic"
    ],
    "stats": {
      "hp": 75,
      "attack": 50,
      "defense": 80,
      "specialAttack": 95,
      "specialDefense": 90,
      "speed": 65
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/358.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/358.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/358.ogg",
    "moves": [
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 586,
        "name": "boomburst",
        "type": "normal",
        "power": 140,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "359": {
    "id": 359,
    "number": 359,
    "name": "absol",
    "types": [
      "dark"
    ],
    "stats": {
      "hp": 65,
      "attack": 130,
      "defense": 60,
      "specialAttack": 75,
      "specialDefense": 60,
      "speed": 75
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/359.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/359.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/359.ogg",
    "moves": [
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 224,
        "name": "megahorn",
        "type": "bug",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "362": {
    "id": 362,
    "number": 362,
    "name": "glalie",
    "types": [
      "ice"
    ],
    "stats": {
      "hp": 80,
      "attack": 80,
      "defense": 80,
      "specialAttack": 80,
      "specialDefense": 80,
      "speed": 80
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/362.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/362.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/362.ogg",
    "moves": [
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "365": {
    "id": 365,
    "number": 365,
    "name": "walrein",
    "types": [
      "ice",
      "water"
    ],
    "stats": {
      "hp": 110,
      "attack": 80,
      "defense": 90,
      "specialAttack": 95,
      "specialDefense": 90,
      "speed": 65
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/365.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/365.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/365.ogg",
    "moves": [
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "367": {
    "id": 367,
    "number": 367,
    "name": "huntail",
    "types": [
      "water"
    ],
    "stats": {
      "hp": 55,
      "attack": 104,
      "defense": 105,
      "specialAttack": 94,
      "specialDefense": 75,
      "speed": 52
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/367.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/367.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/367.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 317,
        "name": "rock-tomb",
        "type": "rock",
        "power": 60,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "368": {
    "id": 368,
    "number": 368,
    "name": "gorebyss",
    "types": [
      "water"
    ],
    "stats": {
      "hp": 55,
      "attack": 84,
      "defense": 105,
      "specialAttack": 114,
      "specialDefense": 75,
      "speed": 52
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/368.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/368.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/368.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "369": {
    "id": 369,
    "number": 369,
    "name": "relicanth",
    "types": [
      "water",
      "rock"
    ],
    "stats": {
      "hp": 100,
      "attack": 90,
      "defense": 130,
      "specialAttack": 45,
      "specialDefense": 65,
      "speed": 55
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/369.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/369.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/369.ogg",
    "moves": [
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 776,
        "name": "body-press",
        "type": "fighting",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "373": {
    "id": 373,
    "number": 373,
    "name": "salamence",
    "types": [
      "dragon",
      "flying"
    ],
    "stats": {
      "hp": 95,
      "attack": 135,
      "defense": 80,
      "specialAttack": 110,
      "specialDefense": 80,
      "speed": 100
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/373.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/373.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/373.ogg",
    "moves": [
      {
        "id": 337,
        "name": "dragon-claw",
        "type": "dragon",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 332,
        "name": "aerial-ace",
        "type": "flying",
        "power": 60,
        "accuracy": null,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "376": {
    "id": 376,
    "number": 376,
    "name": "metagross",
    "types": [
      "steel",
      "psychic"
    ],
    "stats": {
      "hp": 80,
      "attack": 135,
      "defense": 130,
      "specialAttack": 95,
      "specialDefense": 90,
      "speed": 70
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/376.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/376.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/376.ogg",
    "moves": [
      {
        "id": 309,
        "name": "meteor-mash",
        "type": "steel",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 706,
        "name": "psychic-fangs",
        "type": "psychic",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "389": {
    "id": 389,
    "number": 389,
    "name": "torterra",
    "types": [
      "grass",
      "ground"
    ],
    "stats": {
      "hp": 95,
      "attack": 109,
      "defense": 105,
      "specialAttack": 75,
      "specialDefense": 85,
      "speed": 56
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/389.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/389.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/389.ogg",
    "moves": [
      {
        "id": 348,
        "name": "leaf-blade",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "392": {
    "id": 392,
    "number": 392,
    "name": "infernape",
    "types": [
      "fire",
      "fighting"
    ],
    "stats": {
      "hp": 76,
      "attack": 104,
      "defense": 71,
      "specialAttack": 104,
      "specialDefense": 71,
      "speed": 108
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/392.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/392.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/392.ogg",
    "moves": [
      {
        "id": 833,
        "name": "raging-fury",
        "type": "fire",
        "power": 120,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 396,
        "name": "aura-sphere",
        "type": "fighting",
        "power": 80,
        "accuracy": null,
        "pp": 20,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "395": {
    "id": 395,
    "number": 395,
    "name": "empoleon",
    "types": [
      "water",
      "steel"
    ],
    "stats": {
      "hp": 84,
      "attack": 86,
      "defense": 88,
      "specialAttack": 111,
      "specialDefense": 101,
      "speed": 60
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/395.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/395.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/395.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 430,
        "name": "flash-cannon",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "398": {
    "id": 398,
    "number": 398,
    "name": "staraptor",
    "types": [
      "normal",
      "flying"
    ],
    "stats": {
      "hp": 85,
      "attack": 120,
      "defense": 70,
      "specialAttack": 50,
      "specialDefense": 60,
      "speed": 100
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/398.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/398.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/398.ogg",
    "moves": [
      {
        "id": 290,
        "name": "secret-power",
        "type": "normal",
        "power": 70,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 17,
        "name": "wing-attack",
        "type": "flying",
        "power": 60,
        "accuracy": 100,
        "pp": 35,
        "damageClass": "physical"
      },
      {
        "id": 299,
        "name": "blaze-kick",
        "type": "fire",
        "power": 85,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "405": {
    "id": 405,
    "number": 405,
    "name": "luxray",
    "types": [
      "electric"
    ],
    "stats": {
      "hp": 80,
      "attack": 120,
      "defense": 79,
      "specialAttack": 95,
      "specialDefense": 79,
      "speed": 70
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/405.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/405.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/405.ogg",
    "moves": [
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 706,
        "name": "psychic-fangs",
        "type": "psychic",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "407": {
    "id": 407,
    "number": 407,
    "name": "roserade",
    "types": [
      "grass",
      "poison"
    ],
    "stats": {
      "hp": 60,
      "attack": 70,
      "defense": 65,
      "specialAttack": 125,
      "specialDefense": 105,
      "speed": 90
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/407.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/407.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/407.ogg",
    "moves": [
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 188,
        "name": "sludge-bomb",
        "type": "poison",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 605,
        "name": "dazzling-gleam",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "409": {
    "id": 409,
    "number": 409,
    "name": "rampardos",
    "types": [
      "rock"
    ],
    "stats": {
      "hp": 97,
      "attack": 165,
      "defense": 60,
      "specialAttack": 65,
      "specialDefense": 50,
      "speed": 58
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/409.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/409.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/409.ogg",
    "moves": [
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 337,
        "name": "dragon-claw",
        "type": "dragon",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "411": {
    "id": 411,
    "number": 411,
    "name": "bastiodon",
    "types": [
      "rock",
      "steel"
    ],
    "stats": {
      "hp": 60,
      "attack": 52,
      "defense": 168,
      "specialAttack": 47,
      "specialDefense": 138,
      "speed": 30
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/411.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/411.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/411.ogg",
    "moves": [
      {
        "id": 408,
        "name": "power-gem",
        "type": "rock",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "special"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 776,
        "name": "body-press",
        "type": "fighting",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "414": {
    "id": 414,
    "number": 414,
    "name": "mothim",
    "types": [
      "bug",
      "flying"
    ],
    "stats": {
      "hp": 70,
      "attack": 94,
      "defense": 50,
      "specialAttack": 94,
      "specialDefense": 50,
      "speed": 66
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/414.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/414.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/414.ogg",
    "moves": [
      {
        "id": 405,
        "name": "bug-buzz",
        "type": "bug",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 403,
        "name": "air-slash",
        "type": "flying",
        "power": 75,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "416": {
    "id": 416,
    "number": 416,
    "name": "vespiquen",
    "types": [
      "bug",
      "flying"
    ],
    "stats": {
      "hp": 70,
      "attack": 80,
      "defense": 102,
      "specialAttack": 80,
      "specialDefense": 102,
      "speed": 40
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/416.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/416.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/416.ogg",
    "moves": [
      {
        "id": 405,
        "name": "bug-buzz",
        "type": "bug",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 403,
        "name": "air-slash",
        "type": "flying",
        "power": 75,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 188,
        "name": "sludge-bomb",
        "type": "poison",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 408,
        "name": "power-gem",
        "type": "rock",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "special"
      }
    ]
  },
  "419": {
    "id": 419,
    "number": 419,
    "name": "floatzel",
    "types": [
      "water"
    ],
    "stats": {
      "hp": 85,
      "attack": 105,
      "defense": 55,
      "specialAttack": 85,
      "specialDefense": 50,
      "speed": 115
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/419.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/419.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/419.ogg",
    "moves": [
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 861,
        "name": "ice-spinner",
        "type": "ice",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "421": {
    "id": 421,
    "number": 421,
    "name": "cherrim",
    "types": [
      "grass"
    ],
    "stats": {
      "hp": 70,
      "attack": 60,
      "defense": 70,
      "specialAttack": 87,
      "specialDefense": 78,
      "speed": 85
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/421.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/421.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/421.ogg",
    "moves": [
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 676,
        "name": "pollen-puff",
        "type": "bug",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 605,
        "name": "dazzling-gleam",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 496,
        "name": "round",
        "type": "normal",
        "power": 60,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "423": {
    "id": 423,
    "number": 423,
    "name": "gastrodon",
    "types": [
      "water",
      "ground"
    ],
    "stats": {
      "hp": 111,
      "attack": 83,
      "defense": 68,
      "specialAttack": 92,
      "specialDefense": 82,
      "speed": 39
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/423.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/423.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/423.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 482,
        "name": "sludge-wave",
        "type": "poison",
        "power": 95,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "424": {
    "id": 424,
    "number": 424,
    "name": "ambipom",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 75,
      "attack": 100,
      "defense": 66,
      "specialAttack": 60,
      "specialDefense": 66,
      "speed": 115
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/424.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/424.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/424.ogg",
    "moves": [
      {
        "id": 70,
        "name": "strength",
        "type": "normal",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "426": {
    "id": 426,
    "number": 426,
    "name": "drifblim",
    "types": [
      "ghost",
      "flying"
    ],
    "stats": {
      "hp": 150,
      "attack": 80,
      "defense": 44,
      "specialAttack": 90,
      "specialDefense": 54,
      "speed": 80
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/426.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/426.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/426.ogg",
    "moves": [
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 403,
        "name": "air-slash",
        "type": "flying",
        "power": 75,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "428": {
    "id": 428,
    "number": 428,
    "name": "lopunny",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 65,
      "attack": 76,
      "defense": 84,
      "specialAttack": 54,
      "specialDefense": 96,
      "speed": 105
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/428.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/428.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/428.ogg",
    "moves": [
      {
        "id": 25,
        "name": "mega-kick",
        "type": "normal",
        "power": 120,
        "accuracy": 75,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 7,
        "name": "fire-punch",
        "type": "fire",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "429": {
    "id": 429,
    "number": 429,
    "name": "mismagius",
    "types": [
      "ghost"
    ],
    "stats": {
      "hp": 60,
      "attack": 60,
      "defense": 60,
      "specialAttack": 105,
      "specialDefense": 105,
      "speed": 105
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/429.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/429.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/429.ogg",
    "moves": [
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "430": {
    "id": 430,
    "number": 430,
    "name": "honchkrow",
    "types": [
      "dark",
      "flying"
    ],
    "stats": {
      "hp": 100,
      "attack": 125,
      "defense": 52,
      "specialAttack": 105,
      "specialDefense": 52,
      "speed": 71
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/430.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/430.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/430.ogg",
    "moves": [
      {
        "id": 400,
        "name": "night-slash",
        "type": "dark",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 17,
        "name": "wing-attack",
        "type": "flying",
        "power": 60,
        "accuracy": 100,
        "pp": 35,
        "damageClass": "physical"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "432": {
    "id": 432,
    "number": 432,
    "name": "purugly",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 71,
      "attack": 82,
      "defense": 64,
      "specialAttack": 64,
      "specialDefense": 59,
      "speed": 112
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/432.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/432.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/432.ogg",
    "moves": [
      {
        "id": 34,
        "name": "body-slam",
        "type": "normal",
        "power": 85,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "435": {
    "id": 435,
    "number": 435,
    "name": "skuntank",
    "types": [
      "poison",
      "dark"
    ],
    "stats": {
      "hp": 103,
      "attack": 93,
      "defense": 67,
      "specialAttack": 71,
      "specialDefense": 61,
      "speed": 84
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/435.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/435.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/435.ogg",
    "moves": [
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "437": {
    "id": 437,
    "number": 437,
    "name": "bronzong",
    "types": [
      "steel",
      "psychic"
    ],
    "stats": {
      "hp": 67,
      "attack": 89,
      "defense": 116,
      "specialAttack": 79,
      "specialDefense": 116,
      "speed": 33
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/437.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/437.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/437.ogg",
    "moves": [
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 861,
        "name": "ice-spinner",
        "type": "ice",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "441": {
    "id": 441,
    "number": 441,
    "name": "chatot",
    "types": [
      "normal",
      "flying"
    ],
    "stats": {
      "hp": 76,
      "attack": 65,
      "defense": 45,
      "specialAttack": 92,
      "specialDefense": 42,
      "speed": 91
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/441.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/441.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/441.ogg",
    "moves": [
      {
        "id": 586,
        "name": "boomburst",
        "type": "normal",
        "power": 140,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 403,
        "name": "air-slash",
        "type": "flying",
        "power": 75,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 257,
        "name": "heat-wave",
        "type": "fire",
        "power": 95,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 466,
        "name": "ominous-wind",
        "type": "ghost",
        "power": 60,
        "accuracy": 100,
        "pp": 5,
        "damageClass": "special"
      }
    ]
  },
  "442": {
    "id": 442,
    "number": 442,
    "name": "spiritomb",
    "types": [
      "ghost",
      "dark"
    ],
    "stats": {
      "hp": 50,
      "attack": 92,
      "defense": 108,
      "specialAttack": 92,
      "specialDefense": 108,
      "speed": 35
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/442.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/442.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/442.ogg",
    "moves": [
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 196,
        "name": "icy-wind",
        "type": "ice",
        "power": 55,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "445": {
    "id": 445,
    "number": 445,
    "name": "garchomp",
    "types": [
      "dragon",
      "ground"
    ],
    "stats": {
      "hp": 108,
      "attack": 130,
      "defense": 95,
      "specialAttack": 80,
      "specialDefense": 85,
      "speed": 102
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/445.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/445.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/445.ogg",
    "moves": [
      {
        "id": 337,
        "name": "dragon-claw",
        "type": "dragon",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "448": {
    "id": 448,
    "number": 448,
    "name": "lucario",
    "types": [
      "fighting",
      "steel"
    ],
    "stats": {
      "hp": 70,
      "attack": 110,
      "defense": 70,
      "specialAttack": 115,
      "specialDefense": 70,
      "speed": 90
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/448.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/448.ogg",
    "moves": [
      {
        "id": 396,
        "name": "aura-sphere",
        "type": "fighting",
        "power": 80,
        "accuracy": null,
        "pp": 20,
        "damageClass": "special"
      },
      {
        "id": 430,
        "name": "flash-cannon",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "450": {
    "id": 450,
    "number": 450,
    "name": "hippowdon",
    "types": [
      "ground"
    ],
    "stats": {
      "hp": 108,
      "attack": 112,
      "defense": 118,
      "specialAttack": 68,
      "specialDefense": 72,
      "speed": 47
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/450.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/450.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/450.ogg",
    "moves": [
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      }
    ]
  },
  "452": {
    "id": 452,
    "number": 452,
    "name": "drapion",
    "types": [
      "poison",
      "dark"
    ],
    "stats": {
      "hp": 70,
      "attack": 90,
      "defense": 110,
      "specialAttack": 60,
      "specialDefense": 75,
      "speed": 95
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/452.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/452.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/452.ogg",
    "moves": [
      {
        "id": 398,
        "name": "poison-jab",
        "type": "poison",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 141,
        "name": "leech-life",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "454": {
    "id": 454,
    "number": 454,
    "name": "toxicroak",
    "types": [
      "poison",
      "fighting"
    ],
    "stats": {
      "hp": 83,
      "attack": 106,
      "defense": 65,
      "specialAttack": 86,
      "specialDefense": 65,
      "speed": 85
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/454.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/454.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/454.ogg",
    "moves": [
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "455": {
    "id": 455,
    "number": 455,
    "name": "carnivine",
    "types": [
      "grass"
    ],
    "stats": {
      "hp": 74,
      "attack": 100,
      "defense": 72,
      "specialAttack": 90,
      "specialDefense": 72,
      "speed": 46
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/455.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/455.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/455.ogg",
    "moves": [
      {
        "id": 438,
        "name": "power-whip",
        "type": "grass",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 188,
        "name": "sludge-bomb",
        "type": "poison",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 450,
        "name": "bug-bite",
        "type": "bug",
        "power": 60,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "457": {
    "id": 457,
    "number": 457,
    "name": "lumineon",
    "types": [
      "water"
    ],
    "stats": {
      "hp": 69,
      "attack": 69,
      "defense": 76,
      "specialAttack": 69,
      "specialDefense": 86,
      "speed": 91
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/457.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/457.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/457.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 605,
        "name": "dazzling-gleam",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 324,
        "name": "signal-beam",
        "type": "bug",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "460": {
    "id": 460,
    "number": 460,
    "name": "abomasnow",
    "types": [
      "grass",
      "ice"
    ],
    "stats": {
      "hp": 90,
      "attack": 92,
      "defense": 75,
      "specialAttack": 92,
      "specialDefense": 85,
      "speed": 60
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/460.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/460.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/460.ogg",
    "moves": [
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "461": {
    "id": 461,
    "number": 461,
    "name": "weavile",
    "types": [
      "dark",
      "ice"
    ],
    "stats": {
      "hp": 70,
      "attack": 120,
      "defense": 65,
      "specialAttack": 45,
      "specialDefense": 85,
      "speed": 125
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/461.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/461.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/461.ogg",
    "moves": [
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 861,
        "name": "ice-spinner",
        "type": "ice",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 404,
        "name": "x-scissor",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "462": {
    "id": 462,
    "number": 462,
    "name": "magnezone",
    "types": [
      "electric",
      "steel"
    ],
    "stats": {
      "hp": 70,
      "attack": 70,
      "defense": 115,
      "specialAttack": 130,
      "specialDefense": 90,
      "speed": 60
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/462.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/462.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/462.ogg",
    "moves": [
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 430,
        "name": "flash-cannon",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 324,
        "name": "signal-beam",
        "type": "bug",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 776,
        "name": "body-press",
        "type": "fighting",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "463": {
    "id": 463,
    "number": 463,
    "name": "lickilicky",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 110,
      "attack": 85,
      "defense": 95,
      "specialAttack": 80,
      "specialDefense": 95,
      "speed": 50
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/463.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/463.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/463.ogg",
    "moves": [
      {
        "id": 34,
        "name": "body-slam",
        "type": "normal",
        "power": 85,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 438,
        "name": "power-whip",
        "type": "grass",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "464": {
    "id": 464,
    "number": 464,
    "name": "rhyperior",
    "types": [
      "ground",
      "rock"
    ],
    "stats": {
      "hp": 115,
      "attack": 140,
      "defense": 130,
      "specialAttack": 55,
      "specialDefense": 55,
      "speed": 40
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/464.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/464.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/464.ogg",
    "moves": [
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 224,
        "name": "megahorn",
        "type": "bug",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "465": {
    "id": 465,
    "number": 465,
    "name": "tangrowth",
    "types": [
      "grass"
    ],
    "stats": {
      "hp": 100,
      "attack": 100,
      "defense": 125,
      "specialAttack": 110,
      "specialDefense": 50,
      "speed": 50
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/465.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/465.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/465.ogg",
    "moves": [
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 188,
        "name": "sludge-bomb",
        "type": "poison",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 282,
        "name": "knock-off",
        "type": "dark",
        "power": 65,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "466": {
    "id": 466,
    "number": 466,
    "name": "electivire",
    "types": [
      "electric"
    ],
    "stats": {
      "hp": 75,
      "attack": 123,
      "defense": 67,
      "specialAttack": 95,
      "specialDefense": 85,
      "speed": 95
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/466.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/466.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/466.ogg",
    "moves": [
      {
        "id": 9,
        "name": "thunder-punch",
        "type": "electric",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 663,
        "name": "darkest-lariat",
        "type": "dark",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "467": {
    "id": 467,
    "number": 467,
    "name": "magmortar",
    "types": [
      "fire"
    ],
    "stats": {
      "hp": 75,
      "attack": 95,
      "defense": 67,
      "specialAttack": 125,
      "specialDefense": 95,
      "speed": 83
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/467.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/467.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/467.ogg",
    "moves": [
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "468": {
    "id": 468,
    "number": 468,
    "name": "togekiss",
    "types": [
      "fairy",
      "flying"
    ],
    "stats": {
      "hp": 85,
      "attack": 50,
      "defense": 95,
      "specialAttack": 120,
      "specialDefense": 115,
      "speed": 80
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/468.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/468.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/468.ogg",
    "moves": [
      {
        "id": 585,
        "name": "moonblast",
        "type": "fairy",
        "power": 95,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 403,
        "name": "air-slash",
        "type": "flying",
        "power": 75,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "469": {
    "id": 469,
    "number": 469,
    "name": "yanmega",
    "types": [
      "bug",
      "flying"
    ],
    "stats": {
      "hp": 86,
      "attack": 76,
      "defense": 86,
      "specialAttack": 116,
      "specialDefense": 56,
      "speed": 95
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/469.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/469.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/469.ogg",
    "moves": [
      {
        "id": 405,
        "name": "bug-buzz",
        "type": "bug",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 403,
        "name": "air-slash",
        "type": "flying",
        "power": 75,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "470": {
    "id": 470,
    "number": 470,
    "name": "leafeon",
    "types": [
      "grass"
    ],
    "stats": {
      "hp": 65,
      "attack": 110,
      "defense": 130,
      "specialAttack": 60,
      "specialDefense": 65,
      "speed": 95
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/470.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/470.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/470.ogg",
    "moves": [
      {
        "id": 348,
        "name": "leaf-blade",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 404,
        "name": "x-scissor",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 282,
        "name": "knock-off",
        "type": "dark",
        "power": 65,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 231,
        "name": "iron-tail",
        "type": "steel",
        "power": 100,
        "accuracy": 75,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "471": {
    "id": 471,
    "number": 471,
    "name": "glaceon",
    "types": [
      "ice"
    ],
    "stats": {
      "hp": 65,
      "attack": 60,
      "defense": 110,
      "specialAttack": 130,
      "specialDefense": 95,
      "speed": 65
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/471.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/471.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/471.ogg",
    "moves": [
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 914,
        "name": "alluring-voice",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 324,
        "name": "signal-beam",
        "type": "bug",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "472": {
    "id": 472,
    "number": 472,
    "name": "gliscor",
    "types": [
      "ground",
      "flying"
    ],
    "stats": {
      "hp": 75,
      "attack": 95,
      "defense": 125,
      "specialAttack": 45,
      "specialDefense": 75,
      "speed": 95
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/472.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/472.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/472.ogg",
    "moves": [
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 17,
        "name": "wing-attack",
        "type": "flying",
        "power": 60,
        "accuracy": 100,
        "pp": 35,
        "damageClass": "physical"
      },
      {
        "id": 438,
        "name": "power-whip",
        "type": "grass",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 152,
        "name": "crabhammer",
        "type": "water",
        "power": 100,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "473": {
    "id": 473,
    "number": 473,
    "name": "mamoswine",
    "types": [
      "ice",
      "ground"
    ],
    "stats": {
      "hp": 110,
      "attack": 130,
      "defense": 80,
      "specialAttack": 70,
      "specialDefense": 60,
      "speed": 80
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/473.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/473.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/473.ogg",
    "moves": [
      {
        "id": 556,
        "name": "icicle-crash",
        "type": "ice",
        "power": 85,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "474": {
    "id": 474,
    "number": 474,
    "name": "porygon-z",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 85,
      "attack": 80,
      "defense": 70,
      "specialAttack": 135,
      "specialDefense": 75,
      "speed": 90
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/474.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/474.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/474.ogg",
    "moves": [
      {
        "id": 161,
        "name": "tri-attack",
        "type": "normal",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "475": {
    "id": 475,
    "number": 475,
    "name": "gallade",
    "types": [
      "psychic",
      "fighting"
    ],
    "stats": {
      "hp": 68,
      "attack": 125,
      "defense": 65,
      "specialAttack": 65,
      "specialDefense": 115,
      "speed": 80
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/475.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/475.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/475.ogg",
    "moves": [
      {
        "id": 428,
        "name": "zen-headbutt",
        "type": "psychic",
        "power": 80,
        "accuracy": 90,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 533,
        "name": "sacred-sword",
        "type": "fighting",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 348,
        "name": "leaf-blade",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "476": {
    "id": 476,
    "number": 476,
    "name": "probopass",
    "types": [
      "rock",
      "steel"
    ],
    "stats": {
      "hp": 60,
      "attack": 55,
      "defense": 145,
      "specialAttack": 75,
      "specialDefense": 150,
      "speed": 40
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/476.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/476.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/476.ogg",
    "moves": [
      {
        "id": 408,
        "name": "power-gem",
        "type": "rock",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "special"
      },
      {
        "id": 430,
        "name": "flash-cannon",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 414,
        "name": "earth-power",
        "type": "ground",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 776,
        "name": "body-press",
        "type": "fighting",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "477": {
    "id": 477,
    "number": 477,
    "name": "dusknoir",
    "types": [
      "ghost"
    ],
    "stats": {
      "hp": 45,
      "attack": 100,
      "defense": 135,
      "specialAttack": 65,
      "specialDefense": 135,
      "speed": 45
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/477.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/477.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/477.ogg",
    "moves": [
      {
        "id": 325,
        "name": "shadow-punch",
        "type": "ghost",
        "power": 60,
        "accuracy": null,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 663,
        "name": "darkest-lariat",
        "type": "dark",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "478": {
    "id": 478,
    "number": 478,
    "name": "froslass",
    "types": [
      "ice",
      "ghost"
    ],
    "stats": {
      "hp": 70,
      "attack": 80,
      "defense": 70,
      "specialAttack": 80,
      "specialDefense": 70,
      "speed": 110
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/478.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/478.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/478.ogg",
    "moves": [
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "479": {
    "id": 479,
    "number": 479,
    "name": "rotom",
    "types": [
      "electric",
      "ghost"
    ],
    "stats": {
      "hp": 50,
      "attack": 50,
      "defense": 77,
      "specialAttack": 95,
      "specialDefense": 77,
      "speed": 91
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/479.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/479.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/479.ogg",
    "moves": [
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 324,
        "name": "signal-beam",
        "type": "bug",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "497": {
    "id": 497,
    "number": 497,
    "name": "serperior",
    "types": [
      "grass"
    ],
    "stats": {
      "hp": 75,
      "attack": 75,
      "defense": 95,
      "specialAttack": 75,
      "specialDefense": 95,
      "speed": 113
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/497.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/497.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/497.ogg",
    "moves": [
      {
        "id": 348,
        "name": "leaf-blade",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 406,
        "name": "dragon-pulse",
        "type": "dragon",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 401,
        "name": "aqua-tail",
        "type": "water",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 282,
        "name": "knock-off",
        "type": "dark",
        "power": 65,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "500": {
    "id": 500,
    "number": 500,
    "name": "emboar",
    "types": [
      "fire",
      "fighting"
    ],
    "stats": {
      "hp": 110,
      "attack": 123,
      "defense": 65,
      "specialAttack": 100,
      "specialDefense": 65,
      "speed": 65
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/500.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/500.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/500.ogg",
    "moves": [
      {
        "id": 7,
        "name": "fire-punch",
        "type": "fire",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 398,
        "name": "poison-jab",
        "type": "poison",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "503": {
    "id": 503,
    "number": 503,
    "name": "samurott",
    "types": [
      "water"
    ],
    "stats": {
      "hp": 95,
      "attack": 100,
      "defense": 85,
      "specialAttack": 108,
      "specialDefense": 70,
      "speed": 70
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/503.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/503.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/503.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 224,
        "name": "megahorn",
        "type": "bug",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "508": {
    "id": 508,
    "number": 508,
    "name": "stoutland",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 85,
      "attack": 110,
      "defense": 90,
      "specialAttack": 45,
      "specialDefense": 90,
      "speed": 80
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/508.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/508.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/508.ogg",
    "moves": [
      {
        "id": 70,
        "name": "strength",
        "type": "normal",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 706,
        "name": "psychic-fangs",
        "type": "psychic",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "510": {
    "id": 510,
    "number": 510,
    "name": "liepard",
    "types": [
      "dark"
    ],
    "stats": {
      "hp": 64,
      "attack": 88,
      "defense": 50,
      "specialAttack": 88,
      "specialDefense": 50,
      "speed": 106
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/510.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/510.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/510.ogg",
    "moves": [
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 706,
        "name": "psychic-fangs",
        "type": "psychic",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "512": {
    "id": 512,
    "number": 512,
    "name": "simisage",
    "types": [
      "grass"
    ],
    "stats": {
      "hp": 75,
      "attack": 98,
      "defense": 63,
      "specialAttack": 98,
      "specialDefense": 63,
      "speed": 101
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/512.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/512.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/512.ogg",
    "moves": [
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "514": {
    "id": 514,
    "number": 514,
    "name": "simisear",
    "types": [
      "fire"
    ],
    "stats": {
      "hp": 75,
      "attack": 98,
      "defense": 63,
      "specialAttack": 98,
      "specialDefense": 63,
      "speed": 101
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/514.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/514.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/514.ogg",
    "moves": [
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "516": {
    "id": 516,
    "number": 516,
    "name": "simipour",
    "types": [
      "water"
    ],
    "stats": {
      "hp": 75,
      "attack": 98,
      "defense": 63,
      "specialAttack": 98,
      "specialDefense": 63,
      "speed": 101
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/516.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/516.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/516.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      }
    ]
  },
  "518": {
    "id": 518,
    "number": 518,
    "name": "musharna",
    "types": [
      "psychic"
    ],
    "stats": {
      "hp": 116,
      "attack": 55,
      "defense": 85,
      "specialAttack": 107,
      "specialDefense": 95,
      "speed": 29
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/518.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/518.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/518.ogg",
    "moves": [
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 585,
        "name": "moonblast",
        "type": "fairy",
        "power": 95,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "521": {
    "id": 521,
    "number": 521,
    "name": "unfezant",
    "types": [
      "normal",
      "flying"
    ],
    "stats": {
      "hp": 80,
      "attack": 115,
      "defense": 80,
      "specialAttack": 65,
      "specialDefense": 55,
      "speed": 93
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/521.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/521.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/521.ogg",
    "moves": [
      {
        "id": 290,
        "name": "secret-power",
        "type": "normal",
        "power": 70,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 332,
        "name": "aerial-ace",
        "type": "flying",
        "power": 60,
        "accuracy": null,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 369,
        "name": "u-turn",
        "type": "bug",
        "power": 70,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 211,
        "name": "steel-wing",
        "type": "steel",
        "power": 70,
        "accuracy": 90,
        "pp": 25,
        "damageClass": "physical"
      }
    ]
  },
  "523": {
    "id": 523,
    "number": 523,
    "name": "zebstrika",
    "types": [
      "electric"
    ],
    "stats": {
      "hp": 75,
      "attack": 100,
      "defense": 63,
      "specialAttack": 80,
      "specialDefense": 63,
      "speed": 116
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/523.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/523.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/523.ogg",
    "moves": [
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 667,
        "name": "high-horsepower",
        "type": "ground",
        "power": 95,
        "accuracy": 95,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 684,
        "name": "smart-strike",
        "type": "steel",
        "power": 70,
        "accuracy": null,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 324,
        "name": "signal-beam",
        "type": "bug",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "526": {
    "id": 526,
    "number": 526,
    "name": "gigalith",
    "types": [
      "rock"
    ],
    "stats": {
      "hp": 85,
      "attack": 135,
      "defense": 130,
      "specialAttack": 60,
      "specialDefense": 80,
      "speed": 25
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/526.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/526.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/526.ogg",
    "moves": [
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "530": {
    "id": 530,
    "number": 530,
    "name": "excadrill",
    "types": [
      "ground",
      "steel"
    ],
    "stats": {
      "hp": 110,
      "attack": 135,
      "defense": 60,
      "specialAttack": 50,
      "specialDefense": 65,
      "speed": 88
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/530.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/530.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/530.ogg",
    "moves": [
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 224,
        "name": "megahorn",
        "type": "bug",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "534": {
    "id": 534,
    "number": 534,
    "name": "conkeldurr",
    "types": [
      "fighting"
    ],
    "stats": {
      "hp": 105,
      "attack": 140,
      "defense": 95,
      "specialAttack": 55,
      "specialDefense": 65,
      "speed": 45
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/534.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/534.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/534.ogg",
    "moves": [
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 398,
        "name": "poison-jab",
        "type": "poison",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "537": {
    "id": 537,
    "number": 537,
    "name": "seismitoad",
    "types": [
      "water",
      "ground"
    ],
    "stats": {
      "hp": 105,
      "attack": 95,
      "defense": 75,
      "specialAttack": 85,
      "specialDefense": 75,
      "speed": 74
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/537.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/537.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/537.ogg",
    "moves": [
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 438,
        "name": "power-whip",
        "type": "grass",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "542": {
    "id": 542,
    "number": 542,
    "name": "leavanny",
    "types": [
      "bug",
      "grass"
    ],
    "stats": {
      "hp": 75,
      "attack": 103,
      "defense": 80,
      "specialAttack": 70,
      "specialDefense": 80,
      "speed": 92
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/542.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/542.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/542.ogg",
    "moves": [
      {
        "id": 404,
        "name": "x-scissor",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 348,
        "name": "leaf-blade",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "545": {
    "id": 545,
    "number": 545,
    "name": "scolipede",
    "types": [
      "bug",
      "poison"
    ],
    "stats": {
      "hp": 60,
      "attack": 100,
      "defense": 89,
      "specialAttack": 55,
      "specialDefense": 69,
      "speed": 112
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/545.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/545.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/545.ogg",
    "moves": [
      {
        "id": 224,
        "name": "megahorn",
        "type": "bug",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "553": {
    "id": 553,
    "number": 553,
    "name": "krookodile",
    "types": [
      "ground",
      "dark"
    ],
    "stats": {
      "hp": 95,
      "attack": 117,
      "defense": 80,
      "specialAttack": 65,
      "specialDefense": 70,
      "speed": 92
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/553.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/553.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/553.ogg",
    "moves": [
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 663,
        "name": "darkest-lariat",
        "type": "dark",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 337,
        "name": "dragon-claw",
        "type": "dragon",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "558": {
    "id": 558,
    "number": 558,
    "name": "crustle",
    "types": [
      "bug",
      "rock"
    ],
    "stats": {
      "hp": 70,
      "attack": 105,
      "defense": 125,
      "specialAttack": 65,
      "specialDefense": 75,
      "speed": 45
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/558.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/558.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/558.ogg",
    "moves": [
      {
        "id": 404,
        "name": "x-scissor",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "560": {
    "id": 560,
    "number": 560,
    "name": "scrafty",
    "types": [
      "dark",
      "fighting"
    ],
    "stats": {
      "hp": 65,
      "attack": 90,
      "defense": 115,
      "specialAttack": 45,
      "specialDefense": 115,
      "speed": 58
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/560.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/560.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/560.ogg",
    "moves": [
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 337,
        "name": "dragon-claw",
        "type": "dragon",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "561": {
    "id": 561,
    "number": 561,
    "name": "sigilyph",
    "types": [
      "psychic",
      "flying"
    ],
    "stats": {
      "hp": 72,
      "attack": 58,
      "defense": 80,
      "specialAttack": 103,
      "specialDefense": 80,
      "speed": 97
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/561.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/561.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/561.ogg",
    "moves": [
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 403,
        "name": "air-slash",
        "type": "flying",
        "power": 75,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "563": {
    "id": 563,
    "number": 563,
    "name": "cofagrigus",
    "types": [
      "ghost"
    ],
    "stats": {
      "hp": 58,
      "attack": 50,
      "defense": 145,
      "specialAttack": 95,
      "specialDefense": 105,
      "speed": 30
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/563.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/563.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/563.ogg",
    "moves": [
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "565": {
    "id": 565,
    "number": 565,
    "name": "carracosta",
    "types": [
      "water",
      "rock"
    ],
    "stats": {
      "hp": 74,
      "attack": 108,
      "defense": 133,
      "specialAttack": 83,
      "specialDefense": 65,
      "speed": 32
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/565.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/565.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/565.ogg",
    "moves": [
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "571": {
    "id": 571,
    "number": 571,
    "name": "zoroark",
    "types": [
      "dark"
    ],
    "stats": {
      "hp": 60,
      "attack": 105,
      "defense": 60,
      "specialAttack": 120,
      "specialDefense": 60,
      "speed": 105
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/571.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/571.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/571.ogg",
    "moves": [
      {
        "id": 539,
        "name": "night-daze",
        "type": "dark",
        "power": 85,
        "accuracy": 95,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "576": {
    "id": 576,
    "number": 576,
    "name": "gothitelle",
    "types": [
      "psychic"
    ],
    "stats": {
      "hp": 70,
      "attack": 55,
      "defense": 95,
      "specialAttack": 95,
      "specialDefense": 110,
      "speed": 65
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/576.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/576.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/576.ogg",
    "moves": [
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "579": {
    "id": 579,
    "number": 579,
    "name": "reuniclus",
    "types": [
      "psychic"
    ],
    "stats": {
      "hp": 110,
      "attack": 65,
      "defense": 75,
      "specialAttack": 125,
      "specialDefense": 85,
      "speed": 30
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/579.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/579.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/579.ogg",
    "moves": [
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 324,
        "name": "signal-beam",
        "type": "bug",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "584": {
    "id": 584,
    "number": 584,
    "name": "vanilluxe",
    "types": [
      "ice"
    ],
    "stats": {
      "hp": 71,
      "attack": 95,
      "defense": 85,
      "specialAttack": 110,
      "specialDefense": 95,
      "speed": 79
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/584.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/584.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/584.ogg",
    "moves": [
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 324,
        "name": "signal-beam",
        "type": "bug",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 430,
        "name": "flash-cannon",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 304,
        "name": "hyper-voice",
        "type": "normal",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "589": {
    "id": 589,
    "number": 589,
    "name": "escavalier",
    "types": [
      "bug",
      "steel"
    ],
    "stats": {
      "hp": 70,
      "attack": 135,
      "defense": 105,
      "specialAttack": 60,
      "specialDefense": 105,
      "speed": 20
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/589.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/589.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/589.ogg",
    "moves": [
      {
        "id": 224,
        "name": "megahorn",
        "type": "bug",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 529,
        "name": "drill-run",
        "type": "ground",
        "power": 80,
        "accuracy": 95,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 398,
        "name": "poison-jab",
        "type": "poison",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "596": {
    "id": 596,
    "number": 596,
    "name": "galvantula",
    "types": [
      "bug",
      "electric"
    ],
    "stats": {
      "hp": 70,
      "attack": 77,
      "defense": 60,
      "specialAttack": 97,
      "specialDefense": 60,
      "speed": 108
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/596.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/596.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/596.ogg",
    "moves": [
      {
        "id": 405,
        "name": "bug-buzz",
        "type": "bug",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "597": {
    "id": 597,
    "number": 597,
    "name": "ferroseed",
    "types": [
      "grass",
      "steel"
    ],
    "stats": {
      "hp": 44,
      "attack": 50,
      "defense": 91,
      "specialAttack": 24,
      "specialDefense": 86,
      "speed": 10
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/597.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/597.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/597.ogg",
    "moves": [
      {
        "id": 402,
        "name": "seed-bomb",
        "type": "grass",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 398,
        "name": "poison-jab",
        "type": "poison",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 282,
        "name": "knock-off",
        "type": "dark",
        "power": 65,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "598": {
    "id": 598,
    "number": 598,
    "name": "ferrothorn",
    "types": [
      "grass",
      "steel"
    ],
    "stats": {
      "hp": 74,
      "attack": 94,
      "defense": 131,
      "specialAttack": 54,
      "specialDefense": 116,
      "speed": 20
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/598.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/598.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/598.ogg",
    "moves": [
      {
        "id": 438,
        "name": "power-whip",
        "type": "grass",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 776,
        "name": "body-press",
        "type": "fighting",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "601": {
    "id": 601,
    "number": 601,
    "name": "klinklang",
    "types": [
      "steel"
    ],
    "stats": {
      "hp": 60,
      "attack": 100,
      "defense": 115,
      "specialAttack": 70,
      "specialDefense": 85,
      "speed": 90
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/601.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/601.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/601.ogg",
    "moves": [
      {
        "id": 430,
        "name": "flash-cannon",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 408,
        "name": "power-gem",
        "type": "rock",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "special"
      },
      {
        "id": 324,
        "name": "signal-beam",
        "type": "bug",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "604": {
    "id": 604,
    "number": 604,
    "name": "eelektross",
    "types": [
      "electric"
    ],
    "stats": {
      "hp": 85,
      "attack": 115,
      "defense": 80,
      "specialAttack": 105,
      "specialDefense": 80,
      "speed": 50
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/604.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/604.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/604.ogg",
    "moves": [
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 706,
        "name": "psychic-fangs",
        "type": "psychic",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "606": {
    "id": 606,
    "number": 606,
    "name": "beheeyem",
    "types": [
      "psychic"
    ],
    "stats": {
      "hp": 75,
      "attack": 75,
      "defense": 75,
      "specialAttack": 125,
      "specialDefense": 95,
      "speed": 40
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/606.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/606.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/606.ogg",
    "moves": [
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "609": {
    "id": 609,
    "number": 609,
    "name": "chandelure",
    "types": [
      "ghost",
      "fire"
    ],
    "stats": {
      "hp": 60,
      "attack": 55,
      "defense": 90,
      "specialAttack": 145,
      "specialDefense": 90,
      "speed": 80
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/609.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/609.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/609.ogg",
    "moves": [
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "612": {
    "id": 612,
    "number": 612,
    "name": "haxorus",
    "types": [
      "dragon"
    ],
    "stats": {
      "hp": 76,
      "attack": 147,
      "defense": 90,
      "specialAttack": 60,
      "specialDefense": 70,
      "speed": 97
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/612.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/612.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/612.ogg",
    "moves": [
      {
        "id": 337,
        "name": "dragon-claw",
        "type": "dragon",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 404,
        "name": "x-scissor",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "614": {
    "id": 614,
    "number": 614,
    "name": "beartic",
    "types": [
      "ice"
    ],
    "stats": {
      "hp": 95,
      "attack": 130,
      "defense": 80,
      "specialAttack": 70,
      "specialDefense": 80,
      "speed": 50
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/614.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/614.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/614.ogg",
    "moves": [
      {
        "id": 556,
        "name": "icicle-crash",
        "type": "ice",
        "power": 85,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "615": {
    "id": 615,
    "number": 615,
    "name": "cryogonal",
    "types": [
      "ice"
    ],
    "stats": {
      "hp": 80,
      "attack": 50,
      "defense": 50,
      "specialAttack": 95,
      "specialDefense": 135,
      "speed": 105
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/615.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/615.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/615.ogg",
    "moves": [
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 324,
        "name": "signal-beam",
        "type": "bug",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 430,
        "name": "flash-cannon",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 246,
        "name": "ancient-power",
        "type": "rock",
        "power": 60,
        "accuracy": 100,
        "pp": 5,
        "damageClass": "special"
      }
    ]
  },
  "617": {
    "id": 617,
    "number": 617,
    "name": "accelgor",
    "types": [
      "bug"
    ],
    "stats": {
      "hp": 80,
      "attack": 70,
      "defense": 40,
      "specialAttack": 100,
      "specialDefense": 60,
      "speed": 145
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/617.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/617.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/617.ogg",
    "moves": [
      {
        "id": 405,
        "name": "bug-buzz",
        "type": "bug",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 188,
        "name": "sludge-bomb",
        "type": "poison",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 411,
        "name": "focus-blast",
        "type": "fighting",
        "power": 120,
        "accuracy": 70,
        "pp": 5,
        "damageClass": "special"
      }
    ]
  },
  "620": {
    "id": 620,
    "number": 620,
    "name": "mienshao",
    "types": [
      "fighting"
    ],
    "stats": {
      "hp": 65,
      "attack": 125,
      "defense": 60,
      "specialAttack": 95,
      "specialDefense": 60,
      "speed": 105
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/620.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/620.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/620.ogg",
    "moves": [
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 861,
        "name": "ice-spinner",
        "type": "ice",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 299,
        "name": "blaze-kick",
        "type": "fire",
        "power": 85,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 398,
        "name": "poison-jab",
        "type": "poison",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "621": {
    "id": 621,
    "number": 621,
    "name": "druddigon",
    "types": [
      "dragon"
    ],
    "stats": {
      "hp": 77,
      "attack": 120,
      "defense": 90,
      "specialAttack": 60,
      "specialDefense": 90,
      "speed": 48
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/621.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/621.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/621.ogg",
    "moves": [
      {
        "id": 337,
        "name": "dragon-claw",
        "type": "dragon",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      }
    ]
  },
  "623": {
    "id": 623,
    "number": 623,
    "name": "golurk",
    "types": [
      "ground",
      "ghost"
    ],
    "stats": {
      "hp": 89,
      "attack": 124,
      "defense": 80,
      "specialAttack": 55,
      "specialDefense": 80,
      "speed": 55
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/623.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/623.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/623.ogg",
    "moves": [
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 325,
        "name": "shadow-punch",
        "type": "ghost",
        "power": 60,
        "accuracy": null,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 663,
        "name": "darkest-lariat",
        "type": "dark",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "625": {
    "id": 625,
    "number": 625,
    "name": "bisharp",
    "types": [
      "dark",
      "steel"
    ],
    "stats": {
      "hp": 65,
      "attack": 125,
      "defense": 100,
      "specialAttack": 60,
      "specialDefense": 70,
      "speed": 70
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/625.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/625.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/625.ogg",
    "moves": [
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 404,
        "name": "x-scissor",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "626": {
    "id": 626,
    "number": 626,
    "name": "bouffalant",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 95,
      "attack": 110,
      "defense": 95,
      "specialAttack": 40,
      "specialDefense": 95,
      "speed": 55
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/626.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/626.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/626.ogg",
    "moves": [
      {
        "id": 34,
        "name": "body-slam",
        "type": "normal",
        "power": 85,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 224,
        "name": "megahorn",
        "type": "bug",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "628": {
    "id": 628,
    "number": 628,
    "name": "braviary",
    "types": [
      "normal",
      "flying"
    ],
    "stats": {
      "hp": 100,
      "attack": 123,
      "defense": 75,
      "specialAttack": 57,
      "specialDefense": 75,
      "speed": 80
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/628.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/628.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/628.ogg",
    "moves": [
      {
        "id": 34,
        "name": "body-slam",
        "type": "normal",
        "power": 85,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 17,
        "name": "wing-attack",
        "type": "flying",
        "power": 60,
        "accuracy": 100,
        "pp": 35,
        "damageClass": "physical"
      },
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "630": {
    "id": 630,
    "number": 630,
    "name": "mandibuzz",
    "types": [
      "dark",
      "flying"
    ],
    "stats": {
      "hp": 110,
      "attack": 65,
      "defense": 105,
      "specialAttack": 55,
      "specialDefense": 95,
      "speed": 80
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/630.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/630.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/630.ogg",
    "moves": [
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 403,
        "name": "air-slash",
        "type": "flying",
        "power": 75,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 257,
        "name": "heat-wave",
        "type": "fire",
        "power": 95,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "631": {
    "id": 631,
    "number": 631,
    "name": "heatmor",
    "types": [
      "fire"
    ],
    "stats": {
      "hp": 85,
      "attack": 97,
      "defense": 66,
      "specialAttack": 105,
      "specialDefense": 66,
      "speed": 65
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/631.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/631.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/631.ogg",
    "moves": [
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 202,
        "name": "giga-drain",
        "type": "grass",
        "power": 75,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "632": {
    "id": 632,
    "number": 632,
    "name": "durant",
    "types": [
      "bug",
      "steel"
    ],
    "stats": {
      "hp": 58,
      "attack": 109,
      "defense": 112,
      "specialAttack": 48,
      "specialDefense": 48,
      "speed": 109
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/632.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/632.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/632.ogg",
    "moves": [
      {
        "id": 404,
        "name": "x-scissor",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "635": {
    "id": 635,
    "number": 635,
    "name": "hydreigon",
    "types": [
      "dark",
      "dragon"
    ],
    "stats": {
      "hp": 92,
      "attack": 105,
      "defense": 90,
      "specialAttack": 125,
      "specialDefense": 90,
      "speed": 98
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/635.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/635.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/635.ogg",
    "moves": [
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 406,
        "name": "dragon-pulse",
        "type": "dragon",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 414,
        "name": "earth-power",
        "type": "ground",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "637": {
    "id": 637,
    "number": 637,
    "name": "volcarona",
    "types": [
      "bug",
      "fire"
    ],
    "stats": {
      "hp": 85,
      "attack": 60,
      "defense": 65,
      "specialAttack": 135,
      "specialDefense": 105,
      "speed": 100
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/637.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/637.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/637.ogg",
    "moves": [
      {
        "id": 405,
        "name": "bug-buzz",
        "type": "bug",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 202,
        "name": "giga-drain",
        "type": "grass",
        "power": 75,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "651": {
    "id": 651,
    "number": 651,
    "name": "quilladin",
    "types": [
      "grass"
    ],
    "stats": {
      "hp": 61,
      "attack": 78,
      "defense": 95,
      "specialAttack": 56,
      "specialDefense": 58,
      "speed": 57
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/651.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/651.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/651.ogg",
    "moves": [
      {
        "id": 402,
        "name": "seed-bomb",
        "type": "grass",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 398,
        "name": "poison-jab",
        "type": "poison",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "652": {
    "id": 652,
    "number": 652,
    "name": "chesnaught",
    "types": [
      "grass",
      "fighting"
    ],
    "stats": {
      "hp": 88,
      "attack": 107,
      "defense": 122,
      "specialAttack": 74,
      "specialDefense": 75,
      "speed": 64
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/652.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/652.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/652.ogg",
    "moves": [
      {
        "id": 402,
        "name": "seed-bomb",
        "type": "grass",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "654": {
    "id": 654,
    "number": 654,
    "name": "braixen",
    "types": [
      "fire"
    ],
    "stats": {
      "hp": 59,
      "attack": 59,
      "defense": 58,
      "specialAttack": 90,
      "specialDefense": 70,
      "speed": 73
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/654.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/654.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/654.ogg",
    "moves": [
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 351,
        "name": "shock-wave",
        "type": "electric",
        "power": 60,
        "accuracy": null,
        "pp": 20,
        "damageClass": "special"
      },
      {
        "id": 341,
        "name": "mud-shot",
        "type": "ground",
        "power": 55,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "655": {
    "id": 655,
    "number": 655,
    "name": "delphox",
    "types": [
      "fire",
      "psychic"
    ],
    "stats": {
      "hp": 75,
      "attack": 69,
      "defense": 72,
      "specialAttack": 114,
      "specialDefense": 100,
      "speed": 104
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/655.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/655.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/655.ogg",
    "moves": [
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 605,
        "name": "dazzling-gleam",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "657": {
    "id": 657,
    "number": 657,
    "name": "frogadier",
    "types": [
      "water"
    ],
    "stats": {
      "hp": 54,
      "attack": 63,
      "defense": 52,
      "specialAttack": 83,
      "specialDefense": 56,
      "speed": 97
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/657.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/657.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/657.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      }
    ]
  },
  "658": {
    "id": 658,
    "number": 658,
    "name": "greninja",
    "types": [
      "water",
      "dark"
    ],
    "stats": {
      "hp": 72,
      "attack": 95,
      "defense": 67,
      "specialAttack": 103,
      "specialDefense": 71,
      "speed": 122
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/658.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/658.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/658.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 482,
        "name": "sludge-wave",
        "type": "poison",
        "power": 95,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "660": {
    "id": 660,
    "number": 660,
    "name": "diggersby",
    "types": [
      "normal",
      "ground"
    ],
    "stats": {
      "hp": 85,
      "attack": 56,
      "defense": 77,
      "specialAttack": 50,
      "specialDefense": 77,
      "speed": 78
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/660.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/660.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/660.ogg",
    "moves": [
      {
        "id": 34,
        "name": "body-slam",
        "type": "normal",
        "power": 85,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "662": {
    "id": 662,
    "number": 662,
    "name": "fletchinder",
    "types": [
      "fire",
      "flying"
    ],
    "stats": {
      "hp": 62,
      "attack": 73,
      "defense": 55,
      "specialAttack": 56,
      "specialDefense": 52,
      "speed": 84
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/662.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/662.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/662.ogg",
    "moves": [
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 332,
        "name": "aerial-ace",
        "type": "flying",
        "power": 60,
        "accuracy": null,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 369,
        "name": "u-turn",
        "type": "bug",
        "power": 70,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 168,
        "name": "thief",
        "type": "dark",
        "power": 60,
        "accuracy": 100,
        "pp": 25,
        "damageClass": "physical"
      }
    ]
  },
  "663": {
    "id": 663,
    "number": 663,
    "name": "talonflame",
    "types": [
      "fire",
      "flying"
    ],
    "stats": {
      "hp": 78,
      "attack": 81,
      "defense": 71,
      "specialAttack": 74,
      "specialDefense": 69,
      "speed": 126
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/663.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/663.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/663.ogg",
    "moves": [
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 403,
        "name": "air-slash",
        "type": "flying",
        "power": 75,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 369,
        "name": "u-turn",
        "type": "bug",
        "power": 70,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 168,
        "name": "thief",
        "type": "dark",
        "power": 60,
        "accuracy": 100,
        "pp": 25,
        "damageClass": "physical"
      }
    ]
  },
  "666": {
    "id": 666,
    "number": 666,
    "name": "vivillon",
    "types": [
      "bug",
      "flying"
    ],
    "stats": {
      "hp": 80,
      "attack": 52,
      "defense": 50,
      "specialAttack": 90,
      "specialDefense": 50,
      "speed": 89
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/666.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/666.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/666.ogg",
    "moves": [
      {
        "id": 405,
        "name": "bug-buzz",
        "type": "bug",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 403,
        "name": "air-slash",
        "type": "flying",
        "power": 75,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "667": {
    "id": 667,
    "number": 667,
    "name": "litleo",
    "types": [
      "fire",
      "normal"
    ],
    "stats": {
      "hp": 62,
      "attack": 50,
      "defense": 58,
      "specialAttack": 73,
      "specialDefense": 54,
      "speed": 72
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/667.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/667.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/667.ogg",
    "moves": [
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 304,
        "name": "hyper-voice",
        "type": "normal",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 706,
        "name": "psychic-fangs",
        "type": "psychic",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "668": {
    "id": 668,
    "number": 668,
    "name": "pyroar-male",
    "types": [
      "fire",
      "normal"
    ],
    "stats": {
      "hp": 86,
      "attack": 68,
      "defense": 72,
      "specialAttack": 109,
      "specialDefense": 66,
      "speed": 106
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/668.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/668.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/668.ogg",
    "moves": [
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 304,
        "name": "hyper-voice",
        "type": "normal",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 815,
        "name": "scorching-sands",
        "type": "ground",
        "power": 70,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "670": {
    "id": 670,
    "number": 670,
    "name": "floette",
    "types": [
      "fairy"
    ],
    "stats": {
      "hp": 54,
      "attack": 45,
      "defense": 47,
      "specialAttack": 75,
      "specialDefense": 98,
      "speed": 52
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/670.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/670.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/670.ogg",
    "moves": [
      {
        "id": 585,
        "name": "moonblast",
        "type": "fairy",
        "power": 95,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 676,
        "name": "pollen-puff",
        "type": "bug",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "671": {
    "id": 671,
    "number": 671,
    "name": "florges",
    "types": [
      "fairy"
    ],
    "stats": {
      "hp": 78,
      "attack": 65,
      "defense": 68,
      "specialAttack": 112,
      "specialDefense": 154,
      "speed": 75
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/671.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/671.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/671.ogg",
    "moves": [
      {
        "id": 585,
        "name": "moonblast",
        "type": "fairy",
        "power": 95,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 676,
        "name": "pollen-puff",
        "type": "bug",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "672": {
    "id": 672,
    "number": 672,
    "name": "skiddo",
    "types": [
      "grass"
    ],
    "stats": {
      "hp": 66,
      "attack": 65,
      "defense": 48,
      "specialAttack": 62,
      "specialDefense": 57,
      "speed": 52
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/672.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/672.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/672.ogg",
    "moves": [
      {
        "id": 348,
        "name": "leaf-blade",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 428,
        "name": "zen-headbutt",
        "type": "psychic",
        "power": 80,
        "accuracy": 90,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "673": {
    "id": 673,
    "number": 673,
    "name": "gogoat",
    "types": [
      "grass"
    ],
    "stats": {
      "hp": 123,
      "attack": 100,
      "defense": 62,
      "specialAttack": 97,
      "specialDefense": 81,
      "speed": 68
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/673.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/673.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/673.ogg",
    "moves": [
      {
        "id": 348,
        "name": "leaf-blade",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "674": {
    "id": 674,
    "number": 674,
    "name": "pancham",
    "types": [
      "fighting"
    ],
    "stats": {
      "hp": 67,
      "attack": 82,
      "defense": 62,
      "specialAttack": 46,
      "specialDefense": 48,
      "speed": 43
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/674.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/674.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/674.ogg",
    "moves": [
      {
        "id": 327,
        "name": "sky-uppercut",
        "type": "fighting",
        "power": 85,
        "accuracy": 90,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "675": {
    "id": 675,
    "number": 675,
    "name": "pangoro",
    "types": [
      "fighting",
      "dark"
    ],
    "stats": {
      "hp": 95,
      "attack": 124,
      "defense": 78,
      "specialAttack": 69,
      "specialDefense": 71,
      "speed": 58
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/675.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/675.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/675.ogg",
    "moves": [
      {
        "id": 327,
        "name": "sky-uppercut",
        "type": "fighting",
        "power": 85,
        "accuracy": 90,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 663,
        "name": "darkest-lariat",
        "type": "dark",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      }
    ]
  },
  "676": {
    "id": 676,
    "number": 676,
    "name": "furfrou",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 75,
      "attack": 80,
      "defense": 60,
      "specialAttack": 65,
      "specialDefense": 90,
      "speed": 102
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/676.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/676.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/676.ogg",
    "moves": [
      {
        "id": 304,
        "name": "hyper-voice",
        "type": "normal",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 706,
        "name": "psychic-fangs",
        "type": "psychic",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "677": {
    "id": 677,
    "number": 677,
    "name": "espurr",
    "types": [
      "psychic"
    ],
    "stats": {
      "hp": 62,
      "attack": 48,
      "defense": 54,
      "specialAttack": 63,
      "specialDefense": 60,
      "speed": 68
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/677.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/677.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/677.ogg",
    "moves": [
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "678": {
    "id": 678,
    "number": 678,
    "name": "meowstic-male",
    "types": [
      "psychic"
    ],
    "stats": {
      "hp": 74,
      "attack": 48,
      "defense": 76,
      "specialAttack": 83,
      "specialDefense": 81,
      "speed": 104
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/678.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/678.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/678.ogg",
    "moves": [
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "679": {
    "id": 679,
    "number": 679,
    "name": "honedge",
    "types": [
      "steel",
      "ghost"
    ],
    "stats": {
      "hp": 45,
      "attack": 80,
      "defense": 100,
      "specialAttack": 35,
      "specialDefense": 37,
      "speed": 28
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/679.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/679.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/679.ogg",
    "moves": [
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 533,
        "name": "sacred-sword",
        "type": "fighting",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 400,
        "name": "night-slash",
        "type": "dark",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "680": {
    "id": 680,
    "number": 680,
    "name": "doublade",
    "types": [
      "steel",
      "ghost"
    ],
    "stats": {
      "hp": 59,
      "attack": 110,
      "defense": 150,
      "specialAttack": 45,
      "specialDefense": 49,
      "speed": 35
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/680.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/680.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/680.ogg",
    "moves": [
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 533,
        "name": "sacred-sword",
        "type": "fighting",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 400,
        "name": "night-slash",
        "type": "dark",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "681": {
    "id": 681,
    "number": 681,
    "name": "aegislash-shield",
    "types": [
      "steel",
      "ghost"
    ],
    "stats": {
      "hp": 60,
      "attack": 50,
      "defense": 140,
      "specialAttack": 50,
      "specialDefense": 140,
      "speed": 60
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/681.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/681.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/681.ogg",
    "moves": [
      {
        "id": 430,
        "name": "flash-cannon",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 533,
        "name": "sacred-sword",
        "type": "fighting",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 400,
        "name": "night-slash",
        "type": "dark",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "682": {
    "id": 682,
    "number": 682,
    "name": "spritzee",
    "types": [
      "fairy"
    ],
    "stats": {
      "hp": 78,
      "attack": 52,
      "defense": 60,
      "specialAttack": 63,
      "specialDefense": 65,
      "speed": 23
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/682.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/682.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/682.ogg",
    "moves": [
      {
        "id": 585,
        "name": "moonblast",
        "type": "fairy",
        "power": 95,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "683": {
    "id": 683,
    "number": 683,
    "name": "aromatisse",
    "types": [
      "fairy"
    ],
    "stats": {
      "hp": 101,
      "attack": 72,
      "defense": 72,
      "specialAttack": 99,
      "specialDefense": 89,
      "speed": 29
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/683.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/683.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/683.ogg",
    "moves": [
      {
        "id": 585,
        "name": "moonblast",
        "type": "fairy",
        "power": 95,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "684": {
    "id": 684,
    "number": 684,
    "name": "swirlix",
    "types": [
      "fairy"
    ],
    "stats": {
      "hp": 62,
      "attack": 48,
      "defense": 66,
      "specialAttack": 59,
      "specialDefense": 57,
      "speed": 49
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/684.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/684.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/684.ogg",
    "moves": [
      {
        "id": 605,
        "name": "dazzling-gleam",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "685": {
    "id": 685,
    "number": 685,
    "name": "slurpuff",
    "types": [
      "fairy"
    ],
    "stats": {
      "hp": 82,
      "attack": 80,
      "defense": 86,
      "specialAttack": 85,
      "specialDefense": 75,
      "speed": 72
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/685.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/685.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/685.ogg",
    "moves": [
      {
        "id": 605,
        "name": "dazzling-gleam",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "687": {
    "id": 687,
    "number": 687,
    "name": "malamar",
    "types": [
      "dark",
      "psychic"
    ],
    "stats": {
      "hp": 86,
      "attack": 92,
      "defense": 88,
      "specialAttack": 68,
      "specialDefense": 75,
      "speed": 73
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/687.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/687.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/687.ogg",
    "moves": [
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 679,
        "name": "lunge",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "689": {
    "id": 689,
    "number": 689,
    "name": "barbaracle",
    "types": [
      "rock",
      "water"
    ],
    "stats": {
      "hp": 72,
      "attack": 105,
      "defense": 115,
      "specialAttack": 54,
      "specialDefense": 86,
      "speed": 68
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/689.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/689.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/689.ogg",
    "moves": [
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 337,
        "name": "dragon-claw",
        "type": "dragon",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "690": {
    "id": 690,
    "number": 690,
    "name": "skrelp",
    "types": [
      "poison",
      "water"
    ],
    "stats": {
      "hp": 50,
      "attack": 60,
      "defense": 60,
      "specialAttack": 60,
      "specialDefense": 60,
      "speed": 30
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/690.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/690.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/690.ogg",
    "moves": [
      {
        "id": 482,
        "name": "sludge-wave",
        "type": "poison",
        "power": 95,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "691": {
    "id": 691,
    "number": 691,
    "name": "dragalge",
    "types": [
      "poison",
      "dragon"
    ],
    "stats": {
      "hp": 65,
      "attack": 75,
      "defense": 90,
      "specialAttack": 97,
      "specialDefense": 123,
      "speed": 44
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/691.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/691.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/691.ogg",
    "moves": [
      {
        "id": 482,
        "name": "sludge-wave",
        "type": "poison",
        "power": 95,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 406,
        "name": "dragon-pulse",
        "type": "dragon",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "692": {
    "id": 692,
    "number": 692,
    "name": "clauncher",
    "types": [
      "water"
    ],
    "stats": {
      "hp": 50,
      "attack": 53,
      "defense": 62,
      "specialAttack": 58,
      "specialDefense": 63,
      "speed": 44
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/692.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/692.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/692.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 482,
        "name": "sludge-wave",
        "type": "poison",
        "power": 95,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "695": {
    "id": 695,
    "number": 695,
    "name": "heliolisk",
    "types": [
      "electric",
      "normal"
    ],
    "stats": {
      "hp": 62,
      "attack": 55,
      "defense": 52,
      "specialAttack": 109,
      "specialDefense": 94,
      "speed": 109
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/695.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/695.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/695.ogg",
    "moves": [
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 304,
        "name": "hyper-voice",
        "type": "normal",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "696": {
    "id": 696,
    "number": 696,
    "name": "tyrunt",
    "types": [
      "rock",
      "dragon"
    ],
    "stats": {
      "hp": 58,
      "attack": 89,
      "defense": 77,
      "specialAttack": 45,
      "specialDefense": 45,
      "speed": 48
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/696.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/696.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/696.ogg",
    "moves": [
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 337,
        "name": "dragon-claw",
        "type": "dragon",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "697": {
    "id": 697,
    "number": 697,
    "name": "tyrantrum",
    "types": [
      "rock",
      "dragon"
    ],
    "stats": {
      "hp": 82,
      "attack": 121,
      "defense": 119,
      "specialAttack": 69,
      "specialDefense": 59,
      "speed": 71
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/697.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/697.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/697.ogg",
    "moves": [
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 337,
        "name": "dragon-claw",
        "type": "dragon",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "698": {
    "id": 698,
    "number": 698,
    "name": "amaura",
    "types": [
      "rock",
      "ice"
    ],
    "stats": {
      "hp": 77,
      "attack": 59,
      "defense": 50,
      "specialAttack": 67,
      "specialDefense": 63,
      "speed": 46
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/698.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/698.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/698.ogg",
    "moves": [
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 414,
        "name": "earth-power",
        "type": "ground",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "699": {
    "id": 699,
    "number": 699,
    "name": "aurorus",
    "types": [
      "rock",
      "ice"
    ],
    "stats": {
      "hp": 123,
      "attack": 77,
      "defense": 72,
      "specialAttack": 99,
      "specialDefense": 92,
      "speed": 58
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/699.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/699.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/699.ogg",
    "moves": [
      {
        "id": 246,
        "name": "ancient-power",
        "type": "rock",
        "power": 60,
        "accuracy": 100,
        "pp": 5,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 414,
        "name": "earth-power",
        "type": "ground",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "700": {
    "id": 700,
    "number": 700,
    "name": "sylveon",
    "types": [
      "fairy"
    ],
    "stats": {
      "hp": 95,
      "attack": 65,
      "defense": 65,
      "specialAttack": 110,
      "specialDefense": 130,
      "speed": 60
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/700.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/700.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/700.ogg",
    "moves": [
      {
        "id": 585,
        "name": "moonblast",
        "type": "fairy",
        "power": 95,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 595,
        "name": "mystical-fire",
        "type": "fire",
        "power": 75,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "701": {
    "id": 701,
    "number": 701,
    "name": "hawlucha",
    "types": [
      "fighting",
      "flying"
    ],
    "stats": {
      "hp": 78,
      "attack": 92,
      "defense": 75,
      "specialAttack": 74,
      "specialDefense": 63,
      "speed": 118
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/701.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/701.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/701.ogg",
    "moves": [
      {
        "id": 560,
        "name": "flying-press",
        "type": "fighting",
        "power": 100,
        "accuracy": 95,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 17,
        "name": "wing-attack",
        "type": "flying",
        "power": 60,
        "accuracy": 100,
        "pp": 35,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 404,
        "name": "x-scissor",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "702": {
    "id": 702,
    "number": 702,
    "name": "dedenne",
    "types": [
      "electric",
      "fairy"
    ],
    "stats": {
      "hp": 67,
      "attack": 58,
      "defense": 57,
      "specialAttack": 81,
      "specialDefense": 67,
      "speed": 101
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/702.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/702.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/702.ogg",
    "moves": [
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 605,
        "name": "dazzling-gleam",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 324,
        "name": "signal-beam",
        "type": "bug",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 402,
        "name": "seed-bomb",
        "type": "grass",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "703": {
    "id": 703,
    "number": 703,
    "name": "carbink",
    "types": [
      "rock",
      "fairy"
    ],
    "stats": {
      "hp": 50,
      "attack": 50,
      "defense": 150,
      "specialAttack": 50,
      "specialDefense": 150,
      "speed": 50
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/703.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/703.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/703.ogg",
    "moves": [
      {
        "id": 408,
        "name": "power-gem",
        "type": "rock",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "special"
      },
      {
        "id": 585,
        "name": "moonblast",
        "type": "fairy",
        "power": 95,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 776,
        "name": "body-press",
        "type": "fighting",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 414,
        "name": "earth-power",
        "type": "ground",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "705": {
    "id": 705,
    "number": 705,
    "name": "sliggoo",
    "types": [
      "dragon"
    ],
    "stats": {
      "hp": 68,
      "attack": 75,
      "defense": 53,
      "specialAttack": 83,
      "specialDefense": 113,
      "speed": 60
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/705.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/705.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/705.ogg",
    "moves": [
      {
        "id": 406,
        "name": "dragon-pulse",
        "type": "dragon",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 482,
        "name": "sludge-wave",
        "type": "poison",
        "power": 95,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "706": {
    "id": 706,
    "number": 706,
    "name": "goodra",
    "types": [
      "dragon"
    ],
    "stats": {
      "hp": 90,
      "attack": 100,
      "defense": 70,
      "specialAttack": 110,
      "specialDefense": 150,
      "speed": 80
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/706.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/706.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/706.ogg",
    "moves": [
      {
        "id": 406,
        "name": "dragon-pulse",
        "type": "dragon",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 482,
        "name": "sludge-wave",
        "type": "poison",
        "power": 95,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "707": {
    "id": 707,
    "number": 707,
    "name": "klefki",
    "types": [
      "steel",
      "fairy"
    ],
    "stats": {
      "hp": 57,
      "attack": 80,
      "defense": 91,
      "specialAttack": 80,
      "specialDefense": 87,
      "speed": 75
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/707.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/707.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/707.ogg",
    "moves": [
      {
        "id": 430,
        "name": "flash-cannon",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 168,
        "name": "thief",
        "type": "dark",
        "power": 60,
        "accuracy": 100,
        "pp": 25,
        "damageClass": "physical"
      }
    ]
  },
  "709": {
    "id": 709,
    "number": 709,
    "name": "trevenant",
    "types": [
      "ghost",
      "grass"
    ],
    "stats": {
      "hp": 85,
      "attack": 110,
      "defense": 76,
      "specialAttack": 65,
      "specialDefense": 82,
      "speed": 56
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/709.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/709.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/709.ogg",
    "moves": [
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 402,
        "name": "seed-bomb",
        "type": "grass",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 404,
        "name": "x-scissor",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "710": {
    "id": 710,
    "number": 710,
    "name": "pumpkaboo-average",
    "types": [
      "ghost",
      "grass"
    ],
    "stats": {
      "hp": 49,
      "attack": 66,
      "defense": 70,
      "specialAttack": 44,
      "specialDefense": 55,
      "speed": 51
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/710.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/710.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/710.ogg",
    "moves": [
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 402,
        "name": "seed-bomb",
        "type": "grass",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "711": {
    "id": 711,
    "number": 711,
    "name": "gourgeist-average",
    "types": [
      "ghost",
      "grass"
    ],
    "stats": {
      "hp": 65,
      "attack": 90,
      "defense": 122,
      "specialAttack": 58,
      "specialDefense": 75,
      "speed": 84
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/711.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/711.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/711.ogg",
    "moves": [
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 438,
        "name": "power-whip",
        "type": "grass",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 585,
        "name": "moonblast",
        "type": "fairy",
        "power": 95,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 168,
        "name": "thief",
        "type": "dark",
        "power": 60,
        "accuracy": 100,
        "pp": 25,
        "damageClass": "physical"
      }
    ]
  },
  "713": {
    "id": 713,
    "number": 713,
    "name": "avalugg",
    "types": [
      "ice"
    ],
    "stats": {
      "hp": 95,
      "attack": 117,
      "defense": 184,
      "specialAttack": 44,
      "specialDefense": 46,
      "speed": 28
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/713.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/713.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/713.ogg",
    "moves": [
      {
        "id": 861,
        "name": "ice-spinner",
        "type": "ice",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 776,
        "name": "body-press",
        "type": "fighting",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "715": {
    "id": 715,
    "number": 715,
    "name": "noivern",
    "types": [
      "flying",
      "dragon"
    ],
    "stats": {
      "hp": 85,
      "attack": 70,
      "defense": 80,
      "specialAttack": 97,
      "specialDefense": 80,
      "speed": 123
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/715.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/715.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/715.ogg",
    "moves": [
      {
        "id": 403,
        "name": "air-slash",
        "type": "flying",
        "power": 75,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 406,
        "name": "dragon-pulse",
        "type": "dragon",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 586,
        "name": "boomburst",
        "type": "normal",
        "power": 140,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "723": {
    "id": 723,
    "number": 723,
    "name": "dartrix",
    "types": [
      "grass",
      "flying"
    ],
    "stats": {
      "hp": 78,
      "attack": 75,
      "defense": 75,
      "specialAttack": 70,
      "specialDefense": 70,
      "speed": 52
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/723.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/723.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/723.ogg",
    "moves": [
      {
        "id": 348,
        "name": "leaf-blade",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 403,
        "name": "air-slash",
        "type": "flying",
        "power": 75,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 282,
        "name": "knock-off",
        "type": "dark",
        "power": 65,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "724": {
    "id": 724,
    "number": 724,
    "name": "decidueye",
    "types": [
      "grass",
      "ghost"
    ],
    "stats": {
      "hp": 78,
      "attack": 107,
      "defense": 75,
      "specialAttack": 100,
      "specialDefense": 100,
      "speed": 70
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/724.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/724.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/724.ogg",
    "moves": [
      {
        "id": 348,
        "name": "leaf-blade",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 662,
        "name": "spirit-shackle",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 282,
        "name": "knock-off",
        "type": "dark",
        "power": 65,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 396,
        "name": "aura-sphere",
        "type": "fighting",
        "power": 80,
        "accuracy": null,
        "pp": 20,
        "damageClass": "special"
      }
    ]
  },
  "726": {
    "id": 726,
    "number": 726,
    "name": "torracat",
    "types": [
      "fire"
    ],
    "stats": {
      "hp": 65,
      "attack": 85,
      "defense": 50,
      "specialAttack": 80,
      "specialDefense": 50,
      "speed": 90
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/726.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/726.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/726.ogg",
    "moves": [
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 141,
        "name": "leech-life",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "727": {
    "id": 727,
    "number": 727,
    "name": "incineroar",
    "types": [
      "fire",
      "dark"
    ],
    "stats": {
      "hp": 95,
      "attack": 115,
      "defense": 90,
      "specialAttack": 80,
      "specialDefense": 90,
      "speed": 60
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/727.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/727.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/727.ogg",
    "moves": [
      {
        "id": 299,
        "name": "blaze-kick",
        "type": "fire",
        "power": 85,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 663,
        "name": "darkest-lariat",
        "type": "dark",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 141,
        "name": "leech-life",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "729": {
    "id": 729,
    "number": 729,
    "name": "brionne",
    "types": [
      "water"
    ],
    "stats": {
      "hp": 60,
      "attack": 69,
      "defense": 69,
      "specialAttack": 91,
      "specialDefense": 81,
      "speed": 50
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/729.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/729.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/729.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 585,
        "name": "moonblast",
        "type": "fairy",
        "power": 95,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 304,
        "name": "hyper-voice",
        "type": "normal",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "730": {
    "id": 730,
    "number": 730,
    "name": "primarina",
    "types": [
      "water",
      "fairy"
    ],
    "stats": {
      "hp": 80,
      "attack": 74,
      "defense": 74,
      "specialAttack": 126,
      "specialDefense": 116,
      "speed": 60
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/730.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/730.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/730.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 585,
        "name": "moonblast",
        "type": "fairy",
        "power": 95,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "733": {
    "id": 733,
    "number": 733,
    "name": "toucannon",
    "types": [
      "normal",
      "flying"
    ],
    "stats": {
      "hp": 80,
      "attack": 120,
      "defense": 75,
      "specialAttack": 75,
      "specialDefense": 75,
      "speed": 60
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/733.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/733.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/733.ogg",
    "moves": [
      {
        "id": 586,
        "name": "boomburst",
        "type": "normal",
        "power": 140,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 690,
        "name": "beak-blast",
        "type": "flying",
        "power": 100,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      }
    ]
  },
  "734": {
    "id": 734,
    "number": 734,
    "name": "yungoos",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 48,
      "attack": 70,
      "defense": 30,
      "specialAttack": 30,
      "specialDefense": 30,
      "speed": 45
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/734.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/734.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/734.ogg",
    "moves": [
      {
        "id": 158,
        "name": "hyper-fang",
        "type": "normal",
        "power": 80,
        "accuracy": 90,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 706,
        "name": "psychic-fangs",
        "type": "psychic",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "735": {
    "id": 735,
    "number": 735,
    "name": "gumshoos",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 88,
      "attack": 110,
      "defense": 60,
      "specialAttack": 55,
      "specialDefense": 60,
      "speed": 45
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/735.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/735.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/735.ogg",
    "moves": [
      {
        "id": 34,
        "name": "body-slam",
        "type": "normal",
        "power": 85,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 706,
        "name": "psychic-fangs",
        "type": "psychic",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "737": {
    "id": 737,
    "number": 737,
    "name": "charjabug",
    "types": [
      "bug",
      "electric"
    ],
    "stats": {
      "hp": 57,
      "attack": 82,
      "defense": 95,
      "specialAttack": 55,
      "specialDefense": 75,
      "speed": 36
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/737.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/737.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/737.ogg",
    "moves": [
      {
        "id": 404,
        "name": "x-scissor",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 398,
        "name": "poison-jab",
        "type": "poison",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "738": {
    "id": 738,
    "number": 738,
    "name": "vikavolt",
    "types": [
      "bug",
      "electric"
    ],
    "stats": {
      "hp": 77,
      "attack": 70,
      "defense": 90,
      "specialAttack": 145,
      "specialDefense": 75,
      "speed": 43
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/738.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/738.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/738.ogg",
    "moves": [
      {
        "id": 405,
        "name": "bug-buzz",
        "type": "bug",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 430,
        "name": "flash-cannon",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "739": {
    "id": 739,
    "number": 739,
    "name": "crabrawler",
    "types": [
      "fighting"
    ],
    "stats": {
      "hp": 47,
      "attack": 82,
      "defense": 57,
      "specialAttack": 42,
      "specialDefense": 47,
      "speed": 63
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/739.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/739.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/739.ogg",
    "moves": [
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 152,
        "name": "crabhammer",
        "type": "water",
        "power": 100,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      }
    ]
  },
  "740": {
    "id": 740,
    "number": 740,
    "name": "crabominable",
    "types": [
      "fighting",
      "ice"
    ],
    "stats": {
      "hp": 97,
      "attack": 132,
      "defense": 77,
      "specialAttack": 62,
      "specialDefense": 67,
      "speed": 43
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/740.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/740.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/740.ogg",
    "moves": [
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 861,
        "name": "ice-spinner",
        "type": "ice",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 152,
        "name": "crabhammer",
        "type": "water",
        "power": 100,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "741": {
    "id": 741,
    "number": 741,
    "name": "oricorio-baile",
    "types": [
      "fire",
      "flying"
    ],
    "stats": {
      "hp": 75,
      "attack": 70,
      "defense": 70,
      "specialAttack": 98,
      "specialDefense": 70,
      "speed": 93
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/741.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/741.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/741.ogg",
    "moves": [
      {
        "id": 403,
        "name": "air-slash",
        "type": "flying",
        "power": 75,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 914,
        "name": "alluring-voice",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 196,
        "name": "icy-wind",
        "type": "ice",
        "power": 55,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 369,
        "name": "u-turn",
        "type": "bug",
        "power": 70,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "743": {
    "id": 743,
    "number": 743,
    "name": "ribombee",
    "types": [
      "bug",
      "fairy"
    ],
    "stats": {
      "hp": 60,
      "attack": 55,
      "defense": 60,
      "specialAttack": 95,
      "specialDefense": 70,
      "speed": 124
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/743.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/743.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/743.ogg",
    "moves": [
      {
        "id": 405,
        "name": "bug-buzz",
        "type": "bug",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 585,
        "name": "moonblast",
        "type": "fairy",
        "power": 95,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "744": {
    "id": 744,
    "number": 744,
    "name": "rockruff",
    "types": [
      "rock"
    ],
    "stats": {
      "hp": 45,
      "attack": 65,
      "defense": 40,
      "specialAttack": 30,
      "specialDefense": 40,
      "speed": 60
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/744.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/744.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/744.ogg",
    "moves": [
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 706,
        "name": "psychic-fangs",
        "type": "psychic",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "745": {
    "id": 745,
    "number": 745,
    "name": "lycanroc-midday",
    "types": [
      "rock"
    ],
    "stats": {
      "hp": 75,
      "attack": 115,
      "defense": 65,
      "specialAttack": 55,
      "specialDefense": 65,
      "speed": 112
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/745.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/745.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/745.ogg",
    "moves": [
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 706,
        "name": "psychic-fangs",
        "type": "psychic",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "746": {
    "id": 746,
    "number": 746,
    "name": "wishiwashi-solo",
    "types": [
      "water"
    ],
    "stats": {
      "hp": 45,
      "attack": 20,
      "defense": 20,
      "specialAttack": 25,
      "specialDefense": 25,
      "speed": 40
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/746.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/746.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/746.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 369,
        "name": "u-turn",
        "type": "bug",
        "power": 70,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "747": {
    "id": 747,
    "number": 747,
    "name": "mareanie",
    "types": [
      "poison",
      "water"
    ],
    "stats": {
      "hp": 50,
      "attack": 53,
      "defense": 62,
      "specialAttack": 43,
      "specialDefense": 52,
      "speed": 45
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/747.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/747.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/747.ogg",
    "moves": [
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 679,
        "name": "lunge",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "748": {
    "id": 748,
    "number": 748,
    "name": "toxapex",
    "types": [
      "poison",
      "water"
    ],
    "stats": {
      "hp": 50,
      "attack": 63,
      "defense": 152,
      "specialAttack": 53,
      "specialDefense": 142,
      "speed": 35
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/748.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/748.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/748.ogg",
    "moves": [
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 679,
        "name": "lunge",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "749": {
    "id": 749,
    "number": 749,
    "name": "mudbray",
    "types": [
      "ground"
    ],
    "stats": {
      "hp": 70,
      "attack": 100,
      "defense": 70,
      "specialAttack": 45,
      "specialDefense": 55,
      "speed": 45
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/749.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/749.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/749.ogg",
    "moves": [
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 490,
        "name": "low-sweep",
        "type": "fighting",
        "power": 65,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "750": {
    "id": 750,
    "number": 750,
    "name": "mudsdale",
    "types": [
      "ground"
    ],
    "stats": {
      "hp": 100,
      "attack": 125,
      "defense": 100,
      "specialAttack": 55,
      "specialDefense": 85,
      "speed": 35
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/750.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/750.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/750.ogg",
    "moves": [
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 490,
        "name": "low-sweep",
        "type": "fighting",
        "power": 65,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "751": {
    "id": 751,
    "number": 751,
    "name": "dewpider",
    "types": [
      "water",
      "bug"
    ],
    "stats": {
      "hp": 38,
      "attack": 40,
      "defense": 52,
      "specialAttack": 40,
      "specialDefense": 72,
      "speed": 27
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/751.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/751.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/751.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 405,
        "name": "bug-buzz",
        "type": "bug",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "752": {
    "id": 752,
    "number": 752,
    "name": "araquanid",
    "types": [
      "water",
      "bug"
    ],
    "stats": {
      "hp": 68,
      "attack": 70,
      "defense": 92,
      "specialAttack": 50,
      "specialDefense": 132,
      "speed": 42
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/752.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/752.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/752.ogg",
    "moves": [
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 141,
        "name": "leech-life",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "753": {
    "id": 753,
    "number": 753,
    "name": "fomantis",
    "types": [
      "grass"
    ],
    "stats": {
      "hp": 40,
      "attack": 55,
      "defense": 35,
      "specialAttack": 50,
      "specialDefense": 35,
      "speed": 35
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/753.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/753.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/753.ogg",
    "moves": [
      {
        "id": 348,
        "name": "leaf-blade",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 141,
        "name": "leech-life",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 398,
        "name": "poison-jab",
        "type": "poison",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 163,
        "name": "slash",
        "type": "normal",
        "power": 70,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "754": {
    "id": 754,
    "number": 754,
    "name": "lurantis",
    "types": [
      "grass"
    ],
    "stats": {
      "hp": 70,
      "attack": 105,
      "defense": 90,
      "specialAttack": 80,
      "specialDefense": 90,
      "speed": 45
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/754.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/754.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/754.ogg",
    "moves": [
      {
        "id": 348,
        "name": "leaf-blade",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 141,
        "name": "leech-life",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 400,
        "name": "night-slash",
        "type": "dark",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 398,
        "name": "poison-jab",
        "type": "poison",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "756": {
    "id": 756,
    "number": 756,
    "name": "shiinotic",
    "types": [
      "grass",
      "fairy"
    ],
    "stats": {
      "hp": 60,
      "attack": 45,
      "defense": 80,
      "specialAttack": 90,
      "specialDefense": 100,
      "speed": 30
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/756.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/756.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/756.ogg",
    "moves": [
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 585,
        "name": "moonblast",
        "type": "fairy",
        "power": 95,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 676,
        "name": "pollen-puff",
        "type": "bug",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 188,
        "name": "sludge-bomb",
        "type": "poison",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "757": {
    "id": 757,
    "number": 757,
    "name": "salandit",
    "types": [
      "poison",
      "fire"
    ],
    "stats": {
      "hp": 48,
      "attack": 44,
      "defense": 40,
      "specialAttack": 71,
      "specialDefense": 40,
      "speed": 77
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/757.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/757.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/757.ogg",
    "moves": [
      {
        "id": 482,
        "name": "sludge-wave",
        "type": "poison",
        "power": 95,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 406,
        "name": "dragon-pulse",
        "type": "dragon",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 141,
        "name": "leech-life",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "758": {
    "id": 758,
    "number": 758,
    "name": "salazzle",
    "types": [
      "poison",
      "fire"
    ],
    "stats": {
      "hp": 68,
      "attack": 64,
      "defense": 60,
      "specialAttack": 111,
      "specialDefense": 60,
      "speed": 117
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/758.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/758.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/758.ogg",
    "moves": [
      {
        "id": 482,
        "name": "sludge-wave",
        "type": "poison",
        "power": 95,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 406,
        "name": "dragon-pulse",
        "type": "dragon",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 304,
        "name": "hyper-voice",
        "type": "normal",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "759": {
    "id": 759,
    "number": 759,
    "name": "stufful",
    "types": [
      "normal",
      "fighting"
    ],
    "stats": {
      "hp": 70,
      "attack": 75,
      "defense": 50,
      "specialAttack": 45,
      "specialDefense": 50,
      "speed": 50
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/759.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/759.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/759.ogg",
    "moves": [
      {
        "id": 25,
        "name": "mega-kick",
        "type": "normal",
        "power": 120,
        "accuracy": 75,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "760": {
    "id": 760,
    "number": 760,
    "name": "bewear",
    "types": [
      "normal",
      "fighting"
    ],
    "stats": {
      "hp": 120,
      "attack": 125,
      "defense": 80,
      "specialAttack": 55,
      "specialDefense": 60,
      "speed": 60
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/760.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/760.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/760.ogg",
    "moves": [
      {
        "id": 34,
        "name": "body-slam",
        "type": "normal",
        "power": 85,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 663,
        "name": "darkest-lariat",
        "type": "dark",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "762": {
    "id": 762,
    "number": 762,
    "name": "steenee",
    "types": [
      "grass"
    ],
    "stats": {
      "hp": 52,
      "attack": 40,
      "defense": 48,
      "specialAttack": 40,
      "specialDefense": 48,
      "speed": 62
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/762.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/762.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/762.ogg",
    "moves": [
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 282,
        "name": "knock-off",
        "type": "dark",
        "power": 65,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 428,
        "name": "zen-headbutt",
        "type": "psychic",
        "power": 80,
        "accuracy": 90,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "763": {
    "id": 763,
    "number": 763,
    "name": "tsareena",
    "types": [
      "grass"
    ],
    "stats": {
      "hp": 72,
      "attack": 120,
      "defense": 98,
      "specialAttack": 50,
      "specialDefense": 98,
      "speed": 72
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/763.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/763.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/763.ogg",
    "moves": [
      {
        "id": 438,
        "name": "power-whip",
        "type": "grass",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 282,
        "name": "knock-off",
        "type": "dark",
        "power": 65,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 428,
        "name": "zen-headbutt",
        "type": "psychic",
        "power": 80,
        "accuracy": 90,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "764": {
    "id": 764,
    "number": 764,
    "name": "comfey",
    "types": [
      "fairy"
    ],
    "stats": {
      "hp": 51,
      "attack": 52,
      "defense": 90,
      "specialAttack": 82,
      "specialDefense": 110,
      "speed": 100
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/764.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/764.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/764.ogg",
    "moves": [
      {
        "id": 605,
        "name": "dazzling-gleam",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 676,
        "name": "pollen-puff",
        "type": "bug",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 282,
        "name": "knock-off",
        "type": "dark",
        "power": 65,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "765": {
    "id": 765,
    "number": 765,
    "name": "oranguru",
    "types": [
      "normal",
      "psychic"
    ],
    "stats": {
      "hp": 90,
      "attack": 60,
      "defense": 80,
      "specialAttack": 90,
      "specialDefense": 110,
      "speed": 60
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/765.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/765.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/765.ogg",
    "moves": [
      {
        "id": 304,
        "name": "hyper-voice",
        "type": "normal",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "766": {
    "id": 766,
    "number": 766,
    "name": "passimian",
    "types": [
      "fighting"
    ],
    "stats": {
      "hp": 100,
      "attack": 120,
      "defense": 90,
      "specialAttack": 40,
      "specialDefense": 60,
      "speed": 80
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/766.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/766.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/766.ogg",
    "moves": [
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 402,
        "name": "seed-bomb",
        "type": "grass",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "768": {
    "id": 768,
    "number": 768,
    "name": "golisopod",
    "types": [
      "bug",
      "water"
    ],
    "stats": {
      "hp": 75,
      "attack": 125,
      "defense": 140,
      "specialAttack": 60,
      "specialDefense": 90,
      "speed": 40
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/768.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/768.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/768.ogg",
    "moves": [
      {
        "id": 141,
        "name": "leech-life",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "769": {
    "id": 769,
    "number": 769,
    "name": "sandygast",
    "types": [
      "ghost",
      "ground"
    ],
    "stats": {
      "hp": 55,
      "attack": 55,
      "defense": 80,
      "specialAttack": 70,
      "specialDefense": 45,
      "speed": 15
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/769.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/769.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/769.ogg",
    "moves": [
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 414,
        "name": "earth-power",
        "type": "ground",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "770": {
    "id": 770,
    "number": 770,
    "name": "palossand",
    "types": [
      "ghost",
      "ground"
    ],
    "stats": {
      "hp": 85,
      "attack": 75,
      "defense": 110,
      "specialAttack": 100,
      "specialDefense": 75,
      "speed": 35
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/770.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/770.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/770.ogg",
    "moves": [
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 414,
        "name": "earth-power",
        "type": "ground",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "774": {
    "id": 774,
    "number": 774,
    "name": "minior-red-meteor",
    "types": [
      "rock",
      "flying"
    ],
    "stats": {
      "hp": 60,
      "attack": 60,
      "defense": 100,
      "specialAttack": 60,
      "specialDefense": 100,
      "speed": 60
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/774.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/774.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/774.ogg",
    "moves": [
      {
        "id": 408,
        "name": "power-gem",
        "type": "rock",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 605,
        "name": "dazzling-gleam",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "775": {
    "id": 775,
    "number": 775,
    "name": "komala",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 65,
      "attack": 115,
      "defense": 65,
      "specialAttack": 75,
      "specialDefense": 95,
      "speed": 65
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/775.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/775.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/775.ogg",
    "moves": [
      {
        "id": 34,
        "name": "body-slam",
        "type": "normal",
        "power": 85,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 861,
        "name": "ice-spinner",
        "type": "ice",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "776": {
    "id": 776,
    "number": 776,
    "name": "turtonator",
    "types": [
      "fire",
      "dragon"
    ],
    "stats": {
      "hp": 60,
      "attack": 78,
      "defense": 135,
      "specialAttack": 91,
      "specialDefense": 85,
      "speed": 36
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/776.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/776.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/776.ogg",
    "moves": [
      {
        "id": 704,
        "name": "shell-trap",
        "type": "fire",
        "power": 150,
        "accuracy": 100,
        "pp": 5,
        "damageClass": "special"
      },
      {
        "id": 406,
        "name": "dragon-pulse",
        "type": "dragon",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 776,
        "name": "body-press",
        "type": "fighting",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "777": {
    "id": 777,
    "number": 777,
    "name": "togedemaru",
    "types": [
      "electric",
      "steel"
    ],
    "stats": {
      "hp": 65,
      "attack": 98,
      "defense": 63,
      "specialAttack": 40,
      "specialDefense": 73,
      "speed": 96
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/777.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/777.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/777.ogg",
    "moves": [
      {
        "id": 716,
        "name": "zing-zap",
        "type": "electric",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 398,
        "name": "poison-jab",
        "type": "poison",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 428,
        "name": "zen-headbutt",
        "type": "psychic",
        "power": 80,
        "accuracy": 90,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "778": {
    "id": 778,
    "number": 778,
    "name": "mimikyu-disguised",
    "types": [
      "ghost",
      "fairy"
    ],
    "stats": {
      "hp": 55,
      "attack": 90,
      "defense": 80,
      "specialAttack": 50,
      "specialDefense": 105,
      "speed": 96
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/778.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/778.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/778.ogg",
    "moves": [
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 141,
        "name": "leech-life",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 400,
        "name": "night-slash",
        "type": "dark",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "779": {
    "id": 779,
    "number": 779,
    "name": "bruxish",
    "types": [
      "water",
      "psychic"
    ],
    "stats": {
      "hp": 68,
      "attack": 105,
      "defense": 70,
      "specialAttack": 70,
      "specialDefense": 70,
      "speed": 92
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/779.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/779.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/779.ogg",
    "moves": [
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 706,
        "name": "psychic-fangs",
        "type": "psychic",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "780": {
    "id": 780,
    "number": 780,
    "name": "drampa",
    "types": [
      "normal",
      "dragon"
    ],
    "stats": {
      "hp": 78,
      "attack": 60,
      "defense": 85,
      "specialAttack": 135,
      "specialDefense": 91,
      "speed": 36
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/780.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/780.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/780.ogg",
    "moves": [
      {
        "id": 304,
        "name": "hyper-voice",
        "type": "normal",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 406,
        "name": "dragon-pulse",
        "type": "dragon",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 414,
        "name": "earth-power",
        "type": "ground",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "781": {
    "id": 781,
    "number": 781,
    "name": "dhelmise",
    "types": [
      "ghost",
      "grass"
    ],
    "stats": {
      "hp": 70,
      "attack": 131,
      "defense": 100,
      "specialAttack": 86,
      "specialDefense": 90,
      "speed": 40
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/781.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/781.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/781.ogg",
    "moves": [
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 438,
        "name": "power-whip",
        "type": "grass",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "782": {
    "id": 782,
    "number": 782,
    "name": "jangmo-o",
    "types": [
      "dragon"
    ],
    "stats": {
      "hp": 45,
      "attack": 55,
      "defense": 65,
      "specialAttack": 45,
      "specialDefense": 45,
      "speed": 45
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/782.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/782.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/782.ogg",
    "moves": [
      {
        "id": 337,
        "name": "dragon-claw",
        "type": "dragon",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 404,
        "name": "x-scissor",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 401,
        "name": "aqua-tail",
        "type": "water",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "783": {
    "id": 783,
    "number": 783,
    "name": "hakamo-o",
    "types": [
      "dragon",
      "fighting"
    ],
    "stats": {
      "hp": 55,
      "attack": 75,
      "defense": 90,
      "specialAttack": 65,
      "specialDefense": 70,
      "speed": 65
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/783.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/783.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/783.ogg",
    "moves": [
      {
        "id": 337,
        "name": "dragon-claw",
        "type": "dragon",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 327,
        "name": "sky-uppercut",
        "type": "fighting",
        "power": 85,
        "accuracy": 90,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "784": {
    "id": 784,
    "number": 784,
    "name": "kommo-o",
    "types": [
      "dragon",
      "fighting"
    ],
    "stats": {
      "hp": 75,
      "attack": 110,
      "defense": 125,
      "specialAttack": 100,
      "specialDefense": 105,
      "speed": 85
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/784.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/784.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/784.ogg",
    "moves": [
      {
        "id": 337,
        "name": "dragon-claw",
        "type": "dragon",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 776,
        "name": "body-press",
        "type": "fighting",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 586,
        "name": "boomburst",
        "type": "normal",
        "power": 140,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "812": {
    "id": 812,
    "number": 812,
    "name": "rillaboom",
    "types": [
      "grass"
    ],
    "stats": {
      "hp": 100,
      "attack": 125,
      "defense": 90,
      "specialAttack": 60,
      "specialDefense": 70,
      "speed": 85
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/812.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/812.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/812.ogg",
    "moves": [
      {
        "id": 402,
        "name": "seed-bomb",
        "type": "grass",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 663,
        "name": "darkest-lariat",
        "type": "dark",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "815": {
    "id": 815,
    "number": 815,
    "name": "cinderace",
    "types": [
      "fire"
    ],
    "stats": {
      "hp": 80,
      "attack": 116,
      "defense": 75,
      "specialAttack": 65,
      "specialDefense": 75,
      "speed": 119
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/815.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/815.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/815.ogg",
    "moves": [
      {
        "id": 780,
        "name": "pyro-ball",
        "type": "fire",
        "power": 120,
        "accuracy": 90,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 428,
        "name": "zen-headbutt",
        "type": "psychic",
        "power": 80,
        "accuracy": 90,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "818": {
    "id": 818,
    "number": 818,
    "name": "inteleon",
    "types": [
      "water"
    ],
    "stats": {
      "hp": 70,
      "attack": 85,
      "defense": 65,
      "specialAttack": 125,
      "specialDefense": 65,
      "speed": 120
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/818.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/818.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/818.ogg",
    "moves": [
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "820": {
    "id": 820,
    "number": 820,
    "name": "greedent",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 120,
      "attack": 95,
      "defense": 95,
      "specialAttack": 55,
      "specialDefense": 75,
      "speed": 20
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/820.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/820.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/820.ogg",
    "moves": [
      {
        "id": 34,
        "name": "body-slam",
        "type": "normal",
        "power": 85,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 706,
        "name": "psychic-fangs",
        "type": "psychic",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "823": {
    "id": 823,
    "number": 823,
    "name": "corviknight",
    "types": [
      "flying",
      "steel"
    ],
    "stats": {
      "hp": 98,
      "attack": 87,
      "defense": 105,
      "specialAttack": 53,
      "specialDefense": 85,
      "speed": 67
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/823.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/823.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/823.ogg",
    "moves": [
      {
        "id": 65,
        "name": "drill-peck",
        "type": "flying",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 776,
        "name": "body-press",
        "type": "fighting",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 369,
        "name": "u-turn",
        "type": "bug",
        "power": 70,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "826": {
    "id": 826,
    "number": 826,
    "name": "orbeetle",
    "types": [
      "bug",
      "psychic"
    ],
    "stats": {
      "hp": 60,
      "attack": 45,
      "defense": 110,
      "specialAttack": 80,
      "specialDefense": 120,
      "speed": 90
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/826.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/826.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/826.ogg",
    "moves": [
      {
        "id": 405,
        "name": "bug-buzz",
        "type": "bug",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "828": {
    "id": 828,
    "number": 828,
    "name": "thievul",
    "types": [
      "dark"
    ],
    "stats": {
      "hp": 70,
      "attack": 58,
      "defense": 58,
      "specialAttack": 87,
      "specialDefense": 92,
      "speed": 90
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/828.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/828.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/828.ogg",
    "moves": [
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "830": {
    "id": 830,
    "number": 830,
    "name": "eldegoss",
    "types": [
      "grass"
    ],
    "stats": {
      "hp": 60,
      "attack": 50,
      "defense": 90,
      "specialAttack": 80,
      "specialDefense": 120,
      "speed": 60
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/830.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/830.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/830.ogg",
    "moves": [
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 676,
        "name": "pollen-puff",
        "type": "bug",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 304,
        "name": "hyper-voice",
        "type": "normal",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 202,
        "name": "giga-drain",
        "type": "grass",
        "power": 75,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "832": {
    "id": 832,
    "number": 832,
    "name": "dubwool",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 72,
      "attack": 80,
      "defense": 100,
      "specialAttack": 60,
      "specialDefense": 90,
      "speed": 88
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/832.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/832.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/832.ogg",
    "moves": [
      {
        "id": 34,
        "name": "body-slam",
        "type": "normal",
        "power": 85,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 776,
        "name": "body-press",
        "type": "fighting",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 428,
        "name": "zen-headbutt",
        "type": "psychic",
        "power": 80,
        "accuracy": 90,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 803,
        "name": "grassy-glide",
        "type": "grass",
        "power": 55,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "834": {
    "id": 834,
    "number": 834,
    "name": "drednaw",
    "types": [
      "water",
      "rock"
    ],
    "stats": {
      "hp": 90,
      "attack": 115,
      "defense": 90,
      "specialAttack": 48,
      "specialDefense": 68,
      "speed": 74
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/834.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/834.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/834.ogg",
    "moves": [
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 224,
        "name": "megahorn",
        "type": "bug",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "836": {
    "id": 836,
    "number": 836,
    "name": "boltund",
    "types": [
      "electric"
    ],
    "stats": {
      "hp": 69,
      "attack": 90,
      "defense": 60,
      "specialAttack": 90,
      "specialDefense": 60,
      "speed": 121
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/836.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/836.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/836.ogg",
    "moves": [
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 706,
        "name": "psychic-fangs",
        "type": "psychic",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "839": {
    "id": 839,
    "number": 839,
    "name": "coalossal",
    "types": [
      "rock",
      "fire"
    ],
    "stats": {
      "hp": 110,
      "attack": 80,
      "defense": 120,
      "specialAttack": 80,
      "specialDefense": 90,
      "speed": 30
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/839.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/839.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/839.ogg",
    "moves": [
      {
        "id": 408,
        "name": "power-gem",
        "type": "rock",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "special"
      },
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 776,
        "name": "body-press",
        "type": "fighting",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "841": {
    "id": 841,
    "number": 841,
    "name": "flapple",
    "types": [
      "grass",
      "dragon"
    ],
    "stats": {
      "hp": 70,
      "attack": 110,
      "defense": 80,
      "specialAttack": 95,
      "specialDefense": 60,
      "speed": 70
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/841.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/841.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/841.ogg",
    "moves": [
      {
        "id": 402,
        "name": "seed-bomb",
        "type": "grass",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 406,
        "name": "dragon-pulse",
        "type": "dragon",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 369,
        "name": "u-turn",
        "type": "bug",
        "power": 70,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 403,
        "name": "air-slash",
        "type": "flying",
        "power": 75,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "842": {
    "id": 842,
    "number": 842,
    "name": "appletun",
    "types": [
      "grass",
      "dragon"
    ],
    "stats": {
      "hp": 110,
      "attack": 85,
      "defense": 80,
      "specialAttack": 100,
      "specialDefense": 80,
      "speed": 30
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/842.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/842.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/842.ogg",
    "moves": [
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 406,
        "name": "dragon-pulse",
        "type": "dragon",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "844": {
    "id": 844,
    "number": 844,
    "name": "sandaconda",
    "types": [
      "ground"
    ],
    "stats": {
      "hp": 72,
      "attack": 107,
      "defense": 125,
      "specialAttack": 65,
      "specialDefense": 70,
      "speed": 71
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/844.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/844.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/844.ogg",
    "moves": [
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 428,
        "name": "zen-headbutt",
        "type": "psychic",
        "power": 80,
        "accuracy": 90,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "845": {
    "id": 845,
    "number": 845,
    "name": "cramorant",
    "types": [
      "flying",
      "water"
    ],
    "stats": {
      "hp": 70,
      "attack": 85,
      "defense": 55,
      "specialAttack": 85,
      "specialDefense": 95,
      "speed": 85
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/845.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/845.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/845.ogg",
    "moves": [
      {
        "id": 65,
        "name": "drill-peck",
        "type": "flying",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "847": {
    "id": 847,
    "number": 847,
    "name": "barraskewda",
    "types": [
      "water"
    ],
    "stats": {
      "hp": 61,
      "attack": 123,
      "defense": 60,
      "specialAttack": 60,
      "specialDefense": 50,
      "speed": 136
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/847.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/847.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/847.ogg",
    "moves": [
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 706,
        "name": "psychic-fangs",
        "type": "psychic",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 529,
        "name": "drill-run",
        "type": "ground",
        "power": 80,
        "accuracy": 95,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "849": {
    "id": 849,
    "number": 849,
    "name": "toxtricity-amped",
    "types": [
      "electric",
      "poison"
    ],
    "stats": {
      "hp": 75,
      "attack": 98,
      "defense": 70,
      "specialAttack": 114,
      "specialDefense": 70,
      "speed": 75
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/849.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/849.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/849.ogg",
    "moves": [
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 482,
        "name": "sludge-wave",
        "type": "poison",
        "power": 95,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 586,
        "name": "boomburst",
        "type": "normal",
        "power": 140,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "851": {
    "id": 851,
    "number": 851,
    "name": "centiskorch",
    "types": [
      "fire",
      "bug"
    ],
    "stats": {
      "hp": 100,
      "attack": 115,
      "defense": 65,
      "specialAttack": 90,
      "specialDefense": 90,
      "speed": 65
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/851.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/851.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/851.ogg",
    "moves": [
      {
        "id": 680,
        "name": "fire-lash",
        "type": "fire",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 141,
        "name": "leech-life",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 438,
        "name": "power-whip",
        "type": "grass",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "853": {
    "id": 853,
    "number": 853,
    "name": "grapploct",
    "types": [
      "fighting"
    ],
    "stats": {
      "hp": 80,
      "attack": 118,
      "defense": 90,
      "specialAttack": 70,
      "specialDefense": 80,
      "speed": 42
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/853.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/853.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/853.ogg",
    "moves": [
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 693,
        "name": "brutal-swing",
        "type": "dark",
        "power": 60,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "855": {
    "id": 855,
    "number": 855,
    "name": "polteageist",
    "types": [
      "ghost"
    ],
    "stats": {
      "hp": 60,
      "attack": 65,
      "defense": 65,
      "specialAttack": 134,
      "specialDefense": 114,
      "speed": 70
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/855.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/855.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/855.ogg",
    "moves": [
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 202,
        "name": "giga-drain",
        "type": "grass",
        "power": 75,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "858": {
    "id": 858,
    "number": 858,
    "name": "hatterene",
    "types": [
      "psychic",
      "fairy"
    ],
    "stats": {
      "hp": 57,
      "attack": 90,
      "defense": 95,
      "specialAttack": 136,
      "specialDefense": 103,
      "speed": 29
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/858.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/858.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/858.ogg",
    "moves": [
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 605,
        "name": "dazzling-gleam",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "861": {
    "id": 861,
    "number": 861,
    "name": "grimmsnarl",
    "types": [
      "dark",
      "fairy"
    ],
    "stats": {
      "hp": 95,
      "attack": 120,
      "defense": 65,
      "specialAttack": 95,
      "specialDefense": 75,
      "speed": 60
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/861.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/861.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/861.ogg",
    "moves": [
      {
        "id": 663,
        "name": "darkest-lariat",
        "type": "dark",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 438,
        "name": "power-whip",
        "type": "grass",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "862": {
    "id": 862,
    "number": 862,
    "name": "obstagoon",
    "types": [
      "dark",
      "normal"
    ],
    "stats": {
      "hp": 93,
      "attack": 90,
      "defense": 101,
      "specialAttack": 60,
      "specialDefense": 81,
      "speed": 95
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/862.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/862.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/862.ogg",
    "moves": [
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 34,
        "name": "body-slam",
        "type": "normal",
        "power": 85,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "863": {
    "id": 863,
    "number": 863,
    "name": "perrserker",
    "types": [
      "steel"
    ],
    "stats": {
      "hp": 70,
      "attack": 110,
      "defense": 100,
      "specialAttack": 50,
      "specialDefense": 60,
      "speed": 50
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/863.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/863.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/863.ogg",
    "moves": [
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      }
    ]
  },
  "864": {
    "id": 864,
    "number": 864,
    "name": "cursola",
    "types": [
      "ghost"
    ],
    "stats": {
      "hp": 60,
      "attack": 95,
      "defense": 50,
      "specialAttack": 145,
      "specialDefense": 130,
      "speed": 30
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/864.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/864.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/864.ogg",
    "moves": [
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 414,
        "name": "earth-power",
        "type": "ground",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "865": {
    "id": 865,
    "number": 865,
    "name": "sirfetchd",
    "types": [
      "fighting"
    ],
    "stats": {
      "hp": 62,
      "attack": 135,
      "defense": 95,
      "specialAttack": 68,
      "specialDefense": 82,
      "speed": 65
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/865.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/865.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/865.ogg",
    "moves": [
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 348,
        "name": "leaf-blade",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 398,
        "name": "poison-jab",
        "type": "poison",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "866": {
    "id": 866,
    "number": 866,
    "name": "mr-rime",
    "types": [
      "ice",
      "psychic"
    ],
    "stats": {
      "hp": 80,
      "attack": 85,
      "defense": 75,
      "specialAttack": 110,
      "specialDefense": 100,
      "speed": 70
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/866.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/866.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/866.ogg",
    "moves": [
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "867": {
    "id": 867,
    "number": 867,
    "name": "runerigus",
    "types": [
      "ground",
      "ghost"
    ],
    "stats": {
      "hp": 58,
      "attack": 95,
      "defense": 145,
      "specialAttack": 50,
      "specialDefense": 105,
      "speed": 30
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/867.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/867.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/867.ogg",
    "moves": [
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 776,
        "name": "body-press",
        "type": "fighting",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      }
    ]
  },
  "869": {
    "id": 869,
    "number": 869,
    "name": "alcremie",
    "types": [
      "fairy"
    ],
    "stats": {
      "hp": 65,
      "attack": 60,
      "defense": 75,
      "specialAttack": 110,
      "specialDefense": 121,
      "speed": 64
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/869.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/869.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/869.ogg",
    "moves": [
      {
        "id": 605,
        "name": "dazzling-gleam",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 595,
        "name": "mystical-fire",
        "type": "fire",
        "power": 75,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "870": {
    "id": 870,
    "number": 870,
    "name": "falinks",
    "types": [
      "fighting"
    ],
    "stats": {
      "hp": 65,
      "attack": 100,
      "defense": 100,
      "specialAttack": 70,
      "specialDefense": 60,
      "speed": 75
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/870.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/870.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/870.ogg",
    "moves": [
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 224,
        "name": "megahorn",
        "type": "bug",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 667,
        "name": "high-horsepower",
        "type": "ground",
        "power": 95,
        "accuracy": 95,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "873": {
    "id": 873,
    "number": 873,
    "name": "frosmoth",
    "types": [
      "ice",
      "bug"
    ],
    "stats": {
      "hp": 70,
      "attack": 65,
      "defense": 60,
      "specialAttack": 125,
      "specialDefense": 90,
      "speed": 65
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/873.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/873.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/873.ogg",
    "moves": [
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 405,
        "name": "bug-buzz",
        "type": "bug",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 605,
        "name": "dazzling-gleam",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 202,
        "name": "giga-drain",
        "type": "grass",
        "power": 75,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "874": {
    "id": 874,
    "number": 874,
    "name": "stonjourner",
    "types": [
      "rock"
    ],
    "stats": {
      "hp": 100,
      "attack": 125,
      "defense": 135,
      "specialAttack": 20,
      "specialDefense": 20,
      "speed": 70
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/874.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/874.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/874.ogg",
    "moves": [
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 693,
        "name": "brutal-swing",
        "type": "dark",
        "power": 60,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 490,
        "name": "low-sweep",
        "type": "fighting",
        "power": 65,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "875": {
    "id": 875,
    "number": 875,
    "name": "eiscue-ice",
    "types": [
      "ice"
    ],
    "stats": {
      "hp": 75,
      "attack": 80,
      "defense": 110,
      "specialAttack": 65,
      "specialDefense": 90,
      "speed": 50
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/875.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/875.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/875.ogg",
    "moves": [
      {
        "id": 861,
        "name": "ice-spinner",
        "type": "ice",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 428,
        "name": "zen-headbutt",
        "type": "psychic",
        "power": 80,
        "accuracy": 90,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "876": {
    "id": 876,
    "number": 876,
    "name": "indeedee-male",
    "types": [
      "psychic",
      "normal"
    ],
    "stats": {
      "hp": 60,
      "attack": 65,
      "defense": 55,
      "specialAttack": 105,
      "specialDefense": 95,
      "speed": 95
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/876.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/876.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/876.ogg",
    "moves": [
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 304,
        "name": "hyper-voice",
        "type": "normal",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "877": {
    "id": 877,
    "number": 877,
    "name": "morpeko-full-belly",
    "types": [
      "electric",
      "dark"
    ],
    "stats": {
      "hp": 58,
      "attack": 95,
      "defense": 58,
      "specialAttack": 70,
      "specialDefense": 58,
      "speed": 97
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/877.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/877.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/877.ogg",
    "moves": [
      {
        "id": 783,
        "name": "aura-wheel",
        "type": "electric",
        "power": 110,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 706,
        "name": "psychic-fangs",
        "type": "psychic",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 402,
        "name": "seed-bomb",
        "type": "grass",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "879": {
    "id": 879,
    "number": 879,
    "name": "copperajah",
    "types": [
      "steel"
    ],
    "stats": {
      "hp": 122,
      "attack": 130,
      "defense": 69,
      "specialAttack": 80,
      "specialDefense": 69,
      "speed": 30
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/879.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/879.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/879.ogg",
    "moves": [
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 438,
        "name": "power-whip",
        "type": "grass",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "880": {
    "id": 880,
    "number": 880,
    "name": "dracozolt",
    "types": [
      "electric",
      "dragon"
    ],
    "stats": {
      "hp": 90,
      "attack": 100,
      "defense": 90,
      "specialAttack": 80,
      "specialDefense": 70,
      "speed": 75
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/880.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/880.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/880.ogg",
    "moves": [
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 337,
        "name": "dragon-claw",
        "type": "dragon",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "881": {
    "id": 881,
    "number": 881,
    "name": "arctozolt",
    "types": [
      "electric",
      "ice"
    ],
    "stats": {
      "hp": 90,
      "attack": 100,
      "defense": 90,
      "specialAttack": 90,
      "specialDefense": 80,
      "speed": 55
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/881.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/881.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/881.ogg",
    "moves": [
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      }
    ]
  },
  "882": {
    "id": 882,
    "number": 882,
    "name": "dracovish",
    "types": [
      "water",
      "dragon"
    ],
    "stats": {
      "hp": 90,
      "attack": 90,
      "defense": 100,
      "specialAttack": 70,
      "specialDefense": 80,
      "speed": 75
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/882.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/882.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/882.ogg",
    "moves": [
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 406,
        "name": "dragon-pulse",
        "type": "dragon",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "883": {
    "id": 883,
    "number": 883,
    "name": "arctovish",
    "types": [
      "water",
      "ice"
    ],
    "stats": {
      "hp": 90,
      "attack": 90,
      "defense": 100,
      "specialAttack": 80,
      "specialDefense": 90,
      "speed": 55
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/883.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/883.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/883.ogg",
    "moves": [
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 706,
        "name": "psychic-fangs",
        "type": "psychic",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "884": {
    "id": 884,
    "number": 884,
    "name": "duraludon",
    "types": [
      "steel",
      "dragon"
    ],
    "stats": {
      "hp": 70,
      "attack": 95,
      "defense": 115,
      "specialAttack": 120,
      "specialDefense": 50,
      "speed": 85
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/884.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/884.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/884.ogg",
    "moves": [
      {
        "id": 430,
        "name": "flash-cannon",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 406,
        "name": "dragon-pulse",
        "type": "dragon",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "886": {
    "id": 886,
    "number": 886,
    "name": "drakloak",
    "types": [
      "dragon",
      "ghost"
    ],
    "stats": {
      "hp": 68,
      "attack": 80,
      "defense": 50,
      "specialAttack": 60,
      "specialDefense": 50,
      "speed": 102
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/886.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/886.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/886.ogg",
    "moves": [
      {
        "id": 406,
        "name": "dragon-pulse",
        "type": "dragon",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 706,
        "name": "psychic-fangs",
        "type": "psychic",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "887": {
    "id": 887,
    "number": 887,
    "name": "dragapult",
    "types": [
      "dragon",
      "ghost"
    ],
    "stats": {
      "hp": 88,
      "attack": 120,
      "defense": 75,
      "specialAttack": 100,
      "specialDefense": 75,
      "speed": 142
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/887.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/887.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/887.ogg",
    "moves": [
      {
        "id": 337,
        "name": "dragon-claw",
        "type": "dragon",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 706,
        "name": "psychic-fangs",
        "type": "psychic",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "899": {
    "id": 899,
    "number": 899,
    "name": "wyrdeer",
    "types": [
      "normal",
      "psychic"
    ],
    "stats": {
      "hp": 103,
      "attack": 105,
      "defense": 72,
      "specialAttack": 105,
      "specialDefense": 75,
      "speed": 65
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/899.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/899.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/899.ogg",
    "moves": [
      {
        "id": 34,
        "name": "body-slam",
        "type": "normal",
        "power": 85,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 224,
        "name": "megahorn",
        "type": "bug",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "900": {
    "id": 900,
    "number": 900,
    "name": "kleavor",
    "types": [
      "bug",
      "rock"
    ],
    "stats": {
      "hp": 70,
      "attack": 135,
      "defense": 95,
      "specialAttack": 45,
      "specialDefense": 70,
      "speed": 85
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/900.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/900.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/900.ogg",
    "moves": [
      {
        "id": 404,
        "name": "x-scissor",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 400,
        "name": "night-slash",
        "type": "dark",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "901": {
    "id": 901,
    "number": 901,
    "name": "ursaluna",
    "types": [
      "ground",
      "normal"
    ],
    "stats": {
      "hp": 130,
      "attack": 140,
      "defense": 105,
      "specialAttack": 45,
      "specialDefense": 80,
      "speed": 50
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/901.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/901.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/901.ogg",
    "moves": [
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 34,
        "name": "body-slam",
        "type": "normal",
        "power": 85,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "902": {
    "id": 902,
    "number": 902,
    "name": "basculegion-male",
    "types": [
      "water",
      "ghost"
    ],
    "stats": {
      "hp": 120,
      "attack": 112,
      "defense": 65,
      "specialAttack": 80,
      "specialDefense": 75,
      "speed": 78
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/902.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/902.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/902.ogg",
    "moves": [
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 706,
        "name": "psychic-fangs",
        "type": "psychic",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "903": {
    "id": 903,
    "number": 903,
    "name": "sneasler",
    "types": [
      "fighting",
      "poison"
    ],
    "stats": {
      "hp": 80,
      "attack": 130,
      "defense": 60,
      "specialAttack": 40,
      "specialDefense": 80,
      "speed": 120
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/903.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/903.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/903.ogg",
    "moves": [
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 404,
        "name": "x-scissor",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "904": {
    "id": 904,
    "number": 904,
    "name": "overqwil",
    "types": [
      "dark",
      "poison"
    ],
    "stats": {
      "hp": 85,
      "attack": 115,
      "defense": 95,
      "specialAttack": 65,
      "specialDefense": 65,
      "speed": 85
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/904.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/904.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/904.ogg",
    "moves": [
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 684,
        "name": "smart-strike",
        "type": "steel",
        "power": 70,
        "accuracy": null,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "908": {
    "id": 908,
    "number": 908,
    "name": "meowscarada",
    "types": [
      "grass",
      "dark"
    ],
    "stats": {
      "hp": 76,
      "attack": 110,
      "defense": 70,
      "specialAttack": 81,
      "specialDefense": 70,
      "speed": 123
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/908.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/908.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/908.ogg",
    "moves": [
      {
        "id": 572,
        "name": "petal-blizzard",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "911": {
    "id": 911,
    "number": 911,
    "name": "skeledirge",
    "types": [
      "fire",
      "ghost"
    ],
    "stats": {
      "hp": 104,
      "attack": 75,
      "defense": 100,
      "specialAttack": 110,
      "specialDefense": 75,
      "speed": 66
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/911.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/911.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/911.ogg",
    "moves": [
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 414,
        "name": "earth-power",
        "type": "ground",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 914,
        "name": "alluring-voice",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "914": {
    "id": 914,
    "number": 914,
    "name": "quaquaval",
    "types": [
      "water",
      "fighting"
    ],
    "stats": {
      "hp": 85,
      "attack": 120,
      "defense": 80,
      "specialAttack": 85,
      "specialDefense": 75,
      "speed": 85
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/914.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/914.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/914.ogg",
    "moves": [
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 861,
        "name": "ice-spinner",
        "type": "ice",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 282,
        "name": "knock-off",
        "type": "dark",
        "power": 65,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "916": {
    "id": 916,
    "number": 916,
    "name": "oinkologne-male",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 110,
      "attack": 100,
      "defense": 75,
      "specialAttack": 59,
      "specialDefense": 80,
      "speed": 65
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/916.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/916.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/916.ogg",
    "moves": [
      {
        "id": 34,
        "name": "body-slam",
        "type": "normal",
        "power": 85,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 667,
        "name": "high-horsepower",
        "type": "ground",
        "power": 95,
        "accuracy": 95,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 402,
        "name": "seed-bomb",
        "type": "grass",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "920": {
    "id": 920,
    "number": 920,
    "name": "lokix",
    "types": [
      "bug",
      "dark"
    ],
    "stats": {
      "hp": 71,
      "attack": 102,
      "defense": 78,
      "specialAttack": 52,
      "specialDefense": 55,
      "speed": 92
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/920.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/920.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/920.ogg",
    "moves": [
      {
        "id": 141,
        "name": "leech-life",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 853,
        "name": "axe-kick",
        "type": "fighting",
        "power": 120,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 332,
        "name": "aerial-ace",
        "type": "flying",
        "power": 60,
        "accuracy": null,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "923": {
    "id": 923,
    "number": 923,
    "name": "pawmot",
    "types": [
      "electric",
      "fighting"
    ],
    "stats": {
      "hp": 70,
      "attack": 115,
      "defense": 70,
      "specialAttack": 70,
      "specialDefense": 60,
      "speed": 105
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/923.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/923.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/923.ogg",
    "moves": [
      {
        "id": 892,
        "name": "double-shock",
        "type": "electric",
        "power": 120,
        "accuracy": 100,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "925": {
    "id": 925,
    "number": 925,
    "name": "maushold-family-of-four",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 74,
      "attack": 75,
      "defense": 70,
      "specialAttack": 65,
      "specialDefense": 75,
      "speed": 111
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/925.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/925.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/925.ogg",
    "moves": [
      {
        "id": 304,
        "name": "hyper-voice",
        "type": "normal",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 402,
        "name": "seed-bomb",
        "type": "grass",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "930": {
    "id": 930,
    "number": 930,
    "name": "arboliva",
    "types": [
      "grass",
      "normal"
    ],
    "stats": {
      "hp": 78,
      "attack": 69,
      "defense": 90,
      "specialAttack": 125,
      "specialDefense": 109,
      "speed": 39
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/930.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/930.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/930.ogg",
    "moves": [
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 304,
        "name": "hyper-voice",
        "type": "normal",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 414,
        "name": "earth-power",
        "type": "ground",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 676,
        "name": "pollen-puff",
        "type": "bug",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "934": {
    "id": 934,
    "number": 934,
    "name": "garganacl",
    "types": [
      "rock"
    ],
    "stats": {
      "hp": 100,
      "attack": 100,
      "defense": 130,
      "specialAttack": 45,
      "specialDefense": 90,
      "speed": 35
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/934.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/934.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/934.ogg",
    "moves": [
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 8,
        "name": "ice-punch",
        "type": "ice",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "936": {
    "id": 936,
    "number": 936,
    "name": "armarouge",
    "types": [
      "fire",
      "psychic"
    ],
    "stats": {
      "hp": 85,
      "attack": 60,
      "defense": 100,
      "specialAttack": 125,
      "specialDefense": 80,
      "speed": 75
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/936.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/936.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/936.ogg",
    "moves": [
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "937": {
    "id": 937,
    "number": 937,
    "name": "ceruledge",
    "types": [
      "fire",
      "ghost"
    ],
    "stats": {
      "hp": 75,
      "attack": 125,
      "defense": 80,
      "specialAttack": 60,
      "specialDefense": 100,
      "speed": 85
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/937.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/937.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/937.ogg",
    "moves": [
      {
        "id": 891,
        "name": "bitter-blade",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 337,
        "name": "dragon-claw",
        "type": "dragon",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "939": {
    "id": 939,
    "number": 939,
    "name": "bellibolt",
    "types": [
      "electric"
    ],
    "stats": {
      "hp": 109,
      "attack": 64,
      "defense": 91,
      "specialAttack": 103,
      "specialDefense": 83,
      "speed": 45
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/939.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/939.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/939.ogg",
    "moves": [
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 330,
        "name": "muddy-water",
        "type": "water",
        "power": 90,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 304,
        "name": "hyper-voice",
        "type": "normal",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 341,
        "name": "mud-shot",
        "type": "ground",
        "power": 55,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "941": {
    "id": 941,
    "number": 941,
    "name": "kilowattrel",
    "types": [
      "electric",
      "flying"
    ],
    "stats": {
      "hp": 70,
      "attack": 70,
      "defense": 60,
      "specialAttack": 105,
      "specialDefense": 60,
      "speed": 125
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/941.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/941.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/941.ogg",
    "moves": [
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 403,
        "name": "air-slash",
        "type": "flying",
        "power": 75,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 369,
        "name": "u-turn",
        "type": "bug",
        "power": 70,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 129,
        "name": "swift",
        "type": "normal",
        "power": 60,
        "accuracy": null,
        "pp": 20,
        "damageClass": "special"
      }
    ]
  },
  "943": {
    "id": 943,
    "number": 943,
    "name": "mabosstiff",
    "types": [
      "dark"
    ],
    "stats": {
      "hp": 80,
      "attack": 120,
      "defense": 90,
      "specialAttack": 60,
      "specialDefense": 70,
      "speed": 85
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/943.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/943.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/943.ogg",
    "moves": [
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 706,
        "name": "psychic-fangs",
        "type": "psychic",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 423,
        "name": "ice-fang",
        "type": "ice",
        "power": 65,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "945": {
    "id": 945,
    "number": 945,
    "name": "grafaiai",
    "types": [
      "poison",
      "normal"
    ],
    "stats": {
      "hp": 63,
      "attack": 95,
      "defense": 65,
      "specialAttack": 80,
      "specialDefense": 72,
      "speed": 110
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/945.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/945.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/945.ogg",
    "moves": [
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 163,
        "name": "slash",
        "type": "normal",
        "power": 70,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 404,
        "name": "x-scissor",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "947": {
    "id": 947,
    "number": 947,
    "name": "brambleghast",
    "types": [
      "grass",
      "ghost"
    ],
    "stats": {
      "hp": 55,
      "attack": 115,
      "defense": 70,
      "specialAttack": 80,
      "specialDefense": 70,
      "speed": 90
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/947.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/947.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/947.ogg",
    "moves": [
      {
        "id": 438,
        "name": "power-whip",
        "type": "grass",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 168,
        "name": "thief",
        "type": "dark",
        "power": 60,
        "accuracy": 100,
        "pp": 25,
        "damageClass": "physical"
      },
      {
        "id": 806,
        "name": "skitter-smack",
        "type": "bug",
        "power": 70,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "949": {
    "id": 949,
    "number": 949,
    "name": "toedscruel",
    "types": [
      "ground",
      "grass"
    ],
    "stats": {
      "hp": 80,
      "attack": 70,
      "defense": 65,
      "specialAttack": 80,
      "specialDefense": 120,
      "speed": 100
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/949.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/949.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/949.ogg",
    "moves": [
      {
        "id": 414,
        "name": "earth-power",
        "type": "ground",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 188,
        "name": "sludge-bomb",
        "type": "poison",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 605,
        "name": "dazzling-gleam",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "950": {
    "id": 950,
    "number": 950,
    "name": "klawf",
    "types": [
      "rock"
    ],
    "stats": {
      "hp": 70,
      "attack": 100,
      "defense": 115,
      "specialAttack": 35,
      "specialDefense": 55,
      "speed": 75
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/950.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/950.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/950.ogg",
    "moves": [
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 667,
        "name": "high-horsepower",
        "type": "ground",
        "power": 95,
        "accuracy": 95,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 152,
        "name": "crabhammer",
        "type": "water",
        "power": 100,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "952": {
    "id": 952,
    "number": 952,
    "name": "scovillain",
    "types": [
      "grass",
      "fire"
    ],
    "stats": {
      "hp": 65,
      "attack": 108,
      "defense": 65,
      "specialAttack": 108,
      "specialDefense": 65,
      "speed": 75
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/952.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/952.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/952.ogg",
    "moves": [
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 428,
        "name": "zen-headbutt",
        "type": "psychic",
        "power": 80,
        "accuracy": 90,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "954": {
    "id": 954,
    "number": 954,
    "name": "rabsca",
    "types": [
      "bug",
      "psychic"
    ],
    "stats": {
      "hp": 75,
      "attack": 50,
      "defense": 85,
      "specialAttack": 115,
      "specialDefense": 100,
      "speed": 45
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/954.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/954.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/954.ogg",
    "moves": [
      {
        "id": 405,
        "name": "bug-buzz",
        "type": "bug",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 414,
        "name": "earth-power",
        "type": "ground",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "956": {
    "id": 956,
    "number": 956,
    "name": "espathra",
    "types": [
      "psychic"
    ],
    "stats": {
      "hp": 95,
      "attack": 60,
      "defense": 60,
      "specialAttack": 101,
      "specialDefense": 60,
      "speed": 105
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/956.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/956.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/956.ogg",
    "moves": [
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 605,
        "name": "dazzling-gleam",
        "type": "fairy",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "959": {
    "id": 959,
    "number": 959,
    "name": "tinkaton",
    "types": [
      "fairy",
      "steel"
    ],
    "stats": {
      "hp": 85,
      "attack": 75,
      "defense": 77,
      "specialAttack": 70,
      "specialDefense": 105,
      "speed": 94
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/959.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/959.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/959.ogg",
    "moves": [
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 893,
        "name": "gigaton-hammer",
        "type": "steel",
        "power": 160,
        "accuracy": 100,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 282,
        "name": "knock-off",
        "type": "dark",
        "power": 65,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      }
    ]
  },
  "960": {
    "id": 960,
    "number": 960,
    "name": "wiglett",
    "types": [
      "water"
    ],
    "stats": {
      "hp": 10,
      "attack": 55,
      "defense": 25,
      "specialAttack": 35,
      "specialDefense": 25,
      "speed": 95
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/960.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/960.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/960.ogg",
    "moves": [
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 414,
        "name": "earth-power",
        "type": "ground",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "962": {
    "id": 962,
    "number": 962,
    "name": "bombirdier",
    "types": [
      "flying",
      "dark"
    ],
    "stats": {
      "hp": 70,
      "attack": 103,
      "defense": 85,
      "specialAttack": 60,
      "specialDefense": 85,
      "speed": 82
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/962.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/962.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/962.ogg",
    "moves": [
      {
        "id": 17,
        "name": "wing-attack",
        "type": "flying",
        "power": 60,
        "accuracy": 100,
        "pp": 35,
        "damageClass": "physical"
      },
      {
        "id": 282,
        "name": "knock-off",
        "type": "dark",
        "power": 65,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 529,
        "name": "drill-run",
        "type": "ground",
        "power": 80,
        "accuracy": 95,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 444,
        "name": "stone-edge",
        "type": "rock",
        "power": 100,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      }
    ]
  },
  "964": {
    "id": 964,
    "number": 964,
    "name": "palafin-zero",
    "types": [
      "water"
    ],
    "stats": {
      "hp": 100,
      "attack": 70,
      "defense": 72,
      "specialAttack": 53,
      "specialDefense": 62,
      "speed": 100
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/964.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/964.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/964.ogg",
    "moves": [
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 586,
        "name": "boomburst",
        "type": "normal",
        "power": 140,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "966": {
    "id": 966,
    "number": 966,
    "name": "revavroom",
    "types": [
      "steel",
      "poison"
    ],
    "stats": {
      "hp": 80,
      "attack": 119,
      "defense": 90,
      "specialAttack": 54,
      "specialDefense": 67,
      "speed": 90
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/966.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/966.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/966.ogg",
    "moves": [
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 667,
        "name": "high-horsepower",
        "type": "ground",
        "power": 95,
        "accuracy": 95,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 428,
        "name": "zen-headbutt",
        "type": "psychic",
        "power": 80,
        "accuracy": 90,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "968": {
    "id": 968,
    "number": 968,
    "name": "orthworm",
    "types": [
      "steel"
    ],
    "stats": {
      "hp": 70,
      "attack": 85,
      "defense": 145,
      "specialAttack": 60,
      "specialDefense": 55,
      "speed": 65
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/968.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/968.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/968.ogg",
    "moves": [
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 776,
        "name": "body-press",
        "type": "fighting",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 157,
        "name": "rock-slide",
        "type": "rock",
        "power": 75,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "970": {
    "id": 970,
    "number": 970,
    "name": "glimmora",
    "types": [
      "rock",
      "poison"
    ],
    "stats": {
      "hp": 83,
      "attack": 55,
      "defense": 90,
      "specialAttack": 130,
      "specialDefense": 81,
      "speed": 86
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/970.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/970.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/970.ogg",
    "moves": [
      {
        "id": 408,
        "name": "power-gem",
        "type": "rock",
        "power": 80,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "special"
      },
      {
        "id": 482,
        "name": "sludge-wave",
        "type": "poison",
        "power": 95,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 414,
        "name": "earth-power",
        "type": "ground",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "972": {
    "id": 972,
    "number": 972,
    "name": "houndstone",
    "types": [
      "ghost"
    ],
    "stats": {
      "hp": 72,
      "attack": 101,
      "defense": 100,
      "specialAttack": 50,
      "specialDefense": 97,
      "speed": 68
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/972.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/972.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/972.ogg",
    "moves": [
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 706,
        "name": "psychic-fangs",
        "type": "psychic",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "973": {
    "id": 973,
    "number": 973,
    "name": "flamigo",
    "types": [
      "flying",
      "fighting"
    ],
    "stats": {
      "hp": 82,
      "attack": 115,
      "defense": 74,
      "specialAttack": 75,
      "specialDefense": 64,
      "speed": 90
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/973.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/973.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/973.ogg",
    "moves": [
      {
        "id": 17,
        "name": "wing-attack",
        "type": "flying",
        "power": 60,
        "accuracy": 100,
        "pp": 35,
        "damageClass": "physical"
      },
      {
        "id": 490,
        "name": "low-sweep",
        "type": "fighting",
        "power": 65,
        "accuracy": 100,
        "pp": 20,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "975": {
    "id": 975,
    "number": 975,
    "name": "cetitan",
    "types": [
      "ice"
    ],
    "stats": {
      "hp": 170,
      "attack": 113,
      "defense": 65,
      "specialAttack": 45,
      "specialDefense": 55,
      "speed": 73
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/975.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/975.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/975.ogg",
    "moves": [
      {
        "id": 861,
        "name": "ice-spinner",
        "type": "ice",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "977": {
    "id": 977,
    "number": 977,
    "name": "dondozo",
    "types": [
      "water"
    ],
    "stats": {
      "hp": 150,
      "attack": 100,
      "defense": 115,
      "specialAttack": 65,
      "specialDefense": 65,
      "speed": 35
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/977.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/977.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/977.ogg",
    "moves": [
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 856,
        "name": "order-up",
        "type": "dragon",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "978": {
    "id": 978,
    "number": 978,
    "name": "tatsugiri-curly",
    "types": [
      "dragon",
      "water"
    ],
    "stats": {
      "hp": 68,
      "attack": 50,
      "defense": 60,
      "specialAttack": 120,
      "specialDefense": 95,
      "speed": 82
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/978.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/978.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/978.ogg",
    "moves": [
      {
        "id": 406,
        "name": "dragon-pulse",
        "type": "dragon",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 196,
        "name": "icy-wind",
        "type": "ice",
        "power": 55,
        "accuracy": 95,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 679,
        "name": "lunge",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "979": {
    "id": 979,
    "number": 979,
    "name": "annihilape",
    "types": [
      "fighting",
      "ghost"
    ],
    "stats": {
      "hp": 110,
      "attack": 115,
      "defense": 80,
      "specialAttack": 50,
      "specialDefense": 90,
      "speed": 90
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/979.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/979.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/979.ogg",
    "moves": [
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "980": {
    "id": 980,
    "number": 980,
    "name": "clodsire",
    "types": [
      "poison",
      "ground"
    ],
    "stats": {
      "hp": 130,
      "attack": 75,
      "defense": 60,
      "specialAttack": 45,
      "specialDefense": 100,
      "speed": 20
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/980.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/980.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/980.ogg",
    "moves": [
      {
        "id": 441,
        "name": "gunk-shot",
        "type": "poison",
        "power": 120,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 224,
        "name": "megahorn",
        "type": "bug",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 710,
        "name": "liquidation",
        "type": "water",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "981": {
    "id": 981,
    "number": 981,
    "name": "farigiraf",
    "types": [
      "normal",
      "psychic"
    ],
    "stats": {
      "hp": 120,
      "attack": 90,
      "defense": 70,
      "specialAttack": 110,
      "specialDefense": 70,
      "speed": 60
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/981.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/981.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/981.ogg",
    "moves": [
      {
        "id": 304,
        "name": "hyper-voice",
        "type": "normal",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "982": {
    "id": 982,
    "number": 982,
    "name": "dudunsparce-two-segment",
    "types": [
      "normal"
    ],
    "stats": {
      "hp": 125,
      "attack": 100,
      "defense": 80,
      "specialAttack": 85,
      "specialDefense": 75,
      "speed": 55
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/982.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/982.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/982.ogg",
    "moves": [
      {
        "id": 586,
        "name": "boomburst",
        "type": "normal",
        "power": 140,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 861,
        "name": "ice-spinner",
        "type": "ice",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "983": {
    "id": 983,
    "number": 983,
    "name": "kingambit",
    "types": [
      "dark",
      "steel"
    ],
    "stats": {
      "hp": 100,
      "attack": 135,
      "defense": 120,
      "specialAttack": 60,
      "specialDefense": 85,
      "speed": 50
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/983.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/983.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/983.ogg",
    "moves": [
      {
        "id": 869,
        "name": "kowtow-cleave",
        "type": "dark",
        "power": 85,
        "accuracy": null,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 442,
        "name": "iron-head",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 404,
        "name": "x-scissor",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 421,
        "name": "shadow-claw",
        "type": "ghost",
        "power": 70,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "984": {
    "id": 984,
    "number": 984,
    "name": "great-tusk",
    "types": [
      "ground",
      "fighting"
    ],
    "stats": {
      "hp": 115,
      "attack": 131,
      "defense": 131,
      "specialAttack": 53,
      "specialDefense": 53,
      "speed": 87
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/984.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/984.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/984.ogg",
    "moves": [
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 224,
        "name": "megahorn",
        "type": "bug",
        "power": 120,
        "accuracy": 85,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "987": {
    "id": 987,
    "number": 987,
    "name": "flutter-mane",
    "types": [
      "ghost",
      "fairy"
    ],
    "stats": {
      "hp": 55,
      "attack": 55,
      "defense": 55,
      "specialAttack": 135,
      "specialDefense": 135,
      "speed": 135
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/987.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/987.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/987.ogg",
    "moves": [
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 585,
        "name": "moonblast",
        "type": "fairy",
        "power": 95,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 399,
        "name": "dark-pulse",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "991": {
    "id": 991,
    "number": 991,
    "name": "iron-bundle",
    "types": [
      "ice",
      "water"
    ],
    "stats": {
      "hp": 56,
      "attack": 80,
      "defense": 114,
      "specialAttack": 124,
      "specialDefense": 60,
      "speed": 136
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/991.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/991.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/991.ogg",
    "moves": [
      {
        "id": 58,
        "name": "ice-beam",
        "type": "ice",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 56,
        "name": "hydro-pump",
        "type": "water",
        "power": 110,
        "accuracy": 80,
        "pp": 5,
        "damageClass": "special"
      },
      {
        "id": 314,
        "name": "air-cutter",
        "type": "flying",
        "power": 60,
        "accuracy": 95,
        "pp": 25,
        "damageClass": "special"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "992": {
    "id": 992,
    "number": 992,
    "name": "iron-hands",
    "types": [
      "fighting",
      "electric"
    ],
    "stats": {
      "hp": 154,
      "attack": 140,
      "defense": 108,
      "specialAttack": 50,
      "specialDefense": 68,
      "speed": 50
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/992.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/992.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/992.ogg",
    "moves": [
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 9,
        "name": "thunder-punch",
        "type": "electric",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 583,
        "name": "play-rough",
        "type": "fairy",
        "power": 90,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "994": {
    "id": 994,
    "number": 994,
    "name": "iron-moth",
    "types": [
      "fire",
      "poison"
    ],
    "stats": {
      "hp": 80,
      "attack": 70,
      "defense": 60,
      "specialAttack": 140,
      "specialDefense": 110,
      "speed": 110
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/994.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/994.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/994.ogg",
    "moves": [
      {
        "id": 53,
        "name": "flamethrower",
        "type": "fire",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 482,
        "name": "sludge-wave",
        "type": "poison",
        "power": 95,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 405,
        "name": "bug-buzz",
        "type": "bug",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "998": {
    "id": 998,
    "number": 998,
    "name": "baxcalibur",
    "types": [
      "dragon",
      "ice"
    ],
    "stats": {
      "hp": 115,
      "attack": 145,
      "defense": 92,
      "specialAttack": 75,
      "specialDefense": 86,
      "speed": 87
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/998.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/998.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/998.ogg",
    "moves": [
      {
        "id": 337,
        "name": "dragon-claw",
        "type": "dragon",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 556,
        "name": "icicle-crash",
        "type": "ice",
        "power": 85,
        "accuracy": 90,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "1000": {
    "id": 1000,
    "number": 1000,
    "name": "gholdengo",
    "types": [
      "steel",
      "ghost"
    ],
    "stats": {
      "hp": 87,
      "attack": 60,
      "defense": 95,
      "specialAttack": 133,
      "specialDefense": 91,
      "speed": 84
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1000.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/1000.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/1000.ogg",
    "moves": [
      {
        "id": 430,
        "name": "flash-cannon",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 94,
        "name": "psychic",
        "type": "psychic",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 57,
        "name": "surf",
        "type": "water",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  },
  "1005": {
    "id": 1005,
    "number": 1005,
    "name": "roaring-moon",
    "types": [
      "dragon",
      "dark"
    ],
    "stats": {
      "hp": 105,
      "attack": 139,
      "defense": 71,
      "specialAttack": 55,
      "specialDefense": 101,
      "speed": 119
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1005.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/1005.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/1005.ogg",
    "moves": [
      {
        "id": 337,
        "name": "dragon-claw",
        "type": "dragon",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 242,
        "name": "crunch",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      },
      {
        "id": 404,
        "name": "x-scissor",
        "type": "bug",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "1006": {
    "id": 1006,
    "number": 1006,
    "name": "iron-valiant",
    "types": [
      "fairy",
      "fighting"
    ],
    "stats": {
      "hp": 74,
      "attack": 130,
      "defense": 90,
      "specialAttack": 120,
      "specialDefense": 60,
      "speed": 116
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1006.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/1006.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/1006.ogg",
    "moves": [
      {
        "id": 585,
        "name": "moonblast",
        "type": "fairy",
        "power": 95,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 280,
        "name": "brick-break",
        "type": "fighting",
        "power": 75,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 348,
        "name": "leaf-blade",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      },
      {
        "id": 675,
        "name": "throat-chop",
        "type": "dark",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "physical"
      }
    ]
  },
  "1013": {
    "id": 1013,
    "number": 1013,
    "name": "sinistcha",
    "types": [
      "grass",
      "ghost"
    ],
    "stats": {
      "hp": 71,
      "attack": 60,
      "defense": 106,
      "specialAttack": 121,
      "specialDefense": 80,
      "speed": 70
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1013.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/1013.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/1013.ogg",
    "moves": [
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 247,
        "name": "shadow-ball",
        "type": "ghost",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 503,
        "name": "scald",
        "type": "water",
        "power": 80,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 202,
        "name": "giga-drain",
        "type": "grass",
        "power": 75,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      }
    ]
  },
  "1018": {
    "id": 1018,
    "number": 1018,
    "name": "archaludon",
    "types": [
      "steel",
      "dragon"
    ],
    "stats": {
      "hp": 90,
      "attack": 105,
      "defense": 130,
      "specialAttack": 125,
      "specialDefense": 65,
      "speed": 85
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1018.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/1018.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/1018.ogg",
    "moves": [
      {
        "id": 430,
        "name": "flash-cannon",
        "type": "steel",
        "power": 80,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 406,
        "name": "dragon-pulse",
        "type": "dragon",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 85,
        "name": "thunderbolt",
        "type": "electric",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      },
      {
        "id": 89,
        "name": "earthquake",
        "type": "ground",
        "power": 100,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "physical"
      }
    ]
  },
  "1019": {
    "id": 1019,
    "number": 1019,
    "name": "hydrapple",
    "types": [
      "grass",
      "dragon"
    ],
    "stats": {
      "hp": 106,
      "attack": 80,
      "defense": 110,
      "specialAttack": 120,
      "specialDefense": 80,
      "speed": 44
    },
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1019.png",
    "animatedPhoto": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/1019.gif",
    "cry": "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/1019.ogg",
    "moves": [
      {
        "id": 412,
        "name": "energy-ball",
        "type": "grass",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 406,
        "name": "dragon-pulse",
        "type": "dragon",
        "power": 85,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 414,
        "name": "earth-power",
        "type": "ground",
        "power": 90,
        "accuracy": 100,
        "pp": 10,
        "damageClass": "special"
      },
      {
        "id": 676,
        "name": "pollen-puff",
        "type": "bug",
        "power": 90,
        "accuracy": 100,
        "pp": 15,
        "damageClass": "special"
      }
    ]
  }
});
  const api = Object.freeze({ byId });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else { window.PBACampaign = window.PBACampaign || {}; window.PBACampaign.CampaignBattleFallbackCatalog = api; }
})();
