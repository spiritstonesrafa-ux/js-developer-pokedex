# Circuito dos Mestres

The campaign is independent from `team.current`: choose six campaign starters, earn one chosen recruit from each Master, then one Super recruit for a maximum roster of 25. `campaign.progress` is versioned, sanitizes invalid data, bounds idempotent battle IDs, and reset removes only campaign progress.

CampaignBattleCoordinator supplies the existing BattleSessionController with IDs, metadata and optional modifiers. Campaign results return to Campaign and pending rewards survive reload. Super victory uses champion context before recruit choice. Claiming it reveals the final Shadow challenge once. Shadow reuses the Super team and applies only `max(2, base multiplier)` to enemy attacks; player effectiveness remains canonical.

Trainer history supports optional campaign mode/kind/challenge fields without breaking old Quick records.

## Draft expansion
The draft now has 144 static options (16 per generation). The original 36 IDs remain valid. Master overlap is allowed, but CampaignManager rejects three members of the same Master team at start; rewards reject already-owned IDs and roster IDs are unique.

## Final progression
After the elite reward, Shadow is logically unlocked with revealSeen=false. CampaignView replays the reveal after reload until acknowledged; then the final challenge is available. Completed campaigns render the real badge, roster, boss and attempt summary.
## Canonical draft and Master preparation

New campaigns select six from the static 144-species canonical draft (16 actual species per official generation). Metadata is generated during development from PokéAPI and committed for runtime: no campaign-opening bulk fetch occurs. Legendary/Mythical species and SUPER_TEAM are excluded from new starts; historical valid campaign IDs remain readable so an existing save is never reset silently.

When a Type Master is selected, CampaignView renders the trainer context, badge and a Portuguese Gym Type Guide calculated from battle/type-chart.js. It lists the Master type’s offensive 2× targets and defensive 2× weaknesses, including the dual-type disclaimer.
