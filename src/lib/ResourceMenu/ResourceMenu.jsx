import AlertMassage from "./AlertMassage";
import DeleteResourceDialog from "./DeleteResourceDialog";
import React from "react";
import styles from "./styles";
import { useRef } from "react";

import { Delete, Http, Source } from "@mui/icons-material";
import { Divider, Fade, Menu, MenuItem, Typography } from "@mui/material";
import { publish, useEvent } from "@nucleoidai/react-event";

const ResourceMenu = (props) => {
  const { anchor, openMenu, handleClose, hash, map } = props;

  const [methodDisabled, setMethodDisabled] = React.useState();
  const [alertMessage, setAlertMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const resourceRef = useRef();

  const [api] = useEvent("API_DATA_CHANGED", []);
  const [selectedAPI] = useEvent("SELECTED_API_CHANGED", {
    path: "/",
    method: "GET",
  });

  React.useEffect(() => {
    const checkMethodAddable = () => {
      const countMethodsForPath = (path) => {
        return api.filter((endpoint) => endpoint.path === path).length;
      };

      if (hash) {
        const path = map ? map[hash].path : null;
        return countMethodsForPath(path) > 3;
      }

      if (selectedAPI) {
        const apiSelectedPath = selectedAPI.path;
        return countMethodsForPath(apiSelectedPath) > 4;
      }
      return false;
    };

    setMethodDisabled(checkMethodAddable());
  }, [api, hash, map, selectedAPI]);

  const addMethod = () => {
    selectPath();
    publish("API_DIALOG_OPEN", { type: "method", action: "add" });
    handleClose();
  };

  const addResource = () => {
    selectPath();
    publish("API_DIALOG_OPEN", { type: "resource", action: "add" });
    handleClose();
  };

  const deleteResource = () => {
    const path = selectedAPI?.path;
    if (!path) return;

    publish("API_RESOURCE_DELETE", { path });
    handleClose();
    setOpen(false);
  };

  const handleResourceDeleteDialog = () => {
    selectPath();

    if (selectedAPI?.path === "/") {
      setAlertMessage("Root path cannot be deleted");
      handleClose();
    } else {
      const selectedPath = selectedAPI?.path;
      const deleteList = api
        .filter(
          (item) =>
            item.path.startsWith(selectedPath) && item.path !== selectedPath
        )
        .map((item) => item.path)
        .filter((path, index, self) => self.indexOf(path) === index);

      resourceRef.current = {
        deleteAdress: selectedPath,
        deleteList: deleteList,
      };
      handleClose();
      setOpen(true);
    }
  };

  const selectPath = () => {
    const item = map ? map[hash] : null;

    if (item) {
      publish("SELECTED_API_CHANGED", { path: item.path, method: null });
    } else if (selectedAPI) {
      publish("SELECTED_API_CHANGED", {
        path: selectedAPI.path,
        method: null,
      });
    }
  };

  return (
    <>
      {open && (
        <DeleteResourceDialog
          open={open}
          setOpen={setOpen}
          deleteResource={deleteResource}
          ref={resourceRef}
        />
      )}
      {alertMessage && <AlertMassage message={alertMessage} />}
      <Menu
        open={openMenu}
        onClose={handleClose}
        onContextMenu={(event) => event.preventDefault()}
        anchorReference="anchorPosition"
        anchorPosition={{
          top: anchor?.clientY || 0,
          left: anchor?.clientX || 0,
        }}
        slots={{
          transition: Fade
        }}
      >
        <MenuItem onClick={addResource} data-cy="add-resource">
          <Source />
          <Typography sx={styles.menuItemText}>Resource</Typography>
        </MenuItem>
        <MenuItem
          onClick={addMethod}
          disabled={methodDisabled}
          data-cy="add-method"
        >
          <Http />
          <Typography sx={styles.menuItemText}>Method</Typography>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleResourceDeleteDialog}
          disabled={selectedAPI?.path === "/"}
          data-cy="delete-resource"
        >
          <Delete />
          <Typography sx={styles.menuItemText}>Delete</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ResourceMenu;
