# Circuito dos Mestres

The campaign is independent from `team.current`: choose six of the 36 starters, earn one chosen recruit from each Master, then one Super recruit for a maximum roster of 25. `campaign.progress` is versioned, sanitizes invalid data, bounds idempotent battle IDs, and reset removes only campaign progress.

CampaignBattleCoordinator supplies the existing BattleSessionController with IDs, metadata and optional modifiers. Campaign results return to Campaign and pending rewards survive reload. Super victory uses champion context before recruit choice. Claiming it reveals the final Shadow challenge once. Shadow reuses the Super team and applies only `max(2, base multiplier)` to enemy attacks; player effectiveness remains canonical.

Trainer history supports optional campaign mode/kind/challenge fields without breaking old Quick records.

## Draft expansion
The draft now has 144 static options (16 per generation). The original 36 IDs remain valid. Master overlap is allowed, but CampaignManager rejects three members of the same Master team at start; rewards reject already-owned IDs and roster IDs are unique.

## Final progression
After the elite reward, Shadow is logically unlocked with revealSeen=false. CampaignView replays the reveal after reload until acknowledged; then the final challenge is available. Completed campaigns render the real badge, roster, boss and attempt summary.
