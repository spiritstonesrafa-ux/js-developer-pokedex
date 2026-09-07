
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Visuals = require('../../assets/js/campaign/campaign-trainer-visuals.js');
const Avatar = require('../../assets/js/campaign/trainer-avatar-view.js');
const Catalog = require('../../assets/js/campaign/campaign-catalog.js');
const { CampaignManager } = require('../../assets/js/campaign/campaign-manager.js');

const MASTER_ART = Object.freeze({
  'master-normal':'assets/images/trainers/aster.png', 'master-fire':'assets/images/trainers/kael.png',
  'master-water':'assets/images/trainers/marina.png', 'master-electric':'assets/images/trainers/volt.png',
  'master-grass':'assets/images/trainers/flora.png', 'master-ice':'assets/images/trainers/yara.png',
  'master-fighting':'assets/images/trainers/dante.png', 'master-poison':'assets/images/trainers/vesper.png',
  'master-ground':'assets/images/trainers/terra.png', 'master-flying':'assets/images/trainers/aero.png',
  'master-psychic':'assets/images/trainers/orion.png', 'master-bug':'assets/images/trainers/nilo.png',
  'master-rock':'assets/images/trainers/petra.png', 'master-ghost':'assets/images/trainers/nyra.png',
  'master-dragon':'assets/images/trainers/riven.png', 'master-dark':'assets/images/trainers/noctis.png',
  'master-steel':'assets/images/trainers/ferrum.png', 'master-fairy':'assets/images/trainers/lumi.png'
});
const SPECIAL_ART = Object.freeze({
  SUPER:'assets/images/trainers/super-trainer.png',
  SHADOW:'assets/images/trainers/super-trainer-shadow.png'
});

test('trainer avatar mapping assigns final local art to all canonical Masters and Specials', () => {
  assert.equal(Visuals.MASTER_TRAINER_VISUALS.length, 18);
  Catalog.MASTERS.forEach(master => {
    const visual = Visuals.getMasterVisual(master.challengeId);
    assert.equal(visual.displayName, master.trainerName);
    assert.equal(visual.type, master.type);
    assert.equal(visual.avatarSrc, MASTER_ART[master.challengeId]);
  });
  assert.equal(Visuals.getSpecialTrainerVisual('SUPER').avatarSrc, SPECIAL_ART.SUPER);
  assert.equal(Visuals.getSpecialTrainerVisual('SHADOW').avatarSrc, SPECIAL_ART.SHADOW);
  assert.notEqual(SPECIAL_ART.SUPER, SPECIAL_ART.SHADOW);
});

test('trainer avatar final-art counts, paths, and files are complete and distinct', () => {
  const masterPaths = Visuals.MASTER_TRAINER_VISUALS.map(x => x.avatarSrc);
  const specialPaths = Object.values(Visuals.SPECIAL_TRAINER_VISUALS).map(x => x.avatarSrc);
  const allPaths = masterPaths.concat(specialPaths);
  assert.equal(masterPaths.filter(Boolean).length, 18);
  assert.equal(masterPaths.filter(x => !x).length, 0);
  assert.equal(specialPaths.filter(Boolean).length, 2);
  assert.equal(specialPaths.filter(x => !x).length, 0);
  assert.equal(allPaths.length, 20);
  assert.equal(new Set(allPaths).size, 20);
  allPaths.forEach(path => {
    assert.match(path, /^assets\/images\/trainers\/[a-z-]+\.png$/);
    assert.equal(fs.existsSync(path), true);
    assert.doesNotMatch(path, /^(https?:|data:)/);
  });
});

test('trainer avatar renderer uses image mode for all final art and retains error fallback', () => {
  const all = Visuals.MASTER_TRAINER_VISUALS.concat(Object.values(Visuals.SPECIAL_TRAINER_VISUALS));
  all.forEach(visual => {
    const image = Avatar.renderTrainerAvatar(visual, { size: 'medium', shape: 'circle', loading: 'eager' });
    assert.match(image, /<img class="trainer-avatar__image"/);
    assert.ok(image.includes('src="' + visual.avatarSrc + '"'));
    assert.match(image, /trainer-avatar__fallback" hidden/);
    assert.match(image, /onerror=/);
  });
  const fallback = Avatar.renderTrainerAvatar({ ...Visuals.getMasterVisual('master-fighting'), avatarSrc:null }, { size:'medium', shape:'circle' });
  assert.match(fallback, /trainer-avatar__fallback/);
  assert.doesNotMatch(fallback, /<img/);
});

test('campaign battle metadata maps all Masters, Super, and Shadow to their correct final visual', () => {
  const manager = new CampaignManager();
  manager.getRosterIds = () => [3, 6, 9];
  manager.canChallenge = () => true;
  Object.keys(MASTER_ART).forEach(id => {
    const config = manager.getBattleConfig('MASTER', id, [3, 6, 9]);
    assert.equal(config.metadata.opponentTrainer.avatarSrc, MASTER_ART[id]);
  });
  const superBattle = manager.getBattleConfig('SUPER', null, [3, 6, 9]);
  const shadow = manager.getBattleConfig('SHADOW', null, [3, 6, 9]);
  assert.equal(superBattle.metadata.opponentTrainer.avatarSrc, SPECIAL_ART.SUPER);
  assert.equal(shadow.metadata.opponentTrainer.avatarSrc, SPECIAL_ART.SHADOW);
  assert.notEqual(superBattle.metadata.opponentTrainer.avatarSrc, shadow.metadata.opponentTrainer.avatarSrc);
  assert.deepEqual(shadow.modifiers, { SHADOW_AURA: true });
});

test('campaign and battle integrations remain presentation-only and Quick Battle has no trainer metadata source', () => {
  const campaignView = fs.readFileSync('assets/js/campaign/campaign-view.js', 'utf8');
  const battleView = fs.readFileSync('assets/js/ui/battle-view.js', 'utf8');
  const sessionController = fs.readFileSync('assets/js/battle-session/battle-session-controller.js', 'utf8');
  assert.match(campaignView, /getMasterVisual/);
  assert.match(campaignView, /getSpecialTrainerVisual/);
  assert.match(battleView, /metadata\?\.opponentTrainer/);
  assert.doesNotMatch(battleView, /campaign-manager\.js|campaign-catalog\.js/);
  assert.doesNotMatch(sessionController, /opponentTrainer/);
});
