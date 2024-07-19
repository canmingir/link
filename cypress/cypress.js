import config from "../../../../config.js";

function cypress() {
  return {
    chromeWebSecurity: false,
    e2e: {
      baseUrl: `http://localhost:5173${config.base}`,
    },
  };
}

export { cypress };
