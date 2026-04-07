import AccountPopover from "../common/account-popover";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { HEADER } from "../config-layout";
import HeaderShadow from "../common/header-shadow";
import Logo from "../../components/logo";
import NavDesktop from "./nav/desktop";
import NavMobile from "./nav/mobile";
import NotificationsPopover from "../common/notifications-popover";
import ProjectBar from "../common/ProjectBar";
import React from "react";
import SettingsButton from "../common/settings-button";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import { bgBlur } from "../../theme/css";
import config from "../../config/config";
import { useOffSetTop } from "../../hooks/use-off-set-top";
import { useResponsive } from "../../hooks/use-responsive";
import { useTheme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function Header() {
  const { topMenu } = config().menu;
  const projectBar = config().template?.projectBar;
  const isLoginConfigured = config().project && config().template?.login;
  const theme = useTheme();

  const mdUp = useResponsive("up", "md");
  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

  return (
    <AppBar>
      <Toolbar
        disableGutters
        sx={{
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
        <Container sx={{ height: 1, display: "flex", alignItems: "center" }}>
          <Logo sx={{ marginRight: 10 }} />
          {projectBar && <ProjectBar />}
          <Box sx={{ flexGrow: 1 }} />

          {mdUp && <NavDesktop data={topMenu} />}

          <Stack
            direction={{ xs: "row", md: "row-reverse" }}
            sx={{
              alignItems: "center"
            }}
          >
            <NotificationsPopover />

            <SettingsButton />

            {isLoginConfigured && <AccountPopover />}

            {!mdUp && <NavMobile data={topMenu} />}
          </Stack>
        </Container>
      </Toolbar>
      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
}
