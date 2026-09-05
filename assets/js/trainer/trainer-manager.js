/**
 * ====================================================================
 * GERENCIADOR DE REGRAS DE NEGÓCIO: TRAINER MANAGER (trainer-manager.js)
 * ====================================================================
 * Gerencia as regras de negócio e cálculo determinístico do Perfil do Treinador:
 * - Contrato estrito de displayName (2..24 caracteres após trim);
 * - Gestão e persistência de Avatar Presets em CSS próprio;
 * - Estatísticas reais de carreira (batalhas, vitórias, derrotas, win rate, sequências);
 * - Idempotência estrita por battleId (evita duplicação de estatísticas);
 * - Histórico limitado estritamente às últimas 10 batalhas (ordem decrescente);
 * - Validação e invalidação de Pokémon Companheiro baseada no time ativo;
 * - Reset isolado de estatísticas preservando identidade e preferências do usuário.
 */

(function(root) {
  'use strict';

  const MAX_RECENT_BATTLES = 10;
  const MIN_DISPLAY_NAME_LENGTH = 2;
  const MAX_DISPLAY_NAME_LENGTH = 24;

  class TrainerManager {
    /**
     * @param {Object} [store] - Mecanismo de persistência (padrão: TrainerStore).
     */
    constructor(store = (typeof root !== 'undefined' ? root.TrainerStore : null)) {
      this.store = store;
      this.data = this.store ? this.store.load() : {
        version: 1,
        trainerId: 'local-trainer-id',
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
      this.listeners = [];
      this.recordedBattleIds = new Set(
        Array.isArray(this.data.recentBattles)
          ? this.data.recentBattles.map(b => b.battleId).filter(Boolean)
          : []
      );
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
     * Retorna o nome de exibição do treinador.
     * @returns {string}
     */
    getDisplayName() {
      return this.data.displayName || 'Treinador';
    }

    /**
     * Alias de compatibilidade para getDisplayName.
     * @returns {string}
     */
    getName() {
      return this.getDisplayName();
    }

    /**
     * Atualiza o nome do treinador seguindo o contrato estrito (2..24 chars após trim).
     * @param {string} newName
     * @returns {boolean} True se válido e atualizado, false caso contrário.
     */
    setDisplayName(newName) {
      if (typeof newName !== 'string') return false;
      const trimmed = newName.trim();
      if (trimmed.length < MIN_DISPLAY_NAME_LENGTH || trimmed.length > MAX_DISPLAY_NAME_LENGTH) {
        return false;
      }

      this.data.displayName = trimmed;
      this.persist();
      this.notify('NAME_UPDATED', { displayName: trimmed });
      return true;
    }

    /**
     * Alias de compatibilidade para setDisplayName.
     * @param {string} newName
     * @returns {boolean}
     */
    setName(newName) {
      return this.setDisplayName(newName);
    }

    /**
     * Retorna o ID único e estável do treinador.
     * @returns {string}
     */
    getTrainerId() {
      return this.data.trainerId || 'local-trainer-id';
    }

    /**
     * Retorna a tag formatada para exibição (ex: #A7F291).
     * @returns {string}
     */
    getTag() {
      const id = this.getTrainerId().replace(/-/g, '').toUpperCase();
      return `#${id.substring(0, 6)}`;
    }

    /**
     * Retorna o preset de avatar atualmente ativo.
     * @returns {string}
     */
    getAvatarPreset() {
      const presets = this.getAvatarPresets();
      const current = this.data.avatarPreset;
      return (current && presets[current]) ? current : 'default';
    }

    /**
     * Retorna os detalhes visuais do preset de avatar atual.
     * @returns {Object}
     */
    getAvatarDetails() {
      const presets = this.getAvatarPresets();
      const activeKey = this.getAvatarPreset();
      return presets[activeKey] || presets.default;
    }

    /**
     * Retorna o catálogo completo de presets disponíveis.
     * @returns {Object}
     */
    getAvatarPresets() {
      if (this.store && this.store.AVATAR_PRESETS) {
        return this.store.AVATAR_PRESETS;
      }
      return {
        default: { id: 'default', label: 'Astronauta Clássico', icon: 'fa-solid fa-user-astronaut' }
      };
    }

    /**
     * Atualiza o preset de avatar do treinador.
     * @param {string} presetId - Chave do preset (ex: 'ember', 'ocean', etc.)
     * @returns {boolean}
     */
    setAvatarPreset(presetId) {
      if (typeof presetId !== 'string') return false;
      const presets = this.getAvatarPresets();
      if (!presets[presetId]) return false;

      this.data.avatarPreset = presetId;
      this.persist();
      this.notify('AVATAR_UPDATED', { avatarPreset: presetId });
      return true;
    }

    /**
     * Retorna o ID do Pokémon Companheiro selecionado.
     * @returns {number|null}
     */
    getCompanionPokemonId() {
      return this.data.companionPokemonId || null;
    }

    /**
     * Retorna o Pokémon Companheiro atual formatado.
     * @returns {Object|null}
     */
    getCompanion() {
      const id = this.getCompanionPokemonId();
      if (!id) return null;

      const cached = (typeof window !== 'undefined' && window.allLoadedPokemons)
        ? window.allLoadedPokemons.find(p => p.number === id)
        : null;

      if (cached) {
        return {
          id: cached.number,
          name: cached.name,
          type: cached.type,
          types: cached.types,
          photo: cached.photo,
          animatedPhoto: cached.animatedPhoto
        };
      }

      return {
        id,
        name: `Pokémon #${id}`,
        type: 'normal',
        types: ['normal'],
        photo: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        animatedPhoto: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`
      };
    }

    /**
     * Define o Pokémon Companheiro através do seu ID ou objeto Pokémon.
     * @param {number|Object|null} pokemon
     * @returns {boolean}
     */
    setCompanion(pokemon) {
      if (pokemon === null) {
        this.data.companionPokemonId = null;
        this.persist();
        this.notify('COMPANION_UPDATED', { companionPokemonId: null });
        return true;
      }

      const id = typeof pokemon === 'number'
        ? pokemon
        : Number(pokemon?.number || pokemon?.id);

      if (!Number.isInteger(id) || id <= 0) return false;

      this.data.companionPokemonId = id;
      this.persist();
      this.notify('COMPANION_UPDATED', { companionPokemonId: id });
      return true;
    }

    /**
     * Valida o companheiro contra os integrantes do time atual.
     * Se o companheiro não pertencer mais ao time, invalida com segurança (define como null).
     * @param {Array<number>} teamIds - Lista de IDs do time atual.
     * @returns {boolean} True se o companheiro permanece válido, false se foi invalidado.
     */
    validateCompanionAgainstTeam(teamIds) {
      const currentCompanionId = this.getCompanionPokemonId();
      if (!currentCompanionId) return true;

      if (!Array.isArray(teamIds) || !teamIds.includes(currentCompanionId)) {
        this.data.companionPokemonId = null;
        this.persist();
        this.notify('COMPANION_INVALIDATED', { previousCompanionId: currentCompanionId });
        return false;
      }

      return true;
    }

    /**
     * Retorna as estatísticas consolidadas da carreira do treinador.
     * Garante as invariantes:
     * - wins + losses === battlesPlayed
     * - bestWinStreak >= currentWinStreak
     * @returns {Object}
     */
    getStats() {
      const stats = this.data.stats || {};
      const battlesPlayed = Math.max(0, Number(stats.battlesPlayed) || 0);
      const wins = Math.max(0, Number(stats.wins) || 0);
      const losses = Math.max(0, Number(stats.losses) || 0);
      const currentWinStreak = Math.max(0, Number(stats.currentWinStreak) || 0);
      const bestWinStreak = Math.max(currentWinStreak, Number(stats.bestWinStreak) || 0);

      // Invariante matemática
      const safeBattles = wins + losses === battlesPlayed ? battlesPlayed : (wins + losses);

      const winRate = safeBattles > 0
        ? Math.round((wins / safeBattles) * 1000) / 10
        : 0;

      const winRateFormatted = `${winRate.toFixed(1).replace('.', ',')}%`;

      return {
        battlesPlayed: safeBattles,
        wins,
        losses,
        winRate,
        winRateFormatted,
        currentWinStreak,
        bestWinStreak,
        lastBattleAt: stats.lastBattleAt || null,
        leaderUsage: { ...(stats.leaderUsage || {}) }
      };
    }

    /**
     * Retorna o histórico das batalhas mais recentes (limitado a MAX_RECENT_BATTLES = 10).
     * @param {number} [limit=10]
     * @returns {Array<Object>}
     */
    getRecentBattles(limit = MAX_RECENT_BATTLES) {
      const battles = Array.isArray(this.data.recentBattles) ? this.data.recentBattles : [];
      const effectiveLimit = Math.min(Math.max(1, limit), MAX_RECENT_BATTLES);
      return battles.slice(0, effectiveLimit).map(b => ({ ...b }));
    }

    /**
     * Registra o resultado de uma batalha concluída na arena.
     * Possui idempotência estrita por battleId: chamadas repetidas são ignoradas.
     * 
     * @param {Object} battleSummary - Resumo da batalha.
     * @param {string} battleSummary.battleId - Identificador único da sessão de combate.
     * @param {'VICTORY'|'DEFEAT'|'WIN'|'LOSS'|'PLAYER_WIN'|'ENEMY_WIN'} battleSummary.result - Desfecho.
     * @param {number} [battleSummary.turns=1] - Quantidade de turnos decorridos.
     * @param {number} [battleSummary.leaderId] - ID do Pokémon Líder (Slot 1).
     * @param {string} [battleSummary.opponentName] - Nome do adversário.
     * @returns {{ recorded: boolean, duplicate?: boolean, record?: Object, stats?: Object }}
     */
    recordBattle(battleSummary = {}) {
      const battleId = typeof battleSummary.battleId === 'string' && battleSummary.battleId.trim()
        ? battleSummary.battleId.trim()
        : null;

      if (!battleId) {
        throw new Error('battleId é obrigatório para registrar uma batalha no Perfil do Treinador.');
      }

      // IDEMPOTÊNCIA: verifica se este battleId já foi registrado
      if (this.recordedBattleIds.has(battleId)) {
        return { recorded: false, duplicate: true };
      }

      const rawResult = String(battleSummary.result || '').toUpperCase();
      const isWin = rawResult === 'VICTORY' || rawResult === 'WIN' || rawResult === 'PLAYER_WIN';
      const isLoss = rawResult === 'DEFEAT' || rawResult === 'LOSS' || rawResult === 'ENEMY_WIN';

      if (!isWin && !isLoss) {
        throw new Error(`Resultado de batalha inválido: "${battleSummary.result}". Apenas confrontos concluídos (VICTORY/DEFEAT) são registrados.`);
      }

      const turns = Math.max(1, Number(battleSummary.turns) || 1);
      const leaderId = Number.isInteger(Number(battleSummary.leaderId)) ? Number(battleSummary.leaderId) : null;
      const opponentName = typeof battleSummary.opponentName === 'string' && battleSummary.opponentName.trim()
        ? battleSummary.opponentName.trim()
        : 'Desafiante da Arena';

      // Atualiza estatísticas garantindo invariantes
      const stats = this.data.stats;
      stats.battlesPlayed += 1;

      if (isWin) {
        stats.wins += 1;
        stats.currentWinStreak += 1;
        if (stats.currentWinStreak > stats.bestWinStreak) {
          stats.bestWinStreak = stats.currentWinStreak;
        }
      } else {
        stats.losses += 1;
        stats.currentWinStreak = 0;
      }

      // Recalcula winRate de forma determinística
      stats.winRate = Math.round((stats.wins / stats.battlesPlayed) * 1000) / 10;
      stats.lastBattleAt = new Date().toISOString();

      // Atualiza estatística de uso de líder
      if (leaderId) {
        if (!stats.leaderUsage || typeof stats.leaderUsage !== 'object') {
          stats.leaderUsage = {};
        }
        stats.leaderUsage[leaderId] = (stats.leaderUsage[leaderId] || 0) + 1;
      }

      // Cria registro de histórico
      const newRecord = {
        battleId,
        result: isWin ? 'VICTORY' : 'DEFEAT',
        turns,
        leaderId,
        opponentName,
        date: 'Hoje',
        timestamp: Date.now()
      };

      if (!Array.isArray(this.data.recentBattles)) {
        this.data.recentBattles = [];
      }

      // Insere no início (mais recente primeiro) e limita rigorosamente a 10
      this.data.recentBattles.unshift(newRecord);
      if (this.data.recentBattles.length > MAX_RECENT_BATTLES) {
        this.data.recentBattles = this.data.recentBattles.slice(0, MAX_RECENT_BATTLES);
      }

      this.recordedBattleIds.add(battleId);
      this.persist();
      this.notify('BATTLE_RECORDED', { record: newRecord, stats: this.getStats() });

      return { recorded: true, record: newRecord, stats: this.getStats() };
    }

    /**
     * Reseta as estatísticas do treinador para zero, preservando a identidade
     * (nome, trainerId, avatar) e preservando outros módulos da aplicação.
     * @returns {Object} Estatísticas resetadas.
     */
    resetStats() {
      this.data.stats = {
        battlesPlayed: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        currentWinStreak: 0,
        bestWinStreak: 0,
        lastBattleAt: null,
        leaderUsage: {}
      };
      this.data.recentBattles = [];
      this.recordedBattleIds.clear();

      this.persist();
      this.notify('STATS_RESET', { stats: this.getStats() });
      return this.getStats();
    }

    /**
     * Retorna resumo consolidado do perfil.
     * @returns {Object}
     */
    getProfileSummary() {
      return {
        displayName: this.getDisplayName(),
        trainerId: this.getTrainerId(),
        tag: this.getTag(),
        avatarPreset: this.getAvatarPreset(),
        avatarDetails: this.getAvatarDetails(),
        companion: this.getCompanion(),
        companionPokemonId: this.getCompanionPokemonId(),
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
