import QRCode from "qrcode";

const OVERLAY_ID = "clean-url-qr-overlay";

/** @type {(() => void) | null} */
let activeDismiss = null;

function sanitizeUrl(href) {
  let u;
  try {
    u = new URL(href);
  } catch {
    return null;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return null;
  u.search = "";
  u.hash = "";
  return u.toString();
}

function removeExisting() {
  if (activeDismiss) {
    window.removeEventListener("click", activeDismiss, true);
    activeDismiss = null;
  }
  const el = document.getElementById(OVERLAY_ID);
  if (el) el.remove();
}

/**
 * @param {string} cleanUrl
 */
function showOverlay(cleanUrl) {
  removeExisting();

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const short = Math.min(vw, vh);
  // ~2× original (0.25); 0.75 was too large on some setups and harder to scan.
  const SCALE = 0.5;
  const MAX_S = 560;
  let S = Math.floor(SCALE * short);
  const MIN = 256;
  if (S < MIN) S = Math.min(MIN, Math.floor(short));
  S = Math.min(S, MAX_S, Math.floor(short));

  const pad = Math.round(0.1 * S);
  const inner = S - 2 * pad;
  if (inner < 21) return;

  const container = document.createElement("div");
  container.id = OVERLAY_ID;
  container.setAttribute("role", "group");
  container.setAttribute(
    "aria-label",
    "QR code and cleaned URL without query or fragment"
  );
  Object.assign(container.style, {
    position: "fixed",
    left: "0",
    bottom: "0",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    maxWidth: "100vw",
    zIndex: "2147483647",
    boxSizing: "border-box",
    pointerEvents: "none",
  });

  const canvas = document.createElement("canvas");
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "QR code for cleaned page URL");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, S, S);

  const innerCanvas = document.createElement("canvas");

  const urlBar = document.createElement("div");
  urlBar.textContent = cleanUrl;
  Object.assign(urlBar.style, {
    backgroundColor: "#ffffff",
    color: "#000000",
    boxSizing: "border-box",
    padding: "10px 12px",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: "12px",
    lineHeight: "1.4",
    wordBreak: "break-all",
    overflowWrap: "anywhere",
    minWidth: `${S}px`,
    maxWidth: "100vw",
    width: "max-content",
    borderTop: "1px solid #cccccc",
  });

  QRCode.toCanvas(
    innerCanvas,
    cleanUrl,
    {
      width: inner,
      margin: 0,
      color: { dark: "#000000", light: "#ffffff" },
    },
    (err) => {
      if (err) {
        console.error("Clean URL QR:", err);
        removeExisting();
        return;
      }
      ctx.drawImage(innerCanvas, pad, pad);
    }
  );

  container.appendChild(canvas);
  container.appendChild(urlBar);
  document.documentElement.appendChild(container);

  function onDismiss() {
    removeExisting();
  }
  activeDismiss = onDismiss;
  window.addEventListener("click", onDismiss, true);
}

function main() {
  const clean = sanitizeUrl(window.location.href);
  if (!clean) return;
  showOverlay(clean);
}

main();
