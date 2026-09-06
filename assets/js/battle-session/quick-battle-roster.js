/** Static, curated Quick Battle roster (PBA-014D). */
(function () {
  const QUICK_BATTLE_ROSTER = Object.freeze([
    { id: 3, name: 'venusaur', generation: 1, types: ['grass', 'poison'] }, { id: 6, name: 'charizard', generation: 1, types: ['fire', 'flying'] },
    { id: 9, name: 'blastoise', generation: 1, types: ['water'] }, { id: 26, name: 'raichu', generation: 1, types: ['electric'] },
    { id: 68, name: 'machamp', generation: 1, types: ['fighting'] }, { id: 94, name: 'gengar', generation: 1, types: ['ghost', 'poison'] },
    { id: 131, name: 'lapras', generation: 1, types: ['water', 'ice'] }, { id: 149, name: 'dragonite', generation: 1, types: ['dragon', 'flying'] },
    { id: 154, name: 'meganium', generation: 2, types: ['grass'] }, { id: 157, name: 'typhlosion', generation: 2, types: ['fire'] },
    { id: 160, name: 'feraligatr', generation: 2, types: ['water'] }, { id: 181, name: 'ampharos', generation: 2, types: ['electric'] },
    { id: 212, name: 'scizor', generation: 2, types: ['bug', 'steel'] }, { id: 214, name: 'heracross', generation: 2, types: ['bug', 'fighting'] },
    { id: 229, name: 'houndoom', generation: 2, types: ['dark', 'fire'] }, { id: 248, name: 'tyranitar', generation: 2, types: ['rock', 'dark'] },
    { id: 254, name: 'sceptile', generation: 3, types: ['grass'] }, { id: 257, name: 'blaziken', generation: 3, types: ['fire', 'fighting'] },
    { id: 260, name: 'swampert', generation: 3, types: ['water', 'ground'] }, { id: 282, name: 'gardevoir', generation: 3, types: ['psychic', 'fairy'] },
    { id: 286, name: 'breloom', generation: 3, types: ['grass', 'fighting'] }, { id: 330, name: 'flygon', generation: 3, types: ['ground', 'dragon'] },
    { id: 350, name: 'milotic', generation: 3, types: ['water'] }, { id: 376, name: 'metagross', generation: 3, types: ['steel', 'psychic'] },
    { id: 389, name: 'torterra', generation: 4, types: ['grass', 'ground'] }, { id: 392, name: 'infernape', generation: 4, types: ['fire', 'fighting'] },
    { id: 395, name: 'empoleon', generation: 4, types: ['water', 'steel'] }, { id: 398, name: 'staraptor', generation: 4, types: ['normal', 'flying'] },
    { id: 405, name: 'luxray', generation: 4, types: ['electric'] }, { id: 407, name: 'roserade', generation: 4, types: ['grass', 'poison'] },
    { id: 445, name: 'garchomp', generation: 4, types: ['dragon', 'ground'] }, { id: 461, name: 'weavile', generation: 4, types: ['dark', 'ice'] },
    { id: 497, name: 'serperior', generation: 5, types: ['grass'] }, { id: 500, name: 'emboar', generation: 5, types: ['fire', 'fighting'] },
    { id: 503, name: 'samurott', generation: 5, types: ['water'] }, { id: 530, name: 'excadrill', generation: 5, types: ['ground', 'steel'] },
    { id: 553, name: 'krookodile', generation: 5, types: ['ground', 'dark'] }, { id: 596, name: 'galvantula', generation: 5, types: ['bug', 'electric'] },
    { id: 609, name: 'chandelure', generation: 5, types: ['ghost', 'fire'] }, { id: 612, name: 'haxorus', generation: 5, types: ['dragon'] },
    { id: 652, name: 'chesnaught', generation: 6, types: ['grass', 'fighting'] }, { id: 655, name: 'delphox', generation: 6, types: ['fire', 'psychic'] },
    { id: 658, name: 'greninja', generation: 6, types: ['water', 'dark'] }, { id: 663, name: 'talonflame', generation: 6, types: ['fire', 'flying'] },
    { id: 681, name: 'aegislash-shield', generation: 6, types: ['steel', 'ghost'] }, { id: 700, name: 'sylveon', generation: 6, types: ['fairy'] },
    { id: 701, name: 'hawlucha', generation: 6, types: ['fighting', 'flying'] }, { id: 706, name: 'goodra', generation: 6, types: ['dragon'] },
    { id: 724, name: 'decidueye', generation: 7, types: ['grass', 'ghost'] }, { id: 727, name: 'incineroar', generation: 7, types: ['fire', 'dark'] },
    { id: 730, name: 'primarina', generation: 7, types: ['water', 'fairy'] }, { id: 745, name: 'lycanroc-midday', generation: 7, types: ['rock'] },
    { id: 750, name: 'mudsdale', generation: 7, types: ['ground'] }, { id: 768, name: 'golisopod', generation: 7, types: ['bug', 'water'] },
    { id: 778, name: 'mimikyu-disguised', generation: 7, types: ['ghost', 'fairy'] }, { id: 784, name: 'kommo-o', generation: 7, types: ['dragon', 'fighting'] },
    { id: 812, name: 'rillaboom', generation: 8, types: ['grass'] }, { id: 815, name: 'cinderace', generation: 8, types: ['fire'] },
    { id: 818, name: 'inteleon', generation: 8, types: ['water'] }, { id: 823, name: 'corviknight', generation: 8, types: ['flying', 'steel'] },
    { id: 849, name: 'toxtricity-amped', generation: 8, types: ['electric', 'poison'] }, { id: 851, name: 'centiskorch', generation: 8, types: ['fire', 'bug'] },
    { id: 858, name: 'hatterene', generation: 8, types: ['psychic', 'fairy'] }, { id: 887, name: 'dragapult', generation: 8, types: ['dragon', 'ghost'] },
    { id: 908, name: 'meowscarada', generation: 9, types: ['grass', 'dark'] }, { id: 911, name: 'skeledirge', generation: 9, types: ['fire', 'ghost'] },
    { id: 914, name: 'quaquaval', generation: 9, types: ['water', 'fighting'] }, { id: 920, name: 'lokix', generation: 9, types: ['bug', 'dark'] },
    { id: 923, name: 'pawmot', generation: 9, types: ['electric', 'fighting'] }, { id: 959, name: 'tinkaton', generation: 9, types: ['fairy', 'steel'] },
    { id: 983, name: 'kingambit', generation: 9, types: ['dark', 'steel'] }, { id: 998, name: 'baxcalibur', generation: 9, types: ['dragon', 'ice'] }
  ].map(entry => Object.freeze({ ...entry, types: Object.freeze([...entry.types]) })));
  const QUICK_BATTLE_ROSTER_IDS = Object.freeze(QUICK_BATTLE_ROSTER.map(entry => entry.id));
  const exportsObj = { QUICK_BATTLE_ROSTER, QUICK_BATTLE_ROSTER_IDS };
  if (typeof module !== 'undefined' && module.exports) module.exports = exportsObj;
  else if (typeof window !== 'undefined') { window.PBABattleSession = window.PBABattleSession || {}; Object.assign(window.PBABattleSession, exportsObj); }
})();
