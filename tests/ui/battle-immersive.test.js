const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { BattleView } = require('../../assets/js/ui/battle-view.js');
const { BattleSessionController } = require('../../assets/js/battle-session/battle-session-controller.js');

const root = path.resolve(__dirname, '../..');
const css = fs.readFileSync(path.join(root, 'assets/css/battle-arena.css'), 'utf8');
const viewSource = fs.readFileSync(path.join(root, 'assets/js/ui/battle-view.js'), 'utf8');
const indexSource = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

describe('PBA-014D — IMMERSIVE BATTLE VIEW', () => {
  it('UX01–UX04 — immersive mode lives in the same SPA and UI layer', () => {
    assert.match(viewSource, /setImmersiveMode/);
    assert.match(indexSource, /id="futureModuleView"/);
    assert.doesNotMatch(indexSource, /battle\.html/);
    assert.match(viewSource, /AWAITING_PLAYER_ACTION.*RESOLVING.*VICTORY.*DEFEAT/s);
  });

  it('UX05–UX10 — header/footer hide and body scroll lock is reversible', () => {
    assert.match(css, /body\.battle-immersive-active \.header/);
    assert.match(css, /body\.battle-immersive-active \.footer/);
    assert.match(css, /overflow: hidden/);
    assert.match(viewSource, /classList\.remove\('battle-immersive-active'\)/);
  });

  it('UX11–UX12 — dynamic viewport and safe-area insets are supported', () => {
    assert.match(css, /100dvh/);
    assert.match(css, /env\(safe-area-inset-top\)/);
    assert.match(css, /env\(safe-area-inset-bottom\)/);
  });

  it('UX13–UX20 — desktop two-zone layout and mobile 2x2 moves are explicit', () => {
    assert.match(css, /grid-template-areas:[\s\S]*"stage enemy"/);
    assert.match(css, /@media \(max-width: 760px\)/);
    assert.match(css, /\.battle-immersive-shell \.moves-action-grid \{ grid-template-columns: repeat\(2/);
    assert.match(viewSource, /moves-action-grid/);
  });

  it('UX21–UX25 — switch, results and exit cleanup controls remain connected', () => {
    assert.match(viewSource, /id="btnOpenSwitch"/);
    assert.match(viewSource, /openReplacementModal/);
    assert.match(viewSource, /requestExitBattle/);
    assert.match(viewSource, /btnRematch/);
    assert.match(viewSource, /btnBackToBattle/);
  });

  it('exit confirmation rejects accidental abandonment without mutating the session', () => {
    const originalWindow = global.window;
    global.window = { confirm: () => false };
    let abandoned = 0;
    const view = new BattleView({ container: {}, sessionController: { uiState: 'AWAITING_PLAYER_ACTION', abandonBattle: () => abandoned++ } });
    assert.equal(view.requestExitBattle(), false);
    assert.equal(abandoned, 0);
    global.window = originalWindow;
  });

  it('leaveBattle cancels presentation and restores immersive UI state', () => {
    let cancelCount = 0;
    let resetCount = 0;
    let immersive = true;
    const controller = new BattleSessionController({
      teamStore: { load: () => [] },
      presentationEngine: { cancel: () => cancelCount++, reset: () => resetCount++ },
      compositeAdapter: { cancel: () => cancelCount++, reset: () => resetCount++ },
      view: { closeModal() {}, setImmersiveMode: active => { immersive = active; } },
      randomSource: {},
      hydrator: {},
      opponentFactory: {}
    });
    controller.battleState = { id: 'active' };
    controller.leaveBattle();
    assert.equal(cancelCount, 2);
    assert.equal(resetCount, 2);
    assert.equal(immersive, false);
    assert.equal(controller.battleState, null);
  });
});
