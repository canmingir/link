import { ConfigSchema } from "../src/config/schemas";
import checker from "vite-plugin-checker";
import path from "path";
import { pathToFileURL } from "url";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

const configUrl = pathToFileURL(path.join(process.cwd(), "config.js")).href;
const { default: config } = await import(configUrl);

const { value, error } = ConfigSchema.validate(config);

if (error) {
  console.error(error.stack);
  process.exit(-1);
}

async function vite() {
  const base = value.base;
  const api = value.api;

  return {
    plugins: [
      react(),
      svgr(),
      checker({
        eslint: {
          lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
        },
        overlay: {
          position: "tl",
          initialIsOpen: false,
        },
      }),
    ],
    server: {
      port: 3000,
      proxy: {
        "/api": {
          target: api?.split("/api")?.[0],
          rewrite: (path: string) => path.replace(/^\/api/, ""),
          changeOrigin: true,
          timeout: 120_000,
        },
      },
    },
    base,
    optimizeDeps: {
      esbuildOptions: {
        jsx: "automatic",
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
          chunkFileNames: (chunkInfo: { name: string }) => {
            if (chunkInfo.name === "config") {
              return "config.js";
            }
            return `assets/[name].[hash].js`;
          },
          assetFileNames: `assets/[name].[hash].[ext]`,
          manualChunks(id: string) {
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
