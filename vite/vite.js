import globalConfig from "../src/config.js";
import path from "path";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

function vite() {
  const config = globalConfig();

  return {
    base: config.base,
    plugins: [react(), svgr()],
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
            "/node_modules/platform-npm/template/src/$1"
          ),
        },
      ],
    },
  };
}

export { vite };
