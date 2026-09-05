/**
 * ====================================================================
 * CAMADA DE INTERFACE DO TIME: TEAM UI (team-ui.js)
 * ====================================================================
 * Responsável por renderizar a tela "Meu Time", apresentar os 3 slots
 * (Líder e reservas), botões de reordenação acessíveis, estado vazio,
 * time completo e sincronização de contadores no cabeçalho.
 */

class TeamUI {
  constructor(manager = window.teamManager, api = window.pokeApi) {
    this.manager = manager;
    this.api = api;
    this.container = null;
    this.pokemonCache = new Map(); // Cache local para evitar requisições repetidas
    this.isConfirmingClear = false;
  }

  /**
   * Inicializa a interface do time e escuta eventos de mudança.
   */
  init() {
    this.container = document.getElementById('teamView');
    if (!this.container) return;

    if (this.manager) {
      this.manager.onChange(() => {
        this.updateBadges();
        // Se a tela do time estiver ativa, re-renderiza os slots
        if (this.container && this.container.style.display !== 'none') {
          this.render();
        }
      });
    }

    this.updateBadges();
  }

  /**
   * Atualiza o badge numérico no cabeçalho e na aba de navegação.
   */
  updateBadges() {
    const size = this.manager ? this.manager.getSize() : 0;
    const badge = document.getElementById('teamNavCounter');
    if (badge) {
      badge.textContent = `${size}/3`;
      badge.classList.toggle('team-full', size === 3);
    }
  }

  /**
   * Obtém os dados completos de um Pokémon, reutilizando cache em memória.
   * @param {number} pokemonId
   * @returns {Promise<Pokemon>}
   */
  async getPokemon(pokemonId) {
    const id = Number(pokemonId);
    if (this.pokemonCache.has(id)) {
      return this.pokemonCache.get(id);
    }

    // Tenta encontrar nos Pokémon já carregados globalmente no main.js
    if (window.allLoadedPokemons && Array.isArray(window.allLoadedPokemons)) {
      const found = window.allLoadedPokemons.find(p => p.number === id);
      if (found) {
        this.pokemonCache.set(id, found);
        return found;
      }
    }

    // Busca via PokéAPI caso ainda não esteja em memória
    if (this.api && typeof this.api.getPokemonDetail === 'function') {
      try {
        const p = await this.api.getPokemonDetail(id);
        this.pokemonCache.set(id, p);
        return p;
      } catch (err) {
        console.warn(`Não foi possível carregar dados do Pokémon #${id}:`, err);
        throw err;
      }
    }

    throw new Error('Serviço de API não disponível');
  }

  /**
   * Renderiza a visualização completa do Team Builder.
   */
  async render() {
    if (!this.container) {
      this.container = document.getElementById('teamView');
      if (!this.container) return;
    }

    const teamIds = this.manager ? this.manager.getTeamIds() : [];
    const size = teamIds.length;
    const isFull = size >= 3;

    // Cabeçalho do Team Builder
    let html = `
      <div class="team-container">
        <header class="team-header">
          <div class="team-header-info">
            <div class="team-title-row">
              <h2 class="team-title"><i class="fa-solid fa-users"></i> Meu Time Pokémon</h2>
              <span class="team-counter-pill ${isFull ? 'complete' : ''}">
                ${isFull ? '<i class="fa-solid fa-check"></i> ' : ''}${size}/3 Integrantes
              </span>
            </div>
            <p class="team-subtitle">
              Selecione até 3 Pokémon para a sua equipe. O <strong>Slot 1</strong> atuará como Líder nas batalhas.
            </p>
          </div>

          <div class="team-header-actions">
            ${size > 0 ? `
              ${this.isConfirmingClear ? `
                <div class="clear-confirm-box">
                  <span>Tem certeza?</span>
                  <button class="confirm-btn danger" onclick="teamUI.confirmClear()" aria-label="Confirmar limpeza do time">Sim, limpar</button>
                  <button class="confirm-btn cancel" onclick="teamUI.cancelClear()" aria-label="Cancelar limpeza">Cancelar</button>
                </div>
              ` : `
                <button class="team-action-btn secondary" onclick="teamUI.promptClear()" aria-label="Limpar time atual">
                  <i class="fa-solid fa-trash-can"></i> Limpar Time
                </button>
              `}
            ` : ''}
            <button class="team-action-btn primary" onclick="window.switchAppTab('pokedex')" aria-label="Ir à Pokédex">
              <i class="fa-solid fa-plus"></i> Explorar Pokédex
            </button>
          </div>
        </header>

        <!-- Grid de 3 Slots -->
        <div class="team-slots-grid" id="teamSlotsGrid">
          <div class="team-slot-loading">
            <i class="fa-solid fa-spinner fa-spin"></i> Carregando equipe...
          </div>
        </div>

        <!-- Banner de Status (Vazio ou Completo) -->
        <footer class="team-footer-status">
          ${this.renderStatusBanner(size)}
        </footer>
      </div>
    `;

    this.container.innerHTML = html;

    // Carrega e preenche os 3 slots assincronamente
    await this.fillSlots(teamIds);
  }

  /**
   * Preenche os 3 slots com os cards dos Pokémon ou slots vazios.
   * @param {number[]} teamIds
   */
  async fillSlots(teamIds) {
    const grid = document.getElementById('teamSlotsGrid');
    if (!grid) return;

    const slotsHtml = [];

    for (let slotIndex = 0; slotIndex < 3; slotIndex++) {
      const pokemonId = teamIds[slotIndex];
      const isLead = slotIndex === 0;

      if (pokemonId) {
        try {
          const pokemon = await this.getPokemon(pokemonId);
          slotsHtml.push(this.renderOccupiedSlot(pokemon, slotIndex, teamIds.length, isLead));
        } catch (err) {
          slotsHtml.push(this.renderErrorSlot(pokemonId, slotIndex));
        }
      } else {
        slotsHtml.push(this.renderEmptySlot(slotIndex));
      }
    }

    grid.innerHTML = slotsHtml.join('');
  }

  /**
   * Renderiza um slot ocupado com informações completas e botões de reordenação.
   */
  renderOccupiedSlot(pokemon, slotIndex, totalOccupied, isLead) {
    const primaryType = pokemon.type || (pokemon.types && pokemon.types[0]) || 'normal';
    const primaryColor = window.typeColors ? (window.typeColors[primaryType] || '#777') : '#777';
    const paddedId = `#${String(pokemon.number).padStart(3, '0')}`;

    const typesHtml = (pokemon.types || [primaryType])
      .map(t => `<span class="type-badge" style="background-color: ${window.typeColors ? window.typeColors[t] : '#777'};">${t}</span>`)
      .join('');

    const stats = pokemon.stats || { hp: 0, attack: 0, defense: 0, speed: 0, total: 0 };

    return `
      <div class="team-slot-card occupied ${primaryType}" style="--slot-color: ${primaryColor};">
        <div class="slot-badge-row">
          <span class="slot-position-badge ${isLead ? 'lead' : ''}">
            ${isLead ? '<i class="fa-solid fa-crown"></i> Slot 1 • Líder' : `Slot ${slotIndex + 1}`}
          </span>
          <span class="slot-pokemon-id">${paddedId}</span>
        </div>

        <div class="slot-pokemon-preview" onclick="window.openPokemonDetails(${pokemon.number})" title="Ver detalhes de ${pokemon.name}">
          <div class="slot-img-wrapper">
            <img class="slot-pokemon-img" 
                 src="${pokemon.animatedPhoto || pokemon.photo}" 
                 alt="${pokemon.name}" 
                 loading="lazy"
                 onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.number}.png'">
          </div>
          <h3 class="slot-pokemon-name">${pokemon.name}</h3>
          <div class="slot-types">${typesHtml}</div>
        </div>

        <!-- Atributos Resumidos -->
        <div class="slot-stats-panel">
          <div class="stat-mini-item" title="Pontos de Vida">
            <span class="stat-mini-label">HP</span>
            <span class="stat-mini-val">${stats.hp}</span>
          </div>
          <div class="stat-mini-item" title="Ataque">
            <span class="stat-mini-label">ATK</span>
            <span class="stat-mini-val">${stats.attack}</span>
          </div>
          <div class="stat-mini-item" title="Defesa">
            <span class="stat-mini-label">DEF</span>
            <span class="stat-mini-val">${stats.defense}</span>
          </div>
          <div class="stat-mini-item" title="Velocidade">
            <span class="stat-mini-label">SPD</span>
            <span class="stat-mini-val">${stats.speed}</span>
          </div>
          <div class="stat-mini-item total" title="Total de Atributos">
            <span class="stat-mini-label">TOT</span>
            <span class="stat-mini-val">${stats.total}</span>
          </div>
        </div>

        <!-- Controles de Reordenação e Remoção -->
        <div class="slot-actions-bar">
          <div class="order-actions-group">
            <button class="order-btn" 
                    onclick="teamUI.move(${pokemon.number}, 'left')" 
                    ${slotIndex === 0 ? 'disabled' : ''} 
                    title="Mover para frente (Slot ${slotIndex})"
                    aria-label="Mover ${pokemon.name} para a esquerda">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
            <button class="order-btn" 
                    onclick="teamUI.move(${pokemon.number}, 'right')" 
                    ${slotIndex === totalOccupied - 1 ? 'disabled' : ''} 
                    title="Mover para trás (Slot ${slotIndex + 2})"
                    aria-label="Mover ${pokemon.name} para a direita">
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          <button class="remove-slot-btn" 
                  onclick="teamUI.remove(${pokemon.number})" 
                  title="Remover do time"
                  aria-label="Remover ${pokemon.name} do time">
            <i class="fa-solid fa-xmark"></i> Remover
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Renderiza um slot vazio permitindo navegação para a Pokédex.
   */
  renderEmptySlot(slotIndex) {
    const isLead = slotIndex === 0;

    return `
      <div class="team-slot-card empty" onclick="window.switchAppTab('pokedex')">
        <div class="slot-badge-row">
          <span class="slot-position-badge empty">
            Slot ${slotIndex + 1} ${isLead ? '• Líder' : ''}
          </span>
          <span class="empty-tag">Vago</span>
        </div>

        <div class="empty-slot-content">
          <div class="empty-slot-icon-box">
            <i class="fa-solid fa-plus"></i>
          </div>
          <h4 class="empty-slot-title">Escolher Pokémon</h4>
          <p class="empty-slot-desc">Toque para selecionar um Pokémon da sua Pokédex para este slot.</p>
        </div>

        <button class="empty-slot-btn" onclick="event.stopPropagation(); window.switchAppTab('pokedex')">
          <i class="fa-solid fa-magnifying-glass"></i> Explorar Pokédex
        </button>
      </div>
    `;
  }

  /**
   * Renderiza um slot em caso de falha de conexão com a PokéAPI.
   */
  renderErrorSlot(pokemonId, slotIndex) {
    return `
      <div class="team-slot-card error">
        <div class="slot-badge-row">
          <span class="slot-position-badge error">Slot ${slotIndex + 1}</span>
          <span class="slot-pokemon-id">#${pokemonId}</span>
        </div>
        <div class="empty-slot-content">
          <i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem; color: var(--accent-yellow); margin-bottom: 0.5rem;"></i>
          <h4 class="empty-slot-title">Erro ao carregar</h4>
          <p class="empty-slot-desc">Não foi possível obter dados para o Pokémon #${pokemonId}.</p>
        </div>
        <div class="slot-actions-bar">
          <button class="remove-slot-btn" onclick="teamUI.remove(${pokemonId})">
            <i class="fa-solid fa-trash-can"></i> Remover do Time
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Renderiza o banner de status da equipe.
   */
  renderStatusBanner(size) {
    if (size === 0) {
      return `
        <div class="team-empty-banner">
          <div class="banner-icon"><i class="fa-solid fa-shield-halved"></i></div>
          <div class="banner-text">
            <h3>Monte seu primeiro time Pokémon</h3>
            <p>Escolha até 3 integrantes na Pokédex para compor sua equipe de combate.</p>
          </div>
          <button class="team-action-btn primary" onclick="window.switchAppTab('pokedex')">
            <i class="fa-solid fa-book-open"></i> Explorar Pokédex
          </button>
        </div>
      `;
    }

    if (size === 3) {
      return `
        <div class="team-complete-banner">
          <div class="banner-icon complete"><i class="fa-solid fa-trophy"></i></div>
          <div class="banner-text">
            <h3>🎉 Time Completo (3/3)!</h3>
            <p>Sua equipe está pronta para as futuras batalhas na Battle Arena.</p>
          </div>
          <div class="banner-actions">
            <button class="team-action-btn primary" onclick="if(window.switchAppTab) window.switchAppTab('battle');" title="Ir para a Battle Arena">
              <i class="fa-solid fa-khanda"></i> Batalhar na Arena
            </button>
          </div>
        </div>
      `;
    }

    return `
      <div class="team-progress-banner">
        <i class="fa-solid fa-circle-info"></i>
        <span>Faltam <strong>${3 - size}</strong> integrante(s) para completar seu time de 3 Pokémon.</span>
      </div>
    `;
  }

  /* Ações do Usuário */

  remove(pokemonId) {
    if (this.manager) {
      this.manager.removePokemon(pokemonId);
    }
  }

  move(pokemonId, direction) {
    if (this.manager) {
      this.manager.movePokemon(pokemonId, direction);
    }
  }

  promptClear() {
    this.isConfirmingClear = true;
    this.render();
  }

  cancelClear() {
    this.isConfirmingClear = false;
    this.render();
  }

  confirmClear() {
    this.isConfirmingClear = false;
    if (this.manager) {
      this.manager.clearTeam();
    }
  }
}

// Instância global única para a interface do time
window.teamUI = new TeamUI(window.teamManager, window.pokeApi);
