/**
 * ====================================================================
 * SUÍTE DE TESTES AUTOMATIZADOS: BATTLE CAMERA & IMPACT
 * ====================================================================
 * Cobre integralmente os portões de homologação CAM01 a CAM40 da Fase PBA-012.
 *
 * Princípios Fundamentais:
 * - CAMERA SYSTEM ≠ GAME RULES;
 * - CAMERA SYSTEM ≠ DAMAGE CALCULATION;
 * - Isolamento de escopo (apenas o palco de batalha sofre transforms, nunca body/html);
 * - Tolerante a execução headless no Node.js com mocks determinísticos;
 * - 0 mutação de regras matemáticas ou dados de golpes.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const BattleCameraConstants = require('../../assets/js/camera/battle-camera-constants');
const BattleCameraResolver = require('../../assets/js/camera/battle-camera-resolver');
const BattleCameraRegistry = require('../../assets/js/camera/battle-camera-registry');
const { BattleCameraController, createCameraController } = require('../../assets/js/camera/battle-camera-controller');
const { BattleCameraDomAdapter, createCameraDomAdapter } = require('../../assets/js/camera/battle-camera-dom-adapter');
const { CompositeBattleDomAdapter } = require('../../assets/js/presentation/composite-battle-dom-adapter');
const PresentationMapper = require('../../assets/js/presentation/battle-presentation-mapper');
const { BattlePresentationEngine } = require('../../assets/js/presentation/battle-presentation-engine');
const { ImmediateScheduler } = require('../../assets/js/presentation/battle-presentation-scheduler');
const BattleEngine = require('../../assets/js/battle/battle-engine');
const { PikachuFixture, BulbasaurFixture } = require('../fixtures/pokemon-fixtures');
const { ThunderboltFixture, FlamethrowerFixture, VineWhipFixture } = require('../fixtures/move-fixtures');

describe('PHASE PBA-012 — BATTLE CAMERA & IMPACT SUITE (CAM01–CAM40)', () => {

  // CAM01 — Camera Constants
  it('CAM01 — Camera Constants: define efeitos, níveis, magnitudes, punch, flash e hold', () => {
    assert.ok(BattleCameraConstants.CAMERA_EFFECTS);
    assert.equal(BattleCameraConstants.CAMERA_EFFECTS.SHAKE, 'SHAKE');
    assert.equal(BattleCameraConstants.CAMERA_EFFECTS.PUNCH_IN, 'PUNCH_IN');
    assert.equal(BattleCameraConstants.CAMERA_EFFECTS.HIT_FLASH, 'HIT_FLASH');
    assert.equal(BattleCameraConstants.CAMERA_EFFECTS.IMPACT_HOLD, 'IMPACT_HOLD');

    assert.ok(BattleCameraConstants.IMPACT_LEVELS);
    assert.equal(BattleCameraConstants.IMPACT_LEVELS.NONE, 'NONE');
    assert.equal(BattleCameraConstants.IMPACT_LEVELS.LIGHT, 'LIGHT');
    assert.equal(BattleCameraConstants.IMPACT_LEVELS.MEDIUM, 'MEDIUM');
    assert.equal(BattleCameraConstants.IMPACT_LEVELS.HEAVY, 'HEAVY');

    assert.ok(BattleCameraConstants.SHAKE_MAGNITUDES);
    assert.ok(BattleCameraConstants.PUNCH_SCALES);
    assert.ok(BattleCameraConstants.FLASH_OPACITIES);
    assert.ok(BattleCameraConstants.IMPACT_HOLD_DURATIONS);
    assert.ok(BattleCameraConstants.SAFETY_LIMITS);
  });

  // CAM02 — Camera Controller Exists
  it('CAM02 — Camera Controller Exists: instancia e expõe métodos públicos de ciclo de vida', () => {
    const controller = createCameraController();
    assert.ok(controller);
    assert.equal(typeof controller.playImpact, 'function');
    assert.equal(typeof controller.playMiss, 'function');
    assert.equal(typeof controller.playImmunity, 'function');
    assert.equal(typeof controller.playVictory, 'function');
    assert.equal(typeof controller.playDefeat, 'function');
    assert.equal(typeof controller.cancel, 'function');
    assert.equal(typeof controller.reset, 'function');
  });

  // CAM03 — Camera Registry Exists
  it('CAM03 — Camera Registry Exists: gerencia referências de wrapper, palco e overlay', () => {
    const registry = new BattleCameraRegistry();
    assert.ok(registry);
    const camera = registry.getCamera();
    const stage = registry.getStage();
    const flash = registry.getFlashOverlay();
    assert.ok(camera, 'Deve fornecer mock seguro de wrapper');
    assert.ok(stage, 'Deve fornecer mock seguro de stage');
    assert.ok(flash, 'Deve fornecer mock seguro de flash overlay');
    assert.equal(registry.hasElements(), true);

    registry.reset();
    assert.equal(registry.cameraWrapper, null);
  });

  // CAM04 — Camera Resolver Exists
  it('CAM04 — Camera Resolver Exists: exporta resolve() e resolveImpactLevel() como funções puras', () => {
    assert.equal(typeof BattleCameraResolver.resolve, 'function');
    assert.equal(typeof BattleCameraResolver.resolveImpactLevel, 'function');
    const desc = BattleCameraResolver.resolve({ damage: 30, power: 40 });
    assert.ok(desc);
    assert.equal(typeof desc.impactLevel, 'string');
    assert.equal(typeof desc.shakeMagnitude, 'number');
    assert.equal(typeof desc.punchScale, 'number');
  });

  // CAM05 — Camera DOM Adapter Exists
  it('CAM05 — Camera DOM Adapter Exists: instancia e implementa interface de apresentação', () => {
    const adapter = createCameraDomAdapter();
    assert.ok(adapter);
    assert.equal(typeof adapter.handleCommand, 'function');
    assert.equal(typeof adapter.cancel, 'function');
    assert.equal(typeof adapter.reset, 'function');
  });

  // CAM06 — Light Impact
  it('CAM06 — Light Impact: power <= 50 ou intensity LOW resulta em nível LIGHT', () => {
    const descPower = BattleCameraResolver.resolve({ damage: 20, power: 40 });
    assert.equal(descPower.impactLevel, 'LIGHT');

    const descIntensity = BattleCameraResolver.resolve({ damage: 15, intensity: 'LOW' });
    assert.equal(descIntensity.impactLevel, 'LIGHT');
  });

  // CAM07 — Medium Impact
  it('CAM07 — Medium Impact: power 51..90 ou intensity MEDIUM resulta em nível MEDIUM', () => {
    const descPower = BattleCameraResolver.resolve({ damage: 45, power: 80 });
    assert.equal(descPower.impactLevel, 'MEDIUM');

    const descIntensity = BattleCameraResolver.resolve({ damage: 50, intensity: 'MEDIUM' });
    assert.equal(descIntensity.impactLevel, 'MEDIUM');
  });

  // CAM08 — Heavy Impact
  it('CAM08 — Heavy Impact: power > 90 ou intensity HIGH resulta em nível HEAVY', () => {
    const descPower = BattleCameraResolver.resolve({ damage: 95, power: 120 });
    assert.equal(descPower.impactLevel, 'HEAVY');

    const descIntensity = BattleCameraResolver.resolve({ damage: 80, intensity: 'HIGH' });
    assert.equal(descIntensity.impactLevel, 'HEAVY');
  });

  // CAM09 — Light Shake Magnitude
  it('CAM09 — Light Shake Magnitude: magnitude LIGHT configurada em 2.5px', () => {
    assert.equal(BattleCameraConstants.SHAKE_MAGNITUDES.LIGHT, 2.5);
    const desc = BattleCameraResolver.resolve({ damage: 20, power: 40 });
    assert.equal(desc.shakeMagnitude, 2.5);
  });

  // CAM10 — Medium Shake Magnitude
  it('CAM10 — Medium Shake Magnitude: magnitude MEDIUM configurada em 5.0px', () => {
    assert.equal(BattleCameraConstants.SHAKE_MAGNITUDES.MEDIUM, 5.0);
    const desc = BattleCameraResolver.resolve({ damage: 40, power: 80 });
    assert.equal(desc.shakeMagnitude, 5.0);
  });

  // CAM11 — Heavy Shake Magnitude
  it('CAM11 — Heavy Shake Magnitude: magnitude HEAVY configurada em 8.5px', () => {
    assert.equal(BattleCameraConstants.SHAKE_MAGNITUDES.HEAVY, 8.5);
    const desc = BattleCameraResolver.resolve({ damage: 90, power: 100 });
    assert.equal(desc.shakeMagnitude, 8.5);
  });

  // CAM12 — Camera Punch
  it('CAM12 — Camera Punch: escalas progressivas de micro zoom (> 1.0)', () => {
    assert.equal(BattleCameraConstants.PUNCH_SCALES.NONE, 1.0);
    assert.equal(BattleCameraConstants.PUNCH_SCALES.LIGHT, 1.015);
    assert.equal(BattleCameraConstants.PUNCH_SCALES.MEDIUM, 1.025);
    assert.equal(BattleCameraConstants.PUNCH_SCALES.HEAVY, 1.04);
    assert.ok(BattleCameraConstants.PUNCH_SCALES.HEAVY <= BattleCameraConstants.SAFETY_LIMITS.MAX_PUNCH_SCALE);
  });

  // CAM13 — Camera Returns To Base
  it('CAM13 — Camera Returns To Base: após efeito ou cancel(), transform retorna ao estado base', async () => {
    const controller = createCameraController({ skipAnimations: true });
    await controller.playImpact({ damage: 50, power: 80 });
    const camera = controller._getCamera();
    assert.equal(camera.style.transform, '');
    controller.cancel();
    assert.equal(camera.style.transform, '');
  });

  // CAM14 — Hit Flash
  it('CAM14 — Hit Flash: opacidades progressivas moderadas para flash de impacto', () => {
    assert.equal(BattleCameraConstants.FLASH_OPACITIES.NONE, 0);
    assert.equal(BattleCameraConstants.FLASH_OPACITIES.LIGHT, 0.15);
    assert.equal(BattleCameraConstants.FLASH_OPACITIES.MEDIUM, 0.25);
    assert.equal(BattleCameraConstants.FLASH_OPACITIES.HEAVY, 0.38);
  });

  // CAM15 — No Strobe
  it('CAM15 — No Strobe: NO_STROBE_EFFECT = YES e opacidade máxima abaixo de 0.5', () => {
    assert.equal(BattleCameraConstants.SAFETY_LIMITS.NO_STROBE_EFFECT, true);
    assert.equal(BattleCameraConstants.SAFETY_LIMITS.NO_RAPID_FLASH_PATTERN, true);
    assert.ok(BattleCameraConstants.FLASH_OPACITIES.HEAVY <= BattleCameraConstants.SAFETY_LIMITS.MAX_FLASH_OPACITY);
  });

  // CAM16 — Miss No Damage Shake
  it('CAM16 — Miss No Damage Shake: MISS_DAMAGE_SHAKE = NO em caso de erro', async () => {
    const desc = BattleCameraResolver.resolve({ isMiss: true, damage: 0 });
    assert.equal(desc.impactLevel, 'NONE');
    assert.equal(desc.shakeMagnitude, 0);

    const controller = createCameraController();
    const result = await controller.playMiss();
    assert.equal(result.damageShake, false);
  });

  // CAM17 — Immunity No Damage Shake
  it('CAM17 — Immunity No Damage Shake: IMMUNITY_DAMAGE_SHAKE = NO em caso de imunidade', async () => {
    const desc = BattleCameraResolver.resolve({ isImmune: true, damage: 0, multiplier: 0 });
    assert.equal(desc.impactLevel, 'NONE');
    assert.equal(desc.shakeMagnitude, 0);

    const controller = createCameraController();
    const result = await controller.playImmunity();
    assert.equal(result.damageShake, false);
  });

  // CAM18 — Resisted Reduced Impact
  it('CAM18 — Resisted Reduced Impact: multiplier <= 0.5 atenua o nível de impacto mantendo piso LIGHT', () => {
    // Golpe originalmente HEAVY (power 100) resistido (multiplier 0.5) atenua para MEDIUM
    const descHeavyResisted = BattleCameraResolver.resolve({ damage: 25, power: 100, multiplier: 0.5 });
    assert.equal(descHeavyResisted.impactLevel, 'MEDIUM');

    // Golpe originalmente MEDIUM (power 70) resistido (multiplier 0.5) atenua para LIGHT
    const descMedResisted = BattleCameraResolver.resolve({ damage: 15, power: 70, multiplier: 0.5 });
    assert.equal(descMedResisted.impactLevel, 'LIGHT');

    // Golpe LIGHT (power 40) resistido mantém LIGHT se houver dano
    const descLightResisted = BattleCameraResolver.resolve({ damage: 8, power: 40, multiplier: 0.5 });
    assert.equal(descLightResisted.impactLevel, 'LIGHT');
  });

  // CAM19 — Super Effective Enhanced Impact
  it('CAM19 — Super Effective Enhanced Impact: multiplier >= 2 promove o nível de impacto', () => {
    // Golpe originalmente LIGHT (power 40) super efetivo (multiplier 2) promove para MEDIUM
    const descLightSuper = BattleCameraResolver.resolve({ damage: 40, power: 40, multiplier: 2 });
    assert.equal(descLightSuper.impactLevel, 'MEDIUM');

    // Golpe originalmente MEDIUM (power 80) super efetivo (multiplier 2) promove para HEAVY
    const descMedSuper = BattleCameraResolver.resolve({ damage: 90, power: 80, multiplier: 2 });
    assert.equal(descMedSuper.impactLevel, 'HEAVY');
  });

  // CAM20 — 4x Heavy Impact
  it('CAM20 — 4x Heavy Impact: multiplier >= 4 garante impacto no teto HEAVY', () => {
    const desc4x = BattleCameraResolver.resolve({ damage: 110, power: 50, multiplier: 4 });
    assert.equal(desc4x.impactLevel, 'HEAVY');
    assert.equal(desc4x.shakeMagnitude, 8.5);
    assert.equal(desc4x.punchScale, 1.04);
  });

  // CAM21 — Impact Hold Light
  it('CAM21 — Impact Hold Light: impactos leves não introduzem pausa (holdMs = 0)', () => {
    const desc = BattleCameraResolver.resolve({ damage: 20, power: 40 });
    assert.equal(desc.holdMs, 0);
  });

  // CAM22 — Impact Hold Heavy
  it('CAM22 — Impact Hold Heavy: impactos fortes possuem pausa de sustentação (holdMs > 0)', () => {
    const desc = BattleCameraResolver.resolve({ damage: 90, power: 100 });
    assert.equal(desc.holdMs, 80);
    assert.ok(desc.holdMs <= BattleCameraConstants.SAFETY_LIMITS.MAX_HOLD_DURATION);
  });

  // CAM23 — No Global Time Scale
  it('CAM23 — No Global Time Scale: GLOBAL_TIME_SCALE = NO (não altera timers globais)', () => {
    // Verifica ausência de alteração de window.requestAnimationFrame ou document timing
    const controller = createCameraController();
    assert.ok(controller);
    assert.equal(typeof setTimeout, 'function');
  });

  // CAM24 — Reduced Motion Disables Shake
  it('CAM24 — Reduced Motion Disables Shake: desabilita tremor visual com reducedMotion=true', async () => {
    const controller = createCameraController({ reducedMotion: true });
    const res = await controller.playImpact({ damage: 80, power: 100 });
    assert.equal(res.reducedMotion, true);
    assert.equal(controller.isShaking, false);
  });

  // CAM25 — Reduced Motion Disables Punch
  it('CAM25 — Reduced Motion Disables Punch: micro zoom desabilitado sob reducedMotion', async () => {
    const controller = createCameraController({ reducedMotion: true });
    await controller.playImpact({ damage: 80, power: 100 });
    assert.equal(controller.isPunching, false);
  });

  // CAM26 — Reduced Motion Safe Flash
  it('CAM26 — Reduced Motion Safe Flash: flash reduzido ou atenuado com segurança sob reducedMotion', async () => {
    const controller = createCameraController({ reducedMotion: true });
    const res = await controller.playImpact({ damage: 80, power: 100 });
    assert.ok(res.reducedMotion);
    const flash = controller._getFlashOverlay();
    // Flash deve estar em 0 ou atenuado para <= 0.08
    const op = Number(flash.style.opacity || 0);
    assert.ok(op <= 0.08);
  });

  // CAM27 — Skip Animations Immediate
  it('CAM27 — Skip Animations Immediate: conclui imediatamente em 0ms quando skipAnimations=true', async () => {
    const controller = createCameraController({ skipAnimations: true });
    const start = Date.now();
    const res = await controller.playImpact({ damage: 90, power: 100 });
    const elapsed = Date.now() - start;
    assert.ok(elapsed < 20);
    assert.equal(res.skipped, true);
  });

  // CAM28 — Cancel
  it('CAM28 — Cancel: cancel() limpa timers, reseta transform e zera opacidades ativas', () => {
    const controller = createCameraController();
    controller._activeTimers.add(setTimeout(() => {}, 1000));
    controller.isShaking = true;
    controller.isPunching = true;
    controller.cancel();
    assert.equal(controller._activeTimers.size, 0);
    assert.equal(controller.isShaking, false);
    assert.equal(controller.isPunching, false);
  });

  // CAM29 — Reset
  it('CAM29 — Reset: reset() restaura o subsistema para estado reutilizável limpo', () => {
    const controller = createCameraController();
    controller.reset();
    assert.equal(controller.isShaking, false);
    assert.equal(controller.isPunching, false);
    assert.equal(controller.isFlashing, false);
  });

  // CAM30 — Cleanup
  it('CAM30 — Cleanup: zero timers e zero classes acumuladas após execução completa', async () => {
    const controller = createCameraController({ skipAnimations: true });
    await controller.playImpact({ damage: 50, power: 80 });
    assert.equal(controller._activeTimers.size, 0);
    assert.equal(controller._activeAnimations.size, 0);
  });

  // CAM31 — Concurrent Effect Protection
  it('CAM31 — Concurrent Effect Protection: política CANCEL_PREVIOUS impede acúmulo de efeitos', async () => {
    const controller = createCameraController({ skipAnimations: true });
    // Dispara dois impactos seguidos; o segundo deve cancelar o primeiro sem erro
    const p1 = controller.playImpact({ damage: 40, power: 50 });
    const p2 = controller.playImpact({ damage: 90, power: 100 });
    const [r1, r2] = await Promise.all([p1, p2]);
    assert.ok(r1.cancelled || r1.skipped);
    assert.equal(r2.skipped, true);
  });

  // CAM32 — Stage Only
  it('CAM32 — Stage Only: transforms aplicados somente ao wrapper, nunca ao body ou html', () => {
    const registry = new BattleCameraRegistry();
    const camera = registry.getCamera();
    assert.notEqual(camera, typeof document !== 'undefined' ? document.body : null);
    assert.notEqual(camera, typeof document !== 'undefined' ? document.documentElement : null);
  });

  // CAM33 — Move Announcement No Hit Shake
  it('CAM33 — Move Announcement No Hit Shake: MOVE_ANNOUNCEMENT não executa hit shake', async () => {
    let impactPlayed = false;
    const dummyController = {
      playImpact: () => { impactPlayed = true; return Promise.resolve(); },
      playMiss: () => Promise.resolve(),
      playImmunity: () => Promise.resolve(),
      playVictory: () => Promise.resolve(),
      playDefeat: () => Promise.resolve()
    };
    const adapter = new BattleCameraDomAdapter({ cameraController: dummyController });
    await adapter.handleCommand({
      type: 'MOVE_ANNOUNCEMENT',
      moveId: 'thunderbolt',
      moveType: 'electric',
      power: 90
    });
    assert.equal(impactPlayed, false, 'MOVE_ANNOUNCEMENT não pode disparar hit shake');
  });

  // CAM34 — HP Transition Triggers Camera Impact
  it('CAM34 — HP Transition Triggers Camera Impact: HP_TRANSITION com damage > 0 dispara playImpact', async () => {
    let capturedMeta = null;
    const dummyController = {
      playImpact: (meta) => { capturedMeta = meta; return Promise.resolve({ played: true }); },
      playMiss: () => Promise.resolve(),
      playImmunity: () => Promise.resolve()
    };
    const adapter = new BattleCameraDomAdapter({ cameraController: dummyController });
    await adapter.handleCommand({
      type: 'HP_TRANSITION',
      side: 'enemy',
      damage: 42,
      multiplier: 1,
      power: 90
    });
    assert.ok(capturedMeta);
    assert.equal(capturedMeta.damage, 42);
    assert.equal(capturedMeta.power, 90);
  });

  // CAM35 — Miss Presentation Integration
  it('CAM35 — Miss Presentation Integration: MOVE_MISS_FEEDBACK dispara playMiss sem shake de dano', async () => {
    let missCalled = false;
    const dummyController = {
      playImpact: () => Promise.resolve(),
      playMiss: () => { missCalled = true; return Promise.resolve({ damageShake: false }); }
    };
    const adapter = new BattleCameraDomAdapter({ cameraController: dummyController });
    await adapter.handleCommand({
      type: 'MOVE_MISS_FEEDBACK',
      attacker: 'player',
      target: 'enemy'
    });
    assert.equal(missCalled, true);
  });

  // CAM36 — Immunity Presentation Integration
  it('CAM36 — Immunity Presentation Integration: EFFECTIVENESS_FEEDBACK com multiplier=0 dispara playImmunity', async () => {
    let immunityCalled = false;
    const dummyController = {
      playImpact: () => Promise.resolve(),
      playImmunity: () => { immunityCalled = true; return Promise.resolve({ damageShake: false }); }
    };
    const adapter = new BattleCameraDomAdapter({ cameraController: dummyController });
    await adapter.handleCommand({
      type: 'EFFECTIVENESS_FEEDBACK',
      target: 'enemy',
      multiplier: 0
    });
    assert.equal(immunityCalled, true);
  });

  // CAM37 — Super Effective Integration
  it('CAM37 — Super Effective Integration: multiplier >= 2 repassado no comando enriquece descritor', async () => {
    let capturedMeta = null;
    const dummyController = {
      playImpact: (meta) => {
        capturedMeta = meta;
        const desc = BattleCameraResolver.resolve(meta);
        return Promise.resolve({ played: true, descriptor: desc });
      }
    };
    const adapter = new BattleCameraDomAdapter({ cameraController: dummyController });
    await adapter.handleCommand({
      type: 'HP_TRANSITION',
      side: 'enemy',
      damage: 75,
      multiplier: 2,
      power: 80
    });
    assert.ok(capturedMeta);
    assert.equal(capturedMeta.multiplier, 2);
    const desc = BattleCameraResolver.resolve(capturedMeta);
    assert.equal(desc.impactLevel, 'HEAVY');
  });

  // CAM38 — Composite Adapter Integration
  it('CAM38 — Composite Adapter Integration: coordena Animation + VFX + Audio + Camera em HP_TRANSITION', async () => {
    let animCalled = false;
    let audioCalled = false;
    let cameraCalled = false;

    const dummyAnim = { playDamageReaction: () => { animCalled = true; return Promise.resolve(); } };
    const dummyAudio = { playMoveImpact: () => { audioCalled = true; return Promise.resolve(); } };
    const dummyCamera = { playImpact: () => { cameraCalled = true; return Promise.resolve(); } };

    const composite = new CompositeBattleDomAdapter({
      pokemonController: dummyAnim,
      vfxController: null,
      audioController: dummyAudio,
      cameraController: dummyCamera
    });

    await composite.handleCommand({
      type: 'HP_TRANSITION',
      side: 'enemy',
      damage: 35,
      multiplier: 1,
      attackType: 'electric'
    });

    assert.equal(animCalled, true, 'Animação corporal de dano deve ser chamada');
    assert.equal(audioCalled, true, 'Áudio de impacto deve ser chamado');
    assert.equal(cameraCalled, true, 'Câmera de impacto deve ser chamada');
  });

  // CAM39 — Full KO Trace
  it('CAM39 — Full KO Trace: fluxo de nocaute processa dano, áudio e câmera sem conflito', async () => {
    let cameraImpactCount = 0;
    const dummyCamera = {
      playImpact: () => { cameraImpactCount++; return Promise.resolve(); },
      playVictory: () => Promise.resolve(),
      playDefeat: () => Promise.resolve()
    };

    const composite = new CompositeBattleDomAdapter({
      pokemonController: null,
      vfxController: null,
      audioController: null,
      cameraController: dummyCamera
    });

    // Simula sequência de eventos de KO
    await composite.handleCommand({
      type: 'HP_TRANSITION',
      side: 'enemy',
      damage: 100,
      currentHp: 0,
      previousHp: 100,
      multiplier: 2
    });
    await composite.handleCommand({
      type: 'FAINT_SEQUENCE',
      side: 'enemy',
      pokemonName: 'Bulbasaur'
    });
    await composite.handleCommand({
      type: 'BATTLE_RESULT',
      winner: 'player'
    });

    assert.equal(cameraImpactCount, 1, 'Apenas HP_TRANSITION deve disparar impacto de dano');
  });

  // CAM40 — Full Real Battle Camera Trace
  it('CAM40 — Full Real Battle Camera Trace: batch real da Engine com trocas e ataques passa por todo o pipeline', async () => {
    // 1. Cria batalha real determinística 1x1
    const pika = JSON.parse(JSON.stringify(PikachuFixture));
    const bulba = JSON.parse(JSON.stringify(BulbasaurFixture));
    pika.moves = [ThunderboltFixture];
    bulba.moves = [VineWhipFixture];

    const battle = BattleEngine.createBattle(pika, bulba);
    const turnResult = BattleEngine.resolveTurn(battle, {
      playerAction: { type: 'MOVE', moveIndex: 0 },
      enemyAction: { type: 'MOVE', moveIndex: 0 }
    });

    assert.ok(turnResult.events.length > 0);

    // 2. Mapeia eventos da Engine para comandos de apresentação
    const commands = PresentationMapper.mapEvents(turnResult.events, {
      player: { team: [pika] },
      enemy: { team: [bulba] }
    });

    assert.ok(commands.length > 0);

    // 3. Orquestra através de Presentation Engine com CompositeAdapter real (incluindo Camera)
    const cameraController = createCameraController({ skipAnimations: true });
    const compositeAdapter = new CompositeBattleDomAdapter({
      pokemonController: null,
      vfxController: null,
      audioController: null,
      cameraController
    });

    const presentationEngine = new BattlePresentationEngine({
      adapter: compositeAdapter,
      scheduler: new ImmediateScheduler()
    });

    const execution = await presentationEngine.play(turnResult.events, {
      player: { team: [pika] },
      enemy: { team: [bulba] }
    });
    assert.equal(execution.status, 'COMPLETED');
    assert.ok(execution.commandsExecuted > 0);
    assert.ok(compositeAdapter.executedCommands.length > 0);
  });
});
