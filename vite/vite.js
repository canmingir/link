import { ConfigSchema } from "../src/config/schemas.js";
import checker from "vite-plugin-checker";
import config from "../../../../config.js";
import path from "path";
import react from "@vitejs/plugin-react";
import { splitVendorChunkPlugin } from "vite";
import svgr from "vite-plugin-svgr";

const { value, error } = ConfigSchema.validate(config);

if (error) {
  console.error(error.stack);
  process.exit(-1);
}

async function vite() {
  const base = value.base;

  return {
    plugins: [
      splitVendorChunkPlugin(),
      react(),
      svgr(),
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
    base,
    optimizeDeps: {
      esbuildOptions: {
        jsx: "automatic",
      },
      include: [
        "@mui/material",
        "@nucleoidai/platform",
        "axios-auth-refresh",
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

            if (id.includes("node_modules")) {
              const packageName = id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();

              if (packageName === "@emotion") return "@mui";

              return packageName;
            }
          },
        },
      },
    },
  };
}

export { vite };
