(function () {
  'use strict';

  let CatalogModule, ModelModule, VisualsModule;
  if (typeof module !== 'undefined' && module.exports) {
    CatalogModule = require('./campaign-map-catalog.js');
    ModelModule = require('./campaign-map-model.js');
    VisualsModule = require('./campaign-trainer-visuals.js');
  } else {
    CatalogModule = window.PBACampaign || {};
    ModelModule = window.PBACampaign || {};
    VisualsModule = window.PBACampaign || {};
  }

  const Catalog = CatalogModule.CAMPAIGN_MAP_CATALOG || CatalogModule.CampaignMapCatalog || CatalogModule;
  const Model = (ModelModule && typeof ModelModule.buildMapViewModel === 'function')
    ? ModelModule
    : ((ModelModule && (ModelModule.CampaignMapModel || ModelModule.CAMPAIGN_MAP_MODEL)) || ModelModule);

  const TYPE_ICONS = Object.freeze({
    normal: '⚪', fire: '🔥', water: '💧', electric: '⚡', grass: '🌿',
    ice: '❄️', fighting: '🥊', poison: '☠️', ground: '🏜️', flying: '🌪️',
    psychic: '🔮', bug: '🪲', rock: '🪨', ghost: '👻', dragon: '🐉',
    dark: '🌑', steel: '⚙️', fairy: '✨'
  });

  const TRIAL_ICONS = Object.freeze({
    LEGENDARY_TRIAL: '👑',
    MYTHICAL_TRIAL: '🔮',
    TITANS_TRIAL: '🛡️',
    CELESTIAL_TRIAL: '🌟'
  });

  const SPECIAL_ICONS = Object.freeze({
    SUPER: '⭐',
    SHADOW: '👁️'
  });

  function isTrialKind(kind) {
    if (kind === 'SUPER' || kind === 'SHADOW') return false;
    if (Model && typeof Model.isTrial === 'function') {
      return Model.isTrial(kind);
    }
    return ['LEGENDARY_TRIAL', 'MYTHICAL_TRIAL', 'TITANS_TRIAL', 'CELESTIAL_TRIAL'].includes(kind);
  }

  function getTrialKey(node) {
    if (!node) return null;
    const kind = typeof node === 'string' ? node : node.challengeKind;
    const id = typeof node === 'object' ? node.challengeId : null;
    if (kind === 'SUPER' || kind === 'SHADOW' || id === 'SUPER' || id === 'SHADOW') {
      return null;
    }
    if (Model && typeof Model.getTrialKind === 'function') {
      const derived = Model.getTrialKind(node);
      if (derived && TRIAL_ICONS[derived]) return derived;
    }
    if (TRIAL_ICONS[kind]) return kind;
    if (id && TRIAL_ICONS[id]) return id;
    if (id && TRIAL_ICONS[`${id.toUpperCase()}_TRIAL`]) return `${id.toUpperCase()}_TRIAL`;
    return null;
  }

  function cap(s) {
    return String(s || '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  class CampaignMapView {
    constructor({ manager, container, onChallenge, onReset, initialRegionId, initialViewMode, assetPrefix } = {}) {
      this.manager = manager;
      this.container = container || (typeof document !== 'undefined' ? document.getElementById('campaignView') : null);
      this.onChallenge = typeof onChallenge === 'function' ? onChallenge : () => {};
      this.onReset = typeof onReset === 'function' ? onReset : () => {};
      this.assetPrefix = typeof assetPrefix === 'string' ? assetPrefix : '';

      this.activeRegionId = initialRegionId || 'region-1';
      this.viewMode = initialViewMode || this._getStoredViewMode();
      this.selectedNodeId = null;
      this.isDrawerOpen = false;
      this.lastFocusedNodeId = null;
      this.lastFocusedAction = 'map-node';
      this.ariaLiveMessage = '';
      this.pendingAriaAnnouncement = '';
      this._ariaTimer = null;
      this._renderVersion = 0;

      // Phase 4: Controlled transitions, lifecycle & cleanup
      this._isDestroyed = false;
      this.transitionCause = 'REGION_CHANGE';
      this.lastTransitionCause = 'REGION_CHANGE';
      this._pendingRafIds = new Set();
      this._pendingTimeoutIds = new Set();
      this._fallbackRafTimeoutIds = new Set();

      this._drawerOpenRafId = null;
      this._drawerTransitionToken = 0;
      this._drawerCloseFallbackTimer = null;
      this._drawerCloseElement = null;
      this._drawerCloseHandler = null;
      this._drawerClosingToken = 0;

      this._handleKeyDown = this._handleKeyDown.bind(this);
    }

    _isReducedMotion() {
      if (typeof document !== 'undefined' && document.documentElement && typeof document.documentElement.getAttribute === 'function') {
        if (document.documentElement.getAttribute('data-simulate-reduced-motion') === 'true') {
          return true;
        }
      }
      if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
        try {
          return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        } catch (e) {
          return false;
        }
      }
      return false;
    }

    _safeTimeout(fn, ms) {
      if (this._isDestroyed) return null;
      let timerId;
      timerId = setTimeout(() => {
        this._pendingTimeoutIds.delete(timerId);
        if (!this._isDestroyed) {
          fn();
        }
      }, ms);
      this._pendingTimeoutIds.add(timerId);
      return timerId;
    }

    _clearTimeout(timerId) {
      if (timerId !== null && timerId !== undefined) {
        clearTimeout(timerId);
        this._pendingTimeoutIds.delete(timerId);
        if (this._fallbackRafTimeoutIds) {
          this._fallbackRafTimeoutIds.delete(timerId);
        }
      }
    }

    _safeRaf(fn) {
      if (this._isDestroyed) return null;
      if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
        let timerId;
        timerId = setTimeout(() => {
          this._pendingTimeoutIds.delete(timerId);
          this._fallbackRafTimeoutIds.delete(timerId);
          if (!this._isDestroyed) {
            fn();
          }
        }, 16);
        this._pendingTimeoutIds.add(timerId);
        this._fallbackRafTimeoutIds.add(timerId);
        return timerId;
      }
      let rafId;
      rafId = window.requestAnimationFrame(() => {
        this._pendingRafIds.delete(rafId);
        if (!this._isDestroyed) {
          fn();
        }
      });
      this._pendingRafIds.add(rafId);
      return rafId;
    }

    _clearRaf(rafId) {
      if (rafId !== null && rafId !== undefined) {
        if (typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
          window.cancelAnimationFrame(rafId);
        }
        this._pendingRafIds.delete(rafId);
        if (this._fallbackRafTimeoutIds && this._fallbackRafTimeoutIds.has(rafId)) {
          clearTimeout(rafId);
          this._fallbackRafTimeoutIds.delete(rafId);
          this._pendingTimeoutIds.delete(rafId);
        }
      }
    }

    _cancelDrawerOpening() {
      this._drawerTransitionToken++;
      if (this._drawerOpenRafId !== null && this._drawerOpenRafId !== undefined) {
        this._clearRaf(this._drawerOpenRafId);
        this._drawerOpenRafId = null;
      }
    }

    _cancelDrawerClosing() {
      this._drawerClosingToken++;
      if (this._drawerCloseFallbackTimer !== null && this._drawerCloseFallbackTimer !== undefined) {
        this._clearTimeout(this._drawerCloseFallbackTimer);
        this._drawerCloseFallbackTimer = null;
      }
      if (this._drawerCloseElement && this._drawerCloseHandler) {
        if (typeof this._drawerCloseElement.removeEventListener === 'function') {
          this._drawerCloseElement.removeEventListener('transitionend', this._drawerCloseHandler);
        }
      }
      this._drawerCloseElement = null;
      this._drawerCloseHandler = null;
    }

    _clearAllPendingWork() {
      this._cancelDrawerOpening();
      this._cancelDrawerClosing();

      if (this._ariaTimer !== null && this._ariaTimer !== undefined) {
        this._clearTimeout(this._ariaTimer);
        this._ariaTimer = null;
      }
      for (const timerId of this._pendingTimeoutIds) {
        clearTimeout(timerId);
      }
      this._pendingTimeoutIds.clear();
      if (this._fallbackRafTimeoutIds) {
        this._fallbackRafTimeoutIds.clear();
      }

      if (typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
        for (const rafId of this._pendingRafIds) {
          window.cancelAnimationFrame(rafId);
        }
      }
      this._pendingRafIds.clear();
    }

    _getStoredViewMode() {
      try {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          const stored = window.sessionStorage.getItem('campaign_view_mode');
          if (stored === 'LIST' || stored === 'MAP') return stored;
        }
      } catch (e) { /* ignore storage access errors */ }
      return 'MAP';
    }

    _setStoredViewMode(mode) {
      try {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.setItem('campaign_view_mode', mode);
        }
      } catch (e) { /* ignore */ }
    }

    destroy() {
      this._isDestroyed = true;
      this._clearAllPendingWork();
      this.pendingAriaAnnouncement = '';
      this.isDrawerOpen = false;
      this.selectedNodeId = null;
      if (typeof document !== 'undefined') {
        document.removeEventListener('keydown', this._handleKeyDown);
      }
      if (this.container && typeof this.container.querySelector === 'function') {
        const drawer = this.container.querySelector('#trainerDetailsDrawer');
        if (drawer && drawer.classList && typeof drawer.classList.remove === 'function') {
          drawer.classList.remove('is-open');
          if (drawer.style) drawer.style.display = 'none';
          if (typeof drawer.setAttribute === 'function') drawer.setAttribute('aria-hidden', 'true');
        }
        const backdrop = this.container.querySelector('#detailsBackdrop');
        if (backdrop && backdrop.classList && typeof backdrop.classList.remove === 'function') {
          backdrop.classList.remove('is-open');
          if (typeof backdrop.setAttribute === 'function') backdrop.setAttribute('aria-hidden', 'true');
        }
      }
    }

    announce(message) {
      if (this._isDestroyed || !message) return;
      this.ariaLiveMessage = message;
      this.pendingAriaAnnouncement = message;
      this._deliverPendingAriaAnnouncement();
    }

    _deliverPendingAriaAnnouncement() {
      if (this._isDestroyed || !this.pendingAriaAnnouncement) return;
      if (this._ariaTimer !== null && this._ariaTimer !== undefined) {
        this._clearTimeout(this._ariaTimer);
        this._ariaTimer = null;
      }
      const messageToDeliver = this.pendingAriaAnnouncement;
      const currentVersion = this._renderVersion;

      this._ariaTimer = this._safeTimeout(() => {
        if (this._isDestroyed || this._renderVersion !== currentVersion) return;
        const live = this.container ? this.container.querySelector('#mapAriaLive') : null;
        if (live && live.isConnected !== false) {
          live.textContent = messageToDeliver;
          this.pendingAriaAnnouncement = '';
        }
      }, 50);
    }

    _handleKeyDown(e) {
      if (!this.isDrawerOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        this.closeDrawer();
        return;
      }
      if (e.key === 'Tab') {
        const drawer = this.container ? this.container.querySelector('#trainerDetailsDrawer') : null;
        if (!drawer) return;
        const focusables = Array.from(drawer.querySelectorAll('button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    render() {
      if (!this.container) return;
      this._isDestroyed = false;

      const campaignState = this.manager ? this.manager.getState() : {};
      const masters = (window.PBACampaign && window.PBACampaign.MASTERS) || [];

      const viewModel = Model.buildMapViewModel({
        catalog: Catalog,
        campaignState,
        masters,
        manager: this.manager,
        activeRegionId: this.activeRegionId,
        selectedNodeId: this.selectedNodeId
      });

      if (viewModel.activeRegion) {
        this.activeRegionId = viewModel.activeRegion.id;
      }

      this._renderVersion = (this._renderVersion || 0) + 1;
      if (this._ariaTimer !== null && this._ariaTimer !== undefined) {
        this._clearTimeout(this._ariaTimer);
        this._ariaTimer = null;
      }

      const activeRegion = viewModel.activeRegion || viewModel.regions[0];
      const selectedNode = viewModel.selectedNode;

      const isSwitchingView = this.transitionCause === 'VIEW_MODE_CHANGE' && !this._isReducedMotion();
      const shouldAnimateDrawerOpen = this.transitionCause === 'DRAWER_OPEN' && !this._isReducedMotion();

      let stageContentHtml = '';
      if (this.viewMode === 'LIST') {
        stageContentHtml = this._renderListView(activeRegion, viewModel);
      } else {
        stageContentHtml = this._renderMapView(activeRegion, viewModel);
      }

      const panelClasses = ['campaign-map-panel'];
      if (isSwitchingView) {
        panelClasses.push('is-switching-view');
      }

      const backdropOpenClass = (this.isDrawerOpen && !shouldAnimateDrawerOpen) ? 'is-open' : '';

      this.container.innerHTML = `
        <section class="campaign-map-shell">
          <div id="mapAriaLive" class="campaign-map-live-region" role="status" aria-live="polite" aria-atomic="true"></div>
          
          ${this._renderHeader(viewModel)}
          ${this._renderTabs(viewModel)}

          <!-- Tabpanel dinâmico estável: ID único com aria-labelledby apontando para a aba ativa -->
          <div id="campaign-map-region-panel"
               class="${panelClasses.join(' ')}"
               role="tabpanel"
               aria-labelledby="tab-${activeRegion.id}"
               tabindex="0">
            ${stageContentHtml}
          </div>

          <div id="detailsBackdrop"
               class="campaign-details-backdrop ${backdropOpenClass}"
               aria-hidden="true"></div>

          ${this._renderDrawer(selectedNode, viewModel)}
        </section>
      `;

      this._attachEventListeners(viewModel, activeRegion);

      if (this.pendingAriaAnnouncement) {
        this._deliverPendingAriaAnnouncement();
      }
    }

    _renderHeader(viewModel) {
      const isMap = this.viewMode === 'MAP';
      return `
        <header class="campaign-map-header">
          <div class="campaign-map-header__titles">
            <p class="eyebrow">CIRCUITO DOS MESTRES</p>
            <h2>Mapa de Campanha</h2>
          </div>

          <div class="campaign-map-header__meta">
            <div class="campaign-map-stat-badge">
              <span>Insígnias:</span>
              <strong>${viewModel.badgeCount}/18</strong>
            </div>
            <div class="campaign-map-stat-badge">
              <span>Elenco:</span>
              <strong>${viewModel.rosterCount} Pokémon</strong>
            </div>
          </div>

          <div class="campaign-map-header__controls">
            <div class="campaign-view-toggle-group" role="group" aria-label="Modo de visualização">
              <button type="button" 
                      id="viewModeMapBtn" 
                      class="campaign-view-toggle-btn" 
                      aria-pressed="${isMap}" 
                      title="Exibir mapa com rotas">
                <i class="fa-solid fa-map" aria-hidden="true"></i> Mapa
              </button>
              <button type="button" 
                      id="viewModeListBtn" 
                      class="campaign-view-toggle-btn" 
                      aria-pressed="${!isMap}" 
                      title="Exibir lista de mestres e desafios">
                <i class="fa-solid fa-list-ul" aria-hidden="true"></i> Lista
              </button>
            </div>

            <button type="button" 
                    id="campaignResetBtn" 
                    class="campaign-map-reset-btn" 
                    title="Reiniciar campanha">
              Resetar campanha
            </button>
          </div>
        </header>
      `;
    }

    _renderTabs(viewModel) {
      const tabsHtml = viewModel.regions.map(region => {
        const isActive = region.id === viewModel.activeRegionId;
        const isLocked = Boolean(region.isLocked);
        const lockNote = isLocked ? ` (Bloqueada: ${viewModel.badgeCount}/18)` : '';
        const recBadge = region.hasRecommended && !isLocked
          ? '<span class="tab-badge-hint" title="Próximo Mestre sugerido nesta região">★ Sugerido</span>'
          : '';
        const lockIcon = isLocked
          ? '<span class="tab-lock-icon" aria-hidden="true"><i class="fa-solid fa-lock"></i></span>'
          : '';

        return `
          <button type="button"
                  role="tab"
                  id="tab-${region.id}"
                  class="campaign-map-tab ${isLocked ? 'is-locked' : ''}"
                  aria-selected="${isActive}"
                  aria-disabled="${isLocked ? 'true' : 'false'}"
                  aria-controls="campaign-map-region-panel"
                  data-region-id="${region.id}"
                  data-is-locked="${isLocked}"
                  tabindex="${isActive ? '0' : '-1'}"
                  aria-label="${region.name}${lockNote}">
            ${lockIcon}
            <span>${region.shortName}</span>
            ${recBadge}
          </button>
        `;
      }).join('');

      return `
        <nav class="campaign-map-tabs" role="tablist" aria-label="Regiões do Circuito">
          ${tabsHtml}
        </nav>
      `;
    }

    _renderMapView(region, viewModel) {
      const nodeMap = new Map(region.nodes.map(n => [n.nodeId, n]));

      const routesHtml = (region.routes || []).map(route => {
        const fromNode = nodeMap.get(route.from);
        const toNode = nodeMap.get(route.to);

        // Respect hidden routes: do not render SVG path if hidden or connected to hidden node
        if (route.status === 'hidden' || !fromNode || !toNode || fromNode.isHidden || toNode.isHidden || fromNode.state === 'HIDDEN' || toNode.state === 'HIDDEN') {
          return '';
        }

        let routeClass = 'map-route-path';
        if (route.status === 'completed' || (fromNode.isDefeated && toNode.isDefeated)) {
          routeClass += ' is-completed';
        } else if (route.status === 'locked') {
          routeClass += ' is-locked';
        } else if (route.status === 'active' || fromNode.isDefeated || toNode.isDefeated || fromNode.isRecommended || toNode.isRecommended) {
          routeClass += ' is-active';
        }

        return `<path id="${route.routeId}" class="${routeClass}" d="${route.pathD}" />`;
      }).join('');

      let visibleNodeIndex = 0;
      const nodesHtml = region.nodes.map(node => {
        if (node.isHidden || (node.challengeKind === 'SHADOW' && node.state === 'HIDDEN')) {
          return ''; // Shadow completely hidden before reveal
        }

        const staggerIndex = visibleNodeIndex++;
        const isSelected = node.nodeId === this.selectedNodeId;
        const left = Number(node.position.x).toFixed(1);
        const top = Number(node.position.y).toFixed(1);

        let kindClass = 'node-kind-master';
        let fallbackIcon = TYPE_ICONS[node.type] || '★';

        const isSuper = node.challengeKind === 'SUPER';
        const isShadow = node.challengeKind === 'SHADOW';
        const trialType = getTrialKey(node);
        const isTrial = !isSuper && !isShadow && Boolean(trialType || isTrialKind(node.challengeKind));

        if (isSuper) {
          kindClass = 'node-kind-super';
          fallbackIcon = SPECIAL_ICONS.SUPER;
        } else if (isShadow) {
          kindClass = 'node-kind-shadow';
          fallbackIcon = SPECIAL_ICONS.SHADOW;
        } else if (isTrial) {
          kindClass = 'node-kind-trial';
          fallbackIcon = TRIAL_ICONS[trialType] || '🛡️';
        }

        let stateClass = '';
        if (node.isDefeated) stateClass += ' is-defeated';
        if (node.isRecommended) stateClass += ' is-recommended';
        if (isSelected) stateClass += ' is-selected';
        if (!node.canChallenge) stateClass += ' is-locked';

        let badgeOverlay = '';
        if (node.isDefeated) {
          badgeOverlay = `<span class="node-status-badge is-defeated" title="Derrotado"><i class="fa-solid fa-check"></i></span>`;
        } else if (node.isRecommended) {
          badgeOverlay = `<span class="node-recommended-pill">★ Sugerido</span>`;
        } else if (!node.canChallenge) {
          badgeOverlay = `<span class="node-status-badge is-locked" title="${node.cannotChallengeReason || 'Bloqueado'}"><i class="fa-solid fa-lock"></i></span>`;
        }

        let innerImage = '';
        if (node.thumbnailSrc) {
          innerImage = `
            <img class="campaign-map-node__thumb"
                 src="${this.assetPrefix}${node.thumbnailSrc}"
                 alt=""
                 loading="lazy"
                 decoding="async"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';">
            <span class="campaign-map-node__fallback" style="display:none;">${fallbackIcon}</span>
          `;
        } else {
          innerImage = `<span class="campaign-map-node__fallback">${fallbackIcon}</span>`;
        }

        const titleAttr = node.cannotChallengeReason ? `${node.biomeLabel} — ${node.cannotChallengeReason}` : node.biomeLabel;

        return `
          <button type="button"
                  id="${node.nodeId}"
                  class="campaign-map-node ${kindClass} ${stateClass}"
                  style="left: ${left}%; top: ${top}%; --node-index: ${staggerIndex};"
                  data-node-id="${node.nodeId}"
                  data-node-index="${staggerIndex}"
                  aria-label="${node.ariaLabel}"
                  title="${titleAttr}">
            ${innerImage}
            ${badgeOverlay}
          </button>
        `;
      }).join('');

      let selectedMarkerHtml = '';
      if (this.selectedNodeId) {
        const sel = region.nodes.find(n => n.nodeId === this.selectedNodeId);
        if (sel && !(sel.isHidden || (sel.challengeKind === 'SHADOW' && sel.state === 'HIDDEN'))) {
          selectedMarkerHtml = `
            <div class="map-selection-marker" 
                 style="left: ${sel.position.x}%; top: ${sel.position.y}%;" 
                 aria-hidden="true">
              <i class="fa-solid fa-caret-down fa-2x"></i>
            </div>
          `;
        }
      }

      const isRegionEntering = this.transitionCause === 'REGION_CHANGE' && !this._isReducedMotion();
      const stageClasses = ['campaign-map-stage', region.themeClass || 'theme-region-verdant'];
      if (isRegionEntering) {
        stageClasses.push('is-entering');
      }

      return `
        <div class="campaign-map-viewport">
          <div class="${stageClasses.join(' ')}">
            ${region.bgImage ? `
              <img class="campaign-map-bg-image"
                   src="${this.assetPrefix}${region.bgImage}"
                   alt=""
                   aria-hidden="true"
                   width="1280"
                   height="720"
                   loading="eager"
                   decoding="async">
            ` : ''}
            <div class="map-contrast-overlay" aria-hidden="true"></div>
            <div class="map-ambient-grid" aria-hidden="true"></div>
            
            <div class="map-region-info-overlay">
              <h3 class="region-name">${region.name}</h3>
              <p class="region-subtitle">${region.subtitle}</p>
            </div>

            <svg class="campaign-map-routes" viewBox="0 0 1000 562.5" preserveAspectRatio="none" aria-hidden="true">
              ${routesHtml}
            </svg>

            ${selectedMarkerHtml}
            ${nodesHtml}
          </div>
        </div>
        <span class="campaign-map-scroll-hint" aria-hidden="true">Arraste para explorar o mapa ↔</span>
      `;
    }

    _renderListView(region, viewModel) {
      const cardsHtml = region.nodes.map(node => {
        if (node.isHidden || (node.challengeKind === 'SHADOW' && node.state === 'HIDDEN')) return '';

        const isSuper = node.challengeKind === 'SUPER';
        const isShadow = node.challengeKind === 'SHADOW';
        const trialType = getTrialKey(node);
        const isTrial = !isSuper && !isShadow && Boolean(trialType || isTrialKind(node.challengeKind));
        const isDefeated = node.isDefeated;
        const isRecommended = node.isRecommended;
        const canChallenge = Boolean(node.canChallenge);

        let statusTag = '';
        let btnText = 'Desafiar';
        let btnClass = 'details-action-btn btn-challenge';

        if (isDefeated) {
          statusTag = '<span class="master-status-tag completed"><i class="fa-solid fa-check"></i> Derrotado</span>';
          btnText = 'Revanche';
          btnClass = 'details-action-btn btn-rematch';
        } else if (!canChallenge) {
          statusTag = `<span class="master-status-tag locked"><i class="fa-solid fa-lock"></i> Bloqueado</span>`;
          btnText = 'Bloqueado';
          btnClass = 'details-action-btn btn-disabled';
        } else if (isRecommended) {
          statusTag = '<span class="master-status-tag pending" style="border-color:#38bdf8;color:#38bdf8;">★ Sugerido</span>';
        } else {
          statusTag = '<span class="master-status-tag pending">Disponível</span>';
        }

        let typeIcon = TYPE_ICONS[node.type] || '★';
        let typeChip = '';
        if (isSuper) {
          typeIcon = SPECIAL_ICONS.SUPER;
          typeChip = `<span class="type-chip type-special">${typeIcon} Desafio Final</span>`;
        } else if (isShadow) {
          typeIcon = SPECIAL_ICONS.SHADOW;
          typeChip = `<span class="type-chip type-special">${typeIcon} Desafio Final Verdadeiro</span>`;
        } else if (isTrial) {
          typeIcon = TRIAL_ICONS[trialType] || '🛡️';
          typeChip = `<span class="type-chip type-special">${typeIcon} Prova Especial</span>`;
        } else if (node.type) {
          typeChip = `<span class="type-chip type-${node.type}">${typeIcon} ${cap(node.type)}</span>`;
        }

        const titleText = isSuper
          ? 'Desafio Final'
          : (isShadow ? 'Desafio Final Verdadeiro' : (node.trainerTitle || node.label || node.biomeLabel));
        const nameText = node.trainerName || node.title;
        const challengeDisabledAttr = canChallenge ? '' : `disabled aria-disabled="true" title="${node.cannotChallengeReason || 'Desafio indisponível'}"`;

        return `
          <article class="campaign-list-card ${isDefeated ? 'is-defeated' : ''} ${isRecommended ? 'is-recommended' : ''} ${!canChallenge ? 'is-locked' : ''}">
            <div class="campaign-list-card__header">
              ${node.thumbnailSrc ? `<img class="campaign-list-card__thumb" src="${this.assetPrefix}${node.thumbnailSrc}" alt="" loading="lazy">` : `<div class="campaign-list-card__thumb" style="display:grid;place-items:center;">${typeIcon}</div>`}
              <div class="campaign-list-card__titles">
                <h4>${nameText}</h4>
                <p>${titleText}</p>
              </div>
            </div>

            <div class="campaign-list-card__meta">
              <div>${typeChip}</div>
              <div>${statusTag}</div>
            </div>

            <div class="campaign-list-card__actions">
              <button type="button" 
                      class="campaign-list-card__btn campaign-list-card__btn-details" 
                      data-node-open="${node.nodeId}" 
                      aria-label="Ver detalhes de ${nameText}">
                <i class="fa-solid fa-circle-info"></i> Detalhes
              </button>
              <button type="button" 
                      class="campaign-list-card__btn ${btnClass}" 
                      data-node-challenge="${node.nodeId}"
                      ${challengeDisabledAttr}>
                ${btnText}
              </button>
            </div>
          </article>
        `;
      }).join('');

      return `
        <div class="campaign-list-view">
          ${cardsHtml}
        </div>
      `;
    }

    _renderDrawer(selectedNode, viewModel) {
      if (!selectedNode || !this.isDrawerOpen) {
        return `
          <aside id="trainerDetailsDrawer" 
                 class="campaign-details-drawer" 
                 role="dialog" 
                 aria-modal="true" 
                 aria-hidden="true" 
                 style="display:none;">
          </aside>
        `;
      }

      const isSuper = selectedNode.challengeKind === 'SUPER';
      const isShadow = selectedNode.challengeKind === 'SHADOW';
      const trialType = getTrialKey(selectedNode);
      const isTrial = !isSuper && !isShadow && Boolean(trialType || isTrialKind(selectedNode.challengeKind));
      const isMaster = selectedNode.challengeKind === 'MASTER';
      const isDefeated = selectedNode.isDefeated;
      const canChallenge = Boolean(selectedNode.canChallenge);
      const trainerName = selectedNode.trainerName || selectedNode.title || 'Desafio';
      const trainerTitle = isSuper
        ? 'Desafio Final'
        : (isShadow ? 'Anomalia Sombria — Desafio Final Verdadeiro' : (selectedNode.trainerTitle || selectedNode.label || selectedNode.biomeLabel));
      const type = selectedNode.type;

      let typeLabel = '';
      let typeIcon = '';
      let pillChipHtml = '';

      if (isSuper) {
        typeLabel = 'Desafio Final';
        typeIcon = SPECIAL_ICONS.SUPER;
        pillChipHtml = `<span class="type-chip type-special">${typeIcon} Desafio Final</span>`;
      } else if (isShadow) {
        typeLabel = 'Desafio Final Verdadeiro';
        typeIcon = SPECIAL_ICONS.SHADOW;
        pillChipHtml = `<span class="type-chip type-special">${typeIcon} Anomalia Sombria</span>`;
      } else if (isTrial) {
        typeLabel = 'Prova de Elite';
        typeIcon = TRIAL_ICONS[trialType] || '🛡️';
        pillChipHtml = `<span class="type-chip type-special">${typeIcon} Prova de Elite</span>`;
      } else if (type) {
        typeLabel = cap(type);
        typeIcon = TYPE_ICONS[type] || '';
        pillChipHtml = `<span class="type-chip type-${type}">${typeIcon} ${typeLabel}</span>`;
      }

      const portraitSrc = selectedNode.avatarSrc || selectedNode.thumbnailSrc || '';
      const portraitHtml = portraitSrc ? `
        <div class="details-portrait-wrap">
          <img class="details-portrait-img"
               src="${this.assetPrefix}${portraitSrc}"
               alt="Retrato de ${trainerName}"
               decoding="async"
               onerror="this.style.display='none';">
        </div>
      ` : '';

      let teamPreviewHtml = '';
      if (Array.isArray(selectedNode.team) && selectedNode.team.length) {
        teamPreviewHtml = `
          <div class="details-team-preview">
            <p class="eyebrow">EQUIPE ADVERSÁRIA</p>
            <div class="details-team-grid">
              ${selectedNode.team.map(mon => `
                <div class="details-team-card">
                  <img src="${mon.sprite}" alt="${cap(mon.name)}" loading="lazy">
                  <strong>${cap(mon.name)}</strong>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      let typeGuideHtml = '';
      if (isMaster && selectedNode.typeGuide) {
        const guide = selectedNode.typeGuide;
        const strongChips = (guide.offensiveStrengths || []).map(t => `<span class="type-chip type-${t}">${TYPE_ICONS[t] || ''} ${cap(t)}</span>`).join(' ') || '<em>Nenhum tipo</em>';
        const weakChips = (guide.defensiveWeaknesses || []).map(t => `<span class="type-chip type-${t}">${TYPE_ICONS[t] || ''} ${cap(t)}</span>`).join(' ') || '<em>Nenhuma fraqueza direta</em>';

        typeGuideHtml = `
          <div class="details-type-guide" aria-label="Guia do tipo ${typeLabel}">
            <h5><i class="fa-solid fa-shield-halved"></i> Guia Compacto: ${typeLabel}</h5>
            <div class="type-guide-compact-row">
              <span><strong>Forte contra:</strong></span>
              <div>${strongChips}</div>
            </div>
            <div class="type-guide-compact-row">
              <span><strong>Fraco contra:</strong></span>
              <div>${weakChips}</div>
            </div>
            <p class="details-type-disclaimer">Tipos secundários podem alterar essas relações.</p>
          </div>
        `;
      }

      let ctaText = 'DESAFIAR';
      let ctaClass = 'btn-challenge';
      let ctaIcon = 'fa-bolt';

      if (isDefeated) {
        ctaText = 'REVANCHE';
        ctaClass = 'btn-rematch';
        ctaIcon = 'fa-rotate-right';
      }
      if (selectedNode.challengeKind === 'SHADOW') {
        ctaText = 'ENFRENTAR O DESAFIO FINAL';
        ctaClass = 'btn-danger';
        ctaIcon = 'fa-skull';
      }
      if (!canChallenge) {
        ctaText = 'INDISPONÍVEL';
        ctaClass = 'btn-disabled';
        ctaIcon = 'fa-lock';
      }

      const cannotChallengeNotice = (!canChallenge && selectedNode.cannotChallengeReason)
        ? `<div class="details-locked-notice" role="note" style="margin-top:0.75rem;padding:0.6rem 0.8rem;background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.3);border-radius:8px;color:#fca5a5;font-size:0.85rem;display:flex;align-items:center;gap:0.5rem;"><i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> <span>${selectedNode.cannotChallengeReason}</span></div>`
        : '';

      const shouldAnimateOpen = this.transitionCause === 'DRAWER_OPEN' && !this._isReducedMotion();
      const drawerOpenClass = shouldAnimateOpen ? '' : 'is-open';
      const drawerAriaHidden = shouldAnimateOpen ? 'true' : 'false';

      return `
        <aside id="trainerDetailsDrawer"
               class="campaign-details-drawer ${drawerOpenClass}"
               role="dialog"
               aria-modal="true"
               aria-hidden="${drawerAriaHidden}"
               aria-labelledby="drawerTrainerTitle">
          <div class="details-drawer-handle" aria-hidden="true"></div>
          
          <div class="details-drawer-header">
            <h3 id="drawerTrainerTitle">${trainerName}</h3>
            <button type="button" 
                    id="detailsCloseBtn" 
                    class="details-close-btn" 
                    aria-label="Fechar painel de detalhes">
              <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </div>

          <div class="details-drawer-body">
            ${portraitHtml}

            <div class="details-trainer-heading">
              <p class="eyebrow">${trainerTitle}</p>
              <h4>${trainerName}</h4>
              <div class="details-pill-row">
                ${pillChipHtml}
                ${selectedNode.badgeName ? `<span class="campaign-map-stat-badge" style="padding:0.2rem 0.6rem;font-size:0.75rem;"><i class="fa-solid fa-award"></i> ${selectedNode.badgeName}</span>` : ''}
              </div>
            </div>

            <div class="details-meta-stats">
              <div class="details-meta-stat">
                <span>Dificuldade</span>
                <strong>${typeof selectedNode.difficulty === 'number' ? '★'.repeat(selectedNode.difficulty) : (selectedNode.difficultyLabel || 'EXTREMA')}</strong>
              </div>
              <div class="details-meta-stat">
                <span>Estado</span>
                <strong>${isDefeated ? 'Derrotado' : (canChallenge ? 'Disponível' : 'Bloqueado')}</strong>
              </div>
              ${selectedNode.attempts ? `
                <div class="details-meta-stat">
                  <span>Tentativas</span>
                  <strong>${selectedNode.attempts}</strong>
                </div>
              ` : ''}
              ${selectedNode.rewardPokemonId ? `
                <div class="details-meta-stat">
                  <span>Recruta Obtido</span>
                  <strong>#${selectedNode.rewardPokemonId}</strong>
                </div>
              ` : ''}
            </div>

            ${cannotChallengeNotice}
            ${teamPreviewHtml}
            ${typeGuideHtml}
          </div>

          <div class="details-drawer-footer">
            <button type="button" 
                    id="drawerActionBtn" 
                    class="details-action-btn ${ctaClass}" 
                    data-action-kind="${selectedNode.challengeKind}" 
                    data-action-id="${selectedNode.challengeId}"
                    ${canChallenge ? '' : 'disabled aria-disabled="true"'}>
              <i class="fa-solid ${ctaIcon}"></i> ${ctaText}
            </button>
          </div>
        </aside>
      `;
    }

    _attachEventListeners(viewModel, activeRegion) {
      if (typeof document === 'undefined') return;

      document.removeEventListener('keydown', this._handleKeyDown);
      document.addEventListener('keydown', this._handleKeyDown);

      const mapBtn = this.container.querySelector('#viewModeMapBtn');
      const listBtn = this.container.querySelector('#viewModeListBtn');
      if (mapBtn) {
        mapBtn.onclick = () => {
          if (this.viewMode !== 'MAP') {
            this._cancelDrawerOpening();
            this._cancelDrawerClosing();
            this.isDrawerOpen = false;
            this.selectedNodeId = null;
            this.viewMode = 'MAP';
            this._setStoredViewMode('MAP');
            this.transitionCause = 'VIEW_MODE_CHANGE';
            this.announce('Visualização alterada para Modo Mapa.');
            this.render();
          }
        };
      }
      if (listBtn) {
        listBtn.onclick = () => {
          if (this.viewMode !== 'LIST') {
            this._cancelDrawerOpening();
            this._cancelDrawerClosing();
            this.isDrawerOpen = false;
            this.selectedNodeId = null;
            this.viewMode = 'LIST';
            this._setStoredViewMode('LIST');
            this.transitionCause = 'VIEW_MODE_CHANGE';
            this.announce('Visualização alterada para Modo Lista.');
            this.render();
          }
        };
      }

      // Single confirmation: delegate directly to this.onReset()
      const resetBtn = this.container.querySelector('#campaignResetBtn');
      if (resetBtn) {
        resetBtn.onclick = () => {
          this.onReset();
        };
      }

      const tabs = Array.from(this.container.querySelectorAll('.campaign-map-tab'));
      tabs.forEach((tab, index) => {
        tab.onclick = () => {
          const regionId = tab.dataset.regionId;
          const isLocked = tab.dataset.isLocked === 'true';

          if (isLocked) {
            this.announce(`Região Final bloqueada. Requer 18 insígnias conquistadas (você possui ${viewModel.badgeCount}/18).`);
            return;
          }

          if (this.activeRegionId !== regionId) {
            this._cancelDrawerOpening();
            this._cancelDrawerClosing();
            this.activeRegionId = regionId;
            this.selectedNodeId = null;
            this.isDrawerOpen = false;
            this.transitionCause = 'REGION_CHANGE';
            const targetRegion = viewModel.regions.find(r => r.id === regionId);
            this.announce(`Região selecionada: ${targetRegion?.name || regionId}`);
            this.render();
            if (this._isReducedMotion()) {
              const newTab = this.container.querySelector(`#tab-${regionId}`);
              if (newTab && typeof newTab.focus === 'function') newTab.focus();
            } else {
              const currentVer = this._renderVersion;
              this._safeTimeout(() => {
                if (this._isDestroyed || this._renderVersion !== currentVer) return;
                const newTab = this.container.querySelector(`#tab-${regionId}`);
                if (newTab && typeof newTab.focus === 'function') newTab.focus();
              }, 50);
            }
          }
        };

        tab.onkeydown = e => {
          let targetIndex = -1;
          if (e.key === 'ArrowRight') {
            targetIndex = (index + 1) % tabs.length;
          } else if (e.key === 'ArrowLeft') {
            targetIndex = (index - 1 + tabs.length) % tabs.length;
          } else if (e.key === 'Home') {
            targetIndex = 0;
          } else if (e.key === 'End') {
            targetIndex = tabs.length - 1;
          } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            tab.click();
            return;
          }

          if (targetIndex >= 0) {
            e.preventDefault();
            tabs[targetIndex].focus();
          }
        };
      });

      this.container.querySelectorAll('.campaign-map-node').forEach(nodeBtn => {
        nodeBtn.onclick = () => {
          const nodeId = nodeBtn.dataset.nodeId;
          this.openNode(nodeId, nodeBtn, 'map-node');
        };
      });

      this.container.querySelectorAll('[data-node-open]').forEach(btn => {
        btn.onclick = () => {
          const nodeId = btn.dataset.nodeOpen;
          this.openNode(nodeId, btn, 'list-details');
        };
      });

      this.container.querySelectorAll('[data-node-challenge]').forEach(btn => {
        btn.onclick = () => {
          const nodeId = btn.dataset.nodeChallenge;
          const node = activeRegion.nodes.find(n => n.nodeId === nodeId);
          if (node && node.canChallenge) {
            this.lastFocusedNodeId = nodeId;
            this.lastFocusedAction = 'list-challenge';
            this.triggerChallenge(node);
          }
        };
      });

      const closeBtn = this.container.querySelector('#detailsCloseBtn');
      if (closeBtn) {
        closeBtn.onclick = () => this.closeDrawer();
      }

      const backdrop = this.container.querySelector('#detailsBackdrop');
      if (backdrop) {
        backdrop.onclick = () => this.closeDrawer();
      }

      const actionBtn = this.container.querySelector('#drawerActionBtn');
      if (actionBtn) {
        actionBtn.onclick = () => {
          if (viewModel.selectedNode && viewModel.selectedNode.canChallenge) {
            this.triggerChallenge(viewModel.selectedNode);
          }
        };
      }

      const currentVer = this._renderVersion;
      const wasRegionEntering = this.transitionCause === 'REGION_CHANGE' && !this._isReducedMotion();
      const wasSwitchingView = this.transitionCause === 'VIEW_MODE_CHANGE' && !this._isReducedMotion();
      const wasDrawerOpening = this.transitionCause === 'DRAWER_OPEN' && !this._isReducedMotion();

      if (wasRegionEntering) {
        this._safeTimeout(() => {
          if (this._renderVersion !== currentVer) return;
          const stage = this.container ? this.container.querySelector('.campaign-map-stage') : null;
          if (stage && stage.classList) stage.classList.remove('is-entering');
        }, 360);
      }

      if (wasSwitchingView) {
        this._safeTimeout(() => {
          if (this._renderVersion !== currentVer) return;
          const panel = this.container ? this.container.querySelector('.campaign-map-panel') : null;
          if (panel && panel.classList) panel.classList.remove('is-switching-view');
        }, 250);
      }

      if (wasDrawerOpening) {
        const openToken = ++this._drawerTransitionToken;
        this._drawerOpenRafId = this._safeRaf(() => {
          this._drawerOpenRafId = null;
          if (this._isDestroyed) return;
          if (this._renderVersion !== currentVer) return;
          if (this._drawerTransitionToken !== openToken) return;
          if (!this.isDrawerOpen) return;

          const drawer = this.container ? this.container.querySelector('#trainerDetailsDrawer') : null;
          const backdropEl = this.container ? this.container.querySelector('#detailsBackdrop') : null;
          if (drawer && drawer.classList) {
            drawer.classList.add('is-open');
            if (typeof drawer.setAttribute === 'function') {
              drawer.setAttribute('aria-hidden', 'false');
            }
          }
          if (backdropEl && backdropEl.classList) {
            backdropEl.classList.add('is-open');
          }
          const drawerClose = drawer ? drawer.querySelector('#detailsCloseBtn') : null;
          if (drawerClose && typeof drawerClose.focus === 'function') {
            drawerClose.focus();
          }
        });
      } else if (this.isDrawerOpen) {
        const drawer = this.container ? this.container.querySelector('#trainerDetailsDrawer') : null;
        const drawerClose = drawer ? drawer.querySelector('#detailsCloseBtn') : null;
        if (drawerClose && typeof drawerClose.focus === 'function') {
          if (this._isReducedMotion()) {
            drawerClose.focus();
          } else {
            this._safeTimeout(() => {
              if (this._isDestroyed || this._renderVersion !== currentVer || !this.isDrawerOpen) return;
              drawerClose.focus();
            }, 50);
          }
        }
      }

      this._setupBackgroundImageFallback();

      // Clear transient cause after scheduling animations
      this.lastTransitionCause = this.transitionCause;
      this.transitionCause = 'NONE';
    }

    _setupBackgroundImageFallback() {
      if (!this.container) return;
      const bgImg = this.container.querySelector('.campaign-map-bg-image');
      if (!bgImg) return;

      const markLoaded = () => {
        if (bgImg.classList) {
          if (typeof bgImg.classList.remove === 'function') {
            bgImg.classList.remove('is-loading');
            bgImg.classList.remove('is-hidden');
          }
          if (typeof bgImg.classList.add === 'function') {
            bgImg.classList.add('is-loaded');
          }
        }
      };

      const markError = () => {
        if (bgImg.classList) {
          if (typeof bgImg.classList.remove === 'function') {
            bgImg.classList.remove('is-loading');
            bgImg.classList.remove('is-loaded');
          }
          if (typeof bgImg.classList.add === 'function') {
            bgImg.classList.add('is-hidden');
          }
        }
      };

      const isReduced = this._isReducedMotion();

      if (bgImg.complete) {
        if (typeof bgImg.naturalWidth === 'number' && bgImg.naturalWidth === 0) {
          markError();
        } else {
          markLoaded();
        }
        return;
      }

      if (isReduced) {
        markLoaded();
      } else {
        if (bgImg.classList && typeof bgImg.classList.add === 'function') {
          bgImg.classList.add('is-loading');
        }
      }

      if (typeof bgImg.addEventListener === 'function') {
        bgImg.addEventListener('load', markLoaded, { once: true });
        bgImg.addEventListener('error', markError, { once: true });
      }
    }

    openNode(nodeId, originElement, originAction = 'map-node') {
      if (this._isDestroyed) return;
      this._cancelDrawerOpening();
      this._cancelDrawerClosing();

      const wasOpen = this.isDrawerOpen;
      this.selectedNodeId = nodeId;
      this.isDrawerOpen = true;
      this.lastFocusedNodeId = nodeId;
      this.lastFocusedAction = originAction;
      this.transitionCause = wasOpen ? 'NODE_SELECTION' : 'DRAWER_OPEN';
      this.render();
    }

    closeDrawer() {
      if (this._isDestroyed) return;

      // 1. Cancel pending opening RAF and invalidate opening tokens
      this._cancelDrawerOpening();

      if (!this.isDrawerOpen) {
        this._cancelDrawerClosing();
        return;
      }

      // 2. Cancel previous closing cycle if one was already in progress
      this._cancelDrawerClosing();

      const drawer = this.container ? this.container.querySelector('#trainerDetailsDrawer') : null;
      const backdrop = this.container ? this.container.querySelector('#detailsBackdrop') : null;

      const isVisuallyOpen = Boolean(drawer && drawer.classList && typeof drawer.classList.contains === 'function' && drawer.classList.contains('is-open'));

      if (this._isReducedMotion() || !drawer || !isVisuallyOpen) {
        if (drawer && drawer.classList) {
          drawer.classList.remove('is-open');
          if (typeof drawer.setAttribute === 'function') {
            drawer.setAttribute('aria-hidden', 'true');
          }
        }
        if (backdrop && backdrop.classList) {
          backdrop.classList.remove('is-open');
        }
        this.isDrawerOpen = false;
        this.selectedNodeId = null;
        this.transitionCause = 'DRAWER_CLOSE';
        this.render();
        this._restoreFocus();
        return;
      }

      if (drawer.classList) {
        drawer.classList.remove('is-open');
      }
      if (typeof drawer.setAttribute === 'function') {
        drawer.setAttribute('aria-hidden', 'true');
      }
      if (backdrop && backdrop.classList) {
        backdrop.classList.remove('is-open');
      }

      const closingToken = ++this._drawerClosingToken;
      const currentVer = this._renderVersion;

      let finished = false;
      const finishClose = () => {
        if (finished) return;
        finished = true;

        if (this._isDestroyed) {
          this._cancelDrawerClosing();
          return;
        }
        if (this._drawerClosingToken !== closingToken) {
          return;
        }

        this._cancelDrawerClosing();

        if (this._renderVersion !== currentVer) return;

        this.isDrawerOpen = false;
        this.selectedNodeId = null;
        this.transitionCause = 'DRAWER_CLOSE';
        this.render();
        this._restoreFocus();
      };

      const onTransitionEnd = (e) => {
        if (!e) {
          finishClose();
          return;
        }
        if (e.target === drawer) {
          if (!e.propertyName || e.propertyName === 'transform') {
            finishClose();
          }
        }
      };

      this._drawerCloseElement = drawer;
      this._drawerCloseHandler = onTransitionEnd;

      if (typeof drawer.addEventListener === 'function') {
        drawer.addEventListener('transitionend', onTransitionEnd);
      }

      this._drawerCloseFallbackTimer = this._safeTimeout(finishClose, 320);
    }

    _restoreFocus() {
      if (this._isDestroyed || this.isDrawerOpen) return;
      if (!this.lastFocusedNodeId || !this.container) return;
      let target = null;
      if (this.lastFocusedAction === 'list-details') {
        target = this.container.querySelector(`[data-node-open="${this.lastFocusedNodeId}"]`);
      } else if (this.lastFocusedAction === 'list-challenge') {
        target = this.container.querySelector(`[data-node-challenge="${this.lastFocusedNodeId}"]`);
      } else {
        target = this.container.querySelector(`#${this.lastFocusedNodeId}`);
      }

      if (target && typeof target.focus === 'function') {
        if (this._isReducedMotion()) {
          target.focus();
        } else {
          const currentVer = this._renderVersion;
          this._safeTimeout(() => {
            if (this._isDestroyed || this._renderVersion !== currentVer || this.isDrawerOpen) return;
            if (target && typeof target.focus === 'function') {
              target.focus();
            }
          }, 50);
        }
      }
    }

    triggerChallenge(node) {
      if (!node || node.canChallenge === false) {
        if (node && node.cannotChallengeReason) {
          this.announce(node.cannotChallengeReason);
        }
        return false;
      }

      // Resolver payload sem efeitos colaterais
      let payload = null;
      const trialKey = getTrialKey(node);

      if (node.challengeKind === 'MASTER') {
        if (typeof node.challengeId === 'string' && node.challengeId.trim().length > 0) {
          payload = { kind: 'MASTER', id: node.challengeId.trim() };
        }
      } else if (node.challengeKind === 'SUPER') {
        payload = { kind: 'SUPER', id: null };
      } else if (node.challengeKind === 'SHADOW') {
        payload = { kind: 'SHADOW', id: null };
      } else if (trialKey || isTrialKind(node.challengeKind)) {
        const kind = trialKey || node.challengeKind;
        const validTrials = ['LEGENDARY_TRIAL', 'MYTHICAL_TRIAL', 'TITANS_TRIAL', 'CELESTIAL_TRIAL'];
        if (validTrials.includes(kind)) {
          payload = { kind, id: null };
        }
      }

      // Se a ação não for reconhecida ou for inválida, aborta sem desmontar o mapa
      if (!payload) {
        return false;
      }

      // Somente após obter payload válido: aplicar efeitos colaterais e disparar
      this.isDrawerOpen = false;
      this.selectedNodeId = null;
      this.destroy();

      this.onChallenge(payload);
      return true;
    }
  }

  const api = { CampaignMapView };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  if (typeof window !== 'undefined') {
    window.PBACampaign = window.PBACampaign || {};
    Object.assign(window.PBACampaign, api);
    window.PBACampaign.CampaignMapView = CampaignMapView;
  }
})();
