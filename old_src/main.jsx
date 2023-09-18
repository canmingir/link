import "./index.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import React from "react";
import ReactDOM from "react-dom/client";
import config from "../config";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <BrowserRouter basename={config.base}>
      <App />
    </BrowserRouter>
  </HelmetProvider>
);
