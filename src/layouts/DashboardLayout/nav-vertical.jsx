import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Iconify from "../../components/Iconify";
import Logo from "../../components/logo";
import { NAV } from "../config-layout";
import { NavSectionVertical } from "../../components/nav-section";
import NavToggleButton from "../common/nav-toggle-button";
import React from "react";
import Scrollbar from "../../components/scrollbar";
import SettingsDialog from "../../widgets/SettingsDialog";
import Stack from "@mui/material/Stack";
import config from "../../config/config";
import { useEvent } from "@nucleoidai/react-event";
import { usePathname } from "../../routes/hooks/use-pathname";
import { useResponsive } from "../../hooks/use-responsive";
import { useUser } from "../../hooks/use-user";

import { useEffect, useState } from "react";

// ----------------------------------------------------------------------

export default function NavVertical({ openNav, onCloseNav }) {
  const { user } = useUser();
  const pathname = usePathname();
  const [openSettings, setOpenSettings] = useState(false);
  const [hideSubheader] = useEvent("PAGE_CHANGED", { subheader: "" });
  const { sideMenu, actionButtons } = config().menu;
  const lgUp = useResponsive("up", "lg");

  useEffect(() => {
    const index = sideMenu.findIndex(
      (item) => item.subheader === hideSubheader.subheader
    );

    if (index !== -1) {
      sideMenu.splice(index, 1);
    }
  }, [hideSubheader]);

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleCloseSettings = () => {
    setOpenSettings(false);
  };

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Logo sx={{ mt: 3, ml: 4, mb: 1 }} />
      <NavSectionVertical
        data={sideMenu}
        slotProps={{
          currentRole: user?.role,
        }}
      />
      <Box sx={{ flexGrow: 1 }} />
      <Stack
        direction={"column"}
        alignItems={"center"}
        justifyItems={"center"}
        sx={{
          marginBottom: lgUp ? 3 : 0,
          position: lgUp ? "static" : "fixed",
          bottom: lgUp ? "auto" : 66,
          width: "100%",
        }}
        gap={2}
      >
        {actionButtons &&
          actionButtons?.map((Action, index) => (
            <Box key={index} component={Action}></Box>
          ))}
      </Stack>

      <Button
        data-cy="end-item"
        fullWidth={true}
        onClick={() => setOpenSettings(true)}
        sx={{
          position: lgUp ? "static" : "fixed",
          bottom: lgUp ? "auto" : 16,
          width: "100%",
        }}
      >
        <Iconify
          icon={"ic:baseline-settings"}
          sx={{
            width: 32,
            height: 32,
            color: "text.secondary",
            mx: "auto",
          }}
        />
      </Button>
      <SettingsDialog open={openSettings} handleClose={handleCloseSettings} />
    </Scrollbar>
  );
  return (
    <Box
      data-cy="nav-vertical"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
      }}
    >
      <NavToggleButton />

      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            position: "fixed",
            width: NAV.W_VERTICAL,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.W_VERTICAL,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
