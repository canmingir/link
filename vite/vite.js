import globalConfig from "../src/config.js";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

async function vite() {
  const config = globalConfig();

  return {
    base: config.base,
    plugins: [react(), svgr()],
    optimizeDeps: {
      include: ["@mui/material"],
    },
  };
}

export { vite };
