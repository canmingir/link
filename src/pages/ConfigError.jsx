import Iconify from "../components/Iconfiy";
import React from "react";
import { useLocation } from "react-router-dom";

import {
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

const ConfigErrorDialog = () => {
  const location = useLocation();

  const { error, file } = location.state || { error: "", file: "" };

  return (
    <Dialog fullWidth open>
      <DialogTitle>
        <Stack direction="row" alignItems="center">
          <Box
            component="span"
            sx={{ display: "flex", alignItems: "center", mr: 1 }}
          >
            <Iconify
              sx={{ color: (theme) => theme.palette.error.main }}
              width={24}
              icon="icon-park-twotone:error"
            />
          </Box>
          Config Validation Error
        </Stack>
      </DialogTitle>
      <DialogContent
        sx={{ padding: "10px", display: "flex", justifyContent: "center" }}
      >
        <DialogContentText>
          <Typography variant="body1">{error}</Typography>
          <Typography variant="body2">{`- ${file}`}</Typography>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigErrorDialog;
