import config from "../../../../../config.ts";

function cypress() {
  return {
    chromeWebSecurity: false,
    e2e: {
      baseUrl: `http://localhost:5173${config.base}`,
    },
  };
}

export { cypress };
