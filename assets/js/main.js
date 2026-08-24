/**
 * Aplicação Pokédex - Lógica Principal e UI
 */
const pokemonListElement = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const sortSelect = document.getElementById('sortSelect');
const generationSelect = document.getElementById('generationSelect');
const typePills = document.querySelectorAll('.type-pill');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const favoritesToggleBtn = document.getElementById('favoritesToggleBtn');
const favCounterBadge = document.getElementById('favCounter');
const resultCountEl = document.getElementById('resultCount');

// Modal Elements
const pokemonModal = document.getElementById('pokemonModal');
const modalOverlay = document.getElementById('modalOverlay');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalContent = document.getElementById('modalDynamicContent');

// Estado da Aplicação
const limit = 20;
let offset = 0;
let maxLimit = 151; // Padrão Gen 1
let currentPokemons = [];
let allLoadedPokemons = [];
let selectedType = 'all';
let selectedGeneration = '1';
let currentSearchTerm = '';
let currentSort = 'id-asc';
let showingFavoritesOnly = false;
let favoritePokemonIds = JSON.parse(localStorage.getItem('pokedex_favorites') || '[]');

// Mapa de cores por tipo
const typeColors = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD'
};

// Gerações (Offset e Total de Pokémons)
const generationRanges = {
  '1': { offset: 0, max: 151 },
  '2': { offset: 151, max: 251 },
  '3': { offset: 251, max: 386 },
  '4': { offset: 386, max: 493 },
  '5': { offset: 493, max: 649 },
  '6': { offset: 649, max: 721 },
  '7': { offset: 721, max: 809 },
  '8': { offset: 809, max: 905 },
  '9': { offset: 905, max: 1025 },
  'all': { offset: 0, max: 1025 }
};

// Ícone SVG da Pokeball
const pokeballSvg = `
  <svg viewBox="0 0 100 100" fill="currentColor" class="pokemon-card-watermark">
    <path d="M50 0 C22.4 0 0 22.4 0 50 C0 77.6 22.4 100 50 100 C77.6 100 100 77.6 100 50 C100 22.4 77.6 0 50 0 Z M50 8 C70.5 8 87.5 22.7 91.3 42.5 L69.5 42.5 C66.8 33.4 59.2 26.8 50 26.8 C40.8 26.8 33.2 33.4 30.5 42.5 L8.7 42.5 C12.5 22.7 29.5 8 50 8 Z M50 92 C29.5 92 12.5 77.3 8.7 57.5 L30.5 57.5 C33.2 66.6 40.8 73.2 50 73.2 C59.2 73.2 66.8 66.6 69.5 57.5 L91.3 57.5 C87.5 77.3 70.5 92 50 92 Z M50 35 C58.3 35 65 41.7 65 50 C65 58.3 58.3 65 50 65 C41.7 65 35 58.3 35 50 C35 41.7 41.7 35 50 35 Z M50 42.5 C45.9 42.5 42.5 45.9 42.5 50 C42.5 54.1 45.9 57.5 50 57.5 C54.1 57.5 57.5 54.1 57.5 50 C57.5 45.9 54.1 42.5 50 42.5 Z"/>
  </svg>
`;

/**
 * Converte Pokémon para Card HTML
 */
function createPokemonCard(pokemon) {
  const isFav = favoritePokemonIds.includes(pokemon.number);
  const primaryColor = typeColors[pokemon.type] || '#777';
  const paddedId = `#${String(pokemon.number).padStart(3, '0')}`;

  const typesHtml = pokemon.types
    .map(type => `<span class="type-badge" style="background-color: ${typeColors[type] || '#777'};">${type}</span>`)
    .join('');

  return `
    <li class="pokemon-card ${pokemon.type}" 
        data-id="${pokemon.number}" 
        style="--card-color: ${primaryColor}; --card-glow: ${primaryColor}40;"
        onclick="openPokemonDetails(${pokemon.number})">
      
      ${pokeballSvg}

      <div class="card-header">
        <span class="pokemon-id">${paddedId}</span>
        <button class="fav-btn ${isFav ? 'active' : ''}" 
                title="Favoritar" 
                onclick="event.stopPropagation(); toggleFavorite(${pokemon.number});">
          <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        </button>
      </div>

      <h3 class="pokemon-name">${pokemon.name}</h3>

      <div class="card-body">
        <div class="types-list">
          ${typesHtml}
        </div>
        <div class="image-wrapper">
          <img class="pokemon-img" 
               src="${pokemon.photo}" 
               alt="${pokemon.name}" 
               loading="lazy"
               onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.number}.png'">
        </div>
      </div>
    </li>
  `;
}

/**
 * Atualiza o contador de favoritos na UI
 */
function updateFavoriteCounter() {
  favCounterBadge.textContent = favoritePokemonIds.length;
  favCounterBadge.style.display = favoritePokemonIds.length > 0 ? 'inline-block' : 'none';
}

/**
 * Toggle Favorito
 */
window.toggleFavorite = function(pokemonId) {
  const index = favoritePokemonIds.indexOf(pokemonId);
  if (index > -1) {
    favoritePokemonIds.splice(index, 1);
  } else {
    favoritePokemonIds.push(pokemonId);
  }
  localStorage.setItem('pokedex_favorites', JSON.stringify(favoritePokemonIds));
  updateFavoriteCounter();

  // Re-renderizar se estiver no filtro de favoritos
  if (showingFavoritesOnly) {
    applyFiltersAndSort();
  } else {
    // Atualiza botão do card
    const card = document.querySelector(`.pokemon-card[data-id="${pokemonId}"]`);
    if (card) {
      const btn = card.querySelector('.fav-btn');
      const isFav = favoritePokemonIds.includes(pokemonId);
      btn.className = `fav-btn ${isFav ? 'active' : ''}`;
      btn.innerHTML = `<i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>`;
    }
  }
};

/**
 * Carrega lote de Pokémons
 */
function loadPokemonItems(initial = false) {
  if (initial) {
    offset = generationRanges[selectedGeneration].offset;
    maxLimit = generationRanges[selectedGeneration].max;
    allLoadedPokemons = [];
    currentPokemons = [];
    pokemonListElement.innerHTML = createSkeletonsHtml(8);
  }

  loadMoreButton.disabled = true;
  loadMoreButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Carregando...';

  const currentLimit = Math.min(limit, maxLimit - offset);

  if (currentLimit <= 0) {
    loadMoreButton.style.display = 'none';
    return;
  }

  pokeApi.getPokemons(offset, currentLimit)
    .then((newPokemons = []) => {
      if (initial) {
        allLoadedPokemons = newPokemons;
      } else {
        allLoadedPokemons.push(...newPokemons);
      }

      offset += currentLimit;
      applyFiltersAndSort();

      if (offset >= maxLimit || selectedType !== 'all') {
        loadMoreButton.style.display = 'none';
      } else {
        loadMoreButton.style.display = 'flex';
        loadMoreButton.innerHTML = '<span>Carregar Mais</span> <i class="fa-solid fa-chevron-down"></i>';
        loadMoreButton.disabled = false;
      }
    })
    .catch((err) => {
      console.error(err);
      pokemonListElement.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⚠️</div>
          <h3>Erro ao carregar Pokémon</h3>
          <p>Verifique sua conexão e tente novamente.</p>
        </div>
      `;
      loadMoreButton.style.display = 'none';
    });
}

/**
 * Carrega Pokémon por tipo quando selecionado
 */
async function loadPokemonsByType(type) {
  pokemonListElement.innerHTML = createSkeletonsHtml(8);
  loadMoreButton.style.display = 'none';

  try {
    const pokemons = await pokeApi.getPokemonsByType(type, 60);
    allLoadedPokemons = pokemons;
    applyFiltersAndSort();
  } catch (err) {
    console.error(err);
  }
}

/**
 * Aplica Filtros (Busca, Tipo, Favoritos) e Ordenação
 */
function applyFiltersAndSort() {
  let filtered = [...allLoadedPokemons];

  // Filtro de Favoritos
  if (showingFavoritesOnly) {
    filtered = filtered.filter(p => favoritePokemonIds.includes(p.number));
  }

  // Filtro de Tipo (se não for via API direta)
  if (selectedType !== 'all' && !filtered.every(p => p.types.includes(selectedType))) {
    filtered = filtered.filter(p => p.types.includes(selectedType));
  }

  // Filtro de Busca (Nome ou ID)
  if (currentSearchTerm.trim() !== '') {
    const term = currentSearchTerm.toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(term) || 
      String(p.number).includes(term) ||
      `#${p.number}`.includes(term)
    );
  }

  // Ordenação
  switch (currentSort) {
    case 'id-asc':
      filtered.sort((a, b) => a.number - b.number);
      break;
    case 'id-desc':
      filtered.sort((a, b) => b.number - a.number);
      break;
    case 'name-asc':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'stat-desc':
      filtered.sort((a, b) => b.stats.total - a.stats.total);
      break;
  }

  currentPokemons = filtered;
  renderPokemons(filtered);
}

/**
 * Renderiza a lista na DOM
 */
function renderPokemons(pokemons) {
  resultCountEl.textContent = `Mostrando ${pokemons.length} Pokémon`;

  if (pokemons.length === 0) {
    pokemonListElement.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <h3>Nenhum Pokémon encontrado</h3>
        <p>Tente ajustar sua busca ou filtros para encontrar o que procura.</p>
      </div>
    `;
    return;
  }

  pokemonListElement.innerHTML = pokemons.map(createPokemonCard).join('');
}

/**
 * Gera skeletons para carregamento suave
 */
function createSkeletonsHtml(count) {
  return Array.from({ length: count }).map(() => `
    <li class="skeleton-card">
      <div class="skeleton-line" style="width: 35%; height: 16px;"></div>
      <div class="skeleton-line" style="width: 70%; height: 26px; margin: 10px 0;"></div>
      <div style="display: flex; justify-content: space-between; align-items: flex-end;">
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div class="skeleton-line" style="width: 50px; height: 22px; border-radius: 12px;"></div>
          <div class="skeleton-line" style="width: 50px; height: 22px; border-radius: 12px;"></div>
        </div>
        <div class="skeleton-line" style="width: 90px; height: 90px; border-radius: 50%;"></div>
      </div>
    </li>
  `).join('');
}

/**
 * Modal de Detalhes Completo
 */
window.openPokemonDetails = async function(pokemonId) {
  let pokemon = allLoadedPokemons.find(p => p.number === pokemonId);

  // Se não estiver em memória, busca individualmente
  if (!pokemon) {
    try {
      pokemon = await pokeApi.getPokemonDetail(pokemonId);
    } catch (e) {
      return;
    }
  }

  const primaryColor = typeColors[pokemon.type] || '#4B5563';
  const paddedId = `#${String(pokemon.number).padStart(3, '0')}`;
  
  const typesBadges = pokemon.types
    .map(t => `<span class="type-badge" style="background-color: ${typeColors[t] || '#777'}">${t}</span>`)
    .join('');

  // Helper para cor de stat
  const getStatClass = (val) => val >= 100 ? 'stat-high' : val >= 50 ? 'stat-med' : 'stat-low';

  modalContent.innerHTML = `
    <div class="modal-header" style="background-color: ${primaryColor};">
      ${pokeballSvg}
      <div class="modal-nav">
        <button class="modal-close-btn" onclick="closeModal()" title="Fechar">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        ${pokemon.cry ? `
          <button class="modal-cry-btn" onclick="playPokemonCry('${pokemon.cry}')" title="Ouvir som">
            <i class="fa-solid fa-volume-high"></i>
          </button>
        ` : ''}
      </div>
      <div class="modal-title-row">
        <h2 class="modal-pokemon-name">${pokemon.name}</h2>
        <span class="modal-pokemon-id">${paddedId}</span>
      </div>
      <div class="modal-types-row">
        ${typesBadges}
      </div>
      <div class="modal-image-wrapper">
        <img class="modal-pokemon-img" src="${pokemon.photo}" alt="${pokemon.name}">
      </div>
    </div>

    <div class="modal-body">
      <div class="modal-tabs">
        <button class="modal-tab-btn active" onclick="switchModalTab('about', event)">Sobre</button>
        <button class="modal-tab-btn" onclick="switchModalTab('stats', event)">Status Base</button>
        <button class="modal-tab-btn" onclick="switchModalTab('evolution', event)">Evoluções</button>
      </div>

      <!-- Tab Sobre -->
      <div id="tab-about" class="tab-content active">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Altura</span>
            <span class="info-value">${pokemon.height} m</span>
          </div>
          <div class="info-item">
            <span class="info-label">Peso</span>
            <span class="info-value">${pokemon.weight} kg</span>
          </div>
        </div>

        <div>
          <span class="info-label" style="display: block; margin-bottom: 0.5rem;">Habilidades</span>
          <div class="abilities-tag-list">
            ${pokemon.abilities.map(a => `<span class="ability-tag">${a.replace('-', ' ')}</span>`).join('')}
          </div>
        </div>
      </div>

      <!-- Tab Status -->
      <div id="tab-stats" class="tab-content">
        <div class="stats-list">
          <div class="stat-row">
            <span class="stat-name">HP</span>
            <span class="stat-number">${pokemon.stats.hp}</span>
            <div class="stat-bar-container">
              <div class="stat-bar-fill ${getStatClass(pokemon.stats.hp)}" style="width: ${Math.min(100, (pokemon.stats.hp / 255) * 100)}%;"></div>
            </div>
          </div>
          <div class="stat-row">
            <span class="stat-name">Ataque</span>
            <span class="stat-number">${pokemon.stats.attack}</span>
            <div class="stat-bar-container">
              <div class="stat-bar-fill ${getStatClass(pokemon.stats.attack)}" style="width: ${Math.min(100, (pokemon.stats.attack / 255) * 100)}%;"></div>
            </div>
          </div>
          <div class="stat-row">
            <span class="stat-name">Defesa</span>
            <span class="stat-number">${pokemon.stats.defense}</span>
            <div class="stat-bar-container">
              <div class="stat-bar-fill ${getStatClass(pokemon.stats.defense)}" style="width: ${Math.min(100, (pokemon.stats.defense / 255) * 100)}%;"></div>
            </div>
          </div>
          <div class="stat-row">
            <span class="stat-name">Sp. Atk</span>
            <span class="stat-number">${pokemon.stats.specialAttack}</span>
            <div class="stat-bar-container">
              <div class="stat-bar-fill ${getStatClass(pokemon.stats.specialAttack)}" style="width: ${Math.min(100, (pokemon.stats.specialAttack / 255) * 100)}%;"></div>
            </div>
          </div>
          <div class="stat-row">
            <span class="stat-name">Sp. Def</span>
            <span class="stat-number">${pokemon.stats.specialDefense}</span>
            <div class="stat-bar-container">
              <div class="stat-bar-fill ${getStatClass(pokemon.stats.specialDefense)}" style="width: ${Math.min(100, (pokemon.stats.specialDefense / 255) * 100)}%;"></div>
            </div>
          </div>
          <div class="stat-row">
            <span class="stat-name">Velocidade</span>
            <span class="stat-number">${pokemon.stats.speed}</span>
            <div class="stat-bar-container">
              <div class="stat-bar-fill ${getStatClass(pokemon.stats.speed)}" style="width: ${Math.min(100, (pokemon.stats.speed / 255) * 100)}%;"></div>
            </div>
          </div>
          <div class="stat-total-row">
            <span>Total</span>
            <span>${pokemon.stats.total}</span>
          </div>
        </div>
      </div>

      <!-- Tab Evoluções -->
      <div id="tab-evolution" class="tab-content">
        <div id="evolutionContainer" class="evolution-chain-container">
          <div style="color: var(--text-muted); font-size: 0.9rem;">
            <i class="fa-solid fa-spinner fa-spin"></i> Carregando evolução...
          </div>
        </div>
      </div>
    </div>
  `;

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Buscar evolução em background
  loadEvolutionChain(pokemon.speciesUrl);
};

window.playPokemonCry = function(audioUrl) {
  if (!audioUrl) return;
  const audio = new Audio(audioUrl);
  audio.volume = 0.5;
  audio.play().catch(e => console.log('Audio playback prevented:', e));
};

async function loadEvolutionChain(speciesUrl) {
  const container = document.getElementById('evolutionContainer');
  if (!container) return;

  const chain = await pokeApi.getPokemonEvolutionChain(speciesUrl);

  if (!chain || chain.length <= 1) {
    container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">Este Pokémon não possui linha evolutiva registrada.</p>`;
    return;
  }

  container.innerHTML = chain.map((stage, idx) => `
    <div class="evo-stage" onclick="openPokemonDetails(${stage.id})">
      <div class="evo-stage-img-wrapper">
        <img class="evo-stage-img" src="${stage.photo}" alt="${stage.name}" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${stage.id}.png'">
      </div>
      <span class="evo-stage-name">${stage.name}</span>
    </div>
    ${idx < chain.length - 1 ? `
      <div class="evo-arrow">
        <i class="fa-solid fa-arrow-right evo-arrow-icon"></i>
        ${chain[idx + 1].minLevel ? `<span>Nv. ${chain[idx + 1].minLevel}</span>` : ''}
      </div>
    ` : ''}
  `).join('');
}

window.switchModalTab = function(tabName, event) {
  document.querySelectorAll('.modal-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

  event.currentTarget.classList.add('active');
  const target = document.getElementById(`tab-${tabName}`);
  if (target) target.classList.add('active');
};

window.closeModal = function() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = 'auto';
};

// Fechar modal ao clicar fora
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// Tecla ESC fecha o modal
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
    closeModal();
  }
});

// Eventos de Filtro e Busca
searchInput.addEventListener('input', (e) => {
  currentSearchTerm = e.target.value;
  clearSearchBtn.style.display = currentSearchTerm ? 'block' : 'none';
  applyFiltersAndSort();
});

clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  currentSearchTerm = '';
  clearSearchBtn.style.display = 'none';
  applyFiltersAndSort();
  searchInput.focus();
});

sortSelect.addEventListener('change', (e) => {
  currentSort = e.target.value;
  applyFiltersAndSort();
});

generationSelect.addEventListener('change', (e) => {
  selectedGeneration = e.target.value;
  selectedType = 'all';
  typePills.forEach(p => p.classList.toggle('active', p.dataset.type === 'all'));
  loadPokemonItems(true);
});

typePills.forEach(pill => {
  pill.addEventListener('click', () => {
    typePills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    selectedType = pill.dataset.type;

    if (selectedType === 'all') {
      loadPokemonItems(true);
    } else {
      loadPokemonsByType(selectedType);
    }
  });
});

favoritesToggleBtn.addEventListener('click', () => {
  showingFavoritesOnly = !showingFavoritesOnly;
  favoritesToggleBtn.classList.toggle('active', showingFavoritesOnly);
  applyFiltersAndSort();
});

// Dark / Light Mode Toggle
themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  themeToggleBtn.innerHTML = newTheme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  localStorage.setItem('pokedex_theme', newTheme);
});

// Inicialização de Tema
const savedTheme = localStorage.getItem('pokedex_theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
themeToggleBtn.innerHTML = savedTheme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';

// Load More Click
loadMoreButton.addEventListener('click', () => loadPokemonItems(false));

// Inicializar lista e favoritos
updateFavoriteCounter();
loadPokemonItems(true);
