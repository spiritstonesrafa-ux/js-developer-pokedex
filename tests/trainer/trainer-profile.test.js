/**
 * ====================================================================
 * TESTES AUTOMATIZADOS: PERFIL DO TREINADOR (trainer-profile.test.js)
 * ====================================================================
 * Validação rigorosa dos módulos da fase PBA-014:
 * - TrainerStore (persistência, seed canônico, tolerância a falhas);
 * - TrainerManager (regras de negócio, cálculo determinístico de winrate e sequências);
 * - Gestão do Pokémon Companheiro e histórico de batalhas recentes;
 * - Integração com encerramento de combate da Battle Session.
 */

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');

const TrainerStore = require('../../assets/js/trainer/trainer-store.js');
const TrainerManager = require('../../assets/js/trainer/trainer-manager.js');
const TrainerUI = require('../../assets/js/trainer/trainer-ui.js');

// Mock em memória do LocalStorage para isolamento total dos testes
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

describe('PHASE PBA-014 — TRAINER STORE', () => {
  let mockStorage;
  let customStore;

  beforeEach(() => {
    mockStorage = createMockLocalStorage();
    global.localStorage = mockStorage;
    customStore = TrainerStore;
  });

  it('TR01 — Default Seed: Carrega o seed padrão com os dados canônicos do Rafael', () => {
    const data = customStore.load();
    assert.strictEqual(data.name, 'Rafael');
    assert.strictEqual(data.tag, '#A7F291');
    assert.strictEqual(data.stats.totalBattles, 12);
    assert.strictEqual(data.stats.victories, 8);
    assert.strictEqual(data.stats.defeats, 4);
    assert.strictEqual(data.stats.currentStreak, 3);
    assert.strictEqual(data.stats.bestStreak, 5);
    assert.strictEqual(data.companion.name, 'charizard');
    assert.strictEqual(data.recentBattles.length, 3);
  });

  it('TR02 — Persistence: Salva e recarrega dados atualizados com fidelidade', () => {
    const state = customStore.getDefaultState();
    state.name = 'Ash Ketchum';
    state.stats.victories = 50;
    customStore.save(state);

    const loaded = customStore.load();
    assert.strictEqual(loaded.name, 'Ash Ketchum');
    assert.strictEqual(loaded.stats.victories, 50);
  });

  it('TR03 — Fault Tolerance: Recupera graciosamente de JSON corrompido no LocalStorage', () => {
    mockStorage.setItem(TrainerStore.STORAGE_KEY, '{invalid-json-corrupt');
    const loaded = customStore.load();
    assert.strictEqual(loaded.name, 'Rafael');
    assert.strictEqual(loaded.stats.totalBattles, 12);
  });

  it('TR04 — Reset: Restaura os dados para o seed canônico original', () => {
    const state = customStore.getDefaultState();
    state.name = 'Outro Nome';
    customStore.save(state);

    const resetState = customStore.reset();
    assert.strictEqual(resetState.name, 'Rafael');
    assert.strictEqual(resetState.stats.victories, 8);
  });
});

describe('PHASE PBA-014 — TRAINER MANAGER (BUSINESS LOGIC & STATS)', () => {
  let mockStorage;
  let store;
  let manager;

  beforeEach(() => {
    mockStorage = createMockLocalStorage();
    global.localStorage = mockStorage;
    store = TrainerStore;
    store.reset();
    manager = new TrainerManager(store);
  });

  it('TR05 — Initial Canonical Stats: Win rate de 66,7% e sequências corretas', () => {
    const stats = manager.getStats();
    assert.strictEqual(stats.totalBattles, 12);
    assert.strictEqual(stats.victories, 8);
    assert.strictEqual(stats.defeats, 4);
    assert.strictEqual(stats.currentStreak, 3);
    assert.strictEqual(stats.bestStreak, 5);
    assert.strictEqual(stats.winRateFormatted, '66,7%');
  });

  it('TR06 — Recent Battles Seed: Possui exatamente os 3 confrontos canônicos informados', () => {
    const recent = manager.getRecentBattles();
    assert.strictEqual(recent.length, 3);
    assert.strictEqual(recent[0].result, 'VICTORY');
    assert.strictEqual(recent[0].turns, 6);
    assert.strictEqual(recent[1].result, 'DEFEAT');
    assert.strictEqual(recent[1].turns, 8);
    assert.strictEqual(recent[2].result, 'VICTORY');
    assert.strictEqual(recent[2].turns, 5);
  });

  it('TR07 — Name & Tag Mutation: Atualiza nome e tag com validação estrita', () => {
    assert.strictEqual(manager.setName('Mestre Rafael'), true);
    assert.strictEqual(manager.getName(), 'Mestre Rafael');

    // Rejeição de vazios
    assert.strictEqual(manager.setName('   '), false);
    assert.strictEqual(manager.getName(), 'Mestre Rafael');

    // Atualização de tag
    assert.strictEqual(manager.setTag('B99001'), true);
    assert.strictEqual(manager.getTag(), '#B99001');
  });

  it('TR08 — Companion Pokemon: Atualiza e normaliza o Pokémon companheiro', () => {
    const pikachu = {
      number: 25,
      name: 'pikachu',
      types: ['electric'],
      photo: 'pika.png'
    };

    assert.strictEqual(manager.setCompanion(pikachu), true);
    const comp = manager.getCompanion();
    assert.strictEqual(comp.id, 25);
    assert.strictEqual(comp.name, 'pikachu');
    assert.strictEqual(comp.type, 'electric');
    assert.deepStrictEqual(comp.types, ['electric']);
  });

  it('TR09 — Record Battle VICTORY: Incrementa vitórias, sequência e atualiza winrate', () => {
    const record = manager.recordBattle({
      result: 'VICTORY',
      turns: 4,
      opponentName: 'Rival Green'
    });

    assert.strictEqual(record.result, 'VICTORY');
    assert.strictEqual(record.turns, 4);

    const stats = manager.getStats();
    assert.strictEqual(stats.totalBattles, 13);
    assert.strictEqual(stats.victories, 9);
    assert.strictEqual(stats.defeats, 4);
    assert.strictEqual(stats.currentStreak, 4);
    assert.strictEqual(stats.bestStreak, 5);
    // 9 / 13 = 69,23% -> '69,2%'
    assert.strictEqual(stats.winRateFormatted, '69,2%');

    // Verifica que entrou no topo das recentes
    const recent = manager.getRecentBattles();
    assert.strictEqual(recent[0].result, 'VICTORY');
    assert.strictEqual(recent[0].turns, 4);
  });

  it('TR10 — Record Battle DEFEAT: Incrementa derrotas e reseta sequência atual para zero', () => {
    manager.recordBattle({
      result: 'DEFEAT',
      turns: 7,
      opponentName: 'Campeã Cynthia'
    });

    const stats = manager.getStats();
    assert.strictEqual(stats.totalBattles, 13);
    assert.strictEqual(stats.victories, 8);
    assert.strictEqual(stats.defeats, 5);
    assert.strictEqual(stats.currentStreak, 0);
    assert.strictEqual(stats.bestStreak, 5); // Melhor sequência preservada
    // 8 / 13 = 61,53% -> '61,5%'
    assert.strictEqual(stats.winRateFormatted, '61,5%');
  });

  it('TR11 — Streak Progression: Ultrapassar a melhor sequência atualiza bestStreak', () => {
    // Sequência atual = 3, best = 5. Duas vitórias -> 5. Terceira vitória -> 6 (novo recorde).
    manager.recordBattle({ result: 'VICTORY', turns: 3 }); // streak 4
    manager.recordBattle({ result: 'VICTORY', turns: 2 }); // streak 5
    assert.strictEqual(manager.getStats().bestStreak, 5);

    manager.recordBattle({ result: 'VICTORY', turns: 5 }); // streak 6
    const stats = manager.getStats();
    assert.strictEqual(stats.currentStreak, 6);
    assert.strictEqual(stats.bestStreak, 6);
  });

  it('TR12 — History Capping: Histórico de batalhas recentes é limitado a 20 registros', () => {
    for (let i = 0; i < 25; i++) {
      manager.recordBattle({ result: 'VICTORY', turns: i + 1 });
    }
    const recent = manager.getRecentBattles(50);
    assert.strictEqual(recent.length, 20);
  });

  it('TR13 — Observer Notification: Notifica ouvintes ao registrar batalhas ou alterar perfil', () => {
    let notifiedEvent = null;
    manager.onChange((event) => {
      notifiedEvent = event;
    });

    manager.setName('Novo Nome');
    assert.strictEqual(notifiedEvent, 'NAME_UPDATED');

    manager.recordBattle({ result: 'VICTORY', turns: 3 });
    assert.strictEqual(notifiedEvent, 'BATTLE_RECORDED');
  });
});

describe('PHASE PBA-014 — TRAINER UI & PRESENTATION', () => {
  let mockStorage;
  let store;
  let manager;
  let ui;

  beforeEach(() => {
    mockStorage = createMockLocalStorage();
    global.localStorage = mockStorage;
    store = TrainerStore;
    store.reset();
    manager = new TrainerManager(store);
    ui = new TrainerUI(manager);
  });

  it('TR14 — Headless Safety: Renderização não quebra em ambiente sem document', () => {
    assert.doesNotThrow(() => {
      ui.render();
    });
  });

  it('TR15 — XSS Protection: Escapa caracteres perigosos em strings de usuário', () => {
    const escaped = ui.escapeHtml('<script>alert("hack")</script>');
    assert.strictEqual(escaped.includes('<script>'), false);
    assert.strictEqual(escaped.includes('&lt;script&gt;'), true);
  });
});
