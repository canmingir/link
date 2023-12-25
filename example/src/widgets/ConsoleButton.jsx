import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";

import AdjustIcon from "@mui/icons-material/Adjust";
import React from "react";

export default function ConsoleButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <AdjustIcon />
      </IconButton>
      <Dialog open={open}>
        <DialogTitle>Test</DialogTitle>
        <DialogContent>Worked !</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
