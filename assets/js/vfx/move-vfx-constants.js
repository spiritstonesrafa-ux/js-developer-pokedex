/**
 * ====================================================================
 * CONSTANTES DE EFEITOS VISUAIS DE GOLPES: (move-vfx-constants.js)
 * ====================================================================
 * Centraliza os catálogos dos 18 tipos elementais, os arquétipos visuais,
 * thresholds de intensidade, durações, limites de partículas e mapeamentos
 * da Fase PBA-010.
 *
 * Princípios Fundamentais:
 * - POKEMON ANIMATION ≠ MOVE VISUAL EFFECT;
 * - Move VFX NÃO decide dano, tipos, IA ou regras de combate;
 * - 18 Type Families canônicas com arquétipos reutilizáveis;
 * - Suporta Node.js (CommonJS) e Navegadores (window.PBABattleVfx).
 */

(function () {
  let battleConstants;
  if (typeof module !== 'undefined' && module.exports) {
    battleConstants = require('../battle/battle-constants.js');
  } else if (typeof window !== 'undefined' && window.PBABattle) {
    battleConstants = window.PBABattle;
  } else {
    battleConstants = { POKEMON_TYPES: {} };
  }

  const { POKEMON_TYPES } = battleConstants;

  /**
   * Catálogo canônico dos 18 tipos elementais Pokémon.
   */
  const VFX_TYPE_FAMILIES = Object.freeze({
    NORMAL: 'normal',
    FIRE: 'fire',
    WATER: 'water',
    ELECTRIC: 'electric',
    GRASS: 'grass',
    ICE: 'ice',
    FIGHTING: 'fighting',
    POISON: 'poison',
    GROUND: 'ground',
    FLYING: 'flying',
    PSYCHIC: 'psychic',
    BUG: 'bug',
    ROCK: 'rock',
    GHOST: 'ghost',
    DRAGON: 'dragon',
    DARK: 'dark',
    STEEL: 'steel',
    FAIRY: 'fairy'
  });

  const VFX_TYPE_COUNT = Object.keys(VFX_TYPE_FAMILIES).length;

  /**
   * Arquétipos visuais reutilizáveis para animação dos golpes.
   */
  const VFX_ARCHETYPES = Object.freeze({
    PROJECTILE: 'PROJECTILE',
    BEAM: 'BEAM',
    STREAM: 'STREAM',
    BURST: 'BURST',
    SLASH: 'SLASH',
    IMPACT: 'IMPACT',
    WAVE: 'WAVE',
    AURA: 'AURA'
  });

  /**
   * Níveis de intensidade visual baseados no poder do golpe (sem alterar dano).
   */
  const VFX_INTENSITY = Object.freeze({
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH'
  });

  /**
   * Thresholds de Power para classificação de intensidade visual.
   */
  const POWER_THRESHOLDS = Object.freeze({
    LOW_MAX: 50,
    MEDIUM_MAX: 90
  });

  /**
   * Durações nominais centralizadas de cada arquétipo e efeito em milissegundos.
   */
  const VFX_DURATIONS = Object.freeze({
    PROJECTILE: 400,
    BEAM: 350,
    STREAM: 450,
    BURST: 350,
    SLASH: 300,
    IMPACT: 300,
    WAVE: 400,
    AURA: 400,
    HIT_IMPACT: 250,
    DISSIPATE_MISS: 200,
    DISSIPATE_IMMUNE: 200,
    REDUCED_MOTION: 0
  });

  /**
   * Multiplicadores direcionais baseados no atacante.
   */
  const VFX_DIRECTIONS = Object.freeze({
    PLAYER: 1,  // Movimento da esquerda para a direita (+X)
    ENEMY: -1   // Movimento da direita para a esquerda (-X)
  });

  /**
   * Limites de recursos para proteção de performance e GPU.
   */
  const VFX_LIMITS = Object.freeze({
    MAX_PARTICLES_PER_EFFECT: 12,
    REDUCED_MOTION_MAX_PARTICLES: 0
  });

  /**
   * Estratificação formal de camadas z-index.
   */
  const LAYER_Z_INDEX = Object.freeze({
    STAGE: 1,
    POKEMON: 10,
    PROJECTILE: 20,
    IMPACT: 30,
    OVERLAY: 40
  });

  /**
   * Arquétipo padrão para cada um dos 18 tipos elementais (fallback genérico).
   */
  const TYPE_DEFAULT_ARCHETYPES = Object.freeze({
    [VFX_TYPE_FAMILIES.NORMAL]: VFX_ARCHETYPES.IMPACT,
    [VFX_TYPE_FAMILIES.FIRE]: VFX_ARCHETYPES.STREAM,
    [VFX_TYPE_FAMILIES.WATER]: VFX_ARCHETYPES.PROJECTILE,
    [VFX_TYPE_FAMILIES.ELECTRIC]: VFX_ARCHETYPES.BEAM,
    [VFX_TYPE_FAMILIES.GRASS]: VFX_ARCHETYPES.SLASH,
    [VFX_TYPE_FAMILIES.ICE]: VFX_ARCHETYPES.BURST,
    [VFX_TYPE_FAMILIES.FIGHTING]: VFX_ARCHETYPES.IMPACT,
    [VFX_TYPE_FAMILIES.POISON]: VFX_ARCHETYPES.PROJECTILE,
    [VFX_TYPE_FAMILIES.GROUND]: VFX_ARCHETYPES.WAVE,
    [VFX_TYPE_FAMILIES.FLYING]: VFX_ARCHETYPES.SLASH,
    [VFX_TYPE_FAMILIES.PSYCHIC]: VFX_ARCHETYPES.AURA,
    [VFX_TYPE_FAMILIES.BUG]: VFX_ARCHETYPES.SLASH,
    [VFX_TYPE_FAMILIES.ROCK]: VFX_ARCHETYPES.PROJECTILE,
    [VFX_TYPE_FAMILIES.GHOST]: VFX_ARCHETYPES.AURA,
    [VFX_TYPE_FAMILIES.DRAGON]: VFX_ARCHETYPES.STREAM,
    [VFX_TYPE_FAMILIES.DARK]: VFX_ARCHETYPES.WAVE,
    [VFX_TYPE_FAMILIES.STEEL]: VFX_ARCHETYPES.IMPACT,
    [VFX_TYPE_FAMILIES.FAIRY]: VFX_ARCHETYPES.AURA
  });

  /**
   * Paletas de cores elementais para renderização dinâmica (primary, secondary, glow).
   */
  const TYPE_PALETTES = Object.freeze({
    [VFX_TYPE_FAMILIES.NORMAL]: { primary: '#a8a878', secondary: '#c6c6a7', glow: 'rgba(168, 168, 120, 0.6)' },
    [VFX_TYPE_FAMILIES.FIRE]: { primary: '#f08030', secondary: '#f8d030', glow: 'rgba(240, 128, 48, 0.7)' },
    [VFX_TYPE_FAMILIES.WATER]: { primary: '#6890f0', secondary: '#98d8d8', glow: 'rgba(104, 144, 240, 0.7)' },
    [VFX_TYPE_FAMILIES.ELECTRIC]: { primary: '#f8d030', secondary: '#f8f878', glow: 'rgba(248, 208, 48, 0.8)' },
    [VFX_TYPE_FAMILIES.GRASS]: { primary: '#78c850', secondary: '#a8f080', glow: 'rgba(120, 200, 80, 0.7)' },
    [VFX_TYPE_FAMILIES.ICE]: { primary: '#98d8d8', secondary: '#e0f8f8', glow: 'rgba(152, 216, 216, 0.7)' },
    [VFX_TYPE_FAMILIES.FIGHTING]: { primary: '#c03028', secondary: '#f08030', glow: 'rgba(192, 48, 40, 0.7)' },
    [VFX_TYPE_FAMILIES.POISON]: { primary: '#a040a0', secondary: '#d880d8', glow: 'rgba(160, 64, 160, 0.7)' },
    [VFX_TYPE_FAMILIES.GROUND]: { primary: '#e0c068', secondary: '#f8f0c0', glow: 'rgba(224, 192, 104, 0.7)' },
    [VFX_TYPE_FAMILIES.FLYING]: { primary: '#a890f0', secondary: '#c8b8f8', glow: 'rgba(168, 144, 240, 0.7)' },
    [VFX_TYPE_FAMILIES.PSYCHIC]: { primary: '#f85888', secondary: '#ffb8d0', glow: 'rgba(248, 88, 136, 0.8)' },
    [VFX_TYPE_FAMILIES.BUG]: { primary: '#a8b820', secondary: '#d8e030', glow: 'rgba(168, 184, 32, 0.7)' },
    [VFX_TYPE_FAMILIES.ROCK]: { primary: '#b8a038', secondary: '#e0d080', glow: 'rgba(184, 160, 56, 0.7)' },
    [VFX_TYPE_FAMILIES.GHOST]: { primary: '#705898', secondary: '#a890c0', glow: 'rgba(112, 88, 152, 0.8)' },
    [VFX_TYPE_FAMILIES.DRAGON]: { primary: '#7038f8', secondary: '#b890f8', glow: 'rgba(112, 56, 248, 0.8)' },
    [VFX_TYPE_FAMILIES.DARK]: { primary: '#705848', secondary: '#a89080', glow: 'rgba(112, 88, 72, 0.7)' },
    [VFX_TYPE_FAMILIES.STEEL]: { primary: '#b8b8d0', secondary: '#e8e8f8', glow: 'rgba(184, 184, 208, 0.7)' },
    [VFX_TYPE_FAMILIES.FAIRY]: { primary: '#ee99ac', secondary: '#f4bdc9', glow: 'rgba(238, 153, 172, 0.7)' }
  });

  /**
   * Tabela de overrides para golpes icônicos canônicos.
   */
  const MOVE_OVERRIDES = Object.freeze({
    'thunderbolt': { type: VFX_TYPE_FAMILIES.ELECTRIC, archetype: VFX_ARCHETYPES.BEAM },
    'flamethrower': { type: VFX_TYPE_FAMILIES.FIRE, archetype: VFX_ARCHETYPES.STREAM },
    'water-gun': { type: VFX_TYPE_FAMILIES.WATER, archetype: VFX_ARCHETYPES.PROJECTILE },
    'vine-whip': { type: VFX_TYPE_FAMILIES.GRASS, archetype: VFX_ARCHETYPES.SLASH },
    'rock-throw': { type: VFX_TYPE_FAMILIES.ROCK, archetype: VFX_ARCHETYPES.PROJECTILE },
    'psychic': { type: VFX_TYPE_FAMILIES.PSYCHIC, archetype: VFX_ARCHETYPES.AURA },
    'tackle': { type: VFX_TYPE_FAMILIES.NORMAL, archetype: VFX_ARCHETYPES.IMPACT },
    'scratch': { type: VFX_TYPE_FAMILIES.NORMAL, archetype: VFX_ARCHETYPES.SLASH },
    'ember': { type: VFX_TYPE_FAMILIES.FIRE, archetype: VFX_ARCHETYPES.PROJECTILE },
    'bubble': { type: VFX_TYPE_FAMILIES.WATER, archetype: VFX_ARCHETYPES.PROJECTILE },
    'ice-beam': { type: VFX_TYPE_FAMILIES.ICE, archetype: VFX_ARCHETYPES.BEAM },
    'dark-pulse': { type: VFX_TYPE_FAMILIES.DARK, archetype: VFX_ARCHETYPES.WAVE },
    'hyper-beam': { type: VFX_TYPE_FAMILIES.NORMAL, archetype: VFX_ARCHETYPES.BEAM },
    'earthquake': { type: VFX_TYPE_FAMILIES.GROUND, archetype: VFX_ARCHETYPES.WAVE },
    'air-slash': { type: VFX_TYPE_FAMILIES.FLYING, archetype: VFX_ARCHETYPES.SLASH }
  });

  const MoveVfxConstants = Object.freeze({
    VFX_TYPE_FAMILIES,
    VFX_TYPE_COUNT,
    VFX_ARCHETYPES,
    VFX_INTENSITY,
    POWER_THRESHOLDS,
    VFX_DURATIONS,
    VFX_DIRECTIONS,
    VFX_LIMITS,
    LAYER_Z_INDEX,
    TYPE_DEFAULT_ARCHETYPES,
    TYPE_PALETTES,
    MOVE_OVERRIDES
  });

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MoveVfxConstants;
  } else if (typeof window !== 'undefined') {
    window.PBABattleVfx = window.PBABattleVfx || {};
    Object.assign(window.PBABattleVfx, MoveVfxConstants);
  }
})();
