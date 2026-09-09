(function(){
 class CampaignView { constructor({manager,coordinator,container}){this.manager=manager;this.coordinator=coordinator;this.container=container||document.getElementById('campaignView');this.draft=[];this.pick=[];this.pending=null;manager.onChange(()=>this.render())} cap(s){return String(s).replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())} render(){if(!this.container)return;const d=this.manager.getState();if(!this.manager.isStarted())return this.renderDraft();if(d.pendingReward)return this.renderReward(d.pendingReward);if(d.status==='COMPLETED')return this.renderComplete();if(this.pending)return this.renderPicker();this.renderHome()} card(p,selected=false){return `<button class="campaign-mon ${selected?'selected':''}" data-id="${p.id}" aria-pressed="${selected}"><img src="${p.sprite}" alt="${p.name}"><strong>${this.cap(p.name)}</strong><span>${p.types.map(t=>`<i class="type-chip type-${t}">${t}</i>`).join('')}</span><small>BST ${p.bst}</small></button>`} renderDraft(){const C=window.PBACampaign;this.container.innerHTML=`<section class="campaign-shell"><div class="campaign-hero"><p class="eyebrow">NOVA JORNADA</p><h2>Circuito dos Mestres</h2><p>Escolha 6 Pokémon para começar sua campanha. Essa escolha será permanente. Novos Pokémon só entram no elenco derrotando Mestres.</p><strong>Selecionados ${this.draft.length}/6</strong></div><div class="campaign-grid draft-grid">${C.DRAFT.map(p=>this.card(p,this.draft.includes(p.id))).join('')}</div><button id="campaignConfirmDraft" class="campaign-primary" ${this.draft.length===6?'':'disabled'}>Confirmar equipe</button></section>`;this.container.querySelectorAll('.campaign-mon').forEach(b=>b.onclick=()=>{const id=Number(b.dataset.id);this.draft=this.draft.includes(id)?this.draft.filter(x=>x!==id):(this.draft.length<6?[...this.draft,id]:this.draft);this.render()});this.container.querySelector('#campaignConfirmDraft').onclick=()=>{if(confirm('Esses serão seus 6 Pokémon iniciais. Depois de iniciar a campanha, eles não poderão ser trocados. Deseja continuar?'))this.manager.start(this.draft)}} renderHome(){const C=window.PBACampaign,d=this.manager.getState(),badges=this.manager.getBadgeCount(),roster=this.manager.getRoster();const masters=C.MASTERS.map(m=>{const done=d.challenges[m.challengeId]?.badgeEarned;return `<article class="master-card ${done?'completed is-defeated':'pending is-undefeated'}"><div class="master-card-header"><span class="badge-orb ${done?'earned':'locked'} type-${m.type}" title="${done?'Insígnia '+m.badgeName+' Conquistada':'Insígnia '+m.badgeName+' Pendente'}">✦</span><span class="type-label type-${m.type}">${m.type}</span><span class="master-status-tag ${done?'completed':'pending'}">${done?'<i class="fa-solid fa-trophy"></i> DERROTADO':'<i class="fa-solid fa-bolt"></i> DESAFIAR'}</span></div><h3>${m.trainerName}</h3><p class="master-trainer-title">${m.trainerTitle}</p><p class="master-badge-name ${done?'earned':'locked'}">${done?'<i class="fa-solid fa-check"></i> ':'<i class="fa-solid fa-lock"></i> '}${m.badgeName} · ${'★'.repeat(m.difficulty)}</p><div class="mini-team">${m.team.map(x=>`<img src="${x.sprite}" alt="${x.name}">`).join('')}</div><button data-master="${m.challengeId}" class="campaign-btn ${done?'campaign-secondary campaign-btn-rematch':'campaign-primary campaign-btn-challenge'}">${done?'<i class="fa-solid fa-rotate-right"></i> Revanche':'<i class="fa-solid fa-bolt"></i> Desafiar'}</button></article>`}).join('');let extra='';if(d.status==='SUPER_AVAILABLE')extra='<button id="superChallenge" class="campaign-primary">Enfrentar Super Treinador</button>';if(d.status==='SHADOW_AVAILABLE')extra='<button id="shadowChallenge" class="campaign-danger">Um desafio final secreto aguarda</button>';this.container.innerHTML=`<section class="campaign-shell"><div class="campaign-hero"><p class="eyebrow">CIRCUITO DOS MESTRES</p><h2>Insígnias: ${badges}/18</h2><p>Elenco: ${roster.length} Pokémon</p><div class="campaign-roster">${roster.map(x=>`<img src="${x.sprite}" title="${x.name}" alt="${x.name}">`).join('')}</div></div><div class="badge-grid">${C.MASTERS.map(m=>`<span class="badge-orb ${d.challenges[m.challengeId]?.badgeEarned?'earned':'locked'} type-${m.type}" title="${m.badgeName}">✦</span>`).join('')}</div>${extra}<div class="campaign-grid">${masters}</div><button id="campaignReset" class="campaign-reset">Resetar campanha</button></section>`;this.container.querySelectorAll('[data-master]').forEach(b=>b.onclick=()=>{this.pending={kind:'MASTER',id:b.dataset.master};this.pick=[];this.render()});const s=this.container.querySelector('#superChallenge');if(s)s.onclick=()=>{this.pending={kind:'SUPER',id:null};this.pick=[];this.render()};const sh=this.container.querySelector('#shadowChallenge');if(sh)sh.onclick=()=>{this.pending={kind:'SHADOW',id:null};this.pick=[];this.render()};this.container.querySelector('#campaignReset').onclick=()=>{if(confirm('Resetar somente o progresso da campanha? Seu Perfil, Meu Time e preferências serão preservados.'))this.manager.reset()}} renderPicker(){const roster=this.manager.getRoster();this.container.innerHTML=`<section class="campaign-shell"><button id="pickerBack" class="campaign-secondary">← Voltar</button><div class="campaign-hero"><p class="eyebrow">PREPARAR DESAFIO</p><h2>Escolha exatamente 3 Pokémon</h2><p>O primeiro selecionado será o líder. ${this.pick.length}/3 selecionados.</p></div><div class="campaign-grid draft-grid">${roster.map(p=>this.card(p,this.pick.includes(p.id))).join('')}</div><button id="startCampaignBattle" class="campaign-primary" ${this.pick.length===3?'':'disabled'}>Iniciar batalha</button></section>`;this.container.querySelector('#pickerBack').onclick=()=>{this.pending=null;this.render()};this.container.querySelectorAll('.campaign-mon').forEach(b=>b.onclick=()=>{const id=Number(b.dataset.id);this.pick=this.pick.includes(id)?this.pick.filter(x=>x!==id):(this.pick.length<3?[...this.pick,id]:this.pick);this.render()});this.container.querySelector('#startCampaignBattle').onclick=async()=>{try{await this.coordinator.start(this.pending.kind,this.pending.id,this.pick);this.pending=null;window.switchAppTab('battle')}catch(e){alert(e.message)}}} renderReward(reward){const C=window.PBACampaign;this.container.innerHTML=`<section class="campaign-shell"><div class="campaign-hero"><p class="eyebrow">RECOMPENSA</p><h2>Escolha seu novo recruta</h2><p>Esta decisão é permanente.</p></div><div class="campaign-grid draft-grid">${reward.candidates.map(id=>this.card(C.byId(id))).join('')}</div></section>`;this.container.querySelectorAll('.campaign-mon').forEach(b=>b.onclick=()=>{if(confirm('Confirmar este recruta?'))this.manager.claimReward(Number(b.dataset.id))})} renderComplete(){this.container.innerHTML='<section class="campaign-shell"><div class="campaign-hero"><p class="eyebrow">JORNADA CONCLUÍDA</p><h2>True Ending</h2><p>Você dominou o Circuito dos Mestres e deixou sua marca.</p></div><button id="campaignReset" class="campaign-reset">Resetar campanha</button></section>';this.container.querySelector('#campaignReset').onclick=()=>{if(confirm('Resetar somente a campanha?'))this.manager.reset()}}
 }
 const api={CampaignView};if(typeof module!=='undefined'&&module.exports)module.exports=api;else{window.PBACampaign=window.PBACampaign||{};Object.assign(window.PBACampaign,api)}
})();
(function(){
 const View=window.PBACampaign&&window.PBACampaign.CampaignView;if(!View)return;
 View.prototype.filterDraft=function(items,query,generation,type){const q=String(query||'').trim().toLowerCase();return items.filter(p=>(!q||p.name.includes(q)||String(p.id)===q)&&(!generation||Number(p.generation)===Number(generation))&&(!type||p.types.includes(type)))};
 View.prototype.renderDraft=function(){const C=window.PBACampaign;this.draftQuery=this.draftQuery||'';this.draftGeneration=this.draftGeneration||'';this.draftType=this.draftType||'';const items=this.filterDraft(C.DRAFT,this.draftQuery,this.draftGeneration,this.draftType),chosen=this.draft.map(C.byId).filter(Boolean);this.container.innerHTML=`<section class="campaign-shell"><div class="campaign-hero"><p class="eyebrow">NOVA JORNADA</p><h2>Circuito dos Mestres</h2><p>Escolha seis Pokémon permanentes para começar.</p><div class="draft-tools"><input id="draftSearch" value="${this.draftQuery}" placeholder="Buscar nome ou número"><select id="draftGen"><option value="">Todas as gerações</option>${[1,2,3,4,5,6,7,8,9].map(g=>`<option value="${g}" ${String(g)===String(this.draftGeneration)?'selected':''}>Gen ${g}</option>`).join('')}</select><select id="draftType"><option value="">Todos os tipos</option>${['normal','fire','water','electric','grass','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy'].map(t=>`<option value="${t}" ${t===this.draftType?'selected':''}>${t}</option>`).join('')}</select></div><p>${items.length} Pokémon encontrados</p><h3>Seus Pokémon iniciais — ${this.draft.length}/6</h3><div class="campaign-roster">${chosen.map(p=>`<button class="draft-remove" data-remove="${p.id}"><img src="${p.sprite}" alt="${p.name}">${this.cap(p.name)} ×</button>`).join('')||'<span>Nenhum selecionado</span>'}</div></div><div id="draftMessage" role="status"></div><div class="campaign-grid draft-grid">${items.map(p=>this.card(p,this.draft.includes(p.id))).join('')}</div><button id="campaignConfirmDraft" class="campaign-primary" ${this.draft.length===6?'':'disabled'}>Confirmar equipe</button></section>`;const rerender=()=>this.renderDraft();this.container.querySelector('#draftSearch').oninput=e=>{this.draftQuery=e.target.value;rerender()};this.container.querySelector('#draftGen').onchange=e=>{this.draftGeneration=e.target.value;rerender()};this.container.querySelector('#draftType').onchange=e=>{this.draftType=e.target.value;rerender()};this.container.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{this.draft=this.draft.filter(x=>x!==Number(b.dataset.remove));rerender()});this.container.querySelectorAll('.campaign-mon').forEach(b=>b.onclick=()=>{const id=Number(b.dataset.id);if(this.draft.includes(id)){this.draft=this.draft.filter(x=>x!==id);return rerender()}if(this.draft.length===6)return;const candidate=[...this.draft,id];if(C.MASTERS.some(m=>m.team.every(p=>candidate.includes(p.id)))){this.container.querySelector('#draftMessage').textContent='Você pode começar com no máximo 2 Pokémon da equipe de um mesmo Mestre para garantir uma recompensa futura.';return}this.draft=candidate;rerender()});this.container.querySelector('#campaignConfirmDraft').onclick=()=>{if(confirm('Esses serão seus 6 Pokémon iniciais. Deseja continuar?')){const r=this.manager.start(this.draft);if(!r.ok)this.container.querySelector('#draftMessage').textContent='Não foi possível confirmar esta equipe.'}}};
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

  const renderHome = View.prototype.renderHome;
  View.prototype.renderHome = function () {
    renderHome.call(this);
    this.container.querySelectorAll('.master-card').forEach((card, index) => {
      const master = C.MASTERS[index];
      const visual = C.getMasterVisual(master.challengeId);
      card.insertAdjacentHTML('afterbegin', avatar(visual, 'MEDIUM', 'CIRCLE', 'CARD'));
    });
  };

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
(function(){const V=window.PBACampaign&&window.PBACampaign.CampaignView;if(!V)return;const prior=V.prototype.renderHome;V.prototype.renderHome=function(){prior.call(this);if(this.manager.getBadgeCount()!==18)return;const C=window.PBACampaign,d=this.manager.getState(),trials=d.endgameTrials||{};const card=(kind,label,copy)=>{const t=trials[kind==='LEGENDARY_TRIAL'?'legendary':'mythical']||{};const state=t.rewardClaimed?'CONCLUÍDA':t.completed?'VITÓRIA — RECOMPENSA PENDENTE':'RECOMPENSA DISPONÍVEL';return '<article class="endgame-trial"><h3>'+label+'</h3><p>'+copy+'</p><strong>'+state+'</strong><button class="campaign-secondary" data-trial="'+kind+'">'+(t.rewardClaimed?'REENFRENTAR':t.completed?'ESCOLHER RECOMPENSA':'ENFRENTAR')+'</button></article>'};const superAvatar=C.renderTrainerAvatar(C.getSpecialTrainerVisual('SUPER'),{size:'LARGE',shape:'PORTRAIT',decorative:true});const html='<section class="campaign-endgame"><div class="endgame-super">'+superAvatar+'<div><p class="eyebrow">DESAFIO FINAL</p><h2>SUPER TREINADOR</h2><p>O Mestre dos Mais Fortes. Arceus, Eternatus e Mewtwo aguardam.</p><strong>DIFICULDADE: EXTREMA</strong><button id="superSpotlight" class="campaign-primary">ENFRENTAR SUPER TREINADOR</button></div></div><p class="eyebrow">PREPARE-SE PARA O DESAFIO FINAL</p><div class="endgame-trials">'+card('LEGENDARY_TRIAL','PROVA LENDÁRIA','Derrote Pokémon Lendários e escolha um novo aliado.')+card('MYTHICAL_TRIAL','PROVA MÍTICA','Supere um desafio especial e escolha um Pokémon Mítico.')+'</div></section>';this.container.querySelector('#superChallenge')?.remove();this.container.querySelector('.campaign-grid').insertAdjacentHTML('beforebegin',html);this.container.querySelector('#superSpotlight').onclick=()=>{this.pending={kind:'SUPER',id:null};this.pick=[];this.render()};this.container.querySelectorAll('[data-trial]').forEach(b=>b.onclick=()=>{this.pending={kind:b.dataset.trial,id:null};this.pick=[];this.render()})}})();

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

  const renderHome = View.prototype.renderHome;
  View.prototype.renderHome = function () {
    renderHome.call(this);
    const boss = this.container.querySelector('.endgame-super');
    if (!boss) return;
    boss.innerHTML = `<div class="endgame-super__portrait">${portrait()}</div><div class="endgame-super__content"><p class="eyebrow">DESAFIO FINAL</p><h2>SUPER TREINADOR</h2><p>O Mestre dos Mais Fortes.</p><strong class="boss-difficulty">DIFICULDADE: EXTREMA</strong>${preview(C.SUPER_TEAM, 'opponent-team-preview--compact')}<button id="superSpotlight" class="campaign-primary">ENFRENTAR SUPER TREINADOR</button></div>`;
    this.container.querySelector('#superSpotlight').onclick = () => { this.pending = { kind: 'SUPER', id: null }; this.pick = []; this.render(); };
  };

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

  const renderHome = View.prototype.renderHome;
  View.prototype.renderHome = function () {
    renderHome.call(this);
    const container = this.container.querySelector('.endgame-trials');
    if (!container) return;
    const progress = this.manager.getState().endgameTrials || {};
    container.innerHTML = Object.entries(trial).map(([kind, definition]) => card(kind, definition, progress[definition.key] || {})).join('');
    this.container.querySelectorAll('[data-trial]').forEach(button => button.onclick = () => { this.pending = { kind: button.dataset.trial, id: null }; this.pick = []; this.render(); });
  };

  const renderPicker = View.prototype.renderPicker;
  View.prototype.renderPicker = function () {
    const definition = trial[this.pending && this.pending.kind];
    if (!definition) return renderPicker.call(this);
    const roster = this.manager.getRoster();
    const isReady = this.pick.length === 3;
    const countText = isReady ? 'Equipe completa (3/3) — Pronto para a batalha!' : `Selecione mais ${3 - this.pick.length} Pokémon (${this.pick.length}/3)`;
    this.container.innerHTML = `<section class="campaign-shell"><button id="pickerBack" class="campaign-secondary">← Voltar</button><section class="campaign-preparation campaign-preparation--trial"><div class="campaign-preparation__copy"><p class="eyebrow">PROVA ESPECIAL</p><h2>${definition.title}</h2><p>Equipe adversária possui múltiplos tipos.</p><strong class="trial-difficulty">DIFICULDADE: ${definition.difficulty}</strong></div>${preview(definition.team)}</section><div class="campaign-hero picker-choice"><h2>Escolha exatamente 3 Pokémon</h2><p>O primeiro selecionado será o líder. ${this.pick.length}/3 selecionados.</p></div><div class="campaign-grid draft-grid">${roster.map(pokemon => this.card(pokemon, this.pick.includes(pokemon.id))).join('')}</div><div class="picker-action-bar" id="pickerActionBar"><div class="picker-status-hint ${isReady ? 'complete' : 'incomplete'}"><i class="fa-solid ${isReady ? 'fa-circle-check' : 'fa-circle-info'}"></i><span>${countText}</span></div><button id="startCampaignBattle" class="campaign-primary ${isReady ? 'ready-to-battle' : ''}" ${this.pick.length === 3 ? '' : 'disabled'}>${isReady ? '<i class="fa-solid fa-play"></i> INICIAR BATALHA' : `<i class="fa-solid fa-lock"></i> Iniciar batalha (${this.pick.length}/3)`}</button></div></section>`;
    this.container.querySelector('#pickerBack').onclick = () => { this.pending = null; this.render(); };
    this.container.querySelectorAll('.campaign-mon').forEach(button => button.onclick = () => { const id = Number(button.dataset.id); this.pick = this.pick.includes(id) ? this.pick.filter(value => value !== id) : (this.pick.length < 3 ? [...this.pick, id] : this.pick); this.render(); });
    this.setupBattleStart(isReady, 3, async () => { try { await this.coordinator.start(this.pending.kind, this.pending.id, this.pick); this.pending = null; window.switchAppTab('battle'); } catch (error) { alert(error.message); } });
  };

  const renderReward = View.prototype.renderReward;
  View.prototype.renderReward = function (reward) {
    renderReward.call(this, reward);
    const definition = trial[reward && reward.kind];
    if (definition) this.container.querySelector('.campaign-hero h2').textContent = `Escolha seu Pokémon — ${definition.label}`;
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
  const renderHome = View.prototype.renderHome;
  View.prototype.renderHome = function () {
    renderHome.call(this);
    const state = this.manager.getState();
    if (!state.shadowTrainer.revealed || state.shadowTrainer.defeated || state.status !== 'SHADOW_AVAILABLE') return;
    const endgame = this.container.querySelector('.campaign-endgame');
    if (!endgame) return;
    endgame.querySelector('.endgame-super')?.classList.add('endgame-super--secondary');
    endgame.insertAdjacentHTML('afterbegin', `<section class="shadow-spotlight"><div class="shadow-spotlight__portrait">${portrait()}</div><div class="shadow-spotlight__content"><p class="eyebrow">DESAFIO FINAL VERDADEIRO</p><h2>SHADOW SUPER TRAINER</h2><p>O desafio ainda não terminou.</p>${aura}${preview}<button id="shadowSpotlight" class="campaign-danger">ENFRENTAR O DESAFIO FINAL</button></div></section>`);
    this.container.querySelector('#shadowChallenge')?.remove();
    this.container.querySelector('#shadowSpotlight').onclick = () => { this.pending = { kind: 'SHADOW', id: null }; this.pick = []; this.render(); };
  };
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
  const renderHome = View.prototype.renderHome;
  View.prototype.renderHome = function () {
    renderHome.call(this);
    const state = this.manager.getState();
    if (state.status !== 'SHADOW_AVAILABLE' || state.shadowTrainer.defeated) return;
    const spotlight = this.container.querySelector('.shadow-spotlight');
    if (spotlight) spotlight.querySelector('.shadow-spotlight__content')?.insertAdjacentHTML('beforeend', `<p class="shadow-reinforcement-count">REFORÇOS DISPONÍVEIS: ${this.manager.getShadowGuests().length}</p>`);
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