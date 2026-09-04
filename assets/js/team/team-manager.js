/**
 * ====================================================================
 * GERENCIADOR DE REGRAS DE NEGÓCIO: TEAM MANAGER (team-manager.js)
 * ====================================================================
 * Gerencia a lógica do time Pokémon:
 * - Capacidade máxima: 3 Pokémon (TEAM_MAX_SIZE = 3);
 * - Proibição de duplicatas (DUPLICATE_POKEMON = FORBIDDEN);
 * - Importância da ordem (ORDER_MATTERS = YES): Slot 1 é o Líder;
 * - Reordenação, adição, remoção e notificação de eventos (Observer Pattern).
 */

class TeamManager {
  constructor(store = window.TeamStore) {
    this.store = store;
    this.maxSize = 3;
    this.pokemonIds = this.store ? this.store.load() : [];
    this.listeners = [];
  }

  /**
   * Registra um ouvinte para alterações no time.
   * @param {Function} callback - Função chamada com (eventType, data, teamIds).
   */
  onChange(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
    }
  }

  /**
   * Notifica todos os ouvintes registrados.
   */
  notify(eventType, data = {}) {
    const currentTeam = this.getTeamIds();
    for (const listener of this.listeners) {
      try {
        listener(eventType, data, currentTeam);
      } catch (err) {
        console.error('Erro ao executar ouvinte do TeamManager:', err);
      }
    }
  }

  /**
   * Retorna cópia da lista ordenada de IDs do time atual.
   * @returns {number[]}
   */
  getTeamIds() {
    return [...this.pokemonIds];
  }

  /**
   * Quantidade atual de integrantes no time (0 a 3).
   * @returns {number}
   */
  getSize() {
    return this.pokemonIds.length;
  }

  /**
   * Verifica se o time atingiu a capacidade máxima.
   * @returns {boolean}
   */
  isFull() {
    return this.pokemonIds.length >= this.maxSize;
  }

  /**
   * Verifica se um Pokémon específico já pertence ao time.
   * @param {number} pokemonId
   * @returns {boolean}
   */
  hasPokemon(pokemonId) {
    const id = Number(pokemonId);
    return this.pokemonIds.includes(id);
  }

  /**
   * Adiciona um Pokémon ao time.
   * @param {number} pokemonId
   * @returns {{ success: boolean, reason?: string }}
   */
  addPokemon(pokemonId) {
    const id = Number(pokemonId);

    if (!Number.isInteger(id) || id <= 0) {
      return { success: false, reason: 'INVALID_ID' };
    }

    if (this.hasPokemon(id)) {
      return { success: false, reason: 'ALREADY_IN_TEAM' };
    }

    if (this.isFull()) {
      return { success: false, reason: 'TEAM_FULL' };
    }

    this.pokemonIds.push(id);
    if (this.store) {
      this.store.save(this.pokemonIds);
    }

    this.notify('added', { id });
    return { success: true, teamIds: this.getTeamIds() };
  }

  /**
   * Remove um Pokémon do time e reorganiza os slots.
   * @param {number} pokemonId
   * @returns {{ success: boolean, reason?: string }}
   */
  removePokemon(pokemonId) {
    const id = Number(pokemonId);
    const index = this.pokemonIds.indexOf(id);

    if (index === -1) {
      return { success: false, reason: 'NOT_IN_TEAM' };
    }

    this.pokemonIds.splice(index, 1);
    if (this.store) {
      this.store.save(this.pokemonIds);
    }

    this.notify('removed', { id });
    return { success: true, teamIds: this.getTeamIds() };
  }

  /**
   * Alterna presença do Pokémon no time (adiciona se ausente, remove se presente).
   * @param {number} pokemonId
   * @returns {{ success: boolean, action: 'added'|'removed'|'none', reason?: string }}
   */
  togglePokemon(pokemonId) {
    const id = Number(pokemonId);
    if (this.hasPokemon(id)) {
      const res = this.removePokemon(id);
      return { ...res, action: 'removed' };
    } else {
      const res = this.addPokemon(id);
      return { ...res, action: res.success ? 'added' : 'none' };
    }
  }

  /**
   * Move a posição de um Pokémon no time (reordenação acessível).
   * @param {number} pokemonId - ID do Pokémon a mover.
   * @param {'left'|'right'|'prev'|'next'} direction - Direção do movimento.
   * @returns {{ success: boolean, reason?: string }}
   */
  movePokemon(pokemonId, direction) {
    const id = Number(pokemonId);
    const currentIndex = this.pokemonIds.indexOf(id);

    if (currentIndex === -1) {
      return { success: false, reason: 'NOT_IN_TEAM' };
    }

    const delta = (direction === 'left' || direction === 'prev') ? -1 : 1;
    const targetIndex = currentIndex + delta;

    if (targetIndex < 0 || targetIndex >= this.pokemonIds.length) {
      return { success: false, reason: 'BOUNDARY_REACHED' };
    }

    // Troca os elementos de posição (destructuring assignment)
    const temp = this.pokemonIds[currentIndex];
    this.pokemonIds[currentIndex] = this.pokemonIds[targetIndex];
    this.pokemonIds[targetIndex] = temp;

    if (this.store) {
      this.store.save(this.pokemonIds);
    }

    this.notify('reordered', { id, from: currentIndex, to: targetIndex });
    return { success: true, teamIds: this.getTeamIds() };
  }

  /**
   * Limpa todo o time.
   * @returns {{ success: boolean }}
   */
  clearTeam() {
    this.pokemonIds = [];
    if (this.store) {
      this.store.clear();
    }
    this.notify('cleared', {});
    return { success: true };
  }

  /**
   * Recarrega os dados do LocalStorage (útil para testes ou sincronização).
   */
  reload() {
    this.pokemonIds = this.store ? this.store.load() : [];
    this.notify('reloaded', {});
  }
}

// Instância global única para orquestrar as ações
window.teamManager = new TeamManager(window.TeamStore);
