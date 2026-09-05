/**
 * ====================================================================
 * TESTES AUTOMATIZADOS: PERFIL DO TREINADOR HARDENING (trainer-profile.test.js)
 * ====================================================================
 * Validação rigorosa dos gates TP01–TP40 e integridade de dados (PBA-014-HARDENING):
 * - Perfil novo com zero battles, zero wins/losses, histórico vazio;
 * - ID de treinador gerado, estável e não hardcoded;
 * - Idempotência estrita por battleId (duplicações ignoradas);
 * - Limite rigoroso de 10 batalhas no histórico (mais recente primeiro);
 * - Sequências de vitórias e preservação da melhor sequência histórica;
 * - Invariantes matemáticas: wins + losses === battlesPlayed;
 * - Invalidação segura de Pokémon Companheiro fora do time;
 * - Reset isolado de estatísticas preservando identidade, time e favoritos;
 * - Bloqueio contra XSS em nomes de usuário.
 */

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');

const TrainerStore = require('../../assets/js/trainer/trainer-store.js');
const TrainerManager = require('../../assets/js/trainer/trainer-manager.js');
const TrainerUI = require('../../assets/js/trainer/trainer-ui.js');

// Mock em memória do LocalStorage
function createMockLocalStorage() {
  const store = new Map();
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    }
  };
}

describe('PHASE PBA-014 — GATES TP01–TP40 (TRAINER PROFILE HARDENING)', () => {
  let mockStorage;
  let store;
  let manager;

  beforeEach(() => {
    mockStorage = createMockLocalStorage();
    global.localStorage = mockStorage;
    store = TrainerStore;
    manager = new TrainerManager(store);
  });

  // --- DEFAULT PROFILE & ZERO STATE ---
  it('TP-DEFAULT-01 / TP05 — Zero Battles: Perfil novo inicia com zero batalhas jogadas', () => {
    const stats = manager.getStats();
    assert.strictEqual(stats.battlesPlayed, 0);
  });

  it('TP-DEFAULT-02 / TP16 / TP17 — Zero Wins & Losses: Perfil novo inicia com zero vitórias e zero derrotas', () => {
    const stats = manager.getStats();
    assert.strictEqual(stats.wins, 0);
    assert.strictEqual(stats.losses, 0);
    assert.strictEqual(stats.winRate, 0);
    assert.strictEqual(stats.winRateFormatted, '0,0%');
  });

  it('TP-DEFAULT-03 / TP26 — Empty History: Perfil novo inicia com histórico de batalhas vazio', () => {
    const recent = manager.getRecentBattles();
    assert.strictEqual(Array.isArray(recent), true);
    assert.strictEqual(recent.length, 0);
  });

  it('TP07 — Default Display Name: Nome padrão é "Treinador" e não nome de desenvolvedor hardcoded', () => {
    assert.strictEqual(manager.getDisplayName(), 'Treinador');
    assert.notStrictEqual(manager.getDisplayName(), 'Rafael');
  });

  // --- TRAINER ID ---
  it('TP-ID-01 / TP06 — Generated Trainer ID: Gera um ID local aleatório não vazio', () => {
    const id = manager.getTrainerId();
    assert.strictEqual(typeof id, 'string');
    assert.strictEqual(id.length > 5, true);
    assert.notStrictEqual(id, '#A7F291');
  });

  it('TP-ID-02 — Stable Trainer ID: O ID do treinador permanece estável após recargas', () => {
    const firstId = manager.getTrainerId();
    const secondManager = new TrainerManager(store);
    assert.strictEqual(secondManager.getTrainerId(), firstId);
  });

  it('TP06-B — Independent Stores: Dois stores novos sem storage geram IDs distintos', () => {
    const state1 = store.getDefaultState();
    const state2 = store.getDefaultState();
    assert.notStrictEqual(state1.trainerId, state2.trainerId);
  });

  // --- IDEMPOTENCY ---
  it('TP-IDEMPOTENCY-01 / TP24 — Duplicate Battle Record Blocked: O mesmo battleId não altera stats mais de uma vez', () => {
    const summary = {
      battleId: 'battle_idemp_1001',
      result: 'VICTORY',
      turns: 5,
      leaderId: 25,
      opponentName: 'Rival Blue'
    };

    const firstCall = manager.recordBattle(summary);
    assert.strictEqual(firstCall.recorded, true);

    const statsAfterFirst = manager.getStats();
    assert.strictEqual(statsAfterFirst.battlesPlayed, 1);
    assert.strictEqual(statsAfterFirst.wins, 1);
    assert.strictEqual(statsAfterFirst.currentWinStreak, 1);
    assert.strictEqual(manager.getRecentBattles().length, 1);

    // Segunda chamada com o MESMO battleId
    const secondCall = manager.recordBattle(summary);
    assert.strictEqual(secondCall.recorded, false);
    assert.strictEqual(secondCall.duplicate, true);

    // Quinta chamada repetida
    manager.recordBattle(summary);
    manager.recordBattle(summary);
    const fifthCall = manager.recordBattle(summary);
    assert.strictEqual(fifthCall.recorded, false);

    // Estatísticas inalteradas
    const statsAfterRerender = manager.getStats();
    assert.strictEqual(statsAfterRerender.battlesPlayed, 1);
    assert.strictEqual(statsAfterRerender.wins, 1);
    assert.strictEqual(statsAfterRerender.currentWinStreak, 1);
    assert.strictEqual(manager.getRecentBattles().length, 1);
  });

  // --- HISTORY LIMIT & ORDERING ---
  it('TP-HISTORY-01 / TP27 — History Max 10: Limite estrito de 10 batalhas no histórico', () => {
    for (let i = 1; i <= 15; i++) {
      manager.recordBattle({
        battleId: `battle_hist_${i}`,
        result: i % 2 === 0 ? 'VICTORY' : 'DEFEAT',
        turns: i,
        opponentName: `Opponent ${i}`
      });
    }

    const history = manager.getRecentBattles(50);
    assert.strictEqual(history.length, 10);
    assert.strictEqual(history.length <= 10, true);
  });

  it('TP-HISTORY-02 / TP28 — History Newest First: A batalha mais recente fica no índice 0', () => {
    manager.recordBattle({ battleId: 'btl_1', result: 'VICTORY', turns: 3, opponentName: 'Primeiro' });
    manager.recordBattle({ battleId: 'btl_2', result: 'DEFEAT', turns: 4, opponentName: 'Segundo' });
    manager.recordBattle({ battleId: 'btl_3', result: 'VICTORY', turns: 6, opponentName: 'Terceiro (Mais Recente)' });

    const history = manager.getRecentBattles();
    assert.strictEqual(history[0].battleId, 'btl_3');
    assert.strictEqual(history[0].opponentName, 'Terceiro (Mais Recente)');
    assert.strictEqual(history[2].battleId, 'btl_1');
  });

  // --- INVARIANTS ---
  it('TP-INVARIANT-01 — Math Invariant: wins + losses === battlesPlayed em todo o ciclo', () => {
    assert.strictEqual(manager.getStats().wins + manager.getStats().losses, manager.getStats().battlesPlayed);

    manager.recordBattle({ battleId: 'inv_1', result: 'VICTORY', turns: 4 });
    manager.recordBattle({ battleId: 'inv_2', result: 'DEFEAT', turns: 6 });
    manager.recordBattle({ battleId: 'inv_3', result: 'VICTORY', turns: 2 });
    manager.recordBattle({ battleId: 'inv_4', result: 'DEFEAT', turns: 8 });

    const stats = manager.getStats();
    assert.strictEqual(stats.wins, 2);
    assert.strictEqual(stats.losses, 2);
    assert.strictEqual(stats.battlesPlayed, 4);
    assert.strictEqual(stats.wins + stats.losses, stats.battlesPlayed);
    assert.strictEqual(stats.winRate, 50);
    assert.strictEqual(stats.winRateFormatted, '50,0%');
  });

  // --- WIN STREAK ---
  it('TP-STREAK-01 / TP19 / TP20 — Win Sequence: Três vitórias consecutivas geram streak de 3', () => {
    manager.recordBattle({ battleId: 'strk_1', result: 'VICTORY', turns: 4 });
    manager.recordBattle({ battleId: 'strk_2', result: 'VICTORY', turns: 5 });
    manager.recordBattle({ battleId: 'strk_3', result: 'VICTORY', turns: 3 });

    const stats = manager.getStats();
    assert.strictEqual(stats.currentWinStreak, 3);
    assert.strictEqual(stats.bestWinStreak, 3);
  });

  it('TP-STREAK-02 — Loss Resets Current Streak Only: Derrota zera sequência atual e preserva a melhor', () => {
    manager.recordBattle({ battleId: 'strk_1', result: 'VICTORY', turns: 4 });
    manager.recordBattle({ battleId: 'strk_2', result: 'VICTORY', turns: 5 });
    manager.recordBattle({ battleId: 'strk_3', result: 'VICTORY', turns: 3 }); // streak 3
    manager.recordBattle({ battleId: 'strk_4', result: 'DEFEAT', turns: 7 }); // derrota

    const statsAfterLoss = manager.getStats();
    assert.strictEqual(statsAfterLoss.currentWinStreak, 0);
    assert.strictEqual(statsAfterLoss.bestWinStreak, 3);

    // Nova vitória retoma contagem de 1
    manager.recordBattle({ battleId: 'strk_5', result: 'VICTORY', turns: 2 });
    const statsAfterNewWin = manager.getStats();
    assert.strictEqual(statsAfterNewWin.currentWinStreak, 1);
    assert.strictEqual(statsAfterNewWin.bestWinStreak, 3);
  });

  // --- LEADER USAGE ---
  it('TP29 — Leader Usage: Registra uso do líder quando fornecido', () => {
    manager.recordBattle({ battleId: 'ldr_1', result: 'VICTORY', turns: 4, leaderId: 6 }); // Charizard
    manager.recordBattle({ battleId: 'ldr_2', result: 'VICTORY', turns: 5, leaderId: 6 }); // Charizard
    manager.recordBattle({ battleId: 'ldr_3', result: 'DEFEAT', turns: 3, leaderId: 25 }); // Pikachu

    const stats = manager.getStats();
    assert.strictEqual(stats.leaderUsage[6], 2);
    assert.strictEqual(stats.leaderUsage[25], 1);
  });

  // --- RESET STATS ---
  it('TP-RESET-01 / TP34 — Reset Stats: Zera histórico e estatísticas preservando identidade', () => {
    manager.setDisplayName('Treinador Experiente');
    const originalId = manager.getTrainerId();

    manager.recordBattle({ battleId: 'res_1', result: 'VICTORY', turns: 4 });
    manager.recordBattle({ battleId: 'res_2', result: 'VICTORY', turns: 5 });

    assert.strictEqual(manager.getStats().battlesPlayed, 2);

    manager.resetStats();

    const stats = manager.getStats();
    assert.strictEqual(stats.battlesPlayed, 0);
    assert.strictEqual(stats.wins, 0);
    assert.strictEqual(stats.losses, 0);
    assert.strictEqual(stats.currentWinStreak, 0);
    assert.strictEqual(stats.bestWinStreak, 0);
    assert.strictEqual(manager.getRecentBattles().length, 0);

    // Identidade preservada
    assert.strictEqual(manager.getDisplayName(), 'Treinador Experiente');
    assert.strictEqual(manager.getTrainerId(), originalId);
  });

  it('TP-RESET-02 / TP-RESET-03 / TP35 — Team and Favorites Preserved on Reset', () => {
    mockStorage.setItem('team.current', JSON.stringify([1, 4, 7]));
    mockStorage.setItem('pokedex_favorites', JSON.stringify([25, 150]));
    mockStorage.setItem('pokedex_theme', 'dark');

    manager.recordBattle({ battleId: 'res_keep', result: 'VICTORY', turns: 3 });
    manager.resetStats();

    assert.strictEqual(mockStorage.getItem('team.current'), JSON.stringify([1, 4, 7]));
    assert.strictEqual(mockStorage.getItem('pokedex_favorites'), JSON.stringify([25, 150]));
    assert.strictEqual(mockStorage.getItem('pokedex_theme'), 'dark');
  });

  // --- COMPANION VALIDATION ---
  it('TP-COMPANION-01 / TP09 / TP32 — Companion Invalidation: Invalida companheiro fora do time', () => {
    manager.setCompanion(6); // Charizard
    assert.strictEqual(manager.getCompanionPokemonId(), 6);

    // Time ativo contém Charizard (#6) -> Permanece válido
    const valid = manager.validateCompanionAgainstTeam([6, 25, 9]);
    assert.strictEqual(valid, true);
    assert.strictEqual(manager.getCompanionPokemonId(), 6);

    // Time foi alterado e não contém mais Charizard (#6)
    const invalid = manager.validateCompanionAgainstTeam([1, 2, 3]);
    assert.strictEqual(invalid, false);
    assert.strictEqual(manager.getCompanionPokemonId(), null);
  });

  // --- MIGRATION OF LEGACY SEED ---
  it('TP11 / TP12 — Legacy Demo Seed Migration: Migra de forma transparente o seed fictício', () => {
    mockStorage.setItem(TrainerStore.STORAGE_KEY, JSON.stringify({
      name: 'Rafael',
      tag: '#A7F291',
      stats: { totalBattles: 12, victories: 8, defeats: 4, currentStreak: 3, bestStreak: 5 },
      recentBattles: [{ id: 'seed-1', result: 'VICTORY' }]
    }));

    const clean = store.load();
    assert.strictEqual(clean.displayName, 'Treinador');
    assert.strictEqual(clean.stats.battlesPlayed, 0);
    assert.strictEqual(clean.stats.wins, 0);
    assert.strictEqual(clean.stats.losses, 0);
    assert.strictEqual(clean.recentBattles.length, 0);
  });

  // --- XSS PROTECTION ---
  it('TP15 — Display Name XSS Protection: Escapa tags maliciosas', () => {
    const ui = new TrainerUI(manager);
    const escaped = ui.escapeHtml('<img src=x onerror=alert(1)>');
    assert.strictEqual(escaped.includes('<img'), false);
    assert.strictEqual(escaped.includes('&lt;img'), true);
  });
});
