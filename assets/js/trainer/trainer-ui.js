/**
 * ====================================================================
 * INTERFACE DO PERFIL DO TREINADOR: TRAINER UI (trainer-ui.js)
 * ====================================================================
 * Renderiza o passaporte do treinador com presets de avatar dinâmicos,
 * modal de edição com validação de 2..24 caracteres, vitrine de companheiro,
 * grid de estatísticas com zero-state, time ativo e histórico.
 */

(function(root) {
  'use strict';

  class TrainerUI {
    constructor(manager = (typeof root !== 'undefined' ? root.trainerManager : null), teamMgr = (typeof root !== 'undefined' ? root.teamManager : null)) {
      this.manager = manager;
      this.teamMgr = teamMgr;
      this.containerId = 'profileView';
      this.initialized = false;
      this.selectedPresetTemp = null;
    }

    /**
     * Inicializa observadores e sincronização com o DOM.
     */
    init() {
      if (this.initialized) return;

      if (!this.manager && typeof root !== 'undefined' && root.trainerManager) {
        this.manager = root.trainerManager;
      }
      if (!this.teamMgr && typeof root !== 'undefined' && root.teamManager) {
        this.teamMgr = root.teamManager;
      }

      if (this.manager) {
        this.manager.onChange(() => {
          this.render();
        });
      }

      if (this.teamMgr) {
        this.teamMgr.onChange(() => {
          if (this.manager) {
            this.manager.validateCompanionAgainstTeam(this.teamMgr.getTeamIds());
          }
          const container = document.getElementById(this.containerId);
          if (container && container.style.display !== 'none') {
            this.render();
          }
        });
      }

      this.initialized = true;
    }

    /**
     * Renderiza o painel completo do perfil.
     */
    render() {
      if (typeof document === 'undefined') return;

      const container = document.getElementById(this.containerId);
      if (!container) return;

      if (!this.manager && typeof root !== 'undefined' && root.trainerManager) {
        this.manager = root.trainerManager;
      }

      if (!this.manager) {
        container.innerHTML = '<div class="profile-container"><p>Carregando perfil do treinador...</p></div>';
        return;
      }

      const teamIds = this.teamMgr ? this.teamMgr.getTeamIds() : [];
      this.manager.validateCompanionAgainstTeam(teamIds);

      const displayName = this.manager.getDisplayName();
      const tag = this.manager.getTag();
      const companion = this.manager.getCompanion();
      const stats = this.manager.getStats();
      const recentBattles = this.manager.getRecentBattles(10);
      const avatarDetails = this.manager.getAvatarDetails ? this.manager.getAvatarDetails() : {
        icon: 'fa-solid fa-user-astronaut',
        gradient: 'linear-gradient(135deg, #ee1515, #ff6b6b)',
        borderColor: '#ffffff',
        glowColor: 'rgba(238, 21, 21, 0.4)'
      };

      container.innerHTML = `
        <div class="profile-container">
          <!-- 1. CARTÃO PRINCIPAL DO TREINADOR -->
          <section class="trainer-card" aria-label="Cartão de Treinador">
            <div class="trainer-header">
              <div class="trainer-avatar-wrapper" id="avatarWrapperClickable" style="background: ${avatarDetails.gradient}; border-color: ${avatarDetails.borderColor}; box-shadow: 0 8px 24px ${avatarDetails.glowColor}; cursor: pointer;" title="Clique para trocar de avatar">
                <i class="${avatarDetails.icon} trainer-avatar-icon"></i>
              </div>
              <div class="trainer-identity">
                <div class="trainer-name-row">
                  <h2 class="trainer-name">${this.escapeHtml(displayName)}</h2>
                  <span class="trainer-tag-badge">Trainer ${this.escapeHtml(tag)}</span>
                  <button class="trainer-edit-btn" id="editTrainerNameBtn" title="Editar Perfil (Nome e Avatar)" aria-label="Editar Perfil">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                </div>
                <p class="trainer-title-desc">
                  <i class="fa-solid fa-medal" style="color: #ecc94b;"></i> Treinador Pokémon da Arena Pro
                </p>
              </div>
            </div>

            <!-- VITRINE DO POKÉMON COMPANHEIRO -->
            ${this.renderCompanionSection(companion, teamIds)}
          </section>

          <!-- 2. GRID DE ESTATÍSTICAS DE CARREIRA -->
          <section class="stats-section" aria-label="Estatísticas de Combate">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h3 class="section-heading" style="margin: 0;">
                <i class="fa-solid fa-chart-column" style="color: #6390f0;"></i> Estatísticas de Carreira
              </h3>
              <button class="companion-action-btn" id="resetStatsBtn" style="font-size: 0.8rem; padding: 0.4rem 0.8rem; opacity: 0.8;" title="Zerar Estatísticas de Batalha">
                <i class="fa-solid fa-rotate-left"></i> Zerar Stats
              </button>
            </div>
            <div class="stats-grid">
              <div class="stat-box">
                <i class="fa-solid fa-khanda stat-icon battles"></i>
                <div class="stat-value">${stats.battlesPlayed}</div>
                <div class="stat-label">Batalhas</div>
              </div>
              <div class="stat-box">
                <i class="fa-solid fa-trophy stat-icon victories"></i>
                <div class="stat-value">${stats.wins}</div>
                <div class="stat-label">Vitórias</div>
              </div>
              <div class="stat-box">
                <i class="fa-solid fa-shield-xmark stat-icon defeats"></i>
                <div class="stat-value">${stats.losses}</div>
                <div class="stat-label">Derrotas</div>
              </div>
              <div class="stat-box">
                <i class="fa-solid fa-chart-pie stat-icon winrate"></i>
                <div class="stat-value">${stats.winRateFormatted}</div>
                <div class="stat-label">Taxa de Vitórias</div>
              </div>
              <div class="stat-box">
                <i class="fa-solid fa-fire-flame-curved stat-icon streak"></i>
                <div class="stat-value">${stats.currentWinStreak}</div>
                <div class="stat-label">Vitórias Seguidas</div>
              </div>
              <div class="stat-box">
                <i class="fa-solid fa-crown stat-icon best-streak"></i>
                <div class="stat-value">${stats.bestWinStreak}</div>
                <div class="stat-label">Melhor Sequência</div>
              </div>
            </div>
          </section>

          <!-- 3. TIME ATUAL -->
          <section class="team-preview-container" aria-label="Time Atual">
            <div class="team-preview-header">
              <h3 class="section-heading" style="margin: 0;">
                <i class="fa-solid fa-users" style="color: #48bb78;"></i> Time Atual
              </h3>
              <button class="companion-action-btn" onclick="window.switchAppTab && window.switchAppTab('team')">
                <i class="fa-solid fa-arrow-up-right-from-square"></i> Gerenciar Time
              </button>
            </div>
            ${this.renderTeamPreview(teamIds)}
          </section>

          <!-- 4. ÚLTIMAS BATALHAS -->
          <section class="battles-history-container" aria-label="Histórico de Batalhas">
            <h3 class="section-heading">
              <i class="fa-solid fa-clock-rotate-left" style="color: #ed8936;"></i> Últimas Batalhas
            </h3>
            ${this.renderRecentBattles(recentBattles)}
          </section>

          <!-- MODAL DE EDIÇÃO DE PERFIL (Nome e Avatar Presets) -->
          <div id="trainerEditModal" class="trainer-modal-overlay" style="display: none;">
            <div class="trainer-modal-card">
              <div class="trainer-modal-header">
                <h3><i class="fa-solid fa-user-pen"></i> Editar Perfil</h3>
                <button class="trainer-modal-close-btn" id="closeTrainerModalBtn">&times;</button>
              </div>
              <div class="trainer-modal-body">
                <label for="editTrainerNameInput" class="trainer-input-label">Nome de Treinador (2 a 24 caracteres):</label>
                <input type="text" id="editTrainerNameInput" class="trainer-text-input" maxlength="24" minlength="2" value="${this.escapeHtml(displayName)}">
                <div id="nameValidationMsg" style="display: none; color: #ff6b6b; font-size: 0.8rem; margin-top: 4px;"></div>
                
                <label class="trainer-input-label" style="margin-top: 1.25rem;">Escolha seu Avatar:</label>
                <div class="avatar-presets-grid" id="avatarPresetsGrid">
                  ${this.renderAvatarPresets()}
                </div>
              </div>
              <div class="trainer-modal-footer">
                <button class="companion-action-btn" id="cancelEditProfileBtn">Cancelar</button>
                <button class="companion-action-btn" id="saveEditProfileBtn" style="background: #48bb78; border-color: #48bb78; color: #fff;">Salvar Perfil</button>
              </div>
            </div>
          </div>
        </div>
      `;

      this.attachEventListeners();
    }

    /**
     * Renderiza o catálogo de botões de avatar presets.
     * @private
     */
    renderAvatarPresets() {
      const presets = this.manager.getAvatarPresets ? this.manager.getAvatarPresets() : {};
      const activePreset = this.selectedPresetTemp || this.manager.getAvatarPreset();

      return Object.values(presets).map(p => {
        const isActive = p.id === activePreset;
        return `
          <button type="button" class="avatar-preset-btn ${isActive ? 'active' : ''}" data-preset-id="${p.id}" style="background: ${p.gradient}; border-color: ${isActive ? p.borderColor : 'transparent'};" title="${this.escapeHtml(p.label)}">
            <i class="${p.icon}"></i>
          </button>
        `;
      }).join('');
    }

    /**
     * Renderiza o box do Pokémon Companheiro.
     * @private
     */
    renderCompanionSection(companion, teamIds) {
      if (!companion) {
        return `
          <div class="companion-card">
            <div class="companion-info">
              <div class="companion-details">
                <div class="companion-label"><i class="fa-solid fa-heart"></i> Pokémon Companheiro</div>
                <h3>Nenhum Companheiro Selecionado</h3>
                <p style="font-size: 0.85rem; opacity: 0.7; margin: 0.25rem 0 0;">Escolha um integrante do seu time para acompanhar sua jornada.</p>
              </div>
            </div>
            <button class="companion-action-btn" id="selectCompanionBtn">
              <i class="fa-solid fa-plus"></i> Escolher Companheiro
            </button>
          </div>
        `;
      }

      const typesHtml = (companion.types || [companion.type || 'normal'])
        .map(t => `<span class="type-badge" style="background-color: var(--type-${t}, #777); font-size: 0.75rem;">${t}</span>`)
        .join('');

      const imgSrc = companion.animatedPhoto || companion.photo || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${companion.id}.png`;

      return `
        <div class="companion-card">
          <div class="companion-info">
            <div class="companion-sprite-container">
              <img src="${imgSrc}" alt="${this.escapeHtml(companion.name)}" class="companion-sprite" onerror="this.onerror=null; this.src='${companion.photo || ''}';">
            </div>
            <div class="companion-details">
              <div class="companion-label"><i class="fa-solid fa-heart"></i> Pokémon Companheiro</div>
              <h3>${this.escapeHtml(companion.name)} <span style="font-size: 0.9rem; opacity: 0.7;">#${String(companion.id).padStart(3, '0')}</span></h3>
              <div class="companion-types">${typesHtml}</div>
            </div>
          </div>
          <button class="companion-action-btn" id="changeCompanionBtn">
            <i class="fa-solid fa-arrow-rotate-right"></i> Trocar Companheiro
          </button>
        </div>
      `;
    }

    /**
     * Renderiza o grid de membros do time atual.
     * @private
     */
    renderTeamPreview(teamIds) {
      if (!teamIds || teamIds.length === 0) {
        return `
          <div class="team-empty-state">
            <i class="fa-solid fa-shield-halved"></i>
            <p>Seu time de batalha ainda está vazio.</p>
            <button class="companion-action-btn" style="margin-top: 0.5rem;" onclick="window.switchAppTab && window.switchAppTab('team')">
              <i class="fa-solid fa-plus"></i> Montar Equipe
            </button>
          </div>
        `;
      }

      const cardsHtml = teamIds.map((id, index) => {
        const isLead = index === 0;
        const cached = (typeof window !== 'undefined' && window.allLoadedPokemons)
          ? window.allLoadedPokemons.find(p => p.number === id)
          : null;

        const name = cached ? cached.name : `Pokémon #${id}`;
        const imgSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;
        const fallbackSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

        const typesHtml = cached && Array.isArray(cached.types)
          ? cached.types.map(t => `<span class="type-badge" style="font-size: 0.65rem; padding: 2px 6px;">${t}</span>`).join('')
          : '';

        return `
          <div class="team-member-card">
            <span class="team-member-slot-badge ${isLead ? 'lead' : ''}">${isLead ? '★ Líder' : `Slot ${index + 1}`}</span>
            <img src="${imgSrc}" alt="${this.escapeHtml(name)}" class="team-member-sprite" onerror="this.onerror=null; this.src='${fallbackSrc}';">
            <div class="team-member-name">${this.escapeHtml(name)}</div>
            <div style="display: flex; gap: 4px; justify-content: center;">${typesHtml}</div>
          </div>
        `;
      }).join('');

      return `<div class="team-preview-grid">${cardsHtml}</div>`;
    }

    /**
     * Renderiza a lista de últimas batalhas (máximo 10).
     * @private
     */
    renderRecentBattles(battles) {
      if (!battles || battles.length === 0) {
        return `
          <p style="color: var(--text-secondary, rgba(255,255,255,0.7)); text-align: center; padding: 1.5rem 0;">
            Nenhuma batalha registrada ainda. Entre na Arena para iniciar sua jornada!
          </p>
        `;
      }

      const itemsHtml = battles.slice(0, 10).map(b => {
        const isWin = b.result === 'VICTORY' || b.result === 'WIN';
        const badgeClass = isWin ? 'victory' : 'defeat';
        const icon = isWin ? 'fa-trophy' : 'fa-skull';
        const label = isWin ? 'Vitória' : 'Derrota';
        const turnsText = `· ${b.turns || 1} ${b.turns === 1 ? 'turno' : 'turnos'}`;
        const dateText = b.date || 'Hoje';
        const opponentText = b.opponentName ? `vs ${this.escapeHtml(b.opponentName)}` : '';

        return `
          <li class="battle-item">
            <div class="battle-outcome-group">
              <span class="battle-badge ${badgeClass}">
                <i class="fa-solid ${icon}"></i> ${label}
              </span>
              <span class="battle-turns-info">${turnsText}</span>
            </div>
            <div class="battle-meta-info">
              ${opponentText ? `<span>${opponentText} · </span>` : ''}
              <span>${dateText}</span>
            </div>
          </li>
        `;
      }).join('');

      return `<ul class="battles-list">${itemsHtml}</ul>`;
    }

    /**
     * Vincula listeners interativos.
     * @private
     */
    attachEventListeners() {
      const editBtn = document.getElementById('editTrainerNameBtn');
      const avatarWrapper = document.getElementById('avatarWrapperClickable');

      const openModal = () => {
        this.selectedPresetTemp = this.manager.getAvatarPreset();
        const modal = document.getElementById('trainerEditModal');
        if (modal) {
          modal.style.display = 'flex';
          const input = document.getElementById('editTrainerNameInput');
          if (input) {
            input.value = this.manager.getDisplayName();
            input.focus();
          }
          const valMsg = document.getElementById('nameValidationMsg');
          if (valMsg) valMsg.style.display = 'none';
        }
      };

      if (editBtn) editBtn.addEventListener('click', openModal);
      if (avatarWrapper) avatarWrapper.addEventListener('click', openModal);

      const closeModal = () => {
        const modal = document.getElementById('trainerEditModal');
        if (modal) modal.style.display = 'none';
      };

      const closeBtn = document.getElementById('closeTrainerModalBtn');
      const cancelBtn = document.getElementById('cancelEditProfileBtn');
      if (closeBtn) closeBtn.addEventListener('click', closeModal);
      if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

      // Presets de avatar
      const presetButtons = document.querySelectorAll('.avatar-preset-btn');
      presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const presetId = btn.dataset.presetId;
          this.selectedPresetTemp = presetId;
          presetButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        });
      });

      // Salvar Perfil
      const saveBtn = document.getElementById('saveEditProfileBtn');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          const input = document.getElementById('editTrainerNameInput');
          const valMsg = document.getElementById('nameValidationMsg');
          const trimmed = input ? input.value.trim() : '';

          if (trimmed.length < 2 || trimmed.length > 24) {
            if (valMsg) {
              valMsg.textContent = 'O nome deve conter entre 2 e 24 caracteres.';
              valMsg.style.display = 'block';
            }
            if (input) input.focus();
            return;
          }

          this.manager.setDisplayName(trimmed);
          if (this.selectedPresetTemp) {
            this.manager.setAvatarPreset(this.selectedPresetTemp);
          }

          closeModal();
          this.render();
        });
      }

      // Companheiro
      const companionBtn = document.getElementById('changeCompanionBtn') || document.getElementById('selectCompanionBtn');
      if (companionBtn) {
        companionBtn.addEventListener('click', () => {
          this.promptCompanionSelection();
        });
      }

      // Reset
      const resetBtn = document.getElementById('resetStatsBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          const confirmed = window.confirm('Deseja zerar suas estatísticas de batalha? Seu nome, ID e time serão preservados.');
          if (confirmed) {
            this.manager.resetStats();
          }
        });
      }
    }

    /**
     * Apresenta diálogo para selecionar Pokémon Companheiro do time.
     * @private
     */
    promptCompanionSelection() {
      const teamIds = this.teamMgr ? this.teamMgr.getTeamIds() : [];

      if (teamIds.length === 0) {
        alert('Seu time está vazio! Monte seu time primeiro na aba "Meu Time" para escolher um companheiro.');
        return;
      }

      let promptMsg = 'Escolha o número de Pokédex do seu Pokémon Companheiro (integrantes do seu time):\n';
      teamIds.forEach(id => {
        const mon = window.allLoadedPokemons ? window.allLoadedPokemons.find(p => p.number === id) : null;
        promptMsg += `- ID ${id}: ${mon ? mon.name : 'Pokémon'}\n`;
      });

      const input = window.prompt(promptMsg, String(teamIds[0]));
      if (!input) return;

      const monId = parseInt(input, 10);
      if (isNaN(monId) || !teamIds.includes(monId)) {
        alert('O companheiro deve ser um dos Pokémon do seu time ativo.');
        return;
      }

      this.manager.setCompanion(monId);
    }

    /**
     * Sanitização contra XSS.
     * @private
     */
    escapeHtml(str) {
      if (typeof str !== 'string') return '';
      return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag));
    }
  }

  // Exportação isomórfica (Browser & Node.js)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TrainerUI;
  }
  if (typeof root !== 'undefined') {
    root.TrainerUI = TrainerUI;
    if (typeof root.trainerManager !== 'undefined') {
      root.trainerUI = new TrainerUI(root.trainerManager, root.teamManager);
    }
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
