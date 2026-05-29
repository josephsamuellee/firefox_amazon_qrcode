# Clean URL QR (Firefox)

Firefox extension that shows an **offline** black-and-white QR code for the **current tab URL** with tracking-heavy parts removed so the QR stays small and shareable.

## Behavior

- **Most sites:** `?…` and `#…` are stripped (everything before `?` is kept).
- **Amazon retail only:** product links that include a `/dp/ASIN` (or `/gp/product/ASIN`, `/gp/aw/d/ASIN`) are shortened to **`https://<host>/dp/<ASIN>`**, dropping slug segments, session path tails, and query (e.g. long `…/dp/B0…/136-…?pd_rd…` → `https://www.amazon.com/dp/B0…`). Other Amazon pages (search, home, etc.) only get `?` / `#` stripped like other sites.
- Click the toolbar button on a normal **http** or **https** page to show a QR in the **bottom-left**.
- The QR square uses **50% of the shorter viewport side**, capped at **560px** and with a **256px** minimum on very small windows, with **~10% white padding** on each edge around the modules.
- The **sanitized URL** appears in **black on an opaque white strip** directly **under** the QR (same block, bottom-left), so you can confirm the exact string encoded in the code.
- **Click anywhere** on the page (capture phase) to dismiss; clicking through the overlay works because the overlay uses `pointer-events: none`.
- QR encoding uses the bundled [`qrcode`](https://www.npmjs.com/package/qrcode) library — **no network** for QR generation.

## Build (from source)

Icons and the injected script are generated from npm:

```bash
npm install
npm run prepare-addon
```

This writes `icons/icon-48.png`, `icons/icon-96.png`, and `content/qr-overlay.js`.

## Package as `.xpi`

Rebuilds the content bundle and zips only the runtime files (manifest, background, `content/`, `icons/`):

```bash
npm run xpi
```

Output: **`dist/clean-url-qr-<version>.xpi`** (e.g. `dist/clean-url-qr-1.0.0.xpi`). Install via **about:addons** → gear → **Install Add-on From File…**, or sign through [addons.mozilla.org](https://addons.mozilla.org/developers/) for distribution.

## Load in Firefox (temporary)

1. Open `about:debugging#/runtime/this-firefox`.
2. **Load Temporary Add-on…** and choose this folder’s `manifest.json`.
3. Pin the extension if you want quick access to the toolbar action.

## Files

| Path | Purpose |
|------|--------|
| `manifest.json` | MV3 manifest, Gecko extension id |
| `background.js` | `browser.action.onClicked` → `scripting.executeScript` |
| `content/qr-overlay.js` | Built bundle (run `npm run build`) |
| `src/qr-overlay-entry.js` | Source for the content script |

## Limitations

Injection fails on restricted pages (e.g. `about:`, `addons.mozilla.org`, other privileged URLs). Non-http(s) tabs are ignored.
