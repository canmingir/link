import AppBar from "@mui/material/AppBar";
import { HEADER } from "../config-layout";
import HeaderShadow from "../common/header-shadow";
import { NavSectionHorizontal } from "../../components/nav-section";
import Scrollbar from "../../components/scrollbar";
import Toolbar from "@mui/material/Toolbar";
import { bgBlur } from "../../theme/css";
import { memo } from "react";
import { useConfig } from "../../context/ConfigContext";
import { useTheme } from "@mui/material/styles";
import { useUser } from "../../hooks/use-user";
// ----------------------------------------------------------------------

function NavHorizontal() {
  const theme = useTheme();

  const { user } = useUser();

  const { sideMenu } = useConfig();
  return (
    <AppBar
      component="div"
      sx={{
        top: HEADER.H_DESKTOP_OFFSET,
      }}
    >
      <Toolbar
        sx={{
          ...bgBlur({
            color: theme.palette.background.default,
          }),
        }}
      >
        <Scrollbar
          sx={{
            "& .simplebar-content": {
              display: "flex",
            },
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
        </Scrollbar>
      </Toolbar>

      <HeaderShadow />
    </AppBar>
  );
}

export default memo(NavHorizontal);
