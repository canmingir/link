/* eslint-disable */
import { defineConfig } from "cypress";
import projectConfig from "./config";

export default defineConfig({
  chromeWebSecurity: false,
  e2e: {
    baseUrl: `http://localhost:5173${projectConfig.base}`,
  },
});
