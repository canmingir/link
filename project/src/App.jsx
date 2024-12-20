import { Platform } from "@nucleoidai/platform";
import ProjectContainer from "./widgets/ProjectContainer";
import React from "react";
import routes from "../routes";

function App() {
  return <Platform routes={routes} />;
}

export default App;
