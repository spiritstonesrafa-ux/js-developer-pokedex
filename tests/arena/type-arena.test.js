/**
 * ====================================================================
 * SUÍTE DE TESTES: SISTEMA COMPLETO DE 18 ARENAS POR TIPO (PBA-018B)
 * ====================================================================
 * Valida o catálogo completo de 18 temas elementais, a resolução dos 18
 * Campaign Masters, o fallback obrigatório, o isolamento rigoroso de modos
 * (Quick Battle, Trials, Super Trainer, Shadow Final Stand), a ausência de
 * vazamentos de partículas e a preservação total do Battle Engine.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  ALL_18_TYPES,
  ACTIVE_ARENA_TYPES,
  ARENA_THEME_KEYS,
  ARENA_PARTICLE_LIMITS,
  ARENA_CLASSES
} = require('../../assets/js/arena/type-arena-constants.js');

const {
  TypeArenaRegistry,
  DEFAULT_ARENA_THEME,
  ARENA_CATALOG,
  resolveArenaTheme
} = require('../../assets/js/arena/type-arena-registry.js');

const {
  TypeArenaController
} = require('../../assets/js/arena/type-arena-controller.js');

const { BattleView } = require('../../assets/js/ui/battle-view.js');

const EXPECTED_18_MASTERS = [
  { name: 'Aster', type: 'normal' },
  { name: 'Kael', type: 'fire' },
  { name: 'Marina', type: 'water' },
  { name: 'Volt', type: 'electric' },
  { name: 'Flora', type: 'grass' },
  { name: 'Yara', type: 'ice' },
  { name: 'Dante', type: 'fighting' },
  { name: 'Vesper', type: 'poison' },
  { name: 'Terra', type: 'ground' },
  { name: 'Aero', type: 'flying' },
  { name: 'Orion', type: 'psychic' },
  { name: 'Nilo', type: 'bug' },
  { name: 'Petra', type: 'rock' },
  { name: 'Nyra', type: 'ghost' },
  { name: 'Riven', type: 'dragon' },
  { name: 'Noctis', type: 'dark' },
  { name: 'Ferrum', type: 'steel' },
  { name: 'Lumi', type: 'fairy' }
];

test('PBA-018B — Arena System Constants & Complete 18-Type Catalog', async (t) => {
  await t.test('catalog contains default and all 18 elemental types (19 total themes)', () => {
    assert.equal(ALL_18_TYPES.length, 18);
    assert.equal(ACTIVE_ARENA_TYPES.length, 18);
    assert.equal(Object.keys(ARENA_CATALOG).length, 19);
    assert.ok(ARENA_CATALOG[ARENA_THEME_KEYS.DEFAULT]);

    for (const type of ALL_18_TYPES) {
      assert.ok(ARENA_CATALOG[type], `Theme for ${type} must exist in ARENA_CATALOG`);
      assert.equal(ARENA_CATALOG[type].type, type);
      assert.equal(ARENA_CATALOG[type].themeClass, `arena-theme-${type}`);
      assert.equal(ARENA_CATALOG[type].backgroundSrc, `assets/images/arenas/arena-${type}.webp`);
      assert.ok(ARENA_CATALOG[type].baseGradient, `Theme ${type} must define a base gradient fallback`);
      assert.ok(ARENA_CATALOG[type].accentColor, `Theme ${type} must define an accent color`);
      assert.ok(ARENA_CATALOG[type].platformGlow, `Theme ${type} must define platform glow`);
    }
  });

  await t.test('all 18 types define controlled particle limits and safe reduced motion', () => {
    for (const type of ALL_18_TYPES) {
      const theme = ARENA_CATALOG[type];
      const limit = ARENA_PARTICLE_LIMITS[type.toUpperCase()];
      assert.ok(typeof limit === 'number' && limit > 0 && limit <= 12, `Limit for ${type} should be 1-12`);
      assert.equal(theme.reducedMotionBehavior, 'static');
    }
  });
});

test('PBA-018B — Campaign Master Mapping (18/18 PASS)', async (t) => {
  for (const master of EXPECTED_18_MASTERS) {
    await t.test(`resolves correct ${master.type.toUpperCase()} arena for Master ${master.name}`, () => {
      const meta = {
        mode: 'CAMPAIGN',
        kind: 'MASTER',
        id: `master-${master.type}`,
        opponentTrainer: { type: master.type, displayName: master.name }
      };
      const theme = resolveArenaTheme(meta);
      assert.equal(theme.key, master.type);
      assert.equal(theme.type, master.type);
      assert.equal(theme.themeClass, `arena-theme-${master.type}`);
      assert.equal(theme.backgroundSrc, `assets/images/arenas/arena-${master.type}.webp`);
    });
  }
});

test('PBA-018B — Direct String Query Resolution for All 18 Types', async (t) => {
  for (const type of ALL_18_TYPES) {
    await t.test(`direct query '${type}' resolves to theme with key '${type}'`, () => {
      const theme = resolveArenaTheme(type);
      assert.equal(theme.key, type);
      assert.equal(theme.type, type);
    });
  }
});

test('PBA-018B — Mandatory Fallbacks & Edge Cases', async (t) => {
  await t.test('unknown type falls back to default', () => {
    const meta = {
      mode: 'CAMPAIGN',
      kind: 'MASTER',
      id: 'master-unknown',
      opponentTrainer: { type: 'cosmic' }
    };
    const theme = resolveArenaTheme(meta);
    assert.equal(theme.key, 'default');
    assert.equal(theme.themeClass, 'arena-theme-default');
    assert.equal(theme.backgroundSrc, null);
  });

  await t.test('missing config or corrupt metadata safely resolves to default without crashing', () => {
    assert.equal(resolveArenaTheme(null).key, 'default');
    assert.equal(resolveArenaTheme(undefined).key, 'default');
    assert.equal(resolveArenaTheme({}).key, 'default');
    assert.equal(resolveArenaTheme({ mode: 'CAMPAIGN' }).key, 'default');
    assert.equal(resolveArenaTheme(12345).key, 'default');
    assert.equal(resolveArenaTheme({ mode: 'CAMPAIGN', kind: 'MASTER' }).key, 'default');
  });
});

test('PBA-018B — Mode Isolation: Quick Battle, Trials, Super Trainer & Shadow Final Stand', async (t) => {
  await t.test('Quick Battle resolves to default (zero visual regression)', () => {
    assert.equal(resolveArenaTheme(null).key, 'default');
    assert.equal(resolveArenaTheme({ mode: 'QUICK' }).key, 'default');
    assert.equal(resolveArenaTheme({ mode: 'QUICK', opponentTrainer: { type: 'fire' } }).key, 'default');
  });

  await t.test('Endgame Trials resolve to default (trial visual preserved)', () => {
    const trialMeta = {
      mode: 'CAMPAIGN',
      kind: 'TRIAL',
      id: 'trial-boss-1',
      opponentTrainer: { type: 'dragon' }
    };
    const theme = resolveArenaTheme(trialMeta);
    assert.equal(theme.key, 'default');
    assert.equal(theme.themeClass, 'arena-theme-default');
  });

  await t.test('Super Trainer battle resolves to default (special visual preserved)', () => {
    const superMeta = {
      mode: 'CAMPAIGN',
      kind: 'SUPER',
      isSuperTrainer: true,
      opponentName: 'Super Treinador',
      opponentTrainer: { variant: 'SUPER', type: 'dragon' }
    };
    const theme = resolveArenaTheme(superMeta);
    assert.equal(theme.key, 'default');
    assert.equal(theme.themeClass, 'arena-theme-default');
  });

  await t.test('Shadow Final Stand battle resolves to default (special visual preserved)', () => {
    const shadowMeta = {
      mode: 'CAMPAIGN',
      kind: 'SHADOW',
      isShadowFinalStand: true,
      battleFormat: 'FINAL_STAND',
      opponentName: 'Shadow Super Trainer',
      opponentTrainer: { variant: 'SHADOW', type: 'ghost' }
    };
    const theme = resolveArenaTheme(shadowMeta);
    assert.equal(theme.key, 'default');
    assert.equal(theme.themeClass, 'arena-theme-default');
  });
});

test('PBA-018B — Particle Lifecycle & Zero Leaks Across Transitions', async (t) => {
  await t.test('transition sequences cleanly reset state without memory/DOM leak', () => {
    const controller = new TypeArenaController();
    let appendCount = 0;
    let removeCount = 0;

    const mockStage = {
      querySelector: (selector) => {
        if (selector === '#arenaAmbientContainer' || selector === '.arena-ambient-container') {
          return {
            appendChild: (node) => { appendCount++; },
            replaceChildren: () => {},
            innerHTML: ''
          };
        }
        return null;
      }
    };

    // Test transition sequence: Fire -> Water -> Ghost -> Quick Battle -> Fairy -> Shadow -> Dragon -> Super
    const sequence = [
      ARENA_CATALOG.fire,
      ARENA_CATALOG.water,
      ARENA_CATALOG.ghost,
      DEFAULT_ARENA_THEME,
      ARENA_CATALOG.fairy,
      DEFAULT_ARENA_THEME,
      ARENA_CATALOG.dragon,
      DEFAULT_ARENA_THEME
    ];

    for (const theme of sequence) {
      controller.mount(mockStage, theme, { reducedMotion: false });
      assert.equal(controller.isMounted, true);
      assert.equal(controller.currentTheme, theme);
    }

    controller.cleanup();
    assert.equal(controller.isMounted, false);
    assert.equal(controller.currentTheme, null);
    assert.equal(controller.activeElements.size, 0);
    assert.equal(controller.activeTimers.size, 0);
  });

  await t.test('prefers-reduced-motion completely silences particles for all 18 arenas', () => {
    const controller = new TypeArenaController();
    let replacedChildrenCount = 0;
    const mockStage = {
      querySelector: () => ({
        appendChild: () => { throw new Error('Must not append in reduced motion'); },
        replaceChildren: () => { replacedChildrenCount++; },
        innerHTML: ''
      })
    };

    for (const type of ALL_18_TYPES) {
      const theme = ARENA_CATALOG[type];
      controller.mount(mockStage, theme, { reducedMotion: true });
      assert.equal(controller.activeElements.size, 0);
    }
    assert.ok(replacedChildrenCount >= 18, `Expected at least 18 replaceChildren calls, got ${replacedChildrenCount}`);
  });
});

test('PBA-018B — Single Battle View & Architectural Decoupling', async (t) => {
  await t.test('one single battle view implementation exists (ONE_BATTLE_VIEW = YES)', () => {
    const rootDir = path.resolve(__dirname, '../..');
    for (const type of ALL_18_TYPES) {
      assert.equal(fs.existsSync(path.join(rootDir, `battle-${type}.html`)), false, `battle-${type}.html must not exist`);
    }
    assert.equal(fs.existsSync(path.join(rootDir, 'assets/js/ui/battle-view.js')), true);
  });

  await t.test('Battle Engine, AI, and Damage Calculator remain pure and untouched', () => {
    const rootDir = path.resolve(__dirname, '../..');
    const engineCode = fs.readFileSync(path.join(rootDir, 'assets/js/battle/battle-engine.js'), 'utf8');
    const aiCode = fs.readFileSync(path.join(rootDir, 'assets/js/battle/battle-ai.js'), 'utf8');
    const damageCode = fs.readFileSync(path.join(rootDir, 'assets/js/battle/damage-calculator.js'), 'utf8');

    assert.doesNotMatch(engineCode, /arena-theme|arenaBackdrop|arenaAmbientContainer/);
    assert.doesNotMatch(aiCode, /arena-theme|arenaBackdrop|arenaAmbientContainer/);
    assert.doesNotMatch(damageCode, /arena-theme|arenaBackdrop|arenaAmbientContainer/);
  });
});

test('PBA-018B — Complete 18 Local WebP Assets Verification', () => {
  const rootDir = path.resolve(__dirname, '../..');
  let totalBytes = 0;

  for (const type of ALL_18_TYPES) {
    const filePath = path.join(rootDir, `assets/images/arenas/arena-${type}.webp`);
    assert.equal(fs.existsSync(filePath), true, `arena-${type}.webp must exist in assets/images/arenas/`);

    const stats = fs.statSync(filePath);
    totalBytes += stats.size;

    // Check individual size budget (reasonable compression: 10KB to 200KB)
    assert.ok(stats.size >= 10000 && stats.size <= 200000, `Asset size for ${type} (${stats.size} bytes) should be within budget`);
  }

  // Total budget verification (all 18 arenas should be <= 2.5 MB combined)
  assert.ok(totalBytes <= 2500000, `Total arena assets footprint (${totalBytes} bytes) exceeds budget`);
});
