import { ConfigSchema } from "../src/config/schemas.js";
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
    plugins: [splitVendorChunkPlugin(), react(), svgr()],
    base,
    optimizeDeps: {
      esbuildOptions: {
        jsx: "automatic",
      },
      include: ["@mui/material", "@nucleoidai/platform", "axios-auth-refresh"],
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
          chunkFileNames: `assets/[name].[hash].js`,
          assetFileNames: `assets/[name].[hash].[ext]`,
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          },
        },
      },
    },
  };
}

export { vite };
