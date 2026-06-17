import { HEADER, NAV } from "../config-layout";

import AccountPopover from "../common/account-popover";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Iconify from "../../components/Iconify";
import Logo from "../../components/logo";
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
import { useSettingsContext } from "../../components/settings";
import { useTheme } from "@mui/material/styles";

export default function Header({ onOpenNav }) {
  const theme = useTheme();
  const settings = useSettingsContext();

  const projectBar = config().template?.projectBar;
  const TopBar = config().menu?.topBar;

  const isNavHorizontal = settings.themeLayout === "horizontal";

  const isNavMini = settings.themeLayout === "mini";

  const lgUp = useResponsive("up", "lg");

  const offset = useOffSetTop(HEADER.H_DESKTOP);

  const offsetTop = offset && !isNavHorizontal;

  const renderContent = (
    <>
      {lgUp && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />}

      {!lgUp && (
        <IconButton data-cy="open-nav-button" onClick={onOpenNav}>
          <Iconify icon="mingcute:menu-fill" sx={{ width: 28, height: 28 }} />
        </IconButton>
      )}
      {projectBar && <ProjectBar />}
      {TopBar && <TopBar />}

      <Stack
        direction="row"
        spacing={{ xs: 0.5, sm: 1 }}
        sx={{
          ...(!TopBar && { flexGrow: 1 }),
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <NotificationsPopover />

        <SettingsButton />

        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      data-cy="dashboard-layout-header"
      sx={{
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(["height"], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.W_VERTICAL + 1}px)`,
          height: HEADER.H_DESKTOP,
          ...(offsetTop && {
            height: HEADER.H_DESKTOP_OFFSET,
          }),
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: "background.default",
            height: HEADER.H_DESKTOP_OFFSET,
            borderBottom: `dashed 1px ${theme.palette.divider}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI + 1}px)`,
          }),
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}
