import React from "react";
import styles from "./styles";

import { Box, Typography } from "@mui/material";

function TitleBar({ bgColor, color, title }) {
  return (
    <Box
      className="handle"
      sx={{
        ...styles.titleBar,
        bgcolor: "primary.main" || `${bgColor}`,
        color: "background.default" || `${color}`,
      }}
    >
      <Typography variant="h6">{title}</Typography>
    </Box>
  );
}

export default TitleBar;
