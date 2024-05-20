import { Platform } from "platform-npm";
import ProjectContainer from "./widgets/ProjectContainer";
import React from "react";
import routes from "../routes";

function App() {
  return <Platform routes={routes} dialogs={ProjectContainer} />;
}

export default App;
