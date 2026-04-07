import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Iconify from "../../components/Iconify";
import Logo from "../../components/logo";
import { NAV } from "../config-layout";
import { NavSectionVertical } from "../../components/nav-section";
import NavToggleButton from "../common/nav-toggle-button";
import Scrollbar from "../../components/scrollbar";
import SettingsDialog from "../../widgets/SettingsDialog";
import Stack from "@mui/material/Stack";
import config from "../../config/config";
import { useEffect } from "react";
import { usePathname } from "../../routes/hooks/use-pathname";
import { useResponsive } from "../../hooks/use-responsive";
import { useUser } from "../../hooks/use-user";

import React, { useState } from "react";

// ----------------------------------------------------------------------

export default function NavVertical({ openNav, onCloseNav }) {
  const { user } = useUser();

  const pathname = usePathname();

  const lgUp = useResponsive("up", "lg");

  const { sideMenu, actionButtons } = config().menu;

  const [openSettings, setOpenSettings] = useState(false);

  const handleCloseSettings = () => {
    setOpenSettings(false);
  };

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
        sx={{
          alignItems: "center",
          justifyItems: "center",
          gap: 2,
          marginBottom: lgUp ? 3 : 0,
          position: lgUp ? "static" : "fixed",
          bottom: lgUp ? "auto" : 66,
          width: "100%"
        }}>
        {actionButtons &&
          actionButtons.map((Action, index) => (
            <Box key={index} component={Action}></Box>
          ))}
        <Button
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
            }}
          />
        </Button>
      </Stack>
    </Scrollbar>
  );

  return (
    <Box
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
          slotProps={{
            paper: {
              sx: {
                width: NAV.W_VERTICAL,
              },
            }
          }}
        >
          {renderContent}
        </Drawer>
      )}
      <SettingsDialog open={openSettings} handleClose={handleCloseSettings} />
    </Box>
  );
}
