(function () {
  'use strict';

  const View = typeof module !== 'undefined' && module.exports
    ? require('./campaign-view.js').CampaignView : window.PBACampaign?.CampaignView;
  const Catalog = typeof module !== 'undefined' && module.exports
    ? require('./campaign-catalog.js') : window.PBACampaign;
  const Wild = typeof module !== 'undefined' && module.exports
    ? require('./campaign-wild-encounters.js') : window.PBACampaign?.CampaignWildEncounters;
  if (!View) return;

  const previousRender = View.prototype.render;
  const previousHome = View.prototype.renderHome;
  const previousPicker = View.prototype.renderPicker;
  const cap = name => String(name || '').replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

  View.prototype.render = function () {
    if (!this.container) return;
    const wild = this.manager.getState().wild;
    if (wild?.pendingCapture) {
      this.pending = null;
      this.mapView?.destroy?.();
      return this.renderWildCapture(wild.pendingCapture);
    }
    if (wild?.result) {
      this.pending = null;
      this.mapView?.destroy?.();
      return this.renderWildResult(wild.result);
    }
    if (wild?.active && (!this.pending || this.pending.kind === 'WILD')) {
      this.pending = { kind: 'WILD', id: wild.active.pokemonId };
    } else if (!wild?.active && this.pending?.kind === 'WILD') {
      this.pending = null;
    }
    return previousRender.call(this);
  };

  View.prototype.renderHome = function () {
    previousHome.call(this);
    if (this.mapView) {
      this.mapView.onWildEncounter = regionId => {
        const result = this.manager.beginWildEncounter(regionId);
        if (!result.ok) {
          this.mapView?.announce?.('Encontro indisponível no momento.');
        }
      };
    }
  };

  View.prototype.renderPicker = function () {
    if (this.pending?.kind !== 'WILD') return previousPicker.call(this);
    const wild = this.manager.getState().wild;
    const pokemon = Catalog.byId(wild?.active?.pokemonId);
    if (!pokemon) {
      this.pending = null;
      this.manager.cancelWildEncounter();
      return;
    }
    const roster = this.manager.getRoster();
    const ready = this.pick.length === 3;
    this.container.innerHTML = `
      <section class="campaign-shell">
        <button id="pickerBack" class="campaign-secondary" type="button">← Voltar ao mapa</button>
        <div class="campaign-hero wild-encounter-hero">
          <p class="eyebrow">ENCONTRO SELVAGEM · REGIÃO 1</p>
          <h2>Um ${cap(pokemon.name)} apareceu!</h2>
          <img src="${pokemon.sprite}" alt="${cap(pokemon.name)}" width="96" height="96">
          <p>Vença a batalha 3 contra 1 para tentar capturá-lo. Se voltar, este encontro será encerrado.</p>
        </div>
        <div class="campaign-hero picker-choice">
          <h2>Escolha exatamente 3 Pokémon</h2>
          <p>O primeiro selecionado será o líder. ${this.pick.length}/3 selecionados.</p>
        </div>
        <div class="campaign-grid draft-grid">
          ${roster.map(member => this.card(member, this.pick.includes(member.id))).join('')}
        </div>
        <button id="startCampaignBattle" class="campaign-primary" type="button" ${ready ? '' : 'disabled'}>
          Iniciar encontro selvagem
        </button>
      </section>`;
    this.container.querySelector('#pickerBack').onclick = () => {
      this.pending = null;
      this.pick = [];
      this.manager.cancelWildEncounter();
    };
    this.container.querySelectorAll('.draft-grid .campaign-mon').forEach(button => {
      button.onclick = () => {
        const id = Number(button.dataset.id);
        this.pick = this.pick.includes(id)
          ? this.pick.filter(value => value !== id)
          : (this.pick.length < 3 ? [...this.pick, id] : this.pick);
        this.render();
      };
    });
    this.container.querySelector('#startCampaignBattle').onclick = async () => {
      if (this.pick.length !== 3) return;
      try {
        await this.coordinator.start('WILD', pokemon.id, this.pick);
        this.pending = null;
        window.switchAppTab('battle');
      } catch (error) {
        alert(error.message);
      }
    };
  };

  View.prototype.renderWildCapture = function (pending) {
    const pokemon = Catalog.byId(pending.pokemonId);
    if (!pokemon) return;
    this.container.innerHTML = `
      <section class="campaign-shell wild-capture-screen">
        <div class="campaign-hero">
          <p class="eyebrow">ENCONTRO SELVAGEM VENCIDO</p>
          <h2>Hora de tentar capturar ${cap(pokemon.name)}!</h2>
          <img src="${pokemon.sprite}" alt="${cap(pokemon.name)}" width="112" height="112">
          <p>Uma Poké Bola, uma tentativa: ${Math.round(Wild.CAPTURE_CHANCE * 100)}% de chance. Se não der certo, ele foge.</p>
          <div class="wild-pokeball" aria-hidden="true"></div>
          <button id="throwWildBall" class="campaign-primary" type="button">Lançar Poké Bola</button>
        </div>
      </section>`;
    const button = this.container.querySelector('#throwWildBall');
    button.onclick = () => {
      if (button.disabled) return;
      button.disabled = true;
      button.textContent = 'Poké Bola lançada...';
      const ball = this.container.querySelector('.wild-pokeball');
      if (ball?.classList) ball.classList.add('is-throwing');
      const resolve = () => {
        if (this.manager.getState().wild?.pendingCapture?.battleId === pending.battleId) {
          this.manager.attemptWildCapture();
        }
      };
      if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) resolve();
      else setTimeout(resolve, 650);
    };
  };

  View.prototype.renderWildResult = function (result) {
    const pokemon = Catalog.byId(result.pokemonId);
    if (!pokemon) return;
    const caught = result.status === 'CAUGHT';
    const lost = result.status === 'LOST';
    this.container.innerHTML = `
      <section class="campaign-shell wild-capture-screen">
        <div class="campaign-hero">
          <p class="eyebrow">ENCONTRO SELVAGEM</p>
          <h2>${caught ? cap(pokemon.name) + ' foi capturado!' : lost ? 'Você perdeu o encontro' : cap(pokemon.name) + ' escapou!'}</h2>
          <img src="${pokemon.sprite}" alt="${cap(pokemon.name)}" width="112" height="112">
          <p>${caught ? 'Novo Pokémon no elenco da campanha.' : 'Você poderá explorar a mata novamente.'}</p>
          <button id="wildResultContinue" class="campaign-primary" type="button">Voltar ao mapa</button>
        </div>
      </section>`;
    this.container.querySelector('#wildResultContinue').onclick = () => this.manager.acknowledgeWildResult();
  };
})();
