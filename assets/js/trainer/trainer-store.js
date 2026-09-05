/**
 * ====================================================================
 * ARMAZENAMENTO E PERSISTÊNCIA: TRAINER STORE (trainer-store.js)
 * ====================================================================
 * Gerencia a persistência dos dados do Perfil do Treinador no LocalStorage
 * sob a chave 'trainer.profile', com schema versionado, ID estável único,
 * catálogo de avatares CSS, inicialização limpa (zero-state) e migração segura.
 */

(function(root) {
  'use strict';

  const STORAGE_KEY = 'trainer.profile';
  const CURRENT_VERSION = 1;

  const MIN_DISPLAY_NAME_LENGTH = 2;
  const MAX_DISPLAY_NAME_LENGTH = 24;

  /**
   * Catálogo oficial de Presets de Avatar em CSS próprio (sem artes de terceiros).
   */
  const AVATAR_PRESETS = {
    default: {
      id: 'default',
      label: 'Astronauta Clássico',
      icon: 'fa-solid fa-user-astronaut',
      gradient: 'linear-gradient(135deg, #ee1515, #ff6b6b)',
      borderColor: '#ffffff',
      glowColor: 'rgba(238, 21, 21, 0.4)'
    },
    ember: {
      id: 'ember',
      label: 'Chama Escarlate',
      icon: 'fa-solid fa-fire',
      gradient: 'linear-gradient(135deg, #f12711, #f5af19)',
      borderColor: '#ffdd59',
      glowColor: 'rgba(245, 175, 25, 0.4)'
    },
    ocean: {
      id: 'ocean',
      label: 'Maré Profunda',
      icon: 'fa-solid fa-water',
      gradient: 'linear-gradient(135deg, #0052d4, #4364f7, #6fb1fc)',
      borderColor: '#a0c4ff',
      glowColor: 'rgba(67, 100, 247, 0.4)'
    },
    forest: {
      id: 'forest',
      label: 'Guardião Verde',
      icon: 'fa-solid fa-leaf',
      gradient: 'linear-gradient(135deg, #11998e, #38ef7d)',
      borderColor: '#70e000',
      glowColor: 'rgba(56, 239, 125, 0.4)'
    },
    electric: {
      id: 'electric',
      label: 'Relâmpago Dourado',
      icon: 'fa-solid fa-bolt',
      gradient: 'linear-gradient(135deg, #f7971e, #ffd200)',
      borderColor: '#ffffff',
      glowColor: 'rgba(255, 210, 0, 0.4)'
    },
    psychic: {
      id: 'psychic',
      label: 'Aura Mística',
      icon: 'fa-solid fa-eye',
      gradient: 'linear-gradient(135deg, #b92b27, #1565c0)',
      borderColor: '#f72585',
      glowColor: 'rgba(247, 37, 133, 0.4)'
    },
    shadow: {
      id: 'shadow',
      label: 'Espectro Noturno',
      icon: 'fa-solid fa-ghost',
      gradient: 'linear-gradient(135deg, #4b1248, #f0c27b)',
      borderColor: '#c77dff',
      glowColor: 'rgba(200, 125, 255, 0.4)'
    }
  };

  /**
   * Gera um ID de treinador local, estável e seguro.
   * @returns {string} UUID ou identificador único aleatório.
   */
  function generateTrainerId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    // Fallback pseudo-UUID seguro para ambientes sem crypto.randomUUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Cria o estado padrão canônico de um perfil novo (zero-state).
   * @returns {Object} Perfil novo limpo.
   */
  function createDefaultProfile() {
    return {
      version: CURRENT_VERSION,
      trainerId: generateTrainerId(),
      displayName: 'Treinador',
      avatarPreset: 'default',
      companionPokemonId: null,
      stats: {
        battlesPlayed: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        currentWinStreak: 0,
        bestWinStreak: 0,
        lastBattleAt: null,
        leaderUsage: {}
      },
      recentBattles: []
    };
  }

  /**
   * Detecta se os dados contidos no LocalStorage são a semente fictícia antiga (PBA-014 inicial).
   * @param {Object} data
   * @returns {boolean}
   */
  function isLegacyDemoSeed(data) {
    if (!data || typeof data !== 'object') return false;
    const hasLegacyName = data.name === 'Rafael' || data.displayName === 'Rafael';
    const hasLegacyTag = data.tag === '#A7F291';
    const hasLegacyStats = data.stats?.totalBattles === 12 && data.stats?.victories === 8 && data.stats?.defeats === 4;
    const hasLegacyBattles = Array.isArray(data.recentBattles) && data.recentBattles.some(b => b.id === 'seed-1');

    return hasLegacyName && (hasLegacyTag || hasLegacyStats || hasLegacyBattles);
  }

  const TrainerStore = {
    STORAGE_KEY,
    CURRENT_VERSION,
    MIN_DISPLAY_NAME_LENGTH,
    MAX_DISPLAY_NAME_LENGTH,
    AVATAR_PRESETS,

    /**
     * Retorna uma nova instância do perfil padrão limpo.
     * @returns {Object}
     */
    getDefaultState() {
      return createDefaultProfile();
    },

    /**
     * Carrega os dados salvos do treinador ou inicializa com o estado padrão limpo.
     * Realiza migração transparente se detectar o seed fictício anterior.
     * @returns {Object} Dados do perfil do treinador.
     */
    load() {
      try {
        if (typeof localStorage === 'undefined') {
          return this.getDefaultState();
        }

        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          const freshProfile = this.getDefaultState();
          this.save(freshProfile);
          return freshProfile;
        }

        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') {
          const freshProfile = this.getDefaultState();
          this.save(freshProfile);
          return freshProfile;
        }

        // Migração V1 pontual: substitui o seed fictício demonstrativo antigo por perfil limpo
        if (isLegacyDemoSeed(parsed)) {
          console.info('Migrando perfil legado com seed demonstrativo para novo schema limpo...');
          const freshProfile = this.getDefaultState();
          this.save(freshProfile);
          return freshProfile;
        }

        // Normalização de dados garantindo integridade de campos
        const trainerId = (typeof parsed.trainerId === 'string' && parsed.trainerId.trim())
          ? parsed.trainerId.trim()
          : generateTrainerId();

        // Validação de displayName (2..24 chars após trim)
        let displayName = 'Treinador';
        const rawName = typeof parsed.displayName === 'string'
          ? parsed.displayName.trim()
          : (typeof parsed.name === 'string' ? parsed.name.trim() : '');

        if (rawName.length >= MIN_DISPLAY_NAME_LENGTH && rawName.length <= MAX_DISPLAY_NAME_LENGTH && rawName !== 'Rafael') {
          displayName = rawName;
        }

        // Validação de avatarPreset com fallback seguro para 'default'
        const avatarPreset = (typeof parsed.avatarPreset === 'string' && AVATAR_PRESETS[parsed.avatarPreset])
          ? parsed.avatarPreset
          : 'default';

        const companionPokemonId = Number.isInteger(Number(parsed.companionPokemonId)) && Number(parsed.companionPokemonId) > 0
          ? Number(parsed.companionPokemonId)
          : null;

        const rawStats = parsed.stats || {};
        const battlesPlayed = Number.isFinite(rawStats.battlesPlayed)
          ? Math.max(0, rawStats.battlesPlayed)
          : Number.isFinite(rawStats.totalBattles)
            ? Math.max(0, rawStats.totalBattles)
            : 0;

        const wins = Number.isFinite(rawStats.wins)
          ? Math.max(0, rawStats.wins)
          : Number.isFinite(rawStats.victories)
            ? Math.max(0, rawStats.victories)
            : 0;

        const losses = Number.isFinite(rawStats.losses)
          ? Math.max(0, rawStats.losses)
          : Number.isFinite(rawStats.defeats)
            ? Math.max(0, rawStats.defeats)
            : 0;

        const currentWinStreak = Number.isFinite(rawStats.currentWinStreak)
          ? Math.max(0, rawStats.currentWinStreak)
          : Number.isFinite(rawStats.currentStreak)
            ? Math.max(0, rawStats.currentStreak)
            : 0;

        const bestWinStreak = Number.isFinite(rawStats.bestWinStreak)
          ? Math.max(currentWinStreak, rawStats.bestWinStreak)
          : Number.isFinite(rawStats.bestStreak)
            ? Math.max(currentWinStreak, rawStats.bestStreak)
            : currentWinStreak;

        const winRate = battlesPlayed > 0
          ? Math.round((wins / battlesPlayed) * 1000) / 10
          : 0;

        const leaderUsage = rawStats.leaderUsage && typeof rawStats.leaderUsage === 'object'
          ? { ...rawStats.leaderUsage }
          : {};

        const recentBattles = Array.isArray(parsed.recentBattles)
          ? parsed.recentBattles.slice(0, 10)
          : [];

        const normalized = {
          version: CURRENT_VERSION,
          trainerId,
          displayName,
          avatarPreset,
          companionPokemonId,
          stats: {
            battlesPlayed,
            wins,
            losses,
            winRate,
            currentWinStreak,
            bestWinStreak,
            lastBattleAt: rawStats.lastBattleAt || null,
            leaderUsage
          },
          recentBattles
        };

        return normalized;
      } catch (err) {
        console.warn('Erro ao carregar perfil do treinador do LocalStorage. Utilizando padrão limpo.', err);
        return this.getDefaultState();
      }
    },

    /**
     * Salva o perfil do treinador no LocalStorage.
     * @param {Object} data - Dados a serem salvos.
     * @returns {boolean} True se salvo com sucesso.
     */
    save(data) {
      try {
        if (typeof localStorage === 'undefined') {
          return false;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
      } catch (err) {
        console.error('Falha ao salvar perfil do treinador no LocalStorage:', err);
        return false;
      }
    },

    /**
     * Reseta as estatísticas do treinador mantendo a identidade intacta.
     * @param {Object} currentProfile - Perfil atual.
     * @returns {Object} Perfil com stats resetados.
     */
    resetStats(currentProfile) {
      const base = currentProfile || this.load();
      const updated = {
        ...base,
        version: CURRENT_VERSION,
        stats: {
          battlesPlayed: 0,
          wins: 0,
          losses: 0,
          winRate: 0,
          currentWinStreak: 0,
          bestWinStreak: 0,
          lastBattleAt: null,
          leaderUsage: {}
        },
        recentBattles: []
      };
      this.save(updated);
      return updated;
    },

    /**
     * Reseta completamente os dados para o perfil limpo inicial.
     * @returns {Object} Estado limpo.
     */
    reset() {
      const initial = this.getDefaultState();
      this.save(initial);
      return initial;
    }
  };

  // Exportação isomórfica (Browser & Node.js)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TrainerStore;
  }
  if (typeof root !== 'undefined') {
    root.TrainerStore = TrainerStore;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
