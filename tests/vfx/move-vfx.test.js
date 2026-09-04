/**
 * ====================================================================
 * SUÍTE DE TESTES: MOVE VISUAL EFFECTS (move-vfx.test.js)
 * ====================================================================
 * Validação rigorosa dos 40 gates obrigatórios (VFX01 a VFX40) da Fase PBA-010.
 *
 * Execução:
 * node --test tests/vfx/move-vfx.test.js
 */

const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

// Módulos do Sistema de Efeitos Visuais (PBA-010)
const MoveVfxConstants = require('../../assets/js/vfx/move-vfx-constants.js');
const MoveVfxResolver = require('../../assets/js/vfx/move-vfx-resolver.js');
const { MoveVfxRegistry } = require('../../assets/js/vfx/move-vfx-registry.js');
const { MoveVfxDomRenderer } = require('../../assets/js/vfx/move-vfx-dom-renderer.js');
const { MoveVfxController } = require('../../assets/js/vfx/move-vfx-controller.js');
const { CompositeBattleDomAdapter } = require('../../assets/js/presentation/composite-battle-dom-adapter.js');

// Módulos de Apresentação e Motor (PBA-003 a PBA-009)
const BattleConstants = require('../../assets/js/battle/battle-constants.js');
const BattlePresentationConstants = require('../../assets/js/presentation/battle-presentation-constants.js');
const PresentationMapper = require('../../assets/js/presentation/battle-presentation-mapper.js');
const { BattlePresentationEngine } = require('../../assets/js/presentation/battle-presentation-engine.js');
const { ImmediateScheduler } = require('../../assets/js/presentation/battle-presentation-scheduler.js');
const { PokemonAnimationController } = require('../../assets/js/presentation/animation/pokemon-animation-controller.js');
const { PokemonAnimationRegistry } = require('../../assets/js/presentation/animation/pokemon-animation-registry.js');
const BattleEngine = require('../../assets/js/battle/battle-engine.js');
const { PikachuFixture, BulbasaurFixture } = require('../fixtures/pokemon-fixtures.js');
const { ThunderboltFixture, VineWhipFixture } = require('../fixtures/move-fixtures.js');

const {
  VFX_TYPE_FAMILIES,
  VFX_TYPE_COUNT,
  VFX_ARCHETYPES,
  VFX_INTENSITY,
  VFX_DURATIONS,
  MOVE_OVERRIDES
} = MoveVfxConstants;

const { PRESENTATION_COMMANDS } = BattlePresentationConstants;
const { BATTLE_EVENTS } = BattleConstants;

describe('PHASE PBA-010 — MOVE VISUAL EFFECTS SUITE (VFX01–VFX40)', () => {
  let vfxRegistry;
  let vfxRenderer;
  let vfxController;
  let animRegistry;
  let animController;
  let compositeAdapter;

  beforeEach(() => {
    vfxRegistry = new MoveVfxRegistry();
    vfxRenderer = new MoveVfxDomRenderer({ registry: vfxRegistry });
    vfxController = new MoveVfxController({ registry: vfxRegistry, renderer: vfxRenderer });

    animRegistry = new PokemonAnimationRegistry();
    animRegistry.register('player', { container: {}, sprite: {} });
    animRegistry.register('enemy', { container: {}, sprite: {} });
    animController = new PokemonAnimationController({ registry: animRegistry });

    compositeAdapter = new CompositeBattleDomAdapter({
      pokemonController: animController,
      vfxController
    });
  });

  // ------------------------------------------------------------------
  // GATES VFX01–VFX06: Catálogo, Arquitetura e Existência de Módulos
  // ------------------------------------------------------------------

  test('VFX01 — Type Catalog: 18 tipos elementais são reconhecidos no catálogo', () => {
    assert.equal(VFX_TYPE_COUNT, 18);
    const expectedTypes = [
      'normal', 'fire', 'water', 'electric', 'grass', 'ice',
      'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
      'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
    ];
    for (const t of expectedTypes) {
      assert.ok(Object.values(VFX_TYPE_FAMILIES).includes(t), `Tipo ausente: ${t}`);
    }
  });

  test('VFX02 — Archetype Catalog: todos os 8 arquétipos reutilizáveis estão definidos', () => {
    const archetypes = Object.values(VFX_ARCHETYPES);
    assert.equal(archetypes.length, 8);
    assert.ok(archetypes.includes('PROJECTILE'));
    assert.ok(archetypes.includes('BEAM'));
    assert.ok(archetypes.includes('STREAM'));
    assert.ok(archetypes.includes('BURST'));
    assert.ok(archetypes.includes('SLASH'));
    assert.ok(archetypes.includes('IMPACT'));
    assert.ok(archetypes.includes('WAVE'));
    assert.ok(archetypes.includes('AURA'));
  });

  test('VFX03 — Resolver Exists: MoveVfxResolver exporta resolve() e resolveIntensity()', () => {
    assert.equal(typeof MoveVfxResolver.resolve, 'function');
    assert.equal(typeof MoveVfxResolver.resolveIntensity, 'function');
  });

  test('VFX04 — Controller Exists: MoveVfxController pode ser instanciado e possui métodos públicos', () => {
    assert.ok(vfxController instanceof MoveVfxController);
    assert.equal(typeof vfxController.playMoveVfx, 'function');
    assert.equal(typeof vfxController.cancel, 'function');
    assert.equal(typeof vfxController.reset, 'function');
  });

  test('VFX05 — Registry Exists: MoveVfxRegistry gerencia alvos e coordenadas virtuais', () => {
    assert.ok(vfxRegistry instanceof MoveVfxRegistry);
    assert.equal(typeof vfxRegistry.registerStage, 'function');
    assert.equal(typeof vfxRegistry.registerTarget, 'function');
    assert.equal(typeof vfxRegistry.getCoordinates, 'function');
  });

  test('VFX06 — DOM Renderer Exists: MoveVfxDomRenderer exporta métodos de ciclo e renderização', () => {
    assert.ok(vfxRenderer instanceof MoveVfxDomRenderer);
    assert.equal(typeof vfxRenderer.renderMoveEffect, 'function');
    assert.equal(typeof vfxRenderer.renderImpact, 'function');
    assert.equal(typeof vfxRenderer.cleanup, 'function');
  });

  // ------------------------------------------------------------------
  // GATES VFX07–VFX24: Resolução Individual das 18 Famílias de Tipo
  // ------------------------------------------------------------------

  test('VFX07 — Fire Resolution: golpe do tipo fire resolve para efeito de fogo válido', () => {
    const desc = MoveVfxResolver.resolve({ moveName: 'flamethrower', moveType: 'fire', power: 90 });
    assert.equal(desc.moveType, 'fire');
    assert.equal(desc.archetype, VFX_ARCHETYPES.STREAM);
    assert.ok(desc.colors.primary);
  });

  test('VFX08 — Water Resolution: golpe do tipo water resolve para efeito de água válido', () => {
    const desc = MoveVfxResolver.resolve({ moveName: 'water-gun', moveType: 'water', power: 40 });
    assert.equal(desc.moveType, 'water');
    assert.equal(desc.archetype, VFX_ARCHETYPES.PROJECTILE);
    assert.ok(desc.colors.primary);
  });

  test('VFX09 — Electric Resolution: golpe do tipo electric resolve para efeito elétrico válido', () => {
    const desc = MoveVfxResolver.resolve({ moveName: 'thunderbolt', moveType: 'electric', power: 90 });
    assert.equal(desc.moveType, 'electric');
    assert.equal(desc.archetype, VFX_ARCHETYPES.BEAM);
    assert.ok(desc.colors.primary);
  });

  test('VFX10 — Grass Resolution: golpe do tipo grass resolve para efeito vegetal válido', () => {
    const desc = MoveVfxResolver.resolve({ moveName: 'vine-whip', moveType: 'grass', power: 45 });
    assert.equal(desc.moveType, 'grass');
    assert.equal(desc.archetype, VFX_ARCHETYPES.SLASH);
  });

  test('VFX11 — Ice Resolution: golpe do tipo ice resolve para efeito de gelo válido', () => {
    const desc = MoveVfxResolver.resolve({ moveName: 'ice-beam', moveType: 'ice', power: 90 });
    assert.equal(desc.moveType, 'ice');
    assert.equal(desc.archetype, VFX_ARCHETYPES.BEAM);
  });

  test('VFX12 — Fighting Resolution: golpe do tipo fighting resolve para impacto cinético válido', () => {
    const desc = MoveVfxResolver.resolve({ moveName: 'close-combat', moveType: 'fighting', power: 120 });
    assert.equal(desc.moveType, 'fighting');
    assert.equal(desc.archetype, VFX_ARCHETYPES.IMPACT);
  });

  test('VFX13 — Poison Resolution: golpe do tipo poison resolve para projétil tóxico válido', () => {
    const desc = MoveVfxResolver.resolve({ moveName: 'sludge-bomb', moveType: 'poison', power: 90 });
    assert.equal(desc.moveType, 'poison');
    assert.equal(desc.archetype, VFX_ARCHETYPES.PROJECTILE);
  });

  test('VFX14 — Ground Resolution: golpe do tipo ground resolve para onda sísmica válida', () => {
    const desc = MoveVfxResolver.resolve({ moveName: 'earthquake', moveType: 'ground', power: 100 });
    assert.equal(desc.moveType, 'ground');
    assert.equal(desc.archetype, VFX_ARCHETYPES.WAVE);
  });

  test('VFX15 — Flying Resolution: golpe do tipo flying resolve para corte aéreo válido', () => {
    const desc = MoveVfxResolver.resolve({ moveName: 'air-slash', moveType: 'flying', power: 75 });
    assert.equal(desc.moveType, 'flying');
    assert.equal(desc.archetype, VFX_ARCHETYPES.SLASH);
  });

  test('VFX16 — Psychic Resolution: golpe do tipo psychic resolve para aura psíquica válida', () => {
    const desc = MoveVfxResolver.resolve({ moveName: 'psychic', moveType: 'psychic', power: 90 });
    assert.equal(desc.moveType, 'psychic');
    assert.equal(desc.archetype, VFX_ARCHETYPES.AURA);
  });

  test('VFX17 — Bug Resolution: golpe do tipo bug resolve para corte de energia válido', () => {
    const desc = MoveVfxResolver.resolve({ moveName: 'x-scissor', moveType: 'bug', power: 80 });
    assert.equal(desc.moveType, 'bug');
    assert.equal(desc.archetype, VFX_ARCHETYPES.SLASH);
  });

  test('VFX18 — Rock Resolution: golpe do tipo rock resolve para projétil de rocha válido', () => {
    const desc = MoveVfxResolver.resolve({ moveName: 'rock-throw', moveType: 'rock', power: 50 });
    assert.equal(desc.moveType, 'rock');
    assert.equal(desc.archetype, VFX_ARCHETYPES.PROJECTILE);
  });

  test('VFX19 — Ghost Resolution: golpe do tipo ghost resolve para aura espectral válida', () => {
    const desc = MoveVfxResolver.resolve({ moveName: 'shadow-ball', moveType: 'ghost', power: 80 });
    assert.equal(desc.moveType, 'ghost');
    assert.equal(desc.archetype, VFX_ARCHETYPES.AURA);
  });

  test('VFX20 — Dragon Resolution: golpe do tipo dragon resolve para torrente dracônica válida', () => {
    const desc = MoveVfxResolver.resolve({ moveName: 'dragon-pulse', moveType: 'dragon', power: 85 });
    assert.equal(desc.moveType, 'dragon');
    assert.equal(desc.archetype, VFX_ARCHETYPES.STREAM);
  });

  test('VFX21 — Dark Resolution: golpe do tipo dark resolve para pulso de trevas válido', () => {
    const desc = MoveVfxResolver.resolve({ moveName: 'dark-pulse', moveType: 'dark', power: 80 });
    assert.equal(desc.moveType, 'dark');
    assert.equal(desc.archetype, VFX_ARCHETYPES.WAVE);
  });

  test('VFX22 — Steel Resolution: golpe do tipo steel resolve para impacto metálico válido', () => {
    const desc = MoveVfxResolver.resolve({ moveName: 'iron-head', moveType: 'steel', power: 80 });
    assert.equal(desc.moveType, 'steel');
    assert.equal(desc.archetype, VFX_ARCHETYPES.IMPACT);
  });

  test('VFX23 — Fairy Resolution: golpe do tipo fairy resolve para aura mágica válida', () => {
    const desc = MoveVfxResolver.resolve({ moveName: 'moonblast', moveType: 'fairy', power: 95 });
    assert.equal(desc.moveType, 'fairy');
    assert.equal(desc.archetype, VFX_ARCHETYPES.AURA);
  });

  test('VFX24 — Normal Resolution: golpe do tipo normal resolve para impacto cinético válido', () => {
    const desc = MoveVfxResolver.resolve({ moveName: 'tackle', moveType: 'normal', power: 40 });
    assert.equal(desc.moveType, 'normal');
    assert.equal(desc.archetype, VFX_ARCHETYPES.IMPACT);
  });

  // ------------------------------------------------------------------
  // GATES VFX25–VFX29: Fallback Genérico, Rejeições e Intensidade
  // ------------------------------------------------------------------

  test('VFX25 — Generic Fallback: golpe desconhecido de tipo válido recebe efeito padrão daquele tipo', () => {
    const desc = MoveVfxResolver.resolve({ moveName: 'unregistered-fire-spell', moveType: 'fire', power: 70 });
    assert.equal(desc.moveType, 'fire');
    assert.equal(desc.archetype, VFX_ARCHETYPES.STREAM);
    assert.equal(desc.intensity, VFX_INTENSITY.MEDIUM);
  });

  test('VFX26 — Invalid Type: rejeita tipos inexistentes ou vazios com erro controlado', () => {
    assert.throws(() => {
      MoveVfxResolver.resolve({ moveName: 'cosmic-blast', moveType: 'cosmic', power: 100 });
    }, /INVALID_MOVE_TYPE/);

    assert.throws(() => {
      MoveVfxResolver.resolve({ moveName: 'empty-move', moveType: '', power: 50 });
    }, /INVALID_MOVE_TYPE/);
  });

  test('VFX27 — Intensity Low: power <= 50 resulta em intensidade LOW', () => {
    const desc = MoveVfxResolver.resolve({ moveName: 'ember', moveType: 'fire', power: 40 });
    assert.equal(desc.intensity, VFX_INTENSITY.LOW);
  });

  test('VFX28 — Intensity Medium: 51 <= power <= 90 resulta em intensidade MEDIUM', () => {
    const desc = MoveVfxResolver.resolve({ moveName: 'flamethrower', moveType: 'fire', power: 90 });
    assert.equal(desc.intensity, VFX_INTENSITY.MEDIUM);
  });

  test('VFX29 — Intensity High: power > 90 resulta em intensidade HIGH', () => {
    const desc = MoveVfxResolver.resolve({ moveName: 'fire-blast', moveType: 'fire', power: 110 });
    assert.equal(desc.intensity, VFX_INTENSITY.HIGH);
  });

  // ------------------------------------------------------------------
  // GATES VFX30–VFX35: Direções, Miss, Imunidade, Efetividade e Reduced Motion
  // ------------------------------------------------------------------

  test('VFX30 — Player Orientation: golpe disparado pelo player viaja em direção ao enemy (+X)', async () => {
    const desc = MoveVfxResolver.resolve({ moveName: 'thunderbolt', moveType: 'electric', power: 90 });
    await vfxController.playMoveVfx(desc, { attackerSide: 'player', defenderSide: 'enemy' });
    const coords = vfxRegistry.getCoordinates('player', 'enemy');
    assert.ok(coords.deltaX > 0, 'Deslocamento deltaX deve ser positivo (para a direita)');
  });

  test('VFX31 — Enemy Orientation: golpe disparado pelo enemy viaja em direção ao player (-X)', async () => {
    const desc = MoveVfxResolver.resolve({ moveName: 'water-gun', moveType: 'water', power: 40 });
    await vfxController.playMoveVfx(desc, { attackerSide: 'enemy', defenderSide: 'player' });
    const coords = vfxRegistry.getCoordinates('enemy', 'player');
    assert.ok(coords.deltaX < 0, 'Deslocamento deltaX deve ser negativo (para a esquerda)');
  });

  test('VFX32 — Miss: quando isMiss=true, nenhum impacto de dano é renderizado', async () => {
    let impactCalled = false;
    vfxRenderer.renderImpact = () => { impactCalled = true; };

    const desc = MoveVfxResolver.resolve({ moveName: 'rock-throw', moveType: 'rock', power: 50 });
    await vfxController.playMoveVfx(desc, { attackerSide: 'player', defenderSide: 'enemy', isMiss: true });

    assert.equal(impactCalled, false, 'Impacto de dano NÃO deve ser chamado em caso de Miss');
  });

  test('VFX33 — Immunity: quando multiplier=0 / isImmune=true, nenhum impacto de dano é renderizado', async () => {
    let impactCalled = false;
    vfxRenderer.renderImpact = () => { impactCalled = true; };

    const desc = MoveVfxResolver.resolve({ moveName: 'thunderbolt', moveType: 'electric', power: 90 });
    await vfxController.playMoveVfx(desc, { attackerSide: 'player', defenderSide: 'enemy', isImmune: true, multiplier: 0 });

    assert.equal(impactCalled, false, 'Impacto de dano NÃO deve ser chamado em caso de Imunidade');
  });

  test('VFX34 — Super Effective: multiplicador >= 2 repassa intensidade aumentada para a renderização', async () => {
    let recordedMultiplier = 0;
    vfxRenderer.renderImpact = (desc, coords, opts) => { recordedMultiplier = opts.multiplier; };

    const desc = MoveVfxResolver.resolve({ moveName: 'vine-whip', moveType: 'grass', power: 45 });
    await vfxController.playMoveVfx(desc, { attackerSide: 'player', defenderSide: 'enemy', multiplier: 2 });

    assert.equal(recordedMultiplier, 2, 'Multiplicador 2x deve ser preservado e repassado para o impacto');
  });

  test('VFX35 — Reduced Motion: reducedMotion=true conclui imediatamente e com segurança', async () => {
    vfxController.setReducedMotion(true);
    const start = Date.now();
    const desc = MoveVfxResolver.resolve({ moveName: 'flamethrower', moveType: 'fire', power: 90 });
    await vfxController.playMoveVfx(desc, { attackerSide: 'player', defenderSide: 'enemy', reducedMotion: true });
    const elapsed = Date.now() - start;

    assert.ok(elapsed < 50, `Execução com reduced motion deve ser praticamente instantânea (demorou ${elapsed}ms)`);
  });

  // ------------------------------------------------------------------
  // GATES VFX36–VFX38: Cancelamento, Reset e Limpeza de Recursos
  // ------------------------------------------------------------------

  test('VFX36 — Cancel: cancel() ativo limpa efeitos em voo sem quebrar a timeline', async () => {
    const desc = MoveVfxResolver.resolve({ moveName: 'psychic', moveType: 'psychic', power: 90 });
    const playPromise = vfxController.playMoveVfx(desc, { attackerSide: 'player', defenderSide: 'enemy' });

    vfxController.cancel();
    await playPromise; // Não deve rejeitar nem travar

    assert.equal(vfxController.activeVfx, null);
  });

  test('VFX37 — Reset: reset() recoloca o controlador em estado limpo e reutilizável', async () => {
    vfxController.reset();
    assert.equal(vfxController.activeVfx, null);

    // Deve ser capaz de tocar outro efeito normalmente após reset
    const desc = MoveVfxResolver.resolve({ moveName: 'ember', moveType: 'fire', power: 40 });
    await vfxController.playMoveVfx(desc, { attackerSide: 'player', defenderSide: 'enemy', reducedMotion: true });
  });

  test('VFX38 — Cleanup: nenhum elemento temporário ou timer permanece após execução', async () => {
    const desc = MoveVfxResolver.resolve({ moveName: 'water-gun', moveType: 'water', power: 40 });
    await vfxController.playMoveVfx(desc, { attackerSide: 'player', defenderSide: 'enemy', reducedMotion: true });

    assert.equal(vfxRenderer.activeElements.size, 0, 'Nenhum nó ativo deve permanecer após o término');
    assert.equal(vfxRenderer.activeTimers.size, 0, 'Nenhum timer ativo deve permanecer após o término');
  });

  // ------------------------------------------------------------------
  // GATES VFX39–VFX40: Integração com Presentation Engine e Traço Real
  // ------------------------------------------------------------------

  test('VFX39 — Presentation Integration: MOVE_ANNOUNCEMENT dispara ataque corporal + Move VFX', async () => {
    let attackPlayed = false;
    let vfxPlayed = false;

    animController.playAttack = async () => { attackPlayed = true; };
    vfxController.playMoveVfx = async () => { vfxPlayed = true; };

    const command = {
      type: PRESENTATION_COMMANDS.MOVE_ANNOUNCEMENT,
      actor: 'player',
      moveName: 'thunderbolt',
      moveType: 'electric',
      power: 90
    };

    await compositeAdapter.execute(command);

    assert.equal(attackPlayed, true, 'Ataque corporal do Pokémon deve ser executado');
    assert.equal(vfxPlayed, true, 'Efeito visual do golpe deve ser executado');
  });

  test('VFX40 — Full Real Battle Trace: batch real da Engine com nocaute e trocas passa por todo o pipeline', async () => {
    const scheduler = new ImmediateScheduler();
    const presentationEngine = new BattlePresentationEngine({
      adapter: compositeAdapter,
      scheduler
    });

    // Cria batalha real com fixtures do projeto
    const pikachu = JSON.parse(JSON.stringify(PikachuFixture));
    const bulbasaur = JSON.parse(JSON.stringify(BulbasaurFixture));
    bulbasaur.currentHp = 10; // Quase nocauteado

    const battleState = BattleEngine.createBattle(pikachu, bulbasaur);
    const turnResult = BattleEngine.resolveTurn(battleState, {
      playerAction: { type: 'MOVE', moveId: ThunderboltFixture.id, accuracyRoll: 50 },
      enemyAction: { type: 'MOVE', moveId: VineWhipFixture.id, accuracyRoll: 50 }
    });

    const presentationCommands = PresentationMapper.mapEvents(turnResult.events);

    // Executa no PresentationEngine com CompositeAdapter
    await presentationEngine.play(turnResult.events);

    assert.equal(presentationEngine.getStatus(), 'COMPLETED');
    assert.ok(compositeAdapter.executedCommands.length > 0);

    // Verifica que MOVE_ANNOUNCEMENT e HP_TRANSITION foram executados na ordem causal correta
    const executedTypes = compositeAdapter.executedCommands.map(c => c.type);
    assert.ok(executedTypes.includes(PRESENTATION_COMMANDS.MOVE_ANNOUNCEMENT));
    assert.ok(executedTypes.includes(PRESENTATION_COMMANDS.HP_TRANSITION));
    assert.ok(executedTypes.includes(PRESENTATION_COMMANDS.FAINT_SEQUENCE));

    const moveIndex = executedTypes.indexOf(PRESENTATION_COMMANDS.MOVE_ANNOUNCEMENT);
    const hpIndex = executedTypes.indexOf(PRESENTATION_COMMANDS.HP_TRANSITION);
    const faintIndex = executedTypes.indexOf(PRESENTATION_COMMANDS.FAINT_SEQUENCE);

    assert.ok(moveIndex < hpIndex, 'MOVE_ANNOUNCEMENT deve preceder HP_TRANSITION');
    assert.ok(hpIndex < faintIndex, 'HP_TRANSITION deve preceder FAINT_SEQUENCE');
  });
});
