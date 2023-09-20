import React from "react";
import styles from "./styles";
import { useConfig } from "../../context/ConfigContext";

import { AppBar, Box, Slide, Toolbar } from "@mui/material";

function MiniTopBar() {
  const globalConfig = useConfig();
  return (
    <Slide in={true} direction="right" timeout={500}>
      <AppBar position="absolute" sx={styles.appBar} variant="dense">
        <Toolbar>
          <Box component="img" src={globalConfig.login.icon} sx={styles.logo} />
        </Toolbar>
      </AppBar>
    </Slide>
  );
}

export default MiniTopBar;
