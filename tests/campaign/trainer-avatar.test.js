
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Visuals = require('../../assets/js/campaign/campaign-trainer-visuals.js');
const Avatar = require('../../assets/js/campaign/trainer-avatar-view.js');
const Catalog = require('../../assets/js/campaign/campaign-catalog.js');
const { CampaignManager } = require('../../assets/js/campaign/campaign-manager.js');

test('trainer avatar catalog covers the canonical eighteen Masters and two special variants', () => {
  assert.equal(Visuals.MASTER_TRAINER_VISUALS.length, 18);
  assert.equal(new Set(Visuals.MASTER_TRAINER_VISUALS.map(x => x.avatarKey)).size, 18);
  Catalog.MASTERS.forEach(master => {
    const visual = Visuals.getMasterVisual(master.challengeId);
    assert.deepEqual(
      Object.keys(visual).sort(),
      ['alt', 'avatarKey', 'avatarSrc', 'displayName', 'id', 'initials', 'type', 'variant'].sort()
    );
    assert.equal(visual.displayName, master.trainerName);
    assert.equal(visual.type, master.type);
    assert.equal(visual.avatarSrc, master.challengeId === 'master-water' ? 'assets/images/trainers/marina.png' : null);
  });
  assert.equal(Visuals.getSpecialTrainerVisual('SUPER').avatarKey, 'super-trainer');
  assert.equal(Visuals.getSpecialTrainerVisual('SHADOW').avatarKey, 'super-trainer-shadow');
});

test('trainer avatar renderer is fallback-first and recovers from a controlled local image', () => {
  const marina = Visuals.getMasterVisual('master-water');
  assert.equal(marina.avatarSrc, 'assets/images/trainers/marina.png');
  const imageFromCatalog = Avatar.renderTrainerAvatar(marina, { size: 'medium', shape: 'circle' });
  assert.match(imageFromCatalog, /src="assets\/images\/trainers\/marina.png"/);
  const fallback = Avatar.renderTrainerAvatar({ ...marina, avatarSrc: null }, { size: 'medium', shape: 'circle' });
  assert.match(fallback, /data-avatar-key="marina"/);
  assert.match(fallback, /trainer-avatar__fallback/);
  assert.doesNotMatch(fallback, /<img/);

  const image = Avatar.renderTrainerAvatar({ ...marina, avatarSrc: 'assets/images/trainers/marina.png' }, { loading: 'eager' });
  assert.match(image, /<img class="trainer-avatar__image"/);
  assert.match(image, /loading="eager"/);
  assert.match(image, /onerror=/);
  assert.match(image, /trainer-avatar__fallback" hidden/);
  assert.doesNotMatch(image, /https?:\/\//);
});

test('campaign battle metadata carries only the matching trainer visual descriptor', () => {
  const manager = new CampaignManager();
  manager.getRosterIds = () => [1, 2, 3];
  manager.canChallenge = () => true;
  const master = manager.getBattleConfig('MASTER', 'master-water', [1, 2, 3]);
  const superBattle = manager.getBattleConfig('SUPER', null, [1, 2, 3]);
  const shadow = manager.getBattleConfig('SHADOW', null, [1, 2, 3]);
  assert.equal(master.metadata.opponentTrainer.avatarKey, 'marina');
  assert.equal(superBattle.metadata.opponentTrainer.avatarKey, 'super-trainer');
  assert.equal(shadow.metadata.opponentTrainer.avatarKey, 'super-trainer-shadow');
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
