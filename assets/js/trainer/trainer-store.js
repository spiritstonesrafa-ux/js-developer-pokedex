/**
 * ====================================================================
 * ARMAZENAMENTO E PERSISTÊNCIA: TRAINER STORE (trainer-store.js)
 * ====================================================================
 * Gerencia a persistência dos dados do Perfil do Treinador no LocalStorage
 * sob a chave 'trainer.profile', com schema versionado, ID estável único,
 * inicialização limpa (zero-state) e migração segura de dados legados.
 */

(function(root) {
  'use strict';

  const STORAGE_KEY = 'trainer.profile';
  const CURRENT_VERSION = 1;

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
    // Assinatura inequívoca do seed fake da versão anterior
    const hasLegacyName = data.name === 'Rafael' || data.displayName === 'Rafael';
    const hasLegacyTag = data.tag === '#A7F291';
    const hasLegacyStats = data.stats?.totalBattles === 12 && data.stats?.victories === 8 && data.stats?.defeats === 4;
    const hasLegacyBattles = Array.isArray(data.recentBattles) && data.recentBattles.some(b => b.id === 'seed-1');

    return hasLegacyName && (hasLegacyTag || hasLegacyStats || hasLegacyBattles);
  }

  const TrainerStore = {
    STORAGE_KEY,
    CURRENT_VERSION,

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

        const displayName = (typeof parsed.displayName === 'string' && parsed.displayName.trim())
          ? parsed.displayName.trim()
          : (typeof parsed.name === 'string' && parsed.name.trim() && parsed.name !== 'Rafael')
            ? parsed.name.trim()
            : 'Treinador';

        const companionPokemonId = Number.isInteger(Number(parsed.companionPokemonId)) && Number(parsed.companionPokemonId) > 0
          ? Number(parsed.companionPokemonId)
          : (parsed.companion?.id && Number.isInteger(Number(parsed.companion.id)) && parsed.companion.id !== 6 ? Number(parsed.companion.id) : null);

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
          avatarPreset: parsed.avatarPreset || 'default',
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
