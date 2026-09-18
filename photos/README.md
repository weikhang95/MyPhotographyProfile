# Photos

## How to add photos

1. Export from Lightroom (or wherever) as **JPEG, quality 90–100, full resolution, sRGB or Adobe RGB — either is fine.** Do not resize; the script does that.
2. Drop them into `photos/originals/`, one folder per series:

   ```
   photos/originals/
     japan-25/         -> series "japan-25"
       DSC_1234.jpg
       DSC_1290.jpg
     penang-2026/
       ...
     portrait.jpg      -> loose files have no series
   ```

   The folder name becomes the series slug, so name it `place-year` (`japan-25`, `slovenia-24`).

3. Run:

   ```sh
   npm run photos:build
   ```

4. Open `photos/manifest.json` and fill in `alt`, `caption` and `location` for each new photo. The script prints how many are still missing alt text.

Re-running is safe. Existing sizes are skipped, and anything you typed into the manifest is kept.

## What the script does

For each photo it writes AVIF and WebP at 480 / 960 / 1600 / 2400px into `src/assets/gallery/`, never upscaling past the original. It also:

- strips **all** original metadata, so GPS coordinates never reach the web;
- converts to sRGB so colours match your edit in every browser;
- writes back a copyright notice and the IPTC/PLUS `DMI-PROHIBITED-AIMLTRAINING` flag, which machine-readably forbids AI training on the image;
- records width, height, aspect ratio and a tiny inline blur placeholder in the manifest, which the justified-row grid needs to lay out photos before they load.

Typical result: a 13 MB camera JPEG becomes 45 kB at the size a browser actually shows.

## What is and is not committed

| Path | In git? | Why |
|---|---|---|
| `photos/originals/` | no | camera exports, tens of MB each |
| `src/assets/gallery/` | no | generated; ~2 MB per photo across all sizes |
| `photos/manifest.json` | **yes** | the alt text and captions you write by hand |
| `scripts/photos/process.mjs` | **yes** | the pipeline |

Because the generated files are not in git, **photos will not appear on a deployed build or on a second machine until they live in R2.** That is the next step: once R2 is enabled on the Cloudflare account, the script gains an upload stage and the site reads photos from `/img/<slug>-<width>.avif` instead of the bundle. Until then this is a local workflow for designing the grid.

## Alt text vs caption

- **`alt`** describes the photo for someone who cannot see it, and for search engines. Be concrete: "Fishermen's jetty at dusk, wooden stilts in still water". Not "photo" or "Penang".
- **`caption`** is what a visitor reads on hover or in the lightbox. Short: `Chew Jetty, Penang · 2026`.
- **`location`** is just the place, used for grouping later.
