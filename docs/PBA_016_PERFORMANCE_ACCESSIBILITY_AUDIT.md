# PBA-016A — Performance & Accessibility Baseline

## Baseline

- PBA-015 closure commit: `8e883548b611b8dbd22672662d633ba1f8282ea3`
- Functional regression: 574 pass, 0 fail, 0 cancelled, 21 suites.
- Method: static inventory, code-path review, existing automated coverage, and controlled responsive checks from PBA-015. Lighthouse CLI is not installed, so score-based metrics are intentionally unavailable.

## Static inventory

| Metric | Result |
| --- | ---: |
| JavaScript | 755,837 bytes |
| CSS | 123,968 bytes |
| Trainer images | 49,036,150 bytes |
| Largest asset | `assets/images/trainers/riven.png` (2,836,560 bytes) |
| Largest JS | `assets/js/campaign/campaign-pokemon-catalog.js` (54,993 bytes) |
| Largest CSS | `assets/css/global.css` (27,302 bytes) |

## Performance findings

- **P1 — trainer art payload:** 49 MB of trainer PNGs is the dominant static payload. Candidate for an asset/loading phase; no recompression or loading change was made in this baseline.
- **P2 — Shadow preparation:** the 37-card army is rendered as one grid. It is usable in existing responsive checks, but should be profiled for long-list paint/input cost before considering virtualization.
- **P2 — audio lifecycle:** the Shadow theme has one tracked interval and node list; lifecycle tests cover duplicate prevention and cleanup. Browser-level AudioNode counts are not reliably exposed, so they are `NOT_MEASURABLE` here.
- **P3 — catalog payload:** the canonical campaign catalog is the largest JS file. Defer loading analysis to a dedicated evidence-backed phase.

Network errors and duplicate-fetch candidates: `NOT_MEASURABLE` without a browser network trace. No new external audio asset or request was added.

## Accessibility findings

- Keyboard and focus: battle actions are semantic buttons; the switch/replacement dialog uses `role=dialog`, focus is sent to the first usable action, and Escape is supported when dismissal is allowed. No blocker found in existing covered paths.
- Semantics: campaign, battle, reward, and roster cards are button-based in their interactive flows. No P0 semantic blocker found in static review.
- ARIA: battle narrative uses live status and HP uses progressbars. A future audit should test spoken updates across a real screen reader.
- Reduced motion: battle animations, VFX, camera, trainer effects, and Shadow aura include `prefers-reduced-motion` coverage. No confirmed blocker; interaction-level verification remains a P2 follow-up.
- Images: Pokémon and trainer images have alt/fallback conventions; decorative trainer avatars are explicitly rendered decorative. No confirmed blocker.
- Audio: mute and mixer volume apply to procedural music; gameplay has visual state equivalents and does not require audio.
- Contrast/touch targets: no automated contrast engine is installed. Manual mobile checks found no blocker, but formal contrast and touch-target sampling belong in the next accessibility phase.

## Mobile and Final Stand

The prior controlled checks covered 390×844, 360×700, and 412×915 with no horizontal overflow in Shadow reinforcement and 37-card preparation states. Scroll jank, input delay, layout-shift and runtime DOM counts are `NOT_MEASURABLE` without a profiler trace.

## Prioritized next phase

**PBA-016B — Asset & loading evidence.** Capture an actual browser network/performance trace and prioritize trainer-art delivery only if measured impact warrants it. Follow with an accessibility verification phase for contrast, screen-reader announcements, and modal focus return.
## PBA-016B — Asset & Loading Evidence

### Methodology

- Browser: isolated Chrome 152, DevTools Protocol and `PerformanceResourceTiming`.
- Cache: `Network.clearBrowserCache` before cold captures; warm capture was an equivalent reload in the same browser profile.
- Scenarios measured: initial application load; Campaign Home in an active 18-badge state; Final Stand preparation with 29 permanent Pokémon and 8 temporary guests; responsive DOM checks.
- Limitation: cross-origin PokéAPI and GitHub sprite resources do not expose all transfer sizes through Resource Timing in this context. Values below use browser-reported `transferSize` where available; unavailable external transfer is not estimated.

### BEFORE

| Scenario | Requests | Transfer bytes | Resource bytes | Trainer requests | Trainer transfer |
| --- | ---: | ---: | ---: | ---: | ---: |
| Initial cold load | 110 | 440,890 | 989,188 | 0 | 0 |
| Initial warm reload | 114 | 0 | 1,251,684 | 0 | 0 |
| Campaign Home navigation | 65 | 7,558,275 | 7,557,375 | 3 | 7,558,275 |

The initial app requested 67 JavaScript files (210,141 transfer bytes) and 11 CSS files (218,072 transfer bytes). `campaign-pokemon-catalog.js` is requested during initial load: 5,292 transfer bytes / 54,993 decoded bytes. Trainer art is not requested on initial load.

Campaign Home contained 19 avatar image elements (18 Masters plus Super Trainer). Three were loaded in the initial viewport: `super-trainer.png`, `aster.png`, and `kael.png`; 16 Master images below the fold remained deferred by native lazy loading. The loaded Master card images were 2,459,799 and 2,535,106 bytes for displayed 84 px-wide cards, confirming overserving.

### Decision and implementation

`OPTIMIZATION_REQUIRED = YES`. The measured condition was large PNGs delivered to 84 px Master cards. The smallest safe change was selected:

- preserved all 20 source PNG portraits unchanged;
- generated 18 derived 168×224 WebP thumbnails for Master cards only (210,914 bytes total);
- added `thumbnailSrc` to Master visual descriptors;
- selected the thumbnail only for the `CARD` surface; preparation, reward, Super/Shadow spotlight, and battle presentation keep `avatarSrc` PNGs;
- retained native lazy loading, the existing image-error fallback, explicit dimensions, and added `decoding="async"`.

### AFTER (local equivalent server)

| Campaign Home trainer asset | Transfer bytes | Decoded bytes |
| --- | ---: | ---: |
| `super-trainer.png` (large endgame portrait, unchanged) | 2,563,370 | 2,563,070 |
| `aster.webp` (card) | 12,180 | 11,880 |
| `kael.webp` (card) | 14,372 | 14,072 |
| Total | 2,589,922 | 2,589,022 |

Campaign Home visible trainer-art transfer fell from 7,558,275 to 2,589,922 bytes: **65.7% lower**. The two visible Master cards fell from 4,994,905 to 26,552 bytes: **99.5% lower**. This comparison uses the same Chrome instance, viewport, campaign state, and Resource Timing API; the local static server was used only for the uncommitted AFTER source. Public AFTER verification is still required after publication.

### Trainer-art delivery table

| Trainer | Source file | Card derivative | Delivery decision |
| --- | --- | --- | --- |
| aero | assets/images/trainers/aero.png (2058096 bytes) | assets/images/trainers/thumbs/aero.webp | card thumbnail; original elsewhere |
| aster | assets/images/trainers/aster.png (2459499 bytes) | assets/images/trainers/thumbs/aster.webp | card thumbnail; original elsewhere |
| dante | assets/images/trainers/dante.png (2362285 bytes) | assets/images/trainers/thumbs/dante.webp | card thumbnail; original elsewhere |
| ferrum | assets/images/trainers/ferrum.png (2254443 bytes) | assets/images/trainers/thumbs/ferrum.webp | card thumbnail; original elsewhere |
| flora | assets/images/trainers/flora.png (2685596 bytes) | assets/images/trainers/thumbs/flora.webp | card thumbnail; original elsewhere |
| kael | assets/images/trainers/kael.png (2534806 bytes) | assets/images/trainers/thumbs/kael.webp | card thumbnail; original elsewhere |
| lumi | assets/images/trainers/lumi.png (2483857 bytes) | assets/images/trainers/thumbs/lumi.webp | card thumbnail; original elsewhere |
| marina | assets/images/trainers/marina.png (2133945 bytes) | assets/images/trainers/thumbs/marina.webp | card thumbnail; original elsewhere |
| nilo | assets/images/trainers/nilo.png (2150977 bytes) | assets/images/trainers/thumbs/nilo.webp | card thumbnail; original elsewhere |
| noctis | assets/images/trainers/noctis.png (2071938 bytes) | assets/images/trainers/thumbs/noctis.webp | card thumbnail; original elsewhere |
| nyra | assets/images/trainers/nyra.png (2464649 bytes) | assets/images/trainers/thumbs/nyra.webp | card thumbnail; original elsewhere |
| orion | assets/images/trainers/orion.png (2240751 bytes) | assets/images/trainers/thumbs/orion.webp | card thumbnail; original elsewhere |
| petra | assets/images/trainers/petra.png (2690964 bytes) | assets/images/trainers/thumbs/petra.webp | card thumbnail; original elsewhere |
| riven | assets/images/trainers/riven.png (2836560 bytes) | assets/images/trainers/thumbs/riven.webp | card thumbnail; original elsewhere |
| super-trainer-shadow | assets/images/trainers/super-trainer-shadow.png (2831095 bytes) | — (large portrait only) | original portrait |
| super-trainer | assets/images/trainers/super-trainer.png (2563070 bytes) | — (large portrait only) | original portrait |
| terra | assets/images/trainers/terra.png (2556600 bytes) | assets/images/trainers/thumbs/terra.webp | card thumbnail; original elsewhere |
| vesper | assets/images/trainers/vesper.png (2362233 bytes) | assets/images/trainers/thumbs/vesper.webp | card thumbnail; original elsewhere |
| volt | assets/images/trainers/volt.png (2527199 bytes) | assets/images/trainers/thumbs/volt.webp | card thumbnail; original elsewhere |
| yara | assets/images/trainers/yara.png (2766572 bytes) | assets/images/trainers/thumbs/yara.webp | card thumbnail; original elsewhere |
### Final Stand and network observations

- Final Stand preparation reproduced the real state: 29 permanent Pokémon + 8 temporary guests = 37 cards, 37 card images, 288 campaign DOM nodes, and a 2.8 ms synchronous render sample. Scroll start/end and leader selection completed without observed jank, input delay, unresponsive interaction, or horizontal overflow.
- Large reserve-selector automated opening time and runtime AudioNode counts were not reliably captured in this CDP session: `NOT_MEASURABLE`. No virtualization is justified from the measured 37-card preparation grid.
- No trainer image request is duplicated in the measured Campaign Home sequence. `DUPLICATE_FETCHES_CONFIRMED = NO` (browser request names); cross-origin response-body accounting remains limited as stated above.
- Procedural Shadow audio adds no network asset request. Leak/active-instance verification remains covered by deterministic lifecycle tests; browser node counts are `NOT_MEASURABLE`.
- Font resource transfer and Web Vitals (LCP, CLS, long-task totals) are `NOT_MEASURABLE` in this controlled capture. Lighthouse remains `NOT_AVAILABLE`.

### PBA-016B result and next phase

The evidence supports the targeted card-thumbnail optimization and does not support virtualization. The next phase is **PBA-016C — Accessibility Verification**, focused on formal contrast, screen-reader announcements, modal focus return, and reduced-motion interaction verification. PBA-017 remains unstarted.
Responsive AFTER: Campaign Home was checked at 1366×768, 390×844, 360×700, and 412×915. The WebP cards loaded at 84 px desktop / 68 px mobile with 168 px intrinsic width, and horizontal overflow was false at every viewport.

### Public GitHub Pages validation

`PUBLIC_BUILD_CURRENT = YES`. GitHub Pages returned HTTP 200 and `Content-Type: image/webp` for `assets/images/trainers/thumbs/aster.webp` (11,880 bytes). A cold public-browser Campaign Home capture loaded `aster.webp` (12,180 transfer bytes), `kael.webp` (14,372), and the intentionally full-size `super-trainer.png` (2,563,370); 16 Master cards remained deferred. `NETWORK_HTTP_ERRORS = 0`, `NEW_CONSOLE_ERRORS = 0`, and `HORIZONTAL_OVERFLOW = 0`.