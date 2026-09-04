/**
 * ====================================================================
 * FIXTURES DE GOLPES: MOVE FIXTURES (move-fixtures.js)
 * ====================================================================
 * Conjunto estático e normalizado de golpes para testes automatizados
 * da Fase PBA-005 (100% offline).
 */

const ThunderboltFixture = Object.freeze({
  id: 85,
  name: 'thunderbolt',
  type: 'electric',
  power: 90,
  accuracy: 100,
  pp: 15,
  damageClass: 'special'
});

const ScratchFixture = Object.freeze({
  id: 10,
  name: 'scratch',
  type: 'normal',
  power: 40,
  accuracy: 100,
  pp: 35,
  damageClass: 'physical'
});

const FlamethrowerFixture = Object.freeze({
  id: 53,
  name: 'flamethrower',
  type: 'fire',
  power: 90,
  accuracy: 100,
  pp: 15,
  damageClass: 'special'
});

const EmberFixture = Object.freeze({
  id: 52,
  name: 'ember',
  type: 'fire',
  power: 40,
  accuracy: 100,
  pp: 25,
  damageClass: 'special'
});

const WaterGunFixture = Object.freeze({
  id: 55,
  name: 'water-gun',
  type: 'water',
  power: 40,
  accuracy: 100,
  pp: 25,
  damageClass: 'special'
});

const HydroPumpFixture = Object.freeze({
  id: 56,
  name: 'hydro-pump',
  type: 'water',
  power: 110,
  accuracy: 80,
  pp: 5,
  damageClass: 'special'
});

const VineWhipFixture = Object.freeze({
  id: 22,
  name: 'vine-whip',
  type: 'grass',
  power: 45,
  accuracy: 100,
  pp: 25,
  damageClass: 'physical'
});

const EarthquakeFixture = Object.freeze({
  id: 89,
  name: 'earthquake',
  type: 'ground',
  power: 100,
  accuracy: 100,
  pp: 10,
  damageClass: 'physical'
});

const DragonClawFixture = Object.freeze({
  id: 337,
  name: 'dragon-claw',
  type: 'dragon',
  power: 80,
  accuracy: 100,
  pp: 15,
  damageClass: 'physical'
});

const SwiftAlwaysHitFixture = Object.freeze({
  id: 129,
  name: 'swift',
  type: 'normal',
  power: 60,
  accuracy: null, // Always-hit (sem chance de miss)
  pp: 20,
  damageClass: 'special'
});

const InaccurateMoveFixture = Object.freeze({
  id: 990,
  name: 'inaccurate-move',
  type: 'normal',
  power: 70,
  accuracy: 70,
  pp: 10,
  damageClass: 'physical'
});

const OnePpMoveFixture = Object.freeze({
  id: 991,
  name: 'one-pp-move',
  type: 'normal',
  power: 40,
  accuracy: 100,
  pp: 1,
  damageClass: 'physical'
});

const StatusMoveGrowlFixture = Object.freeze({
  id: 45,
  name: 'growl',
  type: 'normal',
  power: null,
  accuracy: 100,
  pp: 40,
  damageClass: 'status'
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ThunderboltFixture,
    ScratchFixture,
    FlamethrowerFixture,
    EmberFixture,
    WaterGunFixture,
    HydroPumpFixture,
    VineWhipFixture,
    EarthquakeFixture,
    DragonClawFixture,
    SwiftAlwaysHitFixture,
    InaccurateMoveFixture,
    OnePpMoveFixture,
    StatusMoveGrowlFixture
  };
}
