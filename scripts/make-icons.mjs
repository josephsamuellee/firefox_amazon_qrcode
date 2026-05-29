import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(__dirname, "..", "icons");

function drawIcon(size) {
  const png = new PNG({ width: size, height: size, colorType: 6 });
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (size * y + x) << 2;
      const border = Math.floor(size * 0.08);
      const inner = size - 2 * border;
      const ix = x - border;
      const iy = y - border;
      let black = false;
      if (ix >= 0 && iy >= 0 && ix < inner && iy < inner) {
        const m = Math.floor(inner / 7);
        const qx = Math.floor(ix / m);
        const qy = Math.floor(iy / m);
        black = (qx + qy) % 2 === 0;
      }
      png.data[i] = black ? 0 : 255;
      png.data[i + 1] = black ? 0 : 255;
      png.data[i + 2] = black ? 0 : 255;
      png.data[i + 3] = 255;
    }
  }
  return PNG.sync.write(png);
}

fs.mkdirSync(iconsDir, { recursive: true });
fs.writeFileSync(path.join(iconsDir, "icon-48.png"), drawIcon(48));
fs.writeFileSync(path.join(iconsDir, "icon-96.png"), drawIcon(96));
console.log("Wrote icons/icon-48.png and icons/icon-96.png");
