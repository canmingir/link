import config from "./config/config";
import oauth from "./http/oauth";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import routes from "../../../routes";

const Platform = {
  init: function () {
    config.init();

    oauth.defaults.baseURL = config.get().api;
    ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <App routes={routes} />
      </React.StrictMode>
    );
  },
};

export default Platform;
