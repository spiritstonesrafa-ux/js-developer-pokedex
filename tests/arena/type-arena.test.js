/**
 * ====================================================================
 * SUÍTE DE TESTES: SISTEMA DE ARENAS POR TIPO E ESPECIAIS (PBA-019A)
 * ====================================================================
 * Valida o catálogo completo de 18 temas elementais + 6 arenas especiais
 * (Super Trainer, Shadow Super Trainer, Legendary Trial, Mythical Trial,
 * Titans Trial, Celestial Trial), a resolução dos 18 Campaign Masters,
 * o mapeamento dos 2 bosses (2/2) e 4 trials (4/4), o fallback obrigatório,
 * o isolamento rigoroso do Quick Battle (zero regressão), a ausência de
 * vazamentos de partículas e a preservação total do Battle Engine.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  ALL_18_TYPES,
  ACTIVE_ARENA_TYPES,
  SPECIAL_ARENA_KEYS,
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

test('PBA-019A — Arena System Constants & Catalog (18 Elementals + 6 Specials = 25 Themes)', async (t) => {
  await t.test('catalog contains default, 18 elemental types, and 6 special arenas (25 total themes)', () => {
    assert.equal(ALL_18_TYPES.length, 18);
    assert.equal(ACTIVE_ARENA_TYPES.length, 18);
    assert.equal(SPECIAL_ARENA_KEYS.length, 6);
    assert.equal(Object.keys(ARENA_CATALOG).length, 25);
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

    for (const key of SPECIAL_ARENA_KEYS) {
      assert.ok(ARENA_CATALOG[key], `Special arena ${key} must exist in ARENA_CATALOG`);
      assert.equal(ARENA_CATALOG[key].key, key);
      assert.ok(ARENA_CATALOG[key].themeClass, `Special arena ${key} must define themeClass`);
      assert.ok(ARENA_CATALOG[key].backgroundSrc, `Special arena ${key} must define backgroundSrc`);
      assert.ok(ARENA_CATALOG[key].baseGradient, `Special arena ${key} must define baseGradient`);
      assert.ok(ARENA_CATALOG[key].accentColor, `Special arena ${key} must define accentColor`);
      assert.ok(ARENA_CATALOG[key].platformGlow, `Special arena ${key} must define platformGlow`);
      assert.equal(ARENA_CATALOG[key].reducedMotionBehavior, 'static');
    }
  });

  await t.test('all arenas define controlled particle limits and safe reduced motion', () => {
    for (const type of ALL_18_TYPES) {
      const theme = ARENA_CATALOG[type];
      const limit = ARENA_PARTICLE_LIMITS[type.toUpperCase()];
      assert.ok(typeof limit === 'number' && limit > 0 && limit <= 12, `Limit for ${type} should be 1-12`);
      assert.equal(theme.reducedMotionBehavior, 'static');
    }
    for (const key of SPECIAL_ARENA_KEYS) {
      const theme = ARENA_CATALOG[key];
      const limit = ARENA_PARTICLE_LIMITS[key.toUpperCase()];
      assert.ok(typeof limit === 'number' && limit > 0 && limit <= 10, `Limit for special ${key} should be 1-10`);
      assert.equal(theme.reducedMotionBehavior, 'static');
    }
  });
});

test('PBA-019A — Campaign Master Mapping (18/18 PASS — Zero Regression)', async (t) => {
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

test('PBA-019A — Special Boss Arena Mapping (BOSS_ARENA_MAPPING = 2/2 PASS)', async (t) => {
  await t.test('Super Trainer battle resolves to Super Trainer Arena (Arena do Campeão)', () => {
    const superMeta = {
      mode: 'CAMPAIGN',
      kind: 'SUPER',
      isSuperTrainer: true,
      opponentName: 'Super Treinador',
      opponentTrainer: { variant: 'SUPER', type: 'dragon' }
    };
    const theme = resolveArenaTheme(superMeta);
    assert.equal(theme.key, 'super');
    assert.equal(theme.name, 'Arena do Campeão');
    assert.equal(theme.themeClass, 'arena-theme-super');
    assert.equal(theme.backgroundSrc, 'assets/images/arenas/arena-super.webp');
  });

  await t.test('Shadow Final Stand battle resolves to Shadow Super Trainer Arena (Trono do Eclipse)', () => {
    const shadowMeta = {
      mode: 'CAMPAIGN',
      kind: 'SHADOW',
      isShadowFinalStand: true,
      battleFormat: 'FINAL_STAND',
      opponentName: 'Shadow Super Trainer',
      opponentTrainer: { variant: 'SHADOW', type: 'ghost' }
    };
    const theme = resolveArenaTheme(shadowMeta);
    assert.equal(theme.key, 'shadow');
    assert.equal(theme.name, 'Trono do Eclipse');
    assert.equal(theme.themeClass, 'arena-theme-shadow');
    assert.equal(theme.backgroundSrc, 'assets/images/arenas/arena-shadow.webp');
  });
});

test('PBA-019A — Endgame Trial Arena Mapping (TRIAL_ARENA_MAPPING = 4/4 PASS)', async (t) => {
  await t.test('Legendary Trial resolves to Legendary Trial Arena (Santuário das Lendas)', () => {
    const meta = {
      mode: 'CAMPAIGN',
      kind: 'LEGENDARY_TRIAL',
      opponentName: 'Trial Lendária'
    };
    const theme = resolveArenaTheme(meta);
    assert.equal(theme.key, 'legendary');
    assert.equal(theme.name, 'Santuário das Lendas');
    assert.equal(theme.themeClass, 'arena-theme-trial-legendary');
    assert.equal(theme.backgroundSrc, 'assets/images/arenas/arena-trial-legendary.webp');
  });

  await t.test('Mythical Trial resolves to Mythical Trial Arena (Santuário Mítico)', () => {
    const meta = {
      mode: 'CAMPAIGN',
      kind: 'MYTHICAL_TRIAL',
      opponentName: 'Trial Mítica'
    };
    const theme = resolveArenaTheme(meta);
    assert.equal(theme.key, 'mythical');
    assert.equal(theme.name, 'Santuário Mítico');
    assert.equal(theme.themeClass, 'arena-theme-trial-mythical');
    assert.equal(theme.backgroundSrc, 'assets/images/arenas/arena-trial-mythical.webp');
  });

  await t.test('Titans Trial resolves to Titans Trial Arena (Arena dos Titãs)', () => {
    const meta = {
      mode: 'CAMPAIGN',
      kind: 'TITANS_TRIAL',
      opponentName: 'Trial dos Titãs'
    };
    const theme = resolveArenaTheme(meta);
    assert.equal(theme.key, 'titans');
    assert.equal(theme.name, 'Arena dos Titãs');
    assert.equal(theme.themeClass, 'arena-theme-trial-titans');
    assert.equal(theme.backgroundSrc, 'assets/images/arenas/arena-trial-titans.webp');
  });

  await t.test('Celestial Trial resolves to Celestial Trial Arena (Templo Celestial)', () => {
    const meta = {
      mode: 'CAMPAIGN',
      kind: 'CELESTIAL_TRIAL',
      opponentName: 'Trial Celestial'
    };
    const theme = resolveArenaTheme(meta);
    assert.equal(theme.key, 'celestial');
    assert.equal(theme.name, 'Templo Celestial');
    assert.equal(theme.themeClass, 'arena-theme-trial-celestial');
    assert.equal(theme.backgroundSrc, 'assets/images/arenas/arena-trial-celestial.webp');
  });
});

test('PBA-019A — Direct String Query Resolution for All 24 Arenas', async (t) => {
  for (const type of ALL_18_TYPES) {
    await t.test(`direct query '${type}' resolves to theme with key '${type}'`, () => {
      const theme = resolveArenaTheme(type);
      assert.equal(theme.key, type);
      assert.equal(theme.type, type);
    });
  }
  for (const key of SPECIAL_ARENA_KEYS) {
    await t.test(`direct special query '${key}' resolves to theme with key '${key}'`, () => {
      const theme = resolveArenaTheme(key);
      assert.equal(theme.key, key);
      assert.equal(theme.type, key);
    });
  }
});

test('PBA-019A — String Prefix Query Resolution (boss:, trial:, master:)', async (t) => {
  const prefixCases = [
    { query: 'boss:super', expectedKey: 'super' },
    { query: 'boss:shadow', expectedKey: 'shadow' },
    { query: 'trial:legendary', expectedKey: 'legendary' },
    { query: 'trial:mythical', expectedKey: 'mythical' },
    { query: 'trial:titans', expectedKey: 'titans' },
    { query: 'trial:celestial', expectedKey: 'celestial' },
    { query: 'master:fire', expectedKey: 'fire' },
    { query: 'master:water', expectedKey: 'water' },
    { query: 'master:electric', expectedKey: 'electric' },
    { query: 'master:ghost', expectedKey: 'ghost' }
  ];

  for (const { query, expectedKey } of prefixCases) {
    await t.test(`resolves query '${query}' to '${expectedKey}'`, () => {
      const theme = resolveArenaTheme(query);
      assert.equal(theme.key, expectedKey);
    });
  }
});

test('PBA-019A — Quick Battle Isolation & Mandatory Fallbacks', async (t) => {
  await t.test('Quick Battle resolves to default (zero visual regression)', () => {
    assert.equal(resolveArenaTheme(null).key, 'default');
    assert.equal(resolveArenaTheme({ mode: 'QUICK' }).key, 'default');
    assert.equal(resolveArenaTheme({ mode: 'QUICK', opponentTrainer: { type: 'fire' } }).key, 'default');
    assert.equal(resolveArenaTheme({ mode: 'QUICK', kind: 'SUPER' }).key, 'default');
  });

  await t.test('unknown type or unknown trial safely falls back to default', () => {
    assert.equal(resolveArenaTheme({ mode: 'CAMPAIGN', kind: 'MASTER', id: 'master-unknown' }).key, 'default');
    assert.equal(resolveArenaTheme({ mode: 'CAMPAIGN', kind: 'UNKNOWN_TRIAL' }).key, 'default');
    assert.equal(resolveArenaTheme(null).key, 'default');
    assert.equal(resolveArenaTheme(undefined).key, 'default');
    assert.equal(resolveArenaTheme({}).key, 'default');
    assert.equal(resolveArenaTheme('unknown:arena').key, 'default');
  });
});

test('PBA-019A — Particle Lifecycle & Zero Leaks Across Transitions', async (t) => {
  await t.test('transitions across special arenas cleanly reset state without leaks', () => {
    const controller = new TypeArenaController();
    let appendCount = 0;

    const mockStage = {
      querySelector: (selector) => {
        if (selector === '#arenaAmbientContainer' || selector === '.arena-ambient-container') {
          return {
            appendChild: () => { appendCount++; },
            replaceChildren: () => {},
            innerHTML: ''
          };
        }
        return null;
      }
    };

    // Sequências exigidas: Super -> Shadow -> Quick Battle -> Legendary -> Mythical -> Titans -> Celestial -> Master -> Shadow
    const sequence = [
      ARENA_CATALOG.super,
      ARENA_CATALOG.shadow,
      DEFAULT_ARENA_THEME,
      ARENA_CATALOG.legendary,
      ARENA_CATALOG.mythical,
      ARENA_CATALOG.titans,
      ARENA_CATALOG.celestial,
      ARENA_CATALOG.fire,
      ARENA_CATALOG.shadow
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

  await t.test('prefers-reduced-motion completely silences particles for all 24 arenas', () => {
    const controller = new TypeArenaController();
    let replacedChildrenCount = 0;
    const mockStage = {
      querySelector: () => ({
        appendChild: () => { throw new Error('Must not append in reduced motion'); },
        replaceChildren: () => { replacedChildrenCount++; },
        innerHTML: ''
      })
    };

    const allArenas = [...ALL_18_TYPES, ...SPECIAL_ARENA_KEYS];
    for (const key of allArenas) {
      const theme = ARENA_CATALOG[key];
      controller.mount(mockStage, theme, { reducedMotion: true });
      assert.equal(controller.activeElements.size, 0);
    }
    assert.ok(replacedChildrenCount >= 24, `Expected at least 24 replaceChildren calls, got ${replacedChildrenCount}`);
  });
});

test('PBA-019A — Single Battle View & Architectural Decoupling', async (t) => {
  await t.test('one single battle view implementation exists (ONE_BATTLE_VIEW = YES)', () => {
    const rootDir = path.resolve(__dirname, '../..');
    for (const key of [...ALL_18_TYPES, ...SPECIAL_ARENA_KEYS]) {
      assert.equal(fs.existsSync(path.join(rootDir, `battle-${key}.html`)), false, `battle-${key}.html must not exist`);
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

test('PBA-019A — Local WebP Assets Verification (18 Master + 6 Special Arenas = 24 Assets)', () => {
  const rootDir = path.resolve(__dirname, '../..');
  let totalBytes = 0;

  for (const type of ALL_18_TYPES) {
    const filePath = path.join(rootDir, `assets/images/arenas/arena-${type}.webp`);
    assert.equal(fs.existsSync(filePath), true, `arena-${type}.webp must exist in assets/images/arenas/`);
    const stats = fs.statSync(filePath);
    totalBytes += stats.size;
  }

  const specialFiles = [
    'arena-super.webp',
    'arena-shadow.webp',
    'arena-trial-legendary.webp',
    'arena-trial-mythical.webp',
    'arena-trial-titans.webp',
    'arena-trial-celestial.webp'
  ];

  for (const filename of specialFiles) {
    const filePath = path.join(rootDir, `assets/images/arenas/${filename}`);
    assert.equal(fs.existsSync(filePath), true, `${filename} must exist in assets/images/arenas/`);
    const stats = fs.statSync(filePath);
    totalBytes += stats.size;
    assert.ok(stats.size >= 50000 && stats.size <= 200000, `Asset size for ${filename} (${stats.size} bytes) should be 50KB-200KB`);
  }

  // Combined total budget verification: 24 arenas under 3.5 MB
  assert.ok(totalBytes <= 3500000, `Total arena assets footprint (${totalBytes} bytes) exceeds budget`);
});
