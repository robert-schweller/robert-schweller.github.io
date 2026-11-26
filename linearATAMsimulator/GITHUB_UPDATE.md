# GitHub Pages update — revised concentrated constructions

Unzip `linear-assembly-lab-efficient-constructions-update.zip` into the folder containing your existing simulator's `index.html`.

| Action | Files |
| --- | --- |
| Replace | `index.html`, `app.js`, `engine.js`, `worker.js`, `constructions.js`, `CONSTRUCTIONS.md` |
| Add | `legacy-constructions.js` |
| Keep existing | `styles.css`, `assembly-crest.png` |

Commit all seven website files together. `GITHUB_UPDATE.md` is this optional instruction sheet. No build step, dependency installation or GitHub Pages settings change is needed. Refresh the page after your existing deployment completes; use a hard refresh if cached content remains.

## Changes

- Concentrated one-pad mode now uses positive-ternary blocks (revised paper, Lemma 5).
- Concentrated two-pad mode uses positive-base-b blocks with the shared reset and delay paths (Lemma 6 / Section 4.2). Expected-length two-pad mode uses the same updated block implementation.
- One-pad multiplicities, charged counts, distinct counts, exact variance and probability certificates are updated. The one-pad certificate uses the sharper maximum residual mean M.
- Legacy imports, including huge compact recipes, retain their original behavior. Saved generated systems upgrade on reload. Importing an old experiment preserves it; click Generate with the same settings to create the revised version.
- Your crest, graphics, custom models, exports and numerical output for very large N remain available.

## Quick checks

1. Select High probability · one-pad, N=100, blocks=1. Analysis gives mean 100, variance 9006, 13 charged entries and 11 distinct types; the tile library contains multiplicity-two rules.
2. Try N=257 with 32 blocks. Both revised modes use 161 charged entries instead of 193. The one-pad variance is 1216; two-pad variance is 1152. These manual examples are not certified for δ=0.05 at ε=0.25 by the conservative bound.
3. With N=10000, blocks=auto, ε=0.25, δ=0.05, one-pad uses 2431 charged entries / 1900 types; two-pad uses 2377 entries / types. Both certify the requested guarantee.
4. N=10^30 with automatic blocks still gives exact numerical output and a compact JSON recipe. One-pad charged and distinct counts remain separate.

`CONSTRUCTIONS.md` contains the rules, recurrence derivations, conservative certificate and compatibility details.
