(function () {
  'use strict';

  const regions = [
    {
      id: 'region-1',
      name: 'Planícies & Costas',
      shortName: 'Região 1',
      subtitle: 'Costa das Brisas e Prados Primordiais',
      themeClass: 'theme-region-verdant',
      fallbackTheme: {
        background: 'linear-gradient(135deg, #102a27 0%, #16382c 45%, #0f2438 100%)',
        accentColor: '#48bb78'
      },
      unlockCondition: Object.freeze({ kind: 'ALWAYS' }),
      routes: [
        { routeId: 'r1-normal-grass', from: 'node-normal', to: 'node-grass', pathD: 'M 150 405 C 200 350, 240 300, 280 248' },
        { routeId: 'r1-grass-bug', from: 'node-grass', to: 'node-bug', pathD: 'M 280 248 C 260 180, 230 150, 200 124' },
        { routeId: 'r1-normal-water', from: 'node-normal', to: 'node-water', pathD: 'M 150 405 C 280 460, 420 465, 520 450' },
        { routeId: 'r1-water-electric', from: 'node-water', to: 'node-electric', pathD: 'M 520 450 C 600 440, 680 380, 740 315' },
        { routeId: 'r1-electric-flying', from: 'node-electric', to: 'node-flying', pathD: 'M 740 315 C 780 250, 820 190, 860 135' },
        { routeId: 'r1-bug-flying', from: 'node-bug', to: 'node-flying', pathD: 'M 200 124 C 400 80, 650 90, 860 135' }
      ].map(Object.freeze),
      nodes: [
        {
          nodeId: 'node-normal',
          challengeKind: 'MASTER',
          challengeId: 'master-normal',
          type: 'normal',
          position: Object.freeze({ x: 15.0, y: 72.0 }),
          biomeLabel: 'Planície Serena',
          ariaLabelBase: 'Mestre Aster, Tipo Normal, Insígnia do Horizonte'
        },
        {
          nodeId: 'node-grass',
          challengeKind: 'MASTER',
          challengeId: 'master-grass',
          type: 'grass',
          position: Object.freeze({ x: 28.0, y: 44.0 }),
          biomeLabel: 'Bosque Ancestral',
          ariaLabelBase: 'Mestre Flora, Tipo Planta, Insígnia do Broto'
        },
        {
          nodeId: 'node-bug',
          challengeKind: 'MASTER',
          challengeId: 'master-bug',
          type: 'bug',
          position: Object.freeze({ x: 20.0, y: 22.0 }),
          biomeLabel: 'Bosque dos Esporos',
          ariaLabelBase: 'Mestre Nilo, Tipo Inseto, Insígnia da Trama'
        },
        {
          nodeId: 'node-water',
          challengeKind: 'MASTER',
          challengeId: 'master-water',
          type: 'water',
          position: Object.freeze({ x: 52.0, y: 80.0 }),
          biomeLabel: 'Santuário das Marés',
          ariaLabelBase: 'Mestre Marina, Tipo Água, Insígnia da Maré'
        },
        {
          nodeId: 'node-electric',
          challengeKind: 'MASTER',
          challengeId: 'master-electric',
          type: 'electric',
          position: Object.freeze({ x: 74.0, y: 56.0 }),
          biomeLabel: 'Colinas da Tempestade',
          ariaLabelBase: 'Mestre Volt, Tipo Elétrico, Insígnia do Pulso'
        },
        {
          nodeId: 'node-flying',
          challengeKind: 'MASTER',
          challengeId: 'master-flying',
          type: 'flying',
          position: Object.freeze({ x: 86.0, y: 24.0 }),
          biomeLabel: 'Picos dos Ventos',
          ariaLabelBase: 'Mestre Aero, Tipo Voador, Insígnia da Corrente'
        }
      ].map(Object.freeze)
    },
    {
      id: 'region-2',
      name: 'Fendas & Picos',
      shortName: 'Região 2',
      subtitle: 'Cordilheira das Fendas e Picos Elementais',
      themeClass: 'theme-region-crags',
      fallbackTheme: {
        background: 'linear-gradient(135deg, #2b140c 0%, #3d1c19 45%, #182236 100%)',
        accentColor: '#c05621'
      },
      unlockCondition: Object.freeze({ kind: 'ALWAYS' }),
      routes: [
        { routeId: 'r2-fighting-ground', from: 'node-fighting', to: 'node-ground', pathD: 'M 160 394 C 240 430, 340 455, 420 461' },
        { routeId: 'r2-fighting-poison', from: 'node-fighting', to: 'node-poison', pathD: 'M 160 394 C 150 320, 160 250, 180 191' },
        { routeId: 'r2-ground-rock', from: 'node-ground', to: 'node-rock', pathD: 'M 420 461 C 520 470, 620 460, 720 428' },
        { routeId: 'r2-poison-fire', from: 'node-poison', to: 'node-fire', pathD: 'M 180 191 C 260 170, 360 150, 460 158' },
        { routeId: 'r2-rock-fire', from: 'node-rock', to: 'node-fire', pathD: 'M 720 428 C 640 340, 550 240, 460 158' },
        { routeId: 'r2-rock-ice', from: 'node-rock', to: 'node-ice', pathD: 'M 720 428 C 760 330, 800 210, 840 101' },
        { routeId: 'r2-fire-ice', from: 'node-fire', to: 'node-ice', pathD: 'M 460 158 C 580 110, 720 90, 840 101' }
      ].map(Object.freeze),
      nodes: [
        {
          nodeId: 'node-fighting',
          challengeKind: 'MASTER',
          challengeId: 'master-fighting',
          type: 'fighting',
          position: Object.freeze({ x: 16.0, y: 70.0 }),
          biomeLabel: 'Platô do Dojo Marcial',
          ariaLabelBase: 'Mestre Dante, Tipo Lutador, Insígnia do Punho'
        },
        {
          nodeId: 'node-ground',
          challengeKind: 'MASTER',
          challengeId: 'master-ground',
          type: 'ground',
          position: Object.freeze({ x: 42.0, y: 82.0 }),
          biomeLabel: 'Cânion Terracota',
          ariaLabelBase: 'Mestre Terra, Tipo Terrestre, Insígnia do Estrato'
        },
        {
          nodeId: 'node-poison',
          challengeKind: 'MASTER',
          challengeId: 'master-poison',
          type: 'poison',
          position: Object.freeze({ x: 18.0, y: 34.0 }),
          biomeLabel: 'Cisterna Alquímica',
          ariaLabelBase: 'Mestre Vesper, Tipo Venenoso, Insígnia da Névoa'
        },
        {
          nodeId: 'node-rock',
          challengeKind: 'MASTER',
          challengeId: 'master-rock',
          type: 'rock',
          position: Object.freeze({ x: 72.0, y: 76.0 }),
          biomeLabel: 'Pedreira Monolítica',
          ariaLabelBase: 'Mestre Petra, Tipo Pedra, Insígnia do Granito'
        },
        {
          nodeId: 'node-fire',
          challengeKind: 'MASTER',
          challengeId: 'master-fire',
          type: 'fire',
          position: Object.freeze({ x: 46.0, y: 28.0 }),
          biomeLabel: 'Caldeira Vulcânica',
          ariaLabelBase: 'Mestre Kael, Tipo Fogo, Insígnia da Brasa'
        },
        {
          nodeId: 'node-ice',
          challengeKind: 'MASTER',
          challengeId: 'master-ice',
          type: 'ice',
          position: Object.freeze({ x: 84.0, y: 18.0 }),
          biomeLabel: 'Caverna Glacial',
          ariaLabelBase: 'Mestre Yara, Tipo Gelo, Insígnia do Cristal'
        }
      ].map(Object.freeze)
    },
    {
      id: 'region-3',
      name: 'Domínios Arcanos',
      shortName: 'Região 3',
      subtitle: 'Terras Místicas e Fortaleza do Véu',
      themeClass: 'theme-region-arcane',
      fallbackTheme: {
        background: 'linear-gradient(135deg, #18122c 0%, #2b1744 45%, #12213a 100%)',
        accentColor: '#9f7aea'
      },
      unlockCondition: Object.freeze({ kind: 'ALWAYS' }),
      routes: [
        { routeId: 'r3-fairy-psychic', from: 'node-fairy', to: 'node-psychic', pathD: 'M 240 461 C 210 390, 190 310, 180 225' },
        { routeId: 'r3-fairy-dark', from: 'node-fairy', to: 'node-dark', pathD: 'M 240 461 C 360 465, 480 445, 600 405' },
        { routeId: 'r3-psychic-ghost', from: 'node-psychic', to: 'node-ghost', pathD: 'M 180 225 C 220 160, 280 120, 360 101' },
        { routeId: 'r3-dark-steel', from: 'node-dark', to: 'node-steel', pathD: 'M 600 405 C 680 400, 760 365, 820 304' },
        { routeId: 'r3-ghost-dragon', from: 'node-ghost', to: 'node-dragon', pathD: 'M 360 101 C 480 80, 620 85, 760 113' },
        { routeId: 'r3-steel-dragon', from: 'node-steel', to: 'node-dragon', pathD: 'M 820 304 C 810 240, 790 170, 760 113' }
      ].map(Object.freeze),
      nodes: [
        {
          nodeId: 'node-fairy',
          challengeKind: 'MASTER',
          challengeId: 'master-fairy',
          type: 'fairy',
          position: Object.freeze({ x: 24.0, y: 82.0 }),
          biomeLabel: 'Clareira Encantada',
          ariaLabelBase: 'Mestre Lumi, Tipo Fada, Insígnia da Aurora'
        },
        {
          nodeId: 'node-psychic',
          challengeKind: 'MASTER',
          challengeId: 'master-psychic',
          type: 'psychic',
          position: Object.freeze({ x: 18.0, y: 40.0 }),
          biomeLabel: 'Observatório Astral',
          ariaLabelBase: 'Mestre Orion, Tipo Psíquico, Insígnia do Prisma'
        },
        {
          nodeId: 'node-dark',
          challengeKind: 'MASTER',
          challengeId: 'master-dark',
          type: 'dark',
          position: Object.freeze({ x: 60.0, y: 72.0 }),
          biomeLabel: 'Ruínas do Eclipse',
          ariaLabelBase: 'Mestre Noctis, Tipo Sombrio, Insígnia do Abismo'
        },
        {
          nodeId: 'node-ghost',
          challengeKind: 'MASTER',
          challengeId: 'master-ghost',
          type: 'ghost',
          position: Object.freeze({ x: 36.0, y: 18.0 }),
          biomeLabel: 'Mausoléu Espectral',
          ariaLabelBase: 'Mestre Nyra, Tipo Fantasma, Insígnia do Eclipse'
        },
        {
          nodeId: 'node-steel',
          challengeKind: 'MASTER',
          challengeId: 'master-steel',
          type: 'steel',
          position: Object.freeze({ x: 82.0, y: 54.0 }),
          biomeLabel: 'Fortaleza Siderúrgica',
          ariaLabelBase: 'Mestre Ferrum, Tipo Aço, Insígnia da Liga'
        },
        {
          nodeId: 'node-dragon',
          challengeKind: 'MASTER',
          challengeId: 'master-dragon',
          type: 'dragon',
          position: Object.freeze({ x: 76.0, y: 20.0 }),
          biomeLabel: 'Santuário Dracônico',
          ariaLabelBase: 'Mestre Riven, Tipo Dragão, Insígnia Draco'
        }
      ].map(Object.freeze)
    },
    {
      id: 'region-endgame',
      name: 'Pináculo do Circuito',
      shortName: 'Região Final',
      subtitle: 'Apex Summit: Trono dos Campeões',
      themeClass: 'theme-region-endgame',
      fallbackTheme: {
        background: 'radial-gradient(circle at 50% 30%, #2a1b4e 0%, #15102a 55%, #0a0816 100%)',
        accentColor: '#d4af37'
      },
      unlockCondition: Object.freeze({ kind: 'BADGE_COUNT', count: 18 }),
      routes: [
        { routeId: 'rend-legendary-titans', from: 'node-legendary', to: 'node-titans', pathD: 'M 200 394 C 200 330, 210 260, 220 203' },
        { routeId: 'rend-mythical-celestial', from: 'node-mythical', to: 'node-celestial', pathD: 'M 800 394 C 800 330, 790 260, 780 203' },
        { routeId: 'rend-titans-super', from: 'node-titans', to: 'node-super', pathD: 'M 220 203 C 300 175, 400 160, 500 158' },
        { routeId: 'rend-celestial-super', from: 'node-celestial', to: 'node-super', pathD: 'M 780 203 C 700 175, 600 160, 500 158' },
        { routeId: 'rend-legendary-super', from: 'node-legendary', to: 'node-super', pathD: 'M 200 394 C 300 330, 420 240, 500 158' },
        { routeId: 'rend-mythical-super', from: 'node-mythical', to: 'node-super', pathD: 'M 800 394 C 700 330, 580 240, 500 158' },
        { routeId: 'rend-super-shadow', from: 'node-super', to: 'node-shadow', pathD: 'M 500 158 L 500 68' }
      ].map(Object.freeze),
      nodes: [
        {
          nodeId: 'node-legendary',
          challengeKind: 'LEGENDARY_TRIAL',
          challengeId: 'legendary',
          type: 'special',
          position: Object.freeze({ x: 20.0, y: 70.0 }),
          biomeLabel: 'Santuário das Lendas',
          visibilityPolicy: 'ALWAYS_IN_REGION',
          ariaLabelBase: 'Prova Lendária — Desafio Especial de Elite'
        },
        {
          nodeId: 'node-mythical',
          challengeKind: 'MYTHICAL_TRIAL',
          challengeId: 'mythical',
          type: 'special',
          position: Object.freeze({ x: 80.0, y: 70.0 }),
          biomeLabel: 'Santuário Mítico',
          visibilityPolicy: 'ALWAYS_IN_REGION',
          ariaLabelBase: 'Prova Mítica — Desafio Especial de Elite'
        },
        {
          nodeId: 'node-titans',
          challengeKind: 'TITANS_TRIAL',
          challengeId: 'titans',
          type: 'special',
          position: Object.freeze({ x: 22.0, y: 36.0 }),
          biomeLabel: 'Arena dos Titãs',
          visibilityPolicy: 'ALWAYS_IN_REGION',
          ariaLabelBase: 'Prova dos Titãs — Desafio Especial de Elite'
        },
        {
          nodeId: 'node-celestial',
          challengeKind: 'CELESTIAL_TRIAL',
          challengeId: 'celestial',
          type: 'special',
          position: Object.freeze({ x: 78.0, y: 36.0 }),
          biomeLabel: 'Templo Celestial',
          visibilityPolicy: 'ALWAYS_IN_REGION',
          ariaLabelBase: 'Prova Celestial — Desafio Especial de Elite'
        },
        {
          nodeId: 'node-super',
          challengeKind: 'SUPER',
          challengeId: 'super',
          type: 'special',
          position: Object.freeze({ x: 50.0, y: 28.0 }),
          biomeLabel: 'Arena do Campeão',
          visibilityPolicy: 'ALWAYS_IN_REGION',
          ariaLabelBase: 'Super Treinador — O Mestre dos Mais Fortes'
        },
        {
          nodeId: 'node-shadow',
          challengeKind: 'SHADOW',
          challengeId: 'shadow',
          type: 'special',
          position: Object.freeze({ x: 50.0, y: 12.0 }),
          biomeLabel: 'Trono do Eclipse',
          visibilityPolicy: 'SHADOW_REVEALED',
          ariaLabelBase: 'Shadow Super Trainer — O Desafio Final'
        }
      ].map(Object.freeze)
    }
  ].map(Object.freeze);

  function deepFreeze(obj, visited = new WeakSet()) {
    if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
      return obj;
    }
    if (visited.has(obj)) {
      return obj;
    }
    visited.add(obj);

    for (const key of Object.getOwnPropertyNames(obj)) {
      const val = obj[key];
      if (val !== null && (typeof val === 'object' || typeof val === 'function')) {
        deepFreeze(val, visited);
      }
    }
    return Object.freeze(obj);
  }

  const CAMPAIGN_MAP_CATALOG = deepFreeze({
    regions,
    byId: Object.fromEntries(regions.map(r => [r.id, r])),
    allNodeIds: regions.flatMap(r => r.nodes.map(n => n.nodeId)),
    allNodes: regions.flatMap(r => r.nodes),
    getRegionById: id => regions.find(r => r.id === id) || null,
    getNodeById: id => regions.flatMap(r => r.nodes).find(n => n.nodeId === id) || null
  });

  const api = deepFreeze({
    CAMPAIGN_MAP_CATALOG,
    CampaignMapCatalog: CAMPAIGN_MAP_CATALOG
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  if (typeof window !== 'undefined') {
    window.PBACampaign = window.PBACampaign || {};
    Object.assign(window.PBACampaign, api);
    window.PBACampaign.CAMPAIGN_MAP_CATALOG = CAMPAIGN_MAP_CATALOG;
    window.PBACampaign.CampaignMapCatalog = CAMPAIGN_MAP_CATALOG;
  }
})();

