(function () {
  const TypeChart = typeof module !== 'undefined' && module.exports
    ? require('../battle/type-chart.js')
    : window.PBABattle;
  const TYPE_LABELS = Object.freeze({
    normal: 'Normal', fire: 'Fogo', water: 'Água', electric: 'Elétrico',
    grass: 'Planta', ice: 'Gelo', fighting: 'Lutador', poison: 'Venenoso',
    ground: 'Terra', flying: 'Voador', psychic: 'Psíquico', bug: 'Inseto',
    rock: 'Pedra', ghost: 'Fantasma', dragon: 'Dragão', dark: 'Sombrio',
    steel: 'Aço', fairy: 'Fada'
  });
  const TYPE_ICONS = Object.freeze({
    normal:'⚪', fire:'🔥', water:'💧', electric:'⚡', grass:'🌿', ice:'❄️',
    fighting:'🥊', poison:'☠️', ground:'🌍', flying:'🕊️', psychic:'🔮',
    bug:'🐛', rock:'🪨', ghost:'👻', dragon:'🐉', dark:'🌑', steel:'⚙️', fairy:'✨'
  });
  function getTypeGuide(masterType) {
    if (!TypeChart.TYPE_CHART[masterType]) throw new Error(`Unknown master type: ${masterType}`);
    const types = TypeChart.ALL_TYPES;
    return Object.freeze({
      type: masterType,
      label: TYPE_LABELS[masterType],
      offensiveStrengths: Object.freeze(types.filter(defenderType => TypeChart.TYPE_CHART[masterType][defenderType] === 2)),
      defensiveWeaknesses: Object.freeze(types.filter(attackType => TypeChart.TYPE_CHART[attackType][masterType] === 2))
    });
  }
  const api = Object.freeze({ TYPE_LABELS, TYPE_ICONS, getTypeGuide });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else { window.PBACampaign = window.PBACampaign || {}; Object.assign(window.PBACampaign, api); }
})();