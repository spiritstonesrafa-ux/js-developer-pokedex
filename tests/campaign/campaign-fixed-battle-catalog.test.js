const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const Campaign = require('../../assets/js/campaign/campaign-catalog.js');
const Fixed = require('../../assets/js/campaign/campaign-fixed-battle-catalog.js');
const Session = require('../../assets/js/battle-session/battle-session-controller.js').BattleSessionController;
const Hydrator = require('../../assets/js/battle-session/battle-team-hydrator.js').BattleTeamHydrator;
const Engine = require('../../assets/js/battle/battle-engine.js');
const { isMechanicallySupportedMove, MOVESET_LOADOUT_SOURCE } =
  require('../../assets/js/battle-session/battle-session-constants.js');
const Guide = require('../../assets/js/campaign/campaign-matchup-guide.js');

const trialTeams = [
  Campaign.LEGENDARY_TRIAL_TEAM, Campaign.MYTHICAL_TRIAL_TEAM,
  Campaign.TITANS_TRIAL_TEAM, Campaign.CELESTIAL_TRIAL_TEAM
];
const obtainable = new Set([
  ...Campaign.DRAFT, ...Campaign.MASTER_SPECIES, ...Campaign.SUPER_TEAM,
  ...trialTeams.flat()
].map(pokemon => pokemon.id));

test('every currently obtainable campaign Pokémon has four distinct supported fixed moves', () => {
  assert.equal(obtainable.size, 468);
  assert.equal(Object.keys(Fixed.extras).length, 18);
  for (const id of obtainable) {
    const pokemon = Fixed.byId[id];
    assert.ok(pokemon, `missing Pokémon ${id}`);
    assert.equal(pokemon.moves.length, 4, `wrong move count for ${id}`);
    assert.equal(new Set(pokemon.moves.map(move => move.id)).size, 4, `duplicate move for ${id}`);
    for (const move of pokemon.moves) {
      assert.equal(isMechanicallySupportedMove(move), true, `${id}: ${move.name}`);
      assert.ok(move.accuracy === null || Number.isInteger(move.accuracy));
      assert.ok(Number.isInteger(move.pp) && move.pp > 0);
    }
  }
});

test('all 18 Masters, Super, Shadow and four Trials have fixed opposing teams', () => {
  const teams = [
    ...Campaign.MASTERS.map(master => master.team), Campaign.SUPER_TEAM,
    Campaign.SUPER_TEAM, ...trialTeams
  ];
  assert.equal(teams.length, 24);
  for (const team of teams) {
    for (const pokemon of team) assert.ok(Fixed.byId[pokemon.id]?.moves?.length === 4);
  }
});

test('campaign preparation uses identical fixed moves for both sides with zero API calls', async () => {
  let apiCalls = 0;
  const api = { getPokemonDetail: async () => { apiCalls++; throw Error('offline'); },
    getMoveDetail: async () => { apiCalls++; throw Error('offline'); } };
  const session = new Session({ hydrator: new Hydrator({ api }), engine: Engine,
    view: { renderState() {} } });
  const playerIds = [3, 264, 1007];
  const enemyIds = Campaign.SUPER_TEAM.map(pokemon => pokemon.id);
  const battle = await session.prepareBattle({
    playerTeamIds: playerIds, enemyTeamIds: enemyIds,
    metadata: { mode: 'CAMPAIGN', kind: 'SUPER' }
  });
  assert.ok(battle);
  assert.equal(apiCalls, 0);
  for (const combatant of [...session.playerTeam, ...session.enemyTeam]) {
    assert.equal(combatant.moveLoadoutSource, MOVESET_LOADOUT_SOURCE.CAMPAIGN_FIXED_MOVESET);
    assert.deepEqual(combatant.moves.map(move => move.name),
      Fixed.byId[combatant.id].moves.map(move => move.name));
  }
  const report = Guide.buildReport({
    selected: playerIds.map(Campaign.byId), opponents: Campaign.SUPER_TEAM,
    fallbackById: Fixed.byId
  });
  assert.deepEqual(report.entries[0].moves.map(move => move.name),
    session.playerTeam[0].moves.map(move => move.name));
  assert.equal(report.fullyFixed, true);
  assert.match(Guide.renderReport(report), /quatro golpes exibidos são os usados/);
  assert.match(Guide.renderReport(report), /Poder/);
});

test('Quick Battle still fetches species through its existing API path', async () => {
  let apiCalls = 0;
  const api = { getPokemonDetail: async id => {
    apiCalls++;
    return Fixed.byId[id];
  } };
  const session = new Session({ hydrator: new Hydrator({ api }), engine: Engine,
    view: { renderState() {} } });
  const battle = await session.prepareBattle({
    playerTeamIds: [3, 6, 9], enemyTeamIds: [25, 38, 59],
    metadata: { mode: 'QUICK' }
  });
  assert.ok(battle);
  assert.equal(apiCalls, 6);
  assert.ok(session.playerTeam.every(pokemon =>
    pokemon.moveLoadoutSource === MOVESET_LOADOUT_SOURCE.API_MOVESET));
});

test('an unsupported legacy roster member remains playable through the old path', async () => {
  let apiCalls = 0;
  const api = { getPokemonDetail: async () => { apiCalls++; throw Error('offline'); } };
  const session = new Session({ hydrator: new Hydrator({ api }), engine: Engine,
    view: { renderState() {} } });
  const battle = await session.prepareBattle({
    playerTeamIds: [384, 3, 6], enemyTeamIds: Campaign.SUPER_TEAM.map(pokemon => pokemon.id),
    metadata: { mode: 'CAMPAIGN', kind: 'SUPER' }
  });
  assert.ok(battle);
  assert.equal(apiCalls, 1);
  assert.equal(session.playerTeam[0].id, 384);
  assert.equal(session.playerTeam[1].moveLoadoutSource, MOVESET_LOADOUT_SOURCE.CAMPAIGN_FIXED_MOVESET);
});

test('fixed loader rejects malformed or mechanically unsupported move lists', () => {
  const hydrator = new Hydrator({ api: null });
  const valid = Fixed.byId[3].moves;
  assert.throws(() => hydrator.createCampaignFixedLoadout(valid.slice(0, 3)), /inválido/);
  assert.throws(() => hydrator.createCampaignFixedLoadout([
    ...valid.slice(0, 3), { ...valid[3], name: 'close-combat' }
  ]), /inválido/);
});

test('browser script order exposes fixed moves to a campaign battle started after boot', async () => {
  const context = { console };
  context.window = context;
  vm.createContext(context);
  const scripts = [
    'battle/battle-constants.js',
    'battle/type-chart.js',
    'battle/type-effectiveness.js',
    'battle-session/battle-session-constants.js',
    'campaign/campaign-battle-fallback-catalog.js',
    'battle-session/battle-team-hydrator.js',
    'battle-session/battle-session-controller.js',
    'campaign/campaign-constants.js',
    'campaign/campaign-draft-ids.js',
    'campaign/campaign-pokemon-catalog.js',
    'campaign/campaign-catalog.js',
    'campaign/campaign-fixed-battle-catalog.js',
    'campaign/campaign-matchup-guide.js'
  ];
  for (const file of scripts) {
    const source = fs.readFileSync(path.join(__dirname, '../../assets/js', file), 'utf8');
    vm.runInContext(source, context, { filename: file });
  }
  assert.equal(Object.keys(context.PBACampaign.CampaignFixedBattleCatalog.byId).length, 468);
  assert.ok(context.PBACampaign.MatchupGuide);
  assert.ok(context.PBABattleSession.BattleSessionController);
  const html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8');
  assert.ok(html.indexOf('campaign-catalog.js') < html.indexOf('campaign-fixed-battle-catalog.js'));
  assert.ok(html.indexOf('campaign-fixed-battle-catalog.js') < html.indexOf('campaign-matchup-guide.js'));
  let apiCalls = 0;
  const hydrator = new context.PBABattleSession.BattleTeamHydrator({
    api: { getPokemonDetail: async () => { apiCalls++; throw Error('offline'); } }
  });
  const session = new context.PBABattleSession.BattleSessionController({
    hydrator, engine: Engine, view: { renderState() {} }
  });
  assert.equal(session.engine, Engine);
  const battle = await session.prepareBattle({
    playerTeamIds: [3, 264, 1007], enemyTeamIds: [493, 890, 150],
    metadata: { mode: 'CAMPAIGN', kind: 'SUPER' }
  });
  assert.ok(battle);
  assert.equal(apiCalls, 0);
  assert.equal(session.playerTeam[0].moveLoadoutSource, 'CAMPAIGN_FIXED_MOVESET');
});
