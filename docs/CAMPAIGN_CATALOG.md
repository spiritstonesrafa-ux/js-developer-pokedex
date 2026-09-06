# Campaign Catalog

## Global Super Trainer audit

Global default-species ranking (IDs 1–1025): BST descending, then max(Attack, Sp. Attack), Speed and lower ID. The static eligible selections are Arceus #493 (BST 720, Atk 120, SpA 120, Spe 120), Eternatus #890 (690, 85, 145, 130), and Mewtwo #150 (680, 110, 154, 130). Next audited candidates: Lugia #249, Ho-Oh #250, Kyogre #382, Groudon #383, Slaking #289, Hydreigon #635 and Salamence #373. The Super trio is disjoint from draft and all 54 Master species.

## Campaign catalog

The 18 Type Masters have a unique three-species team and badge. The 54 Master species exclude Ditto, Unown, Wobbuffet and Smeargle. Super and Shadow use Arceus, Eternatus and Mewtwo.


## Draft expansion
Starting pool: 144 unique options, 16 per generation. The original 36 are retained. Master overlap is allowed; Super IDs are excluded. Campaign start forbids all three members of a Master team.

## Development audit
Run 
ode scripts/audit-campaign-draft.js to hydrate every draft ID through the production BattleTeamHydrator and validate four supported moves without runtime campaign hydration.
## Canonical metadata and eligibility

The starting draft is a static, generated canonical dataset with 144 real species: exactly 16 official species in each Generation 1–9. Every runtime record provides ID, canonical name, types, BST, official generation and sprite. The browser never performs 144 opening requests.

The original 36 draft choices remain included. Legendary and Mythical species are excluded from new starts using generated Pokémon-species metadata; SUPER_TEAM IDs are excluded dynamically. Master overlap remains allowed, subject to the two-members-per-Master start rule.

CampaignCatalog.byId(id) uses one canonical record for Draft, Master rewards, Super team and historical campaign IDs. Existing campaigns keep canonical historical roster IDs after this correction; resetting a campaign applies only the corrected new-draft eligibility.

## Gym Type Guide

campaign-type-guide.js derives each Master guide from TYPE_CHART, not a duplicate table. Before a Master battle, the picker identifies the trainer, title, type and badge, then shows offensive 2× targets and defensive 2× weaknesses with Portuguese labels. It also states: “Tipos secundários podem alterar essas relações.”
