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