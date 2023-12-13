import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

function vite(config) {
  return {
    base: config.base,
    plugins: [react(), svgr()],
    optimizeDeps: {
      include: ["@mui/material"],
    },
  };
}

export { vite };
