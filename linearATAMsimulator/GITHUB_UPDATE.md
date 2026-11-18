# Updating the existing GitHub Pages simulator

Unzip `linear-assembly-lab-github-update.zip`. Copy the eight website files into the **same folder as your current simulator's index.html**, preserving the filenames. For example, if the simulator currently lives in a `simulator/` subfolder, update that subfolder rather than your site's unrelated home page.

| Action | Files |
| --- | --- |
| Replace existing files | `index.html`, `styles.css`, `app.js`, `engine.js`, `worker.js` |
| Add new files | `constructions.js`, `assembly-crest.png`, `CONSTRUCTIONS.md` |

`GITHUB_UPDATE.md` is this instruction sheet and is optional on the website. Keep all eight website files together: the page and module workers load them using relative paths. No npm install or build is required.

Use your existing repository's upload/edit workflow to commit all eight website files together. Keep your current GitHub Pages publication branch and folder. Once its deployment completes, refresh the simulator; use a hard refresh if the old page remains cached.

Check the update:

1. The page heading shows the crest; clicking it enlarges the image.
2. Construction has four choices.
3. Expected length · two-pad, N=100, base auto gives 12 charged entries and exact variance 9404 in Analysis.
4. High probability · one-pad, “Try N = 257 with 32 blocks” gives 193 entries, exact variance 1152 and a Markov failure prediction near 5.501%. Its conservative bound exceeds δ=5%; this manual example is labelled an experiment.
5. In either high-probability mode, N=10000 with automatic blocks, ε=0.25 and δ=0.05 produces a certified system.
6. High-probability N=10^30 with automatic blocks uses a compact recipe and exact numerical analysis. No impractically long tile list or assembly is expanded.

Automatic concentration is conservative and may choose a deterministic line for small N. A manual block count lets you reproduce and explore the manuscript's examples without implying an unproved guarantee. The Analysis panel and CONSTRUCTIONS.md explain the certificate.

Previously exported literal system JSON files remain supported. Version 2 compact recipes require this updated simulator. Your latest system remains saved in the browser; choose a new construction and click Generate tile set to see the new modes.
