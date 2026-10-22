import fs from "fs";
import path from "path";

const root = process.cwd();
const distDir = path.join(root, "dist");
const sourceDirs = ["src", "vite", "cypress", "commands"];
const assetExtensions = [
  ".css",
  ".svg",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".mp3",
  ".wav",
];

function copyAssets(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      copyAssets(full);
    } else if (assetExtensions.includes(path.extname(entry.name))) {
      const rel = path.relative(root, full);
      const dest = path.join(distDir, rel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(full, dest);
    }
  }
}

for (const dir of sourceDirs) {
  const full = path.join(root, dir);
  if (fs.existsSync(full)) copyAssets(full);
}
