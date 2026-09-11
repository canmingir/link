import React from "react";

import { Alert, Snackbar } from "@mui/material";
import type { ReactNode, SyntheticEvent } from "react";

export default function AlertMassage({ message }: { message: ReactNode }) {
  const [open, setOpen] = React.useState(true);

  function handleClose(_event?: Event | SyntheticEvent, reason?: string) {
    if (reason === "clickaway") return;
    setOpen(false);
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity="info">
        {message}
      </Alert>
    </Snackbar>
  );
}
