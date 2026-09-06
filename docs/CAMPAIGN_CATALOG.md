# Campaign Catalog

## Global Super Trainer audit

Global default-species ranking (IDs 1–1025): BST descending, then max(Attack, Sp. Attack), Speed and lower ID. The static eligible selections are Arceus #493 (BST 720, Atk 120, SpA 120, Spe 120), Eternatus #890 (690, 85, 145, 130), and Mewtwo #150 (680, 110, 154, 130). Next audited candidates: Lugia #249, Ho-Oh #250, Kyogre #382, Groudon #383, Slaking #289, Hydreigon #635 and Salamence #373. The Super trio is disjoint from draft and all 54 Master species.

## Campaign catalog

The starting draft contains 36 regular species, four from each of nine generations and all 18 types. The 18 original Type Masters have a unique three-species team and badge. The 54 Master species exclude Ditto, Unown, Wobbuffet and Smeargle. Super and Shadow use Arceus, Eternatus and Mewtwo.


## Draft expansion
Starting pool: 144 unique options, 16 per generation. The original 36 are retained. Master overlap is allowed; Super IDs are excluded. Campaign start forbids all three members of a Master team.

## Development audit
Run 
ode scripts/audit-campaign-draft.js to hydrate every draft ID through the production BattleTeamHydrator and validate four supported moves without runtime campaign hydration.
