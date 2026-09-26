(function () {
  'use strict';

  const STORAGE_KEY = 'campaign_wild_audio_enabled_v1';
  const CUES = Object.freeze({
    ENCOUNTER: [
      { at: 0, duration: .11, from: 440, to: 660, volume: .055, wave: 'triangle' },
      { at: .1, duration: .16, from: 660, to: 880, volume: .04, wave: 'sine' }
    ],
    CAPTURE: [
      { at: 0, duration: .26, from: 720, to: 280, volume: .065, wave: 'triangle' },
      { at: .78, duration: .32, from: 560, to: 1080, volume: .055, wave: 'sine' },
      { at: 1.76, duration: .08, from: 360, to: 240, volume: .08, wave: 'square' },
      { at: 2.05, duration: .08, from: 200, to: 120, volume: .075, wave: 'triangle' },
      { at: 2.46, duration: .07, from: 460, to: 350, volume: .052, wave: 'sine' },
      { at: 3.07, duration: .07, from: 460, to: 350, volume: .052, wave: 'sine' },
      { at: 3.48, duration: .07, from: 460, to: 350, volume: .052, wave: 'sine' }
    ],
    QUICK_THROW: [
      { at: 0, duration: .1, from: 720, to: 340, volume: .055, wave: 'triangle' }
    ],
    CAUGHT: [
      { at: 0, duration: .18, from: 523, to: 523, volume: .075, wave: 'sine' },
      { at: .17, duration: .18, from: 659, to: 659, volume: .075, wave: 'sine' },
      { at: .34, duration: .3, from: 784, to: 784, volume: .075, wave: 'sine' }
    ],
    ESCAPED: [
      { at: 0, duration: .16, from: 580, to: 310, volume: .07, wave: 'triangle' },
      { at: .14, duration: .22, from: 380, to: 170, volume: .055, wave: 'sine' }
    ]
  });

  function isEnabled() {
    try {
      return typeof localStorage === 'undefined' || localStorage.getItem(STORAGE_KEY) !== 'false';
    } catch {
      return true;
    }
  }

  function setEnabled(enabled) {
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
    } catch {}
    return Boolean(enabled);
  }

  function playCue(controller, cue) {
    const notes = CUES[cue];
    if (!notes || !isEnabled() || !controller?.isUnlocked?.()
      || controller.mixer?.isMuted?.()
      || (typeof document !== 'undefined' && document.hidden)) return false;
    try {
      const context = controller.contextManager?.getContext?.();
      const bus = controller.mixer?.getChannelNode?.('UI');
      if (!context || !bus || context.state !== 'running') return false;
      for (const note of notes) {
        const oscillator = context.createOscillator();
        const envelope = context.createGain();
        const start = context.currentTime + note.at;
        oscillator.type = note.wave;
        oscillator.frequency.setValueAtTime(note.from, start);
        oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, note.to), start + note.duration);
        envelope.gain.setValueAtTime(.0001, start);
        envelope.gain.exponentialRampToValueAtTime(note.volume, start + .015);
        envelope.gain.exponentialRampToValueAtTime(.0001, start + note.duration);
        oscillator.connect(envelope);
        envelope.connect(bus);
        oscillator.onended = () => {
          oscillator.disconnect();
          envelope.disconnect();
        };
        oscillator.start(start);
        oscillator.stop(start + note.duration + .02);
      }
      return true;
    } catch {
      // Audio is decorative; a blocked or unsupported context must never block capture.
      return false;
    }
  }

  const api = Object.freeze({ STORAGE_KEY, isEnabled, setEnabled, playCue });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else {
    window.PBACampaign = window.PBACampaign || {};
    window.PBACampaign.CampaignWildAudio = api;
  }
})();
