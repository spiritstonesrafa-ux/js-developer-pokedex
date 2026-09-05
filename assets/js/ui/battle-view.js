/**
 * ====================================================================
 * VIEW DA ARENA DE BATALHA: (battle-view.js)
 * ====================================================================
 * Componente de interface responsável por renderizar todos os estados visuais
 * da aba Batalhar (PBA-013).
 *
 * Princípios:
 * - UI_DAMAGE_CALCULATION = 0
 * - UI_TYPE_CALCULATION = 0
 * - UI_WINNER_CALCULATION = 0
 * - UI_HP_MUTATION = 0
 * - UI_PP_MUTATION = 0
 * - DOUBLE_SUBMIT = NO
 * - Totalmente acessível e responsivo.
 *
 * Suporta Node.js (CommonJS) e Navegadores (window.PBABattleUi).
 */

(function () {
  class BattleView {
    /**
     * @param {Object} [options]
     * @param {HTMLElement|string} [options.container] - Elemento ou seletor do container da view.
     * @param {Object} [options.sessionController] - Instância de BattleSessionController.
     */
    constructor(options = {}) {
      this.container = typeof options.container === 'string'
        ? (typeof document !== 'undefined' ? document.querySelector(options.container) : null)
        : (options.container || (typeof document !== 'undefined' ? document.getElementById('futureModuleView') : null));
      this.sessionController = options.sessionController || (typeof window !== 'undefined' ? window.battleSessionController : null);
      this.isSwitchModalOpen = false;
      this.isReplacementModalOpen = false;
      this.isMuted = false;
      this.activeModal = null;
    }

    init() {
      if (!this.container && typeof document !== 'undefined') {
        this.container = document.getElementById('futureModuleView');
      }
      if (this.sessionController) {
        this.sessionController.setView(this);
      }
    }

    render() {
      this.init();
      if (this.sessionController) {
        this.sessionController.checkTeamAndInit();
      }
    }

    /**
     * Renderiza o estado atual solicitado pelo controlador de sessão.
     * @param {string} state - Um dos valores de BATTLE_UI_STATES.
     * @param {Object} [data] - Dados adicionais de contexto.
     * @param {Object} [battleState] - Estado canônico da batalha.
     */
    renderState(state, data = {}, battleState = null) {
      if (!this.container) return;

      switch (state) {
        case 'NO_TEAM':
          this.renderNoTeamView(data);
          break;
        case 'READY':
          this.renderReadyView(data);
          break;
        case 'PREPARING':
          this.renderPreparingView();
          break;
        case 'BATTLE':
        case 'AWAITING_PLAYER_ACTION':
        case 'RESOLVING':
          this.renderActiveBattleView(battleState, state);
          break;
        case 'AWAITING_PLAYER_REPLACEMENT':
          this.renderActiveBattleView(battleState, state);
          this.openReplacementModal(battleState);
          break;
        case 'VICTORY':
        case 'DEFEAT':
          this.renderResultView(state, data, battleState);
          break;
        case 'ERROR':
          this.renderErrorView(data);
          break;
      }
    }

    /**
     * Estado: Time incompleto (< 3 Pokémon).
     */
    renderNoTeamView(data = {}) {
      const teamSize = data.teamSize !== undefined ? data.teamSize : 0;
      this.container.innerHTML = `
        <div class="battle-view-container">
          <div class="battle-card-panel">
            <div class="battle-panel-icon">
              <i class="fa-solid fa-shield-halved"></i>
            </div>
            <h2 class="battle-panel-title">Monte sua Equipe de Batalha</h2>
            <p class="battle-panel-desc">
              Você possui atualmente <strong>${teamSize}/3 Pokémon</strong> selecionados.
              Para participar da Battle Arena 3x3 é obrigatório ter uma equipe completa com exatamente 3 integrantes.
            </p>
            <button id="btnGoToTeam" class="btn-battle-action-primary" onclick="if(window.switchAppTab) window.switchAppTab('team');">
              <i class="fa-solid fa-users"></i> Ir para Meu Time
            </button>
          </div>
        </div>
      `;
    }

    /**
     * Estado: Equipe completa (3/3) pronta para iniciar o combate.
     */
    renderReadyView(data = {}) {
      const playerTeam = data.playerTeam || (this.sessionController && this.sessionController.playerTeam) || null;
      let playerRosterHtml = '';

      if (playerTeam && Array.isArray(playerTeam)) {
        playerRosterHtml = playerTeam.map((p, idx) => `
          <div class="prebattle-mini-card">
            <img src="${p.photo || p.animatedPhoto}" alt="${p.name}">
            <span>${idx === 0 ? '👑 ' : ''}${p.name}</span>
          </div>
        `).join('');
      } else {
        const teamIds = data.teamIds || (this.sessionController ? this.sessionController.getPlayerTeamIds() : [1, 4, 7]);
        playerRosterHtml = teamIds.map((id, idx) => `
          <div class="prebattle-mini-card">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png" alt="Pokémon #${id}">
            <span>${idx === 0 ? '👑 Líder' : `Slot #${idx + 1}`}</span>
          </div>
        `).join('');
      }

      this.container.innerHTML = `
        <div class="battle-view-container">
          <div class="battle-card-panel">
            <div class="battle-panel-icon" style="background: linear-gradient(135deg, #f59e0b, #ef4444);">
              <i class="fa-solid fa-swords"></i>
            </div>
            <h2 class="battle-panel-title">Battle Arena 3x3</h2>
            <p class="battle-panel-desc">
              Sua equipe está escalada! Enfrente uma equipe adversária equilibrada comandada pela <strong>SMART AI</strong> com cálculos de vantagem tática em tempo real.
            </p>

            <div class="prebattle-matchup-container">
              <div class="prebattle-side-box">
                <div class="prebattle-side-title"><i class="fa-solid fa-user"></i> Sua Equipe</div>
                <div class="prebattle-team-mini-grid">
                  ${playerRosterHtml}
                </div>
              </div>

              <div class="prebattle-vs-badge">VS</div>

              <div class="prebattle-side-box">
                <div class="prebattle-side-title"><i class="fa-solid fa-robot"></i> Adversário (SMART AI)</div>
                <div class="prebattle-team-mini-grid">
                  <div class="prebattle-mini-card">
                    <i class="fa-solid fa-question" style="font-size: 32px; color: #94a3b8; height: 48px; display: flex; align-items: center;"></i>
                    <span>Líder</span>
                  </div>
                  <div class="prebattle-mini-card">
                    <i class="fa-solid fa-question" style="font-size: 32px; color: #94a3b8; height: 48px; display: flex; align-items: center;"></i>
                    <span>Reserva</span>
                  </div>
                  <div class="prebattle-mini-card">
                    <i class="fa-solid fa-question" style="font-size: 32px; color: #94a3b8; height: 48px; display: flex; align-items: center;"></i>
                    <span>Reserva</span>
                  </div>
                </div>
              </div>
            </div>

            <button id="btnStartBattle" class="btn-battle-action-primary" onclick="if(window.battleSessionController) window.battleSessionController.startBattle();">
              <i class="fa-solid fa-play"></i> INICIAR BATALHA
            </button>
          </div>
        </div>
      `;
    }

    /**
     * Estado: Preparando e hidratando equipes da PokéAPI.
     */
    renderPreparingView() {
      this.container.innerHTML = `
        <div class="battle-view-container">
          <div class="battle-card-panel">
            <div class="battle-spinner"></div>
            <h2 class="battle-panel-title">Preparando Batalha...</h2>
            <p class="battle-panel-desc">
              Carregando dados dos Pokémon, selecionando golpes compatíveis e convocando o adversário. Aguarde um instante!
            </p>
          </div>
        </div>
      `;
    }

    /**
     * Estado: Batalha Ativa (Arena de Combate).
     */
    renderActiveBattleView(battleState, uiState) {
      if (!battleState) return;

      const player = battleState.player;
      const enemy = battleState.enemy;

      const playerActive = player.team[player.activeIndex] || player.team[0];
      const enemyActive = enemy.team[enemy.activeIndex] || enemy.team[0];

      const isResolving = uiState === 'RESOLVING';

      // Cores para barras de HP
      const playerHpPct = Math.max(0, Math.min(100, Math.round((playerActive.currentHp / playerActive.maxHp) * 100)));
      const enemyHpPct = Math.max(0, Math.min(100, Math.round((enemyActive.currentHp / enemyActive.maxHp) * 100)));

      const getHpClass = (pct) => pct > 50 ? 'status-healthy' : (pct > 20 ? 'status-warning' : 'status-danger');

      // Botões de golpes do Pokémon ativo do jogador
      const movesHtml = playerActive.moves.map(m => {
        const isZeroPp = m.currentPp === 0;
        const isDisabled = isResolving || isZeroPp;
        const typeColor = `var(--type-${m.type}, #38bdf8)`;

        return `
          <button
            id="moveBtn_${m.id}"
            class="move-action-btn"
            style="--move-accent-color: ${typeColor};"
            ${isDisabled ? 'disabled' : ''}
            onclick="if(window.battleSessionController) window.battleSessionController.submitPlayerMove(${m.id});"
            aria-label="${m.name}, Tipo ${m.type}, Poder ${m.power}, PP ${m.currentPp} de ${m.maxPp}"
          >
            <div class="move-btn-top-row">
              <span class="move-btn-name">${m.name}</span>
              <span class="move-btn-type" style="background: ${typeColor};">${m.type}</span>
            </div>
            <div class="move-btn-bottom-row">
              <span class="move-btn-category">
                <i class="${m.damageClass === 'special' ? 'fa-solid fa-burst' : 'fa-solid fa-fist-raised'}"></i>
                ${m.damageClass} (Pwr ${m.power})
              </span>
              <span id="ppLabel_${m.id}" class="move-btn-pp">PP ${m.currentPp}/${m.maxPp}</span>
            </div>
          </button>
        `;
      }).join('');

      // Status dots da equipe (Jogador e Inimigo)
      const renderDots = (team, activeIdx) => team.map((p, idx) => {
        let status = 'bench';
        if (p.currentHp === 0) status = 'fainted';
        else if (idx === activeIdx) status = 'active';
        return `<span class="team-dot ${status}" title="${p.name} (${status})"></span>`;
      }).join('');

      this.container.innerHTML = `
        <div class="battle-view-container">
          <div class="battle-arena-layout">
            <!-- Barra Superior com Utilitários -->
            <div class="battle-top-bar">
              <div class="team-status-dots" id="playerTeamDots" title="Status da sua equipe">
                <i class="fa-solid fa-user" style="font-size: 0.8rem; color: #94a3b8; margin-right: 4px;"></i>
                ${renderDots(player.team, player.activeIndex)}
              </div>
              <span id="turnIndicator" class="battle-turn-tag">Turno ${battleState.turn}</span>
              <div class="team-status-dots" id="enemyTeamDots" title="Status da equipe adversária">
                ${renderDots(enemy.team, enemy.activeIndex)}
                <i class="fa-solid fa-robot" style="font-size: 0.8rem; color: #94a3b8; margin-left: 4px;"></i>
              </div>
            </div>

            <!-- HUD do Pokémon Adversário -->
            <div class="combatant-hud enemy-hud">
              <div class="hud-info-row">
                <span id="enemyPokemonName" class="hud-pokemon-name">${enemyActive.name}</span>
                <div id="enemyPokemonTypes" class="hud-pokemon-types">
                  ${enemyActive.types.map(t => `<span class="hud-type-badge" style="background: var(--type-${t}, #64748b);">${t}</span>`).join('')}
                </div>
              </div>
              <div class="hp-track">
                <div
                  id="enemyHpFill"
                  class="hp-fill ${getHpClass(enemyHpPct)}"
                  style="width: ${enemyHpPct}%;"
                  role="progressbar"
                  aria-valuemin="0"
                  aria-valuemax="${enemyActive.maxHp}"
                  aria-valuenow="${enemyActive.currentHp}"
                  aria-label="HP de ${enemyActive.name}"
                ></div>
              </div>
              <div class="hp-values-row">
                <span>HP</span>
                <span id="enemyHpText">${enemyActive.currentHp} / ${enemyActive.maxHp}</span>
              </div>
            </div>

            <!-- Palco de Batalha e Câmera Isolada -->
            <div class="battle-camera-wrapper" data-battle-camera id="battleCameraWrapper">
              <div class="battle-stage" data-battle-stage id="battleStage">
                <div class="stage-ground-platform"></div>

                <!-- Slot do Pokémon do Jogador -->
                <div class="combatant-slot player-slot" data-pokemon-target="player" id="playerCombatantTarget">
                  <img
                    id="playerSpriteImg"
                    class="combatant-sprite-img ${playerActive.currentHp === 0 ? 'fainted' : ''}"
                    src="${playerActive.animatedPhoto || playerActive.photo}"
                    alt="${playerActive.name}"
                  >
                </div>

                <!-- Slot do Pokémon Adversário -->
                <div class="combatant-slot enemy-slot" data-pokemon-target="enemy" id="enemyCombatantTarget">
                  <img
                    id="enemySpriteImg"
                    class="combatant-sprite-img ${enemyActive.currentHp === 0 ? 'fainted' : ''}"
                    src="${enemyActive.animatedPhoto || enemyActive.photo}"
                    alt="${enemyActive.name}"
                  >
                </div>

                <!-- Camada de VFX e Flash Overlay da Câmera -->
                <div class="battle-vfx-container" data-vfx-container id="battleVfxContainer"></div>
                <div class="hit-flash-overlay" data-camera-flash id="battleHitFlash"></div>
              </div>
            </div>

            <!-- HUD do Pokémon do Jogador -->
            <div class="combatant-hud player-hud">
              <div class="hud-info-row">
                <span id="playerPokemonName" class="hud-pokemon-name">${playerActive.name}</span>
                <div id="playerPokemonTypes" class="hud-pokemon-types">
                  ${playerActive.types.map(t => `<span class="hud-type-badge" style="background: var(--type-${t}, #64748b);">${t}</span>`).join('')}
                </div>
              </div>
              <div class="hp-track">
                <div
                  id="playerHpFill"
                  class="hp-fill ${getHpClass(playerHpPct)}"
                  style="width: ${playerHpPct}%;"
                  role="progressbar"
                  aria-valuemin="0"
                  aria-valuemax="${playerActive.maxHp}"
                  aria-valuenow="${playerActive.currentHp}"
                  aria-label="HP de ${playerActive.name}"
                ></div>
              </div>
              <div class="hp-values-row">
                <span>HP</span>
                <span id="playerHpText">${playerActive.currentHp} / ${playerActive.maxHp}</span>
              </div>
            </div>

            <!-- Caixa de Narrativa / Mensagens de Batalha -->
            <div id="battleNarrativeBox" class="battle-narrative-box" aria-live="polite">
              O que ${playerActive.name} deve fazer?
            </div>

            <!-- Painel de Ação do Jogador -->
            <div class="battle-action-panel">
              <div class="action-controls-row">
                <button
                  id="btnOpenSwitch"
                  class="btn-switch-action"
                  ${isResolving ? 'disabled' : ''}
                  onclick="if(window.battleView) window.battleView.openSwitchModal();"
                >
                  <i class="fa-solid fa-repeat"></i> TROCAR POKÉMON
                </button>
              </div>

              <div class="moves-action-grid" id="movesGrid">
                ${movesHtml}
              </div>
            </div>
          </div>
        </div>
      `;

      // Sincroniza alvos DOM com os registros dos subsistemas (Animation, VFX, Camera)
      this.syncRegistries();
    }

    /**
     * Sincroniza referências do DOM da arena ativa com os controladores de animação, VFX e câmera.
     */
    syncRegistries() {
      if (typeof document === 'undefined') return;

      const playerTarget = document.getElementById('playerCombatantTarget');
      const enemyTarget = document.getElementById('enemyCombatantTarget');
      const playerImg = document.getElementById('playerSpriteImg');
      const enemyImg = document.getElementById('enemySpriteImg');
      const cameraWrapper = document.getElementById('battleCameraWrapper');
      const stage = document.getElementById('battleStage');
      const flashOverlay = document.getElementById('battleHitFlash');

      const compositeAdapter = this.sessionController && this.sessionController.compositeAdapter;

      if (compositeAdapter) {
        // 1. Registro de Animação
        if (compositeAdapter.pokemonController && compositeAdapter.pokemonController.registry) {
          const animReg = compositeAdapter.pokemonController.registry;
          if (playerTarget && playerImg) animReg.register('player', { container: playerTarget, sprite: playerImg });
          if (enemyTarget && enemyImg) animReg.register('enemy', { container: enemyTarget, sprite: enemyImg });
        }

        // 2. Registro de VFX
        if (compositeAdapter.vfxController && compositeAdapter.vfxController.registry) {
          const vfxReg = compositeAdapter.vfxController.registry;
          if (stage && typeof vfxReg.registerStage === 'function') vfxReg.registerStage(stage);
          if (playerTarget && typeof vfxReg.registerTarget === 'function') vfxReg.registerTarget('player', playerTarget);
          if (enemyTarget && typeof vfxReg.registerTarget === 'function') vfxReg.registerTarget('enemy', enemyTarget);
        }

        // 3. Registro de Câmera
        if (compositeAdapter.cameraController && compositeAdapter.cameraController.registry) {
          const camReg = compositeAdapter.cameraController.registry;
          if (cameraWrapper && typeof camReg.registerCamera === 'function') camReg.registerCamera(cameraWrapper);
          if (stage && typeof camReg.registerStage === 'function') camReg.registerStage(stage);
          if (flashOverlay && typeof camReg.registerFlashOverlay === 'function') camReg.registerFlashOverlay(flashOverlay);
        }
      }
    }

    /**
     * Abre o modal de troca voluntária de Pokémon.
     */
    openSwitchModal() {
      const battleState = this.sessionController ? this.sessionController.battleState : null;
      if (!battleState) return;

      const player = battleState.player;
      const activeIdx = player.activeIndex;

      const itemsHtml = player.team.map((p, idx) => {
        const isActive = idx === activeIdx;
        const isFainted = p.currentHp === 0;
        const isDisabled = isActive || isFainted;

        let badge = '';
        if (isActive) badge = '<span class="switch-item-status-tag active">EM CAMPO</span>';
        else if (isFainted) badge = '<span class="switch-item-status-tag fainted">NOCAUTEADO</span>';

        return `
          <button
            class="switch-pokemon-item"
            ${isDisabled ? 'disabled' : ''}
            onclick="if(window.battleView){ window.battleView.closeModal(); } if(window.battleSessionController){ window.battleSessionController.submitPlayerSwitch(${p.id}); }"
          >
            <div class="switch-item-info">
              <img class="switch-item-sprite" src="${p.photo}" alt="${p.name}">
              <div class="switch-item-text">
                <span class="switch-item-name">${p.name}</span>
                <span class="switch-item-hp-bar">HP ${p.currentHp}/${p.maxHp}</span>
              </div>
            </div>
            ${badge}
          </button>
        `;
      }).join('');

      this.renderModal('Trocar Pokémon', itemsHtml, true);
    }

    /**
     * Abre o modal de substituição forçada após nocaute do ativo.
     */
    openReplacementModal(battleState) {
      if (!battleState) return;

      const player = battleState.player;
      const activeIdx = player.activeIndex;

      const livingReserves = player.team
        .map((p, idx) => ({ p, idx }))
        .filter(item => item.idx !== activeIdx && item.p.currentHp > 0);

      const itemsHtml = livingReserves.map(({ p }) => `
        <button
          class="switch-pokemon-item"
          onclick="if(window.battleView){ window.battleView.closeModal(); } if(window.battleSessionController){ window.battleSessionController.submitPlayerReplacement(${p.id}); }"
        >
          <div class="switch-item-info">
            <img class="switch-item-sprite" src="${p.photo}" alt="${p.name}">
            <div class="switch-item-text">
              <span class="switch-item-name">${p.name}</span>
              <span class="switch-item-hp-bar">HP ${p.currentHp}/${p.maxHp}</span>
            </div>
          </div>
          <span class="switch-item-status-tag" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8;">ESCOLHER</span>
        </button>
      `).join('');

      this.renderModal('Escolha o Substituto!', itemsHtml, false);
    }

    /**
     * Helper genérico para renderizar modal acessível sobreposto.
     */
    renderModal(title, contentHtml, canClose = true) {
      this.closeModal();

      const modalDiv = document.createElement('div');
      modalDiv.className = 'battle-modal-backdrop';
      modalDiv.id = 'battleActiveModal';

      modalDiv.innerHTML = `
        <div class="battle-modal-card" role="dialog" aria-modal="true" aria-label="${title}">
          <div class="battle-modal-header">
            <h3 class="battle-modal-title">${title}</h3>
            ${canClose ? `
              <button class="battle-modal-close-btn" onclick="if(window.battleView) window.battleView.closeModal();" aria-label="Fechar">
                <i class="fa-solid fa-xmark"></i>
              </button>
            ` : ''}
          </div>
          <div class="switch-pokemon-list">
            ${contentHtml}
          </div>
        </div>
      `;

      document.body.appendChild(modalDiv);
      this.activeModal = modalDiv;

      // Foco automático no primeiro botão interativo
      const firstBtn = modalDiv.querySelector('button:not(:disabled)');
      if (firstBtn) firstBtn.focus();
    }

    closeModal() {
      if (this.activeModal && this.activeModal.parentNode) {
        this.activeModal.parentNode.removeChild(this.activeModal);
        this.activeModal = null;
      }
    }

    /**
     * Renderiza tela final de resultado (Vitória ou Derrota).
     */
    renderResultView(state, data = {}, battleState = null) {
      const isVictory = state === 'VICTORY';
      const title = isVictory ? 'VITÓRIA!' : 'DERROTA!';
      const badgeClass = isVictory ? 'victory' : 'defeat';
      const icon = isVictory ? 'fa-trophy' : 'fa-heart-crack';

      this.closeModal();

      this.container.innerHTML = `
        <div class="battle-view-container">
          <div class="battle-card-panel battle-result-card">
            <div class="battle-panel-icon" style="background: ${isVictory ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #b91c1c)'};">
              <i class="fa-solid ${icon}"></i>
            </div>
            <div class="battle-result-badge ${badgeClass}">${title}</div>
            <p class="battle-panel-desc">
              ${isVictory
                ? 'Parabéns, Treinador! Sua equipe derrotou todos os Pokémon adversários com maestria técnica.'
                : 'Sua equipe foi totalmente derrotada desta vez. Reveja sua estratégia de tipos e tente novamente!'}
            </p>

            <div class="battle-result-buttons-row">
              <button id="btnRematch" class="btn-battle-action-primary" onclick="if(window.battleSessionController) window.battleSessionController.rematch();">
                <i class="fa-solid fa-rotate-right"></i> Jogar Novamente
              </button>
              <button id="btnBackToTeam" class="btn-battle-action-secondary" onclick="if(window.switchAppTab) window.switchAppTab('team');">
                <i class="fa-solid fa-users"></i> Voltar para Meu Time
              </button>
            </div>
          </div>
        </div>
      `;
    }

    /**
     * Renderiza tela de erro com recuperação.
     */
    renderErrorView(data = {}) {
      this.container.innerHTML = `
        <div class="battle-view-container">
          <div class="battle-card-panel">
            <div class="battle-panel-icon" style="background: #ef4444;">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h2 class="battle-panel-title">Falha na Preparação</h2>
            <p class="battle-panel-desc">
              ${data.error || 'Não foi possível preparar os dados da batalha. Verifique sua conexão e tente novamente.'}
            </p>
            <button class="btn-battle-action-primary" onclick="if(window.battleSessionController) window.battleSessionController.startBattle();">
              <i class="fa-solid fa-rotate"></i> Tentar Novamente
            </button>
          </div>
        </div>
      `;
    }

    // ====================================================================
    // MÉTODOS DE ATUALIZAÇÃO DINÂMICA VIA BATTLE-UI-ADAPTER
    // ====================================================================

    updateTurnIndicator(turnNumber) {
      if (typeof document === 'undefined') return;
      const el = document.getElementById('turnIndicator');
      if (el) el.textContent = `Turno ${turnNumber}`;
    }

    displayMessage(msg) {
      if (typeof document === 'undefined') return;
      const el = document.getElementById('battleNarrativeBox');
      if (el) el.textContent = msg;
    }

    updateMovePp(moveId, currentPp, maxPp) {
      if (typeof document === 'undefined') return;
      const btn = document.getElementById(`moveBtn_${moveId}`);
      const label = document.getElementById(`ppLabel_${moveId}`);
      if (label) label.textContent = `PP ${currentPp}/${maxPp}`;
      if (btn && currentPp === 0) {
        btn.disabled = true;
      }
    }

    async updateHpBar(target, currentHp, previousHp, maxHp) {
      if (typeof document === 'undefined') return;

      const fill = document.getElementById(`${target}HpFill`);
      const text = document.getElementById(`${target}HpText`);
      if (!fill) return;

      const pct = Math.max(0, Math.min(100, Math.round((currentHp / maxHp) * 100)));
      fill.style.width = `${pct}%`;
      fill.setAttribute('aria-valuenow', currentHp);

      fill.classList.remove('status-healthy', 'status-warning', 'status-danger');
      if (pct > 50) fill.classList.add('status-healthy');
      else if (pct > 20) fill.classList.add('status-warning');
      else fill.classList.add('status-danger');

      if (text) {
        text.textContent = `${currentHp} / ${maxHp}`;
      }

      // Pequena pausa para a animação da barra de HP acompanhar a timeline
      return new Promise(resolve => setTimeout(resolve, 250));
    }

    handleFaint(target, pokemonId, pokemonName) {
      if (typeof document === 'undefined') return;

      const sprite = document.getElementById(`${target}SpriteImg`);
      if (sprite) sprite.classList.add('fainted');

      // Atualiza os dots da equipe
      const dotsContainer = document.getElementById(`${target}TeamDots`);
      if (dotsContainer) {
        const activeDot = dotsContainer.querySelector('.team-dot.active');
        if (activeDot) {
          activeDot.classList.remove('active');
          activeDot.classList.add('fainted');
        }
      }
    }

    handleSwitchIn(side, pokemonId, pokemonName) {
      // Re-sincroniza a arena inteira com o novo Pokémon ativo
      if (this.sessionController && this.sessionController.battleState) {
        this.renderActiveBattleView(this.sessionController.battleState, this.sessionController.uiState);
      }
    }

    showBattleResult(winner, reason) {
      const state = winner === 'player' ? 'VICTORY' : 'DEFEAT';
      this.renderResultView(state, { winner, reason });
    }
  }

  const exportsObj = {
    BattleView,
    createBattleView: (opts) => new BattleView(opts)
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exportsObj;
  } else if (typeof window !== 'undefined') {
    window.PBABattleUi = window.PBABattleUi || {};
    Object.assign(window.PBABattleUi, exportsObj);
  }
})();
