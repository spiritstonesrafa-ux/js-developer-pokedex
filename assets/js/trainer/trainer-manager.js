/**
 * ====================================================================
 * GERENCIADOR DE REGRAS DE NEGÓCIO: TRAINER MANAGER (trainer-manager.js)
 * ====================================================================
 * Gerencia as regras de negócio e cálculo determinístico do Perfil do Treinador:
 * - Estatísticas de carreira (batalhas, vitórias, derrotas, win rate, sequências);
 * - Gestão do Pokémon Companheiro;
 * - Registro dinâmico de novas batalhas vindas da Battle Arena;
 * - Notificação de ouvintes (Observer Pattern).
 */

(function(root) {
  'use strict';

  class TrainerManager {
    /**
     * @param {Object} [store] - Mecanismo de persistência (padrão: TrainerStore).
     */
    constructor(store = (typeof root !== 'undefined' ? root.TrainerStore : null)) {
      this.store = store;
      this.data = this.store ? this.store.load() : {
        name: 'Rafael',
        tag: '#A7F291',
        companion: null,
        stats: { totalBattles: 0, victories: 0, defeats: 0, currentStreak: 0, bestStreak: 0 },
        recentBattles: []
      };
      this.listeners = [];
    }

    /**
     * Registra ouvinte para alterações no perfil.
     * @param {Function} callback
     */
    onChange(callback) {
      if (typeof callback === 'function') {
        this.listeners.push(callback);
      }
    }

    /**
     * Notifica todos os ouvintes registrados.
     * @param {string} eventType
     * @param {Object} [payload]
     */
    notify(eventType, payload = {}) {
      for (const listener of this.listeners) {
        try {
          listener(eventType, payload, this.getProfileSummary());
        } catch (err) {
          console.error('Erro ao executar ouvinte do TrainerManager:', err);
        }
      }
    }

    /**
     * Salva o estado atual no armazenamento.
     * @private
     */
    persist() {
      if (this.store && typeof this.store.save === 'function') {
        this.store.save(this.data);
      }
    }

    /**
     * Retorna o nome do treinador.
     * @returns {string}
     */
    getName() {
      return this.data.name || 'Rafael';
    }

    /**
     * Atualiza o nome do treinador.
     * @param {string} newName
     * @returns {boolean}
     */
    setName(newName) {
      if (typeof newName !== 'string') return false;
      const trimmed = newName.trim();
      if (!trimmed || trimmed.length > 30) return false;

      this.data.name = trimmed;
      this.persist();
      this.notify('NAME_UPDATED', { name: trimmed });
      return true;
    }

    /**
     * Retorna a tag/código do treinador.
     * @returns {string}
     */
    getTag() {
      return this.data.tag || '#A7F291';
    }

    /**
     * Atualiza a tag do treinador.
     * @param {string} newTag
     * @returns {boolean}
     */
    setTag(newTag) {
      if (typeof newTag !== 'string') return false;
      const trimmed = newTag.trim();
      if (!trimmed || trimmed.length > 15) return false;

      this.data.tag = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
      this.persist();
      this.notify('TAG_UPDATED', { tag: this.data.tag });
      return true;
    }

    /**
     * Retorna o Pokémon Companheiro atual.
     * @returns {Object|null}
     */
    getCompanion() {
      return this.data.companion ? { ...this.data.companion } : null;
    }

    /**
     * Define o Pokémon Companheiro.
     * @param {Object} pokemon
     * @returns {boolean}
     */
    setCompanion(pokemon) {
      if (!pokemon || typeof pokemon !== 'object') return false;
      const id = Number(pokemon.number || pokemon.id);
      if (!Number.isInteger(id) || id <= 0) return false;

      const name = String(pokemon.name || '').trim();
      if (!name) return false;

      const types = Array.isArray(pokemon.types) && pokemon.types.length > 0
        ? [...pokemon.types]
        : [pokemon.type || 'normal'];

      const photo = pokemon.photo || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
      const animatedPhoto = pokemon.animatedPhoto || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;

      this.data.companion = {
        id,
        name: name.toLowerCase(),
        type: types[0],
        types,
        photo,
        animatedPhoto
      };

      this.persist();
      this.notify('COMPANION_UPDATED', { companion: this.data.companion });
      return true;
    }

    /**
     * Retorna as estatísticas calculadas de carreira do treinador.
     * @returns {{
     *   totalBattles: number,
     *   victories: number,
     *   defeats: number,
     *   winRatePercent: number,
     *   winRateFormatted: string,
     *   currentStreak: number,
     *   bestStreak: number
     * }}
     */
    getStats() {
      const stats = this.data.stats || {
        totalBattles: 0,
        victories: 0,
        defeats: 0,
        currentStreak: 0,
        bestStreak: 0
      };

      const total = Math.max(0, Number(stats.totalBattles) || 0);
      const wins = Math.max(0, Number(stats.victories) || 0);
      const losses = Math.max(0, Number(stats.defeats) || 0);
      const currentStreak = Math.max(0, Number(stats.currentStreak) || 0);
      const bestStreak = Math.max(0, Number(stats.bestStreak) || 0);

      const winRatePercent = total > 0 ? (wins / total) * 100 : 0;
      const winRateFormatted = total > 0
        ? `${winRatePercent.toFixed(1).replace('.', ',')}%`
        : '0,0%';

      return {
        totalBattles: total,
        victories: wins,
        defeats: losses,
        winRatePercent: Math.round(winRatePercent * 10) / 10,
        winRateFormatted,
        currentStreak,
        bestStreak
      };
    }

    /**
     * Retorna a lista das batalhas mais recentes (cópia imutável).
     * @param {number} [limit=10]
     * @returns {Array<Object>}
     */
    getRecentBattles(limit = 10) {
      const battles = Array.isArray(this.data.recentBattles) ? this.data.recentBattles : [];
      return battles.slice(0, limit).map(b => ({ ...b }));
    }

    /**
     * Registra o resultado de uma nova batalha concluída na arena.
     * @param {Object} battleInfo - Informações do confronto.
     * @param {'VICTORY'|'DEFEAT'} battleInfo.result - Resultado do jogador.
     * @param {number} [battleInfo.turns=1] - Quantidade de turnos decorridos.
     * @param {string} [battleInfo.opponentName] - Nome do adversário enfrentado.
     * @param {Array<Object>} [battleInfo.playerTeam] - Time utilizado na batalha.
     * @returns {Object} Novo registro adicionado.
     */
    recordBattle(battleInfo = {}) {
      const result = String(battleInfo.result || '').toUpperCase();
      if (result !== 'VICTORY' && result !== 'DEFEAT') {
        throw new Error(`Resultado de batalha inválido: "${battleInfo.result}". Deve ser VICTORY ou DEFEAT.`);
      }

      const turns = Math.max(1, Number(battleInfo.turns) || 1);
      const opponentName = typeof battleInfo.opponentName === 'string' && battleInfo.opponentName.trim()
        ? battleInfo.opponentName.trim()
        : 'Treinador Rival';

      // Atualiza contadores
      this.data.stats.totalBattles += 1;
      if (result === 'VICTORY') {
        this.data.stats.victories += 1;
        this.data.stats.currentStreak += 1;
        if (this.data.stats.currentStreak > this.data.stats.bestStreak) {
          this.data.stats.bestStreak = this.data.stats.currentStreak;
        }
      } else {
        this.data.stats.defeats += 1;
        this.data.stats.currentStreak = 0;
      }

      // Cria registro da batalha recente
      const newRecord = {
        id: `battle-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        result,
        turns,
        opponentName,
        date: 'Recente'
      };

      if (!Array.isArray(this.data.recentBattles)) {
        this.data.recentBattles = [];
      }

      // Insere no início (mais recente primeiro) e limita a 20 registros
      this.data.recentBattles.unshift(newRecord);
      if (this.data.recentBattles.length > 20) {
        this.data.recentBattles = this.data.recentBattles.slice(0, 20);
      }

      this.persist();
      this.notify('BATTLE_RECORDED', { record: newRecord, stats: this.getStats() });
      return newRecord;
    }

    /**
     * Retorna resumo consolidado do perfil.
     * @returns {Object}
     */
    getProfileSummary() {
      return {
        name: this.getName(),
        tag: this.getTag(),
        companion: this.getCompanion(),
        stats: this.getStats(),
        recentBattles: this.getRecentBattles()
      };
    }
  }

  // Exportação isomórfica (Browser & Node.js)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TrainerManager;
  }
  if (typeof root !== 'undefined') {
    root.TrainerManager = TrainerManager;
    if (typeof root.TrainerStore !== 'undefined') {
      root.trainerManager = new TrainerManager(root.TrainerStore);
    }
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
