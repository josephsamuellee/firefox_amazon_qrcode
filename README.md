# Clean URL QR (Firefox)

Firefox extension that shows an **offline** black-and-white QR code for the **current tab URL** with the **query string** (`?…`) and **fragment** (`#…`) removed, so shared links drop tracking and session-like URL junk (for example long Amazon URLs become the origin + path only).

## Behavior

- Click the toolbar button on a normal **http** or **https** page to show a QR in the **bottom-left**.
- The square uses **25% of the shorter viewport side** (minimum 128px) with **~10% white padding** on each edge around the code.
- **Click anywhere** on the page (capture phase) to dismiss; clicking through the overlay works because the overlay uses `pointer-events: none`.
- QR encoding uses the bundled [`qrcode`](https://www.npmjs.com/package/qrcode) library — **no network** for QR generation.

## Build (from source)

Icons and the injected script are generated from npm:

```bash
npm install
npm run prepare-addon
```

This writes `icons/icon-48.png`, `icons/icon-96.png`, and `content/qr-overlay.js`.

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
