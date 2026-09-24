/* Advisory preview for the campaign picker. Battle rules remain unchanged. */
(function () {
  const Types = typeof module !== 'undefined' && module.exports
    ? require('../battle/type-effectiveness.js') : window.PBABattle.TypeEffectiveness;
  const Battle = typeof module !== 'undefined' && module.exports
    ? require('../battle/battle-constants.js') : window.PBABattle;
  const TEAMS = { SUPER: 'SUPER_TEAM', SHADOW: 'SUPER_TEAM',
    LEGENDARY_TRIAL: 'LEGENDARY_TRIAL_TEAM', MYTHICAL_TRIAL: 'MYTHICAL_TRIAL_TEAM',
    TITANS_TRIAL: 'TITANS_TRIAL_TEAM', CELESTIAL_TRIAL: 'CELESTIAL_TRIAL_TEAM' };
  const cap = value => String(value || '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const escape = value => String(value == null ? '' : value).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const times = value => `${Number(value).toLocaleString('pt-BR')}×`;
  const statusText = Object.freeze({ poison: 'Veneno · perde 1/8 do HP por turno',
    burn: 'Queimadura · perde 1/16 do HP e reduz dano físico',
    paralysis: 'Paralisia · metade da velocidade e 25% de chance de não agir' });
  function multiplier(type, types) {
    try { return Types.calculate(type, types).multiplier; }
    catch (_) { return null; }
  }
  function buildReport({ selected = [], opponents = [], fallbackById = {}, shadow = false }) {
    const entries = selected.map(pokemon => {
      const source = fallbackById[pokemon.id];
      const moves = (source && Array.isArray(source.moves) ? source.moves : [])
        .filter(move => move && Types.isValidType(move.type) &&
          (statusText[move.statusEffect] || (move.damageClass !== 'status' && Number(move.power) > 0)));
      const offensiveMoves = moves.filter(move => move.damageClass !== 'status');
      const matchups = opponents.map(opponent => {
        const attacks = offensiveMoves.map(move => ({ name: move.name, type: move.type,
          multiplier: multiplier(move.type, opponent.types) })).filter(x => x.multiplier !== null)
          .sort((a, b) => b.multiplier - a.multiplier || a.name.localeCompare(b.name));
        const enemySource = fallbackById[opponent.id];
        const enemyMoves = enemySource && Array.isArray(enemySource.moves) ? enemySource.moves : [];
        const incomingCandidates = enemyMoves.length
          ? enemyMoves.filter(move => move.damageClass !== 'status')
          : (opponent.types || []).map(type => ({ type }));
        const incoming = incomingCandidates
          .map(move => ({ name: move.name || null, type: move.type,
            multiplier: multiplier(move.type, pokemon.types) }))
          .filter(x => x.multiplier !== null).sort((a, b) => b.multiplier - a.multiplier);
        const risk = incoming[0];
        const statusThreats = enemyMoves.filter(move => statusText[move.statusEffect] &&
          !Battle.isStatusMoveImmune(move, pokemon.types)).map(move => move.statusEffect);
        return { opponent, bestAttack: attacks[0] || null, statusThreats,
          incoming: risk ? { ...risk, multiplier: shadow ? Math.max(2, risk.multiplier) : risk.multiplier } : null };
      });
      return { pokemon, moves, hasMoves: offensiveMoves.length > 0, matchups };
    });
    const covered = opponents.filter((_, i) => entries.some(entry =>
      entry.matchups[i].bestAttack && entry.matchups[i].bestAttack.multiplier >= 2)).length;
    const ranked = entries.map(entry => ({ entry, first: entry.matchups[0] }))
      .filter(x => x.first && x.first.bestAttack && x.first.bestAttack.multiplier > 0)
      .sort((a, b) => b.first.bestAttack.multiplier - a.first.bestAttack.multiplier ||
        (a.first.incoming ? a.first.incoming.multiplier : Infinity) -
        (b.first.incoming ? b.first.incoming.multiplier : Infinity));
    const fullyFixed = entries.length > 0 && entries.every(entry => entry.moves.length >= 1 && entry.moves.length <= 4) &&
      opponents.every(opponent => fallbackById[opponent.id]?.moves?.length === 4);
    return { entries, opponents, covered, shadow, fullyFixed,
      suggestedLeader: selected.length > 1 && ranked.length ? ranked[0].entry.pokemon : null };
  }
  function renderReport(report) {
    const { entries, opponents, covered, shadow, fullyFixed, suggestedLeader } = report;
    const cards = entries.map(({ pokemon, moves, hasMoves, matchups }, index) => {
      const favorable = matchups.filter(x => x.bestAttack && x.bestAttack.multiplier >= 2)
        .sort((a, b) => b.bestAttack.multiplier - a.bestAttack.multiplier)[0];
      const risk = matchups.filter(x => x.incoming && x.incoming.multiplier >= 2)
        .sort((a, b) => b.incoming.multiplier - a.incoming.multiplier)[0];
      const attack = favorable
        ? `${cap(favorable.bestAttack.name)} (${cap(favorable.bestAttack.type)}) causa ${times(favorable.bestAttack.multiplier)} em ${cap(favorable.opponent.name)}.`
        : hasMoves ? 'Nenhum golpe ofensivo conhecido tem vantagem de tipo contra esta equipe.'
          : 'Golpes ofensivos não disponíveis no catálogo offline.';
      const warning = risk
        ? risk.incoming.name
          ? `Atenção: ${cap(risk.incoming.name)} de ${cap(risk.opponent.name)} tem efetividade ${times(risk.incoming.multiplier)}.`
          : `Atenção: golpes do tipo ${cap(risk.incoming.type)} de ${cap(risk.opponent.name)} podem causar ${times(risk.incoming.multiplier)}.`
        : 'Nenhum golpe adversário conhecido tem vantagem de tipo.';
      const statusRisks = [...new Set(matchups.flatMap(x => x.statusThreats))];
      const statusRisk = statusRisks.length
        ? `<p class="campaign-matchup__risk">${statusRisks.length === 1 && statusRisks[0] === 'poison'
          ? 'Atenção: um adversário pode causar veneno (perda de HP ao fim do turno).'
          : `Atenção: adversários podem causar ${escape(statusRisks.map(status => statusText[status]).join('; '))}.`}</p>` : '';
      const first = matchups[0];
      const immunity = first && first.bestAttack && first.bestAttack.multiplier === 0
        ? `<p class="campaign-matchup__warning">Os golpes conhecidos não atingem ${escape(cap(first.opponent.name))}; escolha outro Pokémon.</p>` : '';
      const moveList = moves.length
        ? `<ul class="campaign-matchup__moves" aria-label="Golpes de ${escape(cap(pokemon.name))}">${moves.map(move =>
          `<li><strong>${escape(cap(move.name))}</strong><span>${statusText[move.statusEffect] ? `${move.statusEffect === 'poison' ? 'Veneno' : move.statusEffect === 'burn' ? 'Queimadura' : 'Paralisia'} · sem dano direto · ${statusText[move.statusEffect]}` : `${escape(cap(move.type))} · Poder ${Number(move.power)}`} · ${move.accuracy === null ? 'sempre acerta' : Number.isInteger(Number(move.accuracy)) ? `${Number(move.accuracy)}% precisão` : 'precisão não informada'}</span></li>`
        ).join('')}</ul>`
        : '';
      return `<article class="campaign-matchup__card"><h4>${index === 0 ? '<span class="campaign-matchup__leader">LÍDER ATUAL</span> ' : ''}${escape(cap(pokemon.name))}</h4>${moveList}<p>${escape(attack)}</p><p class="campaign-matchup__risk">${escape(warning)}</p>${statusRisk}${immunity}</article>`;
    }).join('');
    const summary = entries.length
      ? `${covered} de ${opponents.length} adversários têm fraqueza a pelo menos um golpe ofensivo conhecido da seleção.`
      : `Escolha ${shadow ? 'um líder' : 'até três Pokémon'} para ver vantagens e riscos da equipe.`;
    const suggestion = suggestedLeader && suggestedLeader.id !== entries[0].pokemon.id
      ? `<p class="campaign-matchup__suggestion">Sugestão de líder contra ${escape(cap(opponents[0].name))}: <strong>${escape(cap(suggestedLeader.name))}</strong>. Para mudar, desmarque e selecione novamente na ordem desejada.</p>` : '';
    const note = !entries.length
      ? 'Os golpes da campanha são estáveis e aparecerão aqui após sua escolha.'
      : fullyFixed
        ? `Os ${entries.every(entry => entry.moves.length === 4) ? 'quatro ' : ''}golpes exibidos são os usados nas batalhas da campanha. Vantagem de tipo não garante vitória.`
        : 'Prévia limitada: Pokémon de campanhas antigas sem conjunto fixo podem carregar golpes diferentes na batalha.';
    return `<section class="campaign-matchup" aria-label="Comparador de equipe"><div class="campaign-matchup__head"><p class="eyebrow">LEITURA TÁTICA</p><h3>Vantagens da sua escolha</h3><p>${escape(summary)}</p></div>${entries.length ? `<div class="campaign-matchup__grid">${cards}</div>` : ''}${suggestion}<p class="campaign-matchup__note">${note} ${shadow ? 'Na aura Shadow, ataques inimigos recebem no mínimo 2× de efetividade.' : ''}</p></section>`;
  }
  function install(View, catalog, fallbackById) {
    if (!View || !Types || !catalog || View.prototype.renderPicker.__matchupGuide) return;
    const previous = View.prototype.renderPicker;
    function renderPickerWithGuide() {
      const result = previous.call(this);
      if (!this.pending || !this.container || !this.container.querySelector) return result;
      const kind = this.pending.kind;
      const master = kind === 'MASTER' && this.manager && this.manager.getMaster(this.pending.id);
      const isTrial = ['LEGENDARY_TRIAL', 'MYTHICAL_TRIAL', 'TITANS_TRIAL', 'CELESTIAL_TRIAL'].includes(kind);
      let opponents;
      if (isTrial) {
        const chosenId = Number(this.pending.opponentId || this.selectedOpponentId || this.pending.id);
        const chosenMon = Number.isInteger(chosenId) ? (catalog.byId ? catalog.byId(chosenId) : (catalog.CANONICAL_BY_ID ? catalog.CANONICAL_BY_ID[chosenId] : null)) : null;
        opponents = chosenMon ? [chosenMon] : [];
      } else if (master) {
        opponents = master.team;
      } else {
        opponents = catalog[TEAMS[kind]];
      }
      if (!Array.isArray(opponents) || !opponents.length) return result;
      const available = [...this.manager.getRoster(),
        ...(kind === 'SHADOW' && this.manager.getShadowGuests ? this.manager.getShadowGuests() : [])];
      const selected = (this.pick || []).map(id => available.find(pokemon => pokemon.id === id)).filter(Boolean);
      const previewById = { ...fallbackById };
      if (typeof this.manager.getEffectiveMoves === 'function') {
        for (const pokemon of selected) {
          if (previewById[pokemon.id]) previewById[pokemon.id] = {
            ...previewById[pokemon.id], moves: this.manager.getEffectiveMoves(pokemon.id)
          };
        }
      }
      const anchor = this.container.querySelector('#pickerActionBar') || this.container.querySelector('#startCampaignBattle');
      if (anchor && anchor.insertAdjacentHTML) {
        anchor.insertAdjacentHTML('beforebegin', renderReport(buildReport({
          selected, opponents, fallbackById: previewById, shadow: kind === 'SHADOW' })));
      }
      return result;
    }
    renderPickerWithGuide.__matchupGuide = true;
    View.prototype.renderPicker = renderPickerWithGuide;
  }
  const api = { buildReport, renderReport, install };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else if (typeof window !== 'undefined') {
    window.PBACampaign = window.PBACampaign || {};
    window.PBACampaign.MatchupGuide = api;
    install(window.PBACampaign.CampaignView, window.PBACampaign,
      (window.PBACampaign.CampaignFixedBattleCatalog || {}).byId || {});
  }
})();
