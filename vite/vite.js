import { ConfigSchema } from "../src/config/ConfigSchema.js";
import config from "../../../config.js";
import path from "path";
import react from "@vitejs/plugin-react";
import { splitVendorChunkPlugin } from "vite";
import svgr from "vite-plugin-svgr";
async function vite() {
  let base;
  return {
    plugins: [
      {
        name: "joi-error",
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const { value, error } = ConfigSchema.validate(config);

            if (error) {
              res.statusCode = 500;
              res.end(error.stack);
            } else {
              base = value.base;
              next();
            }
          });
        },
      },
      splitVendorChunkPlugin(),
      react(),
      svgr(),
    ],
    base,
    optimizeDeps: {
      esbuildOptions: {
        jsx: "automatic",
      },
      include: ["@mui/material"],
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
            "/node_modules/platform-npm/minimal/src/$1"
          ),
        },
      ],
    },
    build: {
      rollupOptions: {
        output: {
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
