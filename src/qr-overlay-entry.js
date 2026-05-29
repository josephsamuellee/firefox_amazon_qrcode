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
  let S = Math.floor(0.25 * Math.min(vw, vh));
  const MIN = 128;
  if (S < MIN) S = Math.min(MIN, Math.floor(Math.min(vw, vh)));

  const pad = Math.round(0.1 * S);
  const inner = S - 2 * pad;
  if (inner < 21) return;

  const container = document.createElement("div");
  container.id = OVERLAY_ID;
  container.setAttribute("role", "img");
  container.setAttribute("aria-label", "QR code for page URL without query or fragment");
  Object.assign(container.style, {
    position: "fixed",
    left: "0",
    bottom: "0",
    width: `${S}px`,
    height: `${S}px`,
    zIndex: "2147483647",
    boxSizing: "border-box",
    pointerEvents: "none",
  });

  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, S, S);

  const innerCanvas = document.createElement("canvas");

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
