import config from "./config";
/* eslint-disable */
import { defineConfig } from "cypress";

export default defineConfig({
  chromeWebSecurity: false,

  e2e: {
    baseUrl: `http://localhost:5432${config.baseUrl}`,
  },
});
