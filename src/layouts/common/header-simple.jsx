import AccountPopover from "../common/account-popover";
import AppBar from "@mui/material/AppBar";
import { HEADER } from "../config-layout";
import HeaderShadow from "./header-shadow";
import ItemBar from "../common/SelectBar";
import Logo from "../../components/logo";
import NavDesktop from "../MainLayout/nav/desktop";
import NotificationsPopover from "../common/notifications-popover";
import React from "react";
import SettingsButton from "./settings-button";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import { bgBlur } from "../../theme/css";
import configMenu from "../../../../../config.menu.js";
import { useOffSetTop } from "../../hooks/use-off-set-top";
import { useResponsive } from "../../hooks/use-responsive";
import { useTheme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function HeaderSimple({
  handleItemSelect,
  selectedItem,
  setSelectedItem,
}) {
  const theme = useTheme();
  const { topMenu } = configMenu;
  const mdUp = useResponsive("up", "md");
  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

  return (
    <AppBar data-cy="header">
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
        <Stack direction="row" alignItems="center" spacing={5}>
          <Logo />
          <ItemBar
            handleItemSelect={handleItemSelect}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          {mdUp && <NavDesktop data={topMenu} />}
          <NotificationsPopover />

          <SettingsButton />

          <AccountPopover />
        </Stack>
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
}
