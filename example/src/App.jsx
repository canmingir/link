import { Platform } from "platform-npm";
import React from "react";
import routes from "../routes";

function App() {
  return <Platform routes={routes} />;
}

export default App;
