/**
 * ====================================================================
 * SUÍTE DE TESTES: SISTEMA DE ARENAS POR TIPO (PBA-018A)
 * ====================================================================
 * Valida a fundação arquitetural, o TypeArenaRegistry, o fallback obrigatório,
 * o ciclo de vida sem vazamentos de partículas e a preservação do Battle Engine.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  ACTIVE_PROTOTYPE_TYPES,
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

test('PBA-018A — Arena System Constants & Catalog', async (t) => {
  await t.test('active prototypes include exactly fire, water, and electric', () => {
    assert.deepEqual(ACTIVE_PROTOTYPE_TYPES, ['fire', 'water', 'electric']);
    assert.equal(ACTIVE_PROTOTYPE_TYPES.length, 3);
  });

  await t.test('catalog contains default and exactly 3 prototype themes', () => {
    assert.ok(ARENA_CATALOG[ARENA_THEME_KEYS.DEFAULT]);
    assert.ok(ARENA_CATALOG[ARENA_THEME_KEYS.FIRE]);
    assert.ok(ARENA_CATALOG[ARENA_THEME_KEYS.WATER]);
    assert.ok(ARENA_CATALOG[ARENA_THEME_KEYS.ELECTRIC]);
    assert.equal(Object.keys(ARENA_CATALOG).length, 4);
  });
});

test('PBA-018A — Theme Resolution & Prototype Gates', async (t) => {
  await t.test('registry resolves Fire for Campaign Fire Master', () => {
    const meta = {
      mode: 'CAMPAIGN',
      kind: 'MASTER',
      id: 'master-fire',
      opponentTrainer: { type: 'fire', displayName: 'Kael' }
    };
    const theme = resolveArenaTheme(meta);
    assert.equal(theme.key, 'fire');
    assert.equal(theme.type, 'fire');
    assert.equal(theme.themeClass, 'arena-theme-fire');
    assert.equal(theme.particleType, 'embers');
    assert.equal(theme.backgroundSrc, 'assets/images/arenas/arena-fire.webp');
  });

  await t.test('registry resolves Water for Campaign Water Master', () => {
    const meta = {
      mode: 'CAMPAIGN',
      kind: 'MASTER',
      id: 'master-water',
      opponentTrainer: { type: 'water', displayName: 'Marina' }
    };
    const theme = resolveArenaTheme(meta);
    assert.equal(theme.key, 'water');
    assert.equal(theme.type, 'water');
    assert.equal(theme.themeClass, 'arena-theme-water');
    assert.equal(theme.particleType, 'bubbles');
    assert.equal(theme.backgroundSrc, 'assets/images/arenas/arena-water.webp');
  });

  await t.test('registry resolves Electric for Campaign Electric Master', () => {
    const meta = {
      mode: 'CAMPAIGN',
      kind: 'MASTER',
      id: 'master-electric',
      opponentTrainer: { type: 'electric', displayName: 'Volt' }
    };
    const theme = resolveArenaTheme(meta);
    assert.equal(theme.key, 'electric');
    assert.equal(theme.type, 'electric');
    assert.equal(theme.themeClass, 'arena-theme-electric');
    assert.equal(theme.particleType, 'pulses');
    assert.equal(theme.backgroundSrc, 'assets/images/arenas/arena-electric.webp');
  });

  await t.test('direct string query resolves active prototypes', () => {
    assert.equal(resolveArenaTheme('fire').key, 'fire');
    assert.equal(resolveArenaTheme('water').key, 'water');
    assert.equal(resolveArenaTheme('electric').key, 'electric');
  });
});

test('PBA-018A — Mandatory Fallbacks & Edge Cases', async (t) => {
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

  await t.test('other 15 Campaign Masters fall back to default in this phase', () => {
    const otherTypes = ['grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy', 'normal'];
    for (const type of otherTypes) {
      const meta = {
        mode: 'CAMPAIGN',
        kind: 'MASTER',
        id: `master-${type}`,
        opponentTrainer: { type }
      };
      const theme = resolveArenaTheme(meta);
      assert.equal(theme.key, 'default', `Expected ${type} to fall back to default in PBA-018A`);
      assert.equal(theme.themeClass, 'arena-theme-default');
    }
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

test('PBA-018A — Mode Isolation: Quick Battle, Super Trainer & Shadow Final Stand', async (t) => {
  await t.test('Quick Battle resolves to default (zero visual regression)', () => {
    const quickMeta1 = null;
    const quickMeta2 = { mode: 'QUICK' };
    assert.equal(resolveArenaTheme(quickMeta1).key, 'default');
    assert.equal(resolveArenaTheme(quickMeta2).key, 'default');
  });

  await t.test('Super Trainer battle resolves to default (special visual preserved)', () => {
    const superMeta = {
      mode: 'CAMPAIGN',
      kind: 'SUPER',
      opponentName: 'Super Treinador',
      opponentTrainer: { variant: 'SUPER', type: null }
    };
    const theme = resolveArenaTheme(superMeta);
    assert.equal(theme.key, 'default');
    assert.equal(theme.themeClass, 'arena-theme-default');
  });

  await t.test('Shadow Final Stand battle resolves to default (special visual preserved)', () => {
    const shadowMeta = {
      mode: 'CAMPAIGN',
      kind: 'SHADOW',
      battleFormat: 'FINAL_STAND',
      opponentName: 'Shadow Super Trainer',
      opponentTrainer: { variant: 'SHADOW', type: null }
    };
    const theme = resolveArenaTheme(shadowMeta);
    assert.equal(theme.key, 'default');
    assert.equal(theme.themeClass, 'arena-theme-default');
  });
});

test('PBA-018A — Particle Lifecycle & Zero Leaks (PARTICLE_LEAKS = 0)', async (t) => {
  await t.test('mount and cleanup properly manages elements and timers', () => {
    const controller = new TypeArenaController();
    assert.equal(controller.isMounted, false);
    assert.equal(controller.activeElements.size, 0);
    assert.equal(controller.activeTimers.size, 0);

    // Mock stage element
    const mockStage = {
      querySelector: (selector) => {
        if (selector === '#arenaAmbientContainer' || selector === '.arena-ambient-container') {
          return {
            appendChild: () => {},
            replaceChildren: () => {},
            innerHTML: ''
          };
        }
        return null;
      }
    };

    const fireTheme = ARENA_CATALOG.fire;
    const result = controller.mount(mockStage, fireTheme, { reducedMotion: true });
    assert.equal(result, true);
    assert.equal(controller.isMounted, true);

    // Cleanup leaves zero references
    controller.cleanup();
    assert.equal(controller.isMounted, false);
    assert.equal(controller.currentTheme, null);
    assert.equal(controller.currentStage, null);
    assert.equal(controller.activeElements.size, 0);
    assert.equal(controller.activeTimers.size, 0);
  });

  await t.test('reduced motion disables particles completely', () => {
    const controller = new TypeArenaController();
    let replacedChildrenCalled = false;
    const mockStage = {
      querySelector: () => ({
        appendChild: () => { throw new Error('Should not append particles in reduced motion'); },
        replaceChildren: () => { replacedChildrenCalled = true; },
        innerHTML: ''
      })
    };

    const fireTheme = ARENA_CATALOG.fire;
    controller.mount(mockStage, fireTheme, { reducedMotion: true });
    assert.equal(replacedChildrenCalled, true);
    assert.equal(controller.activeElements.size, 0);
  });
});

test('PBA-018A — Single Battle View & Architectural Decoupling', async (t) => {
  await t.test('one single battle view implementation exists (ONE_BATTLE_VIEW = YES)', () => {
    const rootDir = path.resolve(__dirname, '../..');
    assert.equal(fs.existsSync(path.join(rootDir, 'battle-fire.html')), false);
    assert.equal(fs.existsSync(path.join(rootDir, 'battle-water.html')), false);
    assert.equal(fs.existsSync(path.join(rootDir, 'battle-electric.html')), false);
    assert.equal(fs.existsSync(path.join(rootDir, 'assets/js/ui/battle-view.js')), true);
  });

  await t.test('Battle Engine, AI, and Damage Calculator do not reference arena visuals', () => {
    const rootDir = path.resolve(__dirname, '../..');
    const engineCode = fs.readFileSync(path.join(rootDir, 'assets/js/battle/battle-engine.js'), 'utf8');
    const aiCode = fs.readFileSync(path.join(rootDir, 'assets/js/battle/battle-ai.js'), 'utf8');
    const damageCode = fs.readFileSync(path.join(rootDir, 'assets/js/battle/damage-calculator.js'), 'utf8');

    assert.doesNotMatch(engineCode, /arena-theme|arenaBackdrop|arenaAmbientContainer/);
    assert.doesNotMatch(aiCode, /arena-theme|arenaBackdrop|arenaAmbientContainer/);
    assert.doesNotMatch(damageCode, /arena-theme|arenaBackdrop|arenaAmbientContainer/);
  });

  await t.test('BattleView renders themed arena classes and cleans up on leave', () => {
    const mockContainer = { innerHTML: '', querySelector: () => null };
    const view = new BattleView({ container: mockContainer });

    const battleState = {
      player: {
        activeIndex: 0,
        team: [{ id: 25, name: 'pikachu', currentHp: 100, maxHp: 100, types: ['electric'], moves: [{ id: 1, name: 'thunderbolt', type: 'electric', power: 90, currentPp: 15, maxPp: 15, damageClass: 'special' }] }]
      },
      enemy: {
        activeIndex: 0,
        team: [{ id: 38, name: 'ninetales', currentHp: 100, maxHp: 100, types: ['fire'], moves: [] }]
      },
      metadata: {
        mode: 'CAMPAIGN',
        kind: 'MASTER',
        id: 'master-fire',
        opponentTrainer: { type: 'fire', displayName: 'Kael' }
      },
      turn: 1
    };

    view.renderActiveBattleView(battleState, 'AWAITING_PLAYER_ACTION');
    assert.equal(view.currentArenaTheme.key, 'fire');
    assert.match(mockContainer.innerHTML, /arena-theme-fire/);
    assert.match(mockContainer.innerHTML, /arena-backdrop/);

    // Resetting arena cleans theme reference and controller state
    view.resetArena();
    assert.equal(view.currentArenaTheme, null);
  });
});

test('PBA-018A — Local WebP Assets Verification', () => {
  const rootDir = path.resolve(__dirname, '../..');
  const firePath = path.join(rootDir, 'assets/images/arenas/arena-fire.webp');
  const waterPath = path.join(rootDir, 'assets/images/arenas/arena-water.webp');
  const electricPath = path.join(rootDir, 'assets/images/arenas/arena-electric.webp');

  assert.equal(fs.existsSync(firePath), true, 'arena-fire.webp must exist');
  assert.equal(fs.existsSync(waterPath), true, 'arena-water.webp must exist');
  assert.equal(fs.existsSync(electricPath), true, 'arena-electric.webp must exist');

  const fireStats = fs.statSync(firePath);
  const waterStats = fs.statSync(waterPath);
  const electricStats = fs.statSync(electricPath);

  assert.ok(fireStats.size > 1000 && fireStats.size < 250000, `Fire size: ${fireStats.size}`);
  assert.ok(waterStats.size > 1000 && waterStats.size < 250000, `Water size: ${waterStats.size}`);
  assert.ok(electricStats.size > 1000 && electricStats.size < 250000, `Electric size: ${electricStats.size}`);
});
