import type { AppBarProps } from "@mui/material";
import type { ComponentType } from "react";
import config from "../../config/config";
import styles from "./styles";

import { AppBar, Box, Slide, Toolbar } from "@mui/material";

const DenseAppBar = AppBar as ComponentType<
  Omit<AppBarProps, "variant"> & { variant?: string }
>;

function MiniTopBar() {
  const icon = config().template.login?.icon;
  return (
    <Slide in={true} direction="right" timeout={500}>
      <DenseAppBar
        position="absolute"
        sx={styles.appBar}
        variant="dense"
        data-testid="mini-topbar"
      >
        <Toolbar>
          <Box component="img" src={icon} sx={styles.logo} />
        </Toolbar>
      </DenseAppBar>
    </Slide>
  );
}

export default MiniTopBar;
