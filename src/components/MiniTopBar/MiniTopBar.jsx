import React from "react";
import config from "../../config/config";
import styles from "./styles";

import { AppBar, Box, Slide, Toolbar } from "@mui/material";

function MiniTopBar() {
  const { icon } = config.get().template.login;
  return (
    <Slide in={true} direction="right" timeout={500}>
      <AppBar position="absolute" sx={styles.appBar} variant="dense">
        <Toolbar>
          <Box component="img" src={icon} sx={styles.logo} />
        </Toolbar>
      </AppBar>
    </Slide>
  );
}

export default MiniTopBar;
