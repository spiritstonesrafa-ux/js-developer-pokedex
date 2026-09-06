(function () {
 const p=(id,name,types,bst,generation)=>Object.freeze({id,name,types:Object.freeze(types),bst,generation,sprite:`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`});
 const DRAFT=Object.freeze([
 p(3,'venusaur',['grass','poison'],525,1),p(6,'charizard',['fire','flying'],534,1),p(9,'blastoise',['water'],530,1),p(143,'snorlax',['normal'],540,1),
 p(154,'meganium',['grass'],525,2),p(157,'typhlosion',['fire'],534,2),p(160,'feraligatr',['water'],530,2),p(181,'ampharos',['electric'],510,2),
 p(254,'sceptile',['grass'],530,3),p(257,'blaziken',['fire','fighting'],530,3),p(260,'swampert',['water','ground'],535,3),p(282,'gardevoir',['psychic','fairy'],518,3),
 p(389,'torterra',['grass','ground'],525,4),p(392,'infernape',['fire','fighting'],534,4),p(395,'empoleon',['water','steel'],530,4),p(461,'weavile',['dark','ice'],510,4),
 p(497,'serperior',['grass'],528,5),p(500,'emboar',['fire','fighting'],528,5),p(503,'samurott',['water'],528,5),p(596,'galvantula',['bug','electric'],472,5),
 p(652,'chesnaught',['grass','fighting'],530,6),p(655,'delphox',['fire','psychic'],534,6),p(658,'greninja',['water','dark'],530,6),p(706,'goodra',['dragon'],600,6),
 p(724,'decidueye',['grass','ghost'],530,7),p(745,'lycanroc',['rock'],487,7),p(784,'kommo-o',['dragon','fighting'],600,7),p(733,'toucannon',['normal','flying'],485,7),
 p(812,'rillaboom',['grass'],530,8),p(815,'cinderace',['fire'],530,8),p(818,'inteleon',['water'],530,8),p(823,'corviknight',['flying','steel'],495,8),
 p(908,'meowscarada',['grass','dark'],530,9),p(911,'skeledirge',['fire','ghost'],530,9),p(914,'quaquaval',['water','fighting'],530,9),p(959,'tinkaton',['fairy','steel'],506,9)]);
 const M=[
 ['normal','Aster','Mestre do Equilíbrio','Insígnia do Horizonte',2,[[242,'blissey',['normal'],540],[264,'linoone',['normal'],420],[335,'zangoose',['normal'],458]]],
 ['fire','Kael','Mestre das Chamas','Insígnia da Brasa',4,[[38,'ninetales',['fire'],505],[59,'arcanine',['fire'],555],[609,'chandelure',['ghost','fire'],520]]],
 ['water','Marina','Guardiã das Marés','Insígnia da Maré',3,[[131,'lapras',['water','ice'],535],[350,'milotic',['water'],540],[423,'gastrodon',['water','ground'],475]]],
 ['electric','Volt','Condutor da Tempestade','Insígnia do Pulso',3,[[405,'luxray',['electric'],523],[466,'electivire',['electric'],540],[849,'toxtricity',['electric','poison'],502]]],
 ['grass','Flora','Mestre do Bosque','Insígnia do Broto',3,[[407,'roserade',['grass','poison'],515],[549,'lilligant',['grass'],480],[841,'flapple',['grass','dragon'],485]]],
 ['ice','Yara','Guardiã do Inverno','Insígnia do Cristal',4,[[471,'glaceon',['ice'],525],[975,'cetitan',['ice'],521],[713,'avalugg',['ice'],514]]],
 ['fighting','Dante','Mestre da Vanguarda','Insígnia do Punho',4,[[68,'machamp',['fighting'],505],[286,'breloom',['grass','fighting'],460],[701,'hawlucha',['fighting','flying'],500]]],
 ['poison','Vesper','Mestre da Alquimia','Insígnia da Névoa',3,[[169,'crobat',['poison','flying'],535],[454,'toxicroak',['poison','fighting'],490],[691,'dragalge',['poison','dragon'],494]]],
 ['ground','Terra','Guardião do Vale','Insígnia do Estrato',4,[[330,'flygon',['ground','dragon'],520],[553,'krookodile',['ground','dark'],519],[750,'mudsdale',['ground'],500]]],
 ['flying','Aero','Mestre dos Ventos','Insígnia da Corrente',3,[[227,'skarmory',['steel','flying'],465],[398,'staraptor',['normal','flying'],485],[715,'noivern',['flying','dragon'],535]]],
 ['psychic','Orion','Mestre do Horizonte Mental','Insígnia do Prisma',4,[[65,'alakazam',['psychic'],500],[199,'slowking',['water','psychic'],490],[858,'hatterene',['psychic','fairy'],510]]],
 ['bug','Nilo','Guardião do Enxame','Insígnia da Trama',3,[[212,'scizor',['bug','steel'],500],[214,'heracross',['bug','fighting'],500],[768,'golisopod',['bug','water'],530]]],
 ['rock','Petra','Mestre do Monólito','Insígnia do Granito',5,[[248,'tyranitar',['rock','dark'],600],[526,'gigalith',['rock'],515],[697,'tyrantrum',['rock','dragon'],521]]],
 ['ghost','Nyra','Guardiã do Véu','Insígnia do Eclipse',4,[[94,'gengar',['ghost','poison'],500],[477,'dusknoir',['ghost'],525],[778,'mimikyu',['ghost','fairy'],476]]],
 ['dragon','Riven','Mestre do Céu Antigo','Insígnia Draco',5,[[149,'dragonite',['dragon','flying'],600],[445,'garchomp',['dragon','ground'],600],[887,'dragapult',['dragon','ghost'],600]]],
 ['dark','Noctis','Mestre do Crepúsculo','Insígnia do Abismo',4,[[229,'houndoom',['dark','fire'],500],[510,'liepard',['dark'],446],[983,'kingambit',['dark','steel'],550]]],
 ['steel','Ferrum','Guardião da Forja','Insígnia da Liga',5,[[376,'metagross',['steel','psychic'],600],[530,'excadrill',['ground','steel'],508],[681,'aegislash',['steel','ghost'],520]]],
 ['fairy','Lumi','Mestre do Encanto','Insígnia do Aurora',4,[[303,'mawile',['steel','fairy'],380],[468,'togekiss',['fairy','flying'],545],[869,'alcremie',['fairy'],495]]]
 ];
 const MASTERS=Object.freeze(M.map(([type,trainerName,trainerTitle,badgeName,difficulty,team])=>Object.freeze({challengeId:`master-${type}`,type,trainerName,trainerTitle,badgeName,difficulty,description:`Enfrente ${trainerName}, ${trainerTitle}.`,team:Object.freeze(team.map(x=>p(x[0],x[1],x[2],x[3],null)))})));
 const MASTER_SPECIES=Object.freeze(MASTERS.flatMap(m=>m.team));
 // Elite trio intentionally comes from the objective master ranking; it is a rematch roster, not a separate recruit catalog.
 const SUPER_TEAM=Object.freeze([p(887,'dragapult',['dragon','ghost'],600,9),p(376,'metagross',['steel','psychic'],600,3),p(149,'dragonite',['dragon','flying'],600,1)]);
 const ALL=Object.freeze([...DRAFT,...MASTER_SPECIES]); const byId=id=>ALL.find(x=>x.id===Number(id))||SUPER_TEAM.find(x=>x.id===Number(id))||null;
 const api=Object.freeze({DRAFT,MASTERS,MASTER_SPECIES,SUPER_TEAM,byId,allMasterIds:MASTER_SPECIES.map(x=>x.id),startingStats:{min:Math.min(...DRAFT.map(x=>x.bst)),max:Math.max(...DRAFT.map(x=>x.bst)),average:Math.round(DRAFT.reduce((s,x)=>s+x.bst,0)/DRAFT.length)}});
 if(typeof module!=='undefined'&&module.exports)module.exports=api; else {window.PBACampaign=window.PBACampaign||{};Object.assign(window.PBACampaign,api);}
})();
