import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { publish, useEvent } from "@nucleoidjs/react-event";

import useEmperor from "../hooks/useEmperor";

function AddNewEmperor() {
  // TODO refactor this event (ADD_NEW_DIALOG_OPENED and ADD_NEW_DIALOG_CLOSED)
  const [addNewDialog] = useEvent("ADD_NEW_DIALOG_OPENED", { open: false });
  const { addEmperor } = useEmperor();
  const [emperor, setEmperor] = useState({
    id: "",
    name: "",
    born: "",
    icon: "",
    reign: "",
    portrait: "",
    description: "",
  });

  const handleClose = () => {
    publish("ADD_NEW_DIALOG_OPENED", { open: false });
  };

  const handleChange = (e) => {
    setEmperor({ ...emperor, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    emperor.id = 4;
    e.preventDefault();
    addEmperor(emperor);
    handleClose();
  };

  return (
    <div>
      <Dialog
        open={addNewDialog.open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add New Emperor</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the details of the new emperor.
          </DialogContentText>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Name"
              type="text"
              fullWidth
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="born"
              label="Born"
              type="text"
              fullWidth
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="icon"
              label="Icon"
              type="text"
              fullWidth
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="reign"
              label="Reign"
              type="text"
              fullWidth
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="portrait"
              label="Portrait URL"
              type="text"
              fullWidth
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              onChange={handleChange}
            />
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Add
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewEmperor;
