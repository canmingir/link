import AppBar from "@mui/material/AppBar";
import { HEADER } from "../config-layout";
import HeaderShadow from "./header-shadow";
import Link from "@mui/material/Link";
import Logo from "src/components/logo";
import SettingsButton from "./settings-button";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import { bgBlur } from "src/theme/css";
import { useOffSetTop } from "src/hooks/use-off-set-top";
import { useTheme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function HeaderSimple() {
  const theme = useTheme();

  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

  return (
    <AppBar>
      <Toolbar
        sx={{
          justifyContent: "space-between",
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
          transition: theme.transitions.create(["height"], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(offsetTop && {
            ...bgBlur({
              color: theme.palette.background.default,
            }),
            height: {
              md: HEADER.H_DESKTOP_OFFSET,
            },
          }),
        }}
      >
        <Logo />

        <Stack direction="row" alignItems="center" spacing={1}>
          <SettingsButton />

          <Link color="inherit" sx={{ typography: "subtitle2" }}>
            Need help?
          </Link>
        </Stack>
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
}
