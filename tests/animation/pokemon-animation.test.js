/**
 * ====================================================================
 * SUÍTE DE TESTES: POKÉMON ANIMATIONS (AN01–AN36)
 * ====================================================================
 * Valida o catálogo de animações corporais, controlador, registry,
 * adaptadores DOM, orientações player/enemy, cancelamento, acessibilidade
 * reduced-motion e integração com a Presentation Engine (Fase PBA-009).
 *
 * Execução: node --test tests/animation/pokemon-animation.test.js
 */

const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

// Módulos de Animação e Apresentação
const AnimationConstants = require('../../assets/js/presentation/animation/pokemon-animation-constants.js');
const { PokemonAnimationRegistry } = require('../../assets/js/presentation/animation/pokemon-animation-registry.js');
const { PokemonAnimationController } = require('../../assets/js/presentation/animation/pokemon-animation-controller.js');
const { DomBattlePresentationAdapter } = require('../../assets/js/presentation/animation/pokemon-animation-dom-adapter.js');

const PresentationConstants = require('../../assets/js/presentation/battle-presentation-constants.js');
const PresentationMapper = require('../../assets/js/presentation/battle-presentation-mapper.js');
const { BattlePresentationEngine } = require('../../assets/js/presentation/battle-presentation-engine.js');

// Módulos do Battle Engine para traces reais
const BattleConstants = require('../../assets/js/battle/battle-constants.js');
const BattleEngine = require('../../assets/js/battle/battle-engine.js');
const { PlayerTeam3Fixture, EnemyTeam3Fixture } = require('../fixtures/team-fixtures.js');

const { POKEMON_ANIMATIONS, ANIMATION_DURATIONS, ANIMATION_CSS_CLASSES, ANIMATION_DIRECTIONS } = AnimationConstants;
const { PRESENTATION_COMMANDS, PRESENTATION_STATUS } = PresentationConstants;

/**
 * Cria um elemento DOM simulado leve para execução em ambiente Node.js.
 */
function createMockElement(tagName = 'div') {
  const classes = new Set();
  const attributes = new Map();
  const listeners = new Map();

  const el = {
    tagName,
    style: {
      transform: '',
      opacity: '',
      visibility: ''
    },
    src: '',
    alt: '',
    onerror: null,
    classList: {
      add: (...cls) => cls.forEach(c => classes.add(c)),
      remove: (...cls) => cls.forEach(c => classes.delete(c)),
      contains: (cls) => classes.has(cls),
      toggle: (cls, force) => {
        if (force === undefined) {
          classes.has(cls) ? classes.delete(cls) : classes.add(cls);
        } else if (force) {
          classes.add(cls);
        } else {
          classes.delete(cls);
        }
      }
    },
    setAttribute: (name, val) => attributes.set(name, String(val)),
    getAttribute: (name) => attributes.get(name) || null,
    addEventListener: (evt, fn) => {
      if (!listeners.has(evt)) listeners.set(evt, new Set());
      listeners.get(evt).add(fn);
    },
    removeEventListener: (evt, fn) => {
      if (listeners.has(evt)) listeners.get(evt).delete(fn);
    }
  };

  return el;
}

/**
 * Cria um ambiente de teste padrão com Registry e Controller configurados.
 */
function setupTestHarness(options = {}) {
  const registry = new PokemonAnimationRegistry();
  const playerSprite = createMockElement('img');
  const enemySprite = createMockElement('img');
  const playerContainer = createMockElement('div');
  const enemyContainer = createMockElement('div');

  registry.register('player', {
    sprite: playerSprite,
    container: playerContainer,
    metadata: { id: 25, name: 'pikachu', spriteUrl: 'pika.png', animatedUrl: 'pika.gif' }
  });

  registry.register('enemy', {
    sprite: enemySprite,
    container: enemyContainer,
    metadata: { id: 4, name: 'charmander', spriteUrl: 'char.png', animatedUrl: 'char.gif' }
  });

  const controller = new PokemonAnimationController({
    registry,
    durations: {
      ENTER: 5,
      ATTACK: 5,
      DAMAGE: 5,
      FAINT: 5,
      SWITCH_OUT: 5,
      SWITCH_IN: 5,
      VICTORY: 5,
      IDLE: 5
    },
    ...options
  });

  const domAdapter = new DomBattlePresentationAdapter({ controller, registry });

  return {
    registry,
    controller,
    domAdapter,
    playerSprite,
    enemySprite,
    playerContainer,
    enemyContainer
  };
}

describe('PHASE PBA-009 — POKÉMON ANIMATIONS SUITE (AN01–AN36)', () => {

  // ====================================================================
  // 1. CATÁLOGO E EXISTÊNCIA (AN01–AN04)
  // ====================================================================

  test('AN01 — Animation Catalog: catálogo define todas as 8 animações reutilizáveis', () => {
    assert.ok(POKEMON_ANIMATIONS);
    assert.equal(POKEMON_ANIMATIONS.ENTER, 'ENTER');
    assert.equal(POKEMON_ANIMATIONS.IDLE, 'IDLE');
    assert.equal(POKEMON_ANIMATIONS.ATTACK, 'ATTACK');
    assert.equal(POKEMON_ANIMATIONS.DAMAGE, 'DAMAGE');
    assert.equal(POKEMON_ANIMATIONS.FAINT, 'FAINT');
    assert.equal(POKEMON_ANIMATIONS.SWITCH_OUT, 'SWITCH_OUT');
    assert.equal(POKEMON_ANIMATIONS.SWITCH_IN, 'SWITCH_IN');
    assert.equal(POKEMON_ANIMATIONS.VICTORY, 'VICTORY');
  });

  test('AN02 — Controller Exists: PokemonAnimationController pode ser instanciado', () => {
    const controller = new PokemonAnimationController();
    assert.ok(controller);
    assert.equal(typeof controller.playEntrance, 'function');
    assert.equal(typeof controller.startIdle, 'function');
    assert.equal(typeof controller.playAttack, 'function');
    assert.equal(typeof controller.playDamageReaction, 'function');
    assert.equal(typeof controller.playFaint, 'function');
    assert.equal(typeof controller.playSwitchOut, 'function');
    assert.equal(typeof controller.playSwitchIn, 'function');
    assert.equal(typeof controller.playVictory, 'function');
  });

  test('AN03 — Registry Exists: PokemonAnimationRegistry gerencia targets e fallbacks', () => {
    const registry = new PokemonAnimationRegistry();
    assert.ok(registry);
    assert.equal(typeof registry.register, 'function');
    assert.equal(typeof registry.getTarget, 'function');
    assert.equal(typeof registry.updateSprite, 'function');
  });

  test('AN04 — DOM Adapter Exists: DomBattlePresentationAdapter implementa execute() assíncrono', () => {
    const adapter = new DomBattlePresentationAdapter();
    assert.ok(adapter);
    assert.equal(typeof adapter.execute, 'function');
  });

  // ====================================================================
  // 2. ENTRADA E IDLE (AN05–AN08)
  // ====================================================================

  test('AN05 — Player Enter: animação de entrada do jogador atinge estado final visível', async () => {
    const { controller, playerSprite } = setupTestHarness();
    playerSprite.style.opacity = '0';

    await controller.playEntrance('player');

    assert.equal(playerSprite.style.opacity, '1');
    assert.equal(playerSprite.classList.contains(ANIMATION_CSS_CLASSES.ENTER), false);
  });

  test('AN06 — Enemy Enter: animação de entrada do adversário atinge estado final visível', async () => {
    const { controller, enemySprite } = setupTestHarness();
    enemySprite.style.opacity = '0';

    await controller.playEntrance('enemy');

    assert.equal(enemySprite.style.opacity, '1');
    assert.equal(enemySprite.classList.contains(ANIMATION_CSS_CLASSES.ENTER), false);
  });

  test('AN07 — Idle Starts: ativa estado de repouso no combatente', () => {
    const { controller, playerSprite } = setupTestHarness();

    controller.startIdle('player');

    assert.equal(controller.isIdleActive('player'), true);
    assert.equal(playerSprite.classList.contains(ANIMATION_CSS_CLASSES.IDLE), true);
  });

  test('AN08 — Idle Stops: desativa estado de repouso no combatente', () => {
    const { controller, playerSprite } = setupTestHarness();

    controller.startIdle('player');
    assert.equal(controller.isIdleActive('player'), true);

    controller.stopIdle('player');
    assert.equal(controller.isIdleActive('player'), false);
    assert.equal(playerSprite.classList.contains(ANIMATION_CSS_CLASSES.IDLE), false);
  });

  // ====================================================================
  // 3. ATAQUE E ORIENTAÇÃO (AN09–AN11)
  // ====================================================================

  test('AN09 — Player Attack Orientation: jogador orientado para frente (+X / direita)', () => {
    const playerDir = ANIMATION_DIRECTIONS.player;
    assert.ok(playerDir);
    assert.equal(playerDir.multiplier, 1);
    assert.equal(playerDir.attackDirection, 1);
  });

  test('AN10 — Enemy Attack Orientation: adversário orientado para frente (-X / esquerda)', () => {
    const enemyDir = ANIMATION_DIRECTIONS.enemy;
    assert.ok(enemyDir);
    assert.equal(enemyDir.multiplier, -1);
    assert.equal(enemyDir.attackDirection, -1);
  });

  test('AN11 — Attack Returns to Base: ataque conclui restaurando o transform base', async () => {
    const { controller, playerSprite } = setupTestHarness();
    controller.startIdle('player');

    await controller.playAttack('player');

    assert.equal(playerSprite.style.transform, '');
    assert.equal(playerSprite.classList.contains(ANIMATION_CSS_CLASSES.ATTACK), false);
    // Idle é restaurado automaticamente após o golpe
    assert.equal(controller.isIdleActive('player'), true);
  });

  // ====================================================================
  // 4. REAÇÃO A DANO E IMUNIDADE (AN12–AN13)
  // ====================================================================

  test('AN12 — Damage Reaction: dano > 0 executa reação visual e restaura posição', async () => {
    const { controller, enemySprite } = setupTestHarness();
    controller.startIdle('enemy');

    await controller.playDamageReaction('enemy');

    assert.equal(enemySprite.style.transform, '');
    assert.equal(enemySprite.style.opacity, '1');
    assert.equal(enemySprite.classList.contains(ANIMATION_CSS_CLASSES.DAMAGE), false);
    assert.equal(controller.isIdleActive('enemy'), true);
  });

  test('AN13 — Zero Damage: dano igual a zero (imunidade/miss) NÃO dispara reação visual de dano', async () => {
    const { domAdapter, controller } = setupTestHarness();
    let damageCalled = false;
    controller.playDamageReaction = async () => { damageCalled = true; };

    // Comando com dano 0
    await domAdapter.execute({
      type: PRESENTATION_COMMANDS.HP_TRANSITION,
      side: 'enemy',
      damage: 0,
      previousHp: 100,
      currentHp: 100
    });

    assert.equal(damageCalled, false, 'Dano zero não deve invocar reação visual');
  });

  // ====================================================================
  // 5. NOCAUTE E TROCA (AN14–AN18)
  // ====================================================================

  test('AN14 — Faint: nocaute interrompe idle permanentemente e oculta sprite', async () => {
    const { controller, enemySprite } = setupTestHarness();
    controller.startIdle('enemy');

    await controller.playFaint('enemy');

    assert.equal(controller.isIdleActive('enemy'), false);
    assert.equal(enemySprite.style.opacity, '0');
    assert.equal(enemySprite.style.visibility, 'hidden');
    assert.equal(enemySprite.classList.contains(ANIMATION_CSS_CLASSES.HIDDEN), true);
  });

  test('AN15 — Switch Out: sprite recolhe e transita para opacidade 0', async () => {
    const { controller, playerSprite } = setupTestHarness();
    controller.startIdle('player');

    await controller.playSwitchOut('player');

    assert.equal(controller.isIdleActive('player'), false);
    assert.equal(playerSprite.style.opacity, '0');
    assert.equal(playerSprite.classList.contains(ANIMATION_CSS_CLASSES.HIDDEN), true);
  });

  test('AN16 — Switch In: novo sprite aparece, restaura visibilidade e inicia idle', async () => {
    const { controller, playerSprite } = setupTestHarness();

    await controller.playSwitchIn('player', {
      id: 7,
      name: 'squirtle',
      spriteUrl: 'squirtle.png'
    });

    assert.equal(playerSprite.style.opacity, '1');
    assert.equal(playerSprite.style.visibility, 'visible');
    assert.equal(playerSprite.classList.contains(ANIMATION_CSS_CLASSES.HIDDEN), false);
    assert.equal(controller.isIdleActive('player'), true);
  });

  test('AN17 — Switch Preserves Runtime Data: animação de troca não altera HP, PP ou Battle State', async () => {
    const { domAdapter } = setupTestHarness();
    const battleState = {
      turn: 2,
      player: { activeIndex: 0, team: [{ id: 25, currentHp: 50, moves: [{ id: 1, currentPp: 10 }] }] }
    };
    const snapshot = JSON.stringify(battleState);

    await domAdapter.execute({
      type: PRESENTATION_COMMANDS.SWITCH_IN_SEQUENCE,
      side: 'player',
      previousPokemonId: 25,
      newPokemonId: 7
    }, battleState);

    assert.equal(JSON.stringify(battleState), snapshot);
  });

  test('AN18 — Victory: animação de vitória conclui e mantém combatente ativo em estado válido', async () => {
    const { controller, playerSprite } = setupTestHarness();
    controller.startIdle('player');

    await controller.playVictory('player');

    assert.equal(playerSprite.style.transform, '');
    assert.equal(playerSprite.classList.contains(ANIMATION_CSS_CLASSES.VICTORY), false);
    assert.equal(controller.isIdleActive('player'), true);
  });

  // ====================================================================
  // 6. REDUCED MOTION (AN19–AN20)
  // ====================================================================

  test('AN19 — Reduced Motion: reducedMotion=true zera durações efetivas e conclui imediatamente', async () => {
    const { controller } = setupTestHarness({ reducedMotion: true });

    assert.equal(controller.getEffectiveDuration(POKEMON_ANIMATIONS.ATTACK), 0);
    assert.equal(controller.getEffectiveDuration(POKEMON_ANIMATIONS.FAINT), 0);
    assert.equal(controller.getEffectiveDuration(POKEMON_ANIMATIONS.ENTER), 0);

    const start = Date.now();
    await controller.playAttack('player');
    const elapsed = Date.now() - start;

    assert.ok(elapsed < 20, `Duração com reduced motion deve ser instantânea (levou ${elapsed}ms)`);
  });

  test('AN20 — Reduced Motion Faint: após faint em reduced motion, sprite permanece oculto', async () => {
    const { controller, enemySprite } = setupTestHarness({ reducedMotion: true });

    await controller.playFaint('enemy');

    assert.equal(enemySprite.style.opacity, '0');
    assert.equal(enemySprite.style.visibility, 'hidden');
    assert.equal(enemySprite.classList.contains(ANIMATION_CSS_CLASSES.HIDDEN), true);
  });

  // ====================================================================
  // 7. CANCELAMENTO E RESET (AN21–AN23)
  // ====================================================================

  test('AN21 — Cancel Attack: cancelar durante ataque remove classes e restaura transform base', () => {
    const { controller, playerSprite } = setupTestHarness({ durations: { ATTACK: 500 } });

    controller.playAttack('player');
    assert.equal(playerSprite.classList.contains(ANIMATION_CSS_CLASSES.ATTACK), true);

    controller.cancel('player');

    assert.equal(playerSprite.classList.contains(ANIMATION_CSS_CLASSES.ATTACK), false);
    assert.equal(playerSprite.style.transform, '');
  });

  test('AN22 — Cancel Faint: cancelar faint interrompe timer e deixa estado controlado', () => {
    const { controller } = setupTestHarness({ durations: { FAINT: 500 } });

    controller.playFaint('enemy');
    controller.cancel('enemy');

    assert.equal(controller.isIdleActive('enemy'), false);
  });

  test('AN23 — Reset: restaura todos os alvos registrados para o estado base utilizável', () => {
    const { controller, playerSprite, enemySprite } = setupTestHarness();

    playerSprite.classList.add(ANIMATION_CSS_CLASSES.ATTACK);
    enemySprite.classList.add(ANIMATION_CSS_CLASSES.FAINT);
    enemySprite.style.opacity = '0';

    controller.reset();

    assert.equal(playerSprite.classList.contains(ANIMATION_CSS_CLASSES.ATTACK), false);
    assert.equal(enemySprite.classList.contains(ANIMATION_CSS_CLASSES.FAINT), false);
    assert.equal(enemySprite.style.opacity, '1');
    assert.equal(controller.isIdleActive('player'), false);
    assert.equal(controller.isIdleActive('enemy'), false);
  });

  // ====================================================================
  // 8. LIMPEZA DE RECURSOS E CONCORRÊNCIA (AN24–AN26)
  // ====================================================================

  test('AN24 — Cleanup Classes: nenhuma classe temporária de animação permanece após conclusão', async () => {
    const { controller, playerSprite } = setupTestHarness();

    await controller.playAttack('player');

    const tempClasses = [
      ANIMATION_CSS_CLASSES.ENTER,
      ANIMATION_CSS_CLASSES.ATTACK,
      ANIMATION_CSS_CLASSES.DAMAGE,
      ANIMATION_CSS_CLASSES.FAINT,
      ANIMATION_CSS_CLASSES.SWITCH_OUT,
      ANIMATION_CSS_CLASSES.SWITCH_IN,
      ANIMATION_CSS_CLASSES.VICTORY
    ];

    for (const cls of tempClasses) {
      assert.equal(playerSprite.classList.contains(cls), false, `Classe temporária "${cls}" não foi removida`);
    }
  });

  test('AN25 — Cleanup Listeners: nenhum timer ativo permanece na fila interna após execução', async () => {
    const { controller } = setupTestHarness();

    await controller.playAttack('player');

    assert.equal(controller.activeAnimations.has('player'), false);
  });

  test('AN26 — Concurrency Target: duas animações no mesmo target ativam CANCEL_PREVIOUS sem corromper estado', async () => {
    const { controller, playerSprite } = setupTestHarness({ durations: { ATTACK: 30, DAMAGE: 5 } });

    // Inicia ataque e imediatamente sobrepõe com reação de dano
    const p1 = controller.playAttack('player');
    const p2 = controller.playDamageReaction('player');

    await Promise.all([p1, p2]);

    assert.equal(playerSprite.style.transform, '');
    assert.equal(playerSprite.classList.contains(ANIMATION_CSS_CLASSES.ATTACK), false);
    assert.equal(playerSprite.classList.contains(ANIMATION_CSS_CLASSES.DAMAGE), false);
  });

  // ====================================================================
  // 9. REGISTRY E FALLBACK (AN27–AN30)
  // ====================================================================

  test('AN27 — Registry Player: resolve o alvo do jogador com sucesso', () => {
    const { registry, playerSprite } = setupTestHarness();
    const target = registry.getTarget('player');

    assert.ok(target);
    assert.equal(target.side, 'player');
    assert.equal(target.sprite, playerSprite);
  });

  test('AN28 — Registry Enemy: resolve o alvo do adversário com sucesso', () => {
    const { registry, enemySprite } = setupTestHarness();
    const target = registry.getTarget('enemy');

    assert.ok(target);
    assert.equal(target.side, 'enemy');
    assert.equal(target.sprite, enemySprite);
  });

  test('AN29 — Registry Unregistered Target: lança TARGET_NOT_FOUND para lado não configurado', () => {
    const registry = new PokemonAnimationRegistry();
    assert.throws(
      () => registry.getTarget('player'),
      /TARGET_NOT_FOUND/
    );
  });

  test('AN30 — Sprite Fallback: se sprite animado quebrar, fallback seguro é aplicado', () => {
    const { registry, playerSprite } = setupTestHarness();

    registry.updateSprite('player', {
      name: 'pikachu',
      animatedUrl: 'broken-animated.gif',
      fallbackUrl: 'safe-fallback.png'
    });

    assert.equal(playerSprite.src, 'broken-animated.gif');

    // Simula disparo de onerror do elemento <img>
    assert.equal(typeof playerSprite.onerror, 'function');
    playerSprite.onerror();

    assert.equal(playerSprite.src, 'safe-fallback.png');
  });

  // ====================================================================
  // 10. INTEGRAÇÃO COM PRESENTATION ENGINE (AN31–AN34)
  // ====================================================================

  test('AN31 — Integration Attack: MOVE_ANNOUNCEMENT dispara playAttack via DOM Adapter', async () => {
    const { domAdapter, controller } = setupTestHarness();
    let attackInvoked = false;
    controller.playAttack = async (side) => {
      if (side === 'player') attackInvoked = true;
    };

    await domAdapter.execute({
      type: PRESENTATION_COMMANDS.MOVE_ANNOUNCEMENT,
      actor: 'player',
      moveName: 'thunderbolt'
    });

    assert.equal(attackInvoked, true);
  });

  test('AN32 — Integration Damage: HP_TRANSITION (dano > 0) dispara playDamageReaction via DOM Adapter', async () => {
    const { domAdapter, controller } = setupTestHarness();
    let damageInvoked = false;
    controller.playDamageReaction = async (side) => {
      if (side === 'enemy') damageInvoked = true;
    };

    await domAdapter.execute({
      type: PRESENTATION_COMMANDS.HP_TRANSITION,
      target: 'enemy',
      damage: 35
    });

    assert.equal(damageInvoked, true);
  });

  test('AN33 — Integration Faint: FAINT_SEQUENCE dispara playFaint via DOM Adapter', async () => {
    const { domAdapter, controller } = setupTestHarness();
    let faintInvoked = false;
    controller.playFaint = async (side) => {
      if (side === 'enemy') faintInvoked = true;
    };

    await domAdapter.execute({
      type: PRESENTATION_COMMANDS.FAINT_SEQUENCE,
      target: 'enemy',
      pokemonName: 'charmander'
    });

    assert.equal(faintInvoked, true);
  });

  test('AN34 — Integration Switch: SWITCH_OUT e SWITCH_IN disparam fluxo sequencial de troca', async () => {
    const { domAdapter, controller } = setupTestHarness();
    const calls = [];
    controller.playSwitchOut = async (side) => { calls.push(`out:${side}`); };
    controller.playSwitchIn = async (side) => { calls.push(`in:${side}`); };

    await domAdapter.execute({
      type: PRESENTATION_COMMANDS.SWITCH_OUT_SEQUENCE,
      side: 'player'
    });
    await domAdapter.execute({
      type: PRESENTATION_COMMANDS.SWITCH_IN_SEQUENCE,
      side: 'player',
      newPokemonId: 7
    });

    assert.deepEqual(calls, ['out:player', 'in:player']);
  });

  // ====================================================================
  // 11. TRACES REAIS COMPLETOS COM BATTLE ENGINE (AN35–AN36)
  // ====================================================================

  test('AN35 — Full KO Trace: batch real da Engine (Move, Damage, Faint, Replacement) executado através da pipeline visual', async () => {
    const team1 = PlayerTeam3Fixture;
    const team2 = EnemyTeam3Fixture;

    const battle = BattleEngine.createTeamBattle(team1, team2);
    // Deixa Bulbasaur com 1 HP para nocaute imediato com Ember
    battle.enemy.team[0].currentHp = 1;

    const turnResult = BattleEngine.resolveTurn(battle, {
      player: { moveName: 'ember', accuracyRoll: 1 },
      enemy: { moveName: 'vine-whip', accuracyRoll: 1 }
    });

    const { domAdapter, controller, enemySprite } = setupTestHarness();
    const engine = new BattlePresentationEngine({ adapter: domAdapter });

    const playResult = await engine.play(turnResult.events);

    assert.equal(playResult.status, PRESENTATION_STATUS.COMPLETED);
    // Valida que o defensor terminou nocauteado e oculto
    assert.equal(controller.isIdleActive('enemy'), false);
    assert.equal(enemySprite.style.opacity, '0');
    assert.equal(enemySprite.classList.contains(ANIMATION_CSS_CLASSES.HIDDEN), true);
  });

  test('AN36 — Full Switch Trace: evento real de troca voluntária executado através da pipeline visual', async () => {
    const team1 = PlayerTeam3Fixture;
    const team2 = EnemyTeam3Fixture;

    const battle = BattleEngine.createTeamBattle(team1, team2);

    const turnResult = BattleEngine.resolveTurn(battle, {
      player: { type: BattleConstants.BATTLE_ACTIONS.SWITCH, targetIndex: 1 },
      enemy: { moveName: 'scratch', accuracyRoll: 1 }
    });

    const { domAdapter, controller, playerSprite } = setupTestHarness();
    const engine = new BattlePresentationEngine({ adapter: domAdapter });

    const playResult = await engine.play(turnResult.events);

    assert.equal(playResult.status, PRESENTATION_STATUS.COMPLETED);
    // O novo Pokémon ativo deve terminar visível e com idle ativo
    assert.equal(controller.isIdleActive('player'), true);
    assert.equal(playerSprite.style.opacity, '1');
  });
});
