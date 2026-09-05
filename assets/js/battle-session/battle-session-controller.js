/**
 * ====================================================================
 * CONTROLADOR DE SESSÃO DE BATALHA: (battle-session-controller.js)
 * ====================================================================
 * Coordena o ciclo de vida de uma batalha jogável 3x3 na interface pública (PBA-013).
 *
 * Responsabilidades:
 * - Validação da equipe do jogador a partir de team.current (TEAM_SIZE = 3);
 * - Preparação e hidratação assíncrona das equipes (Jogador e Adversário SMART AI);
 * - Recepção e validação de comandos do jogador (MOVE, SWITCH, REPLACEMENT);
 * - Gestão de bloqueio de duplo clique / concorrência (DOUBLE_SUBMIT = NO);
 * - Injeção de aleatoriedade externa para acurácia (BattleRandomSource);
 * - Integração determinística com BattleEngine e BattleAI;
 * - Despacho de eventos para a PresentationEngine e sincronização de UI;
 * - Limpeza e cancelamento de recursos ao sair da aba de batalha;
 * - ZERO cálculo de regras de combate (dano, efetividade, vencedor).
 *
 * Suporta Node.js (CommonJS) e Navegadores (window.PBABattleSession).
 */

(function () {
  let sessionConstants;
  let randomSourceModule;
  let hydratorModule;
  let opponentFactoryModule;
  let engineModule;
  let aiModule;
  let presentationConstants;
  let presentationEngineModule;
  let compositeAdapterModule;
  let audioControllerModule;

  if (typeof module !== 'undefined' && module.exports) {
    sessionConstants = require('./battle-session-constants.js');
    randomSourceModule = require('./battle-random-source.js');
    hydratorModule = require('./battle-team-hydrator.js');
    opponentFactoryModule = require('./battle-opponent-factory.js');
    engineModule = require('../battle/battle-engine.js');
    aiModule = require('../battle/battle-ai.js');
    presentationConstants = require('../presentation/battle-presentation-constants.js');
    presentationEngineModule = require('../presentation/battle-presentation-engine.js');
    compositeAdapterModule = require('../presentation/composite-battle-dom-adapter.js');
    try {
      audioControllerModule = require('../audio/battle-audio-controller.js');
    } catch {
      audioControllerModule = null;
    }
  } else if (typeof window !== 'undefined') {
    sessionConstants = window.PBABattleSession || {};
    randomSourceModule = window.PBABattleSession || {};
    hydratorModule = window.PBABattleSession || {};
    opponentFactoryModule = window.PBABattleSession || {};
    engineModule = (window.PBABattle && window.PBABattle.BattleEngine) || window.PBABattle || {};
    aiModule = (window.PBABattle && window.PBABattle.BattleAI) || window.PBABattle || {};
    presentationConstants = window.PBABattlePresentation || {};
    presentationEngineModule = window.PBABattlePresentation || {};
    compositeAdapterModule = window.PBABattlePresentation || {};
    audioControllerModule = window.PBABattleAudio || {};
  }

  const { BATTLE_UI_STATES, SESSION_CONFIG } = sessionConstants || {
    BATTLE_UI_STATES: {
      NO_TEAM: 'NO_TEAM',
      READY: 'READY',
      PREPARING: 'PREPARING',
      BATTLE: 'BATTLE',
      AWAITING_PLAYER_ACTION: 'AWAITING_PLAYER_ACTION',
      RESOLVING: 'RESOLVING',
      AWAITING_PLAYER_REPLACEMENT: 'AWAITING_PLAYER_REPLACEMENT',
      VICTORY: 'VICTORY',
      DEFEAT: 'DEFEAT',
      ERROR: 'ERROR'
    },
    SESSION_CONFIG: { TEAM_SIZE: 3 }
  };

  class BattleSessionController {
    /**
     * @param {Object} [options]
     * @param {Object} [options.teamStore] - Store de persistência (TeamStore).
     * @param {Object} [options.teamManager] - Gerenciador de time (TeamManager).
     * @param {Object} [options.hydrator] - Instância de BattleTeamHydrator.
     * @param {Object} [options.opponentFactory] - Instância de BattleOpponentFactory.
     * @param {Object} [options.randomSource] - Instância de BattleRandomSource.
     * @param {Object} [options.engine] - Referência ao BattleEngine.
     * @param {Object} [options.ai] - Referência à BattleAI.
     * @param {Object} [options.presentationEngine] - Instância de BattlePresentationEngine.
     * @param {Object} [options.compositeAdapter] - Instância de CompositeBattleDomAdapter.
     * @param {Object} [options.view] - Instância de BattleView.
     */
    constructor(options = {}) {
      this.teamStore = options.teamStore || (typeof window !== 'undefined' ? window.TeamStore : null);
      this.teamManager = options.teamManager || (typeof window !== 'undefined' ? window.teamManager : null);

      this.randomSource = options.randomSource || (
        randomSourceModule.BattleRandomSource ? new randomSourceModule.BattleRandomSource() : null
      );
      this.hydrator = options.hydrator || (
        hydratorModule.BattleTeamHydrator ? new hydratorModule.BattleTeamHydrator() : null
      );
      this.opponentFactory = options.opponentFactory || (
        opponentFactoryModule.BattleOpponentFactory
          ? new opponentFactoryModule.BattleOpponentFactory({ hydrator: this.hydrator, randomSource: this.randomSource })
          : null
      );

      this.engine = options.engine || (
        engineModule.BattleEngine ? engineModule.BattleEngine : engineModule
      );
      this.ai = options.ai || (
        aiModule.BattleAI ? aiModule.BattleAI : aiModule
      );

      this.compositeAdapter = options.compositeAdapter || (
        compositeAdapterModule.createCompositeBattleDomAdapter ? compositeAdapterModule.createCompositeBattleDomAdapter() : null
      );
      this.presentationEngine = options.presentationEngine || (
        presentationEngineModule.createPresentationEngine
          ? presentationEngineModule.createPresentationEngine({ adapter: this.compositeAdapter })
          : null
      );

      this.view = options.view || null;
      this.uiState = BATTLE_UI_STATES.NO_TEAM;
      this.battleState = null;
      this.playerTeam = null;
      this.enemyTeam = null;
      this.isResolving = false;
      this.listeners = [];
    }

    setView(view) {
      this.view = view;
      if (this.compositeAdapter && this.compositeAdapter.uiAdapter && typeof this.compositeAdapter.uiAdapter.setView === 'function') {
        this.compositeAdapter.uiAdapter.setView(view);
      }
    }

    onStateChange(callback) {
      if (typeof callback === 'function') {
        this.listeners.push(callback);
      }
    }

    notifyState(state, data = {}) {
      this.uiState = state;
      for (const listener of this.listeners) {
        try {
          listener(state, data, this.battleState);
        } catch (err) {
          console.error('Erro no listener de BattleSessionController:', err);
        }
      }
      if (this.view && typeof this.view.renderState === 'function') {
        this.view.renderState(state, data, this.battleState);
      }
    }

    /**
     * Obtém a lista atual de IDs do time do jogador a partir do TeamStore / TeamManager.
     * @returns {number[]}
     */
    getPlayerTeamIds() {
      if (this.teamManager && typeof this.teamManager.getTeamIds === 'function') {
        return this.teamManager.getTeamIds();
      }
      if (this.teamStore && typeof this.teamStore.load === 'function') {
        return this.teamStore.load();
      }
      return [];
    }

    /**
     * Verifica o time do jogador e inicializa o estado de visualização adequado.
     */
    checkTeamAndInit() {
      const teamIds = this.getPlayerTeamIds();
      const teamSize = teamIds.length;

      if (teamSize < SESSION_CONFIG.TEAM_SIZE) {
        this.notifyState(BATTLE_UI_STATES.NO_TEAM, { teamSize, requiredSize: SESSION_CONFIG.TEAM_SIZE });
        return false;
      }

      this.notifyState(BATTLE_UI_STATES.READY, { teamIds, teamSize });
      return true;
    }

    /**
     * Prepara atomicamente a batalha hidratando as equipes e instanciando o BattleState.
     * @param {Object} [options]
     * @param {number[]} [options.opponentPoolOverride] - Pool customizada para testes.
     * @returns {Promise<Object>} Battle State inicial v2.
     */
    async prepareBattle(options = {}) {
      const teamIds = this.getPlayerTeamIds();

      if (teamIds.length !== SESSION_CONFIG.TEAM_SIZE) {
        this.notifyState(BATTLE_UI_STATES.NO_TEAM, { teamSize: teamIds.length });
        throw new Error(`Time incompleto: requer exatamente ${SESSION_CONFIG.TEAM_SIZE} Pokémon.`);
      }

      this.notifyState(BATTLE_UI_STATES.PREPARING);

      try {
        // 1. Hidrata o time do jogador
        this.playerTeam = await this.hydrator.hydrateTeam(teamIds);

        // 2. Constrói e hidrata o time adversário
        this.enemyTeam = await this.opponentFactory.createOpponentTeam(options.opponentPoolOverride);

        // 3. Cria a batalha 3x3 no Battle Engine
        this.battleState = this.engine.createTeamBattle(this.playerTeam, this.enemyTeam);

        // 4. Sincroniza metadados visuais e sonoros nos combatentes do estado de batalha
        if (this.battleState && this.battleState.player && Array.isArray(this.battleState.player.team)) {
          this.battleState.player.team.forEach((combatant, idx) => {
            const source = (this.playerTeam && this.playerTeam[idx]) || {};
            if (!combatant.photo && source.photo) combatant.photo = source.photo;
            if (!combatant.animatedPhoto && source.animatedPhoto) combatant.animatedPhoto = source.animatedPhoto;
            if (!combatant.cry && source.cry) combatant.cry = source.cry;
          });
        }

        if (this.battleState && this.battleState.enemy && Array.isArray(this.battleState.enemy.team)) {
          this.battleState.enemy.team.forEach((combatant, idx) => {
            const source = (this.enemyTeam && this.enemyTeam[idx]) || {};
            if (!combatant.photo && source.photo) combatant.photo = source.photo;
            if (!combatant.animatedPhoto && source.animatedPhoto) combatant.animatedPhoto = source.animatedPhoto;
            if (!combatant.cry && source.cry) combatant.cry = source.cry;
          });
        }

        this.notifyState(BATTLE_UI_STATES.READY, {
          prepared: true,
          playerTeam: this.playerTeam,
          enemyTeam: this.enemyTeam,
          battleState: this.battleState
        });

        return this.battleState;
      } catch (err) {
        console.error('Falha ao preparar sessão de batalha:', err);
        this.notifyState(BATTLE_UI_STATES.ERROR, { error: err.message });
        throw err;
      }
    }

    /**
     * Inicia o combate ativo, tocando introdução e abrindo o painel de ações.
     */
    async startBattle() {
      if (!this.battleState) {
        await this.prepareBattle();
      }

      // Tenta desbloquear áudio se disponível no navegador
      if (this.compositeAdapter && this.compositeAdapter.audioController) {
        try {
          await this.compositeAdapter.audioController.unlock();
        } catch {
          // Continua normalmente mesmo se áudio falhar
        }
      }

      this.notifyState(BATTLE_UI_STATES.BATTLE, { battleState: this.battleState });

      // Dispara comando BATTLE_INTRO via timeline
      if (this.presentationEngine && typeof this.presentationEngine.playCommands === 'function') {
        const introCmd = {
          type: (presentationConstants && presentationConstants.PRESENTATION_COMMANDS && presentationConstants.PRESENTATION_COMMANDS.BATTLE_INTRO) || 'BATTLE_INTRO',
          playerLead: this.battleState.player.team[0]?.name || 'Player',
          enemyLead: this.battleState.enemy.team[0]?.name || 'Enemy'
        };
        await this.presentationEngine.playCommands([introCmd], { battleState: this.battleState });
      }

      this.notifyState(BATTLE_UI_STATES.AWAITING_PLAYER_ACTION, { battleState: this.battleState });
    }

    /**
     * Executa a ação de golpe selecionada pelo jogador.
     * @param {number|string} moveId - ID do golpe escolhido.
     */
    async submitPlayerMove(moveId) {
      if (this.isResolving) return;
      if (this.uiState !== BATTLE_UI_STATES.AWAITING_PLAYER_ACTION) return;

      this.isResolving = true;
      this.notifyState(BATTLE_UI_STATES.RESOLVING);

      try {
        // 1. Gera roll de acurácia externo para o golpe do jogador
        const playerAccuracyRoll = this.randomSource.rollAccuracy();

        // 2. Consulta ação da SMART AI para o adversário
        const aiDecision = this.ai.chooseAction(this.battleState, 'enemy', { strategy: 'SMART' });
        let enemyAction = aiDecision.action;

        // Se a IA escolheu atacar, gera roll de acurácia externo para ela
        if (enemyAction && enemyAction.type === 'MOVE') {
          const enemyAccuracyRoll = this.randomSource.rollAccuracy();
          enemyAction = {
            ...enemyAction,
            accuracyRoll: enemyAccuracyRoll
          };
        }

        // 3. Resolve o turno de forma pura no BattleEngine
        const turnActions = {
          player: {
            type: 'MOVE',
            moveId: Number(moveId),
            accuracyRoll: playerAccuracyRoll
          },
          enemy: enemyAction
        };

        const turnResult = this.engine.resolveTurn(this.battleState, turnActions);
        this.battleState = turnResult.state;

        // 4. Executa timeline sequencial de apresentação
        if (this.presentationEngine && turnResult.events && turnResult.events.length > 0) {
          await this.presentationEngine.play(turnResult.events, { battleState: this.battleState });
        }

        // 5. Avalia transição de estado pós-turno
        await this.handlePostResolutionState();
      } catch (err) {
        console.error('Erro ao resolver turno de combate:', err);
        this.notifyState(BATTLE_UI_STATES.ERROR, { error: err.message });
      } finally {
        this.isResolving = false;
      }
    }

    /**
     * Executa a troca voluntária de Pokémon selecionada pelo jogador.
     * @param {number} targetPokemonId - ID do Pokémon da reserva a entrar em campo.
     */
    async submitPlayerSwitch(targetPokemonId) {
      if (this.isResolving) return;
      if (this.uiState !== BATTLE_UI_STATES.AWAITING_PLAYER_ACTION) return;

      this.isResolving = true;
      this.notifyState(BATTLE_UI_STATES.RESOLVING);

      try {
        // Ação da SMART AI para o adversário
        const aiDecision = this.ai.chooseAction(this.battleState, 'enemy', { strategy: 'SMART' });
        let enemyAction = aiDecision.action;

        if (enemyAction && enemyAction.type === 'MOVE') {
          const enemyAccuracyRoll = this.randomSource.rollAccuracy();
          enemyAction = {
            ...enemyAction,
            accuracyRoll: enemyAccuracyRoll
          };
        }

        const turnActions = {
          player: {
            type: 'SWITCH',
            targetPokemonId: Number(targetPokemonId)
          },
          enemy: enemyAction
        };

        const turnResult = this.engine.resolveTurn(this.battleState, turnActions);
        this.battleState = turnResult.state;

        if (this.presentationEngine && turnResult.events && turnResult.events.length > 0) {
          await this.presentationEngine.play(turnResult.events, { battleState: this.battleState });
        }

        await this.handlePostResolutionState();
      } catch (err) {
        console.error('Erro ao executar troca voluntária:', err);
        this.notifyState(BATTLE_UI_STATES.ERROR, { error: err.message });
      } finally {
        this.isResolving = false;
      }
    }

    /**
     * Executa a substituição obrigatória de um Pokémon nocauteado pelo jogador.
     * @param {number} targetPokemonId - ID do substituto escolhido.
     */
    async submitPlayerReplacement(targetPokemonId) {
      if (this.isResolving) return;
      if (this.uiState !== BATTLE_UI_STATES.AWAITING_PLAYER_REPLACEMENT) return;

      this.isResolving = true;
      this.notifyState(BATTLE_UI_STATES.RESOLVING);

      try {
        const replacementActions = {
          player: { targetPokemonId: Number(targetPokemonId) }
        };

        // Se o oponente também estiver com o ativo nocauteado, resolve ambos
        const enemyActive = this.battleState.enemy.team[this.battleState.enemy.activeIndex];
        if (enemyActive.currentHp === 0) {
          const aiRepl = this.ai.chooseReplacement(this.battleState, 'enemy', { strategy: 'SMART' });
          replacementActions.enemy = { targetPokemonId: aiRepl.targetPokemonId };
        }

        const replResult = this.engine.resolveReplacement(this.battleState, replacementActions);
        this.battleState = replResult.state;

        if (this.presentationEngine && replResult.events && replResult.events.length > 0) {
          await this.presentationEngine.play(replResult.events, { battleState: this.battleState });
        }

        await this.handlePostResolutionState();
      } catch (err) {
        console.error('Erro ao executar substituição obrigatória:', err);
        this.notifyState(BATTLE_UI_STATES.ERROR, { error: err.message });
      } finally {
        this.isResolving = false;
      }
    }

    /**
     * Avalia o status da batalha após a resolução de turno ou substituição.
     * @private
     */
    async handlePostResolutionState() {
      const status = this.battleState.status;

      if (status === 'BATTLE_ENDED' || status === 'PLAYER_WIN' || status === 'ENEMY_WIN') {
        const winner = this.battleState.winner || (status === 'PLAYER_WIN' ? 'player' : 'enemy');
        if (winner === 'player' || status === 'PLAYER_WIN') {
          this.notifyState(BATTLE_UI_STATES.VICTORY, { winner: 'player', battleState: this.battleState });
        } else {
          this.notifyState(BATTLE_UI_STATES.DEFEAT, { winner: 'enemy', battleState: this.battleState });
        }
        return;
      }

      if (status === 'AWAITING_REPLACEMENT') {
        const playerActive = this.battleState.player.team[this.battleState.player.activeIndex];
        const enemyActive = this.battleState.enemy.team[this.battleState.enemy.activeIndex];

        if (playerActive.currentHp === 0) {
          // Jogador precisa escolher substituto
          this.notifyState(BATTLE_UI_STATES.AWAITING_PLAYER_REPLACEMENT, { battleState: this.battleState });
          return;
        }

        if (enemyActive.currentHp === 0) {
          // Inimigo precisa de substituto (automático via SMART AI)
          await this.handleEnemyReplacement();
          return;
        }
      }

      this.notifyState(BATTLE_UI_STATES.AWAITING_PLAYER_ACTION, { battleState: this.battleState });
    }

    /**
     * Trata substituição forçada automática da IA adversária.
     * @private
     */
    async handleEnemyReplacement() {
      const aiRepl = this.ai.chooseReplacement(this.battleState, 'enemy', { strategy: 'SMART' });
      const replResult = this.engine.resolveReplacement(this.battleState, {
        enemy: { targetPokemonId: aiRepl.targetPokemonId }
      });
      this.battleState = replResult.state;

      if (this.presentationEngine && replResult.events && replResult.events.length > 0) {
        await this.presentationEngine.play(replResult.events, { battleState: this.battleState });
      }

      await this.handlePostResolutionState();
    }

    /**
     * Inicia uma nova partida (Rematch) gerando um novo estado com HP e PP 100% restaurados.
     */
    async rematch() {
      this.leaveBattle();
      return this.prepareBattle().then(() => this.startBattle());
    }

    /**
     * Cancela recursos ativos e reseta o controlador ao sair da aba ou reiniciar.
     */
    leaveBattle() {
      this.isResolving = false;
      if (this.presentationEngine && typeof this.presentationEngine.cancel === 'function') {
        this.presentationEngine.cancel();
        this.presentationEngine.reset();
      }
      if (this.compositeAdapter && typeof this.compositeAdapter.cancel === 'function') {
        this.compositeAdapter.cancel();
        this.compositeAdapter.reset();
      }
      this.battleState = null;
      this.uiState = BATTLE_UI_STATES.NO_TEAM;
    }
  }

  const exportsObj = {
    BattleSessionController,
    createBattleSessionController: (opts) => new BattleSessionController(opts)
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exportsObj;
  } else if (typeof window !== 'undefined') {
    window.PBABattleSession = window.PBABattleSession || {};
    Object.assign(window.PBABattleSession, exportsObj);
  }
})();
