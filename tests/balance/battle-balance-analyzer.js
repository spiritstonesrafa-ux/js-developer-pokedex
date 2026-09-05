/**
 * ====================================================================
 * ANALISADOR DE BALANCEAMENTO DE BATALHA: (battle-balance-analyzer.js)
 * ====================================================================
 * Ferramenta pura de análise estatística comparativa entre:
 * - MODELO ANTERIOR (Base Stats usados diretamente como Battle Stats)
 * - NOVO MODELO (Level 50 Normalized Stats + Variância 85..100)
 *
 * Utilizado para validação quantitativa dos gates BAL01–BAL40 (PBA-014B).
 */

const BattleStatNormalizer = require('../../assets/js/battle/battle-stat-normalizer.js');
const DamageCalculator = require('../../assets/js/battle/damage-calculator.js');
const TypeEffectiveness = require('../../assets/js/battle/type-effectiveness.js');

// 1. Catálogo do Cohort Representativo
const COHORT_SPECIES = {
  pikachu: { id: 25, name: 'pikachu', category: 'frail', types: ['electric'], base: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 } },
  alakazam: { id: 65, name: 'alakazam', category: 'frail', types: ['psychic'], base: { hp: 55, attack: 50, defense: 45, specialAttack: 135, specialDefense: 95, speed: 120 } },
  gengar: { id: 94, name: 'gengar', category: 'frail', types: ['ghost', 'poison'], base: { hp: 60, attack: 65, defense: 60, specialAttack: 130, specialDefense: 75, speed: 110 } },

  venusaur: { id: 3, name: 'venusaur', category: 'balanced', types: ['grass', 'poison'], base: { hp: 80, attack: 82, defense: 83, specialAttack: 100, specialDefense: 100, speed: 80 } },
  charizard: { id: 6, name: 'charizard', category: 'balanced', types: ['fire', 'flying'], base: { hp: 78, attack: 84, defense: 78, specialAttack: 109, specialDefense: 85, speed: 100 } },
  blastoise: { id: 9, name: 'blastoise', category: 'balanced', types: ['water'], base: { hp: 79, attack: 83, defense: 100, specialAttack: 85, specialDefense: 105, speed: 78 } },
  arcanine: { id: 59, name: 'arcanine', category: 'balanced', types: ['fire'], base: { hp: 90, attack: 110, defense: 80, specialAttack: 100, specialDefense: 80, speed: 95 } },

  machamp: { id: 68, name: 'machamp', category: 'physical_offense', types: ['fighting'], base: { hp: 90, attack: 130, defense: 80, specialAttack: 65, specialDefense: 85, speed: 55 } },
  gyarados: { id: 130, name: 'gyarados', category: 'physical_offense', types: ['water', 'flying'], base: { hp: 95, attack: 125, defense: 79, specialAttack: 60, specialDefense: 100, speed: 81 } },

  snorlax: { id: 143, name: 'snorlax', category: 'bulk', types: ['normal'], base: { hp: 160, attack: 110, defense: 65, specialAttack: 65, specialDefense: 110, speed: 30 } },
  lapras: { id: 131, name: 'lapras', category: 'bulk', types: ['water', 'ice'], base: { hp: 130, attack: 85, defense: 80, specialAttack: 85, specialDefense: 95, speed: 60 } },

  dragonite: { id: 149, name: 'dragonite', category: 'high_power', types: ['dragon', 'flying'], base: { hp: 91, attack: 134, defense: 95, specialAttack: 100, specialDefense: 100, speed: 80 } },
  mewtwo: { id: 150, name: 'mewtwo', category: 'legendary', types: ['psychic'], base: { hp: 106, attack: 110, defense: 90, specialAttack: 154, specialDefense: 90, speed: 130 } }
};

// 2. Catálogo de Golpes nas Faixas de Poder
const COHORT_MOVES = {
  tackle: { id: 33, name: 'tackle', type: 'normal', power: 40, damageClass: 'physical', accuracy: 100 },
  ember: { id: 52, name: 'ember', type: 'fire', power: 40, damageClass: 'special', accuracy: 100 },
  water_gun: { id: 55, name: 'water-gun', type: 'water', power: 40, damageClass: 'special', accuracy: 100 },
  thunder_shock: { id: 84, name: 'thunder-shock', type: 'electric', power: 40, damageClass: 'special', accuracy: 100 },
  vine_whip: { id: 71, name: 'vine-whip', type: 'grass', power: 45, damageClass: 'physical', accuracy: 100 },

  confusion: { id: 93, name: 'confusion', type: 'psychic', power: 50, damageClass: 'special', accuracy: 100 },
  low_kick: { id: 67, name: 'low-kick', type: 'fighting', power: 50, damageClass: 'physical', accuracy: 100 },
  dragon_breath: { id: 225, name: 'dragon-breath', type: 'dragon', power: 60, damageClass: 'special', accuracy: 100 },

  shadow_ball: { id: 247, name: 'shadow-ball', type: 'ghost', power: 80, damageClass: 'special', accuracy: 100 },

  flamethrower: { id: 53, name: 'flamethrower', type: 'fire', power: 90, damageClass: 'special', accuracy: 100 },
  thunderbolt: { id: 85, name: 'thunderbolt', type: 'electric', power: 90, damageClass: 'special', accuracy: 100 },
  ice_beam: { id: 58, name: 'ice-beam', type: 'ice', power: 90, damageClass: 'special', accuracy: 100 },
  surf: { id: 57, name: 'surf', type: 'water', power: 90, damageClass: 'special', accuracy: 100 },
  psychic_move: { id: 94, name: 'psychic', type: 'psychic', power: 90, damageClass: 'special', accuracy: 100 },

  earthquake: { id: 89, name: 'earthquake', type: 'ground', power: 100, damageClass: 'physical', accuracy: 100 },
  hydro_pump: { id: 56, name: 'hydro-pump', type: 'water', power: 110, damageClass: 'special', accuracy: 80 }
};

// 3. Matriz de Confrontos Representativos (>= 20 Casos Reais)
const REPRESENTATIVE_MATCHUPS = [
  // Neutros
  { attacker: 'alakazam', defender: 'snorlax', move: 'psychic_move', desc: 'Alakazam Psychic vs Snorlax (Neutro Especial)' },
  { attacker: 'gengar', defender: 'blastoise', move: 'shadow_ball', desc: 'Gengar Shadow Ball vs Blastoise (Neutro Especial)' },
  { attacker: 'charizard', defender: 'snorlax', move: 'flamethrower', desc: 'Charizard Flamethrower vs Snorlax (Neutro Especial com STAB)' },
  { attacker: 'machamp', defender: 'blastoise', move: 'low_kick', desc: 'Machamp Low Kick vs Blastoise (Neutro Físico com STAB)' },
  { attacker: 'pikachu', defender: 'snorlax', move: 'thunderbolt', desc: 'Pikachu Thunderbolt vs Snorlax (Neutro Especial)' },
  { attacker: 'blastoise', defender: 'snorlax', move: 'surf', desc: 'Blastoise Surf vs Snorlax (Neutro Especial com STAB)' },
  { attacker: 'dragonite', defender: 'blastoise', move: 'dragon_breath', desc: 'Dragonite Dragon Breath vs Blastoise (Neutro Especial)' },
  { attacker: 'mewtwo', defender: 'blastoise', move: 'psychic_move', desc: 'Mewtwo Psychic vs Blastoise (Neutro Lendário Especial)' },

  // Resistidos (0.5x e 0.25x)
  { attacker: 'charizard', defender: 'blastoise', move: 'flamethrower', desc: 'Charizard Flamethrower vs Blastoise (Resistido 0.5x)' },
  { attacker: 'blastoise', defender: 'gyarados', move: 'water_gun', desc: 'Blastoise Water Gun vs Gyarados (Resistido 0.5x)' },
  { attacker: 'venusaur', defender: 'charizard', move: 'vine_whip', desc: 'Venusaur Vine Whip vs Charizard (Dupla Resistência 0.25x)' },
  { attacker: 'arcanine', defender: 'dragonite', move: 'ember', desc: 'Arcanine Ember vs Dragonite (Resistido 0.5x)' },
  { attacker: 'gengar', defender: 'alakazam', move: 'confusion', desc: 'Gengar Confusion vs Alakazam (Resistido 0.5x)' },

  // Super Efetivos (2.0x)
  { attacker: 'blastoise', defender: 'charizard', move: 'surf', desc: 'Blastoise Surf vs Charizard (Super Efetivo 2x)' },
  { attacker: 'pikachu', defender: 'blastoise', move: 'thunderbolt', desc: 'Pikachu Thunderbolt vs Blastoise (Super Efetivo 2x)' },
  { attacker: 'charizard', defender: 'venusaur', move: 'flamethrower', desc: 'Charizard Flamethrower vs Venusaur (Super Efetivo 2x)' },
  { attacker: 'machamp', defender: 'snorlax', move: 'low_kick', desc: 'Machamp Low Kick vs Snorlax (Super Efetivo 2x)' },
  { attacker: 'gengar', defender: 'alakazam', move: 'shadow_ball', desc: 'Gengar Shadow Ball vs Alakazam (Super Efetivo 2x)' },

  // Dupla Fraqueza (4.0x)
  { attacker: 'lapras', defender: 'dragonite', move: 'ice_beam', desc: 'Lapras Ice Beam vs Dragonite (Dupla Fraqueza 4x)' },
  { attacker: 'pikachu', defender: 'gyarados', move: 'thunderbolt', desc: 'Pikachu Thunderbolt vs Gyarados (Dupla Fraqueza 4x)' },

  // Imunidades (0.0x)
  { attacker: 'snorlax', defender: 'gengar', move: 'tackle', desc: 'Snorlax Tackle vs Gengar (Imune 0x)' },
  { attacker: 'charizard', defender: 'snorlax', move: 'earthquake', desc: 'Charizard Earthquake vs Snorlax (Neutro Físico)' }
];

/**
 * Executa simulação comparativa entre os modelos.
 */
function analyzeBalance() {
  const results = [];

  let neutralCount = 0;
  let neutralOhkoBefore = 0;
  let neutralOhkoAfter = 0;
  let neutralHitsToKoBeforeSum = 0;
  let neutralHitsToKoAfterSum = 0;

  let resistedCount = 0;
  let resistedOhkoBefore = 0;
  let resistedOhkoAfter = 0;

  let superEffectiveCount = 0;
  let superEffectiveOhkoAfter = 0;

  let doubleWeaknessCount = 0;
  let doubleWeaknessOhkoAfter = 0;

  for (const m of REPRESENTATIVE_MATCHUPS) {
    const atkSp = COHORT_SPECIES[m.attacker];
    const defSp = COHORT_SPECIES[m.defender];
    const move = COHORT_MOVES[m.move];

    const isPhysical = move.damageClass === 'physical';

    // 1. MODELO ANTERIOR (Base stats diretos, sem variação de dano / roll 100)
    const oldAtkStat = isPhysical ? atkSp.base.attack : atkSp.base.specialAttack;
    const oldDefStat = isPhysical ? defSp.base.defense : defSp.base.specialDefense;
    const oldDefHp = defSp.base.hp;

    const stabMult = atkSp.types.includes(move.type) ? 1.5 : 1.0;
    const eff = TypeEffectiveness.calculate(move.type, defSp.types);
    const typeMult = eff.multiplier;

    const oldBaseDamage = DamageCalculator.calculateBaseDamage(oldAtkStat, oldDefStat, move.power, 50);
    // Na implementação anterior: floor(base * stab * type) com roll 100
    const oldFinalDamage = (typeMult === 0) ? 0 : Math.max(1, Math.floor(oldBaseDamage * stabMult * typeMult));
    const oldDamagePct = (oldFinalDamage / oldDefHp) * 100;
    const oldOhko = oldFinalDamage >= oldDefHp && oldFinalDamage > 0;
    const oldHitsToKo = oldFinalDamage > 0 ? Math.ceil(oldDefHp / oldFinalDamage) : Infinity;

    // 2. NOVO MODELO (Level 50 Stats normalizados + Variância 85..100)
    const normAtk = BattleStatNormalizer.normalizeStats(atkSp.base, { pokemonId: atkSp.id, pokemonName: atkSp.name });
    const normDef = BattleStatNormalizer.normalizeStats(defSp.base, { pokemonId: defSp.id, pokemonName: defSp.name });

    const newAtkStat = isPhysical ? normAtk.attack : normAtk.specialAttack;
    const newDefStat = isPhysical ? normDef.defense : normDef.specialDefense;
    const newDefHp = normDef.hp;

    const newRange = DamageCalculator.calculateDamageRange(newAtkStat, newDefStat, move.power, 50, typeMult, stabMult);
    const newAvgDamage = newRange.averageDamage;
    const newAvgDamagePct = (newAvgDamage / newDefHp) * 100;
    const newGuaranteedOhko = newRange.minDamage >= newDefHp && newRange.minDamage > 0;
    const newPossibleOhko = newRange.maxDamage >= newDefHp && newRange.maxDamage > 0;
    const newHitsToKo = newAvgDamage > 0 ? Math.ceil(newDefHp / newAvgDamage) : Infinity;

    // Classificação estatística
    if (typeMult === 1.0) {
      neutralCount++;
      if (oldOhko) neutralOhkoBefore++;
      if (newGuaranteedOhko || newPossibleOhko) neutralOhkoAfter++;
      neutralHitsToKoBeforeSum += oldHitsToKo;
      neutralHitsToKoAfterSum += newHitsToKo;
    } else if (typeMult > 0 && typeMult < 1.0) {
      resistedCount++;
      if (oldOhko) resistedOhkoBefore++;
      if (newGuaranteedOhko || newPossibleOhko) resistedOhkoAfter++;
    } else if (typeMult === 2.0) {
      superEffectiveCount++;
      if (newGuaranteedOhko || newPossibleOhko) superEffectiveOhkoAfter++;
    } else if (typeMult === 4.0) {
      doubleWeaknessCount++;
      if (newGuaranteedOhko || newPossibleOhko) doubleWeaknessOhkoAfter++;
    }

    results.push({
      attacker: atkSp.name,
      defender: defSp.name,
      move: move.name,
      power: move.power,
      damageClass: move.damageClass,
      typeMultiplier: typeMult,
      stabMultiplier: stabMult,
      classification: eff.classification,
      oldModel: {
        atkStat: oldAtkStat,
        defStat: oldDefStat,
        defHp: oldDefHp,
        damage: oldFinalDamage,
        damagePct: Number(oldDamagePct.toFixed(1)),
        isOhko: oldOhko,
        hitsToKo: oldHitsToKo
      },
      newModel: {
        atkStat: newAtkStat,
        defStat: newDefStat,
        defHp: newDefHp,
        minDamage: newRange.minDamage,
        maxDamage: newRange.maxDamage,
        averageDamage: newAvgDamage,
        averageDamagePct: Number(newAvgDamagePct.toFixed(1)),
        guaranteedOhko: newGuaranteedOhko,
        possibleOhko: newPossibleOhko,
        hitsToKo: newHitsToKo
      }
    });
  }

  const neutralOhkoRateBefore = neutralCount > 0 ? (neutralOhkoBefore / neutralCount) * 100 : 0;
  const neutralOhkoRateAfter = neutralCount > 0 ? (neutralOhkoAfter / neutralCount) * 100 : 0;

  const resistedOhkoRateBefore = resistedCount > 0 ? (resistedOhkoBefore / resistedCount) * 100 : 0;
  const resistedOhkoRateAfter = resistedCount > 0 ? (resistedOhkoAfter / resistedCount) * 100 : 0;

  const superEffectiveOhkoRateAfter = superEffectiveCount > 0 ? (superEffectiveOhkoAfter / superEffectiveCount) * 100 : 0;
  const doubleWeaknessOhkoRateAfter = doubleWeaknessCount > 0 ? (doubleWeaknessOhkoAfter / doubleWeaknessCount) * 100 : 0;

  const avgNeutralHitsBefore = neutralCount > 0 ? Number((neutralHitsToKoBeforeSum / neutralCount).toFixed(2)) : 0;
  const avgNeutralHitsAfter = neutralCount > 0 ? Number((neutralHitsToKoAfterSum / neutralCount).toFixed(2)) : 0;

  return {
    matchups: results,
    metrics: {
      totalMatchups: results.length,
      neutralCount,
      neutralOhkoRateBefore: Number(neutralOhkoRateBefore.toFixed(1)),
      neutralOhkoRateAfter: Number(neutralOhkoRateAfter.toFixed(1)),
      resistedCount,
      resistedOhkoRateBefore: Number(resistedOhkoRateBefore.toFixed(1)),
      resistedOhkoRateAfter: Number(resistedOhkoRateAfter.toFixed(1)),
      superEffectiveCount,
      superEffectiveOhkoRateAfter: Number(superEffectiveOhkoRateAfter.toFixed(1)),
      doubleWeaknessCount,
      doubleWeaknessOhkoRateAfter: Number(doubleWeaknessOhkoRateAfter.toFixed(1)),
      avgNeutralHitsBefore,
      avgNeutralHitsAfter
    }
  };
}

module.exports = {
  COHORT_SPECIES,
  COHORT_MOVES,
  REPRESENTATIVE_MATCHUPS,
  analyzeBalance
};
