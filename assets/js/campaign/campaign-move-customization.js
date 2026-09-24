/* Phase 3 picker editor. Gameplay validation stays in CampaignMoveOptions. */
(function () {
  const Options = typeof module !== 'undefined' && module.exports
    ? require('./campaign-move-options.js') : window.PBACampaign?.CampaignMoveOptions;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const cap = value => String(value || '').replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

  function install(View) {
    if (!View?.prototype?.renderPicker || View.prototype.renderPicker.__moveCustomization) return;
    const previous = View.prototype.renderPicker;
    function renderPickerWithMoves() {
      const result = previous.call(this);
      if (!this.pending || !this.container?.querySelector || !Options ||
          typeof this.manager?.getEffectiveMoveIds !== 'function') return result;
      const roster = [...this.manager.getRoster(),
        ...(this.pending.kind === 'SHADOW' && this.manager.getShadowGuests
          ? this.manager.getShadowGuests() : [])];
      const selected = (this.pick || []).map(id => roster.find(pokemon => pokemon.id === id))
        .filter(Boolean);
      const anchor = this.container.querySelector('#pickerActionBar') ||
        this.container.querySelector('#startCampaignBattle');
      if (!anchor?.insertAdjacentHTML || !selected.length) return result;
      if (!selected.some(pokemon => pokemon.id === this.editingMovePokemonId)) {
        this.editingMovePokemonId = null;
        this.moveDraft = null;
      }
      const selector = selected.map(pokemon => {
        const modified = Boolean(this.manager.getState().movePreferences?.[pokemon.id]);
        return `<button type="button" class="campaign-move-editor__pokemon" data-edit-moves="${pokemon.id}" aria-expanded="${this.editingMovePokemonId === pokemon.id}">${escape(cap(pokemon.name))} · ${modified ? 'Personalizado' : 'Padrão'}</button>`;
      }).join('');
      let editor = '';
      const id = this.editingMovePokemonId;
      if (id) {
        const pokemon = selected.find(item => item.id === id);
        const ids = this.moveDraft || this.manager.getEffectiveMoveIds(id);
        const choices = Options.getPool(id).map(move => {
          const selectedMove = ids.includes(move.id);
          const effect = move.statusEffect
            ? `Status: ${move.statusEffect === 'poison' ? 'veneno' : move.statusEffect === 'burn' ? 'queimadura' : 'paralisia'}`
            : `Poder ${move.power}`;
          return `<label class="campaign-move-editor__option"><input type="checkbox" data-move-id="${move.id}" ${selectedMove ? 'checked' : ''}><span><strong>${escape(cap(move.name))}</strong><small>${escape(cap(move.type))} · ${effect} · ${move.accuracy === null ? 'sempre acerta' : `${move.accuracy}% precisão`} · PP ${move.pp}</small></span></label>`;
        }).join('');
        editor = `<div class="campaign-move-editor__form"><fieldset><legend>Golpes de ${escape(cap(pokemon.name))}</legend><p>Escolha de 1 a 4 golpes. A ordem em que selecionar será mantida na batalha.</p><div class="campaign-move-editor__options">${choices}</div></fieldset><p id="moveChoiceCount" aria-live="polite">${ids.length}/4 golpes escolhidos</p><p id="moveChoiceError" class="campaign-move-editor__error" role="alert"></p><div class="campaign-move-editor__actions"><button type="button" id="saveCampaignMoves" class="campaign-primary" ${ids.length ? '' : 'disabled'}>Salvar golpes</button><button type="button" id="resetCampaignMoves" class="campaign-secondary">Restaurar padrão</button><button type="button" id="cancelCampaignMoves" class="campaign-secondary">Fechar</button></div></div>`;
      }
      anchor.insertAdjacentHTML('beforebegin', `<section class="campaign-move-editor" aria-label="Personalizar golpes da equipe"><h3>Golpes da equipe</h3><p>Se não alterar, os quatro golpes atuais continuam. As escolhas salvas valem para os próximos desafios.</p><div class="campaign-move-editor__pokemon-list">${selector}</div>${editor}</section>`);
      this.container.querySelectorAll('[data-edit-moves]').forEach(button => {
        button.onclick = () => {
          this.editingMovePokemonId = Number(button.dataset.editMoves);
          this.moveDraft = this.manager.getEffectiveMoveIds(this.editingMovePokemonId);
          this.render();
        };
      });
      if (!id) return result;
      this.container.querySelectorAll('[data-move-id]').forEach(input => {
        input.onchange = () => {
          const moveId = Number(input.dataset.moveId);
          if (input.checked) {
            if (this.moveDraft.length >= 4) {
              input.checked = false;
              this.container.querySelector('#moveChoiceError').textContent = 'Escolha no máximo quatro golpes.';
              return;
            }
            if (!this.moveDraft.includes(moveId)) this.moveDraft.push(moveId);
          } else {
            this.moveDraft = this.moveDraft.filter(value => value !== moveId);
          }
          this.container.querySelector('#moveChoiceError').textContent = '';
          this.container.querySelector('#moveChoiceCount').textContent = `${this.moveDraft.length}/4 golpes escolhidos`;
          this.container.querySelector('#saveCampaignMoves').disabled = this.moveDraft.length === 0;
        };
      });
      this.container.querySelector('#saveCampaignMoves').onclick = () => {
        const valid = Options.validateSelection(id, this.moveDraft);
        if (!valid) {
          this.container.querySelector('#moveChoiceError').textContent = 'Escolha de um a quatro golpes válidos.';
          return;
        }
        this.editingMovePokemonId = null;
        this.moveDraft = null;
        this.manager.setMovePreference(id, valid.map(move => move.id));
      };
      this.container.querySelector('#resetCampaignMoves').onclick = () => {
        this.editingMovePokemonId = null;
        this.moveDraft = null;
        this.manager.resetMovePreference(id);
      };
      this.container.querySelector('#cancelCampaignMoves').onclick = () => {
        this.editingMovePokemonId = null;
        this.moveDraft = null;
        this.render();
      };
      return result;
    }
    renderPickerWithMoves.__moveCustomization = true;
    View.prototype.renderPicker = renderPickerWithMoves;
  }
  const api = Object.freeze({ install });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else {
    window.PBACampaign = window.PBACampaign || {};
    window.PBACampaign.CampaignMoveCustomization = api;
    install(window.PBACampaign.CampaignView);
  }
})();
