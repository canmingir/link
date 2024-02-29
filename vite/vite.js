import { ConfigSchema } from "./ConfigSchema.js";
import config from "../../../config.js";
import path from "path";
import react from "@vitejs/plugin-react";
import { splitVendorChunkPlugin } from "vite";
import svgr from "vite-plugin-svgr";

async function vite() {
  return {
    base: config.base,
    plugins: [
      {
        name: "joi-error",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const { error } = ConfigSchema.validate(config);

            if (!config) {
              server.config.logger.error(`Config.js not found`);
              res.statusCode = 500;
              res.end(`Config.js not found`);
            } else if (error) {
              server.config.logger.error(
                `Config validation error: ${error.stack}`,
                { tag: "joi-error" }
              );
              res.statusCode = 500;
              res.end(`Config validation error: ${error.stack}`);
            } else {
              next();
            }
          });
        },
      },
      splitVendorChunkPlugin(),
      react(),
      svgr(),
    ],
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
          output:{
              manualChunks(id) {
                  if (id.includes('node_modules')) {
                      return id.toString().split('node_modules/')[1].split('/')[0].toString();
                  }
              }
          }
      }
  }
  };
}

export { vite };
