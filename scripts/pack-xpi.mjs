import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const outDir = path.join(root, "dist");
const outFile = path.join(outDir, `clean-url-qr-${pkg.version}.xpi`);

mkdirSync(outDir, { recursive: true });

const files = ["manifest.json", "background.js", "content/qr-overlay.js", "icons/icon-48.png", "icons/icon-96.png"];

execFileSync("zip", ["-q", "-r", outFile, ...files], { cwd: root, stdio: "inherit" });

console.log(`Wrote ${path.relative(root, outFile)}`);
