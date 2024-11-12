import { Box, Typography } from "@mui/material";

import React from "react";

const TeamPermissionWidget = () => {
  return (
    <Box
      sx={{
        borderWidth: "0.1rem",
        borderColor: "black",
        borderStyle: " none solid none none",
        height: "100vh",
        backgroundColor: "background.paper",
        borderRadius: "20px",
      }}
    >
      <Typography sx={{ pt: 2, pl: 2 }} variant="h6">
        Team Permission
      </Typography>
    </Box>
  );
};

export default TeamPermissionWidget;
