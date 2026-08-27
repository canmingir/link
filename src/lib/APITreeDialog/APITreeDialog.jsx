import { Close, Fullscreen, FullscreenExit } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";

function APITreeDialog({
  title,
  minWidth = 600,
  children,
  action,
  open,
  handleClose,
  maximizedDimensions = { width: "65rem", height: "50rem" },
  minimizedDimensions = { width: "55rem", height: "40rem" },
}) {
  const [maximized, setMaximized] = useState(false);
  const currentDimensions = maximized
    ? maximizedDimensions
    : minimizedDimensions;

  return (
    <Dialog
      open={open}
      maxWidth={false}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          width: currentDimensions.width,
          height: currentDimensions.height,
          transition: "width 0.3s ease-in-out, height 0.3s ease-in-out",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        {title}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
        data-cy="close-dialog-button"
      >
        <Close />
      </IconButton>
      {maximized ? (
        <IconButton
          aria-label="collapse"
          onClick={() => setMaximized(false)}
          sx={{
            position: "absolute",
            right: 48,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <FullscreenExit />
        </IconButton>
      ) : (
        <IconButton
          aria-label="expand"
          onClick={() => setMaximized(true)}
          sx={{
            position: "absolute",
            right: 48,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Fullscreen />
        </IconButton>
      )}

      <DialogContent
        sx={{
          minWidth,
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        {children}
      </DialogContent>
      <DialogActions
        sx={{ backgroundColor: (theme) => theme.palette.background.default }}
      >
        {action}
      </DialogActions>
    </Dialog>
  );
}

export default APITreeDialog;
