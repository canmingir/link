import { Platform } from "platform";
import React from "react";
import config from "../config";
import routes from "../routes";
import theme from "./theme";

function App() {
  return <Platform routes={routes} theme={theme} config={config} />;
}

export default App;
