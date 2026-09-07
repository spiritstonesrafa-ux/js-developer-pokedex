
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Visuals = require('../../assets/js/campaign/campaign-trainer-visuals.js');
const Avatar = require('../../assets/js/campaign/trainer-avatar-view.js');
const Catalog = require('../../assets/js/campaign/campaign-catalog.js');
const { CampaignManager } = require('../../assets/js/campaign/campaign-manager.js');

const FINAL_ART = Object.freeze({
  'master-normal':'assets/images/trainers/aster.png',
  'master-fire':'assets/images/trainers/kael.png',
  'master-water':'assets/images/trainers/marina.png',
  'master-electric':'assets/images/trainers/volt.png',
  'master-grass':'assets/images/trainers/flora.png',
  'master-ice':'assets/images/trainers/yara.png'
});

test('trainer avatar catalog maps the six approved Masters and preserves canonical identities', () => {
  assert.equal(Visuals.MASTER_TRAINER_VISUALS.length, 18);
  assert.equal(new Set(Visuals.MASTER_TRAINER_VISUALS.map(x => x.avatarKey)).size, 18);
  Catalog.MASTERS.forEach(master => {
    const visual = Visuals.getMasterVisual(master.challengeId);
    assert.deepEqual(Object.keys(visual).sort(), ['alt', 'avatarKey', 'avatarSrc', 'displayName', 'id', 'initials', 'type', 'variant'].sort());
    assert.equal(visual.displayName, master.trainerName);
    assert.equal(visual.type, master.type);
    assert.equal(visual.avatarSrc, FINAL_ART[master.challengeId] || null);
  });
  assert.equal(Visuals.getSpecialTrainerVisual('SUPER').avatarSrc, null);
  assert.equal(Visuals.getSpecialTrainerVisual('SHADOW').avatarSrc, null);
});

test('trainer avatar final-art counts and local asset contract are exact', () => {
  const mastersWithArt = Visuals.MASTER_TRAINER_VISUALS.filter(x => x.avatarSrc);
  const mastersWithFallback = Visuals.MASTER_TRAINER_VISUALS.filter(x => !x.avatarSrc);
  const special = Object.values(Visuals.SPECIAL_TRAINER_VISUALS);
  assert.equal(mastersWithArt.length, 6);
  assert.equal(mastersWithFallback.length, 12);
  assert.equal(special.filter(x => x.avatarSrc).length, 0);
  assert.equal(special.filter(x => !x.avatarSrc).length, 2);
  assert.deepEqual(mastersWithArt.map(x => x.avatarKey).sort(), ['aster','flora','kael','marina','volt','yara']);
  mastersWithArt.forEach(visual => {
    assert.match(visual.avatarSrc, /^assets\/images\/trainers\/[a-z-]+\.png$/);
    assert.equal(fs.existsSync(visual.avatarSrc), true);
    assert.doesNotMatch(visual.avatarSrc, /^(https?:|data:)/);
  });
});

test('trainer avatar renderer uses image mode for approved art and fallback for remaining Masters', () => {
  Visuals.MASTER_TRAINER_VISUALS.filter(x => x.avatarSrc).forEach(visual => {
    const image = Avatar.renderTrainerAvatar(visual, { size: 'medium', shape: 'circle', loading: 'eager' });
    assert.match(image, /<img class="trainer-avatar__image"/);
    assert.ok(image.includes('src="' + visual.avatarSrc + '"'));
    assert.match(image, /trainer-avatar__fallback" hidden/);
    assert.match(image, /onerror=/);
  });
  Visuals.MASTER_TRAINER_VISUALS.filter(x => !x.avatarSrc).forEach(visual => {
    const fallback = Avatar.renderTrainerAvatar(visual, { size: 'medium', shape: 'circle' });
    assert.match(fallback, /trainer-avatar__fallback/);
    assert.doesNotMatch(fallback, /<img/);
  });
});

test('campaign battle metadata carries only the matching trainer visual descriptor', () => {
  const manager = new CampaignManager();
  manager.getRosterIds = () => [1, 2, 3];
  manager.canChallenge = () => true;
  ['master-normal','master-fire','master-water','master-electric','master-grass','master-ice'].forEach(id => {
    const config = manager.getBattleConfig('MASTER', id, [1, 2, 3]);
    assert.equal(config.metadata.opponentTrainer.avatarSrc, FINAL_ART[id]);
  });
  const superBattle = manager.getBattleConfig('SUPER', null, [1, 2, 3]);
  const shadow = manager.getBattleConfig('SHADOW', null, [1, 2, 3]);
  assert.equal(superBattle.metadata.opponentTrainer.avatarSrc, null);
  assert.equal(shadow.metadata.opponentTrainer.avatarSrc, null);
  assert.deepEqual(shadow.modifiers, { SHADOW_AURA: true });
});

test('campaign and battle integrations remain presentation-only', () => {
  const campaignView = fs.readFileSync('assets/js/campaign/campaign-view.js', 'utf8');
  const battleView = fs.readFileSync('assets/js/ui/battle-view.js', 'utf8');
  assert.match(campaignView, /getMasterVisual/);
  assert.match(campaignView, /getSpecialTrainerVisual/);
  assert.match(battleView, /metadata\?\.opponentTrainer/);
  assert.doesNotMatch(battleView, /campaign-manager\.js|campaign-catalog\.js/);
});
