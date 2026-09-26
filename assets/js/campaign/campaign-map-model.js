(function () {
  'use strict';

  let Catalog, Visuals, TypeGuide;
  if (typeof module !== 'undefined' && module.exports) {
    Catalog = require('./campaign-catalog.js');
    Visuals = require('./campaign-trainer-visuals.js');
    TypeGuide = require('./campaign-type-guide.js');
  } else {
    Catalog = window.PBACampaign || {};
    Visuals = window.PBACampaign || {};
    TypeGuide = window.PBACampaign || {};
  }

  const TRIAL_DEFINITIONS = Object.freeze({
    LEGENDARY_TRIAL: Object.freeze({
      key: 'legendary',
      title: 'Prova Lendária',
      trainerName: 'Prova Lendária',
      trainerTitle: 'Desafio Especial de Elite',
      badgeName: 'Aliado Lendário',
      difficulty: 4,
      getTeam: () => Catalog.LEGENDARY_TRIAL_TEAM || []
    }),
    MYTHICAL_TRIAL: Object.freeze({
      key: 'mythical',
      title: 'Prova Mítica',
      trainerName: 'Prova Mítica',
      trainerTitle: 'Desafio Especial de Elite',
      badgeName: 'Aliado Mítico',
      difficulty: 4,
      getTeam: () => Catalog.MYTHICAL_TRIAL_TEAM || []
    }),
    TITANS_TRIAL: Object.freeze({
      key: 'titans',
      title: 'Prova dos Titãs',
      trainerName: 'Prova dos Titãs',
      trainerTitle: 'Desafio Opcional de Elite',
      badgeName: 'Aliado Titã',
      difficulty: 5,
      getTeam: () => Catalog.TITANS_TRIAL_TEAM || []
    }),
    CELESTIAL_TRIAL: Object.freeze({
      key: 'celestial',
      title: 'Prova Celestial',
      trainerName: 'Prova Celestial',
      trainerTitle: 'Desafio Opcional de Elite',
      badgeName: 'Aliado Celestial',
      difficulty: 5,
      getTeam: () => Catalog.CELESTIAL_TRIAL_TEAM || []
    })
  });

  const TRIAL_KEYS = Object.freeze({
    LEGENDARY_TRIAL: 'legendary',
    MYTHICAL_TRIAL: 'mythical',
    TITANS_TRIAL: 'titans',
    CELESTIAL_TRIAL: 'celestial'
  });

  function isTrial(kind) {
    if (kind === 'SUPER' || kind === 'SHADOW') return false;
    return Boolean(TRIAL_DEFINITIONS[kind] || TRIAL_KEYS[kind] || kind === 'TRIAL');
  }

  function getTrialKind(nodeOrKind) {
    if (!nodeOrKind) return null;
    const kind = typeof nodeOrKind === 'string' ? nodeOrKind : nodeOrKind.challengeKind;
    const id = typeof nodeOrKind === 'object' ? nodeOrKind.challengeId : null;
    if (kind === 'SUPER' || kind === 'SHADOW' || id === 'SUPER' || id === 'SHADOW') {
      return null;
    }
    if (typeof nodeOrKind === 'string') {
      if (TRIAL_DEFINITIONS[nodeOrKind]) return nodeOrKind;
      const upper = `${nodeOrKind.toUpperCase()}_TRIAL`;
      if (TRIAL_DEFINITIONS[upper]) return upper;
      return null;
    }
    if (TRIAL_DEFINITIONS[kind]) return kind;
    if (TRIAL_DEFINITIONS[id]) return id;
    if (id && TRIAL_DEFINITIONS[`${id.toUpperCase()}_TRIAL`]) {
      return `${id.toUpperCase()}_TRIAL`;
    }
    return null;
  }

  const TYPE_NAMES_PT = Object.freeze({
    normal: 'Normal', fire: 'Fogo', water: 'Água', electric: 'Elétrico', grass: 'Planta',
    ice: 'Gelo', fighting: 'Lutador', poison: 'Venenoso', ground: 'Terrestre', flying: 'Voador',
    psychic: 'Psíquico', bug: 'Inseto', rock: 'Pedra', ghost: 'Fantasma', dragon: 'Dragão',
    dark: 'Sombrio', steel: 'Aço', fairy: 'Fada'
  });

  function findRecommendedMaster(campaignState, mastersList) {
    const masters = Array.isArray(mastersList) ? mastersList : (Catalog.MASTERS || []);
    const challenges = (campaignState && campaignState.challenges) || {};

    const undefeated = masters.filter(m => !challenges[m.challengeId]?.badgeEarned);
    if (!undefeated.length) return null;

    undefeated.sort((a, b) => {
      const diffA = Number(a.difficulty) || 3;
      const diffB = Number(b.difficulty) || 3;
      if (diffA !== diffB) return diffA - diffB;
      const indexA = masters.indexOf(a);
      const indexB = masters.indexOf(b);
      return indexA - indexB;
    });

    const choice = undefeated[0];
    let regionId = 'region-1';
    if (['master-fighting', 'master-ground', 'master-poison', 'master-rock', 'master-fire', 'master-ice'].includes(choice.challengeId)) {
      regionId = 'region-2';
    } else if (['master-fairy', 'master-psychic', 'master-dark', 'master-ghost', 'master-steel', 'master-dragon'].includes(choice.challengeId)) {
      regionId = 'region-3';
    }

    return Object.freeze({
      challengeId: choice.challengeId,
      type: choice.type,
      trainerName: choice.trainerName,
      trainerTitle: choice.trainerTitle,
      badgeName: choice.badgeName,
      difficulty: choice.difficulty,
      regionId
    });
  }

  function deriveNodeState(node, campaignState, mastersList, recommended, selectedNodeId, badgeCount, rosterCount) {
    const challenges = (campaignState && campaignState.challenges) || {};
    const trials = (campaignState && campaignState.endgameTrials) || {};
    const superTrainer = (campaignState && campaignState.superTrainer) || {};
    const shadowTrainer = (campaignState && campaignState.shadowTrainer) || {};
    const hasPendingReward = Boolean(campaignState && campaignState.pendingReward);

    const isSelected = selectedNodeId === node.nodeId;

    if (node.challengeKind === 'MASTER') {
      const record = challenges[node.challengeId] || {};
      const isDefeated = Boolean(record.badgeEarned);
      const isCompleted = isDefeated;
      const attempts = Math.max(0, Math.floor(Number(record.attempts) || 0));
      const isRecommended = Boolean(recommended && recommended.challengeId === node.challengeId);
      const master = (mastersList || Catalog.MASTERS || []).find(m => m.challengeId === node.challengeId) || null;
      const visual = Visuals.getMasterVisual ? Visuals.getMasterVisual(node.challengeId) : null;

      let state = 'AVAILABLE';
      if (isDefeated) {
        state = 'REMATCH_AVAILABLE';
      } else if (isRecommended) {
        state = 'RECOMMENDED';
      }

      const typeLabel = TYPE_NAMES_PT[node.type] || node.type;
      const statusText = isDefeated
        ? 'Derrotado. Insígnia conquistada. Revanche disponível.'
        : (isRecommended ? 'Disponível (Sugerido para iniciar).' : 'Disponível para desafio.');

      const trainerName = master?.trainerName || node.challengeId;
      const trainerTitle = master?.trainerTitle || 'Mestre';
      const badgeName = master?.badgeName || 'Insígnia';
      const difficulty = Number(master?.difficulty) || 3;
      const difficultyLabel = '★'.repeat(difficulty);
      const team = master?.team || [];
      const thumbnailSrc = visual?.thumbnailSrc || (visual?.avatarKey ? `assets/images/trainers/thumbs/${visual.avatarKey}.webp` : '');
      const avatarSrc = visual?.avatarSrc || (visual?.avatarKey ? `assets/images/trainers/${visual.avatarKey}.png` : '');
      let typeGuide = null;
      try {
        if (TypeGuide && typeof TypeGuide.getTypeGuide === 'function') {
          typeGuide = TypeGuide.getTypeGuide(node.type);
        }
      } catch (e) {
        typeGuide = null;
      }

      const canChallenge = !hasPendingReward;
      const cannotChallengeReason = hasPendingReward
        ? 'Resgate a recompensa pendente antes de iniciar uma nova batalha.'
        : null;

      const ariaLabel = `Mestre ${trainerName}, Tipo ${typeLabel}, ${badgeName}, Dificuldade ${difficulty} estrelas. Estado: ${statusText}`;

      return Object.freeze({
        ...node,
        state,
        isDefeated,
        isCompleted,
        isRecommended,
        isSelected,
        canChallenge,
        cannotChallengeReason,
        attempts,
        rewardPokemonId: record.rewardPokemonId || null,
        trainerName,
        trainerTitle,
        badgeName,
        difficulty,
        difficultyLabel,
        team,
        thumbnailSrc,
        avatarSrc,
        typeGuide,
        master,
        visual,
        ariaLabel,
        isHidden: false,
        isVisible: true
      });
    }

    const trialKind = getTrialKind(node);
    if (trialKind) {
      const trialDef = TRIAL_DEFINITIONS[trialKind] || TRIAL_DEFINITIONS.LEGENDARY_TRIAL;
      const trialKey = trialDef.key;
      const trialProgress = trials[trialKey] || {};
      const isCompleted = Boolean(trialProgress.completed && trialProgress.rewardClaimed);
      const isDefeated = isCompleted;
      const isVictoryPending = Boolean(trialProgress.completed && !trialProgress.rewardClaimed);
      const attempts = Math.max(0, Math.floor(Number(trialProgress.attempts) || 0));
      const isRegionUnlocked = badgeCount >= 18;

      let state = 'LOCKED';
      if (!isRegionUnlocked) {
        state = 'LOCKED';
      } else if (isCompleted) {
        state = 'REMATCH_AVAILABLE';
      } else if (isVictoryPending) {
        state = 'VICTORY_PENDING_REWARD';
      } else {
        state = 'AVAILABLE';
      }

      const statusText = !isRegionUnlocked
        ? 'Bloqueada. Conquiste as 18 insígnias para desbloquear.'
        : (isCompleted
          ? 'Concluída. Aliado recrutado. Revanche disponível.'
          : (isVictoryPending ? 'Vitória conquistada! Escolha de recompensa pendente.' : 'Disponível para desafio de elite.'));

      const ariaLabel = `${node.ariaLabelBase}. Estado: ${statusText}`;
      const canChallenge = isRegionUnlocked && !hasPendingReward;
      const cannotChallengeReason = !isRegionUnlocked
        ? 'Bloqueada. Conquiste as 18 insígnias para desbloquear.'
        : (hasPendingReward ? 'Resgate a recompensa pendente antes de iniciar uma nova batalha.' : null);

      const trainerName = trialDef.trainerName;
      const trainerTitle = trialDef.trainerTitle;
      const badgeName = trialDef.badgeName;
      const difficulty = trialDef.difficulty;
      const difficultyLabel = difficulty >= 5 ? 'EXTREMA' : 'DIFÍCIL';
      const team = trialDef.getTeam();

      return Object.freeze({
        ...node,
        challengeKind: trialKind,
        trialKey,
        state,
        isCompleted,
        isDefeated,
        isVictoryPending,
        isSelected,
        canChallenge,
        cannotChallengeReason,
        attempts,
        rewardPokemonId: trialProgress.rewardPokemonId || null,
        trainerName,
        trainerTitle,
        badgeName,
        difficulty,
        difficultyLabel,
        team,
        thumbnailSrc: '',
        avatarSrc: '',
        typeGuide: null,
        ariaLabel,
        isHidden: false,
        isVisible: true
      });
    }

    if (node.challengeKind === 'SUPER') {
      const isRegionUnlocked = badgeCount >= 18;
      const isDefeated = Boolean(superTrainer.defeated);
      const isCompleted = isDefeated;
      const rosterOk = rosterCount >= 24;
      const canChallenge = isRegionUnlocked && rosterOk && !isDefeated && !hasPendingReward;
      const attempts = Math.max(0, Math.floor(Number(superTrainer.attempts) || 0));
      const visual = Visuals.getSpecialTrainerVisual ? Visuals.getSpecialTrainerVisual('SUPER') : null;

      let state = 'LOCKED';
      if (!isRegionUnlocked) {
        state = 'LOCKED';
      } else if (isDefeated) {
        state = 'COMPLETED';
      } else if (canChallenge) {
        state = 'AVAILABLE';
      } else {
        state = 'LOCKED';
      }

      const statusText = !isRegionUnlocked
        ? 'Bloqueado. Conquiste as 18 insígnias para acessar.'
        : (isDefeated
          ? 'Derrotado. Campeão do Circuito dos Mestres.'
          : (canChallenge ? 'Disponível! Enfrente o Mestre dos Mais Fortes.' : 'Bloqueado. Requer elenco com pelo menos 24 Pokémon.'));

      const cannotChallengeReason = !isRegionUnlocked
        ? 'Bloqueado. Conquiste as 18 insígnias para acessar o Desafio Final.'
        : (!rosterOk
          ? `Bloqueado. Requer elenco com pelo menos 24 Pokémon (atual: ${rosterCount}/24).`
          : (isDefeated
            ? 'Super Treinador já derrotado.'
            : (hasPendingReward ? 'Resgate a recompensa pendente antes de iniciar uma nova batalha.' : null)));

      const ariaLabel = `${node.ariaLabelBase}. Estado: ${statusText}`;
      const trainerName = 'Super Treinador';
      const trainerTitle = 'O Mestre dos Mais Fortes';
      const badgeName = 'Campeão do Circuito';
      const difficulty = 5;
      const difficultyLabel = 'EXTREMA';
      const team = Catalog.SUPER_TEAM || [];
      const thumbnailSrc = visual?.thumbnailSrc || 'assets/images/trainers/thumbs/trainer-super.webp';
      const avatarSrc = visual?.avatarSrc || 'assets/images/trainers/trainer-super.png';

      return Object.freeze({
        ...node,
        state,
        isDefeated,
        isCompleted,
        isSelected,
        canChallenge,
        cannotChallengeReason,
        attempts,
        rewardPokemonId: superTrainer.rewardPokemonId || null,
        trainerName,
        trainerTitle,
        badgeName,
        difficulty,
        difficultyLabel,
        team,
        thumbnailSrc,
        avatarSrc,
        typeGuide: null,
        visual,
        ariaLabel,
        isHidden: false,
        isVisible: true
      });
    }

    if (node.challengeKind === 'SHADOW') {
      const isRevealed = Boolean(shadowTrainer.revealed);
      const isDefeated = Boolean(shadowTrainer.defeated);
      const isCompleted = isDefeated;
      const statusOk = campaignState?.status === 'SHADOW_AVAILABLE';
      const canChallenge = Boolean(isRevealed && statusOk && !isDefeated && !hasPendingReward);
      const attempts = Math.max(0, Math.floor(Number(shadowTrainer.attempts) || 0));
      const visual = Visuals.getSpecialTrainerVisual ? Visuals.getSpecialTrainerVisual('SHADOW') : null;

      let state = 'HIDDEN';
      if (!isRevealed) {
        state = 'HIDDEN';
      } else if (isDefeated) {
        state = 'COMPLETED';
      } else if (canChallenge) {
        state = 'AVAILABLE';
      } else {
        state = 'LOCKED';
      }

      const statusText = !isRevealed
        ? 'Oculto.'
        : (isDefeated ? 'Derrotado. O desafio final foi superado.' : 'Disponível! Anomalia Sombria — Batalha Final Stand.');

      const cannotChallengeReason = !isRevealed
        ? 'Oculto.'
        : (isDefeated
          ? 'Desafio Final superado.'
          : (!statusOk
            ? 'Desafio indisponível no momento.'
            : (hasPendingReward ? 'Resgate a recompensa pendente antes de iniciar uma nova batalha.' : null)));

      const ariaLabel = isRevealed ? `${node.ariaLabelBase}. Estado: ${statusText}` : '';
      const trainerName = 'Shadow Super Trainer';
      const trainerTitle = 'Anomalia Sombria — Desafio Final Verdadeiro';
      const badgeName = 'True Ending';
      const difficulty = 5;
      const difficultyLabel = 'EXTREMA';
      const team = Catalog.SUPER_TEAM || [];
      const thumbnailSrc = visual?.thumbnailSrc || 'assets/images/trainers/thumbs/trainer-shadow.webp';
      const avatarSrc = visual?.avatarSrc || 'assets/images/trainers/trainer-shadow.png';

      return Object.freeze({
        ...node,
        state,
        isRevealed,
        isDefeated,
        isCompleted,
        isHidden: !isRevealed,
        isSelected,
        canChallenge,
        cannotChallengeReason,
        attempts,
        trainerName,
        trainerTitle,
        badgeName,
        difficulty,
        difficultyLabel,
        team,
        thumbnailSrc,
        avatarSrc,
        typeGuide: null,
        visual,
        ariaLabel,
        isVisible: isRevealed
      });
    }

    return Object.freeze({
      ...node,
      state: 'AVAILABLE',
      isSelected,
      canChallenge: true,
      cannotChallengeReason: null,
      isVisible: true,
      isHidden: false,
      ariaLabel: node.ariaLabelBase
    });
  }

  function deriveRegionState(region, campaignState, mastersList, recommended, selectedNodeId, badgeCount, rosterCount) {
    const isUnlocked = region.unlockCondition.kind === 'ALWAYS'
      ? true
      : (['BADGE_COUNT', 'BADGES_COUNT'].includes(region.unlockCondition.kind)
          ? badgeCount >= (region.unlockCondition.count || region.unlockCondition.badgesRequired || 18)
          : true);

    const derivedNodes = region.nodes.map(n =>
      deriveNodeState(n, campaignState, mastersList, recommended, selectedNodeId, badgeCount, rosterCount)
    );

    const nodeStateMap = new Map(derivedNodes.map(n => [n.nodeId, n]));

    const derivedRoutes = (region.routes || []).map(route => {
      const fromNode = nodeStateMap.get(route.from);
      const toNode = nodeStateMap.get(route.to);

      let status = 'active';
      if (!fromNode || !toNode || fromNode.isHidden || toNode.isHidden || fromNode.state === 'HIDDEN' || toNode.state === 'HIDDEN') {
        status = 'hidden';
      } else if (fromNode.state === 'LOCKED' || toNode.state === 'LOCKED' || (!fromNode.canChallenge && !toNode.canChallenge && !fromNode.isDefeated && !toNode.isDefeated)) {
        status = 'locked';
      } else if (
        (fromNode.isDefeated || fromNode.isCompleted) &&
        (toNode.isDefeated || toNode.isCompleted)
      ) {
        status = 'completed';
      }

      return Object.freeze({
        ...route,
        status
      });
    });

    let defeatedCount = 0;
    let totalCount = 0;
    if (region.id === 'region-endgame') {
      const trials = (campaignState && campaignState.endgameTrials) || {};
      const trialCompletedCount = Object.values(trials).filter(t => t.completed && t.rewardClaimed).length;
      const superDefeated = campaignState?.superTrainer?.defeated ? 1 : 0;
      const shadowDefeated = campaignState?.shadowTrainer?.defeated ? 1 : 0;
      defeatedCount = trialCompletedCount + superDefeated + shadowDefeated;
      totalCount = 6;
    } else {
      const masterIds = region.nodes.filter(n => n.challengeKind === 'MASTER').map(n => n.challengeId);
      totalCount = masterIds.length;
      defeatedCount = masterIds.filter(id => campaignState?.challenges?.[id]?.badgeEarned).length;
    }

    const hasRecommended = Boolean(recommended && region.nodes.some(n => n.challengeId === recommended.challengeId));

    let badgeLabel = `${defeatedCount}/${totalCount}`;
    if (region.id === 'region-endgame') {
      badgeLabel = isUnlocked ? `${defeatedCount}/${totalCount}` : `Bloqueada (${badgeCount}/18)`;
    }

    return Object.freeze({
      ...region,
      isUnlocked,
      isLocked: !isUnlocked,
      badgeCount,
      maxBadges: 18,
      defeatedCount,
      totalCount,
      badgeLabel,
      hasRecommended,
      nodes: Object.freeze(derivedNodes),
      routes: Object.freeze(derivedRoutes)
    });
  }

  function buildMapViewModel(options = {}) {
    const catalog = options.catalog || (typeof window !== 'undefined' && window.PBACampaign ? window.PBACampaign.CAMPAIGN_MAP_CATALOG : null);
    const campaignState = options.campaignState || {};
    const manager = options.manager || null;
    const masters = options.masters || (typeof window !== 'undefined' && window.PBACampaign ? window.PBACampaign.MASTERS : (Catalog && Catalog.MASTERS ? Catalog.MASTERS : [])) || [];

    if (!catalog || !Array.isArray(catalog.regions)) {
      throw new Error('Catalog com array regions é obrigatório para buildMapViewModel.');
    }

    let badgeCount = 0;
    let rosterCount = 0;
    if (manager && typeof manager.getBadgeCount === 'function') {
      badgeCount = manager.getBadgeCount();
    } else {
      const challenges = campaignState.challenges || {};
      badgeCount = Object.values(challenges).filter(c => c.badgeEarned).length;
    }

    if (manager && typeof manager.getRosterIds === 'function') {
      rosterCount = manager.getRosterIds().length;
    } else {
      const base = campaignState.startingRosterIds || [];
      const masterRewards = Object.values(campaignState.challenges || {}).map(c => c.rewardPokemonId).filter(Boolean);
      const superReward = campaignState.superTrainer?.rewardPokemonId;
      const trialRewards = Object.values(campaignState.endgameTrials || {}).map(t => t.rewardPokemonId).filter(Boolean);
      const wildCaptures = campaignState.wild?.capturedIds || [];
      rosterCount = new Set([...base, ...masterRewards, superReward, ...trialRewards, ...wildCaptures].filter(Boolean)).size;
      if (rosterCount === 0 && Array.isArray(campaignState.startingRosterIds)) {
        rosterCount = campaignState.startingRosterIds.length;
      }
    }

    const recommended = findRecommendedMaster(campaignState, masters);
    const selectedNodeId = options.selectedNodeId || null;

    const derivedRegions = catalog.regions.map(region =>
      deriveRegionState(region, campaignState, masters, recommended, selectedNodeId, badgeCount, rosterCount)
    );

    const isEndgameUnlocked = badgeCount >= 18;

    let activeRegionId = options.activeRegionId || 'region-1';
    if (activeRegionId === 'region-endgame' && !isEndgameUnlocked) {
      activeRegionId = 'region-1';
    }

    const activeRegion = derivedRegions.find(r => r.id === activeRegionId) || derivedRegions[0];

    let selectedNode = null;
    if (selectedNodeId) {
      for (const reg of derivedRegions) {
        const found = reg.nodes.find(n => n.nodeId === selectedNodeId);
        if (found) {
          selectedNode = found;
          break;
        }
      }
    }

    const viewMode = options.viewMode === 'list' ? 'list' : 'map';

    return Object.freeze({
      badgeCount,
      rosterCount,
      isEndgameUnlocked,
      recommendedMaster: recommended,
      activeRegionId: activeRegion.id,
      activeRegion,
      regions: Object.freeze(derivedRegions),
      selectedNodeId: selectedNode ? selectedNode.nodeId : null,
      selectedNode,
      viewMode,
      hasPendingReward: Boolean(campaignState.pendingReward),
      isCampaignCompleted: campaignState.status === 'COMPLETED',
      isCompleted: campaignState.status === 'COMPLETED'
    });
  }

  function findTravelPath(region, startNodeId, targetNodeId) {
    const visible = node => node && !node.isHidden && node.state !== 'HIDDEN';
    const nodes = new Map((region?.nodes || []).filter(visible).map(node => [node.nodeId, node]));
    if (!nodes.has(startNodeId) || !nodes.has(targetNodeId)) return null;
    if (startNodeId === targetNodeId) return [];

    const edges = new Map([...nodes.keys()].map(id => [id, []]));
    for (const route of region.routes || []) {
      if (route.status === 'hidden' || !nodes.has(route.from) || !nodes.has(route.to)) continue;
      const from = nodes.get(route.from).position;
      const to = nodes.get(route.to).position;
      const distance = Math.hypot((to.x - from.x) * 10, (to.y - from.y) * 5.625) || 1;
      edges.get(route.from).push({ routeId: route.routeId, from: route.from, to: route.to, reversed: false, distance });
      edges.get(route.to).push({ routeId: route.routeId, from: route.to, to: route.from, reversed: true, distance });
    }

    const remaining = new Set(nodes.keys());
    const costs = new Map([[startNodeId, 0]]);
    const previous = new Map();
    while (remaining.size) {
      let current = null;
      for (const id of remaining) {
        if (current === null || (costs.get(id) ?? Infinity) < (costs.get(current) ?? Infinity)) current = id;
      }
      if (current === null || !Number.isFinite(costs.get(current))) break;
      if (current === targetNodeId) break;
      remaining.delete(current);
      for (const edge of edges.get(current)) {
        if (!remaining.has(edge.to)) continue;
        const nextCost = costs.get(current) + edge.distance;
        if (nextCost < (costs.get(edge.to) ?? Infinity)) {
          costs.set(edge.to, nextCost);
          previous.set(edge.to, edge);
        }
      }
    }

    if (!previous.has(targetNodeId)) return null;
    const path = [];
    for (let id = targetNodeId; id !== startNodeId;) {
      const edge = previous.get(id);
      if (!edge) return null;
      path.unshift(edge);
      id = edge.from;
    }
    return path;
  }

  const api = Object.freeze({
    findRecommendedMaster,
    deriveNodeState,
    deriveRegionState,
    buildMapViewModel,
    findTravelPath,
    isTrial,
    getTrialKind,
    TRIAL_DEFINITIONS,
    CampaignMapModel: Object.freeze({
      findRecommendedMaster,
      deriveNodeState,
      deriveRegionState,
      buildMapViewModel,
      findTravelPath,
      isTrial,
      getTrialKind,
      TRIAL_DEFINITIONS
    }),
    CAMPAIGN_MAP_MODEL: Object.freeze({
      findRecommendedMaster,
      deriveNodeState,
      deriveRegionState,
      buildMapViewModel,
      findTravelPath,
      isTrial,
      getTrialKind,
      TRIAL_DEFINITIONS
    })
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  if (typeof window !== 'undefined') {
    window.PBACampaign = window.PBACampaign || {};
    Object.assign(window.PBACampaign, api);
    window.PBACampaign.CampaignMapModel = api;
    window.PBACampaign.CAMPAIGN_MAP_MODEL = api;
  }
})();
