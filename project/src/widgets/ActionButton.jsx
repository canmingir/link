import { Alert, Avatar, Box, Snackbar } from "@mui/material";
import React, { useState } from "react";

import { Label } from "@nucleoidai/platform/minimal/components";

export default function ActionButton() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Box sx={{ position: "relative" }} onClick={handleClick}>
        <Avatar
          src={"https://cdn-icons-png.flaticon.com/512/12482/12482702.png"}
          sx={{
            display: "flex",
            alignSelf: "center",
            mx: "auto",
            width: { xs: 24, md: 45 },
            height: { xs: 24, md: 45 },
            border: `solid 2px ${(theme) => theme.palette.common.white}`,
          }}
        />
        <Label
          color="primary"
          variant="filled"
          sx={{
            m: 1,
            top: -18,
            px: 0.5,
            left: 30,
            height: 20,
            position: "absolute",
            borderBottomLeftRadius: 2,
          }}
        >
          Talk to Emperor
        </Label>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Emperor is busy right now
        </Alert>
      </Snackbar>
    </>
  );
}
