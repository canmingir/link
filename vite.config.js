import config from "./config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  base: config.base,
  plugins: [react(), svgr()],
});
