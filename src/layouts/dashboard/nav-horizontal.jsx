import AppBar from "@mui/material/AppBar";
import { HEADER } from "../config-layout";
import HeaderShadow from "../common/header-shadow";
import { NavSectionHorizontal } from "../../components/nav-section";
import Scrollbar from "../../components/scrollbar";
import Toolbar from "@mui/material/Toolbar";
import { bgBlur } from "../../theme/css";
import { memo } from "react";
import { useMockedUser } from "../../hooks/use-mocked-user";
import { useNavData } from "./config-navigation";
import { useTheme } from "@mui/material/styles";

// ----------------------------------------------------------------------

function NavHorizontal() {
  const theme = useTheme();

  const { user } = useMockedUser();

  const navData = useNavData();

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
            data={navData}
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
