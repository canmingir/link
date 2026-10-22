import fs from "fs";
import path from "path";

const distDir = path.join(process.cwd(), "dist");

const specifierRe =
  /((?:import|export)(?:[^'"]*?from)?\s*['"])(\.[^'"]+|[^'".][^'"]*\/[^'"]+)(['"])/g;

function resolveRelativeSpecifier(fileDir, specifier) {
  const abs = path.join(fileDir, specifier);
  if (fs.existsSync(abs + ".js")) return specifier + ".js";
  if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) {
    return specifier.replace(/\/?$/, "/index.js");
  }
  return specifier + ".js";
}

function packageHasExportsMap(packageName) {
  const pkgJsonPath = path.join(
    process.cwd(),
    "node_modules",
    packageName,
    "package.json"
  );
  if (!fs.existsSync(pkgJsonPath)) return false;
  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
  return Boolean(pkg.exports);
}

function resolveBareDeepImportSpecifier(specifier) {
  const packageName = specifier.startsWith("@")
    ? specifier.split("/").slice(0, 2).join("/")
    : specifier.split("/")[0];
  if (packageHasExportsMap(packageName)) return specifier;
  const abs = path.join(process.cwd(), "node_modules", specifier);
  if (fs.existsSync(abs + ".js")) return specifier + ".js";
  return specifier;
}

const jsonImportRe =
  /((?:import|export)(?:[^'"]*?from)?\s*['"][^'"]+\.json)(['"])(?!\s*with)/g;

const nodeOnlyEntryDirs = ["vite", "cypress", "commands"];

function isNodeOnlyEntry(filePath) {
  const rel = path.relative(distDir, filePath);
  const topDir = rel.split(path.sep)[0];
  return nodeOnlyEntryDirs.includes(topDir);
}

function fixFile(filePath) {
  const dir = path.dirname(filePath);
  const original = fs.readFileSync(filePath, "utf8");
  let fixed = original.replace(
    specifierRe,
    (match, prefix, specifier, quote) => {
      if (/\.[a-zA-Z0-9]+$/.test(specifier)) return match;
      const resolved = specifier.startsWith(".")
        ? resolveRelativeSpecifier(dir, specifier)
        : resolveBareDeepImportSpecifier(specifier);
      return prefix + resolved + quote;
    }
  );
  if (isNodeOnlyEntry(filePath)) {
    fixed = fixed.replace(jsonImportRe, '$1$2 with { type: "json" }');
  }
  if (fixed !== original) fs.writeFileSync(filePath, fixed);
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.name.endsWith(".js") || entry.name.endsWith(".d.ts")) {
      fixFile(full);
    }
  }
}

walk(distDir);
