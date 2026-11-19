import type { Plugin as EsbuildPlugin } from "esbuild";
import type { Plugin } from "vite";
import fs from "fs";
import path from "path";

type LayersOptions = {
  layers: string[];
  root?: string;
};

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".json": "application/json",
  ".txt": "text/plain",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function split(id: string): [string, string] {
  const index = id.search(/[?#]/);
  return index === -1 ? [id, ""] : [id.slice(0, index), id.slice(index)];
}

function isFile(file: string) {
  return fs.existsSync(file) && fs.statSync(file).isFile();
}

function inside(dir: string, file: string) {
  const relative = path.relative(dir, file);
  return (
    !!relative &&
    !relative.startsWith("..") &&
    !path.isAbsolute(relative) &&
    !relative.split(path.sep).includes("node_modules")
  );
}

function locate(name: string, from: string[]): string {
  if (path.isAbsolute(name) || name.startsWith(".")) {
    return fs.realpathSync(path.resolve(from[0], name));
  }

  for (const start of from) {
    for (let dir = start; ; dir = path.dirname(dir)) {
      const candidate = path.join(dir, "node_modules", name);

      if (fs.existsSync(path.join(candidate, "package.json"))) {
        return fs.realpathSync(candidate);
      }

      if (path.dirname(dir) === dir) break;
    }
  }

  throw new Error(`Layer "${name}" is not installed under ${from[0]}`);
}

function copyMissing(from: string, to: string) {
  if (!fs.existsSync(from)) return;

  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(target, { recursive: true });
      copyMissing(source, target);
    } else if (!fs.existsSync(target)) {
      fs.copyFileSync(source, target);
    }
  }
}

function layers({ layers: names, root: rootOption }: LayersOptions): Plugin {
  const root = fs.realpathSync(rootOption ?? process.cwd());
  const stack = [root];

  for (const name of names) {
    stack.push(locate(name, stack));
  }

  const anchor = path.join(root, "index.html");
  let outDir = path.join(root, "dist");
  let prefix = "/";

  const owner = (file: string) => stack.find((dir) => inside(dir, file));

  const target = (source: string, importer: string) =>
    path.isAbsolute(source) && !fs.existsSync(source)
      ? path.join(root, source)
      : path.resolve(path.dirname(importer), source);

  const marker = Symbol("link:layers");

  const esbuild: EsbuildPlugin = {
    name: "link:layers",
    setup(build) {
      build.onResolve({ filter: /.*/ }, async (args) => {
        if (args.pluginData === marker || !args.importer) return undefined;

        const from = owner(args.importer);
        const bare = !args.path.startsWith(".") && !path.isAbsolute(args.path);

        if (bare) {
          if (!from || from === root) return undefined;

          const result = await build.resolve(args.path, {
            kind: args.kind,
            importer: anchor,
            resolveDir: root,
            pluginData: marker,
          });

          return result.errors.length ? undefined : result;
        }

        const wanted = path.resolve(args.resolveDir, args.path);
        const home = owner(wanted);
        if (!home) return undefined;

        const relative = path.relative(home, wanted);

        for (const dir of stack) {
          const result = await build.resolve(path.join(dir, relative), {
            kind: args.kind,
            importer: args.importer,
            resolveDir: dir,
            pluginData: marker,
          });

          if (
            !result.errors.length &&
            result.path !== args.importer &&
            owner(result.path) === dir
          ) {
            return result;
          }
        }

        return undefined;
      });
    },
  };

  return {
    name: "link:layers",
    enforce: "pre",

    config() {
      return {
        server: { fs: { allow: stack } },
        optimizeDeps: { esbuildOptions: { plugins: [esbuild] } },
      };
    },

    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
      prefix = config.base.endsWith("/") ? config.base : `${config.base}/`;
    },

    async resolveId(source, importer, options) {
      if (!importer || source.startsWith("\0") || source.startsWith("/@")) {
        return null;
      }

      const [file] = split(importer);
      const from = owner(file);
      const bare = !source.startsWith(".") && !path.isAbsolute(source);

      if (bare) {
        return from && from !== root
          ? this.resolve(source, anchor, { ...options, skipSelf: true })
          : null;
      }

      const [specifier, query] = split(source);
      const wanted = target(specifier, file);
      const home = owner(wanted);

      if (!home || (!from && home !== root)) return null;

      const relative = path.relative(home, wanted);

      for (const dir of stack) {
        const resolved = await this.resolve(
          path.join(dir, relative) + query,
          importer,
          { ...options, skipSelf: true }
        );

        if (!resolved || resolved.external) continue;

        const [id] = split(resolved.id);
        if (id !== file && owner(id) === dir) return resolved;
      }

      return null;
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const [url] = split(req.url ?? "/");
        const decoded = decodeURIComponent(url);
        const pathname = decoded.startsWith(prefix)
          ? `/${decoded.slice(prefix.length)}`
          : decoded;

        if (isFile(path.join(root, "public", pathname))) return next();

        for (const dir of stack.slice(1)) {
          const publicDir = path.join(dir, "public");
          const file = path.join(publicDir, pathname);

          if (file.startsWith(publicDir + path.sep) && isFile(file)) {
            res.setHeader(
              "Content-Type",
              MIME[path.extname(file).toLowerCase()] ??
                "application/octet-stream"
            );
            fs.createReadStream(file).pipe(res);
            return;
          }
        }

        next();
      });
    },

    writeBundle() {
      for (const dir of stack.slice(1)) {
        copyMissing(path.join(dir, "public"), outDir);
      }
    },
  };
}

export { layers };
export type { LayersOptions };
