(function(){
 class CampaignView { constructor({manager,coordinator,container}){this.manager=manager;this.coordinator=coordinator;this.container=container||document.getElementById('campaignView');this.draft=[];this.pick=[];this.pending=null;this.draftDebounceTimer=null;manager.onChange(()=>this.render())} cap(s){return String(s).replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())} clearDraftDebounce(){if(this.draftDebounceTimer){clearTimeout(this.draftDebounceTimer);this.draftDebounceTimer=null;}} render(){if(!this.container)return;const d=this.manager.getState();if(this.manager.isStarted()){this.clearDraftDebounce();}if(!this.manager.isStarted()){if(this.mapView&&typeof this.mapView.destroy==='function')this.mapView.destroy();return this.renderDraft();}if(d.pendingReward){if(this.mapView&&typeof this.mapView.destroy==='function')this.mapView.destroy();return this.renderReward(d.pendingReward);}if(d.status==='COMPLETED'){if(this.mapView&&typeof this.mapView.destroy==='function')this.mapView.destroy();return this.renderComplete();}if(this.pending){if(this.mapView&&typeof this.mapView.destroy==='function')this.mapView.destroy();return this.renderPicker();}this.renderHome()} card(p,selected=false){if(!p)return'';const rec=p.recommendedForEndgame?'<span class="recommended-badge" title="Recomendado para desafios finais"><i class="fa-solid fa-star"></i> Recomendado</span>':'';return `<button class="campaign-mon ${selected?'selected':''} ${p.recommendedForEndgame?'is-recommended':''}" data-id="${p.id}" aria-pressed="${selected}"><img src="${p.sprite}" alt="${p.name}" loading="lazy"><strong>${this.cap(p.name)}</strong><span>${p.types.map(t=>`<i class="type-chip type-${t}">${t}</i>`).join('')}</span><small>BST ${p.bst}</small>${rec}</button>`} renderDraft(){const C=window.PBACampaign;this.container.innerHTML=`<section class="campaign-shell"><div class="campaign-hero"><p class="eyebrow">NOVA JORNADA</p><h2>Circuito dos Mestres</h2><p>Escolha 6 Pokémon para começar sua campanha. Essa escolha será permanente. Novos Pokémon entram no elenco ao vencer Mestres, concluir provas ou capturar Pokémon selvagens.</p><strong>Selecionados ${this.draft.length}/6</strong></div><div class="campaign-grid draft-grid">${C.DRAFT.map(p=>this.card(p,this.draft.includes(p.id))).join('')}</div><button id="campaignConfirmDraft" class="campaign-primary" ${this.draft.length===6?'':'disabled'}>Confirmar equipe</button></section>`;this.container.querySelectorAll('.campaign-mon').forEach(b=>b.onclick=()=>{const id=Number(b.dataset.id);this.draft=this.draft.includes(id)?this.draft.filter(x=>x!==id):(this.draft.length<6?[...this.draft,id]:this.draft);this.render()});this.container.querySelector('#campaignConfirmDraft').onclick=()=>{if(confirm('Esses serão seus 6 Pokémon iniciais. Depois de iniciar a campanha, eles não poderão ser trocados. Deseja continuar?'))this.manager.start(this.draft)}} renderHome(){if(!this.mapView||this.mapView.container!==this.container){const MapViewClass=(window.PBACampaign&&window.PBACampaign.CampaignMapView)||(typeof require!=='undefined'?require('./campaign-map-view.js').CampaignMapView:null);if(MapViewClass){this.mapView=new MapViewClass({manager:this.manager,container:this.container,onChallenge:({kind,id})=>{if(this.mapView&&typeof this.mapView.destroy==='function')this.mapView.destroy();this.pending={kind,id,opponentId:null};this.pick=[];this.render()},onReset:()=>{if(confirm('Resetar somente o progresso da campanha? Seu Perfil, Meu Time e preferências serão preservados.'))this.manager.reset()}})}}if(this.mapView){this.mapView.container=this.container;this.mapView.render()}} renderPicker(){const roster=this.manager.getRoster();this.container.innerHTML=`<section class="campaign-shell"><button id="pickerBack" class="campaign-secondary">← Voltar</button><div class="campaign-hero"><p class="eyebrow">PREPARAR DESAFIO</p><h2>Escolha exatamente 3 Pokémon</h2><p>O primeiro selecionado será o líder. ${this.pick.length}/3 selecionados.</p></div><div class="campaign-grid draft-grid">${roster.map(p=>this.card(p,this.pick.includes(p.id))).join('')}</div><button id="startCampaignBattle" class="campaign-primary" ${this.pick.length===3?'':'disabled'}>Iniciar batalha</button></section>`;this.container.querySelector('#pickerBack').onclick=()=>{this.pending=null;this.render()};this.container.querySelectorAll('.campaign-mon').forEach(b=>b.onclick=()=>{const id=Number(b.dataset.id);this.pick=this.pick.includes(id)?this.pick.filter(x=>x!==id):(this.pick.length<3?[...this.pick,id]:this.pick);this.render()});this.container.querySelector('#startCampaignBattle').onclick=async()=>{try{await this.coordinator.start(this.pending.kind,this.pending.id,this.pick);this.pending=null;window.switchAppTab('battle')}catch(e){alert(e.message)}}} renderReward(reward){const C=window.PBACampaign;this.container.innerHTML=`<section class="campaign-shell"><div class="campaign-hero"><p class="eyebrow">RECOMPENSA</p><h2>Escolha seu novo recruta</h2><p>Esta decisão é permanente.</p></div><div class="campaign-grid draft-grid">${reward.candidates.map(id=>this.card(C.byId(id))).join('')}</div></section>`;this.container.querySelectorAll('.campaign-mon').forEach(b=>b.onclick=()=>{if(confirm('Confirmar este recruta?'))this.manager.claimReward(Number(b.dataset.id))})} renderComplete(){this.container.innerHTML='<section class="campaign-shell"><div class="campaign-hero"><p class="eyebrow">JORNADA CONCLUÍDA</p><h2>True Ending</h2><p>Você dominou o Circuito dos Mestres e deixou sua marca.</p></div><button id="campaignReset" class="campaign-reset">Resetar campanha</button></section>';this.container.querySelector('#campaignReset').onclick=()=>{if(confirm('Resetar somente a campanha?'))this.manager.reset()}} deactivate(){this.clearDraftDebounce();if(this.mapView&&typeof this.mapView.destroy==='function')this.mapView.destroy();}
 }
 const api={CampaignView};if(typeof window!=='undefined'){window.PBACampaign=window.PBACampaign||{};Object.assign(window.PBACampaign,api)}if(typeof module!=='undefined'&&module.exports)module.exports=api;
})();
(function(){
 const View=window.PBACampaign&&window.PBACampaign.CampaignView;if(!View)return;
 View.prototype.filterDraft=function(items,query,generation,type,recommendedOnly){const q=String(query||'').trim().toLowerCase();return (items||[]).filter(p=>(!q||p.name.toLowerCase().includes(q)||String(p.id)===q)&&(!generation||Number(p.generation)===Number(generation))&&(!type||(Array.isArray(p.types)&&p.types.includes(type)))&&(!recommendedOnly||Boolean(p.recommendedForEndgame)))};
 View.prototype.renderDraft=function(){const C=window.PBACampaign;this.draftQuery=this.draftQuery||'';this.draftGeneration=this.draftGeneration!==undefined?this.draftGeneration:'';this.draftType=this.draftType||'';this.draftRecommended=Boolean(this.draftRecommended);this.draftPage=Number.isInteger(this.draftPage)&&this.draftPage>=1?this.draftPage:1;this.draftPageSize=50;const items=this.filterDraft(C.DRAFT,this.draftQuery,this.draftGeneration,this.draftType,this.draftRecommended);const totalPages=Math.max(1,Math.ceil(items.length/this.draftPageSize));if(this.draftPage>totalPages)this.draftPage=totalPages;if(this.draftPage<1)this.draftPage=1;const startIndex=(this.draftPage-1)*this.draftPageSize;const pagedItems=items.slice(startIndex,startIndex+this.draftPageSize);const chosen=this.draft.map(C.byId).filter(Boolean);const emptyState=items.length===0?`<div class="draft-empty-state" role="status"><p><i class="fa-solid fa-circle-exclamation"></i> Nenhum Pokémon encontrado com os filtros selecionados.</p></div>`:`<div class="campaign-grid draft-grid">${pagedItems.map(p=>this.card(p,this.draft.includes(p.id))).join('')}</div>`;const pagination=items.length>this.draftPageSize?`<div class="draft-pagination" role="navigation" aria-label="Paginação do catálogo"><button id="draftPrevPage" class="draft-page-btn" ${this.draftPage<=1?'disabled':''} aria-label="Página anterior">← Anterior</button><span class="draft-page-info">Página ${this.draftPage} de ${totalPages} (${items.length} Pokémon)</span><button id="draftNextPage" class="draft-page-btn" ${this.draftPage>=totalPages?'disabled':''} aria-label="Próxima página">Próxima →</button></div>`:'';this.container.innerHTML=`<section class="campaign-shell"><div class="campaign-hero"><p class="eyebrow">NOVA JORNADA</p><h2>Circuito dos Mestres</h2><p>Escolha seis Pokémon permanentes para começar a sua campanha. Equipe inicial equilibrada é essencial para os confrontos contra os Mestres e Provas de Elite.</p><div class="draft-tools"><input id="draftSearch" value="${this.draftQuery}" placeholder="Buscar nome ou número" aria-label="Buscar Pokémon por nome ou número"><select id="draftGen" aria-label="Filtrar por geração"><option value="">Todas as gerações</option>${[1,2,3,4,5,6,7,8,9].map(g=>`<option value="${g}" ${String(g)===String(this.draftGeneration)?'selected':''}>Gen ${g}</option>`).join('')}</select><select id="draftType" aria-label="Filtrar por tipo"><option value="">Todos os tipos</option>${['normal','fire','water','electric','grass','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy'].map(t=>`<option value="${t}" ${t===this.draftType?'selected':''}>${t}</option>`).join('')}</select><label class="draft-recommended-toggle" for="draftRecommended"><input type="checkbox" id="draftRecommended" ${this.draftRecommended?'checked':''}><span>⭐ Recomendados para o final</span></label></div><p id="draftResultsCount" role="status" aria-live="polite">${items.length} Pokémon encontrados</p><h3>Seus Pokémon iniciais — ${this.draft.length}/6</h3><div class="campaign-roster">${chosen.map(p=>`<button class="draft-remove" data-remove="${p.id}" aria-label="Remover ${this.cap(p.name)} da equipe"><img src="${p.sprite}" alt="${p.name}">${this.cap(p.name)} ×</button>`).join('')||'<span>Nenhum selecionado</span>'}</div></div><div id="draftMessage" role="status" aria-live="assertive"></div>${emptyState}${pagination}<button id="campaignConfirmDraft" class="campaign-primary" ${this.draft.length===6?'':'disabled'}>Confirmar equipe</button></section>`;const rerender=()=>{this.clearDraftDebounce();if(this.manager.isStarted())return this.render();this.render();};const searchInput=this.container.querySelector('#draftSearch');if(searchInput){searchInput.oninput=e=>{this.clearDraftDebounce();const val=e.target.value;this.draftDebounceTimer=setTimeout(()=>{this.draftDebounceTimer=null;if(this.manager.isStarted())return this.render();this.draftQuery=val;this.draftPage=1;this.render();const next=this.container.querySelector('#draftSearch');if(next){next.focus();next.setSelectionRange(next.value.length,next.value.length);}},180);};}const genSelect=this.container.querySelector('#draftGen');if(genSelect)genSelect.onchange=e=>{this.clearDraftDebounce();this.draftGeneration=e.target.value;this.draftPage=1;rerender();};const typeSelect=this.container.querySelector('#draftType');if(typeSelect)typeSelect.onchange=e=>{this.clearDraftDebounce();this.draftType=e.target.value;this.draftPage=1;rerender();};const recCheckbox=this.container.querySelector('#draftRecommended');if(recCheckbox)recCheckbox.onchange=e=>{this.clearDraftDebounce();this.draftRecommended=e.target.checked;this.draftPage=1;rerender();};const prevBtn=this.container.querySelector('#draftPrevPage');if(prevBtn)prevBtn.onclick=()=>{this.clearDraftDebounce();if(this.draftPage>1){this.draftPage--;rerender();}};const nextBtn=this.container.querySelector('#draftNextPage');if(nextBtn)nextBtn.onclick=()=>{this.clearDraftDebounce();if(this.draftPage<totalPages){this.draftPage++;rerender();}};this.container.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{this.clearDraftDebounce();this.draft=this.draft.filter(x=>x!==Number(b.dataset.remove));rerender();});this.container.querySelectorAll('.campaign-mon').forEach(b=>b.onclick=()=>{this.clearDraftDebounce();const id=Number(b.dataset.id);if(this.draft.includes(id)){this.draft=this.draft.filter(x=>x!==id);return rerender();}if(this.draft.length===6)return;const candidate=[...this.draft,id];if(C.MASTERS.some(m=>m.team.every(p=>candidate.includes(p.id)))){const msg=this.container.querySelector('#draftMessage');if(msg)msg.textContent='Você pode começar com no máximo 2 Pokémon da equipe de um mesmo Mestre para garantir uma recompensa futura.';return;}this.draft=candidate;rerender();});const confirmBtn=this.container.querySelector('#campaignConfirmDraft');if(confirmBtn)confirmBtn.onclick=()=>{this.clearDraftDebounce();if(confirm('Esses serão seus 6 Pokémon iniciais. Deseja continuar?')){const r=this.manager.start(this.draft);if(!r.ok){const msg=this.container.querySelector('#draftMessage');if(msg)msg.textContent='Não foi possível confirmar esta equipe.';}}};};
 View.prototype.renderReward=function(reward){const C=window.PBACampaign,candidates=this.manager.getRewardCandidates();if(!candidates.some(x=>x.selectable))throw new Error('Nenhuma recompensa nova disponível.');this.container.innerHTML=`<section class="campaign-shell"><div class="campaign-hero"><p class="eyebrow">RECOMPENSA</p><h2>${reward.kind==='SUPER'?'Escolha um Pokémon de elite':'Escolha seu novo recruta'}</h2></div><div class="campaign-grid draft-grid">${candidates.map(c=>{const p=C.byId(c.id);return `<button class="campaign-mon ${c.owned?'owned':''}" data-id="${c.id}" ${c.owned?'disabled':''}><img src="${p.sprite}" alt="${p.name}"><strong>${this.cap(p.name)}</strong><small>${c.owned?'JÁ NO ELENCO':'Selecionar'}</small></button>`}).join('')}</div></section>`;this.container.querySelectorAll('.campaign-mon:not(:disabled)').forEach(b=>b.onclick=()=>{if(confirm('Confirmar este recruta?'))this.manager.claimReward(Number(b.dataset.id))})};
})();

(function(){const View=window.PBACampaign&&window.PBACampaign.CampaignView;if(!View)return;const original=View.prototype.render;View.prototype.render=function(){const d=this.manager.getState();if(d.status==='SUPER_REWARD_PENDING'&&!d.superTrainer.victorySeen){this.container.innerHTML='<section class="campaign-shell"><div class="campaign-hero"><p class="eyebrow">SUPER TREINADOR DERROTADO</p><h2>18 / 18 INSÍGNIAS</h2><p>VOCÊ É O CAMPEÃO DO CIRCUITO</p><button id="receiveElite" class="campaign-primary">RECEBER RECOMPENSA</button></div></section>';this.container.querySelector('#receiveElite').onclick=()=>this.manager.acknowledgeSuperVictory();return}return original.call(this)};})();
(function(){const View=window.PBACampaign&&window.PBACampaign.CampaignView;if(!View)return;const prior=View.prototype.render;View.prototype.render=function(){const d=this.manager.getState();if(d.status==='SHADOW_AVAILABLE'&&d.shadowTrainer.revealed&&!d.shadowTrainer.revealSeen){this.container.innerHTML='<section class="campaign-shell shadow-reveal"><div class="campaign-hero"><p class="eyebrow">...</p><h2>ANOMALIA DETECTADA</h2><p>O DESAFIO AINDA NÃO TERMINOU</p><h2>SHADOW SUPER TRAINER</h2><button id="ackShadowReveal" class="campaign-danger">ENFRENTAR O DESAFIO FINAL</button></div></section>';this.container.querySelector('#ackShadowReveal').onclick=()=>this.manager.acknowledgeShadowReveal();return}return prior.call(this)};View.prototype.renderComplete=function(){const d=this.manager.getState(),attempts=Object.values(d.challenges).reduce((n,x)=>n+(x.attempts||0),0)+(d.superTrainer.attempts||0)+(d.shadowTrainer.attempts||0);this.container.innerHTML=`<section class="campaign-shell"><div class="campaign-hero"><p class="eyebrow">CAMPEÃO DO CIRCUITO</p><h2>CAMPANHA 100% CONCLUÍDA</h2><p>Insígnias: ${this.manager.getBadgeCount()} / 18</p><p>Mestres derrotados: ${this.manager.getBadgeCount()} / 18</p><p>Elenco final: ${this.manager.getRosterIds().length} Pokémon</p><p>Super Trainer: DERROTADO</p><p>Shadow Super Trainer: DERROTADO</p><p>Tentativas da campanha: ${attempts}</p></div><button id="campaignReset" class="campaign-reset">Resetar campanha</button></section>`;this.container.querySelector('#campaignReset').onclick=()=>{if(confirm('Resetar somente a campanha?'))this.manager.reset()}}})();

(function () {
  const View = window.PBACampaign && window.PBACampaign.CampaignView;
  if (!View) return;
  View.prototype.renderPicker = function () {
    const C = window.PBACampaign, roster = this.manager.getRoster();
    const master = this.pending && this.pending.kind === 'MASTER' ? this.manager.getMaster(this.pending.id) : null;
    const guide = master ? C.getTypeGuide(master.type) : null;
    const typeList = types => types.length
      ? `<div class="type-guide-list">${types.map(type => `<span class="type-guide-chip type-${type}">${C.TYPE_ICONS[type]} ${C.TYPE_LABELS[type]}</span>`).join('')}</div>`
      : '<p class="type-guide-empty">Normal não possui vantagem Super Efetiva por tipo.</p>';
    const context = master ? `<section class="master-context"><p class="eyebrow">PREPARAR DESAFIO</p><h2>${master.trainerName}</h2><p>${master.trainerTitle}</p><p><strong>Tipo:</strong> ${C.TYPE_LABELS[master.type]} · <strong>${master.badgeName}</strong></p></section><section class="type-guide" aria-label="Guia do tipo ${guide.label}"><h3>GUIA DO TIPO — ${guide.label.toUpperCase()}</h3><p><strong>${guide.label} é forte contra:</strong></p>${typeList(guide.offensiveStrengths)}<p><strong>${guide.label} é fraca contra:</strong></p>${typeList(guide.defensiveWeaknesses)}<p class="type-guide-disclaimer">Tipos secundários podem alterar essas relações.</p></section>` : `<div class="campaign-hero"><p class="eyebrow">PREPARAR DESAFIO</p><h2>${this.pending?.kind === 'SHADOW' ? 'Desafio Final' : 'Super Treinador'}</h2></div>`;
    this.container.innerHTML = `<section class="campaign-shell"><button id="pickerBack" class="campaign-secondary">← Voltar</button>${context}<div class="campaign-hero picker-choice"><h2>Escolha exatamente 3 Pokémon</h2><p>O primeiro selecionado será o líder. ${this.pick.length}/3 selecionados.</p></div><div class="campaign-grid draft-grid">${roster.map(p => this.card(p, this.pick.includes(p.id))).join('')}</div><button id="startCampaignBattle" class="campaign-primary" ${this.pick.length === 3 ? '' : 'disabled'}>Iniciar batalha</button></section>`;
    this.container.querySelector('#pickerBack').onclick = () => { this.pending = null; this.render(); };
    this.container.querySelectorAll('.campaign-mon').forEach(button => button.onclick = () => {
      const id = Number(button.dataset.id);
      this.pick = this.pick.includes(id) ? this.pick.filter(value => value !== id) : (this.pick.length < 3 ? [...this.pick, id] : this.pick);
      this.render();
    });
    this.container.querySelector('#startCampaignBattle').onclick = async () => {
      try {
        await this.coordinator.start(this.pending.kind, this.pending.id, this.pick);
        this.pending = null;
        window.switchAppTab('battle');
      } catch (error) { alert(error.message); }
    };
  };
})();
(function () {
  const View = window.PBACampaign && window.PBACampaign.CampaignView;
  if (!View) return;
  const C = window.PBACampaign;
  const avatar = (visual, size, shape, surface) => C.renderTrainerAvatar(visual, { size, shape, surface, decorative: true });


  const renderPicker = View.prototype.renderPicker;
  View.prototype.renderPicker = function () {
    renderPicker.call(this);
    if (!this.pending) return;
    const visual = this.pending.kind === 'MASTER'
      ? C.getMasterVisual(this.pending.id)
      : C.getSpecialTrainerVisual(this.pending.kind === 'SHADOW' ? 'SHADOW' : 'SUPER');
    const context = this.container.querySelector('.master-context, .campaign-hero');
    if (context) context.insertAdjacentHTML('afterbegin', avatar(visual, 'LARGE', 'PORTRAIT'));
  };

  const renderReward = View.prototype.renderReward;
  View.prototype.renderReward = function (reward) {
    renderReward.call(this, reward);
    const visual = reward && reward.kind === 'MASTER'
      ? C.getMasterVisual(reward.id)
      : C.getSpecialTrainerVisual('SUPER');
    const hero = this.container.querySelector('.campaign-hero');
    if (hero && visual) hero.insertAdjacentHTML('afterbegin', avatar(visual, 'SMALL', 'CIRCLE'));
  };

  const render = View.prototype.render;
  View.prototype.render = function () {
    const result = render.call(this);
    const state = this.manager.getState();
    const superPending = state.status === 'SUPER_REWARD_PENDING' && !state.superTrainer.victorySeen;
    const shadowReveal = state.status === 'SHADOW_AVAILABLE' && state.shadowTrainer.revealed && !state.shadowTrainer.revealSeen;
    if (superPending || shadowReveal) {
      const hero = this.container.querySelector('.campaign-hero');
      const visual = C.getSpecialTrainerVisual(shadowReveal ? 'SHADOW' : 'SUPER');
      if (hero && visual && !hero.querySelector('.trainer-avatar')) {
        hero.insertAdjacentHTML('afterbegin', avatar(visual, 'LARGE', 'PORTRAIT'));
      }
    }
    return result;
  };
})();


(function () {
  const View = window.PBACampaign && window.PBACampaign.CampaignView;
  if (!View) return;
  const C = window.PBACampaign;
  const trialInfo = kind => kind === 'LEGENDARY_TRIAL'
    ? { title: 'Prova Lendária', team: C.LEGENDARY_TRIAL_TEAM, reward: 'Escolha seu Pokémon Lendário' }
    : kind === 'MYTHICAL_TRIAL'
      ? { title: 'Prova Mítica', team: C.MYTHICAL_TRIAL_TEAM, reward: 'Escolha seu Pokémon Mítico' }
      : null;
  const portrait = (visual, size = 'LARGE') => visual
    ? C.renderTrainerAvatar(visual, { size, shape: 'PORTRAIT', decorative: true })
    : '';

  View.prototype.setupBattleStart = function (isReady, requiredCount, onStart) {
    const bar = this.container.querySelector('#pickerActionBar');
    if (bar) {
      bar.onclick = () => {
        const currentCount = this.pending?.kind === 'SHADOW' && this.pick.length ? 1 : this.pick.length;
        if (!isReady) {
          const b = bar.querySelector('#startCampaignBattle');
          const h = bar.querySelector('.picker-status-hint');
          if (b) { b.classList.remove('btn-shake'); void b.offsetWidth; b.classList.add('btn-shake'); }
          if (h) {
            h.classList.add('warning-pulse');
            const remaining = Math.max(1, requiredCount - currentCount);
            h.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Escolha ${requiredCount} Pokémon acima! (Faltam ${remaining})`;
            setTimeout(() => {
              h.classList.remove('warning-pulse');
              if (this.pick.length < requiredCount) {
                h.innerHTML = `<i class="fa-solid fa-circle-info"></i> Selecione mais ${remaining} Pokémon (${currentCount}/${requiredCount})`;
              }
            }, 1800);
          }
        }
      };
    }
    const startBtn = this.container.querySelector('#startCampaignBattle');
    if (startBtn) {
      startBtn.onclick = async (e) => {
        e.stopPropagation();
        if (!isReady || startBtn.disabled || startBtn.classList.contains('is-loading')) return;
        startBtn.classList.add('is-loading');
        startBtn.disabled = true;
        startBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ENTRANDO NA ARENA...';
        if (typeof document !== 'undefined') {
          const flash = document.createElement('div');
          flash.className = 'battle-launch-overlay';
          document.body.appendChild(flash);
          setTimeout(() => flash.remove(), 750);
        }
        try {
          await onStart();
        } catch (error) {
          startBtn.classList.remove('is-loading');
          startBtn.disabled = false;
          startBtn.innerHTML = '<i class="fa-solid fa-play"></i> INICIAR BATALHA';
          alert(error.message);
        }
      };
    }
  };

  View.prototype.renderPicker = function () {
    const roster = this.manager.getRoster();
    const master = this.pending && this.pending.kind === 'MASTER' ? this.manager.getMaster(this.pending.id) : null;
    const trial = trialInfo(this.pending && this.pending.kind);
    const guide = master ? C.getTypeGuide(master.type) : null;
    const typeList = types => types.length ? `<div class="type-guide-list">${types.map(type => `<span class="type-guide-chip type-${type}">${C.TYPE_ICONS[type]} ${C.TYPE_LABELS[type]}</span>`).join('')}</div>` : '<p class="type-guide-empty">Normal não possui vantagem Super Efetiva por tipo.</p>';
    let context;
    if (master) {
      context = `<section class="master-context">${portrait(C.getMasterVisual(master.challengeId))}<p class="eyebrow">PREPARAR DESAFIO</p><h2>${master.trainerName}</h2><p>${master.trainerTitle}</p><p><strong>Tipo:</strong> ${C.TYPE_LABELS[master.type]} · <strong>${master.badgeName}</strong></p></section><section class="type-guide" aria-label="Guia do tipo ${guide.label}"><h3>GUIA DO TIPO — ${guide.label.toUpperCase()}</h3><p><strong>${guide.label} é forte contra:</strong></p>${typeList(guide.offensiveStrengths)}<p><strong>${guide.label} é fraca contra:</strong></p>${typeList(guide.defensiveWeaknesses)}<p class="type-guide-disclaimer">Tipos secundários podem alterar essas relações.</p></section>`;
    } else if (trial) {
      context = `<section class="master-context trial-context"><p class="eyebrow">PROVA ESPECIAL</p><h2>${trial.title}</h2><p>Equipe adversária possui múltiplos tipos.</p><div class="mini-team">${trial.team.map(p => `<img src="${p.sprite}" alt="${this.cap(p.name)}">`).join('')}</div></section>`;
    } else {
      const shadow = this.pending && this.pending.kind === 'SHADOW';
      context = `<div class="campaign-hero">${portrait(C.getSpecialTrainerVisual(shadow ? 'SHADOW' : 'SUPER'))}<p class="eyebrow">PREPARAR DESAFIO</p><h2>${shadow ? 'Desafio Final' : 'Super Treinador'}</h2></div>`;
    }
    const isReady = this.pick.length === 3;
    const countText = isReady ? 'Equipe completa (3/3) — Pronto para a batalha!' : `Selecione mais ${3 - this.pick.length} Pokémon (${this.pick.length}/3)`;
    this.container.innerHTML = `<section class="campaign-shell"><button id="pickerBack" class="campaign-secondary">← Voltar</button>${context}<div class="campaign-hero picker-choice"><h2>Escolha exatamente 3 Pokémon</h2><p>O primeiro selecionado será o líder. ${this.pick.length}/3 selecionados.</p></div><div class="campaign-grid draft-grid">${roster.map(p => this.card(p, this.pick.includes(p.id))).join('')}</div><div class="picker-action-bar" id="pickerActionBar"><div class="picker-status-hint ${isReady ? 'complete' : 'incomplete'}"><i class="fa-solid ${isReady ? 'fa-circle-check' : 'fa-circle-info'}"></i><span>${countText}</span></div><button id="startCampaignBattle" class="campaign-primary ${isReady ? 'ready-to-battle' : ''}" ${this.pick.length === 3 ? '' : 'disabled'}>${isReady ? '<i class="fa-solid fa-play"></i> INICIAR BATALHA' : `<i class="fa-solid fa-lock"></i> Iniciar batalha (${this.pick.length}/3)`}</button></div></section>`;
    this.container.querySelector('#pickerBack').onclick = () => { this.pending = null; this.render(); };
    this.container.querySelectorAll('.campaign-mon').forEach(button => button.onclick = () => {
      const id = Number(button.dataset.id);
      this.pick = this.pick.includes(id) ? this.pick.filter(value => value !== id) : (this.pick.length < 3 ? [...this.pick, id] : this.pick);
      this.render();
    });
    this.setupBattleStart(isReady, 3, async () => {
      await this.coordinator.start(this.pending.kind, this.pending.id, this.pick);
      this.pending = null;
      window.switchAppTab('battle');
    });
  };

  View.prototype.renderReward = function (reward) {
    const candidates = this.manager.getRewardCandidates();
    const trial = trialInfo(reward.kind);
    const title = trial ? trial.reward : reward.kind === 'SUPER' ? 'Escolha um Pokémon de elite' : 'Escolha seu novo recruta';
    const visual = reward.kind === 'MASTER' ? C.getMasterVisual(reward.challengeId) : reward.kind === 'SUPER' ? C.getSpecialTrainerVisual('SUPER') : null;
    this.container.innerHTML = `<section class="campaign-shell"><div class="campaign-hero">${portrait(visual, 'SMALL')}<p class="eyebrow">RECOMPENSA</p><h2>${title}</h2><p>Esta decisão é permanente.</p></div><div class="campaign-grid draft-grid">${candidates.map(candidate => { const p = C.byId(candidate.id); return `<button class="campaign-mon ${candidate.owned ? 'owned' : ''}" data-id="${candidate.id}" ${candidate.owned ? 'disabled' : ''}><img src="${p.sprite}" alt="${this.cap(p.name)}"><strong>${this.cap(p.name)}</strong><span>${p.types.map(type => `<i class="type-chip type-${type}">${type}</i>`).join('')}</span><small>${candidate.owned ? 'JÁ NO ELENCO' : 'Selecionar'}</small></button>`; }).join('')}</div></section>`;
    this.container.querySelectorAll('.campaign-mon:not(:disabled)').forEach(button => button.onclick = () => { if (confirm('Confirmar este recruta?')) this.manager.claimReward(Number(button.dataset.id)); });
  };
})();
/* PBA-015F — presentation-only endgame boss headers. */
(function () {
  const View = window.PBACampaign && window.PBACampaign.CampaignView;
  if (!View) return;
  const C = window.PBACampaign;
  const cap = value => String(value).replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  const preview = (team, className = '') => `<section class="opponent-team-preview ${className}" aria-label="Equipe adversária"><p class="eyebrow">EQUIPE ADVERSÁRIA</p><div class="opponent-team-preview__grid">${team.map(pokemon => `<article class="opponent-preview-card"><img src="${pokemon.sprite}" alt="${cap(pokemon.name)}"><strong>${cap(pokemon.name)}</strong><span>${pokemon.types.map(type => `<i class="type-chip type-${type}">${type}</i>`).join('')}</span><small>BST ${pokemon.bst}</small></article>`).join('')}</div></section>`;
  const portrait = () => C.renderTrainerAvatar(C.getSpecialTrainerVisual('SUPER'), { size: 'LARGE', shape: 'PORTRAIT', decorative: true });


  const previousPicker = View.prototype.renderPicker;
  View.prototype.renderPicker = function () {
    const kind = this.pending && this.pending.kind;
    if (kind !== 'SUPER' && kind !== 'LEGENDARY_TRIAL' && kind !== 'MYTHICAL_TRIAL') return previousPicker.call(this);
    const roster = this.manager.getRoster();
    const trial = kind === 'LEGENDARY_TRIAL'
      ? { title: 'PROVA LENDÁRIA', team: C.LEGENDARY_TRIAL_TEAM }
      : kind === 'MYTHICAL_TRIAL'
        ? { title: 'PROVA MÍTICA', team: C.MYTHICAL_TRIAL_TEAM }
        : null;
    const isSuper = kind === 'SUPER';
    const header = isSuper
      ? `<section class="campaign-preparation campaign-preparation--super">${portrait()}<div class="campaign-preparation__copy"><p class="eyebrow">PREPARAR DESAFIO FINAL</p><h2>SUPER TREINADOR</h2><p>O Mestre dos Mais Fortes</p><strong class="boss-difficulty">DIFICULDADE: EXTREMA</strong></div>${preview(C.SUPER_TEAM)}</section>`
      : `<section class="campaign-preparation campaign-preparation--trial"><div class="campaign-preparation__copy"><p class="eyebrow">PROVA ESPECIAL</p><h2>${trial.title}</h2><p>Equipe adversária possui múltiplos tipos.</p></div>${preview(trial.team)}</section>`;
    const isReady = this.pick.length === 3;
    const countText = isReady ? 'Equipe completa (3/3) — Pronto para a batalha!' : `Selecione mais ${3 - this.pick.length} Pokémon (${this.pick.length}/3)`;
    this.container.innerHTML = `<section class="campaign-shell"><button id="pickerBack" class="campaign-secondary">← Voltar</button>${header}<div class="campaign-hero picker-choice"><h2>Escolha exatamente 3 Pokémon</h2><p>O primeiro selecionado será o líder. ${this.pick.length}/3 selecionados.</p></div><div class="campaign-grid draft-grid">${roster.map(pokemon => this.card(pokemon, this.pick.includes(pokemon.id))).join('')}</div><div class="picker-action-bar" id="pickerActionBar"><div class="picker-status-hint ${isReady ? 'complete' : 'incomplete'}"><i class="fa-solid ${isReady ? 'fa-circle-check' : 'fa-circle-info'}"></i><span>${countText}</span></div><button id="startCampaignBattle" class="campaign-primary ${isReady ? 'ready-to-battle' : ''}" ${this.pick.length === 3 ? '' : 'disabled'}>${isReady ? '<i class="fa-solid fa-play"></i> INICIAR BATALHA' : `<i class="fa-solid fa-lock"></i> Iniciar batalha (${this.pick.length}/3)`}</button></div></section>`;
    this.container.querySelector('#pickerBack').onclick = () => { this.pending = null; this.render(); };
    this.container.querySelectorAll('.campaign-mon').forEach(button => button.onclick = () => {
      const id = Number(button.dataset.id);
      this.pick = this.pick.includes(id) ? this.pick.filter(value => value !== id) : (this.pick.length < 3 ? [...this.pick, id] : this.pick);
      this.render();
    });
    this.setupBattleStart(isReady, 3, async () => {
      await this.coordinator.start(this.pending.kind, this.pending.id, this.pick);
      this.pending = null;
      window.switchAppTab('battle');
    });
  };
})();
/* PBA-015G — two additional optional elite trials, presentation reuses PBA-015F. */
(function () {
  const View = window.PBACampaign && window.PBACampaign.CampaignView;
  if (!View) return;
  const C = window.PBACampaign;
  const cap = value => String(value).replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  const trial = {
    LEGENDARY_TRIAL: { key: 'legendary', title: 'PROVA LENDÁRIA', label: 'Prova Lendária', team: C.LEGENDARY_TRIAL_TEAM, difficulty: 'DIFÍCIL' },
    MYTHICAL_TRIAL: { key: 'mythical', title: 'PROVA MÍTICA', label: 'Prova Mítica', team: C.MYTHICAL_TRIAL_TEAM, difficulty: 'DIFÍCIL' },
    TITANS_TRIAL: { key: 'titans', title: 'PROVA DOS TITÃS', label: 'Prova dos Titãs', team: C.TITANS_TRIAL_TEAM, difficulty: 'MUITO DIFÍCIL' },
    CELESTIAL_TRIAL: { key: 'celestial', title: 'PROVA CELESTIAL', label: 'Prova Celestial', team: C.CELESTIAL_TRIAL_TEAM, difficulty: 'MUITO DIFÍCIL' }
  };
  const preview = team => `<section class="opponent-team-preview" aria-label="Equipe adversária"><p class="eyebrow">EQUIPE ADVERSÁRIA</p><div class="opponent-team-preview__grid">${team.map(pokemon => `<article class="opponent-preview-card"><img src="${pokemon.sprite}" alt="${cap(pokemon.name)}"><strong>${cap(pokemon.name)}</strong><span>${pokemon.types.map(type => `<i class="type-chip type-${type}">${type}</i>`).join('')}</span><small>BST ${pokemon.bst}</small></article>`).join('')}</div></section>`;
  const card = (kind, definition, state) => `<article class="endgame-trial endgame-trial--${definition.key}"><h3>${definition.title}</h3><p>Desafio opcional de elite para ampliar seu elenco estratégico.</p><small class="trial-difficulty">DIFICULDADE: ${definition.difficulty}</small><strong>${state.rewardClaimed ? 'CONCLUÍDA' : state.completed ? 'VITÓRIA — RECOMPENSA PENDENTE' : 'RECOMPENSA DISPONÍVEL'}</strong><button class="campaign-secondary" data-trial="${kind}">${state.rewardClaimed ? 'REENFRENTAR' : state.completed ? 'ESCOLHER RECOMPENSA' : 'ENFRENTAR'}</button></article>`;

  const renderPicker = View.prototype.renderPicker;
  View.prototype.renderPicker = function () {
    const definition = trial[this.pending && this.pending.kind];
    if (!definition) return renderPicker.call(this);

    const roster = this.manager.getRoster();
    const ownedIds = new Set(this.manager.getRosterIds());
    const trialState = this.manager.getState().endgameTrials?.[definition.key] || {};
    const isRewardClaimed = Boolean(trialState.rewardClaimed);

    const selectedOpponentId = (this.pending.opponentId !== undefined && this.pending.opponentId !== null)
      ? Number(this.pending.opponentId) : null;
    const selectedOpponent = selectedOpponentId ? definition.team.find(p => p.id === selectedOpponentId) : null;
    const hasValidOpponent = Boolean(selectedOpponent && (isRewardClaimed || !ownedIds.has(selectedOpponent.id)));

    const candidateCards = definition.team.map(pokemon => {
      const isOwned = ownedIds.has(pokemon.id);
      const isSelected = selectedOpponentId === pokemon.id;
      const isUnavailable = !isRewardClaimed && isOwned;
      const badge = isSelected
        ? '<span class="trial-candidate-badge selected"><i class="fa-solid fa-circle-check"></i> ADVERSÁRIO ESCOLHIDO</span>'
        : isUnavailable
          ? '<span class="trial-candidate-badge owned"><i class="fa-solid fa-lock"></i> JÁ NO ELENCO</span>'
          : '<span class="trial-candidate-badge available">Escolher como adversário</span>';

      return `<button type="button" class="opponent-preview-card trial-candidate-card ${isSelected ? 'selected' : ''} ${isUnavailable ? 'unavailable' : ''}" data-opponent-id="${pokemon.id}" ${isUnavailable ? 'disabled' : ''} aria-pressed="${isSelected}"><img src="${pokemon.sprite}" alt="${cap(pokemon.name)}" loading="lazy"><strong>${cap(pokemon.name)}</strong><span>${pokemon.types.map(type => `<i class="type-chip type-${type}">${type}</i>`).join('')}</span><small>BST ${pokemon.bst}</small><div class="trial-candidate-action">${badge}</div></button>`;
    }).join('');

    let rewardCallout = '';
    if (isRewardClaimed) {
      const claimedMon = C.byId(trialState.rewardPokemonId);
      rewardCallout = `<div class="trial-reward-callout claimed"><i class="fa-solid fa-trophy"></i> Recompensa desta Prova já resgatada (${claimedMon ? cap(claimedMon.name) : 'Pokémon'}). Esta batalha é uma revanche 3 contra 1 sem nova recompensa.</div>`;
    } else if (selectedOpponent) {
      rewardCallout = `<div class="trial-reward-callout highlight"><i class="fa-solid fa-gift"></i> <strong>Recompensa ao vencer: ${cap(selectedOpponent.name)}</strong> (confirme o resgate após a vitória para adicioná-lo ao seu elenco permanente).</div>`;
    } else {
      rewardCallout = `<div class="trial-reward-callout pending"><i class="fa-solid fa-circle-question"></i> <strong>Recompensa ao vencer:</strong> Escolha um dos três guardiões acima para definir sua recompensa.</div>`;
    }

    const previewSection = `<section class="opponent-team-preview" aria-label="Equipe adversária"><div class="opponent-team-preview__head"><p class="eyebrow">ESCOLHA SEU ADVERSÁRIO (1 DE 3)</p><p class="trial-instruction-text">Selecione o guardião que deseja enfrentar no formato <strong>3 contra 1</strong>.</p></div><div class="opponent-team-preview__grid">${candidateCards}</div>${rewardCallout}</section>`;

    const isReady = hasValidOpponent && this.pick.length === 3;
    const countText = !hasValidOpponent
      ? 'Selecione 1 adversário acima para enfrentar'
      : this.pick.length < 3
        ? `Selecione mais ${3 - this.pick.length} Pokémon (${this.pick.length}/3)`
        : `Equipe completa (3/3) contra ${cap(selectedOpponent.name)} — Pronto para a batalha!`;

    const btnText = isReady
      ? '<i class="fa-solid fa-play"></i> INICIAR BATALHA (3 vs 1)'
      : !hasValidOpponent
        ? '<i class="fa-solid fa-lock"></i> Selecione o adversário'
        : `<i class="fa-solid fa-lock"></i> Iniciar batalha (${this.pick.length}/3)`;

    this.container.innerHTML = `<section class="campaign-shell"><button id="pickerBack" class="campaign-secondary">← Voltar</button><section class="campaign-preparation campaign-preparation--trial"><div class="campaign-preparation__copy"><p class="eyebrow">PROVA ESPECIAL</p><h2>${definition.title}</h2><span class="trial-format-badge"><i class="fa-solid fa-shield-halved"></i> FORMATO: 3 CONTRA 1</span><p>Batalha tática de três Pokémon do seu elenco contra apenas o guardião escolhido.</p><strong class="trial-difficulty">DIFICULDADE: ${definition.difficulty}</strong></div>${previewSection}</section><div class="campaign-hero picker-choice"><h2>Escolha exatamente 3 Pokémon</h2><p>O primeiro selecionado será o líder. ${this.pick.length}/3 selecionados.</p></div><div class="campaign-grid draft-grid">${roster.map(pokemon => this.card(pokemon, this.pick.includes(pokemon.id))).join('')}</div><div class="picker-action-bar" id="pickerActionBar"><div class="picker-status-hint ${isReady ? 'complete' : 'incomplete'}"><i class="fa-solid ${isReady ? 'fa-circle-check' : 'fa-circle-info'}"></i><span>${countText}</span></div><button id="startCampaignBattle" class="campaign-primary ${isReady ? 'ready-to-battle' : ''}" ${isReady ? '' : 'disabled'}>${btnText}</button></div></section>`;

    this.container.querySelector('#pickerBack').onclick = () => { this.pending = null; this.pick = []; this.render(); };
    this.container.querySelectorAll('.trial-candidate-card:not(:disabled)').forEach(button => {
      button.onclick = () => {
        const id = Number(button.dataset.opponentId);
        this.pending.opponentId = (this.pending.opponentId === id) ? null : id;
        this.render();
      };
    });
    this.container.querySelectorAll('.draft-grid .campaign-mon').forEach(button => {
      button.onclick = () => {
        const id = Number(button.dataset.id);
        this.pick = this.pick.includes(id) ? this.pick.filter(value => value !== id) : (this.pick.length < 3 ? [...this.pick, id] : this.pick);
        this.render();
      };
    });
    this.setupBattleStart(isReady, 3, async () => {
      try {
        if (!hasValidOpponent) throw new Error('Selecione um adversário válido.');
        if (this.pick.length !== 3) throw new Error('Selecione exatamente 3 Pokémon.');
        await this.coordinator.start(this.pending.kind, selectedOpponent.id, this.pick, { opponentId: selectedOpponent.id, opponentPokemonId: selectedOpponent.id });
        this.pending = null;
        window.switchAppTab('battle');
      } catch (error) { alert(error.message); }
    });
  };

  const renderReward = View.prototype.renderReward;
  View.prototype.renderReward = function (reward) {
    const definition = trial[reward && reward.kind];
    if (!definition) return renderReward.call(this, reward);

    const candidates = this.manager.getRewardCandidates();
    if (candidates.length === 1) {
      const candidate = candidates[0];
      const p = C.byId(candidate.id);
      this.container.innerHTML = `
        <section class="campaign-shell">
          <div class="campaign-hero">
            <p class="eyebrow">RECOMPENSA DA PROVA CONQUISTADA</p>
            <h2>${definition.label}: ${cap(p.name)}</h2>
            <p>Você venceu o desafio 3 contra 1 e conquistou exatamente o Pokémon enfrentado. Não há escolha adicional.</p>
          </div>
          <div class="trial-reward-confirm-container">
            <div class="campaign-mon trial-single-reward-card">
              <img src="${p.sprite}" alt="${cap(p.name)}">
              <strong>${cap(p.name)}</strong>
              <span>${p.types.map(type => `<i class="type-chip type-${type}">${type}</i>`).join('')}</span>
              <small>BST ${p.bst}</small>
              <button id="btnClaimTrialReward" class="campaign-primary ready-to-battle" style="margin-top: 1rem; width: 100%;">
                <i class="fa-solid fa-gift"></i> Confirmar e Resgatar ${cap(p.name)}
              </button>
            </div>
          </div>
        </section>
      `;
      this.container.querySelector('#btnClaimTrialReward').onclick = () => {
        if (confirm(`Confirmar o resgate de ${cap(p.name)} para o seu elenco permanente?`)) {
          this.manager.claimReward(p.id);
        }
      };
      return;
    }

    renderReward.call(this, reward);
    this.container.querySelector('.campaign-hero h2').textContent = `Escolha seu Pokémon — ${definition.label}`;
  };
})();
/* PBA-015H — Shadow presentation only; no campaign or battle rules are changed. */
(function () {
  const View = window.PBACampaign && window.PBACampaign.CampaignView;
  if (!View) return;
  const C = window.PBACampaign;
  const cap = value => String(value).replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  const team = C.SUPER_TEAM;
  const preview = `<section class="opponent-team-preview shadow-team-preview" aria-label="Equipe adversária Shadow"><p class="eyebrow">EQUIPE ADVERSÁRIA</p><div class="opponent-team-preview__grid">${team.map(pokemon => `<article class="opponent-preview-card"><img src="${pokemon.sprite}" alt="${cap(pokemon.name)}"><strong>${cap(pokemon.name)}</strong><span>${pokemon.types.map(type => `<i class="type-chip type-${type}">${type}</i>`).join('')}</span><small>BST ${pokemon.bst}</small></article>`).join('')}</div></section>`;
  const portrait = () => C.renderTrainerAvatar(C.getSpecialTrainerVisual('SHADOW'), { size: 'LARGE', shape: 'PORTRAIT', decorative: true });
  const aura = '<aside class="shadow-aura-callout" role="note"><strong>AURA SOMBRIA</strong><span>Todos os ataques inimigos são no mínimo Super Efetivos.</span></aside>';
  /* shadow-spotlight presentation is delegated to CampaignMapView */
  const renderPicker = View.prototype.renderPicker;
  View.prototype.renderPicker = function () {
    if (!this.pending || this.pending.kind !== 'SHADOW') return renderPicker.call(this);
    const roster = this.manager.getRoster();
    const isReady = this.pick.length === 3;
    const countText = isReady ? 'Equipe completa (3/3) — Pronto para o confronto final!' : `Selecione mais ${3 - this.pick.length} Pokémon (${this.pick.length}/3)`;
    this.container.innerHTML = `<section class="campaign-shell"><button id="pickerBack" class="campaign-secondary">← Voltar</button><section class="campaign-preparation campaign-preparation--shadow">${portrait()}<div class="campaign-preparation__copy"><p class="eyebrow">PREPARAR DESAFIO FINAL</p><h2>SHADOW SUPER TRAINER</h2><p>O verdadeiro desafio final.</p>${aura}</div>${preview}</section><div class="campaign-hero picker-choice"><h2>Escolha exatamente 3 Pokémon</h2><p>O primeiro selecionado será o líder. ${this.pick.length}/3 selecionados.</p></div><div class="campaign-grid draft-grid">${roster.map(pokemon => this.card(pokemon, this.pick.includes(pokemon.id))).join('')}</div><div class="picker-action-bar" id="pickerActionBar"><div class="picker-status-hint ${isReady ? 'complete' : 'incomplete'}"><i class="fa-solid ${isReady ? 'fa-circle-check' : 'fa-circle-info'}"></i><span>${countText}</span></div><button id="startCampaignBattle" class="campaign-danger ${isReady ? 'ready-to-battle' : ''}" ${this.pick.length === 3 ? '' : 'disabled'}>${isReady ? '<i class="fa-solid fa-skull"></i> Iniciar desafio final' : `<i class="fa-solid fa-lock"></i> Iniciar desafio final (${this.pick.length}/3)`}</button></div></section>`;
    this.container.querySelector('#pickerBack').onclick = () => { this.pending = null; this.render(); };
    this.container.querySelectorAll('.campaign-mon').forEach(button => button.onclick = () => { const id = Number(button.dataset.id); this.pick = this.pick.includes(id) ? this.pick.filter(value => value !== id) : (this.pick.length < 3 ? [...this.pick, id] : this.pick); this.render(); });
    this.setupBattleStart(isReady, 3, async () => { try { await this.coordinator.start(this.pending.kind, this.pending.id, this.pick); this.pending = null; window.switchAppTab('battle'); } catch (error) { alert(error.message); } });
  };
})();
/* PBA-015I — Final Stand narrative and one-leader preparation. */
(function () {
  const View = window.PBACampaign && window.PBACampaign.CampaignView;
  if (!View) return;
  const C = window.PBACampaign;
  const cap = value => String(value).replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  const portrait = () => C.renderTrainerAvatar(C.getSpecialTrainerVisual('SHADOW'), { size: 'LARGE', shape: 'PORTRAIT', decorative: true });
  const aura = '<aside class="shadow-aura-callout" role="note"><strong>AURA SOMBRIA</strong><span>Todos os ataques inimigos são no mínimo Super Efetivos.</span></aside>';
  const enemyPreview = () => `<section class="opponent-team-preview shadow-team-preview" aria-label="Equipe adversária Shadow"><p class="eyebrow">EQUIPE ADVERSÁRIA</p><div class="opponent-team-preview__grid">${C.SUPER_TEAM.map(pokemon => `<article class="opponent-preview-card"><img src="${pokemon.sprite}" alt="${cap(pokemon.name)}"><strong>${cap(pokemon.name)}</strong><span>${pokemon.types.map(type => `<i class="type-chip type-${type}">${type}</i>`).join('')}</span></article>`).join('')}</div></section>`;
  const render = View.prototype.render;
  View.prototype.render = function () {
    const state = this.manager.getState();
    if (state.status === 'SHADOW_AVAILABLE' && state.shadowTrainer.revealed && state.shadowTrainer.revealSeen && !state.shadowTrainer.reinforcementsSeen && !this.pending) {
      const guests = this.manager.getShadowGuests();
      this.container.innerHTML = `<section class="campaign-shell shadow-reinforcements"><section class="campaign-preparation campaign-preparation--shadow">${portrait()}<div class="campaign-preparation__copy"><p class="eyebrow">ANOMALIA CRÍTICA</p><h2>REFORÇOS CHEGARAM</h2><p>Os Pokémon das Provas retornaram para lutar ao seu lado.</p>${aura}</div></section><section class="final-stand-rule" role="note"><strong>BATALHA FINAL — REGRA ESPECIAL</strong><span>Todos os Pokémon do seu elenco poderão lutar. Quando um cair, escolha o próximo.</span></section><h3>REFORÇOS TEMPORÁRIOS — ${guests.length}</h3><div class="campaign-grid draft-grid guest-grid">${guests.map(pokemon => `<article class="campaign-mon guest-card"><img src="${pokemon.sprite}" alt="${cap(pokemon.name)}"><strong>${cap(pokemon.name)}</strong><span>${pokemon.types.map(type => `<i class="type-chip type-${type}">${type}</i>`).join('')}</span><small>REFORÇO TEMPORÁRIO · ${pokemon.trialLabel}</small></article>`).join('') || '<p>Nenhuma Prova concluída ainda. Seu elenco permanente continua disponível.</p>'}</div><button id="ackShadowReinforcements" class="campaign-danger">PREPARAR O FINAL STAND</button></section>`;
      this.container.querySelector('#ackShadowReinforcements').onclick = () => this.manager.acknowledgeShadowReinforcements();
      return;
    }
    return render.call(this);
  };
  const renderPicker = View.prototype.renderPicker;
  View.prototype.renderPicker = function () {
    if (!this.pending || this.pending.kind !== 'SHADOW') return renderPicker.call(this);
    const permanent = this.manager.getRoster();
    const guests = this.manager.getShadowGuests();
    const army = [...permanent, ...guests];
    const selected = this.pick[0];
    const armyCard = pokemon => `<button class="campaign-mon ${selected === pokemon.id ? 'selected' : ''} ${pokemon.temporary ? 'guest-card' : ''}" data-id="${pokemon.id}"><img src="${pokemon.sprite}" alt="${cap(pokemon.name)}"><strong>${cap(pokemon.name)}</strong><span>${pokemon.types.map(type => `<i class="type-chip type-${type}">${type}</i>`).join('')}</span><small>${pokemon.temporary ? `REFORÇO · ${pokemon.trialLabel}` : 'ELENCO PERMANENTE'}</small></button>`;
    const isReady = Boolean(selected);
    const countText = isReady ? 'Líder selecionado — Pronto para o Final Stand!' : 'Selecione 1 Líder para seu exército';
    this.container.innerHTML = `<section class="campaign-shell"><button id="pickerBack" class="campaign-secondary">← Voltar</button><section class="campaign-preparation campaign-preparation--shadow">${portrait()}<div class="campaign-preparation__copy"><p class="eyebrow">PREPARAR DESAFIO FINAL</p><h2>SHADOW SUPER TRAINER</h2><p>O verdadeiro desafio final.</p>${aura}</div>${enemyPreview()}</section><section class="final-stand-army"><p class="eyebrow">SEU EXÉRCITO</p><strong>Pokémon permanentes: ${permanent.length}</strong><strong>Reforços temporários: ${guests.length}</strong><strong>Total disponível: ${army.length}</strong></section><div class="campaign-hero picker-choice"><h2>ESCOLHA SEU LÍDER</h2><p>Todos os demais Pokémon disponíveis entrarão como reservas. ${selected ? 'Líder selecionado.' : 'Selecione 1 Pokémon.'}</p></div><div class="campaign-grid draft-grid final-stand-army-grid">${army.map(armyCard).join('')}</div><div class="picker-action-bar" id="pickerActionBar"><div class="picker-status-hint ${isReady ? 'complete' : 'incomplete'}"><i class="fa-solid ${isReady ? 'fa-circle-check' : 'fa-circle-info'}"></i><span>${countText}</span></div><button id="startCampaignBattle" class="campaign-danger ${isReady ? 'ready-to-battle' : ''}" ${selected ? '' : 'disabled'}>${isReady ? '<i class="fa-solid fa-shield-halved"></i> INICIAR FINAL STAND' : '<i class="fa-solid fa-lock"></i> SELECIONE O LÍDER'}</button></div></section>`;
    this.container.querySelector('#pickerBack').onclick = () => { this.pending = null; this.pick = []; this.render(); };
    this.container.querySelectorAll('.campaign-mon').forEach(button => button.onclick = () => { this.pick = [Number(button.dataset.id)]; this.render(); });
    this.setupBattleStart(isReady, 1, async () => { try { await this.coordinator.start('SHADOW', null, this.pick); this.pending = null; window.switchAppTab('battle'); } catch (error) { alert(error.message); } });
  };
})();
