/**
 * ====================================================================
 * INTERFACE DO PERFIL DO TREINADOR: TRAINER UI (trainer-ui.js)
 * ====================================================================
 * Renderiza o passaporte do treinador, vitrine do companheiro, estatísticas,
 * time ativo e histórico das últimas batalhas.
 */

(function(root) {
  'use strict';

  class TrainerUI {
    constructor(manager = (typeof root !== 'undefined' ? root.trainerManager : null), teamMgr = (typeof root !== 'undefined' ? root.teamManager : null)) {
      this.manager = manager;
      this.teamMgr = teamMgr;
      this.containerId = 'profileView';
      this.initialized = false;
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
          // Atualiza o time atual se a aba de perfil estiver visível
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

      const name = this.manager.getName();
      const tag = this.manager.getTag();
      const companion = this.manager.getCompanion();
      const stats = this.manager.getStats();
      const recentBattles = this.manager.getRecentBattles(10);

      container.innerHTML = `
        <div class="profile-container">
          <!-- 1. CARTÃO PRINCIPAL DO TREINADOR -->
          <section class="trainer-card" aria-label="Cartão de Treinador">
            <div class="trainer-header">
              <div class="trainer-avatar-wrapper">
                <i class="fa-solid fa-user-astronaut trainer-avatar-icon"></i>
              </div>
              <div class="trainer-identity">
                <div class="trainer-name-row">
                  <h2 class="trainer-name">${this.escapeHtml(name)}</h2>
                  <span class="trainer-tag-badge">Trainer ${this.escapeHtml(tag)}</span>
                  <button class="trainer-edit-btn" id="editTrainerNameBtn" title="Editar Nome" aria-label="Editar Nome">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                </div>
                <p class="trainer-title-desc">
                  <i class="fa-solid fa-medal" style="color: #ecc94b;"></i> Treinador Pokémon da Arena Pro
                </p>
              </div>
            </div>

            <!-- VITRINE DO POKÉMON COMPANHEIRO -->
            ${this.renderCompanionSection(companion)}
          </section>

          <!-- 2. GRID DE ESTATÍSTICAS DE CARREIRA -->
          <section class="stats-section" aria-label="Estatísticas de Combate">
            <h3 class="section-heading">
              <i class="fa-solid fa-chart-column" style="color: #6390f0;"></i> Estatísticas de Carreira
            </h3>
            <div class="stats-grid">
              <div class="stat-box">
                <i class="fa-solid fa-khanda stat-icon battles"></i>
                <div class="stat-value">${stats.totalBattles}</div>
                <div class="stat-label">Batalhas</div>
              </div>
              <div class="stat-box">
                <i class="fa-solid fa-trophy stat-icon victories"></i>
                <div class="stat-value">${stats.victories}</div>
                <div class="stat-label">Vitórias</div>
              </div>
              <div class="stat-box">
                <i class="fa-solid fa-shield-xmark stat-icon defeats"></i>
                <div class="stat-value">${stats.defeats}</div>
                <div class="stat-label">Derrotas</div>
              </div>
              <div class="stat-box">
                <i class="fa-solid fa-chart-pie stat-icon winrate"></i>
                <div class="stat-value">${stats.winRateFormatted}</div>
                <div class="stat-label">Taxa de Vitórias</div>
              </div>
              <div class="stat-box">
                <i class="fa-solid fa-fire-flame-curved stat-icon streak"></i>
                <div class="stat-value">${stats.currentStreak}</div>
                <div class="stat-label">Vitórias Seguidas</div>
              </div>
              <div class="stat-box">
                <i class="fa-solid fa-crown stat-icon best-streak"></i>
                <div class="stat-value">${stats.bestStreak}</div>
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
            ${this.renderTeamPreview()}
          </section>

          <!-- 4. ÚLTIMAS BATALHAS -->
          <section class="battles-history-container" aria-label="Histórico de Batalhas">
            <h3 class="section-heading">
              <i class="fa-solid fa-clock-rotate-left" style="color: #ed8936;"></i> Últimas Batalhas
            </h3>
            ${this.renderRecentBattles(recentBattles)}
          </section>
        </div>
      `;

      this.attachEventListeners();
    }

    /**
     * Renderiza o box do Pokémon Companheiro.
     * @private
     */
    renderCompanionSection(companion) {
      if (!companion) {
        return `
          <div class="companion-card">
            <div class="companion-info">
              <div class="companion-details">
                <div class="companion-label"><i class="fa-solid fa-heart"></i> Pokémon Companheiro</div>
                <h3>Nenhum companheiro selecionado</h3>
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
    renderTeamPreview() {
      const teamIds = this.teamMgr ? this.teamMgr.getTeamIds() : [];

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
     * Renderiza a lista de últimas batalhas.
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

      const itemsHtml = battles.map(b => {
        const isWin = b.result === 'VICTORY';
        const badgeClass = isWin ? 'victory' : 'defeat';
        const icon = isWin ? 'fa-trophy' : 'fa-skull';
        const label = isWin ? 'Vitória' : 'Derrota';
        const turnsText = `· ${b.turns || 1} ${b.turns === 1 ? 'turno' : 'turnos'}`;
        const dateText = b.date || 'Recente';
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
     * Vincula listeners interativos (edição de nome e troca de companheiro).
     * @private
     */
    attachEventListeners() {
      const editBtn = document.getElementById('editTrainerNameBtn');
      if (editBtn) {
        editBtn.addEventListener('click', () => {
          const current = this.manager.getName();
          const newName = window.prompt('Digite seu novo nome de Treinador:', current);
          if (newName && newName.trim()) {
            this.manager.setName(newName.trim());
          }
        });
      }

      const companionBtn = document.getElementById('changeCompanionBtn') || document.getElementById('selectCompanionBtn');
      if (companionBtn) {
        companionBtn.addEventListener('click', () => {
          this.promptCompanionSelection();
        });
      }
    }

    /**
     * Apresenta diálogo/opções para selecionar Pokémon Companheiro.
     * @private
     */
    promptCompanionSelection() {
      // Se houver time, lista os Pokémon do time como opções imediatas
      const teamIds = this.teamMgr ? this.teamMgr.getTeamIds() : [];
      let promptMsg = 'Escolha o ID do seu Pokémon Companheiro:\n';
      
      if (teamIds.length > 0) {
        promptMsg += 'Integrantes do seu time ativo:\n';
        teamIds.forEach(id => {
          const mon = window.allLoadedPokemons ? window.allLoadedPokemons.find(p => p.number === id) : null;
          promptMsg += `- ID ${id}: ${mon ? mon.name : 'Pokémon'}\n`;
        });
      }
      promptMsg += '\nOu digite qualquer número de Pokédex (ex: 6 para Charizard, 25 para Pikachu):';

      const input = window.prompt(promptMsg, '6');
      if (!input) return;

      const monId = parseInt(input, 10);
      if (isNaN(monId) || monId <= 0 || monId > 1025) {
        alert('Número de Pokémon inválido. Digite um número de 1 a 1025.');
        return;
      }

      // Tenta encontrar em cache ou buscar
      const cached = window.allLoadedPokemons ? window.allLoadedPokemons.find(p => p.number === monId) : null;
      if (cached) {
        this.manager.setCompanion(cached);
      } else {
        // Cria estrutura básica e atualiza
        this.manager.setCompanion({
          number: monId,
          name: `pokemon-${monId}`,
          types: ['normal']
        });

        // Se pokeApi estiver disponível, enriquece em segundo plano
        if (typeof window.pokeApi !== 'undefined' && typeof window.pokeApi.getPokemonById === 'function') {
          window.pokeApi.getPokemonById(monId).then(fullMon => {
            if (fullMon) {
              this.manager.setCompanion(fullMon);
            }
          }).catch(() => {});
        }
      }
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
