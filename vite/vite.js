import { ConfigSchema } from "../src/config/schemas.js";
import { NGROK_HOST_SUFFIXES } from "../tunnel/hosts.js";
import autoLogin from "./autologin.js";
import checker from "vite-plugin-checker";
import path from "path";
import react from "@vitejs/plugin-react";
import { splitVendorChunkPlugin } from "vite";
import svgr from "vite-plugin-svgr";
import tunnelConfig, { tunnelConfigEsbuild } from "./tunnel-config.js";
import { fileURLToPath, pathToFileURL } from "url";

// Resolved against the consumer's cwd (not a relative import) so this keeps
// working whether @canmingir/link is a real copy or a symlinked/linked package.
const configUrl = pathToFileURL(
  path.join(process.cwd(), "config.js")
).href;
const { default: config } = await import(configUrl);

const { value, error } = ConfigSchema.validate(config);

if (error) {
  console.error(error.stack);
  process.exit(-1);
}

const tunnelUrl = process.env.LINK_TUNNEL_URL;
const configPath = fileURLToPath(configUrl);

function tunnelPlugins() {
  const url = tunnelUrl;

  if (!url) return [];

  const plugins = [tunnelConfig({ config, url, configPath })];

  const projectId = process.env.LINK_TUNNEL_AUTOLOGIN_PROJECT_ID;

  if (!projectId) return plugins;

  let storage = {};
  try {
    storage = JSON.parse(process.env.LINK_TUNNEL_AUTOLOGIN_STORAGE || "{}");
  } catch {
    storage = {};
  }

  return [
    ...plugins,
    autoLogin({
      appId: value.appId,
      projectId,
      identityProvider: value.credentials?.provider ?? "DEMO",
      requestUrl: value.credentials?.requestUrl ?? "/api/oauth",
      storage,
    }),
  ];
}

async function vite() {
  const base = value.base;
  const api = value.api;

  return {
    plugins: [
      splitVendorChunkPlugin(),
      react(),
      svgr(),
      ...tunnelPlugins(),
      checker({
        eslint: {
          lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        },
        overlay: {
          position: "tl",
          initialIsOpen: false,
        },
      }),
    ],
    server: {
      port: 3000,
      allowedHosts: NGROK_HOST_SUFFIXES,
      proxy: {
        "/api": {
          target: api?.split("/api")?.[0],
          rewrite: (path) => path.replace(/^\/api/, ""),
          changeOrigin: true,
          timeout: 120_000,
        },
      },
    },
    base,
    optimizeDeps: {
      force: Boolean(tunnelUrl),
      esbuildOptions: {
        jsx: "automatic",
        plugins: tunnelUrl
          ? [tunnelConfigEsbuild({ config, url: tunnelUrl, configPath })]
          : [],
      },
      include: [
        "@mui/material",
        "@nucleoidai/platform",
        "@emotion/react",
        "@emotion/styled",
        "@emotion/css",
      ],
    },
    resolve: {
      alias: [
        {
          find: /^~(.+)/,
          replacement: path.join(process.cwd(), "node_modules/$1"),
        },
        {
          find: /^src(.+)/,
          replacement: path.join(
            process.cwd(),
            "/node_modules/@nucleoidai/platform/minimal/src/$1"
          ),
        },
      ],
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].[hash].js`,
          chunkFileNames: (chunkInfo) => {
            if (chunkInfo.name === "config") {
              return "config.js";
            }
            return `assets/[name].[hash].js`;
          },
          assetFileNames: `assets/[name].[hash].[ext]`,
          manualChunks(id) {
            if (id.includes("config.js") && !id.includes("node_modules")) {
              return "config";
            }
          },
        },
      },
    },
  };
}

export { vite };
