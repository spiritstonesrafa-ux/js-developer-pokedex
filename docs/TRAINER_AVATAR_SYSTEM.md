
# Trainer Avatar System

PBA-015 adds a presentation-only infrastructure for the eighteen Circuit Masters, Super Trainer, and Shadow Super Trainer.

## Catalog and renderer

- \`assets/js/campaign/campaign-trainer-visuals.js\` owns the canonical descriptor catalog.
- Every descriptor contains \`id\`, \`avatarKey\`, \`displayName\`, \`type\`, \`avatarSrc\`, \`alt\`, \`initials\`, and \`variant\`.
- \`assets/js/campaign/trainer-avatar-view.js\` renders the descriptor for Master cards, preparation, rewards, special reveals, and campaign battle metadata.
- Final art currently covers **6 / 20** identities: Aster, Kael, Marina, Volt, Flora, and Yara. Their descriptors use local PNG paths; the other 12 Masters and both special trainers remain fallback-first with \`avatarSrc: null\`.
- The renderer makes no remote portrait request; final art remains local under \`assets/images/trainers/\`.
- When final local art is later assigned, a controlled image error hides the image and restores the same fallback.

## Visual behavior

Master fallbacks use a type accent, icon, initials, gradient, and frame. Super Trainer and Shadow Super Trainer use distinct visual variants. The renderer supports small, medium, and large sizes plus circular and portrait frames.

The existing campaign storage schema, progression rules, reward selection, battle modifiers, and Quick Battle remain unchanged. \`CampaignManager.getBattleConfig\` attaches \`opponentTrainer\` only to campaign metadata; Battle View presents it only when that metadata exists.

## Future art handoff

See [trainer asset contract](../assets/images/trainers/README.md). Final art is intentionally pending asset generation.
