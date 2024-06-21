import AppBar from "@mui/material/AppBar";
import HeaderShadow from "../common/header-shadow";
import { NavSectionHorizontal } from "../../components/nav-section";
import React from "react";
import Toolbar from "@mui/material/Toolbar";
import { bgBlur } from "../../theme/css";
import config from "../../config/config";
import { memo } from "react";
import { useTheme } from "@mui/material/styles";
import { useUser } from "../../hooks/use-user";

// ----------------------------------------------------------------------

function NavHorizontal() {
  const theme = useTheme();

  const { user } = useUser();

  const { sideMenu } = config().menu;
  return (
    <AppBar component="div" data-cy="nav-horizontal">
      <Toolbar
        sx={{
          ...bgBlur({
            color: theme.palette.background.default,
          }),
        }}
      >
        <NavSectionHorizontal
          data={sideMenu}
          slotProps={{
            currentRole: user?.role,
          }}
          sx={{
            ...theme.mixins.toolbar,
          }}
        />
      </Toolbar>

      <HeaderShadow />
    </AppBar>
  );
}

export default memo(NavHorizontal);
