# Task: Fetch and save all design assets from Figma

You have the **Figma MCP** connected. Your only job: download every asset listed in
the spec's asset catalogue and save it to the assets directory. Do not edit any HTML or CSS.

## Critical prerequisite — load figma-use skill before any use_figma call

Before calling `use_figma`, you MUST invoke the `/figma-use` skill.
**Never call `use_figma` directly without loading this skill first** — it causes
hard-to-debug failures and is the primary reason assets get hand-drawn instead of fetched.

If the skill is available, invoke it now: `/figma-use`

The `use_figma` tool with `exportAsync` is the **most reliable** way to export any
Figma node as SVG — it works regardless of nesting depth (frames, groups, vectors):

```javascript
// Preferred SVG export via use_figma + figma-use skill:
const node = await figma.getNodeByIdAsync('NODE_ID');
if (!node) return { error: 'Node not found' };
const bytes = await node.exportAsync({ format: 'SVG' });
return { svg: String.fromCharCode(...new Uint8Array(bytes)) };
```

## Inputs

- Spec: `/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/figma/page/spec.md` — read the `## Assets catalogue` section
- Assets directory: `/Users/arturgrzeda/Documents/Devlooper/clippership/src/app/(home)/assets` — save everything here
- Figma file URL (for context): `https://www.figma.com/design/A9PHMFuLwB4yZHYR2W020Q/p_clippership--Copy-?node-id=181-498&t=0jpbKeeTIgsBOp2v-4`

## What to do

1. Read the spec and find the `## Assets catalogue` section (or any table listing
   assets with Figma node IDs).

2. For each asset that has a Figma node ID:
   a. Use Figma MCP (`get_design_context`, `use_figma`, or `get_screenshot`) with
      the node ID to retrieve the asset.
   b. The MCP will return either SVG markup or a URL
      (`https://www.figma.com/api/mcp/asset/…`).
   c. **If SVG markup** — write it to `/Users/arturgrzeda/Documents/Devlooper/clippership/src/app/(home)/assets/<suggested-filename>.svg`.
      **Keep or add** explicit `width` and `height` on the root `<svg>` matching its `viewBox`
      dimensions. Do NOT remove them — SVGs saved as files and used via `<img src="">` require
      explicit dimensions so browsers compute the correct intrinsic size. Without them, browsers
      fall back to 300×150, breaking all CSS auto-sizing and causing visible stretching.
   d. **If a URL** — write a tiny HTML stub `<img src="<url>">` to a temp file,
      OR just save the URL to a text file named `<filename>.url` in the assets
      directory. The loop's asset localizer will download it on the next screenshot.
      Alternatively, use `curl` or `fetch` via Bash to download the binary directly.

3. **Preferred method — Figma REST API (works for any layer structure):**

   Figma layers are often nested: a logo might be a FRAME containing a GROUP containing
   multiple VECTOR children. Figma MCP returns design metadata — not the actual SVG file.
   The **only reliable way** to export a vector group as a single SVG is the REST API:

   ```bash
   # Step 1: get the export URL
   curl -s -H "$FIGMA_AUTH_HEADER" \
     "https://api.figma.com/v1/images/A9PHMFuLwB4yZHYR2W020Q?ids=NODE_ID&format=svg&svg_include_id=false" \
     > /tmp/figma-export.json

   # Step 2: extract the URL from JSON and download the file
   # The response is: {"err": null, "images": {"NODE_ID": "https://..."}}
   node -e "
     const r = require('/tmp/figma-export.json');
     const url = Object.values(r.images)[0];
     require('https').get(url, res => {
       const chunks = [];
       res.on('data', d => chunks.push(d));
       res.on('end', () => require('fs').writeFileSync('/Users/arturgrzeda/Documents/Devlooper/clippership/src/app/(home)/assets/FILENAME.svg', Buffer.concat(chunks)));
     });
   "
   ```

   Use this method for: logos, icons, decorative SVGs, highlight shapes, any vector
   group — regardless of how many sub-layers it has.

   **Raster IMAGE fills (photos, avatars, product screenshots) — imageRef fallback.**
   These are fills of `type: IMAGE`, not exportable vectors. The render endpoint
   (`/v1/images?ids=`) rate-limits aggressively (HTTP 429) — but the **imageRef map
   endpoint has a separate, looser limit** and keeps working when render is blocked:
   ```bash
   # One call maps every imageRef -> signed URL for the whole file:
   curl -s -H "$FIGMA_AUTH_HEADER" \
     "https://api.figma.com/v1/files/A9PHMFuLwB4yZHYR2W020Q/images" > /tmp/figma-imagerefs.json
   # Find the node's fill imageRef in the node JSON, look it up in .meta.images[imageRef],
   # download that URL, detect ext by magic bytes (\xff\xd8\xff = jpg, otherwise png).
   ```
   Prefer this for any raster fill — it survives the render-endpoint rate-limit that
   otherwise blocks product screenshots and avatars.

   **Export rasters at 2x scale for retina.** A raster fetched at its 1x layout size looks soft on
   high-DPI (retina) screens. Export raster image fills at **2x** the displayed size: REST render
   `...&scale=2`, or the MCP export at 2x. The build then DISPLAYS them at their 1x logical
   dimensions (so a 600px-wide photo is a 1200px source shown at 600px) - crisp on retina, and the
   WebP pass keeps the file small. 2x is the sweet spot; only go 3x for a hero/full-bleed image
   that genuinely needs it. (SVG logos/icons are resolution-independent - no scaling needed.)

   **Retry the raster download, and WAIT on a rate-limit.** Figma's render/asset endpoints
   rate-limit (HTTP 429) and occasionally return an empty/truncated body; a single attempt is how a
   raster ends up a blank/1×1 file. Retry 2-3 times; on a **429 wait properly** - honour the
   `Retry-After` header if present, else back off ~10s+ (the limit clears in seconds, not
   milliseconds). `curl --retry 3 --retry-delay 5 --retry-all-errors` covers it in one shot. Only
   after genuine repeated failures fall back to the other path (imageRef map ↔ REST) or record it
   under `failed`.

   If `FIGMA_TOKEN` is not set in the environment, fall back to Figma MCP:
   - Try `use_figma` or `get_design_context` with the node ID.
   - If the MCP returns SVG markup, save it directly.
   - If it returns a URL (`https://www.figma.com/api/mcp/asset/…`), save that URL
     to a one-line text file named `/Users/arturgrzeda/Documents/Devlooper/clippership/src/app/(home)/assets/FILENAME.url` — the loop's
     asset localizer will download it on the next run.

4. Skip assets that have NO node ID in the spec — they must be built as HTML/CSS
   by the fixer. Do not invent node IDs.

5. Skip assets already present in `/Users/arturgrzeda/Documents/Devlooper/clippership/src/app/(home)/assets` (do not re-download).

6. **Skip HIDDEN assets.** If a catalogued asset's Figma node (or any ancestor) has
   `visible:false` (or `opacity:0`), do NOT fetch or save it — hidden icons/images must
   never reach the build. (The spec should already exclude them, but double-check here.)

## Asset types and how to handle them

| Type | How to fetch | Where to save |
|---|---|---|
| Logo (SVG wordmark) | Figma MCP node export or REST `format=svg` | `assets/<name>.svg` |
| Icon (SVG glyph) | Figma MCP node export or REST `format=svg` | `assets/<name>.svg` |
| Decorative SVG (highlight, blob, wave) | Figma MCP node export | `assets/<name>.svg` |
| Raster (photo, PNG illustration) | Figma MCP screenshot URL → download binary | `assets/<name>.png` |

## Rules

- **Do not modify any HTML, CSS, or JS files** — only write to `/Users/arturgrzeda/Documents/Devlooper/clippership/src/app/(home)/assets`.
- Do not fabricate SVG markup. If you cannot fetch a real asset, skip it and note it
  in the summary.
- **Sanity-check every fetched asset against the spec entry.** The spec gives each asset a
  type and dimensions (e.g. "32×32 shield icon"). If what you got back is clearly a different
  thing — wrong dimensions, a parent frame instead of the glyph, a different shape than
  described — you exported the wrong node. Re-fetch with the precise node ID (try
  `get_design_context` / `get_screenshot` for the exact node, or REST `format=svg`). Saving a
  wrong asset is worse than skipping: the fixer then hand-draws over it. Better to skip and
  note it than save the wrong thing.
- **SVG dimensions — critical**: always ensure the `<svg>` root has explicit `width` and `height`
  attributes matching its `viewBox`. If the fetched markup lacks them, add them before saving:
  `<svg width="W" height="H" viewBox="0 0 W H" ...>`. Browsers use 300×150 as fallback for
  dimensionless SVGs, corrupting every `width: auto` / `height: auto` CSS calculation.
- **Do NOT raster a content-bearing UI FRAME.** A photo, avatar, logo or texture is a legitimate
  raster. A Figma frame that contains UI - a diagram (labelled boxes + connectors, a "Seller ->
  Buyer" flow), a faux dashboard, a chart/graph, a card mock with text - is NOT: flattening it to a
  `.png`/`.jpg` ships soft, unselectable, non-responsive pixels that the build cannot refine. Do not
  export such frames as raster. The build rebuilds them as real HTML/CSS from the spec; your job is
  only the genuine photographic/texture background behind them, if any. "Product screenshot" above
  means a real screenshot photo, NOT a vector/text UI frame you could rebuild.
- **Verify every raster export is real, not a degenerate placeholder.** A successful-looking fetch
  can still write a 1×1 / empty / a-few-hundred-byte file when the node had no rasterable fill or
  the URL 404'd (this silently shipped blank company logos). After saving a raster, check its pixel
  dimensions (and that they roughly match the spec size); if it is 1×1, near-zero, or absurdly
  smaller than the spec, treat it as a FAILED fetch - delete it, retry via the other path (REST
  `format=svg` for a logo/icon, imageRef map for a photo), and if still degenerate, record it under
  `failed` rather than leaving a 1×1 file the build will render as an invisible gap.
- If a fetch fails, move on — do not block on one asset.

## Output

When done, write a JSON summary to `/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/figma/page/asset-fetch-summary.json`:

```json
{
  "fetched": ["userflow-logo.svg", "logo-loreal.svg", "highlight-lose-momentum.svg"],
  "skipped": ["hero-mock-welcome.svg — no node ID in spec"],
  "failed": ["logo-bcg.svg — MCP returned error"],
  "summary": "Fetched 12 of 18 listed assets. 4 skipped (no node ID), 2 failed."
}
```
