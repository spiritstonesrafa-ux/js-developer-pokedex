(function () {
  const Static = typeof module !== 'undefined' && module.exports
    ? require('./campaign-pokemon-catalog.js')
    : window.PBACampaign.CampaignPokemonCatalog;
  if (!Static) throw new Error('CampaignPokemonCatalog must load before campaign-catalog.');
  const record = id => {
    const entry = Static.byId[Number(id)];
    if (!entry) throw new Error(`Missing canonical campaign metadata for #${id}.`);
    return entry;
  };
  const draftIdsByGeneration = Object.freeze({
    1: Object.freeze([3,6,9,143,7,8,25,38,59,65,68,94,131,149,130,141]),
    2: Object.freeze([154,157,160,181,169,182,199,212,214,229,242,248,215,225,230,233]),
    3: Object.freeze([254,257,260,282,262,272,276,277,286,306,319,330,350,365,373,376]),
    4: Object.freeze([389,392,395,461,398,405,407,445,462,468,477,478,472,473,475,437]),
    5: Object.freeze([497,500,503,596,510,526,530,553,597,609,612,635,637,628,623,626]),
    6: Object.freeze([652,655,658,706,663,681,691,700,701,707,709,713,697,699,692,715]),
    7: Object.freeze([724,745,784,733,734,746,750,758,763,768,776,778,780,781,743,752]),
    8: Object.freeze([812,815,818,823,826,849,851,858,869,862,867,873,879,884,886,887]),
    9: Object.freeze([908,911,914,959,920,923,960,962,964,966,968,970,973,977,983,998])
  });
  const DRAFT = Object.freeze(Object.values(draftIdsByGeneration).flat().map(record));
  const masterRows = [
    ['normal','Aster','Mestre do Equilíbrio','Insígnia do Horizonte',2,[242,264,335]],
    ['fire','Kael','Mestre das Chamas','Insígnia da Brasa',4,[38,59,609]],
    ['water','Marina','Guardiã das Marés','Insígnia da Maré',3,[131,350,423]],
    ['electric','Volt','Condutor da Tempestade','Insígnia do Pulso',3,[405,466,849]],
    ['grass','Flora','Mestre do Bosque','Insígnia do Broto',3,[407,549,841]],
    ['ice','Yara','Guardiã do Inverno','Insígnia do Cristal',4,[471,975,713]],
    ['fighting','Dante','Mestre da Vanguarda','Insígnia do Punho',4,[68,286,701]],
    ['poison','Vesper','Mestre da Alquimia','Insígnia da Névoa',3,[169,454,691]],
    ['ground','Terra','Guardião do Vale','Insígnia do Estrato',4,[330,553,750]],
    ['flying','Aero','Mestre dos Ventos','Insígnia da Corrente',3,[227,398,715]],
    ['psychic','Orion','Mestre do Horizonte Mental','Insígnia do Prisma',4,[65,199,858]],
    ['bug','Nilo','Guardião do Enxame','Insígnia da Trama',3,[212,214,768]],
    ['rock','Petra','Mestre do Monólito','Insígnia do Granito',5,[248,526,697]],
    ['ghost','Nyra','Guardiã do Véu','Insígnia do Eclipse',4,[94,477,778]],
    ['dragon','Riven','Mestre do Céu Antigo','Insígnia Draco',5,[149,445,887]],
    ['dark','Noctis','Mestre do Crepúsculo','Insígnia do Abismo',4,[229,510,983]],
    ['steel','Ferrum','Guardião da Forja','Insígnia da Liga',5,[376,530,681]],
    ['fairy','Lumi','Mestre do Encanto','Insígnia do Aurora',4,[303,468,869]]
  ];
  const MASTERS = Object.freeze(masterRows.map(([type,trainerName,trainerTitle,badgeName,difficulty,team]) => Object.freeze({
    challengeId: `master-${type}`, type, trainerName, trainerTitle, badgeName, difficulty,
    description: `Enfrente ${trainerName}, ${trainerTitle}.`, team: Object.freeze(team.map(record))
  })));
  const MASTER_SPECIES = Object.freeze(MASTERS.flatMap(master => master.team));
  const SUPER_TEAM = Object.freeze([493,890,150].map(record));
  const SUPER_AUDIT = Object.freeze([
    {id:493,name:'arceus',bst:720,attack:120,specialAttack:120,speed:120,selected:true,reason:'GLOBAL_RANK_1'},
    {id:890,name:'eternatus',bst:690,attack:85,specialAttack:145,speed:130,selected:true,reason:'GLOBAL_RANK_2'},
    {id:150,name:'mewtwo',bst:680,attack:110,specialAttack:154,speed:130,selected:true,reason:'GLOBAL_RANK_3'},
    {id:384,name:'rayquaza',bst:680,attack:150,specialAttack:150,speed:95,selected:false,reason:'LOWER_TIEBREAK'},
    {id:249,name:'lugia',bst:680,attack:90,specialAttack:90,speed:110,selected:false,reason:'LOWER_TIEBREAK'},
    {id:250,name:'ho-oh',bst:680,attack:130,specialAttack:110,speed:90,selected:false,reason:'LOWER_TIEBREAK'},
    {id:382,name:'kyogre',bst:670,attack:100,specialAttack:150,speed:90,selected:false,reason:'LOWER_BST'},
    {id:383,name:'groudon',bst:670,attack:150,specialAttack:100,speed:90,selected:false,reason:'LOWER_BST'},
    {id:289,name:'slaking',bst:670,attack:160,specialAttack:95,speed:100,selected:false,reason:'LOWER_BST'},
    {id:635,name:'hydreigon',bst:600,attack:105,specialAttack:125,speed:98,selected:false,reason:'LOWER_BST'}
  ].map(Object.freeze));
  const api = Object.freeze({
    DRAFT, MASTERS, MASTER_SPECIES, SUPER_TEAM, SUPER_AUDIT,
    DRAFT_IDS_BY_GENERATION: draftIdsByGeneration,
    CANONICAL_BY_ID: Static.byId,
    byId: id => Static.byId[Number(id)] || null,
    allMasterIds: MASTER_SPECIES.map(entry => entry.id),
    startingStats: Object.freeze({
      min: Math.min(...DRAFT.map(entry => entry.bst)),
      max: Math.max(...DRAFT.map(entry => entry.bst)),
      average: Math.round(DRAFT.reduce((sum, entry) => sum + entry.bst, 0) / DRAFT.length)
    })
  });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else { window.PBACampaign = window.PBACampaign || {}; Object.assign(window.PBACampaign, api); }
})();


