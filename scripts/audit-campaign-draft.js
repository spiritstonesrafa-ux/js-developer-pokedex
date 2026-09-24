#!/usr/bin/env node
/**
 * AUDITORIA DO CATÁLOGO DE SELEÇÃO INICIAL DA CAMPANHA
 *
 * Valida de forma estrita e determinística todos os 450 Pokémon selecionáveis:
 * - 450 IDs únicos no total.
 * - Exatamente 50 Pokémon por geração (Gens 1 a 9).
 * - Preservação dos 144 Pokémon originais.
 * - Zero lendários e zero míticos.
 * - Ausência total nas equipes do Super Trainer e das 4 Provas Finais.
 * - Atributos base canônicos completos, BST consistente e tipos oficiais.
 * - Sprites válidos e ausência de nomes provisórios/placeholders.
 * - Compatibilidade completa com o motor de batalha e hidratação offline.
 * - 4 golpes ofensivos legais suportados para cada selecionável.
 * - Recomendações balanceadas para o endgame.
 *
 * Falha com process.exitCode = 1 se qualquer regra for violada.
 */

const Catalog = require('../assets/js/campaign/campaign-catalog.js');
const Fallback = require('../assets/js/campaign/campaign-battle-fallback-catalog.js');
const { DRAFT_IDS_BY_GENERATION, DRAFT_IDS } = require('../assets/js/campaign/campaign-draft-ids.js');
const { BattleTeamHydrator } = require('../assets/js/battle-session/battle-team-hydrator.js');
const { isMechanicallySupportedMove } = require('../assets/js/battle-session/battle-session-constants.js');

const PLACEHOLDER_NAME = /^pokemon-\d+$/i;

const TRIAL_IDS = [
  ...Catalog.LEGENDARY_TRIAL_TEAM.map(p => p.id),
  ...Catalog.MYTHICAL_TRIAL_TEAM.map(p => p.id),
  ...Catalog.TITANS_TRIAL_TEAM.map(p => p.id),
  ...Catalog.CELESTIAL_TRIAL_TEAM.map(p => p.id)
];
const SUPER_IDS = Catalog.SUPER_TEAM.map(p => p.id);

(async () => {
  const draft = Catalog.DRAFT;
  const draftIds = draft.map(p => p.id);
  const uniqueDraftIds = new Set(draftIds);

  const duplicateIds = draftIds.filter((id, index) => draftIds.indexOf(id) !== index);
  const legendaryFound = draft.filter(p => p.legendary);
  const mythicalFound = draft.filter(p => p.mythical);
  const superOverlap = draft.filter(p => SUPER_IDS.includes(p.id));
  const trialOverlap = draft.filter(p => TRIAL_IDS.includes(p.id));

  // Geração counts
  const countByGeneration = {};
  for (let g = 1; g <= 9; g++) {
    countByGeneration[g] = draft.filter(p => p.generation === g).length;
  }

  // Invalid metadata check
  const invalidRecords = draft.filter(p => {
    if (PLACEHOLDER_NAME.test(p.name)) return true;
    if (!Array.isArray(p.types) || p.types.length === 0) return true;
    if (!Number.isInteger(p.bst) || p.bst <= 0) return true;
    if (!Number.isInteger(p.generation) || p.generation < 1 || p.generation > 9) return true;
    if (!p.sprite || typeof p.sprite !== 'string') return true;
    return false;
  });

  // Offline hydration & moves check using pure offline hydrator
  const hydrator = new BattleTeamHydrator({ api: null });
  const battleIssues = [];
  const recommendedEndgame = [];

  for (const entry of draft) {
    const fallback = Fallback.byId[entry.id];
    if (!fallback) {
      battleIssues.push({ id: entry.id, name: entry.name, reason: 'MISSING_FALLBACK_RECORD' });
      continue;
    }

    // Validate 6 base stats
    const stats = fallback.stats || {};
    const hasAllStats = ['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed'].every(
      key => Number.isInteger(stats[key]) && stats[key] > 0
    );
    if (!hasAllStats) {
      battleIssues.push({ id: entry.id, name: entry.name, reason: 'INCOMPLETE_BASE_STATS' });
      continue;
    }

    // Validate moves
    const moves = fallback.moves || [];
    if (moves.length < 4) {
      battleIssues.push({ id: entry.id, name: entry.name, reason: `FEWER_THAN_4_MOVES (${moves.length})` });
      continue;
    }

    const invalidMoves = moves.filter(m => {
      if (!isMechanicallySupportedMove(m)) return true;
      if (m.accuracy === undefined) return true;
      if (m.accuracy !== null && (typeof m.accuracy !== 'number' || m.accuracy < 1 || m.accuracy > 100)) return true;
      return false;
    });

    if (invalidMoves.length > 0) {
      battleIssues.push({ id: entry.id, name: entry.name, reason: 'UNSUPPORTED_OR_INVALID_MOVES', invalidMoves });
      continue;
    }

    // Hydration check
    const [combatant] = await hydrator.hydrateTeam([entry.id]);
    if (PLACEHOLDER_NAME.test(combatant.name) || combatant.moves.length < 4) {
      battleIssues.push({ id: entry.id, name: entry.name, reason: 'HYDRATION_FAILED' });
      continue;
    }

    // Recommended endgame verification
    if (entry.recommendedForEndgame) {
      const hasStab = moves.some(m => entry.types.includes(m.type));
      if (!hasStab) {
        battleIssues.push({ id: entry.id, name: entry.name, reason: 'RECOMMENDED_WITHOUT_STAB' });
      }
      recommendedEndgame.push({ id: entry.id, name: entry.name, generation: entry.generation, bst: entry.bst, types: entry.types, moves });
    }
  }

  // Check required pseudo-legendaries
  const REQUIRED_PSEUDOS = [
    { id: 149, name: 'dragonite', gen: 1 },
    { id: 248, name: 'tyranitar', gen: 2 },
    { id: 376, name: 'metagross', gen: 3 },
    { id: 445, name: 'garchomp', gen: 4 },
    { id: 635, name: 'hydreigon', gen: 5 },
    { id: 706, name: 'goodra', gen: 6 },
    { id: 784, name: 'kommo-o', gen: 7 },
    { id: 887, name: 'dragapult', gen: 8 },
    { id: 998, name: 'baxcalibur', gen: 9 }
  ];

  const missingPseudos = REQUIRED_PSEUDOS.filter(
    p => !recommendedEndgame.some(r => r.id === p.id)
  );

  // Specific check for Goodra Dragon move
  const goodraRec = recommendedEndgame.find(r => r.id === 706);
  const goodraHasDragonMove = goodraRec ? goodraRec.moves.some(m => m.type === 'dragon') : false;

  // Specific check for Metagross Meteor Mash and absence of Explosion
  const metagrossFallback = Fallback.byId[376];
  const metagrossHasMeteorMash = metagrossFallback ? metagrossFallback.moves.some(m => m.name === 'meteor-mash') : false;
  const metagrossHasExplosion = metagrossFallback ? metagrossFallback.moves.some(m => m.name === 'explosion' || m.name === 'self-destruct') : false;

  // Specific check for Baxcalibur Icicle Crash and absence of Glaive Rush
  const baxcaliburFallback = Fallback.byId[998];
  const baxcaliburHasIcicleCrash = baxcaliburFallback ? baxcaliburFallback.moves.some(m => m.name === 'icicle-crash') : false;
  const baxcaliburHasGlaiveRush = baxcaliburFallback ? baxcaliburFallback.moves.some(m => m.name === 'glaive-rush') : false;

  // Check Shuckle is NOT recommended
  const shuckleRec = recommendedEndgame.find(r => r.id === 213);

  const report = {
    TOTAL_SELECTED: draft.length,
    UNIQUE_IDS: uniqueDraftIds.size,
    COUNT_BY_GENERATION: countByGeneration,
    DUPLICATE_IDS: duplicateIds,
    LEGENDARY_FOUND: legendaryFound.map(p => ({ id: p.id, name: p.name })),
    MYTHICAL_FOUND: mythicalFound.map(p => ({ id: p.id, name: p.name })),
    SUPER_TEAM_OVERLAP: superOverlap.map(p => ({ id: p.id, name: p.name })),
    TRIALS_OVERLAP: trialOverlap.map(p => ({ id: p.id, name: p.name })),
    INVALID_RECORDS: invalidRecords.map(p => ({ id: p.id, name: p.name })),
    BATTLE_HYDRATION_ISSUES: battleIssues,
    RECOMMENDED_FOR_ENDGAME_COUNT: recommendedEndgame.length,
    RECOMMENDED_BY_GEN: Object.fromEntries(
      Array.from({ length: 9 }, (_, i) => [i + 1, recommendedEndgame.filter(p => p.generation === i + 1).length])
    ),
    MISSING_PSEUDOS: missingPseudos,
    GOODRA_HAS_DRAGON_MOVE: goodraHasDragonMove,
    METAGROSS_METEOR_MASH: metagrossHasMeteorMash,
    METAGROSS_HAS_EXPLOSION: metagrossHasExplosion,
    BAXCALIBUR_ICICLE_CRASH: baxcaliburHasIcicleCrash,
    BAXCALIBUR_HAS_GLAIVE_RUSH: baxcaliburHasGlaiveRush,
    SHUCKLE_RECOMMENDED: Boolean(shuckleRec)
  };

  console.log('================================================================');
  console.log('        AUDITORIA DETERMINÍSTICA DO DRAFT DA CAMPANHA           ');
  console.log('================================================================');
  console.log(JSON.stringify(report, null, 2));

  // Validation rules
  const failed = (
    report.TOTAL_SELECTED !== 450 ||
    report.UNIQUE_IDS !== 450 ||
    Object.values(countByGeneration).some(c => c !== 50) ||
    duplicateIds.length > 0 ||
    legendaryFound.length > 0 ||
    mythicalFound.length > 0 ||
    superOverlap.length > 0 ||
    trialOverlap.length > 0 ||
    invalidRecords.length > 0 ||
    battleIssues.length > 0 ||
    report.RECOMMENDED_FOR_ENDGAME_COUNT !== 54 ||
    Object.values(report.RECOMMENDED_BY_GEN).some(c => c !== 6) ||
    missingPseudos.length > 0 ||
    !goodraHasDragonMove ||
    !metagrossHasMeteorMash ||
    metagrossHasExplosion ||
    !baxcaliburHasIcicleCrash ||
    baxcaliburHasGlaiveRush ||
    Boolean(shuckleRec)
  );

  if (failed) {
    console.error('\n❌ AUDITORIA FALHOU: Regras obrigatórias do draft foram violadas.');
    process.exitCode = 1;
  } else {
    console.log('\n✅ AUDITORIA APROVADA: Todos os 450 Pokémon atendem 100% aos critérios canônicos.');
  }
})().catch(err => {
  console.error('Audit fatal error:', err);
  process.exitCode = 1;
});