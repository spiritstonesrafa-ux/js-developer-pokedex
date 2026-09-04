/**
 * ====================================================================
 * SUÍTE DE TESTES: BATTLE AUDIO SYSTEM (AU01–AU40)
 * ====================================================================
 * Validação abrangente dos gates oficiais da Fase PBA-011 para o
 * subsistema de áudio procedural e integração à Presentation Engine.
 */

const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert');

// Módulos do subsistema de áudio
const audioConstants = require('../../assets/js/audio/battle-audio-constants.js');
const { AudioContextManager, FakeAudioContext } = require('../../assets/js/audio/audio-context-manager.js');
const { AudioMixer } = require('../../assets/js/audio/audio-mixer.js');
const { ProceduralSfxGenerator } = require('../../assets/js/audio/procedural-sfx.js');
const { BattleAudioResolver } = require('../../assets/js/audio/battle-audio-resolver.js');
const { BattleAudioController } = require('../../assets/js/audio/battle-audio-controller.js');
const { BattleAudioAdapter } = require('../../assets/js/audio/battle-audio-adapter.js');

// Módulos de apresentação e combate para testes de integração
const { CompositeBattleDomAdapter } = require('../../assets/js/presentation/composite-battle-dom-adapter.js');
const { BattlePresentationEngine } = require('../../assets/js/presentation/battle-presentation-engine.js');
const { BattlePresentationMapper } = require('../../assets/js/presentation/battle-presentation-mapper.js');
const { ImmediateScheduler } = require('../../assets/js/presentation/battle-presentation-scheduler.js');
const { PokemonAnimationController } = require('../../assets/js/presentation/animation/pokemon-animation-controller.js');
const { PokemonAnimationRegistry } = require('../../assets/js/presentation/animation/pokemon-animation-registry.js');
const BattleEngine = require('../../assets/js/battle/battle-engine.js');
const { BATTLE_EVENTS } = require('../../assets/js/battle/battle-constants.js');

// Fixtures
const {
  PikachuFixture,
  BulbasaurFixture,
  CharmanderFixture,
  SquirtleFixture
} = require('../fixtures/pokemon-fixtures.js');

const {
  ThunderboltFixture,
  FlamethrowerFixture,
  VineWhipFixture
} = require('../fixtures/move-fixtures.js');

describe('PHASE PBA-011 — BATTLE AUDIO SYSTEM SUITE (AU01–AU40)', () => {
  let contextManager;
  let mixer;
  let sfx;
  let controller;

  beforeEach(() => {
    contextManager = new AudioContextManager({ autoUnlock: true });
    mixer = new AudioMixer(contextManager);
    sfx = new ProceduralSfxGenerator(mixer, contextManager);
    controller = new BattleAudioController({
      contextManager,
      mixer,
      sfxGenerator: sfx,
      resolver: BattleAudioResolver
    });
  });

  // AU01 — Audio Constants
  test('AU01 — Audio Constants: canais, volumes padrão e tipos definidos', () => {
    assert.ok(audioConstants.AUDIO_CHANNELS.MASTER);
    assert.ok(audioConstants.AUDIO_CHANNELS.MUSIC);
    assert.ok(audioConstants.AUDIO_CHANNELS.SFX);
    assert.ok(audioConstants.AUDIO_CHANNELS.CRY);
    assert.ok(audioConstants.AUDIO_CHANNELS.UI);
    assert.strictEqual(Object.keys(audioConstants.TYPE_AUDIO_FAMILIES).length, 18);
    assert.strictEqual(audioConstants.TYPE_AUDIO_COUNT, 18);
    assert.strictEqual(audioConstants.MAX_SIMULTANEOUS_SFX, 8);
  });

  // AU02 — Audio Context Manager
  test('AU02 — Audio Context Manager: inicializa em estado LOCKED e fornece contexto único', () => {
    const freshMgr = new AudioContextManager({ autoUnlock: false });
    assert.strictEqual(freshMgr.getState(), audioConstants.AUDIO_STATES.LOCKED);
    const ctx1 = freshMgr.getContext();
    const ctx2 = freshMgr.getContext();
    assert.strictEqual(ctx1, ctx2, 'AudioContext deve ser singleton reutilizado');
  });

  // AU03 — Mixer Exists
  test('AU03 — Mixer Exists: inicializa grafo com nós de canais e master', () => {
    assert.ok(mixer.getChannelNode('MUSIC'));
    assert.ok(mixer.getChannelNode('SFX'));
    assert.ok(mixer.getChannelNode('CRY'));
    assert.ok(mixer.getChannelNode('UI'));
    assert.ok(mixer.getChannelNode('MASTER'));
  });

  // AU04 — Audio Controller Exists
  test('AU04 — Audio Controller Exists: instancia e exporta métodos de ciclo de vida', () => {
    assert.strictEqual(typeof controller.unlock, 'function');
    assert.strictEqual(typeof controller.playMoveAttack, 'function');
    assert.strictEqual(typeof controller.playMoveImpact, 'function');
    assert.strictEqual(typeof controller.playMiss, 'function');
    assert.strictEqual(typeof controller.playImmunity, 'function');
    assert.strictEqual(typeof controller.startBattleMusic, 'function');
    assert.strictEqual(typeof controller.stopBattleMusic, 'function');
    assert.strictEqual(typeof controller.cancel, 'function');
    assert.strictEqual(typeof controller.reset, 'function');
  });

  // AU05 — Audio Adapter Exists
  test('AU05 — Audio Adapter Exists: instancia e implementa interface BattlePresentationAdapter', () => {
    const adapter = new BattleAudioAdapter({ audioController: controller });
    assert.strictEqual(typeof adapter.execute, 'function');
    assert.strictEqual(typeof adapter.cancel, 'function');
    assert.strictEqual(typeof adapter.reset, 'function');
  });

  // AU06 — Master Volume
  test('AU06 — Master Volume: aceita valores entre 0.0 e 1.0 e atualiza ganho', () => {
    mixer.setMasterVolume(0.4);
    assert.strictEqual(mixer.getMasterVolume(), 0.4);
    mixer.setMasterVolume(1.0);
    assert.strictEqual(mixer.getMasterVolume(), 1.0);
    mixer.setMasterVolume(0.0);
    assert.strictEqual(mixer.getMasterVolume(), 0.0);
  });

  // AU07 — Music Volume
  test('AU07 — Music Volume: atualiza volume do canal de música', () => {
    mixer.setMusicVolume(0.35);
    assert.strictEqual(mixer.getMusicVolume(), 0.35);
  });

  // AU08 — SFX Volume
  test('AU08 — SFX Volume: atualiza volume do canal de SFX', () => {
    mixer.setSfxVolume(0.75);
    assert.strictEqual(mixer.getSfxVolume(), 0.75);
  });

  // AU09 — Cry Volume
  test('AU09 — Cry Volume: atualiza volume do canal de cry', () => {
    mixer.setCryVolume(0.65);
    assert.strictEqual(mixer.getCryVolume(), 0.65);
  });

  // AU10 — UI Volume
  test('AU10 — UI Volume: atualiza volume do canal de interface', () => {
    mixer.setUiVolume(0.55);
    assert.strictEqual(mixer.getUiVolume(), 0.55);
  });

  // AU11 — Invalid Volume Rejected
  test('AU11 — Invalid Volume Rejected: rejeita valores fora do intervalo ou não numéricos', () => {
    assert.throws(() => mixer.setMasterVolume(-0.1), /INVALID_VOLUME/);
    assert.throws(() => mixer.setMasterVolume(1.05), /INVALID_VOLUME/);
    assert.throws(() => mixer.setMasterVolume(NaN), /INVALID_VOLUME/);
    assert.throws(() => mixer.setMasterVolume(Infinity), /INVALID_VOLUME/);
    assert.throws(() => mixer.setMasterVolume('0.5'), /INVALID_VOLUME/);
  });

  // AU12 — Mute
  test('AU12 — Mute: silencia Master Gain sem destruir volumes dos canais', () => {
    mixer.setMusicVolume(0.4);
    mixer.setSfxVolume(0.9);
    mixer.setMute(true);
    assert.strictEqual(mixer.isMuted(), true);
    assert.strictEqual(mixer.getChannelNode('MASTER').gain.value, 0);
    assert.strictEqual(mixer.getMusicVolume(), 0.4);
    assert.strictEqual(mixer.getSfxVolume(), 0.9);
  });

  // AU13 — Unmute Restores Volumes
  test('AU13 — Unmute Restores Volumes: desmutar restaura volume anterior do master', () => {
    mixer.setMasterVolume(0.7);
    mixer.setMute(true);
    assert.strictEqual(mixer.isMuted(), true);
    mixer.setMute(false);
    assert.strictEqual(mixer.isMuted(), false);
    assert.strictEqual(mixer.getMasterVolume(), 0.7);
    assert.strictEqual(mixer.getChannelNode('MASTER').gain.value, 0.7);
  });

  // AU14 — Audio Locked State
  test('AU14 — Audio Locked State: chamadas antes de unlock resolvem silenciosamente sem erro', async () => {
    const lockedMgr = new AudioContextManager({ autoUnlock: false });
    const lockedController = new BattleAudioController({ contextManager: lockedMgr });
    assert.strictEqual(lockedController.isUnlocked(), false);
    // Não deve lançar exceção nem unhandled rejection
    await assert.doesNotReject(async () => {
      await lockedController.playMoveAttack({ moveType: 'fire' });
      await lockedController.playMoveImpact();
      await lockedController.playMiss();
      await lockedController.playImmunity();
      await lockedController.startBattleMusic();
    });
  });

  // AU15 — Unlock
  test('AU15 — Unlock: desbloqueio explícito transita sistema para READY', async () => {
    const lockedMgr = new AudioContextManager({ autoUnlock: false });
    const lockedController = new BattleAudioController({ contextManager: lockedMgr });
    assert.strictEqual(lockedMgr.getState(), audioConstants.AUDIO_STATES.LOCKED);
    const resultState = await lockedController.unlock();
    assert.strictEqual(resultState, audioConstants.AUDIO_STATES.READY);
    assert.strictEqual(lockedController.isUnlocked(), true);
  });

  // AU16 — AudioContext Reused
  test('AU16 — AudioContext Reused: reutiliza a mesma instância ao longo de múltiplos golpes', async () => {
    const ctxBefore = controller.contextManager.getContext();
    await controller.playMoveAttack({ moveType: 'electric' });
    await controller.playMoveImpact();
    const ctxAfter = controller.contextManager.getContext();
    assert.strictEqual(ctxBefore, ctxAfter);
  });

  // AU17 — Normal Type SFX
  test('AU17 — Normal Type SFX: resolve e sintetiza som de ataque normal', async () => {
    const desc = BattleAudioResolver.resolve({ moveType: 'normal', power: 40 });
    assert.strictEqual(desc.typeFamily, 'normal');
    assert.strictEqual(desc.archetype, 'IMPACT');
    await assert.doesNotReject(async () => {
      await controller.playMoveAttack(desc);
    });
  });

  // AU18 — Fire Type SFX
  test('AU18 — Fire Type SFX: resolve e sintetiza som de ataque fire', async () => {
    const desc = BattleAudioResolver.resolve({ moveType: 'fire', power: 90 });
    assert.strictEqual(desc.typeFamily, 'fire');
    assert.strictEqual(desc.archetype, 'BURST');
    await assert.doesNotReject(async () => {
      await controller.playMoveAttack(desc);
    });
  });

  // AU19 — Water Type SFX
  test('AU19 — Water Type SFX: resolve e sintetiza som de ataque water', async () => {
    const desc = BattleAudioResolver.resolve({ moveType: 'water', power: 40 });
    assert.strictEqual(desc.typeFamily, 'water');
    assert.strictEqual(desc.archetype, 'SPLASH');
    await assert.doesNotReject(async () => {
      await controller.playMoveAttack(desc);
    });
  });

  // AU20 — Electric Type SFX
  test('AU20 — Electric Type SFX: resolve e sintetiza som de ataque electric', async () => {
    const desc = BattleAudioResolver.resolve({ moveType: 'electric', power: 90 });
    assert.strictEqual(desc.typeFamily, 'electric');
    assert.strictEqual(desc.archetype, 'ZAP');
    await assert.doesNotReject(async () => {
      await controller.playMoveAttack(desc);
    });
  });

  // AU21 — Remaining Type Coverage
  test('AU21 — Remaining Type Coverage: todos os 14 tipos restantes resolvem para descritores válidos', () => {
    const remainingTypes = [
      'grass', 'ice', 'fighting', 'poison', 'ground', 'flying',
      'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
    ];
    for (const t of remainingTypes) {
      const desc = BattleAudioResolver.resolve({ moveType: t, power: 70 });
      assert.strictEqual(desc.typeFamily, t);
      assert.ok(desc.archetype);
    }
  });

  // AU22 — TYPE_AUDIO_COUNT
  test('AU22 — TYPE_AUDIO_COUNT: exatamente 18 tipos mapeados', () => {
    assert.strictEqual(Object.keys(audioConstants.TYPE_AUDIO_FAMILIES).length, 18);
    assert.strictEqual(audioConstants.TYPE_AUDIO_COUNT, 18);
  });

  // AU23 — Attack Sound Integration
  test('AU23 — Attack Sound Integration: MOVE_ANNOUNCEMENT no adapter aciona playMoveAttack', async () => {
    let attackCalled = false;
    controller.playMoveAttack = async () => { attackCalled = true; };
    const adapter = new BattleAudioAdapter({ audioController: controller });
    await adapter.execute({
      type: 'MOVE_ANNOUNCEMENT',
      moveName: 'Thunderbolt',
      moveType: 'electric',
      power: 90
    });
    assert.strictEqual(attackCalled, true);
  });

  // AU24 — Impact Integration
  test('AU24 — Impact Integration: HP_TRANSITION com dano > 0 aciona playMoveImpact', async () => {
    let impactCalled = false;
    controller.playMoveImpact = async () => { impactCalled = true; };
    const adapter = new BattleAudioAdapter({ audioController: controller });
    await adapter.execute({
      type: 'HP_TRANSITION',
      damage: 42,
      multiplier: 1,
      attackType: 'electric'
    });
    assert.strictEqual(impactCalled, true);
  });

  // AU25 — Miss
  test('AU25 — Miss: MOVE_MISS_FEEDBACK executa miss sem som de impacto de dano', async () => {
    let missCalled = false;
    let impactCalled = false;
    controller.playMiss = async () => { missCalled = true; };
    controller.playMoveImpact = async () => { impactCalled = true; };
    const adapter = new BattleAudioAdapter({ audioController: controller });
    await adapter.execute({ type: 'MOVE_MISS_FEEDBACK' });
    assert.strictEqual(missCalled, true);
    assert.strictEqual(impactCalled, false, 'MISS_DAMAGE_SOUND = NO');
  });

  // AU26 — Immunity
  test('AU26 — Immunity: EFFECTIVENESS_FEEDBACK com multiplier=0 executa som de imunidade sem impacto de dano', async () => {
    let immuneCalled = false;
    let impactCalled = false;
    controller.playImmunity = async () => { immuneCalled = true; };
    controller.playMoveImpact = async () => { impactCalled = true; };
    const adapter = new BattleAudioAdapter({ audioController: controller });
    await adapter.execute({
      type: 'EFFECTIVENESS_FEEDBACK',
      multiplier: 0,
      classification: 'IMMUNE'
    });
    assert.strictEqual(immuneCalled, true);
    assert.strictEqual(impactCalled, false, 'IMMUNITY_DAMAGE_SOUND = NO');
  });

  // AU27 — Super Effective Metadata
  test('AU27 — Super Effective Metadata: multiplier >= 2 é repassado para impacto com nuance aumentada', async () => {
    let passedMultiplier = null;
    controller.playMoveImpact = async (opts) => { passedMultiplier = opts.multiplier; };
    const adapter = new BattleAudioAdapter({ audioController: controller });
    await adapter.execute({
      type: 'HP_TRANSITION',
      damage: 85,
      multiplier: 2,
      attackType: 'fire'
    });
    assert.strictEqual(passedMultiplier, 2);
  });

  // AU28 — Polyphony Limit
  test('AU28 — Polyphony Limit: MAX_SIMULTANEOUS_SFX (8) é respeitado sem estourar alocações', async () => {
    const promises = [];
    for (let i = 0; i < 15; i++) {
      promises.push(controller.playMoveAttack({ moveType: 'electric' }));
    }
    await Promise.all(promises);
    assert.ok(mixer.getActiveVoicesCount() <= 8, 'Active voices deve respeitar o teto');
  });

  // AU29 — SFX Cleanup
  test('AU29 — SFX Cleanup: nós temporários e vozes ativas retornam a zero após conclusão', async () => {
    await controller.playMoveAttack({ moveType: 'water' });
    await controller.playMoveImpact();
    // Após os sons concluírem
    assert.strictEqual(mixer.getActiveVoicesCount(), 0);
  });

  // AU30 — Cancel
  test('AU30 — Cancel: cancel() ativo limpa sons sem lançar erros e deixa sistema reutilizável', async () => {
    await controller.startBattleMusic();
    controller.cancel();
    assert.strictEqual(controller.getTelemetry().isMusicPlaying, false);
    await assert.doesNotReject(async () => {
      await controller.playMoveAttack({ moveType: 'fire' });
    });
  });

  // AU31 — Reset
  test('AU31 — Reset: reset() limpa estado e mantém configurações de volume', () => {
    mixer.setMasterVolume(0.6);
    controller.reset();
    assert.strictEqual(mixer.getMasterVolume(), 0.6);
    assert.strictEqual(mixer.getActiveVoicesCount(), 0);
  });

  // AU32 — Battle Music Start
  test('AU32 — Battle Music Start: inicia o loop procedural de música de batalha', async () => {
    await controller.startBattleMusic();
    assert.strictEqual(controller.getTelemetry().isMusicPlaying, true);
    await controller.stopBattleMusic();
  });

  // AU33 — Battle Music Single Instance
  test('AU33 — Battle Music Single Instance: chamadas repetidas não criam instâncias duplicadas', async () => {
    await controller.startBattleMusic();
    await controller.startBattleMusic();
    await controller.startBattleMusic();
    assert.strictEqual(controller.getTelemetry().isMusicPlaying, true);
    await controller.stopBattleMusic();
    assert.strictEqual(controller.getTelemetry().isMusicPlaying, false);
  });

  // AU34 — Battle Music Stop/Fade
  test('AU34 — Battle Music Stop/Fade: stopBattleMusic encerra o loop de música', async () => {
    await controller.startBattleMusic();
    assert.strictEqual(controller.getTelemetry().isMusicPlaying, true);
    await controller.stopBattleMusic();
    assert.strictEqual(controller.getTelemetry().isMusicPlaying, false);
  });

  // AU35 — Victory Cue
  test('AU35 — Victory Cue: BATTLE_RESULT com winner=player toca fanfarra de vitória', async () => {
    let victoryCalled = false;
    controller.playVictory = async () => { victoryCalled = true; };
    const adapter = new BattleAudioAdapter({ audioController: controller });
    await adapter.execute({
      type: 'BATTLE_RESULT',
      winner: 'player'
    });
    assert.strictEqual(victoryCalled, true);
  });

  // AU36 — Defeat Cue
  test('AU36 — Defeat Cue: BATTLE_RESULT com winner=enemy toca acorde de derrota', async () => {
    let defeatCalled = false;
    controller.playDefeat = async () => { defeatCalled = true; };
    const adapter = new BattleAudioAdapter({ audioController: controller });
    await adapter.execute({
      type: 'BATTLE_RESULT',
      winner: 'enemy'
    });
    assert.strictEqual(defeatCalled, true);
  });

  // AU37 — Cry Integration
  test('AU37 — Cry Integration: SWITCH_IN_SEQUENCE repassa cry para o audio controller', async () => {
    let cryReceived = null;
    controller.playPokemonCry = async (url) => { cryReceived = url; };
    const adapter = new BattleAudioAdapter({ audioController: controller });
    await adapter.execute({
      type: 'SWITCH_IN_SEQUENCE',
      side: 'player',
      newPokemonId: 25,
      cry: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/25.ogg'
    });
    assert.strictEqual(cryReceived, 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/25.ogg');
  });

  // AU38 — Cry Failure Safe
  test('AU38 — Cry Failure Safe: URL de cry inexistente ou com falha não bloqueia o combate', async () => {
    await assert.doesNotReject(async () => {
      await controller.playPokemonCry(null);
      await controller.playPokemonCry('invalid-url-path');
    });
  });

  // AU39 — Presentation Integration
  test('AU39 — Presentation Integration: CompositeBattleDomAdapter orquestra Animation + VFX + Audio', async () => {
    let animAttack = false;
    let vfxAttack = false;
    let audioAttack = false;

    const fakeAnim = {
      playAttack: async () => { animAttack = true; },
      playDamageReaction: async () => {},
      cancel: () => {},
      reset: () => {}
    };

    const fakeVfx = {
      playMoveVfx: async () => { vfxAttack = true; },
      cancel: () => {},
      reset: () => {}
    };

    const fakeAudio = {
      playMoveAttack: async () => { audioAttack = true; },
      playMoveImpact: async () => {},
      cancel: () => {},
      reset: () => {}
    };

    const composite = new CompositeBattleDomAdapter({
      pokemonController: fakeAnim,
      vfxController: fakeVfx,
      audioController: fakeAudio
    });

    await composite.execute({
      type: 'MOVE_ANNOUNCEMENT',
      actor: 'player',
      target: 'enemy',
      moveName: 'Thunderbolt',
      moveType: 'electric',
      power: 90
    });

    assert.strictEqual(animAttack, true, 'Animação de ataque corporal deve ser chamada');
    assert.strictEqual(vfxAttack, true, 'Efeito visual de golpe deve ser chamado');
    assert.strictEqual(audioAttack, true, 'Efeito sonoro de ataque deve ser chamado');
  });

  // AU40 — Full Real Battle Audio Trace
  test('AU40 — Full Real Battle Audio Trace: batch real da Engine com nocaute passa por todo o pipeline com áudio', async () => {
    const pikachu = JSON.parse(JSON.stringify(PikachuFixture));
    const bulbasaur = JSON.parse(JSON.stringify(BulbasaurFixture));
    bulbasaur.currentHp = 10; // Quase nocauteado

    const battleState = BattleEngine.createBattle(pikachu, bulbasaur);
    const turnResult = BattleEngine.resolveTurn(battleState, {
      playerAction: { type: 'MOVE', moveId: ThunderboltFixture.id, accuracyRoll: 50 },
      enemyAction: { type: 'MOVE', moveId: VineWhipFixture.id, accuracyRoll: 50 }
    });

    const animRegistry = new PokemonAnimationRegistry();
    animRegistry.register('player', { container: {}, sprite: {} });
    animRegistry.register('enemy', { container: {}, sprite: {} });
    const animController = new PokemonAnimationController({ registry: animRegistry });

    const composite = new CompositeBattleDomAdapter({
      pokemonController: animController,
      vfxController: null,
      audioController: controller
    });

    const presentationEngine = new BattlePresentationEngine({
      adapter: composite,
      scheduler: new ImmediateScheduler()
    });

    await presentationEngine.play(turnResult.events);
    assert.strictEqual(presentationEngine.getStatus(), 'COMPLETED');
    assert.ok(composite.executedCommands.length >= 3);

    const executedTypes = composite.executedCommands.map(c => c.type);
    assert.ok(executedTypes.includes('MOVE_ANNOUNCEMENT'));
    assert.ok(executedTypes.includes('HP_TRANSITION'));
  });
});
