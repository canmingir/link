import AddNewEmperor from "./AddNewEmperor";
// TODO: Add default laoding to platform
//import Loading from "../pages/Loading";
import React from "react";
import { useEffect } from "react";
import useEmperor from "../hooks/useEmperor";
import { useEvent } from "@nucleoidjs/react-event";

//TODO: decide name (Container or SelectBar) ?
function ProjectContainer() {
  const [event] = useEvent("ITEM_SELECTED", { itemId: "" });
  const { getEmperorById } = useEmperor();

  const { emperor } = getEmperorById(event.itemId);
  useEffect(() => {
    //TODO If we move <BrowserRouter> to main.jsx we can use navigate() here
    if (emperor.id === event.itemId) {
      window.location.assign(`${window.location.origin}/`);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emperor]);

  return <AddNewEmperor />;
}

export default ProjectContainer;
