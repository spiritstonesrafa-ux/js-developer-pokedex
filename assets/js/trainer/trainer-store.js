/**
 * ====================================================================
 * ARMAZENAMENTO E PERSISTÊNCIA: TRAINER STORE (trainer-store.js)
 * ====================================================================
 * Gerencia a persistência dos dados do Perfil do Treinador no LocalStorage
 * sob a chave 'trainer.profile', com fallback e seed inicial determinístico.
 */

(function(root) {
  'use strict';

  const STORAGE_KEY = 'trainer.profile';

  const DEFAULT_SEED_DATA = {
    name: 'Rafael',
    tag: '#A7F291',
    companion: {
      id: 6,
      name: 'charizard',
      type: 'fire',
      types: ['fire', 'flying'],
      photo: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
      animatedPhoto: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/6.gif'
    },
    stats: {
      totalBattles: 12,
      victories: 8,
      defeats: 4,
      currentStreak: 3,
      bestStreak: 5
    },
    recentBattles: [
      {
        id: 'seed-1',
        result: 'VICTORY',
        turns: 6,
        opponentName: 'Desafiante da Arena',
        date: 'Hoje'
      },
      {
        id: 'seed-2',
        result: 'DEFEAT',
        turns: 8,
        opponentName: 'Líder de Ginásio',
        date: 'Ontem'
      },
      {
        id: 'seed-3',
        result: 'VICTORY',
        turns: 5,
        opponentName: 'Treinador Veterano',
        date: '2 dias atrás'
      }
    ]
  };

  const TrainerStore = {
    STORAGE_KEY,

    /**
     * Retorna uma cópia limpa do estado padrão (seed).
     * @returns {Object}
     */
    getDefaultState() {
      return JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
    },

    /**
     * Carrega os dados salvos do treinador ou inicializa com o estado padrão.
     * @returns {Object} Dados do perfil do treinador.
     */
    load() {
      try {
        if (typeof localStorage === 'undefined') {
          return this.getDefaultState();
        }

        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          const initial = this.getDefaultState();
          this.save(initial);
          return initial;
        }

        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') {
          return this.getDefaultState();
        }

        // Garante estrutura completa mesclando com o padrão
        const merged = {
          name: typeof parsed.name === 'string' && parsed.name.trim() ? parsed.name.trim() : DEFAULT_SEED_DATA.name,
          tag: typeof parsed.tag === 'string' && parsed.tag.trim() ? parsed.tag.trim() : DEFAULT_SEED_DATA.tag,
          companion: parsed.companion && typeof parsed.companion === 'object' ? parsed.companion : { ...DEFAULT_SEED_DATA.companion },
          stats: {
            totalBattles: Number.isFinite(parsed.stats?.totalBattles) ? parsed.stats.totalBattles : DEFAULT_SEED_DATA.stats.totalBattles,
            victories: Number.isFinite(parsed.stats?.victories) ? parsed.stats.victories : DEFAULT_SEED_DATA.stats.victories,
            defeats: Number.isFinite(parsed.stats?.defeats) ? parsed.stats.defeats : DEFAULT_SEED_DATA.stats.defeats,
            currentStreak: Number.isFinite(parsed.stats?.currentStreak) ? parsed.stats.currentStreak : DEFAULT_SEED_DATA.stats.currentStreak,
            bestStreak: Number.isFinite(parsed.stats?.bestStreak) ? parsed.stats.bestStreak : DEFAULT_SEED_DATA.stats.bestStreak
          },
          recentBattles: Array.isArray(parsed.recentBattles) ? parsed.recentBattles : [...DEFAULT_SEED_DATA.recentBattles]
        };

        return merged;
      } catch (err) {
        console.warn('Erro ao carregar perfil do treinador do LocalStorage. Utilizando padrão.', err);
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
     * Reseta os dados para o seed canônico inicial.
     * @returns {Object} Estado resetado.
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
