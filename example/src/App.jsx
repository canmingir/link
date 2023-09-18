import { Platform } from "platform";
import React from "react";
import routes from "../routes";
import theme from "./theme";

function App() {
  return <Platform routes={routes} theme={theme} />;
}

export default App;
