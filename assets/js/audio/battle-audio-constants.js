/**
 * ====================================================================
 * CONSTANTES DO SISTEMA DE ÁUDIO DE BATALHA: (battle-audio-constants.js)
 * ====================================================================
 * Define canais de mixagem, volumes padrão, catálogo de 18 Type Audio Families,
 * arquétipos sonoros, limites de polifonia e estados do controlador (Fase PBA-011).
 *
 * Princípios Fundamentais:
 * - AUDIO SYSTEM ≠ GAME RULES;
 * - MOVE VFX ≠ AUDIO SYSTEM;
 * - Zero dependência de regras de combate (sem cálculo de dano ou tipos);
 * - Totalmente procedural (sem arquivos de áudio comerciais/proprietários);
 * - Suporta Node.js (CommonJS) e Browser (window.PBABattleAudio).
 */

(function () {
  /**
   * Canais de áudio independentes roteados para o Master Gain.
   */
  const AUDIO_CHANNELS = Object.freeze({
    MASTER: 'MASTER',
    MUSIC: 'MUSIC',
    SFX: 'SFX',
    CRY: 'CRY',
    UI: 'UI'
  });

  /**
   * Volumes padrão iniciais (range normalizado de 0.0 a 1.0).
   */
  const DEFAULT_VOLUMES = Object.freeze({
    [AUDIO_CHANNELS.MASTER]: 0.8,
    [AUDIO_CHANNELS.MUSIC]: 0.5,
    [AUDIO_CHANNELS.SFX]: 0.8,
    [AUDIO_CHANNELS.CRY]: 0.7,
    [AUDIO_CHANNELS.UI]: 0.6
  });

  /**
   * Estados operacionais do ciclo de vida do subsistema de áudio.
   */
  const AUDIO_STATES = Object.freeze({
    LOCKED: 'LOCKED',       // Bloqueado aguardando interação do usuário (Autoplay Policy)
    READY: 'READY',         // Desbloqueado e pronto para reprodução
    SUSPENDED: 'SUSPENDED', // AudioContext suspenso (ex: aba em background)
    ERROR: 'ERROR'          // Falha na inicialização da Web Audio API
  });

  /**
   * Categorias de eventos sonoros de batalha.
   */
  const AUDIO_CATEGORIES = Object.freeze({
    MOVE_ATTACK: 'MOVE_ATTACK',
    MOVE_IMPACT: 'MOVE_IMPACT',
    MOVE_MISS: 'MOVE_MISS',
    MOVE_IMMUNE: 'MOVE_IMMUNE',
    POKEMON_CRY: 'POKEMON_CRY',
    BATTLE_MUSIC: 'BATTLE_MUSIC',
    VICTORY: 'VICTORY',
    DEFEAT: 'DEFEAT',
    UI_CONFIRM: 'UI_CONFIRM',
    UI_CANCEL: 'UI_CANCEL'
  });

  /**
   * Catálogo de 18 Type Audio Families.
   */
  const TYPE_AUDIO_FAMILIES = Object.freeze({
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

  /**
   * Quantidade total de tipos no catálogo.
   */
  const TYPE_AUDIO_COUNT = 18;

  /**
   * Arquétipos sonoros procedurais reutilizáveis.
   */
  const AUDIO_ARCHETYPES = Object.freeze({
    IMPACT: 'IMPACT',     // Impacto contundente seco / transiente rápido
    WHOOSH: 'WHOOSH',     // Vento / passagem pelo ar / corte
    ZAP: 'ZAP',           // Descarga elétrica / chiado modulado
    BURST: 'BURST',       // Erupção de ruído filtrado / fogo / explosão
    HISS: 'HISS',         // Ruído contínuo com atenuação / vapor
    SPLASH: 'SPLASH',     // Ressonância fluida / modulação suave
    RUMBLE: 'RUMBLE',     // Graves profundos / tremor / terra
    SHIMMER: 'SHIMMER',   // Brilho harmônico agudo / fada / cristal
    PULSE: 'PULSE'        // Onda periódica ressonante / psíquico / espectral
  });

  /**
   * Mapeamento padrão de Type Family -> Archetype procedural sonoro.
   */
  const TYPE_AUDIO_DEFAULTS = Object.freeze({
    [TYPE_AUDIO_FAMILIES.NORMAL]: AUDIO_ARCHETYPES.IMPACT,
    [TYPE_AUDIO_FAMILIES.FIRE]: AUDIO_ARCHETYPES.BURST,
    [TYPE_AUDIO_FAMILIES.WATER]: AUDIO_ARCHETYPES.SPLASH,
    [TYPE_AUDIO_FAMILIES.ELECTRIC]: AUDIO_ARCHETYPES.ZAP,
    [TYPE_AUDIO_FAMILIES.GRASS]: AUDIO_ARCHETYPES.WHOOSH,
    [TYPE_AUDIO_FAMILIES.ICE]: AUDIO_ARCHETYPES.SHIMMER,
    [TYPE_AUDIO_FAMILIES.FIGHTING]: AUDIO_ARCHETYPES.IMPACT,
    [TYPE_AUDIO_FAMILIES.POISON]: AUDIO_ARCHETYPES.HISS,
    [TYPE_AUDIO_FAMILIES.GROUND]: AUDIO_ARCHETYPES.RUMBLE,
    [TYPE_AUDIO_FAMILIES.FLYING]: AUDIO_ARCHETYPES.WHOOSH,
    [TYPE_AUDIO_FAMILIES.PSYCHIC]: AUDIO_ARCHETYPES.PULSE,
    [TYPE_AUDIO_FAMILIES.BUG]: AUDIO_ARCHETYPES.ZAP,
    [TYPE_AUDIO_FAMILIES.ROCK]: AUDIO_ARCHETYPES.IMPACT,
    [TYPE_AUDIO_FAMILIES.GHOST]: AUDIO_ARCHETYPES.PULSE,
    [TYPE_AUDIO_FAMILIES.DRAGON]: AUDIO_ARCHETYPES.BURST,
    [TYPE_AUDIO_FAMILIES.DARK]: AUDIO_ARCHETYPES.PULSE,
    [TYPE_AUDIO_FAMILIES.STEEL]: AUDIO_ARCHETYPES.IMPACT,
    [TYPE_AUDIO_FAMILIES.FAIRY]: AUDIO_ARCHETYPES.SHIMMER
  });

  /**
   * Limite de vozes simultâneas no canal de SFX para evitar saturação e clipping.
   */
  const MAX_SIMULTANEOUS_SFX = 8;

  /**
   * Thresholds de intensidade sonora (alinhados com a escala do move power).
   * Nota: Afeta somente o envelope sonoro/filtro, nunca o cálculo de dano.
   */
  const AUDIO_INTENSITY = Object.freeze({
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH'
  });

  const AUDIO_INTENSITY_THRESHOLDS = Object.freeze({
    LOW_MAX: 50,
    MEDIUM_MAX: 90
  });

  const constantsModule = Object.freeze({
    AUDIO_CHANNELS,
    DEFAULT_VOLUMES,
    AUDIO_STATES,
    AUDIO_CATEGORIES,
    TYPE_AUDIO_FAMILIES,
    TYPE_AUDIO_COUNT,
    AUDIO_ARCHETYPES,
    TYPE_AUDIO_DEFAULTS,
    MAX_SIMULTANEOUS_SFX,
    AUDIO_INTENSITY,
    AUDIO_INTENSITY_THRESHOLDS
  });

  // Suporte universal (Node.js & Browser)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = constantsModule;
  } else if (typeof window !== 'undefined') {
    window.PBABattleAudio = window.PBABattleAudio || {};
    Object.assign(window.PBABattleAudio, constantsModule);
  }
})();
