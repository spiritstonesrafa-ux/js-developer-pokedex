/**
 * ====================================================================
 * CAMADA DE PERSISTÊNCIA: TEAM STORE (team-store.js)
 * ====================================================================
 * Responsável pelo carregamento, validação e persistência do time Pokémon
 * no LocalStorage do navegador sob o namespace 'team.current'.
 * 
 * Princípios aplicados:
 * - Tolerância a falhas: recupera-se de JSON corrompido ou chaves ausentes;
 * - Sanitização: garante IDs inteiros positivos, sem duplicatas e limite máximo de 3;
 * - Isolamento: não altera 'pokedex_favorites' ou 'pokedex_theme'.
 */

const TeamStore = (() => {
  const STORAGE_KEY = 'team.current';
  const MAX_SIZE = 3;
  const CURRENT_VERSION = 1;

  /**
   * Sanitiza e valida uma lista bruta de IDs de Pokémon.
   * @param {any} rawIds - Lista de dados a ser validada.
   * @returns {number[]} Array de números inteiros positivos únicos, limitado ao MAX_SIZE.
   */
  function sanitizePokemonIds(rawIds) {
    if (!Array.isArray(rawIds)) return [];

    const uniqueIds = new Set();
    const cleanList = [];

    for (const item of rawIds) {
      const num = Number(item);
      if (Number.isInteger(num) && num > 0 && !uniqueIds.has(num)) {
        uniqueIds.add(num);
        cleanList.push(num);
        if (cleanList.length >= MAX_SIZE) break;
      }
    }

    return cleanList;
  }

  /**
   * Carrega os IDs do time salvos no LocalStorage.
   * @returns {number[]} Lista com os IDs dos Pokémon (de 0 a 3).
   */
  function load() {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (!rawData) return [];

      const parsed = JSON.parse(rawData);
      if (typeof parsed !== 'object' || parsed === null) return [];

      const ids = Array.isArray(parsed.pokemonIds) ? parsed.pokemonIds : [];
      return sanitizePokemonIds(ids);
    } catch (error) {
      console.warn('Falha ao ler team.current do LocalStorage. Recuperando com time vazio:', error);
      return [];
    }
  }

  /**
   * Salva a lista de IDs de Pokémon no LocalStorage.
   * @param {number[]} pokemonIds - Lista de IDs a salvar.
   * @returns {boolean} True se a gravação foi bem-sucedida.
   */
  function save(pokemonIds) {
    try {
      const cleanIds = sanitizePokemonIds(pokemonIds);
      const payload = {
        version: CURRENT_VERSION,
        pokemonIds: cleanIds,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      return true;
    } catch (error) {
      console.error('Erro ao persistir time no LocalStorage:', error);
      return false;
    }
  }

  /**
   * Limpa o time salvo no LocalStorage.
   * @returns {boolean} True se a limpeza foi concluída.
   */
  function clear() {
    try {
      const emptyPayload = {
        version: CURRENT_VERSION,
        pokemonIds: [],
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(emptyPayload));
      return true;
    } catch (error) {
      console.error('Erro ao limpar time no LocalStorage:', error);
      return false;
    }
  }

  return {
    STORAGE_KEY,
    MAX_SIZE,
    load,
    save,
    clear,
    sanitizePokemonIds
  };
})();

// Exportação global para compatibilidade sem empacotadores
window.TeamStore = TeamStore;
